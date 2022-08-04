import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { User } from 'src/db/entity/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUserFromRefreshToken(token: string) {
    if (!token) {
      return null;
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return null;
    }
    //token is valid and can send back an access token
    const user = await this.userRepository
      .createQueryBuilder()
      .select('*')
      .where('id = :id', { id: payload.userId })
      .getRawOne();
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return null;
    }
    return user;
  }
  async getUserFromLogin(email: string, password: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder()
      .select('*')
      .where('email = :email', { email: email })
      .getRawOne();

    if (!user) {
      throw new Error('could not find user');
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error('Incorrect Password');
    }
    return user;
  }
  async registerUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await hash(password, 12);

    return this.userRepository.save({ name, email, password: hashedPassword });
  }
  async revokeRefreshTokensForUser(id: number) {
    await this.userRepository.increment({ id }, 'tokenVersion', 1);
    return true;
  }
  createAccessToken(user: User) {
    return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.ACCES_TOKEN_EXP_TIME,
    });
  }
  createRefreshToken(user: User) {
    return sign(
      { userId: user.id, tokenVersion: user.tokenVersion },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXP_TIME,
      },
    );
  }
}
