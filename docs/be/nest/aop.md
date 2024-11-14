在现代后端开发中，框架的选择和架构设计至关重要。NestJS 作为一个基于 Node.js 的后端框架，凭借其强大的模块化设计和灵活的架构，受到了越来越多开发者的青睐。NestJS 的核心架构基于 MVC（Model-View-Controller），但它的独特之处在于对 AOP（面向切面编程）的支持。通过 AOP，NestJS 能够让开发者在不侵入业务逻辑的情况下，轻松实现日志记录、权限控制、异常处理等通用功能。

## 什么是 MVC 架构？

MVC 是后端开发中常见的架构模式，代表了 Model（模型）、View（视图）和 Controller（控制器）。在 MVC 架构中，用户的请求首先会被 Controller 接收，Controller 负责调用 Model 层的 Service 来处理业务逻辑，最后将结果返回给 View 层，生成用户看到的页面或数据。

简单来说，MVC 架构将业务逻辑、数据处理和用户界面分离开来，便于开发和维护。

## AOP：让通用逻辑更优雅

虽然 MVC 架构已经很好地分离了业务逻辑和视图，但在实际开发中，我们经常需要在业务逻辑之外加入一些通用的功能，比如日志记录、权限验证、异常处理等。这些功能如果直接写在 Controller 或 Service 中，会导致代码变得臃肿且难以维护。

这时候，AOP（面向切面编程）就派上了用场。AOP 的核心思想是将这些通用逻辑抽离出来，通过“切面”的方式动态地加入到业务逻辑的前后。这样，业务逻辑保持了纯粹性，而通用逻辑则可以复用和动态增删。

### AOP 的实现方式

在 NestJS 中，AOP 的实现方式非常丰富，主要包括以下五种：

1. **Middleware（中间件）**
2. **Guard（守卫）**
3. **Pipe（管道）**
4. **Interceptor（拦截器）**
5. **ExceptionFilter（异常过滤器）**

接下来，我们将逐一介绍这些 AOP 机制，并通过代码示例展示它们的使用方式。

### 1. Middleware：请求的“洋葱模型”

Middleware 是 Express 框架中的概念，NestJS 继承了这一机制。中间件的作用是在请求到达 Controller 之前，或者响应返回给客户端之前，执行一些通用逻辑。它的执行顺序类似于“洋葱模型”，即外层的中间件会先执行，内层的中间件会后执行。

#### 示例：全局中间件

```typescript:src/main.ts
app.use(function(req: Request, res: Response, next: NextFunction) {
    console.log('before', req.url);
    next();
    console.log('after');
});
```

在这个例子中，我们在请求到达 Controller 之前和之后分别打印日志。通过这种方式，我们可以在多个路由之间复用中间件逻辑。

#### 路由中间件

除了全局中间件，NestJS 还支持路由中间件。我们可以通过 `MiddlewareConsumer` 来指定中间件只在某些路由上生效。

```typescript:src/app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('aaa*');
  }
}
```

这样，`LogMiddleware` 只会在以 `aaa` 开头的路由上生效。

### 2. Guard：路由守卫

Guard 是 NestJS 中用于权限控制的机制。它会在请求到达 Controller 之前执行，决定是否允许请求继续执行。Guard 的返回值是 `true` 或 `false`，分别表示是否放行请求。

#### 示例：登录守卫

```typescript:src/login.guard.ts
@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('login check');
    return false; // 拒绝请求
  }
}
```

在这个例子中，我们创建了一个简单的登录守卫，所有请求都会被拒绝，返回 403 状态码。

### 3. Pipe：参数验证与转换

Pipe 是 NestJS 中用于处理请求参数的机制。它可以对传入的参数进行验证和转换，确保参数的格式和类型正确。

#### 示例：自定义验证管道

```typescript:src/validate.pipe.ts
@Injectable()
export class ValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Number.isNaN(parseInt(value))) {
      throw new BadRequestException(`参数 ${metadata.data} 错误`);
    }
    return parseInt(value) * 10;
  }
}
```

在这个例子中，我们创建了一个自定义的验证管道，确保传入的参数是数字，并将其乘以 10。

### 4. Interceptor：拦截器

Interceptor 是 NestJS 中用于在请求前后执行逻辑的机制。它可以在请求到达 Controller 之前或响应返回给客户端之前，执行一些额外的逻辑。

#### 示例：时间拦截器

```typescript:src/time.interceptor.ts
@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => console.log('time: ', Date.now() - startTime))
    );
  }
}
```

在这个例子中，我们创建了一个时间拦截器，用于记录请求的处理时间。

### 5. ExceptionFilter：异常过滤器

ExceptionFilter 是 NestJS 中用于处理异常的机制。它可以捕获抛出的异常，并返回自定义的响应。

#### 示例：自定义异常过滤器

```typescript:src/test.filter.ts
@Catch(BadRequestException)
export class TestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(400).json({
      statusCode: 400,
      message: 'test: ' + exception.message,
    });
  }
}
```

在这个例子中，我们创建了一个自定义的异常过滤器，捕获 `BadRequestException` 并返回自定义的错误信息。

## AOP 机制的执行顺序

在 NestJS 中，Middleware、Guard、Pipe、Interceptor 和 ExceptionFilter 都是 AOP 的实现，它们的执行顺序如下：

1. **Middleware**：最外层的中间件，首先执行。
2. **Guard**：判断请求是否有权限继续执行。
3. **Pipe**：对请求参数进行验证和转换。
4. **Interceptor**：在请求前后执行额外的逻辑。
5. **ExceptionFilter**：捕获异常并返回自定义响应。

通过这种顺序，NestJS 实现了灵活的 AOP 机制，开发者可以根据需求在不同的阶段加入通用逻辑。

## 总结

NestJS 通过对 AOP 的支持，让开发者能够在不侵入业务逻辑的情况下，轻松实现日志记录、权限控制、异常处理等通用功能。Middleware、Guard、Pipe、Interceptor 和 ExceptionFilter 是 NestJS 中 AOP 的具体实现，它们各自负责不同的切面，帮助开发者构建松耦合、易维护的后端架构。

通过 AOP，NestJS 实现了业务逻辑与通用逻辑的分离，让代码更加简洁、优雅。如果你还没有尝试过 NestJS，不妨动手试试，感受一下 AOP 带来的开发体验提升。
