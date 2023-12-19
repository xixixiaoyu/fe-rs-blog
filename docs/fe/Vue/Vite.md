## 1.Vite 介绍

> Webpack 是目前整个前端使用最多的构建工具
>
> 但是除了 webpack 之后也有其他的一些构建工具，比如 rollup、parcel、gulp、vite 等等
>
> 我们知道在实际开发中，我们编写的比如 TypeScript、Vue 文件是不能被浏览器直接识别的
>
> 所以我们必须通过构建工具来对代码进行转换、编译
>
> 但是随着项目代码越来越多，处理的越多，构建工作需要很久才能开启服务器，HMR 也需要几秒才能反应
>
> 所以也有这样的说法：天下苦 webpack 久矣；
>
> 那什么是 Vite 呢？官方的定位：下一代前端开发与构建工具
>
> Vite (法语意为 "快速的"，发音 /vit/) 是一种新型前端构建工具，能够显著提升前端开发体验
>
> 优势：开发环境下使用 ES6 Module 无需打包，启动快，而且会对安装的依赖预打包
>
> 生产环境使用 rollup ，并不会快很多

![image-20220127160800732](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220127160800732.png)

## 2.Vite 的构造和特点

它主要由两部分组成

- 一个开发服务器，它基于原生 ES 模块提供了丰富的内建功能，HMR 的速度非常快速，会立即编译当前所修改的文件
- 一套构建指令，它使用 rollup 打开我们的代码，并且它是预配置的，可以输出生成环境的优化过的静态资源

实际上浏览器原生就支持模块化，可以使用`<script src="./src/main.js" type="module"></script>`

但是如果不借助其他工具，原生模块化也有一些弊端，比如对于浏览器请求频繁以及不能直接识别 TypeScript、less、vue 等代码

这也就是 Vite 想帮我们解决的事情

### Vite serve

在执行`vite serve`的时候不需要打包，直接开启一个 web 服务器，当浏览器请求服务器，比如请求一个单文件组件，这个时候在服务器端编译单文件组件，然后把编译的结果返回给浏览器，注意这里的编译是在服务器端，另外模块的处理是在请求到服务器端处理的。

![image-20220127142607613](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220127142607613.png)

### vue-cli-service serve

当运行 vue-cli-service serve 的时候，它内部会使用 webpack，首先去打包所有的模块，如果模块数量比较多的话，打包速度会非常的慢，把打包的结果存储到内存中，然后才会开启开发的 web 服务器，浏览器请求 web 服务器，把内存中打包的结果直接返回给浏览器，像 webpack 这种工具，它的做法是将所有的模块提前编译打包进 bundle 里，也就是不管模块是否被执行，是否使用到，都要被编译和打包到 bundle。随着项目越来越大，打包后的 bundle 也越来越大，打包的速度自然也就越来越慢。

![image-20220127142641667](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220127142641667.png)

Vite 利用现代浏览器原生支持的 ESModule 这个模块化的特性省略了对模块的打包，对于需要编译的文件，比如单文件组件、样式模块等，vite 采用的另一种模式即时编译，也就是说只有具体去请求某个文件的时候，才会在服务端编译这个文件，所以这种即时编译的好处主要体现在按需编译，速度会更快。

### Vite 特点

- 快速冷启动
- 模块热更新
- 按需编译
- 开箱即用
  - TypeScript - 内置支持
  - less/sass/stylus/postcss - 内置支持（需要单独安装）
  - JSX
  - Web Assembly

Vite 未来个人很看好，但是目前支持不够完善

## 3.Vite 的安装和使用

安装 vite 工具：

```shell
npm install vite –g # 全局安装
npm install vite –D # 局部安装
```

通过 vite 来启动项目：

```shell
npx vite
```

注意：Vite 本身也是依赖 Node 的，所以也需要安装好 Node 环境，并且要求 Node 版本是大于 12 版本

## 4.Vite 对 css 的支持

vite 可以直接支持 css 的处理

- vite 可以直接支持 css 的处理

vite 可以直接支持 css 预处理器，比如 less

- 直接导入 less
- 之后安装 less 编译器 `npm install less -D`

vite 直接支持 postcss 的转换

- 只需要安装 postcss，并且配置 `postcss.config.js` 的配置文件即可
- `npm install postcss postcss-preset-env -D`

![image-20220127004558274](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220127004558274.png)

## 5.Vite 对 TypeScript 的支持

vite 对 TypeScript 是原生支持的，直接导入即可，它会直接使用 ESBuild 来完成编译

如果我们查看浏览器中的请求，会发现请求的依然是 ts 的代码

- 这是因为 vite 中的服务器 Connect 会对我们的请求进行转发
- 获取 ts 编译后的代码，返回给浏览器，浏览器就可以直接进行解析

注意：在 vite2 中，已经不再使用 Koa 了，而是使用 Connect 来搭建的服务器

![image-20220127004734429](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220127004734429.png)

## 6.Vite 对 vue 的支持

vite 对 vue 提供第一优先级支持：

