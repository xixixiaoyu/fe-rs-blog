## 1.file-loader 的使用

> 要处理 jpg、png 等格式的图片，我们也需要有对应的 loader：file-loade
>
> file-loader 的作用就是帮助我们处理 import/require()方式引入的一个文件资源，并且会将它放到我们输出的文件夹中
>
> 安装 file-loader：`npm install file-loader -D`

我们项目中使用图片，比较常见的使用图片的方式是两种：

1. img 元素，设置 src 属性
2. 其他元素（比如 div），设置 background-image 的 css 属性

![image-20220130014551153](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130014551153.png)

![image-20220130015452105](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130015452105.png)

### 1.1.文件的命名规则

> 有时候我们处理后的文件名称按照一定的规则进行显示
>
> 比如保留原来的文件名、扩展名，同时为了防止重复，包含一个 hash 值等
>
> 这个时候我们可以使用 PlaceHolders 来完成，webpack 给我们提供了大量的 PlaceHolders 来显示不同的内容
>
> https://webpack.js.org/loaders/file-loader/#placeholders
>
> 我们可以在文档中查阅自己需要的 placeholder，介绍几个常用的：
>
> - [ext]： 处理文件的扩展名
> - [name]：处理文件的名称
> - [hash]：文件的内容，使用 MD4 的散列函数处理，生成的一个 128 位的 hash 值（32 个十六进制）
> - [contentHash]：在 file-loader 中和[hash]结果是一致的（在 webpack 的一些其他地方不一样，后面会讲到）
> - [hash:`<length>`]：截图 hash 的长度，默认 32 个字符太长了；
> - [path]：文件相对于 webpack 配置文件的路径

### 1.2.设置文件的名称

那么我们可以按照如下的格式编写（Vue 也是如此处理）：

![image-20220130015808919](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130015808919.png)

![image-20220130015838219](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130015838219.png)

通过`outputPath`来设置输出的文件夹

## 2.url-loader 的使用

> url-loader 和 file-loader 的工作方式是相似的，但是可以将较小的文件，转成 base64 的 URI
>
> 安装 url-loader：`npm install url-loader -D`

![image-20220130020349779](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130020349779.png)

默认情况下 url-loader 会将所有的图片文件转成 base64 编码

所以我们打包后在 dist 文件夹中会看不见文件

### 2.1.url-loader 的 limit

> 开发中我们往往是小的图片需要转换 Base64，但是大的图片直接使用即可
>
> 是因为小的图片转换 base64 之后可以和页面一起被请求，减少不必要的请求过程
>
> 较大的图片转换 Base64 反而会很大程度影响代码执行
>
> 我们 url-loader 有一个 options 属性 limit，可以用于设置转换的限制

![image-20220130020742413](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130020742413.png)

## 3.asset module type

> 在 webpack5 之前，加载这些资源我们需要使用一些 loader，比如 raw-loader 、url-loader、file-loader
>
> 在 webpack5 开始，我们可以直接使用`资源模块类型（asset module type）`，来替代上面的这些 loader
>
> 资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：
>
> - asset/resource 发送一个单独的文件并导出 URL，可以通过使用 file-loader 实现
> - asset/inline 导出一个资源的 data URI，可以通过使用 url-loader 实现
> - asset/source 导出资源的源代码，可以通过使用 raw-loader 实现
> - asset 在导出一个 data URI 和发送一个单独的文件之间自动选择，可以通过使用 url-loader，并且配置资源体积限制实现

### 3.1.打包图片

![image-20220130122136680](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130122136680.png)

如果要自定义文件输出路径和文件名

方式一：在 output 添加`assetModuleFilename`属性

![image-20220130122346038](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130122346038.png)

方式二：在 Rule 中，添加一个`generator`属性，并且设置`filename`

![image-20220130122544354](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130122544354.png)

#### url-loader 的 limit 效果

需要两个步骤实现

1. 首先将 type 修改为`asset`
2. 添加一个`parser`属性，并且制定`dataUrl`的条件，添加`maxSize`属性；

![image-20220130122808224](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130122808224.png)

