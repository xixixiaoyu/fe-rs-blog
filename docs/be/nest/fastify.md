### Nest.js 默认用 Express，那为啥要换 Fastify？

先说说背景。Nest.js 是个超级好用的 Node.js 框架，默认用的是 Express。Express 大家都熟，社区活跃、中间件多，用起来特别顺手，所以它成了 Nest 的默认选择。但问题来了——Express 的性能其实不算顶尖，尤其在高并发场景下，速度可能会拖后腿。

这时候，Fastify 就登场了。它跟 Express 一样，都是处理 HTTP 请求的框架，但设计上更高效，跑基准测试时速度几乎是 Express 的两倍！为啥这么快？因为 Fastify 在底层优化了请求和响应的处理管道，减少了不必要的开销。简单来说，它就像一辆跑车，轻量化设计，油门一踩就冲出去。

那你可能会问，既然 Fastify 这么牛，Nest 为啥不直接默认用它？嗯，原因很简单：Express 太“大众”了。用的人多，生态就好，各种现成的中间件随便挑，省心又省力。而 Fastify 虽然快，但生态相对没那么丰富。所以 Nest 的设计很聪明 —— 默认 Express，但给你留了个后门，想换 Fastify？没问题，框架适配器帮你搞定！



### 什么是框架适配器？

Nest 的厉害之处在于它的“框架独立性”。啥意思呢？就是它不死绑在 Express 上，而是通过一个叫“框架适配器”的东西，把底层的 HTTP 处理交给不同的库去实现。适配器就像个翻译官，把 Nest 的指令翻译成 Express 或 Fastify 能听懂的语言。

不过也不是随便哪个库都能适配的。要当 Nest 的“备胎”，这个库得有类似 Express 的请求/响应处理机制。Fastify 就完美符合要求，它跟 Express 的设计思路差不多，但性能更强，所以成了 Nest 用户的热门选择。



### 把 Fastify 装进 Nest

第一步：装包

先安装 Fastify 的适配器包，打开终端，敲命令：

```bash
$ npm i --save @nestjs/platform-fastify
```

这个包就是 Nest 专门为 Fastify 准备的适配器，装好它才能让 Nest 和 Fastify 愉快地合作。

第二步：改代码

接着，找到你的 main.ts 文件，把默认的 Express 换成 Fastify。代码长这样：

```ts
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

看明白了吗？重点就在 NestFactory.create 里，加了个 new FastifyAdapter()，告诉 Nest：“嘿，这次用 Fastify 跑吧！”然后 listen 方法还是老样子，监听端口就行。

有个细节，Fastify 默认只监听本地的 127.0.0.1，也就是说，外网访问不了。如果你想让其他主机也能连进来，得改一下监听地址，像这样：

```ts
await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
```

加上 '0.0.0.0'，就等于告诉 Fastify：“别只顾自己玩，敞开大门欢迎所有人吧！”



### 为啥选 Fastify？值不值得换？

用 Fastify 最大的好处就是快，尤其在性能敏感的项目里，比如高并发的 API 服务，速度提升能直接带来用户体验的飞跃。而且 Nest 的适配器机制让切换成本很低，基本不用改业务逻辑，换个引擎就跑起来了。

当然，它也有短板。Fastify 的中间件生态比 Express 少一些，如果你的项目特别依赖某些 Express 专属中间件，可能得自己动手适配一下。不过大部分常见需求，Fastify 都能cover住，权衡一下性能提升和适配成本，值不值得换你心里应该有数了吧？



### 总结：灵活又高效的选择

Nest.js 用 Express 默认跑已经很稳了，但如果你追求极致的性能，Fastify 绝对是个值得试试的选项。安装方便，切换简单，跑起来还快，何乐而不为呢？下次写项目的时候，不妨给 Fastify 一个机会，说不定你就爱上这种“飞一般的感觉”了！