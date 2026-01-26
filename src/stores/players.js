import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nanoid } from 'nanoid'

export const usePlayerStore = defineStore('players', () => {
  const players = ref([])

  function addPlayer(name) {
    players.value.push({
      id: nanoid(),
      name
    })
  }

  function updatePlayer(id, name) {
    const index = players.value.findIndex(p => p.id === id)
    if (index !== -1) {
      players.value[index].name = name
    }
  }

  function deletePlayer(id) {
    players.value = players.value.filter(p => p.id !== id)
  }

  return { players, addPlayer, updatePlayer, deletePlayer }
})
