export const tutorialSteps = [
  {
    kind: 'practice',
    practice: 'movement',
    title: 'Move',
    text: 'The camera follows behind while you move in the direction you face.',
    points: [
      'J turns left and L turns right.',
      'K moves forward in the direction you face.',
      'Keep moving when blocks crowd around you.'
    ]
  },
  {
    kind: 'practice',
    practice: 'combat',
    title: 'Fight and survive',
    text: 'Defeat every block to clear the wave and start a stronger one.',
    points: [
      'Space uses your normal attack.',
      'Spin Attack hits around you. Most spin timers take 5 seconds; Ninja Stars take 8.',
      'Touching blocks costs health. At zero you respawn; a new wave restores health and raises its maximum.'
    ]
  },
  {
    kind: 'practice',
    practice: 'forge',
    title: 'Collect shards and forge',
    text: 'Defeated blocks raise your level and drop blade, guard, or pommel shards.',
    points: [
      'Walk over shards to collect them. In the glowing forge ring, press E.',
      'Move with WASD. B places blade, G places guard, P places pommel, Backspace undoes, and C forges.',
      'E or Escape closes the forge.',
      'Before level 15, a weapon needs all three shard types. Smaller mixes unlock at level 15.'
    ]
  },
  {
    kind: 'practice',
    practice: 'advanced',
    title: 'Level 15 opens new builds',
    text: 'At level 15, the forge accepts layouts with only one or two shard types.',
    points: [
      'Blade-only makes a Ninja Star; its Spin Attack throws stars around you and takes 8 seconds.',
      'Guard shards alone make a Staff with a longer close-range sweep.',
      'Pommel shards alone make Weighted Balls that can be thrown forward.',
      'Any two shard types make a hybrid weapon that mixes those parts and their stats.'
    ]
  },
  {
    kind: 'practice',
    practice: 'merge',
    title: 'Manage stronger weapons',
    text: 'Crafted weapons are stronger than the starter sword and are equipped right away.',
    points: [
      'Show Weapons lets you inspect reach and damage, then equip a weapon.',
      'At the forge, M merges the two newest weapons and adds a 10% power bonus.',
      'Enter your name on the opening screen. Cleared waves submit your block score.'
    ]
  },
  {
    kind: 'lesson',
    title: 'Ready for the arena',
    text: 'Choose an outfit, enter a leaderboard name if you want, and press Start Game.',
    points: [
      'Turn with J/L, move with K, and attack with Space.',
      'Collect drops, visit the forge with E, and keep improving your weapon.',
      'You can finish now or use Back to review any step.'
    ]
  }
];
