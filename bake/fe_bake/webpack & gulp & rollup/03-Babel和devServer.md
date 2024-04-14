## 1.Babel

> Babal 平时开发感知不强，但是对于前端开发是不可缺少的一部分
>
> 我们想要使用 ES6+的语法，想要使用 TypeScript，开发 React 项目，它们都是离不开 Babel 的
>
> Babel 是一个工具链，主要用于旧浏览器或者环境中将 ECMAScript 2015+代码转换为向后兼容版本的 JavaScript，包括：语法转换、源代码转换等

### 1.1.Babel 命令行使用

> babel 本身可以作为一个独立的工具（和 postcss 一样），不和 webpack 等构建工具配置来单独使用
>
> 如果我们希望在命令行尝试使用 babel，需要安装如下库：
>
> - @babel/core：babel 的核心代码，必须安装
> - @babel/cli：可以让我们在命令行使用 babel
>
> ```shell
> npm install @babel/cli @babel/core -D
> ```
>
> 使用 babel 来处理我们的源代码：
>
> - src：是源文件的目录
> - --out-dir：指定要输出的文件夹 dist
>
> ```shell
> npx babel src --out-dir dist
> ```

### 1.2.插件的使用

比如我们需要转换箭头函数，那么我们就可以使用箭头函数转换相关的插件：

```shell
npm install @babel/plugin-transform-arrow-functions -D
npx babel src --out-dir dist --plugins=@babel/plugin-transform-arrow-functions
```

查看转换后的结果：我们会发现 const 并没有转成 var

这是因为 `plugin-transform-arrow-functions`，并没有提供这样的功能，我们需要使用 `plugin-transform-block-scoping` 来完成这样的功能

```shell
npm install @babel/plugin-transform-block-scoping -D
npx babel src --out-dir dist --plugins=@babel/plugin-transform-block-scoping
,@babel/plugin-transform-arrow-functions
```

### 1.3.Babel 的预设 preset

> 如果要转换的内容过多，一个个设置是比较麻烦的，我们可以使用预设（preset）
>
> 安装@babel/preset-env 预设： `npm install @babel/preset-env -D`
>
> 执行命令： `npx babel src --out-dir dist --presets=@babel/preset-env`

### 1.4.Babel 底层编译器执行原理

> babel 实际就是一个编译器
>
> Babel 编译器的作用就是将我们的源代码，转换成浏览器可以直接识别的另外一段源代码
>
> Babel 也拥有编译器的工作流程：
>
> - 解析阶段（Parsing）
> - 转换阶段（Transformation）
> - 生成阶段（Code Generation）

Babel 的执行阶段：

![image-20220130154153725](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130154153725.png)

当然上面简化版的编译器工具流程，在每个阶段又会有自己具体的工作

### 1.5.babel-loader

> 通常开发中我们可能会通过 Webpack 配置 loader 对其进行使用
>
> 安装相关依赖：`npm install babel-loader @babel/core`

设置一个规则，在加载 js 文件时，使用我们的 babel：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130154718917.png" alt="image-20220130154718917" style="zoom:50%;" />

### 1.6.babel-preset

> 上面配置 loader 可能需要管理大量的插件
>
> 我们可以直接给 webpack 提供一个 `preset`
>
> webpack 会根据我们的预设来加载对应的插件列表，并且将其传递给 babel
>
> 比如常见的预设有三个：
>
> - env
> - react
> - TypeScript
>
> 安装 preset-env：`npm install @babel/preset-env`

配置对应 preset：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130155117798.png" alt="image-20220130155117798" style="zoom:50%;" />

### 1.7.Babel 的配置文件

> 我们可以将 babel 的配置信息放到一个独立的文件中，babel 给我们提供了两种配置文件的编写
>
> 1. babel.config.json（或者.js，.cjs，.mjs）文件，可以直接作用于 Monorepos 项目的子包，更加推荐
> 2. .babelrc.json（或者.babelrc，.js，.cjs，.mjs）文件，早期使用较多的配置方式，但是对于配置 Monorepos 项目是比较麻烦的

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130155535181.png" alt="image-20220130155535181" style="zoom: 67%;" />

