import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/db/entity/course.entity';
import { Scheduled } from 'src/db/entity/scheduled.entity';
import { Task } from 'src/db/entity/task.entity';
import { User } from 'src/db/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateScheduledDTO } from './dto/scheduled.dto';

@Injectable()
export class ScheduledService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Scheduled)
    private scheduledRepository: Repository<Scheduled>,
  ) {}

  async createScheduled(
    task: Task,
    scheduled: CreateScheduledDTO,
  ): Promise<Scheduled> {
    return this.scheduledRepository.save({ ...scheduled, task });
  }
  async getScheduledById(id: number): Promise<Scheduled> {
    return this.scheduledRepository.findOneOrFail({
      where: { id },
      relations: { task: { user:true } },
    });
  }
  deleteScheduled(id: number): Promise<any> {
    return this.scheduledRepository.softDelete({ id });
  }
}
