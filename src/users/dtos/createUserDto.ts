import { IsString, IsEmail } from 'class-validator';

export class AuthUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
