import * as THREE from 'three';
import { createHairStyles, syncPlayerHair } from './hair.js';
import { syncPlayerOutfit } from './outfit.js';
import { getEquippedSword } from './swordcraft.js';

const attackDuration = 0.18;
const spinDuration = 0.35;
const idleSwordAngle = -0.12;
const thrustDistance = 0.95;
const staffHoldHeight = 0.35;
const longerLegOffset = 0.38;
const forwardVector = new THREE.Vector3();
const movementVector = new THREE.Vector3();
const baseSwordPivotPosition = new THREE.Vector3(0.66, 0.98 + longerLegOffset, -0.08);

export function createPlayer(state) {
  const group = new THREE.Group();
  group.name = 'player';

  const accentMaterial = new THREE.MeshStandardMaterial({ color: '#fff6d6' });
  const clothMaterial = new THREE.MeshStandardMaterial({ color: '#e64968' });
  const trimMaterial = new THREE.MeshStandardMaterial({ color: '#ffd447' });
  const pantsMaterial = new THREE.MeshStandardMaterial({ color: '#285cb8' });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: '#172d46' });

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.62, 1.38, 12),
    clothMaterial
  );
  torso.position.y = 1.28 + longerLegOffset;
  group.add(torso);

  const chestWrap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.64, 0.78, 12),
    clothMaterial
  );
  chestWrap.position.y = 1.42 + longerLegOffset;
  group.add(chestWrap);

  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.63, 0.67, 0.2, 12),
    darkMaterial
  );
  belt.position.y = 0.61 + longerLegOffset;
  group.add(belt);

  const beltBuckle = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.18, 0.08),
    trimMaterial
  );
  beltBuckle.position.set(0, 0.61 + longerLegOffset, -0.64);
  group.add(beltBuckle);

  const pantsWaist = new THREE.Mesh(
    new THREE.BoxGeometry(1.12, 0.34, 0.62),
    pantsMaterial
  );
  pantsWaist.position.y = 0.5 + longerLegOffset;
  group.add(pantsWaist);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.16, 0.24, 10),
    accentMaterial
  );
  neck.position.y = 2.02 + longerLegOffset;
  group.add(neck);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 16, 16),
    accentMaterial
  );
  head.position.y = 2.35 + longerLegOffset;
  group.add(head);

  const hairStyles = createHairStyles(state);
  hairStyles.position.y = longerLegOffset;
  group.add(hairStyles);

  const eyeMaterial = new THREE.MeshStandardMaterial({ color: '#122232' });
  const leftEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    eyeMaterial
  );
  leftEye.position.set(-0.14, 2.4 + longerLegOffset, -0.36);
  group.add(leftEye);

  const rightEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    eyeMaterial
  );
  rightEye.position.set(0.14, 2.4 + longerLegOffset, -0.36);
  group.add(rightEye);

  const shoulderBar = new THREE.Mesh(
    new THREE.BoxGeometry(1.32, 0.2, 0.24),
    clothMaterial
  );
  shoulderBar.position.set(0, 1.92 + longerLegOffset, 0);
  group.add(shoulderBar);

  const shoulderPadGeometry = new THREE.BoxGeometry(0.34, 0.2, 0.34);
  const leftShoulderPad = new THREE.Mesh(shoulderPadGeometry, trimMaterial);
  leftShoulderPad.position.set(-0.5, 1.92 + longerLegOffset, 0);
  group.add(leftShoulderPad);

  const rightShoulderPad = new THREE.Mesh(shoulderPadGeometry, trimMaterial);
  rightShoulderPad.position.set(0.5, 1.92 + longerLegOffset, 0);
  group.add(rightShoulderPad);

  const armGeometry = new THREE.BoxGeometry(0.24, 1.3, 0.24);
  const leftArm = new THREE.Mesh(armGeometry, accentMaterial);
  leftArm.position.set(-0.54, 1.24 + longerLegOffset, 0);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeometry, accentMaterial);
  rightArm.position.set(0.54, 1.24 + longerLegOffset, 0);
  group.add(rightArm);

  const sleeveGeometry = new THREE.BoxGeometry(0.28, 0.48, 0.28);
  const leftSleeve = new THREE.Mesh(sleeveGeometry, clothMaterial);
  leftSleeve.position.set(-0.54, 1.62 + longerLegOffset, 0);
  group.add(leftSleeve);

  const rightSleeve = new THREE.Mesh(sleeveGeometry, clothMaterial);
  rightSleeve.position.set(0.54, 1.62 + longerLegOffset, 0);
  group.add(rightSleeve);

  const bracerGeometry = new THREE.BoxGeometry(0.28, 0.34, 0.28);
  const leftBracer = new THREE.Mesh(bracerGeometry, darkMaterial);
  leftBracer.position.set(-0.54, 0.72 + longerLegOffset, 0);
  group.add(leftBracer);

  const rightBracer = new THREE.Mesh(bracerGeometry, darkMaterial);
  rightBracer.position.set(0.54, 0.72 + longerLegOffset, 0);
  group.add(rightBracer);

  const legGeometry = new THREE.BoxGeometry(0.42, 1.18, 0.48);
  const bootGeometry = new THREE.BoxGeometry(0.38, 0.24, 0.42);
  const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
  leftLeg.position.set(-0.29, 0.51, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
  rightLeg.position.set(0.29, 0.51, 0);
  group.add(rightLeg);

  const leftBoot = new THREE.Mesh(bootGeometry, darkMaterial);
  leftBoot.position.set(-0.29, -0.2, 0.02);
  group.add(leftBoot);

  const rightBoot = new THREE.Mesh(bootGeometry, darkMaterial);
  rightBoot.position.set(0.29, -0.2, 0.02);
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
  state.player.outfitParts = {
    torso,
    chestWrap,
    belt,
    pantsWaist,
    shoulderBar,
    leftShoulderPad,
    rightShoulderPad,
    leftArm,
    rightArm,
    leftSleeve,
    rightSleeve,
    leftBracer,
    rightBracer,
    leftLeg,
    rightLeg,
    leftBoot,
    rightBoot
  };

  syncPlayerOutfit(state);
  syncPlayerHair(state);
  syncSwordLevel(state);
  syncPlayerTransform(state);
  setCharacterShadows(group);

  return group;
}

