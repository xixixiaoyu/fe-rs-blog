# Nodejs

## 介绍

### 1. Nodejs 是什么？

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。

它不是一门编程语言，它是一个执行 JavaScript 代码的工具。工具是指可以安装在计算机操作系统之上的软件。

官方网址 <https://nodejs.org/en/>，中文站 <http://nodejs.cn/>

### 2. 为什么浏览器和 Node.js 都可以运行 JavaScript

因为浏览器和 Node.js 都内置了 JavaScript V8 Engine。

它可以将 JavaScript 代码编译为计算机能够识别的机器码。

![image-20211231154601524](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231154603.png)

### 3. 浏览器中运行的 JavaScript 和 Node.js 中运行的 JavaScript 有区别吗

在内置了 JavaScript V8 Engine 以后实际上只能执行 ECMAScript，就是语言中的语法部分。

浏览器为了能够让 JavaScript 操作浏览器窗口以及 HTML 文档，所以在 JavaScript V8 Engine 中添加了控制它们的 API, 就是 DOM 和 BOM. 所以 JavaScript 在浏览器中运行时是可以控制浏览器窗口对象和 DOM 文档对象的。

和浏览器不同，在 Node.js 中是没有 DOM 和 DOM 的，所以在 Node.js 中不能执行和它们相关的代码，比如 window.alert() 或者 document.getElementById() . DOM 和 DOM 是浏览器环境中特有的。在 Node.js 中，作者向其中添加了很多系统级别的 API，比如对操作系统中的文件和文件夹进行操作。获取操作系统信息，比如系统内存总量是多少，系统临时目录在哪，对系统的进程进行操作等等。

![image-20211231154852682](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231155029.png)

JavaScript 运行在浏览器中控制的是浏览器窗口和 DOM 文档。

JavaScript 运行在 Node.js 中 控制的操作系统级别的内容，如内存、硬盘、网络。

![image-20211231155025486](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231155027.png)

### 4. 为什么浏览器中的 JavaScript 不能控制系统级别的 API ?

浏览器是运行在用户的操作系统中的，如果能控控制系统级别的 API 就会存在安全问题。

Node.js 是运行在远程的服务器中的，访问的是服务器系统 API，不存在这方面的安全问题。

### 5. Node.js 能够做什么

我们通常使用它来构建服务器端应用和创建前端工程化工具。

JavaScript 运行在浏览器中我们就叫它客户端 JavaScript。

JavaScript 运行在 Node.js 中我们就叫它服务器端 JavaScript。

**应用场景**

- 操作数据库提供 API 服务
- 网页聊天室
- 动态网站, 个人博客, 论坛, 商城等
- 前端项目打包(webpack, gulp)
- 更适合 IO 密集型高并发请求任务
- Node. js 做为中间层，后端的 Web 服务，例如服务器端的请求（爬虫），代理请求（跨域）

![image-20220125160248635](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125160248635.png)

### 6.Nodejs 架构

![image-20220125124249716](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125124249716.png)

#### Natives modules

- 当前层内容由 JS 实现
- 提供应用程序可直接调用库，例如 fs 、 path、http 等
- JS 语言无法直接操作底层硬件设置

#### Builtin modules“胶水层”

![image-20220125131036451](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125131036451.png)

底层

- V8：执行 JS 代码，提供桥梁接口
- Libuv：事件循环、事件队列、异步 lO
- 第三方模块：zlib 、 http、c-ares 等

![image-20220125125927477](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125125927477.png)

## Node.js 异步编程

### 1.CPU 与存储器

目标: 了解程序运行过程中 CPU 和存储器起到了什么作用或者说扮演了什么角色

CPU：

- 中央处理器，计算机核心部件，负责运算和指令调用。
- 开发者编写的 JavaScript 代码在被编译为机器码以后就是通过 CPU 执行的。

存储器

- 内存：用于临时存储数据，断电后数据丢失。由于数据读写速度快，计算机中的应用都是在内存中运行的。
- 磁盘：用于持久存储数据，断电后数据不丢失。内部有磁头依靠马达转动在盘片上读写数据, 速度 比内存慢。

计算机应用程序在没有运行时是存储在磁盘中的，当我们启动应用程序后，应用程序会被加载到内存中 运行，应用程序中的指令会被中央处理器 CPU 来执行。

### 2.什么是 I/O

