### 什么是 Tree Shaking？

Tree Shaking 是一种优化技术，移除 JavaScript 代码中未使用部分的技术。

翻译过来叫“树摇”，把没用到的代码（也就是“死代码”）给“摇掉”，让最后打包出来的文件更小、更精简。



### treeshaking 的基础

treeshaking 能工作，靠的是 ES6 的模块系统（也就是 import 和 export）。

因为 ES6 模块是静态的，代码在运行前就能分析出哪些东西用到了，哪些没用到：

```js
// math.js
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b

// main.js
import { add } from './math.js'
console.log(add(2, 3))
```

在这个例子中，main.js 只使用了 add 函数，而没有用到 subtract。

Webpack 在打包时可以通过静态分析发现 subtract 没有被引用，于是就可以把它从最终的打包结果中移除。

反过来，如果是 CommonJS（module.exports 和 require），它就没这么聪明了，因为 CommonJS 是动态加载的，运行时才知道用没用，webpack 没法提前判断。



### webpack 是怎么“摇”的？

知道 treeshaking 靠 ES6 模块，那 webpack 具体怎么操作呢？这得从它的打包过程说起。

1. **构建模块依赖图**
    webpack 先从入口文件（比如 main.js）开始，找到所有 import 的东西，构建一个完整的依赖关系图。它会递归地分析每个文件，看看都导入了啥，导出了啥。

2. **标记用到的代码**
    在这个依赖图里，webpack 会标记哪些变量、函数被实际用到了。还是上面那个例子，add 被调用了，标记为“有用”；subtract 没被调用，标记为“没用”。

3. **交给压缩工具“摇掉”**
    光标记还不够，得真删掉没用的代码。这步 webpack 靠的是一个叫 UglifyJS（或者更现代点的 Terser）的工具。这些工具在压缩代码时，会根据标记，把没用的部分直接剔除。最终打包结果里就没 subtract 的影子了。



### 为啥有时候 treeshaking 不灵？

有时为啥我有些代码明明没用，还是被打包进去了？这就得说说 treeshaking 的“坑”了。

首先如果某个模块有副作用（side effects），webpack 就不敢随便删：

```js
import './utils.js'
```

假设 utils.js 里有些代码直接执行（比如改全局变量），webpack 没法确定删了它会不会出问题，所以就留着了。

解决办法是配置 sideEffects（在 package.json 里声明哪些文件没副作用）。

另外项目里混用了 CommonJS，那 treeshaking 也废了。

另外 一些 Babel 转码，也会把 ES6 模块转成了 CommonJS，得配好 babel.config.js，加上 "modules": false"，保留 ES6 模块语法。



### 配置一下试试

想让 treeshaking 生效，webpack 配置得这样写：

```js
// webpack.config.js
module.exports = {
  mode: 'production', // 生产模式默认开启 treeshaking
  optimization: {
    usedExports: true // 标记未使用的导出
  }
}
```

加上 package.json 里：

```json
{
  "sideEffects": false // 声明没副作用，或者列出有副作用的文件
}
```



总结下，treeshaking 的核心原理就是：靠 ES6 模块的静态特性分析依赖，标记没用的代码，再通过压缩工具删掉。过程不复杂，但要生效得满足条件 —— 用 ES6 模块、避免副作用、配置得当。就像摇树，得先知道哪些枝叶没用，再轻轻一摇。

