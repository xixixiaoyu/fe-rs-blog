初始化项目、编译代码、甚至在你改动文件的时候自动帮你重新构建等功能，这些都离不开 cli。

Nest 把这些好用的功能都打包进了 `@nestjs/cli` 这个包里，提供了一个叫 `nest` 的命令行工具。



## 怎么用上这个 `nest` 命令呢？
如果临时用一下：

```bash
npx @nestjs/cli new 项目名
```

但是我更推荐全局安装：

```bash
npm install -g @nestjs/cli
# 如果需要更新
npm update -g @nestjs/cli
# mac 用户需要
sudo npm update -g @nestjs/cli
```

装好后就可以用 nest 命令了：

```bash
nest new 项目名
```



## `nest` 命令都有什么？
我们先 nest -h 看看：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933380135-d639f986-3444-4cdc-91e7-869cb991049f.png)

它列出了一堆命令，创建新项目的 nest new，创建某些代码的 nest generate，打包的 nest build，开发模式的 nest start 等，我们来聊些其中最常用的：

### `nest new`：轻松创建新项目
这个命令志上面见过了，就是用来从零开始搭建一个新的 Nest 项目。

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933522991-be528b27-9be6-4208-a86b-46d9874dc73b.png)

它还提供了一些有用的选项：

+ `--skip-git`：如果你的项目不想用 Git 初始化
+ --package-manager（-p） 创建项目时它会让你选 `npm`, `yarn`, `pnpm`。如果你提前想好了，比如就想用 `pnpm`，也不想 git 初始化：

```bash
nest new 项目名 -p pnpm --skip-git
```

+ `--language`：可以指定用 `typescript` (默认) 还是 `javascript`。现在都 2025 年了，而且还是写后端，肯定 TS 啦。
+ `--strict`：这个是 TypeScript 的严格模式开关。默认是 `false`，如果你想一开始就让 TS 编译器对你的代码更严格（比如开启 `noImplicitAny`, `strictNullChecks` 等 5 个选项），可以设置为 `true`。这个后续在 `tsconfig.json` 里也能改，所以不用太纠结。

我们创建个项目：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933562182-c0c989c5-cd75-4352-8782-98f27c37f2b1.png)

### `nest generate` (或 `nest g`)：代码快速生成器
nest 命令除了生成整个项目，还允许你快速生成各种资源，比如 controllers, providers, modules 等。资源通常指的是与特定业务逻辑相关的模块

使用 `nest generate <schematic> <name> 选项`：

1. <schematic> 是文件类型，可以是以下选项之一：
+ **module**: 生成新的模块
+ **controller**: 生成新的控制器
+ **service**: 生成新的服务
+ **filter**: 生成新的过滤器
+ **middleware**: 生成新的中间件
+ **interceptor**: 生成新的拦截器
+ **guard**: 生成新的守卫
+ **decorator**: 生成新的装饰器
+ **pipe**: 生成新的管道
+ **resolver**: 生成新的解析器（GraphQL）
+ **resource**: 生成完整的资源（包含控制器、服务、模块等）
+ **class**: 生成普通类
+ **interface**: 生成接口
+ **gateway**: 生成WebSocket网关
2. <name> 是文件的名称。
3. 常用选项：
+ **--flat**: 默认创建一个模块会创建文件夹
+ **--no-spec**: 不生成 `.spec.ts` 的测试文件
+ `--skip-import`：如果你不希望新生成的模块自动在 `AppModule` (或其他目标模块) 里被引入，可以用这个
+ **--dry-run**: 预览将创建的文件而不实际写入
+ `--project`：这个在玩 Monorepo (一个仓库管理多个项目) 的时候会用到，用来指定代码生成在哪个子项目里。

**生成一个模块 (Module)**：

```bash
nest generate module 模块名
# 或者简写
nest g module 模块名
```

模块名规范一般是小写，多个字母用 `-` 连接。

它会生成 module 的代码，并在 AppModule 自动引入：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933614612-1e84df85-83f3-49c9-9f1e-36688d4f565e.png)

userMoudle：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933632539-bd2fb48d-4752-4377-9a97-e7c4c6295d4c.png)

AppModule：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933663435-0d5887a4-8da8-4bb5-b97d-b2b37d6468b2.png)

不过我们更常生成完整的模块代码，包含模块、控制器、服务，并且控制器里还带有一整套 CRUD (创建、读取、更新、删除) 的 RESTful API 接口：

```bash
nest g resource resource-name
```

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933696769-2173e144-a8e3-49b6-a510-ccf152dad667.png)

