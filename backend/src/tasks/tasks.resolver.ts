import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskInput, UpdateTaskInput } from './dto/task.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Query(() => [Task], { name: 'tasks' })
  @UseGuards(GqlAuthGuard)
  async getTasks(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Query(() => Task, { name: 'task' })
  @UseGuards(GqlAuthGuard)
  async getTask(@Args('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Query(() => [Task], { name: 'myTasks' })
  @UseGuards(GqlAuthGuard)
  async getMyTasks(@Args('userId') userId: string): Promise<Task[]> {
    return this.tasksService.findByUser(userId);
  }

  @Mutation(() => Task)
  @UseGuards(GqlAuthGuard)
  async createTask(@Args('input') input: CreateTaskInput): Promise<Task> {
    return this.tasksService.create(input);
  }

  @Mutation(() => Task)
  @UseGuards(GqlAuthGuard)
  async updateTask(
    @Args('id') id: string,
    @Args('input') input: UpdateTaskInput,
  ): Promise<Task> {
    return this.tasksService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteTask(@Args('id') id: string): Promise<boolean> {
    return this.tasksService.remove(id);
  }
}