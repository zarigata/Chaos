import { IsEmail, IsString, MinLength } from 'class-validator';

export class ForgotDto {
  @IsEmail()
  email!: string;
}

export class ResetDto {
  @IsEmail()
  email!: string;

  @IsString()
  securityAnswer!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}
