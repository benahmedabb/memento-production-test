import {
  ACESFilmicToneMapping, Box3, DirectionalLight, Group, HemisphereLight, MathUtils,
  Mesh, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, Scene, Texture,
  Vector3, WebGLRenderer, WebGLRenderTarget,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface AiRobotScene {
  point(x: number, y: number): void;
  reset(): void;
  engage(active: boolean): void;
  resize(): void;
  setActive(active: boolean): void;
  dispose(): void;
}

/** The supplied GLB is one unrigged mesh. Move the model, never invent eye/neck joints. */
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
  let active = false, disposed = false;
  let frame = 0, previousTime = 0;
  let targetX = 0, targetY = 0, targetGlow = 1;
  let width = 0, height = 0;
  const surfaces = new Set<MeshStandardMaterial>();

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    frame = 0;
    const textures = new Set<Texture>();
    pivot.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.geometry.dispose();
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
    pivot.add(gltf.scene);
    signal.throwIfAborted();
    const bounds = new Box3().setFromObject(gltf.scene);
    const center = bounds.getCenter(new Vector3());
    gltf.scene.position.x -= center.x;
    gltf.scene.position.z -= center.z;
    pivot.traverse(object => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) if (material instanceof MeshStandardMaterial) {
        surfaces.add(material);
        if (material.map) material.map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      }
    });
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
      const yaw = -.24 + targetX * .18, pitch = -targetY * .035;
      pivot.rotation.y = MathUtils.damp(pivot.rotation.y, yaw, 5, dt);
      pivot.rotation.x = MathUtils.damp(pivot.rotation.x, pitch, 5, dt);
      let unsettled = Math.abs(pivot.rotation.y - yaw) + Math.abs(pivot.rotation.x - pitch);
      surfaces.forEach(material => {
        material.emissiveIntensity = MathUtils.damp(material.emissiveIntensity, targetGlow, 5, dt);
        unsettled += Math.abs(material.emissiveIntensity - targetGlow);
      });
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
      point(x, y) { targetX = MathUtils.clamp(x, -1, 1); targetY = MathUtils.clamp(y, -1, 1); wake(); },
      reset() { targetX = targetY = 0; targetGlow = 1; wake(); },
      engage(value) { targetGlow = value ? 1.6 : 1; wake(); },
      resize,
      setActive(value) {
        active = value;
        if (active) wake();
        else { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
      },
      dispose,
    };
  } catch (error) { dispose(); throw error; }
}
