import { Request } from 'express';
import { User } from 'src/db/entity/user.entity';

export default interface MyRequest extends Request {
  user?: User;
}
