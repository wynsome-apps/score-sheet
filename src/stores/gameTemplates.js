import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nanoid } from 'nanoid'

export const useGameTemplatesStore = defineStore('gameTemplates', () => {
  const templates = ref([
    { id: '1', name: 'Default Game', scoringType: 'normal' }
  ])

  function addTemplate(name, scoringType) {
    templates.value.push({
      id: nanoid(),
      name,
      scoringType
    })
  }

  function updateTemplate(id, name, scoringType) {
    const index = templates.value.findIndex(t => t.id === id)
    if (index !== -1) {
      templates.value[index].name = name
      templates.value[index].scoringType = scoringType
    }
  }

  function deleteTemplate(id) {
    templates.value = templates.value.filter(t => t.id !== id)
  }

  return { templates, addTemplate, updateTemplate, deleteTemplate }
})
