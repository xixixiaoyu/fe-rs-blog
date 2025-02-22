1. 当运行 webpack 命令时，webpack 会读取你的配置文件（通常是 webpack.config.js）。
2. webpack 会找到你配置的入口文件，解析文件中的 import 或 require 语句，找到所有依赖的模块。
3. webpack 会递归地解析这些依赖，形成一个依赖图（dependency graph）。这个图记录了所有模块之间的依赖关系和需要打包的文件。
4. webpack 会根据配置中的 module.rules 选项，使用对应的 loader 对不同类型的文件进行处理。比如，用 babel-loader 处理 js 文件，用 css-loader 处理 css 文件。
5. webpack 会将依赖图中的模块分组，生成一个个 Chunk。Chunk 是打包后的代码块，通常对应一个或多个模块，但是如果设置了多个入口（entry），可能会生成多个 bundle，用了代码分割（code splitting），像动态 import() 这种，webpack 会把异步加载的部分单独打成一个文件。
6. webpack 会使用插件对 chunk 进行一些优化操作，比如代码压缩、Tree Shaking（移除未使用的代码）、Scope Hoisting（提升作用域）等。
7. webpack 会将生成的 assets 写入到配置中指定的输出目录（通常是 `dist` 文件夹）。输出过程，会触发一些插件钩子，比如 `emit` 钩子，允许插件在文件写入之前做一些额外的处理。
8. 最终收尾，webpack 会输出一些构建的统计信息，比如打包时间、文件大小等。你可以通过配置 `stats` 选项来控制输出的详细程度，并触发 `done` 钩子。

看个 webpack.config.js 的简单配置：

```js
module.exports = {
  entry: './src/index.js', // 从哪儿开始
  output: {
    path: '/dist', // 打包到哪儿
    filename: 'bundle.js', // 输出文件名
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }, // 处理 JS
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }, // 处理 CSS
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }), // 生成 HTML
  ],
}
```
