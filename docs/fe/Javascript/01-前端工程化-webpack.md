## 1.前端工程化

### 1.前端开发中遇到的问题

- 想要使用 ES6+ 新特性，但是兼容有问题
- 想要使用 Less/Sass/PostCSS 增强 CSS 的编程性，但是运行环境不能直接支持
- 想要使用模块化的方式提高项目的可维护性，但运行环境不能直接支持
- 部署上线前需要手动压缩代码及资源文件，部署过程需要手动上传代码到服务器
- 多人协同开发，无法硬性统一大家的代码风格，从仓库中 pull 回来的代码质量无法保证

### 2.主要解决的问题

- 传统语言或语法的弊端
- 无法使用模块化/组件化
- 重复的机械式工作
- 代码风格统一、质量保证
- 依赖后端服务接口支持
- 整体依赖后端项目

### 3. 工程化表现

- 创建项目

  - 创建项目结构
  - 创建特定类型文件

- 编码

  - 格式化代码
  - 校验代码风格
  - 编译/构建/打包

- 预览/测试 + Web Server / Mock

  - Live Reloading / HMR
  - Source Map

- 提交

  - Git Hooks
  - Lint-staged
  - 持续集成

- 部署

  - CI / CD
  - 自动发布

### 4. 工程化不等于某个具体工具

工具并不是工程化的核心，工程化的核心是对项目的整体规划或架构，工具只是落地和实现工程化的一个手段

一些成熟的工程化集成：

- create-react-app
- vue-cli
- angular-cli
- gatsby-cli

上面的几个是项目官方提供的集成化工程方案

### 5. 工程化与 Node.js

工程化工具都是 Node.js 开发的

## 2.自动化构建

- 源代码自动化构建成生产代码，也称为自动化构建工作流
- 使用提高效率的语法、规范和标准，如：ECMAScript Next、Sass、模板引擎，这些用法大都不被浏览器直接支持，自动化工具就是解决这些问题的，构建转换那些不被支持的特性

### 1.NPM Scripts

在 package.json 中增加一个 scripts 对象，如：

```json
{
  "scripts": {
    "build": "sass scss/main.scss css/style.css"
  }
}
```

scripts 可以自动发现 node_modules 里面的命令，所以不需要写完整的路径，直接写命令的名称就可以

然后可以通过 npm 或 yarn 运行 scripts 下面的命令名称

npm 用 run 启动，yarn 可以省略 run，如：`npm run build`或`yarn build`

NPM Scripts 是实现自动化构建工作流的最简单方式

```json
{
  "scripts": {
    "build": "sass scss/main.scss css/style.css",
    "preserve": "yarn build serve",
    "serve": "browser-sync ."
  }
}
```

preserve 是一个钩子，保证在执行 serve 之前，会先执行 build ，使样式先处理，然后再执行 serve

通过 `--watch` 可以监听 sass 文件的变化自动编译，但是此时 sass 命令在工作时，命令行会阻塞，去等待文件的变化，导致了后面的 serve 无法去工作，此时就需要同时去执行多个任务，要安装 `npm-run-all` 这个模块

```json
{
  "scripts": {
    "build": "sass scss/main.scss css/style.css --watch",
    "serve": "browser-sync . --files \"css/*.css\"",
    "start": "run-p build serve"
  }
}
```

运行 npm run start 命令，build 和 serve 就会被同时执行

### 2.Grunt

Grunt 是最早的前端构建系统，它的插件生态非常完善，它的插件可以帮你完成任何你想做的事情

由于 Grunt 工作过程是基于临时文件去实现的，所以会比较慢

如何使用 Grunt：

- 安装 grunt：`yarn add grunt` ，
- 编写 `gruntfile.js` 文件

下面举例 grunt 任务的几种用法：

```js
// Grunt的入口文件
// 用于定义一些需要Grunt自动执行的任务
// 需要导出一个函数
// 此函数接受一个grunt的形参，内部提供一些创建任务时可以用到的API

module.exports = (grunt) => {
  grunt.registerTask("foo", () => {
    // 第一个参数是任务名字，第二个参数接受一个回调函数，是指定任务的执行内容，执行命令是yarn grunt foo
    console.log("hello grunt ~");
  });

  grunt.registerTask("bar", "任务描述", () => {
    // 如果第二个参数是字符串，则是任务描述，执行命令是yarn grunt bar
    console.log("other task~");
  });

  grunt.registerTask("default", () => {
    // 如果任务名称是'default'，则为默认任务，grunt在运行时不需要执行任务名称，自动执行默认任务，执行命令是yarn grunt
    console.log("default task");
  });

  grunt.registerTask("default", ["foo", "bar"]); // 一般用default映射其他任务，第二个参数传入一个数组，数组中指定任务的名字，grunt执行默认任务，则会依次执行数组中的任务，执行命令是yarn grunt

  // grunt.registerTask('async-task', () => {
  //   setTimeout(() => {
  //     console.log('async task working')
  //   }, 1000);
  // })

  // 异步任务，done()表示结束
  grunt.registerTask("async-task", function () {
    // grunt代码默认支持同步模式，如果需要异步操作，则需要通过this.async()得到一个回调函数，在你的异步操作完成过后，去调用这个回调函数，标记这个任务已经被完成。知道done()被执行，grunt才会结束这个任务的执行。执行命令是yarn grunt async-task
    const done = this.async();
    setTimeout(() => {
      console.log("async task working..");
      done();
    }, 1000);
  });

  // 失败任务
  grunt.registerTask("bad", () => {
    // 通过return false标志这个任务执行失败,执行命令是yarn grunt bad。如果是在任务列表中，这个任务的失败会导致后序所有任务不再被执行,执行命令是yarn grunt。可以通过--force参数强制执行所有的任务，,执行命令是yarn grunt default --force
    console.log("bad working...");
    return false;
  });

  // 异步失败任务，done(false)表示任务失败,执行命令是yarn grunt bad-async-task
  grunt.registerTask("bad-async-task", function () {
    const done = this.async();
    setTimeout(() => {
      console.log("bad async task working..");
      done(false);
    }, 1000);
  });
};
```

grunt 配置选项

```js
module.exports = (grunt) => {
  grunt.initConfig({
    // 对象的属性名一般与任务名保持一致。
    // foo: 'bar'
    foo: {
      bar: 123,
    },
  });

  grunt.registerTask("foo", () => {
    // console.log(grunt.config('foo')) // bar
    console.log(grunt.config("foo.bar")); // 123.grunt的config支持通过foo.bar的形式获取属性值，也可以通过获取foo对象，然后取属性
  });
};
```

多目标任务（相当于子任务）

```js
module.exports = (grunt) => {
  grunt.initConfig({
    // 与任务名称同名
    build: {
      options: {
        // 是配置选项，不会作为任务
        foo: "bar",
      },
      // 每一个对象属性都是一个任务
      css: {
        options: {
          // 会覆盖上层的options
          foo: "baz",
        },
      },
      // 每一个对象属性都是一个任务
      js: "2",
    },
  });

  // 多目标任务，可以让任务根据配置形成多个子任务，registerMultiTask方法，第一个参数是任务名，第二个参数是任务的回调函数
  grunt.registerMultiTask("build", function () {
    console.log(this.options());
    console.log(`build task: ${this.target}, data: ${this.data}`);
  });
};
```

执行命令：`yarn grunt build`, 输出结果：

```
    Running "build:css" (build) task
    { foo: 'baz' }
    build task: css, data: [object Object]

    Running "build:js" (build) task
    { foo: 'bar' }
    build task: js, data: 2
```

grunt 插件使用：

插件机制是 grunt 的核心，因为很多构建任务都是通用的，社区当中也就出现了很多通用的插件，这些插件中封装了很多通用的任务，一般情况下我们的构建过程都是由通用的构建任务组成的

先去 npm 中安装 需要的插件，再去 gruntfile 中使用 grunt.loadNpmTasks 方法载入这个插件，最后根据插件的文档完成相关的配置选项。

