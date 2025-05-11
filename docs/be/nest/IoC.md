后端系统里，通常都会有一些各司其职的组件：

+ **Controller**：负责接收 HTTP 请求，转给 Service 干活，最后把结果反馈给客户端
+ **Service**：核心业务逻辑的实现者。
+ **Repository**：负责数据库的增删改查。
+ **DataSource**：数据库连接池，提供连接
+ **Config**：配置信息，比如数据库的用户名密码

它们之间的关系相互依赖：

Controller 要使唤 Service，Service 又得依赖 Repository 去操作数据，Repository 需要 DataSource 提供数据库连接，而 DataSource 又得从 Config 那里拿到连接数据库的秘钥（用户名、密码等）。

所以 Controller 正常工作的前提是这后面一群马仔要就位：

```javascript
// 举个栗子，实际代码可能更复杂
const config = new Config({ username: 'xxx', password: 'xxx' }); // 先有配置
const dataSource = new DataSource(config); // 用配置创建数据源
const repository = new Repository(dataSource); // 用数据源创建仓库
const service = new Service(repository); // 用仓库创建服务
const controller = new Controller(service); // 最后，把服务交给控制器
```

就跟搭积木一样，而且像 `config`、`dataSource`这些，通常我们不希望每次用都 `new` 一个新的，最好是整个应用启动后就一个实例，大家共用，也就是所谓的“单例”。

如果每次都需要手动创建和清理这一堆东西，想想就头疼，这时 **IoC **登场了。



## IoC (控制反转)
以前我们可能需要主动去创建对象 A、对象 B、如果有依赖关系，又需要手动处理关系。

有了 IoC，相当于创建和管理对象全交给它了。**控制权从你手里反转到了 IoC 容器手里**，这就是“控制反转”的精髓。

我们看个示例，想象一下，你要造一辆车 (Car)，车子得有引擎 (Engine) 吧？在以前比较“传统”的造车方式里，可能是 `Car` 类自己负责去创建 `Engine` 类的实例：

```javascript
// 传统的“自己动手”模式
class Engine {
  start() {
    console.log("引擎启动啦！");
  }
}

class Car {
  constructor() {
    this.engine = new Engine(); // Car 类自己创建了 Engine 的实例
    console.log("车子造好了，用的是我自己造的引擎！");
  }

  run() {
    this.engine.start();
    console.log("车子跑起来啦！");
  }
}

const myCar = new Car();
myCar.run();
```

这种写法，如果哪天我想给 `Car` 换个“涡轮增压引擎”或者“电动引擎”，就得去修改 `Car` 类内部创建 `Engine` 的那部分代码。

如果依赖关系再复杂点，比如 `Engine` 又依赖其他零件，那修改起来就更麻烦了，代码的耦合度太高。

那 IoC 该如何优化呢？最常见的实现方式是**“依赖注入” (Dependency Injection，简称 DI)**。

我们把上面的例子改造一下，用依赖注入的方式：

```javascript
// 使用“依赖注入”的模式
class Engine {
  start() {
    console.log("引擎启动啦！");
  }
}

class TurboEngine extends Engine { // 来个涡轮增压引擎
  start() {
    console.log("涡轮增压引擎，启动！动力澎湃！");
  }
}

class Car {
  constructor(engine) { // 注意这里！Engine 是通过构造函数“注入”进来的
    this.engine = engine;
    console.log("车子造好了，用的是外面给我的引擎！");
  }

  run() {
    this.engine.start();
    console.log("车子跑起来啦！");
  }
}

// 外部“容器”或代码负责创建和注入依赖
const myNormalEngine = new Engine();
const myCarWithNormalEngine = new Car(myNormalEngine);
myCarWithNormalEngine.run();

console.log("\n--- 想换个引擎试试？没问题！ ---");
const myTurboEngine = new TurboEngine();
const myCarWithTurboEngine = new Car(myTurboEngine); // 轻松换上涡轮引擎
myCarWithTurboEngine.run();
```

改造后的 Car 类，它不再关心 `Engine` 是怎么来的，直接有外部传递即可。这就是依赖注入的魔力。

实际上真正的 IoC 我们都不需要手动 new 后传递，构造函数声明需要 engine 参数后，IoC 容器在初始化的时候，会扫描到这个声明，自动创建 engine 实例并将它传递给 Car 构造函数。



## NestJS 是运转 IoC 和 DI 的？
Java Spring 框架就是 IoC 的一个优秀实现者，Nest 则也是大力借鉴了这方面。

