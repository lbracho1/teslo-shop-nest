import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { UseRolesGuard } from '../guards/use-roles/use-roles.guard';

export const Auth = (...roles: ValidRoles[]) => {

    return applyDecorators(
        RoleProtected(...roles),

        UseGuards(AuthGuard(), UseRolesGuard),
    );
}

