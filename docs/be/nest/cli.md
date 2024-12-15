在现代项目开发中，工程化工具的使用是不可或缺的。无论是创建项目、编译构建，还是在开发过程中自动监听文件变动并重新构建，工程化工具都能大大提升开发效率。而在 NestJS 项目中，官方提供的 `@nestjs/cli` 工具就是这样一个强大的助手。

### Nest CLI：开发者的好帮手

Nest CLI 是 NestJS 官方提供的命令行工具，帮助开发者快速创建项目、生成代码、编译构建等。你可以通过 `npx` 直接执行，也可以选择将它全局安装，后者更为推荐：

```bash
npm install -g @nestjs/cli
```

安装完成后，你就可以使用 `nest` 命令来创建项目了：

```bash
nest new my-project
```

不过需要注意的是，Nest CLI 需要定期更新，以确保你创建的项目使用的是最新版本的依赖。可以通过以下命令来更新：

```bash
npm update -g @nestjs/cli
```

### 常用命令一览

Nest CLI 提供了丰富的命令，常见的有：

- `nest new`：创建新项目
- `nest generate`：生成代码
- `nest build`：编译构建项目
- `nest start`：启动开发服务
- `nest info`：查看项目信息

#### 1. `nest new`：快速创建项目

`nest new` 命令用于创建一个新的 NestJS 项目。它提供了一些常用的选项，比如：

- `--skip-git`：跳过 Git 初始化
- `--skip-install`：跳过依赖安装
- `--package-manager`：指定包管理器（如 npm 或 yarn）
- `--language`：选择项目语言（TypeScript 或 JavaScript）
- `--strict`：是否启用 TypeScript 的严格模式

这些选项让你可以根据自己的需求灵活配置项目的初始化过程。

#### 2. `nest generate`：快速生成代码

除了创建项目，Nest CLI 还可以帮助你生成项目中的各种代码，比如 `controller`、`service`、`module` 等。举个例子，生成一个新的模块：

```bash
nest generate module user
```

这条命令会自动生成一个 `user.module.ts` 文件，并且会将它引入到 `AppModule` 中。类似地，你也可以生成 `controller`、`service` 等代码：

```bash
nest generate controller user
nest generate service user
```

如果你需要生成一个完整的模块，包括 CRUD 操作和 REST API，可以使用 `nest generate resource` 命令：

```bash
nest generate resource user
```

这条命令会引导你选择生成的资源类型（如 HTTP、WebSocket、GraphQL 等），并询问是否生成 CRUD 代码。选择 HTTP 和 CRUD 后，Nest CLI 会自动生成一个包含完整 REST API 的模块。

#### 3. `nest build`：编译构建项目

`nest build` 命令用于编译项目，默认情况下会使用 TypeScript 编译器（`tsc`）将代码编译到 `dist` 目录。你也可以选择使用 Webpack 进行打包：

```bash
nest build --webpack
```

Webpack 的优势在于它可以将项目打包成单个文件，提升加载性能。除此之外，`nest build` 还支持 `--watch` 选项，监听文件变动并自动重新编译：

```bash
nest build --watch
```

如果你需要监听非代码文件（如 `.md`、`.yml` 等），可以加上 `--watchAssets` 选项。

#### 4. `nest start`：启动开发服务

`nest start` 命令用于启动开发服务，并且支持文件变动自动重启。常用的选项包括：

- `--watch`：监听文件变动，自动重启服务
- `--debug`：启动调试模式
- `--exec`：指定运行时环境，默认是 Node.js

通过这些选项，你可以轻松地在开发过程中保持高效的迭代。

#### 5. `nest info`：查看项目信息

`nest info` 命令可以帮助你查看当前项目的系统信息、Node.js 版本、npm 版本以及项目依赖的版本信息。这对于排查问题或分享项目环境信息非常有用。

### 配置文件：`nest-cli.json`

Nest CLI 的很多选项都可以通过 `nest-cli.json` 文件进行配置。比如，你可以在 `compilerOptions` 中指定使用 Webpack 进行编译：

```json
{
  "compilerOptions": {
    "webpack": true
  }
}
```

此外，你还可以配置生成代码时的选项，比如是否生成测试文件、是否创建目录结构等：

```json
{
  "generateOptions": {
    "spec": false,
    "flat": false
  }
}
```

通过合理配置 `nest-cli.json`，你可以让项目的构建和生成过程更加自动化和个性化。

### 总结

Nest CLI 是一个功能强大的工具，它不仅能帮助你快速创建项目，还能生成各种代码、编译构建项目、监听文件变动并自动重启服务。通过学习和掌握 Nest CLI，你可以大大提升开发效率，专注于业务逻辑的实现。

无论是初学者还是资深开发者，Nest CLI 都是你在 NestJS 开发过程中不可或缺的好帮手。学会使用它，是深入学习 NestJS 的重要一步。
