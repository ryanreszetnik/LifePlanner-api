import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/db/entity/course.entity';
import { Task } from 'src/db/entity/task.entity';
import { User } from 'src/db/entity/user.entity';
import { Equal, IsNull, Repository } from 'typeorm';
import { CourseDTO, EditCourseDTO, HeadCourseDTO } from './dto/course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}
  async getUserCourses(userId: number): Promise<any[]> {
    return (
      await this.userRepository.find({
        where: { id: userId },
        relations: {
          courses: true,
        },
      })
    )[0].courses;
  }
  async getUserCoursesWithTasks(user: User): Promise<Course[]> {
    const courses = await this.courseRepository.find({
      where: { user: Equal(user) },
      relations: {
        tasks: true,
      },
    });
    const miscTasks = await this.taskRepository.find({
      where: { user: Equal(user), course: IsNull() },
      relations: { course: true },
    });
    const otherMisc = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.courseId is null')
      .andWhere('task.userId = :userId', { userId: user.id })
      .getMany();
    return [
      {
        id: -1,
        name: 'Other',
        color: '#888',
        events: [],
        user: null,
        tasks: otherMisc,
      },
      ...courses,
    ];
  }

  async findOwnerOfCourse(courseId: number): Promise<User> {
    let courseAndUser;
    try {
      courseAndUser = await this.courseRepository.findOneOrFail({
        where: { id: courseId },
        relations: { user: true },
      });
    } catch (e) {
      throw new HttpException('Course not found', 404);
    }
    return courseAndUser.user;
  }
  async createCourse(userId: number, course: CourseDTO): Promise<Course> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });
    return this.courseRepository.save({ ...course, user: user });
  }
  async deleteCourse(user: User, courseId: number): Promise<Course[]> {
    await this.courseRepository.delete({ id: courseId });
    return this.courseRepository.find({ where: { user: Equal(user) } });
  }
  async updateCourse(course: EditCourseDTO): Promise<Course> {
    return this.courseRepository.save(course);
  }
  async getCourseStats(courseId: number): Promise<HeadCourseDTO> {
    const course = await this.courseRepository.findOneOrFail({
      where: { id: courseId },
      relations: { tasks: true, events: true },
    });

    return {
      numTasks: course.tasks.length,
      numEvents: course.events.length,
    };
  }
  async getUserCourseById(user: User, courseId: number): Promise<Course> {
    return await this.courseRepository.findOne({
      where: { id: courseId, user: Equal(user) },
    });
  }
}
