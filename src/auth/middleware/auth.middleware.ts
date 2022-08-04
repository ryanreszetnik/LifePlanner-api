import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { User } from 'src/db/entity/user.entity';
import MyRequest from 'src/types/MyRequest';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: MyRequest, res: Response, next: () => void) {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      console.log('no auth header');
      next();
      return;
    }
    try {
      const token = authorization.split(' ')[1];
      console.log(token);
      const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = await this.userService.getFullUserById(payload.userId);
      if (!user) {
        next();
        return;
      }
      req.user = user;
    } catch (err) {
      console.log('Not authenticated');
    }
    next();
  }
}
