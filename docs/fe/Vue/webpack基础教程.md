# webpack基础配置教程

### 1. 初识Webpack
* 什么是webpack？
  * Webpack是一个模块打包器。
  * 在Webpack中会将前端的所有资源文件（js/json/css/img/less/...）都作为模块处理。
  * 它将根据模块的依赖关系进行分析，生成对应的资源
* 五个核心概念：
  1. 【入口(entry)】：指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。
  2. 【输出(output)】：在哪里输出文件，以及如何命名这些文件。
  3. 【Loader】：处理那些非 JavaScript 文件（webpack 自身只能解析 JavaScript和json）。
  4. 【插件(plugins)】执行范围更广的任务，从打包到优化都可以实现。
  5. 【模式(mode)】，有生产模式production和开发模式development
* 对loader的理解
  * webpack 本身只能处理JS、JSON模块，如果要加载其他类型的文件(模块)，就需要使用对应的loader 。
  * 它本身是一个函数，接受源文件作为参数，返回转换的结果。
  * loader 一般以 xxx-loader 的方式命名，xxx 代表了这个 loader 要做的转换功能，比如 css-loader。
* 对plugins的理解
  * 插件可以完成一些loader不能完成的功能。
* 配置文件
  * webpack.config.js : 用于存储webpack配置信息。
	
### 2. 开启项目
* 初始化项目：
  * 使用```npm init```或```yarn init```生成一个package.json文件
      ```   
      {
        "name": "webpack_test",
        "version": "1.0.0"
      } 
      ```
* 安装webpack
  * npm install webpack@4 webpack-cli@3 -g  //全局安装,作为指令使用
  * npm install webpack@4 webpack-cli@3 -D //本地安装,作为本地依赖使用
    
### 3. 处理js和json文件
* 创建js文件
  * src/js/app.js
  * src/js/module1.js
  * src/js/module2.js
* 创建json文件
  
  * src/json/data.json  
* 创建主页面: 
  
  * src/index.html
* 运行指令
  * 打包指令（开发）：
    
    ```
    webpack ./src/js/app.js -o ./build/js/app.js --mode=development
    ```
    
    * 功能: webpack能够打包js和json文件，并且能将es6的模块化语法转换成浏览器能识别的语法
    
  * 打包指令（生产）：
    
    ```
    webpack ./src/js/app.js -o ./build/js/app.js --mode=production
    ```
    
    * 功能: 在开发配置功能上加上一个压缩代码的功能
    
  * index.html页面中引入：build/js/app.js
* 结论：
  * webpack能够编译打包js和json文件
  * 能将es6的模块化语法转换成浏览器能识别的语法
  * 能压缩代码
* 缺点：
  * 不能编译打包css、img等文件
  * 不能将js的es6基本语法转化为es5以下语法
* 改善：使用webpack配置文件解决，自定义功能

### 4. webpack配置文件
* 目的：在项目根目录定义配置文件，通过自定义配置文件，还原以上功能
* 文件名称：webpack.config.js
* 文件内容：
```js
const { resolve } = require('path'); //node内置核心模块，用来设置路径。

module.exports = {
    entry: './src/js/app.js', // 入口文件配置（精简写法）
    /*完整写法：
		entry:{
			main:'./src/js/app.js'
		}
		*/
    output: { //输出配置
        filename: './js/app.js',//输出文件名
        path: resolve(__dirname, 'build')//输出文件路径(绝对路径)
    },
    mode: 'development'   //开发环境(二选一)
    //mode: 'production'   //生产环境(二选一)
};
```
* 运行指令： webpack

### 5. 打包less、css资源
* 概述：less、css文件webpack不能解析，需要借助loader编译解析

* 创建less文件
  * src/css/demo1.less
  * src/css/demo2.css
  
* 入口app.js文件
  
  * 引入less、css资源  
  
* 安装loader
  
  * npm install css-loader style-loader less-loader less -D 
  
