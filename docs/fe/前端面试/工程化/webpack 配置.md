### 先想想 webpack 配置的核心是什么？

webpack 的配置本质上就是一个 JavaScript 对象，写在 webpack.config.js 文件里。

它告诉 webpack：我要打包啥、怎么打包、输出到哪。配置项虽然灵活，但核心无非是“输入、处理、输出”这三件事。



### 1. 入口 (entry)

入口是 webpack 开始打包的地方：

```js
module.exports = {
  entry: './src/index.js'
}
```

上面是单入口，如果项目有多个独立页面，可以用对象写法，比如：

```js
entry: {
  app: './src/app.js',
  admin: './src/admin.js'
}
```

**作用**：决定了 webpack 从哪里开始分析依赖，构建整个项目。



### 2. 输出 (output)

打包完的东西得有个地方放吧？output 就是干这个的。它主要配置输出文件的名字和路径：

```js
output: {
  filename: 'bundle.js',
  path: '/dist'
}
```

- filename：输出文件名，可以用 [name]（对应多入口的 key）、[hash]（加个哈希避免缓存）等占位符。
- path：输出目录，得是绝对路径，通常用 path.resolve(__dirname, 'dist')。

```js
output: {
  filename: '[name].[hash].js',
  path: path.resolve(__dirname, 'dist')
}
```

多入口打包出来可能是 app.123abc.js 和 admin.456def.js。



### 3. 模块规则 (module.rules)

webpack 默认只认识 JavaScript 和 JSON，其他文件（比如 CSS、图片、TS）得靠 loader 处理。rules 就是定义这些处理规则的地方：

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(png|jpg|gif)$/,
      type: 'asset/resource'
    }
  ]
}
```

- test：正则匹配文件类型。
- use：指定 loader，顺序是从后往前（比如先 css-loader 解析 CSS，再 style-loader 注入页面）。
- type：webpack 5 里可以用内置的 asset 模块处理静态资源，像图片、字体啥的。



### 4. 插件 (plugins)

loader 处理文件内容，插件则负责更高级的任务，比如压缩代码、生成 HTML 文件。配置里加个数组就行：

```js
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  }),
  new CleanWebpackPlugin()
]
```

- HtmlWebpackPlugin：自动生成 HTML 文件，还能把打包后的 JS 注入进去。

- CleanWebpackPlugin：打包前清空输出目录。

  

### 5. 模式 (mode)

mode 是个开关，告诉 webpack 是开发还是生产环境：

```js
mode: 'development' // 或 'production'
```

- development：代码不压缩，方便调试。
- production：自动优化，压缩代码，性能更好。
- **小贴士**：不写默认是 production，但建议显式指定。



### 6. 解析规则 (resolve)

这个是配置 webpack 怎么找文件的。比如导入模块时省略后缀：

```js
resolve: {
  extensions: ['.js', '.jsx', '.ts'],
  alias: {
    '@': path.resolve(__dirname, 'src')
  }
}
```

- extensions：自动补全文件后缀，像 import App from './App' 会依次找 .js、.jsx 等。
- alias：设置路径别名，比如用 @/components 代替 ./src/components。



### 7. 开发体验 (devServer)

开发时用 webpack-dev-server，可以热更新、代理请求啥的：

```js
devServer: {
  port: 8080,
  hot: true,
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

- hot：改代码不用刷新页面。
- proxy：解决跨域问题，把请求转发到后端。



### 总结一下

webpack 配置的核心就是这几块：

- **入口和输出**：定好起点和终点。
- **模块和插件**：处理文件和优化打包。
- **模式和解析**：调整环境和路径逻辑。
- **开发服务器**：提升开发效率。

其实配置看着复杂，核心思路很简单：告诉 webpack “拿啥、干啥、放哪”。
