---
name: clarify-request
description: Use when a Quest student request is short, vague, or could mean several different things, and it is not already covered by the project-planner or fix-game-bug skills. Ask a small clarifying question before inspecting files or editing code.
---

# Clarify A Student Request

Use this skill when the student's message is unclear and you need to understand
what they mean before acting.

Do not use this skill for vague bug reports. Use
`.agents/skills/fix-game-bug/SKILL.md` instead.

Do not use this skill for vague new games, big features, major redesigns, or
project ideas. Use `.agents/skills/project-planner/SKILL.md` instead.

## First Response Rule

If the request is short, vague, or could mean several different things, stop
before inspecting files, running commands, or editing code.

First, restate what you think the student means in plain language. Then ask 1
or 2 short questions that help choose the right action.

Keep questions simple and concrete. Prefer 2 or 3 clear options when possible.

Example:

```txt
I think you want the start screen to look better, but I am not sure which part
you mean.

Which part should I change first?
A. The title text
B. The play button
C. The background
D. Something else
```

## When You Can Skip Clarifying

You may act directly when the student gives a specific request with enough
detail to make the change safely.

Clear examples:
- "Change the player speed from 5 to 8."
- "Make the shoot key Space instead of F."
- "Make the start button blue."
- "Rename the title to Space Miner."
- "Move the score to the top-right corner."

## Good Clarifying Questions

Ask about visible behavior or the decision the student needs to make:
- "Which screen should change?"
- "Which object should be bigger?"
- "What should happen when the player clicks it?"
- "Do you want this to be easier, harder, or just look different?"
- "Should this change happen everywhere or only on this level?"

Do not ask for technical architecture unless the student already brought it up.

## After The Student Answers

After the student clarifies the request:
1. Restate the action in one short sentence if needed.
2. Use the relevant skill if the answer points to one.
3. Inspect only the files needed for that action.
4. Make the smallest useful change.
5. Tell the student what changed and how to test it.
