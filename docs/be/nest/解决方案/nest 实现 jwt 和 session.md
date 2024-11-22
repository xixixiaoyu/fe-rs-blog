# Nest.js 实现 Session 和 JWT 认证详解

## 引言

在 Web 应用中,维护用户会话状态是一个基础且重要的需求。本文将详细介绍如何在 Nest.js 中实现两种主流的状态管理方案:Session + Cookie 和 JWT (JSON Web Token)。

## Session + Cookie 实现

### 1. 基础配置

首先需要安装必要的依赖:

```bash
npm install express-session @types/express-session
```

在 `main.ts` 中配置 session 中间件:

```typescript:src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));

  await app.listen(3000);
}
bootstrap();
```

### 2. 使用 Session

在 Controller 中可以通过 `@Session()` 装饰器轻松访问 session:

```typescript:src/app.controller.ts
@Controller()
export class AppController {
  @Get('session-test')
  testSession(@Session() session) {
    session.count = (session.count || 0) + 1;
    return { count: session.count };
  }
}
```

## JWT 实现

### 1. 配置 JWT

首先安装 JWT 模块:

```bash
npm install @nestjs/jwt
```

在 AppModule 中注册 JwtModule:

```typescript:src/app.module.ts
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-jwt-secret',
      signOptions: { expiresIn: '7d' }
    })
  ],
  // ...
})
export class AppModule {}
```

### 2. JWT 认证实现

```typescript:src/auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  async login(@Body() credentials) {
    // ... 验证逻辑 ...
    const token = this.jwtService.sign({
      userId: user.id,
      username: user.username
    });

    return { token };
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  getProtectedResource(@Headers('authorization') auth: string) {
    const token = auth.split(' ')[1];
    const decoded = this.jwtService.verify(token);
    return { message: '认证成功', user: decoded };
  }
}
```

## 两种方案的对比

### Session + Cookie

- 优点:
  - 实现简单,开发体验好
  - 服务端可以主动清除 session
- 缺点:
  - 需要服务端存储,增加服务器负担
  - 分布式系统下 session 同步较复杂

### JWT

- 优点:
  - 无状态,适合分布式系统
  - 不需要服务端存储
- 缺点:
  - Token 无法主动失效
  - Token 体积较大
  - 需要自行处理 Token 的刷新

## 最佳实践建议

1. 小型单体应用推荐使用 Session
2. 分布式系统推荐使用 JWT
3. 重要系统可以考虑两种方案结合使用
4. JWT 一定要注意 Token 的过期时间设置
5. 生产环境中 secret 需要使用强密钥并妥善保管

## 总结

本文详细介绍了在 Nest.js 中实现 Session 和 JWT 两种认证方式的具体步骤和注意事项。选择哪种方案需要根据具体的业务场景来决定。无论选择哪种方案,安全性都是需要重点考虑的因素。

希望这篇文章对你实现 Nest.js 的用户认证有所帮助!