I 就是 Input 表示输入，O 就是 Output 表示输出，I/O 操作就是输入输出操作。什么样的操作属于 I/O 操作呢 ?

![image-20220125131724637](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125131724637.png)

比如数据库的读写操作就是 I/O 操作。

因为数据库文件是存储在磁盘中的，而我们编写的程序是运行在内存中的。

将内存中的数据写入数据库对于内存来说就是输出。

查询数据库中的数据就是将磁盘中的数据读取到内存中，对于内存来说就是输入。

### 3.I/O 模型

从数据库中查询数据（将磁盘中的文件内容读取到内存中），由于磁盘的读写速度比较慢，查询内容越多花费时间越多。

无论 I/O 操作需要花费多少时间，在 I/O 操作执行完成后，CPU 都是需要获取到操作结果的。

那么问题就来了，CPU 在发出 I/O 操作指令后是否要等待 I/O 操作执行完成呢 ?

这就涉及到 I/O 操 作模型了，I/O 操作的模型有两种：

1. 第一种是 CPU 等待 I/O 操作执行完成获取到操作结果后再去执行其他指令，这是同步 I/O 操作 (阻塞 I/O)。
2. 第二种是 CPU 不等待 I/O 操作执行完成，CPU 在发出 I/O 指令后，内存和磁盘开始工作，CPU 继续执行其他指令。当 I/O 操作完成后再通知 CPU I/O 操作的结果是什么。这是异步 I/O 操作 (非阻塞 I/O) 。

同步 I/O 在代码中的表现就是代码暂停执行等待 I/O 操作，I/O 操作执行完成后再执行后续代码。

异步 I/O 在代码中的表现就是代码不暂停执行，I/O 操作后面的代码可以继续执行，当 I/O 操作执行完成后通过回调函数的方式通知 CPU，说 I/O 操作已经完成了，基于 I/O 操作结果的其他操作可以执行了 (通知 CPU 调用回调函数)。

同步 I/O 和 异步 I/O 区别就是是否等待 I/O 结果。

Nodejs 单线程配合事件驱动架构及 libuv 实现的就是异步非阻塞 I/O 模型。

```js
const fs = require("fs");

fs.readFile("./x.txt", "utf-8", function (error, data) {
  console.log(data);
});
console.log("Hello");
```

```js
const fs = require("fs");

const data = fs.readFileSync("./y.txt", { encoding: "utf-8" });
console.log(data);
```

### 4.进程与线程

每当我们运行应用程序时，操作系统都会创建该应用程序的实例对象

该实例对象就是应用程序的进程，操作系统会按照进程为单位为应用程序分配资源，比如内存，这样程序才能够在计算机的操作系统中运行起来。

![image-20220125163814040](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125163814040.png)

线程被包裹在进程之中，是进程中的实际运作单位。

一条线程指的就是进程中的一个单一顺序的控制流。也就是说，应用程序要做的事情都存储在线程之中。可以这样认为，一条线程就是一个待办列表， 供 CPU 执行。

![image-20220125164005013](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125164005013.png)

### 5.JS 单线程 OR 多线程 ?

在 Node.js 代码运行环境中，它为 JavaScript 代码的执行提供了一个主线程，通常我们所说的单线程指的就是这个主线程。

主线程用来执行所有的同步代码。但是 Node.js 代码运行环境本身是由 C++ 开发 的，在 Node.js 内部它依赖了一个叫做 libuv 的 c++ 库。

在这个库中它维护了一个线程池，默认情况下 在这个线程池中存储了 4 个线程，JavaScript 中的异步代码就是在这些线程中执行的，所以说 JavaScript 代码的运行依靠了不止一个线程，所以 JavaScript 本质上还是多线程的。

![image-20220125165418432](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125165418432.png)

### 6.基于回调函数的异步编程

#### 1.什么是回调函数

回调函数是指通过函数参数的方式将一个函数传递到另一个函数中，参数函数就是回调函数。

```js
function A() {
  console.log("A is running");
}
function B(callback) {
  console.log("B Start");
  callback(); // A is running
  console.log("B End");
}
B(A);
```

我们经常将回调函数写成 callback，实际上它是 call then back 的简写，含义是调用后返回。

就是在主函数中调用参数函数，参数函数调用完成后返回主函数继续执行主函数中的代码。

为什么在 B 函数中不直接调用 A 函数而要通过参数的方式传递进去 ?

