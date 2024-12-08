在 NestJS 中，依赖注入（Dependency Injection, DI）是一个非常核心的概念，它通过 IoC（控制反转）容器来管理对象的创建和依赖关系。NestJS 会从入口模块开始扫描，分析模块之间的引用关系和对象之间的依赖关系，自动将 provider 注入到目标对象中。今天我们就来聊聊 NestJS 中的 provider 以及它的几种实现方式。

### 什么是 Provider？

在 NestJS 中，`provider` 是一个可以被注入到其他类中的对象。通常情况下，`provider` 是通过 `@Injectable()` 装饰器声明的类。比如我们创建一个新的 Nest 项目：

```bash
nest new custom-provider
```

在项目中，`AppService` 是一个被 `@Injectable()` 装饰的类：

```typescript
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
```

在 `AppModule` 中，我们通过 `providers` 数组来声明这个 `AppService`：

```typescript
@Module({
  providers: [AppService],
})
export class AppModule {}
```

这就是最常见的 provider 声明方式。其实，这是一种简写形式，完整的写法是这样的：

```typescript
{
  provide: AppService,
  useClass: AppService,
}
```

通过 `provide` 指定 token，通过 `useClass` 指定类，NestJS 会自动实例化这个类并注入到需要的地方。

### 构造器注入与属性注入

在 `AppController` 中，我们可以通过构造器注入的方式来使用 `AppService`：

```typescript
constructor(private readonly appService: AppService) {}
```

NestJS 会自动识别 `AppService` 并将其实例注入到 `AppController` 中。如果不想使用构造器注入，也可以使用属性注入：

```typescript
@Inject(AppService)
private readonly appService: AppService;
```

通过 `@Inject()` 装饰器，我们可以手动指定要注入的 provider。

### 使用字符串作为 Token

有时候，我们可能不想直接使用类作为 token，而是使用字符串。比如：

```typescript
{
  provide: 'app_service',
  useClass: AppService,
}
```

在这种情况下，我们需要在注入时手动指定 token：

```typescript
@Inject('app_service')
private readonly appService: AppService;
```

### 使用 `useValue` 指定静态值

除了使用类作为 provider，我们还可以直接指定一个静态值：

```typescript
{
  provide: 'person',
  useValue: {
    name: 'aaa',
    age: 20,
  },
}
```

然后在需要的地方注入这个值：

```typescript
@Inject('person')
private readonly person: { name: string; age: number };
```

### 使用 `useFactory` 动态生成对象

有时候，我们需要动态生成 provider 的值，这时可以使用 `useFactory`：

```typescript
{
  provide: 'person2',
  useFactory() {
    return {
      name: 'bbb',
      desc: 'cccc',
    };
  },
}
```

`useFactory` 允许我们通过函数动态创建对象，并且可以通过 `inject` 注入其他 provider：

```typescript
{
  provide: 'person3',
  useFactory(person: { name: string }, appService: AppService) {
    return {
      name: person.name,
      desc: appService.getHello(),
    };
  },
  inject: ['person', AppService],
}
```

在这个例子中，`useFactory` 方法会接收 `person` 和 `appService` 作为参数，并返回一个新的对象。

### 异步的 `useFactory`

`useFactory` 还支持异步操作，比如我们可以等待某个异步任务完成后再返回对象：

```typescript
{
  provide: 'person5',
  async useFactory() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      name: 'bbb',
      desc: 'cccc',
    };
  },
}
```

NestJS 会等待异步操作完成后再将结果注入到目标对象中。

### 使用 `useExisting` 创建别名

有时候，我们可能需要为某个 provider 创建一个别名，这时可以使用 `useExisting`：

```typescript
{
  provide: 'person4',
  useExisting: 'person2',
}
```

这样，`person4` 就是 `person2` 的别名，我们可以通过 `person4` 来注入 `person2` 的值。

### 总结

在 NestJS 中，provider 是依赖注入的核心。我们可以通过多种方式来定义 provider：

- **useClass**：最常见的方式，NestJS 会自动实例化类并注入。
- **useValue**：直接指定一个静态值。
- **useFactory**：通过工厂函数动态生成对象，支持注入其他 provider。
- **useExisting**：为现有的 provider 创建别名。

灵活运用这些 provider 类型，可以让我们在开发中更加高效地管理依赖关系，充分利用 NestJS 的 IoC 容器。
