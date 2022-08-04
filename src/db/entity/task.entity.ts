import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Course } from './course.entity';
import { Scheduled } from './scheduled.entity';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    default: null,
    nullable: true,
  })
  completed_time: string;

  @Column({ nullable: true })
  start_time: string;

  @Column({ nullable: true })
  end_time: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @ManyToOne((type) => Course, (course) => course.tasks, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @ManyToOne((type) => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany((type) => Scheduled, (scheduled) => scheduled.task)
  scheduled: Array<Scheduled>;

  @DeleteDateColumn({
    nullable: true,
    name: 'deleted_at',
    type: 'timestamp with time zone',
  })
  public deletedAt: Timestamp;
}
