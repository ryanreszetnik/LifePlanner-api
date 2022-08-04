import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './auth/guard/auth.decorator';
import { AuthUser } from './auth/guard/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Auth()
  @Get()
  async appLoad(@AuthUser() user): Promise<any> {
    return await this.appService.appLoad(user.id);
  }
}
