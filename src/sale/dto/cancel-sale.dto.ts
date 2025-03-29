import { IsString, IsNumber } from 'class-validator'

export class CancelSaleDto {
  @IsString()
  walletAddress: string

  @IsNumber()
  saleId: number
}