通常在编写应用程序时，B 函数都是语言内部或者其他开发者定义好的，我们看不到内部代码或者说不能直接在他内部代码中插入我们的代码，而我们又想介入程序的执行，此时就可以通过回调函数的方式将我们的逻辑传递给 B 函数，B 函数在内部再来调用这个回调函数。

#### 2.回调函数传递参数

在主函数中调用回调函数时，可以为回调函数传递参数。

```js
function A(arg) {
  console.log("A is running");
  console.log(arg);
}
function B(callback) {
  console.log("B Start");
  callback("我是B函数传递给A函数的参数"); // A is running
  console.log("B End");
}
B(A);
```

#### 3.回调函数在异步编程中的应用

在异步编程中，异步 API 执行的结果就是通过回调函数传递参数的方式传递到上层代码中的。

```js
const fs = require("fs");
fs.readFile("./index.html", "utf-8", function (error, data) {
  if (error) console.log("发生了错误");
  console.log(data);
});
```

#### 4.回调地狱

> 回调地狱是回调函数多层嵌套导致代码难以维护的问题。
>
> 基于回调函数的异步编程一不小心就会产生回调地狱的问题。

```js
const fs = require("fs");
fs.readFile("./x.txt", "utf-8", function (error, x) {
  fs.readFile("./y.txt", "utf-8", function (error, y) {
    fs.readFile("./z.txt", "utf-8", function (error, z) {
      console.log(x);
      console.log(y);
      console.log(z);
    });
  });
});
```

```js
const x = fs.readFile("./x.txt", "utf-8");
const y = fs.readFile("./y.txt", "utf-8");
const z = fs.readFile("./z.txt", "utf-8");
console.log(x);
console.log(y);
console.log(z);
```

### 7.基于 Promise 的异步编程

1. Promise 概述

> Promise 是 JavaScript 中异步编程解决方案，可以解决回调函数方案中的回调地狱问题。
>
> 可以将 Promise 理解为容器，用于包裹异步 API 的容器，当容器中的异步 API 执行完成后，
>
> Promise 允许我们在容器的外面获取异步 API 的执行结果，从而避免回调函数嵌套。
>
> Promise 翻译为承诺，表示它承诺帮我们做一些事情，既然它承若了它就要去做，做就会有一个过 程，就会有一个结果，结果要么是成功要么是失败。
>
> 所以在 Promise 中有三种状态, 分别为等待(pending)，成功(fulfilled)，失败(rejected)。
>
> 默认状态为等待，等待可以变为成功，等待可以变为失败。
>
> 状态一旦更改不可改变，成功不能变回等待，失败不能变回等待，成功不能变成失败，失败不能变 成成功。

2. 基础语法

```js
const fs = require("fs");
const promise = new Promise(function (resolve, reject) {
  fs.readFile("./x.txt", "utf-8", function (error, data) {
    if (error) {
      // 将状态从等待变为失败
      reject(error);
    } else {
      // 将状态从等待变为成功
      resolve(data);
    }
  });
});
promise
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });
```

3. Promise 链式调用

```js
const fs = require("fs");
function readFile(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, "utf-8", function (error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
}
readFile("./x.txt")
  .then(function (x) {
    console.log(x);
    return readFile("./y.txt");
  })
  .then(function (y) {
    console.log(y);
    return readFile("./z.txt");
  })
  .then(function (z) {
    console.log(z);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    console.log("finally");
  });
```

4. Promise.all 并发异步操作

```js
const fs = require("fs");
Promise.all([readFile("./x.txt"), readFile("./y.txt"), readFile("./z.txt")]).then(function (data) {
  console.log(data);
});
```

### 8.基于异步函数的异步编程

Promise 虽然解决了回调地狱的问题，但是代码看起来仍然不简洁。

使用异步函数简化代码提高异步编程体验。

1. 异步函数概述

```js
const fs = require("fs");
function readFile(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, "utf-8", function (error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
}
async function getFileContent() {
  let x = await readFile("./x.txt");
  let y = await readFile("./y.txt");
  let z = await readFile("./z.txt");
  return [x, y, z];
}
getFileContent().then(console.log);
```

async 声明异步函数的关键字，异步函数的返回值会被自动填充到 Promise 对象中。

await 关键字后面只能放置返回 Promise 对象的 API。

await 关键字可以暂停函数执行，等待 Promise 执行完后返回执行结果。

await 关键字只能出现在异步函数中。

