import { Injectable } from '@nestjs/common'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

@Injectable()
export class WalletService {
  generateWallet() {
    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey)

    return {
      walletAddress: account.address,
      privateKey,
    }
  }

  // verifyPrivateKey(base64key: string): string {
  //   const decrypted = '0x' + Buffer.from(base64key, 'base64').toString('hex')
  //   const account = privateKeyToAccount(decrypted as `0x${string}`)
  //   return account.address
  // }
}
