---
name: fix-game-bug
description: Use when a Quest student asks to fix, debug, troubleshoot, repair, or investigate a broken game behavior, including vague reports like not working, glitching, weird controls, flashing, flickering, floating objects, wrong direction, stuck, broken, or messed up. This skill helps clarify ambiguous student bug reports before editing, with extra guidance for common Three.js game bugs.
---

# Fix A Student Game Bug

Use this skill when the student is trying to fix something that already exists.
The goal is to understand the bug before changing code.

Do not use this skill for a clearly new feature request unless the student is
also describing broken behavior.

## First Response Rule

If the bug report is even a little vague, pause and ask 1 or 2 short multiple
choice questions before editing code.

For symptom-only bug reports, this is mandatory. Do not inspect files, run
commands, or edit code until the student clarifies what they mean.

Mandatory-clarification examples:
- "It doesn't shoot."
- "I can't see my guy."
- "The controls don't work."
- "It is broken."
- "The camera is weird."
- "The enemy doesn't do anything."

These reports are not specific enough to fix directly because each one could
mean several different bugs.

Start by restating what you think the student means in clear, direct language:

```txt
I think you mean the player moves right when you press A, and left when you
press D. Is that the bug?
```

Then ask one focused question with A/B/C/D answers:

```txt
Which one is happening?
A. A moves right and D moves left
B. W/S are backward
C. The player faces the wrong way but moves correctly
D. Something else
```

Only ask what you need. If the student's first message is symptom-only, do not
decide that the bug is "clear enough" on your own.

You may fix directly only when the report includes the expected behavior, the
actual behavior, and enough concrete detail to identify the likely broken part.
Examples:
- "When I press Space, the bullet spawns behind the player instead of in front."
- "The player should jump with W, but W currently moves forward."
- "The score should increase by 1 when a bullet hits an enemy, but it stays 0."

For "it doesn't shoot", ask something like:

```txt
Got it. I think you mean pressing the shoot button is not making the weapon work.
Which one is happening?
A. No bullet or projectile appears at all
B. A bullet appears, but in the wrong place or direction
C. A bullet appears, but it does not hit enemies
D. I am not sure what key or button should shoot
```

## Good Clarifying Questions

Prefer questions that help the student point at visible behavior without making
them write a long explanation:

- What did you press or click?
- What did you expect to happen?
- What happened instead?
- Does it happen every time or only sometimes?
- Is the problem movement, camera, object placement, scoring, UI, or loading?

When possible, convert those into A/B/C/D choices:

```txt
Which part looks wrong?
A. Movement controls
B. Camera view
C. Object position or collision
D. Score, timer, or UI
```

## Bug-Fix Workflow

1. Decide whether this is a bug fix or a new feature.
2. If the report is vague or symptom-only, ask 1 or 2 A/B/C/D questions before
   inspecting files or editing.
3. Restate the bug clearly before editing.
4. Inspect the smallest relevant files first.
5. Change the smallest piece of code that explains the behavior.
6. Tell the student what changed and how to test it.

Do not rewrite big parts of the game because a small bug is unclear.

## Common Three.js Bug Translations

If the game uses Three.js or 3D primitives, read these student phrases as likely
clues, not final diagnoses.

- "It is flashing", "flickering", "glitching", or "sparkly": likely z-fighting.
  Check for two visible faces on the same plane, stacked planes, or surfaces
  that are almost coplanar.
- "Controls are messed up", "left and right are backward", or "A and D are
  wrong": likely the right-vector or cross-product order is inverted. Fix the
  movement math, not the key labels.
- "Forward is backward", "the character faces the wrong way", or "it is turned
  around": likely object forward direction or model rotation is wrong. Three.js
  objects commonly face local `-Z`; fix orientation deliberately.
- "It is floating", "there is a gap", or "it is inside the floor": likely ground
  anchoring or object placement is wrong. Put character bottoms on `y = 0` and
  ground surface tops at `y = 0`.
- "It is not on top of the platform", "not touching", or "not lined up": likely
  the object position ignores the other object's size. Place using dimensions,
  such as `base.position.y + baseHeight / 2 + itemHeight / 2`.
- "The camera is weird" or "movement changes when I turn": check whether
  movement should be world-relative or camera-relative.

## Three.js Checks

For camera-relative WASD movement:

- Get the camera forward direction with `camera.getWorldDirection(...)`.
- Project movement onto the ground plane, often by setting `y = 0` or using
  `projectOnPlane(...)`.
- Normalize the forward vector.
- Derive the right vector with a consistent cross product.
- If A/D are inverted, swap the cross product order or negate the right vector.

For flashing surfaces:

- Look for duplicate ground planes, decals, floor tiles, walls, or overlays.
- Avoid placing two visible surfaces on the same plane.
- Prefer one surface, real thickness, or a clear consistent offset.
- Avoid many tiny random offsets that make placement harder to reason about.

For placement and anchoring:

- Use object dimensions rather than guessing y-values.
- Keep one source of truth for offsets.
- Wrap a model in a parent `Object3D` if it needs a one-time visual offset.
- Check whether the mesh origin is at the center, bottom, or another point.

## What Not To Do

- Do not guess from vague words like "broken" without asking a clarifying
  question.
- Do not treat "it doesn't shoot" as enough information to start coding.
- Do not add a new feature when the student asked for a fix.
- Do not remap keys to hide inverted movement math.
- Do not scatter random position offsets across files.
- Do not create new geometry or materials inside the animation loop.
- Do not make the student answer many open-ended questions.

## Final Response

Keep the explanation short, respectful, and practical. These students may be
teenagers, so do not use babyish language, over-explain obvious ideas, or make
the response feel like a worksheet.

- Name the bug clearly.
- Say which file changed.
- Give one concrete test step.

Example:

```txt
I fixed the left/right controls. A now moves left and D now moves right because
the right-direction vector was flipped in `src/player.js`.

Test it by running the game and pressing A, then D.
```
