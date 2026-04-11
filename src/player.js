import * as THREE from 'three';

const attackDuration = 0.18;
const idleSwordAngle = -0.12;
const thrustDistance = 0.95;
const baseBladeLength = 1.45;
const forwardVector = new THREE.Vector3();
const baseSwordPivotPosition = new THREE.Vector3(0.8, 1.45, -0.12);

export function createPlayer(state) {
  const group = new THREE.Group();
  group.name = 'player';

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#3f7a90' });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: '#fff6d6' });

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.7, 1.8, 8),
    bodyMaterial
  );
  torso.position.y = 1.2;
  group.add(torso);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 16, 16),
    accentMaterial
  );
  head.position.y = 2.35;
  group.add(head);

  const eyeMaterial = new THREE.MeshStandardMaterial({ color: '#122232' });
  const leftEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    eyeMaterial
  );
  leftEye.position.set(-0.14, 2.4, -0.36);
  group.add(leftEye);

  const rightEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    eyeMaterial
  );
  rightEye.position.set(0.14, 2.4, -0.36);
  group.add(rightEye);

  const feetGeometry = new THREE.BoxGeometry(0.28, 0.85, 0.28);
  const leftLeg = new THREE.Mesh(feetGeometry, bodyMaterial);
  leftLeg.position.set(-0.18, 0.42, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(feetGeometry, bodyMaterial);
  rightLeg.position.set(0.18, 0.42, 0);
  group.add(rightLeg);

  const shoulderBar = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.18, 0.22),
    bodyMaterial
  );
  shoulderBar.position.set(0, 1.65, 0);
  group.add(shoulderBar);

  const swordPivot = new THREE.Group();
  swordPivot.position.copy(baseSwordPivotPosition);
  swordPivot.rotation.z = idleSwordAngle;
  group.add(swordPivot);

  state.player.object = group;
  state.player.swordPivot = swordPivot;

  syncSwordLevel(state);
  syncPlayerTransform(state);

  return group;
}

export function updatePlayer(delta, input, state) {
  if (input.isDown('KeyJ')) {
    state.player.rotationY += state.player.turnSpeed * delta;
  }

  if (input.isDown('KeyL')) {
    state.player.rotationY -= state.player.turnSpeed * delta;
  }

  if (input.isDown('KeyK')) {
    const step = state.player.moveSpeed * delta;
    getForwardVector(state.player.rotationY, forwardVector);
    state.player.position.addScaledVector(forwardVector, step);

    const limit = state.arena.halfSize - 1.4;
    state.player.position.x = THREE.MathUtils.clamp(
      state.player.position.x,
      -limit,
      limit
    );
    state.player.position.z = THREE.MathUtils.clamp(
      state.player.position.z,
      -limit,
      limit
    );
  }

  syncSwordLevel(state);
  syncSwordAnimation(state);
  syncPlayerTransform(state);
}

export function syncSwordLevel(state) {
  if (state.player.swordVisualLevel === state.player.swordLevel) {
    return;
  }

  if (state.player.swordMesh) {
    state.player.swordPivot.remove(state.player.swordMesh);
  }

  const swordMesh = createSwordMesh(state.player.swordLevel);
  state.player.swordPivot.add(swordMesh);
  state.player.swordMesh = swordMesh;
  state.player.swordVisualLevel = state.player.swordLevel;
}

export function getForwardVector(rotationY, target = new THREE.Vector3()) {
  return target.set(-Math.sin(rotationY), 0, -Math.cos(rotationY)).normalize();
}

export function getSwordBladeLength(level) {
  return baseBladeLength * 2 ** Math.max(level - 1, 0);
}

function syncPlayerTransform(state) {
  state.player.object.position.copy(state.player.position);
  state.player.object.rotation.y = state.player.rotationY;
}

function syncSwordAnimation(state) {
  state.player.swordPivot.position.copy(baseSwordPivotPosition);
  state.player.swordPivot.rotation.y = 0;

  if (state.timers.attackAnimation > 0) {
    const progress = 1 - state.timers.attackAnimation / attackDuration;
    const thrust = Math.sin(progress * Math.PI) * thrustDistance;
    state.player.swordPivot.position.z -= thrust;
    state.player.swordPivot.rotation.z = idleSwordAngle - thrust * 0.18;
    return;
  }

  state.player.swordPivot.rotation.z = idleSwordAngle;
}

function createSwordMesh(level) {
  const group = new THREE.Group();
  const handleMaterial = new THREE.MeshStandardMaterial({ color: '#6a4e33' });
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: '#dce7f2' });
  const guardMaterial = new THREE.MeshStandardMaterial({ color: '#f1bf64' });
  const bladeLength = getSwordBladeLength(level);
  const handleLength = 0.9;
  const guardThickness = 0.16;
  const bladeCenterX = handleLength / 2 + guardThickness / 2 + bladeLength / 2;

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, handleLength, 8),
    handleMaterial
  );
  handle.rotation.z = Math.PI / 2;
  group.add(handle);

  const pommel = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 10, 10),
    guardMaterial
  );
  pommel.position.x = -0.55;
  group.add(pommel);

  const guard = new THREE.Mesh(
    new THREE.BoxGeometry(guardThickness, 0.78 + (level - 1) * 0.08, 0.18),
    guardMaterial
  );
  guard.position.x = handleLength / 2 + guardThickness / 2;
  group.add(guard);

  const blade = new THREE.Mesh(
    new THREE.BoxGeometry(bladeLength, 0.18, 0.12),
    bladeMaterial
  );
  blade.position.x = bladeCenterX;
  group.add(blade);

  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.45, 6),
    bladeMaterial
  );
  tip.rotation.z = -Math.PI / 2;
  tip.position.set(bladeCenterX + bladeLength / 2 + 0.22, 0, 0);
  group.add(tip);

  if (level >= 2) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.035, 8, 16),
      guardMaterial
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.x = bladeCenterX - bladeLength / 4;
    group.add(ring);
  }

  if (level >= 3) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.035, 8, 16),
      guardMaterial
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.x = bladeCenterX + bladeLength / 8;
    group.add(ring);
  }

  if (level >= 4) {
    const crest = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.42, 6),
      guardMaterial
    );
    crest.rotation.z = -Math.PI / 2;
    crest.position.set(bladeCenterX + bladeLength / 2 + 0.55, 0, 0);
    group.add(crest);
  }

  group.rotation.y = Math.PI / 2;

  return group;
}
