import * as THREE from 'three';
import { getMaxHealthForClearedWaves, setMessage } from './state.js';

const spawnPositions = [
  [-10, -10],
  [10, -10],
  [-10, 2],
  [10, 2],
  [0, -12]
];

export function spawnWave(scene, state, waveNumber) {
  for (const enemy of state.enemies) {
    scene.remove(enemy.mesh);
  }

  state.enemies = [];
  syncPlayerHealthForWave(state, waveNumber);
  state.wave = waveNumber;

  const maxHealth = 20 + (waveNumber - 1) * 5;
  const damage = 10 + (waveNumber - 1) * 2;

  for (const [x, z] of spawnPositions) {
    const enemy = createEnemy(state, maxHealth, damage, x, z, waveNumber);
    state.enemies.push(enemy);
    scene.add(enemy.mesh);
  }

  setMessage(state, `Wave ${waveNumber} started. Defeat the blocks to level up.`, 4);
}

export function updateEnemyVisuals(state, delta, elapsedTime) {
  for (const enemy of state.enemies) {
    enemy.flashTimer = Math.max(enemy.flashTimer - delta, 0);
    enemy.healthFill.scale.x = Math.max(enemy.health / enemy.maxHealth, 0.001);
    enemy.healthFill.position.x = -0.55 + enemy.healthFill.scale.x * 0.55;
    enemy.core.rotation.y = elapsedTime * 0.55 + enemy.id * 0.4;
    syncEnemyFlash(enemy);
  }
}

export function allEnemiesDefeated(state) {
  return state.enemies.length === 0;
}

function syncPlayerHealthForWave(state, waveNumber) {
  const clearedWaves = Math.max(waveNumber - 1, 0);
  const scaledHealth = getMaxHealthForClearedWaves(clearedWaves);

  state.player.maxHealth = scaledHealth;
  state.player.health = scaledHealth;
}

function createEnemy(state, maxHealth, damage, x, z, waveNumber) {
  const group = new THREE.Group();
  group.position.set(x, 1, z);

  const blockMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.08, 0.9, Math.min(0.58 + waveNumber * 0.02, 0.7)),
    emissive: '#000000'
  });

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    blockMaterial
  );
  group.add(core);

  const eye = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.2, 0.12),
    new THREE.MeshStandardMaterial({ color: '#1c2834' })
  );
  eye.position.set(0, 0.25, 1.06);
  group.add(eye);

  const healthBarGroup = new THREE.Group();
  healthBarGroup.position.set(0, 1.65, 0);
  group.add(healthBarGroup);

  const healthBarBack = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.15, 0.05),
    new THREE.MeshStandardMaterial({ color: '#37291e' })
  );
  healthBarGroup.add(healthBarBack);

  const healthFill = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.1, 0.06),
    new THREE.MeshStandardMaterial({ color: '#74df78' })
  );
  healthFill.position.z = 0.02;
  healthBarGroup.add(healthFill);

  return {
    id: state.nextIds.enemy++,
    mesh: group,
    core,
    healthFill,
    health: maxHealth,
    maxHealth,
    damage,
    radius: 1.15,
    contactCooldown: 0,
    flashTimer: 0
  };
}

function syncEnemyFlash(enemy) {
  const flashStrength = enemy.flashTimer > 0 ? 0.7 : 0;
  enemy.core.material.emissive.setRGB(flashStrength, flashStrength, flashStrength * 0.08);
}
