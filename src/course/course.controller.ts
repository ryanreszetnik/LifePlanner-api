import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/guard/auth.decorator';
import { AuthUser } from 'src/auth/guard/user.decorator';
import { Course } from 'src/db/entity/course.entity';
import { User } from 'src/db/entity/user.entity';
import { CourseService } from './course.service';
import { CourseDTO, EditCourseDTO, HeadCourseDTO } from './dto/course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Auth()
  @Get()
  getUserCourses(@AuthUser() user: User): Promise<any> {
    return this.courseService.getUserCourses(user.id);
  }
  @Auth()
  @Get('/withTasks')
  getUserCoursesWithTasks(@AuthUser() user: User): Promise<any> {
    return this.courseService.getUserCoursesWithTasks(user);
  }

  @Auth()
  @Post()
  createCourse(
    @AuthUser() user: User,
    @Body() course: CourseDTO,
  ): Promise<any> {
    return this.courseService.createCourse(user.id, course);
  }

  @Auth()
  @Delete()
  async deleteCourse(
    @AuthUser() user: User,
    @Query('id') id: string,
  ): Promise<any> {
    const courseOwner = await this.courseService.findOwnerOfCourse(
      parseInt(id),
    );
    if (courseOwner.id !== user.id) {
      throw new Error('You are not allowed to delete this course');
    }
    return this.courseService.deleteCourse(user, parseInt(id));
  }
  @Auth()
  @Put()
  async updateCourse(
    @AuthUser() user: User,
    @Body() course: EditCourseDTO,
  ): Promise<any> {
    const courseOwner = await this.courseService.findOwnerOfCourse(course.id);
    if (courseOwner.id !== user.id) {
      throw new Error('You are not allowed to delete this course');
    }
    return this.courseService.updateCourse(course);
  }
  @Auth()
  @Get('/stats')
  async headACourse(
    @AuthUser() user: User,
    @Query('id') id: string,
  ): Promise<HeadCourseDTO> {
    const courseOwner = await this.courseService.findOwnerOfCourse(
      parseInt(id),
    );
    if (!courseOwner || courseOwner.id !== user.id) {
      throw new HttpException(
        'You are not allowed to delete this course',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.courseService.getCourseStats(parseInt(id));
  }
}
