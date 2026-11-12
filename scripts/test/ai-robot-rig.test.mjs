import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BufferGeometry, Float32BufferAttribute, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { attachRobotHead } from '../../src/app/shared/ai-robot-rig.ts';

test('head articulation preserves the bind pose, torso and rigid facial geometry', () => {
  const points = [
    [0, .5, .1],             // Chest.
    [.18, .68, -.02],        // Shoulder/collar beside the neck.
    [0, .685, -.03],         // Flexible section of the neck.
    [0, .72, .07],           // Chin.
    [0, .823, .09],          // Visor.
    [.06, .85, 0],           // Side of the head.
  ].map(point => new Vector3(...point));
  const group = new Group();
  const source = new Mesh(new BufferGeometry(), new MeshStandardMaterial());
  // Exercise the scale and translation used by the quantized GLB.
  source.position.set(-.0007, -.00117, .0011);
  source.scale.setScalar(.949);
  group.add(source);
  group.updateMatrixWorld(true);
  const inverse = source.matrixWorld.clone().invert();
  source.geometry.setAttribute('position', new Float32BufferAttribute(
    points.flatMap(point => point.clone().applyMatrix4(inverse).toArray()), 3,
  ));
  const { mesh, head } = attachRobotHead(source);
  const worldPoint = index => mesh.getVertexPosition(index, new Vector3()).applyMatrix4(mesh.matrixWorld);
  try {
    group.updateMatrixWorld(true);
    for (let i = 0; i < points.length; i++) assert.ok(worldPoint(i).distanceTo(points[i]) < 1e-6, 'rest shape must not change');
    const weights = mesh.geometry.getAttribute('skinWeight');
    for (let i = 0; i < points.length; i++) {
      const sum = weights.getX(i) + weights.getY(i) + weights.getZ(i) + weights.getW(i);
      assert.ok(Math.abs(sum - 1) < 1e-6);
    }
    head.rotation.set(-.1, .26, 0);
    group.updateMatrixWorld(true);
    assert.ok(worldPoint(0).distanceTo(points[0]) < 1e-6, 'chest must stay still');
    assert.ok(worldPoint(1).distanceTo(points[1]) < 1e-6, 'shoulder must stay still');
    assert.ok(worldPoint(4).distanceTo(points[4]) > .01, 'head must visibly turn');
    assert.ok(Math.abs(worldPoint(3).distanceTo(worldPoint(4)) - points[3].distanceTo(points[4])) < 1e-6, 'chin and visor must move as one rigid head');
  } finally {
    mesh.skeleton.dispose();
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
});
