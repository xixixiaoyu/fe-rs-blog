Nest.js 是一个构建高效、可伸缩的企业级服务器端应用程序的渐进式 Node.js 框架。 <br />它支持 TypeScript 和 JavaScript（ES6、ES7、ES8），并结合了面向对象编程（OOP）、函数式编程（FP）和函数式响应编程（FRP）的理念。<br />Nest.js 在设计上从 Angular 和 Java 的 Spring 框架中汲取灵感，引入了依赖注入和面向切面编程等概念。因此，它也被称为 Node.js 版的 Spring 框架。<br />Nest 框架的底层 HTTP 平台默认基于 Express 实现，但旨在成为一个与平台无关的框架。<br />通过创建适配器，Nest 可以使用任何 Node HTTP 框架。目前，它支持开箱即用的两个 HTTP 平台：Express 和 Fastify。<br />由于 Nest.js 在行业内具有很高的关注度，因此学习 Nest.js 对于开发者来说是非常有价值的。

## 学习基础

学习 Nest.js 前，建议掌握以下核心知识：

1. JavaScript/TypeScript：掌握基本语法、数据类型、函数、类和类型系统。
2. Node.js：熟悉事件循环、异步编程、模块系统及常用库（如 File System、HTTP）。
3. Express.js：了解中间件、路由和请求处理机制，因为 Nest.js 默认基于 Express.js。
4. REST API 和 HTTP：理解 RESTful 架构和 HTTP 协议基础，包括请求方法、状态码和报文结构。
5. 软件设计原则：掌握面向对象编程（封装、继承、多态）和 SOLID 原则，对构建 Nest.js 应用至关重要。
6. 数据库：了解 SQL 和 NoSQL 数据库基础，以及在 Node.js 中进行数据操作的方法。

这些基础将帮助你更快地掌握 Nest.js，并构建高质量的应用程序。

## 环境搭建和运行

1.  安装 Node.js：确保 Node.js 版本至少为 10.13.0，可以从 Node.js 官网下载并安装合适的版本。
2.  **安装 Nest CLI**：

```bash
npm i -g @nestjs/cli
```

3.  创建项目：使用 Nest CLI 创建一个新的 NestJS 项目。替换 project-name 为你想要的项目名称：

```bash
nest new project-name
```

执行这个命令后，选择包管理器（npm、yarn 或 pnpm）即可

4.  **进入项目目录**：创建项目后，进入新创建的项目目录。

```bash
cd project-name
```

5.  **运行项目**：（应用将在文件更改时自动重启）

```bash
npm run start:dev
```

Nest.js 应用应该会在默认的 `3000` 端口上启动。<br />可以通过访问 `http://localhost:3000` 在浏览器中查看它。<br />如果需要修改端口或者其他配置，在`src/main.ts` 文件中修改。

## Nest 项目目录结构

初始化项目后的目录文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706361899596-01445c6c-4051-4f48-8548-9703fa411db8.png#averageHue=%233e4144&clientId=u27f5a8eb-97b1-4&from=paste&height=490&id=ue3c8c03c&originHeight=882&originWidth=392&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=80832&status=done&style=none&taskId=ueee64746-fa5e-4436-9c7b-731312a7d68&title=&width=217.77778354691887)

1. node_modules/：这个目录包含了项目的所有依赖库，这些是通过 npm 或 yarn 等包管理工具安装的。
2. src/：这是包含项目源代码的目录。在 NestJS 中，它通常包含控制器、服务、模块等。
   - app.controller.spec.ts：这是控制器的单元测试文件，用于测试 app.controller.ts 的功能。
   - app.controller.ts：这是一个控制器文件，负责处理传入的请求并返回响应。
   - app.module.ts：这是应用程序的根模块文件，它组织和提供了应用程序的不同部分。
   - app.service.ts：这是服务文件，通常包含业务逻辑。
   - main.ts：这是应用程序的入口文件，用于启动应用程序。
3. test/：这个目录包含端到端（e2e）测试文件。
   - app.e2e-spec.ts：端到端测试文件，用于模拟真实的请求流程，测试整个应用程序。
   - jest-e2e.json：端到端测试的 Jest 配置文件。
4. .eslintrc.js：ESLint 的配置文件，用于代码质量和风格检查。
5. .gitignore：Git 配置文件，用于指定不需要添加到版本控制中的文件或目录。
6. .prettierrc：Prettier 的配置文件，用于代码格式化。
7. nest-cli.json：Nest 命令行工具的配置文件，用于自定义 NestJS 项目。
8. package-lock.json：记录当前状态下实际安装的依赖库的精确版本，确保其他开发人员或部署环境安装相同版本的依赖。
9. package.json：记录项目的元数据和依赖关系的文件，可以通过它安装、更新和移除依赖库，还包含了脚本和项目配置。
10. README.md：Markdown 文件，通常包含项目说明、安装步骤和其他重要信息。
11. tsconfig.build.json：TypeScript 编译器的配置文件，用于生产环境的构建。
12. tsconfig.json：TypeScript 编译器的配置文件，用于开发环境。

## Nest 最佳目录架构

```
src/
|-- app.controller.ts       // 应用程序的控制器
|-- app.module.ts           // 应用程序的根模块
|-- app.service.ts          // 应用程序的服务
|-- main.ts                 // 应用程序的入口文件
|-- modules/                // 功能模块目录
    |-- users/
        |-- users.module.ts // 用户模块
        |-- users.service.ts // 用户服务
        |-- users.controller.ts // 用户控制器
        |-- dto/            // 数据传输对象
            |-- create-user.dto.ts
            |-- update-user.dto.ts
        |-- entities/       // 实体（数据库模型）
            |-- user.entity.ts
|-- common/                 // 公共模块目录
    |-- filters/            // 异常过滤器
    |-- pipes/              // 管道
    |-- guards/             // 守卫
    |-- decorators/         // 自定义装饰器
    |-- interfaces/         // 接口定义
    |-- constants/          // 常量定义
|-- config/                 // 配置文件目录
    |-- configuration.ts    // 配置服务
|-- assets/                 // 静态资源目录
|-- test/                   // 测试目录
    |-- app.e2e-spec.ts     // 端到端测试
    |-- jest.config.js      // Jest 配置文件
```

按照功能模块化划分的，职责清晰，分工明确。<br />在 `common` 目录中，可以放置应用程序中多次使用的代码，如异常过滤器、管道、守卫等。<br />而 config 目录通常用于存放配置相关的代码。
