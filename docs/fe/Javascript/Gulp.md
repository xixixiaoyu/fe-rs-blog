## 1.Gulp使用流程

- 安装node和npm
  - https://nodejs.org/en/
  - Gulp 依赖于node环境
- 安装gulp-cli命令行工具(全局安装)
  - npm install -g gulp-cli@2.3.0
  - 换源:npm config set registry https://registry.npm.taobao.org

- 创建项目目录
- 在项目目录下创建package.json文件
  - npm init
  - 使用默认值创建：npm init -y

- 安装gulp，作为开发时依赖（本地安装)
  - npm install gulp@4.0.2 -D
- 在项目目录下创建 gulpfile.js 文件
- 编写 gulp 任务
- 在命令行工具中执行编写好的gulp 任务



## 2.编写和执行Gulp任务

- 获取gulp
- 创建任务
- 导出任务
- 执行任务

```js
// 1.获取 gulp
const gulp = require("gulp");

// 2.创建任务
// 文件拷贝任务（拷贝src下的文件到dist文件之下）
function copy() {
  return gulp.src("src/images/imooc.png").pipe(gulp.dest("dist/images/"));
}

// 3.导出任务
exports.copy = copy;

// 4.执行任务
// gulp copy
```





## 3.Gulp任务进阶

- 创建任务
- 导出任务
- 公开任务和私有任务

```js
// 1.创建任务
// 1.1.每个 Gulp 任务都是一个函数

// 1.2.任务完成后需要通知 Gulp
// 1.2.1.执行 callback
// 1.2.2.返回 promise、stream 等类型值 不需要执行 callback 通知结束
function js(cb) {
  console.log("开始处理 JS");

  //   setTimeout(() => {
  //     console.log('JS 处理完毕！');
  //     cb();
  //   }, 1000);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("JS 处理完毕！");
      resolve();
    }, 1000);
  });
}
// const gulp = require('gulp');
const { src, dest } = require("gulp");
function copy() {
  return src("src/images/imooc.png").pipe(dest("dist/images/"));
}

// 2.导出任务
exports.js = js;

// 默认任务
// 执行默认任务：gulp default / gulp
exports.default = js;

// 3.公开任务和私有任务
// 公开任务：导出的任务，可以通过 gulp 命令直接调用
// 私有任务：没有导出的任务，仅在内部使用，通常作为 series() 或 parallel() 组合的组成部分

// gulp.task()
// 在以前的 Gulp 版本中，gulp.task() 方法用来将函数注册为任务
// 虽然这个 API 依旧可以使用，但是导出（exports）将会是主要的注册机制
```





## 4.任务组合

- gulp.series()
- gulp.parallel()

```js
// 1.gulp.series()
// 按顺序执行任务

// 2.gulp.parallel()
// 并发执行任务

// 3.series() 和 parallel() 的注意事项
// 它们可以接受任意数目的任务或组合后的任务
// 可以互相嵌套至任意深度

const { series, parallel } = require("gulp");

// 清除 dist 目录
function clean(cb) {
  console.log("开始清除 dist 目录");
  setTimeout(() => {
    console.log("dist 目录清除完毕");
    cb();
  }, 1000);
}

// 处理 html 文件
function html(cb) {
  console.log("开始处理 HTML 文件");
  setTimeout(() => {
    console.log("HTML 文件处理完毕");
    cb();
  }, 2000);
}

// 处理 css 文件
function css(cb) {
  console.log("开始处理 CSS 文件");
  setTimeout(() => {
    console.log("CSS 文件处理完毕");
    cb();
  }, 1000);
}

// exports.clean = clean;
// exports.html = html;

// const dist = series(clean, html);
// exports.dist = dist;
// exports.default = dist;
// exports.default = series(clean, html);

// exports.default = series(clean, html, css);

// const htmlCSS = parallel(html, css);
// exports.default = series(clean, htmlCSS);
exports.default = series(clean, parallel(html, css));
```





## 5.文件读写

- gulp.src()
- stream.pipe()
- gulp.dest()

