<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameHistoryStore } from '../stores/gameHistory'
import { useGameSessionStore } from '../stores/gameSession'

const historyStore = useGameHistoryStore()
const sessionStore = useGameSessionStore()
const router = useRouter()

const allGames = computed(() => historyStore.history)

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

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="history-view">
    <div class="header">
      <button @click="goBack" class="btn-back">← Back</button>
      <h1>Game History</h1>
    </div>

    <div v-if="allGames.length === 0" class="empty-state">
      <p>No games played yet.</p>
      <RouterLink to="/play" class="btn-start">Start a Game</RouterLink>
    </div>

    <div v-else class="games-list">
      <div v-for="game in allGames" :key="game.id" class="game-card">
        <div class="game-info">
          <h3>{{ game.template.name }}</h3>
          <p class="game-date">{{ formatDate(game.endTime) }}</p>
          <div class="game-details">
            <p v-if="game.winner" class="game-winner">
              Winner: <strong>{{ game.winner.name }}</strong> ({{ game.winner.totalScore }})
            </p>
            <div class="player-scores">
              <span v-for="player in game.players" :key="player.id" class="player-pill">
                {{ player.name }}: {{ player.totalScore }}
              </span>
            </div>
          </div>
        </div>
        <button @click="quickStart(game)" class="btn-replay">
          Replay
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  background: none;
  border: none;
  padding: 0.5rem;
  font-size: 1rem;
  color: #42b883;
  cursor: pointer;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  gap: 1rem;
}

.game-info {
  flex-grow: 1;
}

.game-info h3 {
  margin: 0;
  font-size: 1.2rem;
}

.game-date {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0.25rem 0 0.75rem 0;
}

.game-winner {
  margin: 0 0 0.5rem 0;
}

.player-scores {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.player-pill {
  font-size: 0.8rem;
  background-color: #e9ecef;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.btn-replay {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  align-self: center;
}

.empty-state {
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
  .game-card, .empty-state {
    background-color: #2a2a2a;
    border-color: #444;
  }
  .game-date {
    color: #aaa;
  }
  .player-pill {
    background-color: #333;
    color: #ccc;
  }
  .btn-replay {
    background-color: #333;
    border-color: #555;
    color: white;
  }
}

@media (max-width: 480px) {
  .game-card {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-replay {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
