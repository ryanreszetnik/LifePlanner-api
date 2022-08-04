import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './course.entity';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({ default: 1, select: false })
  tokenVersion: number;

  @OneToMany((type) => Course, (course) => course.user)
  courses: Array<Course>;

  @OneToMany((type) => Task, (task) => task.user)
  tasks: Array<Task>;
}
