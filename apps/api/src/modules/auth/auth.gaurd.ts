import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const valid = !!request.session?.siwe;
    if (!valid) {
      throw new UnauthorizedException('Unauthorized');
    }
    return valid;
  }
}
