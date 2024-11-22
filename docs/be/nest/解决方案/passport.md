### 1. 基础安装

首先需要安装必要的依赖包：

```bash
npm install @nestjs/passport passport passport-local
npm install -D @types/passport-local

# 如果使用 JWT，还需要安装
npm install @nestjs/jwt passport-jwt
npm install -D @types/passport-jwt
```

### 2. 创建认证模块

首先创建一个 auth 模块：

```bash
nest g module auth
nest g service auth
```

### 3. 实现本地验证策略

创建 `src/auth/strategies/local.strategy.ts`：

```typescript:src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // 可以自定义登录字段
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
}
```

### 4. 实现认证服务

在 `src/auth/auth.service.ts` 中：

```typescript:src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

### 5. 配置 JWT 策略

创建 `src/auth/strategies/jwt.strategy.ts`：

```typescript:src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
```

### 6. 配置 Auth 模块

在 `src/auth/auth.module.ts` 中：

```typescript:src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### 7. 创建守卫

创建认证守卫：

```typescript:src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

```typescript:src/auth/guards/local-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

### 8. 使用示例

在控制器中使用：

```typescript:src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
```

### 9. 使用流程

1. 用户登录时，调用 `/auth/login` 接口，传入用户名和密码
2. LocalStrategy 验证用户信息
3. 验证成功后，返回 JWT token
4. 后续请求在 Header 中带上 `Authorization: Bearer <token>`
5. JwtAuthGuard 会自动验证 token 的有效性

### 10. 环境变量配置

在 `.env` 文件中添加：

```plaintext:.env
JWT_SECRET=your_jwt_secret_key
```

### 实际使用示例

1. 登录请求：

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

2. 访问受保护的接口：

```bash
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

这就是 NestJS 中使用 Passport 实现身份认证的完整流程。主要包括：

- 本地验证策略（用户名密码登录）
- JWT 验证策略（token 验证）
- 守卫的使用
- 服务的实现
- 模块的配置

建议根据实际项目需求，可以：

1. 添加更多的验证策略（如 OAuth、GitHub 登录等）
2. 自定义错误处理
3. 添加刷新 token 的功能
4. 实现权限控制
5. 添加登录限制和安全措施
