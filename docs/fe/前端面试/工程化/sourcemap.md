### 第一步：sourcemap 是个啥？

sourcemap 就是一个映射文件，通常是个后缀为 .map 的东西，比如 app.js.map。它记录了压缩后的代码和原始代码之间的对应关系。有了它，浏览器开发者工具（比如 Chrome 的 DevTools）就能把压缩代码“还原”到你写的原始模样，方便调试。是不是很贴心？



### 第二步：它咋工作的？

sourcemap 文件本质上是个 JSON，里面存了一堆映射信息。举个例子，你写了个函数：

```js
function sayHello(name) {
  console.log('你好，' + name)
}
```

压缩后可能变成：

```js
function sayHello(a){console.log("你好，"+a)}
```

sourcemap 就会记下：压缩后的第 1 行第 10 个字符，对应原始文件的第 2 行第 5 个字符。这样，浏览器报错时就能指回你原来的代码，而不是让你对着压缩版抓瞎。



### 第三步：怎么用 sourcemap？

在前端开发中，sourcemap 一般是打包工具（比如 Webpack、Vite、Rollup）自动生成的。打包的时候，你可以设置生成 sourcemap 的选项。比如在 Webpack 里，你可能会看到这样的配置：

```js
module.exports = {
  devtool: 'source-map'
}
```

这行代码告诉 Webpack：嘿，给我生成一个完整的高质量 sourcemap。生成后，压缩文件（比如 app.min.js）末尾会加一行注释，像这样：

```js
//# sourceMappingURL=app.min.js.map
```

浏览器看到这行注释，就知道去哪找对应的 sourcemap 文件了。



### 第四步：实际场景咋用？

开发的时候，你打开浏览器的开发者工具，sourcemap 会自动生效。

假设代码报错了，控制台会直接显示错误发生在原始文件的哪一行，点进去还能看到你写的原版代码，而不是压缩后的“天书”。

不过上线的时候，为了安全和性能，很多人会选择不上传 sourcemap 文件到服务器，只在本地调试用。



### 第五步：有啥要注意的？

- **文件大小**：sourcemap 文件有时候比压缩后的代码还大，调试时无所谓，但别不小心传到生产环境。
- **安全性**：sourcemap 暴露了原始代码结构，上线时最好别暴露给用户。
- **模式选择**：打包工具提供了不同的 sourcemap 类型，比如 cheap-source-map（快但不精确）或者 eval-source-map（适合开发但不适合生产），得根据需求选。



### Webpack 的 sourcemap 配置

#### 1.基本配置

前面说了，在 webpack.config.js 里，你可以这样写：

```js
module.exports = {
  devtool: 'source-map'
}
```

- **source-map**：生成一个独立的 .map 文件，质量最高，能精确映射到原始代码的行列。适合生产环境调试或者本地开发时追求完美体验。
- 文件末尾会自动加一句 //# sourceMappingURL=xxx.map，浏览器会自己去找映射文件。

#### 2.开发常用的模式

开发时，你可能不想生成独立文件，或者想要速度快点，可以试试：

**eval**：

```js
module.exports = {
  devtool: 'eval'
}
```

每个模块用 eval() 包裹，速度最快，但映射不精确，适合简单项目。

**cheap-source-map**：

```js
module.exports = {
  devtool: 'cheap-source-map'
}
```

只映射行，不映射列，生成速度快，文件小，调试时够用。

**eval-source-map**：

```js
module.exports = {
  devtool: 'eval-source-map'
}
```

每个模块用 eval()，但会生成高质量的 sourcemap，开发时很常用，尤其是需要精确调试的时候。

#### 3.生产环境

生产环境一般追求性能，可能不需要 sourcemap，或者只在特定情况下生成。可以这样：

```js
module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map'
}
```

- false：关闭 sourcemap，上线时常用。
- 或者用 hidden-source-map：生成 sourcemap 文件，但不加注释，浏览器看不到，除非你手动上传给调试工具（比如 Sentry）。

小贴士

- Webpack 的 devtool 有十几种组合，名字里带 cheap 的快但不精确，带 eval 的更快但不适合生产，带 module 的能处理 loader 转换前的代码。选的时候看需求平衡速度和精度。



###  Vite 的 sourcemap 配置

Vite 是个更现代的工具，配置比 Webpack 简单很多，默认就对开发友好。它基于 Rollup 打包，sourcemap 配置主要在 vite.config.js 里。

#### 1.默认行为

Vite 在开发模式下（vite dev）默认启用 sourcemap，而且是超级快的 inline 模式，不用额外配置。你直接打开浏览器 DevTools，就能看到原始代码映射。

#### 2.构建时的配置

构建时（vite build），sourcemap 默认是关闭的，想开启得手动配置：

```js
export default {
  build: {
    sourcemap: true
  }
}
```

**true**：生成独立的 .map 文件，比如 app.js.map，跟 Webpack 的 source-map 效果差不多。

也可以使用 **'inline'**：

```js
export default {
  build: {
    sourcemap: 'inline'
  }
}
```

把 sourcemap 数据直接内联到 .js 文件里，文件会变大，但不用额外请求，适合小项目调试。

**'hidden'**：

```js
export default {
  build: {
    sourcemap: 'hidden'
  }
}
```

生成 .map 文件但不加引用注释，跟 Webpack 的 hidden-source-map 一个意思。

#### 3.开发模式微调

开发时如果默认的 inline sourcemap 不够用（比如你用特殊 loader），可以加个 configureServer：

```js
export default {
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // 自定义 sourcemap 处理逻辑
      next()
    })
  }
}
```

不过一般用不上，默认就够好了。

#### 小贴士

- Vite 的 sourcemap 配置比 Webpack 简单，主要就仨选项：true、'inline'、'hidden'。
- 开发时几乎不用操心，构建时根据上线需求决定开不开。