export function updatePlayer(delta, input, state) {
  if (input.isDown('KeyJ')) {
    state.player.rotationY += state.player.turnSpeed * delta;
  }

  if (input.isDown('KeyL')) {
    state.player.rotationY -= state.player.turnSpeed * delta;
  }

  movementVector.set(0, 0, 0);

  if (input.isDown('KeyK')) {
    getForwardVector(state.player.rotationY, forwardVector);
    movementVector.add(forwardVector);
  }

  if (movementVector.lengthSq() > 0) {
    movementVector.normalize();
    state.player.position.addScaledVector(movementVector, state.player.moveSpeed * delta);
    clampPlayerToArena(state);
  }

  syncSwordLevel(state);
  syncSwordAnimation(state);
  syncPlayerTransform(state);
}

function clampPlayerToArena(state) {
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

export function syncSwordLevel(state) {
  if (state.player.swordVisualLevel === state.player.swordVersion) {
    return;
  }

  if (state.player.swordMesh) {
    state.player.swordPivot.remove(state.player.swordMesh);
  }

  const swordMesh = createSwordMesh(getEquippedSword(state));
  setCharacterShadows(swordMesh);
  state.player.swordPivot.add(swordMesh);
  state.player.swordMesh = swordMesh;
  state.player.swordVisualLevel = state.player.swordVersion;
}

export function getForwardVector(rotationY, target = new THREE.Vector3()) {
  return target.set(-Math.sin(rotationY), 0, -Math.cos(rotationY)).normalize();
}

function syncPlayerTransform(state) {
  state.player.object.position.copy(state.player.position);
  state.player.object.rotation.set(0, state.player.rotationY, 0);
}

export function syncPlayerOutfitTransform(state) {
  syncPlayerTransform(state);
  state.player.object.rotation.x = state.player.rotationX;
}

function setCharacterShadows(group) {
  group.traverse((mesh) => {
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
}

function syncSwordAnimation(state) {
  const weapon = getEquippedSword(state);
  const isStaff = isStaffWeapon(weapon);

  state.player.swordPivot.position.copy(baseSwordPivotPosition);
  if (isStaff) {
    state.player.swordPivot.position.y += staffHoldHeight;
  }

  state.player.swordPivot.rotation.y = 0;

  if (state.timers.spinAnimation > 0) {
    const progress = 1 - state.timers.spinAnimation / spinDuration;
    state.player.swordPivot.rotation.z = idleSwordAngle - 0.18;
    state.player.swordPivot.rotation.y = progress * Math.PI * 4;
    return;
  }

  if (state.timers.attackAnimation > 0) {
    const progress = 1 - state.timers.attackAnimation / attackDuration;

    if (isStaff) {
      const swing = Math.sin(progress * Math.PI) * -1.4;
      state.player.swordPivot.rotation.z = idleSwordAngle - 0.25;
      state.player.swordPivot.rotation.y = swing;
      return;
    }

    const thrust = Math.sin(progress * Math.PI) * thrustDistance;
    state.player.swordPivot.position.z -= thrust;
    state.player.swordPivot.rotation.z = idleSwordAngle - thrust * 0.18;
    return;
  }

  state.player.swordPivot.rotation.z = idleSwordAngle;
}

function createSwordMesh(sword) {
  if (sword.components && sword.components.length < 3) {
    return createShardWeaponMesh(sword);
  }

  const group = new THREE.Group();
  const handleMaterial = new THREE.MeshStandardMaterial({ color: '#6a4e33' });
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: '#dce7f2' });
  const guardMaterial = new THREE.MeshStandardMaterial({ color: '#f1bf64' });
  const pommelMaterial = new THREE.MeshStandardMaterial({ color: '#8fc3f0' });
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
    pommelMaterial
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
    new THREE.ConeGeometry(0.12, 0.3, 6),
    bladeMaterial
  );
  tip.rotation.z = -Math.PI / 2;
  tip.position.set(bladeLength + 0.05, 0, 0.06);
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

function createShardWeaponMesh(weapon) {
  const group = new THREE.Group();
  const components = weapon.components || [];
  const spacing = components.length === 1 ? 0 : 0.62;
  const start = -((components.length - 1) * spacing) / 2;

  components.forEach((component, index) => {
    const mesh = createWeaponPart(component, weapon.stats);
    mesh.position.y = start + index * spacing;
    group.add(mesh);
  });

  group.rotation.y = Math.PI / 2;
  return group;
}

function createWeaponPart(component, stats) {
  if (component === 'blade') {
    return createNinjaStar(stats);
  }

  if (component === 'guard') {
    return createStaff(stats);
  }

  return createWeightedBalls(stats);
}

function createNinjaStar(stats) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: '#dce7f2' });
  const size = Math.min(0.42 + stats.damageBonus * 0.015, 0.75);

  for (let i = 0; i < 4; i += 1) {
    const point = new THREE.Mesh(
      new THREE.BoxGeometry(size, 0.1, 0.08),
      material
    );
    point.rotation.z = (Math.PI / 4) * i;
    group.add(point);
  }

  return group;
}