2. util.promisify

在 Node.js 平台下，所有异步方法使用的都是基于回调函数的异步编程。为了使用异步函数提高异步编程体验，可以使用 util 模块下面的 promisify 方法将基于回调函数的异步 API 转换成返回 Promise 的 API。

```js
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
async function getFileContent() {
  let x = await readFile("./x.txt", "utf-8");
  let y = await readFile("./y.txt", "utf-8");
  let z = await readFile("./z.txt", "utf-8");
  return [x, y, z];
}
getFileContent().then(console.log);
```

### 9.Event Loop 机制概述

1.为什么要学习事件循环机制

- 学习事件循环可以让开发者明白 JavaScript 的运行机制是怎么样的。

  2.事件循环机制做的是什么事情？

- 事件循环机制用于管理异步 API 的回调函数什么时候回到主线程中执行。
- Node.js 采用的是异步 I/O 模型。同步 API 在主线程中执行，异步 API 在底层的 C++ 维护的线程中 执行，异步 API 的回调函数在主线程中执行。在 JavaScript 应用运行时，众多异步 API 的回调函数 什么时候能回到主线程中调用呢？这就是事件循环机制做的事情，管理异步 API 的回调函数什么时 候回到主线程中执行。

  3.为什么这种机制叫做事件循环？

- 因为 Node.js 是事件驱动的。事件驱动就是当什么时候做什么事情，做的事情就定义在回调函数 中，可以将异步 API 的回调函数理解为事件处理函数，所以管理异步 API 回调函数什么时候回到主 线程中调用的机制叫做事件循环机制。

### 10.Event Loop 的六个阶段

事件循环是一个循环体，在循环体中有六个阶段，在每个阶段中，都有一个事件队列，不同的事件队列 存储了不同类型的异步 API 的回调函数。

![image-20220125184008066](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125184008066.png)

1. Timers：用于存储定时器的回调函数(setInterval, setTimeout)

2. Pending callbacks：执行与操作系统相关的回调函数，比如启动服务器端应用时监听端口操作的回调函数就在这里调用。

3. Idle, prepare：系统内部使用。

4. IO Poll：存储 I/O 操作的回调函数队列，比如文件读写操作的回调函数。

   如果事件队列中有回调函数，执行它们直到清空队列。

   否则事件循环将在此阶段停留一段时间以等待新的回调函数进入，这个等待取决于以下两个条件：

   1. setImmediate 队列(check 阶段)中存在要执行的回调函数。
   2. timers 队列中存在要执行的回调函数. 在这种情况下, 事件循环将移至 check 阶段, 然后移至 Closing callbacks 阶段, 并最终从 timers 阶段进入下一次循环。

5. Check：存储 setImmediate API 的回调函数。
6. Closing callbacks：执行与关闭事件相关的回调，例如关闭数据库连接的回调函数等。

循环体会不断运行以检测是否存在没有调用的回调函数，事件循环机制会按照先进先出的方式执行他们直到队列为空。

### 11.宏任务与微任务

宏任务：setInterval, setTimeout, setImmediate, I/O

微任务：Promise.then Promise.catch Promise.finally, process.nextTick

#### 微任务与宏任务的区别

1.  微任务的回调函数被放置在微任务队列中，宏任务的回调函数被放置在宏任务队列中。
2.  微任务优先级高于宏任务。

当微任务事件队列中存在可以执行的回调函数时，事件循环在执行完当前阶段的回调函数后会暂停 进入事件循环的下一个阶段，事件循环会立即进入微任务的事件队列中开始执行回调函数，当微任 务队列中的回调函数执行完成后，事件循环再进入到下一个阶段开始执行回调函数。

nextTick 的优先级高于 microTask，在执行任务时，只有 nextTick 中的所有回调函数执行完成后 才会开始执行 microTask。

不同阶段的宏任务的回调函数被放置在了不同的宏任务队列中，宏任务与宏任务之间没有优先级的概念，他们的执行顺序是按照事件循环的阶段顺序进行的。

### 12.Event Loop 代码解析

在 Node 应用程序启动后，并不会立即进入事件循环，而是先执行输入代码，从上到下开始执行，同步 API 立即执行，异步 API 交给 C++ 维护的线程执行，异步 API 的回调函数被注册到对应的事件队列中。 当所有输入代码执行完成后，开始进入事件循环。

