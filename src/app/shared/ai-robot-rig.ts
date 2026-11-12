import {
  Bone, Float32BufferAttribute, MathUtils, Mesh, Skeleton, SkinnedMesh,
  Uint16BufferAttribute, Vector3,
} from 'three';

/** Articulation calibrated to the supplied Higgsfield mesh, in its original coordinates. */
export function attachRobotHead(source: Mesh) {
  source.updateWorldMatrix(true, false);
  const restMatrix = source.matrixWorld.clone();
  const geometry = source.geometry;
  const positions = geometry.getAttribute('position');
  const indices = new Uint16Array(positions.count * 4);
  const weights = new Float32Array(positions.count * 4);
  const vertex = new Vector3();

  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i).applyMatrix4(restMatrix);
    // Blend only through the neck. The shoulders and every torso vertex remain fixed.
    const neck = MathUtils.smoothstep(vertex.y, .67, .705);
    const collar = 1 - MathUtils.smoothstep(Math.abs(vertex.x), .075, .115);
    const headWeight = vertex.y >= .705 ? 1 : neck * collar;
    indices[i * 4 + 1] = 1;
    weights[i * 4] = 1 - headWeight;
    weights[i * 4 + 1] = headWeight;
  }
  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(indices, 4));
  geometry.setAttribute('skinWeight', new Float32BufferAttribute(weights, 4));
  const mesh = new SkinnedMesh(geometry, source.material);
  mesh.name = source.name;
  mesh.position.copy(source.position);
  mesh.quaternion.copy(source.quaternion);
  mesh.scale.copy(source.scale);
  const body = new Bone();
  body.name = 'MementoBody';
  const head = new Bone();
  head.name = 'MementoHead';
  head.position.copy(new Vector3(0, .695, -.05).applyMatrix4(restMatrix.clone().invert()));
  body.add(head);
  mesh.add(body);
  const parent = source.parent;
  parent?.add(mesh);
  parent?.remove(source);
  mesh.updateWorldMatrix(true, true);
  mesh.bind(new Skeleton([body, head]));
  return { mesh, head, restMatrix };
}
