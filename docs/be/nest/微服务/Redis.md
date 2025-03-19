### Redis 和它的发布/订阅模式

Redis 是一个超快的内存数据库，但它不只是存数据的工具，还能用来做消息传递。它的 Pub/Sub（发布/订阅）功能特别适合微服务架构。

简单来说，这种模式就像一个广播电台：有人（发布者）在一个频道里喊话，其他人（订阅者）只要调到这个频道就能听到。发布者不用管有没有人听，也不知道谁在听，消息发出去就完事了。

每个消息都按频道分类，一个微服务可以订阅一个或多个频道，想听啥就听啥。消息传递是“即发即忘”的，也就是说，如果发消息时没人订阅这个频道，那这条消息就没了，没法找回来。所以别指望每条消息一定会被处理 —— 这也是 Pub/Sub 的轻量特性。不过，好处是同一消息可以被多个订阅者同时接收，灵活性很强。



### 动手之前：安装 Redis 支持

想在项目里用 Redis 做微服务通信，第一步得装个工具包。这里我们用 ioredis，一个 Node.js 的 Redis 客户端，挺好使的。打开终端，跑一句：

```bash
$ npm i --save ioredis
```

装好后，咱们就可以开始搭环境了。



### 基本配置：让微服务跑起来

假设你用的是 NestJS，要用 Redis 做微服务通信，得在启动时告诉它用 Redis 传输器。代码长这样：

```ts
// main.ts
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379
    }
  })
  await app.listen()
}
bootstrap()
```

这里 Transport.REDIS 告诉 NestJS 用 Redis 做通信工具，options 里指定了 Redis 的地址和端口，默认是本地的 6379。如果你 Redis 跑在别的机器上，改下 host 和 port 就行。



### 配置项：调优你的 Redis 传输器

Redis 传输器的 options 可以定制不少东西，除了 host 和 port，还有几个常用的：

- retryAttempts：消息发送失败时重试几次，默认是 0（不重试）。
- retryDelay：重试间隔，单位是毫秒，默认也是 0。
- wildcards：设成 true 就能用通配符订阅频道（后面会细说），默认是 false。

这些配置其实是传给底层的 ioredis 客户端的，所以它支持的所有选项这里都能用，比如设置密码、超时啥的，有需要可以去翻翻 ioredis 的文档。



### 客户端：怎么发消息、收消息

微服务通信得有个客户端，NestJS 提供了几种创建 ClientProxy 的方法。最简单的是用 ClientsModule：

```ts
import { Module } from '@nestjs/core'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379
        }
      }
    ])
  ]
})
export class AppModule {}
```

这里的 name 是注入令牌，后面可以用它来发消息。想发条消息？注入客户端然后调用 send 或 emit 就行了。

除了这种方式，还可以用 ClientProxyFactory 或者 @Client() 装饰器，具体用法 NestJS 文档里都有，挺灵活的。



### 获取上下文：知道消息从哪来

有时候你得知道消息的细节，比如它从哪个频道来的。这时候可以用 RedisContext：

```ts
import { MessagePattern, Payload, Ctx, RedisContext } from '@nestjs/microservices'

@MessagePattern('notifications')
getNotifications(@Payload() data: number[], @Ctx() context: RedisContext) {
  console.log(`频道: ${context.getChannel()}`)
}
```

context.getChannel() 会告诉你当前消息的频道名，调试或日志记录时特别有用。



### 通配符：订阅一堆频道

如果想监听一类频道，比如所有以 notifications 开头的消息，可以开启通配符支持。配置时加个 wildcards: true：

```ts
const app = await NestFactory.createMicroservice(AppModule, {
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
    wildcards: true
  }
})
```

然后在代码里用 * 匹配：

```ts
@EventPattern('notifications.*')
handleNotifications(data: any) {
  console.log('收到通知:', data)
}
```

这样 notifications.email、notifications.sms 啥的都能收到。



### 状态监控：连接咋样了？

想知道 Redis 连接状态？可以订阅状态流：

```ts
this.client.status.subscribe((status: RedisStatus) => {
  console.log(status) // 'connected', 'disconnected', 'reconnecting'
})
```

服务端也能这么干：

```ts
server.status.subscribe((status: RedisStatus) => {
  console.log(status)
})
```

这样连接断了、恢复了你都能第一时间知道。



### 事件监听：出错咋办？

有时候得监听特定事件，比如连接出错：

```ts
this.client.on('error', (err) => {
  console.error('出错啦:', err)
})
```

服务端也一样：

```ts
server.on<RedisEvents>('error', (err) => {
  console.error(err)
})
```

这样就能及时处理问题。



### 高级玩法：直接操作底层驱动

万一框架提供的功能不够用，可以直接拿到 ioredis 实例：

```ts
const [pub, sub] = this.client.unwrap<[import('ioredis').Redis, import('ioredis').Redis]>()
pub.publish('channel', 'hello') // 手动发消息
```

注意 Redis 传输器会返回两个实例：一个管发布，一个管订阅。用的时候别搞混了。



### 总结

Redis 的 Pub/Sub 模式轻量又高效，非常适合微服务间的异步通信。配置简单，扩展性强，加上 NestJS 的封装，用起来真挺顺手。无论是基本的消息收发，还是高级的状态监控、底层操作，都能满足需求。试试看吧，搭个小项目玩玩，很快就能感受到它的魅力！