import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/db/entity/user.entity';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Auth } from 'src/auth/guard/auth.decorator';
import { AuthUser } from 'src/auth/guard/user.decorator';
import { DeleteResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Auth()
  @Get('id/:id')
  getById(@Param() params): Promise<User> {
    return this.userService.getOneById(params.id);
  }

  @Auth()
  @Get('currentUser')
  getCurrentAuthUser(@AuthUser() user): Promise<User> {
    return user;
  }
  @Auth()
  @Delete()
  delete(@AuthUser() user): Promise<DeleteResult> {
    return this.userService.deleteUser(user.id);
  }
}
