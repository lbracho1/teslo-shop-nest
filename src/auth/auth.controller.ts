import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, RawHeaders, Auth, RoleProtected } from './decorators';
import { User } from './entities/user.entity';
import { UseRolesGuard } from './guards/use-roles/use-roles.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUser: CreateUserDto) {
    return this.authService.create(createUser);
  };

  @Post('login')
  loginUser(@Body() loginUser: LoginUserDto) {
    return this.authService.login(loginUser);
  };

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[]
  ) {

    console.log(request)

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders
    }
  };

  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UseRolesGuard)
  privateRoute2(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
    }
  };

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
    }
  };
};