```js
console.log("start");
setTimeout(() => {
  console.log("setTimeout 1");
}, 0);
setTimeout(() => {
  console.log("setTimeout 2");
}, 0);
console.log("end");
// start end 1 2
```

```js
setTimeout(() => console.log("1"), 0);
setImmediate(() => console.log("2"));
function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
}
sleep(1000);
// 1 2
```

```js
setTimeout(() => console.log("1"), 0);
setImmediate(() => console.log("2"));
// 2 1 或 1 2
```

```js
const fs = require("fs");
fs.readFile("./index.html", () => {
  setTimeout(() => console.log("1"), 0);
  setImmediate(() => console.log("2"));
});
// 2 1
```

```js
setTimeout(() => console.log("1"), 50);
process.nextTick(() => console.log("2"));
setImmediate(() => console.log("3"));
process.nextTick(() => console.log("4"));
// 2 4 3 1
```

```js
setTimeout(() => console.log(1));
setImmediate(() => console.log(2));
process.nextTick(() => console.log(3));
Promise.resolve().then(() => console.log(4));
(() => console.log(5))();
// 5 3 4 1 2
```

```js
process.nextTick(() => console.log(1));
Promise.resolve().then(() => console.log(2));
process.nextTick(() => console.log(3));
Promise.resolve().then(() => console.log(4));
// 1 3 2 4
```

```js
setTimeout(() => console.log("1"), 50);
process.nextTick(() => console.log("2"));
setImmediate(() => console.log("3"));
process.nextTick(() =>
  setTimeout(() => {
    console.log("4");
  }, 1000)
);
// 2 3 1 4
```

### 13.process.nextTick 与 setImmediate()

1. process.nextTick()

此方法的回调函数优先级最高，会在事件循环之前被调用。

如果你希望异步任务尽可能早地执行，那就使用 process.nextTick。

```js
const fs = require("fs");
function readFile(fileName, callback) {
  if (typeof fileName !== "string") {
    return callback(new TypeError("filename 必须是字符串类型"));
  }
  fs.readFile(filename, function (err, data) {
    if (err) return callback(err);
    return callback(null, data);
  });
}
```

此段代码的问题在于 readFile 方法根据传入的参数类型，callback 可能会在主线程中直接被调用， callback 也可能在事件循环的 IO 轮询阶段被调用，这可能会导致不可预测的问题发生。如何使 readFile 方法变成完全异步的呢？

```js
const fs = require("fs")
function readFile(fileName, callback) {
if (typeof fileName !== "string") {
	return process.nextTick(callback, new TypeError("filename 必须是字符串类
型"))
}
fs.readFile(fileName, (err, data) => {
		if (err) return callback(err)
		return callback(null, data)
	})
}
```

经过以上更改以后，无论 fileName 参数是否是字符串类型，callback 都不会在主线程中直接被调用。

2. setImmediate()

setImmediate 表示立即执行，它是宏任务，回调函数会被会放置在事件循环的 check 阶段。

在应用中如果有大量的计算型任务，它是不适合放在主线程中执行的，因为计算任务会阻塞主线 程，主线程一旦被阻塞，其他任务就需要等待，所以这种类型的任务最好交给由 C++ 维护的线程去 执行。

可以通过 setImmediate 方法将任务放入事件循环中的 check 阶段，因为代码在这个阶段执行不会阻塞主线程，也不会阻塞事件循环。

```js
function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
  console.log("ok");
}
```

```js
console.log("start");
sleep(2000);
console.log("end");
```

```js
console.log("start");
setImmediate(sleep, 2000);
console.log("end");
```

结论：Node 适合 I/O 密集型任务，不适合 CPU 密集型任务，因为主线程一旦阻塞，程序就卡住了。

## 系统环境变量

系统环境变量是指在操作系统级别上定义的变量，变量中存储了程序运行时所需要的参数。

![image-20211231155429238](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231155432.png)

比如在使用 webpack 构建前端应用时就使用到了系统环境变量，因为 webpack 需要根据系统环境变量判断当前为开发环境还是生产环境，根据环境决定如何构建应用。

在开发环境的操作系统中定义 NODE_ENV 变量，值为 development，在生产环境的操作系统中定义 NODE_ENV 变量，值为 production。webpack 在运行时通过 process.env.NODE_ENV 获取变量的值，从而得出当前代码的运行环境是什么。

