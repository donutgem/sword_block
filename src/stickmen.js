const stickmanStories = [
  {
    id: 'race',
    caption: 'Boot race',
    speech: 'First one to the forge wins.',
    color: '#238a50',
    lines: [
      { speaker: 'Green runner', color: '#238a50', text: 'I can see the forge.' },
      { speaker: 'Green runner', color: '#238a50', text: 'No slowing down now.' },
      { speaker: 'Orange runner', color: '#d46b1f', text: 'Save one shard for me.' },
      { speaker: 'Orange runner', color: '#d46b1f', text: 'My boots are warmed up.' },
      { speaker: 'Purple runner', color: '#7448d8', text: 'I am taking the outside lane.' },
      { speaker: 'Purple runner', color: '#7448d8', text: 'Try to catch me.' }
    ]
  },
  {
    id: 'jump',
    caption: 'Jump plan',
    speech: 'If the blocks rush us, hop over.',
    color: '#b88400',
    lines: [
      { speaker: 'Gold jumper', color: '#b88400', text: 'I will jump the block.' },
      { speaker: 'Gold jumper', color: '#b88400', text: 'Watch the timing.' },
      { speaker: 'Teal coach', color: '#0b8a8f', text: 'Land clean, then keep running.' },
      { speaker: 'Teal coach', color: '#0b8a8f', text: 'The block is not moving.' }
    ]
  },
  {
    id: 'duel',
    caption: 'Sword lesson',
    speech: 'Pointy end toward the blocks.',
    color: '#c03a82',
    lines: [
      { speaker: 'Pink fighter', color: '#c03a82', text: 'My swing is ready.' },
      { speaker: 'Pink fighter', color: '#c03a82', text: 'Aim before the clash.' },
      { speaker: 'Blue fighter', color: '#2778d8', text: 'Block first, strike second.' },
      { speaker: 'Blue fighter', color: '#2778d8', text: 'Keep your sword up.' }
    ]
  },
  {
    id: 'forge',
    caption: 'Forge idea',
    speech: 'Tiny shards. Huge confidence.',
    color: '#d46b1f',
    lines: [
      { speaker: 'Orange smith', color: '#d46b1f', text: 'Keep the forge steady.' },
      { speaker: 'Orange smith', color: '#d46b1f', text: 'Every shard changes the weapon.' },
      { speaker: 'Gold helper', color: '#b88400', text: 'Blade first.' },
      { speaker: 'Gold helper', color: '#b88400', text: 'Guard next.' },
      { speaker: 'Gold helper', color: '#b88400', text: 'Pommel last.' }
    ]
  }
];

export function renderStickmanAnimations(state) {
  const selectedStory = stickmanStories.find((story) => story.id === state.ui.selectedStickman);

  return `
    <div class="stickman-showcase">
      ${stickmanStories.map(renderStickmanCard).join('')}
    </div>
    ${selectedStory ? renderStickmanViewer(selectedStory) : ''}
  `;
}

function renderStickmanCard(story) {
  return `
    <button class="stickman-card" type="button" data-stickman-id="${story.id}">
      <span class="stickman-hidden-preview" aria-hidden="true"></span>
      <div class="stickman-story">
        <span class="stickman-caption">${story.caption}</span>
        <span class="stickman-watch-label">Click to watch</span>
      </div>
    </button>
  `;
}

function renderStickmanViewer(story) {
  return `
    <div class="stickman-viewer">
      <div class="stickman-viewer-header">
        <strong>${story.caption}</strong>
        <button class="hud-small-button" type="button" data-action="close-stickman">
          Close
        </button>
      </div>
      ${renderStickmanCanvas(story, 'large')}
      <div class="stickman-story">
        <span class="stickman-speech stickman-speech-large">"${story.speech}"</span>
        <div class="stickman-caption-player" data-caption-player="${story.id}">
          ${story.lines.map(renderStickmanCaption).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderStickmanCaption(line, index) {
  return `
    <span class="stickman-caption-line${index === 0 ? ' is-active' : ''}" data-caption-index="${index}">
      <span class="stickman-speaker-dot" style="background: ${line.color}"></span>
      <span>${line.text}</span>
    </span>
  `;
}

function renderStickmanCanvas(story, size) {
  const width = size === 'large' ? 320 : 150;
  const height = size === 'large' ? 190 : 92;

  return `
    <canvas
      class="stickman-canvas stickman-canvas-${size}"
      width="${width}"
      height="${height}"
      data-stickman-canvas="true"
      data-story-id="${story.id}"
      data-story-color="${story.color}"
    ></canvas>
  `;
}
