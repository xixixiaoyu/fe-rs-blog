## 脚手架简介
脚手架（Scaffolding）是一种项目模板工具，旨在帮助开发者快速搭建新的项目结构，配置开发环境，以及生成一些基本的代码和文件结构。使用脚手架可以大大提高开发效率，避免重复性的工作，同时确保项目结构的一致性和遵循最佳实践。<br />脚手架工具通常提供以下功能：

1. **生成项目结构**：创建项目所需的目录和文件结构，包括配置文件、源代码目录、测试目录等。
2. **配置开发环境**：自动配置项目的开发环境，如安装依赖包、设置构建工具（如 Webpack、Babel 等）、配置代码格式化和校验工具（如 ESLint、Prettier 等）。
3. **代码生成**：根据预设模板生成基础的代码文件，如组件、服务、路由等，帮助开发者快速开始编写业务逻辑。
4. **自定义和扩展**：许多脚手架工具允许开发者根据自己的需求自定义模板和脚手架的行为，或者通过插件进行功能扩展。

现在流行的前端脚手架有：

- **Create React App**：用于快速搭建 React 应用的脚手架工具，无需配置即可开始开发。
- **Vue CLI**：Vue.js 的官方脚手架，提供了丰富的配置选项和插件系统，方便开发者搭建和维护 Vue 应用。
- **Angular CLI**：Angular 的命令行接口，用于生成、开发、测试和部署 Angular 项目。
- **Yeoman**：一个通用的脚手架系统，允许开发者创建自己的脚手架工具，支持多种前端框架和库。

脚手架的使用极大地简化了前端项目的初始搭建过程，帮助开发者专注于业务代码的编写，同时保证了项目的一致性和质量。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1702182273466-d06d9ecd-d9c6-4179-bf38-a7c1d1f8c37e.png#averageHue=%2387937e&clientId=u9b86692b-a41e-4&from=paste&height=290&id=u9b1dccb4&originHeight=766&originWidth=1586&originalType=binary&ratio=2&rotation=0&showTitle=false&size=317665&status=done&style=none&taskId=u00571de4-7e97-47e3-b12d-1eb8606e7b3&title=&width=601)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1702182295751-2756a4c2-b317-42c1-b052-3ef9a6cfdfde.png#averageHue=%23f9f2f2&clientId=u9b86692b-a41e-4&from=paste&height=237&id=u79357b0d&originHeight=574&originWidth=1650&originalType=binary&ratio=2&rotation=0&showTitle=false&size=274123&status=done&style=none&taskId=uf9b2c1aa-2f23-4e3c-a595-cc2e2cb91ad&title=&width=681)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1702182369904-9048baed-5fdf-44e5-8262-d795fe4ded9a.png#averageHue=%23faf8f8&clientId=u9b86692b-a41e-4&from=paste&height=393&id=u1b24eec3&originHeight=962&originWidth=1746&originalType=binary&ratio=2&rotation=0&showTitle=false&size=377090&status=done&style=none&taskId=u35c58e68-666b-478a-833a-0d7d3c14042&title=&width=714)<br />推荐使用 vite 作为脚手架构建工具<br />Vite 的优势：

1. **快速的服务器启动**：Vite 使用原生 ES 模块（ESM）来服务代码，这意味着它不需要预先打包代码，可以快速启动开发服务器。
2. **即时的模块热更新（HMR）**：由于 Vite 利用了 ESM 的特性，它可以实现非常快的模块热更新，这使得在开发过程中的代码更改可以几乎立即反映到浏览器上，无需等待整个应用重新打包。
3. **按需编译**：Vite 只会编译当前正在开发的页面或组件依赖的模块，这大大减少了不必要的编译工作，进一步提升了开发环境的响应速度。
4. **丰富的插件生态**：Vite 支持 Rollup 插件，这意味着你可以利用 Rollup 已有的插件生态，同时 Vite 本身也在快速发展其专属插件生态系统。
5. **内置功能丰富**：Vite 内置了对 TypeScript、JSX、CSS 预处理器等的支持，无需额外配置即可使用这些现代前端技术。
6. **优化的生产构建**：虽然 Vite 在开发环境下不需要打包代码，但它在生产环境下使用 Rollup 进行高效的代码打包，确保了生产环境的性能优化。
7. **易于配置**：Vite 提供了一个简单而强大的配置文件，使得开发者可以轻松地自定义构建过程，同时保持配置的简洁性。
8. **框架无关**：Vite 不仅可以用于 Vue 项目，还支持 React、Svelte 以及其他可以通过插件支持的框架，这使得它非常灵活。
9. **现代化**：Vite 专为现代浏览器设计，利用了最新的 web 标准，如 ES 模块，从而避免了对旧浏览器的过多兼容性处理。
10. **社区支持**：Vite 由 Vue.js 的创造者尤雨溪领导开发，得到了强大的社区支持和快速的发展迭代。