例如使用 clean 插件，安装 `yarn add grunt-contrib-clean`，用来清除临时文件

```js
module.exports = (grunt) => {
  // 多目标任务需要通过initConfig配置目标
  grunt.initConfig({
    clean: {
      temp: "temp/**", // ** 表示temp下的子目录以及子目录下的文件
    },
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
};
```

执行：`yarn grunt clean` ，就会删除 temp 文件夹

Grunt 常用插件总结：

- grunt-sass
- grunt-babel
- grunt-watch

```js
const sass = require("sass");
const loadGruntTasks = require("load-grunt-tasks");
module.exports = (grunt) => {
  grunt.initConfig({
    sass: {
      options: {
        sourceMap: true,
        implementation: sass, // implementation指定在grunt-sass中使用哪个模块对sass进行编译，我们使用npm中的sass
      },
      main: {
        files: {
          "dist/css/main.css": "src/scss/main.scss",
        },
      },
    },
    babel: {
      options: {
        presets: ["@babel/preset-env"],
        sourceMap: true,
      },
      main: {
        files: {
          "dist/js/app.js": "src/js/app.js",
        },
      },
    },
    watch: {
      js: {
        files: ["src/js/*.js"],
        tasks: ["babel"],
      },
      css: {
        files: ["src/scss/*.scss"],
        tasks: ["sass"],
      },
    },
  });

  // grunt.loadNpmTasks('grunt-sass')
  loadGruntTasks(grunt); // 自动加载所有的grunt插件中的任务

  grunt.registerTask("default", ["sass", "babel", "watch"]);
};
```

### 3.Gulp

Gulp 是目前世界上最流行的前端构建系统，其核心特点就是高效、易用

它很好的解决了 Grunt 中读写磁盘慢的问题，Gulp 是基于内存操作的。Gulp 支持同时执行多个任务，效率自然大大提高，而且它的使用方式相对于 Grunt 更加易懂，而且 Gulp 的生态也非常完善，所以后来居上，更受欢迎

gulp 的使用：

- 安装 gulp：`yarn add gulp`，然后编写 gulpfile.js，通过导出函数成员的方式定义 gulp 任务

```js
// gulp的入口文件
exports.foo = (done) => {
  console.log("foo task working...");
  done(); // 使用done()标识任务完成
};

exports.default = (done) => {
  console.log("default task working...");
  done();
};
```

执行命令：`yarn gulp foo`执行 foo 任务， 或者 `yarn gulp` 执行默认任务 default

gulp4.0 之前的任务写法：

```js
const gulp = require("gulp");

gulp.task("bar", (done) => {
  console.log("bar working...");
  done();
});
```

执行命令 yarn gulp bar 可以运行 bar 任务，gulp4.0 之后也保留了这个 API，但是不推荐使用了

gulp 创建组合任务：series 串行、parallel 并行：

```js
const { series, parallel } = require("gulp");

// gulp的入口文件
exports.foo = (done) => {
  console.log("foo task working...");

  done(); // 标识任务完成
};

exports.default = (done) => {
  console.log("default task working...");
  done();
};

const task1 = (done) => {
  setTimeout(() => {
    console.log("task1 working...");
    done();
  }, 1000);
};

const task2 = (done) => {
  setTimeout(() => {
    console.log("task2 working...");
    done();
  }, 1000);
};

const task3 = (done) => {
  setTimeout(() => {
    console.log("task3 working...");
    done();
  }, 1000);
};

// series 串行执行
// exports.bar = series(task1, task2, task3)

// parallel 并行执行
exports.bar = parallel(task1, task2, task3);
```

Gulp 的异步任务：

```js
const fs = require("fs");

exports.callback = (done) => {
  console.log("callback task...");
  done(); // 通过使用done()标志异步任务执行结束
};

exports.callback_error = (done) => {
  console.log("callback task...");
  done(new Error("task failed!")); // done函数也是错误优先回调函数。如果这个任务失败了，后序任务也不会工作了
};

exports.promise = () => {
  console.log("promise task...");
  return Promise.resolve(); // resolve执行的时候，表示异步任务执行结束了。resolve不需要参数，因为gulp会忽略它的参数
};

exports.promise_error = () => {
  console.log("promise task...");
  return Promise.reject(new Error("task failed")); // reject标志这是一个失败的任务，后序的任务也会不再执行
};

const timeout = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
exports.async = async () => {
  await timeout(1000); // 在node8以上可以使用async和await，await的就是一个Promise对象
  console.log("async task...");
};

exports.stream = (done) => {
  // 最常用的就是基于stream的异步任务
  const readStream = fs.createReadStream("package.json");
  const writeSteam = fs.createWriteStream("temp.txt");
  readStream.pipe(writeSteam);
  return readStream; // 相当于下面的写法
  // readStream.on('end', () => {
  //    done()
  // })
};
```

Gulp 构建过程，例子：压缩 CSS：

```js
const fs = require("fs");
const { Transform } = require("stream");

exports.default = () => {
  // 文件读取流
  const read = fs.createReadStream("normalize.css");
  const write = fs.createWriteStream("normalize.min.css");
  // 文件转化流
  const transform = new Transform({
    transform: (chunk, encoding, callback) => {
      // 核心转化过程
      // chunk => 读取流中读取的内容(Buffer)
      const input = chunk.toString();
      // 转化空白符和注释
      const output = input.replace(/\s+/g, "").replace(/\/\*.+?\*\//g, "");
      callback(null, output);
    },
  });

  read
    .pipe(transform) // 先转化
    .pipe(write);

  return read;
};
```

Gulp 文件 API：

```js
const { src, dest } = require("gulp");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");

exports.default = () => {
  return src("src/*.css")
    .pipe(cleanCss())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest("dist"));
};
```

Gulp 构建案例：

```js
// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require("gulp");

const del = require("del");
const browserSync = require("browser-sync");

const bs = browserSync.create();

const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();

const { sass, babel, swig, imagemin } = plugins;

const data = {
  menus: [
    {
      name: "Home",
      icon: "aperture",
      link: "index.html",
    },
    {
      name: "Features",
      link: "features.html",
    },
    {
      name: "About",
      link: "about.html",
    },
    {
      name: "Contact",
      link: "#",
      children: [
        {
          name: "Twitter",
          link: "https://twitter.com/w_zce",
        },
        {
          name: "About",
          link: "https://weibo.com/zceme",
        },
        {
          name: "divider",
        },
        {
          name: "About",
          link: "https://github.com/zce",
        },
      ],
    },
  ],
  pkg: require("./package.json"),
  date: new Date(),
};

const clean = () => {
  return del(["dist", "temp"]);
};

const style = () => {
  return src("src/assets/styles/*.scss", { base: "src" })
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

const script = () => {
  // base:'src'会保留源代码src后面的路径
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

const page = () => {
  return src("src/**/*.html", { base: "src" })
    .pipe(swig(data))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

const image = () => {
  return src("src/assets/images/**", { base: "src" }).pipe(imagemin()).pipe(dest("dist"));
};

const font = () => {
  return src("src/assets/fonts/**", { base: "src" }).pipe(imagemin()).pipe(dest("dist"));
};

const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

const serve = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);

  watch(["src/assets/images/**", "src/assets/fonts/**", "public/**"], bs.reload);

  bs.init({
    notify: false,
    port: 2080,
    open: false,
    // files: 'temp/**',
    server: {
      baseDir: ["temp", "src", "public"], // 按顺序查找
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

const useref = () => {
  return src("temp/*.html", { base: "temp" })
    .pipe(plugins.useref({ searchPath: ["temp", "."] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest("dist"));
};

// const compile = parallel(style, script, page, image, font)
const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = series(clean, parallel(series(compile, useref), image, font, extra));

// 开发阶段
const develop = series(compile, serve);

module.exports = {
  clean,
  compile,
  build,
  develop,
};
```

其中依赖文件如下：

