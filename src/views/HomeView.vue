<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameHistoryStore } from '../stores/gameHistory'
import { useGameSessionStore } from '../stores/gameSession'

const historyStore = useGameHistoryStore()
const sessionStore = useGameSessionStore()
const router = useRouter()

const lastFiveGames = computed(() => historyStore.lastFiveGames)
const topPlayers = computed(() => historyStore.topPlayers)

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function quickStart(game) {
  const template = game.template
  const players = game.players.map(p => ({ id: p.id, name: p.name }))
  sessionStore.startGame(template, players)
  router.push('/play')
}
</script>

<template>
  <div class="dashboard">
    <h1>Score Sheet</h1>
    
    <div v-if="sessionStore.activeGame" class="active-game-banner">
      <p>You have an active game: <strong>{{ sessionStore.activeGame.template.name }}</strong></p>
      <RouterLink to="/play" class="btn-resume">Resume Game</RouterLink>
    </div>

    <section v-if="lastFiveGames.length > 0" class="dashboard-section">
      <div class="section-header">
        <h2>Recent Games</h2>
        <div class="header-links">
          <RouterLink to="/play" class="header-link">Start New Game</RouterLink>
          <span class="separator">|</span>
          <RouterLink to="/history" class="header-link">View Full History</RouterLink>
        </div>
      </div>
      <div class="games-list">
        <div v-for="game in lastFiveGames" :key="game.id" class="game-card">
          <div class="game-info">
            <h3>{{ game.template.name }}</h3>
            <p class="game-date">{{ formatDate(game.endTime) }}</p>
            <p v-if="game.winner" class="game-winner">
              Winner: <strong>{{ game.winner.name }}</strong> ({{ game.winner.totalScore }})
            </p>
          </div>
          <button @click="quickStart(game)" class="btn-quick-start">
            Replay
          </button>
        </div>
      </div>
    </section>

    <div class="dashboard-grid">
      <section v-if="topPlayers.length > 0" class="dashboard-section">
        <div class="section-header">
          <h2>Top Players</h2>
          <div class="header-links">
            <RouterLink to="/players" class="header-link">Add New Player</RouterLink>
            <span class="separator">|</span>
            <RouterLink to="/players" class="header-link">View List</RouterLink>
          </div>
        </div>
        <ul class="stats-list">
          <li v-for="player in topPlayers" :key="player.name">
            <span class="player-name">{{ player.name }}</span>
            <span class="player-count">{{ player.count }} games</span>
          </li>
        </ul>
      </section>

      <section class="dashboard-section quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <RouterLink to="/play" class="action-btn">Start New Game</RouterLink>
          <RouterLink to="/players" class="action-btn secondary">Manage Players</RouterLink>
          <RouterLink to="/game-templates" class="action-btn secondary">Game Templates</RouterLink>
        </div>
      </section>
    </div>

    <div v-if="lastFiveGames.length === 0" class="welcome-message">
      <p>Welcome! Start your first game to see your history and stats here.</p>
      <RouterLink to="/play" class="btn-start">Get Started</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.active-game-banner {
  background-color: #42b883;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-resume {
  background-color: white;
  color: #42b883;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.dashboard-section h2 {
  margin: 0;
  font-size: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.header-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: #42b883;
}

.header-links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.separator {
  color: #dee2e6;
  font-size: 0.8rem;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.game-info h3 {
  margin: 0;
  font-size: 1.2rem;
}

.game-date {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0.25rem 0;
}

.game-winner {
  margin: 0.5rem 0 0 0;
}

.btn-quick-start {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.stats-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stats-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f3f5;
}

.stats-list li:last-child {
  border-bottom: none;
}

.player-name {
  font-weight: 500;
}

.player-count {
  color: #6c757d;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  display: block;
  text-align: center;
  padding: 0.8rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
}

.action-btn.secondary {
  background-color: #6c757d;
}

.welcome-message {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.btn-start {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
}

@media (prefers-color-scheme: dark) {
  .game-card, .welcome-message {
    background-color: #2a2a2a;
    border-color: #444;
  }
  .game-date, .player-count {
    color: #aaa;
  }
  .btn-quick-start {
    background-color: #333;
    border-color: #555;
    color: white;
  }
  .stats-list li {
    border-bottom-color: #333;
  }
  .section-header {
    border-bottom-color: #444;
  }
  .separator {
    color: #444;
  }
}
</style>
