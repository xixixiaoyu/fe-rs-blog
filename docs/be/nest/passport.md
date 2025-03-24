### 先搞清楚需求

用户输入用户名和密码登录，成功后服务器发一个 JWT 回来，后续请求带着这个 JWT 就能访问受保护的路由。简单来说，分三步：

1. 用户名和密码验证用户身份。
2. 验证通过后发一个 JWT。
3. 用 JWT 保护某些路由，只让合法用户访问。



### 准备工具：安装必要的包

要用 Passport 做用户名和密码认证，咱们得装几个包。打开终端，输入以下命令：

```bash
npm install --save @nestjs/passport passport passport-local
npm install --save-dev @types/passport-local
```

这里解释一下：

- @nestjs/passport 是 Nest.js 对 Passport 的封装，让它跟 Nest 的风格无缝对接。
- passport 是核心库，负责认证逻辑。
- passport-local 是专门处理用户名和密码的策略。
- @types/passport-local 是 TypeScript 的类型定义，方便代码提示和检查。

装好这些，基础工具就齐了。接下来咱们开始搭框架。



### 搭建基本结构

为了让代码清晰，咱们得把认证和用户管理分开。用 Nest CLI 生成几个模块和服务：

```bash
nest g module auth
nest g service auth
nest g module users
nest g service users
```

这样就有了 AuthModule 和 UsersModule，分别负责认证逻辑和用户数据管理。咱们先从用户服务下手，毕竟认证得有用户数据做支撑。



### 用户服务：模拟一个用户列表

在 users/users.service.ts 里，咱们先弄一个简单的用户服务。因为是演示，咱们就用硬编码的内存数据，实际项目里你得用数据库，比如 TypeORM。代码长这样：

```ts
import { Injectable } from '@nestjs/common'

export type User = any

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme'
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess'
    }
  ]

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username)
  }
}
```

然后在 users/users.module.ts 里导出这个服务：

```ts
import { Module } from '@nestjs/common'
import { UsersService } from './users.service'

@Module({
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
```

这块很简单，就是一个假的用户列表和一个查找用户的方法。接下来咱们把认证逻辑交给 AuthService。



### 认证服务：验证用户

在 auth/auth.service.ts 里，咱们实现验证用户的逻辑。核心是 validateUser 方法，检查用户名和密码是否匹配：

```ts
import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    return null
  }
}
```

注意这里有个小细节：验证通过后，我用对象展开运算符把 password 去掉了，只返回安全的信息。这是个好习惯，防止敏感数据泄露。

还有个大大的提醒：实际项目里密码不能明文存储！得用像 bcrypt 这样的库做加盐哈希处理。这里为了简单才用明文，生产环境千万别学我！



### 配置认证模块

AuthService 依赖 UsersService，所以得在 auth/auth.module.ts 里导入 UsersModule：

```ts
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService]
})
export class AuthModule {}
```

这里还加了 PassportModule，因为咱们要用 Passport 的功能。



### 实现本地策略

Passport 的核心是“策略”，咱们用 passport-local 来处理用户名和密码认证。在 auth 目录下新建 local.strategy.ts：

```ts
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
```

这个策略继承了 PassportStrategy，通过 super() 调用父类的构造函数。validate 方法是关键，它调用 AuthService 的验证逻辑，如果用户不存在或密码不对，就抛出未授权异常。

然后更新 AuthModule，加入这个策略：

```ts
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
```



### 登录路由：用守卫触发认证

现在咱们来实现登录功能。在 app.controller.ts 里加一个 /auth/login 路由：

```ts
import { Controller, Request, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class AppController {
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return req.user
  }
}
```

这里用 @UseGuards(AuthGuard('local')) 来触发 LocalStrategy 的验证。Passport 会在验证通过后把用户信息挂到 req.user 上，咱们直接返回它。

试试看，用 cURL 测试一下：

```bash
curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
```

应该会返回 {"userId": 1, "username": "john"}。成功了！

但为了避免硬编码策略名，咱们再封装一个守卫。在 auth 目录下新建 local-auth.guard.ts：

```ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

然后改一下控制器：

```ts
import { Controller, Request, Post, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from './auth/local-auth.guard'

@Controller()
export class AppController {
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user
  }
}
```

这样更优雅，代码也更清晰。



### 加入 JWT

光返回用户信息还不够，咱们得发个 JWT 给客户端。安装相关包：

```bash
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```

在 auth.service.ts 里加个 login 方法：

```ts
import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
```

JWT 的密钥放一个单独文件 auth/constants.ts 里：

```ts
export const jwtConstants = {
  secret: 'mySecretKey123' // 实际项目里用复杂密钥并妥善管理
}
```

更新 AuthModule 配置 JWT：

```ts
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}
```

改一下登录路由，返回 JWT：

```ts
import { Controller, Request, Post, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service'

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }
}
```

再测一下：

```bash
curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
```

会返回一个带 access_token 的对象，比如 {"access_token": "eyJhbGciOiJIUzI..."}。



### 保护路由：用 JWT 验证

现在加个 JWT 策略，在 auth/jwt.strategy.ts 里：

```ts
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from './constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }
  }
}
```

更新 AuthModule，加入 JwtStrategy：

```ts
providers: [AuthService, LocalStrategy, JwtStrategy]
```

新建 JWT 守卫 auth/jwt-auth.guard.ts：

```ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

在控制器里加个受保护路由：

```ts
import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service'

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
```

测试一下，先登录拿到 token，然后访问 /profile：

```bash
curl http://localhost:3000/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

成功的话会返回用户信息，比如 {"userId": 1, "username": "john"}。



### 总结

到这儿，一个基本的身份验证系统就搭好了！从用户名密码登录到颁发 JWT，再到保护路由，整个流程清晰又实用。Passport 和 Nest.js 的组合真是绝配，既灵活又好上手。实际项目里，你可以换成数据库存储用户，加个密码加密，再扩展更多策略，比如 OAuth 或第三方登录。
