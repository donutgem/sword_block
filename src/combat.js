import * as THREE from 'three';
import { handleEnemyDefeat, getSwordBonus } from './progression.js';
import { getForwardVector } from './player.js';
import { setMessage } from './state.js';
import { getEquippedSword, getSwordBladeLength } from './swordcraft.js';

const attackForward = new THREE.Vector3();
const toEnemy = new THREE.Vector3();
const pushDirection = new THREE.Vector3();
const spinAttackCooldown = 5;
const ninjaStarSpinAttackCooldown = 8;
const spinAttackDuration = 0.35;
const ninjaStarSpeed = 15;
const ninjaStarLifetime = 1.1;
const ninjaStarSpinCount = 8;
const weightedBallsSpeed = 12;
const weightedBallsLifetime = 0.95;

export function performAttack(state, scene) {
  if (state.timers.attackCooldown > 0) {
    return false;
  }

  const weapon = getEquippedSword(state);

  if (isNinjaStarWeapon(weapon)) {
    return throwNinjaStar(state, scene, weapon);
  }

  if (isWeightedBallsWeapon(weapon)) {
    return throwWeightedBalls(state, scene, weapon);
  }

  state.timers.attackCooldown = 0.4;
  state.timers.attackAnimation = 0.18;

  const forward = getForwardVector(state.player.rotationY, attackForward);
  const damage = state.player.baseDamage + getSwordBonus(state);
  const attackReach = getAttackReach(state, weapon);
  const hitResult = createHitResult();

  for (const enemy of state.enemies) {
    toEnemy.subVectors(enemy.mesh.position, state.player.position);
    const distance = Math.hypot(toEnemy.x, toEnemy.z);

    if (distance > attackReach + enemy.radius) {
      continue;
    }

    toEnemy.y = 0;
    toEnemy.normalize();

    if (forward.dot(toEnemy) < getFacingThreshold(state, enemy, distance)) {
      continue;
    }

    applyDamageToEnemy(enemy, damage, hitResult);
  }

  if (finishHits(state, scene, hitResult)) {
    setMessage(state, `${getAttackName(weapon)} hit for ${damage} damage.`, 2);
    return true;
  }

  return false;
}

export function updateProjectiles(state, scene, delta) {
  const remainingProjectiles = [];

  for (const projectile of state.projectiles) {
    projectile.life -= delta;
    projectile.mesh.position.addScaledVector(projectile.velocity, delta);
    projectile.mesh.rotation.z += delta * 14;
    projectile.mesh.rotation.y += delta * 9;

    const hitResult = createHitResult();

    for (const enemy of state.enemies) {
      const distance = projectile.mesh.position.distanceTo(enemy.mesh.position);

      if (distance <= projectile.radius + enemy.radius) {
        applyDamageToEnemy(enemy, projectile.damage, hitResult);
        break;
      }
    }

    if (hitResult.hitCount > 0) {
      scene.remove(projectile.mesh);
      finishHits(state, scene, hitResult);
      setMessage(state, `${projectile.name} hit for ${projectile.damage} damage.`, 2);
      continue;
    }

    if (projectile.life <= 0 || isOutsideArena(state, projectile.mesh.position)) {
      scene.remove(projectile.mesh);
      continue;
    }

    remainingProjectiles.push(projectile);
  }

  state.projectiles = remainingProjectiles;
}

export function performSpinAttack(state, scene) {
  if (state.timers.attackCooldown > 0 || state.timers.spinCooldown > 0) {
    return false;
  }

  const weapon = getEquippedSword(state);

  if (isNinjaStarWeapon(weapon)) {
    return performNinjaStarSpinAttack(state, scene, weapon);
  }

  state.timers.attackCooldown = 0.9;
  state.timers.spinCooldown = spinAttackCooldown;
  state.timers.spinAnimation = spinAttackDuration;

  const damage = Math.round((state.player.baseDamage + getSwordBonus(state)) * 0.9);
  const attackReach = 1.7 + getSwordBladeLength(state) * 0.75;
  const hitResult = createHitResult();

  for (const enemy of state.enemies) {
    toEnemy.subVectors(enemy.mesh.position, state.player.position);
    const distance = Math.hypot(toEnemy.x, toEnemy.z);

    if (distance > attackReach + enemy.radius) {
      continue;
    }

    applyDamageToEnemy(enemy, damage, hitResult);
  }

  if (finishHits(state, scene, hitResult)) {
    setMessage(state, `Spin attack hit ${hitResult.hitCount} block${hitResult.hitCount === 1 ? '' : 's'}.`, 2);
    return true;
  }

  setMessage(state, 'Spin attack missed. Let the blocks get closer first.', 2);
  return false;
}

