# 深入理解 NestJS 中的 Exception Filter：自定义异常处理

在开发 Web 应用时，异常处理是不可避免的一部分。NestJS 作为一个现代的 Node.js 框架，提供了强大的异常处理机制，其中 `Exception Filter` 是一个非常重要的工具。它允许我们捕获应用中的异常，并返回自定义的响应格式。

本文将带你深入了解如何在 NestJS 中使用 `Exception Filter`，并通过实际案例展示如何自定义异常处理逻辑。

## 什么是 Exception Filter？

`Exception Filter` 是 NestJS 中用于捕获异常并返回相应响应的机制。它可以处理各种异常，比如：

- **404 错误**：当路由找不到时，返回 404。
- **500 错误**：当服务器内部错误时，返回 500。
- **400 错误**：当请求参数错误时，返回 400。

这些都是内置的 `Exception Filter` 自动处理的情况，但有时我们需要自定义异常的响应格式，这时就需要自定义 `Exception Filter`。

## 创建一个 Nest 项目

首先，我们需要创建一个新的 Nest 项目：

```bash
nest new exception-filter-test
```

启动项目：

```bash
npm run start:dev
```

访问 `http://localhost:3000`，你会看到默认的 "Hello World" 页面，说明项目已经成功运行。

## 在 Controller 中抛出异常

接下来，我们在 Controller 中抛出一个异常：

```typescript
throw new HttpException('xxxx', HttpStatus.BAD_REQUEST)
```

`HttpStatus` 是一些状态码的常量，比如 `HttpStatus.BAD_REQUEST` 对应 400 状态码。刷新页面后，你会看到返回的响应是 400 错误。

这个响应是由内置的 `Exception Filter` 生成的。接下来，我们将自定义这个响应格式。

## 自定义 Exception Filter

首先，生成一个新的过滤器：

```bash
nest g filter hello --flat --no-spec
```

`--flat` 参数表示不生成 `hello` 目录，`--no-spec` 表示不生成测试文件。

在生成的过滤器文件中，我们使用 `@Catch` 装饰器来指定要捕获的异常类型：

```typescript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common'

@Catch(BadRequestException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    debugger
  }
}
```

在 `AppModule` 中引入并全局启用这个过滤器：

```typescript
app.useGlobalFilters(new HelloFilter())
```

如果你只想在某个特定的控制器或处理器中启用这个过滤器，可以使用 `@UseFilters` 装饰器。

## 自定义响应格式

接下来，我们修改过滤器的逻辑，返回自定义的响应格式：

```typescript
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(BadRequestException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const response = http.getResponse<Response>()

    const statusCode = exception.getStatus()

    response.status(statusCode).json({
      code: statusCode,
      message: exception.message,
      error: 'Bad Request',
      customField: 111,
    })
  }
}
```

现在，当抛出 `BadRequestException` 时，返回的响应将包含自定义的字段 `customField`。

## 捕获所有 HttpException

如果我们想捕获所有的 `HttpException`，而不仅仅是 `BadRequestException`，可以将 `@Catch` 装饰器的参数改为 `HttpException`：

```typescript
@Catch(HttpException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const response = http.getResponse<Response>()

    const statusCode = exception.getStatus()
    const res = exception.getResponse() as { message: string[] }

    response.status(statusCode).json({
      code: statusCode,
      message: res?.message?.join ? res?.message?.join(',') : exception.message,
      error: 'Bad Request',
      customField: 111,
    })
  }
}
```

这样，所有的 `HttpException` 都会被捕获并返回自定义的响应格式。

## 处理 ValidationPipe 的异常

当我们使用 `ValidationPipe` 进行参数校验时，抛出的异常格式与普通的 `HttpException` 不同。我们需要对这种情况进行特殊处理。

首先，创建一个 DTO 并添加校验规则：

```typescript
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator'

export class AaaDto {
  @IsNotEmpty({ message: 'aaa 不能为空' })
  @IsEmail({}, { message: 'aaa 不是邮箱格式' })
  aaa: string

  @IsNumber({}, { message: 'bbb 不是数字' })
  @IsNotEmpty({ message: 'bbb 不能为空' })
  bbb: number
}
```

在 `main.ts` 中启用 `ValidationPipe`：

```typescript
app.useGlobalPipes(new ValidationPipe())
```

当校验失败时，`ValidationPipe` 会抛出一个包含错误信息的 `HttpException`。我们可以在过滤器中处理这种情况：

```typescript
@Catch(HttpException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const response = http.getResponse<Response>()

    const statusCode = exception.getStatus()
    const res = exception.getResponse() as { message: string[] }

    response.status(statusCode).json({
      code: statusCode,
      message: res?.message?.join ? res?.message?.join(',') : exception.message,
      error: 'Bad Request',
      customField: 111,
    })
  }
}
```

这样，`ValidationPipe` 抛出的异常也会返回正确的格式。

## 在 Filter 中注入服务

如果我们想在过滤器中注入其他服务，比如 `AppService`，可以通过在 `AppModule` 中注册一个 `APP_FILTER` provider 来实现：

```typescript
{
  provide: APP_FILTER,
  useClass: HelloFilter
}
```

然后在过滤器中注入 `AppService`：

```typescript
import { Inject } from '@nestjs/common'
import { AppService } from './app.service'

@Catch(HttpException)
export class HelloFilter implements ExceptionFilter {
  @Inject(AppService)
  private service: AppService

  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const response = http.getResponse<Response>()

    const statusCode = exception.getStatus()
    const res = exception.getResponse() as { message: string[] }

    response.status(statusCode).json({
      code: statusCode,
      message: res?.message?.join ? res?.message?.join(',') : exception.message,
      error: 'Bad Request',
      customField: 111,
      serviceMessage: this.service.getHello(),
    })
  }
}
```

这样，我们就可以在过滤器中调用 `AppService` 的方法了。

## 自定义异常

除了捕获内置的异常，我们还可以自定义异常。比如，我们创建一个 `UnLoginException`：

```typescript
export class UnLoginException {
  message: string

  constructor(message?: string) {
    this.message = message
  }
}
```

然后创建一个对应的过滤器：

```typescript
@Catch(UnLoginException)
export class UnloginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()

    response
      .status(HttpStatus.UNAUTHORIZED)
      .json({
        code: HttpStatus.UNAUTHORIZED,
        message: 'fail',
        data: exception.message || '用户未登录',
      })
      .end()
  }
}
```

在 `AppModule` 中注册这个过滤器：

```typescript
{
  provide: APP_FILTER,
  useClass: UnloginFilter
}
```

当我们在控制器中抛出 `UnLoginException` 时，浏览器将返回自定义的响应格式。

## 总结

通过本文的学习，我们了解了如何在 NestJS 中自定义 `Exception Filter`，并处理不同类型的异常。我们可以通过 `@Catch` 装饰器捕获特定的异常类型，并在 `catch` 方法中返回自定义的响应格式。此外，我们还学习了如何处理 `ValidationPipe` 抛出的异常，以及如何在过滤器中注入其他服务。

`Exception Filter` 是 NestJS 中非常强大的工具，能够帮助我们更灵活地处理异常并返回符合业务需求的响应格式。
