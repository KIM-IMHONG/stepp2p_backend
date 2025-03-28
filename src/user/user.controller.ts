import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { SignupDto } from './dto/signup.dto'
import { User } from './entities/user.entity'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<User> {
    return this.userService.signup(dto)
  }
}
