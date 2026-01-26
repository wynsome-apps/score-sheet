import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nanoid } from 'nanoid'

export const usePlayerStore = defineStore('players', () => {
  const players = ref(JSON.parse(localStorage.getItem('players') || '[]'))

  function addPlayer(name) {
    players.value.push({
      id: nanoid(),
      name
    })
    saveToLocalStorage()
  }

  function updatePlayer(id, name) {
    const index = players.value.findIndex(p => p.id === id)
    if (index !== -1) {
      players.value[index].name = name
      saveToLocalStorage()
    }
  }

  function deletePlayer(id) {
    players.value = players.value.filter(p => p.id !== id)
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('players', JSON.stringify(players.value))
  }

  return { players, addPlayer, updatePlayer, deletePlayer }
})
