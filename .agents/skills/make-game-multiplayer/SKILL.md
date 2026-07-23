---
name: make-game-multiplayer
description: Use when a Quest student project asks for multiplayer, networking, rooms, syncing players, shared world state, live sessions, co-op, versus play, or other real-time multiplayer features. This skill requires the Quest Multiplayer SDK and forbids custom backends for Quest Student Deploy.
---

# Make A Quest Student Game Multiplayer

Use this skill when adding multiplayer to a student browser game that will be deployed with Quest Student Deploy.

Quest Student Deploy hosts static browser builds only. Do not create or upload a backend server.

## Non-Negotiable Rules

- Do not create an Express server.
- Do not create a Socket.IO server.
- Do not create a Colyseus server.
- Do not create a custom WebSocket backend.
- Do not add a separate hosted multiplayer service.
- Keep the final deploy as static HTML, CSS, JavaScript, and assets.
- Use the Quest Multiplayer SDK.
- Keep single-player mode working unless the student explicitly asks to remove it.

## SDK URLs

Use the ES module URL when possible:

```js
import QuestMultiplayer from "https://app.joinquest.com/student-deploy/quest-multiplayer.mjs";
```

Use the script/global URL only when the project is not using ES modules:

```html
<script src="https://app.joinquest.com/student-deploy/quest-multiplayer.js"></script>
```

Then:

```js
const session = await window.QuestMultiplayer.join(options);
```

## Core API

- `const session = await QuestMultiplayer.join(options)`
- `await session.leave()`
- `session.getPlayerId()`
- `session.getPlayers()`
- `session.getSharedState()`
- `session.updatePresence(patch)`
- `session.patchSharedState(patch)`
- `session.sendEvent(type, payload)`
- `session.onPlayersChange(callback)`
- `session.onSharedStateChange(callback)`
- `session.onEvent(type, callback)`
- `session.onConnectionChange(callback)`

Join options:
- `nickname` is required.
- `apiBase` should be passed explicitly when possible.
- `project` is optional and can be used for local testing.

## Implementation Workflow

1. Inspect the game structure before editing.
2. Keep the existing game loop and controls intact.
3. Add a small multiplayer module, such as `src/multiplayer.js`.
4. Ask the player for a nickname before joining.
5. Join only after a user action like "Play Multiplayer" or "Join Room".
6. Sync local player transforms with `updatePresence()` on an interval.
7. Render remote players from `onPlayersChange()`.
8. Store world changes late joiners need with `patchSharedState()`.
9. Send temporary actions with `sendEvent()`.
10. Add clear disconnect and error UI.
11. Verify single-player still works.

## What Goes Where

Use `updatePresence()` for fast-changing player-specific state:
- position
- velocity
- rotation
- animation
- selected tool
- status

Use `patchSharedState()` for room-wide state late joiners should receive:
- placed blocks
- removed blocks
- opened doors
- puzzle switches
- shared score
- round state

Use `sendEvent(type, payload)` for temporary actions:
- shoot
- jump
- hit
- chat
- sound effects
- short visual effects

## Presence Example

Send presence on a timer, not every frame. About every 125ms to 250ms is usually enough.

```js
let lastPresenceSentAt = 0;

function updateMultiplayerPresence(session, player, now) {
  if (!session || now - lastPresenceSentAt < 150) {
    return;
  }

  lastPresenceSentAt = now;

  session.updatePresence({
    position: { x: player.x, y: player.y, z: player.z },
    rotation: { y: player.rotationY },
    animation: player.animation,
  });
}
```

## Join Pattern

```js
import QuestMultiplayer from "https://app.joinquest.com/student-deploy/quest-multiplayer.mjs";

let multiplayerSession = null;

export async function joinMultiplayer({ onPlayersChange, onSharedStateChange, onConnectionChange }) {
  const nickname = window.prompt("Choose a nickname:");
  if (!nickname) {
    return null;
  }

  try {
    multiplayerSession = await QuestMultiplayer.join({
      nickname,
      apiBase: "https://app.joinquest.com",
    });

    multiplayerSession.onPlayersChange(onPlayersChange);
    multiplayerSession.onSharedStateChange(onSharedStateChange);
    multiplayerSession.onConnectionChange(onConnectionChange);

    return multiplayerSession;
  } catch (error) {
    console.error("Failed to join multiplayer", error);
    alert(`Failed to join multiplayer: ${error.message}`);
    return null;
  }
}
```

## Remote Player Pattern

```js
session.onPlayersChange((players) => {
  for (const remotePlayer of players) {
    if (remotePlayer.playerId === session.getPlayerId()) {
      continue;
    }

    const position = remotePlayer.presence?.position;
    if (!position) {
      continue;
    }

    upsertRemotePlayer(remotePlayer.playerId, {
      nickname: remotePlayer.nickname,
      x: position.x,
      y: position.y,
      z: position.z,
    });
  }
});
```

## Block Or World Edit Pattern

For Minecraft-style or block-based games, never send the whole world every frame.

Keep the base world generated locally, then store only changed blocks:

```js
session.patchSharedState({
  blocks: {
    "10,4,22": "air",
  },
});
```

Apply shared state changes:

```js
session.onSharedStateChange(({ sharedState }) => {
  const blocks = sharedState.blocks || {};

  for (const [key, blockType] of Object.entries(blocks)) {
    const [x, y, z] = key.split(",").map(Number);
    applyBlockChange(x, y, z, blockType);
  }
});
```

## Local Development

When testing locally against a local Quest app, use:

```js
apiBase: "http://localhost:3000"
```

When testing against production, use:

```js
apiBase: "https://app.joinquest.com"
```

If the game is previewed outside a real Quest deployed project URL, pass the `project` object explicitly:

```js
await QuestMultiplayer.join({
  nickname,
  apiBase: "https://app.joinquest.com",
  project: {
    studentSlug: "student-slug",
    projectSlug: "project-slug",
    versionNumber: 1,
  },
});
```

Do not invent these values. Ask the student for them or use values printed by Quest.

## Limits

- Max 10 players per deployed project version.
- Nicknames are required.
- Rooms are temporary and in-memory.
- Rooms reset when empty or when the server restarts.
- Different project versions do not share the same room.
- This SDK is not for persistent MMO-style games or heavy server-authoritative simulations.

## More Detail

For the full reference, read:
https://agents.joinquest.com/docs/multiplayer-sdk.md
