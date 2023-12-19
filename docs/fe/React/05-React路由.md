## 1.SPA

> 按照以往的开发模式，许多页面可能要写需要 HTML 文件，我们把这种称为 `MPA` 也叫多页面应用
>
> 反之我们还有另一种应用，叫做单页应用程序`SPA(single page application)`
>
> 1. 整个应用只有**一个完整的页面**
> 2. 点击页面中的链接**不会刷新**页面，只会做页面的**局部更新**
> 3. 数据都需要通过 ajax 请求获取, 并在前端异步展现。

## 2. 路由是什么？

> 一个路由就是一个映射关系(key:value)
>
> key 为路径, value 可能是`function`或`component`

后端路由：

- 理解： value 是 function, 用来处理客户端提交的请求。
- 注册路由： router.get(path, function(req, res))
- 工作过程：当 node 接收到一个请求时, 根据请求路径和方法找到匹配的路由, 调用路由中的函数来处理请求, 返回响应数据

前端路由：

- 浏览器端路由，value 是 component，用于展示页面内容
- 注册路由: `<Route path="/test" component={Test}>`
- 工作过程：当浏览器的 path 变为/test 时, 当前路由组件就会变为 Test 组件

React 路由`react-router-dom`

- react 常用的一个插件，专门给 web 人员使用的库用来实现一个 SPA 应用

## 3.相关 API

> 1. `<BrowserRouter>`
> 2. `<HashRouter>`
> 3. `<Route>`
> 4. `<Redirect>`
> 5. `<Link>`
> 6. `<NavLink>`
> 7. `<Switch>`

**其他**

1. history 对象
2. match 对象
3. withRouter 函数

## 4.基本使用

首先我们要明确好页面的布局 ，分好导航区、展示区

要引入 `react-router-dom` 库，暴露一些属性 `Link、BrowserRouter...`

```jsx
import { Link, BrowserRouter, Route } from "react-router-dom";
```

导航区的 a 标签改为 Link 标签

```jsx
<Link className="list-group-item" to="/about">
  About
</Link>
```

同时我们需要用 `Route` 标签，来进行路径的匹配，从而实现不同路径的组件切换

```jsx
<Route path="/about" component={About}></Route>
<Route path="/home" component={Home}></Route>
```

上面的两组路由需要添加对应的路由器才能工作

如果我们在 Link 和 Route 中分别用路由器管理，那这样是实现不了的

只有在一个路由器的管理下才能进行页面的跳转工作。

因此我们也可以在 `Link` 和 `Route` 标签的外层标签采用 `BrowserRouter` 包裹

最方便的做法是根目录 `index.js`文件中，将整个 App 组件标签采用 `BrowserRouter` 标签去包裹

```js
// index.js
<BrowserRouter>
  <App />
</BrowserRouter>
```

![react-router](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f6c6a63696d672e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f696d672f72656163742d726f757465722e676966)

## 5. 路由组件和一般组件

> 之前组件 Home 和组件 About 当成是一般组件来使用，我们将它们写在了 src 目录下的 components 文件夹下
>
> 但是我们又会发现它和普通的组件又有点不同
>
> 对于普通组件而言，我们在引入它们的时候我们是通过标签的形式来引用的
>
> 但是在上面我们可以看到，我们把它当作路由来引用时，我们是通过 `{Home}` 来引用的
>
> 所以组件实际分为**普通组件**和**路由组件**，之间的区别如下
>
> ```jsx
> 1.写法不同：
> 						一般组件：<Demo/>
> 						路由组件：<Route path="/demo" component={Demo}/>
> 2.存放位置不同：
> 						一般组件：components
> 						路由组件：pages
> 3.接收到的props不同：
> 						一般组件：写组件标签时传递了什么，就能收到什么
> 						路由组件：接收到三个固定的属性
> history:
>         go: ƒ go(n)
>         goBack: ƒ goBack()
>         goForward: ƒ goForward()
>         push: ƒ push(path, state)
>         replace: ƒ replace(path, state)
> location:
>         pathname: "/about"
>         search: ""
>         state: undefined
> match:
>         params: {}
>         path: "/about"
>         url: "/about"
> ```

