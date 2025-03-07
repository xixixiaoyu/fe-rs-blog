### 认证到底是什么？咱们要干啥？

先说说需求：我们要做一个简单的认证系统，用户输入用户名和密码，服务器验证通过后返回一个 JWT（JSON Web Token），之后用户拿着这个令牌访问受保护的路由。那咱们就从头开始，分三步走：

1. **用户认证**：验证用户名和密码。
2. **颁发 JWT**：认证通过后给用户一个令牌。
3. **保护路由**：只有带有效令牌的请求才能访问特定接口。



### 第一步：搭好基础模块

咱们先把认证相关的模块和服务建起来。假设你已经装好了 Nest CLI（没装就 npm i -g @nestjs/cli），在项目里跑几条命令：

```bash
$ nest g module auth
$ nest g controller auth
$ nest g service auth
```

这会生成一个 AuthModule，里面有 AuthController（处理请求）和 AuthService（写认证逻辑）。但光有认证还不够，咱们得管用户信息，所以再建一个 Users 模块：

```bash
$ nest g module users
$ nest g service users
```

用户数据咋存呢？真实项目里你可能会用数据库（比如 TypeORM 连 MySQL），但为了简单，咱们先用一个硬编码的内存数组模拟用户列表。来看看 UsersService：

```ts
import { Injectable } from '@nestjs/common'

export type User = any

@Injectable()
export class UsersService {
  private readonly users = [
    { userId: 1, username: 'john', password: 'changeme' },
    { userId: 2, username: 'maria', password: 'guess' }
  ]

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username)
  }
}
```

这个服务很简单，就是一个用户数组和一个 findOne 方法，通过用户名找用户。

注意这里 User 类型用 any 是偷懒，实际项目里你得定义个接口，比如 { userId: number, username: string, password: string }。

UsersModule 也得改一下，把 UsersService 暴露出去给其他模块用：

```ts
import { Module } from '@nestjs/common'
import { UsersService } from './users.service'

@Module({
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
```



### 第二步：实现登录功能

接下来咱们写登录逻辑。AuthService 是核心，负责验证用户和密码。打开 auth.service.ts，加上这个：

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (user?.password !== pass) {
      throw new UnauthorizedException('用户名或密码不对哦')
    }
    const { password, ...result } = user
    return result
  }
}
```

这里代码：

- 用 UsersService 找用户。
- 如果用户不存在或者密码不对，就抛个异常（UnauthorizedException）。
- 验证通过后，把 password 从返回结果里剥掉（安全起见），只返回其他字段。

**注意**：咱们这里密码是明文对比简单做，真实项目不能这么做！得用 bcrypt 之类的库把密码哈希加盐存起来，验证时比对哈希值。

AuthModule 得引入 UsersModule，不然 AuthService 用不了：

```ts
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
```

然后是控制器，定义一个登录接口：

```ts
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password)
  }
}
```

这个接口很简单：

- 用 @Post('login') 定义 /auth/login 路由。
- 从请求体里拿 username 和 password。
- 调用 AuthService 的 signIn 方法。

可以用 cURL 测试一下：

```bash
$ curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
{"userId":1,"username":"john"}
```

成功返回用户信息！但这还不够，咱们得发 JWT。



### 第三步：集成 JWT

JWT 是啥？简单说就是一个加密的令牌，包含用户信息，可以验证身份。咱们用 @nestjs/jwt 来搞定，先装包：

```bash
$ npm install --save @nestjs/jwt
```

然后改 AuthService，生成 JWT：

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username)
    if (user?.password !== pass) {
      throw new UnauthorizedException('用户名或密码不对哦')
    }
    const payload = { sub: user.userId, username: user.username }
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
```

这段代码：

- 注入了 JwtService。
- 验证通过后，创建 payload（包含 userId 和 username），用 signAsync 生成 JWT。
- 返回的对象带个 access_token 字段。

AuthModule 也得配一下 JwtModule：

先建个常量文件：

```js
export const jwtConstants = {
  secret: '超简单密钥别用我'
}
```

注意：这个 secret 是签名 JWT 的密钥，生产环境里得用复杂字符串，最好放环境变量里，别写死代码里！

更新 Auth 模块：

```ts
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
```

这里设置了 JWT 有效期 60 秒，过期后得重新登录。再次测试：

```bash
$ curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

拿到令牌了！



### 第四步：保护路由

现在加个受保护的路由，只有带有效 JWT 的请求能访问。咱们用守卫（Guard）来实现，新建 auth.guard.ts：

```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('没带令牌哦')
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret
      })
      request['user'] = payload
    } catch {
      throw new UnauthorizedException('令牌无效或过期啦')
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
```

这个守卫干啥？

- 从请求头里提取 Bearer 令牌。
- 用 JwtService 验证令牌有效性。
- 有效就把 payload 塞到 request.user 里，供后续用。

更新 AuthController，加个受保护的 /profile 接口：

```ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
```

测试一下：

```ts
$ curl http://localhost:3000/auth/profile
{"statusCode":401,"message":"没带令牌哦"}

$ curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

$ curl http://localhost:3000/auth/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
{"sub":1,"username":"john","iat":...,"exp":...}
```

完美！没令牌报 401，带有效令牌就能拿到用户信息。等 60 秒后令牌过期，再试就又会失败。



#### 总结与提升

到这儿，一个基本的认证系统就搞定了！咱们从零开始，搭模块、写登录逻辑、发 JWT，最后保护路由，全程一步步走下来，是不是挺清晰？

想更进一步？试试这些：

- 用 bcrypt 加密密码，别存明文。
- 定义 DTO（Data Transfer Object）校验请求体。
- 把守卫设为全局，只用 @Public() 标记公开路由。
- 集成 Passport 库，体验更强大的认证策略。
