import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/guard/auth.decorator';
import { AuthUser } from 'src/auth/guard/user.decorator';
import { Task } from 'src/db/entity/task.entity';
import { TaskService } from 'src/task/task.service';
import { CreateScheduledDTO } from './dto/scheduled.dto';
import { ScheduledService } from './scheduled.service';

@Controller('scheduled')
export class ScheduledController {
  constructor(
    private readonly scheduledService: ScheduledService,
    private readonly taskService: TaskService,
  ) {}
  @Auth()
  @Post()
  async createScheduled(
    @AuthUser() user,
    @Body() scheduled: CreateScheduledDTO,
  ) {
    const task: Task = await this.taskService.getTaskById(scheduled.task);
    if (task?.user?.id !== user.id) {
      throw HttpCode(HttpStatus.BAD_REQUEST);
    }
    return this.scheduledService.createScheduled(task, scheduled);
  }

  @Auth()
  @Delete()
  async deleteScheduled(@AuthUser() user, @Query('id') id: string) {
    const scheduled = await this.scheduledService.getScheduledById(
      parseInt(id),
    );
    if (scheduled?.task?.user?.id !== user.id) {
      throw new Error('You are not allowed to delete this scheduled');
    }
    return this.scheduledService.deleteScheduled(parseInt(id));
  }
}
