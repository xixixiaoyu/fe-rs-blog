# Rollup 与 Webpack：打包工具的选择与对比

在前端开发中，打包工具是不可或缺的一环。无论是开发应用还是组件库，打包工具都能帮助我们将代码组织得更高效、更易于维护。常见的打包工具有 Webpack 和 Rollup，它们各有优劣，适用于不同的场景。本文将通过实际案例，深入探讨 Rollup 和 Webpack 的区别，并解释为什么组件库打包通常选择 Rollup。

## Webpack 与 Rollup 的区别

### 1. Webpack：为浏览器而生

Webpack 是一个功能强大的打包工具，最初设计是为了打包浏览器端的应用。它的核心功能包括：

- **Code Splitting**：通过动态 `import()` 实现按需加载，减少初始加载时间。
- **模块热替换（HMR）**：在开发过程中，能够实时更新页面而不刷新整个页面。
- **丰富的插件和 loader**：Webpack 通过 loader 处理各种文件类型（如 CSS、图片等），通过插件扩展功能。

然而，Webpack 的强大也带来了复杂性。它的打包产物通常包含大量的运行时代码（runtime），这些代码用于支持模块加载、按需加载等功能。对于浏览器应用来说，这些功能是必要的，但对于组件库的打包，这些额外的代码显得有些多余。

### 2. Rollup：为库而生

Rollup 则是一个更轻量的打包工具，专注于打包 JavaScript 库。它的设计理念是生成尽可能简洁、纯粹的代码。Rollup 的特点包括：

- **Tree Shaking**：Rollup 默认开启 Tree Shaking，能够自动移除未使用的代码，生成更小的打包产物。
- **支持多种模块规范**：Rollup 可以输出多种模块格式，如 ES Module（ESM）、CommonJS（CJS）、UMD 等，适合不同的使用场景。
- **无运行时代码**：与 Webpack 不同，Rollup 的打包产物没有额外的运行时代码，非常干净。

正因为这些特点，Rollup 成为了打包 JavaScript 库和组件库的首选工具。

## 实战：用 Rollup 和 Webpack 打包

接下来，我们通过一个简单的例子，分别使用 Rollup 和 Webpack 来打包，看看它们的区别。

### 1. 创建项目

首先，我们创建一个简单的项目，包含两个模块：

```bash
mkdir rollup-test
cd rollup-test
npm init -y
```

创建两个模块文件：

`src/index.js`：

```javascript
import { add } from './utils'

function main() {
	console.log(add(1, 2))
}

export default main
```

`src/utils.js`：

```javascript
function add(a, b) {
	return a + b
}

export { add }
```

### 2. 使用 Rollup 打包

#### 安装 Rollup

```bash
npm install --save-dev rollup
```

#### 配置 Rollup

创建 `rollup.config.mjs`：

```javascript
import postcss from 'rollup-plugin-postcss'

/** @type {import("rollup").RollupOptions} */
export default {
	input: 'src/index.js',
	output: [
		{
			file: 'dist/esm.js',
			format: 'esm',
		},
		{
			file: 'dist/cjs.js',
			format: 'cjs',
		},
		{
			file: 'dist/umd.js',
			name: 'MyLibrary',
			format: 'umd',
		},
	],
	plugins: [
		postcss({
			extract: true,
			extract: 'index.css',
		}),
	],
}
```

#### 打包

```bash
npx rollup -c rollup.config.mjs
```

打包完成后，生成了三种模块规范的产物：`esm.js`、`cjs.js` 和 `umd.js`。这些文件非常简洁，没有任何多余的运行时代码。

### 3. 使用 Webpack 打包

#### 安装 Webpack

```bash
npm install --save-dev webpack-cli webpack
```

#### 配置 Webpack

创建 `webpack.config.mjs`：

```javascript
import path from 'node:path'

/** @type {import("webpack").Configuration} */
export default {
	entry: './src/index.js',
	mode: 'development',
	devtool: false,
	output: {
		path: path.resolve(import.meta.dirname, 'dist2'),
		filename: 'bundle.js',
	},
}
```

#### 打包

```bash
npx webpack-cli -c webpack.config.mjs
```

打包完成后，生成的 `bundle.js` 文件包含了大量的 Webpack 运行时代码。这些代码用于支持模块加载、按需加载等功能，虽然功能强大，但对于组件库来说显得有些冗余。

### 4. CSS 打包

组件库通常还需要打包 CSS 文件。我们分别使用 Rollup 和 Webpack 来处理 CSS。

#### Rollup 处理 CSS

安装处理 CSS 的插件：

```bash
npm install --save-dev rollup-plugin-postcss
```

在 `rollup.config.mjs` 中引入插件：

```javascript
import postcss from 'rollup-plugin-postcss'

export default {
	// ... 省略其他配置
	plugins: [
		postcss({
			extract: true,
			extract: 'index.css',
		}),
	],
}
```

打包后，CSS 文件被单独抽离出来，生成了 `index.css` 文件。

#### Webpack 处理 CSS

安装 Webpack 的 CSS 处理插件：

```bash
npm install --save-dev css-loader style-loader mini-css-extract-plugin
```

配置 Webpack：

```javascript
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default {
	// ... 省略其他配置
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'index.css',
		}),
	],
}
```

打包后，CSS 文件同样被抽离出来，生成了 `index.css` 文件。

## 为什么组件库打包选择 Rollup？

通过上面的对比，我们可以看到，Rollup 的打包产物更加简洁，没有多余的运行时代码，非常适合用于打包 JavaScript 库和组件库。具体来说，组件库的打包需求通常包括：

- **支持多种模块规范**：组件库需要同时支持 ESM、CJS 和 UMD 格式，以适应不同的使用场景。
- **Tree Shaking**：组件库通常包含多个模块，Tree Shaking 能够自动移除未使用的代码，减少打包体积。
- **CSS 文件的处理**：组件库通常还需要打包 CSS 文件，Rollup 可以通过插件轻松实现 CSS 的抽离。

而 Webpack 的强大功能（如 Code Splitting、HMR 等）更多是为浏览器应用设计的，对于组件库来说，这些功能并不必要，反而会增加打包产物的复杂性。

## 总结

Rollup 是一个轻量、简洁的打包工具，特别适合用于打包 JavaScript 库和组件库。它的打包产物没有运行时代码，支持多种模块规范，并且能够通过插件轻松处理 CSS 文件。相比之下，Webpack 更适合用于浏览器应用的打包，功能强大但产物较为复杂。

如果你正在开发一个组件库，Rollup 是一个非常好的选择。而如果你需要打包一个复杂的浏览器应用，Webpack 可能会更适合你的需求。

不管是 Rollup 还是 Webpack，它们都是前端开发中不可或缺的工具。理解它们的优劣，选择合适的工具，能够让你的开发工作事半功倍。
