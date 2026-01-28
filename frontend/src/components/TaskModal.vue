<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="emit('close')"
    >
      <div class="card max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ task ? 'Editar tarea' : 'Nueva tarea' }}
          </h2>
          <button
            @click="emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="input-field"
              placeholder="Título de la tarea"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="input-field"
              placeholder="Describe la tarea..."
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select v-model="formData.priority" class="input-field">
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>

            <div v-if="task">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select v-model="formData.status" class="input-field">
                <option value="TODO">Por hacer</option>
                <option value="IN_PROGRESS">En progreso</option>
                <option value="DONE">Completado</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Fecha de vencimiento
            </label>
            <input
              v-model="formData.dueDate"
              type="date"
              class="input-field"
            />
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary flex-1"
            >
              {{ loading ? 'Guardando...' : (task ? 'Actualizar' : 'Crear') }}
            </button>
            <button
              type="button"
              @click="emit('close')"
              class="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types'

const props = defineProps<{
  isOpen: boolean
  task?: Task | null
}>()

const emit = defineEmits<{
  close: []
  submit: [data: CreateTaskInput | UpdateTaskInput]
}>()

const formData = ref<any>({
  title: '',
  description: '',
  priority: 'MEDIUM',
  status: 'TODO',
  dueDate: '',
})

const loading = ref(false)
const error = ref('')

watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = {
      title: newTask.title,
      description: newTask.description || '',
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate ? newTask.dueDate.split('T')[0] : '',
    }
  } else {
    formData.value = {
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: '',
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = { ...formData.value }
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate).toISOString()
    }
    
    emit('submit', data)
    emit('close')
  } catch (e: any) {
    error.value = e.message || 'Error al guardar la tarea'
  } finally {
    loading.value = false
  }
}
</script>