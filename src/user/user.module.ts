import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { WalletService } from 'src/wallet/wallet.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, WalletService],
  controllers: [UserController],
})
export class UserModule {}
