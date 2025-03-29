import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/user/entities/user.entity'
import { parseUnits } from 'viem'
import { bsc } from 'viem/chains'
import { STEPP2P_ABI } from 'src/contract/stepp2p.abi'
import { USDT_ABI } from 'src/contract/usdt.abi'
import { ConfigService } from '@nestjs/config'
import { createPublicViemClient, getWalletClientWithAccount } from 'src/utils/viem-client'
import { Sale } from './entities/sale.entity'
import { SaleTransaction } from './entities/sale_transaction.entity'
import { GetSalesQueryDto } from './dto/get-sale.dto'

@Injectable()
export class SaleService {
  private readonly USDT_ADDRESS: `0x${string}`
  private readonly STEPP2P_ADDRESS: `0x${string}`
  private readonly RPC_URL: string
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepo: Repository<Sale>,
    @InjectRepository(SaleTransaction)
    private readonly saleTxRepo: Repository<SaleTransaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private config: ConfigService,
  ) {
    this.USDT_ADDRESS = this.config.getOrThrow('USDT_ADDRESS') as `0x${string}`
    this.STEPP2P_ADDRESS = this.config.getOrThrow('STEPP2P_ADDRESS') as `0x${string}`
    this.RPC_URL = this.config.getOrThrow('BSC_RPC_URL')
  }

  async registerSale(walletAddress: string, amount: string) {
    const user = await this.userRepo.findOne({ where: { walletAddress } })
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.')

    console.log(walletAddress, 'walletAddress')

    const { client, account } = getWalletClientWithAccount(user.encryptedPrivateKey, this.RPC_URL)
    const parsedAmount = parseUnits(amount, 18)

    await client.writeContract({
      address: this.USDT_ADDRESS,
      abi: USDT_ABI,
      functionName: 'approve',
      args: [this.STEPP2P_ADDRESS, parsedAmount],
      chain: bsc,
      account,
    })

    const txHash = await client.writeContract({
      address: this.STEPP2P_ADDRESS,
      abi: STEPP2P_ABI,
      functionName: 'createSaleOrder',
      args: [parsedAmount],
      chain: bsc,
      account,
    })

    const lastSaleId = await this.getLastSaleIdFromContract(walletAddress)

    await this.saleRepo.save({
      saleId: Number(lastSaleId),
      seller: walletAddress,
      totalAmount: parsedAmount.toString(),
      remaining: parsedAmount.toString(),
      status: 'active',
      txHash,
    })

    return { ok: true, txHash }
  }

  async getLastSaleIdFromContract(address: string): Promise<bigint> {
    const client = createPublicViemClient(this.RPC_URL)

    const lastSaleId = await client.readContract({
      address: this.STEPP2P_ADDRESS,
      abi: STEPP2P_ABI,
      functionName: 'lastSellerSaleId',
      args: [address as `0x${string}`],
    })

    return lastSaleId as bigint
  }

  async confirmPurchase(saleId: number, amount: string, buyerAddress: string) {
    const adminPrivateKey = this.config.getOrThrow('ADMIN_PRIVATEKEY') as `0x${string}`
    const parsedAmount = parseUnits(amount, 18)

    const { client, account } = getWalletClientWithAccount(adminPrivateKey, this.RPC_URL)

    const txHash = await client.writeContract({
      address: this.STEPP2P_ADDRESS,
      abi: STEPP2P_ABI,
      functionName: 'purchase',
      args: [saleId, parsedAmount, buyerAddress as `0x${string}`],
      chain: bsc,
      account,
    })

    const sale = await this.saleRepo.findOne({ where: { saleId } })
    if (sale) {
      const currentRemaining = BigInt(sale.remaining)
      const newRemaining = currentRemaining - parsedAmount
      sale.remaining = newRemaining.toString()

      if (newRemaining === BigInt(0)) {
        sale.status = 'ended'
      }
      await this.saleRepo.save(sale)

      await this.saleTxRepo.save({
        saleId,
        buyer: buyerAddress,
        amount: parsedAmount.toString(),
        txHash,
      })
    }

    return { ok: true, txHash }
  }

  async cancelSale(walletAddress: string, saleId: number) {
    const user = await this.userRepo.findOne({ where: { walletAddress } })
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.')

    const { client, account } = getWalletClientWithAccount(user.encryptedPrivateKey, this.RPC_URL)

    const txHash = await client.writeContract({
      address: this.STEPP2P_ADDRESS,
      abi: STEPP2P_ABI,
      functionName: 'cancelSaleOrder',
      args: [saleId],
      chain: bsc,
      account,
    })

    const sale = await this.saleRepo.findOne({ where: { saleId } })
    if (sale) {
      sale.status = 'cancelled'
      await this.saleRepo.save(sale)
    }

    return { ok: true, txHash }
  }

  async getTransactionsBySaleId(saleId: number) {
    return this.saleTxRepo.find({
      where: { saleId },
      order: { createdAt: 'DESC' },
    })
  }

  async getSaleByAddress(walletAddress: string) {
    const sales = await this.saleRepo.find({
      where: { seller: walletAddress },
      order: { createdAt: 'DESC' },
    })

    return sales
  }

  async getSales(query: GetSalesQueryDto) {
    const { seller, status, start, end } = query

    const where: any = {}

    if (seller) where.seller = seller
    if (status) where.status = status

    if (start || end) {
      where.createdAt = {}
      if (start) where.createdAt['$gte'] = new Date(start)
      if (end) where.createdAt['$lte'] = new Date(end)
    }

    return this.saleRepo.find({
      where,
      order: { createdAt: 'DESC' },
    })
  }
}