* 配置loader
    ```js
	{
		// 处理less资源
		test: /\.less$/,
		use: [
			'style-loader', //创建style标签，将js中的样式资源插入进行，添加到head中生效
			'css-loader', //将css文件变成commonjs模块加载js中，里面内容是样式字符串
			'less-loader' //将less文件编译成css文件
		]
	},
	{
		// 处理css资源
		test: /\.css$/,
		use: [ // use数组中loader执行顺序：从右到左，从下到上 依次执行
			'style-loader',// 创建style标签，将js中的样式资源插入进行，添加到head中生效
			'css-loader'// 将css文件变成commonjs模块加载js中，里面内容是样式字符串
		]
	},
	```
* 运行指令：webpack

### 6. 打包html文件
* 概述：借助html-webpack-plugin插件打包html资源
* 创建html文件
  * src/index.html
  * 注意：不要在该html中引入任何css和js文件
* 安装插件：html-webpack-plugin
	
	* npm install html-webpack-plugin -D
* 在webpack.config.js中引入插件（插件都需要手动引入，而loader会自动加载）
	
	* const HtmlWebpackPlugin = require('html-webpack-plugin')
* 配置插件Plugins
    ```js
    plugins: [
      new HtmlWebpackPlugin({
		// 以当前文件为模板创建新的HtML(1. 结构和原来一样 2. 会自动引入打包的资源)
        template: './src/index.html', 
      }),
    ]
    ```
* 运行指令：webpack


### 7. 打包样式中的图片
* 概述：图片文件webpack不能解析，需要借助loader编译解析
* 添加2张图片:
   * 小图, 小于8kb: src/images/vue.png
   * 大图, 大于8kb: src/images/react.jpg
* 在less文件中通过背景图的方式引入两个图片
* 安装loader
  * npm install file-loader url-loader file-loader -D
  * 补充：url-loader是对象file-loader的上层封装，使用时需配合file-loader使用。
* 配置loader
	```js
	{
		// 处理图片资源
		test: /\.(jpg|png|gif)$/,
		loader: 'url-loader', //url-loader是对file-loader的上层封装
		options: {
			limit: 8 * 1024, //临界值为8KB，小于8KB的图片会被转为base64编码
			name: '[hash:10].[ext]', //加工后图片的名字
			outputPath: 'imgs' //输出路径
		}
	},
	```

### 8. 打包html中的图片
* 概述：html中的```<img>```标签url-loader没法处理，需要引入其他loader处理。
* 添加图片
  
  * 在src/index.html添加一个img标签，src/images/angular.png
* 安装loader
	
	* npm install html-loader --save-dev 
* 配置loader
    ```js
    {
		// 处理html中<img>资源
		test: /\.html$/,
		loader: 'html-loader'
	},
    ```
* 可能出现的坑：打包后html文件中的图片的src变成了：[object Module],
* 解决办法：url-loader中加入一个配置：esModule:false即可

### 9. 打包其他资源
* 概述：其他资源（字体、音视频等）webpack不能解析，需要借助loader编译解析
* 以处理几个字体图标的字体为例，font下添加几个下载好的字体文件：
  * src/font/iconfont.eot
  * src/font/iconfont.svg
  * src/font/iconfont.ttf
  * src/font/iconfont.woff
  * src/font/iconfont.woff2
* 修改incofont.css中字体的url
    ```css
    @font-face {
      font-family: 'iconfont';
      src: url('../media/iconfont.eot');
      src: url('../media/iconfont.eot?#iefix') format('embedded-opentype'),
      url('../media/iconfont.woff2') format('woff2'),
      url('../media/iconfont.woff') format('woff'),
      url('../media/iconfont.ttf') format('truetype'),
      url('../media/iconfont.svg#iconfont') format('svg');
    }
    
    .iconfont {
      font-family: "iconfont" !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    ```
* 修改html，添加字体图标，例如：```<span class="iconfont icon-icon-test"></span>```
* 配置loader
	```js
	{
		// 处理其他资源(字体、音视频等等)
		exclude: /\.(html|js|css|less|jpg|png|gif)/, //排除的文件
		loader: 'file-loader',
		options: {
			name: '[hash:10].[ext]', //命名
			outputPath: 'media' //输出路径
		}
	}
  ```
