Nest.js 中的守卫（Guards））可以用于处理请求授权。<br />守卫是一个使用 `@Injectable()` 装饰器注解的类，它实现了 `CanActivate` 接口。守卫可以决定是否允许某个请求继续执行，通常是通过验证用户是否拥有执行操作的权限。<br />如果请求被允许执行，守卫应该返回 `true` 或者一个 `Observable` 或 `Promise`，这个 `Observable` 或 `Promise` 解析为 `true`。<br />如果请求不被允许，守卫应该返回 `false` 或者一个解析为 `false` 的 `Observable` 或 `Promise`，或者抛出一个异常。

守卫示例：
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies; // 获取 Cookie
    const session = request.session; // 获取 Session

    const user = session.user || request.user;
    // 校验用户是否拥有特定的角色
    return user && user.roles.includes('admin');
  }
}
```
这个方法接收一个 `ExecutionContext` 参数，它提供了请求的详细信息。<br />在 `canActivate` 方法中，我们可以获取到当前请求的用户信息，并检查用户是否拥有 'admin' 角色。<br />如果用户是 'admin'，则返回 `true`，请求继续执行；如果不是，则返回 `false`，请求将被拒绝。

使用 `@UseGuards()` 装饰器应用守卫：
```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

@Controller('items')
export class ItemsController {
  @Get()
  @UseGuards(RolesGuard)
  findAll() {
    // 只有当 RolesGuard 允许时，才会执行这里的代码
    return 'This route is protected by a roles guard';
  }
}
```
在上面的代码中，`ItemsController` 的 `findAll` 方法被 `@UseGuards(RolesGuard)` 装饰。<br />这意味着每次调用 `findAll` 方法时，`RolesGuard` 都会被触发，以确保用户具有正确的角色。

## 配置守卫方式

1.  **控制器级别的守卫**：
```typescript
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {
  // 所有 CatsController 中的路由都将受到 RolesGuard 的保护
}
```

2.  **方法级别的守卫**：
```typescript
@Controller('cats')
export class CatsController {
  @Get()
  @UseGuards(RolesGuard)
  findOne() {
    // 只有 findOne 方法受到 RolesGuard 的保护
  }
}
```

3.  **全局守卫**：
```typescript
@Module({
  // ...
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```
 通过 provider 的方式声明的 Guard 是在 IoC 容器里的，可以注入别的 provider：
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 在这里可以使用注入的 AuthService 进行身份验证逻辑
    return this.authService.isAuthenticated();
  }
}
```

4. **模块级别的守卫**：虽然 Nest.js 直接不支持模块级别的守卫配置，但你可以在模块的 `providers` 数组中配置守卫，并使用模块的导出功能来共享这个守卫。这样，其他导入了该模块的模块可以复用同一个守卫。 
```typescript
@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class SharedModule {}
```

## 动态守卫
动态守卫指的是可以根据特定的条件或参数动态创建的守卫。<br />这种守卫通常是通过工厂函数或者类的静态方法来实现的，允许开发者在运行时根据需要构造不同的守卫实例。<br />动态守卫的一个常见用例是基于角色的访问控制，其中你可能希望根据不同的角色来限制对路由的访问。

下面是一个如何实现动态守卫的示例：

1.  **创建一个接受参数的工厂函数**：该函数接受一些参数（例如角色列表），并返回一个新的守卫实例
```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.roles.some((role) => user.roles.includes(role));
  }
}

export function createRolesGuard(...roles: string[]): Type<CanActivate> {
  @Injectable()
  class DynamicRolesGuard extends RolesGuard {
    constructor() {
      super(roles);
    }
  }
  return DynamicRolesGuard;
}
```
在上面的代码中，`createRolesGuard` 是一个工厂函数，它接受一个角色列表并返回一个继承自 `RolesGuard` 的新守卫类。<br />新类 `DynamicRolesGuard` 通过构造函数将角色列表传递给 `RolesGuard`。 

2.  **在控制器中使用动态守卫**：控制器中使用 `@UseGuards()` 装饰器和工厂函数来应用动态创建的守卫
```typescript
@Controller('cats')
export class CatsController {
  @Get()
  @UseGuards(createRolesGuard('admin', 'moderator'))
  findAll() {
    // 只有 'admin' 或 'moderator' 角色的用户可以访问
  }

  @Post()
  @UseGuards(createRolesGuard('admin'))
  create() {
    // 只有 'admin' 角色的用户可以访问
  }
}
```
在上面的例子中，`findAll` 方法使用了一个允许 'admin' 或 'moderator' 角色的用户访问的动态守卫，而 `create` 方法使用了一个只允许 'admin' 角色用户访问的守卫。 <br />良好运用动态守卫能减少很多重复代码，提高灵活性。
