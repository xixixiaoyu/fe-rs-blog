## 1. 什么是 React 脚手架？

> 在我们的现实生活中，脚手架最常用的使用场景是在工地，它是为了保证施工顺利的、方便的进行而搭建的，在工地上搭建的脚手架可以帮助工人们高效的去完成工作，同时在大楼建设完成后，拆除脚手架并不会有任何的影响。
>
> 在我们的 React 项目中，脚手架的作用与之有异曲同工之妙
>
> React 脚手架其实是一个工具帮我们快速的生成项目的工程化结构，每个项目的结构其实大致都是相同的，所以 React 给我提前的搭建好了，这也是脚手架强大之处之一，也是用 React 创建 SPA 应用的最佳方式
>
> - xxx 脚手架: 用来帮助程序员快速创建一个基于 xxx 库的模板项目
> - 包含了所有需要的配置（语法检查、jsx 编译、devServer…）
> - 下载好了所有相关的依赖
> - 可以直接运行一个简单效果
> - react 提供了一个用于创建 react 项目的脚手架库: create-react-app
> - 项目的整体技术架构为: react + webpack + es6 + eslint
> - 使用脚手架开发的项目的特点: 模块化 , 组件化 , 工程化

## 2.创建项目并启动

1. 全局安装：`npm i -g create-react-app`
2. 切换到想创项目的目录，使用命令：`create-react-app hello-react`
3. 进入项目文件夹：`cd hello-react`
4. 启动项目：`npm start`

注意：React 脚手架默认也是使用`yarn`包管理工具，使用`yarn`需`npm i -g yarn`

## 3.脚手架项目结构

```js
hello-react
├─ .gitignore               // 自动创建本地仓库
├─ package.json             // 相关配置文件
├─ public                   // 公共资源
│  ├─ favicon.ico           // 浏览器顶部的icon图标
│  ├─ index.html            // 应用的 index.html入口
│  ├─ logo192.png           // 在 manifest 中使用的logo图
│  ├─ logo512.png           // 同上
│  ├─ manifest.json         // 应用加壳的配置文件
│  └─ robots.txt            // 爬虫给协议文件
├─ src                      // 源码文件夹
│  ├─ App.css               // App组件的样式
│  ├─ App.js                // App组件
│  ├─ App.test.js           // 用于给APP做测试
│  ├─ index.css             // 样式
│  ├─ index.js              // 入口文件
│  ├─ logo.svg              // logo图
│  ├─ reportWebVitals.js    // 页面性能分析文件
│  └─ setupTests.js         // 组件单元测试文件
└─ yarn.lock
```

介绍一下 public 目录下的 `index.html` 文件中的代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- %PUBLIC_URL%代表public文件夹的路径 -->
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <!-- 开启理想视口，用于做移动端网页的适配 -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- 用于配置浏览器页签+地址栏的颜色(仅支持安卓手机浏览器) -->
    <meta name="theme-color" content="red" />
    <meta name="description" content="Web site created using create-react-app" />
    <!-- 用于指定网页添加到手机主屏幕后的图标 -->
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!-- 应用加壳时的配置文件 -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React App</title>
  </head>
  <body>
    <!-- 若浏览器不支持js则展示标签中的内容 -->
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

## 4.组件样式模块化

### 行内样式

```react
class App extends Component {
    render() {
        const style = {width: 200, height: 200, backgroundColor: 'red'};
        return <div style={style}></div>
    }
}
```

### 外链样式

```react
//Button.module.css
.error{ color: red; }

// Button.js
import styles from './Button.module.css';
class Button extends Component {
    render() {
        return <button className={styles.error}>Error Button</button>;
    }
}
```

### 全局样式

```js
import "./styles.css";
```

## 5.插件安装

![image-20220120153315120](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220120153315120.png)

之后使用`rcc`快速创建类式组件

使用`rfc`快速创建函数式组件

## 6.拆分组件步骤

1. 拆分组件: 拆分界面,抽取组件
2. 实现静态组件: 使用组件实现静态页面效果
3. 实现动态组件
   1. 动态显示初始化数据（考虑数据名称类型以及存放在哪个组件）
   2. 交互(从绑定事件监听开始)

## 7.组件组合实现 TodoList

