import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @OneToMany((type) => Event, (event) => event.course)
  events: Array<Event>;

  @OneToMany((type) => Task, (task) => task.course)
  tasks: Array<Task>;

  @ManyToOne((type) => User, (user) => user.courses, {
    onDelete: 'CASCADE',
  })
  user: User;
}
