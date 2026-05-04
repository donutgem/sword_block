import * as THREE from 'three';
import { syncPlayerOutfit } from './outfit.js';
import { getEquippedSword } from './swordcraft.js';

const attackDuration = 0.18;
const spinDuration = 0.35;
const idleSwordAngle = -0.12;
const thrustDistance = 0.95;
const forwardVector = new THREE.Vector3();
const baseSwordPivotPosition = new THREE.Vector3(0.66, 0.98, -0.08);

export function createPlayer(state) {
  const group = new THREE.Group();
  group.name = 'player';

  const accentMaterial = new THREE.MeshStandardMaterial({ color: '#fff6d6' });
  const clothMaterial = new THREE.MeshStandardMaterial({ color: '#8f4a58' });
  const trimMaterial = new THREE.MeshStandardMaterial({ color: '#efc36b' });
  const pantsMaterial = new THREE.MeshStandardMaterial({ color: '#344f6d' });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: '#233645' });
  const hairMaterial = new THREE.MeshStandardMaterial({ color: '#3a2618' });

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.62, 1.95, 12),
    clothMaterial
  );
  torso.position.y = 1.18;
  group.add(torso);

  const chestWrap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.64, 0.78, 12),
    clothMaterial
  );
  chestWrap.position.y = 1.42;
  group.add(chestWrap);

  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.63, 0.67, 0.2, 12),
    darkMaterial
  );
  belt.position.y = 0.58;
  group.add(belt);

  const beltBuckle = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.18, 0.08),
    trimMaterial
  );
  beltBuckle.position.set(0, 0.58, 0.64);
  group.add(beltBuckle);

  const tunicHem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.7, 0.38, 12),
    pantsMaterial
  );
  tunicHem.position.y = 0.08;
  group.add(tunicHem);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.16, 0.24, 10),
    accentMaterial
  );
  neck.position.y = 2.02;
  group.add(neck);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 16, 16),
    accentMaterial
  );
  head.position.y = 2.35;
  group.add(head);

  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58),
    hairMaterial
  );
  hairCap.position.y = 2.47;
  group.add(hairCap);

  const hairBack = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.3, 0.45, 10),
    hairMaterial
  );
  hairBack.position.set(0, 2.28, 0.28);
  group.add(hairBack);

  const hairLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.28, 0.14),
    hairMaterial
  );
  hairLeft.position.set(-0.33, 2.28, -0.02);
  group.add(hairLeft);

  const hairRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.28, 0.14),
    hairMaterial
  );
  hairRight.position.set(0.33, 2.28, -0.02);
  group.add(hairRight);

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

  const shoulderBar = new THREE.Mesh(
    new THREE.BoxGeometry(1.32, 0.2, 0.24),
    clothMaterial
  );
  shoulderBar.position.set(0, 1.92, 0);
  group.add(shoulderBar);

  const shoulderPadGeometry = new THREE.BoxGeometry(0.34, 0.2, 0.34);
  const leftShoulderPad = new THREE.Mesh(shoulderPadGeometry, trimMaterial);
  leftShoulderPad.position.set(-0.5, 1.92, 0);
  group.add(leftShoulderPad);

  const rightShoulderPad = new THREE.Mesh(shoulderPadGeometry, trimMaterial);
  rightShoulderPad.position.set(0.5, 1.92, 0);
  group.add(rightShoulderPad);

  const armGeometry = new THREE.BoxGeometry(0.24, 1.3, 0.24);
  const leftArm = new THREE.Mesh(armGeometry, accentMaterial);
  leftArm.position.set(-0.54, 1.24, 0);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeometry, accentMaterial);
  rightArm.position.set(0.54, 1.24, 0);
  group.add(rightArm);

  const sleeveGeometry = new THREE.BoxGeometry(0.28, 0.48, 0.28);
  const leftSleeve = new THREE.Mesh(sleeveGeometry, clothMaterial);
  leftSleeve.position.set(-0.54, 1.62, 0);
  group.add(leftSleeve);

  const rightSleeve = new THREE.Mesh(sleeveGeometry, clothMaterial);
  rightSleeve.position.set(0.54, 1.62, 0);
  group.add(rightSleeve);

  const bracerGeometry = new THREE.BoxGeometry(0.28, 0.34, 0.28);
  const leftBracer = new THREE.Mesh(bracerGeometry, darkMaterial);
  leftBracer.position.set(-0.54, 0.72, 0);
  group.add(leftBracer);

  const rightBracer = new THREE.Mesh(bracerGeometry, darkMaterial);
  rightBracer.position.set(0.54, 0.72, 0);
  group.add(rightBracer);

  const legGeometry = new THREE.CylinderGeometry(0.16, 0.18, 0.92, 10);
  const bootGeometry = new THREE.BoxGeometry(0.3, 0.24, 0.36);
  const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
  leftLeg.position.set(-0.18, 0.42, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
  rightLeg.position.set(0.18, 0.42, 0);
  group.add(rightLeg);

  const leftBoot = new THREE.Mesh(bootGeometry, darkMaterial);
  leftBoot.position.set(-0.18, 0.08, 0.02);
  group.add(leftBoot);

  const rightBoot = new THREE.Mesh(bootGeometry, darkMaterial);
  rightBoot.position.set(0.18, 0.08, 0.02);
  group.add(rightBoot);

  const swordPivot = new THREE.Group();
  swordPivot.position.copy(baseSwordPivotPosition);
  swordPivot.rotation.z = idleSwordAngle;
  group.add(swordPivot);

  state.player.object = group;
  state.player.swordPivot = swordPivot;
  state.player.outfitMaterials = {
    top: clothMaterial,
    trim: trimMaterial,
    pants: pantsMaterial
  };

  syncPlayerOutfit(state);
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
  if (state.player.swordVisualLevel === state.player.swordVersion) {
    return;
  }

  if (state.player.swordMesh) {
    state.player.swordPivot.remove(state.player.swordMesh);
  }

  const swordMesh = createSwordMesh(getEquippedSword(state));
  state.player.swordPivot.add(swordMesh);
  state.player.swordMesh = swordMesh;
  state.player.swordVisualLevel = state.player.swordVersion;
}

