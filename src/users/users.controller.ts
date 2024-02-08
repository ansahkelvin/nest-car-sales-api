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
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { parse } from 'ts-jest';
import { UpdateUserDto } from './dtos/updateUserDto';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.create(body.email, body.password);
    res
      .status(201)
      .json({ message: 'User has successfully signed in', data: user });
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
    await this.userService.removeUser(parse(id));
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
