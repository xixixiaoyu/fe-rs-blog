在 Web 应用程序中，当发生错误或异常时，通常需要以一种用户友好的方式将错误信息传递给客户端。<br />异常过滤器就是用来捕获这些在应用程序的各个部分抛出的异常，并对它们进行处理的机制。

### 异常过滤器的工作原理

1. **捕获异常**：当控制器、提供者或中间件等抛出异常时，Nest.js 会尝试捕获这个异常。
2. **异常对象**：Nest.js 会创建一个异常对象，这个对象包含了异常的详细信息，如异常类型、描述等。
3. **调用异常过滤器**：Nest.js 会调用注册的异常过滤器来处理这个异常。
4. **自定义响应**：在异常过滤器中，可以根据异常的类型和内容定制响应，比如设置状态码、错误信息等，并发送给客户端

### 创建异常过滤器
异常过滤器是通过实现 ExceptionFilter 接口来创建的，它必须实现 catch 方法。下面是一个简单的异常过滤器示例：
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

### 使用异常过滤器
异常过滤器可以通过多种方式来使用：

- **全局范围**：可以在应用程序的全局范围内应用异常过滤器。
- **控制器范围**：可以仅在特定的控制器中使用异常过滤器。
- **方法范围**：可以在控制器内的特定方法上使用异常过滤器。
```typescript
// 绑定到全局
import { Module } from '@nestjs/common';

@Module({
  // ...
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}

// 绑定到控制器
@Controller('some-route')
@UseFilters(HttpErrorFilter)
export class SomeController {
  // ...
}

// 绑定到路由处理程序
@Controller('some-route')
export class SomeController {
  @Get()
  @UseFilters(HttpErrorFilter)
  findSomeRoute() {
    // ...
  }
}
```

## 内置的异常
Nest 内置了很多 http 相关的异常，都是 HttpException 的子类：

- BadRequestException
- UnauthorizedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- PayloadTooLargeException
- UnsupportedMediaTypeException
- UnprocessableException
- InternalServerErrorException
- NotImplementedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException

当然，也可以 extends HttpException 自己扩展。<br />**Nest 通过这样的方式实现了异常到响应的对应关系，代码里只要抛出不同的异常，就会返回对应的响应。**

