import { ValidationPipe } from '@nestjs/common'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // dto에 없는 값은 자동 제거
      forbidNonWhitelisted: true, // dto에 없는 값 있으면 막기
      transform: true, // 타입 자동 변환 (string → number 등)
    }),
  )

  await app.listen(process.env.PORT ?? 5000)
}
bootstrap()
