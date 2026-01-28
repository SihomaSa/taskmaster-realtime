import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'
import { socketService } from '@/services/socket'
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types'

const TASKS_QUERY = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
      assignedTo {
        id
        name
        email
        avatar
      }
    }
  }
`

const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
      assignedTo {
        id
        name
        email
      }
    }
  }
`

const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: String!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      updatedAt
      assignedTo {
        id
        name
        email
      }
    }
  }
`

const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: String!) {
    deleteTask(id: $id)
  }
`

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const todoTasks = computed(() => 
    tasks.value.filter(t => t.status === 'TODO')
  )
  
  const inProgressTasks = computed(() => 
    tasks.value.filter(t => t.status === 'IN_PROGRESS')
  )
  
  const doneTasks = computed(() => 
    tasks.value.filter(t => t.status === 'DONE')
  )

  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await apolloClient.query({
        query: TASKS_QUERY,
        fetchPolicy: 'network-only',
      })
      tasks.value = data.tasks
    } catch (e: any) {
      error.value = e.message
      console.error('Error fetching tasks:', e)
    } finally {
      loading.value = false
    }
  }

  const createTask = async (input: CreateTaskInput) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_TASK_MUTATION,
        variables: { input },
      })
      // La tarea se agregará automáticamente vía WebSocket
      return data.createTask
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const updateTask = async (id: string, input: UpdateTaskInput) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_TASK_MUTATION,
        variables: { id, input },
      })
      // La tarea se actualizará automáticamente vía WebSocket
      return data.updateTask
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await apolloClient.mutate({
        mutation: DELETE_TASK_MUTATION,
        variables: { id },
      })
      // La tarea se eliminará automáticamente vía WebSocket
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    return updateTask(taskId, { status: newStatus })
  }

  // WebSocket event handlers
  const setupWebSocketListeners = () => {
    socketService.on('task:created', (task: Task) => {
      const exists = tasks.value.find(t => t.id === task.id)
      if (!exists) {
        tasks.value.unshift(task)
      }
    })

    socketService.on('task:updated', (updatedTask: Task) => {
      const index = tasks.value.findIndex(t => t.id === updatedTask.id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
    })

    socketService.on('task:deleted', ({ id }: { id: string }) => {
      tasks.value = tasks.value.filter(t => t.id !== id)
    })
  }

  const cleanupWebSocketListeners = () => {
    socketService.off('task:created')
    socketService.off('task:updated')
    socketService.off('task:deleted')
  }

  return {
    tasks,
    loading,
    error,
    todoTasks,
    inProgressTasks,
    doneTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    setupWebSocketListeners,
    cleanupWebSocketListeners,
  }
})