```json
"devDependencies": {
    "@babel/core": "^7.10.2",
    "@babel/preset-env": "^7.10.2",
    "browser-sync": "^2.26.7",
    "del": "^5.1.0",
    "gulp": "^4.0.2",
    "gulp-babel": "^8.0.0",
    "gulp-clean-css": "^4.3.0",
    "gulp-htmlmin": "^5.0.1",
    "gulp-if": "^3.0.0",
    "gulp-imagemin": "^7.1.0",
    "gulp-load-plugins": "^2.0.3",
    "gulp-sass": "^4.1.0",
    "gulp-swig": "^0.9.1",
    "gulp-uglify": "^3.0.2",
    "gulp-useref": "^4.0.1"
  },
```

### 4. FIS

FIS 是百度的前端团队推出的构建系统，FIS 相对于前两种微内核的特点，它更像是一种捆绑套餐，它把我们的需求都尽可能的集成在内部了，例如资源加载、模块化开发、代码部署、甚至是性能优化。正式因为 FIS 的大而全，所以在国内流行。FIS 适合初学者。

全局安装：yarn global add fis3

执行 fis3 release

## 3.模块化开发

模块化开发时当前最重要的前端开发范式之一，模块化只是思想

### 1.模块化演变过程

#### Stage1 文件划分方式

- 污染全局作用域
- 命名冲突问题
- 无法管理模块依赖
- 早期模块化完全依靠约定

#### Stage2 命名空间方式

- 每个模块只暴露一个全局对象，所有模块都挂载到这个对象上
- 减少了命名冲突的可能
- 但是没有私有空间，模块成员可以在外部被访问或修改
- 模块之间的依赖关系没有得到解决

#### Stage3 IIFE 立即执行函数

- 使用立即执行函数包裹代码，要输出的遍历挂载到一个全局对象上
- 变量拥有了私有空间，只有通过闭包修改和访问变量
- 参数作为依赖声明去使用，使得每个模块的依赖关系变得明显

### 2.模块化规范

#### 1. CommonJS 规范

- 一个文件就是一个模块
- 每个模块都有单独的作用域
- 通过 module.exports 导出成员
- 通过 require 函数载入模块
- CommonJS 是以同步模式加载模块

#### 2.AMD(Asynchronous Module Definition)异步模块规范

模块加载器：Require.js

```js
// 定义一个模块
define("module1", ["jquery", "./module2"], function ($, module2) {
  return {
    start: function () {
      $("body").animate({ margin: "200px" });
      module2();
    },
  };
});
```

```js
// 载入一个模块
require(["./module1"], function (module1) {
  module1.start();
});
```

- 目前绝大多数第三方库都支持 AMD 规范
- AMD 使用起来相对复杂
- 模块 JS 文件请求频繁

#### 3.淘宝推出的 Sea.js + CMD(Common Module Definition)通用模块规范

```js
// CMD 规范 （类似 CommonJS 规范）
define(function (require, exports, module) {
  // 通过 require 引入依赖
  var $ = require("jquery");
  // 通过 exports 或者 module.exports 对外暴露成员
  module.exports = function () {
    console.log("module 2~");
    $("body").append("<p>module2</p>");
  };
});
```

#### 4.ES Module

```js
// ./modulejs
const foo = "es modules";
export { foo };
```

```js
// ./app.js
import { foo } from "./module.js";
console.log(foo); // => es modules
```

- 自动采用严格模式，忽略'use strict'
- 每个 ESM 模块都是单独的私有作用域
- ESM 是通过 CORS 去请求外部 JS 模块的
- ESM 的 script 标签会延迟脚本执行

#### 5.模块化标准规范

- 在 node.js 中使用 CommonJS
  - CommonJS 是 node.js 内置的模块化工具，只需要遵循 CommonJS 的标准即可，不需要引入别的依赖
- 在浏览器中使用 ES Modules
  - ES Modules 是 ECMAScript2015

## 4.常用的模块化打包工具

模块化打包工具的由来：ES Modules 存在环境兼容问题、模块文件过多，网络请求频繁，而且所有的前端资源都需要模块化

打包工具解决的是前端整体的模块化，并不单指 JavaScript 模块化

### 1.webpack

webpack：模块打包器、模块加载器、代码拆分、载入资源模块

#### 1.webpack 的基本使用

1. 先在项目的根目录下执行 `yarn init -y` ,创建 `package.json`
2. 安装 webpack 相关依赖：`yarn add webpack webpack-cli --dev`
3. 查看 webpack 版本：`yarn webpack --version`, 4.43.0
4. 执行 `yarn webpack` 进行打包，生成了`dist`目录，里面有`main.js`文件
5. 修改 `index.html` 中的`index.js`的路径为 `dist/main.js`,并且去掉`script`标签的`type=module`的属性
6. 去 package.json 的 scripts 中定义一个 build 任务：`"build": "webpack"`，以后执行`yarn build`进行打包

#### 2.webpack 的配置文件

`webpack.config.js`文件是运行在 Nodejs 文件下的 js 文件，我们需要按照 CommonJS 的方式编写代码

这个文件需要导出一个对象，我们完成对应的配置选项

`webpack.config.js`文件内容：

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js", // 指定打包入口文件，如果是相对路径，前面的点不能少
  output: {
    filename: "bundle.js", // 输出文件的名称
    path: path.join(__dirname, "output"), // 输出路径，为绝对路径
  },
};
```

#### 3.webpack 工作模式

直接执行 webpack 打包的时候，控制台会有警告：

```shell
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

说没有指定工作模式，默认以生产模式打包，会进行代码的压缩

我们可以通过 cli 命令指定工作模式，就是增加一个`--mode`的参数,属性有三种选择，production、development、none

- production：生产模式会默认启动优化，优化我们的打包结果
- development：开发模式，会自动优化打包的速度，添加一些调试过程中的辅助到代码中
- none：原始状态的打包，不会做任何处理

可以通过 `yarn webpack --mode development` 来执行

此外，还可以在 webpack 的配置文件中指定工作模式，也就是增加一个 mode 属性，例如：`mode: "development"`

#### 4.webpack 资源模块加载

将配置文件中的`entry`属性的值改为`./src/main.css`，然后执行打包命令`yarn webpack`，会报错：

因为 webpack 默认会把文件当做 js 解析，所以打包 css 文件时，文件内容不符合 JS 语法则报错了

报错中提示我们可以寻找正确的 loader 去解析代码，webpack 内部的 loader 只能解析 js，所以我们要手动安装 css-loader 去处理 css 代码

执行命令：`yarn add css-loader --dev`

然后在 webpack 的配置文件中增加属性：

```js
module: {
  rules: [
    {
      test: /.css$/,
      use: "css-loader",
    },
  ];
}
```

我们增加外部的 loader 需要在配置文件中增加资源模块 module 属性，属性值是一个对象，对象中有一个 rules 数组，数组里每个元素都是一个对象，对象中的 test 属性是正则表达式，指明要处理的资源文件，use 属性是对该资源进行处理的 loader 名称

再次执行打包命令，发现 css 没有作用，是因为我们使用 css-loader 只是对 css 文件进行了打包，但是并没有作用到页面上，接下来还要安装一个`style-loader`,执行命令：`yarn add style-loader --dev`

`style-loader`是将`css-loader`处理后的结果，通过 style 的形式追加到页面上

然后将配置文件中的 `rules` 对应的处理 css 资源模块的 use 属性由`'css-loader'`改为`['style-loader', 'css-loader']`,`use`配置了多个`loader`，是一个数组，里面的`loader`是**从右往左**执行，所以要将`css-loader`写在后面，我们要先用`css-loader`将`css`代码转化成`js`模块，才可以正常打包

#### 5.webpack 导入资源模块

虽然 webpack 的入口文件可以是别的类型文件，但由于前端项目是由 JS 驱动，所以我们开发时一般将入口文件设置为 JS 文件，需要用到 CSS 时，就直接在 JS 文件中通过 import 导入即可,如：`import './main.css'`

