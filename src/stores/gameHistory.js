import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameHistoryStore = defineStore('gameHistory', () => {
  const history = ref(JSON.parse(localStorage.getItem('gameHistory') || '[]'))

  function addGame(game) {
    history.value.unshift(game)
    // Keep last 100 games
    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100)
    }
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('gameHistory', JSON.stringify(history.value))
  }

  const lastFiveGames = computed(() => history.value.slice(0, 5))

  const topPlayers = computed(() => {
    const playerCounts = {}
    history.value.forEach(game => {
      game.players.forEach(player => {
        playerCounts[player.name] = (playerCounts[player.name] || 0) + 1
      })
    })

    return Object.entries(playerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  })

  return { history, addGame, lastFiveGames, topPlayers }
})
