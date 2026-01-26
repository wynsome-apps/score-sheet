<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/players'
import { useGameTemplatesStore } from '../stores/gameTemplates'
import { useGameSessionStore } from '../stores/gameSession'

const playerStore = usePlayerStore()
const templateStore = useGameTemplatesStore()
const sessionStore = useGameSessionStore()

const selectedTemplateId = ref(templateStore.templates[0]?.id || '')
const selectedPlayerIds = ref([])

const activeGame = computed(() => sessionStore.activeGame)

let wakeLock = null

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen')
      console.log('Wake Lock is active')
    } catch (err) {
      console.error(`${err.name}, ${err.message}`)
    }
  }
}

function releaseWakeLock() {
  if (wakeLock !== null) {
    wakeLock.release()
    wakeLock = null
    console.log('Wake Lock released')
  }
}

onMounted(() => {
  if (activeGame.value && !activeGame.value.isFinished) {
    requestWakeLock()
  }
})

onUnmounted(() => {
  releaseWakeLock()
})

function togglePlayer(playerId) {
  const index = selectedPlayerIds.value.indexOf(playerId)
  if (index === -1) {
    selectedPlayerIds.value.push(playerId)
  } else {
    selectedPlayerIds.value.splice(index, 1)
  }
}

function startGame() {
  const template = templateStore.templates.find(t => t.id === selectedTemplateId.value)
  const players = playerStore.players.filter(p => selectedPlayerIds.value.includes(p.id))
  
  if (template && players.length > 0) {
    sessionStore.startGame(template, players)
    requestWakeLock()
  }
}

function updateScore(rIdx, pIdx, event) {
  sessionStore.updateScore(rIdx, pIdx, event.target.value)
}

function finishGame() {
  if (confirm('Are you sure you want to finish this game?')) {
    sessionStore.finishGame()
  }
}

function cancelGame() {
  if (confirm('Are you sure you want to cancel this game? All progress will be lost.')) {
    sessionStore.cancelGame()
  }
}

function onKeydown(rIdx, pIdx, event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    // Find next cell
    let nextPIdx = pIdx + 1
    let nextRIdx = rIdx
    
    if (nextPIdx >= sessionStore.activeGame.players.length) {
      nextPIdx = 0
      nextRIdx = rIdx + 1
    }
    
    const nextId = `score-${nextRIdx}-${nextPIdx}`
    const nextEl = document.getElementById(nextId)
    if (nextEl) {
      nextEl.focus()
    }
  }
}
</script>

<template>
  <div class="play-container">
    <div v-if="!activeGame" class="setup-screen">
      <h1>Start New Game</h1>
      
      <section class="setup-section">
        <h2>1. Select Game Template</h2>
        <div class="template-grid">
          <div 
            v-for="template in templateStore.templates" 
            :key="template.id"
            class="template-card"
            :class="{ active: selectedTemplateId === template.id }"
            @click="selectedTemplateId = template.id"
          >
            <h3>{{ template.name }}</h3>
            <p>{{ template.scoringType === 'normal' ? 'Highest wins' : 'Lowest wins' }}</p>
          </div>
        </div>
      </section>

      <section class="setup-section">
        <h2>2. Select Players</h2>
        <div class="player-grid">
          <div 
            v-for="player in playerStore.players" 
            :key="player.id"
            class="player-card"
            :class="{ active: selectedPlayerIds.includes(player.id) }"
            @click="togglePlayer(player.id)"
          >
            {{ player.name }}
          </div>
        </div>
        <p v-if="playerStore.players.length === 0">
          No players found. <RouterLink to="/players">Add some players</RouterLink> first.
        </p>
      </section>

      <button 
        class="start-button" 
        :disabled="!selectedTemplateId || selectedPlayerIds.length === 0"
        @click="startGame"
      >
        Start Game
      </button>
    </div>

    <div v-else class="scoring-screen" :class="{ finished: activeGame.isFinished }">
      <div class="scoring-header">
        <h1>{{ activeGame.template.name }}</h1>
        <div class="header-actions">
          <button v-if="!activeGame.isFinished" class="btn-finish" @click="finishGame">Finish Game</button>
          <button class="btn-cancel" @click="cancelGame">{{ activeGame.isFinished ? 'New Game' : 'Cancel' }}</button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="round-col">#</th>
              <th v-for="player in activeGame.players" :key="player.id">
                {{ player.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(round, rIdx) in activeGame.rounds" :key="rIdx">
              <td class="round-num">{{ rIdx + 1 }}</td>
              <td v-for="(score, pIdx) in round" :key="pIdx">
                <input 
                  :id="`score-${rIdx}-${pIdx}`"
                  type="number" 
                  inputmode="numeric"
                  :value="score"
                  :disabled="activeGame.isFinished"
                  @input="updateScore(rIdx, pIdx, $event)"
                  @keydown="onKeydown(rIdx, pIdx, $event)"
                  placeholder="0"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="sticky-footer">
        <div class="totals-row">
          <div class="total-label">Total</div>
          <div v-for="(total, idx) in sessionStore.totals" :key="idx" class="total-value">
            {{ total }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.play-container {
  max-width: 100%;
}

.setup-section {
  margin-bottom: 2rem;
}

.template-grid, .player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.template-card, .player-card {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.template-card.active, .player-card.active {
  border-color: #42b883;
  background-color: rgba(66, 184, 131, 0.1);
}

.template-card h3 {
  margin: 0 0 0.5rem 0;
}

.template-card p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.start-button {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.start-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Scoring Screen Styles */
.scoring-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 5rem; /* Space for sticky footer */
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 300px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 1;
}

.round-col, .round-num {
  width: 40px;
  background-color: #f8f9fa;
  font-weight: bold;
}

input {
  width: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 1.2rem;
  padding: 8px 0;
  outline: none;
  color: inherit;
}

input:focus {
  background-color: rgba(66, 184, 131, 0.1);
}

.sticky-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #2c3e50;
  color: white;
  padding: 0.5rem 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 10;
}

.totals-row {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Match table column widths in totals-row */
/* This is tricky without knowing column widths, 
   but since they are dynamic we'll use a similar approach to table */
.total-label {
  width: 58px; /* Approx match for round-col + borders/padding */
  flex-shrink: 0;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.total-value {
  flex: 1;
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  border-left: 1px solid rgba(255,255,255,0.2);
}

.btn-finish {
  background-color: #42b883;
  color: white;
}

.btn-cancel {
  background-color: #e74c3c;
  color: white;
}

.finished input {
  color: #888;
}

@media (prefers-color-scheme: light) {
  .template-card p {
    color: #666;
  }
  th, .round-num {
    background-color: #f0f0f0;
  }
}

@media (prefers-color-scheme: dark) {
  th, .round-num {
    background-color: #333;
  }
  .template-card p {
    color: #bbb;
  }
  .sticky-footer {
    background-color: #1a1a1a;
  }
}
</style>
