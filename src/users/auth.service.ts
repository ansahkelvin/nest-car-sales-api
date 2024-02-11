import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser.length) {
      throw new BadRequestException('Email is in use');
    }
    //Hash password and Encrypt it
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return await this.userService.create(email, result);
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const [salt, hashedPassword] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hashedPassword !== hash.toString('hex')) {
      throw new BadRequestException('Invalid Credentials');
    }
    return user;
  }
}
