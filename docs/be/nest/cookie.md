### Cookies 是什么？

Cookies 就是一小块数据，存在你的浏览器里。网站通过它来保存一些状态信息，比如你是谁、做了啥、下次来的时候还能认出你。每次你访问网站，浏览器都会把 Cookies 自动塞进请求里发过去，网站一看就知道：“哦，这位老朋友又来了！”

Cookies 的典型用途有：

- 记住用户登录状态（免得每次都输密码）
- 跟踪用户行为（比如广告商爱干的事）
- 保存一些临时数据（像表单填写到一半）



### 在 Express 里玩转 Cookies

#### 第一步：装个工具

要用 Cookies，得先装个中间件叫 cookie-parser。如果你用 TypeScript，还得装个类型声明，命令如下：

```bash
npm i cookie-parser
npm i -D @types/cookie-parser
```

#### 第二步：全局启用

装好后，在你的主文件（比如 main.ts）里引入并激活这个中间件：

```ts
import * as cookieParser from 'cookie-parser'

app.use(cookieParser())
```

这行代码就像给 Express 加了个“Cookies 解码器”，它会自动把请求里的 Cookie 解析出来，挂到 req.cookies 上供你用。

#### 签名 Cookie

如果你担心 Cookies 被篡改，可以加个“签名”。签名就像给 Cookie 加了个锁，只有用对密钥才能解开。设置方法很简单：

```ts
app.use(cookieParser('my-secret'))
```

这里的 my-secret 是密钥。加了密钥后，签名过的 Cookie 会出现在 req.signedCookies 里。如果有人动了手脚，值会变成 false，安全又省心。

#### 读 Cookie

假设你在某个路由里想看看用户传来的 Cookies，长这样：

```ts
import { Request } from 'express'
import { Get } from '@nestjs/common'

@Get()
findAll(@Req() request: Request) {
  console.log(request.cookies)  // 打印所有 Cookies
  console.log(request.cookies['userId'])  // 拿某个具体的 Cookie
}
```

#### 写 Cookie

想给用户发个 Cookie？用 response.cookie() 就行：

```ts
import { Response } from 'express'
import { Get } from '@nestjs/common'

@Get()
findAll(@Res({ passthrough: true }) response: Response) {
  response.cookie('userId', '12345')
}
```

注意那个 passthrough: true，这是 NestJS 的小要求，确保框架还能正常处理响应。



### 在 Fastify 里搞定 Cookies

#### 第一步：装插件

先装个 @fastify/cookie：

```bash
npm i @fastify/cookie
```

#### 第二步：注册插件

在初始化的时候注册一下：

```ts
import fastifyCookie from '@fastify/cookie'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
await app.register(fastifyCookie, {
  secret: 'my-secret'  // 可选，用于签名
})
```

#### 读 Cookie

跟 Express 差不多，Cookies 挂在 request.cookies 上：

```ts
import { FastifyRequest } from 'fastify'
import { Get } from '@nestjs/common'

@Get()
findAll(@Req() request: FastifyRequest) {
  console.log(request.cookies['userId'])
}
```

#### 写 Cookie

用 setCookie() 方法：

```ts
import { FastifyReply } from 'fastify'
import { Get } from '@nestjs/common'

@Get()
findAll(@Res({ passthrough: true }) response: FastifyReply) {
  response.setCookie('userId', '12345')
}
```



### 跨平台神器：自定义 Cookies 装饰器

Express 和 Fastify 用法有点小差别，要是项目里两个框架都用，切换起来有点烦。怎么办？咱们可以自己写个装饰器，统一接口！

在 NestJS 里，装饰器很好搞：

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return data ? request.cookies?.[data] : request.cookies
})
```

现在不管 Express 还是 Fastify，都能这么用：

```ts
@Get()
findAll(@Cookies('userId') userId: string) {
  console.log(userId)  // 直接拿到 userId 的值
}
```

这个 @Cookies 装饰器会根据你传的参数，灵活返回单个 Cookie 还是所有 Cookies，省事又优雅。



### 总结

Cookies 虽然小，但用处真不小。它让浏览器和服务器之间多了一份“记忆”，能干的事儿也多了起来。在 Express 和 Fastify 里，读写 Cookies 都挺简单，加个签名还能更安全。如果你在用 NestJS，搞个自定义装饰器还能让代码更整洁，跨框架也无压力。