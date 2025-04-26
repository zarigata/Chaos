import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  // Security question for account recovery
  @IsString()
  @MinLength(5)
  securityQuestion!: string;
  // Answer to security question
  @IsString()
  @MinLength(1)
  securityAnswer!: string;
}
