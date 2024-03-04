## 控制反转（IoC）和 依赖注入（DI）
控制反转（IoC）是一种设计原则，用于将组件的创建和管理的控制权从组件自身转移到外部容器或框架。在没有 IoC 的传统编程模式中，组件通常自己创建和管理它们的依赖关系，这可能导致代码紧密耦合和难以测试。<br />在 Nest.js 中，IoC 容器负责创建对象、在程序初始化扫描 class 上的依赖关系，将这些 class 及依赖的 class 都 new 一个实例放进容器内进行管理。<br />这样，组件（如控制器、服务等）就不需要知道如何创建它们所依赖的对象，也不需要知道这些依赖对象的具体实现。这促进了代码的解耦和灵活性。<br />从主动创建依赖到被动等待依赖注入，这就是 Inverse Of Control，反转控制。<br />常见的控制反转实现方式有：

- 依赖注入（Dependency Injection，DI）：被动接收依赖对象，由容器将被依赖的对象注入到对象内部。
- 依赖查询（Dependency Lookup）：主动查询依赖对象，由对象自身通过服务定位器查询被依赖对象。依赖查询也常以服务定位器模式（Service Locator）的形式出现。

在 class 上声明依赖的方式，大家都选择了装饰器的方式（在 java 里这种语法叫做注解）。

### 依赖注入（DI）的实现
依赖注入 (DI) 是面向对象编程中最常见的控制反转实现方式，它可以极大程度地降低代码的耦合度。<br />下面是一个简单的传统开发示例：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1698475468492-7c079e7b-0988-4fe8-8f82-2499f13fa39b.png#averageHue=%232e2c2b&clientId=u449ec3a3-5eb9-4&from=paste&height=379&id=ubf04ba39&originHeight=758&originWidth=924&originalType=binary&ratio=2&rotation=0&showTitle=false&size=72573&status=done&style=none&taskId=u7ee11b3f-a11b-4937-bd85-b2dbf19b693&title=&width=462)<br />在上述示例中，play 方法与 FlyGame 类强耦合，如果以后要换成其他游戏，需要进行较大的改动。<br />下面是使用控制反转的示例：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1698475511469-cc2dd16f-1408-4050-aacb-e4b56511268b.png#averageHue=%232d2c2b&clientId=u449ec3a3-5eb9-4&from=paste&height=527&id=u7becf8fe&originHeight=1054&originWidth=1028&originalType=binary&ratio=2&rotation=0&showTitle=false&size=105513&status=done&style=none&taskId=u3cbc27e9-65fe-4d15-8589-dd7fa2c53ad&title=&width=514)<br />在上述示例中，Student 类通过构造函数接收一个游戏对象 game，通过传递的游戏对象来调用游戏的 playing 方法，实现了解耦。这样，如果要更换游戏，只需要传递不同的游戏对象即可。<br />下面是一个比较复杂的传统开发示例：
```typescript
// 制作一台电脑，需要CPU与屏幕
class Cpu {}
class Screen {}

// 电脑类：内部包含Cpu类与Screen类
class Computer {
  cpu: Cpu;
  screen: Screen;
  constructor() {
    this.cpu = new Cpu();
    this.screen = new Screen();
  }
  show() {
    console.log(this.cpu);
    console.log(this.screen);
  }
}

const c = new Computer();
c.show();
```
在上述示例中，Computer 类依赖于 Cpu 和 Screen 类。<br />如果现在要将 Cpu 类型更换为 ArmCpu 类型，需要修改 Computer 的 constructor。<br />使用控制反转进行改造：
```typescript
class Cpu {}
class Screen {}

// 新增容器类，用于构建真正的实例
class Container {
  pool: Map<string, any>;
  constructor() {
    this.pool = new Map();
  }
  register<T>(name: string, constructor: T) {
    this.pool.set(name, constructor);
  }
  get(name: string) {
    const Target = this.pool.get(name);
    if (!Target) {
      return null;
    }
    return new Target();
  }
}

const container = new Container();
container.register('Cpu', Cpu);
container.register('Screen', Screen);

class Computer {
  cpu: Cpu;
  screen: Screen;
  constructor() {
    this.cpu = container.get('Cpu');
    this.screen = container.get('Screen');
  }
  show() {
    console.log(this.cpu);
    console.log(this.screen);
  }
}

const c = new Computer();
c.show();
```
在上述示例中，新增了一个容器类 Container，用于关联要使用的类 Computer 与其他类 Cpu、Screen 之间的关系。<br />获取 Computer 的实例时，不再使用 new 关键字，而是通过容器的 get 方法来获取实例，从而解除了 Computer 与 Cpu、Screen 之间的耦合关系。<br />如果现在需要调整 Computer 的属性类型，只需要调整容器中注册的类型即可。

