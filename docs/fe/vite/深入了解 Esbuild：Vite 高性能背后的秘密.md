# 深入了解 Esbuild：Vite 高性能背后的秘密

在上一节中，我们介绍了 Vite 的双引擎架构，其中 Esbuild 作为其中一个引擎，在依赖预编译、TS 语法转译、代码压缩等关键构建阶段，极大地提升了 Vite 的性能表现。Esbuild 的高效性使得 Vite 能够在开发者社区中迅速崛起，成为现代前端开发工具的佼佼者。

本节，我们将深入探讨 Esbuild，了解它的基本概念、功能使用，并通过实战开发一个完整的 Esbuild 插件，帮助你更好地掌握这款工具。

## 为什么 Esbuild 性能如此出色？

Esbuild 是由 Figma 的 CTO Evan Wallace 基于 Go 语言开发的打包工具。与传统的打包工具相比，Esbuild 的构建速度可以快 10 到 100 倍。那么，它是如何实现如此惊人的性能提升的呢？主要有以下四个原因：

1. **Golang 开发**：Esbuild 的构建逻辑直接被编译为原生机器码，而不像 JavaScript 需要先解析为字节码再转换为机器码，这大大减少了程序的运行时间。

2. **多核并行**：Esbuild 充分利用了多核 CPU 的优势，所有步骤尽可能并行处理，这得益于 Go 语言中多线程共享内存的特性。

3. **从零造轮子**：Esbuild 几乎没有使用任何第三方库，所有逻辑都由自己编写，从 AST 解析到字符串操作，确保了代码的极致性能。

4. **高效的内存利用**：Esbuild 尽可能复用 AST 节点数据，避免了像 JavaScript 打包工具那样频繁解析和传递 AST 数据，减少了内存浪费。

## Esbuild 的功能使用

接下来，我们将通过实际操作来学习 Esbuild 的功能使用。首先，我们需要新建一个项目并安装 Esbuild：

```bash
pnpm init
pnpm i esbuild@0.14.18
```

Esbuild 提供了两种使用方式：**命令行调用** 和 **代码调用**。

### 1. 命令行调用

命令行调用是最简单的使用方式。我们可以通过以下步骤来体验 Esbuild 的打包过程：

1. 新建 `src/index.jsx` 文件，内容如下：

   ```jsx
   import Server from 'react-dom/server'

   let Greet = () => <h1>Hello, juejin!</h1>
   console.log(Server.renderToString(<Greet />))
   ```

2. 安装所需依赖：

   ```bash
   pnpm install react react-dom
   ```

3. 在 `package.json` 中添加 `build` 脚本：

   ```json
   "scripts": {
     "build": "./node_modules/.bin/esbuild src/index.jsx --bundle --outfile=dist/out.js"
   }
   ```

4. 执行打包命令：

   ```bash
   pnpm run build
   ```

通过命令行调用，我们可以快速完成打包，但这种方式的灵活性有限，无法应对复杂的场景。因此，通常我们会选择 **代码调用** 的方式。

### 2. 代码调用

Esbuild 提供了丰富的 API，主要分为两类：**Build API** 和 **Transform API**。我们可以通过 Node.js 代码调用这些 API 来实现更复杂的功能。

#### 项目打包——Build API

`Build API` 主要用于项目打包，包含 `build`、`buildSync` 和 `serve` 三个方法。我们可以通过以下代码来体验 `build` 方法的使用：

```javascript
const { build } = require('esbuild')

async function runBuild() {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: ['./src/index.jsx'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    splitting: true,
    sourcemap: true,
    metafile: true,
    minify: false,
    watch: false,
    write: true,
    loader: { '.png': 'base64' },
  })
  console.log(result)
}

runBuild()
```

执行 `node build.js` 后，你会看到打包的元信息和生成的文件。`buildSync` 的使用方式与 `build` 类似，但由于同步 API 会阻塞线程，建议优先使用异步的 `build` 方法。

#### 开启开发服务器——Serve API

`Serve API` 可以在开发阶段提供一个高性能的静态文件服务，类似于 `webpack-dev-server`。以下是一个简单的示例：

```javascript
const { serve } = require('esbuild')

function runBuild() {
  serve(
    { port: 8000, servedir: './dist' },
    {
      absWorkingDir: process.cwd(),
      entryPoints: ['./src/index.jsx'],
      bundle: true,
      format: 'esm',
      splitting: true,
      sourcemap: true,
      metafile: true,
    }
  ).then(server => {
    console.log('HTTP Server starts at port', server.port)
  })
}

runBuild()
```

通过访问 `localhost:8000`，你可以看到 Esbuild 服务器返回的编译产物。每次请求都会触发重新构建，且构建速度会随着增量构建的优化而逐渐加快。

#### 单文件转译——Transform API

`Transform API` 提供了单文件编译的能力，适用于 TS 和 JSX 文件的转译。以下是一个简单的示例：

```javascript
const { transform } = require('esbuild')

async function runTransform() {
  const content = await transform('const isNull = (str: string): boolean => str.length > 0;', {
    sourcemap: true,
    loader: 'tsx',
  })
  console.log(content)
}

runTransform()
```

与 `Build API` 类似，`Transform API` 也有同步和异步两种方式，但出于性能考虑，建议使用异步的 `transform` 方法。

## Esbuild 插件开发

在实际使用 Esbuild 时，我们可能会遇到需要自定义插件的场景。Esbuild 插件可以扩展其原有的路径解析、模块加载等功能。以下是一个简单的插件示例：

```javascript
let envPlugin = {
  name: 'env',
  setup(build) {
    build.onResolve({ filter: /^env$/ }, args => ({
      path: args.path,
      namespace: 'env-ns',
    }))

    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
      contents: JSON.stringify(process.env),
      loader: 'json',
    }))
  },
}

require('esbuild')
  .build({
    entryPoints: ['src/index.jsx'],
    bundle: true,
    outfile: 'out.js',
    plugins: [envPlugin],
  })
  .catch(() => process.exit(1))
```

这个插件会将 `env` 模块替换为 `process.env` 对象，帮助我们在打包时动态注入环境变量。

### 钩子函数的使用

Esbuild 插件的核心在于钩子函数，常用的钩子包括 `onResolve` 和 `onLoad`，它们分别用于路径解析和模块加载。以下是它们的基本使用方式：

```javascript
build.onResolve({ filter: /^env$/ }, args => ({
  path: args.path,
  namespace: 'env-ns',
}))

build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
  contents: JSON.stringify(process.env),
  loader: 'json',
}))
```

通过这些钩子，我们可以灵活地控制模块的解析和加载过程，进一步扩展 Esbuild 的功能。

## 总结

Esbuild 作为 Vite 的核心引擎之一，凭借其超高的性能和灵活的插件机制，成为了现代前端开发工具中的佼佼者。通过本文的学习，你不仅了解了 Esbuild 的基本概念和功能使用，还掌握了如何开发自定义插件。希望你能在实际项目中充分利用 Esbuild 的强大功能，提升开发效率。
