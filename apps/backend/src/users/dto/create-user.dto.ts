import { IsEmail, IsString, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsIn(['ENGINEER', 'MANAGER', 'ADMIN'], { message: 'Valid role required' })
  role: 'ENGINEER' | 'MANAGER' | 'ADMIN';
}
