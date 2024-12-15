# 深入理解 Nest.js 的核心原理：Reflect Metadata 与依赖注入

在使用 Nest.js 开发时，你可能会发现一个非常神奇的现象：只需要通过装饰器简单声明一下，启动应用后，相关的对象就自动创建好了，依赖也被注入了。这一切看似“魔法”的背后，究竟是如何实现的呢？

其实，Nest.js 的核心实现依赖于一个非常重要的 API：`Reflect` 的元数据（Metadata）API。要理解 Nest.js 的工作原理，首先需要对这个 API 有一定的了解。

## Reflect API 简介

`Reflect` 是 ES6 引入的一个内置对象，提供了操作对象属性、方法和构造器的 API。常见的 `Reflect` API 包括：

- `Reflect.get(target, propertyKey)`：获取对象的属性值。
- `Reflect.set(target, propertyKey, value)`：设置对象的属性值。
- `Reflect.has(target, propertyKey)`：判断对象是否有某个属性。
- `Reflect.apply(target, thisArgument, argumentsList)`：调用某个方法。
- `Reflect.construct(target, argumentsList)`：使用构造器创建对象实例。

这些 API 已经被广泛应用于现代 JavaScript 开发中，并且可以在 [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect) 中查阅。

然而，Nest.js 使用的 `Reflect` API 并不仅限于这些标准方法。它还依赖于一组尚未进入标准的元数据 API，这些 API 目前处于草案阶段。

## Metadata API 介绍

元数据 API 提供了以下几个核心方法：

- `Reflect.defineMetadata(metadataKey, metadataValue, target)`：为目标对象定义元数据。
- `Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey)`：为目标对象的某个属性定义元数据。
- `Reflect.getMetadata(metadataKey, target)`：获取目标对象的元数据。
- `Reflect.getMetadata(metadataKey, target, propertyKey)`：获取目标对象某个属性的元数据。

这些 API 允许我们为类、方法或属性添加额外的信息（元数据），并在运行时通过 `Reflect.getMetadata` 取出这些信息。

### 元数据的存储位置

元数据存储在类或对象上。如果为类或类的静态属性添加元数据，元数据会保存在类上；如果为实例属性添加元数据，元数据则保存在对象上。元数据的存储方式类似于 `[[metadata]]` 这样的内部属性。

### 元数据的实际用途

单看这些 API，可能还不太清楚它们的实际用途。但当我们结合装饰器使用时，元数据的威力就显现出来了。

例如，使用 `Reflect.metadata` 装饰器为类和方法添加元数据：

```typescript
@Reflect.metadata('role', 'admin')
class User {
  @Reflect.metadata('role', 'user')
  getName() {
    return 'John Doe'
  }
}
```

通过 `Reflect.getMetadata`，我们可以在运行时获取这些元数据：

```typescript
const role = Reflect.getMetadata('role', User.prototype, 'getName')
console.log(role) // 输出 'user'
```

### 封装装饰器

我们还可以封装自己的装饰器，简化元数据的使用：

```typescript
function Role(role: string) {
  return Reflect.metadata('role', role)
}

@Role('admin')
class Admin {
  @Role('user')
  getName() {
    return 'Admin User'
  }
}
```

通过这种方式，我们可以为类和方法添加自定义的元数据，并在运行时根据这些元数据做出相应的处理。

## Nest.js 的实现原理

理解了 `Reflect` 的元数据 API 后，我们就可以更好地理解 Nest.js 的实现原理了。Nest.js 的核心思想是通过装饰器为类和方法添加元数据，并在应用启动时读取这些元数据，进行依赖注入和对象的创建。

### @Module 装饰器

以 `@Module` 装饰器为例，它的实现原理就是通过 `Reflect.defineMetadata` 为模块类添加元数据：

```typescript
import { Module } from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

在这个例子中，`@Module` 装饰器为 `CatsModule` 类添加了 `controllers` 和 `providers` 的元数据。Nest.js 在创建 IOC 容器时，会读取这些元数据，分析依赖关系，并创建相应的实例对象。

### @Controller 和 @Injectable 装饰器

类似地，`@Controller` 和 `@Injectable` 装饰器也是通过 `Reflect.defineMetadata` 实现的。它们为类添加了控制器和服务的元数据，Nest.js 在启动时会根据这些元数据进行依赖注入。

### TypeScript 的优势

在依赖注入的过程中，Nest.js 还利用了 TypeScript 的一个强大功能：编译时自动生成的元数据。通过开启 TypeScript 的 `emitDecoratorMetadata` 选项，编译器会自动为类的构造函数和方法生成参数类型和返回值类型的元数据。

例如，以下代码：

```typescript
import 'reflect-metadata'

class CatService {
  constructor(private readonly name: string) {}
}
```

在编译后，TypeScript 会自动为 `CatService` 的构造函数生成 `design:paramtypes` 元数据，表示构造函数的参数类型是 `String`。Nest.js 可以通过这些元数据，自动推断出依赖的类型，并进行注入。

### @SetMetadata 装饰器

Nest.js 还提供了一个 `@SetMetadata` 装饰器，允许我们为类或方法添加自定义的元数据。然后，我们可以在守卫（Guard）或拦截器（Interceptor）中通过 `Reflector` 读取这些元数据，做出相应的处理。

```typescript
import { SetMetadata } from '@nestjs/common'

@SetMetadata('roles', ['admin'])
@Controller('cats')
export class CatsController {
  // ...
}
```

在守卫中，我们可以通过 `Reflector` 获取 `roles` 元数据，并根据用户的角色进行权限判断：

```typescript
const roles = this.reflector.get<string[]>('roles', context.getHandler())
```

## 总结

Nest.js 的核心实现原理可以归结为以下几点：

1. **装饰器与元数据**：通过装饰器为类和方法添加元数据，Nest.js 在运行时读取这些元数据，进行依赖注入和对象的创建。
2. **TypeScript 的支持**：通过开启 `emitDecoratorMetadata` 选项，TypeScript 会自动为类的构造函数和方法生成参数类型和返回值类型的元数据，Nest.js 利用这些元数据实现依赖注入。
3. **Reflect Metadata API**：Nest.js 依赖 `Reflect.defineMetadata` 和 `Reflect.getMetadata` 这些 API 来存储和读取元数据。由于这些 API 还处于草案阶段，Nest.js 需要使用 `reflect-metadata` 包来提供 polyfill。

通过理解这些原理，我们可以更好地掌握 Nest.js 的工作机制，并在实际开发中灵活运用元数据和装饰器，构建强大且可扩展的应用。
