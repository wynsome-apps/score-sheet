import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nanoid } from 'nanoid'

export const useGameTemplatesStore = defineStore('gameTemplates', () => {
  const defaultTemplates = [
    { id: '1', name: 'Default Game', scoringType: 'normal' }
  ]
  const templates = ref(JSON.parse(localStorage.getItem('gameTemplates') || JSON.stringify(defaultTemplates)))

  function addTemplate(name, scoringType) {
    templates.value.push({
      id: nanoid(),
      name,
      scoringType
    })
    saveToLocalStorage()
  }

  function updateTemplate(id, name, scoringType) {
    const index = templates.value.findIndex(t => t.id === id)
    if (index !== -1) {
      templates.value[index].name = name
      templates.value[index].scoringType = scoringType
      saveToLocalStorage()
    }
  }

  function deleteTemplate(id) {
    templates.value = templates.value.filter(t => t.id !== id)
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('gameTemplates', JSON.stringify(templates.value))
  }

  return { templates, addTemplate, updateTemplate, deleteTemplate }
})
