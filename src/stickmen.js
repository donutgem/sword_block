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
      { speaker: 'Purple runner', color: '#7448d8', text: "I'm taking the outside lane." },
      { speaker: 'Purple runner', color: '#7448d8', text: 'Try to catch me.' }
    ]
  },
  {
    id: 'jump',
    caption: 'Jump plan',
    speech: 'If the blocks rush us, hop over.',
    color: '#b88400',
    lines: [
      { speaker: 'Gold jumper', color: '#b88400', text: "I'll jump the block." },
      { speaker: 'Gold jumper', color: '#b88400', text: 'Watch the timing.' },
      { speaker: 'Teal coach', color: '#0b8a8f', text: 'Land clean, then keep running.' }
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
  },
  {
    id: 'cheer',
    caption: 'Victory cheer',
    speech: 'Wave cleared. Tiny celebration.',
    color: '#0b8a8f',
    lines: [
      { speaker: 'Teal winner', color: '#0b8a8f', text: 'That block is done.' },
      { speaker: 'Teal winner', color: '#0b8a8f', text: 'Hands up.' },
      { speaker: 'Green friend', color: '#238a50', text: 'Next wave, same plan.' }
    ]
  },
  {
    id: 'throw',
    caption: 'Star throw',
    speech: 'Aim first. Throw second.',
    color: '#2778d8',
    lines: [
      { speaker: 'Blue thrower', color: '#2778d8', text: 'Line it up.' },
      { speaker: 'Blue thrower', color: '#2778d8', text: 'Let the star fly.' },
      { speaker: 'Purple spotter', color: '#7448d8', text: 'Good hit.' }
    ]
  },
  {
    id: 'staff',
    caption: 'Staff spin',
    speech: 'Wide sweep. Clear space.',
    color: '#7f6758',
    lines: [
      { speaker: 'Staff fighter', color: '#7f6758', text: 'Hold it high.' },
      { speaker: 'Staff fighter', color: '#7f6758', text: 'Turn through the block.' },
      { speaker: 'Gold coach', color: '#b88400', text: 'Nice sweep.' }
    ]
  },
  {
    id: 'dance',
    caption: 'Tiny dance',
    speech: 'The arena has rhythm.',
    color: '#c03a82',
    lines: [
      { speaker: 'Pink dancer', color: '#c03a82', text: 'Left foot.' },
      { speaker: 'Pink dancer', color: '#c03a82', text: 'Right foot.' },
      { speaker: 'Orange dancer', color: '#d46b1f', text: 'Spin once.' }
    ]
  }
];

export function renderStickmanAnimations(state) {
  const selectedStory = stickmanStories.find((story) => story.id === state.ui.selectedStickman);

  return `
    <section class="stickman-menu" aria-label="Stickman animations">
      ${selectedStory ? renderStickmanViewer(selectedStory) : ''}
    </section>
  `;
}

export function renderStickmanRemote(state) {
  return `
    <aside class="stickman-remote" aria-label="Stickman animation remote">
      <div class="stickman-remote-header">
        <span>Animation Remote</span>
        <span class="stickman-remote-dots" aria-hidden="true">•••</span>
      </div>
      <div class="stickman-showcase">
        ${stickmanStories.map((story) => renderStickmanCard(story, state)).join('')}
      </div>
    </aside>
  `;
}

function renderStickmanCard(story, state) {
  const selectedClass = state.ui.selectedStickman === story.id ? ' is-selected' : '';

  return `
    <button class="stickman-card${selectedClass}" type="button" data-stickman-id="${story.id}">
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
