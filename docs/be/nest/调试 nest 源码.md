# 如何调试 Nest.js 源码：从项目到源码的深度探索

在日常开发中，调试是一个非常重要的环节。我们之前已经学习了如何调试一个 Nest.js 项目，但如果你想深入了解 Nest.js 的内部实现，调试源码是必不可少的技能。本文将带你一步步学习如何调试 Nest.js 源码，帮助你更好地理解框架的底层逻辑。

## 为什么要调试 Nest.js 源码？

有些同学可能会问：“我在调试 Nest.js 项目的时候，调用栈里不就已经有源码部分了吗？”其实不然，调用栈中显示的代码是编译后的 JavaScript 文件，而不是我们想要的 TypeScript 源码。为了调试真正的源码，我们需要做一些额外的配置。

## 第一步：创建一个 Nest.js 项目

首先，我们需要创建一个新的 Nest.js 项目。你可以通过以下命令快速生成一个项目：

```bash
nest new debug-nest-source
```

接下来，打开 VSCode，点击左侧的调试面板，选择 `create a launch.json file`，并输入 `npm`，选择 `launch via npm`，创建一个调试 npm scripts 的配置。

## 第二步：配置调试环境

在生成的 `launch.json` 文件中，我们需要稍微修改一下配置，使其能够调试 `npm run start:dev` 命令。修改后的配置如下：

```json
{
  "name": "Launch via NPM",
  "request": "launch",
  "runtimeArgs": ["run-script", "start:dev"],
  "runtimeExecutable": "npm",
  "console": "integratedTerminal",
  "skipFiles": ["<node_internals>/**"],
  "type": "node"
}
```

这里我们指定了 `console` 为 `integratedTerminal`，这样日志会输出在终端中，而不是 `debug console`，方便我们查看更丰富的日志信息。

## 第三步：打断点调试项目

在 `AppController` 的 `getHello` 方法中打一个断点，然后点击调试按钮，启动调试模式。接着，打开浏览器访问 `http://localhost:3000`，你会发现代码在断点处停住了。这时，你已经可以调试 Nest.js 项目了。

## 第四步：调试 Nest.js 源码

虽然我们已经可以调试项目，但如果你想调试 Nest.js 的源码，还需要再做一些额外的工作。因为目前调用栈中的 Nest.js 源码部分依然是编译后的 JavaScript 文件，而不是 TypeScript 源码。

### 下载并构建 Nest.js 源码

要调试源码，我们需要下载 Nest.js 的源码并生成带有 sourcemap 的代码。首先，克隆 Nest.js 的源码仓库：

```bash
git clone --depth=1 --single-branch https://github.com/nestjs/nest
```

进入项目目录后，安装依赖并构建项目：

```bash
npm install
npm run build
```

这会在 `node_modules/@nestjs` 目录下生成编译后的代码，但默认情况下并没有生成 sourcemap 文件。

### 修改 TypeScript 配置生成 sourcemap

要生成 sourcemap，我们需要修改 `packages/tsconfig.build.json` 文件，将 `sourceMap` 设置为 `true`，并且将 `inlineSources` 设置为 `true`，以便在 sourcemap 中内联源码。修改后的配置如下：

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": true
  }
}
```

再次执行 `npm run build`，这时生成的代码将包含 sourcemap，并且 sourcemap 中已经内联了源码。

## 第五步：调试 Nest.js 源码

接下来，我们可以使用 Nest.js 源码来调试项目。进入 `samples/01-cats-app` 目录，这是 Nest.js 官方提供的示例项目之一。安装依赖：

```bash
npm install
```

然后将我们在根目录下生成的 `node_modules/@nestjs` 目录覆盖到 `01-cats-app` 项目的 `node_modules` 目录中。

### 配置调试环境

在 `01-cats-app` 项目中，我们需要创建一个新的调试配置，修改 `launch.json` 文件如下：

```json
{
  "name": "调试 nest 源码",
  "request": "launch",
  "runtimeArgs": ["run-script", "start:dev"],
  "runtimeExecutable": "npm",
  "console": "integratedTerminal",
  "cwd": "${workspaceFolder}/sample/01-cats-app/",
  "resolveSourceMapLocations": ["${workspaceFolder}/**", "!**/node_modules/**"],
  "skipFiles": ["<node_internals>/**"],
  "type": "node"
}
```

这里我们指定了 `cwd` 为 `01-cats-app` 项目的目录，并且修改了 `resolveSourceMapLocations`，去掉了默认排除 `node_modules` 的配置，这样才能找到我们生成的 sourcemap。

### 打断点调试源码

在 `src/cats/cats.controller.ts` 文件中打一个断点，然后点击调试按钮，启动调试模式。打开浏览器访问 `http://localhost:3000/cats`，你会发现代码在断点处停住了。

这时，查看调用栈，你会发现调用栈中的代码已经是 Nest.js 的 TypeScript 源码了。这样，你就可以调试 Nest.js 的源码了。

## 第六步：深入调试 AOP 源码

为了更好地理解 Nest.js 的内部机制，我们可以调试一下 AOP（面向切面编程）部分的源码。点击调用栈中的某个函数，你会看到 Nest.js 是如何创建所有的 `pipes`、`interceptors` 和 `guards` 实例的。

在调用 `handler` 之前，Nest.js 会先调用 `guard`，再调用 `interceptor`，最后调用 `handler`，并且在 `handler` 中会先通过 `pipe` 处理参数。这就是 Nest.js AOP 机制的核心流程。

## 总结

通过本文的学习，我们了解了如何调试 Nest.js 源码。首先，我们学习了如何在 VSCode 中配置调试环境，调试 `npm run start:dev` 命令。接着，我们学习了如何下载并构建带有 sourcemap 的 Nest.js 源码，并通过修改调试配置来调试源码。

最后，我们还深入调试了 Nest.js 的 AOP 部分源码，了解了其内部的实现机制。通过这种方式，你可以对 Nest.js 的各个模块进行深入调试，进一步理解其工作原理。

希望这篇文章能帮助你更好地掌握 Nest.js 的调试技巧，深入理解框架的内部实现。如果你对某个模块的实现原理感兴趣，不妨自己动手调试一下源码吧！
