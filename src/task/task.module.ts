import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entity/user.entity';
import { Course } from 'src/db/entity/course.entity';
import { Task } from 'src/db/entity/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CourseService } from 'src/course/course.service';
import { Scheduled } from 'src/db/entity/scheduled.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course, Task, Scheduled]),
    forwardRef(() => AuthModule),
  ],
  providers: [TaskService, AuthService, CourseService],
  controllers: [TaskController],
})
export class TaskModule {}