[![qaGxQU.md.png](https://s1.ax1x.com/2022/03/26/qaGxQU.md.png)](https://imgtu.com/i/qaGxQU)

```js
// 1.gulp.src() 读取文件
// 参数：一个文件路径或多个文件路径组成的数组
// 返回值：Node 流（stream）

// 2.stream.pipe() 管道
// 参数：Node 流（src()、dest()、gulp 插件等）
// 返回值：Node 流（stream）

// 3.gulp.dest() 输出文件
// 参数：输出目录
// 返回值：Node 流（stream）

const { src, dest } = require("gulp");

function copy() {
  //   return src('src/images/imooc.png');
  //   return src(['src/images/imooc.png', 'src/images/gulp.jpg']);

  //   return src('src/images/imooc.png')
  //     .pipe(编译)
  //   .pipe(src('src/images/gulp/.jpg'))
  //     .pipe(压缩)
  //     .pipe(dest('dist/images'));

  return src("src/images/imooc.png").pipe(dest("dist/images"));
}

exports.default = copy;
```



## 6.Glob

- Glob是什么
- 基本用法

```js
// 1.Glob 是什么
// 路径匹配符
// glob 是由普通字符或特殊字符（*、**、!）和分隔符（/）组成的字符串，用于匹配文件路径

// 2.基本用法
// 2.1.分隔符永远是 / 字符

// 2.2.特殊字符：*
// 匹配单级目录下任意数量的字符

// 2.3.特殊字符：**
// 匹配任意级目录下任意数量的字符

// 2.4.特殊字符：!
// 取反，必须跟在一个非取反的 glob 后面
// 第一个 glob 匹配到一组匹配项，然后后面的取反 glob 删除这些匹配项中的一部分

const { src, dest, series } = require("gulp");

// npm install --save-dev del@6.0.0
// https://github.com/sindresorhus/del
const del = require("del");

// 清除 dist 目录
function clean() {
  return del(["dist"]);
}

function copy() {
  // return src('src/images/imooc.png').pipe(dest('dist/images/'));
  // return src(['src/images/imooc.png', 'src/images/gulp.png']).pipe(
  //   dest('dist/images/')
  // );

  // *
  // return src('src/images/*').pipe(dest('dist/images/'));
  // return src('src/images/*.png').pipe(dest('dist/images/'));

  // 注意：这里的逗号左右两边不能有空格
  // return src('src/images/*.{png,jpg}').pipe(dest('dist/images/'));

  // **
  // return src('src/images/**').pipe(dest('dist/images/'));
  // return src('src/images/**/*.png').pipe(dest('dist/images/'));

  // !
  // return src(['src/images/**', '!src/images/imooc.png']).pipe(
  //   dest('dist/images/')
  // );

  return src(["src/images/**", "!src/images/*.png"]).pipe(dest("dist/images/"));
}

exports.default = series(clean, copy);
```





## 7.插件

- Gulp 插件是什么
- 基本用法
- 常用插件

```js
// 1.Gulp 插件是什么
// Gulp 本身能做的大致就是读写文件和监控文件的变化，其他事情一般需要通过插件完成
// Gulp 插件是完成特定工作（比如：ES6 -> ES5）的程序，它封装了通过管道（pipe）处理文件的常见功能
// 我们一般利用 .pipe() 方法将插件放置在 src() 和 dest() 之间，处理流（stream）中的文件

// 可以在这里搜索需要的插件：https://gulpjs.com/plugins/

// 2.基本用法
const { src, dest, series } = require("gulp");
const del = require("del");
// npm install --save-dev gulp-babel@8.0.0 @babel/core@7.14.8 @babel/preset-env@7.14.8
const babel = require("gulp-babel");
// npm install --save-dev  gulp-uglify@3.0.2
const uglify = require("gulp-uglify");
// npm install --save-dev  gulp-rename@2.0.0
const rename = require("gulp-rename");
// npm install --save-dev  gulp-concat@2.6.1
const concat = require("gulp-concat");

// 清除 dist 目录
function clean() {
  return del(["dist"]);
}

// 处理 js
function js() {
  // return (
  //   src('src/js/*.js')
  //     // ES6 -> ES5
  //     .pipe(
  //       babel({
  //         presets: ['@babel/env']
  //       })
  //     )
  //     .pipe(dest('dist/js'))
  // );

  return (
    src("src/js/*.js")
      // ES6 -> ES5
      .pipe(
        babel({
          presets: ["@babel/env"],
        })
      )
      // 合并 JS
      .pipe(concat("index.js"))
      // 读取第三方 JS
      .pipe(src("src/vendor/*.js"))
      // 输出编译后、未压缩的 js
      .pipe(dest("dist/js"))
      // 压缩混淆
      .pipe(uglify())
      // 重命名
      .pipe(rename({ extname: ".min.js" }))
      // 输出编译后、已压缩的 js
      .pipe(dest("dist/js"))
  );
}

exports.default = series(clean, js);

// 3.常用插件
// 3.1.HTML 相关
// gulp-htmlmin：压缩 HTML 文件
// gulp-file-include：引入 HTML 代码片段

// 3.2.CSS 相关
// gulp-sass/gulp-less：Sass/Less -> CSS
// gulp-autoprefixer：自动添加厂商前缀
// gulp-cssmin：压缩 CSS 文件

// 3.3.JS 相关
// gulp-babel：ES6 -> ES5
// gulp-uglify：压缩混淆 JS 文件

// 3.4.其他
// gulp-rename：重命名文件
// gulp-concat：合并文件
// gulp-webserver：搭建本地服务器
// webpack-stream：在 gulp 中使用 webpack
```





## 8.文件监控

- 文件监控是什么
- 基本用法

```js
// 1.文件监控是什么
// gulp.watch(glob, task)
// 将通过 glob 匹配到的文件与任务（task） 进行关联，如果有文件被修改了就执行关联的任务（task）

// 2.基本用法
const { src, dest, series, watch } = require("gulp");
const del = require("del");
const babel = require("gulp-babel");

// 清除 dist 目录
function clean() {
  return del(["dist"]);
}

// 处理 js
function js() {
  return src("src/js/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(dest("dist/js"));
}

// 监控 JS 文件的变化，并执行相应的任务
function watchJS() {
  // watch 没有完成的时候，不需要通知 Gulp
  watch("src/js/*.js", js);
  // watch('src/js/*.js', series(clean, js));
}

// 在顺序执行中，watch 任务一般放在最后
exports.default = series(clean, js, watchJS);
// exports.default = series(clean, watchJS, js); // ×
```







## 9.Gulp实战



### 1.处理HTML

```js
const { src, dest, series } = require("gulp");
const del = require("del");
// npm install --save-dev gulp-htmlmin@5.0.1
const htmlmin = require("gulp-htmlmin");
// npm install --save-dev gulp-file-include@2.3.0
const fileinclude = require("gulp-file-include");

// 清除 dist 目录
function clean() {
  return del(["dist"]);
}

// 处理 HTML
function html() {
  //   return (
  //     src('src/pages/*.{html,htm}')
  //       // 压缩 HTML 文件
  //       // 配置：https://github.com/kangax/html-minifier
  //       .pipe(
  //         htmlmin({
  //           // 压缩多余空白
  //           collapseWhitespace: true,
  //           // 移除注释
  //           removeComments: true,
  //           // 移除空白属性
  //           removeEmptyAttributes: true,
  //           // 压缩布尔属性
  //           collapseBooleanAttributes: true,
  //           // 移除属性的引号
  //           removeAttributeQuotes: true,
  //           // 压缩 style 标签中的 CSS
  //           minifyCSS: true,
  //           // 压缩 script 标签中的 JS
  //           minifyJS: true,
  //           // 移除 style 和 link 标签上的 type 属性
  //           removeStyleLinkTypeAttributes: true,
  //           // 移除 script 标签上的 type 属性
  //           removeScriptTypeAttributes: true
  //         })
  //       )
  //       .pipe(dest('dist/pages'))
  //   );

  return src("src/pages/*.{html,htm}")
    .pipe(
      fileinclude({
        // 自定义标识符
        prefix: "@@",
        // 基准路径（从哪里 include）
        basepath: "./src/pages/include",
      })
    )
    .pipe(dest("dist/pages"));
}

exports.default = series(clean, html);
```



`src/pages/*.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>实战课</title>
  </head>
  <body>
    <!-- <div>公共头部</div> -->
    <!-- @@include('./header.html') -->
    @@include('./header.html', { page: '实战课' })

    <div>实战课内容</div>

    <!-- <div>公共底部</div> -->
    @@include('./footer.html')
  </body>
</html>
```



`src/pages/include/*.html`

```html
<!-- <div>公共头部</div> -->
<div>@@page 的公共头部</div>
```





### 2.处理CSS

```js
const { src, dest, series } = require("gulp");
const del = require("del");
// npm install --save-dev sass@1.35.2 gulp-sass@5.0.0
const sass = require("gulp-sass")(require("sass"));
// npm install --save-dev gulp-autoprefixer@8.0.0
const autoprefixer = require("gulp-autoprefixer");
// npm install --save-dev gulp-cssmin@0.2.0
const cssmin = require("gulp-cssmin");

// 清除 dist 目录
function clean() {
  return del(["dist"]);
}

// 处理 CSS
function css() {
  return (
    src("src/scss/*.scss")
      // Sass -> CSS
      .pipe(sass())
      // 自动添加厂商前缀
      .pipe(autoprefixer())
      // 压缩 CSS 文件
      .pipe(cssmin())
      .pipe(dest("dist/css"))
  );
}

exports.default = series(clean, css);
```





### 3.搭建开发环境

```js
const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
// npm install --save-dev gulp-file-include@2.3.0
const fileinclude = require("gulp-file-include");
// npm install --save-dev gulp-webserver@0.9.1
const webserver = require("gulp-webserver");
const sass = require("gulp-sass")(require("sass"));
// const autoprefixer = require('gulp-autoprefixer');

// 开发环境的任务
const dev = {
  // 清除 dev 目录
  clean() {
    return del(["dev"]);
  },
  // 处理 HTML
  html() {
    return src("src/pages/*.html")
      .pipe(
        fileinclude({
          // 自定义标识符
          prefix: "@@",
          // 基准路径（从哪里 include）
          basepath: "./src/pages/include",
        })
      )
      .pipe(dest("dev/pages"));
  },
  // 监听源文件变化
  watch() {
    console.log("开始监听源文件！");
    watch("src/pages/**/*", dev.html);
    watch("src/scss/*.scss", dev.css);
    watch("src/js/*.js", dev.js);
  },
  // 开发服务器（包含自动刷新）
  server() {
    return src("dev/").pipe(
      webserver({
        host: "localhost",
        port: "3000",
        // 文件修改的时候是否自动刷新页面
        livereload: true,
        // 默认打开哪个文件（dev 目录下）
        open: "./pages/index.html",
      })
    );
  },
  // 处理 CSS
  css() {
    return (
      src("src/scss/*.scss")
        // Sass -> CSS
        .pipe(sass())
        // 自动添加厂商前缀
        // .pipe(autoprefixer())
        .pipe(dest("dev/css"))
    );
  },
  // 处理 JS
  js() {
    return src("src/js/*.js").pipe(dest("dev/js"));
  },
  // 处理图片
  images() {
    return src("src/images/**/*").pipe(dest("dev/images"));
  },
};

exports.default = series(
  dev.clean,
  parallel(dev.html, dev.css, dev.js, dev.images),
  parallel(dev.watch, dev.server)
);
```





### 4.搭建生产环境

```js
const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
// npm install --save-dev gulp-file-include@2.3.0
const fileinclude = require("gulp-file-include");
// npm install --save-dev gulp-webserver@0.9.1
const webserver = require("gulp-webserver");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
// npm install --save-dev gulp-htmlmin@5.0.1
const htmlmin = require("gulp-htmlmin");
const cssmin = require("gulp-cssmin");
// npm install --save-dev gulp-babel@8.0.0 @babel/core@7.14.8 @babel/preset-env@7.14.8
const babel = require("gulp-babel");
// npm install --save-dev gulp-uglify@3.0.2
const uglify = require("gulp-uglify");

// 开发环境的任务
const dev = {
  // 清除 dev 目录
  clean() {
    return del(["dev"]);
  },
  // 处理 HTML
  html() {
    return src("src/pages/*.html")
      .pipe(
        fileinclude({
          // 自定义标识符
          prefix: "@@",
          // 基准路径（从哪里 include）
          basepath: "./src/pages/include",
        })
      )
      .pipe(dest("dev/pages"));
  },
  // 监听源文件变化
  watch() {
    console.log("开始监听源文件！");
    watch("src/pages/**/*", dev.html);
    watch("src/scss/*.scss", dev.css);
    watch("src/js/*.js", dev.js);
  },
  // 开发服务器（包含自动刷新）
  server() {
    return src("dev/").pipe(
      webserver({
        host: "localhost",
        port: "3000",
        // 文件修改的时候是否自动刷新页面
        livereload: true,
        // 默认打开哪个文件（dev 目录下）
        open: "./pages/index.html",
      })
    );
  },
  // 处理 CSS
  css() {
    return (
      src("src/scss/*.scss")
        // Sass -> CSS
        .pipe(sass())
        // 自动添加厂商前缀
        // .pipe(autoprefixer())
        .pipe(dest("dev/css"))
    );
  },
  // 处理 JS
  js() {
    return src("src/js/*.js").pipe(dest("dev/js"));
  },
  // 处理图片
  images() {
    return src("src/images/**/*").pipe(dest("dev/images"));
  },
};

// 生产环境的任务
const dist = {
  // 清除 dist 目录
  clean() {
    return del(["dist"]);
  },
  // 处理 HTML
  html() {
    return src("src/pages/*.html")
      .pipe(
        fileinclude({
          // 自定义标识符
          prefix: "@@",
          // 基准路径（从哪里 include）
          basepath: "./src/pages/include",
        })
      )
      .pipe(
        htmlmin({
          // 压缩多余空白
          collapseWhitespace: true,
          // 移除注释
          removeComments: true,
          // 移除空白属性
          removeEmptyAttributes: true,
          // 压缩布尔属性
          collapseBooleanAttributes: true,
          // 移除属性的引号
          removeAttributeQuotes: true,
          // 压缩 style 标签中的 CSS
          minifyCSS: true,
          // 压缩 script 标签中的 JS
          minifyJS: true,
          // 移除 style 和 link 标签上的 type 属性
          removeStyleLinkTypeAttributes: true,
          // 移除 script 标签上的 type 属性
          removeScriptTypeAttributes: true,
        })
      )
      .pipe(dest("dist/pages"));
  },
  // 处理 CSS
  css() {
    return (
      src("src/scss/*.scss")
        // Sass -> CSS
        .pipe(sass())
        // 自动添加厂商前缀
        .pipe(autoprefixer())
        // 压缩 CSS 文件
        .pipe(cssmin())
        .pipe(dest("dist/css"))
    );
  },
  // 处理 JS
  js() {
    return src("src/js/*.js")
      .pipe(
        // ES6 -> ES5
        babel({
          presets: ["@babel/env"],
        })
      )
      .pipe(uglify())
      .pipe(dest("dist/js"));
  },
  // 处理图片
  images() {
    return src("src/images/**/*").pipe(dest("dist/images"));
  },
};

exports.default = series(
  dev.clean,
  parallel(dev.html, dev.css, dev.js, dev.images),
  parallel(dev.watch, dev.server)
);

exports.dist = series(dist.clean, parallel(dist.html, dist.css, dist.js, dist.images));
```





### 5.Gulp 与 Webpack 结合使用

- Gulp 与 Webpack的区别
- 在Gulp中使用Webpack



[![qati26.md.png](https://s1.ax1x.com/2022/03/26/qati26.md.png)](https://imgtu.com/i/qati26)



`gulpfile.js`

```js
const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
// npm install --save-dev gulp-file-include@2.3.0
const fileinclude = require("gulp-file-include");
// npm install --save-dev gulp-webserver@0.9.1
const webserver = require("gulp-webserver");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
// npm install --save-dev gulp-htmlmin@5.0.1
const htmlmin = require("gulp-htmlmin");
const cssmin = require("gulp-cssmin");
// npm install --save-dev gulp-babel@8.0.0 @babel/core@7.14.8 @babel/preset-env@7.14.8
const babel = require("gulp-babel");
// npm install --save-dev gulp-uglify@3.0.2
const uglify = require("gulp-uglify");
// npm install --save-dev  webpack-stream@6.1.2
const webpack = require("webpack-stream");
const webpackConfig = require("./webpack.config");

// npm install --save-dev babel-loader@8.2.2 @babel/core@7.14.8 @babel/preset-env@7.14.8

// 开发环境的任务
const dev = {
  // 清除 dev 目录
  clean() {
    return del(["dev"]);
  },
  // 处理 HTML
  html() {
    return src("src/pages/*.html")
      .pipe(
        fileinclude({
          // 自定义标识符
          prefix: "@@",
          // 基准路径（从哪里 include）
          basepath: "./src/pages/include",
        })
      )
      .pipe(dest("dev/pages"));
  },
  // 监听源文件变化
  watch() {
    console.log("开始监听源文件！");
    watch("src/pages/**/*", dev.html);
    watch("src/scss/*.scss", dev.css);
    watch("src/js/*.js", dev.js);
  },
  // 开发服务器（包含自动刷新）
  server() {
    return src("dev/").pipe(
      webserver({
        host: "localhost",
        port: "3000",
        // 文件修改的时候是否自动刷新页面
        livereload: true,
        // 默认打开哪个文件（dev 目录下）
        open: "./pages/index.html",
      })
    );
  },
  // 处理 CSS
  css() {
    return (
      src("src/scss/*.scss")
        // Sass -> CSS
        .pipe(sass())
        // 自动添加厂商前缀
        // .pipe(autoprefixer())
        .pipe(dest("dev/css"))
    );
  },
  // 处理 JS
  js() {
    return src("src/js/*.js").pipe(dest("dev/js"));
  },
  // 处理图片
  images() {
    return src("src/images/**/*").pipe(dest("dev/images"));
  },
};

// 生产环境的任务
const dist = {
  // 清除 dist 目录
  clean() {
    return del(["dist"]);
  },
  // 处理 HTML
  html() {
    return src("src/pages/*.html")
      .pipe(
        fileinclude({
          // 自定义标识符
          prefix: "@@",
          // 基准路径（从哪里 include）
          basepath: "./src/pages/include",
        })
      )
      .pipe(
        htmlmin({
          // 压缩多余空白
          collapseWhitespace: true,
          // 移除注释
          removeComments: true,
          // 移除空白属性
          removeEmptyAttributes: true,
          // 压缩布尔属性
          collapseBooleanAttributes: true,
          // 移除属性的引号
          removeAttributeQuotes: true,
          // 压缩 style 标签中的 CSS
          minifyCSS: true,
          // 压缩 script 标签中的 JS
          minifyJS: true,
          // 移除 style 和 link 标签上的 type 属性
          removeStyleLinkTypeAttributes: true,
          // 移除 script 标签上的 type 属性
          removeScriptTypeAttributes: true,
        })
      )
      .pipe(dest("dist/pages"));
  },
  // 处理 CSS
  css() {
    return (
      src("src/scss/*.scss")
        // Sass -> CSS
        .pipe(sass())
        // 自动添加厂商前缀
        .pipe(autoprefixer())
        // 压缩 CSS 文件
        .pipe(cssmin())
        .pipe(dest("dist/css"))
    );
  },
  // 处理 JS
  js() {
    // webpackConfig.mode = 'development';

    /*
    return src('src/js/*.js')
      .pipe(
        // ES6 -> ES5
        babel({
          presets: ['@babel/env']
        })
      )
      .pipe(uglify())
      .pipe(dest('dist/js'));
    */

    return src("src/js/*.js").pipe(webpack(webpackConfig)).pipe(dest("dist/js"));
  },
  // 处理图片
  images() {
    return src("src/images/**/*").pipe(dest("dist/images"));
  },
};

exports.default = series(
  dev.clean,
  parallel(dev.html, dev.css, dev.js, dev.images),
  parallel(dev.watch, dev.server)
);

exports.dist = series(dist.clean, parallel(dist.html, dist.css, dist.js, dist.images));
```



`webpack.config.js`

```js
"use strict";

module.exports = {
  mode: "production",
  // webpack 入口文件
  entry: {
    index: "./src/js/index.js",
  },
  // webpack 输出路径
  output: {
    // 输出的文件名
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    ],
  },
};
```







## 10.总结



### 使用流程：

- 安装 node 和npm
- 安装 gulp-cli 命令行工具(全局安装)
- 创建项目目录
- 在项目目录下创建 package.json 文件
- 安装gulp，作为开发时依赖（本地安装)
- 在项目目录下创建 gulpfile.js 文件
- 编写 gulp 任务
- 在命令行工具中执行编写好的 gulp 任务





### Gulp任务：

- 创建任务
  - 每个 Gulp 任务都是一个函数
  - 任务完成后需要通知Gulp

[![qaG3MF.md.png](https://s1.ax1x.com/2022/03/26/qaG3MF.md.png)](https://imgtu.com/i/qaG3MF)

- 任务完成后通知Gulp

[![qaGNI1.md.png](https://s1.ax1x.com/2022/03/26/qaGNI1.md.png)](https://imgtu.com/i/qaGNI1)

- 组合任务
  - gulp.series()：按顺序执行任务
  - gulp.parallel()：并发执行任务
  - 都可以接受任意数目的任务函数或已经组合的操作
  - 可以互相嵌套至任意深度

[![qaGDMD.md.png](https://s1.ax1x.com/2022/03/26/qaGDMD.md.png)](https://imgtu.com/i/qaGDMD)



- 导出任务

[![qaGWJP.md.png](https://s1.ax1x.com/2022/03/26/qaGWJP.md.png)](https://imgtu.com/i/qaGWJP)





### 文件读写：

[![qaGxQU.md.png](https://s1.ax1x.com/2022/03/26/qaGxQU.md.png)](https://imgtu.com/i/qaGxQU)



- gulp.src()读取文件
  - 参数:一个文件路径(Glob路径匹配符)或多个文件路径组成的数组
  - 返回值:Node流(stream)

- stream.pipe()管道
  - 参数:Node流（src()、dest()、gulp 插件等）
  - 返回值:Node流(stream)

- gulp.dest()输出文件
  - 参数:输出目录
  - 返回值:Node流(stream)

[![qaYS9P.md.png](https://s1.ax1x.com/2022/03/26/qaYS9P.md.png)](https://imgtu.com/i/qaYS9P)





### Glob：

- Glob是路径匹配符
- 由普通字符或特殊字符（*、**、!）和分隔符（/）组成的字符串
- 分隔符永远是 / 字符



- 特殊字符：*
- 匹配单级目录下任意数量的字符

[![qaYn3V.md.png](https://s1.ax1x.com/2022/03/26/qaYn3V.md.png)](https://imgtu.com/i/qaYn3V)



- 特殊字符：**
- 匹配任意级目录下任意数量的字符

[![qaY1HJ.md.png](https://s1.ax1x.com/2022/03/26/qaY1HJ.md.png)](https://imgtu.com/i/qaY1HJ)





- 特殊字符：!
- 取反，必须跟在一个非取反的 glob 后面

[![qaYwuD.md.png](https://s1.ax1x.com/2022/03/26/qaYwuD.md.png)](https://imgtu.com/i/qaYwuD)





### 插件：

- 利用 .pipe() 方法将插件放在 src() 和 dest() 之间，处理流中的文件

[![qaYcCt.md.png](https://s1.ax1x.com/2022/03/26/qaYcCt.md.png)](https://imgtu.com/i/qaYcCt)



- HTML相关
  - gulp-htmlmin：压缩HTML文件
  - gulp-file-include：引入HTML代码片段



- CSS相关
  - gulp-sass/gulp-less：Sass/Less => CSS
  - gulp-autoprefixer：自动添加厂商前缀
  - gulp-cssmin：压缩CSS文件



- JS相关
  - gulp-babel：ES6 => ES5
  - gulp-uglify：压缩混淆JS文件



- 其他
  - gulp-rename：重命名文件
  - gulp-concat：合并文件
  - gulp-webserver：搭建本地服务器
  - webpack-stream：在 gulp 中使用webpack





### 文件监控：

- gulp.watch(glob, task)
- 将匹配到的文件与任务关联，有文件被修改了就执行关联的任务

[![qaYvb4.md.png](https://s1.ax1x.com/2022/03/26/qaYvb4.md.png)](https://imgtu.com/i/qaYvb4)





### Gulp 与Webpack的区别

[![qati26.md.png](https://s1.ax1x.com/2022/03/26/qati26.md.png)](https://imgtu.com/i/qati26)
