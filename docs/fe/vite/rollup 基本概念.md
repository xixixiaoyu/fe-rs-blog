# 深入理解 Rollup：从基础到进阶

在现代前端开发中，打包工具扮演着至关重要的角色。Rollup 作为一款基于 ES Module 模块规范的 JavaScript 打包工具，凭借其高效的 Tree Shaking 和灵活的插件机制，成为了许多项目的首选，尤其是在构建库和框架时。Rollup 也是 Vite 的核心构建工具之一，因此，掌握 Rollup 不仅能帮助你更好地理解 Vite，还能为你在前端开发中提供更多的灵活性和优化空间。

本文将带你从基础到进阶，系统学习 Rollup 的核心概念、常用配置以及如何通过 JavaScript API 进行二次开发。无论你是初学者还是有经验的开发者，都能从中找到适合自己的内容。

## Rollup 快速上手

### 初始化项目

首先，我们通过 `pnpm` 初始化一个简单的项目，并安装 Rollup 依赖：

```bash
pnpm init -y
pnpm i rollup
```

接着，创建以下文件结构：

```
.
├── package.json
├── pnpm-lock.yaml
├── rollup.config.js
└── src
    ├── index.js
    └── util.js
```

文件内容如下：

```javascript
// src/index.js
import { add } from './util'
console.log(add(1, 2))

// src/util.js
export const add = (a, b) => a + b
export const multi = (a, b) => a * b
```

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

在 `package.json` 中添加构建脚本：

```json
{
	"scripts": {
		"build": "rollup -c"
	}
}
```

执行 `npm run build`，你将看到打包后的产物位于 `dist/es` 目录中：

```javascript
// dist/es/index.js
const add = (a, b) => a + b
console.log(add(1, 2))
```

### Tree Shaking

你可能会注意到，虽然 `util.js` 中定义了 `multi` 函数，但它并没有被打包到产物中。这是因为 Rollup 具备天然的 **Tree Shaking** 功能，能够自动移除未使用的代码。这种技术源自编译原理中的 **DCE（Dead Code Elimination）**，通过分析模块的依赖关系，Rollup 可以在编译阶段删除未使用的代码，从而优化打包体积。

## Rollup 常用配置解读

### 1. 多产物配置

在构建 JavaScript 库时，通常需要输出多种格式的产物以兼容不同的使用场景。Rollup 支持通过配置多个 `output` 来实现这一点。

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

通过这种方式，Rollup 会为同一个入口文件生成不同格式的产物，分别用于 ESM 和 CommonJS 环境。

### 2. 多入口配置

除了多产物，Rollup 也支持多入口配置。你可以通过数组或对象的形式定义多个入口文件。

```javascript
// 多入口配置
{
  input: ["src/index.js", "src/util.js"]
}

// 或者
{
  input: {
    index: "src/index.js",
    util: "src/util.js",
  },
}
```

如果不同入口文件需要不同的打包配置，可以导出一个配置数组：

```javascript
// rollup.config.js
const buildIndexOptions = {
	input: ['src/index.js'],
	output: [
		/* 省略 output 配置 */
	],
}

const buildUtilOptions = {
	input: ['src/util.js'],
	output: [
		/* 省略 output 配置 */
	],
}

export default [buildIndexOptions, buildUtilOptions]
```

这种配置在复杂的打包场景中非常有用，尤其是当你需要为不同的模块设置不同的打包策略时。

### 3. 自定义 output 配置

`output` 配置项用于定义产物的输出行为，常用的配置项包括：

```javascript
output: {
  dir: "dist",
  entryFileNames: `[name].js`,
  chunkFileNames: 'chunk-[hash].js',
  assetFileNames: 'assets/[name]-[hash][extname]',
  format: 'cjs',
  sourcemap: true,
  name: 'MyBundle',
  globals: {
    jquery: '$'
  }
}
```

通过这些配置，你可以灵活地控制产物的文件名、格式、是否生成 sourcemap 等。

### 4. 依赖 external

有时我们不希望将某些第三方依赖打包进产物中，可以通过 `external` 配置将其外部化：

```javascript
{
	external: ['react', 'react-dom']
}
```

这在 SSR 构建或使用 ESM CDN 时非常有用。

### 5. 插件机制

Rollup 的插件机制非常强大，能够扩展其功能。比如，Rollup 默认只支持 ESM 格式的代码，但通过插件可以让它支持 CommonJS 格式的依赖。

首先安装插件：

```bash
pnpm i @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

然后在配置文件中引入这些插件：

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

通过这种方式，Rollup 就能够正确处理 CommonJS 格式的依赖了。

## Rollup 高级使用：JavaScript API

除了通过配置文件使用 Rollup，你还可以通过 JavaScript API 进行更灵活的打包操作。Rollup 提供了两个核心 API：`rollup.rollup` 和 `rollup.watch`。

### 1. rollup.rollup

`rollup.rollup` 用于一次性打包。我们可以通过编写脚本来调用它：

```javascript
// build.js
const rollup = require('rollup')

const inputOptions = {
	input: './src/index.js',
	plugins: [],
}

const outputOptions = {
	dir: 'dist/es',
	format: 'es',
	sourcemap: true,
}

async function build() {
	const bundle = await rollup.rollup(inputOptions)
	await bundle.write(outputOptions)
	await bundle.close()
}

build()
```

通过这种方式，你可以在代码中灵活地控制打包过程。

### 2. rollup.watch

`rollup.watch` 用于监听文件变化并自动重新打包，非常适合开发环境。

```javascript
// watch.js
const rollup = require('rollup')

const watcher = rollup.watch({
	input: './src/index.js',
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
	watch: {
		exclude: ['node_modules/**'],
		include: ['src/**'],
	},
})

watcher.on('restart', () => {
	console.log('重新构建...')
})

watcher.on('change', id => {
	console.log('发生变动的模块 id: ', id)
})

watcher.on('event', e => {
	if (e.code === 'BUNDLE_END') {
		console.log('打包完成')
	}
})
```

通过 `rollup.watch`，你可以在开发过程中实时监听文件变化并自动触发打包。

## 总结

通过本文的学习，你已经掌握了 Rollup 的基础使用方法和一些高级技巧。我们从一个简单的示例入手，逐步介绍了 Rollup 的核心配置项，包括多产物、多入口、插件机制等。接着，我们深入探讨了如何通过 JavaScript API 进行 Rollup 的二次开发，灵活控制打包流程。

Rollup 作为一个轻量级但功能强大的打包工具，特别适合用于构建库和框架。它的 Tree Shaking、插件机制以及灵活的 API 使得它在前端开发中占据了重要地位。希望通过本文的学习，你能更好地掌握 Rollup，并在实际项目中灵活运用它。
