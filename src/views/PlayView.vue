<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiWhiteBalanceSunny, mdiFlagCheckered, mdiExitToApp } from '@mdi/js'
import { usePlayerStore } from '../stores/players'
import { useGameTemplatesStore } from '../stores/gameTemplates'
import { useGameSessionStore } from '../stores/gameSession'

const router = useRouter()
const playerStore = usePlayerStore()
const templateStore = useGameTemplatesStore()
const sessionStore = useGameSessionStore()

const selectedTemplateId = ref(templateStore.templates[0]?.id || '')
const selectedPlayerIds = ref([])

const activeGame = computed(() => sessionStore.activeGame)

const visibleRounds = computed(() => {
  if (!activeGame.value) return []
  const rounds = activeGame.value.rounds
    .map((round, index) => ({ round, index }))
    .filter(({ round, index }) => {
      // Show the round if it's not empty
      const isEmpty = round.every(score => score === null || score === '')
      return !isEmpty
    })
  
  // Always ensure there is at least one empty row at the end for input
  // OR if there are no rounds at all, add one.
  // Actually, sessionStore.updateScore adds a new round when the last one is full.
  // We should always show the last round if it's the only round OR if the previous one is full.
  const lastRoundIdx = activeGame.value.rounds.length - 1
  const lastRound = activeGame.value.rounds[lastRoundIdx]
  const lastRoundIsEmpty = lastRound.every(score => score === null || score === '')
  
  if (lastRoundIsEmpty) {
    // If the last round is empty, we check if we should show it.
    // We show it if it's the only round OR if there are no other visible rounds.
    if (rounds.length === 0 || rounds[rounds.length - 1].index !== lastRoundIdx) {
      rounds.push({ round: lastRound, index: lastRoundIdx })
    }
  } else {
    // If the last round is NOT empty, it means sessionStore should have added a new one,
    // but let's be safe: if the last round is full, there SHOULD be another empty one.
    // sessionStore.updateScore adds it.
  }

  return rounds
})

const wakeLockSupported = 'wakeLock' in navigator
let wakeLock = null
// User intent: whether the screen should be kept awake. The actual lock can be
// dropped by the browser (e.g. when the tab is hidden) while this stays true so
// we can re-acquire it when the page comes back into focus.
const wakeLockEnabled = ref(false)
// Reflects whether we currently hold an active lock.
const wakeLockActive = ref(false)

async function requestWakeLock() {
  if (!wakeLockSupported) return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
    wakeLockActive.value = true
    // The browser releases the lock automatically when the page is hidden.
    // Track that so the toggle reflects reality and we can re-acquire later.
    wakeLock.addEventListener('release', () => {
      wakeLockActive.value = false
      wakeLock = null
    })
    console.log('Wake Lock is active')
  } catch (err) {
    wakeLockActive.value = false
    console.error(`${err.name}, ${err.message}`)
  }
}

async function releaseWakeLock() {
  if (wakeLock !== null) {
    await wakeLock.release()
    wakeLock = null
    wakeLockActive.value = false
    console.log('Wake Lock released')
  }
}

// Enable keeping the screen awake (records intent + acquires the lock).
function enableWakeLock() {
  wakeLockEnabled.value = true
  requestWakeLock()
}

// Disable keeping the screen awake (clears intent + releases the lock).
function disableWakeLock() {
  wakeLockEnabled.value = false
  releaseWakeLock()
}

function toggleWakeLock() {
  if (wakeLockEnabled.value) {
    disableWakeLock()
  } else {
    enableWakeLock()
  }
}

// Re-acquire the lock when returning to the app. The Wake Lock API drops the
// lock whenever the page is hidden (tab switch, app switch on mobile), so we
// must request it again once the page is visible and the user still wants it.
function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && wakeLockEnabled.value && !wakeLockActive.value) {
    requestWakeLock()
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
  if (activeGame.value && !activeGame.value.isFinished) {
    enableWakeLock()
  }
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  disableWakeLock()
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
    enableWakeLock()
  }
}