## 2.Webpack 打包 Vue

引入 Vue：`npm install vue@next`

那如果我们用上面的代码打包 Vue 会发生什么呢？

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130164219417.png" alt="image-20220130164219417" style="zoom:50%;" />

界面不会有效果，并且控制台会出现警告信息

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130164516689.png" alt="image-20220130164516689" style="zoom:67%;" />

### 2.1.Vue 打包后不同版本解析

> vue(.runtime).global(.prod).js：
>
> - 通过浏览器中的 `<script src = "">` 直接使用
> - 我们之前通过 CDN 引入和下载的 Vue 版本就是这个版本
> - 会暴露一个全局的 Vue 来使用
>
> vue(.runtime).esm-browser(.prod).js：
>
> - 用于通过原生 ES 模块导入使用（在浏览器中通过 `<script type="module">`）
>
> vue(.runtime).esm-bundler.js：
>
> - 用于 webpack，rollup 和 parcel 等构建工具
> - 构建工具中默认是 vue.runtime.esm-bundler.js
> - 如果我们需要解析模板 template，那么需要手动指定 vue.esm-bundler.js
>
> vue.cjs(.prod).js：
>
> - 服务器端渲染使用
> - 通过 require()在 Node.js 中使用

#### 运行时+编译器 vs 仅运行时

Vue 会有三种方式编写 DOM 元素

1. `template`模板的方式（之前经常使用的方式）
2. 通过.vue 文件中的 template 来编写模板
3. render 函数的方式，使用 h 函数来编写渲染的内容

- 方式一和二中都需要特定的代码来对其进行解析

  - 方式一中 template 我们必须要通过源码中一部分代码来进行编译

  - 方式二中 vue 文件中的 template 可以通过在 vue-loader 对其进行编译和处理

- 方式三中通过 h 函数可以直接返回一个虚拟节点，也就是 Vnode 节点；

Vue 在让我们选择版本的时候分为 运行时+编译器 vs 仅运行时

- 运行时+编译器包含了对 template 模板的编译代码，更加完整，但是也更大一些
- 仅运行时没有包含对 template 版本的编译代码，相对更小一些

### 2.2.VSCode 对 SFC 文件的支持

> 真实开发中我们都是使用 SFC（ single-file components (单文件组件) ）
>
> VSCode 对 SFC 的支持：
>
> 1. Vetur，从 Vue2 开发就一直在使用的 VSCode 支持 Vue 的插件
> 2. Volar，官方推荐的插件

### 2.3.编写 SFC 文件

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130170437232.png" alt="image-20220130170437232" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130170501116.png" alt="image-20220130170501116" style="zoom:67%;" />

打包的时候会出错

我们需要合适的 loader 来帮助我们处理文件

我们安装 vue-loader：

```shell
npm install vue-loader -D
```

并在 webpack 的模板规则中进行配置：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130170634134.png" alt="image-20220130170634134" style="zoom:67%;" />

并且我还需要添加`@vue/compiler-sfc`来对 template 进行解析

```shell
npm install @vue/compiler-sfc -D
```

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130170937739.png" alt="image-20220130170937739" style="zoom:50%;" />

重新打包即可支持.vue 文件的写法

#### 全局标识的配置

控制台依然会有一个警告

![image-20220130172630022](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130172630022.png)

这是两个特性的标识，一个是使用 Vue 的 Options，一个是 Production 模式下是否支持 devtools 工具

虽然他们都有默认值，但是强烈建议我们手动对他们进行配置

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130172714023.png" alt="image-20220130172714023" style="zoom:67%;" />

## 3.搭建本地服务器

> 目前运行代码的操作
>
> 1. npm run build，编译相关的代码
> 2. 通过 live server 或者直接通过浏览器，打开 index.html 代码，查看效果
>
> 但是这个操作比较琐碎，我们希望可以做到，当文件发生变化时，可以自动的完成编译和展示
>
> 为了完成自动编译，webpack 提供了几种可选的方式
>
> - webpack watch mode
> - webpack-dev-server（常用）
> - webpack-dev-middleware