代码：[React/TodoList 案例 · 云牧/前端笔记 - 码云 - 开源中国 (gitee.com)](https://gitee.com/z1725163126/front-end-notes/tree/master/React/TodoList案例)

1. 拆分组件、实现静态组件，注意：className、style 的写法
2. 动态初始化列表，如何确定将数据放在哪个组件的 state 中？
   1. 某个组件使用：放在其自身的 state 中
   2. 某些组件使用：放在他们共同的父组件 state 中（官方称此操作为：状态提升）
3. 关于父子之间通信

   1. 【父组件】给【子组件】传递数据：通过 props 传递
   2. 【子组件】给【父组件】传递数据：通过 props 传递，要求父提前给子传递一个函数

4. 注意 defaultChecked 和 checked 的区别，类似的还有：defaultValue 和 value

5. 状态在哪里，操作状态的方法就在哪里

### 1.拆分组件

> 将一个页面拆分
>
> 顶部的输入框，可以完成添加项目的功能，可以拆分成一个 **Header 组件**
>
> 中间部分可以实现一个渲染列表的功能，可以拆分成一个 **List 组件**
>
> 这中间每个待办事项可以拆分成一个 **Item 组件**
>
> 底部显示当前完成状态的部分，可以拆分成一个 **Footer 组件**

![image-20210826092737826](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f6c6a63696d672e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f696d672f696d6167652d32303231303832363039323733373832362e706e67)

在拆分完组件后，我们下一步要做的就是去实现这些组件的静态效果

### 2.实现静态组件

我们可以先写好这个页面的静态页面，然后再分离组件，注意书写页面时有一定规范有利于分离组件

- 写好注释
- HTML 整理好布局
- CSS 层级命名清晰，可以整块拆分，当前修饰区域不与其他区域关联

首先，我们在 `src` 目录下，新建一个 `Components` 文件夹，用于存放我们的组件，然后在文件夹下，新建 `Header` 、`Item`、`List` 、`Footer` 组件文件夹，再创建其下的 `index.jsx`，`index.css` 文件，用于创建对应组件及其样式文件

最终目录结构如下

```nginx
todolist
├─ package.json
├─ public
│  ├─ favicon.ico
│  └─ index.html
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ Components
│  │  ├─ Footer
│  │  │  ├─ index.css
│  │  │  └─ index.jsx
│  │  ├─ Header
│  │  │  ├─ index.css
│  │  │  └─ index.jsx
│  │  ├─ item
│  │  │  ├─ index.css
│  │  │  └─ index.jsx
│  │  └─ List
│  │     ├─ index.css
│  │     └─ index.jsx
│  └─ index.js
└─ yarn.lock
```

注意将 HTML 结构对应到各个`index.jsx`文件，css 样式通过`index.jsx`引入`index.css`文件

### 3.实现动态组件

#### 1.动态展示列表

目前我们要通过状态维护待办事项的内容

首先我们知道，父子之间传递参数，可以通过 `state` 和 `props` 实现

我们通过在父组件也就是 `App.jsx` 中设置状态

![image-20210826103418053](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f6c6a63696d672e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f696d672f696d6167652d32303231303832363130333431383035332e706e67)

再将它传递给对应的渲染组件 `List`

```jsx
// App.jsx
const { todos } = this.state
<List todos={todos}/>
```

这样在 `List` 组件中就能通过 `props` 来获取到 `todos`

```jsx
const { todos, updateTodo } = this.props;
```

再通过 `map` 遍历渲染 `Item` 数量

```jsx
{
  todos.map((todo) => {
    return <Item key={todo.id} {...todo} />;
  });
}
```

同时由于我们的数据渲染最终是在 `Item` 组件中完成的，所以我们需要将数据传递给 `Item` 组件

在 `Item` 组件中取出 `props` 即可使用

```jsx
const { id, name, done } = this.props;
```

这样我们更改 `App.jsx` 文件中的 `state` 就能驱动着 `Item` 组件的更新，如图

对于复选框的选中状态，这里采用的是 `defaultChecked = {done}`，相比于 `checked` 属性，这个设定的是默认值，能够更改

#### 2.添加事项功能

> 首先我们需要在 Header 组件中，绑定键盘事件，判断按下的是否为回车，如果为回车，则将当前输入框中的内容传递给 APP 组件
>
> 因为，在目前的学习知识中，Header 组件和渲染组件 List 属于兄弟组件，没有办法进行直接的数据传递，因此可以将数据传递给 APP 再由 APP 转发给 List。

```jsx
// Header/index.jsx
handleKeyUp = (event) => {
  // 解构赋值获取 keyCode,target
  const { keyCode, target } = event;
  // 判断是不是回车
  if (keyCode !== 13) return;
  if (target.value.trim() === "") {
    alert("输入不能为空");
  }
  // 准备一个todo对象
  const todoObj = { id: nanoid(), name: target.value, done: false };
  // 传递给app
  this.props.addTodo(todoObj);
  // 清空
  target.value = "";
};
```

需要我们注意的是，我们新建的 `todo` 对象，一定要保证它的 `id` 的唯一性

这里采用的 `nanoid` 库，安装引入这个库的每一次调用`nanoid()`都会返回一个唯一的值

```shell
npm i nanoid
```

我们在 `App.jsx` 中添加了事件 `addTodo` ，这样可以将 Header 组件传递的参数，维护到 `App` 的状态中

```jsx
// App.jsx
addTodo = (todoObj) => {
  const { todos } = this.state;
  // 追加一个 todo
  const newTodos = [todoObj, ...todos];
  this.setState({ todos: newTodos });
};
```

#### 3. 实现鼠标悬浮效果

> 接下来我们需要实现每个 `Item` 中的小功能
>
> 首先是鼠标移入时的变色效果
>
> 我们可以通过一个状态来维护是否鼠标移入，比如用一个 `mouse` 变量，值给 `false` 当鼠标移入时，重新设定状态为 `true` 当鼠标移出时设为 `false` ，然后我们只需要在 `style` 中用`mouse` 去设定样式即可
>
> 下面进行代码实现

在 `Item` 组件中，先设定状态

```jsx
state = { mouse: false }; // 标识鼠标移入，移出
```

给元素绑定上鼠标移入，移出事件

```jsx
<li onMouseEnter={this.handleMouse(true)} onMouseLeave={this.handleMouse(false)} ><li/>
```

当鼠标移入时，会触发 `onMouseEnter` 事件，调用 `handleMouse` 事件传入参数 `true` 表示鼠标进入，更新组件状态

```js
handleMouse = (flag) => {
  return () => {
    this.setState({ mouse: flag });
  };
};
```

再在 `li` 身上添加由 `mouse` 控制的背景颜色

```jsx
style={{ backgroundColor: this.state.mouse ? '#ddd' : 'white' }}
```

同时通过 `mouse` 来控制删除按钮的显示和隐藏，做法和上面一样

```jsx
<button
  onClick={() => this.handleDelete(id)}
  className="btn btn-danger"
  style={{ display: mouse ? "block" : "none" }}
>
  删除
</button>
```

#### 4. 复选框状态维护

> 我们需要将当前复选框的状态，维护到 `state` 当中
>
> 我么可以在复选框中添加一个 `onChange` 事件来进行数据的传递，当事件触发时我们执行 `handleCheck` 函数，这个函数可以向 App 组件中传递参数，这样再在 App 中改变状态即可

首先绑定事件

```jsx
// Item/index.jsx
<input type="checkbox" defaultChecked={done} onChange={this.handleCheck(id)} />
```

事件回调

```jsx
handleCheck = (id) => {
  return (event) => {
    this.props.updateTodo(id, event.target.checked);
  };
};
```

由于我们需要传递 `id` 来记录状态更新的对象，因此我们需要采用高阶函数的写法，不然函数会直接执行而报错，复选框的状态我们可以通过 `event.target.checked` 来获取

这样我们将我们需要改变状态的 `Item` 的 `id` 和改变后的状态，传递给了 App 内定义的`updateTodo` 事件，这样我们可以在 App 组件中操作改变状态

我们传递了两个参数 `id` 和 `done`，通过遍历找出该 `id` 对应的 `todo` 对象，更改它的 `done` 即可

```jsx
// App.jsx
updateTodo = (id, done) => {
  const { todos } = this.state;
  // 处理
  const newTodos = todos.map((todoObj) => {
    if (todoObj.id === id) {
      return { ...todoObj, done };
    } else {
      return todoObj;
    }
  });
  this.setState({ todos: newTodos });
};
```

这里更改的方式是 `{ ...todoObj, done }`，首先会展开 `todoObj` 的每一项，再使用 `done` 属性做覆盖

#### 5. 限制参数类型

我们需要借助 `propTypes` 这个库对参数的**类型以及必要性**进行限制

首先我们需要引入这个库，然后对 `props` 进行限制

在 Header 组件中需要接收一个 `addTodo` 函数，所以我们进行一下限制

```jsx
import PropTypes from 'prop-types'
// Header
static propTypes = {
  addTodo: PropTypes.func.isRequired
}
```

在 Header 组件中需要接收一个 `addTodo` 函数，所以我们进行一下限制

如果传入的参数不符合限制，则会报 **warning**

```jsx
// List
static propTypes = {
    todos:PropTypes.array.isRequired,
    updateTodo:PropTypes.func.isRequired,
    deleteTodo:PropTypes.func.isRequired,
}
```

#### 6. 删除按钮

> 我们可以在 `Item` 组件上的按钮绑定点击事件，然后传入被点击事项的 `id` 值，通过 `props` 将它传递给父元素 `List` ，再通过在 `List` 中绑定一个 `App` 组件中的删除回调，将 `id` 传递给 `App` 来改变 `state`

首先我们先编写点击事件

```jsx
// Item/index.jsx
handleDelete = (id) => {
  this.props.deleteTodo(id);
};
```

子组件想影响父组件的状态，需要父组件传递一个函数，因此我们在 `App` 中添加一个 `deleteTodo` 函数

```jsx
// app.jsx
deleteTodo = (id) => {
  const { todos } = this.state;
  const newTodos = todos.filter((todoObj) => {
    return todoObj.id !== id;
  });
  this.setState({ todos: newTodos });
};
```

然后将这个函数传递给 `List` 组件，再传递给 `Item`并增加一个判断

```jsx
handleDelete = (id) => {
  if (window.confirm("确定删除吗？")) {
    this.props.deleteTodo(id);
  }
};
```

#### 7. 获取完成数量

> 我们在 App 中向 `Footer` 组件传递 `todos` 数据，再去统计数据
>
> 统计 `done `为 `true` 的个数，再渲染数据即可

```jsx
// Footer/index,jsx
const doneCount = this.props.todos.reduce((pre, todo) => {
  return pre + (todo.done ? 1 : 0);
}, 0);
```

#### 8. 全选按钮

> 首先我们需要在按钮上绑定事件，由于子组件需要改变父组件的状态，所以我们的操作和之前的一样，先绑定事件，再在 App 中传一个函数给 Footer ，再在 Footer 中调用这个函数并传入参数即可
>
> 这里需要特别注意的是`defaulChecked` 只有第一次会起作用，所以我们需要将前面写的改成 `checked` 添加 `onChange` 事件即可

首先我们先在 App 中给 Footer 传入一个函数 `checkAllTodo`

```jsx
// App.jsx
checkAllTodo = (done) => {
  const { todos } = this.state;
  const newTodos = todos.map((todoObj) => {
    return { ...todoObj, done: done };
  });
  this.setState({ todos: newTodos });
};

<Footer todos={todos} checkAllTodo={this.checkAllTodo} />;
```

然后我们需要在 Footer 中调用一下，这里我们传入了一个参数：当前按钮的状态，用于全选和取消全选

```jsx
handleCheckAll = (event) => {
  this.props.checkAllTodo(event.target.checked);
};
```

同时我们需要排除总数为 0 时的干扰

```jsx
<input
  type="checkbox"
  checked={doneCount === total && total !== 0 ? true : false}
  onChange={this.handleCheckAll}
/>
```

#### 9. 删除已完成

> 给删除按钮添加一个点击事件，回调中调用 App 中添加的删除已完成的函数，全都一个套路

首先在 Footer 组件中调用传来的函数，在 App 中定义函数，过滤掉 `done` 为 `true` 的，再更新状态即可

```jsx
// App.jsx
clearAllDone = () => {
  const { todos } = this.state;
  const newTodos = todos.filter((todoObj) => {
    return todoObj.done !== true;
  });
  this.setState({ todos: newTodos });
};
```

```jsx
// Footer/index,jsx
//清除已完成任务的回调
handleClearAllDone = () => {
  this.props.clearAllDone();
};
<button onClick={this.handleClearAllDone} className="btn btn-danger">
  清除已完成任务
</button>;
```

## 8.React-ajax

> React 本身只关注于界面, 并不包含发送 ajax 请求的代码
>
> 前端应用需要通过 ajax 请求与后台进行交互(json 数据)
>
> React 应用中需要集成第三方 ajax 库(或自己封装)

### 常用的 ajax 请求库

1. jQuery: 比较重, 如果需要另外引入不建议使用

2. axios: 轻量级，Promise 风格，推荐使用

   安装： `yarn add axios`

我们在发送请求的时候，经常会遇到一个很重要的问题：跨域！

![image-20210827091119837](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f6c6a63696d672e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f696d672f696d6167652d32303231303832373039313131393833372e706e67)

之前可以利用 CORS 和 JSONP 解决，但是这些都需要后端的配合

如果我们前端需要自己解决的话就需要使用代理

### 1. 全局代理

> 直接将代理配置在了配置文件 `package.json` 中

```json
"proxy":"http://localhost:5000"
```

工作方式：代理到服务器的 5000 端口，前端端口是 3000，请求时候 http://localhost:3000/students 所有 3000 端口下没有的资源都会转发到 http://localhost:5000，如果有则不转发

![转发](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f6c6a63696d672e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f696d672f2545382542442541432545352538462539312e706e67)

优点：配置简单，前端请求资源时可以不加任何前缀

缺点：不能配置多个代理。

### 2. 单独配置

1.  在 src 下创建配置文件：src/setupProxy.js 代理文件 脚手架在启动的时候会自动执行此文件
2.  编写 setupProxy.js 配置具体代理规则：

```js
const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/api1", {
      //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
      target: "http://localhost:5000", //配置转发目标地址(能返回数据的服务器地址)
      changeOrigin: true, //控制服务器接收到的请求头中host字段的值
      /*
         	changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
         	changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
         	changeOrigin默认值为false，但我们一般将changeOrigin值设为true
         */
      pathRewrite: { "^/api1": "" }, //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
    }),
    proxy("/api2", {
      target: "http://localhost:5001",
      changeOrigin: true,
      pathRewrite: { "^/api2": "" },
    })
  );
};
```

优点：可以配置多个代理，可以灵活的控制请求是否走代理。

缺点：配置繁琐，前端请求资源时必须加前缀。

## 9.GitHub 搜索案例

> 代码：[React/github 搜索案例\_axios · 云牧/前端笔记 - 码云 - 开源中国 (gitee.com)](https://gitee.com/z1725163126/front-end-notes/tree/master/React/github搜索案例_axios)
>
> 1.设计状态时要考虑全面，例如带有网络请求的组件，要考虑请求失败怎么办。
>
> 2.ES6 小知识点：解构赋值+重命名
>
> ```js
> let obj = { a: { b: 1 } };
> const { a } = obj; //传统解构赋值
> const {
>   a: { b },
> } = obj; //连续解构赋值
> const {
>   a: { b: value },
> } = obj; //连续解构赋值+重命名
> ```
>
> 3.消息订阅与发布机制（ PubSubJS），先订阅，再发布，适用于任意组件间通信，要在组件的 componentWillUnmount 中取消订阅
>
> 4.fetch 发送请求（关注分离的设计思想）
>
> ```js
> try {
>   const response = await fetch(`/api1/search/users2?q=${keyWord}`);
>   const data = await response.json();
>   console.log(data);
> } catch (error) {
>   console.log("请求出错", error);
> }
> ```

### 1.实现静态组件

拆分组件，我们可以将它拆成以下两个组件，第一个组件是 `Search`，第二个是 `List`

![image-20210828065604542](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f6c6a63696d672e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f696d672f696d6167652d32303231303832383036353630343534322e706e67)

接下来我们需要将提前写好的静态页面，对应拆分到组件当中

注意：

1. class 需要改成 className
2. style 的值需要使用双花括号的形式
3. `img` 标签，一定要**添加** `alt` 属性表示图片加载失败时的提示。
4. `a` 标签要添加 `rel="noreferrer"`属性，不然会有大量的警告出现

### 2.axios 发送请求

> 在实现静态组件之后，我们需要通过向 `github` 发送请求，来获取相应的用户信息
>
> 但是由于短时间内多次请求，可能会导致请求不返回结果等情况发生，因此我们采用了一个事先搭建好的本地服务器
>
> 我们启动服务器，向这个地址发送请求即可

![image-20210828071053508](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f6c6a63696d672e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f696d672f696d6167652d32303231303832383037313035333530382e706e67)

我们首先要获取到用户点击搜索按钮后**输入框中的值**，在对应的 `input` 标签中，添加 `ref` 属性

```jsx
<input ref={(c) => (this.keyWordElement = c)} type="text" placeholder="输入关键词点击搜索" />
```

我们可以通过 `this.keyWordElement` 属性来获取到这个`input`节点，再通过 value 可获取当前 input 得到值

这里采用的是连续的解构赋值，最后将 `value` 改为 `keyWord` ，这样好辨别

```js
const {
  keyWordElement: { value: keyWord },
} = this;
```

获取到了 `keyWord` 值，接下来我们就需要发送请求了

```jsx
axios.get(`http://localhost:3000/api1/search/users?q=${keyWord}`).then(
  (response) => {
    this.props.updateAppState({ isLoading: false, users: response.data.items });
  },
  (error) => {
    this.props.updateAppState({ isLoading: false, err: error.message });
  }
);
```

这里会存在跨域的问题，因我我们是站在 3000 端口向 5000 端口发送请求的

因此我们需要配置代理来解决跨域的问题，我们需要在请求地址前，加上启用代理的标志 `/api1`

```js
// setupProxy.js
const proxy = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    proxy("/api1", {
      target: "http://localhost:5000",
      changeOrigin: true,
      pathRewrite: {
        "^/api1": "",
      },
    })
  );
};
```

这样我们请求就能成功获取数据啦

![image-20210828072705747](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f6c6a63696d672e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f696d672f696d6167652d32303231303832383037323730353734372e706e67)

### 3.渲染数据

> 获取数据后需要对数据分析渲染页面上
>
> 我们的数据当前存在于 `Search` 组件当中，我们需要在 `List` 组件中使用，所以我们需要向 `Search` 组件传递一个函数，来实现子向父传递数据，再通过 `App` 组件，向`List` 组件传递数据即可得到 `data`
>
> 然后我们通过 `map` 遍历整个返回的数据

```jsx
users.map((userObj) => {
  return (
    <div key={userObj.id} className="card">
      <a rel="noreferrer" href={userObj.html_url} target="_blank">
        <img alt="avatar" src={userObj.avatar_url} style={{ width: "100px" }} />
      </a>
      <p className="card-text">{userObj.login}</p>
    </div>
  );
});
```

### 4.增加交互

> 我们应该增加点交互，比如
>
> - 加载时的 loading 效果
> - 第一次进入页面时 List 组件中的**欢迎使用字样**
> - 在报错时应该提示错误信息
>
> 但是这些预示着我们不能单纯的将用户数据直接渲染，我们需要添加一些状态判断，什么时候该渲染数据，什么时候渲染 loading，什么时候渲染 err
>
> - 采用 `isFrist` 来判断页面是否第一次启动，初始值给 `true`，点击搜索后改为 `false`
> - 采用 `isLoading` 来判断是否应该显示 Loading 动画，初始值给 `false`，在点击搜索后改为 `true`，在拿到数据后改为 `false`
> - 采用 `err` 来判断是否渲染错误信息，当报错时填入报错信息，初始值**给空**

```js
state = { users: [], isFirst: true, isLoading: false, err: "" };
```

同时在 App 组件给 List 组件传递数据时，我们可以采用解构赋值的方式，这样可以减少代码量

```jsx
// App.jsx
// 接收一个状态对象
updateAppState = (stateObj) => {
    this.setState(stateObj)
}
<Search updateAppState={this.updateAppState} />
<List {...this.state} />
```

我们需要在 Search 组件的不同请求过程更改状态

```jsx
// Search/index.jsx
search = () => {
  //获取用户的输入(连续解构赋值+重命名)
  const {
    keyWordElement: { value: keyWord },
  } = this;
  //发送请求前通知App更新状态
  this.props.updateAppState({ isFirst: false, isLoading: true });
  //发送网络请求
  axios.get(`/api1/search/users?q=${keyWord}`).then(
    (response) => {
      //请求成功后通知App更新状态
      this.props.updateAppState({ isLoading: false, users: response.data.items });
    },
    (error) => {
      //请求失败后通知App更新状态
      this.props.updateAppState({ isLoading: false, err: error.message });
    }
  );
};
```

这样我们只需要在 List 组件中，判断这些状态的值，来显示即可

```jsx
// List/index.jsx
const { users, isFirst, isLoading, err } = this.props
// 判断
{
    isFirst ? <h2>欢迎使用，输入关键字，点击搜索</h2> :
    isLoading ? <h2>Loading...</h2> :
    err ? <h2 style={{ color: 'red' }}>{err}</h2> :
    users.map((userObj) => {
        return (
          	.....
        )
    })
}
```

我们需要先判断是否第一次，再判断是不是正在加载，再判断有没有报错，最后再渲染数据

我们的状态更新是在 Search 组件中实现的，在点击搜索之后数据返回之前，我们需要将 `isFirst` 改为 `false` ，`isLoading` 改为 `true`，接收到数据后我们再将 `isLoading` 改为 `false` 即可

### 5.使用消息发布订阅

> 在上面案例中，我们使用`axios` 发送请求来获取数据，同时我们需要将数据从 `Search` 中传入给 `App`，再由 `App` 组件再将数据传递给 `List` 组件，这个过程会显得繁琐
>
> 我们可以不可以尝试把获取的数据直接发送给`List`组件呢，接下来我们来使用消息订阅发布来解决**兄弟组件间的通信**
>
> **消息订阅和发布的机制**，就如我们订阅报纸，送报员送报给你
>
> 代码层面，我们订阅了 A 消息，有人发布了 A 消息，我们就可以拿到 A 消息了。

首先安装 `pubsub-js`

```shell
yarn add pubsub-js
```

引入`pubsub-js`

```jsx
import PubSub from "pubsub-js";
```

订阅消息

我们通过 `subscribe` 来订阅消息，它接收两个参数，第一个参数是消息的名称，第二个是消息成功的回调，第二个回调中也接受两个参数，一个是消息名称，一个是返回的数据

```jsx
PubSub.subscribe("search", (msg, data) => {
  console.log(msg, data);
});
```

发布消息

我们采用 `publish` 来发布消息

```jsx
PubSub.publish("search", { name: "yunmu", age: 18 });
```

知道了这些我们就可以完善之前 Github 案例了

将数据的更新通过 `publish` 来传递，例如在发送请求之前，我们需要出现 loading 字样

```jsx
// 之前的写法
this.props.updateAppState({ isFirst: false, isLoading: true });
// 改为发布订阅方式
PubSub.publish("search", { isFirst: false, isLoading: true });
```

这样我们就能成功的在请求之前发送消息，我们只需要在 List 组件中订阅一下这个消息即可，并将返回的数据用于更新状态即可

```js
this.token = PubSub.subscribe("search", (msg, stateObj) => {
  this.setState(stateObj);
});
```

同时上面的代码会返回一个 `token` ，这个就类似于定时器的编号的存在，我们可以通过这个 `token` 值，来取消对应的订阅

在`componentWillUnmount`中通过 `unsubscribe` 来取消指定的订阅

```jsx
componentWillUnmount(){
    PubSub.unsubscribe(this.token)
}
```

### 6.使用 Fetch 发送网络请求

> fetch 也是一种发送请求的方式，它是在 xhr 之外的一种
>
> #### 文档
>
> 1. https://github.github.io/fetch/
> 2. https://segmentfault.com/a/1190000003810652
>
> 我们平常用的 Jquery 和 axios 都是封装了 xhr 的第三方库
>
> 而 fetch 是官方自带的库，同时它也采用的是 Promise 的方式，大大简化了写法，但是老版本浏览器可能不支持

使用：

```js
fetch("http://xxx")
  .then((response) => response.json())
  .then((json) => console.log(json))
  .catch((err) => console.log("Request Failed", err));
```

它的使用方法和 axios 非常的类似，都是返回 Promise 对象

不同的是， fetch 关注分离，它在第一次请求时，不会直接返回数据，会先返回联系服务器的状态，在第二步中才能够获取到数据

我们需要在第一次 `then` 中返回 `response.json()` 因为这个是包含数据的 promise 对象，再调用一次 `then` 方法即可实现

但是这么多次的调用 `then` 并不是我们所期望的

我们可以利用 `async` 和 `await` 配合使用，来简化代码

可以将 `await` 理解成一个自动执行的 `then` 方法，这样清晰多了

```jsx
async function getJSON() {
  let url = "https://xxx";
  try {
    let response = await fetch(url);
    return await reasponse.json();
  } catch (error) {
    console.log("Request Failed", error);
  }
}
```
