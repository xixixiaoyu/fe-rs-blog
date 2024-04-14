## 1.认识 Webpack

> 前端开发日益复杂的今天
>
> 我们会使用到很多东西
>
> 比如需要模块化、预处理器、代码热更新、代码压缩优化等
>
> 目前三大框架都可以借助脚手架（cli），脚手架内部又是基于 webpack 来帮助我们支持模块化、Typescript、Less、打包优化等

![image-20220129215128452](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129215128452.png)

> ![image-20220129215400071](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129215400071.png)
>
> webpack 是一个静态的模块化打包工具，为现代的 JavaScript 应用程序
>
> - 打包 bundler：webpack 可以将帮助我们进行打包，所以它是一个打包工具
> - 静态的 static：这样表述的原因是我们最终可以将代码打包成最终的静态资源（部署到静态服务器）
> - 模块化 module：webpack 默认支持各种模块化开发，ES Module、CommonJS、AMD 等
> - 现代的 modern：我们前端说过，正是因为现代前端开发面临各种各样的问题，才催生了 webpack 的出现和发展

![image-20220129215431972](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129215431972.png)

## 2.webpack 使用前提

> webpack 的官方文档是https://webpack.js.org/
>
> webpack 的中文官方文档是https://webpack.docschina.org/
>
> Webpack 的运行是依赖`Node`环境的，所以我们电脑上必须有`Node`环境
>
> 所以我们需要先安装 Node.js，并且同时会安装 npm（node.js 内置 npm）
>
> Node 官方网站：https://nodejs.org/

## 3.Vue 项目需要加载的文件

> JavaScript 的打包：
>
> - 将 ES6 转换成 ES5 的语法
> - TypeScript 的处理，将其转换成 JavaScript
>
> CSS 的处理
>
> - CSS 文件模块的加载、提取
> - Less、Sass 等预处理器的处理
>
> 资源文件 img、font
>
> - 图片 img 文件的加载
> - 字体 font 文件的加载
>
> HTML 资源的处理
>
> - 打包 HTML 资源文件
>
> 处理 vue 项目的 SFC 文件.vue 文件

## 4.webpack 的安装

> webpack 的安装目前分为两个：`webpack`、`webpack-cli`
>
> 当执行 webpack 命令，会执行`node_modules`下的`.bin`目录下的 webpack
>
> webpack 在执行时是依赖`webpack-cli`的，如果没有安装就会报错
>
> 而 webpack-cli 中代码执行时，才是真正利用 webpack 进行编译和打包的过程
>
> 所以在安装 webpack 时，我们需要同时安装`webpack-cli`（第三方的脚手架事实上是没有使用 webpack-cli 的，而是类似于自己的`vue-service-cli`的东西）
>
> `npm install webpack webpack-cli –g` # 全局安装
>
> `npm install webpack webpack-cli –D` # 局部安装

![image-20220129235042174](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129235042174.png)

## 5.Webpack 的默认打包

> 在目录下直接执行` webpack` 命令。我们可以通过 webpack 进行打包，之后运行打包之后的代码
>
> 生成一个`dist`文件夹，里面存放一个`main.js`的文件，就是我们打包之后的文件
>
> 打包后文件被压缩和筹划了，但是现代码中依然存在 ES6 的语法，如 const、箭头函数，后续可以使用`babel`转换语法为 ES5 之前的语法
>
> 为什么当我们使用`webpack`命令能正常打包，入口是什么？
>
> - 当我们运行 webpack 时，webpack 会查找当前目录下的 `src/index.js`作为入口，没有则报错
>
> 当然我们可以配置指定入口和出口
>
> `npx webpack --entry ./src/main.js --output-path ./build`

## 5.创建局部的 webpack

> 之前使用的是全局的 webpack 命令，如果我们要使用局部按照以下步骤操作
>
> 1. 创建 package.json 文件，用于管理项目的信息、库依赖等 => `npm init`
> 2. 安装局部的 webpack => `npm install webpack webpack-cli -D`
> 3. 使用局部的 webpack => `使用局部的webpack`
> 4. 在 package.json 中创建 scripts 脚本，执行脚本打包即可 `npm run build`
>
> ![image-20220129235319003](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129235319003.png)

## 6.Webpack 配置文件

> 通常情况 webpack 需要打包的项目是非常复杂，所以我们需要一系列额外配置满足要求

我们可以在根目录下创建一个`webpack.config.js`文件，来作为 webpack 的配置文件

![image-20220129235447296](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129235447296.png)

继续执行`npm run build`依然可以正常打包

但是如果我们想 webpack 配置文件的名字默认不是`webpack.config.js`，而是`wk.config.js`

这时候我们通过`--config`指定对应配置文件

```
webpack --config wk.config.js
```

执行命令打包繁琐，我们同样可以在 package.json 中增加一个新的脚本执行这个命令打包

![image-20220129235935053](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129235935053.png)

## 7.Webpack 的依赖图

> 当上 webpack 在处理应用程序时，它会根据命令或者配置文件找到入口文件
>
> 从入口开始，会生成一个 依赖关系图，这个依赖关系图会包含应用程序中所需的所有模块（比如.js 文件、css 文件、图片、字体等）
>
> p 然后遍历图结构，打包一个个模块（根据文件的不同使用不同的 loader 来解析）

## 8.css-loader 的使用

先看一个例子：当我们通过 JavaScript 创建了一个元素，并且希望给它设置一些样式

![image-20220130000231897](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130000231897.png)

上面报错告诉我们需要一个 loader 来加载这个 css 文件，loader 又是什么呢？

