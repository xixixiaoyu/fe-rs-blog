## 服务端存储：Session + Cookie 方案
### 工作流程

1. 用户登录时，服务端生成一个 Session ID，并将其存储在 Cookie 中。
2. 客户端在后续请求中自动携带这个 Cookie。
3. 服务端根据 Cookie 中的 Session ID 查找并验证用户身份。

### 存在的问题及解决方案

- CSRF（跨站请求伪造）：因为 Cookie 会自动携带，可能会被恶意网站利用。解决方案包括验证 Referer 或使用随机 Token。
- 分布式 Session：在多台服务器的场景下，Session 同步是个问题。常见解决方案包括 Session 复制和 Redis 存储。
- 跨域问题：Cookie 有域名限制，跨域请求时可能无法携带。可以通过设置顶级域名或在服务端进行中转来解决。

## 客户端存储：JWT (JSON Web Tokens) 方案
与 Session + Cookie 方案不同，JWT（JSON Web Token）方案将状态数据存储在客户端，并在每次请求中携带这些数据。<br />JWT 通常存储在请求头中，而不是 Cookie 中。<br />JWT 结构：JWT 由三部分组成：Header、Payload 和 Verify Signature。

- Header：包含加密算法信息。
- Payload：存储具体的状态数据。
- Verify Signature：对 Header 和 Payload 进行加密生成的签名。

### 工作流程

1. 用户登录时，服务端生成一个 JWT，并将其返回给客户端。
2. 客户端在后续请求中将 JWT 存储在请求头中（例如 Authorization）。
3. 服务端解析 JWT，验证签名并提取状态数据。

### 优缺点
优点：

- 无 CSRF 问题：因为状态数据不存储在服务端，不依赖自动携带的 Cookie。
- 无分布式 Session 问题：状态数据存储在客户端，任何服务器都可以解析 JWT。
- 无跨域问题：JWT 不受 Cookie 的域名限制。

缺点：

- 安全性：JWT 的数据是 Base64 编码的，可能泄露敏感信息。需要搭配 HTTPS 使用。
- 性能：每次请求都携带完整的状态数据，可能影响性能。
- 无法手动失效：因为状态数据存储在客户端，无法手动让 JWT 失效。可以通过 Redis 记录 JWT 的生效状态来解决。


## 使用 Session + Cookie 实现会话管理
### 创建 Nest.js 项目
首先，使用 @nest/cli 创建一个新的 Nest.js 项目：
```bash
nest new jwt-and-session -p pnpm
```
### 安装依赖
安装 express-session 及其类型定义：
```bash
pnpm install express-session @types/express-session
```
### 配置 Session
在项目的入口文件中启用 express-session：
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'yun', // 加密的密钥
      resave: false, // 仅在 session 内容变化时更新 session
      saveUninitialized: false, // 不自动初始化 Session
    }),
  );

  await app.listen(3000);
}

bootstrap();
```

### 使用 Session
在控制器中使用 @Session 装饰器来访问 session 对象：
```typescript
import { Controller, Get, Session } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('session')
  sss(@Session() session) {
    // 如果会话对象中存在 count 属性，则将其值加 1，否则将其初始化为 1
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }
}
```
每次访问 /session 路由时，session.count 的值会递增。

### 运行项目并测试
```bash
pnpm start:dev
```
第一次访问：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1716725665858-dcd3410b-fd57-4211-9d30-5db175fc7437.png#averageHue=%23282828&clientId=ucbce0d7a-24a9-4&from=paste&height=249&id=hhYo3&originHeight=398&originWidth=594&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=36276&status=done&style=none&taskId=u22593db7-0843-4735-8430-477cf71117b&title=&width=371.24999446794396)<br />继续访问：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1716725697050-2a0a8550-b07e-4f20-aa1a-01511d322cb8.png#averageHue=%23292929&clientId=ucbce0d7a-24a9-4&from=paste&height=226&id=lGHJ2&originHeight=362&originWidth=590&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=35423&status=done&style=none&taskId=ud93f80e5-e165-4338-9298-300160a2e86&title=&width=368.74999450519687)

返回了一个 cookie connect.sid，这是对应的 session ID。<br />cookie 会在请求时自动携带，实现了状态管理：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1716726536216-cf32f683-2640-4589-a3a2-e13cdeee287e.png#averageHue=%23252525&clientId=uf82c7fde-0116-4&from=paste&height=227&id=u3fe23f3d&originHeight=364&originWidth=2176&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=82223&status=done&style=none&taskId=ue6357e0b-bba0-42b4-9624-529d968b1d0&title=&width=1359.999979734421)


## 使用 JWT 实现会话管理
### 安装依赖
安装 @nestjs/jwt：
```bash
pnpm install @nestjs/jwt
```

### 配置 JwtModule
在 AppModule 中引入 JwtModule 并进行配置：
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yun', // 加密的密钥
      signOptions: {
        expiresIn: '7d', // 令牌过期时间
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 生成和验证 JWT
在控制器中注入 JwtService 并添加处理方法：
```typescript
import {
  Controller,
  Get,
  Res,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('jwt')
  handleJwtRequest(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ): number {
    try {
      const count = this.getCountFromToken(authorization);

      const newToken = this.jwtService.sign({ count: count + 1 });

      response.setHeader('token', newToken);

      return count + 1;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  // 从授权头中提取并验证 JWT，返回计数值
  private getCountFromToken(authorization: string): number {
    if (authorization) {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);
      return data.count;
    } else {
      return 0;
    }
  }
}
```
访问接口获取 token：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1716727030316-b4e71ecf-ef06-41f4-b6ff-32e9d089c9a9.png#averageHue=%23222221&clientId=u4b4d1341-4996-4&from=paste&height=311&id=uc935f4fd&originHeight=498&originWidth=2174&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=100216&status=done&style=none&taskId=u54d4b927-2111-4872-b7c5-7b73ed9b987&title=&width=1358.7499797530475)<br />将 token 放到请求头中请求，这次访问又会产生新 token：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1716727103292-e5137b04-55ab-4cde-b631-e88a2f5a5609.png#averageHue=%23262524&clientId=u4b4d1341-4996-4&from=paste&height=446&id=u897b2f4c&originHeight=714&originWidth=2176&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=109343&status=done&style=none&taskId=u07172ae3-aa0e-41f4-ba91-3fdedb34e3a&title=&width=1359.999979734421)<br />将新 token 继续放到请求头中访问：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1716727203183-7e0cc3c1-dbaf-40a4-aa01-6de7577e0b34.png#averageHue=%23212121&clientId=u4b4d1341-4996-4&from=paste&height=386&id=u60da0f7b&originHeight=618&originWidth=1896&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=83639&status=done&style=none&taskId=ude2ad6d0-a72d-47be-845b-3ce7f5a2641&title=&width=1184.9999823421242)<br />得到结果 2，它也是累加的。