webpack 建议我们根据代码的需要在 JS 中动态导入资源文件，因为需要资源的不是应用，而是代码。因为是 JavaScript 驱动了整个前端应用，这样做的好处是：

- 逻辑合理，JS 确实需要这些资源文件
- 确保上线资源不缺失，都是必要的

#### 6.webpack 文件资源加载器

安装文件资源加载器：`yarn add file-loader --dev`，相当于直接拷贝物理文件。不过此时资源文件路径会出现问题，webpack 默认认为它打包过后的文件会放在网站的根目录下面，此时需要在配置文件中的`output`属性中指定`publicPath`属性值为`dist/`,即：`publicPath: 'dist/'`,这样在打包时，文件的输出路径前面会拼接上`publicPath`的值

#### 7.webpack URL 加载器

格式：协议 + 媒体类型和编码 + 文件内容

格式： `data:[<mediatype>][;base64],<data>`

例如：`data:text/html;charset=UTF-8,<h1>html content</h1>`

- 先安装 url-loader：`yarn add url-loader --dev`

- 修改 png 文件的 loader 为 url-loader

```js
{
  test: /.png$/,
  // use: 'file-loader',
  use: 'url-loader'
}
```

执行`yarn webpack`，此时的 png 文件的 URL 则为 data 协议的了

最佳使用方式：

- 小文件使用 Data URLs，减少请求次数
- 大文件独立提取存放，提高加载速度

配置方式：

```js
{
  	test: /.png$/,
    // use: 'file-loader',
    use: {
        loader: 'url-loader',
        options: {
          limit: 10 * 1024, // 单位是字节 10KB
        }
    }
}
```

- 超过 10KB 的文件单独提取存放
- 小于 10KB 文件转换为 Data URLs 嵌入代码中

> 注意：这种方式还是要安装`file-loader`，因为对超出大小的文件还是会调用`file-loader`，如果没有 file-loader 会报错

#### 8.webpack 常用加载器分类

1. 编译转换类，转换为 JS 代码，如`css-loader`
2. 文件操作类，将资源文件拷贝到输出目录，将文件访问路径向外导出，如：`file-loader`
3. 代码检查器，统一代码风格，提高代码质量，如：`es-loader`

#### 9.webpack 处理 ES2015

因为模块打包需要，所以处理`import`和`export`，除此之外，并不能转换其他的 ES6 特性。如果想要处理 ES6，需要安装转化 ES6 的编译型 loader，最常用的就是`babel-loader`，`babel-loader`依赖于`babel`的核心模块，`@babel/core`和`@babel/preset-env`

- 执行命令：`yarn add babel-loader @babel/core @babel/preset-env --dev`
- 修改 js 的 loader

```js
	{
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
         exclude: /(node_modules)/, // 这里很重要，千万别忘了，否则会出错的。
      }
```

PS：Webpack 只是打包工具，加载器可以用来编译转化代码

#### 10.webpack 的模块加载方式

1. 遵循 ES Modules 标准的 import 声明

2. 遵循 CommonJS 标准的 require 函数。对于 ES 的默认导出，要通过`require('./XXX').default`的形式获取

3. 遵循 AMD 标准的 define 函数和 require 函数

4. Loader 加载的非 JavaScript 也会触发资源加载

- 样式代码中的@import 指令和 url 函数

```js
@import url(reset.css);

body {
  margin: 0 auto;
  padding: 0 20px;
  max-width: 800px;
  background: url(1.png);
  background-size: cover;
}
```

css-loader 在处理 css 代码时，遇到了 background 属性中的 url 函数，发现是引入的资源文件是 png 格式的文件，则将这个资源文件交给 url-loader 处理

- HTML 代码中的图片标签的 src 属性

```js
	{
        test: /.html$/,
        use: {
          loader: 'html-loader',
          options: {
             // html-loader默认只处理页面中的img标签的src属性的资源文件，所以指定其他标签的资源文件也要处理
            attributes: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src'
                },
                {
                  tag: 'a',
                  attribute: 'href',
                  type: 'src'
                }
              ]
            }
          }
        }
      }
```

#### 11.webpack 开发 loader

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/webpack.png" style="zoom: 33%;" />

实现一个 markdown 的文件加载器

`Loader`作为`webpack`的核心机制，内部的工作原理也非常简单，我们通过开发一个自己的`loader`，来深入了解`loader`的工作原理

我们的需求是实现一个`markdown`文件的加载器，这个加载器可以在代码当中直接导入`markdown`文件。`markdown`文件一般是被转换为`html`过后再去呈现到页面上的，所以我们导入的`markdown`文件得到的结果就是转换过后的 html 字符串

在项目的根目录下新建一个`markdown-loader.js`文件，每一个`webpack`的`loader`都需要去导出一个函数，这个函数就是我们这个`loader`的对我们所加载到的资源的一个处理过程，它的输入就是我们资源文件的内容，输出就是我们此次加工过后的一个结果

那我们通过`source`参数去接收输入，然后通过我们的返回值去输出，我们先尝试打印一下这个`source`，然后直接去返回一个`hello`，我们去看一下结果，我们回到`webpack`配置文件中去添加一个加载新的规则配置，我们匹配到的扩展名就是`.md`，就是我们刚刚所编写的`markdown-loader`的模块，我们的`use`属性不仅仅只可以使用模块的名称，其实对于模块的文件路径也是可以的，这一点其实与`node`当中的`require`函数是一样的，所以直接使用相对路径去找到这个`markdown-loader`，配置好过后，运行打包命令，打包过程当中命令行确实打印出来了我们所导入的 markdown 的内容，那这也就意味着我们的`source`确实是所导入的文件内容，但是它同时也爆出一个解析错误，说的是`you many need additional load to handle the result of this loader`，就是我们还需要一个额外的加载器来去处理我们当前的加载结果，那这究竟是为什么呢？

```js
module.exports = (source) => {
  console.log(source);
  return "hello";
};
```

其实`webpack`的加载资源的过程有点类似于一个工作管道，你可以在这个过程当中一次去使用多个`loader`，但是还要求我们最终这个管道工作过后的结果必须是一段`JavaScript`代码，因为我们这返回的内容是一个`hello`，它不是一个标准的`JavaScript`代码，所以我们这才会出现这样的错误提示，那知道这个错误的原因过后，解决的办法其实也就很明显了，那要么就是我们这个`loader`的直接去返回一段标准的`JavaScript`代码，要么就是我们再去找一个合适的加载器，接着去处理我们这里返回的结果

我们先来尝试第一种办法。回到我们`markdown-loader.js`的当中，我们将返回的这个内容修改为`'console.log("hello")'`，那这就是一段标准的 JavaScript 代码，然后我们再一次运行打包，那此时打包过程当中就不再会报错了

```js
module.exports = (source) => {
  console.log(source);
  return 'console.log("hello")';
};
```

接下来我们一起来看一下打包过后的结果究竟是什么样的，我们打开`bundle.js`当中，然后我们找到最后一个模块，可以看到，`webpack`打包的时候就是把我们刚刚`loader`加载过后的结果也就是返回的那个字符串直接拼接到我们这个模块当中了，那这也就解释了刚刚为什么说`loader`的管道最后必须要去返回`JavaScript`代码的原因，因为如果说你随便去返回一个内容的话，那放到这里语法就有可能不通过

那知道了这些过后，我们再回到`markdown-loader.js`的当中，然后接着去完成我们刚刚的需求，我们先去安装一个`markdown`解析的模块叫做`marked`，安装命令为：`yarn add marked --dev`

