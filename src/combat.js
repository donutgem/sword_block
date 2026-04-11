import * as THREE from 'three';
import { handleEnemyDefeat, getSwordBonus } from './progression.js';
import { getForwardVector, getSwordBladeLength } from './player.js';
import { setMessage } from './state.js';

const attackForward = new THREE.Vector3();
const toEnemy = new THREE.Vector3();
const pushDirection = new THREE.Vector3();

export function performAttack(state, scene) {
  if (state.timers.attackCooldown > 0) {
    return false;
  }

  state.timers.attackCooldown = 0.4;
  state.timers.attackAnimation = 0.18;

  const forward = getForwardVector(state.player.rotationY, attackForward);
  const damage = state.player.baseDamage + getSwordBonus(state.player.swordLevel);
  const attackReach = 1.3 + getSwordBladeLength(state.player.swordLevel);
  const defeatedIds = [];
  let hitCount = 0;

  for (const enemy of state.enemies) {
    toEnemy.subVectors(enemy.mesh.position, state.player.position);
    const distance = Math.hypot(toEnemy.x, toEnemy.z);

    if (distance > attackReach) {
      continue;
    }

    toEnemy.y = 0;
    toEnemy.normalize();

    if (forward.dot(toEnemy) < 0.4) {
      continue;
    }

    enemy.health = Math.max(enemy.health - damage, 0);
    hitCount += 1;

    if (enemy.health === 0) {
      defeatedIds.push(enemy.id);
    }
  }

  if (defeatedIds.length > 0) {
    const remainingEnemies = [];

    for (const enemy of state.enemies) {
      if (!defeatedIds.includes(enemy.id)) {
        remainingEnemies.push(enemy);
        continue;
      }

      scene.remove(enemy.mesh);
      handleEnemyDefeat(state, scene, enemy.mesh.position);
    }

    state.enemies = remainingEnemies;
    return true;
  }

  if (hitCount > 0) {
    setMessage(state, `Sword hit for ${damage} damage.`, 2);
    return true;
  }

  setMessage(state, 'Thrust missed. Turn toward the block and move closer.', 2);
  return false;
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
