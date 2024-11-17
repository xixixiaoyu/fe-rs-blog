# 深入 Vite 插件机制：从基础到实战

在前面的章节中，我们已经从 Vite 的双引擎架构出发，系统学习了 Vite 的基础知识。现在，我们将进入 Vite 的高级应用模块，深入探讨如何在复杂的开发场景中，利用 Vite 提供的高度自定义能力，优化项目性能，提升开发效率。

## Vite 插件机制概述

Vite 的插件机制是其高度灵活和可扩展的核心之一。虽然 Vite 的插件机制基于 Rollup，但它也有自己独特的部分。通过插件，开发者可以轻松扩展 Vite 的功能，定制化开发流程，甚至解决一些复杂的项目需求。

### 插件的基本结构

Vite 插件的结构与 Rollup 插件类似，通常是一个包含 `name` 和多个钩子函数的对象。以下是一个简单的插件示例：

```javascript
{
  name: 'vite-plugin-example',
  load(id) {
    // 钩子逻辑
  }
}
```

通常情况下，插件会通过工厂函数返回一个插件对象，以便支持外部传参：

```javascript
export function myVitePlugin(options) {
	return {
		name: 'vite-plugin-example',
		load(id) {
			// 可以通过闭包访问 options
		},
	}
}
```

在 Vite 配置文件中使用插件：

```typescript
import { myVitePlugin } from './myVitePlugin'

export default {
	plugins: [
		myVitePlugin({
			/* 插件参数 */
		}),
	],
}
```

## Vite 插件的钩子机制

Vite 插件的钩子机制分为两类：**通用钩子** 和 **Vite 独有钩子**。通用钩子与 Rollup 兼容，而 Vite 独有钩子则是 Vite 特有的功能扩展。

### 通用钩子

Vite 在开发阶段会模拟 Rollup 的行为，调用一系列与 Rollup 兼容的钩子。主要分为以下几个阶段：

1. **服务器启动阶段**：`options` 和 `buildStart` 钩子会在服务启动时被调用。
2. **请求响应阶段**：当浏览器发起请求时，Vite 会依次调用 `resolveId`、`load` 和 `transform` 钩子。
3. **服务器关闭阶段**：Vite 会依次执行 `buildEnd` 和 `closeBundle` 钩子。

### Vite 独有钩子

Vite 还提供了一些独有的钩子，这些钩子只会在 Vite 内部调用，而在 Rollup 中会被忽略。以下是几个常用的 Vite 独有钩子：

#### 1. `config` 钩子

`config` 钩子允许你在 Vite 读取配置文件后，对配置对象进行修改或扩展。你可以返回一个新的配置对象，Vite 会将其与现有配置进行深度合并。

```javascript
const editConfigPlugin = () => ({
	name: 'vite-plugin-modify-config',
	config: () => ({
		alias: {
			react: require.resolve('react'),
		},
	}),
})
```

#### 2. `configResolved` 钩子

`configResolved` 钩子在 Vite 解析完配置后被调用，通常用于记录最终的配置信息。

```javascript
const examplePlugin = () => {
	let config

	return {
		name: 'read-config',
		configResolved(resolvedConfig) {
			config = resolvedConfig
		},
		transform(code, id) {
			console.log(config)
		},
	}
}
```

#### 3. `configureServer` 钩子

`configureServer` 钩子仅在开发阶段调用，用于扩展 Vite 的开发服务器。你可以在这个钩子中添加自定义的中间件。

```javascript
const myPlugin = () => ({
	name: 'configure-server',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			// 自定义请求处理逻辑
		})
	},
})
```

#### 4. `transformIndexHtml` 钩子

`transformIndexHtml` 钩子允许你灵活地控制 HTML 内容，可以对 HTML 进行任意的转换或注入标签。

```javascript
const htmlPlugin = () => ({
	name: 'html-transform',
	transformIndexHtml(html) {
		return html.replace(/<title>(.*?)<\/title>/, `<title>新的标题</title>`)
	},
})
```

#### 5. `handleHotUpdate` 钩子

`handleHotUpdate` 钩子在 Vite 处理热更新时被调用，你可以在这个钩子中自定义热更新逻辑。

```javascript
const handleHmrPlugin = () => ({
	async handleHotUpdate(ctx) {
		console.log(ctx.file) // 热更新的文件
		ctx.server.ws.send({
			type: 'custom',
			event: 'special-update',
			data: { a: 1 },
		})
		return []
	},
})
```

## 插件的执行顺序

Vite 插件的执行顺序是有规律的，通常分为以下几个阶段：

1. **服务启动阶段**：`config`、`configResolved`、`options`、`configureServer`、`buildStart`
2. **请求响应阶段**：对于 HTML 文件，执行 `transformIndexHtml` 钩子；对于非 HTML 文件，依次执行 `resolveId`、`load` 和 `transform` 钩子。
3. **热更新阶段**：执行 `handleHotUpdate` 钩子。
4. **服务关闭阶段**：依次执行 `buildEnd` 和 `closeBundle` 钩子。

你可以通过 `apply` 和 `enforce` 属性来控制插件的应用场景和执行顺序：

```javascript
{
  apply: 'serve', // 仅在开发环境中应用
  enforce: 'pre'  // 插件优先执行
}
```

## 插件开发实战

接下来，我们通过两个实战案例来深入理解 Vite 插件的开发过程。

### 实战案例 1：虚拟模块加载插件

虚拟模块是指那些并不存在于磁盘文件系统中的模块，而是通过内存动态生成的模块。我们可以通过虚拟模块加载一些动态生成的内容。

```typescript
import { Plugin } from 'vite'

const virtualFibModuleId = 'virtual:fib'
const resolvedFibVirtualModuleId = '\0' + virtualFibModuleId

export default function virtualFibModulePlugin(): Plugin {
	return {
		name: 'vite-plugin-virtual-module',
		resolveId(id) {
			if (id === virtualFibModuleId) {
				return resolvedFibVirtualModuleId
			}
		},
		load(id) {
			if (id === resolvedFibVirtualModuleId) {
				return 'export default function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }'
			}
		},
	}
}
```

在项目中使用这个插件：

```typescript
import fib from 'virtual:fib'

alert(`结果: ${fib(10)}`)
```

### 实战案例 2：SVG 组件加载插件

在 React 项目中，我们希望能够将 SVG 文件作为组件引入。通过编写一个插件，我们可以将 SVG 文件转换为 React 组件。

```typescript
import { Plugin } from 'vite'
import * as fs from 'fs'
import * as resolve from 'resolve'

export default function viteSvgrPlugin(): Plugin {
	return {
		name: 'vite-plugin-svgr',
		async transform(code, id) {
			if (!id.endsWith('.svg')) return code

			const svgrTransform = require('@svgr/core').transform
			const esbuild = require(resolve.sync('esbuild', {
				basedir: require.resolve('vite'),
			}))
			const svg = await fs.promises.readFile(id, 'utf8')
			const svgrResult = await svgrTransform(svg, {}, { componentName: 'ReactComponent' })

			const result = await esbuild.transform(svgrResult, { loader: 'jsx' })
			return { code: result.code, map: null }
		},
	}
}
```

在项目中使用这个插件：

```typescript
import Logo from './logo.svg'

function App() {
	return <Logo />
}

export default App
```

## 小结

通过本节的学习，你应该对 Vite 插件的机制有了更深入的理解。我们不仅介绍了 Vite 插件的基本结构和钩子机制，还通过两个实战案例展示了如何开发插件。Vite 插件的设计简洁灵活，能够帮助开发者轻松应对复杂的开发场景。
