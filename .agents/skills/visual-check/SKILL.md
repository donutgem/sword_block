---
name: visual-check
description: Use when deciding whether to take screenshots, use Playwright or browser automation, open a browser, or do a quick visual verification pass for a Quest browser game or UI, especially after frontend, canvas, Three.js, camera, layout, orientation, or visibility changes.
---

# Visual Check

Use this skill for screenshots, Playwright decisions, and short
first-impression browser checks.

The goal is simple: can the student see what they are supposed to see?

Good reasons to do a visual check:
- A new game or scene was built.
- The camera, lighting, scale, spawn position, or model direction changed.
- A canvas, Three.js scene, HUD, menu, or responsive layout changed.
- The user reports that something is invisible, facing the wrong way, clipped,
  covered, too small, too large, or visually confusing.

## Keep The Check Small

Open the game or page and look for obvious visual correctness:
- The page loads without a blank screen.
- The main character, vehicle, board, scene, or UI is visible.
- The camera is pointed at the important thing.
- The player or object appears to face the intended direction.
- The ground, level, or play area is framed sensibly.
- Text and buttons are not overlapping or cut off.
- Canvas or WebGL content is not stretched, tiny, black, or offscreen.

This is not a full test suite. Do not turn a visual check into exhaustive
browser automation.

## Screenshots

Take screenshots when they help answer a visual question quickly.

Use screenshots for:
- First-load confirmation.
- Before/after comparison after a visual fix.
- Checking orientation, framing, scale, clipping, overlap, or blank-screen
  problems.

Avoid screenshots when:
- The change is purely data, logic, or text-only code.
- A normal build or unit check already answers the question.
- The project instructions say not to use screenshots.

Usually one screenshot is enough. Use a second screenshot only when a different
viewport, state, or before/after comparison matters.

## Browser Automation

Use browser automation sparingly.

Appropriate automation:
- Open the page.
- Wait briefly for the scene to render.
- Click once to start a game or enter pointer lock when needed.
- Press a small number of keys to confirm the first visible state changes as
  expected.
- Capture a screenshot or inspect console errors.

Avoid automation for:
- Long gameplay scripts.
- Repeated smoke tests after every tiny edit.
- Pixel-perfect assertions.
- Exhaustive control testing unless the user specifically asks for it.
- Replacing the student's own playtesting.

If the project or user says not to use Playwright, do not use Playwright. Use
an allowed browser/screenshot tool, a manual dev-server link, console output,
or ask the user to check the visual result.

## Playwright Guidance

Playwright is acceptable only when it is allowed by the project and it is the
best available way to do a quick visual check.

When using Playwright:
- Keep the script short.
- Prefer one page load and one screenshot.
- Use only the minimum clicks or key presses needed to reveal the first useful
  view.
- Stop after confirming the first impression or finding the visible problem.

Do not use Playwright as the default answer to every frontend change.

## What To Report

In the final response, keep the visual result brief:
- Say whether the page/scene loaded.
- Mention the one or two visual facts that mattered.
- Mention any tool limitation, such as when screenshots or Playwright were
  skipped because project instructions forbid them.
