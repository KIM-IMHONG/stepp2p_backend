import { Controller, Post, Body, Get, Param, Query, ParseIntPipe } from '@nestjs/common'
import { RegisterSaleDto } from './dto/register-sale.dto'
import { SaleService } from './sale.service'
import { CancelSaleDto } from './dto/cancel-sale.dto'
import { GetSalesQueryDto } from './dto/get-sale.dto'

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post('register')
  register(@Body() dto: RegisterSaleDto) {
    return this.saleService.registerSale(dto.walletAddress, dto.amount)
  }

  @Post('confirm')
  confirmPurchase(@Body() body: { saleId: number; amount: string; buyerAddress: string }) {
    return this.saleService.confirmPurchase(body.saleId, body.amount, body.buyerAddress)
  }

  @Post('cancel')
  cancel(@Body() dto: CancelSaleDto) {
    return this.saleService.cancelSale(dto.walletAddress, dto.saleId)
  }

  @Get('/sales/:saleId/transactions')
  GetTransactions(@Param('saleId', ParseIntPipe) saleId: number) {
    return this.saleService.getTransactionsBySaleId(saleId)
  }

  @Get('/sales/:walletAddress')
  getMySale(@Param('walletAddress') address: string) {
    return this.saleService.getSaleByAddress(address)
  }

  @Get('/sales')
  getSales(@Query() query: GetSalesQueryDto) {
    return this.saleService.getSales(query)
  }
}
