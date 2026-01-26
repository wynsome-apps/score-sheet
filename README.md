# score-sheet
An app to keep score while playing various board and card games.

## Development Roadmap

### Phase 1: Project Setup & Foundation
- [x] Initialize project as a Single Page Application (SPA) using Vue.js
- [x] Set up basic routing
- [x] Basic styling framework/layout

### Phase 2: Core Data Management
- [ ] **Player Management**
    - [ ] List existing players
    - [ ] Add new players
    - [ ] Edit/Delete players
- [ ] **Game Settings Management**
    - [ ] List game templates
    - [ ] Create/Edit game settings:
        - [ ] Game Name
        - [ ] Scoring type (Normal vs. Reverse)

### Phase 3: Scoring Interface (The Score Sheet)
- [ ] **Game Initialization**
    - [ ] Select a game template
    - [ ] Select players for the session
- [ ] **Score Entry Table**
    - [ ] Table layout: Players across top, rounds down the side
    - [ ] Input cells: Number fields with numeric keyboard support
    - [ ] Navigation: Pressing 'Enter' moves focus to the next cell
- [ ] **Real-time Feedback**
    - [ ] Sticky footer showing total scores per player
    - [ ] Responsive horizontal scrolling for many players
- [ ] **Game Lifecycle**
    - [ ] "Keep screen awake" functionality
    - [ ] Option to finish game and view final results

### Phase 4: Persistence & Offline Support
- [ ] Implement local data persistence (LocalStorage or IndexedDB)
- [ ] PWA Setup
    - [ ] Web Manifest for "Add to Home Screen"
    - [ ] Service Worker for offline availability

### Phase 5: Dashboard & Polish
- [ ] **Home Screen Dashboard**
    - [ ] Last 5 games played (Name, date, winner)
    - [ ] Quick-start most recent game settings
    - [ ] Top 5 players (by games played)
- [ ] Final UI/UX refinements

### Phase 6: Deployment
- [ ] Configure for Firebase Hosting
- [ ] Final production build and deploy