## 6.NavLink 标签

> NavLink 标签是和 Link 标签作用相同的，但是它又比 Link 更加强大
>
> 在之前案例中点击并没有高亮效果
>
> 这时我们其实只需要对应设置 active 类名的样式即可
>
> 因为当我们选中某个 NavLink 标签时，就会自动给当前标签添加`active`
>
> 我们也可以通过`activeClassName="abc"`将激活时类名更改为 abc

## 7. NavLink 封装

> 上面的 NavLink 标签，我们需要重复书写`activeClassName`和样式名称，我们可以来封装下`NavLink` 减少冗余

首先我们需要新建一个 `MyNavLink` 组件，`return` 一个结构

```jsx
<NavLink activeClassName="abc" className="list-group-item" {...this.props} />
```

接下来我们在调用时，直接写

```jsx
<MyNavLink to="/home" chilren="About">
  home
</MyNavLink>
```

标签体内容是一个特殊的标签属性

通过`this.props.children`可以获取标签体内容，标签体显示可以通过标签属性`chilren="xxx"`

## 8.Switch

首先我们看一段这样的代码

```jsx
<Route path="/home" component={Home}></Route>
<Route path="/about" component={About}></Route>
<Route path="/about" component={About}></Route>
```

![image-20210903075753268](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f6c6a63696d672e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f696d672f696d6167652d32303231303930333037353735333236382e706e67)

这是两个路由组件，在 2，3 行中，我们同时使用了相同的路径 `/about`

我们发现它出现了两个 `about` 组件的内容

这是因为`Route` 的机制，当匹配上了第一个 `/about` 组件后，它还会继续向下匹配，因此会出现两个 About 组件，这时我们可以采用 `Switch` 组件进行包裹，匹配到对应组件停止匹配

Switch 可以提高路由匹配效率(单一匹配)，

```jsx
<Switch>
  <Route path="/home" component={Home}></Route>
  <Route path="/about" component={About}></Route>
  <Route path="/about" component={About}></Route>
</Switch>
```

在使用 `Switch` 时，我们需要先从 `react-router-dom` 中暴露出 `Switch` 组件

## 9.解决二级路由样式丢失的问题

> 当我们将路径改写成 `path="/yunmu/about"` 这样的形式时
>
> 我们会发现当我们强制刷新页面的时候，页面的 CSS 样式消失了
>
> 这是因为我们在引入样式文件时，采取的是相对路径
>
> 当我们使用二级路由的时候，会使得请求的路径发生改变，浏览器会向`localhost:3000/yunmu` 下请求 css 样式资源，
>
> 这并不是我们想要的，因为我们的样式存放于公共文件下的 CSS 文件夹中
>
> 解决方法有三种：
>
> 1. `public/index.html` 中 引入样式时不写 `./` 写 `/` （常用）
> 2. `public/index.html` 中 引入样式时不写 `./` 写 `%PUBLIC_URL%` （常用）
> 3. 使用 HashRouter

## 10. 路由的严格匹配和模糊匹配

> 路由的匹配有两种形式，一种是精准匹配一种是模糊匹配，React 中默认开启的是模糊匹配
>
> 模糊匹配要去【输入的路径】必须包含要【匹配的路径】，且顺序要一致
>
> 严格严格匹配【输入的路径】必须包含要【匹配的路径】一致
>
> 开启严格匹配：`<Route exact={true} path="/about" component={About}/>`
>
> 严格匹配不要随便开启，需要再开，有些时候开启会导致无法继续匹配二级路由

我们展示一个模糊匹配的例子

这个标签匹配的路由，我们可以拆分成 home a b

```jsx
<MyNavLink to="/home/a/b">Home</MyNavLink>
```

这个将会根据上面的先后顺序匹配路由，此时匹配的是 home，可以匹配成功

```jsx
<Route path="/home" component={Home} />
```

当匹配的路由改成下面这样时，就会失败。它会按照第一个来匹配，如果第一个没有匹配上，那就会失败，这里的 a 和 home 没有匹配上，很显然会失败

