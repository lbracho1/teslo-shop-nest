import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { User } from 'src/auth/entities/user.entity';
import { META_ROLE } from 'src/auth';

@Injectable()
export class UseRolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLE, context.getHandler());

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      };
    };

    throw new ForbiddenException(
      `User ${user.fullName} need valid role: [${validRoles}]`
    );
  };
};
