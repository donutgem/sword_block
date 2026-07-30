# Plan

## Goal

Make the game graphics slightly more realistic without losing the clear, simple style or slowing the game down.

## Status

Built and verified

## Questions

1. Which part should look more realistic first? Answered.

## Answers

1. Lighting, shadows, and arena materials.
2. In the "Jump plan" stickman movie, use short, unconnected lines instead of trail dots.

## Reference Notes

- The game uses Three.js and grouped primitive shapes.
- It already has soft shadows, filmic tone mapping, fog, and a bright stylized color palette.
- The arena currently uses flat colors and includes a visible axes helper.

## Risky For First Version

- Rebuilding every character and object at once would take longer and could make gameplay harder to read.
- Heavy textures or many extra lights could reduce performance.

## Question Notes

- Lighting, materials, and the arena can create a more realistic look with the smallest safe change.
- Character and enemy model changes affect silhouettes and may need more playtesting.

## Decisions

- Keep the change subtle.
- Keep geometry-based visuals and good performance.
- Focus the realism pass on the environment rather than rebuilding characters.
- Replace the jump trail dots with short, separate line dashes.

## Build Plan

1. Completed: Tuned the sky, fog, light balance, and shadow quality.
2. Completed: Gave the ground subtle grass variation and the arena walls rougher materials.
3. Completed: Removed the visible development axes from the arena.
4. Completed: Replaced the "Jump plan" trail dots with short, separate line dashes.
5. Completed: Ran the production build and visually checked the arena and jump animation.

## Previous Completed Work

- Made shard crafting faster with direct B/G/P placement while preserving WASD layout control.
- Built a six-step bright tutorial with one activity per screen.
- Added custom shard layouts, advanced level 15 recipes, weapon switching, and merging.