### 标记类
![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746893140571-554fdd2b-85ef-42db-8886-5c8dade63f42.png)

`@Injectable()`: 如果一个类（比如我们的 `AppService`）需要被注入到其他地方，或者它本身也需要注入别的依赖，就用这个装饰器标记它。Nest 会把它识别出来，并放到 IoC 容器里管理：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746893297843-b96aa77d-a8d6-4380-9a3d-cb8713e1cf53.png)

`@Controller()`: 专门用来标记控制器类（比如 `AppController`）。控制器主要是接收请求并返回响应，它通常是被注入依赖（比如 Service）：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746931400077-78c37854-9607-48b5-9419-070ba2dc82fc.png)

private readonly appService: AppService 是一种简写，完整写法是：

```typescript
private readonly appService: AppService;

constructor(appService: AppService) {
  this.appService = appService;
}
```

`AppController` 在构造函数里声明了它需要一个 `AppService` 类型的参数。Nest 的 IoC 容器会自动找到已经创建好的 `AppService` 实例注入。

### 模块 (Module) 来组织
Nest 模块通过 @Module() 装饰器来定义。

模块就像一个打包盒，把相关的 Controller、Service 等等组织在一起：

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [], // 如果需要引入其他模块导出的服务，放这里
  controllers: [AppController], // 这个模块有哪些控制器
  providers: [AppService], // 这个模块有哪些可注入的服务
  exports: [] // 如果希望这个模块的服务被其他模块使用，放这里
})
export class AppModule {}
```

在这个模块定义中：

+ `controllers`: 列出这个模块管理的所有 Controller
+ `providers`: 列出这个模块提供的所有可注入的服务 (Service、Repository 等)。这些服务会被 Nest 自动实例化并管理，并且可以在本模块内或其他导入了此模块的模块中被注入。

### 启动应用
当你的 Nest 应用启动时 (通常在 `main.ts` 文件里)：

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // 从根模块开始
  await app.listen(3000);
}
bootstrap();
```

Nest 会从根模块 (`AppModule`) 开始，分析所有通过装饰器声明的依赖关系，自动创建和组装对象。我们只需要在 Controller 里声明依赖，然后就可以直接调用 Service 的方法了，完全不用操心对象的创建和生命周期管理。

### 模块间的合作：`imports` 和 `exports`
如果你的应用比较大，可能会拆分成很多业务模块，比如一个用户模块 (`UserModule`)，一个订单模块 (`OrderModule`)。如果 `OrderService` 需要用到 `UserService` 怎么办？  
这时候，就需要模块的 `imports` 和 `exports`。

1. 在 `UserModule` 中，你需要把 `UserService` 通过 `exports` 数组“暴露”出去：

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  exports: [UserService], // 把 UserService 导出
})
export class UserModule {}
```

2. 然后在 `OrderModule` 中，通过 `imports` 数组引入 `UserModule`：

```typescript
// order.module.ts
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from '../user/user.module'; // 引入 UserModule

@Module({
  imports: [UserModule], // 导入 UserModule 后，就可以用它导出的 UserService 了
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
```

这样，在 `OrderService` 里就可以愉快地注入和使用 `UserService` 了：

```typescript
// order.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service'; // 路径可能不同

@Injectable()
export class OrderService {
  constructor(
    @Inject(UserService) private readonly userService: UserService
  ) {}

  createOrder(userId: number) {
    const userName = this.userService.getUserNameById(userId);
    return `Order created for user: ${userName}`;
  }
}
```



## 总结
后端系统里对象多、关系复杂是常态。如果纯手动管理这些对象的创建和依赖，那简直是一场噩梦。

IoC (控制反转) 和 DI (依赖注入) 就是为了解决这个问题：

+ **IoC** 改变了控制流：你不再主动创建和组装，而是声明需求，由一个“容器”来帮你搞定。
+ **DI** 是实现手段：容器把你声明的依赖“注入”到需要它的对象里。

NestJS 通过 `@Injectable()`、`@Controller()` 等装饰器让你方便地声明哪些类是可注入的、它们的依赖是什么，再通过 `@Module()` 来组织这些类。应用启动时，NestJS 会自动扫描、创建实例、并注入依赖。模块间的 `imports` 和 `exports` 机制，则让不同业务模块间的服务共享变得清晰可控。

虽然初看可能会感觉有点麻烦，但上手后，你会发现代码变得更清晰更容易维护了。

