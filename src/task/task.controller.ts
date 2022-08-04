import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { Auth } from 'src/auth/guard/auth.decorator';
import { AuthUser } from 'src/auth/guard/user.decorator';
import { CourseService } from 'src/course/course.service';
import { CreateTaskDTO } from './dto/task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly courseService: CourseService,
  ) {}

  @Auth()
  @Get('/overdue')
  getOverdue(@AuthUser() user): Promise<any> {
    return this.taskService.getOverdueTasks(user);
  }

  @Auth()
  @Get()
  getAll(@AuthUser() user): Promise<any> {
    return this.taskService.getAll(user);
  }
  @Auth()
  @Get('/deleted')
  getDeleted(@AuthUser() user): Promise<any> {
    return this.taskService.getDeleted(user);
  }

  @Auth()
  @Delete()
  async deleteTask(@AuthUser() user, @Query('id') id: string): Promise<any> {
    const task = await this.taskService.getTaskById(parseInt(id));
    if (task.user.id !== user.id) {
      throw new Error('You are not allowed to delete this task');
    }
    return this.taskService.deleteTask(parseInt(id));
  }

  @Auth()
  @Post()
  async createTask(
    @AuthUser() user,
    @Body() task: CreateTaskDTO,
  ): Promise<any> {
    const course =
      task.course === null || !task.hasOwnProperty('course')
        ? null
        : await this.courseService.getUserCourseById(user, task.course);
    console.log(task, course);
    return this.taskService.createTask(user, course, task);
  }
}
