import * as THREE from 'three';

const spawnPosition = new THREE.Vector3(0, 0, 10);

export function createGameState() {
  return {
    mode: 'playing',
    wave: 1,
    arena: {
      halfSize: 18
    },
    player: {
      level: 1,
      health: 100,
      maxHealth: 100,
      baseDamage: 8,
      swordLevel: 1,
      position: spawnPosition.clone(),
      spawnPosition: spawnPosition.clone(),
      rotationY: 0,
      moveSpeed: 6.5,
      turnSpeed: 2.5,
      radius: 0.9,
      object: null,
      swordPivot: null,
      swordMesh: null,
      swordVisualLevel: 0
    },
    inventory: {
      blade: 0,
      guard: 0,
      pommel: 0,
      swordsByLevel: {
        1: 1,
        2: 0,
        3: 0,
        4: 0
      }
    },
    enemies: [],
    pickups: [],
    forge: {
      position: new THREE.Vector3(0, 0, -2),
      radius: 3,
      object: null
    },
    timers: {
      attackCooldown: 0,
      attackAnimation: 0
    },
    nextIds: {
      enemy: 1,
      pickup: 1
    },
    shardCycle: ['blade', 'guard', 'pommel'],
    shardCycleIndex: 0,
    ui: {
      message: 'Press K to move, J/L to turn, and Space to thrust your sword forward.',
      messageTimer: 0,
      forgeOpen: false
    }
  };
}

export function setMessage(state, text, duration = 3) {
  state.ui.message = text;
  state.ui.messageTimer = duration;
}
