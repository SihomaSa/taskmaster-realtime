<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">TaskMaster</h1>
            <p class="text-sm text-gray-600">Bienvenido, {{ authStore.user?.name }}</p>
          </div>

          <div class="flex items-center gap-4">
            <!-- WebSocket Status -->
            <div class="flex items-center gap-2">
              <div
                :class="socketService.connected.value ? 'bg-green-500' : 'bg-red-500'"
                class="w-2 h-2 rounded-full"
              />
              <span class="text-sm text-gray-600">
                {{ socketService.connected.value ? 'Conectado' : 'Desconectado' }}
              </span>
            </div>

            <button
              @click="openCreateModal"
              class="btn-primary"
            >
              + Nueva tarea
            </button>

            <button
              @click="authStore.logout"
              class="btn-secondary"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Stats -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card">
          <p class="text-sm text-gray-600">Total</p>
          <p class="text-3xl font-bold text-gray-900">{{ tasksStore.tasks.length }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">Por hacer</p>
          <p class="text-3xl font-bold text-blue-600">{{ tasksStore.todoTasks.length }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">En progreso</p>
          <p class="text-3xl font-bold text-yellow-600">{{ tasksStore.inProgressTasks.length }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">Completadas</p>
          <p class="text-3xl font-bold text-green-600">{{ tasksStore.doneTasks.length }}</p>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div v-if="tasksStore.loading" class="text-center py-12">
        <p class="text-gray-600">Cargando tareas...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
        <TaskColumn
          title="📋 Por hacer"
          :tasks="tasksStore.todoTasks"
          status="TODO"
          @edit="openEditModal"
          @delete="handleDeleteTask"
          @drag-start="handleDragStart"
          @drop="handleDrop"
        />

        <TaskColumn
          title="🔄 En progreso"
          :tasks="tasksStore.inProgressTasks"
          status="IN_PROGRESS"
          @edit="openEditModal"
          @delete="handleDeleteTask"
          @drag-start="handleDragStart"
          @drop="handleDrop"
        />

        <TaskColumn
          title="✅ Completado"
          :tasks="tasksStore.doneTasks"
          status="DONE"
          @edit="openEditModal"
          @delete="handleDeleteTask"
          @drag-start="handleDragStart"
          @drop="handleDrop"
        />
      </div>
    </div>

    <!-- Task Modal -->
    <TaskModal
      :is-open="showModal"
      :task="selectedTask"
      @close="closeModal"
      @submit="handleSubmitTask"
    />

    <!-- Notifications -->
    <div class="fixed bottom-4 right-4 space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="card max-w-sm animate-slide-in"
        :class="{
          'border-l-4 border-green-500': notification.type === 'success',
          'border-l-4 border-blue-500': notification.type === 'info',
        }"
      >
        <p class="text-sm">{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import { socketService } from '@/services/socket'
import TaskColumn from '@/components/TaskColumn.vue'
import TaskModal from '@/components/TaskModal.vue'
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types'

const authStore = useAuthStore()
const tasksStore = useTasksStore()

const showModal = ref(false)
const selectedTask = ref<Task | null>(null)
const draggedTask = ref<Task | null>(null)
const notifications = ref<Array<{ id: number; message: string; type: string }>>([])

let notificationId = 0

onMounted(async () => {
  // Connect WebSocket
  socketService.connect()
  
  // Setup WebSocket listeners
  tasksStore.setupWebSocketListeners()
  
  // Listen for notifications
  socketService.on('notification', (data: any) => {
    showNotification(data.message, data.type)
  })
  
  // Fetch tasks
  await tasksStore.fetchTasks()
})

onUnmounted(() => {
  tasksStore.cleanupWebSocketListeners()
  socketService.disconnect()
})

const showNotification = (message: string, type: string = 'info') => {
  const id = notificationId++
  notifications.value.push({ id, message, type })
  
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3000)
}

const openCreateModal = () => {
  selectedTask.value = null
  showModal.value = true
}

const openEditModal = (task: Task) => {
  selectedTask.value = task
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTask.value = null
}

const handleSubmitTask = async (data: CreateTaskInput | UpdateTaskInput) => {
  try {
    if (selectedTask.value) {
      await tasksStore.updateTask(selectedTask.value.id, data as UpdateTaskInput)
      showNotification('Tarea actualizada correctamente', 'success')
    } else {
      await tasksStore.createTask(data as CreateTaskInput)
      showNotification('Tarea creada correctamente', 'success')
    }
  } catch (error) {
    console.error('Error submitting task:', error)
  }
}

const handleDeleteTask = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
    try {
      await tasksStore.deleteTask(id)
      showNotification('Tarea eliminada correctamente', 'success')
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }
}

const handleDragStart = (task: Task) => {
  draggedTask.value = task
}

const handleDrop = async (newStatus: TaskStatus) => {
  if (draggedTask.value && draggedTask.value.status !== newStatus) {
    try {
      await tasksStore.moveTask(draggedTask.value.id, newStatus)
      showNotification('Tarea movida correctamente', 'success')
    } catch (error) {
      console.error('Error moving task:', error)
    }
  }
  draggedTask.value = null
}
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>