function performNinjaStarSpinAttack(state, scene, weapon) {
  state.timers.attackCooldown = 0.9;
  state.timers.spinCooldown = ninjaStarSpinAttackCooldown;
  state.timers.spinAnimation = spinAttackDuration;

  for (let i = 0; i < ninjaStarSpinCount; i += 1) {
    const angle = state.player.rotationY + (Math.PI * 2 * i) / ninjaStarSpinCount;
    const direction = new THREE.Vector3(-Math.sin(angle), 0, -Math.cos(angle));

    addWeaponProjectile(state, scene, {
      mesh: createNinjaStarProjectileMesh(),
      weapon,
      name: 'Spin Ninja Star',
      speed: ninjaStarSpeed,
      lifetime: ninjaStarLifetime,
      radius: 0.35,
      direction,
      rotationY: angle,
      damageScale: 0.8
    });
  }

  setMessage(state, 'Ninja Star spin flung stars in every direction.', 2);
  return true;
}

export function applyContactDamage(state, delta) {
  for (const enemy of state.enemies) {
    enemy.contactCooldown = Math.max(enemy.contactCooldown - delta, 0);

    const touchingDistance = state.player.radius + enemy.radius;
    const dx = state.player.position.x - enemy.mesh.position.x;
    const dz = state.player.position.z - enemy.mesh.position.z;
    const distance = Math.hypot(dx, dz);

    if (distance > touchingDistance || enemy.contactCooldown > 0) {
      continue;
    }

    state.player.health = Math.max(state.player.health - enemy.damage, 0);
    enemy.contactCooldown = 0.75;
    setMessage(state, `Block touched you for ${enemy.damage} damage.`, 2.5);

    pushDirection.set(dx, 0, dz);

    if (pushDirection.lengthSq() < 0.001) {
      pushDirection.set(0, 0, 1);
    } else {
      pushDirection.normalize();
    }

    state.player.position.addScaledVector(pushDirection, 0.9);
    clampPlayerToArena(state);

    if (state.player.health === 0) {
      respawnPlayer(state);
      return;
    }
  }
}

