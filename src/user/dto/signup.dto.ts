import { IsString, IsOptional } from 'class-validator'

export class SignupDto {
  @IsString()
  phoneNumber: string

  @IsOptional()
  @IsString()
  recommenderCode?: string
}
