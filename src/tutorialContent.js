export const tutorialSteps = [
  {
    kind: 'lesson',
    title: 'Move with confidence',
    text: 'You face the direction you are moving. The camera follows behind you.',
    points: [
      'J turns left and L turns right.',
      'K moves forward in the direction you face.',
      'Keep moving when blocks crowd around you.'
    ]
  },
  { kind: 'practice', practice: 'movement', title: 'Try moving' },
  {
    kind: 'lesson',
    title: 'Fight and survive',
    text: 'Defeat every block to clear the wave and start a stronger one.',
    points: [
      'Space uses your normal attack.',
      'The Spin Attack button hits around you. Its timer counts down while it recharges.',
      'When the timer reaches 0, Spin Attack is ready again. Most weapons take 5 seconds; Ninja Stars take 8.',
      'Touching blocks costs health. At zero health, you respawn at the gate.',
      'A new wave restores your health and raises your maximum health.'
    ]
  },
  { kind: 'practice', practice: 'combat', title: 'Try attacking' },
  {
    kind: 'lesson',
    title: 'Collect shards and forge',
    text: 'Defeated blocks raise your level and drop blade, guard, or pommel shards.',
    points: [
      'Walk over a shard to collect it.',
      'Stand in the glowing forge ring and press E.',
      'Use 1, 2, or 3 to choose a shard. Move with WASD and place with Enter or Space.',
      'Backspace removes the last shard. C forms the weapon.',
      'E or Escape closes the forge.',
      'Before level 15, a weapon needs all three shard types. Smaller mixes unlock at level 15.'
    ]
  },
  { kind: 'practice', practice: 'forge', title: 'Try the forge' },
  {
    kind: 'lesson',
    title: 'Level 15 opens new builds',
    text: 'At level 15, the forge accepts layouts with only one or two shard types.',
    points: [
      'Blade shards alone make a Ninja Star. Space throws it forward.',
      'Ninja Star Spin Attack throws stars in every direction and takes 8 seconds to recharge.',
      'Guard shards alone make a Staff with a longer close-range sweep.',
      'Pommel shards alone make Weighted Balls that can be thrown forward.',
      'Any two shard types make a hybrid weapon that mixes those parts and their stats.'
    ]
  },
  { kind: 'practice', practice: 'advanced', title: 'Explore level 15 weapons' },
  {
    kind: 'lesson',
    title: 'Manage stronger weapons',
    text: 'Crafted weapons are stronger than the starter sword and are equipped right away.',
    points: [
      'Show Weapons lets you inspect reach and damage, then equip a weapon.',
      'At the forge, M merges the two newest crafted weapons.',
      'A merge combines their power and adds a 10% bonus.',
      'Enter your name on the opening screen. Cleared waves submit your block score.'
    ]
  },
  { kind: 'practice', practice: 'merge', title: 'Try merging' },
  {
    kind: 'lesson',
    title: 'Ready for the arena',
    text: 'Choose an outfit, enter a leaderboard name if you want, and press Start Game.',
    points: [
      'Turn with J/L, move with K, and attack with Space.',
      'Collect drops, visit the forge with E, and keep improving your weapon.',
      'You can close this tutorial now or review any earlier lesson.'
    ]
  }
];
