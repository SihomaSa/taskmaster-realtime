import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskInput, UpdateTaskInput } from './dto/task.input';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private eventsGateway: EventsGateway,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['assignedTo'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    return task;
  }

  async create(createTaskInput: CreateTaskInput): Promise<Task> {
    const task = this.tasksRepository.create(createTaskInput);
    const savedTask = await this.tasksRepository.save(task);
    
    // Emitir evento WebSocket
    this.eventsGateway.emitTaskCreated(savedTask);
    
    return this.findOne(savedTask.id);
  }

  async update(id: string, updateTaskInput: UpdateTaskInput): Promise<Task> {
    const task = await this.findOne(id);
    
    Object.assign(task, updateTaskInput);
    const updatedTask = await this.tasksRepository.save(task);
    
    // Emitir evento WebSocket
    this.eventsGateway.emitTaskUpdated(updatedTask);
    
    return this.findOne(updatedTask.id);
  }

  async remove(id: string): Promise<boolean> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
    
    // Emitir evento WebSocket
    this.eventsGateway.emitTaskDeleted(id);
    
    return true;
  }

  async findByUser(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { assignedToId: userId },
      relations: ['assignedTo'],
      order: { createdAt: 'DESC' },
    });
  }
}