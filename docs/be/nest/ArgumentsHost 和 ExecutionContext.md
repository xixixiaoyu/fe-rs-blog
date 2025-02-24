### ArgumentsHost 是什么？

想象一下，你在写一个后端应用，里面可能会用到 REST 接口、微服务调用，甚至还有 WebSockets 实时通信。

不同的场景下，传给控制器的参数长得都不太一样，对吧？比如 HTTP 请求里可能是 request 和 response，而 WebSockets 里可能是客户端对象和数据。这时候，ArgumentsHost 就派上用场了 —— 它就像一个“万能钥匙”，能帮你拿到当前上下文里的参数。

简单来说，ArgumentsHost 是个抽象类，Nest 在需要的地方（比如异常过滤器的 catch 方法）会给你一个实例，通常叫 host。通过这个 host，你可以轻松拿到当前处理器收到的参数。



#### 怎么判断当前上下文？

假如你想写一个通用的守卫或者拦截器，能同时支持 HTTP 和微服务，你得先知道当前代码跑在什么环境下。这时候可以用 getType() 方法：

```ts
if (host.getType() === 'http') {
  console.log('这是个普通的 HTTP 请求')
} else if (host.getType() === 'rpc') {
  console.log('这是微服务调用')
} else if (host.getType() === 'graphql') {
  console.log('这是 GraphQL 请求')
}
```

这个方法返回一个字符串，告诉你当前的上下文类型。有了这个判断，你就可以根据情况执行不同的逻辑，代码一下子就灵活起来了。



#### 怎么拿到参数？

想直接拿到参数也很简单，用 getArgs() 方法就能拿到整个参数数组。比如在 HTTP 上下文里：

```ts
const [req, res, next] = host.getArgs()
console.log(req.query) // 打印请求的 query 参数
```

或者你只想要某个具体的参数，可以用 getArgByIndex()：

```ts
const request = host.getArgByIndex(0)
const response = host.getArgByIndex(1)
```

这样得记住每个位置是什么参数，太容易跟上下文绑死了。如果换个上下文，代码可能就崩了。所以 Nest 贴心地提供了更优雅的工具方法：

- switchToHttp()：切换到 HTTP 上下文
- switchToRpc()：切换到微服务上下文
- switchToWs()：切换到 WebSockets 上下文

比如在 HTTP 场景下：

```ts
const ctx = host.switchToHttp()
const request = ctx.getRequest()
const response = ctx.getResponse()
```

这样不管上下文怎么变，你都能用一致的方式拿到想要的对象。而且如果你用的是 Express，还可以加个类型断言，比如 ctx.getRequest<Request>()，直接拿到 Express 的原生类型，爽。

微服务和 WebSockets 也有类似的操作，比如：

```ts
const rpcCtx = host.switchToRpc()
const data = rpcCtx.getData() // 微服务的数据

const wsCtx = host.switchToWs()
const client = wsCtx.getClient() // WebSockets 的客户端对象
```



### 再来看看 ExecutionContext

ExecutionContext 继承了 ArgumentsHost，所以上面那些功能它都有，但它还额外提供了一些“高级技能”：

- getClass()：告诉你当前处理器属于哪个控制器类
- getHandler()：告诉你接下来要调用哪个方法

举个例子，假设你在处理一个 POST 请求，路由是 /cats，对应的控制器是 CatsController，方法是 create()。这时候：

```ts
const methodName = ctx.getHandler().name // "create"
const className = ctx.getClass().name   // "CatsController"
```

这两个方法特别适合用在守卫或者拦截器里，因为它们能让你知道当前执行的“位置”，非常适合结合元数据做一些高级操作（后面会细讲）。



### 元数据的妙用：让代码更聪明

说到元数据，Nest 的 Reflector 类简直是个宝藏。它能让你通过装饰器给控制器或者方法加一些“标签”，然后在守卫或者拦截器里读出来，做权限控制什么的特别方便。

#### 角色控制装饰器

比如我们想做一个角色控制的装饰器 Roles，只允许特定角色访问某个路由：

```ts
// roles.decorator.ts
import { Reflector } from '@nestjs/core'

export const Roles = Reflector.createDecorator<string[]>()
```

然后在控制器里用：

```ts
@Post()
@Roles(['admin'])
async create() {
  console.log('只有 admin 能进来！')
}
```

接下来在守卫里用 Reflector 读这个元数据：

```ts
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get(Roles, context.getHandler())
    if (!roles) return true // 没设置角色就放行
    const request = context.switchToHttp().getRequest()
    const userRole = request.user?.role // 假设用户信息在 request 里
    return roles.includes(userRole) // 检查用户角色
  }
}
```

如果元数据是加在控制器级别，比如：

```ts
@Roles(['user'])
@Controller('cats')
export class CatsController {}
```

那就用 getClass() 去读：

```ts
const roles = this.reflector.get(Roles, context.getClass())
```



#### 合并多级元数据

有时候控制器和方法上都有元数据，怎么办？可以用 getAllAndOverride() 或者 getAllAndMerge()：

- getAllAndOverride()：方法级的覆盖类级的
- getAllAndMerge()：把两级的合并起来

比如：

```ts
@Roles(['user'])
@Controller('cats')
export class CatsController {
  @Post()
  @Roles(['admin'])
  async create() {}
}
```

读取时：

```ts
const roles = this.reflector.getAllAndOverride(Roles, [
  context.getHandler(),
  context.getClass()
]) // ['admin']

const mergedRoles = this.reflector.getAllAndMerge(Roles, [
  context.getHandler(),
  context.getClass()
]) // ['user', 'admin']
```



### 总结

ArgumentsHost 和 ExecutionContext 的强大之处在于，它们让你的代码可以“随遇而安”。不管是 HTTP、微服务还是 WebSockets，甚至是 GraphQL，你都能用一套逻辑搞定。而且结合 Reflector，还能实现动态的权限控制和逻辑复用，简直是开发者的福音。