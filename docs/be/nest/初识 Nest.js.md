## NestJS 是什么？
Nest 是一个用来构建高效、可扩展的 Node.js 服务器端应用的**框架。**

主要用 TS 编写，当然也可以纯 JS 来写，而且它还融合了面向对象编程 (OOP)、函数式编程 (FP) 和函数式响应编程 (FRP) 的优点。

Nest 底层基于 Express 框架，如果追求极致性能，也可以切换到 Fastify。

Nest 在它们之上加了一层“抽象”，提供了更结构化的开发方式，但同时也允许你直接调用底层框架 (比如 Express) 的功能，非常灵活。

但是 Nest 本身<font style="color:rgb(38, 38, 38);">本身并不和特定的 HTTP 库（像 Express 或 Fastify）紧密耦合，它定义了一个 </font>`<font style="color:rgb(38, 38, 38);">HttpServer</font>`<font style="color:rgb(38, 38, 38);"> 接口，Express 和 Fastify 都有对应的适配器去实现这个接口。你想换底层 HTTP 平台？简单，换个适配器就行，核心业务代码基本不用动。</font>

<font style="color:rgb(38, 38, 38);">nest 官网：</font>[https://nestjs.com/](https://nestjs.com/)

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746688270505-d94f381c-3fc5-43da-81eb-6fcf0a7b62a1.png)

github：[https://github.com/nestjs/nest](https://github.com/nestjs/nest)

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746689937949-dc8920ac-b1f2-4c43-a339-6bd71f4e6f22.png)

这其中令我印象深刻的是 issues 很少，某种程度上也反映了它较好的维护和成熟的设计。



## 为什么用 Nest？它解决了什么痛点？
前端有 Vue、React、Angular 这些好用的框架。

但是 Node.js 后端这边，虽然库和工具很多，但在“**如何组织项目架构**”这个核心问题上，一直没有一个像前端那样公认的、开箱即用的最佳实践。

Nest 就是来填补这个空白的。它提供了一套经过深思熟虑的应用架构（深受 Angular 的启发），能轻松创建出：

+ **高可测试性**：代码结构清晰，方便写单元测试和端到端测试。
+ **可扩展性**：模块化的设计，方便功能的增加和拆分。
+ **松耦合**：模块之间依赖清晰，降低修改代码带来的风险。
+ **易于维护**：代码结构统一，新人接手也更容易看懂。

用 Node 开发后端大概分三个层次：

+ **<font style="color:rgb(38, 38, 38);">初级玩家</font>**<font style="color:rgb(38, 38, 38);">：直接用 </font>`<font style="color:rgb(38, 38, 38);">http</font>`<font style="color:rgb(38, 38, 38);">、</font>`<font style="color:rgb(38, 38, 38);">https://</font>`<font style="color:rgb(38, 38, 38);"> 这些原生模块的 </font>`<font style="color:rgb(38, 38, 38);">createServer</font>`<font style="color:rgb(38, 38, 38);"> API。这种玩法适合搞点小工具的开发服务，简单快捷。</font>
+ **<font style="color:rgb(38, 38, 38);">进阶玩家</font>**<font style="color:rgb(38, 38, 38);">：用上 Express、Koa 这类库来处理请求和响应。它们很灵活，但也因为太灵活，代码想怎么写就怎么写，项目一大，代码就是一坨，而且这类框架只实现基本 web 服务，路由、日志、请求拦截等都需要自己实现。</font>
+ **<font style="color:rgb(38, 38, 38);">专业玩家</font>**<font style="color:rgb(38, 38, 38);">：选择 Nest、Egg.js、MidwayJS 这类企业级框架。这类框架最大的特点就是“有规矩”，它会告诉你代码该怎么组织，很多常用的功能（比如日志、配置、安全）都给你准备好了，开箱即用。</font>

我们来看看 Nest 项目结构：

```plain
src
├── user
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.module.ts
│   └── dto
│       └── create-user.dto.ts
├── product
│   ├── product.controller.ts
│   ├── product.service.ts
│   ├── product.module.ts
│   └── dto
│       └── create-product.dto.ts
└── app.module.ts
```

<font style="color:rgb(38, 38, 38);">模块化非常清晰，每个模块里，Controller 管路由，Service 管业务逻辑，DTO 管数据传输，Guard 管权限，Filter 管异常</font>

