import './tutorial.css';
import './tutorialCooldown.css';
import './tutorialSimulator.css';
import { renderAdvancedPractice } from './tutorialAdvancedView.js';
import {
  getTutorialStep,
  isTutorialPracticeComplete,
  tutorialSteps
} from './tutorial.js';

let lastTutorialMarkup = '';

export function renderTutorial(state) {
  const root = document.querySelector('#tutorial-root');

  if (!root) {
    return;
  }

  const tutorial = state.ui.tutorial;
  const markup = tutorial.open ? createTutorialMarkup(state) : '';

  if (markup !== lastTutorialMarkup) {
    root.innerHTML = markup;
    lastTutorialMarkup = markup;
  }
}

function createTutorialMarkup(state) {
  const step = getTutorialStep(state);
  const index = state.ui.tutorial.stepIndex;
  const percent = ((index + 1) / tutorialSteps.length) * 100;

  return `
    <div class="tutorial-backdrop">
      <section class="tutorial-modal" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
        <header class="tutorial-header">
          <div>
            <span class="tutorial-kicker">Step ${index + 1} of ${tutorialSteps.length}</span>
            <h2 id="tutorial-title">${step.title}</h2>
          </div>
          <button class="tutorial-close" type="button" data-tutorial-action="close" aria-label="Close tutorial">Close</button>
        </header>
        <div class="tutorial-progress" aria-hidden="true">
          <span style="width: ${percent}%"></span>
        </div>
        <div class="tutorial-content">
          ${step.kind === 'lesson' ? renderLesson(step) : renderPractice(state, step)}
        </div>
        ${renderNavigation(state, step)}
      </section>
    </div>
  `;
}

function renderLesson(step) {
  const points = step.points.map((point) => `<li>${point}</li>`).join('');

  return `
    <p class="tutorial-lead">${step.text}</p>
    <ul class="tutorial-points">${points}</ul>
    <div class="tutorial-next-up">Next: a small practice simulator.</div>
  `;
}

function renderPractice(state, step) {
  const practiceRenderers = {
    movement: renderMovementPractice,
    combat: renderCombatPractice,
    forge: renderForgePractice,
    advanced: renderAdvancedPractice,
    merge: renderMergePractice
  };
  const renderer = practiceRenderers[step.practice];
  const complete = isTutorialPracticeComplete(state);

  return `
    <div class="tutorial-simulator">
      ${renderer ? renderer(state.ui.tutorial) : ''}
    </div>
    <div class="tutorial-status ${complete ? 'is-complete' : ''}" aria-live="polite">
      ${complete ? 'Practice complete. Nice work.' : 'Finish the small task to continue.'}
    </div>
  `;
}

function renderMovementPractice(tutorial) {
  const practice = tutorial.movement;

  return `
    <p>Turn at least once, then move forward three times.</p>
    <div class="tutorial-mini-arena">
      <div
        class="tutorial-mini-player"
        style="--player-x: ${practice.x}px; --player-y: ${practice.y}px; --player-angle: ${practice.angle}deg"
      ><span></span></div>
      <i class="tutorial-arena-flower flower-one"></i>
      <i class="tutorial-arena-flower flower-two"></i>
    </div>
    <div class="tutorial-controls">
      ${keyButton('KeyJ', 'J', 'turns the player left')}
      ${keyButton('KeyK', 'K', 'moves the player forward')}
      ${keyButton('KeyL', 'L', 'turns the player right')}
    </div>
    <small>Turns: ${practice.turns}/1 · Moves: ${Math.min(practice.moves, 3)}/3</small>
  `;
}

function renderCombatPractice(tutorial) {
  const practice = tutorial.combat;
  const targetHealth = Math.max(4 - practice.normalHits - practice.spinHits * 2, 0);
  const cooldown = practice.spinCooldown;
  const cooldownLabel = cooldown > 0 ? `${cooldown.toFixed(1)} seconds` : 'Ready';

  return `
    <p>Hit the practice block twice, then use Spin Attack and watch its timer.</p>
    <div class="tutorial-combat-scene ${practice.spinHits > 0 ? 'did-spin' : ''}">
      <div class="tutorial-practice-block ${targetHealth === 0 ? 'is-defeated' : ''}">
        <span class="tutorial-block-eyes"></span>
        <strong>${targetHealth}</strong>
      </div>
      <div class="tutorial-sword-swipe"></div>
    </div>
    <div class="tutorial-controls">
      ${keyButton('Space', 'Space', 'swings the weapon')}
      ${keyButton(
        'Spin',
        'Spin Attack',
        cooldown > 0 ? `recharging for ${cooldownLabel}` : 'attacks all around the player',
        cooldown > 0
      )}
    </div>
    <div class="tutorial-cooldown">
      <div><span>Spin Attack timer</span><strong>${cooldownLabel}</strong></div>
      <div class="tutorial-cooldown-track"><i style="width: ${(cooldown / 5) * 100}%"></i></div>
      <small>${cooldown > 0 ? 'The attack cannot be used until this reaches 0.' : 'The timer is at 0, so Spin Attack can be used.'}</small>
    </div>
    <small>Normal hits: ${practice.normalHits}/2 · Spin hits: ${practice.spinHits}</small>
  `;
}

