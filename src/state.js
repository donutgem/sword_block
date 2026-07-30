import * as THREE from 'three';
import { createCraftingBoard, createStarterSword } from './swordcraft.js';
import { createTutorialState } from './tutorial.js';

const spawnPosition = new THREE.Vector3(0, 1.5, 10);
const startingHealth = 50;
const healthGrowthPerClearedWave = 5 / 4;

export function createGameState() {
  return {
    mode: 'customize',
    wave: 1,
    waveClearPending: false,
    score: {
      blocksDefeated: 0
    },
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
      rotationX: 0,
      moveSpeed: 6.5,
      turnSpeed: 2.5,
      radius: 0.9,
      object: null,
      swordPivot: null,
      swordMesh: null,
      swordVisualLevel: -1,
      outfit: {
        topIndex: 0,
        pantsIndex: 0,
        hairIndex: 0
      },
      outfitMaterials: null,
      outfitParts: null,
      hairStyles: null
    },
    inventory: {
      blade: 0,
      guard: 0,
      pommel: 0,
      swords: [createStarterSword()]
    },
    enemies: [],
    projectiles: [],
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
      message: 'Choose your clothes and hair, then press Start Game.',
      messageTimer: 0,
      forgeOpen: false,
      weaponsOpen: false,
      menuOpen: true,
      selectedStickman: null,
      musicMuted: false,
      tutorial: createTutorialState()
    },
    leaderboard: {
      playerName: '',
      entries: [],
      status: 'loading',
      rank: null,
      lastSubmittedScore: 0,
      selectedType: 'blocks', // 'blocks' or 'fastest'
      blocksEntries: [],
      fastestEntries: []
    },
    waveStartTime: 0
  };
}

export function getMaxHealthForClearedWaves(clearedWaves) {
  return Math.round(startingHealth * healthGrowthPerClearedWave ** clearedWaves);
}

export function setMessage(state, text, duration = 3) {
  state.ui.message = text;
  state.ui.messageTimer = duration;
}
