import './tutorialAdvanced.css';

const advancedWeapons = {
  blade: {
    recipe: 'Blade shards only',
    name: 'Ninja Star',
    ability: 'Space throws it forward. Spin Attack throws stars in every direction.',
    timer: 'Its Spin Attack timer starts at 8 seconds.'
  },
  guard: {
    recipe: 'Guard shards only',
    name: 'Staff',
    ability: 'Space performs a longer close-range staff sweep.',
    timer: 'Its Spin Attack uses the normal 5-second timer.'
  },
  pommel: {
    recipe: 'Pommel shards only',
    name: 'Weighted Balls',
    ability: 'Space throws the weighted balls forward.',
    timer: 'Its Spin Attack uses the normal 5-second timer.'
  },
  hybrid: {
    recipe: 'Any two shard types',
    name: 'Hybrid Weapon',
    ability: 'It mixes both chosen parts and their reach, size, and damage stats.',
    timer: 'Its Spin Attack uses the normal 5-second timer.'
  }
};

export function renderAdvancedPractice(tutorial) {
  const practice = tutorial.advanced;
  const weapon = advancedWeapons[practice.selected];

  return `
    <p>Select every level 15 recipe to learn what it makes.</p>
    <div class="tutorial-advanced-picks">
      ${recipeButton('Blade', 'Blade only')}
      ${recipeButton('Guard', 'Guard only')}
      ${recipeButton('Pommel', 'Pommel only')}
      ${recipeButton('Hybrid', 'Any two types')}
    </div>
    <div class="tutorial-advanced-card">
      <span>${weapon.recipe}</span>
      <strong>${weapon.name}</strong>
      <p>${weapon.ability}</p>
      <small>${weapon.timer}</small>
    </div>
    <small>Recipes explored: ${practice.explored.length}/4</small>
  `;
}

function recipeButton(code, label) {
  return `<button type="button" data-tutorial-key="Advanced${code}">${label}</button>`;
}
