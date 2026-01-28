import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Task } from '../tasks/task.entity';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitTaskCreated(task: Task) {
    this.server.emit('task:created', task);
    this.logger.log(`Task created event emitted: ${task.id}`);
  }

  emitTaskUpdated(task: Task) {
    this.server.emit('task:updated', task);
    this.logger.log(`Task updated event emitted: ${task.id}`);
  }

  emitTaskDeleted(taskId: string) {
    this.server.emit('task:deleted', { id: taskId });
    this.logger.log(`Task deleted event emitted: ${taskId}`);
  }

  emitNotification(userId: string, message: string, type: string = 'info') {
    this.server.emit('notification', { userId, message, type, timestamp: new Date() });
    this.logger.log(`Notification sent to user ${userId}: ${message}`);
  }
}