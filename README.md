# Sudoku Master

A little space to think.

Sudoku Master is a browser-based Sudoku app built around a simple daily ritual: pick a puzzle, follow the clues, and enjoy finding the next number. Warm paper tones, sage accents, and a restrained interface keep the grid at the center of the experience.

## What you can do

- Play generated puzzles across five difficulty levels: Easy, Medium, Hard, Expert, and Master.
- Return to a date-seeded daily puzzle.
- Add pencil notes, undo a move, erase a cell, or use one of three hints.
- Navigate the grid with your keyboard or use the on-screen number pad.
- Pause a game and continue later, with progress stored in your browser.
- Track wins, solve times, streaks, XP, levels, daily missions, and achievements.
- Choose a light or dark appearance and adjust sound, highlights, and timer preferences.

## Run locally

Use Node.js 22.12+ and npm. No account, API key, environment file, or backend service is required.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Build and validate

```sh
npm run build
npx tsc --noEmit
npm run preview
```

The production build is written to `dist/`. The Vite single-file plugin embeds the application JavaScript and CSS into `dist/index.html`. Serve the build using any static web host. The favicon and externally loaded fonts remain separate resources.

There is currently no automated test suite. The TypeScript check and production build are the available command-line checks.

## Keyboard controls

Select a cell to get started.

| Key | Action |
| --- | --- |
| Arrow keys | Move around the grid |
| `1`–`9` | Enter a number or pencil note |
| `N` | Toggle notes mode |
| `Backspace`, `Delete`, or `0` | Erase the selected cell |
| `Ctrl+Z` / `Cmd+Z` | Undo the previous move |

Hints, pause, and other controls are available in the game interface.

## Built with

React 19 and TypeScript power the interface. Vite handles development and bundling, Zustand manages game state and persistence, and Framer Motion provides transitions. Styling combines Tailwind CSS 4 with custom CSS; A custom SVG icon set uses open corners, puzzle grids, and pencil marks throughout the interface.

## Project map

```text
src/
  components/
    game/         Grid, number pad, game header, and completion dialog
    ui/           Missions, achievement notifications, and XP feedback
  lib/            Puzzle generation, sound, achievements, and XP rules
  pages/          Home, game, daily puzzle, statistics, and settings
  store/          Zustand game state and browser persistence
  types/          Shared TypeScript models
  index.css       Theme tokens, grid styles, and responsive home layout
  App.tsx         Page switching and global interface
```

The puzzle engine lives in `src/lib/sudoku.ts`. It uses backtracking to create solved grids and checks solution counts while removing clues. The daily puzzle is derived from a date seed. Game actions, rewards, and saved state are coordinated in `src/store/gameStore.ts`.

## Your data

Game progress, preferences, and statistics are stored in this browser's local storage under `sudoku-master-v2`. They are not synchronized between devices. Clearing site data removes your saved progress; private browsing may discard it when the session ends.

The leaderboard currently uses sample data. It is a demonstration interface, not a live multiplayer ranking service. Theme options beyond light and dark currently share the dark appearance, and some settings are placeholders for future behavior.

## Design direction

The interface takes its cues from a puzzle notebook: warm off-white surfaces, forest and sage greens, fine rules, serif headlines, and a small grid mark. The home page keeps puzzle selection close at hand, with a daily puzzle and personal progress below it. Mobile layouts use compact difficulty rows and a bottom navigation bar. Reduced-motion preferences are respected by CSS animations and transitions.

## Contributing

Keep changes focused and describe the behavior they affect. Before submitting a change, run the production build and TypeScript check, then verify the relevant screen at desktop and mobile widths. For puzzle-engine changes, check that generated grids follow Sudoku rules and that puzzles retain a unique solution.
