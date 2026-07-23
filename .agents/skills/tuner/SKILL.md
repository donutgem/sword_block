---
name: tuner
description: Use when a student asks for a tuner, tuning panel, adjustment UI, debug controls, calibration controls, or on-screen controls to move, rotate, scale, position, size, aim, or fine-tune a game object, camera, light, spawn point, hitbox, level part, model, or gameplay value. Build a visible student-friendly UI that lets them adjust values live and copy the final tuning data for their AI.
---

# Tuner

Use this skill when the student asks for a tuner or adjustment controls.

A tuner is an on-screen UI for changing something live in the game, then copying
the final values so the student can give them back to an AI.

## Build The Right Tuner

First identify what is being tuned:
- A position, such as a model, prop, spawn point, camera, light, or hitbox.
- A rotation or facing direction.
- A size or uniform scale.
- A gameplay value, such as speed, jump height, gravity, camera distance, health,
  timer length, score amount, spawn rate, or light strength.

Include only controls that make sense for that target. Do not add every possible
slider if the student only needs one object moved.

## Friendly Direction Names

Use student-friendly labels instead of raw axis names by default:
- `Left` and `Right` for side-to-side movement.
- `Up` and `Down` for vertical movement.
- `Forward` and `Back` for depth movement.
- `Turn Left` and `Turn Right` for yaw.
- `Tilt Up` and `Tilt Down` for pitch when needed.
- `Roll Left` and `Roll Right` only when roll is useful.

It is okay to show the underlying values in the copied output, but the visible
buttons and labels should be easy for kids to understand.

For Three.js, remember:
- `+X` usually means right.
- `+Y` usually means up.
- `+Z` usually means toward the camera.
- Object forward is often local `-Z`.

If forward/back feels wrong, fix the mapping from the game context. Do not
silently swap random values until it seems okay.

## Step Sizes

Pick step sizes intentionally. Bad step sizes make a tuner frustrating.

Before choosing a step:
- Check the scale of the existing scene or game values.
- Look at nearby values in the code.
- Make one button press small enough to fine-tune, but large enough to visibly
  change the target.
- Provide a `Step` control when the right amount is uncertain.

Good starting points:
- Position in small Three.js scenes: `0.1` or `0.25`.
- Position in larger scenes: `1`, `5`, or `10`.
- Rotation: `1`, `5`, or `15` degrees.
- Uniform scale: `0.05`, `0.1`, or `0.25`.
- Pixel-based 2D movement: `1`, `5`, or `10` pixels.
- Percentage-like values: `0.01`, `0.05`, or `0.1`.

Clamp values when needed so students cannot accidentally make the game unusable.

## Scale Rules

Default to uniform scale that preserves the object's proportions.

Do not add separate width, height, depth, `scaleX`, `scaleY`, or `scaleZ`
controls unless the student specifically asks for stretching or the context
requires non-uniform dimensions.

Name scale controls clearly:
- `Bigger`
- `Smaller`
- `Scale`

Prevent scale from reaching zero or negative values unless there is a specific
reason to allow it.

## UI Requirements

Make the tuner easy to see and pleasant to use:
- Put it in a fixed on-screen panel that does not cover the most important
  gameplay area.
- Use large readable labels and buttons.
- Group controls by purpose, such as `Move`, `Rotate`, `Size`, and `Copy`.
- Show the current values live.
- Include reset controls when useful.
- Keep it nice-looking, not like a raw debug dump.
- Make it usable with a mouse or trackpad.

Use plain button text. Do not use emojis unless the student specifically asks.

## Copy Button

Always include a very visible copy button.

The copy button must copy all useful tuning information, not just one value:
- The target being tuned.
- Position values.
- Rotation values.
- Scale values.
- Any gameplay values the tuner changes.
- The step size if it matters.
- A short note explaining where these values should be applied in code, if known.

Prefer copying a clean JSON-like block or a short AI-ready message, for example:

```text
Apply this tuning to the spaceship model:
position: { x: 1.25, y: 0.5, z: -3 }
rotationDegrees: { x: 0, y: 45, z: 0 }
scale: 1.2
```

After copying, show a clear success message such as `Copied tuning values`.

## Implementation Guidance

Keep tuner state connected to the real object or value being tuned. Pressing a
button should immediately update the visible game.

Avoid creating geometry, materials, DOM nodes, or event listeners inside the
animation loop. Create the panel once, then update values when controls are
used.

If the tuner is temporary, make it easy to remove later:
- Put tuner code in one clear section or file.
- Avoid scattering magic tuning constants across the project.
- Tell the student which copied values matter before removing the tuner.

If the student wants the tuner to remain in the final game, style it as a real
game settings or customization panel instead of a developer debug panel.
