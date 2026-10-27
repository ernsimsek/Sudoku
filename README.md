# Sudoku Master

A quiet, browser-based Sudoku game built with React and TypeScript. Choose a difficulty, work through the grid at your own pace, and return to a new daily puzzle each day.

## Features

- Five difficulty levels: Easy, Medium, Hard, Expert, and Master
- Daily puzzles generated from the current date
- Pencil notes, undo, erase, and up to three hints per game
- Keyboard navigation and number-pad input
- Autosaved games, preferences, and personal statistics in browser storage
- XP, levels, streaks, daily missions, and achievements
- Light and dark themes, sound effects, and configurable board highlights
- Responsive layout with reduced-motion support

> Progress is stored locally in your browser. It does not sync between devices, and clearing site data removes it. The leaderboard displays sample data and is not connected to a multiplayer service.

## Requirements

- Node.js 22.12 or newer
- npm (included with Node.js)

No account, API key, environment file, or backend service is required.

## Getting started

```bash
git clone https://github.com/ernsimsek/Sudoku.git
cd Sudoku
npm ci
npm run dev
```

Open the local URL printed by Vite, usually <http://localhost:5173>.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run typecheck` | Check TypeScript types without emitting files |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

Before opening a pull request, run:

```bash
npm ci
npm run typecheck
npm run build
```

There is currently no automated test suite.

## Keyboard controls

| Key | Action |
| --- | --- |
| Arrow keys | Move the selected cell |
| `1`–`9` | Enter a value or pencil note |
| `N` | Toggle notes mode |
| `Backspace`, `Delete`, or `0` | Erase the selected cell |
| `Ctrl+Z` / `Cmd+Z` | Undo the previous move |

## Tech stack

- React 19 and TypeScript
- Vite 7 with Tailwind CSS 4
- Zustand for game state and local persistence
- Framer Motion for interface animations

The Sudoku generator and game logic are in `src/lib/sudoku.ts`; persisted game state is managed in `src/store/gameStore.ts`.

## Project structure

```text
src/
├── components/  Game board, controls, and reusable interface components
├── lib/         Sudoku generation, achievements, sound, and XP rules
├── pages/       Landing, game, daily, statistics, and settings screens
├── store/       Zustand game state and browser persistence
├── types/       Shared TypeScript models
├── App.tsx      Page switching and global interface
└── index.css    Theme tokens, board styles, and responsive layout
```

## Deployment

`npm run build` creates a static site in `dist/`. It can be hosted on any static web host. The Vite single-file plugin embeds the JavaScript and CSS in `dist/index.html`; the favicon and web fonts are loaded separately.

## Contributing

Bug reports and focused improvements are welcome. Please include steps to reproduce bugs and describe the behavior a change affects. Run the type check and production build before submitting a pull request.
