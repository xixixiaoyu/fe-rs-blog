Nest.js 是一个高度模块化的框架，它鼓励使用模块（Module）来组织代码，以实现不同功能区块的隔离。<br />模块封装最佳建议：

- **单一职责原则**：每个模块应该只关注一个功能和任务。
- **封装**：模块内部的实现应该对外界隐藏，只通过 exports 露出必要的部分给外界使用。
- **配置与环境隔离**：使用配置模块或服务来处理不同环境（开发、测试、生产）的配置。这有助于将配置管理从业务逻辑中解耦。

## 模块相互配合
导出 PersonService 以便其他模块使用：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686379242835-e4d3c3e7-a43f-4fc3-9586-c20f123033c7.png#averageHue=%23302d2a&clientId=u1894eea0-95ac-4&from=paste&height=271&id=BeK8Y&originHeight=542&originWidth=1204&originalType=binary&ratio=2&rotation=0&showTitle=false&size=97513&status=done&style=none&taskId=u040c026f-b359-4d5a-808f-c2ecdb59e34&title=&width=602)<br />导入 PersonModule 以使用它的 PersonService：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686379195086-f5a410a3-acdd-4242-95f9-fa2cba51e9a6.png#averageHue=%23302d2a&clientId=u1894eea0-95ac-4&from=paste&height=276&id=uff6fd8d7&originHeight=592&originWidth=1180&originalType=binary&ratio=2&rotation=0&showTitle=false&size=111734&status=done&style=none&taskId=udda0b1d6-bbfe-4d26-905c-33acbefe03a&title=&width=551)<br />在 AppController 就可以使用导入的PersonMoudle 的  PersonService，以及自身 providers 数组的 AppService：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706860742694-da459c06-0f02-4c2f-9f73-fa2e43b0843e.png#averageHue=%23332f2b&clientId=u27d5342e-2c97-4&from=paste&height=456&id=u5dd1baa7&originHeight=698&originWidth=757&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=125254&status=done&style=none&taskId=ufb362053-1dac-4a31-93b4-99e610ba86c&title=&width=494.60003662109375)

## 模块重导出
有时候我们希望在导出一个模块的同时，也重新导出它所导入的模块。这样可以让这个模块的消费者直接使用它依赖的模块的功能，而无需显式地导入它们。<br />在 Nest.js 中，可以使用 `exports` 数组来重导出模块：
```typescript
// email.module.ts
@Module({
  imports: [CommonModule],
  providers: [EmailService],
  exports: [EmailService, CommonModule] // 重导出 CommonModule
})
export class EmailModule {}
```
在上面的代码中，`EmailModule` 不仅导出了它自己的 `EmailService`，也重导出了它导入的 `CommonModule`。<br />这意味着导入 `EmailModule` 的模块也会自动导入 `CommonModule`，并可以使用其提供的服务。<br />这种重导出机制在组织大型应用程序时非常有用，因为它可以减少模块间的耦合，同时简化外部模块的导入过程。

## 全局模块
**全局模块**：`AuthModule` 被设置为全局模块，它的 `AuthService` 可以在应用中的任何地方使用，而无需显式导入 `AuthModule`。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706861294641-751b3487-5c2d-4200-b68e-5a1cd63c4cc1.png#averageHue=%23302e2c&clientId=u9a6c9c27-ab2b-4&from=paste&height=221&id=u9cf9e7c0&originHeight=276&originWidth=739&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=44631&status=done&style=none&taskId=uaeb3e9bf-06c2-4498-b6cb-8662ead6640&title=&width=591.2)<br />使用 `@Global` 声明成全局模块并 export 想导出的 Service。
```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  // ...其他配置
})
export class AppModule {}
```
一旦 `AuthModule` 被导入到根模块，它内部导出的模块就可以直接在其他模块使用，其他不用 imports 其 Module 便可使用其 service。<br />全局模块通常用于那些提供跨应用程序共享的基础服务的功能，例如配置服务、数据库服务或任何其他需要在多个模块之间共享的服务。<br />注意：避免过度使用全局模块，代码可读性更好。

