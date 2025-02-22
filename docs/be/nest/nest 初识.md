### NestJS 是什么？

NestJS 是一个用来开发高效、可扩展 Node.js 服务端应用的框架。它有点像 Node.js 世界的“超级英雄”，既能让你用上 TypeScript 的现代特性，又保留了纯 JavaScript 的灵活性。它的设计融合了面向对象编程（OOP）、函数式编程（FP）和函数式响应式编程（FRP）

NestJS 默认基于 Express 这个老牌 HTTP 框架，但你也可以切换到性能更高的 Fastify。它在这些底层框架上加了一层抽象，提供了一套开箱即用的架构，同时还不限制你直接调用底层的 API。这意味着你既能享受 NestJS 带来的便利，又能用上 Express 或 Fastify 生态里丰富的第三方模块。

它的设计灵感很大程度上来自 Angular，所以如果你用过 Angular，会觉得 NestJS 的模块化结构和依赖注入特别亲切。简单来说，NestJS 的目标是帮你把代码写得更清晰、更容易测试和维护，尤其适合中大型项目。



### 为什么选择 NestJS？

过去几年，Node.js 让 JavaScript 成了前后端通吃的语言。前端有 React、Vue、Angular 这些利器，开发效率和用户体验都杠杠的。但到了服务端，Node.js 虽然有不少好用的库，却缺少一个能解决架构问题的“灵魂框架”。这时候，NestJS 就站出来了。

它提供了一套完整的应用架构，让你不用从头设计项目结构，也不用纠结代码怎么组织。无论是个人开发者还是团队协作，NestJS 都能让你的应用更松耦合、更易扩展。举个例子，你可以用它快速搭一个 CRUD（增删改查）应用，然后再逐步加功能，完全不用担心后期维护会变成噩梦。



### 怎么开始用 NestJS？

说了这么多，咱们动手试试吧！安装和启动一个 NestJS 项目其实很简单，主要有两种方式：用官方的 Nest CLI，或者直接克隆一个初始项目。我推荐新手用 CLI，因为它会自动生成标准化的项目结构，省心省力。

#### 用 Nest CLI 快速搭建

首先，确保你电脑上装了 Node.js（版本 >= 20），然后打开终端，敲这几行命令：

```bash
$ npm i -g @nestjs/cli
$ nest new my-first-nest
```

运行完后，CLI 会问你用哪个包管理器（npm、yarn 还是 pnpm），选一个你习惯的就好。它会自动创建一个名叫 my-first-nest 的文件夹，里面装好了核心文件和依赖。目录长这样：

```text
src
├── app.controller.ts     // 一个简单的控制器，带单个路由
├── app.controller.spec.ts // 控制器的测试文件
├── app.module.ts         // 应用的根模块
├── app.service.ts        // 一个基础服务
└── main.ts               // 启动入口
```

如果你喜欢严格的 TypeScript 模式，可以加个 --strict 参数：

```bash
$ nest new my-first-nest --strict
```

看看入口 src/main.ts，你会看到这样的代码：

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

NestFactory.create 创建了一个应用实例，然后通过 listen 启动了一个 HTTP 服务，默认监听 3000 端口。运行项目很简单，进入项目目录，敲：

```bash
$ npm run start
```

然后打开浏览器，访问 http://localhost:3000，你会看到 Hello World!——恭喜，你的第一个 NestJS 服务跑起来了！

但是开发时老是手动重启服务多麻烦啊，用这个命令启用热重载：

```bash
$ npm run start:dev
```

以后改了代码，服务会自动重启，效率直接起飞。



### 核心文件是干嘛的？

刚生成的 src 目录里几个文件，咱们稍微聊聊它们的作用：

- **app.controller.ts**：控制器，负责处理 HTTP 请求。比如你访问 / 路由，它会返回一个响应。
- **app.service.ts**：服务层，放业务逻辑的地方，控制器通常会调用它。
- **app.module.ts**：根模块，NestJS 用模块来组织代码，这里是整个应用的起点。
- **main.ts**：启动文件，刚才已经看过了。

这些文件是 NestJS 的基本骨架，后面你可以用它们搭建更复杂的功能，比如数据库操作、用户认证啥的。



### 灵活的平台支持

NestJS 默认用 Express，但如果你追求性能，可以切换到 Fastify。怎么切呢？在 main.ts 里稍微改下：

```ts
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter())
  await app.listen(3000)
}
bootstrap()
```

当然，切换前得装 Fastify 的适配器：

```bash
$ npm install @nestjs/platform-fastify
```

Express 社区资源多，Fastify 速度快，怎么选看你需求。



### 下一步做什么？

一个简单的服务跑起来了，接下来你可以试着加点功能。比如建一个 CRUD 接口，操作用户数据：

```ts
// src/users/users.controller.ts
import { Controller, Get } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }
}

// src/users/users.service.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  findAll() {
    return [{ id: 1, name: '张三' }]
  }
}
```

然后在 app.module.ts 里注册它们，访问 http://localhost:3000/users 就能看到数据了。

#### 小贴士

- **代码检查**：项目自带 ESLint 和 Prettier，用 npm run lint 检查代码，npm run format 格式化。
- **加速构建**：试试 npm run start -- -b swc，用 SWC 编译器能快不少。
- **纯 JavaScript**：不喜欢 TypeScript？可以用 CLI 搭个 JS 项目，或者直接克隆 javascript-starter.git。



### 总结

NestJS 最大的魅力在于它把 Node.js 服务端开发的“野路子”变成了有章可循的体系。不管你是新手还是老鸟，它都能帮你快速搭建一个干净、可扩展的应用。