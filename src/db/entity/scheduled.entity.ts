import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Task } from './task.entity';

@Entity()
export class Scheduled {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  start_time: string;

  @Column({ nullable: true })
  end_time: string;

  @Column({
    nullable: true,
  })
  completed_time: string;

  @ManyToOne((type) => Task, (task) => task.scheduled, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @DeleteDateColumn({
    nullable: true,
    name: 'deleted_at',
    type: 'timestamp with time zone',
  })
  public deletedAt: Date;
}