* 运行指令：webpack

### 10. devServer
* 安装webpack-dev-server
	
	
	
	* npm i webpack-dev-server -D
	* npm i webpack-dev-server -g
	* 详细配置见官网：指南 -> 开发环境 -> 使用webpack-dev-server 
	
* 修改webpack配置对象，追加devServer配置（注意不是loader中追加）
    ```js
	//devServer配置(开发模式所特有的配置)
	devServer: {
		contentBase: resolve(__dirname, 'build'),//本地打包文件的位置
		port: 3000, //端口号
		open: true //自动打开浏览器
	}
	```
	
* 修改package.json中scripts指令
  
  * ```"dev": "webpack-dev-server"```,
  
* 运行指令：npm run dev 或者 yarn dev

<hr/>
>至此，你已经完成了用webpack搭建一个简单的开发环境，但这套配置只适用于开发过程中调试代码，项目上线并不能运用这套配置，因为你还有很多的问题没有处理，比如：css还不是单独的文件，css、js还有很多兼容性问题等等，接下来我们开始去搭建生产环境。

### 生产环境准备：
1.新建config文件夹，重命名webpack.config.js为webpack.dev.js，放入config文件夹
2.复制webpack.dev.js，重命名为webpack.prod.js,删除其中的devServer配置，因为这是开发环境特有的，生产环境是不需要的
3.修改package.json中scripts指令：

```json
"start": "webpack-dev-server --config ./config/webpack.dev.js",
"build": "webpack --config ./config/webpack.prod.js"
```
4.修改output中path为：```path: resolve(__dirname, '../build')```

### 1. 提取css为单独文件
* 安装插件
	
	* npm install mini-css-extract-plugin -D
* 引入插件
  
  * const MiniCssExtractPlugin = require("mini-css-extract-plugin");	
* 配置loader
  ```js
  //引入mini-css-extract-plugin，用于提取css为单独文件
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  {
	// 处理less资源
    test: /\.less$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'less-loader',
    ]
  },
  {
	// 处理css资源
	test: /\.css$/,
	use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
    ]
  }
  ```
* 配置插件
  ```js
  //提取css为单独文件
	new MiniCssExtractPlugin({
		// 对输出的css文件进行重命名
		filename: 'css/built.css',
	})
  ```
* 运行指令
  
  * npm run build
* 备注：由于在提取了独立的文件，要从外部引入，所以可能会有路径问题，解决方案是在output配置中，添加：```publicPath:'/'``` publicPath根据实际情况自行调整,若上线运行值为：/imgs，若本地右键运行值为：/build/imgs

### 2. css兼容性处理
* 安装loader
	* npm install postcss postcss-loader postcss-preset-env -D
* 因为css和less样式文件都要进行兼容性处理，所以我们定义好一个通用的配置：
```js
// 配置一个commonCssLoader，处理less和css时都会使用
const commonCssLoader = [
	MiniCssExtractPlugin.loader, //提取css为单独的文件
	'css-loader', //将css文件变成commonjs模块加载js中，里面内容是样式字符串
	{
		 //注意：想让postcss-loader工作，还需在package.json中定义browserslist配置兼容程度
		 loader: 'postcss-loader',
          options: {
          ident: 'postcss',
          plugins: () => [require('postcss-preset-env')()]
      }
	}
];
```
* 修改css-loader和less-loader配置
```js
	{
		// 处理css资源
		test: /\.css$/,
		use: [...commonCssLoader]
	},
	{
		// 处理less资源
		test: /\.less$/,
		use: [...commonCssLoader, 'less-loader']
	},
```

* 配置package.json，在其中追加browserslist配置，通过配置加载指定的css兼容性样式
	```json
	"browserslist": {
		// 开发环境
		"development": [
			"last 1 chrome version",
			"last 1 firefox version",
			"last 1 safari version"
		],
		// 生产环境：默认是生产环境
		"production": [
			">0.2%", //兼容市面上99.8%的浏览器
			"not dead", //"死去"的浏览器不做兼容，例如IE8
			"not op_mini all",//不做opera浏览器mini版的兼容
			"ie 10" //兼容IE10
		]
	}
	```
	
