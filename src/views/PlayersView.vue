<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/players'

const playerStore = usePlayerStore()
const newPlayerName = ref('')
const editingPlayerId = ref(null)
const editingPlayerName = ref('')

const addPlayer = () => {
  if (newPlayerName.value.trim()) {
    playerStore.addPlayer(newPlayerName.value.trim())
    newPlayerName.value = ''
  }
}

const startEdit = (player) => {
  editingPlayerId.value = player.id
  editingPlayerName.value = player.name
}

const saveEdit = () => {
  if (editingPlayerName.value.trim()) {
    playerStore.updatePlayer(editingPlayerId.value, editingPlayerName.value.trim())
    cancelEdit()
  }
}

const cancelEdit = () => {
  editingPlayerId.value = null
  editingPlayerName.value = ''
}

const deletePlayer = (id) => {
  if (confirm('Are you sure you want to delete this player?')) {
    playerStore.deletePlayer(id)
  }
}
</script>

<template>
  <div class="players-view">
    <h1>Player Management</h1>

    <section class="add-player">
      <h2>Add New Player</h2>
      <form @submit.prevent="addPlayer">
        <input v-model="newPlayerName" placeholder="Enter player name" />
        <button type="submit">Add</button>
      </form>
    </section>

    <section class="player-list">
      <h2>Existing Players</h2>
      <p v-if="playerStore.players.length === 0">No players added yet.</p>
      <ul>
        <li v-for="player in playerStore.players" :key="player.id">
          <div v-if="editingPlayerId === player.id">
            <input v-model="editingPlayerName" @keyup.enter="saveEdit" />
            <button @click="saveEdit">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </div>
          <div v-else class="player-item">
            <span>{{ player.name }}</span>
            <div class="actions">
              <button @click="startEdit(player)">Edit</button>
              <button @click="deletePlayer(player.id)" class="delete-btn">Delete</button>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.players-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

section {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

form {
  display: flex;
  gap: 0.5rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
  font-size: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}

.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

@media (prefers-color-scheme: dark) {
  section {
    background-color: #2a2a2a;
    border-color: #444;
  }
  li {
    border-bottom-color: #333;
  }
  input {
    background-color: #333;
    border-color: #555;
    color: white;
  }
}
</style>
