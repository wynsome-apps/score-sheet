<script setup>
import { ref, reactive } from 'vue'
import { useGameTemplatesStore } from '../stores/gameTemplates'

const gameTemplatesStore = useGameTemplatesStore()
const isAdding = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  scoringType: 'normal'
})

const resetForm = () => {
  form.name = ''
  form.scoringType = 'normal'
  isAdding.value = false
  editingId.value = null
}

const startAdd = () => {
  resetForm()
  isAdding.value = true
}

const startEdit = (template) => {
  form.name = template.name
  form.scoringType = template.scoringType
  editingId.value = template.id
  isAdding.value = true
}

const save = () => {
  if (form.name.trim()) {
    if (editingId.value) {
      gameTemplatesStore.updateTemplate(editingId.value, form.name.trim(), form.scoringType)
    } else {
      gameTemplatesStore.addTemplate(form.name.trim(), form.scoringType)
    }
    resetForm()
  }
}

const deleteTemplate = (id) => {
  if (confirm('Are you sure you want to delete this game template?')) {
    gameTemplatesStore.deleteTemplate(id)
  }
}
</script>

<template>
  <div class="game-templates-view">
    <h1>Game Templates</h1>

    <div v-if="!isAdding">
      <button @click="startAdd" class="add-btn">Create New Template</button>
      
      <section class="template-list">
        <h2>Templates</h2>
        <p v-if="gameTemplatesStore.templates.length === 0">No templates created yet.</p>
        <ul>
          <li v-for="template in gameTemplatesStore.templates" :key="template.id">
            <div class="template-item">
              <div>
                <strong>{{ template.name }}</strong>
                <span class="scoring-type">({{ template.scoringType }})</span>
              </div>
              <div class="actions">
                <button @click="startEdit(template)">Edit</button>
                <button @click="deleteTemplate(template.id)" class="delete-btn">Delete</button>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <div v-else class="form-container">
      <h2>{{ editingId ? 'Edit' : 'New' }} Game Template</h2>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="name">Game Name</label>
          <input id="name" v-model="form.name" placeholder="e.g. Hearts, Scrabble" required />
        </div>
        
        <div class="form-group">
          <label>Scoring Type</label>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="form.scoringType" value="normal" />
              Normal (Highest wins)
            </label>
            <label>
              <input type="radio" v-model="form.scoringType" value="reverse" />
              Reverse (Lowest wins)
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit">Save</button>
          <button type="button" @click="resetForm">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.game-templates-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.add-btn {
  margin-bottom: 1rem;
  background-color: #42b883;
  color: white;
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

section {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scoring-type {
  font-size: 0.8rem;
  color: #666;
  margin-left: 0.5rem;
}

.form-container {
  padding: 1.5rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #213547;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-group label {
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

input[id="name"] {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.form-actions button {
  flex: 1;
  padding: 0.8rem;
}

button[type="submit"] {
  background-color: #42b883;
  color: white;
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
  section, .form-container {
    background-color: #2a2a2a;
    color: rgba(255, 255, 255, 0.87);
    border-color: #444;
  }
  
  .scoring-type {
    color: #aaa;
  }

  li {
    border-bottom-color: #333;
  }

  .radio-group label {
    background: #333;
    border-color: #555;
  }

  input[id="name"] {
    background-color: #333;
    border-color: #555;
    color: white;
  }
}
</style>
