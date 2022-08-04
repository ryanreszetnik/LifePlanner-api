import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/db/entity/user.entity';
import { AuthService } from './auth.service';
import LoginBody from './dto/loginDTO';
import RegisterDTO from './dto/registerDTO';
import { AuthUser } from './guard/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() body: LoginBody, @Res() res: Response): Promise<any> {
    const user = await this.authService.getUserFromLogin(
      body.email,
      body.password,
    );

    const accessToken = this.authService.createAccessToken(user);
    res.json({
      accessToken,
      refreshToken: this.authService.createRefreshToken(user),
    });
  }
  @Post()
  register(@Body() body: RegisterDTO): Promise<User> {
    return this.authService.registerUser(body.name, body.email, body.password);
  }
  @Get('refresh')
  async getRefreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const token = req.headers.authorization;
    console.log('REFRESH', token);
    const user = await this.authService.getUserFromRefreshToken(token);
    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }

    return res.send({
      ok: true,
      accessToken: this.authService.createAccessToken(user),
      refreshToken: this.authService.createRefreshToken(user),
    });
  }
  @Post('expire-tokens')
  async expireTokens(@Query() { id }) {
    return await this.authService.revokeRefreshTokensForUser(id);
  }
}
