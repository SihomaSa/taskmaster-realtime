import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  assignedTo?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface Notification {
  userId: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
}

class SocketService {
  private socket: Socket | null = null
  public connected = ref(false)

  connect() {
    if (this.socket?.connected) return

    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: true,
    })

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected')
      this.connected.value = true
    })

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected')
      this.connected.value = false
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected.value = false
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback)
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback)
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data)
  }
}

export const socketService = new SocketService()