环境变量 PATH：系统环境变量 PATH 中存储的都是应用程序路径。当要求系统运行某一个应用程序又没有告诉它程序的完整路径时，此时操作系统会先在当前文件夹中查找应用程序，如果查找不到就会去系统环境变量 PATH 中指定的路径中查找。

![image-20211231155611080](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231155612.png)

## 使用

### 下载安装

工具一定要到官方下载，历史版本下载 <https://npm.taobao.org/mirrors/node/>

![img](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231094521.png)

Nodejs 的版本号奇数为开发版本，偶数为发布版本，<span style="color:red">我们选择偶数号的 LTS 版本（长期维护版本 long term service）</span>

![1572676490692](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231094530.png)

双击打开安装文件，一路下一步即可 😎，默认的安装路径是 `C:\Program Files\nodejs`

安装完成后，在 CMD 命令行窗口下运行 `node -v`，如显示版本号则证明安装成功，反之安装失败，重新安装。

![1572678177784](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231094535.png)

### 初体验

#### 交互模式

在命令行下输入命令 `node`，这时进入 nodejs 的交互模式

![1572678681282](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231094538.png)

#### 文件执行

创建文件 hello.js ，并写入代码 console.log('hello world')，命令行运行 `node hello.js`

快速启动命令行的方法

- 在文件夹上方的路径中，直接输入 cmd 即可
- 使用 webstorm 和 vscode 自带的命令行窗口

![1572680753835](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231094540.png)

#### VScode 插件运行

安装插件 『code Runner』, 文件右键 -> run code

![1593782861500](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211231094543.png)

#### 全局对象

<span style="color:red">在 nodejs 环境下，不能使用 BOM 和 DOM ，也没有全局对象 window，全局对象的名字叫 global</span>

在 global 对象中会存在一些和 window 对象中名字相同且作用相同的方法

```
global.console.log
global.setInterval
global.clearInterval
global.setTimeout
global.clearTimeout
global.setImmediate
```

Nodejs 常见的全局对象

- \_\_filename：返回正在执行脚本文件的绝对路径
- \_\_dirname：返回正在执行脚本所在目录
- timer 类函数：执行顺序与事件循环间的关系
- process：提供与当前进程互动的接口
- require：实现模块的加载
- module、exports：处理模块的导出

### Buffer(缓冲器)

#### 介绍

Buffer 是一个和数组类似的对象，不同是 Buffer 是专门用来保存二进制数据的

#### 特点

- 大小固定：在创建时就确定了，且无法调整
- 性能较好：直接对计算机的内存进行操作
- 每个元素大小为 1 字节 （byte）

#### 操作

##### 创建 Buffer

- 直接创建 Buffer.alloc

- 不安全创建 Buffer.allocUnsafe

- 通过数组和字符串创建 Buffer.from

- ```js
  //Buffer 的声明创建
  const buf_1 = Buffer.alloc(10);
  const buf_2 = Buffer.allocUnsafe(10);
  const buf_3 = Buffer.from("yunmu");
  ```

##### Buffer 读取和写入

可以直接通过 `[]` 的方式对数据进行处理，可以使用 toString 方法将 Buffer 输出为字符串

- ==[ ]== 对 buffer 进行读取和设置

- ```js
  //获取第一个字节的内容  121 对应的字符是多少
  console.log(buf_3[0]);
  //1. 通过数字获取对应的 ASCII 字符
  console.log(String.fromCharCode(121));
  //2. 通过 ASCII 字符获取对应的编号
  console.log("a".charCodeAt());
  //设置
  buf_3[0] = 99;
  console.log(buf_3.toString());
  ```

- ==toString== 将 Buffer 转化为字符串

- ```js
  //将 Buffer 转化成字符串
  console.log(buf_3.toString());
  ```

##### 关于溢出

溢出的高位数据会舍弃

```js
//关于溢出   舍弃高于 8 位的内容  ‭0001 0010 1100‬  =>  0010 1100‬
buf_3[0] = 300;
console.log(buf_3.toString());
```

##### 关于中文

一个 UTF-8 的中文字符大多数情况都是占 3 个字节

```js
//关于中文 一个UTF-8中文字符占据三个字节
const buf_4 = Buffer.from("我爱你");
console.log(buf_4);
```

##### 关于单位换算

1Bit 对应的是 1 个二进制位

8 Bit = 1 字节（Byte）

1024Byte = 1KB

1024KB = 1MB

