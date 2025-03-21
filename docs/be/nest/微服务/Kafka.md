### Kafka 是什么？

想象一下，Kafka 就像一个超级快递中心。它能干三件事特别牛：

1. **收发快递（消息）**：你发个包裹（数据），别人能订阅收货，想想微信群消息，谁订阅了就能看到。
2. **存包裹不丢**：就算没人立刻取走，包裹也不会丢，Kafka 会把数据稳稳地存下来，等你需要再拿出来。
3. **实时处理**：一边收发包裹，一边还能直接处理，比如查包裹状态、统计数量，全程不耽误。

简单说，Kafka 就是个高效率的“数据搬运工”，专门为实时处理大数据设计。它还能跟 Storm 和 Spark 这些工具无缝对接，干些更高级的活儿，比如实时分析数据。



### 安装和起步

#### 装包

先装个 kafkajs，这是个 Kafka 的 JS 库，超级方便：

```bash
$ npm i --save kafkajs
```

#### 配置微服务

在 NestJS 里，启动一个 Kafka 微服务很简单。打开你的 main.ts，写上几行代码：

```ts
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092']
      }
    }
  })
  await app.listen()
}
bootstrap()
```

这段代码就像告诉 Nest：“我要用 Kafka，服务器跑在 localhost:9092 上。” Transport.KAFKA 是从 @nestjs/microservices 里来的，专门用来指定 Kafka 模式。”

#### 配置项长啥样？

options 里可以塞一堆东西，比如：

- client：客户端设置，比如连接哪个 Kafka 服务器。
- consumer：消费者设置，比如给消费者取个组名。
- producer：生产者设置，比如发消息的细节。

比如加个消费者组：

```ts
options: {
  client: {
    brokers: ['localhost:9092'],
    clientId: 'my-app'
  },
  consumer: {
    groupId: 'my-group'
  }
}
```



### 客户端怎么玩？

Kafka 在 NestJS 里用的是 ClientKafkaProxy，比普通的 ClientProxy 多点花样。可以用几种方法创建它，比如通过 ClientsModule：

```ts
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HERO_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'hero',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'hero-consumer'
          }
        }
      }
    ])
  ]
})
export class AppModule {}
```

这代码的意思是注册一个名叫 HERO_SERVICE 的 Kafka 客户端，连接本地的 Kafka，消费者组叫 hero-consumer。

还有个更直接的办法，用 @Client() 装饰器：

```ts
import { Client, ClientKafkaProxy, Transport } from '@nestjs/microservices'

export class HeroService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'hero',
        brokers: ['localhost:9092']
      },
      consumer: {
        groupId: 'hero-consumer'
      }
    }
  })
  client: ClientKafkaProxy
}
```



### 消息怎么发怎么收？

Kafka 的消息有两种玩法：请求-响应模式和事件模式。

#### 请求-响应模式

比如你想让英雄去杀龙，发个请求然后等着回复。服务端得先定义个消息模式：

```ts
import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class HeroesController {
  @MessagePattern('hero.kill.dragon')
  killDragon(message) {
    console.log('收到杀龙请求:', message)
    return { success: true, loot: '金币 x100' }
  }
}
```

客户端得订阅响应主题，然后发消息：

```ts
this.client.subscribeToResponseOf('hero.kill.dragon')
await this.client.connect()
const result = await this.client.send('hero.kill.dragon', { heroId: '001' }).toPromise()
console.log('杀龙结果:', result)
```

#### 事件模式

如果只是通知一下，不用等回复，那就用事件模式。比如英雄升级了：

```ts
@EventPattern('hero.level.up')
levelUp(message) {
  console.log('英雄升级啦:', message)
}
```

客户端直接 emit：

```ts
this.client.emit('hero.level.up', { heroId: '001', newLevel: 10 })
```



### 小心踩坑

1. **分区问题**：Kafka 用分区分担压力。如果你的应用比分区多，发消息可能会出错。Nest 自带分区器，会按时间戳分配，但启动顺序得注意。
2. **订阅响应**：用请求-响应模式时，记得调用 subscribeToResponseOf，不然收不到回复。
3. **偏移量**：默认自动提交偏移量，想手动控制就设 autoCommit: false，然后自己提交。



### 进阶玩法

- **看上下文**：用 KafkaContext 拿消息的细节，比如主题、分区啥的：

```ts
@MessagePattern('hero.kill.dragon')
killDragon(@Payload() message, @Ctx() context: KafkaContext) {
  console.log('主题:', context.getTopic())
}
```

- **重试异常**：消息处理失败想重试？抛个 KafkaRetriableException：

```ts
if (出错了) {
  throw new KafkaRetriableException('再试一次吧')
}
```

- **状态监控**：想知道连接状态？订阅一下：

```ts
this.client.status.subscribe(status => {
  console.log('当前状态:', status)
})
```



### 总结

Kafka 看着复杂，其实核心就三点：发消息、存消息、处理消息。用在 NestJS 里，配合 kafkajs 和微服务模块，几行代码就能跑起来。无论是实时日志、订单处理，还是大数据分析，它都能顶得上。