- Vue 3 单文件组件支持：[vite/packages/plugin-vue at main · vitejs/vite (github.com)](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)
- Vue 3 JSX 支持：[vite/packages/plugin-vue-jsx at main · vitejs/vite (github.com)](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx)
- Vue 2 支持：[underfin/vite-plugin-vue2: Vue2 plugin for Vite (github.com)](https://github.com/underfin/vite-plugin-vue2)

安装 Vue：

`npm install vue@next -D`

安装支持 vue 的插件：

`npm install @vitejs/plugin-vue -D`

`npm install @vue/compiler-sfc -D`

在`vite.config.js`中配置插件：

![image-20220127005018569](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220127005018569.png)

## 7.Vite 打包项

我们可以直接通过 vite build 来完成对当前项目的打包工具：`npx vite build`

![image-20220127005054170](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220127005054170.png)

我们可以通过 preview 的方式，开启一个本地服务来预览打包后的效果：`npx vite preview`

可以配置对应 npm 命令

![image-20220127013701403](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220127013701403.png)

## 8.ESBuild 解析

### ESBuild 的特点

- 超快的构建速度，并且不需要缓存
- 支持 ES6 和 CommonJS 的模块化
- 支持 ES6 的 Tree Shaking
- 支持 Go、JavaScript 的 API
- 支持 TypeScript、JSX 等语法编译
- 支持 SourceMap
- 支持代码压缩
- 支持扩展其他插件

### ESBuild 的构建速度

ESBuild 的构建速度和其他构建工具速度对比：

![image-20220127005244302](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220127005244302.png)

ESBuild 为什么这么快呢？

- ESBuild 所有内容使用 Go 语言从零开始编写的，而不是使用第三方，可以直接转换成机器代码，而无需经过字节码
- ESBuild 可以充分利用 CPU 的多内核，尽可能让它们饱和运行

## 9.Vite 脚手架工具

在开发中，我们不可能所有的项目都使用 vite 从零去搭建，比如一个 react 项目、Vue 项目

这个时候 vite 还给我们提供了对应的脚手架工具

所以 Vite 实际上是有两个工具的：

1. vite：相当于是一个构建工具，类似于 webpack、rollup
2. @vitejs/create-app：类似 vue-cli、create-react-app

使用脚手架工具

```shell
## 创建工程
npm init vite-app <project-name>
## 进入工程目录
cd <project-name>
## 安装依赖
npm install
## 运行
npm run dev
```

`npm init vite-app <project-name>`的做法相当于省略了安装脚手架的过程

```shell
npm install @vitejs/create-app -g
create-app projectname
```

## 10.Vite 原理实现

Vite 核心功能

- 静态 web 服务器
- 编译单文件组件：拦截浏览器不识别的模块，并处理
- HMR

思路

1. 修改第三方模块的路径

首先加载第三方模块中的 import 中的路径改变，改成加载`@modules/模块文件名`

2. 加载第三方模块

当请求过来之后，判断请求路径中是否以`@modules`开头，如果是的话，去 node_modules 加载对应的模块

3. 编译单文件组件

发送两次请求，第一次请求是把单文件组件编译成一个对象，第二次请求是编译单文件组件的模板，返回一个 render 函数，并且把 render 函数挂载到对象的 render 方法上。

最终代码：

```js
#!/usr/bin/env node
const path = require("path");
const { Readable } = require("stream");
const Koa = require("koa");
const send = require("koa-send");
const compilerSFC = require("@vue/compiler-sfc");

const app = new Koa();

// 将流转化成字符串
const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });

// 将字符串转化成流
const stringToStream = (text) => {
  const stream = new Readable();
  stream.push(text);
  stream.push(null);
  return stream;
};

// 3. 加载第三方模块。判断请求路径中是否以`@modules`开头，如果是的话，去node_modules加载对应的模块
app.use(async (ctx, next) => {
  // ctx.path --> /@modules/vue
  if (ctx.path.startsWith("/@modules/")) {
    const moduleName = ctx.path.substr(10);
    const pkgPath = path.join(process.cwd(), "node_modules", moduleName, "package.json");
    const pkg = require(pkgPath);
    ctx.path = path.join("/node_modules", moduleName, pkg.module);
  }
  await next();
});

// 1. 开启静态文件服务器
app.use(async (ctx, next) => {
  await send(ctx, ctx.path, {
    root: process.cwd(),
    index: "index.html",
  });
  await next();
});

// 4. 处理单文件组件
app.use(async (ctx, next) => {
  if (ctx.path.endsWith(".vue")) {
    const contents = await streamToString(ctx.body);
    const { descriptor } = compilerSFC.parse(contents); // 返回一个对象，成员descriptor、errors
    let code;
    if (!ctx.query.type) {
      // 第一次请求，把单文件组件编译成一个对象
      code = descriptor.script.content;
      // console.log('code', code)
      code = code.replace(/export\s+default\s+/g, "const __script = ");
      code += `
import { render as __render } from "${ctx.path}?type=template"
__script.render = __render
export default __script
      `;
    } else if (ctx.query.type === "template") {
      const templateRender = compilerSFC.compileTemplate({ source: descriptor.template.content });
      code = templateRender.code;
    }
    ctx.type = "application/javascript";
    ctx.body = stringToStream(code); // 转化成流
  }
  await next();
});

// 2. 修改第三方模块的路径
app.use(async (ctx, next) => {
  if (ctx.type === "application/javascript") {
    const contents = await streamToString(ctx.body);
    // import vue from 'vue'
    // import App from './App.vue'
    ctx.body = contents
      .replace(/(from\s+['"])(?![\.\/])/g, "$1/@modules/") // 分组匹配，第一个分组中，from原样匹配form，\s+匹配一至多个空格，['"]匹配单引号或双引号。第二个分组中，?!标识不匹配这个分组的结果,也就是排除点开头或者\开头的情况
      .replace(/process\.env\.NODE_ENV/g, '"development"'); // 替换process对象
  }
});

app.listen(4000);
console.log("Server running @ http://localhost:4000");
```

使用时先将 cli 项目 link 到全局，`npm link`

然后在 vue3 项目中执行`my-vite-cli`运行项目。将 vue3 中的图片和样式模块导入代码注释掉
