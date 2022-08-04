import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from '../ormconfig';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { UserService } from './user/user.service';
import { AuthGuard } from './auth/guard/auth.guard';
import { CourseModule } from './course/course.module';
import { User } from './db/entity/user.entity';
import { AuthService } from './auth/auth.service';
import { TaskModule } from './task/task.module';
import { ScheduledModule } from './scheduled/scheduled.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([User]),
    UserModule,
    AuthModule,
    CourseModule,
    TaskModule,
    ScheduledModule,
    // forwardRef(() => AuthModule),
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard, AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
