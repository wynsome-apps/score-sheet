# Project Overview: Score Sheet

A mobile-first Single Page Application (SPA) designed to track scores for various board and card games. It features player management, customizable game templates, real-time score calculation, and persistent game history.

## Technology Stack
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **State Management:** Pinia
- **Routing:** Vue Router
- **PWA:** vite-plugin-pwa (offline support, manifest)
- **Icons:** Material Design Icons (`@mdi/js`, `@jamescoyle/vue-icon`)
- **Hosting:** Firebase Hosting
- **Styling:** Vanilla CSS with custom color palette and dark mode support.

## Key Features
- **Player Management:** Add, edit, and delete players.
- **Game Templates:** Define games with "Normal" (highest wins) or "Reverse" (lowest wins) scoring types.
- **Score Tracking:** Touch-friendly table interface with automatic round management and real-time totals.
- **Persistence:** LocalStorage is used for all data (players, templates, history, active session).
- **Offline Support:** PWA functionality allows usage without an active internet connection.
- **Screen Awake:** Uses the Screen Wake Lock API to prevent the device from sleeping during active games.

## Directory Structure
- `src/assets/`: Logos and static assets.
- `src/components/`: Reusable Vue components.
- `src/router/`: Route definitions (`index.js`).
- `src/stores/`: Pinia stores for state management:
  - `gameHistory.js`: Stores past game results.
  - `gameSession.js`: Manages the active game session and scoring logic.
  - `gameTemplates.js`: Manages game definitions.
  - `players.js`: Manages the player roster.
- `src/views/`: Main page components (Home, Play, Players, Games, History).
- `src/style.css`: Global styles and CSS variables.

## Building and Running

### Development
```bash
npm run dev
```
Starts the Vite development server.

### Production Build
```bash
npm run build
```
Generates the production-ready assets in the `dist/` directory.

### Preview
```bash
npm run preview
```
Previews the production build locally.

### Deployment
```bash
npm run deploy
```
Builds the project and deploys to Firebase Hosting.

## Development Conventions
- **Component Style:** Use `<script setup>` with the Vue 3 Composition API.
- **State Management:** Keep logic in Pinia stores to ensure persistence and shared state across views.
- **Styling:** Use CSS variables (defined in `style.css`) for consistent colors and spacing. Follow the mobile-first approach.
- **Icons:** Prefer Material Design Icons from `@mdi/js`.
- **Persistence:** Ensure new data types are correctly serialized/deserialized from LocalStorage in their respective stores.
- **PWA:** Be mindful of service worker caching when adding new assets to `public/`.

## Agentic Task Workflow
- Identify type of task
- If resolving bug...
  - Attempt to reproduce bug on localhost dev site via browser MCP server (if available)
  - If unable to reproduce the issue, ask the user if you should still continue with the task
- If task is of a significant size, enter plan mode. 
  - Small bugs can be resolved without plan mode.
- Work on task and edit needed code
- Test updates on localhost dev site via browser MCP server (if available)
- Loop back to fix any issues
- Present resolution to user (with a related programmer joke)