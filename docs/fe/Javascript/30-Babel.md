# Babel

> Babel 是什么
>
> **Babel 的使用方式**
>
> **使用 Babel 前的准备工作**
>
> **使用 Babel 编译 ES6 代码**

## 1.Babel 初识

- 认识 Babel
- 使用 Babel
- 解释编译结果

### 1.认识 Babel

> 官网：https://babeljs.io/
>
> 在线编译：https://babeljs.io/repl
>
> Babel 是 JavaScript 的编译器，用来将 ES6 的代码，转换成 ES6 之前的代码

### 2.使用 Babel

[![DfwgIJ.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DfwgIJ.png)](https://imgchr.com/i/DfwgIJ)

**ES6 代码**

```js
// ES6
let name = "云牧";
const age = 18;

const add = (x, y) => x + y;

// Set Map

new Promise((resolve, reject) => {
  resolve("成功");
}).then((value) => {
  console.log(value);
});

Array.from([1, 2]);

class Person {
  constructor(name, age) {
    Object.assign(this, { name, age });
  }
}
new Person("云牧", 18);

import "./index.js";
```

**使用 Babel 编译后**

```js
"use strict";

require("./index.js");

//编译class需要的中间性质的函数
function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// ES6
var name = "云牧";
var age = 18;

var add = function add(x, y) {
  return x + y;
}; // Set Map

new Promise(function (resolve, reject) {
  resolve("成功");
}).then(function (value) {
  console.log(value);
});
Array.from([1, 2]);

var Person = function Person(name, age) {
  _classCallCheck(this, Person);

  Object.assign(this, {
    name: name,
    age: age,
  });
};

new Person("云牧", 18);
```

### 3.解释编译结果

> Babel 本身可以编译 ES6 的大部分语法，比如 let、const、箭头函数、类
>
> 但是对于 ES6 新增的 API，比如 Set、Map、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign/Array.from）都不能直接编译，需要借助其它的模块
>
> Babel 一般需要配合 Webpack 来编译模块语法

## 2.Babel 的使用方式

- Babel 有哪些使用方式
- 在命令行工具中使用 Babel

[![DfwOJA.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DfwOJA.png)](https://imgchr.com/i/DfwOJA)

**在当前目录打开命令行工具**

[![Df0Mo4.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Df0Mo4.png)](https://imgchr.com/i/Df0Mo4)

## 3.使用 Babel 前的准备工作

- 什么是 Node.js 和 npm
- 安装 Node.js
- 初始化项目
- 安装 Babel 需要的包

### 1.什么是 Node.js 和 npm

> Node.js 是个平台或者工具，对应浏览器
>
> 后端的 JavaScript = ECMAScript + IO + File + ...等服务器端的操作
>
> npm：node 包管理工具

### 2.安装 Node.js

> node.js 官网 https://nodejs.org/zh-cn/
>
> node -v
>
> npm -v

[![DfDmaF.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DfDmaF.png)](https://imgchr.com/i/DfDmaF)

![image-20211226150643782](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20211226150643782.png)

### 3.初始化项目

> npm init -> package.json

[![DfyfRH.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DfyfRH.png)](https://imgchr.com/i/DfyfRH)

[![Df6W7V.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Df6W7V.png)](https://imgchr.com/i/Df6W7V)

### 4.安装 Babel 需要的包

> npm config set registry https://registry.npm.taobao.org 切换安装源
>
> npm install --save-dev @babel/core @babel/cli
>
> npm install --save-dev @babel/core@7.11.0 @babel/cli@7.10.5

[![Dfc0D1.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dfc0D1.png)](https://imgchr.com/i/Dfc0D1)

[![Dfg3Md.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dfg3Md.png)](https://imgchr.com/i/Dfg3Md)

[![DfgAM9.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DfgAM9.png)](https://imgchr.com/i/DfgAM9)

**如果删除 node_modules 后 包都没有 可以通过 npm install 重新下载回来 因为 package.json 记录了**

## 4.使用 Babel 编译 ES6 代码

- 编译的命令
- Babel 的配置文件

### 1.执行编译的命令

> 在 package.json 文件中添加执行 babel 的命令

[![Df2lkV.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Df2lkV.png)](https://imgchr.com/i/Df2lkV)

[![DfWmaq.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DfWmaq.png)](https://imgchr.com/i/DfWmaq)

**通过 babel 将 src 下的文件 -d 代表输出 写完整是--out-dir 到 lib** 我们可以改为 dist

**babel src -d dist**

**babel src --out-dir dist**

[![DfWcdI.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DfWcdI.png)](https://imgchr.com/i/DfWcdI)

[![Dff5h6.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dff5h6.png)](https://imgchr.com/i/Dff5h6)

```js
let name = "云牧";
const age = 18;
const add = (x, y) => x + y;
new Promise((resolve, reject) => {
  resolve("成功");
});
Array.from([1, 2]);
class Person {}
import "./index.js";
```

**npm run build**

[![DffOHA.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DffOHA.png)](https://imgchr.com/i/DffOHA)

[![Dfh1b9.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dfh1b9.png)](https://imgchr.com/i/Dfh1b9)

### 2.Babel 的配置文件

[![Dfhoan.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dfhoan.png)](https://imgchr.com/i/Dfhoan)

```js
npm install @babel/preset-env@7.11.0 --save-dev
```

[![Df59mQ.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Df59mQ.png)](https://imgchr.com/i/Df59mQ)

**@babel/cli 在命令行工具输入 Babel 命令需要 @babel/core Babel 的核心包 负责发号施令**

**@babel/preset-env 如何转换代码**

**创建配置文件 .babelrc，并配置**

[![Df5cjS.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Df5cjS.png)](https://imgchr.com/i/Df5cjS)

[![DICCod.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DICCod.png)](https://imgchr.com/i/DICCod)
