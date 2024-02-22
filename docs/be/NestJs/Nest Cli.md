此文主要介绍 Nest.js 常用的命令和选项：
## 使用 nest cli 创建新项目
```bash
npm install -g @nestjs/cli

nest new 项目名

npm update -g @nestjs/cli
```
nest 提供的命令：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686358843232-2ce5464f-f137-46bc-b38e-0bc3111ddb8c.png#averageHue=%23353434&clientId=ua100eb1d-51ce-4&from=paste&height=478&id=ud844c497&originHeight=1034&originWidth=1450&originalType=binary&ratio=2&rotation=0&showTitle=false&size=210410&status=done&style=none&taskId=u1b5fc4da-5aa9-4d00-9c8c-dca134b0824&title=&width=671)<br />创建新项目的 nest new，创建某些代码的 nest generate，打包的 nest build，开发模式的 nest start	

nest new 选项：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686358963430-70ec9185-4f7a-4596-aeaf-284994a8f059.png#averageHue=%23363636&clientId=ua100eb1d-51ce-4&from=paste&height=212&id=u0e8eef03&originHeight=424&originWidth=1774&originalType=binary&ratio=2&rotation=0&showTitle=false&size=84494&status=done&style=none&taskId=u1df57410-e647-4813-acc2-7df85092afa&title=&width=887)

- --directory：指定新项目的目录名。
- --dry-run 或 -d：运行命令但不创建项目文件，这可以用来预览将要执行的操作。
- --skip-git 或 -g：跳过初始化 git 仓库
- --skip-install：跳过 npm install
- --package-manager 指定包管理器
- --language 指定 typescript 和 javascript，默认的 ts
- --strict 指定 ts 的编译选项是否开启严格模式，默认是 false

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686359281721-c9d1a923-d7be-49c0-8933-ae78dd30fee8.png#averageHue=%23353535&clientId=ua100eb1d-51ce-4&from=paste&height=105&id=u57c6f7a6&originHeight=210&originWidth=874&originalType=binary&ratio=2&rotation=0&showTitle=false&size=26419&status=done&style=none&taskId=uca964972-e8c0-4b83-a07a-8d83eae9036&title=&width=437)<br />如果你想要创建一个新的 Nest.js 项目并指定使用 yarn 而不是 npm 来安装依赖，你可以执行以下命令：
```bash
nest new project-name --package-manager yarn
```
如果你想要预览将要创建的项目结构，而不实际生成文件，你可以使用 --dry-run 选项：
```bash
nest new project-name --dry-run
```

## 运行项目
使用 nest start 命令，它有这些选项：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686367127722-e79a5a74-1e88-4c87-813f-aea123b9df72.png#averageHue=%23343434&clientId=ua100eb1d-51ce-4&from=paste&height=260&id=eEnFN&originHeight=590&originWidth=1976&originalType=binary&ratio=2&rotation=0&showTitle=false&size=109482&status=done&style=none&taskId=ud8472409-be00-482e-b1c6-41e64dd733b&title=&width=872)

- --watch：启用热重载模式。在这种模式下，应用程序会在检测到源代码变化时自动重新编译和重启。
- --watchAssets：在热重载模式下，监视静态资源的变化。
- --debug：以调试模式启动应用程序
- --preserveWatchOutput：在热重载模式下，保留控制台输出的历史记录，而不是在每次重新编译时清除它
- --exec 可以指定用什么来跑，默认是用 node 跑，你也可以切换别的 runtime。

## 生成资源
nest 命令除了生成整个项目，Nest.js CLI 允许你快速生成各种资源，比如 controllers, providers, modules 等。资源通常指的是与特定业务逻辑相关的模块<br />使用 nest generate <schematic> <name>：

1. <schematic> 是文件类型，可以是以下选项之一：
   - module: 生成新的模块。
   - controller: 生成新的控制器。
   - service: 生成新的服务。
   - filter：生成新的过滤器。
   - middleware: 生成新的中间件。
   - interceptor 生成新的拦截器
   - guard: 生成新的守卫。
   - decorator：生成新的装饰器。
   - pipe: 生成新的管道。
   - resolver: 生成新的解析器（GraphQL）。
2. <name> 是文件的名称。

生成新模块：
```bash
nest generate module module-name
```
它会生成 module 的代码，并在 AppModule 里引入。

生成 controller、service 等代码：
```bash
nest generate controller controller-name
nest generate service service-name
```

生成完整模块代码：
```bash
nest generate resource resource-name
```
一般我们选择 http 的 REST 风格 api：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686362353535-c383e6d0-5181-4077-a6af-d100007fc438.png#averageHue=%23393939&clientId=ua100eb1d-51ce-4&from=paste&height=98&id=uf34ee406&originHeight=196&originWidth=814&originalType=binary&ratio=2&rotation=0&showTitle=false&size=34364&status=done&style=none&taskId=u9ab0b58b-9978-4aad-ac26-12a0d4b110e&title=&width=407)<br />然后会让你选择是否生成 CRUD 代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686362391823-a599495f-e338-42fe-8530-ec35d223958c.png#averageHue=%23434343&clientId=ua100eb1d-51ce-4&from=paste&height=22&id=u1ff16155&originHeight=44&originWidth=804&originalType=binary&ratio=2&rotation=0&showTitle=false&size=8629&status=done&style=none&taskId=ub4be2a14-b6e7-4ae7-b43c-ca5d2ab1223&title=&width=402)<br />最后会生成整个模块的 CRUD + REST api 的代码，BbbModule 同样会自动在 AppModule 引入。

