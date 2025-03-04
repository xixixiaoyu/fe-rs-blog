### 什么是 HTTP 会话？

HTTP 是无状态的，每次请求服务器都像初次见面，啥也不知道。会话（Session）就相当于给服务器装了个小本子，可以记下一些用户信息，比如你是不是登录了，或者你点了多少次某个按钮。它在像 MVC（模型-视图-控制器）这样的应用中特别有用，因为你需要在不同页面间传递数据。

我们来看看怎么在 Express 和 Fastify 中实现会话管理吧。



### 在 Express 中玩转会话

Express 是 Node.js 的老大哥，用起来很顺手。我们可以用 express-session 这个中间件来搞定会话。先来看看怎么装它：

```bash
$ npm i express-session
$ npm i -D @types/express-session  // TypeScript 用户别忘了这个
```

装好之后，我们得把它加到项目里，通常是在入口文件（比如 main.ts）中：

```ts
import * as session from 'express-session'

app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false
  })
)
```

这代码啥意思？

- secret：这是签名会话 ID 的“钥匙”，就像锁住你小本子的密码。可以用一串随机字符，最好别让人猜到，比如 x7k9p2m... 这样。如果用数组，第一个元素签名，其他的验证签名。
- resave：设成 true 的话，每次请求都会强制保存会话，哪怕没改动过。现在默认是 false，因为老默认值（true）被淘汰了。
- saveUninitialized：如果设成 true，新建但没改动的会话也会保存。设成 false 可以省存储空间，还能避免一些并发请求的麻烦。

注意：默认的会话存储是内存型的，适合调试，但生产环境别用，会漏内存，也没法扩展到多进程。想上线，得换个像 Redis 这样的存储方案。

如果你想让会话更安全，可以加个选项 secure: true，但前提是网站得用 HTTPS。不然 cookie 传不过去，白搭。如果你的服务器后面有代理（比如 Nginx），还得在 Express 里设置 trust proxy，不然也会有问题。

配置好了，我们就能在路由里读写会话了。比如想记录用户访问次数：

```ts
import { Get } from '@nestjs/common'
import { Request } from 'express'

@Get()
findAll(@Req() request: Request) {
  request.session.visits = request.session.visits ? request.session.visits + 1 : 1
  return `你来了 ${request.session.visits} 次！`
}
```

或者用更方便的 @Session() 装饰器：

```ts
import { Get, Session } from '@nestjs/common'

@Get()
findAll(@Session() session: Record<string, any>) {
  session.visits = session.visits ? session.visits + 1 : 1
  return `你来了 ${session.visits} 次！`
}
```



### 在 Fastify 中搞定会话

Fastify 是后起之秀，性能一流。我们用 @fastify/secure-session 来实现会话管理。先装包：

```bash
$ npm i @fastify/secure-session
```

然后在项目里注册：

```ts
import secureSession from '@fastify/secure-session'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter()
)
await app.register(secureSession, {
  secret: 'averylogphrasebiggerthanthirtytwochars',
  salt: 'mq9hDxBVDbspDR6n'
})
```

- secret：得超过 32 个字符，用来加密会话数据。

- salt：加点“盐”让加密更强，随手写个 16 字符的字符串就行。

你可以预生成密钥，或者用密钥轮换，具体看[官方文档](https://github.com/fastify/fastify-secure-session)。

配置好后，路由里也能读写会话：

```ts
import { Get } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

@Get()
findAll(@Req() request: FastifyRequest) {
  const visits = request.session.get('visits')
  request.session.set('visits', visits ? visits + 1 : 1)
  return `你来了 ${visits ? visits + 1 : 1} 次！`
}
```

或者用 @Session()：

```ts
import { Get, Session } from '@nestjs/common'
import * as secureSession from '@fastify/secure-session'

@Get()
findAll(@Session() session: secureSession.Session) {
  const visits = session.get('visits')
  session.set('visits', visits ? visits + 1 : 1)
  return `你来了 ${visits ? visits + 1 : 1} 次！`
}
```

Fastify 的会话用 get 和 set 方法，跟 Express 的直接赋值不太一样，但逻辑差不多。



### Express 和 Fastify，选哪个？

- **Express**：老牌，生态丰富，适合快速上手或者传统项目。
- **Fastify**：性能更好，现代感强，适合追求效率的新项目。

两种方式都很灵活，关键看你的需求。如果是调试或者小项目，默认内存存储就够了；要是上线，别忘了换个靠谱的存储方案。



### 总结一下

HTTP 会话其实不复杂，就是在服务器上存点东西，方便多个请求间共享数据。在 Express 里用 express-session，在 Fastify 里用 @fastify/secure-session，配置好中间件就能开干。记住安全第一，生产环境别偷懒，选个正经的存储方式。