安装完成过后，我们再回到代码当中去导入这个模块。然后在我们的加载器当中去使用这个模块，去解析来自参数当中的这个`source`，我们的返回值就是一段`html`字符串，也就是转换过后的结果，但是如果直接返回这个`html`的话，那就会面临刚刚同样的问题，正确的做法就是把这段`html`变成一段`JavaScript`代码，其实我们希望是把这一段`html`作为我们当前这个模块导出的字符串，也就是我们希望通过`export`导出这样一个字符串，但是如果说我们只是简单的拼接的话，那我们`html`当中存在的换行符还有它内部的一些引号，拼接到一起就有可能造成语法上的错误，所以说这里我使用一个小技巧，就是通过`JSON.stringify`先将这个字符串转换为一个标准的`JavaScript`格式字符串，那此时内部的引号以及换方符都会被转义过来，然后我们再参与拼接，那这样的话就不会有问题了，我们再次运行打包，看一下打包的结果，那此时我们所看到的结果就是我们所需要的了，当然了，除了`module.exports`这种方式有外，`webpack`的还允许我们在返回的代码当中直接去使用`ESModule`的方式去导出

```js
const marked = require("marked");

module.exports = (source) => {
  // console.log(source)
  // return 'console.log("hello")'
  const html = marked(source);
  console.log(html);
  // 两种导出方式：
  // return `module.exports=${JSON.stringify(html)}`
  return `export default ${JSON.stringify(html)}`;
};
```

通过第一种方式解决了我们刚刚所看到的那样一个错误，我们再来尝试一下刚刚所说的第二种方法，那就是在我们`markdown-loader`的当中去返回一个`html`的字符串，然后我们交给下一个`loader`处理这个`html`的字符串，我们直接去返回`marked`的解析过后的`html`，然后我们再去安装一个用于去处理`html`加载的`loader`，叫做`html-loader`，完成过后，我们回到配置文件当中，我们把`use`属性修改为一个数组，那这样的话我们的`loader`工作过程当中就会依次去使用多个`loader`，那不过这里需要注意，就是它的执行顺序是从数组的后面往前面，那也就是说我们应该把先执行的`loader`放到后面，后执行的`loader`放到前面

```js
const marked = require("marked");

module.exports = (source) => {
  // console.log(source)
  // return 'console.log("hello")'
  const html = marked(source);
  console.log(html);
  return html;
};
```

```js
module: {
  rules: [
    {
      test: /.md$/,
      use: ["html-loader", "./markdown-loader.js"],
    },
  ];
}
```

回到命令行进行打包，此时我们打包的结果仍然是可以的，我们`marked`处理完的结果是一个`html`的字符串，然后这个`html`字符串交给了下一个`loader`，也就是`html-loader`，那这个`loader`又把它转换成了一个导出这个字符串的一个`JavaScript`代码，那这样的话我们 webpack 再去打包的时候就可以正常工作了

那通过以上的这些尝试我们就发现了 loader 它内部的一个工作原理其实非常简单，就是一个**从输入到输出之间的一个转换**，那除此之外，我们还了解了 loader，它实际上是一种管道的概念，我们可以将我们此次的这个`loader`的结果交给下一个`loader`去处理，然后我们通过多个`loader`去完成一个功能，那例如我们之前所使用的`css-loader`和`style-loader`之间的一个配合，包括我们后面还会使用到的，像`sass`或者`less`这种`loader`他们也需要去配合我们刚才所说到的这两种`loader`，这就是`loader`的工作管道这样一个特性

#### 12.Webpack 插件机制

插件机制的是`webpack`一个核心特性，目的是为了增强`webpack`自动化方面的能力

- Loader 专注实现资源模块的加载，从而去实现整体项目的打包
- Plugin 解决除了资源加载以外的其他的一些自动化工作

自动在打包之前去清除 dist 目录，安装：`yarn add clean-webpack-plugin --dev`

webpack.config.js

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
plugins: [new CleanWebpackPlugin()];
```

自动生成 HTML 插件，安装：`yarn add html-webpack-plugin --dev`

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin()];
```

- 自动生成`HTML`文件到`dist`目录中，根目录下的 index.html 则不再需要了

- HTML 中自动注入了`bundle.js`的引用到`HTML`文件中

- 增加配置参数生成 HTML 文件：

```js
new HtmlWebpackPlugin({
  title: "Webpack Plugin Sample",
  meta: {
    viewport: "width=device-width",
  },
});
```

通过模板文件生成 HTML 文件, webpack.config.js 中指定 HtmlWebpackPlugin 的 template 参数

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack</title>
  </head>
  <body>
    <div class="container">
      <h1><%= htmlWebpackPlugin.options.title %></h1>
    </div>
  </body>
</html>
```

```js
plugins: [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    title: "Webpack Plugin Sample",
    meta: {
      viewport: "width=device-width",
    },
    template: "./src/index.html",
  }),
];
```

生成多个 HTML 页面：

```js
plugins: [
  new CleanWebpackPlugin(),
  // 用于生成index.html
  new HtmlWebpackPlugin({
    title: "Webpack Plugin Sample",
    meta: {
      viewport: "width=device-width",
    },
    template: "./src/index.html",
  }),
  // 用于生成about.html
  new HtmlWebpackPlugin({
    filename: "about.html",
  }),
];
```

拷贝那些不需要参与打包的资源文件到输出目录，安装：`yarn add copy-webpack-plugin --dev`

```js
const CopyWebpackPlugin = require("copy-webpack-plugin");

new CopyWebpackPlugin({
  patterns: ["public"],
});
```

压缩我们打包结果输出的代码

#### 13.webpack 开发插件

相比于 Loader，Plugin 拥有更宽的能力范围，Plugin 通过钩子机制实现

Webpack 要求插件必须是一个函数或者是一个包含 apply 方法的对象。通过在生命周期的钩子中挂载函数实现扩展

```js
class MyPlugin {
  apply(compiler) {
    console.log("MyPlugin 启动");
    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // compilation 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(name) // 文件名
        console.log(compilation.assets[name].source());
        if (name.endsWith(".js")) {
          const contents = compilation.assets[name].source();
          const withoutComments = contents.replace(/\/\*\*+\//g, "");
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length,
          };
        }
      }
    });
  }
}
```

```js
plugins: [new MyPlugin()];
```

#### 14.webpack 开发体验问题

- 自动进行编译：执行`yarn webpack --watch`会监视文件的变化自动进行打包
- 自动刷新浏览器：webpack-dev-server，安装：`yarn add webpack-dev-server`，执行：`yarn webpack-dev-server --open`

#### 15.webpack dev server 静态资源访问

Dev Server 默认只会 serve 打包输出文件，只要是 webpack 打包输出的文件都会被访问到，其他静态资源也需要被 server

```js
devServer: {
  static: path.resolve(__dirname, "./public");
  // contentBase: './public' 废弃
}
```

static 额外为开发服务器指定查找资源目录

#### 16.webpack Dev server 代理 API

webpack-dev-server 支持配置代理

```js
devServer: {
    contentBase: './public',
    proxy: {
      '/api': {// 以/api开头的地址都会被代理到接口当中
        // http://localhost:8080/api/users -> https://api.github.com/api/users
        target: 'https://api.github.com',
        // http://localhost:8080/api/users -> https://api.github.com/users
        pathRewrite: {
          '^/api': ''
        },
        // 不能使用localhost:8080作为请求GitHub的主机名
        changeOrigin: true, // 以实际代理的主机名去请求
      }
    }
  }