```jsx
<Route path="/a" component={Home} />
```

当我们开启了精准匹配后，就我们的第一种匹配就不会成功，因为精准匹配需要的是完全一样的值，开启精准匹配采用的是 `exact` 来实现

```jsx
Route exact={true}  path="/home" component={Home}/>
```

![image-20210320165340643](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/68747470733a2f2f692e6c6f6c692e6e65742f323032312f30332f32302f7145447a7857624e3742614c4743382e706e67)

## 11.重定向路由

> 我们有时会发现我们需要去点击一个按钮才去匹配组件
>
> 但我们想要页面一加载就默认匹配到一个组件（页面一加载就会去匹配路由）
>
> 这个时候我们就需要时候 Redirecrt 进行默认匹配实现此需求
>
> 一般写在所有路由注册的最下方，当所有路由都无法匹配时，跳转到 Redirect 指定的路由

```jsx
<Switch>
  <Route path="/about" component={About} />
  <Route path="/home" component={Home} />
  <Redirect to="/about" />
</Switch>
```

```jsx
import { Redirect } from "react-router-dom";

class Login extends Component {
  render() {
    if (this.state.isLogin) {
      return <Redirect to="/" />;
    }
  }
}
```

## 12.嵌套路由

> 我们需要在一个路由组件中添加两个组件，一个是头部，一个是内容区
>
> 我们将我们的嵌套内容写在相应的组件里面，这个是在 Home 组件的 return jsx 的 内容
>
> 注册子路由时要写上父路由的 path 值
>
> 路由的匹配是按照注册路由的顺序进行的，我们是在 Home 组件注册的，所以匹配时会先去找 Home 组件，因为时模糊匹配所以会匹配成功
>
> 在 Home 组件里面去匹配相应的路由，从而找到 /home/news 进行匹配，因此找到 News 组件，进行匹配渲染
>
> 如果开启精确匹配的话，第一步的 `/home/news` 匹配 `/home` 就会卡住不动，就不会往 Home 组件里面去渲染嵌套的内容了

```jsx
<div>
  <h2>Home组件内容</h2>
  <div>
    <ul className="nav nav-tabs">
      <li>
        <MyNavLink className="list-group-item" to="/home/news">
          News
        </MyNavLink>
      </li>
      <li>
        <MyNavLink className="list-group-item" to="/home/message">
          Message
        </MyNavLink>
      </li>
    </ul>
    {/* 注册路由 */}
    <Switch>
      <Route path="/home/news" component={News} />
      <Route path="/home/message" component={Message} />
    </Switch>
  </div>
</div>
```

在这里我们需要使用嵌套路由的方式，才能完成匹配

换一种方式书写嵌套路由

```jsx
function News(props) {
  return (
    <div>
      <div>
        <Link to={`${props.match.url}/company`}>公司新闻</Link>
        <Link to={`${props.match.url}/industry`}>行业新闻</Link>
      </div>
      <div>
        <Route path={`${props.match.path}/company`} component={CompanyNews} />
        <Route path={`${props.match.path}/industry`} component={IndustryNews} />
      </div>
    </div>
  );
}

function CompanyNews() {
  return <div>公司新闻</div>;
}
function IndustryNews() {
  return <div>行业新闻</div>;
}
```

## 13.向路由组件传递参数

### 1.params 参数

- 路由链接(携带参数)：`<Link to='/demo/test/tom/18'}>详情</Link>`
- 注册路由(声明接收)：`<Route path="/demo/test/:name/:age" component={Test}/>`
- 接收参数：`this.props.match.params`

![image-20220121232337937](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220121232337937.png)

![image-20220121232236567](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220121232236567.png)

### 2.search 参数

- 路由链接(携带参数)：`<Link to='/demo/test?name=tom&age=18'}>详情</Link>`
- 注册路由(无需声明，正常注册即可)：`<Route path="/demo/test" component={Test}/>`
- 接收参数：`this.props.location.search`
- 备注：获取到的 search 是 urlencoded 编码字符串，需要借助 querystring 解析

![image-20220121232512457](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220121232512457.png)

![image-20220121232550532](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220121232550532.png)

