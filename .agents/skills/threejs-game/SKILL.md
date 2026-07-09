---
name: threejs-game
description: Use when building, changing, debugging, or polishing a Quest web game that uses Three.js or 3D geometry. This skill covers scene defaults, renderer setup, coordinate rules, z-fighting prevention, animation-loop safety, performance guardrails, and simple game state safety.
---

# Three.js Game

Use this skill for Three.js games.

Projects should stay static browser builds with JavaScript,
ES modules, small files, and geometry-based visuals.

## Scene Defaults

Before gameplay, define:
- What is the core object?
- How does the player move?
- Is the camera static, orbit controls, or WASD?
- Is the target desktop only, unless the user says otherwise?

Build a quick calibration scene first:
- Add `GridHelper`.
- Add `AxesHelper`.
- Add one test cube.
- Confirm the camera looks correct.
- Confirm movement directions feel correct.
- Confirm the ground is at `y = 0`.

Three.js reference frame:
- `+X` is right.
- `+Y` is up.
- `+Z` is toward the camera.
- Object forward is usually local `-Z`.

If movement feels backward, fix the vector math. Do not remap keys to hide an
orientation bug.

## Camera-Relative Movement

When using WASD with a movable camera:
1. Get the camera forward vector.
2. Project it onto the XZ plane.
3. Normalize it.
4. Derive the right vector with the correct cross product.

If A/D feels inverted, the cross product order is wrong. Fix the math, not the
key mapping.

## Ground Anchoring

Characters should have the bottom of the model touch `y = 0`.

Ground tiles should have the top of the surface at `y = 0`.

Do not fix floating issues with random offsets in multiple files. If a model
needs adjustment, wrap it in a parent `Object3D` and offset it once during
setup.

## Surface Placement

Avoid z-fighting and flickering surfaces.

Rules:
- Do not place two visible faces on the exact same plane.
- Do not stack one visible plane directly on another visible plane.
- Do not let visible sides of two meshes share the same coplanar face.
- Do not hide clipping by using tiny random offsets in many places.
- Prefer one mesh or one non-overlapping tile system when possible.
- For layered terrain, give each layer real thickness or clearly separate the
  visible surfaces.
- For adjacent tiles, make their edges meet without overlapping faces.
- If an overlay must sit above another surface, raise it by a clear, consistent
  amount and verify in the browser that it does not flicker.

## Renderer Defaults

Use:

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
```

Handle resize:

```js
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
```

Use:

```js
renderer.setAnimationLoop((time) => {
  renderer.render(scene, camera);
});
```

## Animation Rules

- Compute delta time once per frame.
- Store input state outside the loop.
- Only mutate transforms inside the loop.
- Never create geometry or materials inside the loop.

## Lighting Defaults

- Start with `AmbientLight` from 0.3 to 0.5.
- Add one `DirectionalLight`.
- Enable shadows only when needed.
- Avoid 4 or 5 light sources unless there is a clear reason.

## Performance Guardrails

- Reuse materials and geometries.
- Avoid extremely high segment counts.
- Remove debug helpers before final delivery.
- Keep draw calls low.

## State Management Safety

If the game freezes when time runs out, the common cause is multiple systems
trying to end the game.

Rules:
- Use one `state.mode`.
- Use one transition function.
- Clamp timers once.
- Use a boolean latch such as `hasEnded`.
