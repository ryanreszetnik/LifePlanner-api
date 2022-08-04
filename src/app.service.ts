import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './db/entity/user.entity';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  appLoad(userId: number): any {
    return this.userRepository.find({
      where: { id: userId },
      relations: {
        courses: { tasks: true, events: true },
        tasks: { scheduled: true },
      },
    });
  }
}
