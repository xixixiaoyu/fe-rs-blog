### RabbitMQ 是什么？

简单来说，RabbitMQ 就是一个“快递中转站”。它能帮你的程序把消息从一个地方送到另一个地方，支持多种协议，还能分布式部署，特别适合需要高可用性和高并发场景。不管是创业小团队还是大厂，RabbitMQ 都很流行，因为它轻量、开源又好用。



### 安装 RabbitMQ 和相关工具

要开始玩 RabbitMQ，首先得把环境搭好，打开终端，敲两行命令：

```bash
$ npm i --save amqplib amqp-connection-manager
```

- amqplib 是 RabbitMQ 的基础客户端库，负责底层的通信。
- amqp-connection-manager 是个更高级的工具，能帮你管理连接，处理断线重连之类的事情。

装好之后，咱们就可以动手写代码了。



### 用 NestJS 配置 RabbitMQ 微服务

想让你的微服务通过 RabbitMQ 通信，怎么做呢？直接上代码：

```ts
// main.ts
import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'cats_queue',
      queueOptions: {
        durable: false
      }
    }
  })
  await app.listen()
}
bootstrap()
```

这段代码干了啥？

1. Transport.RMQ 告诉 NestJS，我们用的是 RabbitMQ 传输方式。
2. options 里定义了连接细节：
   - urls 是 RabbitMQ 服务器的地址，默认端口是 5672。
   - queue 是消息队列的名字，这里叫 cats_queue。
   - queueOptions.durable 设为 false，意思是队列不会持久化，重启就没了（设为 true 则会保存）。

运行起来后，你的微服务就通过 RabbitMQ 开始监听消息了。



### 客户端怎么玩？

微服务搭好了，客户端怎么发消息呢？NestJS 提供了几种方法，咱们挑个简单的，用 ClientsModule：

```ts
// app.module.ts
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'cats_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ])
  ]
})
export class AppModule {}
```

然后在服务里注入客户端：

```ts
// app.service.ts
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class AppService {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

  sendMessage() {
    this.client.emit('notifications', { data: 'Hello RabbitMQ!' })
  }
}
```

这里 name: 'MATH_SERVICE' 是客户端的标识符，注入后就能用它发消息了。

#### 

### 消息确认：别让消息丢了

RabbitMQ 的一个厉害功能是消息确认。想象一下，你发了个快递，但中转站不确定你收到没。如果没确认，它会重新发一遍。怎么实现呢？

先在配置里启用手动确认，把 noAck 设为 false：

```ts
options: {
  urls: ['amqp://localhost:5672'],
  queue: 'cats_queue',
  noAck: false,
  queueOptions: {
    durable: false
  }
}
```

然后在消费端手动确认：

```ts
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@MessagePattern('notifications')
getNotifications(@Payload() data: any, @Ctx() context: RmqContext) {
  console.log('收到消息:', data)
  const channel = context.getChannelRef()
  const originalMsg = context.getMessage()
  channel.ack(originalMsg) // 告诉 RabbitMQ：我处理完了！
}
```

这样，如果消费者挂了没确认，消息会重新排队，不会丢失。



### 设置消息头和优先级

想让消息带点“个性”？可以用 RmqRecordBuilder 加头信息或优先级：

```ts
import { RmqRecordBuilder } from '@nestjs/microservices'

const message = 'Hello!'
const record = new RmqRecordBuilder(message)
  .setOptions({
    headers: {
      'x-version': '1.0.0'
    },
    priority: 3
  })
  .build()

this.client.send('greet', record).subscribe()
```

服务端也能读这些信息：

```ts
@MessagePattern('greet')
greet(@Payload() data: string, @Ctx() context: RmqContext) {
  const { properties: { headers } } = context.getMessage()
  return headers['x-version'] === '1.0.0' ? 'Hi!' : 'Hello!'
}
```



### 状态监听：实时掌握连接动态

有时候你得知道 RabbitMQ 连接是不是还活着。可以用状态流：

```ts
this.client.status.subscribe((status: RmqStatus) => {
  console.log('当前状态:', status) // 输出 connected 或 disconnected
})
```

服务端也能这么干：

```ts
const server = app.connectMicroservice<MicroserviceOptions>(...)
server.status.subscribe((status: RmqStatus) => {
  console.log('服务端状态:', status)
})
```



### 小结

RabbitMQ 虽然看着复杂，但拆开其实挺简单：安装、配置、发消息、确认消息，再加点高级玩法。你可以用它解耦服务、处理异步任务，甚至搭建分布式系统。