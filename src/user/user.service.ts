import { Injectable, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { SignupDto } from './dto/signup.dto'
import { WalletService } from 'src/wallet/wallet.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly walletService: WalletService,
  ) {}

  async signup(dto: SignupDto): Promise<User> {
    const exists = await this.userRepo.findOneBy({ phoneNumber: dto.phoneNumber })
    if (exists) throw new ConflictException('이미 등록된 전화번호입니다.')

    //wallet create
    const { walletAddress, privateKey } = this.walletService.generateWallet()

    const encryptedPrivateKey = Buffer.from(privateKey.slice(2), 'hex').toString('base64')

    // const verified = this.walletService.verifyPrivateKey(encryptedPrivateKey)
    // console.log(privateKey, 'private')
    // console.log('🔐 복원된 지갑 주소:', verified)
    // console.log('📦 원래 지갑 주소:', walletAddress)

    const referralCode = Math.random().toString(36).slice(2, 10)

    const user = this.userRepo.create({
      phoneNumber: dto.phoneNumber,
      walletAddress,
      encryptedPrivateKey,
      referralCode,
      recommenderCode: dto.recommenderCode || undefined,
    })

    return this.userRepo.save(user)
  }

  async validateUser(phoneNumber: string) {
    return await this.userRepo.findOne({ where: { phoneNumber } })
  }
}
