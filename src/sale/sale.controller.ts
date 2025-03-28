import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { SaleService } from './sale.service'

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post('register')
  register(@Body() body: { userId: number; amount: string }) {
    return this.saleService.registerSale(body.userId, body.amount)
  }

  @Post('confirm')
  confirmPurchase(@Body() body: { saleId: number; amount: string; buyerAddress: string }) {
    return this.saleService.confirmPurchase(body.saleId, body.amount, body.buyerAddress)
  }

  @Get('by-address')
  getMySale(@Query('address') address: string) {
    return this.saleService.getSaleByAddress(address)
  }
}
