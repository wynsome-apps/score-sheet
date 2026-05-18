# Score Sheet - Agent Guidelines

## Overview
An app to keep score while playing various board and card games. It's a Single Page Application (SPA) designed with a mobile-first approach and PWA support.

## Tech Stack
- **Framework:** Vue 3 (Composition API)
- **State Management:** Pinia
- **Routing:** Vue Router
- **Build Tool:** Vite
- **Icons:** Material Design Icons (`@mdi/js`) via `@jamescoyle/vue-icon`
- **Deployment:** Firebase Hosting
- **Persistence:** LocalStorage (handled within Pinia stores)

## Project Structure
- `src/stores/`: Pinia stores for state management (players, game sessions, templates, history).
- `src/views/`: Main page components.
- `src/components/`: Reusable Vue components.
- `src/assets/`: Static assets like images and logos.
- `public/`: Assets served directly (PWA icons, etc.).

## Coding Conventions
- **Vue Components:** Use `<script setup>` syntax.
- **State Management:** Use the functional/setup syntax for Pinia stores.
- **Styling:**
  - Follow a mobile-first responsive design.
  - Use CSS variables for consistent styling.
  - Support dark mode using `@media (prefers-color-scheme: dark)`.
  - Use large, touch-friendly targets for mobile users.
- **Persistence:** All relevant app state should be persisted to `localStorage` to support offline use and page refreshes.

## Development & Deployment Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run preview`: Preview the production build locally.
- `npm run deploy`: Build and deploy to Firebase Hosting.

## Offline & PWA
The app uses `vite-plugin-pwa` for service worker management and manifest generation. Ensure that any new assets are added to the PWA configuration in `vite.config.js` if they need to be cached.