1024MB = 1GB

1024GB = 1TB

平时所说的网速 10M 20M 100M 这里指的是 Bit ，所以理论下载速度 除以 8 才是正常的理解的下载速度

### 文件系统 fs

fs 全称为 file system，是 NodeJS 中的内置模块，可以对计算机中的文件进行增删改查等操作。

##### 文件写入

> 如果要做服务, 需要使用『异步』
> 如果做文件相关的处理, 不涉及为用户提供服务, 可以使用同步 API(简单写入, 读取)
>
> 写入文件场景， 需要持久化保存数据的时候, 需要想到文件写入
>
> 1. 下载文件
> 2. 安装文件
> 3. 日志(程序日记) 如 Git
> 4. 数据库
> 5. 网盘
> 6. 编辑器保存文件
> 7. 视频录制

- 简单写入

  - fs.writeFile(file, data, [,options], callback);

  - fs.writeFileSync(file, data);

  - options 选项

    - `encoding` **默认值:** `'utf8'`
    - `mode`**默认值:** `0o666`
    - `flag` **默认值:** `'w'`

    ```js
    const fs = require("fs");

    // 异步写入
    fs.writeFile("./index.html", "云牧大帅鸽\r\n", { flag: "a" }, (err) => {
      if (err) {
        console.log("写入失败", err);
        return;
      }
      console.log("写入成功");
    });
    // flag标记
    //   r   read  只读
    //   w   write 可写
    //   a   append  追加

    // 同步写入
    fs.writeFileSync("./app.css", "*{margin:0;padding:0}");
    fs.writeFileSync("./app.js", Date.now());

    // 0o666 Linux 下文件权限的管理方式
    //   6 所有者的权限
    //   6 所属组的权限
    //   6 其他人权限

    // 6 怎么来的 4 + 2
    //   4 可读
    //   2 可写
    //   1 可执行
    ```

写入练习

```js
let data = {
  id: 4860,
  uuid: "5e398eef-f5cf-4ff6-a000-c24913de86dd",
  hitokoto: "世上所以不公平之事是由于当事人能力不足所致。",
  type: "a",
  from: "金木研",
  from_who: null,
  creator: "夕之树",
  creator_uid: 4248,
  reviewer: 4756,
  commit_from: "web",
  created_at: "1573331301",
  length: 22,
};

//将 JS 对象转化为 字符串
let str = JSON.stringify(data);

//D:/data.txt
//1. 引入 fs 模块
const fs = require("fs");
//2. 调用方法
fs.writeFile("d:/data.json", str, function (err) {
  if (err) {
    console.log("写入失败");
    return;
  }
  console.log("写入成功");
});
```

- 流式写入

  - fs.createWriteStream(path[, options])
    - path
    - options
      - ==flags== **默认值:** `'w'`
      - `encoding `**默认值:** `'utf8'`
      - `mode` **默认值:** `0o666`
    - 事件监听 open close eg: ws.on('open', function(){});

  ```js
  //1. 引入 fs 模块
  const fs = require("fs");

  //2. 创建写入流对象
  const ws = fs.createWriteStream("./home.html");
  const ws = fs.createWriteStream("./home.js");

  //3. 执行写入
  ws.write("<html>");
  ws.write(`
      <head>
          <title>这是一个脚本创建的文件哦</title>
      </head>
      <body>
          <h1>哎呦 不错哦~</h1>
      </body>
  `);
  ws.write("</html>");

  ws.write(`
      const body = document.body;
      body.style.background = 'pink';
      setTimeout(() => {
          alert('恭喜中奖啦!!!');
      }, 1000);
  `);

  //4. 关闭写入流
  ws.close();
  //对于简单的写入次数较少的情况, 可以使用 writeFile , 如果是批量要写入的场景,使用 createWriteStream
  ```

##### 文件读取

> **读取文件场景**
>
> 1. 下载文件
> 2. 程序运行
> 3. 数据读取(数据库)
> 4. 日志 (git log)
> 5. 编辑器打开文件

- 简单读取

  - fs.readFile(file, function(err, data){})
  - fs.readFileSync(file)

  ```js
  //1. 引入 fs 模块
  const fs = require("fs");

  //2-1. 调用方法读取内容
  fs.readFile("./home.html", (err, data) => {
    if (err) {
      console.log("读取失败,错误的对象为", err);
      return;
    }
    //输出从文件中读取的内容 读取结果是Buffer
    console.log(data.toString());
  });

  //2-2 同步读取
  let result = fs.readFileSync("./index.html");
  console.log(result.toString());
  ```

