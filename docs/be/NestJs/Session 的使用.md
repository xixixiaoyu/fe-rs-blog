## Session 简介和工作流程
Session 和 Cookie 都是在基于 HTTP 协议的网络通信中用于记录用户状态的技术。<br />HTTP 是无状态的，这意味着服务器默认不会记住连续多个请求之间的信息。<br />Cookie 保存在客户端浏览器中，而 Session 则将信息存储在服务器上，以维持应用程序在多个请求间的状态。

工作流程：

1. 用户第一次访问服务器时，服务器创建一个 Session 对象，并生成一个唯一的键值对。
2. 将键（作为 Cookie）发送回用户的浏览器。
3. 用户再次访问服务器时，浏览器会发送这个键，服务器用它来找回对应的 Session 信息。
4. 用户的状态信息都保存在 Session 中。

Session 可以用于保持用户的登录状态、记录用户的购物车内容、在线考试系统中追踪考生答题进度等。

## Nest 中 Session 的使用

1.  **安装必要的包**： 
```bash
npm install express-session
npm install connect-redis // 如果使用 Redis 存储 session
```

2.  **配置中间件**：<br />在您的 `main.ts` 文件或者一个专门的模块中，使用 `express-session` 配置 session 中间件。 
```typescript
import * as session from 'express-session';  
import * as connectRedis from 'connect-redis';  
import { NestFactory } from '@nestjs/core';  
import { AppModule } from './app.module';  
import * as redis from 'redis';  
  
async function bootstrap() {  
  const app = await NestFactory.create(AppModule);  
  
  // 如果使用 Redis  
  const RedisStore = connectRedis(session);  
  const redisClient = redis.createClient({  
    // Redis 配置  
  });  
  
  app.use(  
    session({  
      store: new RedisStore({ client: redisClient }),  
      secret: 'my-secret', // 选择一个强秘密并保持安全  
      resave: false, // 避免不必要的 session 更新  
      saveUninitialized: false, // 避免不必要的 session 创建  
      cookie: {  
        maxAge: 1000 * 60 * 60 * 24, // 设置 cookie 的有效期为一天  
      },  
    }),  
  );  
  
  await app.listen(3000);  
}  
bootstrap();
```

4.  **使用 Session**：配置完中间件后，在任何控制器中都可以通过请求对象来访问 session。例如，可以在每次访问路由时增加访问计数，并将其存储在 session 中。 
```typescript
import { Controller, Get, Req, Session } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
 @Get()
 getSessionData(@Req() request: Request) {
   // 设置 Session 数据
   request.session.username = request.session.username || 'Guest';

   // 获取 Session 数据
   return request.session.username;
 }

 @Get('logout')
 clearSession(@Req() request: Request) {
   // 清除 Session 数据
   request.session.destroy();
   return 'Session cleared';
 }
}
```
 
## express-session 的常用参数和方法
### 常用参数

1.  `secret`: 用于对 session ID cookie 进行签名的秘钥，防止篡改。可以是一个字符串或者字符串数组。 
2.  `saveUninitialized`: 当设置为 `true` 时，即使 session 在请求期间没有被修改，也会强制创建 session。通常设置为 `false`。 
3.  `resave`: 强制将 session 保存回 session 存储，即使在请求期间 session 没有被修改。通常设置为 `false`。 
4.  `name`: 设置 cookie 中的 session ID 字段的名称，默认为 `connect.sid`。 
5.  `cookie`: 设置存储 session ID 的 cookie 的选项，如 `maxAge`（cookie 的过期时间）、`httpOnly`（防止客户端脚本访问）、`secure`（只在 HTTPS 上使用）等。 
6.  `store`: session 的存储方式，默认存储在内存中。生产环境下通常使用外部存储，如 Redis 或 MongoDB。 
7.  `genid`: 生成一个新的 session ID 的函数，默认使用 uid2 库生成 ID。 
8.  `rolling`: 每次请求时强制设置 cookie，这将重置 cookie 过期时间（默认为 `false`）。 
9.  `unset`: 控制当请求结束时 session 的处理方式。可以是 `destroy`（删除 session）或 `keep`（保持未更改的 session）。 

### 常用方法

1.  `req.session`: 一旦中间件配置成功，`req.session` 变成了一个可以在路由中访问的对象，用于读取和写入 session 数据。 
2.  `req.session.id` 或 `req.sessionID`: 获取 session 的唯一 ID。 
3.  `req.session.destroy(callback)`: 销毁当前 session，当用户登出时通常需要调用此方法。 
4.  `req.session.reload(callback)`: 重新加载 session 数据。 
5.  `req.session.regenerate(callback)`: 销毁旧的 session 并生成一个新的。 
6.  `req.session.save(callback)`: 手动将 session 保存到 session 存储中。 
7.  `req.session.touch()`: 更新 session 的过期时间。 