## 创建 react 项目
首先确保 Node.js 版本至少为 12.0.0。<br />然后命令行输入：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1702182995100-34f074de-3253-451f-bb11-a4b258ece970.png#averageHue=%23fbf4e1&clientId=u9b86692b-a41e-4&from=paste&height=376&id=u2085d955&originHeight=1416&originWidth=2468&originalType=binary&ratio=2&rotation=0&showTitle=false&size=338968&status=done&style=none&taskId=ub37147e4-4267-4bd6-b371-d67d5682b0a&title=&width=655)<br />进入目录，安装依赖后：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1702183202756-d9a288dc-940e-49b1-a6f8-04f279e1a02a.png#averageHue=%233c4146&clientId=u9b86692b-a41e-4&from=paste&height=441&id=ue1c7659f&originHeight=882&originWidth=348&originalType=binary&ratio=2&rotation=0&showTitle=false&size=71699&status=done&style=none&taskId=u0612ff58-3c07-4c29-95dd-af2ca01f5cb&title=&width=174)

1. node_modules：这个目录包含所有项目依赖的库和模块。当你运行 npm install 或 pnpm install 时，这些依赖会被安装在这个目录下。
2. public：通常用来存放静态资源，比如 HTML 文件、图像、字体等，这些资源在构建过程中通常不会被修改。
3. src：这是源代码目录，包含了项目的主要开发文件。
   - assets：用来存放项目中使用的静态资源文件，如图片、样式文件等。
   - App.css：这是React组件App的样式表。
   - App.tsx：这是一个 TypeScript 文件，定义了 React 的 App 组件。
   - index.css：这个样式表通常用于定义全局或常用的 CSS 样式。
   - main.tsx：这是项目的入口文件，它引导应用程序的渲染。
   - vite-env.d.ts：TypeScript 声明文件，包含 Vite 相关的类型定义，用于支持 TypeScript 的类型检查。
   - .eslintrc.cjs：ESLint 的配置文件，用于定义代码质量和风格规则。
   - .gitignore：Git 的配置文件，指定了不需要加入版本控制的文件和目录。
   - index.html：应用程序的 HTML 骨架文件，通常包含挂载点，如 `<div id="app"></div>`。
   - package.json：定义了项目的元数据和依赖关系，以及可执行的脚本命令。
   - pnpm-lock.yaml：锁文件，确保依赖项的版本一致性，这表明项目使用 pnpm 作为包管理器。
   - README.md：Markdown 文件，通常包含项目说明、安装步骤和使用指南。
   - tsconfig.json：TypeScript 的编译选项配置文件。
   - tsconfig.node.json：可能是为 Node 环境定制的 TypeScript 编译选项配置文件。
   - vite.config.ts：Vite 的配置文件，用于定制 Vite 构建工具的行为，如插件、服务端渲染等。

## react hooks 最佳实践方法
### 组件发展趋势
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1702183750627-04a5490f-a871-4415-b6f3-867909b8a861.png#averageHue=%23fbedeb&clientId=uf2df948b-b0a8-4&from=paste&height=142&id=ub1a71804&originHeight=284&originWidth=1560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=177187&status=done&style=none&taskId=ud5eeb491-23f9-47f3-881d-86da80a4180&title=&width=780)

