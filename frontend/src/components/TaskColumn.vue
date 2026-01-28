<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <h2 class="font-semibold text-gray-900">{{ title }}</h2>
        <span class="badge bg-gray-100 text-gray-700">{{ tasks.length }}</span>
      </div>
    </div>

    <div
      class="flex-1 space-y-3 overflow-y-auto pb-4"
      :class="{ 'bg-primary-50 border-2 border-primary-300 rounded-lg p-2': isDragOver }"
      @drop="onDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @drag-start="emit('dragStart', $event)"
      />

      <div v-if="tasks.length === 0" class="text-center py-8 text-gray-400">
        <p class="text-sm">No hay tareas</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '@/types'

defineProps<{
  title: string
  tasks: Task[]
  status: TaskStatus
}>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string]
  dragStart: [task: Task]
  drop: [status: TaskStatus]
}>()

const isDragOver = ref(false)

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  emit('drop', props.status)
}
</script>