> loader 可以使用于对模块的源代码进行转换
>
> 我们可以将 css 文件也看成是一个模块，我们是通过 import 来加载这个模块的
>
> 但是在加载这个模块时，webpack 其实并不知道如何对其进行加载，我们必须制定对应的 loader 来完成这个功能
>
> 所以对于读取 CSS 文件的 loader 最常用的就是`css-loader`
>
> 安装：`npm install css-loader -D`

对于 css-loader 加载 CSS 文件有三种方式：

### 1.内联方式

- 内联方式使用较少，因为不方便管理，在引入的样式前加上使用的 loader，并且使用!分割

![image-20220130000648213](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130000648213.png)

### 2.CLI 方式

- 在 webpack5 的文档中已经没有了`--module-bind`，实际应用中也比较少使用，因为不方便管理

### 3.配置方式

- 这种方式使得我们可以在`webpack.config.js`文件中写明配置信息
- 这种方式可以配置多个不同的`loader`，更好的展示和维护

module.rules 的配置如下：

- rules 属性对应的值是一个数组：[Rule]

- 数组中存放的是一个个的 Rule，Rule 是一个对象，对象中可以设置多个属性

  - **test 属性**：用于对 resource（资源）进行匹配的，通常会设置成正则表达式

  - **use 属性**：对应的值时一个数组：[UseEntry]

    - UseEntry 是一个对象，可以通过对象的属性来设置一些其他属性

      - loader：必须有一个 loader 属性，对应的值是一个字符串
      - options：可选的属性，值是一个字符串或者对象，值会被传入到 loader 中
      - query：目前已经使用 options 来替代

    - 传递字符串（如`use: [ 'css-loader' ]`）是（如`use: [ { loader: 'css-loader'} ] `) loader 属性的简写方式

![image-20220130003320748](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130003320748.png)

## 9.style-loader 的使用

> 上面我们已经可以通过`css-loader`来加载 css 文件了
>
> 但是这个 css 在我们的代码中并没有生效（页面没有效果）
>
> 这是因为 css-loader 只是负责将.css 文件进行解析，并不会将解析之后的 css 插入到页面中
>
> 如果我们希望再完成插入 style 的操作就需要`style-loader`了
>
> 安装：`npm install style-loader -D`

配置 style-loader：

- 注意：因为 loader 的执行顺序是从右向左（或者说从下到上，或者说从后到前的），所以我们需要将 style-loader 写到 css-loader 的前面；

![image-20220130004615317](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130004615317.png)

重新`npm run build`之后发现我们 css 是通过页内样式的方式添加进来的

后续我们会说如何抽离到单独的文件以及压缩操作

## 10.less-loader 的使用

> 开发中，我们可能会使用 less、sass、stylus 的预处理器来编写 css 样式提高效率
>
> 我们就需要将这些 CSS 预处理转换成普通的 CSS 的工具

比如我们编写的 less 样式：

![image-20220130005052605](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130005052605.png)

我们可以使用 less 工具来完成它的编译转换

```shell
npm install less -D
```

执行如下命令：

```shell
npx lessc ./src/css/title.less title.css
```

但是我们更有可能使用`less-loader`来自动转换 less 到 css

```shell
npm install less-loader -D
```

![image-20220130005529148](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130005529148.png)

执行 npm run build，less 就可以自动转换成 css，并且页面也会生效了

## 11.PostCSS 的使用

> PostCSS 是一个通过 JavaScript 来转换样式的工具
>
> 这个工具可以帮助我们进行一些 CSS 的转换和适配，比如自动添加浏览器前缀、css 样式的重置
>
> 但是实现这些功能，我们还需要借助于 PostCSS 对应的插件

### 命令行使用 PostCSS

> 终端使用 PostCSS 需要单独安装一个工具 postcss-cli
>
> `npm install postcss postcss-cli -D`

我们编写一个需要添加前缀的 css：

- https://autoprefixer.github.io/ 我们可以在上面的网站中查询一些添加 css 属性的样式；

### autoprefixer 插件

因为我们需要添加前缀，所以要安装 autoprefixer

```shell
npm install autoprefixer -D
```

直接使用使用 postcss 工具，并且制定使用 autoprefixer

```shell
npx postcss --use autoprefixer -o end.css ./src/css/style.css
```

### postcss-loader

> 真实开发中我们往往是借助于构建工具，而非命令行工具
>
> 在 webpack 中使用 postcss 就是使用`postcss-loader`来处理的
>
> 安装 postcss-loader => `npm install postcss-loader -D`
>
> 配置完 loader 后我们还需要配置 postcss 对应的插件才会起效果

![image-20220130010620729](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130010620729.png)

我们也可以将`PostCSS`配置的`options`放到单独文件管理

这时我们可以在根目录创建`postcss.config.js`

![image-20220130010836636](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130010836636.png)

![image-20220130010959673](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130010959673.png)

### postcss-preset-env 插件

> 实际我们在配置 postcss-loader 时，我们配置插件并不需要使用 autoprefixer
>
> 我们可以使用 postcss-preset-env 这个 postcss 的插件
>
> 它可以帮助我们将一些现代的 CSS 特性，转成大多数浏览器认识的 CSS，并且会根据目标浏览器或者运行时环境添加所需的 polyfill，当然是内置了 autoprefixer
>
> 安装：`npm install postcss-preset-env -D`

![image-20220130011307439](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130011307439.png)

同时匹配 less 或者 css

![image-20220130011526697](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130011526697.png)
