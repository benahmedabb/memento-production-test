import {
  ACESFilmicToneMapping, BufferGeometry, CanvasTexture, CircleGeometry,
  CylinderGeometry, DataTexture, DirectionalLight, Group, HemisphereLight, InstancedMesh,
  LinearFilter, LinearMipmapLinearFilter, Material,
  Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial,
  Object3D, PerspectiveCamera, PlaneGeometry, PMREMGenerator, Raycaster, RepeatWrapping,
  RingGeometry, Scene, Shape, ShapeGeometry, SphereGeometry, SRGBColorSpace,
  Texture, TextureLoader, TorusGeometry, Vector2, WebGLRenderer, WebGLRenderTarget,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface CameraScene {
  resize(): void;
  point(x: number, y: number): void;
  shoot(x: number, y: number): void;
  clearFocus(): void;
  reset(): void;
  setActive(active: boolean): void;
  dispose(): void;
}

/** Loaded only after the desktop hero becomes visible. Uses local brand assets. */
export function createCameraScene(canvas: HTMLCanvasElement): CameraScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new Scene();
  const view = new PerspectiveCamera(36, 1, 0.1, 60);
  const model = new Group();
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  const instances = new Set<InstancedMesh>();
  let environment: WebGLRenderTarget | undefined;
  let frame = 0;
  let active = false;
  let disposed = false;
  let previousTime = 0;
  let bufferWidth = 0;
  let bufferHeight = 0;
  let targetX = 0.14;
  let targetY = -0.35;

  function material<T extends Material>(value: T): T {
    materials.add(value);
    return value;
  }
  function mesh(geometry: BufferGeometry, surface: Material, x = 0, y = 0, z = 0, parent: Object3D = model) {
    geometries.add(geometry);
    const object = new Mesh(geometry, surface);
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  }
  const box = (w: number, h: number, d: number, surface: Material, x: number, y: number, z: number, radius = 0.08) =>
    mesh(new RoundedBoxGeometry(w, h, d, 3, radius), surface, x, y, z);
  const barrel = (radius: number, length: number, z: number, surface: Material, open = false) => {
    const part = mesh(new CylinderGeometry(radius, radius, length, 64, 1, open), surface, -0.18, 0, z);
    part.rotation.x = Math.PI / 2;
    return part;
  };
  const ring = (radius: number, thickness: number, z: number, surface: Material) =>
    mesh(new TorusGeometry(radius, thickness, 8, 64), surface, -0.18, 0, z);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    instances.forEach((object) => object.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((surface) => surface.dispose());
    textures.forEach((texture) => texture.dispose());
    environment?.dispose();
    scene.clear();
    renderer.dispose();
  }

  try {
    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    try {
      environment = pmrem.fromScene(room, 0.04);
      scene.environment = environment.texture;
      scene.environmentIntensity = 0.7;
    } finally {
      room.dispose();
      pmrem.dispose();
    }

    // Small, deterministic surface maps: no texture downloads or per-frame generation.
    const grain = new Uint8Array(128 * 128 * 4);
    let seed = 41;
    for (let i = 0; i < grain.length; i += 4) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const value = 100 + (seed >>> 25);
      grain[i] = grain[i + 1] = grain[i + 2] = value;
      grain[i + 3] = 255;
    }
    const grainMap = new DataTexture(grain, 128, 128);
    grainMap.wrapS = grainMap.wrapT = RepeatWrapping;
    grainMap.repeat.set(5, 5);
    grainMap.magFilter = LinearFilter;
    grainMap.minFilter = LinearMipmapLinearFilter;
    grainMap.generateMipmaps = true;
    grainMap.needsUpdate = true;
    textures.add(grainMap);
    const green = material(new MeshStandardMaterial({ color: 0x23362c, metalness: 0.28, roughness: 0.48, bumpMap: grainMap, bumpScale: 0.007 }));
    const rubber = material(new MeshStandardMaterial({ color: 0x151916, metalness: 0, roughness: 0.88, bumpMap: grainMap, bumpScale: 0.035 }));
    const black = material(new MeshStandardMaterial({ color: 0x111615, metalness: 0.65, roughness: 0.38 }));
    const steel = material(new MeshStandardMaterial({ color: 0x68706b, metalness: 0.9, roughness: 0.32 }));
    const gold = material(new MeshStandardMaterial({ color: 0xb59b65, metalness: 0.9, roughness: 0.36 }));
    const glass = material(new MeshPhysicalMaterial({ color: 0x638b87, metalness: 0.08, roughness: 0.07, clearcoat: 1, clearcoatRoughness: 0.04, iridescence: 0.18, transparent: true, opacity: 0.22, depthWrite: false }));

    // Body, tactile grip, top plate and viewfinder.
    box(3.1, 1.85, 0.95, green, 0, 0, 0, 0.16);
    box(0.66, 1.88, 1.19, rubber, 1.22, -0.01, 0.2, 0.18);
    box(2.96, 0.15, 0.94, black, -0.02, 0.86, -0.02, 0.04);
    box(2.94, 0.018, 0.91, steel, -0.02, 0.795, -0.02, 0.008);
    box(2.94, 0.1, 0.94, black, 0, -0.875, 0, 0.035);
    box(0.53, 1.21, 0.035, rubber, -1.21, -0.08, 0.485, 0.025);
    box(0.84, 0.43, 0.73, green, -0.14, 1.05, -0.05);
    box(0.51, 0.22, 0.12, black, -0.14, 1.08, 0.35, 0.03);
    box(0.62, 0.045, 0.43, black, -0.14, 1.29, -0.05, 0.015);
    // Hot-shoe rails, lens release and recessed fasteners.
    for (const x of [-0.36, 0.08]) box(0.035, 0.025, 0.35, steel, x, 1.325, -0.05, 0.008);
    const release = mesh(new CylinderGeometry(0.085, 0.085, 0.04, 24), black, 0.73, -0.38, 0.51);
    release.rotation.x = Math.PI / 2;
    for (const [x, y] of [[-1.36, 0.68], [-1.36, -0.7], [0.77, -0.7]]) {
      mesh(new CircleGeometry(0.035, 12), steel, x, y, 0.481);
      mesh(new PlaneGeometry(0.044, 0.008), black, x, y, 0.484).rotation.z = 0.45;
    }

    // Dials and shutter, facing upward.
    mesh(new CylinderGeometry(0.23, 0.23, 0.19, 32), black, -1.08, 1, 0);
    mesh(new CylinderGeometry(0.19, 0.19, 0.03, 32), black, -1.08, 1.11, 0);
    box(0.024, 0.009, 0.075, gold, -1.08, 1.131, 0.1, 0.003);
    mesh(new CylinderGeometry(0.16, 0.16, 0.16, 32), steel, 1.18, 1, 0.33);
    mesh(new CylinderGeometry(0.11, 0.11, 0.035, 32), black, 1.18, 1.1, 0.33);

    // Front-mounted lens; the whole camera rotates, keeping lens and body rigid.
    barrel(0.82, 0.16, 0.56, steel);
    barrel(0.76, 0.5, 0.84, black);
    barrel(0.81, 0.3, 1.17, rubber);
    barrel(0.74, 0.36, 1.49, black, true);
    ring(0.75, 0.012, 1.35, gold);
    ring(0.725, 0.018, 1.73, black);
    barrel(0.73, 0.07, 1.7, black, true);
    const ridgeGeometry = new RoundedBoxGeometry(0.028, 0.06, 0.25, 2, 0.01);
    geometries.add(ridgeGeometry);
    const ridges = new InstancedMesh(ridgeGeometry, rubber, 48);
    instances.add(ridges);
    const ridge = new Object3D();
    for (let i = 0; i < 48; i++) {
      const angle = i * Math.PI * 2 / 48;
      ridge.position.set(-0.18 + Math.sin(angle) * 0.812, Math.cos(angle) * 0.812, 1.17);
      ridge.rotation.z = -angle;
      ridge.updateMatrix();
      ridges.setMatrixAt(i, ridge.matrix);
    }
    model.add(ridges);
    // An open lens barrel with a recessed iris under a convex front element.
    const darkOptics = material(new MeshBasicMaterial({ color: 0x030707 }));
    const irisMetal = material(new MeshStandardMaterial({ color: 0x293137, metalness: 0.75, roughness: 0.48 }));
    mesh(new RingGeometry(0.6, 0.73, 64), black, -0.18, 0, 1.741);
    mesh(new CircleGeometry(0.6, 64), darkOptics, -0.18, 0, 1.39);
    for (const [radius, depth] of [[0.56, 1.46], [0.49, 1.43], [0.42, 1.41]]) ring(radius, 0.012, depth, black);
    const irisGeometry = new RingGeometry(0.17, 0.4, 9);
    mesh(irisGeometry, irisMetal, -0.18, 0, 1.44);
    const blade = new Shape();
    blade.moveTo(0.17, 0); blade.lineTo(0.4, 0.09); blade.lineTo(0.4, 0.101); blade.lineTo(0.17, 0.009); blade.closePath();
    const bladeGeometry = new ShapeGeometry(blade);
    for (let i = 0; i < 9; i++) mesh(bladeGeometry, darkOptics, -0.18, 0, 1.442).rotation.z = i * Math.PI * 2 / 9;
    const bladeRest = Float32Array.from(bladeGeometry.attributes['position'].array);
    let shotElapsed: number | undefined;
    function aperture(open: number) {
      const edge = irisGeometry.attributes['position'];
      for (let i = 0; i <= 9; i++) {
        const angle = i * Math.PI * 2 / 9;
        edge.setXY(i, Math.cos(angle) * 0.17 * open, Math.sin(angle) * 0.17 * open);
      }
      edge.needsUpdate = true;
      const seams = bladeGeometry.attributes['position'];
      for (let i = 0; i < seams.count; i++) {
        const x = bladeRest[i * 3];
        const y = bladeRest[i * 3 + 1];
        if (Math.hypot(x, y) < 0.18) seams.setXY(i, x * open, y * open);
      }
      seams.needsUpdate = true;
    }
    function updateShot(dt: number): boolean {
      if (shotElapsed === undefined) return false;
      shotElapsed += dt;
      if (shotElapsed >= 0.65) {
        aperture(1);
        shotElapsed = undefined;
        return false;
      }
      // Close quickly, hold briefly, then reopen without a screen flash.
      const t = shotElapsed;
      const opening = t < 0.14 ? 1 - Math.pow(Math.sin(t / 0.14 * Math.PI / 2), 2)
        : t < 0.23 ? 0 : Math.pow(Math.sin((t - 0.23) / 0.42 * Math.PI / 2), 2);
      aperture(0.035 + opening * 0.965);
      return true;
    }
    const lensFace = mesh(new SphereGeometry(1.5, 48, 16, 0, Math.PI * 2, 0, Math.asin(0.6 / 1.5)), glass, -0.18, 0, 0.25);
    lensFace.rotation.x = Math.PI / 2;
    ring(0.603, 0.009, 1.627, steel);

    const lensLabel = document.createElement('canvas');
    lensLabel.width = lensLabel.height = 512;
    const lensInk = lensLabel.getContext('2d');
    if (lensInk) {
      lensInk.translate(256, 256);
      lensInk.fillStyle = '#babcb2';
      lensInk.font = '500 15px Arial';
      lensInk.textAlign = 'center';
      const inscription = 'MEMENTO  ·  35mm  1:1.8';
      for (let i = 0; i < inscription.length; i++) {
        lensInk.save();
        lensInk.rotate((i - (inscription.length - 1) / 2) * 0.075);
        lensInk.fillText(inscription[i], 0, -224);
        lensInk.restore();
      }
      const texture = new CanvasTexture(lensLabel);
      texture.colorSpace = SRGBColorSpace;
      textures.add(texture);
      mesh(new PlaneGeometry(1.48, 1.48), material(new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })), -0.18, 0, 1.747);
    }
    const reflection = document.createElement('canvas');
    reflection.width = reflection.height = 128;
    const reflectionInk = reflection.getContext('2d');
    let reflectionMap: CanvasTexture | undefined;
    if (reflectionInk) {
      const gradient = reflectionInk.createRadialGradient(64, 64, 8, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
      gradient.addColorStop(0.45, 'rgba(255,255,255,0.5)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      reflectionInk.fillStyle = gradient;
      reflectionInk.fillRect(0, 0, 128, 128);
      reflectionMap = new CanvasTexture(reflection);
      reflectionMap.colorSpace = SRGBColorSpace;
      textures.add(reflectionMap);
    }
    const glintMaterial = material(new MeshBasicMaterial({ map: reflectionMap ?? null, color: 0xc7e2ea, transparent: true, opacity: 0.22, depthWrite: false }));
    const glint = mesh(new CircleGeometry(0.16, 32), glintMaterial, -0.4, 0.25, 1.78);
    glint.scale.set(1, 0.35, 1);
    glint.rotation.z = -0.5;

    // A short focus confirmation, attached to the lens rather than the screen.
    const focus = new Group();
    focus.position.set(-0.18, 0, 1.81);
    focus.visible = false;
    model.add(focus);
    const focusMaterial = material(new MeshBasicMaterial({ color: 0xd1ac67, transparent: true, opacity: 0, depthWrite: false }));
    for (const x of [-1, 1]) {
      for (const y of [-1, 1]) {
        mesh(new PlaneGeometry(0.18, 0.014), focusMaterial, x * 0.52, y * 0.61, 0, focus);
        mesh(new PlaneGeometry(0.014, 0.18), focusMaterial, x * 0.61, y * 0.52, 0, focus);
      }
    }
    const focusLabel = document.createElement('canvas');
    focusLabel.width = 512;
    focusLabel.height = 128;
    const focusInk = focusLabel.getContext('2d');
    const focusLabelMaterial = material(new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    if (focusInk) {
      focusInk.textAlign = 'center';
      focusInk.fillStyle = '#d1ac67';
      focusInk.font = '500 52px Arial';
      focusInk.fillText('A fuoco.', 256, 82);
      const texture = new CanvasTexture(focusLabel);
      texture.colorSpace = SRGBColorSpace;
      textures.add(texture);
      focusLabelMaterial.map = texture;
      mesh(new PlaneGeometry(0.78, 0.195), focusLabelMaterial, 0, -0.88, 0, focus);
    }
    const sweepMaterial = material(new MeshBasicMaterial({ map: reflectionMap ?? null, color: 0xffedd0, transparent: true, opacity: 0, depthWrite: false }));
    const sweep = mesh(new CircleGeometry(0.16, 32), sweepMaterial, -0.18, 0.13, 1.79);
    sweep.scale.set(2, 0.28, 1);
    sweep.rotation.z = -0.3;
    sweep.visible = false;
    const raycaster = new Raycaster();
    const pointer = new Vector2();
    const dwellAnchor = new Vector2();
    let hasPointer = false;
    let hoverSince: number | undefined;
    let focusStarted: number | undefined;
    let focusPlayed = false;
    let reflectionX = -0.4;
    let reflectionY = 0.25;

    function clearFocus() {
      const needsPaint = focus.visible || sweep.visible;
      hasPointer = false;
      hoverSince = undefined;
      focusStarted = undefined;
      focusPlayed = false;
      focus.visible = false;
      sweep.visible = false;
      if (needsPaint) schedule();
    }

    function updateFocus(time: number): boolean {
      let overLens = false;
      if (hasPointer) {
        model.updateMatrixWorld(true);
        view.updateMatrixWorld();
        raycaster.setFromCamera(pointer, view);
        overLens = raycaster.intersectObject(lensFace, false).length > 0;
      }
      if (!overLens) {
        hoverSince = undefined;
        focusStarted = undefined;
        focusPlayed = false;
        focus.visible = false;
        sweep.visible = false;
        return false;
      }
      hoverSince ??= time;
      if (!focusPlayed && time - hoverSince >= 550) {
        focusStarted = time;
        focusPlayed = true;
      }
      if (focusStarted === undefined) return !focusPlayed;
      const elapsed = (time - focusStarted) / 1000;
      if (elapsed >= 1.6) {
        focusStarted = undefined;
        focus.visible = false;
        sweep.visible = false;
        return false;
      }
      const lock = Math.min(1, elapsed / 0.4);
      const fade = Math.min(1, elapsed / 0.12) * Math.min(1, (1.6 - elapsed) / 0.35);
      focus.visible = true;
      focus.scale.setScalar(1 + 0.28 * Math.pow(1 - lock, 3));
      focusMaterial.opacity = fade * 0.9;
      focusLabelMaterial.opacity = fade * Math.max(0, Math.min(1, (elapsed - 0.35) / 0.15));
      const pass = Math.max(0, Math.min(1, (elapsed - 0.35) / 0.65));
      sweep.visible = pass > 0 && pass < 1;
      sweep.position.x = -0.48 + pass * 0.6;
      sweepMaterial.opacity = Math.sin(pass * Math.PI) * 0.34;
      return true;
    }

    // Raised nameplate on the right grip, clear of the lens and grip ridges.
    box(0.82, 0.25, 0.05, black, 1.1, 0.62, 0.84, 0.025);
    const label = document.createElement('canvas');
    label.width = 512;
    label.height = 128;
    const ink = label.getContext('2d');
    if (ink) {
      ink.fillStyle = '#d1ac67';
      ink.textAlign = 'center';
      ink.font = '600 44px Arial';
      ink.fillText('MEMENTO', 256, 54);
      ink.font = '19px Arial';
      ink.fillText('PRODUCTION  /  01', 256, 94);
      const texture = new CanvasTexture(label);
      texture.colorSpace = SRGBColorSpace;
      textures.add(texture);
      mesh(new PlaneGeometry(0.77, 0.193), material(new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })), 1.1, 0.62, 0.87);
    }
    // The existing gold brand logo on the right side is revealed as the camera turns left.
    const logoTexture = new TextureLoader().load('/images/logo-memento-footer.png', (loaded) => {
      if (disposed) { loaded.dispose(); return; }
      schedule();
    }, undefined, () => { /* The nameplate remains visible if the logo cannot load. */ });
    logoTexture.colorSpace = SRGBColorSpace;
    textures.add(logoTexture);
    const logo = mesh(new PlaneGeometry(0.6, 0.6 * 1200 / 1350), material(new MeshBasicMaterial({
      map: logoTexture, transparent: true, depthWrite: false,
    })), 1.558, 0.02, 0.15);
    logo.rotation.y = Math.PI / 2;
    mesh(new CircleGeometry(0.04, 16), material(new MeshBasicMaterial({ color: 0xd1ac67 })), 0.94, 0.4, 0.85);

    model.rotation.set(targetX, targetY, -0.055);
    model.position.set(0, -0.1, 0);
    const fill = new HemisphereLight(0xe9eff4, 0x17201b, 0.08);
    scene.add(model, fill);
    const key = new DirectionalLight(0xfff0db, 0.1);
    key.position.set(-3, 5, 6);
    const rim = new DirectionalLight(0xc5d8ec, 2);
    rim.position.set(4, 2, -3);
    scene.add(key, rim);
    const reveal = new DirectionalLight(0xffe7c0, 0);
    scene.add(reveal);
    scene.environmentIntensity = 0.12;
    let introElapsed = 0;
    function updateIntro(dt: number): boolean {
      introElapsed = Math.min(1.3, introElapsed + dt);
      const progress = introElapsed / 1.3;
      const lift = progress * progress * (3 - 2 * progress);
      fill.intensity = 0.08 + 0.72 * lift;
      key.intensity = 0.1 + 3.1 * lift;
      scene.environmentIntensity = 0.12 + 0.58 * lift;
      reveal.position.set(-4 + progress * 8, 2.8, 4);
      reveal.intensity = Math.pow(Math.sin(progress * Math.PI), 2) * 2.2;
      if (progress === 1) reveal.intensity = 0;
      return progress < 1;
    }

    const orbitMaterial = material(new MeshBasicMaterial({ color: 0xd1ac67, transparent: true, opacity: 0.19 }));
    const orbit = mesh(new TorusGeometry(2.3, 0.009, 4, 96), orbitMaterial, 0, 0, -1.25, scene);
    orbit.rotation.set(0.2, -0.42, 0.2);
    const orbit2 = mesh(new TorusGeometry(2.65, 0.005, 4, 96), orbitMaterial, 0, 0, -1.3, scene);
    orbit2.rotation.set(-0.25, 0.24, -0.1);

    function schedule() {
      if (active && !disposed && !frame) frame = requestAnimationFrame(draw);
    }
    function draw(time: number) {
      frame = 0;
      if (!active || disposed) return;
      const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60;
      previousTime = time;
      const ease = 1 - Math.exp(-8 * dt);
      const entering = introElapsed < 1.3 && updateIntro(dt);
      const shooting = updateShot(dt);
      model.rotation.x += (targetX - model.rotation.x) * ease;
      model.rotation.y += (targetY - model.rotation.y) * ease;
      glint.position.x += (reflectionX - glint.position.x) * ease;
      glint.position.y += (reflectionY - glint.position.y) * ease;
      const focusing = updateFocus(time);
      renderer.render(scene, view);
      const moving = Math.abs(targetX - model.rotation.x) + Math.abs(targetY - model.rotation.y)
        + Math.abs(reflectionX - glint.position.x) + Math.abs(reflectionY - glint.position.y) > 0.0005;
      if (moving || focusing || entering || shooting) schedule();
      else previousTime = 0;
    }
    function resize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height || disposed || (width === bufferWidth && height === bufferHeight)) return;
      clearFocus();
      bufferWidth = width;
      bufferHeight = height;
      renderer.setSize(width, height, false);
      view.aspect = width / height;
      view.position.set(0, 0.3, Math.max(4.8, 5 / view.aspect) / (2 * Math.tan(Math.PI / 10)));
      view.lookAt(0, 0.15, 0);
      view.updateProjectionMatrix();
      schedule();
    }
    resize();
    // First frame must succeed before the photo is covered.
    renderer.render(scene, view);
    return {
      resize,
      clearFocus,
      shoot(x, y) {
        if (!active || disposed || shotElapsed !== undefined) return;
        model.updateMatrixWorld(true);
        view.updateMatrixWorld();
        raycaster.setFromCamera(new Vector2(x, y), view);
        if (!raycaster.intersectObject(lensFace, false).length) return;
        shotElapsed = 0;
        schedule();
      },
      point(x, y) {
        if (!hasPointer || Math.hypot((x - dwellAnchor.x) * bufferWidth / 2, (y - dwellAnchor.y) * bufferHeight / 2) > 4) {
          hoverSince = undefined;
          focusPlayed = false;
          focusStarted = undefined;
          focus.visible = false;
          sweep.visible = false;
          dwellAnchor.set(x, y);
        }
        pointer.set(x, y);
        hasPointer = true;
        targetX = 0.14 - y * 0.22;
        targetY = -0.2 + x * 0.48;
        reflectionX = -0.4 + x * 0.1;
        reflectionY = 0.25 + y * 0.08;
        schedule();
      },
      reset() {
        clearFocus();
        targetX = 0.14; targetY = -0.35;
        reflectionX = -0.4; reflectionY = 0.25;
        schedule();
      },
      setActive(value) {
        active = value;
        if (active) schedule();
        else {
          clearFocus();
          if (shotElapsed !== undefined) { aperture(1); shotElapsed = undefined; }
          // Do not replay the entrance when scrolling back to the hero.
          if (introElapsed > 0 && introElapsed < 1.3) updateIntro(1.3);
          cancelAnimationFrame(frame); frame = 0; previousTime = 0;
        }
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