### 3.1.Webpack watch

> webpack 给我们提供了 watch 模式：
>
> - 在该模式下，webpack 依赖图中的所有文件，只要有一个发生了更新，那么代码将被重新编译
> - 而且我们不需要手动去运行 npm run build 指令了
>
> 开启 watch 的两种方式：
>
> 1. 在导出的配置中，添加 `watch: true`
> 2. 在启动 webpack 的命令中，添加` --watch`的标识

在 package.json 的 scripts 中添加一个 watch 的脚本：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130171846189.png" alt="image-20220130171846189" style="zoom:67%;" />

也可也在 webpack.config.js 配置

![image-20220130173532502](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130173532502.png)

### 3.2.webpack-dev-server

> 上面的方式可以监听文件变化，但是不能自动刷新浏览器
>
> 我们可以使用 webpack-dev-server
>
> 安装：`npm install webpack-dev-server -D`

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130181321871.png" alt="image-20220130181321871" style="zoom: 67%;" />

webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中开启了 express 服务端让浏览器读取资源，内部使用 memfs 的库

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130180119853.png" alt="image-20220130180119853" style="zoom:67%;" />

![image-20220130232751370](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130232751370.png)

#### 模块热替换（HMR）

> HMR 的全称是`Hot Module Replacement`，翻译为模块热替换
>
> 模块热替换是指在 应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个页面
>
> HMR 通过如下几种方式，来提高开发的速度：
>
> - 不重新加载整个页面，只更新需要变化的内容，这样可以保留某些应用程序的状态不丢失，提高刷新速度
> - 修改了 css、js 源代码，会立即在浏览器更新，相当于直接在浏览器的 devtools 中直接修改样式
>
> 默认 webpack-dev-server 已经支持 HMR，我们只需要开启即可
>
> 在不开启 HMR 的情况下，当我们修改了源代码之后，整个页面会自动刷新，使用的是`live reloading`

##### 开启 HMR

修改 webpack 的配置：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130181405471.png" alt="image-20220130181405471" style="zoom:67%;" />

我们还需要去指定哪些模块发生更新使用 HMR，不然依然会刷新整个页面

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130181513641.png" alt="image-20220130181513641" style="zoom:67%;" />

##### 框架的 HMR

> 当我们如开发 Vue、React 项目，我们修改了组件，希望进行热更新，会向上面一样去写入 module.hot.accpet 相关的 API 呢？
>
> 实际 Vue 开发中我们使用 vue-loader，此 loader 支持 vue 组件的 HMR，提供开箱即用的体验
>
> react 开发中，有 react-refresh，实时调整 react 组件

##### HMR 的原理

> HMR 如何做到只更新指定模板的内容的呢？
>
> webpack-dev-server 会创建两个服务：提供静态资源的服务（express）和 Socket 服务（net.Socket）
>
> `express server`负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
>
> `HMR Socket Server`，是一个 socket 的长连接：
>
> - 长连接有一个最好的好处是建立连接后双方可以通信（服务器可以直接发送文件到客户端）
> - 当服务器监听到对应的模块发生变化时，会生成两个文件.json（manifest 文件）和.js 文件（update chunk）
> - 通过长连接，可以直接将这两个文件主动发送给客户端（浏览器）
> - 浏览器拿到两个新的文件后，通过 HMR runtime 机制，加载这两个文件，并且针对修改的模块进行更新

![image-20220130182704009](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130182704009.png)

#### hotOnly、host 配置

> host 设置主机地址默认是 localhost
>
> localhost：本质上是一个域名，通常情况下会被解析成 127.0.0.1
>
> 如果希望其他地方也可以访问，可以设置为 0.0.0.0
>
> localhost（127.0.0.1） 和 0.0.0.0 的区别：
>
> - 127.0.0.1：回环地址(Loop Back Address)，表达的意思其实是我们主机自己发出去的包，直接被自己接收
>   - 正常的数据库包经常 应用层 - 传输层 - 网络层 - 数据链路层 - 物理层
>   - 而回环地址，是在网络层直接就被获取到了，是不会经常数据链路层和物理层的
>   - 比如我们监听 127.0.0.1 时，在同一个网段下的主机中，通过 ip 地址是不能访问的
> - 0.0.0.0：监听 IPV4 上所有的地址，再根据端口找到不同的应用程序
>   - 比如我们监听 0.0.0.0 时，在同一个网段下的主机中，通过 ip 地址是可以访问的

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130185013658.png" alt="image-20220130185013658" style="zoom:50%;" />