async function updateScore(rIdx, pIdx, event) {
  const value = event.target.value
  sessionStore.updateScore(rIdx, pIdx, value)
  
  // If the cell was cleared, it might cause the row to be hidden
  if (value === '') {
    // Wait for the row to be hidden by visibleRounds computed property
    await nextTick()
    const isStillVisible = visibleRounds.value.some(vr => vr.index === rIdx)
    if (!isStillVisible && activeGame.value) {
      // If the row disappeared because it became empty, move focus to the nearest visible row
      const prevVisibleRounds = visibleRounds.value.filter(vr => vr.index < rIdx)
      if (prevVisibleRounds.length > 0) {
        const lastVisibleRound = prevVisibleRounds[prevVisibleRounds.length - 1]
        const prevRIdx = lastVisibleRound.index
        const lastPIdx = activeGame.value.players.length - 1
        const prevId = `score-${prevRIdx}-${lastPIdx}`
        const prevEl = document.getElementById(prevId)
        if (prevEl) {
          prevEl.focus()
          setTimeout(() => prevEl.select(), 0)
        }
      } else {
        const nextVisibleRounds = visibleRounds.value.filter(vr => vr.index > rIdx)
        if (nextVisibleRounds.length > 0) {
          const nextRIdx = nextVisibleRounds[0].index
          const nextId = `score-${nextRIdx}-0`
          const nextEl = document.getElementById(nextId)
          if (nextEl) {
            nextEl.focus()
            setTimeout(() => nextEl.select(), 0)
          }
        }
      }
    }
  }
}

function finishGame() {
  if (confirm('Are you sure you want to finish this game?')) {
    sessionStore.finishGame()
  }
}

function exitGame() {
  if (confirm('Exit and save this game? You can resume it later.')) {
    sessionStore.exitGame()
    router.push('/')
  }
}

