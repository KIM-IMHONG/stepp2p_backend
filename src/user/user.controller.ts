import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common'
import { UserService } from './user.service'
import { SignupDto } from './dto/signup.dto'
import { User } from './entities/user.entity'
import { LoginDto } from './dto/login.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<User> {
    return this.userService.signup(dto)
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.userService.validateUser(dto.phoneNumber)
    if (!user) throw new UnauthorizedException('유저를 찾을 수 없습니다.')
    // 이후 jwt
    return {
      message: '로그인 성공',
      userId: user.id,
      walletAddress: user.walletAddress,
    }
  }
}
