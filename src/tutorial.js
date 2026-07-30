import { tutorialSteps } from './tutorialContent.js';

export { tutorialSteps } from './tutorialContent.js';

export function createTutorialState(open = false) {
  return {
    open,
    stepIndex: 0,
    movement: { angle: 0, x: 0, y: 0, turns: 0, moves: 0 },
    combat: { normalHits: 0, spinHits: 0, spinCooldown: 0, timerSeen: false },
    forge: { selected: 'blade', cursor: { x: 1, y: 1 }, placed: [], confirmed: false },
    advanced: { selected: 'blade', explored: [] },
    merge: { crafted: 0, merged: false, equipped: false }
  };
}

export function getTutorialStep(state) {
  return tutorialSteps[state.ui.tutorial.stepIndex] || tutorialSteps[0];
}

export function isTutorialPracticeComplete(state) {
  const step = getTutorialStep(state);

  if (step.practice === 'movement') {
    return state.ui.tutorial.movement.turns >= 1 && state.ui.tutorial.movement.moves >= 3;
  }

  if (step.practice === 'combat') {
    const combat = state.ui.tutorial.combat;
    const damageDealt = combat.normalHits + combat.spinHits * 2;
    return damageDealt >= 4;
  }

  if (step.practice === 'forge') {
    return state.ui.tutorial.forge.confirmed;
  }

  if (step.practice === 'advanced') {
    return state.ui.tutorial.advanced.explored.length === 4;
  }

  if (step.practice === 'merge') {
    return state.ui.tutorial.merge.merged && state.ui.tutorial.merge.equipped;
  }

  return true;
}

export function handleTutorialPointer(state, button) {
  const action = button.dataset.tutorialAction;
  const key = button.dataset.tutorialKey;

  if (!action && !key) {
    return false;
  }

  if (button.disabled) {
    return true;
  }

  if (action === 'open') {
    state.ui.tutorial = createTutorialState(true);
  } else if (action === 'close' || action === 'finish') {
    state.ui.tutorial.open = false;
  } else if (action === 'next') {
    moveTutorialStep(state, 1);
  } else if (action === 'back') {
    moveTutorialStep(state, -1);
  } else if (action === 'equip') {
    if (state.ui.tutorial.merge.merged) {
      state.ui.tutorial.merge.equipped = true;
    }
  } else if (key) {
    applyTutorialInput(state, key);
  }

  return true;
}

export function attachTutorialKeyboard(state, onChange) {
  window.addEventListener('keydown', (event) => {
    if (!state.ui.tutorial.open) {
      return;
    }

    const changed = event.code === 'Escape'
      ? closeTutorial(state)
      : applyTutorialInput(state, event.code);

    if (changed) {
      event.preventDefault();
      onChange();
    }
  });
}

export function updateTutorial(state, delta) {
  const tutorial = state.ui.tutorial;

  if (!tutorial.open || tutorial.combat.spinCooldown <= 0) {
    return;
  }

  tutorial.combat.spinCooldown = Math.max(tutorial.combat.spinCooldown - delta, 0);

  if (tutorial.combat.spinCooldown <= 4) {
    tutorial.combat.timerSeen = true;
  }
}

function closeTutorial(state) {
  state.ui.tutorial.open = false;
  return true;
}

function moveTutorialStep(state, amount) {
  const lastIndex = tutorialSteps.length - 1;
  state.ui.tutorial.stepIndex = Math.min(
    Math.max(state.ui.tutorial.stepIndex + amount, 0),
    lastIndex
  );
}

function applyTutorialInput(state, code) {
  const practice = getTutorialStep(state).practice;

  if (practice === 'movement') {
    return applyMovementInput(state.ui.tutorial.movement, code);
  }

  if (practice === 'combat') {
    return applyCombatInput(state.ui.tutorial.combat, code);
  }

  if (practice === 'forge') {
    return applyForgeInput(state.ui.tutorial.forge, code);
  }

  if (practice === 'advanced' && code.startsWith('Advanced')) {
    const advanced = state.ui.tutorial.advanced;
    advanced.selected = code.replace('Advanced', '').toLowerCase();
    if (!advanced.explored.includes(advanced.selected)) {
      advanced.explored.push(advanced.selected);
    }
    return true;
  }

  if (practice === 'merge') {
    return applyMergeInput(state.ui.tutorial.merge, code);
  }

  return false;
}

function applyMovementInput(practice, code) {
  if (code === 'KeyJ' || code === 'KeyL') {
    practice.angle += code === 'KeyJ' ? -45 : 45;
    practice.turns += 1;
    return true;
  }

  if (code === 'KeyK') {
    const angle = practice.angle * Math.PI / 180;
    practice.x = clamp(practice.x + Math.sin(angle) * 18, -70, 70);
    practice.y = clamp(practice.y - Math.cos(angle) * 13, -34, 34);
    practice.moves += 1;
    return true;
  }

  return false;
}

function applyCombatInput(practice, code) {
  if (code === 'Space') {
    practice.normalHits = Math.min(practice.normalHits + 1, 2);
    return true;
  }

  if (code === 'Spin' && practice.spinCooldown <= 0) {
    practice.spinHits += 1;
    practice.spinCooldown = 5;
    practice.timerSeen = false;
    return true;
  }

  return false;
}

function applyForgeInput(practice, code) {
  const types = { KeyB: 'blade', KeyG: 'guard', KeyP: 'pommel' };

  if (types[code]) {
    practice.selected = types[code];
    const occupied = practice.placed.some(
      (part) => part.x === practice.cursor.x && part.y === practice.cursor.y
    );
    if (!occupied) {
      practice.placed.push({ ...practice.cursor, type: practice.selected });
    }
    return true;
  }

  if (moveForgeCursor(practice.cursor, code)) {
    return true;
  }

  if (code === 'Backspace') {
    practice.placed.pop();
    practice.confirmed = false;
    return true;
  }

  if (code === 'KeyC') {
    const used = new Set(practice.placed.map((part) => part.type));
    practice.confirmed = ['blade', 'guard', 'pommel'].every((type) => used.has(type));
    return true;
  }

  return false;
}

function moveForgeCursor(cursor, code) {
  const moves = {
    KeyA: [-1, 0], KeyD: [1, 0], KeyW: [0, -1], KeyS: [0, 1]
  };
  const move = moves[code];

  if (!move) {
    return false;
  }

  cursor.x = clamp(cursor.x + move[0], 0, 4);
  cursor.y = clamp(cursor.y + move[1], 0, 2);
  return true;
}

function applyMergeInput(practice, code) {
  if (code === 'KeyC') {
    practice.crafted = Math.min(practice.crafted + 1, 2);
    return true;
  }

  if (code === 'KeyM') {
    practice.merged = practice.crafted >= 2;
    return true;
  }

  return false;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
