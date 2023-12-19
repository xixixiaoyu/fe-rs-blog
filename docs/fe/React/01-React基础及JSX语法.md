## 一、React 简介



### 1. 关于 React

> 什么是 React ？

**React** 是一个用于构建用户界面的 JavaScript 库，它只负责应用的视图层，帮助开发人员构建快速且交互式的 web 应用程序。

- 是一个将数据渲染为 HTML 视图的开源 JS 库。
  - 发送请求获取数据
  - 处理数据(过滤、整理格式等)
  - 操作DOM呈现页面



> React 有什么特点？

1. 采用**组件化模式、声明式编码**，提高开发效率及组件复用率。
2. 在React Native中可以使用React语法进行**移动端开发**。
3. 使用**虚拟DOM**+优秀的**Diffing算法**，尽量减少与真实DOM的交互。



> React 的一些主要优点？

1. 它提高了应用的性能
2. 可以方便在客户端和服务器端使用
3. 由于使用 JSX，代码的可读性更好
4. 使用React，编写 UI 测试用例变得非常容易



### 2. Hello React

首先需要引入几个 react 包



创建虚拟DOM渲染

```jsx
<!-- 准备好一个“容器” -->
<div id="test"></div>

<!-- 引入react核心库 -->
<script type="text/javascript" src="../js/react.development.js"></script>
<!-- 引入react-dom，用于支持react操作DOM -->
<script type="text/javascript" src="../js/react-dom.development.js"></script>
<!-- 引入babel，用于将jsx转为js -->
<script type="text/javascript" src="../js/babel.min.js"></script>

<script type="text/babel" > /* 此处一定要写babel */
		//1.创建虚拟DOM
		const VDOM = <h1>Hello,React</h1> /* 此处一定不要写引号，因为不是字符串 */
		//2.渲染虚拟DOM到页面
		ReactDOM.render(VDOM, document.getElementById('test'))
</script>
```



### 3. 虚拟 DOM 和真实 DOM 的两种创建方法

#### 1.JS 创建虚拟 DOM

```js
//1.创建虚拟DOM
const VDOM = React.createElement(
    "h1",
    { id: "title" },
    React.createElement("span", {}, "Hello,React")
);
//2.渲染虚拟DOM到页面
ReactDOM.render(VDOM, document.getElementById("test"));
```



#### 2 Jsx 创建虚拟DOM

```jsx
//1.创建虚拟DOM
const VDOM = (
    <h1 id="title">
        <span>Hello,React</span>
    </h1>
);
//2.渲染虚拟DOM到页面
ReactDOM.render(VDOM, document.getElementById("test"));
```

js 的写法并不是常用的，常用jsx来写，毕竟JSX更符合书写的习惯



#### 3.关于虚拟DOM：

1. 本质是Object类型的对象（一般对象）
2. 虚拟DOM比较“轻”，真实DOM比较“重”，因为虚拟DOM是React内部在用，无需真实DOM上那么多的属性
3. 虚拟DOM最终会被React转化为真实DOM，呈现在页面上







## 二、jsx 语法

在 React 中使用 JSX 语法描述用户界面，它是一种 JavaScript 语法扩展，本质是 `React.createElement(component, props, ...children)方法的语法糖`

### 1.基础语法

#### 1.定义虚拟DOM时，不要写引号

#### 2.标签中混入JS表达式时要用{}

```jsx
const element = <img src={user.avatarUrl} />;
// 注意大括号外面不能加引号，JSX 会将引号当中的内容识别为字符串而不是表达式
const element = <h2 className="title" id={myId.toLowerCase()}></h2>
```

#### 3.只能有一个根标签，如果是单标签标签必须闭合

```jsx
const element = <img src={user.avatarUrl} />
const element = <input type="text"/>
```

#### 4.样式的类名指定不要用class，要用className

```jsx
const element = <img src={user.avatarUrl} className="rounded"/>;
```

#### 5.内联样式，要用双括号的形式去写

```jsx
const element = <span style={{ color: 'white', fontSize: '29px' }}></span>
```

#### 6.标签首字母

- 若小写字母开头，则将该标签转为html中同名元素，若html中无该标签对应的同名元素，则报错。
- 若大写字母开头，react就去渲染对应的组件，若组件没有定义，则报错。





### 2.在 JSX 中使用表达式

```js
const user = {
  firstName: 'Harper',
  lastName: 'Perez'
}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}
const element = <h1>Hello, {formatName(user)}!</h1>;
```



JSX 本身其实也是一种表达式，将它赋值给变量，当作参数传入，作为返回值都可以。

```js
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

> 注意区分【js语句(代码)】与【js表达式
>
> 1.表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方
> 下面这些都是表达式：
> 										(1). a
> 										(2). a+b
> 										(3). demo(1)
> 										(4). arr.map() 
> 										(5). function test () {}   test()
> 										(6). isLogin ? "欢迎回来~": "请先登录~"
> 					2.语句(代码)：
> 								下面这些都是语句(代码)：
> 										(1).if(){}
> 										(2).for(){}
> 										(3).switch(){case:xxxx}



### 3.注释

写在花括号里

```jsx
ReactDOM.render(
    <div>
        <h1>yunmu</h1>
        {/*注释...*/}
     </div>,
    document.getElementById('example')
);
```





### 4.JSX 自动展开数组

```jsx
const ary = [<p>哈哈</p>, <p>呵呵</p>, <p>嘿嘿</p>];
const element = (
	<div>{ary}</div>
);
// 解析后
/*
	<div>
		<p>哈哈</p>
		<p>呵呵</p>
		<p>嘿嘿</p>
	</div>
*/
```





### 5.jsx小练习

> 根据动态数据生成 `li`

```jsx
const data = ['Angular','React','Vue']  
//1.创建虚拟DOM
const VDOM = (
    <div>	
        <h1>前端js框架列表</h1>
        <ul>
            {
                data.map((item,index)=>{
                    return <li key={index}>{item}</li>
                })
            }
        </ul>
    </div>
)
//2.渲染虚拟DOM到页面
ReactDOM.render(VDOM,document.getElementById('test'))
```