function onKeydown(rIdx, pIdx, event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    // Find next cell in visible rounds
    let currentVisibleIdx = visibleRounds.value.findIndex(vr => vr.index === rIdx)
    
    if (currentVisibleIdx === -1) {
      // If current row is hidden, find the first visible row after it
      currentVisibleIdx = visibleRounds.value.findIndex(vr => vr.index > rIdx)
      if (currentVisibleIdx === -1) return
      
      const nextRIdx = visibleRounds.value[currentVisibleIdx].index
      const nextId = `score-${nextRIdx}-0`
      const nextEl = document.getElementById(nextId)
      if (nextEl) nextEl.focus()
      return
    }

    let nextPIdx = pIdx + 1
    let nextVisibleIdx = currentVisibleIdx
    
    if (nextPIdx >= sessionStore.activeGame.players.length) {
      nextPIdx = 0
      nextVisibleIdx = currentVisibleIdx + 1
    }
    
    if (nextVisibleIdx < visibleRounds.value.length) {
      const nextRIdx = visibleRounds.value[nextVisibleIdx].index
      const nextId = `score-${nextRIdx}-${nextPIdx}`
      const nextEl = document.getElementById(nextId)
      if (nextEl) {
        nextEl.focus()
      }
    }
  } else if (event.key === 'Backspace') {
    if (event.target.value === '') {
      event.preventDefault()
      // Find previous cell in visible rounds
      let currentVisibleIdx = visibleRounds.value.findIndex(vr => vr.index === rIdx)
      
      if (currentVisibleIdx === -1) {
        // If current row is hidden, find the last visible row before it
        const prevVisibleRounds = visibleRounds.value.filter(vr => vr.index < rIdx)
        if (prevVisibleRounds.length === 0) return
        
        const lastVisibleRound = prevVisibleRounds[prevVisibleRounds.length - 1]
        const prevRIdx = lastVisibleRound.index
        const prevPIdx = sessionStore.activeGame.players.length - 1
        const prevId = `score-${prevRIdx}-${prevPIdx}`
        const prevEl = document.getElementById(prevId)
        if (prevEl) {
          prevEl.focus()
          setTimeout(() => prevEl.select(), 0)
        }
        return
      }

      let prevPIdx = pIdx - 1
      let prevVisibleIdx = currentVisibleIdx
      
      if (prevPIdx < 0) {
        if (currentVisibleIdx > 0) {
          prevPIdx = sessionStore.activeGame.players.length - 1
          prevVisibleIdx = currentVisibleIdx - 1
        } else {
          // Already at the first visible cell
          return
        }
      }
      
      const prevRIdx = visibleRounds.value[prevVisibleIdx].index
      const prevId = `score-${prevRIdx}-${prevPIdx}`
      const prevEl = document.getElementById(prevId)
      if (prevEl) {
        prevEl.focus()
        // Highlight value
        setTimeout(() => {
          prevEl.select()
        }, 0)
      }
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
          <button
            v-if="wakeLockSupported && !activeGame.isFinished"
            class="btn-wake"
            :class="{ active: wakeLockActive }"
            @click="toggleWakeLock"
            :title="wakeLockActive ? 'Screen stays awake' : 'Screen may sleep'"
            :aria-label="wakeLockActive ? 'Disable keep screen awake' : 'Enable keep screen awake'"
            :aria-pressed="wakeLockActive"
          >
            <svg-icon type="mdi" :path="mdiWhiteBalanceSunny"></svg-icon>
          </button>
          <button v-if="!activeGame.isFinished" class="btn-finish" @click="finishGame">
            <svg-icon type="mdi" :path="mdiFlagCheckered"></svg-icon>
            <span class="btn-label">Finish</span>
          </button>
          <button class="btn-cancel" @click="exitGame">
            <svg-icon type="mdi" :path="mdiExitToApp"></svg-icon>
            <span class="btn-label">Exit</span>
          </button>
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
            <tr class="totals-header-row">
              <th class="round-col">Σ</th>
              <th v-for="(total, idx) in sessionStore.totals" :key="idx" class="total-header-value">
                {{ total }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="({ round, index: rIdx }, vIdx) in visibleRounds" :key="rIdx">
              <td class="round-num">{{ vIdx + 1 }}</td>
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

    </div>
  </div>
</template>

<style scoped>
.play-container {
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.setup-screen {
  flex: 1;
  overflow-y: auto;
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
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.template-card.active, .player-card.active {
  border-color: var(--color-primary);
  background-color: rgba(170, 68, 101, 0.1);
}

.template-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-dark);
}

.template-card p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-gray);
}

.start-button {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: auto;
}

.start-button:disabled {
  background-color: var(--color-border);
  cursor: not-allowed;
}

/* Scoring Screen Styles */
.scoring-screen {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; /* Important for flex children scrolling */
}

.scoring-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-shrink: 0;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.header-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

/* Mobile-first: show icons only. Labels appear on wider screens. */
.btn-label {
  display: none;
}

@media (min-width: 600px) {
  .btn-label {
    display: inline;
  }
}

.table-container {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--color-border);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  border-bottom: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  padding: 8px;
  text-align: center;
}

th:last-child, td:last-child {
  border-right: none;
}

th {
  background-color: var(--color-gray-light);
  color: var(--color-dark);
}

thead {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 10;
}

.totals-header-row th {
  background-color: var(--color-dark);
  color: white;
  font-size: 1.1rem;
}

.total-header-value {
  font-weight: bold;
}

.round-col, .round-num {
  width: 40px;
  background-color: var(--color-gray-light);
  font-weight: bold;
  color: var(--color-dark);
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
  background-color: rgba(0, 175, 181, 0.1);
}


.btn-wake {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: var(--color-gray-light);
  color: var(--color-gray);
  border: 1px solid var(--color-border);
}

.btn-wake.active {
  background-color: var(--color-secondary);
  color: white;
  border-color: var(--color-secondary);
}

.btn-finish {
  background-color: var(--color-primary);
  color: white;
}

.btn-cancel {
  background-color: var(--color-secondary);
  color: white;
}

.finished input {
  color: var(--color-gray);
}

@media (prefers-color-scheme: dark) {
  .template-card h3, th, .round-num {
    color: var(--color-white);
  }
  th, .round-num {
    background-color: #333;
  }
  .totals-header-row th {
    background-color: #1a1a1a;
    border-color: var(--color-gray-dark);
  }
  .template-card p {
    color: #bbb;
  }
}
</style>
