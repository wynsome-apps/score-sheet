import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'

export const useGameSessionStore = defineStore('gameSession', () => {
  const activeGame = ref(JSON.parse(localStorage.getItem('activeGame') || 'null'))

  function startGame(template, selectedPlayers) {
    activeGame.value = {
      id: nanoid(),
      template,
      players: selectedPlayers.map(p => ({ ...p, totalScore: 0 })),
      rounds: [
        // Each round is an array of scores, one for each player in the same order
        selectedPlayers.map(() => null)
      ],
      startTime: new Date().toISOString(),
      isFinished: false
    }
    saveToLocalStorage()
  }

  function updateScore(roundIndex, playerIndex, score) {
    if (!activeGame.value) return
    
    // Ensure the round exists
    if (!activeGame.value.rounds[roundIndex]) {
      activeGame.value.rounds[roundIndex] = activeGame.value.players.map(() => null)
    }

    activeGame.value.rounds[roundIndex][playerIndex] = score === '' ? null : Number(score)
    
    // Check if we need to add a new round
    // If all cells in the current last round have some value, add a new round
    const lastRound = activeGame.value.rounds[activeGame.value.rounds.length - 1]
    const isLastRoundFull = lastRound.every(s => s !== null)
    if (isLastRoundFull) {
      activeGame.value.rounds.push(activeGame.value.players.map(() => null))
    }

    saveToLocalStorage()
  }

  function finishGame() {
    if (!activeGame.value) return
    activeGame.value.isFinished = true
    activeGame.value.endTime = new Date().toISOString()
    
    // Save to history (Phase 5 will use this, but good to have)
    const history = JSON.parse(localStorage.getItem('gameHistory') || '[]')
    history.unshift(activeGame.value)
    localStorage.setItem('gameHistory', JSON.stringify(history.slice(0, 50))) // Keep last 50
    
    saveToLocalStorage()
  }

  function cancelGame() {
    activeGame.value = null
    localStorage.removeItem('activeGame')
  }

  function saveToLocalStorage() {
    localStorage.setItem('activeGame', JSON.stringify(activeGame.value))
  }

  const totals = computed(() => {
    if (!activeGame.value) return []
    return activeGame.value.players.map((player, pIdx) => {
      return activeGame.value.rounds.reduce((sum, round) => {
        return sum + (round[pIdx] || 0)
      }, 0)
    })
  })

  return { activeGame, startGame, updateScore, finishGame, cancelGame, totals }
})
