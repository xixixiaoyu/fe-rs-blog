### Nest CLI 是什么？

Nest CLI 是一个命令行工具，全称是 Nest Command Line Interface。它能干啥呢？想象一下，你要盖个房子，它就是那个帮你打地基、搭框架的工人。你可以用它快速创建一个新项目，生成各种代码文件（比如控制器、服务啥的），还能编译和运行你的应用。总之，它的目标是让你少操心繁琐的配置，多专注写代码。



### 怎么装它？

要用 Nest CLI，先得把它装到电脑上。这里我用 npm（Node.js 的包管理器）来演示，因为它最常见。打开终端，输入：

```bash
npm install -g @nestjs/cli
```

这行命令会全局安装 Nest CLI，-g 的意思是“global”，装完后你能在任何文件夹里用 nest 命令。装好了，可以敲一下：

```bash
nest --help
```

看到一堆命令列表跳出来？恭喜你，安装成功！如果没反应，可能是网络问题或者 npm 的路径没配置好，可以试试重启终端，或者用 npx @nestjs/cli@latest 临时跑一下，不用装全局也行。



### 基本玩法

假设你想建个叫 my-nest-project 的项目，步骤超简单：

1. 在终端里敲：

```bash
nest new my-nest-project
```

它会问你用啥包管理器（npm、yarn 还是 pnpm），随便选一个，回车就行。它会自动生成一个项目文件夹。

2. 进去项目目录：

```bash
cd my-nest-project
```

3. 启动开发模式：

```bash
npm run start:dev
```

然后打开浏览器，输入 http://localhost:3000，你会看到一个 “Hello World!” 的页面。是不是很简单？改改代码（比如 src/main.ts），保存后页面会自动刷新，热重载超方便。

**提个速**：默认用 TypeScript 编译器（tsc）有点慢，推荐试试 SWC，速度能快 10 倍。后面我再教你怎么切换。



### 项目长啥样？

用 nest new 生成的项目，自带一个标准结构，像这样：

- src/

  ：放代码的地方

  - main.ts：入口文件
  - app.module.ts：根模块
  - app.controller.ts：控制器
  - app.service.ts：服务

- test/：测试文件

- nest-cli.json：CLI 配置文件

- package.json：依赖和脚本

- tsconfig.json：TypeScript 配置

这就是**标准模式**，适合单个项目。如果你要管多个项目（比如一个应用加几个库），可以试试**monorepo 模式**，后面会细说。



### 常用命令：你的工具箱

Nest CLI 就像个多功能瑞士军刀，常用的命令有这几个：

- nest new：新建项目（简称 n）
- nest generate：生成文件（简称 g），比如：

```bash
nest g controller users
```

会生成一个 users.controller.ts。

- nest build：编译项目，生成 JavaScript 文件。
- nest start：运行编译后的项目。
- nest info：查查系统和 Nest 版本。

想看更多选项？加个 --help，比如 nest generate --help，一目了然。

假设你想试试生成过程但不真改文件，可以用：

```bash
nest g service auth --dry-run
```

--dry-run 就是“演习模式”，只告诉你会干啥，不真干。



### 标准模式 vs Monorepo 模式

Nest CLI 支持两种组织代码的方式：

**标准模式**

- 一个项目一个文件夹，独立运行。
- 适合简单应用，比如个人博客后端。
- 每个项目有自己的 node_modules 和配置。

**Monorepo 模式**

- 多个项目（应用或库）塞一个文件夹，共享依赖和配置。
- 适合团队开发，或者你要搞代码复用。
- 用 nest generate app 加应用，nest generate library 加库。

怎么从标准模式变 monorepo？超简单，建好标准项目后，进目录跑：

```bash
nest generate app my-app
```

它会把原项目挪到 apps/ 下，新加的 my-app 也放那儿，自动变成 monorepo。

**选哪个好？** 新手先用标准模式，简单上手。以后项目多了，再切 monorepo，完全无缝。



### 提速神器：SWC

前面提到默认编译慢，SWC 是个救星。它比 TypeScript 编译器快得多，怎么用呢？改下 nest-cli.json：

```json
{
  "compilerOptions": {
    "builder": "swc"
  }
}
```

然后 nest build 或 nest start，速度飞起！缺点是 SWC 默认不检查类型，想加检查就设 "typeCheck": true，不过会稍微慢点。



### 写个库玩玩

Monorepo 模式有个杀手锏——内置支持库。假设你要写个工具库：

```bash
nest g library my-tools
```

它会生成 libs/my-tools/，里面有模块、服务啥的。用的时候直接导入：

```ts
import { MyToolsModule } from '@app/my-tools'
```

编译时，Nest 自动打包，省得你手动弄依赖。



### 小结：为啥爱用 Nest CLI？

聊到现在，你应该看出 Nest CLI 的好处了吧：

- **省时**：一键搭项目、生成代码。
- **规范**：默认结构清晰，适合团队协作。
- **灵活**：标准模式简单，monorepo 强大，随你挑。