```

#### 17.Source Map

运行代码与源代码之间完全不同，如果需要调试应用，错误信息无法定位，调试和报错都是基于运行代码，SourceMap 就是解决这种问题的最好办法

Source Map 解决了源代码与运行代码不一致所产生的问题.

Webpack 支持 sourceMap 12 种不同的方式，每种方式的效率和效果各不相同。效果最好的速度最慢，速度最快的效果最差

eval 函数可以运行字符串当中的 js 代码：`eval("console.log(123)")`

当 devtool 的值为 eval，打包后的报错信息只有源代码文件名称，没有行列信息

每个关键词的特点组合：

- eval- 是否使用 eval 执行代码模块
- cheap- Source map 是否包含行信息
- module-是否能够得到 Loader 处理之前的源代码
- inline- SourceMap 不是物理文件，而是以 URL 形式嵌入到代码中
- hidden- 看不到 SourceMap 文件，但确实是生成了该文件
- nosources- 没有源代码，但是有行列信息。为了在生产模式下保护源代码不被暴露

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220322212722932.png" alt="image-20220322212722932" style="zoom: 50%;" />

开发模式推荐使用：`cheap-module-eval-source-map`，因为：

- 代码每行不会太长，没有列也没问题
- 代码经过 Loader 转换后的差异较大
- 首次打包速度慢无所谓，重新打包相对较快

**生产模式推荐使用：`none`**，原因

- Source Map 会暴露源代码
- 调试是开发阶段的事情
- 对代码实在没有信心可以使用`nosources-source-map`

#### 18.webpack HMR

HMR(Hot Module Replacement) 模块热替换，应用运行过程中，实时替换某个模块，应用运行状态不受影响

webpack-dev-server 自动刷新导致的页面状态丢失。我们希望在页面不刷新的前提下，模块也可以即使更新。热替换只将修改的模块实时替换至应用中

HMR 是 webpack 中最强大的功能之一，极大程度的提高了开发者的工作效率

HMR 已经集成在了 webpack-dev-server 中，运行`webpack-dev-server --hot`，也可以通过配置文件开启，并且载入插件

```json
devServer: {
	hot: true
}
// .....
plugins: [
	new Webpack.HotModuleReplacementPlugin()
]
```

Webpack 中的 HMR 并不是对所有文件开箱即用，样式文件支持热更新，脚本文件需要手动处理模块热替换逻辑。而通过脚手架创建的项目内部都集成了 HMR 方案

HMR 注意事项：

- 处理 HMR 的代码报错会导致自动刷新
- 没启动 HMR 的情况下，HMR API 报错
- 代码中多了很多与业务无关的代码

#### 19.webpack 生产环境优化

我们在开发环境中，更注重开发效率

模式(mode)，webpack 建议我们为不同的环境创建不同的配置，两种方案

配置文件根据环境不同导出不同配置：

```js
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const config = {
    mode: "none",
    entry: "./src/main.js",
    output: {
      filename: "bundle.js",
      path: path.join(__dirname, "dist"),
      // publicPath: 'dist/'
    },
    module: {
      rules: [
        {
          test: /.md$/,
          use: ["html-loader", "./markdown-loader.js"],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      // 用于生成index.html
      new HtmlWebpackPlugin({
        title: "Webpack Plugin Sample",
        meta: {
          viewport: "width=device-width",
        },
        template: "./src/index.html",
      }),
      // 用于生成about.html
      new HtmlWebpackPlugin({
        filename: "about.html",
      }),
      // 开发过程最好不要使用这个插件
      // new CopyWebpackPlugin({
      //   patterns: ['public']
      // }),
      // new MyPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
      contentBase: "./public",
      proxy: {
        "/api": {
          // 以/api开头的地址都会被代理到接口当中
          // http://localhost:8080/api/users -> https://api.github.com/api/users
          target: "https://api.github.com",
          // http://localhost:8080/api/users -> https://api.github.com/users
          pathRewrite: {
            "^/api": "",
          },
          // 不能使用localhost:8080作为请求GitHub的主机名
          changeOrigin: true, // 以实际代理的主机名去请求
        },
      },
      // hot: true
      hotOnly: true, // 如果热替换代码报错了，则不刷新
    },
    devtool: "eval-cheap-module-source-map",
  };

  if (env === "production") {
    config.mode = "production";
    config.devtool = false;
    config.plugins = [
      ...config.plugins,
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: ["public"],
      }),
    ];
  }
  return config;
};
```

一个环境对应一个配置文件

Webpack.common.js

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: `bundle.js`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
    }),
  ],
};
```

Webpack.dev.js

```js
const common = require("./webpack.common");
const merge = require("webpack-merge");

module.export = merge(common, {
  mode: "development",
});
```

Webpack.prod.js

```js
const common = require("./webpack.common");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: ["public"],
    }),
  ],
});
```

Package.json

```json
"scripts": {
    "build": "webpack --config webpack.prod.js"
  },
```

执行打包命令：`yarn build`

#### 20.webpack 优化配置

DefinePlugin 为代码注入全局成员，这个内置插件默认就会启动，往每个代码中注入一个全局变量`process.env.NODE_ENV`

```js
const webpack = require("webpack");

plugins: [
  new HtmlWebpackPlugin({
    filename: `index.html`,
  }),
  new webpack.DefinePlugin({
    API_BASE_URL: JSON.stringify("http://api.example.com"),
  }),
];
```

Tree-Shaking 摇掉代码中未引用到的代码(dead-code)，这个功能在生产模式下自动被开启

Tree-Shaking 并不是 webpack 中的某一个配置选项，而是一组功能搭配使用后的效果

```js
optimization: {
    usedExports: true,
    minimize: true
  }
```

合并模块函数 concatenateModules, 又被成为 Scope Hoisting，作用域提升

```js
optimization: {
    usedExports: true,
    minimize: true,
    concatenateModules: true
  }
```

很多资料中说如果使用 Babel-Loader ，会导致 Tree-Shaking 失效，因为 Tree-Shaking 前提是 ES Modules

由于 Webpack 打包的代码必须使用 ESM，为了转化 ES 中的新特性，会使用 babel 处理新特性，就有可能将 ESM 转化 CommonJS

而我们使用的`@babel/preset-env`这个插件集合就会转化 ESM 为 CommonJS，所以 Tree-Shaking 会不生效。**但是在最新版 babel-loader 关闭了转换 ESM 的插件，所以使用 babel-loader 不会导致 Tree-Shaking 失效**

sideEffects 副作用，指的是模块执行时除了导出成员之外所做的事情，sideEffects 一般用于 npm 包标记是否有副作用。如果没有副作用，则没有用到的模块则不会被打包

在 webpack.config.js 中开启这个功能：

```js
optimization: {
    usedExports: true,
    minimize: true,
    concatenateModules: true,
    sideEffects: true
  }
```

在 package.json 里面增加一个属性 sideEffects，值为 false，表示没有副作用，没有用到的代码则不进行打包。

确保你的代码真的没有副作用，否则在 webpack 打包时就会误删掉有副作用的代码，比如说在原型上添加方法，则是副作用代码；还有 CSS 代码也属于副作用代码

```js
"sideEffects": false
```

也可以忽略掉有副作用的代码：

```js
"sizeEffects": [
  "./src/extend.js",
  "*.css"
]
```

#### 21.Code Splitting 代码分包/代码分割

webpack 的一个弊端：所有的代码都会被打包到一起，如果应用复杂，bundle 会非常大

而并不是每个模块在启动时都是必要的，所以需要分包、按需加载。物极必反，资源太大了不行，太碎了也不行。太大了会影响加载速度；太碎了会导致请求次数过多，因为在目前主流的 HTTP1.1 有很多缺陷，如同域并行请求限制、每次请求都会有一定的延迟，请求的 Header 浪费带宽流量。所以模块打包时有必要的

目前的 webpack 分包方式有两种：

1. 多入口打包：适用于多页应用程序，一个页面对应一个打包入口，公共部分单独抽取。

```js
entry: {
  index: './src/index.js',
    album: './src/album.js'
},
output: {
    filename: '[name].bundle.js'
},
// 每个打包入口形成一个独立的chunk
plugins: [
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Nulti Entry',
      template: './src/album.html',
      filename: 'album.html',
      chunks: ['album']
    })
  ],
  // 不同的打包入口肯定会有公共模块，我们需要提取公共模块：
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
```

2. 动态导入：需要用到某个模块时，再加载这个模块，动态导入的模块会被自动分包。通过动态导入生成的文件只是一个序号，可以使用魔法注释指定分包产生 bundle 的名称。相同的 chunk 名会被打包到一起