### 3.2.打包字体

> 项目中经常可能会使用各种特殊字体和字体图标，需要引入对应文件

下载的字体图标文件

![image-20220130123054624](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130123054624.png)

在`component`中引入，并且添加一个元素用于显示字体图标

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130123517638.png" alt="image-20220130123517638" style="zoom:80%;" />

这时候打包会出错，因为无法正确的处理 eot、ttf、woff 等文件

我们可以选择使用 file-loader 来处理，也可以选择直接使用 webpack5 的资源模块类型来处理

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130123629239.png" alt="image-20220130123629239" style="zoom:80%;" />

## 4.Plugin

> Webpack 的另一个核心是 Plugin
>
> Loader 是用于**特定的模块类型**进行转换
>
> Plugin 可以用于执**行更加广泛的任务**，比如打包优化、资源管理、环境变量注入等

### 4.1.CleanWebpackPlugin

> 前面我们修改 webpack 配置的时候每次都需要删除`dist`文件夹重新打包
>
> 我们可以借助 CleanWebpackPlugin 来帮助我们完成
>
> 安装：`npm install clean-webpack-plugin -D`

配置：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130124303521.png" alt="image-20220130124303521" style="zoom:80%;" />

### 4.2.HtmlWebpackPlugin

> 我们最终打包文件 dist 文件夹中是没有`index.html`文件的
>
> 在进行项目部署的时，必然也是需要有对应的入口文件 index.html
>
> 所以我们也需要用`HtmlWebpackPlugin`对 index.html 进行打包处理
>
> 安装：`npm install html-webpack-plugin -D`

`public/index.html`

![image-20220130125353061](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130125353061.png)

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130125116280.png" alt="image-20220130125116280" style="zoom: 67%;" />

### 4.3.自定义模板数据填充

> 类似这样的语法`<% 变量 %>`，这个是 EJS 模块填充数据的方式
>
> 配置 HtmlWebpackPlugin 时，我们可以添加如下配置
>
> - template：指定我们要使用的模块所在的路径
> - title：在进行 htmlWebpackPlugin.options.title 读取时，就会读到该信息

### 4.4.DefinePlugin

> 上面打包还是会报错，因为在我们的模块中还使用到一个 BASE_URL 的常量：
>
> ![image-20220130125557561](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130125557561.png)
>
> 但是我们并没有设置过这个常量值，所以会出现没有定义的错误
>
> 这时候就可以使用 DefinePlugin

DefinePlugin 允许在编译时创建配置的全局常量，是一个 webpack 内置的插件（不需要单独安装）：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130125744665.png" alt="image-20220130125744665" style="zoom:67%;" />

![image-20220130125951298](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130125951298.png)

这个时候，模板就会正确读取到 BASE_URL 的值

### 4.5.CopyWebpackPlugin

> Vue 打包中如果我们将一些文件放到 public 的目录下，文件会被复制到 dist 文件夹中
>
> 这个功能我们可以使用`CopyWebpackPlugin`
>
> 安装：`npm install copy-webpack-plugin -D`
>
> 配置 CopyWebpackPlugin 即可：
>
> - 复制的规则在 patterns 中设置
> - from：设置从哪一个源中开始复制
> - to：复制到的位置，可以省略，会默认复制到打包的目录下
> - globOptions：设置一些额外的选项，其中可以编写需要忽略的文件
>   - .DS_Store：mac 目录下回自动生成的一个文件
>   - index.html：也不需要复制，因为我们已经通过 HtmlWebpackPlugin 完成了 index.html 的生成

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130130559513.png" alt="image-20220130130559513" style="zoom: 50%;" />

## 5.Mode 配置

> Mode 配置选项，可以告知 webpack 使用响应模式的内置优化
>
> - 默认值是 production（什么都不设置的情况下）
> - 可选值有：'none' | 'development' | 'production'

![image-20220130130713296](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130130713296.png)

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130130926471.png" alt="image-20220130130926471" style="zoom:50%;" />

mode 模式 Webpack 会默认帮你配置更多

![image-20220130131034217](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130131034217.png)
