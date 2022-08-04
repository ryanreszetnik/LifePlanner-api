import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

// export function Auth(...roles: Role[]) {
//   return applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard));
// }

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard));
}
