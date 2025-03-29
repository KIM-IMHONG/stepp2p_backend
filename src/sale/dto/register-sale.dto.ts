import { IsString, IsNotEmpty } from 'class-validator'

export class RegisterSaleDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string

  @IsString()
  @IsNotEmpty()
  amount: string
}
