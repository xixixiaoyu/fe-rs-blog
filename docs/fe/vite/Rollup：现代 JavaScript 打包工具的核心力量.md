# Rollup：现代 JavaScript 打包工具的核心力量

在现代前端开发中，打包工具是不可或缺的一环。无论是开发小型项目，还是构建复杂的前端应用，打包工具都能帮助我们优化代码、提高性能。而在众多打包工具中，**Rollup** 凭借其对 ES Module 的原生支持和强大的 Tree Shaking 功能，成为了前端开发者的得力助手。更重要的是，Rollup 也是 **Vite** 的核心构建工具之一，掌握 Rollup 不仅能帮助你更好地理解 Vite，还能为你在前端开发中提供更多的灵活性。

## Rollup 的核心特性

Rollup 是一个基于 ES Module 规范的 JavaScript 打包工具，它的设计初衷是为了打包 JavaScript 库。与 Webpack 等工具相比，Rollup 更加轻量，专注于模块的打包和优化。它的核心特性包括：

- **Tree Shaking**：自动移除未使用的代码，减少打包体积。
- **ES Module 支持**：原生支持 ES Module 规范，能够更好地优化代码。
- **插件机制**：通过插件扩展功能，支持多种格式的打包和自定义构建流程。

接下来，我们将通过一个简单的示例，快速上手 Rollup，并逐步深入了解它的高级功能。

## 快速上手 Rollup

### 1. 初始化项目

首先，我们需要创建一个新的项目并安装 Rollup 依赖：

```bash
pnpm init -y
pnpm i rollup
```

接着，创建以下文件结构：

```
.
├── package.json
├── rollup.config.js
└── src
    ├── index.js
    └── util.js
```

### 2. 编写代码

在 `src/index.js` 中，我们导入一个简单的加法函数：

```javascript
// src/index.js
import { add } from './util'
console.log(add(1, 2))
```

在 `src/util.js` 中定义加法和乘法函数：

```javascript
// src/util.js
export const add = (a, b) => a + b
export const multi = (a, b) => a * b
```

### 3. 配置 Rollup

在 `rollup.config.js` 中，我们定义打包的入口和输出格式：

```javascript
// rollup.config.js
/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: ['src/index.js'],
  output: {
    dir: 'dist/es',
    format: 'esm',
  },
}

export default buildOptions
```

### 4. 执行打包

在 `package.json` 中添加打包脚本：

```json
{
  "scripts": {
    "build": "rollup -c"
  }
}
```

运行以下命令进行打包：

```bash
npm run build
```

打包完成后，你会在 `dist/es` 目录下看到打包后的文件。值得注意的是，虽然我们在 `util.js` 中定义了 `multi` 函数，但由于它没有被使用，Rollup 自动将其移除。这就是 Rollup 的 **Tree Shaking** 功能，它能够分析代码依赖，移除未使用的部分，从而减少打包体积。

## Rollup 的高级配置

### 1. 多产物格式

在实际项目中，我们通常需要输出多种格式的产物，例如 ESM、CommonJS 等。我们可以通过修改 `rollup.config.js` 来实现：

```javascript
// rollup.config.js
const buildOptions = {
  input: ['src/index.js'],
  output: [
    {
      dir: 'dist/es',
      format: 'esm',
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
  ],
}

export default buildOptions
```

这样，Rollup 会同时输出 ESM 和 CommonJS 格式的产物，确保代码在不同环境下都能正常运行。

### 2. 多入口配置

如果项目中有多个入口文件，我们可以通过数组或对象的形式配置多个入口：

```javascript
// rollup.config.js
const buildOptions = {
  input: {
    index: 'src/index.js',
    util: 'src/util.js',
  },
  output: [
    {
      dir: 'dist/es',
      format: 'esm',
    },
  ],
}

export default buildOptions
```

这样，Rollup 会为每个入口文件生成对应的打包产物。

### 3. 插件机制

Rollup 的插件机制非常强大，能够帮助我们处理各种复杂的场景。例如，Rollup 默认只支持 ESM 格式的代码，但很多第三方库仍然使用 CommonJS 格式。为了解决这个问题，我们可以引入 `@rollup/plugin-commonjs` 插件：

```bash
pnpm i @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

在 `rollup.config.js` 中引入并使用这些插件：

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: ['src/index.js'],
  output: [
    {
      dir: 'dist/es',
      format: 'esm',
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
  ],
  plugins: [resolve(), commonjs()],
}
```

现在，Rollup 就能够正确处理 CommonJS 格式的第三方库了。

## Rollup 的 JavaScript API

除了通过配置文件使用 Rollup，我们还可以通过 JavaScript API 来定制打包流程。Rollup 提供了两个核心 API：`rollup.rollup` 和 `rollup.watch`。

### 1. 使用 `rollup.rollup` 进行一次性打包

我们可以通过 `rollup.rollup` 来手动控制打包过程。创建一个 `build.js` 文件：

```javascript
// build.js
const rollup = require('rollup')

const inputOptions = {
  input: './src/index.js',
  plugins: [],
}

const outputOptions = {
  dir: 'dist/es',
  format: 'esm',
}

async function build() {
  const bundle = await rollup.rollup(inputOptions)
  await bundle.write(outputOptions)
  await bundle.close()
}

build()
```

执行 `node build.js`，Rollup 会根据我们定义的配置进行打包。

### 2. 使用 `rollup.watch` 进行实时打包

如果你希望在开发过程中自动监听文件变化并重新打包，可以使用 `rollup.watch`。创建一个 `watch.js` 文件：

```javascript
// watch.js
const rollup = require('rollup')

const watcher = rollup.watch({
  input: './src/index.js',
  output: {
    dir: 'dist/es',
    format: 'esm',
  },
  watch: {
    exclude: ['node_modules/**'],
  },
})

watcher.on('event', event => {
  if (event.code === 'BUNDLE_END') {
    console.log('打包完成')
  }
})
```

执行 `node watch.js`，Rollup 会自动监听文件变化并重新打包。

## 总结

通过本文的学习，你已经掌握了 Rollup 的基本使用方法和一些高级配置技巧。Rollup 作为一个轻量级的打包工具，凭借其对 ES Module 的原生支持和强大的 Tree Shaking 功能，成为了现代前端开发中的重要工具。无论是简单的项目打包，还是复杂的多入口、多格式打包，Rollup 都能轻松应对。

如果你想进一步提升打包效率，或者深入了解 Vite 的构建原理，Rollup 无疑是你需要掌握的工具之一。