这些代码模版的集合是在 `@nestjs/schematics` 这个包里定义的，它们的实现原理很简单，就是模版引擎填充变量，打印成代码。<br />其实 nest new 的底层就是 nest generate application，只不过 nest new 额外做了 git init 和 npm install 等处理。

nest generate 也有不少选项：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686362783764-1914b5e5-ea2e-422f-88b6-0d00440a1cf5.png#averageHue=%23393939&clientId=ua100eb1d-51ce-4&from=paste&height=155&id=ub196eac1&originHeight=310&originWidth=1412&originalType=binary&ratio=2&rotation=0&showTitle=false&size=59252&status=done&style=none&taskId=u525aa91c-0c36-4aab-879a-38c3ff9c403&title=&width=706)

- --dry-run 或 -d: 运行命令但不创建任何文件，这可以用来预览将要执行的操作
- --flat 和 --no-flat 是指定是否生成对应目录的。
- --no-spec: 防止生成测试文件 (*.spec.ts)。
- --skip-import 是指定不在 AppModule 里引入。
-  --project，在多项目工作区中指定运行在特定的项目。

## 打包项目
执行 nest build，会在 dist 目录下生成编译后的代码。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686363049370-a21f47a8-734f-4caf-80c7-aef76338e27d.png#averageHue=%23393939&clientId=ua100eb1d-51ce-4&from=paste&height=198&id=u11a8d227&originHeight=396&originWidth=918&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61016&status=done&style=none&taskId=u5201ea98-e1aa-4956-a83b-94775fe3361&title=&width=459)

- --wepback 和 --tsc 指定用什么编译
   - 默认是 tsc 编译，也可以切换成 webpack。
   - tsc 不做打包、webpack 会做打包，两种方式都可以。
   - node 模块本来就不需要打包，但是打包成单模块据说能提升加载的性能。
- --watch 是监听文件变动，自动 build 。
   - --watch 默认只是监听 ts、js 文件，加上 --watchAssets 会连别的文件一同监听变化，并输出到 dist 目录，比如 md、yml 等文件。
- --path 是指定 tsc 配置文件的路径的。
- --config 是指定 nest cli 的配置文件。

## nest-cli.json 文件
上面的选项基本都可以在 nest-cli.json 里配置。<br />`nest-cli.json` 文件是 Nest.js 项目的配置文件，用于定义和调整 Nest CLI 工具的行为，这个文件通常在根目下。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686366355859-bdd18663-281b-427c-a0a6-2266bb1328f0.png#averageHue=%232c2b2b&clientId=ua100eb1d-51ce-4&from=paste&height=268&id=u353f2f0b&originHeight=536&originWidth=1326&originalType=binary&ratio=2&rotation=0&showTitle=false&size=67815&status=done&style=none&taskId=u3572c4f2-a428-429d-bfc2-056df267923&title=&width=663)

1. **compilerOptions**:
   - deleteOutDir: 在编译前删除输出目录（通常是 dist）。
   - sourceRoot: 指定源代码的根目录。
   - tsConfigPath: 指向 tsconfig 文件的路径。
   - assets: 指定需要在构建时一同复制到输出目录的静态资源或文件夹。
   - watchAssets: 在使用 --watch 标志时，监视 assets 中指定的静态资源的变化。
2. **collection**:<br />指定使用的默认 Schematics 集合。Schematics 是用于生成文件的模板。
3. **monorepo**:<br />指示是否在一个单一的仓库（monorepo）中管理多个项目。
4. **projects**:<br />在一个 monorepo 中，你可以定义多个项目（如应用程序和库），每个项目可以有自己的配置选项。
   - 每个项目可以包括 type、root、entryFile、sourceRoot 和 compilerOptions 等配置。
5. **generateOptions**:<br />为 nest generate 命令设置默认的生成选项，如是否自动创建测试文件。
6. sourceRoot 

指定源码目录。

7. entryFile

指定入口文件的名字，默认是 main。

8. $schema 

指定 nest-cli.json 的 schema，也就是可以配置哪些属性：[https://json.schemastore.org/nest-cli](https://json.schemastore.org/nest-cli)

## 其他命令
nest info 命令可以查看项目信息，包括系统信息、 node、npm 和依赖版本：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686367231403-5997acc9-0337-472d-892a-7278a24b20bf.png#averageHue=%23323030&clientId=ua100eb1d-51ce-4&from=paste&height=368&id=u2e33e20f&originHeight=736&originWidth=814&originalType=binary&ratio=2&rotation=0&showTitle=false&size=79245&status=done&style=none&taskId=uc93d06fa-2cb4-4f1d-9a28-ae73086ab0d&title=&width=407)<br />nest add <package>：安装并添加一个新的 Nest.js 包，其中 <package> 是要安装的包的名称。<br />nest update：更新 Nest.js 应用程序的依赖包。
