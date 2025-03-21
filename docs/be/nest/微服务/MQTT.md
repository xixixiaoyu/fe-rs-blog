### MQTT 是什么？为什么这么受欢迎？

想象一下，你有一堆设备 —— 比如传感器、智能灯泡、手机——它们需要互相“聊天”。但网络可能时好时坏，设备性能也不一定强，怎么办？MQTT 就派上用场了。它通过一个中间人（叫“代理服务器”或 broker）来协调消息，设备只需要“发布”消息或者“订阅”感兴趣的内容，不用直接互相联系。这种模式特别省资源，适合低带宽、高延迟的场景。

举个例子：你家有个温度传感器，每分钟发布一次温度数据到 broker，手机订阅这个数据，就能实时显示温度。简单吧？而且 MQTT 还能保证消息尽量送达，即使网络不稳定也不慌。



### 快速上手：安装和基本配置

想基于 MQTT 搭个微服务。先安装必要的包：

```bash
$ npm i --save mqtt
```

安装完后，在你的 main.ts 文件里配置一下微服务：

```ts
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://localhost:1883'
    }
  })
  await app.listen()
}
bootstrap()
```

这段代码的意思是：创建一个微服务，用 MQTT 作为通信方式，连接到本地的 MQTT broker（端口默认是 1883）。Transport.MQTT 告诉 NestJS 用 MQTT 协议，url 指明 broker 的地址。如果你本地还没装 broker，可以试试 Mosquitto，超级简单。



### 创建客户端

微服务搭好了，但怎么发消息呢？这就需要客户端。NestJS 提供了几种创建客户端的方法，咱们先看最常用的一种：用 ClientsModule。

在你的模块文件里加点配置：

```ts
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://localhost:1883'
        }
      }
    ])
  ]
})
export class AppModule {}
```

这里我们注册了一个名叫 MATH_SERVICE 的客户端，连接到本地的 MQTT broker。

之后，你就可以在代码里注入这个客户端，发消息给 broker 了。比如：

```ts
@Injectable()
export class MathService {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

  sendMessage() {
    this.client.emit('math_topic', { numbers: [1, 2, 3] })
  }
}
```

emit 方法会把消息发布到 math_topic 这个主题，其他订阅了这个主题的设备就能收到。



### 订阅消息：监听和处理数据

光发消息还不够，咱们还得接收消息。这时候可以用 @MessagePattern 来订阅主题。比如：

```ts
@Injectable()
export class NotificationService {
  @MessagePattern('notifications')
  getNotifications(@Payload() data: number[], @Ctx() context: MqttContext) {
    console.log(`收到主题: ${context.getTopic()}`)
    console.log(`数据: ${data}`)
    return data.reduce((a, b) => a + b, 0)
  }
}
```

这里我们订阅了 notifications 主题，每次有消息过来，就会打印主题名和收到的数据（比如一串数字），然后返回它们的和。@Payload() 拿到消息内容，@Ctx() 提供上下文信息，比如主题名。

想看原始数据包？用 context.getPacket() 就行：

```ts
console.log(context.getPacket())
```



### 通配符：订阅更灵活

时候，你不想只盯着一个固定主题，而是想监听一类主题。这时候可以用通配符。MQTT 支持两种：+（单层）和 #（多层）。比如：

```ts
@MessagePattern('sensors/+/temperature/+')
getTemperature(@Ctx() context: MqttContext) {
  console.log(`主题: ${context.getTopic()}`)
}
```

这个模式会匹配像 sensors/room1/temperature/25 或 sensors/kitchen/temperature/30 这样的主题。+ 表示匹配任意一层，# 能匹配多层，超级灵活！



### 服务质量（QoS）：消息送达有保障

MQTT 有个很贴心的设计，叫服务质量（QoS），决定了消息送达的可靠性。默认是 QoS 0（尽力而为），但如果你想要更高的保障，可以设置 QoS 1（至少送达一次）或 QoS 2（只送达一次）。全局设置方法是：

```ts
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.MQTT,
  options: {
    url: 'mqtt://localhost:1883',
    subscribeOptions: {
      qos: 2
    }
  }
})
```

这样所有订阅都用 QoS 2。如果你只想给某个主题设 QoS，可以用 MqttRecordBuilder：

```ts
const record = new MqttRecordBuilder('hello')
  .setQoS(1)
  .build()
this.client.send('greetings', record).subscribe()
```

服务端也能读这些设置，比如：

```ts
@MessagePattern('greetings')
handleGreeting(@Payload() data: string, @Ctx() context: MqttContext) {
  const packet = context.getPacket()
  console.log(`QoS: ${packet.qos}`)
  return `收到: ${data}`
}
```



### 状态监控：实时掌握连接情况

网络不稳定怎么办？MQTT 客户端可以告诉你当前状态。比如：

```ts
this.client.status.subscribe((status: MqttStatus) => {
  console.log(status) // 'connected', 'disconnected', 等
})
```

服务端也能监听：

```ts
const server = app.connectMicroservice<MicroserviceOptions>(...)
server.status.subscribe((status: MqttStatus) => {
  console.log(status)
})
```

这样你就能随时知道连接是不是出了问题。



### 总结：MQTT 的魅力

聊到这儿，你应该能感觉到 MQTT 的厉害之处了吧？它轻量、灵活，还能在苛刻的环境下稳定工作。不管是简单的设备通信，还是复杂的微服务系统，MQTT 都能胜任。