练习

```js
//1. 引入 fs 模块
const fs = require("fs");

//2. 调用方法 ./index.html
fs.readFile("C:\\Windows\\Boot\\BootDebuggerFiles.ini", (err, data) => {
  //判断  throw 抛出
  if (err) throw err;
  //输出文件的内容
  console.log(data.toString());
});
```

- 流式读取

  - fs.createReadStream();

  ```js
  //1. 引入 fs 模块
  const fs = require("fs");

  //2. 创建读取流对象
  const rs = fs.createReadStream("./file/刻意练习.mp3");

  // 读取流打开的时候触发
  rs.on("open", () => {
    console.log("读取流打开了");
  });

  //3. 绑定事件 when 当....时候   chunk 块   当读取完一块数据后 触发
  rs.on("data", (chunk) => {
    console.log(chunk.length);
  });

  //readFile 与 createReadStream
  //对于小文件读取和处理 readFile
  //对于大文件读取 createReadStream
  ```

流式读取文件并写入

```js
//复制文件
//1. 模块引入
const fs = require("fs");

//2. 创建流对象
const rs = fs.createReadStream("./file/刻意练习.mp3");
const ws = fs.createWriteStream("./file/不二法门.mp3");

//3. 绑定事件读取内容
// rs.on("data", (chunk) => {
//   //写入文件
//   ws.write(chunk);
// });

//pipe管道也可以完成写入
rs.pipe(ws);
```

##### 文件删除

- fs.unlink('./test.log', function(err){});
- fs.unlinkSync('./move.txt');

```js
//1. 引入 fs 模块
const fs = require("fs");

//2. 调用方法
fs.unlink("./project/index.js", (err) => {
  if (err) throw err;
  console.log("删除成功");
});

fs.unlinkSync("./project/app.js");
```

##### 移动文件 + 重命名

- fs.rename("oldPath", "newPath", function(err){})
- fs.renameSync("oldPath" ,"newPath")

```js
// 1. 引入模块
const fs = require("fs");

//2. 调用方法
fs.rename("./home.js", "./index.js", (err) => {
  if (err) throw err;
  console.log("重命名成功");
});

fs.rename("./index.html", "./project/首页.html", (err) => {
  if (err) throw err;
  console.log("重命名成功");
});

//同步API
fs.renameSync("./project/app.css", "./project/index.css");
```

##### 文件夹操作

- mkdir 创建文件夹
  - path
  - options
    - recursive 是否递归调用
    - mode 权限 默认为 0o777
  - callback
- rmdir 删除文件夹
- readdir 读取文件夹

```js
//文件夹操作
const fs = require("fs");

//创建文件夹
fs.mkdir("./html", (err) => {
  if (err) throw err;
  console.log("创建成功");
});

//读取文件夹 read 读取  dir 文件夹
fs.readdir("./project", (err, files) => {
  if (err) throw err;
  //输出文件夹下的『文件列表』
  console.log(files);
});

fs.readdir("d:/", (err, files) => {
  if (err) throw err;
  //输出文件夹下的『文件列表』
  console.log(files);
});

//删除文件夹
fs.rmdir("./project", { recursive: true }, (err) => {
  console.log(err);
});
```

##### 路径问题

> fs 模块中的相对路径 参照的是执行命令时的工作目录
>
> 路径的分类
>
> 绝对路径
>
> D:/www/share/day05/代码/1-nodejs/write.js (windows)
>
> C:/images/logo.png (windows)
>
> /usr/root/www/website/index.html (linux)
>
> 相对路径
>
> ./index.html
>
> ../css/app.css 上一级目录中找 css/app.css
>
> index.html 当前文件夹下的 index.html

```js
const fs = require("fs");
//特殊的变量  『始终保存的是当前文件所在文件夹的绝对路径』
console.log(__dirname);
fs.writeFileSync(__dirname + "/index.html", "abc");
```

##### 查看『资源的状态』

- stat(path, callback)

```js
const fs = require("fs");

//查看文件状态
fs.stat("./file", (err, stats) => {
  if (err) throw err;
  //如果没有错
  console.log("是否为文件夹" + stats.isDirectory());
  console.log("是否为文件" + stats.isFile());
});
```