function renderForgePractice(tutorial) {
  const practice = tutorial.forge;
  const cells = [];

  for (let y = 0; y < 3; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      const part = practice.placed.find((item) => item.x === x && item.y === y);
      const cursor = practice.cursor.x === x && practice.cursor.y === y ? ' is-cursor' : '';
      cells.push(`<span class="tutorial-forge-cell${cursor}">${part ? part.type[0].toUpperCase() : ''}</span>`);
    }
  }

  return `
    <p>Place one blade, guard, and pommel. Move between placements, then press C.</p>
    <div class="tutorial-shard-picks">
      ${keyButton('Digit1', '1', 'selects a blade shard')}
      ${keyButton('Digit2', '2', 'selects a guard shard')}
      ${keyButton('Digit3', '3', 'selects a pommel shard')}
    </div>
    <div class="tutorial-forge-board">${cells.join('')}</div>
    <div class="tutorial-controls tutorial-controls-wrap">
      ${keyButton('KeyW', 'W', 'moves the selected square up')}
      ${keyButton('KeyA', 'A', 'moves the selected square left')}
      ${keyButton('KeyS', 'S', 'moves the selected square down')}
      ${keyButton('KeyD', 'D', 'moves the selected square right')}
      ${keyButton('Enter', 'Enter', 'places the selected shard')}
      ${keyButton('Backspace', 'Backspace', 'removes the last shard')}
      ${keyButton('KeyC', 'C', 'forms a weapon from the layout')}
    </div>
    <small>Selected: ${practice.selected} · Placed: ${practice.placed.length}</small>
  `;
}

function renderMergePractice(tutorial) {
  const practice = tutorial.merge;
  const swords = practice.merged ? 1 : practice.crafted;

  return `
    <p>This tiny forge has layouts ready. Press C twice, merge with M, then equip the result.</p>
    <div class="tutorial-weapon-rack ${practice.merged ? 'is-merged' : ''}">
      ${Array.from({ length: swords }, (_, index) => `
        <span class="tutorial-mini-sword"><i></i><b>${practice.merged ? 'Merged' : `Weapon ${index + 1}`}</b></span>
      `).join('')}
    </div>
    <div class="tutorial-controls">
      ${keyButton('KeyC', 'C', 'forms a sample weapon')}
      ${keyButton('KeyM', 'M', 'merges the two newest weapons')}
      <button type="button" data-tutorial-action="equip" ${practice.merged ? '' : 'disabled'}>Equip the merged weapon</button>
    </div>
    <small>${practice.equipped ? 'Merged weapon equipped.' : 'Build two, merge, then equip.'}</small>
  `;
}

function renderNavigation(state, step) {
  const index = state.ui.tutorial.stepIndex;
  const isLast = index === tutorialSteps.length - 1;
  const practiceComplete = isTutorialPracticeComplete(state);
  const nextDisabled = step.kind === 'practice' && !practiceComplete;

  return `
    <footer class="tutorial-navigation">
      <button type="button" data-tutorial-action="back" ${index === 0 ? 'disabled' : ''}>Back</button>
      <div>
        ${step.kind === 'practice' && !practiceComplete
          ? '<button class="tutorial-skip" type="button" data-tutorial-action="skip">Skip practice</button>'
          : ''}
        <button
          class="tutorial-primary"
          type="button"
          data-tutorial-action="${isLast ? 'finish' : 'next'}"
          ${nextDisabled ? 'disabled' : ''}
        >${isLast ? 'Back to outfit' : 'Continue'}</button>
      </div>
    </footer>
  `;
}

function keyButton(code, key, description, disabled = false) {
  return `
    <button type="button" data-tutorial-key="${code}" ${disabled ? 'disabled' : ''}>
      <kbd>${key}</kbd>
      <span>${description}</span>
    </button>
  `;
}