```js
import(/* webpackChunkName: 'posts' */'./post/posts').then({default: posts}) => {
  mainElement.appendChild(posts())
}
```

#### 22.MiniCssExtractPlugin 可以提取 CSS 到单个文件

当 css 代码超过 150kb 左右才建议使用

```js
const MiniCssExtracPlugin = require('mini-css-extract-plugin')

module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtracPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
// ....

plugins: [
    new MiniCssExtractPlugin()
]
```

#### 23.OptimizeCssAssetsWebpackPlugin 压缩输出的 CSS 文件

webpack 仅支持对 js 的压缩，其他文件的压缩需要使用插件

可以使用 optimize-css-assets-webpack-plugin 压缩 CSS 代码。放到 minimizer 中，在生产模式下就会自动压缩

```js
optimization: {
  minimizer: [
    new TerseWebpackPlugin(), // 指定了minimizer说明要自定义压缩器，所以要把JS的压缩器指明，否则无法压缩
    new OptimizeCssAssetWebpackPlugin(),
  ];
}
```

#### 24.输出文件名 hash

生产模式下，文件名使用 Hash

项目级别的 hash

```js
output: {
      filename: '[name]-[hash].bundle.js'
  },
```

chunk 级别的 hash

```js
output: {
      filename: '[name]-[chunkhash].bundle.js'
  },
```

文件级别的 hash，:8 是指定 hash 长度 （推荐）

```js
output: {
      filename: '[name]-[contenthash:8].bundle.js'
  },
```

### 2.Rollup

Rollup 也是一款 ESModule 打包器，可以将项目中的细小模块打包成整块代码，使得划分的模块可以更好的运行在浏览器环境或者是 Nodejs 环境

Rollup 与 Webpack 作用非常类似，不过 Rollup 更为小巧，webpack 结合插件可以完成前端工程化的绝大多数工作，而 Rollup 仅仅是一款 ESM 打包器，没有其他功能，例如 Rollup 中并不支持类似 HMR 这种高级特性。Rollup 并不是要与 Webpack 全面竞争，而是提供一个充分利用 ESM 各项特性的高效打包器

#### 1.rollup 使用

./src/message.js

```js
export default {
  hi: "Hey Guys, I am yunmu ",
};
```

./src/logger.js

```js
export const log = (msg) => {
  console.log("---Info----");
  console.log(msg);
  console.log("-----------");
};

export const error = (msg) => {
  console.error("---Error-----");
  console.error(mes);
  console.error("-------------");
};
```

./src/index.js

```js
import { log } from "./logger";
import messages from "./message";

const msg = messages.hi;

log(msg);
```

安装 Rollup：`yarn add rollup --dev`

运行：`yarn rollup ./src/index.js --format iife --file dist/bundle.js`

./dist/bundle.js

```js
(function () {
  "use strict";

  const log = (msg) => {
    console.log("---Info----");
    console.log(msg);
    console.log("-----------");
  };

  var messages = {
    hi: "Hey Guys, I am jal ",
  };

  const msg = messages.hi;

  log(msg);
})();
```

Rollup 默认会开启 TreeShaking 优化输出结果。

配置文件：rollup.config.js

```js
export default {
  input: "./src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
};
```

运行：`yarn rollup --config` , 指定配置文件：`yarn rollup --config rollup.config.js`

#### 2.rollup 插件

Rollup 自身的功能就是对 ESM 进行合并打包，如果需要更高级的功能，如加载其他类型资源模块，导入 CommonJS 模块，编译 ES 新特性，Rollup 支持使用插件的方式扩展实现，插件是 Rollup 唯一的扩展方式

通过导入 json 文件学习如何使用 Rollup 插件。

安装插件`rollup-plugin-json`, 运行：`yarn add rollup-plugin-json --dev`

Rollup.config.js

```js
import json from "rollup-plugin-json";

export default {
  input: "./src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [json()],
};
```

./src/index.js

```js
import { log } from "./logger";
import messages from "./message";
import { name, version } from "../package.json";
const msg = messages.hi;

log(msg);
log(name);
log(version);
```

./dist/bundle.js

```js
(function () {
  "use strict";

  const log = (msg) => {
    console.log("---Info----");
    console.log(msg);
    console.log("-----------");
  };

  var messages = {
    hi: "Hey Guys, I am yunmu",
  };

  var name = "Rollup-test";
  var version = "1.0.0";

  const msg = messages.hi;

  log(msg);
  log(name);
  log(version);
})();
```

json 中用到的属性被打包进来了，没用到的属性被 TreeShaking 移除掉了

#### 3.rollup 加载 npm 依赖

Rollup 不能像 webpack 那样通过模块名称加载 npm 模块，为了抹平差异，Rollup 官方提供了一个插件`rollup-plugin-node-resolve`，通过这个插件，就可以在代码中使用模块名称导入模块

安装插件：`yarn add rollup-plugin-node-resolve --dev`

Rollup.config.js

```js
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
export default {
  input: "./src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [json(), resolve()],
};
```

./src/index.js

```js
import _ from "lodash-es"; // lodash模块的ESM版本
import { log } from "./logger";
import messages from "./message";
import { name, version } from "../package.json";
const msg = messages.hi;

log(msg);
log(name);
log(version);
log(_.camelCase("hello world"));
```

#### 4.Rollup 加载 CommonJS 模块

安装插件: `yarn add rollup-plugin-commonjs`

Rollup.config.js

```js
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
export default {
  input: "./src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [json(), resolve(), commonjs()],
};
```

./src/cjs.module

```js
module.exports = {
  foo: "bar",
};
```

./src/index.js

```js
import _ from "lodash-es"; // lodash模块的ESM版本
import { log } from "./logger";
import messages from "./message";
import { name, version } from "../package.json";
import cjs from "./cjs.module";
const msg = messages.hi;

log(msg);
log(name);
log(version);
log(_.camelCase("hello world"));

log(cjs);
```

./dist/bundle.js

```js
// ...

var cjs_module = {
  foo: "bor",
};

// ...

log(cjs_module);
// ...
```

#### 5.Rollup 代码拆分 : 动态导入

使用动态导入的方式实现模块的按需加载，Rollup 内部会自动去处理代码的拆分，也就是分包

Rollup.config.js

```js
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
export default {
  input: "./src/index.js",
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife',
    dir: "dist",
    format: "amd",
  },
  plugins: [json(), resolve(), commonjs()],
};
```

./src/index.js

```js
import("./logger").then(({ log }) => {
  log("code splitting~");
});
```

#### 6.Rollup 多入口打包

rollup.config.js

```js
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
export default {
  // input: './src/index.js',
  // input: ['src/index.js', 'src/album.js'], // 多入口打包
  input: {
    // 这种写法也可以进行多入口打包
    foo: "src/index.js",
    bar: "src/album.js",
  },
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife',
    dir: "dist", // 动态导入时会分包成多文件
    format: "amd", // 动态导入不支持iife
  },
  plugins: [json(), resolve(), commonjs()],
};
```

注意此时生成的 js 文件就要以 AMD 标准的 require 方式引入

### 3. Rollup、Webpack 选用原则

#### 1.Rollup 优势

- 输出结果更加扁平，执行效率更高
- 自动移除未引用的代码
- 打包结果依然完全可读

#### 2.Rollup 缺点

- 加载非 ESM 的第三方模块比较复杂
- 模块最终都会被打包到一个函数中，无法实现 HMR
- 浏览器环境中，代码拆分功能依赖 AMD 库

如果我们正在开发应用程序，需要引入大量的第三方库，代码量又大，需要分包打包，Rollup 的作用则会比较欠缺

如果我们正在开发一个框架或者类库，Rollup 的这些优点则非常有必要，缺点则可以忽略

所以大多数知名框架/库都在使用 Rollup 作为模块打包器

总结：Webpack 大而全，Rollup 小而美。

选择标准：

- 开发应用程序选择 Webpack
- 开发框架/库使用 Rollup

### 4.Parcel 零配置的前端应用打包器

