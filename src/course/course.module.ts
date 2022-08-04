import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entity/user.entity';
import { Course } from 'src/db/entity/course.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Task } from 'src/db/entity/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course, Task]),
    forwardRef(() => AuthModule),
  ],
  providers: [CourseService, AuthService],
  controllers: [CourseController],
  exports: [CourseService],
})
export class CourseModule {}