```jsx
import url from "url";
// 换一种方式解析search参数为对象
const { query } = url.parse(this.props.location.search, true);
```

### 3.state 参数

```jsx
- 路由链接(携带参数)：`<Link to={{pathname:'/demo/test',state:{name:'tom',age:18}}}>详情</Link>`
- 注册路由(无需声明，正常注册即可)：`<Route path="/demo/test" component={Test}/>`
- 接收参数：`this.props.location.state`
- 备注：刷新也可以保留住参数
```

![image-20220121232728649](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220121232728649.png)

![image-20220121232820839](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220121232820839.png)

## 14.React 路由跳转

### 1. push 与 replace 模式

> 默认情况下，开启的是 push 模式，当我们每次点击跳转时，都会向栈中压入一个新的地址，在点击返回时，可以返回到上一个打开的地址，
>
> 如果我们不需要返回上一个打开的地址，可以使用 replace 模式，这种模式与 push 模式不同，它不会保留上次记录，也就是替换了新的栈顶

我们只需要在需要开启的链接上加上 `replace` 即可

```jsx
Link replace to={{ pathname: '/home/message/detail', state: { id: msgObj.id, title: msgObj.title } }}>{msgObj.title}</Link>
```

## 15.编程式路由导航

> 我们可以采用绑定事件的方式实现路由的跳转，我们在按钮上绑定一个 `onClick` 事件，当事件触发时，我们执行一个回调 `replaceShow`
>
> 借助 this.prosp.history 对象上的 API 对操作路由跳转、前进、后退
>
> ​ -this.prosp.history.push(path, state)
>
> ​ -this.prosp.history.replace(path, state)
>
> ​ -this.prosp.history.goBack()
>
> ​ -this.prosp.history.goForward()
>
> ​ -this.prosp.history.go()

```jsx
replaceShow = (id, title) => {
  //replace跳转+携带params参数
  this.props.history.replace(`/home/message/detail/${id}/${title}`);

  //replace跳转+携带search参数
  this.props.history.replace(`/home/message/detail?id=${id}&title=${title}`);

  //replace跳转+携带state参数
  this.props.history.replace(`/home/message/detail`, { id, title });
};
// push同理
back = () => {
  this.props.history.goBack();
};

forward = () => {
  this.props.history.goForward();
};

go = () => {
  this.props.history.go(-2);
};
```

## 16.withRouter

> withRouter 可以加工一般组件，让一般组件具备路由组件所特有的 API，比如**history 对象**
>
> withRouter 的返回值是一个新组件

我们需要对哪个组件包装就在哪个组件下引入

```jsx
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Header extends Component {
  back = () => {
    this.props.history.goBack();
  };

  forward = () => {
    this.props.history.goForward();
  };

  go = () => {
    this.props.history.go(-2);
  };

  render() {
    console.log("Header组件收到的props是", this.props);
    return (
      <div className="page-header">
        <h2>React Router Demo</h2>
        <button onClick={this.back}>回退</button>&nbsp;
        <button onClick={this.forward}>前进</button>&nbsp;
        <button onClick={this.go}>go</button>
      </div>
    );
  }
}
//在最后导出对象时，用 withRouter 函数进行包装
export default withRouter(Header);
```

这样就能让一般组件获得路由组件所特有的 API

## 17.BrowserRouter 和 HashRouter 的区别

> 1.底层原理不一样：
>
> ​ BrowserRouter 使用的是 H5 的 history API，不兼容 IE9 及以下版本。
>
> ​ HashRouter 使用的是 URL 的哈希值。
>
> 2.path 表现形式不一样
>
> ​ BrowserRouter 的路径中没有#,例如：localhost:3000/demo/test
>
> ​ HashRouter 的路径包含#,例如：localhost:3000/#/demo/test
>
> 3.刷新后对路由 state 参数的影响
>
> ​ BrowserRouter 没有任何影响，因为 state 保存在 history 对象中。
>
> ​ HashRouter 刷新后会导致路由 state 参数的丢失！！！
>
> 4.备注：HashRouter 可以用于解决一些路径错误相关的问题。