* 备注1: browserslist 是一套描述产品目标运行环境的工具，它被广泛用在各种涉及浏览器/移动端的兼容性支持工具中，详细配置规则参考：https://github.com/browserslist/browserslist  

* 备注2：若出现版本不兼容，或配置不正确的错误，那么需更换依赖包版本：

  ```
  npm i less-loader@5 postcss-loader@3
  ```

* 运行指令：
  
  * npm run build

### 3. js语法检查
* 概述：对js基本语法错误/隐患，进行提前检查

* 安装loader
  
  * npm install eslint-loader eslint  -D
  
* 安装检查规则库：
  
  * npm install eslint-config-airbnb-base  eslint-plugin-import  -D
  
* 备注:eslint-config-airbnb-base定制了一套标准的、常用的js语法检查规则，推荐使用

* 配置loader
    ```js
    module: {
      rules: [
        {
	        // 对js进行语法检查
	        test: /\.js$/,
	        exclude: /node_modules/,//排除这个文件
	        // 优先执行
	        enforce: 'pre',//优先执行  只要webpack启动时  尽可能先执行  可不写
	        loader: 'eslint-loader',
	        options: {
	          fix: true //若有问题自动修复，重要！！！！
        	}
		}      
      ]
    }
    ```
    
* 修改package.json   库的底层实现  
    ```js
	"eslintConfig": {
	  "extends": "airbnb-base", //直接使用airbnb-base提供的规则 需要下载的
	  "env": {
	   "browser": true//如果运行环境不是浏览器  则运行环境为node  此时需要将这个改为false
	  }
	}
    ```
    
* 运行指令：webpack

* 备注：若出现：warning  Unexpected  console statement  no-console警告，意思是不应该在项目中写console.log(),若想忽略，就在要忽略检查代码的上方输入一行注释：// eslint-disable-next-line即可。

     琳-黄色的警告证明打印了log  可在上面加eslint-disable-next-line  也可以不管它

    琳-红色

### 4. js语法转换
* 概述：将浏览器不能识别的新语法转换成原来识别的旧语法，做浏览器兼容性处理

* 安装loader  
  
  * 琳--webpack4版本以上可直接安装  3版本的还需定义@后面的版本  借鉴官网
  * npm install babel-loader @babel/core @babel/preset-env  -D
  
* 配置loader
    ```js
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
    ```
    
* 运行指令：webpack

### 5. js兼容性处理
* 安装包
  
  * npm install @babel/polyfill
  
     琳-用于高级兼容  可以解决babel中无法解决的  大项目没有不用的 记住  可以解决ie中不认识promise
  
    琳-在app.js中引入
* 使用
	```
	- app.js
		import '@babel/polyfill'; // 包含ES6的高级语法的转换
	```

### 6. 压缩html、压缩js
* 直接修改webpack.prod.js中的model为production即可。
* 备注：若设置了模式为production，必须在new HtmlWebpackPlugin时添加配置minify: false：
```js
new HtmlWebpackPlugin({
    // 以当前文件为模板创建新的HtML(1. 结构和原来一样 2. 会自动引入打包的资源)
    template: './src/index.html', 
    minify: false
}),
```

### 7.压缩css 

​	webpack 4.0版本以上可以自动压缩html  js  不能压缩css  optimize优化  assets静态资源

- 安装插件

  ```
  npm install optimize-css-assets-webpack-plugin -D 
  ```

- 引入插件

  ```
  const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');	
  ```

- 配置插件

  ```js
  new OptimizeCssAssetsPlugin({
    cssProcessorPluginOptions: {
      preset: ['default', { discardComments: { removeAll: true } }],//移出所有注释
    },
  })
  ```

  > 以上就是webpack生产环境的配置，可以生成打包后的文件。

