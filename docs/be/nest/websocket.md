你有没有想过如何用 Nest.js 打造一个实时应用？比如聊天室、实时通知，或者多人协作工具？今天咱们就聊聊 Nest.js 中的 WebSocket 网关功能，

### 什么是 WebSocket 网关？

Nest.js 的网关（Gateway）就是一个支持 WebSocket 的类，用 @WebSocketGateway() 装饰器标注一下就行了。

它特别强大，因为 Nest 把底层的实现细节抽象掉了，不管你是用 HTTP、WebSocket 还是微服务，同一个组件都能复用。咱们今天重点聊 WebSocket 的部分。

Nest 默认支持两种 WebSocket 库：socket.io 和 ws。前者功能丰富，后者性能更高。你可以根据需求挑一个用，甚至还能自己写适配器，很灵活。网关还能像普通的服务（Provider）一样注入依赖，或者被其他类注入，简直是开发者的福音。



### 快速上手

先装几个包：

```bash
npm i --save @nestjs/websockets @nestjs/platform-socket.io
```

装好后，创建一个简单的网关：

```ts
import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets'

@WebSocketGateway(80, { namespace: 'events' })
export class EventsGateway {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data
  }
}
```

这段代码定义了一个网关，监听 80 端口，命名空间是 events。当客户端发来 events 消息时，handleEvent 方法会把收到的数据原样返回。是不是很简单？

然后在模块里注册一下：

```ts
import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'

@Module({
  providers: [EventsGateway]
})
export class EventsModule {}
```

好了，网关已经跑起来了！默认情况下，它会跟 HTTP 服务器用同一个端口（通常是 3000），不过你可以通过 @WebSocketGateway(81) 改端口，或者加个 { namespace: 'xxx' } 指定命名空间。



### 客户端怎么连？

假设你用的是 socket.io，客户端代码大概是这样：

```ts
const socket = io('http://localhost:80/events')
socket.emit('events', 'Hello Nest', (response) => {
  console.log(response) // 输出：Hello Nest
})
```

发一条消息，服务器收到后原样返回，客户端就能打印出来。实时通信就这么实现了！



### 再深入一点：灵活处理消息

有时候你可能只想取消息的某一部分，比如一个 id 字段。可以这样写：

```ts
@SubscribeMessage('events')
handleEvent(@MessageBody('id') id: number): number {
  return id
}
```

客户端发 { id: 42 }，服务器就只返回 42。是不是很方便？

如果想直接操作底层的 socket 实例，也行：

```ts
import { ConnectedSocket } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@SubscribeMessage('events')
handleEvent(
  @MessageBody() data: string,
  @ConnectedSocket() client: Socket
): string {
  client.emit('custom', 'Hey there!') // 主动发消息给客户端
  return data
}
```

不过这种方式不推荐，因为测试时得模拟 socket，麻烦不少。



### 多响应和异步

只回一次不够怎么办？Nest 支持返回一个对象，指定事件名和数据：

```ts
import { WsResponse } from '@nestjs/websockets'

@SubscribeMessage('events')
handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
  return { event: 'events', data }
}
```

客户端监听：

```ts
socket.on('events', (data) => console.log(data))
```

也可以用 RxJS 返回一个 Observable，连续发多次：

```ts
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

@SubscribeMessage('events')
onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
  const numbers = [1, 2, 3]
  return from(numbers).pipe(
    map(num => ({ event: 'events', data: num }))
  )
}
```

客户端会持续收到 1、2、3 三次响应。



### 生命周期管理

网关还有几个生命周期钩子，挺实用：

- OnGatewayInit：初始化后触发，可以拿到服务器实例。
- OnGatewayConnection：客户端连上时触发。
- OnGatewayDisconnect：客户端断开时触发。

比如：

```ts
import { OnGatewayConnection, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server

  handleConnection(client: Socket) {
    console.log('有人连上了！', client.id)
  }
}
```

用 @WebSocketServer() 能直接拿到服务器实例，方便得很。



### 异常处理

出错怎么办？用 WsException：

```ts
import { WsException } from '@nestjs/websockets'

@SubscribeMessage('events')
handleEvent(@MessageBody() data: string): string {
  if (!data) throw new WsException('数据不能为空！')
  return data
}
```

客户端会收到：

```json
{ "status": "error", "message": "数据不能为空！" }
```



### 高级玩法：自定义适配器

认的 socket.io 不够用？可以自己写适配器。比如用 ws 库，性能更高：

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WsAdapter } from '@nestjs/platform-ws'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(3000)
}
bootstrap()
```

甚至还能扩展 socket.io，支持 Redis 广播：

```ts
import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor

  async connectToRedis() {
    const pubClient = createClient({ url: 'redis://localhost:6379' })
    const subClient = pubClient.duplicate()
    await Promise.all([pubClient.connect(), subClient.connect()])
    this.adapterConstructor = createAdapter(pubClient, subClient)
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options)
    server.adapter(this.adapterConstructor)
    return server
  }
}
```

用的时候：

```ts
const app = await NestFactory.create(AppModule)
const redisIoAdapter = new RedisIoAdapter(app)
await redisIoAdapter.connectToRedis()
app.useWebSocketAdapter(redisIoAdapter)
```

这样就能在多服务器间广播消息了，适合大规模应用。



### 总结

Nest.js 的 WebSocket 网关功能强大又灵活，从简单回显到复杂异步响应，再到自定义适配器，几乎能满足所有实时需求。核心就是 @WebSocketGateway() 和 @SubscribeMessage()，加上生命周期管理和异常处理，开发体验一流。