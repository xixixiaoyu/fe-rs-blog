### REPL 是什么？

REPL 就是一个互动的小工具。你在终端里敲一行代码，它马上执行，然后把结果扔给你。就像在浏览器里打开控制台玩 JavaScript 一样，只不过这次是直接跟你的 NestJS 项目对话。

想象一下，你写了个服务（比如 AppService），想测试一下里面的 getHello() 方法是不是真能返回 'Hello World!'。以前你可能得写个路由，或者跑整个项目去看日志。现在有了 REPL，你直接在终端输入一行命令，就能立刻看到结果。省时省力，还能随便试试各种想法。



### 怎么启动 REPL？

假设已经有了一个 NestJS 项目（如果没有，跑个 nest new 就行），我们需要在项目里加个小文件来启动 REPL。

#### 1.创建一个 repl.ts 文件

在项目根目录下（跟 main.ts 同级），新建一个 repl.ts，里面写上这些代码：

```ts
import { repl } from '@nestjs/core'
import { AppModule } from './src/app.module'

async function bootstrap() {
  await repl(AppModule)
}
bootstrap()
```

这段代码的意思是：用 @nestjs/core 提供的 repl 函数，启动一个基于 AppModule 的交互环境。AppModule 就是你项目的入口模块，里面定义了所有的依赖和服务。

#### 2.跑起来

打开终端，输入这条命令：

```text
$ npm run start -- --entryFile repl
```

注意这里的 --entryFile repl，告诉 NestJS 不要用默认的 main.ts，而是用我们刚写的 repl.ts。

#### 3.看看启动成功没

如果一切顺利，你会看到终端里出现这样的日志：

```text
LOG [NestFactory] Starting Nest application...
LOG [InstanceLoader] AppModule dependencies initialized
LOG REPL initialized
```

看到 REPL initialized 就说明成功了！现在你面前是一个可以随便敲命令的终端。



### 怎么跟项目互动？

REPL 跑起来了，接下来我们试试怎么用它跟项目里的东西打交道。

#### 1.调用服务的方法

假设你的项目里有个 AppService，里面有个 getHello() 方法会返回 'Hello World!'。在终端里直接输入：

```text
> get(AppService).getHello()
'Hello World!'
```

这里 get() 是 REPL 内置的一个函数，能从依赖图里抓到 AppService 的实例，然后我们直接调用它的方法。是不是简单得有点过分？

#### 2.给控制器赋值，玩异步

如果你有个 AppController，想试试它的方法，也很简单。比如：

```bash
> appController = get(AppController)
AppController { appService: AppService {} }
> await appController.getHello()
'Hello World!'
```

这里我们先把 AppController 的实例存到变量 appController 里，然后用 await 调用它的异步方法。是不是跟写普通 JavaScript 差不多？

#### 3.看看有哪些方法可以用

不确定某个类里有哪些方法？用 methods() 查一下：

```ts
> methods(AppController)
Methods:
 ◻ getHello
```

这就列出了 AppController 的所有公共方法，一目了然。

#### 4.调试整个依赖关系

想知道项目里都注册了啥模块、控制器和服务？用 debug()：

```text
> debug()
AppModule:
 - controllers:
   ◻ AppController
 - providers:
   ◻ AppService
```

这就像给项目拍了个全家福，所有东西都清清楚楚。



### REPL 的“神器”函数们

REPL 自带了一些特别好用的内置函数，敲 help() 可以看到完整列表。这里我挑几个常用的给你讲讲：

- **get() 或 $()**
   用来抓取依赖图里的实例，比如 get(AppService)。如果没找到会抛异常，所以用的时候得确定东西是存在的。
- **methods()**
   前面提过了，列出某个类的公共方法，调试时超实用。
- **debug()**
   打印整个项目的模块结构，想知道依赖关系长啥样就用它。
- **resolve()**
   这个稍微高级点，用来解析临时的或者请求作用域的实例。比如你有个服务是按请求作用域注入的，用 resolve() 就能拿到。
- **select()**
   如果你的项目里有多个模块，想挑一个出来玩，可以用这个导航到特定模块。

想知道这些函数具体怎么写参数？直接加个 .help 看看签名，比如：

```text
> $.help
获取可注入对象或控制器实例，若无则抛出异常
接口: $(token: InjectionToken) => any
```



### 开发时的小技巧：监听模式

如果你一边改代码一边用 REPL，建议开个“监听模式”，这样代码改了会自动重启。命令是：

```bash
$ npm run start -- --watch --entryFile repl
```

不过有个小问题：每次重启后，之前的命令历史就没了。咋办？改一下 repl.ts：

```ts
async function bootstrap() {
  const replServer = await repl(AppModule)
  replServer.setupHistory('.nestjs_repl_history', (err) => {
    if (err) {
      console.error(err)
    }
  })
}
bootstrap()
```

加了这段，命令历史会被保存在 .nestjs_repl_history 文件里，重启也不会丢。



### 总结：REPL 能干啥？

说了这么多，其实 REPL 最大的好处就是“快”和“灵活”。你可以用它：

- 快速测试服务或控制器的方法
- 检查依赖关系是不是按预期工作
- 在开发时随便试试代码想法，不用改一堆文件