## 动态模块
动态模块允许在模块被导入时动态配置提供者（providers）、控制器（controllers）和导出（exports）。<br />这种方式非常适合需要根据不同环境或配置动态更改其行为的模块。<br />新建 Nest 项目：
```bash
nest new dynamic-module -p npm
```
创建 CRUD 模块：
```bash
nest g resource dynamicModule
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707725536164-e7022b2c-7e0e-41e5-bcfc-bafc9c9d499e.png#averageHue=%23454545&clientId=u8573c41d-9cb3-4&from=paste&height=42&id=u8c59e601&originHeight=84&originWidth=1002&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22291&status=done&style=none&taskId=u4e5dae47-e64e-403c-a364-03aa3beae6f&title=&width=501)<br />此时导入的 DynamicModuleModule 内容都是固定：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707725577914-3c8f00c0-0436-43d4-9b8c-8f6a8aaf1e7f.png#averageHue=%23312e2a&clientId=u8573c41d-9cb3-4&from=paste&height=151&id=u64e540cc&originHeight=302&originWidth=678&originalType=binary&ratio=2&rotation=0&showTitle=false&size=46641&status=done&style=none&taskId=ub24279cc-5eb4-40ac-a865-88998651e9c&title=&width=339)<br />我们需要导入的时候给其传入一些参数怎么办？<br />这样写：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707726565065-e102a581-6186-4deb-b7e0-de92b8ac654c.png#averageHue=%232e2c2a&clientId=u8573c41d-9cb3-4&from=paste&height=439&id=uafeebf0f&originHeight=878&originWidth=1320&originalType=binary&ratio=2&rotation=0&showTitle=false&size=113449&status=done&style=none&taskId=ua790c6d5-3263-4a2a-a78a-058aad31bfe&title=&width=660)<br />多了一个 `module` 属性指向当前的模块类，即 `DynamicModuleModule`。<br />我们给 DynamicModuleModule 加一个 register 的静态方法，返回模块定义的对象，外部传入的 options 参数对象会作为一个新的 provider。

导入时配置：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707726815119-cab5eb5e-50c9-4dc3-abbe-b5ace1cde0b6.png#averageHue=%23312e2a&clientId=u8573c41d-9cb3-4&from=paste&height=289&id=ubd0d7224&originHeight=578&originWidth=724&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61696&status=done&style=none&taskId=u2aec81b6-569c-47db-88a6-09d91140ac2&title=&width=362)<br />使用 @Inject 注入依赖：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707726869224-9759d903-0576-485c-9409-ef71e4068fb5.png#averageHue=%232f2d2b&clientId=u8573c41d-9cb3-4&from=paste&height=357&id=u793f9b3f&originHeight=714&originWidth=1648&originalType=binary&ratio=2&rotation=0&showTitle=false&size=115558&status=done&style=none&taskId=ubaf1cb19-578c-4860-9152-661a75c9162&title=&width=824)<br />访问 localhost:3000，控制台打印：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707726936820-dcd649e0-2910-47d3-b7e6-70e584539dd0.png#averageHue=%233e3e3e&clientId=u8573c41d-9cb3-4&from=paste&height=16&id=u10fd2fcf&originHeight=32&originWidth=578&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7402&status=done&style=none&taskId=u44492fa2-267c-48bc-b613-d40177a933b&title=&width=289)<br />这就是动态模块。

上面静态方法 register 方法可以任意取名，但 nest 约定了一些方法名：

- `register`：用一次模块传一次配置
- `forRoot`：根模块（`AppModule`）配置一次，例如数据库连接、核心服务等。
- `forRootAsync`：类似于 forRoot，但用于异步配置，允许从异步服务中获取配置信息。它通常接收一个 useFactory 这个返回配置对象的工厂函数。
- `forFeature`：用 forRoot 固定整体模块，用于局部的时候，可能需要再传一些配置。比如用 forRoot 指定了数据库链接信息，再用 forFeature 指定某个模块访问哪个数据库和表。
- `forFeatureAsync`: 类似于 forFeature，但用于异步配置特定功能。

## 异步动态模块
如果需要异步地提供配置，可以使用 `forRootAsync` 方法。<br />这个方法通常与工厂函数或类一起使用，以便异步地解析配置数据，然后再创建模块：
```typescript
@Module({})
export class DynamicModule {
  static forRootAsync(options: DynamicModuleAsyncOptions): DynamicModule {
    return {
      module: DynamicModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        DynamicService,
      ],
      exports: [DynamicService],
    };
  }
}
```
在这个异步版本中，`useFactory` 是一个工厂函数，它可以异步地返回配置对象。<br />`inject` 属性是一个数组，它定义了工厂函数的依赖项，这些依赖项将被注入到工厂函数中。
