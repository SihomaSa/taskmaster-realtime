<template>
  <div 
    class="card cursor-move hover:shadow-md transition-shadow"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="flex justify-between items-start mb-3">
      <h3 class="font-semibold text-gray-900">{{ task.title }}</h3>
      <span :class="priorityClass">
        {{ task.priority }}
      </span>
    </div>

    <p v-if="task.description" class="text-sm text-gray-600 mb-3">
      {{ task.description }}
    </p>

    <div class="flex items-center justify-between text-xs text-gray-500">
      <div v-if="task.assignedTo" class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
          <span class="text-primary-700 font-medium text-xs">
            {{ task.assignedTo.name.charAt(0).toUpperCase() }}
          </span>
        </div>
        <span>{{ task.assignedTo.name }}</span>
      </div>
      
      <div class="flex gap-2">
        <button
          @click="emit('edit', task)"
          class="p-1 hover:bg-gray-100 rounded"
          title="Editar"
        >
          ✏️
        </button>
        <button
          @click="emit('delete', task.id)"
          class="p-1 hover:bg-red-50 rounded"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>

    <div v-if="task.dueDate" class="mt-2 text-xs text-gray-500">
      📅 {{ formatDate(task.dueDate) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string]
  dragStart: [task: Task]
}>()

const priorityClass = computed(() => {
  const classes = 'badge '
  switch (props.task.priority) {
    case 'URGENT':
      return classes + 'bg-red-100 text-red-700'
    case 'HIGH':
      return classes + 'bg-orange-100 text-orange-700'
    case 'MEDIUM':
      return classes + 'bg-blue-100 text-blue-700'
    default:
      return classes + 'bg-gray-100 text-gray-700'
  }
})

const formatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy')
}

const onDragStart = (e: DragEvent) => {
  emit('dragStart', props.task)
}
</script>