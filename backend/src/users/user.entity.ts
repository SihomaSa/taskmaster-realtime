import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from '../tasks/task.entity';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  avatar?: string;

  @Column({ default: 'user' })
  @Field()
  role: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @OneToMany(() => Task, task => task.assignedTo)
  @Field(() => [Task], { nullable: true })
  tasks?: Task[];
}