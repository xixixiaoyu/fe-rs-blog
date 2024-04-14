# 模块化

## 1. 介绍

> 模块化指的就是将一个大的功能拆分为一个一个小的模块，通过不同的模块的组合来实现一个大功能。
>
> 在 Node.js 环境中，默认就支持模块系统，该模块系统遵循 CommonJS 规范。
>
> 在 Node,js 中一个 js 文件就是一个模块
>
> 模块内部代码对于外部来说都是不可见的，如需使用，可以通过两种方式向外部暴露



## 2. 模块成员导出

> 在每一个模块文件中，都会存在一个 module 对象，即模块对象。在模块对象中保存了和当前模块相关信息。
>
>  在模块对象中有一个属性 exports，它的值是一个对象，模块内部需要被导出的成员都应该存储在到这 个对象中。

```js
Module {
    exports: {}
}
// logger.js
const url = "http://mylogger.io/log";
function log (message) {
console.log(message)
}
module.exports.endPoint = url
module.exports.log = log
// 或者
module.exports = {
    url,
    log,
};

// 一般暴露的数据 都是引用类型的 数组 对象 函数
module.exports = 1111;
module.exports = 'iloveyou';

// 简化记忆 无脑使用module.exports = xx
```

这里有几点注意：

* module.exports 可以暴露任意数据
* 可以使用 module.exports 暴露多个数据
* exports 也可以暴露数据，不过不能使用 `exports = xxx` 的形式



## 3. 模块成员导入

> 在其他文件中通过 require 方法引入模块，require 方法的返回值就是对应模块的 module.exports 对象。
>
> 在导入模块时，模块文件后缀 .js 可以省略，文件路径不可省略。

```js
// app.js
const logger = require("./logger")
// { endPoint: 'http://mylogger.io/log', log: [Function:log] }
console.log(logger) 
console.log(logger.endPoint) // http://mylogger.io/log
logger.log('Hello Module') // Hello Node
```



通过 require 方法引入模块时会执行该模块中的代码。

```js
// logger.js
console.log("running...")

// app.js
require("./logger") // running...
```



在导入其他模块时，建议使用 const 关键字声明常量，防止模块被重置。

```js
var logger = require("./logger")
logger = 1;
logger.log("Hello") // logger.log is not a function

const logger = require("./logger")
logger = 1; // Assignment to constant variable.
logger.log("Hello")
```



有时在一个模块中只会导出一个成员，为方便其他模块使用，可以采用以下导入方式。

```js
// logger.js
module.exports = function (message) {
    console.log(message)
}
// app.js
const logger = require("./logger")
logger("Hello")
```



这里有几点注意：

* 如果没有加文件后缀，会按照以下后缀加载文件
  * .js    fs模块同步读取文件编译执行
  * .json  fs模块同步读取文件，用JSON.parse()解析返回结果
  * .node 这是c/c++编写的扩展文件，通过dlopen()方法编译
* 其他扩展名  会以.js文件载入
* 如果是文件夹则会默认加载该文件夹下 package.json 文件中 main 属性对应的文件
* 如果 main 属性对应的文件不存在，则自动找 index.js  index.json 
* 如果是内置模块或者是 npm 安装的模块，直接使用包名字即可
* npm 引入包时，如果当前文件夹下的 node_modules 没有，则会自动向上查找



注意： 在导入模块的时候, 目标文件中的代码是会执行的

require 模块的步骤

1. 获取目标文件中的 『内容』
2. 执行目标文件中的 JS 代码
3. 返回 module.exports 中的值



## 4. Module Wrapper Function

> Node.js 是如何实现模块的，为什么在模块文件内部定义的变量在模块文件外部访问不到?
>
> 每一个模块文件中都会有 module 对象和 require 方法，它们是从哪来的？
>
> 在模块文件执行之前，模块文件中的代码会被包裹在模块包装函数当中，这样每个模块文件中的代码就 都拥有了自己的作用域，所以在模块外部就不能访问模块内部的成员了。

```js
console.log(arguments.callee.toString());
// 使用arguments.callee.toString() 发现外层包裹了一个函数
```



```js
function(exports, require, module, __filename, __dirname) {
	// entire module code lives here
});
```

从这个模块包装函数中可以看到，module 和 require 实际上模块内部成员, 不是全局对象 global 下面 的属性。

__filename：当前模块文件名称

__dirname：当前文件所在路径

exports：引用地址指向了 module.exports 对象，可以理解为是 module.exports 对象的简写形式。

```js
exports.endPoint = url;
exports.log = log
```

在导入模块时最终导入的是 module.exports 对象，所以在使用 exports 对象添加导出成员时不能修改 引用地址。

```js
exports = log //这是错误的写法.
```





## 5. http创建服务代码拆分

```js
// server.js
module.exports = function(port) {
    const http = require("http");
    //引入模块
    const callback = require("./callback");
    const serverCb = require("./serverOkCallback");

    const server = http.createServer(callback);

    server.listen(port, serverCb);
}
```



```js
// callback.js
module.exports = (request, response) => {
    response.end("Hello NPM");
};
```



```js
// serverOkCallback
module.exports = () => {
  console.log("服务已经启动... 端口监听中...");
};
```



```js
// index.js
const server = require("./server");
server(8000)
```





