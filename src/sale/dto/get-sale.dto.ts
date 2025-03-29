import { IsOptional, IsString, IsIn } from 'class-validator'

export class GetSalesQueryDto {
  @IsOptional()
  @IsString()
  seller?: string

  @IsOptional()
  @IsIn(['active', 'cancelled', 'ended'])
  status?: 'active' | 'cancelled' | 'ended'

  @IsOptional()
  start?: string

  @IsOptional()
  end?: string
}
