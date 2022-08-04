import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/db/entity/course.entity';
import { Scheduled } from 'src/db/entity/scheduled.entity';
import { Task } from 'src/db/entity/task.entity';
import { User } from 'src/db/entity/user.entity';
import { Equal, IsNull, LessThan, Not, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Scheduled)
    private scheduledRepository: Repository<Scheduled>,
  ) {}
  getAll(user: User): Promise<Task[]> {
    return this.taskRepository.find({
      where: {
        user: Equal(user),
        start_time: Not(IsNull()),
        end_time: Not(IsNull()),
      },
      relations: { course: true, scheduled: true },
    });
  }
  getOverdueTasks(user: User): Promise<Task[]> {
    return this.taskRepository.find({
      where: {
        user: Equal(user),
        start_time: Not(IsNull()),
        end_time: LessThan(new Date().toISOString()),
      },
      relations: { course: true },
    });
  }

  createTask(user: User, course: Course, task: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.save({ ...task, course, user });
  }
  deleteTask(id: number): Promise<any> {
    return this.taskRepository.softDelete({ id });
  }
  getTaskById(id: number): Promise<Task> {
    return this.taskRepository.findOneOrFail({
      where: { id },
      relations: { user: true },
    });
  }
  async getDeleted(user: User): Promise<any> {
    const tasks = await this.taskRepository.find({
      where: { user: Equal(user), deletedAt: Not(IsNull()) },
      relations: { course: true },
      withDeleted: true,
    });
    const scheduled = await this.scheduledRepository.find({
      where: { task: { user: Equal(user) }, deletedAt: Not(IsNull()) },
      relations: { task: { course: true } },
      withDeleted: true,
    });
    return { tasks, scheduled };
  }
}
