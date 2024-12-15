# 深入理解 NestJS 的 ArgumentHost 和 ExecutionContext：跨上下文复用的艺术

在现代 Web 开发中，NestJS 作为一个强大的 Node.js 框架，提供了丰富的功能来构建高效、可扩展的应用程序。NestJS 支持多种服务类型，包括 HTTP 服务、WebSocket 服务以及基于 TCP 通信的微服务。每种服务类型都有其独特的上下文和参数，这就带来了一个有趣的问题：如何在不同类型的服务中复用相同的 Guard、Interceptor 和 Exception Filter？

本文将带你深入探讨 NestJS 中的 `ArgumentHost` 和 `ExecutionContext`，并展示如何通过它们实现跨上下文的复用。

## 不同服务类型的挑战

在 NestJS 中，HTTP 服务可以直接访问 `request` 和 `response` 对象，而 WebSocket 服务则没有这些对象。假设你在一个 HTTP 服务中编写了一个 Exception Filter 来处理异常，并且这个 Filter 依赖于 `request` 和 `response`，那么当你想在 WebSocket 服务中复用这个 Filter 时，就会遇到问题，因为 WebSocket 没有 `request` 和 `response`。

这意味着，如果我们直接在 Guard、Interceptor 或 Exception Filter 中操作 `request` 或 `response`，就无法在不同类型的服务中复用这些逻辑。为了解决这个问题，NestJS 提供了一个强大的工具：`ArgumentHost`。

## ArgumentHost：跨上下文的桥梁

`ArgumentHost` 是 NestJS 提供的一个类，用于在不同的上下文（如 HTTP、WebSocket、RPC）之间切换。通过 `ArgumentHost`，你可以根据当前的上下文类型获取相应的参数，从而实现跨上下文的复用。

### 创建一个 Exception Filter

我们首先创建一个简单的 Exception Filter 来处理自定义异常：

```typescript
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'
import { AaaException } from './AaaException'

@Catch(AaaException)
export class AaaFilter implements ExceptionFilter {
  catch(exception: AaaException, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse<Response>()
      const request = ctx.getRequest<Request>()

      response.status(500).json({
        aaa: exception.aaa,
        bbb: exception.bbb,
      })
    } else if (host.getType() === 'ws') {
      // WebSocket 处理逻辑
    } else if (host.getType() === 'rpc') {
      // RPC 处理逻辑
    }
  }
}
```

在这个 Filter 中，我们使用 `host.getType()` 来判断当前的上下文类型。如果是 HTTP 上下文，我们通过 `host.switchToHttp()` 获取 `request` 和 `response` 对象，并返回一个 JSON 响应。如果是 WebSocket 或 RPC 上下文，我们可以根据需要添加相应的处理逻辑。

### 调试与验证

为了验证我们的 Filter 是否正常工作，我们可以通过调试工具来查看 `ArgumentHost` 提供的各种方法和属性。通过 `host.getArgs()`，我们可以获取当前上下文的所有参数，而 `host.getArgByIndex()` 则允许我们根据索引获取特定的参数。

```typescript
const args = host.getArgs()
const request = host.getArgByIndex(0) // 获取第一个参数
```

此外，`switchToHttp()`、`switchToWs()` 和 `switchToRpc()` 方法分别用于切换到 HTTP、WebSocket 和 RPC 上下文，从而获取对应的参数。

## ExecutionContext：更强大的 ArgumentHost

`ExecutionContext` 是 `ArgumentHost` 的子类，扩展了两个非常有用的方法：`getClass()` 和 `getHandler()`。这两个方法允许我们在 Guard 和 Interceptor 中获取当前正在处理的控制器类和方法。

### 创建一个 Guard

我们接下来创建一个 Guard 来演示 `ExecutionContext` 的使用：

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { Role } from './role'

@Injectable()
export class AaaGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler())

    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.some(role => user && user.roles?.includes(role))
  }
}
```

在这个 Guard 中，我们通过 `context.getHandler()` 获取当前处理的控制器方法，并使用 `Reflector` 来获取该方法上的 `roles` 元数据。然后，我们根据用户的角色决定是否允许访问。

### 为什么需要 getClass 和 getHandler？

`getClass()` 和 `getHandler()` 的存在是为了让 Guard 和 Interceptor 能够根据控制器类或方法上的元数据来执行特定的逻辑。例如，在权限验证中，我们可以通过这些方法获取控制器或方法上的角色信息，从而决定是否放行请求。

## Interceptor 中的 ExecutionContext

同样地，`ExecutionContext` 也可以在 Interceptor 中使用。我们可以通过 `context.getClass()` 和 `context.getHandler()` 获取控制器类和方法，并结合 `Reflector` 来提取元数据。

```typescript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AaaInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    console.log('Roles:', roles)
    return next.handle()
  }
}
```

## 总结

通过 `ArgumentHost` 和 `ExecutionContext`，NestJS 实现了在不同上下文（如 HTTP、WebSocket、RPC）中复用 Guard、Interceptor 和 Exception Filter 的能力。`ArgumentHost` 提供了切换上下文的功能，而 `ExecutionContext` 则扩展了获取控制器类和方法的能力，使得我们可以根据元数据执行更加灵活的逻辑。

在实际开发中，合理使用这些工具可以大大提高代码的复用性和可维护性，尤其是在构建复杂的微服务架构时，跨上下文的复用将变得尤为重要。

通过本文的介绍，相信你已经对 NestJS 中的 `ArgumentHost` 和 `ExecutionContext` 有了更深入的理解，并能够在实际项目中灵活运用它们来构建高效、可扩展的应用程序。
