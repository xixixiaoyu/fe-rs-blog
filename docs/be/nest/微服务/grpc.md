### gRPC 是什么？

想象一下，你有个朋友住在另一个城市，你们得通过电话联系。现在电话这东西得有个“规则”：你得先拨号，他得接听，然后你们才能聊起来。gRPC 就有点像这个“电话系统”，但它是给程序用的。它是一个高性能的工具，让不同服务器上的代码能像打电话一样互相调用功能。

gRPC 的核心是基于 **协议缓冲区**（protobuf），简单来说，就是用一种特殊的文件（.proto 文件）来定义“咱们要聊啥”。比如你要问朋友“给我找个 ID 是 1 的英雄”，你就得告诉他“ID 是啥”，他再回你“英雄名字是啥”。这些规则写在 .proto 文件里，gRPC 负责把这些信息打包、发送、解包，超级高效。

它还有个大优势：支持跨语言。你可以用 JavaScript 写客户端，服务器用 Go，完全没问题。而且它还能轻松搞定负载均衡、健康检查这些高级功能，特别适合微服务这种场景。



### 怎么开始用 gRPC？

装工具：

```bash
npm i --save @grpc/grpc-js @grpc/proto-loader
```

这俩包是 gRPC 的核心：@grpc/grpc-js 是 gRPC 的 JavaScript 实现，@grpc/proto-loader 帮你加载 .proto 文件。

接下来，假设我们要建一个“英雄查询服务”。Nest.js 里启动微服务很简单，代码长这样：

```ts
// main.ts
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: join(__dirname, 'hero/hero.proto'),
    },
  })
  await app.listen()
}
bootstrap()
```

这里 transport: Transport.GRPC 告诉 Nest 用 gRPC 模式，options 里指定了服务用哪个 .proto 文件（后面会写这个文件）。join 是 Node.js 的 path 模块里的函数，帮你拼路径。

有个小细节：.proto 文件是静态文件，Nest 默认不会把它打包到 dist 目录。所以你得在 nest-cli.json 里加点配置：

```ts
{
  "compilerOptions": {
    "assets": ["**/*.proto"],
    "watchAssets": true
  }
}
```

这样编译时 .proto 文件会自动复制过去，开发时改动也能实时同步。



### 定义服务：写 .proto 文件

.proto 文件就是咱们的“电话本”，得写清楚要调啥功能。假设我们要查英雄信息，文件可以这么写：

```protobuf
// hero/hero.proto
syntax = "proto3"

package hero

service HeroesService {
  rpc FindOne (HeroById) returns (Hero) {}
}

message HeroById {
  int32 id = 1
}

message Hero {
  int32 id = 1
  string name = 2
}
```

解释一下：

- syntax = "proto3"：用的是 protobuf 的第 3 版语法。
- package hero：给服务取个命名空间，叫 hero。
- service HeroesService：定义一个服务，里面有个 FindOne 方法，输入是 HeroById，输出是 Hero。
- message：定义数据结构，类似 JSON 的 schema。HeroById 只有个 id，Hero 有 id 和 name。

写好这个，gRPC 就知道怎么传数据了。



### 实现服务端：返回英雄数据

服务端得告诉 gRPC “收到请求咋办”。在 Nest.js 里，用控制器来实现：

```ts
// heroes.controller.ts
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js'

interface HeroById {
  id: number
}

interface Hero {
  id: number
  name: string
}

@Controller()
export class HeroesController {
  @GrpcMethod('HeroesService', 'FindOne')
  findOne(data: HeroById, metadata: Metadata, call: ServerUnaryCall<any, any>): Hero {
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ]
    return items.find(item => item.id === data.id)
  }
}
```

这代码啥意思呢？

- @GrpcMethod('HeroesService', 'FindOne')：告诉 Nest 这个方法对应 HeroesService 的 FindOne。
- data: HeroById：接收客户端传来的 id。
- 返回值：从假数据里找匹配的英雄，直接返回。

简单吧？gRPC 自动把请求解包成 data，返回值也会打包回去。



### 客户端：调用服务

现在假设另一个服务想查英雄咋办？Nest 提供了客户端支持。先注册服务：

```ts
// app.module.ts
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HERO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'hero',
          protoPath: join(__dirname, 'hero/hero.proto'),
        },
      },
    ]),
  ],
})
export class AppModule {}
```

然后在服务里用：

```ts
// app.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { Observable } from 'rxjs'

interface HeroesService {
  findOne(data: { id: number }): Observable<any>
}

@Injectable()
export class AppService implements OnModuleInit {
  private heroesService: HeroesService

  constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroesService')
  }

  getHero(): Observable<any> {
    return this.heroesService.findOne({ id: 1 })
  }
}
```

注意：

- ClientsModule.register 注册了个客户端，名字是 HERO_PACKAGE。
- getService 拿到 HeroesService 的实例。
- 方法名变成小驼峰（findOne），这是 gRPC 的习惯。

调用 getHero() 就会返回 { id: 1, name: 'John' }，完美！



### 高级玩法：流和元数据

gRPC 不光支持单次调用，还能“聊天式”传输数据。比如双向流：

```ts
import { GrpcStreamMethod } from '@nestjs/microservices'
import { Observable, Subject } from 'rxjs'

@GrpcStreamMethod('HeroesService', 'BidiHello')
bidiHello(messages: Observable<any>): Observable<any> {
  const subject = new Subject()
  messages.subscribe({
    next: message => subject.next({ reply: 'Hello!' }),
    complete: () => subject.complete(),
  })
  return subject.asObservable()
}
```

这个方法接收客户端的流，实时回复“Hello!”，像极了实时聊天。

还有元数据（metadata），可以传额外信息，比如 cookie：

```ts
@GrpcMethod()
findOne(data: HeroById, metadata: Metadata, call: ServerUnaryCall<any, any>): Hero {
  const serverMetadata = new Metadata()
  serverMetadata.add('Set-Cookie', 'yummy_cookie=choco')
  call.sendMetadata(serverMetadata)
  return { id: 1, name: 'John' }
}
```



### 总结：为啥用 gRPC？

聊到这，你可能明白了：gRPC 快、灵活，还跨语言，特别适合微服务。跟 REST 比，它用二进制传输（protobuf）效率更高，定义接口也更严格。Nest.js 集成起来又简单，开发体验满分。