1. **类组件（Class Component）**：这是 React 等前端框架早期的组件编写方式。类组件是使用 ES6 的类语法定义的，并且通常包含了生命周期方法（如componentDidMount，componentDidUpdate，componentWillUnmount等），状态（state），以及其他逻辑。类组件可以使用 this 关键字来访问组件实例的属性和方法。
2. **函数组件（Function Component）**：随着 React 16.8 的更新，函数组件的能力得到了极大的扩展，特别是通过引入了 Hooks。函数组件是使用普通 JavaScript 函数或箭头函数定义的，它们可以接收 props 作为参数，返回需要渲染的 React 元素。在引入 Hooks 之前，函数组件通常被认为是无状态的，只能用于呈现 UI，不能持有状态或执行副作用。
3. **钩子（Hooks）**：Hooks 是 React 16.8 中引入的新特性，它允许函数组件使用状态（通过 useState）和其他 React 特性（如生命周期特性，通过 useEffect等）。Hooks 的引入使得函数组件的能力与类组件相当，甚至更加灵活和强大。

现在前端 UI 编程，更倾向使用函数组合的方式。

### 一个典型组件应该包含什么

1. useState 为主的状态管理
2. useEffect 为主的副作用管理
3. useCallback 为主的事件 handler
4. UI 部分
5. 转换函数：用于请求返回数据的转换，或者一些不具有通用性的工具函数

### 如何拆分组件功能模块
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1702184096323-74247aed-1fd5-486a-9150-c88a70b2ca28.png#averageHue=%23f7f7f7&clientId=uf2df948b-b0a8-4&from=paste&height=135&id=ufc41cc68&originHeight=270&originWidth=1144&originalType=binary&ratio=2&rotation=0&showTitle=false&size=114620&status=done&style=none&taskId=u52462d10-7ef9-4d94-b09d-d43e9eafd82&title=&width=572)

1. hooks.js —— 该文件用于定义组件内部使用的自定义 hooks，这些 hooks 可以处理状态逻辑或副作用。
```jsx
// hooks.js
import { useState, useEffect } from 'react';

export function useCustomHook() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // 副作用逻辑，例如数据获取
    fetchData().then(data => {
      setState(data);
    });
  }, []);

  return state;
}

async function fetchData() {
  // 假设的数据获取函数
  return { data: 'sample data' };
}
```
handler.js —— 该文件包含不依赖于 hooks 的纯函数处理逻辑，比如事件处理器或者数据格式化函数。
```jsx
// handler.js
export function formatData(data) {
  // 对数据进行格式化
  return data.toUpperCase();
}

export function handleSubmit(event) {
  // 处理提交事件
  event.preventDefault();
  // 实际的提交逻辑
}
```
index.js —— 主组件文件，用于组装 hooks 和 handlers，并提供UI。
```jsx
// index.js
import React from 'react';
import { useCustomHook } from './hooks';
import { formatData, handleSubmit } from './handler';
import './index.css';

function MyComponent() {
  const data = useCustomHook();

  return (
    <div className="my-component">
      <form onSubmit={handleSubmit}>
        <input type="text" value={formatData(data)} readOnly />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default MyComponent;
```

1. index.css —— 包含组件的样式，确保组件的外观和样式隔离。
```css
/* index.css */
.my-component {
  border: 1px solid #ddd;
  padding: 20px;
}

.my-component input {
  margin-bottom: 10px;
}

.my-component button {
  background-color: blue;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}
```
通过这种方式，我们可以将组件的逻辑、样式和状态管理分离开来，使得代码更加模块化和可维护。每个文件都有明确的职责，这样也便于团队协作和单元测试。<br />这也符合编码价值观 ETC（让你的代码易于变更。Easier To Change，简称 ETC。）

自定义 Hooks 是一种自然遵循 React Hooks 设计的函数，它们可以让你在函数组件中钩入 React 的状态及生命周期特性。下面我将分别为你介绍如何实现 `useMount`、`useUnmount`、`useLatest` 和 `useRequest` 这四个自定义 Hooks。


## 写几个自定义 hooks
### useMount
`useMount` 是一个在组件初次渲染时执行一次的 Hook。它类似于 `componentDidMount` 生命周期方法。
```typescript
import { useEffect } from 'react';

/**
 * 组件加载时运行
 * @param fn
 */
const useMount = (fn: () => void) => {
  useEffect(() => {
    fn?.();
  }, []);
};

export default useMount;
```

