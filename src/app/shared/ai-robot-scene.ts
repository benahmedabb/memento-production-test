import {
  ACESFilmicToneMapping, Bone, Box3, DirectionalLight, Group, HemisphereLight, MathUtils,
  Mesh, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, Scene, SkinnedMesh, Texture,
  Vector3, WebGLRenderer, WebGLRenderTarget,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { attachRobotHead } from './ai-robot-rig';

const VISOR_FADE_IN_SECONDS = 3;
const VISOR_FADE_OUT_SECONDS = 3;

export interface AiRobotScene {
  point(x: number, y: number): void;
  reset(): void;
  resize(): void;
  setActive(active: boolean): void;
  dispose(): void;
}

/** Load the supplied model, then articulate its head and light its existing visor. */
export async function createAiRobotScene(canvas: HTMLCanvasElement, signal: AbortSignal): Promise<AiRobotScene> {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = .85;
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, .01, 20);
  const pivot = new Group();
  pivot.rotation.y = -.24;
  scene.add(pivot);
  let environment: WebGLRenderTarget | undefined;
  let assetRoot: Group | undefined;
  let active = false, disposed = false;
  let frame = 0, previousTime = 0;
  let targetX = 0, targetY = 0, targetGlow = 0;
  let idleTimer = 0;
  let width = 0, height = 0;
  const heads: Bone[] = [];
  const visor = { value: 0 };

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    window.clearTimeout(idleTimer);
    frame = 0;
    const textures = new Set<Texture>();
    (assetRoot ?? pivot).traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.geometry.dispose();
      if (object instanceof SkinnedMesh) object.skeleton.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
        material.dispose();
      }
    });
    textures.forEach(texture => {
      // GLTFLoader uses ImageBitmap; GPU disposal alone does not release its pixels.
      const bitmap = texture.source.data;
      if (typeof ImageBitmap !== 'undefined' && bitmap instanceof ImageBitmap) bitmap.close();
      texture.dispose();
    });
    environment?.dispose();
    scene.clear();
    renderer.dispose();
  }

  try {
    signal.throwIfAborted();
    const response = await fetch('/models/ai-assistant.glb', { signal, credentials: 'same-origin' });
    if (!response.ok) throw new Error('Robot model unavailable');
    const bytes = await response.arrayBuffer();
    signal.throwIfAborted();
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const gltf = await loader.parseAsync(bytes, '/models/');
    assetRoot = gltf.scene;
    signal.throwIfAborted();
    // Calibrate weights before introducing the fixed presentation rotation.
    const sources: Mesh[] = [];
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse(object => { if (object instanceof Mesh) sources.push(object); });
    for (const source of sources) {
      const { head, restMatrix, mesh } = attachRobotHead(source);
      heads.push(head);
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) if (material instanceof MeshStandardMaterial) {
        if (material.map) material.map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        if (material.normalMap) material.normalMap.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        material.onBeforeCompile = shader => {
          shader.uniforms['robotVisorIntensity'] = visor;
          shader.uniforms['robotRestMatrix'] = { value: restMatrix };
          shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nuniform mat4 robotRestMatrix;\nvarying vec3 robotRestPosition;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nrobotRestPosition = (robotRestMatrix * vec4(position, 1.0)).xyz;');
          shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform float robotVisorIntensity;\nvarying vec3 robotRestPosition;')
            .replace('#include <emissivemap_fragment>', `
              #include <emissivemap_fragment>
              // Select the cyan pixels already present in the visor, not the body circuits.
              float front = smoothstep(0.0, 0.025, robotRestPosition.z);
              float band = 1.0 - smoothstep(0.017, 0.024, abs(robotRestPosition.y - 0.827));
              float cyan = min(diffuseColor.g - diffuseColor.r, diffuseColor.b - diffuseColor.r);
              float slit = smoothstep(0.06, 0.24, cyan) * band * front;
              float contourY = 0.820 + 2.8 * robotRestPosition.x * robotRestPosition.x;
              float spill = exp(-pow((robotRestPosition.y - contourY) / 0.004, 2.0)) * front;
              diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.008, 0.025, 0.03), slit * 0.92);
              totalEmissiveRadiance += vec3(0.035, 0.8, 1.2) * robotVisorIntensity * (slit * 5.0 + spill * 0.15);
            `);
        };
        material.customProgramCacheKey = () => 'memento-visor-motion-v1';
      }
    }
    pivot.add(gltf.scene);
    signal.throwIfAborted();
    const bounds = new Box3().setFromObject(gltf.scene);
    const center = bounds.getCenter(new Vector3());
    gltf.scene.position.x -= center.x;
    gltf.scene.position.z -= center.z;
    const pmrem = new PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    try { environment = pmrem.fromScene(room, .06); }
    finally { room.dispose(); pmrem.dispose(); }
    scene.environment = environment.texture;
    scene.environmentIntensity = .5;
    scene.add(new HemisphereLight(0xd6eee8, 0x0d2722, .8));
    const key = new DirectionalLight(0xfff1df, 1.9);
    key.position.set(-2, 3, 4); scene.add(key);
    const rim = new DirectionalLight(0x65d9df, 2);
    rim.position.set(3, 2, -2); scene.add(rim);

    function wake() {
      if (active && !disposed && !frame) frame = requestAnimationFrame(render);
    }
    function render(time: number) {
      frame = 0;
      if (!active || disposed) return;
      if (previousTime && time - previousTime < 1000 / 30 - 1) { wake(); return; }
      const dt = previousTime ? Math.min((time - previousTime) / 1000, .08) : 1 / 30;
      previousTime = time;
      const yaw = targetX * .26, pitch = -targetY * .10;
      let unsettled = 0;
      heads.forEach(head => {
        head.rotation.y = MathUtils.damp(head.rotation.y, yaw, 6, dt);
        head.rotation.x = MathUtils.damp(head.rotation.x, pitch, 6, dt);
        unsettled += Math.abs(head.rotation.y - yaw) + Math.abs(head.rotation.x - pitch);
      });
      visor.value = targetGlow
        ? Math.min(targetGlow, visor.value + dt / VISOR_FADE_IN_SECONDS)
        : Math.max(0, visor.value - dt / VISOR_FADE_OUT_SECONDS);
      if (!targetGlow && visor.value < .0005) visor.value = 0;
      unsettled += Math.abs(visor.value - targetGlow);
      renderer.render(scene, camera);
      if (unsettled > .0005) wake();
      else previousTime = 0;
    }
    function resize() {
      if (disposed) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nextWidth = Math.round(rect.width), nextHeight = Math.round(rect.height);
      if (width === nextWidth && height === nextHeight) return;
      width = nextWidth; height = nextHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.set(0, .55, camera.aspect < .8 ? 1.95 : 1.75);
      camera.lookAt(0, .55, 0);
      camera.updateProjectionMatrix();
      wake();
    }
    resize();
    return {
      point(x, y) {
        if (!active || disposed) return;
        targetX = MathUtils.clamp(x, -1, 1); targetY = MathUtils.clamp(y, -1, 1);
        targetGlow = 1;
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => { idleTimer = 0; targetGlow = 0; wake(); }, 130);
        wake();
      },
      reset() {
        targetX = targetY = targetGlow = 0;
        window.clearTimeout(idleTimer); idleTimer = 0;
        wake();
      },
      resize,
      setActive(value) {
        active = value;
        if (active) wake();
        else {
          cancelAnimationFrame(frame); frame = 0; previousTime = 0;
          window.clearTimeout(idleTimer); idleTimer = 0;
          targetGlow = visor.value = 0;
        }
      },
      dispose,
    };
  } catch (error) { dispose(); throw error; }
}
