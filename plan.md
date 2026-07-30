# Plan

## Goal

Redesign the existing game tutorial into an original Duolingo-inspired learning experience: short, playful, interactive lessons that teach the same game controls and systems without copying Duolingo characters, logos, or exact artwork.

## Status

Ready to build

## Questions

1. Should the first version use one activity at a time, a lesson path, or both? Answered.

## Answers

1. Use one activity at a time.
2. Replace the tutorial's brown and muted colors with a bright, appealing palette.

## Reference Notes

- Duolingo describes its lessons as quick, bite-sized, interactive, and game-like.
- Its course path uses small lesson nodes, clear progress, and increasingly challenging practice.
- Immediate feedback, points, level unlocking, and completion celebrations make progress easy to understand.
- Official references:
  - https://www.duolingo.com/learn
  - https://blog.duolingo.com/duolingo-teaching-method/
  - https://blog.duolingo.com/intermediate-mini-units/
- The current game tutorial has six steps covering movement, combat, health and waves, forging, level 15 weapons, merging, weapon switching, and leaderboard scoring.
- The redesign must continue hiding the secret code.

## Risky For First Version

- A full winding course map plus a new activity system is a larger redesign and will need more visual and navigation testing.
- Hearts, XP, streaks, shops, and saved lesson progress add several new state systems; they are better added after the core lesson flow works.
- Adaptive difficulty would be harder to test and is not required to make the tutorial feel playful and bite-sized.
- Exact Duolingo branding, mascot art, sounds, and screen copies should not be used.

## Question Notes

- The biggest first decision is whether “like Duolingo” means the in-lesson activity flow, the winding lesson path, or both. This changes the whole tutorial layout and amount of work.
- One activity at a time is fastest to build and easiest to test.
- A path plus activities gives the fullest version but requires more screens and may need more fixes.

## Decisions

- Keep the tutorial separate from real game health, inventory, score, and progress.
- Keep all existing tutorial topics.
- Use an original game-themed visual identity inspired by playful bite-sized learning, not copied Duolingo branding.
- Keep the tutorial silent unless the user later asks for sounds.
- Show one focused activity per screen instead of a course map.
- Use immediate success feedback and a simple progress bar.
- Use bright greens, blues, purples, yellows, and white surfaces instead of brown or beige.

## Build Plan

1. Restyle the tutorial as a bright, original game-learning lesson.
2. Keep one focused prompt and practice activity on each screen.
3. Add clear activity numbering, progress, and success feedback.
4. Preserve the six-step lesson content and completion rules.
5. Verify movement, combat, forging, advanced weapons, merging, and finish screens.
6. Run a production build and focused visual checks.

## Previous Completed Work

- Added a Tutorial button to the outfit screen.
- Built six guided lesson and practice steps.
- Removed Skip Practice so each practice must be completed.
- Fixed the two-spin combat completion path.