<font style="color:rgb(38, 38, 38);">什么代码放哪里，都安排得妥妥的。</font>

<font style="color:rgb(38, 38, 38);">所以正得益于这么优秀的结构，放眼全球，NestJS 的火爆程度和社区活跃度都是顶级的（比 Egg.js 和 MidwayJS 好太多了），在国内也会越来越流行。如果你想学一个靠谱的 Node.js 框架，NestJS 基本上就是那个“唯一的答案”了。</font>

<font style="color:rgb(38, 38, 38);">Nest 架构：</font>

![画板](https://cdn.nlark.com/yuque/0/2025/jpeg/21596389/1746692840336-4bb81140-a30d-4b32-9845-ba368f08790f.jpeg)



## <font style="color:rgb(38, 38, 38);">不只学框架，更是拥抱整个后端生态</font>
<font style="color:rgb(38, 38, 38);">学 NestJS 的过程，你可不只是在学一个框架那么简单。你会接触到一大堆后端常用的“神兵利器”：</font>

+ <font style="color:rgb(38, 38, 38);">数据库：MySQL、PostgreSQL、MongoDB</font>
+ <font style="color:rgb(38, 38, 38);">缓存：Redis</font>
+ <font style="color:rgb(38, 38, 38);">消息队列：RabbitMQ、Kafka</font>
+ <font style="color:rgb(38, 38, 38);">服务发现/配置中心：Nacos</font>
+ <font style="color:rgb(38, 38, 38);">搜索引擎：Elasticsearch</font>

<font style="color:rgb(38, 38, 38);">你会慢慢理解一个典型的后端架构长啥样，比如请求怎么进来，怎么做负载均衡，数据怎么存储和查询，异步任务怎么处理等等。</font>

<font style="color:rgb(38, 38, 38);">这些知识，就算你以后换用 Go 或者 Java，也都是通用的。</font>

<font style="color:rgb(38, 38, 38);">所以，学 NestJS 是个切入点，帮你打开整个后端技术生态的大门。</font>

<font style="color:rgb(38, 38, 38);">Vue/React/Angular + NestJS 这样的全栈技术栈开发起来爽歪歪。</font>

<font style="color:rgb(38, 38, 38);">最后说一嘴，虽然大部分人不会找远程工作，但 Nest 在电鸭社区的出现率也蛮高的，国外的初创公司或者小团队，也特别喜欢用 NestJS 来做服务端。</font>

****

## Nest，启动！
直接用官方提供的命令行工具 (CLI)。

1. 全局安装 Nest CLI 打开你的终端（命令行窗口），输入：

```bash
npm install -g @nestjs/cli
```

2. **创建 Nest 项目**：

```bash
nest new my-awesome-project -p pnpm
```

把 `my-awesome-project` 换成你想要的项目名。CLI 会自动帮你创建好项目文件夹，并安装好所有必需的依赖，还会生成一套标准的项目结构。

这里我使用 pnpm 来管理项目依赖。



## 项目里都有些什么？
进入你刚创建的项目文件夹 (`cd my-awesome-project`)，你会看到一个 `src` 目录，里面有几个核心文件：

+ `main.ts`: 这是你应用的入口文件，就像大门一样。它用 `NestFactory` 来创建 Nest 应用实例，并启动服务器监听端口。
+ `app.module.ts`: 应用的根模块，是组织你应用代码结构的核心。
+ `app.controller.ts`: 一个简单的控制器，处理进来的 Web 请求（比如用户访问某个网址）。
+ `app.service.ts`: 一个简单的服务，通常用来放业务逻辑（比如从数据库查数据）。
+ `app.controller.spec.ts`: 控制器的单元测试文件（先不用太关心这个）。

`main.ts` 里的代码大概长这样：

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 用 AppModule 这个根模块来创建 Nest 应用实例
  const app = await NestFactory.create(AppModule);
  // 让应用监听 3000 端口 (或者环境变量里指定的端口)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap(); // 跑起来！
```

是不是很简单？`NestFactory.create(AppModule)` 就是创建应用实例的关键，然后 `app.listen(3000)` 就让你的应用跑起来，等待浏览器的访问了。

## 跑起来看看！
在你的项目文件夹里，运行：

```bash
pnpm run start
```

这个命令会启动应用，打开浏览器，访问 `http://localhost:3000/`。如果顺利，你应该能看到 `Hello World!` 的字样。

想让开发更爽一点？试试这个命令：

```bash
pnpm run start:dev
```

这个命令会以“开发模式”启动应用。

它会监视你的代码文件，一旦你修改并保存了代码，它会自动重新编译和重启服务。

> **加速小技巧**：想让 `start:dev` 跑得更快？可以试试用 SWC 这个更快的构建工具。运行 `pnpm run start:dev -- -b swc` 试试。
>



## node.js 对比 java
| 特性 | Node.js | Java |
| :--- | :--- | :--- |
| **本质** | JavaScript 的服务器端运行环境 | 面向对象的编程语言和平台 |
| **语言** | JavaScript (动态类型) | Java (静态类型) |
| **线程模型** | 单线程、事件驱动、非阻塞 I/O | 多线程、阻塞 I/O (但也有非阻塞 NIO 库) |
| **并发处理** | 通过事件循环和异步回调/Promises/Async-Await | 通过多线程和锁机制 |
| **性能特点** | I/O 密集型应用表现优异 | CPU 密集型应用、大型复杂应用表现稳定 |
| **生态系统** | NPM，模块数量巨大，更新快 | Maven/Gradle，库成熟稳定，企业级方案多 |
| **开发效率** | 通常上手快，开发速度较快 | 相对学习曲线陡峭些，但大型项目更易于维护 |
| **主要应用领域** | Web API、实时应用、微服务、全栈 JS | 企业级应用、安卓开发、大数据、金融系统 |
| **内存占用** | 通常相对较小 | JVM 启动和运行时内存占用可能较大，但可调优 |


node 适合：

+ **<font style="color:rgb(38, 38, 38);">高并发应用：</font>**<font style="color:rgb(38, 38, 38);"> 如实时聊天应用、在线游戏服务器、协作工具等。Node.js 的单线程事件循环机制能够高效处理大量并发连接，而不会造成过多的线程开销。</font>
+ **<font style="color:rgb(38, 38, 38);">I/O 密集型应用：</font>**<font style="color:rgb(38, 38, 38);"> 如数据流应用、文件上传/下载服务、API 网关等。当应用需要频繁地读写文件、访问数据库或进行网络请求时，Node.js 的非阻塞特性可以显著提高性能。</font>
+ **<font style="color:rgb(38, 38, 38);">原型开发和快速迭代：</font>**<font style="color:rgb(38, 38, 38);"> JavaScript 的灵活性和庞大的 npm 生态系统使得 Node.js 非常适合快速构建原型和进行敏捷开发。</font>
+ **<font style="color:rgb(38, 38, 38);">Serverlss 及前后端一体化项目，cli 及中间层开发。</font>**

<font style="color:rgb(38, 38, 38);">java 更适合：</font>

+ **<font style="color:rgb(38, 38, 38);">大型企业级应用：</font>**<font style="color:rgb(38, 38, 38);"> 如银行系统、保险系统、大型电商平台等。Java 的稳定性和成熟的框架（如 Spring）使其成为构建复杂、高可靠性企业应用的理想选择。</font>
+ **<font style="color:rgb(38, 38, 38);">高性能计算和大数据处理：</font>**<font style="color:rgb(38, 38, 38);"> Java 在多线程处理和内存管理方面有很好的表现，并且拥有如 Hadoop、Spark 等强大的大数据处理框架。</font>
+ **<font style="color:rgb(38, 38, 38);">Android 应用开发：</font>**<font style="color:rgb(38, 38, 38);"> Java (以及后来的 Kotlin) 是 Android 官方支持的开发语言。</font>
+ **<font style="color:rgb(38, 38, 38);">对安全性和稳定性要求极高的系统，且需要长期维护和支持的项目。</font>**

<font style="color:rgb(38, 38, 38);">如果在公司使用，nest.js 更适合内部前端工具链的开发，如果开发后端应用来说，前提是公司有 Node 开发先例最好，且前端人数明显大于后端人数，且前端的经验基本都是两三年以上最好。</font>

