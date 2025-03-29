import { Module } from '@nestjs/common'
import { SaleController } from './sale.controller'
import { SaleService } from './sale.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'
import { Sale } from './entities/sale.entity'
import { SaleTransaction } from './entities/sale_transaction.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleTransaction, User])],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}
