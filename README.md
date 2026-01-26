# score-sheet
An app to keep score while playing various board and card games.

## Development Roadmap

### Phase 1: Project Setup & Foundation
- [x] Initialize project as a Single Page Application (SPA) using Vue.js
- [x] Set up basic routing
- [x] Basic styling framework/layout (Mobile-first approach)

### Phase 2: Core Data Management
- [x] **Player Management**
    - [x] List existing players
    - [x] Add new players
    - [x] Edit/Delete players
- [x] **Game Templates Management**
    - [x] List game templates
    - [x] Create/Edit game templates:
        - [x] Game Name
        - [x] Scoring type (Normal vs. Reverse)

### Phase 3: Persistence & Offline Support
- [x] Implement local data persistence (LocalStorage)
- [x] PWA Setup
    - [x] Web Manifest for "Add to Home Screen" (with mobile icons and splash screens)
    - [x] Service Worker for offline availability

### Phase 4: Scoring Interface (The Score Sheet)
- [x] **Game Initialization**
    - [x] Select a game template
    - [x] Select players for the session
- [x] **Score Entry Table**
    - [x] Table layout: Players across top, rounds down the side
    - [x] Input cells: Large touch-friendly targets
    - [x] Keyboard support: Numeric keyboard triggered by default on mobile
    - [x] Navigation: Pressing 'Enter' moves focus to the next cell
- [x] **Real-time Feedback**
    - [x] Sticky footer showing total scores per player
    - [x] Responsive horizontal scrolling for many players
    - [x] High contrast for outdoor/bright light visibility
- [x] **Game Lifecycle**
    - [x] "Keep screen awake" functionality
    - [x] Option to finish game and view final results

### Phase 5: Dashboard & Polish
- [x] **Home Screen Dashboard**
    - [x] Last 5 games played (Name, date, winner)
    - [x] Quick-start most recent game settings
    - [x] Top 5 players (by games played)
    - [x] Dashboad refinements (New game/player links)
    - [x] Full game history page
- [x] **UI/UX Polish**
    - [x] Convert top menu to bottom tab navigation with Material Icons
    - [x] Final UI/UX refinements (Mobile-first optimization)

### Phase 6: Deployment
- [ ] Configure for Firebase Hosting
- [ ] Final production build and deploy