function respawnPlayer(state) {
  state.player.position.copy(state.player.spawnPosition);
  state.player.health = state.player.maxHealth;
  state.player.rotationY = 0;
  setMessage(state, 'You were knocked out and respawned at the arena gate.', 4);
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

function createHitResult() {
  return {
    defeatedIds: [],
    hitCount: 0
  };
}

function applyDamageToEnemy(enemy, damage, hitResult) {
  enemy.health = Math.max(enemy.health - damage, 0);
  enemy.flashTimer = 0.18;
  hitResult.hitCount += 1;

  if (enemy.health === 0) {
    hitResult.defeatedIds.push(enemy.id);
  }
}

function getFacingThreshold(state, enemy, distance) {
  const closeEnoughToTouch = state.player.radius + enemy.radius + 0.45;

  if (distance <= closeEnoughToTouch) {
    return -0.1;
  }

  return 0.25;
}

function finishHits(state, scene, hitResult) {
  if (hitResult.defeatedIds.length > 0) {
    const remainingEnemies = [];

    for (const enemy of state.enemies) {
      if (!hitResult.defeatedIds.includes(enemy.id)) {
        remainingEnemies.push(enemy);
        continue;
      }

      scene.remove(enemy.mesh);
      handleEnemyDefeat(state, scene, enemy.mesh.position);
    }

    state.enemies = remainingEnemies;
    return true;
  }

  return hitResult.hitCount > 0;
}

function throwNinjaStar(state, scene, weapon) {
  return throwWeaponProjectile(state, scene, {
    mesh: createNinjaStarProjectileMesh(),
    weapon,
    name: 'Ninja Star',
    speed: ninjaStarSpeed,
    lifetime: ninjaStarLifetime,
    radius: 0.35
  });
}

function throwWeightedBalls(state, scene, weapon) {
  return throwWeaponProjectile(state, scene, {
    mesh: createWeightedBallsProjectileMesh(weapon.stats),
    weapon,
    name: 'Weighted Balls',
    speed: weightedBallsSpeed,
    lifetime: weightedBallsLifetime,
    radius: Math.min(0.48 + weapon.stats.pommelSize, 0.7)
  });
}

function throwWeaponProjectile(state, scene, options) {
  state.timers.attackCooldown = 0.4;
  state.timers.attackAnimation = 0.18;

  addWeaponProjectile(state, scene, {
    ...options,
    direction: getForwardVector(state.player.rotationY, new THREE.Vector3()),
    rotationY: state.player.rotationY,
    damageScale: 1
  });
  setMessage(state, `${options.name} thrown.`, 1.5);
  return true;
}

function addWeaponProjectile(state, scene, options) {
  const direction = options.direction.clone().normalize();

  options.mesh.position.copy(state.player.position);
  options.mesh.position.y = 1.05;
  options.mesh.position.addScaledVector(direction, 1.05);
  options.mesh.rotation.y = options.rotationY;
  setProjectileShadows(options.mesh);
  scene.add(options.mesh);

  state.projectiles.push({
    mesh: options.mesh,
    velocity: direction.multiplyScalar(options.speed),
    damage: Math.round(
      (state.player.baseDamage + Math.round(options.weapon.stats.damageBonus)) * options.damageScale
    ),
    radius: options.radius,
    life: options.lifetime,
    name: options.name
  });
}

function createNinjaStarProjectileMesh() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: '#dce7f2' });

  for (let i = 0; i < 4; i += 1) {
    const point = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.11, 0.08),
      material
    );
    point.rotation.z = (Math.PI / 4) * i;
    group.add(point);
  }

  return group;
}

function createWeightedBallsProjectileMesh(stats) {
  const group = new THREE.Group();
  const chainMaterial = new THREE.MeshStandardMaterial({ color: '#6f7f91' });
  const ballMaterial = new THREE.MeshStandardMaterial({ color: '#8fc3f0' });
  const chainLength = Math.min(0.7 + stats.pommelSize * 2.6, 1.25);
  const ballSize = Math.min(stats.pommelSize + 0.12, 0.34);

  const chain = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, chainLength, 6),
    chainMaterial
  );
  chain.rotation.z = Math.PI / 2;
  group.add(chain);

  [-chainLength / 2, chainLength / 2].forEach((x) => {
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(ballSize, 10, 10),
      ballMaterial
    );
    ball.position.x = x;
    group.add(ball);
  });

  return group;
}

function isNinjaStarWeapon(weapon) {
  return weapon.components?.length === 1 && weapon.components[0] === 'blade';
}

function isWeightedBallsWeapon(weapon) {
  return weapon.components?.length === 1 && weapon.components[0] === 'pommel';
}

function isStaffWeapon(weapon) {
  return weapon.components?.length === 1 && weapon.components[0] === 'guard';
}

function getAttackReach(state, weapon) {
  if (isStaffWeapon(weapon)) {
    return 1.85 + getSwordBladeLength(state);
  }

  return 1.3 + getSwordBladeLength(state);
}

function getAttackName(weapon) {
  if (isStaffWeapon(weapon)) {
    return 'Staff sweep';
  }

  return 'Weapon';
}

function isOutsideArena(state, position) {
  const limit = state.arena.halfSize + 2;
  return Math.abs(position.x) > limit || Math.abs(position.z) > limit;
}

function setProjectileShadows(group) {
  group.traverse((mesh) => {
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
}
