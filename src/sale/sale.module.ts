import { Module } from '@nestjs/common'
import { SaleController } from './sale.controller'
import { SaleService } from './sale.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}
