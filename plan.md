# Plan

## Goal

Make shard crafting faster and easier so players are encouraged to use the forge more often, while keeping weapon choices understandable and useful.

## Status

Ready to build

## Questions

1. What should remove the most crafting work? Answered.

## Answers

1. Press the first letter of a shard to place it immediately: B for blade, G for guard, and P for pommel.
2. Keep WASD movement on the forge board.

## Reference Notes

- The current forge uses a 7-by-5 board.
- Players choose blade, guard, or pommel with 1/2/3, move a cursor with WASD, place each shard with Enter, then press C.
- Before level 15, every weapon needs all three shard types.
- Layout position affects weapon reach, size, angle, and damage.
- The board remains open until the player closes the forge with E or Escape.

## Risky For First Version

- Removing the board completely would also remove the layout-based weapon choices.
- A large catalog of automatic recipes would need extra balancing and UI work.
- Automatically spending every shard could surprise players and make inventory choices less clear.

## Question Notes

- The main source of tedium could be the number of button presses, moving the cursor, or needing to design a layout.
- Quick recipe buttons can reduce work while preserving the custom board.
- Click-to-place cells reduce keyboard steps but still require players to build the whole layout.
- One-button crafting is fastest for players but removes most layout choice.

## Decisions

- Keep crafted weapons stronger than the starter weapon.
- Keep shard spending clear before a weapon is formed.
- Do not change shard drop rates until the crafting interaction is settled.
- Keep the custom forge board and layout-based weapon stats.
- Make B/G/P select and place the matching shard in one press.
- Keep C to form the weapon and Backspace to undo.

## Build Plan

1. Add direct B/G/P shard placement to the real forge.
2. Keep WASD cursor movement and existing board rules.
3. Update forge HUD instructions.
4. Update the tutorial's forge activity and controls.
5. Verify direct placement, cursor movement, undo, and confirmation.
6. Run the production build and a focused visual check.

## Previous Completed Work

- Built a six-step bright tutorial with one activity per screen.
- Added custom shard layouts, advanced level 15 recipes, weapon switching, and merging.
