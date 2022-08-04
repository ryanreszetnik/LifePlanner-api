import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  days: string;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  location: string;

  @Column()
  notes: string;

  @ManyToOne((type) => Course, (course) => course.events, {
    onDelete: 'CASCADE',
  })
  course: Course;
}
