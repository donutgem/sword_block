---
name: game-controls
description: Use when building, changing, or debugging player controls for a Quest Three.js game, especially first-person, third-person, driving, flying, shooter, camera-relative movement, mouse-look, pointer lock, WASD movement, steering, or movement direction bugs.
---

# Game Controls

Use this skill when a game needs player movement, camera controls, or vehicle
controls.

If the game uses Three.js, also use `threejs-game`.

The goal is to keep these three things aligned:
- What direction the player or vehicle faces.
- What direction the camera faces.
- What direction movement or velocity goes.

Do not hide a direction bug by swapping key labels. Fix the movement math.

## Facing Direction Rule

Any moving character, enemy, vehicle, projectile, or aircraft must visually face
the direction it is meant to travel or aim.

Always verify the model's forward axis before wiring movement:
- Three.js object forward is usually local `-Z`, but imported models may face a
  different local direction.
- A person or enemy should not run backward while chasing or patrolling.
- A car should drive toward its front, not slide sideways or reverse by default.
- A plane should fly nose-first, not sideways, downward, or perpendicular to its
  flight path.
- A projectile should point along its velocity if it has a visible nose or tip.

When creating or debugging a moving model, add temporary direction markers to
the model or its parent:
- Put a small colored dot, sphere, or label at the local front.
- Add matching markers for back, left, right, up, and down when roll, pitch,
  banking, aiming, or vehicle controls depend on those axes.
- Name the marker objects clearly, such as `frontMarker`, `backMarker`,
  `leftMarker`, `rightMarker`, `upMarker`, and `downMarker`.
- Use the markers to confirm which axis should drive forward movement,
  steering, pitch, yaw, and roll.
- For aircraft or rolling vehicles, the roll axis should run from back to front.
- Remove the markers before final delivery unless the user wants visible debug
  helpers.

If the mesh's art faces the wrong way, wrap it in a parent `Object3D` and rotate
the mesh once inside that parent. Then move and steer the parent. Do not scatter
direction fixes across movement code, animation code, and camera code.

After movement is implemented, do one quick visual check:
- Move forward and confirm the front of the model leads.
- Turn left and right and confirm the model's nose, face, or front turns with
  the path.
- For enemies, confirm they face the player or waypoint before moving toward it.
- For aircraft, confirm pitch and heading match the intended flight direction.

## Ask When The Style Is Ambiguous

Ask one short question before building if the control style changes the design.

For third-person games:

```txt
What kind of third-person controls should this use?
A. Shooter style: mouse turns the camera and player aim together
B. Adventure style: mouse orbits the camera around the player
C. Something else
```

For flying games:

```txt
What kind of flying controls should this use?
A. Simple arcade flying
B. More realistic pitch, roll, and yaw controls
C. Something else
```

If the user already made the style clear, do not ask. Build that style.

## Required Control Audit

After implementing controls, test every relevant input in the browser:
- Mouse left and right.
- Mouse up and down.
- `W`, `A`, `S`, and `D`.
- Turn left and turn right.
- Move forward after turning.
- Move backward after turning.
- Camera follow or camera orbit.

If forward movement curves opposite the camera turn, the yaw sign or forward
vector is wrong.

If `A` and `D` are swapped, the right-vector math is wrong.

If the object rotates one way but travels another way, facing and velocity are
not using the same direction source.

## First-Person Controls

First-person games should use pointer lock for mouse-look unless the user asks
for another style.

Rules:
- Mouse X turns left and right.
- Mouse Y looks up and down.
- Clamp vertical look so the camera cannot flip over.
- `W` moves forward in the camera's facing direction.
- `S` moves backward.
- `A` strafes left.
- `D` strafes right.
- Forward movement usually uses camera yaw on the XZ ground plane.
- Do not let looking up make the player fly unless the game is meant to fly.

Use one source of truth for yaw. The camera and movement should not each invent
their own opposite rotation.

## Third-Person Controls

Do not omit mouse controls in a third-person desktop game unless the user asks
for keyboard-only controls.

Pick one style and make the math match it.

Shooter-style rules:
- Mouse controls the camera direction and player aim direction.
- `W` moves toward where the camera/player is facing.
- `A` and `D` strafe left and right relative to that facing direction.
- The player model should visually face the same general direction as aiming.

Adventure-style rules:
- Mouse orbits the camera around the player.
- WASD movement is usually relative to the camera's ground-plane direction.
- The character turns toward the movement direction.
- The camera can move around the player without instantly forcing player aim.

For both styles:
- Define which object owns yaw: camera rig, player, or both together.
- Keep the camera, player facing, and movement vector intentionally related.
- Test movement after rotating the camera 90 degrees.

## Driving Controls

Driving games should use the car's heading as the source for both visual
rotation and velocity.

Rules:
- `W` accelerates forward along the car's current heading.
- `S` brakes or reverses, depending on the game style.
- `A` turns left.
- `D` turns right.
- Turning right should rotate the car right, move the car right, and make the
  follow camera track that same heading.
- Turning left should rotate the car left, move the car left, and make the
  follow camera track that same heading.

Do not rotate the mesh using one angle and move it using a different angle.

For roads and ground:
- Do not place the road surface on the exact same plane as the ground.
- Give the road a clear, consistent height above the ground or make it part of
  the ground mesh.
- Verify there is no flickering when the camera moves.

## Flying Controls

Choose simple arcade flying by default unless the user asks for simulator-like
controls.

Simple arcade flying:
- Mouse or keys should let the player change heading.
- The player must be able to turn around, not only slide sideways.
- Forward movement should follow the craft's current facing direction.
- Make the controls easy to understand before making them realistic.

More realistic flying:
- Define pitch, roll, and yaw explicitly.
- `W` usually pitches the nose down.
- `S` usually pitches the nose up.
- `A` and `D` may roll left and right.
- If roll exists, also provide a practical way to change heading, such as yaw
  input or turn behavior tied to roll.

If the game uses inverted pitch, state that choice in code names or comments so
it is intentional.

## Browser Verification

Before finishing, run the game and verify:
- Mouse-look works on both axes when expected.
- Pointer lock starts after click when expected.
- WASD directions match the selected control style.
- Forward movement follows the selected facing direction.
- Camera follow does not fight the player or vehicle movement.
- No road, floor, or runway flickers from overlapping planes.

Final response should tell the student the exact controls to test.
