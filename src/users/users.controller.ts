import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Query,
  Delete,
  Patch,
  Session,
} from '@nestjs/common';
import { AuthUserDTO } from './dtos/createUserDto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UpdateUserDto } from './dtos/updateUserDto';
import { Serialize } from '../Interceptors/serialize.interceptors';
import { UserDto } from './dtos/userDto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  async getUserDetails(@Session() session: any) {
    return this.userService.findOneById(session.userId);
  }

  @Post('/signup')
  @Serialize(UserDto)
  async createUser(@Body() body: AuthUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async signInUser(@Body() body: AuthUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  findOneUser(@Param('id') id: string) {
    return this.userService.findOneById(parseInt(id));
  }

  @Get()
  async findAllUsers(@Query() email: string, @Res() res: Response) {
    const users = await this.userService.findByEmail(email);
    res
      .status(200)
      .json({ message: 'User has successfully signed in', data: users });
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    await this.userService.removeUser(parseInt(id));
    res.status(204).json({ message: 'User has been successfully deleted' });
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    const updatedDetails = await this.userService.updateUserDetails(
      parseInt(id),
      body,
    );
    return res.status(200).json({
      message: 'User details has been updated..',
      data: updatedDetails,
    });
  }
}