function createStaff(stats) {
  const group = new THREE.Group();
  const staffMaterial = new THREE.MeshStandardMaterial({ color: '#6a4e33' });
  const capMaterial = new THREE.MeshStandardMaterial({ color: '#f1bf64' });
  const length = Math.min(stats.bladeLength, 3.2);

  const staff = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, length, 8),
    staffMaterial
  );
  staff.rotation.z = Math.PI / 2;
  group.add(staff);

  [-length / 2, length / 2].forEach((x) => {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), capMaterial);
    cap.position.x = x;
    group.add(cap);
  });

  return group;
}

function createWeightedBalls(stats) {
  const group = new THREE.Group();
  const chainMaterial = new THREE.MeshStandardMaterial({ color: '#6f7f91' });
  const ballMaterial = new THREE.MeshStandardMaterial({ color: '#8fc3f0' });
  const chainLength = Math.min(0.75 + stats.pommelSize * 2.8, 1.35);

  const chain = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, chainLength, 6),
    chainMaterial
  );
  chain.rotation.z = Math.PI / 2;
  group.add(chain);

  [-chainLength / 2, chainLength / 2].forEach((x) => {
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(stats.pommelSize + 0.08, 10, 10),
      ballMaterial
    );
    ball.position.x = x;
    group.add(ball);
  });

  return group;
}

function isStaffWeapon(weapon) {
  return weapon.components?.length === 1 && weapon.components[0] === 'guard';
}
