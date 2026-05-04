import * as THREE from 'three';
import { createCraftingBoard, createStarterSword } from './swordcraft.js';

const spawnPosition = new THREE.Vector3(0, 0, 10);
const startingHealth = 50;
const healthGrowthPerClearedWave = 5 / 4;

export function createGameState() {
  return {
    mode: 'customize',
    wave: 1,
    arena: {
      halfSize: 18
    },
    player: {
      level: 1,
      health: startingHealth,
      maxHealth: startingHealth,
      baseDamage: 8,
      swordLevel: 1,
      equippedSwordId: 'starter',
      swordVersion: 0,
      position: spawnPosition.clone(),
      spawnPosition: spawnPosition.clone(),
      rotationY: 0,
      moveSpeed: 6.5,
      turnSpeed: 2.5,
      radius: 0.9,
      object: null,
      swordPivot: null,
      swordMesh: null,
      swordVisualLevel: -1,
      outfit: {
        topIndex: 0,
        pantsIndex: 0
      },
      outfitMaterials: null
    },
    inventory: {
      blade: 0,
      guard: 0,
      pommel: 0,
      swords: [createStarterSword()]
    },
    enemies: [],
    pickups: [],
    forge: {
      position: new THREE.Vector3(0, 0, -2),
      radius: 3,
      object: null,
      board: createCraftingBoard()
    },
    timers: {
      attackCooldown: 0,
      attackAnimation: 0,
      spinCooldown: 0,
      spinAnimation: 0
    },
    nextIds: {
      enemy: 1,
      pickup: 1,
      sword: 1
    },
    shardCycle: ['blade', 'guard', 'pommel'],
    shardCycleIndex: 0,
    ui: {
      message: 'Choose your shirt and pants, then press Start Game.',
      messageTimer: 0,
      forgeOpen: false
    }
  };
}

export function getMaxHealthForClearedWaves(clearedWaves) {
  return Math.round(startingHealth * healthGrowthPerClearedWave ** clearedWaves);
}

export function setMessage(state, text, duration = 3) {
  state.ui.message = text;
  state.ui.messageTimer = duration;
}
