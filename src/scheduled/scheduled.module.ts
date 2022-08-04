import { forwardRef, Module } from '@nestjs/common';
import { ScheduledService } from './scheduled.service';
import { ScheduledController } from './scheduled.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduled } from 'src/db/entity/scheduled.entity';
import { Task } from 'src/db/entity/task.entity';
import { Course } from 'src/db/entity/course.entity';
import { User } from 'src/db/entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { TaskService } from 'src/task/task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course, Task, Scheduled]),
    forwardRef(() => AuthModule),
  ],
  providers: [ScheduledService, AuthService, TaskService],
  controllers: [ScheduledController],
  exports: [ScheduledService],
})
export class ScheduledModule {}
