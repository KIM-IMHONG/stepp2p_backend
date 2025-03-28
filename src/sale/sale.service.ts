import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/user/entities/user.entity'
import { createPublicClient, parseUnits } from 'viem'
import { bsc } from 'viem/chains'
import { STEPP2P_ABI } from 'src/contract/stepp2p.abi'
import { USDT_ABI } from 'src/contract/usdt.abi'
import { ConfigService } from '@nestjs/config'
import { createPublicViemClient, getWalletClientWithAccount } from 'src/utils/viem-client'

@Injectable()
export class SaleService {
  private readonly USDT_ADDRESS: `0x${string}`
  private readonly STEPP2P_ADDRESS: `0x${string}`
  private readonly RPC_URL: string
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private config: ConfigService,
  ) {
    this.USDT_ADDRESS = this.config.getOrThrow('USDT_ADDRESS') as `0x${string}`
    this.STEPP2P_ADDRESS = this.config.getOrThrow('STEPP2P_ADDRESS') as `0x${string}`
    this.RPC_URL = this.config.getOrThrow('BSC_RPC_URL')
  }

  async registerSale(userId: number, amount: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.')

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

    return { ok: true, txHash }
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

    return { ok: true, txHash }
  }

  async getSaleByAddress(address: string) {
    const client = createPublicViemClient(this.RPC_URL)

    const saleIds = (await client.readContract({
      address: this.STEPP2P_ADDRESS,
      abi: STEPP2P_ABI,
      functionName: 'sellerSales',
      args: [address as `0x${string}`],
    })) as bigint[]

    const sales = await Promise.all(
      saleIds.map(async (id: bigint) => {
        const sale = (await client.readContract({
          address: this.STEPP2P_ADDRESS,
          abi: STEPP2P_ABI,
          functionName: 'sales',
          args: [id],
        })) as [string, bigint, bigint, boolean]

        return {
          saleId: Number(id),
          seller: sale[0],
          totalAmount: sale[1].toString(),
          remaining: sale[2].toString(),
          active: sale[3],
        }
      }),
    )
  }
}
