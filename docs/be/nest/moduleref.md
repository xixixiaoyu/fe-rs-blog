### 什么是 ModuleRef？

ModuleRef 是 Nest 提供的一个类，专门用来操作模块内部的提供者（provider）。你可以把它想象成一个“查找助手”，通过它可以用注入令牌（token）找到某个提供者的实例。

它还能动态实例化一些特殊的提供者，比如那些作用域不太一样的对象（比如瞬态或请求作用域）。用法也很直接，通常是通过构造函数注入到你的类里。

比如，我们有个 CatsService，想用 ModuleRef：

```ts
import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class CatsService {
  constructor(private moduleRef: ModuleRef) {}
}
```

从 @nestjs/core 里导入 ModuleRef，然后注入到服务里，就可以用它干活了。



### 用 get() 拿实例：最基础的操作

ModuleRef 提供了一个 get() 方法，能帮你从当前模块里找到已经注册好的东西，比如服务、控制器或者其他可注入的对象。只需要给它一个注入令牌（通常是类名），它就返回对应的实例。如果找不到？会直接抛异常提醒你。

举个例子，假设我们有个 Service 类，想在 CatsService 初始化时拿到它的实例：

```ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Service } from './service'

@Injectable()
export class CatsService implements OnModuleInit {
  private service: Service
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.service = this.moduleRef.get(Service)
  }
}
```

这样，onModuleInit 的时候，service 就会被赋值为 Service 的实例，超级方便！

不过有个小坑要注意：get() 只能拿当前模块里静态作用域的实例。如果是瞬态（transient）或者请求作用域（request-scoped）的提供者，用 get() 是拿不到的，会报错。这种情况怎么办？别急，后面会讲到解决办法。

还有，如果你的提供者注册在别的模块（全局上下文），想跨模块拿怎么办？加个参数 { strict: false } 就行了：

```ts
this.moduleRef.get(Service, { strict: false })
```

这样就能从全局范围找，不局限于当前模块。



### 动态解析作用域提供者：resolve() 的妙用

前面说了，get() 对作用域提供者无能为力，这时候就得请出 resolve() 方法了。它专门用来动态解析瞬态或请求作用域的提供者。用法也很简单，传入注入令牌就行，但它是异步的，得用 await。

比如，我们有个瞬态的 TransientService：

```ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { TransientService } from './transient.service'

@Injectable()
export class CatsService implements OnModuleInit {
  private transientService: TransientService
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.transientService = await this.moduleRef.resolve(TransientService)
  }
}
```

这里有个有趣的地方：resolve() 每次调用都会生成一个新的实例，因为它是从一个独立的依赖注入子树里拿的。想验证一下？试试这个：

```ts
async onModuleInit() {
  const transientServices = await Promise.all([
    this.moduleRef.resolve(TransientService),
    this.moduleRef.resolve(TransientService),
  ])
  console.log(transientServices[0] === transientServices[1]) // false
}
```

结果是 false，说明两次拿到的实例不一样。

那如果我想让它们共享同一个实例呢？可以用上下文标识符（context ID）。Nest 提供了 ContextIdFactory.create() 来生成一个唯一标识符，传给 resolve()：

```ts
import { ContextIdFactory } from '@nestjs/core'

async onModuleInit() {
  const contextId = ContextIdFactory.create()
  const transientServices = await Promise.all([
    this.moduleRef.resolve(TransientService, contextId),
    this.moduleRef.resolve(TransientService, contextId),
  ])
  console.log(transientServices[0] === transientServices[1]) // true
}
```

这回是 true 了，因为用同一个 contextId，实例就共享了。



### 处理 REQUEST 提供者：别让它 undefined

如果你手动用 ContextIdFactory.create() 创建了上下文标识符，默认情况下，REQUEST 提供者会是 undefined，因为这个子树不是 Nest 自动管理的。想解决这个问题？可以用 ModuleRef 的 registerRequestByContextId() 方法，手动注册一个请求对象：

```ts
const contextId = ContextIdFactory.create()
this.moduleRef.registerRequestByContextId({ user: 'Tom' }, contextId)
```

这样，依赖这个子树的提供者就能访问到你自定义的 REQUEST 对象了。



### 在请求作用域里找伙伴

有时候，你的服务本身就是请求作用域的，还想解析另一个请求作用域的实例，比如 CatsRepository。这时候不能随便生成新的 contextId，得用当前请求的上下文。怎么做呢？

先注入 REQUEST 对象：

```ts
import { Injectable, Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  constructor(@Inject(REQUEST) private request: Record<string, unknown>) {}
}
```

然后用 ContextIdFactory.getByRequest() 根据请求对象拿到上下文标识符，再传给 resolve()：

```ts
const contextId = ContextIdFactory.getByRequest(this.request)
const catsRepository = await this.moduleRef.resolve(CatsRepository, contextId)
```

这样拿到的 catsRepository 就跟当前请求共享同一个子树了。



### 动态创建自定义类：create() 的自由度

最后说说 create() 方法。它能动态实例化一个没注册为提供者的类，特别适合需要灵活控制的情况。比如有个 CatsFactory：

```ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { CatsFactory } from './cats.factory'

@Injectable()
export class CatsService implements OnModuleInit {
  private catsFactory: CatsFactory
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.catsFactory = await this.moduleRef.create(CatsFactory)
  }
}
```

这招的好处是，你可以在运行时根据条件决定要实例化什么，完全不受框架容器限制。



### 总结一下

ModuleRef 是 Nest 里一个超实用的工具，不管是拿静态实例（get()）、动态解析作用域提供者（resolve()），还是创建自定义类（create()），它都能搞定。关键是理解它的适用场景：

- 用 get() 找当前模块或全局的静态提供者；
- 用 resolve() 处理瞬态或请求作用域，注意每次是新实例，除非指定 contextId；
- 用 create() 在容器外自由实例化类。