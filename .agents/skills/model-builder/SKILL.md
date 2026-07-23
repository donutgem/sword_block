---
name: model-builder
description: Use when a student asks to make, improve, redesign, polish, edit, inspect, view, or tweak a 3D model in a Three.js game, especially code-built primitive models such as players, enemies, vehicles, buildings, props, collectibles, weapons, trees, obstacles, or landmarks. Also use when the student wants a separate model viewer, model editor, model workshop, or isolated 3D view for adjusting a few models before putting them back in the game.
---

# Model Builder

Use this skill when making or improving Three.js models.

The goal is not to throw random primitives together. The goal is to make a
readable, intentional, code-built model that looks good from the game's normal
camera distance.

Most Quest student projects should use geometry-based models instead of heavy
downloaded assets. Build models from grouped primitives unless the student
explicitly asks for imported GLTF or model-loading work.

## Core Pattern

Create one model factory per important model:

```js
export function createSpaceshipModel() {
  const ship = new THREE.Group();
  ship.name = "spaceship";

  // Add child meshes here.

  return ship;
}
```

Rules:
- Return a `THREE.Group` or `THREE.Object3D`.
- Move, rotate, and scale the parent group in gameplay code.
- Keep child meshes positioned relative to the parent.
- Do not scatter model parts across unrelated gameplay files.
- Reuse geometries and materials where practical.
- Never create model geometry or materials inside the animation loop.

## Model Design Workflow

Before building, decide:
- What should this be recognized as from far away?
- Which side is the front?
- What is the model's job in the game?
- How big should it be compared with the player, ground, enemies, and camera?
- Does it need to show team, health, danger, rarity, or upgrade level?

Build in passes:
1. Block out the silhouette with 3 to 7 large shapes.
2. Add 2 to 8 medium details that explain what it is.
3. Add color accents, lights, windows, stripes, eyes, wheels, fins, leaves, or
   trim only where they improve readability.
4. Check it from the real game camera distance.
5. Remove tiny details that cannot be seen or that make the model noisy.

If the model still looks weak, improve the silhouette before adding more parts.

## Primitive Modeling Rules

Use primitives intentionally:
- `BoxGeometry` for bodies, crates, buildings, armor, wings, platforms, signs.
- `SphereGeometry` or `IcosahedronGeometry` for heads, blobs, gems, planets,
  rounded joints, fruit, rocks, or magic orbs.
- `CylinderGeometry` for wheels, pillars, barrels, logs, pipes, towers, engines.
- `ConeGeometry` for noses, roofs, spikes, arrows, trees, rockets, crystals.
- `TorusGeometry` for rings, tires, portals, halos, handles, shields.

Prefer low-poly and chunky shapes for student games. High-detail realism usually
looks worse, runs slower, and is harder to tune.

Do not make everything the same size, color, and rotation. Strong models need:
- A clear main body.
- A clear front or top.
- A few secondary forms.
- One or two accent colors.
- Proportions that make the role obvious.

## Make It Not Random

For each model, choose a simple visual idea:
- A fast spaceship: long nose, swept wings, bright engine glow.
- A tank enemy: wide body, squat turret, heavy tread blocks.
- A friendly robot: round head, small antenna, bright face screen.
- A magic tree: thick trunk, layered low-poly leaf clusters, glowing fruit.
- A factory: big main block, smokestack, pipes, hazard stripes.

Then make every part support that idea. Delete parts that do not help.

Avoid lazy placeholders:
- One cube with a sphere on top for every character.
- Random cones and cylinders with no clear purpose.
- Tiny details that disappear from the camera.
- Decorative parts that hide the front, team color, hitbox, or click target.
- Models that look okay only from one angle but confusing in gameplay.

## Orientation And Grounding

Every model needs a clear reference frame:
- The parent group's origin should be the gameplay anchor.
- Characters and props usually sit with their bottom at `y = 0`.
- Vehicles and enemies should face the direction they move or aim.
- Object forward in Three.js is usually local `-Z`.

If the visible art faces the wrong way, rotate child meshes inside the parent
once. Do not fix visual direction by breaking movement math.

For moving or aiming models, add temporary direction markers while building:
- front
- back
- left
- right
- up
- down

Remove markers before final delivery unless the student wants debug helpers.

## Materials And Color

Use a small palette:
- Main material.
- Secondary material.
- Dark trim or outline-like material.
- One bright accent material.
- Optional emissive material for lights, eyes, engines, gems, or magic.

