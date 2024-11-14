# 深入理解 Nest.js 中的 Middleware：与 Express 的对比与应用

在使用 Nest.js 开发时，很多开发者会发现它的中间件（Middleware）概念与 Express 的中间件非常相似。毕竟，Nest.js 的底层默认是基于 Express 构建的。那么，Nest.js 的中间件和 Express 的中间件到底是不是一回事呢？答案是：**很像，但不完全一样**。

## Nest.js 与 Express 的关系

首先要明确的是，Nest.js 并不是完全依赖于 Express。虽然它默认使用 Express 作为 HTTP 请求处理库，但你也可以选择切换到其他库，比如 Fastify。因此，Nest.js 的中间件并不是直接从 Express 继承的，而是 Nest.js 自己实现的一套机制。

为了更好地理解，我们可以通过一个简单的项目来演示 Nest.js 中间件的使用。

### 创建一个 Nest.js 项目

首先，我们创建一个新的 Nest.js 项目：

```bash
nest new middleware-test
```

进入项目后，生成一个中间件：

```bash
nest g middleware aaa --no-spec --flat
```

这时，Nest.js 并不知道你使用的是 Express 还是 Fastify，因此 `request` 和 `response` 的类型默认是 `any`。我们可以手动标注类型：

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class AaaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('before')
    next()
    console.log('after')
  }
}
```

在这个中间件中，我们简单地在请求前后打印日志。接下来，我们需要在模块中应用这个中间件。

### 在模块中使用中间件

在 `AppModule` 中，我们通过实现 `NestModule` 接口来配置中间件：

```typescript
import { AaaMiddleware } from './aaa.middleware'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AaaMiddleware).forRoutes('*')
  }
}
```

通过 `forRoutes('*')`，我们将 `AaaMiddleware` 应用到所有路由。现在，运行项目并访问 `http://localhost:3000`，你会看到中间件的日志输出。

### 精确指定路由

当然，我们也可以更精确地指定中间件应用的路由。比如，我们可以只让中间件作用于特定的 GET 请求：

```typescript
import { AaaMiddleware } from './aaa.middleware'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AaaMiddleware).forRoutes({ path: 'hello*', method: RequestMethod.GET })
    consumer.apply(AaaMiddleware).forRoutes({ path: 'world2', method: RequestMethod.GET })
  }
}
```

在这个例子中，`AaaMiddleware` 只会作用于 `hello*` 和 `world2` 路由，而不会作用于其他路由。

## Nest.js 中间件的独特之处：依赖注入

如果仅仅是这样，Nest.js 的中间件和 Express 的中间件看起来差别不大。那为什么 Nest.js 要把中间件做成类的形式呢？答案是：**为了依赖注入**。

在 Nest.js 中，我们可以通过依赖注入的方式，将服务注入到中间件中。比如，我们可以将 `AppService` 注入到中间件中：

```typescript
import { AppService } from './app.service'
import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class AaaMiddleware implements NestMiddleware {
  @Inject(AppService)
  private readonly appService: AppService

  use(req: Request, res: Response, next: () => void) {
    console.log('before')
    console.log('Service says: ' + this.appService.getHello())
    next()
    console.log('after')
  }
}
```

通过这种方式，我们可以在中间件中使用 `AppService` 提供的功能。这是 Express 的中间件所不具备的能力。

### 函数形式的中间件

当然，如果你不需要依赖注入，也可以使用函数形式的中间件，这时它和 Express 的中间件几乎没有区别：

```typescript
function logger(req: Request, res: Response, next: () => void) {
  console.log('Request...')
  next()
}
```

这种形式的中间件无法使用依赖注入，但在某些简单场景下依然非常有用。

## @Next 装饰器与 next 参数的区别

在 Nest.js 中，`next` 参数用于调用下一个中间件，这和 Express 中的 `next` 参数是一样的。而 Nest.js 还提供了一个 `@Next` 装饰器，它用于调用下一个处理器（handler）。当你使用 `@Next` 装饰器时，Nest.js 不会自动处理返回值，而是认为你会手动处理响应。

```typescript
import { Next } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  handleRequest(@Next() next: Function) {
    next()
  }
}
```

这种方式在某些复杂的场景下可能会用到，但大多数情况下，我们只需要在一个处理器中完成所有逻辑。

## Middleware 与 Interceptor 的区别

有些同学可能会问：**Nest.js 的中间件和拦截器（Interceptor）都是在请求前后加入一些逻辑，它们有什么区别呢？**

主要有两点区别：

1. **拦截器可以访问更多上下文信息**：拦截器可以通过 `ExecutionContext` 获取目标类和处理器的信息，甚至可以通过 `Reflector` 获取它们的元数据。而中间件无法访问这些信息。
2. **拦截器可以使用 RxJS 操作符**：拦截器可以使用 RxJS 的操作符来处理响应流，这使得它在处理复杂的业务逻辑时非常强大。而中间件则不具备这种能力。

因此，**中间件更适合处理通用的逻辑**，比如日志记录、身份验证等。而拦截器则更适合处理与具体业务相关的逻辑，比如数据转换、响应格式化等。

## 总结

Nest.js 的中间件虽然和 Express 的中间件非常相似，但它有着自己独特的特性。通过依赖注入，Nest.js 的中间件可以轻松访问服务和其他依赖，这使得它在复杂应用中更加灵活。同时，Nest.js 还提供了拦截器等更强大的工具，帮助开发者在请求处理的各个阶段加入自定义逻辑。

总的来说，**中间件适合处理通用的逻辑**，而**拦截器则更适合处理与业务相关的逻辑**。在实际开发中，合理选择和使用这两者，能够让你的应用更加简洁、灵活和高效。
