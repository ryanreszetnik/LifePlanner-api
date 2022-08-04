import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { User } from 'src/db/entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';

import { Response } from 'express';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  getFullUserById(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder()
      .select('*')
      .where('id = :id', { id: id })
      .getRawOne();
  }
  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  getOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { email } });
  }
  getOneById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }
  deleteUser(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