#### port、open、compress

> `port`设置监听的端口，默认情况下是 8080
>
> `open`是否打开浏览器，默认为 false，设置 true 自动打开浏览器，也可以设置 Google Chrome 等值
>
> `compress`是否为静态文件开启 gzip compression，默认值是 false，可以设置为 true

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130192313288.png" alt="image-20220130192313288" style="zoom: 67%;" />

### 3.3. vue.config.js 配置文件

1. 使用 vue inspect > output.js 可以查看到 Vue 脚手架的默认配置。
2. 使用 vue.config.js 可以对脚手架进行个性化定制，详情见：[https://cli.vuejs.org/zh](https://gitee.com/link?target=https%3A%2F%2Fcli.vuejs.org%2Fzh)

### 3.4.脚手架 Proxy 代理

> proxy 是我们开发中非常常用的一个配置选项，它的目的设置代理来解决跨域访问的问题
>
> 那么我们可以将请求先发送到一个代理服务器，代理服务器和 API 服务器本身是没有跨域的问题
>
> 我们可以进行如下的设置：
>
> - `target`：表示的是代理到的目标地址，比如 /api 会被代理到 http://localhost:8888/api/abc
> - `pathRewrite`：默认情况下，我们的/api 也会被写入到 URL 中，如果希望删除，可以使用 pathRewrite
> - `secure`：默认情况下不接收转发到 https 的服务器上，如果希望支持，可以设置为 false
> - `changeOrigin`：它表示是否更新代理后请求的 headers 中 host 地址

#### 方法一

在 vue.config.js 中添加如下配置：

```js
devServer: {
  proxy: "http://localhost:5000";
}
```

说明：

1. 优点：配置简单，请求资源时直接发给前端（8080）即可
2. 缺点：不能配置多个代理，不能灵活的控制请求是否走代理
3. 工作方式：若按照上述配置代理，当请求了前端不存在的资源时，那么该请求会转发给服务器 （优先匹配前端资源

#### 方法二：

编写 vue.config.js 配置具体代理规则：

```js
module.exports = {
  devServer: {
    proxy: {
      "/api1": {
        // 匹配所有以 '/api1'开头的请求路径
        target: "http://localhost:5000", // 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: { "^/api1": "" },
      },
      "/api2": {
        // 匹配所有以 '/api2'开头的请求路径
        target: "http://localhost:5001", // 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: { "^/api2": "" },
      },
    },
  },
};
/*
   changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
   changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:8080
   changeOrigin默认值为true
*/
```

说明：

1. 优点：可以配置多个代理，且可以灵活的控制请求是否走代理
2. 缺点：配置略微繁琐，请求资源时必须加前缀

### 3.5.historyApiFallback

> historyApiFallback 是开发中一个非常常见的属性，它主要的作用是解决 SPA 页面在路由跳转之后，进行页面刷新 时，返回 404 的错误
>
> 默认是 false，如果设置为 true，那么在刷新时，返回 404 错误时，会自动返回 index.html 的内容
>
> 如果是 object 类型的值，可以配置 rewrites 属性中 from 来匹配路径，决定要跳转到哪一个页面
>
> 事实上 devServer 中实现 historyApiFallback 功能是通过 connect-history-api-fallback 库的
>
> 可以查看[connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback) 文档

![image-20220130213239290](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130213239290.png)

### 3.6.resolve 模块解析

> 在开发中我们会有各种各样的模块依赖，这些模块可能来自于自己编写的代码，也可能来自第三方库
>
> resolve 可以帮助 webpack 从每个 require/import 语句中，找到需要引入到合适的模块代码
>
> webpack 使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve)来解析文件路径
>
> webpack 能解析三种文件路径：
>
> - 绝对路径
>   - 由于已经获得文件的绝对路径，因此不需要再做进一步解析
> - 相对路径
>   - 在这种情况下，使用 import 或 require 的资源文件所处的目录，被认为是上下文目录
>   - 在 import/require 中给定的相对路径，会拼接此上下文路径，来生成模块的绝对路径
> - 模块路径
>   - 在 resolve 属性里有 modules 中指定的所有目录检索模块，默认值是 ['node_modules']，所以默认会从 node_modules 中查找文件
>   - 我们可以通过设置别名的方式来替换初识模块路径，具体后面讲解 alias 的配置