### Nest.js 中的 DI 实现
在 Nest 中，使用装饰器来实现依赖注入和模块注册。<br />搭配 TypeScript 的类型系统和装饰器来指定一个类的依赖关系，并在创建类的实例时自动注入这些依赖项。

首先，通过 @Injectable 装饰器将服务类注册到 IoC 容器中：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686377837071-ec56b0c0-04d0-44f8-afe6-ad5abe8ef495.png#averageHue=%2334302c&clientId=u1894eea0-95ac-4&from=paste&height=160&id=ufa8fad62&originHeight=320&originWidth=586&originalType=binary&ratio=2&rotation=0&showTitle=false&size=31406&status=done&style=none&taskId=u71f9f838-9a55-40c9-8ea2-c1766a38eab&title=&width=293)<br />然后，在控制器类中使用构造函数注入服务实例：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686377910385-0a2f114d-f18f-4156-97d1-2c243d4cc132.png#averageHue=%23302e2b&clientId=u1894eea0-95ac-4&from=paste&height=239&id=u1e482540&originHeight=478&originWidth=1244&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63879&status=done&style=none&taskId=u3b940bdb-5184-41fa-925a-d96b60e9fc8&title=&width=622)<br />AppController 只是声明了对 AppService 的依赖，就可以调用它的方法了。<br />上面的 AppService 作为一个提供者（provider），需要在模块中进行注册。<br />在模块的 providers 数组中添加 AppService，这样在模块启动时，依赖会被解析，当模块销毁时，提供者也会被销毁。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686378007550-fa9bbf80-16bc-4e07-91ed-e0a726ecc9fe.png#averageHue=%232f2d2b&clientId=u1894eea0-95ac-4&from=paste&height=162&id=u1c30fb76&originHeight=324&originWidth=684&originalType=binary&ratio=2&rotation=0&showTitle=false&size=41177&status=done&style=none&taskId=u52e50651-cbd9-4dea-bcf3-2bdd098f68b&title=&width=342)<br />通过 @Module 声明模块<br />其中 controllers 是控制器，只能被注入。<br />providers 里可以被注入，也可以注入别的对象。

然后在入口模块里跑起来：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686378133091-d22acab3-da18-4b94-8241-3ee6e1e97d18.png#averageHue=%23322f2b&clientId=u1894eea0-95ac-4&from=paste&height=212&id=u1fa8384c&originHeight=424&originWidth=1092&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75789&status=done&style=none&taskId=ud8687170-503a-4005-90d8-dce443f5ddd&title=&width=546)<br />nest 会从 AppModule 开始解析 class 上通过装饰器声明的依赖信息，自动创建和组装对象。<br />nest 在背后自动做了对象创建和依赖注入的工作。

### 没有依赖注入的话
后端系统中，会有很多对象：

- Controller 对象：接收 http 请求，调用 Service，返回响应
- Service 对象：实现业务逻辑
- Repository 对象：实现对数据库的增删改查

此外，还有数据库链接对象 DataSource，配置对象 Config 等等。

这些对象有着相互依赖的关系：

- Controller 依赖了 Service 实现业务逻辑
- Service 依赖了 Repository 来做增删改查
- Repository 依赖 DataSource 来建立连接
- DataSource 又需要从 Config 对象拿到用户名密码等信息。

如果没有依赖注入，需要手动理清下它们创建顺序，创建其单例：
```typescript
const config = new Config({ username: 'xxx', password: 'xxx'});

const dataSource = new DataSource(config);

const repository = new Repository(dataSource);

const service = new Service(repository);

const controller = new Controller(service);
```
经过一系列的初始化之后才可以使用 Controller 对象。<br />解决这个后端系统都面临的痛点问题的方式就是 IoC。

## MVC
MVC 是一种将应用程序分为三个核心组件的软件设计模式，即模型（Model）、视图（View）和控制器（Controller），旨在分离内部业务逻辑和用户界面，从而使得应用程序的开发、维护和扩展更为高效和有组织。