Use color to communicate gameplay:
- Red/orange can mean danger or heat.
- Blue/cyan can mean energy, shield, water, or sci-fi.
- Green can mean nature, safe, poison, or healing depending on context.
- Yellow/gold can mean reward, rare, coin, or important.

Do not make the whole model one loud color unless that is the point. Use accent
colors to guide the eye.

## Model Workshop Mode

If the student asks to look at, edit, compare, inspect, tweak, or work on a few
models by themselves, create a temporary model workshop.

A model workshop is a simple page or mode that:
- Shows one selected model at a time in a clean Three.js scene.
- Uses orbit controls or simple drag-to-rotate controls.
- Adds a grid, simple light, and neutral background.
- Provides previous/next buttons or a model list when there are multiple models.
- Lets the student rotate, zoom, and inspect the model without gameplay chaos.
- Lets the student click individual primitive pieces in the model.
- Highlights the selected piece clearly.
- Shows a left-side edit panel for the selected piece.
- Includes a clear copy button that copies all model and selected-piece values.

The left panel should start with a friendly empty state such as:

```text
Select a piece of the model to change it.
```

After the student clicks a primitive piece, the panel should show controls for
that piece.

Required selected-piece controls:
- Move: `Left`, `Right`, `Up`, `Down`, `Forward`, `Back`.
- Rotate: turn left/right, tilt up/down, and roll left/right when useful.
- Size: `Bigger` and `Smaller` for uniform scale.
- Shape size: `Width`, `Height`, and `Depth` for box-like primitives when useful.
- Color or material controls when the model uses editable colors.
- Reset selected piece.
- Copy values.

Use student-friendly labels in the panel. It is okay for the copied output to
include `x`, `y`, `z`, `width`, `height`, and `depth`, but the visible controls
should say what those values mean.

For primitive picking:
- Use raycasting from the mouse or pointer position.
- Mark child meshes as selectable when creating the model.
- Give every selectable piece a useful name, such as `leftWing`,
  `frontWheel`, `treeTop`, `turret`, or `engineGlow`.
- Do not make invisible hitboxes the selected object unless the student is
  editing hitboxes.
- If the model has nested groups, select the specific visible mesh by default.

For selected-piece editing:
- Apply movement, rotation, and scale to the selected child mesh or selected
  child group, not the whole model, unless the student chooses whole-model edit.
- Keep the full model parent anchored so gameplay placement does not drift.
- Use step sizes that fit the model scale.
- Provide a step-size control if the right amount is uncertain.
- Prevent negative scale or zero dimensions.
- If editing geometry dimensions, rebuild or replace only that selected piece's
  geometry outside the animation loop.

The copy button should copy enough information for an AI to recreate the edit:
- Model name.
- Selected piece name.
- Selected piece position.
- Selected piece rotation in degrees.
- Selected piece scale.
- Width, height, and depth when applicable.
- Color/material when applicable.
- Whole model scale and front direction when useful.
- The file and function where the edit should be applied, if known.

Also include a whole-model copy option when useful so the student can copy the
entire tuned model summary, not only one piece.

Keep the workshop separate from normal gameplay when possible:
- `model-workshop.html`
- `src/modelWorkshop.js`
- `src/models/...`

Do not permanently route the game into the workshop unless the student asks.

## Editing Existing Models

When improving existing models:
- Find the model factory or mesh-building function first.
- Preserve the gameplay anchor, collision meaning, and approximate size unless
  the student asks for a size change.
- Preserve important names or references used by gameplay code.
- Improve one model at a time when several models are messy.
- Use the real camera distance to judge success.

If a model is duplicated with copy-pasted mesh code, prefer extracting a clear
factory function before adding more detail.

## Copyable Model Notes

When the student is choosing or tuning models, give them useful copyable output:
- Model name.
- Which file/function creates it.
- Front direction.
- Parent origin or anchor point.
- Important dimensions or scale.
- Materials or colors.
- Any tuner values they should keep.

This helps the student tell an AI exactly what to apply later.

## Validation

After model work:
- Run the project build or the fastest available syntax check.
- Check the model in the real scene when possible.
- For workshop work, open the workshop and confirm the model appears, rotates,
  and is not clipped or black.

Look for:
- model is too tiny or huge
- model floats or sinks
- model faces the wrong way
- model is unreadable from the camera
- too many tiny parts
- geometry or materials created every frame
- broken imports after moving model code

Final response should say what model changed, what visual idea it now uses, and
how the student can view or test it.
