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

### Phase 3: Scoring Interface (The Score Sheet)
- [ ] **Game Initialization**
    - [ ] Select a game template
    - [ ] Select players for the session
- [ ] **Score Entry Table**
    - [ ] Table layout: Players across top, rounds down the side
    - [ ] Input cells: Large touch-friendly targets
    - [ ] Keyboard support: Numeric keyboard triggered by default on mobile
    - [ ] Navigation: Pressing 'Enter' moves focus to the next cell
- [ ] **Real-time Feedback**
    - [ ] Sticky footer showing total scores per player
    - [ ] Responsive horizontal scrolling for many players
    - [ ] High contrast for outdoor/bright light visibility
- [ ] **Game Lifecycle**
    - [ ] "Keep screen awake" functionality
    - [ ] Option to finish game and view final results

### Phase 4: Persistence & Offline Support
- [ ] Implement local data persistence (LocalStorage or IndexedDB)
- [ ] PWA Setup
    - [ ] Web Manifest for "Add to Home Screen" (with mobile icons and splash screens)
    - [ ] Service Worker for offline availability

### Phase 5: Dashboard & Polish
- [ ] **Home Screen Dashboard**
    - [ ] Last 5 games played (Name, date, winner)
    - [ ] Quick-start most recent game settings
    - [ ] Top 5 players (by games played)
- [ ] Final UI/UX refinements (Mobile-first optimization)

### Phase 6: Deployment
- [ ] Configure for Firebase Hosting
- [ ] Final production build and deploy