export function getForwardVector(rotationY, target = new THREE.Vector3()) {
  return target.set(-Math.sin(rotationY), 0, -Math.cos(rotationY)).normalize();
}

function syncPlayerTransform(state) {
  state.player.object.position.copy(state.player.position);
  state.player.object.rotation.y = state.player.rotationY;
}

function syncSwordAnimation(state) {
  state.player.swordPivot.position.copy(baseSwordPivotPosition);
  state.player.swordPivot.rotation.y = 0;

  if (state.timers.spinAnimation > 0) {
    const progress = 1 - state.timers.spinAnimation / spinDuration;
    state.player.swordPivot.rotation.z = idleSwordAngle - 0.18;
    state.player.swordPivot.rotation.y = progress * Math.PI * 4;
    return;
  }

  if (state.timers.attackAnimation > 0) {
    const progress = 1 - state.timers.attackAnimation / attackDuration;
    const thrust = Math.sin(progress * Math.PI) * thrustDistance;
    state.player.swordPivot.position.z -= thrust;
    state.player.swordPivot.rotation.z = idleSwordAngle - thrust * 0.18;
    return;
  }

  state.player.swordPivot.rotation.z = idleSwordAngle;
}

function createSwordMesh(sword) {
  const group = new THREE.Group();
  const handleMaterial = new THREE.MeshStandardMaterial({ color: '#6a4e33' });
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: '#dce7f2' });
  const guardMaterial = new THREE.MeshStandardMaterial({ color: '#f1bf64' });
  const coreMaterial = new THREE.MeshStandardMaterial({ color: '#88c5f2' });
  const stats = sword.stats;
  const bladeLength = stats.bladeLength;
  const handleLength = stats.handleLength;
  const guardThickness = 0.16;

  const handleGroup = new THREE.Group();
  handleGroup.rotation.z = stats.handleAngle;
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, handleLength, 8),
    handleMaterial
  );
  handle.rotation.z = Math.PI / 2;
  handleGroup.add(handle);
  group.add(handleGroup);

  const pommel = new THREE.Mesh(
    new THREE.SphereGeometry(stats.pommelSize, 10, 10),
    guardMaterial
  );
  pommel.position.x = -handleLength / 2 - stats.pommelSize;
  handleGroup.add(pommel);

  const guardGroup = new THREE.Group();
  guardGroup.rotation.z = stats.guardAngle;
  guardGroup.position.x = handleLength / 2 + guardThickness / 2;
  const guard = new THREE.Mesh(
    new THREE.BoxGeometry(guardThickness, stats.guardWidth, 0.18),
    guardMaterial
  );
  guardGroup.add(guard);
  group.add(guardGroup);

  const bladeGroup = new THREE.Group();
  bladeGroup.rotation.z = stats.bladeAngle;
  bladeGroup.position.x = handleLength / 2 + guardThickness;
  const blade = new THREE.Mesh(
    new THREE.BoxGeometry(bladeLength, 0.18, 0.12),
    bladeMaterial
  );
  blade.position.x = bladeLength / 2;
  bladeGroup.add(blade);

  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.45, 6),
    bladeMaterial
  );
  tip.rotation.z = -Math.PI / 2;
  tip.position.set(bladeLength + 0.22, 0, 0);
  bladeGroup.add(tip);

  if (!sword.isStarter) {
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.16, 0),
      coreMaterial
    );
    core.position.x = -0.06;
    bladeGroup.add(core);
  }

  group.add(bladeGroup);

  group.rotation.y = Math.PI / 2;

  return group;
}