会先问资源要提供哪种 API，有常见的 `REST API` (HTTP)、`GraphQL`、`WebSockets` 等，一般选 `REST API` 就行。

然后它会问你是否生成 CRUD 的入口点？我们选 yes，就会生成上面的 book 模块所需的所有基础文件：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933719728-a418b3b0-4bb4-44bb-ae1c-13ae97a892a0.png)

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933748836-d7af7d19-4695-4df5-95b5-2e853df72408.png)

book 模块还会自动在 `AppModule` 中引入：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933771247-31f21906-1813-4f63-b55b-6f323a1b9888.png)

这些代码模板都定义在 `@nestjs/schematics` 这个包里。`nest new` 创建项目时其实也有个 `--collection` 选项，就是用来指定用哪一套代码模板的，不过咱们一般用默认的就好。

### `nest build`：编译你的项目
代码开发完毕，我们需要编译成 JS 才能运行，执行：

```bash
nest build
```

执行后，它会把编译好的代码输出到 `dist` 目录下。

它也有一些选项：

+ `--webpack` 和 `--tsc`：Nest 默认使用 `tsc` (TypeScript Compiler) 来编译。`tsc` 只是把 TS 文件转成 JS 文件，不会做打包。如果你想用 `webpack` 来编译和打包（比如把所有代码打包成一个或少数几个文件，可能会提升一点加载性能），可以加上 `--webpack`。
+ `--watch` (或 `-w`)：监听你文件的变动，一旦有修改，就自动重新编译。
+ `--watchAssets`：默认情况下，`--watch` 只监听 `.ts`、`.js` 这类代码文件。如果你的项目里还有一些其他类型的文件（比如 `.hbs` 模板、`.json` 配置文件、`.md` 文档）也想在变动时被复制到 `dist` 目录，那就要加上 `--watchAssets`。
+ `--path`：指定 `tsconfig.json` 文件的路径。
+ `--config`：指定 `nest-cli.json` 配置文件的路径。

### `nest start`：启动开发服务器
使用 nest start 命令，它会先执行一次构建 (`nest build`)，然后用 `node` 把编译后的入口文件 (通常是 `dist/main.js`) 跑起来。

```bash
nest start
```

它最常用的选项就是 `--watch` (或 `-w`)：

```bash
nest start --watch
```

这样，当你保存了代码，它会重新编译并重启服务，你就能立刻看到改动后的效果，美滋滋。

其他选项：

+ `--debug`：如果你想进行调试，可以用这个选项。它会启动一个调试用的 WebSocket 服务，你可以配合 Chrome DevTools 或 VS Code 的调试器来使用。
+ `--exec`：默认是用 `node` 来运行编译后的代码，如果你想用其他的运行时 (比如 `nodemon`，虽然 `nest start --watch` 已经很像了)，可以通过这个选项指定。
+ 其余像 `--path`, `--config`, `--webpack` 等选项和 `nest build` 里的作用类似。

### `nest info`：查看项目信息
![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933815421-c394534b-b4c9-49e7-a505-d54ee55d4515.png)

显示当前项目的环境信息，包括你的操作系统、Node.js 版本、NPM/Yarn/PNPM 版本，以及项目中 NestJS 相关包的版本。排查环境问题或者提 issue 的时候会很有用。



## `nest-cli.json`：CLI 的大脑
其实很多你在命令行里用的选项，都可以在这个文件里进行全局配置。这样就不用每次都敲一长串命令了。

打开你项目根目录下的 `nest-cli.json`：

![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933832482-1b95758c-c82b-40d1-be49-cb29b58b756b.png)

+ `compilerOptions`：这里可以配置编译相关的选项，比如 `webpack: true` 就等同于命令行里的 `--webpack`。`deleteOutDir: true` 表示每次构建前清空 `dist` 目录。
+ `assets`：这里可以详细配置哪些非 TS/JS 文件需要被复制到 `dist` 目录，可以用 `include`、`exclude` 来精确匹配，并且可以单独为某些资源指定 `watchAssets`。注意，这通常只处理 `src` 目录下的文件。如果其他地方有文件想复制，可能需要自己写脚本。
+ `generateOptions`：这里配置 `nest generate` 的默认行为，比如上面例子里 `spec: false`，那么以后执行 `nest g controller xxx` 就不会生成测试文件了，除非你显式加上 `--spec`。
+ `sourceRoot`：指定源码目录，默认是 `src`。
+ `entryFile`：指定项目的主入口文件名，默认是 `main` (即 `src/main.ts`)。
+ `$schema`：这个是 JSON Schema 的地址，你的编辑器可以根据这个给你提供智能提示和校验，告诉你 `nest-cli.json` 里可以有哪些配置项。