安装 Parcel：`yarn add parcel-bundler --dev`

./src/index.html Parcel 中的入口文件是 HTML 文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Parcel Test</title>
  </head>
  <body>
    <script src="./main.js"></script>
  </body>
</html>
```

./src/main.js

```js
// import $ from 'jquery' // 自动安装依赖
import foo from "./foo";
import "./style.css";
import img from "./1.png";
foo.bar();

// 动态导入，自动拆分模块
import("jquery").then(($) => {
  $(document.body).append("<h1>Hello</h1>");
  $(document.body).append(`<img src="${img}" />`);
});

if (module.hot) {
  module.hot.accept(() => {
    console.log("hmr"); // 模块热替换
  });
}
```

./src/foo.js

```js
export default {
  bar: () => {
    console.log("foo jal111 ..");
  },
};
```

./src/style.css

```css
body {
  background-color: pink;
}
```

./src/1.png

执行命令：`yarn parcel src/index.html` 会自动启动一个 http 服务，并且监听文件的变化，自动开启了模块热替换功能，依赖文件也是自动安装，整个过程都是零配置

如何以生产模式进行打包：`yarn parcel build src/index.html`

对于相同体量的项目进行打包，Parcel 会比 Webpack 快很多，因为在 Parcel 内部使用的是多进程同时去工作，充分发挥了多核 CPU 的性能，而 Webpack 中可以使用 happypack 插件实现这一点

Parcel 首个版本发布于 2017 年，当时 Webpack 使用上过于繁琐，Parcel 真正意义上实现了完全零配置，而且 Parcel 构建速度更快

而现在大多数项目还是使用 Webpack 作为打包器，可能是因为 Webpack 有更好的生态、Webpack 越来越好用

## 5.规范化标准

为什么要有规范化标准

- 软件开发需要多人协同
- 不同开发者具有不同的编码习惯和喜好
- 不同的喜好增加项目维护成本
- 每个项目或者团队需要明确统一的标准

哪里需要规范化标准

- 代码、文档、甚至是提交日志
- 开发过程中人为编写的成果图
- 代码标准化规范最为重要

实施规范化的方法

- 编码前人为的标准约定
- 通过工具实现 Lint

常见的规范化实现方式

- ESLint 工具使用
- 定制 ESLint 校验规则
- ESLint 对 TypeScript 的支持
- ESLint 结合自动化工具或者 Webpack
- 基于 ESLint 的衍生工具
- StyleLint 工具的使用

### 1.ESLint

#### 1.ESLint 介绍

- 最为主流的 JavaScript Lint 工具，检测 JS 代码质量
- ESLint 很容易统一开发者的编码风格
- ESLint 可以帮助开发者提升编码能力

#### 2. ESLInt 安装

- 初始化项目: `yarn init -y`
- 安装 ESLint 模块为开发依赖: `yarn add eslint --dev`
- 通过 CLI 命令验证安装结果：`yarn eslint -v`

#### 3. ESLint 检查步骤

- 编写“问题”代码
- 使用 eslint 执行检测 : 执行`yarn eslint 01-prepare.js`，执行自动修复`yarn eslint 01-prepare.js --fix`
- 完成 eslint 使用配置 : `yarn eslint --init`

#### 4.ESLint 配置文件解析

```js
module.exports = {
  env: {
    // 运行的环境，决定了有哪些默认全局变量
    browser: true,
    es2020: true,
  },
  // eslint 继承的共享配置
  extends: ["standard"],
  // 设置语法解析器，控制是否允许使用某个版本的语法
  parserOptions: {
    ecmaVersion: 11,
  },
  // 控制某个校验规则的开启和关闭
  rules: {
    "no-alert": "error",
  },
  // 添加自定义的全局变量
  globals: {
    $: "readonly",
  },
};
```

#### 5.ESLint 配置注释

将配置写在代码的注释中，然后再对代码进行校验

```js
const str1 = "${name} is coder"; // eslint-disable-line no-template-curly-in-string

console.log(str1);
```

#### 6.ESLint 结合自动化工具

- 集成之后，ESLint 一定会工作
- 与项目统一，管理更加方便

#### 7.ESLint 结合 Webpack

eslint 通过 loader 形式校验 JavaScript 代码

前置工作：

- git clone 仓库
- 安装对应模块
- 安装 eslint 模块
- 安装 eslint-loader 模块
- 初始化.eslintrc.js 配置文件

后续配置：

```js
reles: {
  'react/jsx-uses-react': 2
},
  plugins: [
    'react'
  ]
```

### 2.StyleLint

- 提供默认的代码检查规则
- 提供 CLI 工具，快速调用
- 通过插件支持 Sass、Less、PostCSS
- 支持 Gulp 或者 Webpack 集成

`npm install stylelint --dev`

`npx stylelint ./index.css`

`npm install stylelint-config-sass-guidelines`

.stylelintrc.js

```js
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-sass-guidelines"],
};
```

运行：`npx stylelint ./index.css`

### 3.Prettier 的使用

近两年流行的前端代码通用型格式化工具，几乎可以完成各种代码的格式化。

`yarn add prettier --dev`安装 prettier 到当前项目

`yarn prettier style.css`将格式化的结果输出到命令行

`yarn prettier style.css --write` 将格式化的结果覆盖原文件

`yarn prettier . --write`对当前整个项目进行格式化

### 4.Git Hooks 介绍

代码提交至仓库之前为执行 lint 工作

- Git Hook 也称为 Git 钩子，每个钩子都对应一个任务
- 通过 shell 脚本可以编写钩子任务出发时要具体执行的操作

在一个 Git 仓库中，进入`.git/hooks`目录，然后看到很多 sample 文件，执行`cp pre-commit.sample pre-commit`，拷贝了一份 pre-commit 文件出来，把里面的内容先去掉，就写一句简单的 echo 看看 Git 钩子的效果( 第一行是可执行文件必须要有的固定语法，不可以删除)

```bash
#!/bin/sh
echo "git hooks"
```

然后回到仓库根目录，执行`git add .` 和 `git commit -m"xx"`

就可以看到输出了 git hooks，说明 pre-commit 这个钩子已经生效了

### 5.ESLint 结合 Git Hooks

很多前端开发者并不擅长使用 shell，Husky 可以实现 Git Hooks 的使用需求

在已有了 eslint 的 Git 项目中，安装 husky，实现在 Git commit 的时候，进行 lint

`yarn add husky --dev`

package.json

```json
{
  "name": "GitHooks",
  "version": "1.0.0",
  "main": "index.js",
  "author": "jiailing <517486222@qq.com>",
  "license": "MIT",
  "scripts": {
    "test": "eslint ./index.js"
  },
  "devDependencies": {
    "eslint": "^7.3.1",
    "eslint-config-standard": "^14.1.1",
    "eslint-plugin-import": "^2.21.2",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-standard": "^4.0.1",
    "husky": "^4.2.5"
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn test"
    }
  }
}
```

然后执行

`git add .`

`git commit -m "husky"`

可以看到我们的 index.js 的代码报错被输出到控制台了，并且 Git commit 失败了

说明 husky 已经完成了在代码提交前的 lint 工作，不过 husky 并不能对代码进行格式化，此时可以使用 lint-stage

`yarn add lint-staged --dev`

package.json

```json
{
  "name": "GitHooks",
  "version": "1.0.0",
  "main": "index.js",
  "author": "jiailing <517486222@qq.com>",
  "license": "MIT",
  "scripts": {
    "test": "eslint ./index.js",
    "precommit": "lint-staged"
  },
  "devDependencies": {
    "eslint": "^7.3.1",
    "eslint-config-standard": "^14.1.1",
    "eslint-plugin-import": "^2.21.2",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-standard": "^4.0.1",
    "husky": "^4.2.5",
    "lint-staged": "^10.2.11"
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn precommit"
    }
  },
  "lint-staged": {
    "*.js": ["eslint", "git add"]
  }
}
```