#### 确实文件还是文件夹

> 如果是一个文件：
>
> - 如果文件具有扩展名，则直接打包文件
> - 否则，将使用 resolve 里面的 extensions 选项作为文件扩展名解析
>
> 如果是一个文件夹
>
> - 会在文件夹中根据 resolve 里面的 mainFiles 配置选项中指定的文件顺序查找
>   - resolve.mainFiles 的默认值是 ['index']
>   - 再根据 resolve.extensions 来解析扩展名

### 3.7.extensions 和 alias 配置

> extensions 是解析到文件时自动添加扩展名
>
> - 默认值是 ['.wasm', '.mjs', '.js', '.json']
> - 所以如果我们代码中想要添加加载 .vue 或者 jsx 或者 ts 等文件时，我们必须自己写上扩展名
>
> alias 可以配置别名
>
> - 当我们项目的目录结构比较深的时候，或者一个文件的路径可能需要 ../../../这种路径片段
> - 我们可以给某些常见的路径起一个别名

![image-20220130211750287](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130211750287.png)

### 3.8.区分开发环境和生产环境

> 之前所有 webpack 配置都是放在 webpack.config.js 文件
>
> 其实某些配置是在开发环境需要使用的，某些配置是在生成环境需要使用的
>
> 我们可以对其配置区分，方便维护管理

在`package.json`文件中添加命令区分开发和生产加载不同的文件

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130233040259.png" alt="image-20220130233040259" style="zoom:67%;" />

然后我们可以创建三个文件，还需要`npm install webpack-merge -D`合并配置

- webpack.comm.config.js
- webpack.dev.config.js
- webpack.prod.config.js

```js
// webpack.comm.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { VueLoaderPlugin } = require("vue-loader/dist/index");

module.exports = {
  target: "web",
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "js/bundle.js",
  },
  resolve: {
    extensions: [".js", ".json", ".mjs", ".vue", ".ts", ".jsx", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      js: path.resolve(__dirname, "../src/js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      // },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: "asset",
        generator: {
          filename: "img/[name]_[hash:6][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.(eot|ttf|woff2?)$/,
        type: "asset/resource",
        generator: {
          filename: "font/[name]_[hash:6][ext]",
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "哈哈哈哈",
    }),
    new DefinePlugin({
      BASE_URL: "'./'",
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new VueLoaderPlugin(),
  ],
};
```

```js
// webpack.dev.config.js
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.comm.config");

module.exports = merge(commonConfig, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    contentBase: "./public",
    hot: true,
    // host: "0.0.0.0",
    port: 7777,
    open: true,
    // compress: true,
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        pathRewrite: {
          "^/api": "",
        },
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
```

```js
// webpack.prod.config.js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.comm.config");

module.exports = merge(commonConfig, {
  mode: "production",
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./public",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
  ],
});
```

#### 入口文件解析

> 我们之前编写入口文件的规则是这样的：`./src/index.js`，但是如果我们的配置文件所在的位置变成了 config 目录，我们是否应该变成 ../src/index.js 呢？
>
> 依然要写成 ./src/index.js，这是因为入口文件其实是和另一个属性 context 有关
>
> ontext 的作用是用于解析入口（entry point）和加载器（loader）
>
> - 默认应该是 webpack 的启动目录

我们也可以在配置中传入值

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130233349913.png" alt="image-20220130233349913" style="zoom:67%;" />