常见配置：

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics", // 指定代码生成器的集合，默认是官方的
  "sourceRoot": "src",               // 源码根目录，默认是 'src'
  "entryFile": "main",                 // 项目入口文件名 (不含 .ts 后缀)，默认是 'main'

  "compilerOptions": {
    // 编译相关的选项
    "deleteOutDir": true,           // 每次构建前是否清空输出目录 (dist)，强烈建议 true
    "webpack": false,               // 是否使用 webpack 进行编译和打包，默认 false (即用 tsc)
                                    // true 的话会打包成一个或多个 bundle，false 则保留目录结构
    "tsConfigPath": "tsconfig.build.json", // 指定用于构建的 tsconfig 文件路径
    "plugins": [
      // 插件配置，比如用于 Swagger 文档自动生成的插件
      // "@nestjs/swagger/plugin"
    ],
    "assets": [] // 这个 'assets' 是 tsc 编译模式下，通过 tsconfig paths 引用非 ts 资源时可能用到，
                 // 但更常用的是下面顶层的 'assets' 配置
    // "manualRestart": false // 使用 webpack 时，如果想手动控制重启而不是自动，可以设为 true
  },

  "generateOptions": {
    // 'nest generate' 命令的默认选项
    "spec": true,                   // 是否为 controller, service 等自动生成 .spec.ts 测试文件
                                    // 可以设为 false 来禁用
    "flat": false                   // 生成文件时是否创建独立目录。
                                    // false (默认): src/users/users.controller.ts
                                    // true: src/users.controller.ts (如果已在 users 目录执行命令)
    // "skipImport": false,         // 是否跳过在模块中自动导入生成的组件 (controller, service 等)
    // "language": "ts"             // 生成代码的语言，默认 'ts'
  },

  "assets": [
    // 定义哪些非 TS/JS 文件或目录在构建时需要被复制到输出目录 (dist)
    // 这对于模板文件、配置文件、i18n 文件等非常有用
    // 每个元素可以是一个字符串 (glob pattern) 或者一个对象
    {
      "include": "**/i18n/*.json", // Glob 模式，匹配 src 下所有 i18n 目录中的 json 文件
      "watchAssets": true          // 在 watch 模式下 (nest start --watch) 是否监听这些文件的变化
                                   // 如果为 true，这些文件变动也会触发重新构建/复制
    },
    {
      "include": "**/*.hbs",         // 比如 Handlebars 模板文件
      "outDir": "dist/templates",    // 可以指定复制到 dist 下的特定子目录
      "watchAssets": false
    }
    // "public/**/*" // 比如复制整个 public 目录
  ],

  "projects": {
    // 这个是用于 Monorepo (单一代码仓库管理多个项目/应用) 模式的配置
    // 如果你的项目不是 monorepo，这个部分可能为空或者不存在
    // "my-app": { // 'my-app' 是你的子应用或库的名称
    //   "type": "application", // 类型：application 或 library
    //   "root": "apps/my-app", // 子应用的根目录
    //   "entryFile": "main",
    //   "sourceRoot": "apps/my-app/src",
    //   "compilerOptions": {
    //     "tsConfigPath": "apps/my-app/tsconfig.app.json"
    //   }
    // },
    // "my-lib": {
    //   "type": "library",
    //   "root": "libs/my-lib",
    //   "entryFile": "index",
    //   "sourceRoot": "libs/my-lib/src",
    //   "compilerOptions": {
    //     "tsConfigPath": "libs/my-lib/tsconfig.lib.json"
    //   }
    // }
  }
}
```



## 看看 Nest 自带的 npm 脚本
![](https://cdn.nlark.com/yuque/0/2025/png/21596389/1746933890829-7af9ab46-4417-43a2-9541-511b95e0561e.png)

这些命令包含了从代码开发、格式化、打包、调试、测试、部署。



## 总结
+ `**nest new**`：快速创建项目骨架。
+ `**nest generate**`** ****(或**** **`**nest g**`**)**：高效生成模块、控制器、服务等各种代码片段，甚至是一整套 CRUD 接口。
+ `**nest build**`：使用 `tsc` 或 `webpack` 编译你的 TypeScript 代码。
+ `**nest start**`：启动开发服务器，支持 `--watch` 模式实现热重载，还支持 `--debug` 进行调试。
+ `**nest info**`：打印项目相关的环境和依赖版本信息。

而且，很多常用的选项都可以在 `nest-cli.json` 文件里进行统一配置。