### useUnmount
`useUnmount` 是一个在组件卸载时执行的 Hook，类似于 `componentWillUnmount` 生命周期方法。
```typescript
import { useEffect } from 'react';
import useLatest from './useLatest';

/**
 * 组件卸载时运行
 * @param fn
 */
const useUnmount = (fn: () => void) => {
  const fnRef = useLatest(fn);
  useEffect(() => () => fnRef.current(), []);
};

export default useUnmount;
```

### useLatest
`useLatest` 是一个用于始终获取最新的值或函数的 Hook，无论这些值或函数何时何地更新。
```typescript
import { useRef } from 'react';

/**
 * 获取最新 value
 */
const useLatest = <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export default useLatest;
```

### useRequest
`useRequest` 是一个用于处理异步请求的 Hook，它可以管理请求的生命周期，如加载状态、结果、错误处理等。
```typescript
import { useCallback, useState } from 'react';
import useMount from './useMount';

interface IOptions {
	params: Record<string, string>;
	manual?: boolean;
	onSuccess?: (res: unknown) => void;
	onError?: (err: unknown) => void;
}

/**
 * 1 实现组件初始化，发送请求获取数据
 * 2 手动触发请求
 */
const useRequest = (
	service: (params: Record<string, string>) => Promise<unknown>,
	options: IOptions
) => {
	const [data, setData] = useState<unknown>();
	const [loading, setLoading] = useState<boolean>(false);

	const init = useCallback(
		(curParams: Record<string, string>) => {
			setLoading(true);
			return service(curParams)
				.then(res => {
					setData(res);
					if (options.onSuccess) {
						options.onSuccess(res);
					}
				})
				.catch(error => {
					if (options.onError) {
						options.onError(error);
					}
				})
				.finally(() => {
					setLoading(false);
				});
		},
		[service]
	);

	useMount(() => {
		if (!options.manual) {
			init(options.params);
		}
	});

	const run = (runParams: Record<string, string>) => init(runParams);

	return { loading, data, run };
};

export default useRequest;
```
注意这些 hooks 使用时要放在组件函数的顶层，不能放在循环判断里面执行。

## 实现 ESLint 规范
安装：
```bash
pnpm i eslint eslint-config-airbnb eslint-config-airbnb-typescript eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin -D
```
创建 `.eslintrc.cjs`：
```javascript
module.exports = {
	// 设置 ESLint 配置为基础配置
	root: true,
	// 继承一系列 ESLint 规则集
	extends: [
		// 引入 Airbnb 的 ESLint 规则
		require.resolve('eslint-config-airbnb'),
		// 引入 Airbnb 的 React Hooks ESLint 规则
		require.resolve('eslint-config-airbnb/hooks'),
		// 引入 Airbnb 的 TypeScript ESLint 规则
		require.resolve('eslint-config-airbnb-typescript'),
	],
	// 自定义规则配置
	rules: {
		// 关闭对函数组件定义方式的限制
		'react/function-component-definition': 0,
		// 关闭必须在 JSX 文件中导入 React 的规则
		'react/react-in-jsx-scope': 0,
		// 关闭对使用默认导出的偏好规则
		'import/prefer-default-export': 0,
		// 将 React Hooks 的依赖项检查规则设置为警告级别
		'react-hooks/exhaustive-deps': 1,
		// 关闭禁止使用制表符的检查。
		'no-tabs': 0,
		// 关闭规则，不进行逗号末尾的检查。
		'@typescript-eslint/comma-dangle': 0,
		'react/jsx-wrap-multilines': 0,
		// 关闭 TypeScript 文件中的缩进规则检查
		'@typescript-eslint/indent': 0,
		'react/jsx-indent': 0,
		'react/jsx-indent-props': 0,
	},
	// 指定 ESLint 的解析器为 TypeScript 的解析器
	parser: require.resolve('@typescript-eslint/parser'),
	// 配置解析器选项
	parserOptions: {
		// 指定 TypeScript 的配置文件路径
		project: require.resolve('./tsconfig.json'),
	},
	// 配置 ESLint 的环境设置
	settings: {
		react: {
			// 自动检测 React 的版本
			version: 'detect',
		},
	},
};
```
vite 支持 eslint：
```markdown
pnpm i vite-plugin-eslint -D
```
vite.config.ts：
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), eslint()]
});
```
