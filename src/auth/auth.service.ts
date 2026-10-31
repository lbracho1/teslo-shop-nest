import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import * as bcrypt from "bcrypt";

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) { }

  async create(createUser: CreateUserDto) {

    try {

      const { password, ...userData } = createUser;

      const user = this.usersRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.usersRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };


    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async login(loginUser: LoginUserDto) {

    const { password, email } = loginUser;

    const user = await this.usersRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });


    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');



    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };

  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  };

  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);

    return token;
  };

  private handleDBErrors(error: any): never {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs')
  }

}