### 模型（Model）
在 Nest.js 中，模型通常代表与数据相关的部分，它可以是一个简单的类，也可以是利用 ORM（如 TypeORM 或 Sequelize）定义的数据模型。<br />模型负责数据的存储、检索、更新和删除 - 这通常涉及到数据库的交互。
```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
```
在上面的示例中，我们定义了一个用户模型，它通过装饰器定义了如何在数据库中创建表和字段。

### 视图（View）
Nest.js 作为一个后端框架，通常不直接处理视图，而是将数据发送给客户端（如浏览器或移动应用），由客户端框架（如 Angular、React 或 Vue.js）来处理视图相关的工作。<br />不过，Nest.js 也支持模板引擎（如 Handlebars、EJS 或 Pug），从而可以直接从服务器渲染视图。<br />如果使用模板引擎，看起来可能是这样的：
```html
<!DOCTYPE html>
<html>
<head>
  <title>User Profile</title>
</head>
<body>
  <h1>{{ user.name }}</h1>
  <p>Email: {{ user.email }}</p>
</body>
</html>
```
此视图使用 Handlebars 语法显示用户信息。

### 控制器（Controller）
控制器是 MVC 架构中的指挥中心。在 Nest.js 中，控制器负责处理传入的请求，并返回响应给客户端。控制器使用装饰器来定义路由，并将请求路由到对应的处理函数。
```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() user: User): Promise<void> {
    await this.userService.create(user);
  }
}
```
在这个例子中，我们定义了一个 UserController，它有三个方法：获取所有用户、获取一个特定用户和创建一个新用户。这些方法分别与 HTTP 请求的 GET 和 POST 方法对应。<br />模型定义了应用程序的数据结构，视图负责展示数据（尽管在 Nest.js 中通常是由前端框架处理），而控制器则作为模型和视图之间的桥梁，处理业务逻辑和用户输入。<br />访问到一个请求方法后，可能会经过 Controller（控制器）、Service（服务）、Repository（数据库访问） 的逻辑。<br />如果我想在调用 Controller  之前和之后加入一段通用逻辑呢？<br />这时候就需要 AOP 切面的思想：


## AOP
AOP（面向切面编程）是一种编程范式，它允许开发者将横切关注点（cross-cutting concerns）从业务逻辑中分离出来。<br />**好处是可以把一些通用逻辑分离到切面中，保持业务逻辑的纯粹性，这样切面逻辑可以复用，还可以动态的增删。**<br />横切关注点是那些影响多个模块的问题，例如日志记录、事务管理、安全性等。

在 Nest.js 中，AOP 主要是通过以下几种方式：

- **中间件（MiddleWare）**
- **守卫**（Guards）
- **拦截器**（Interceptors）
- **自定义装饰器**（Custom Decorators）
- **管道**（Pipes）

<br />
### Nest 中几种 AOP 方式的执行顺序
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1698478768503-e5ce674a-83a7-427e-8308-4dea161fd062.png#averageHue=%23f4f3f3&clientId=u7873db1b-3235-4&from=paste&height=260&id=u215a40fe&originHeight=520&originWidth=1498&originalType=binary&ratio=2&rotation=0&showTitle=false&size=90112&status=done&style=none&taskId=uf008fe1b-f889-4018-864d-44bb9c72bb7&title=&width=749)<br />请求首先通过中间件，然后可能会被守卫拦截，如果通过了守卫，请求会被拦截器和管道处理，然后执行方法本身。如果方法执行过程中抛出异常，异常过滤器会介入处理。响应时，拦截器会再次执行，用于后处理响应数据。<br />请求是先全局，例如中间件，请求先经过全局中间件，再到模块中间件，响应则是后全局。<br />当有多个拦截器应用于一个路由时，它们的执行顺序将按照它们在代码中的声明顺序依次执行。<br />例如，假设有三个拦截器：拦截器A、拦截器B 和 拦截器C：

- 当请求到达目标处理程序之前，首先会执行拦截器A 的逻辑，然后是拦截器B 的逻辑，最后是拦截器C 的逻辑。
- 类似地，在响应返回之前，拦截器C 的逻辑会先执行，然后是拦截器B 的逻辑，最后是拦截器A 的逻辑。
