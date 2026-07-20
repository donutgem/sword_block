# Plan

## Goal

Add a Tutorial button to the opening outfit screen. The tutorial should teach a new player everything needed to play through a cute, toned-down simulator without revealing or hinting at the secret code.

## Status

Built

## Questions

1. How should the tutorial be shown? Answered.
2. How much should the player practice? Answered with a simulator idea.
3. When should the small simulator appear? Answered.

## Answers

1. Use a guided practice lesson.
2. Add a cute, toned-down simulator every few minutes.
3. Keep the simulator inside the tutorial. Show a short practice simulator after each major lesson so the player can hone that ability.

## Reference Notes

- The opening screen is the outfit picker and already has a Start Game button.
- The game includes turning, forward movement, normal and spin attacks, health, enemies, waves, shard pickups, forge crafting, sword merging, weapon switching, and a leaderboard.
- The tutorial button must not start the game or start music.
- The tutorial must not mention, hint at, or expose the secret code.

## Risky For First Version

- A fully interactive guided lesson would change gameplay state and require more testing.
- One very long tutorial page could overwhelm a new player.
- Reopening a simulator during normal gameplay could interrupt combat and needs careful pausing and state cleanup.

## Question Notes

- The display format decides whether this is a simple readable overlay or a larger guided system. Several short pages are easier to learn from without changing gameplay.
- A full hands-on forge and merge lesson needs temporary tutorial items and more state cleanup. Limiting hands-on practice to movement and combat is safer, but leaves more reading.
- The phrase "every few minutes" needs clarification because it could mean sections inside the tutorial or interruptions during the normal game.

## Decisions

- Put the Tutorial button on the opening outfit screen.
- Open a guided practice lesson from the Tutorial button.
- Make the practice simulator cute and visually calmer than the normal arena.
- Follow every major lesson with its own short practice step.
- Keep all tutorial state separate from the real game so tutorial actions do not change scores, items, health, or progress.
- Keep the tutorial silent.
- Do not include any information about the secret code.

## Build Plan

1. Completed: Added a Tutorial button beside Start Game on the opening outfit screen.
2. Completed: Built a self-contained tutorial overlay with lesson and practice steps.
3. Completed: Taught movement, combat, waves and health, shards and forging, weapon merging, weapon switching, spin cooldowns, and leaderboard scoring.
4. Completed: Added small practice simulators after movement, combat, forging, and merging lessons.
5. Completed: Kept the tutorial silent, optional, and separate from real game state.
6. Completed: Verified the full practice flow, state isolation, and production build.

## Previous Completed Work

- Added temporary merge advice and a 10% merge power bonus.
