React 设计和实践中很大程度上受到了函数式思想的影响。

## 宏观设计：数据驱动视图
React 的核心特征是“**数据驱动视图**”<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1691814600392-08a22382-8ce0-4491-a0b3-13f618ca1397.png#averageHue=%23e5e5e5&clientId=u5fe07ff4-d064-4&from=paste&height=145&id=u853828f4&originHeight=290&originWidth=556&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48270&status=done&style=none&taskId=u53287a50-5222-4cde-8a5b-715d581b30d&title=&width=278)<br />这个表达式有很多的版本，一些版本会把入参里的 data 替换成 state。<br />本质都是说 **React 的视图会随着数据的变化而变化**。

### React 组件渲染的逻辑分层
写一个 React 组件：
```javascript
const App = () => {
  const [num, setNum] = useState(1)  

  return <span>{num}</span>
}
```
上述代码最终转换成了 React.createElement 调用产生虚拟 DOM**。**虚拟 DOM 仅仅是对真实 DOM 的一层描述而已。<br />要想把虚拟 DOM 转换为真实 DOM，我们需要调用的是 ReactDOM.render() 这个 API ：
```javascript
// 首先你的 HTML 里需要有一个 id 为 root 的元素
const rootElement = document.getElementById("root")

// 这个 API 调用会把 <App/> 组件挂载到 root 元素里
ReactDOM.render(<App />, rootElement)
```
在 React 组件的初始化渲染过程中，有以下两个关键的步骤：

- 结合 state 的初始值，计算 `<App />` 组件对应的**虚拟 DOM**
- 将虚拟 DOM 转化为**真实 DOM**

React 组件的更新过程，同样也是分两步走：

- 结合 state 的变化情况，计算出虚拟 DOM 的变化
- 将虚拟 DOM 转化为真实 DOM

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1691825299591-2bc68c58-9daa-4af4-bdf7-08d866ef99d8.png#averageHue=%23928e82&clientId=u1d71c7ea-77ce-4&from=paste&height=246&id=ucae33cf1&originHeight=492&originWidth=1286&originalType=binary&ratio=2&rotation=0&showTitle=false&size=105238&status=done&style=none&taskId=u3898dd58-a93a-48d5-ad68-fc9874855ed&title=&width=643)

- **计算层**：负责根据 state 的变化计算出虚拟 DOM 信息。这是一层较纯的计算逻辑。
- **副作用层**：根据计算层的结果，将变化应用到真实 DOM 上。这是一层绝对不纯的副作用逻辑。

在 UI = f(data) 这个公式中，数据是自变量，视图是因变量。<br />而**组件**作为 React 的核心工作单元，其作用正是**描述数据和视图之间的关系**。是公式中的 f() 函数。


## 组件设计：组件即函数
定义一个 React 组件，其实就是定义一个吃进 props、吐出 UI（其实是对 UI 的描述）
```javascript
function App(props) {
  return <h1>{props.name}</h1>
}
```
如果这个组件需要维护自身的状态、或者实现副作用等等，只需要按需引入不同的 Hooks：
```javascript
function App(props) {
  const [age, setAge] = useState(1)
  
  return (
    <>
      <h1> {props.name} age is {age}</h1>
      <button onClick={() => setAge(age+1)}>add age</button>
    </>
  );
}
```

## 如何函数式地抽象组件逻辑
直到 React-Hooks 的出现，才允许函数组件“**拥有了自己的状态**”：
```javascript
function App(props) {
  const [age, setAge] = useState(1)
  return (
    <>
      <h1> {props.name} age is {age}</h1>
      <button onClick={() => setAge(age+1)}>add age</button>
    </>
  );
}
```
上述代码，即便输入相同的 props，也不一定能得到相同的输出。这是因为函数内部还有另一个变量 state。<br />**真的没那么纯了吗？**<br />useState() 的状态管理逻辑其实是在 App() 函数之外。<br />因为函数执行是一次性的。如果 useState() 是在 App() 函数内部维护组件状态，状态必然不会得到保持。<br />现实是，不管 App 组件渲染多少次，useState()总是能“记住”组件最新的状态。<br />对于函数组件来说，state 本质上也是一种**外部数据**。函数组件能够消费 state，却并不真正拥有 state **。**<br />相当于把函数包裹在了一个具备 state 能力的“壳子”里：
```javascript
function Wrapper({state, setState}) {
  return <App state={state} setState={setState}/>
}
```
所以 state 本质上和 props、context 等数据一样，都可以视作是 App 组件的 **“外部数据”，也即** App() **函数的“入参”** 。<br />我们用 FunctionComponent 表示任意一个函数组件，函数组件与数据、UI 的关系可以概括如下：
```javascript
UI = FunctionComponent(props, context, state)
```
**对于同样的入参（也即固定的** props **、** context **、** state **），函数组件总是能给到相同的输出。因此，函数组件仍然可以被视作是一个“纯函数”。**<br />**所以 Hook 对函数能力的拓展，并不影响函数本身的性质。函数组件始终都是从数据到 UI 的映射，是一层很纯的东西**。<br />而以 useEffect、useState 为代表的 Hooks，则负责消化那些不纯的逻辑。比如状态的变化，比如网络请求、DOM 操作等副作用。<br />设计一个函数组件，我们关注点则就可以简化为“**哪些逻辑可以被抽象为纯函数，哪些逻辑可以被抽象为副作用**”<br />**React 背靠函数式思想，重构了组件的抽象方式，为我们创造了一种更加声明式的研发体验。**

## 如何函数式地实现代码重用
**组合大于继承的思想下，**经典的 React 设计模式包括但不限于：

- 高阶组件
- render props
- 容器组件/展示组件

“**设计模式”对于 React 来说，并不是一个必选项，而更像是一个“补丁”** 。


### 高阶组件（HOC）的函数式本质
**高阶组件是参数为组件，返回值为新组件的函数。**<br />**让人不免联想到高阶函数，指的就是接收函数作为入参，或者将函数作为出参返回的函数。**<br />高阶函数的主要效用在于**代码重用**，高阶组件也是如此。<br />**当我们使用函数组件构建应用程序时，高阶组件就是高阶函数。**<br />当我们需要同时用到多个高阶组件时，直接使用 compose 组合这些高阶组件：
```jsx
// 定义一个 NetWorkComponent，组合多个高阶组件的能力
const NetWorkComponent = compose(
  // 高阶组件 withError，用来提示错误
  withError,
  // 高阶组件 withLoading，用来提示 loading 态
  withLoading,
  // 高阶组件 withFetch，用来调后端接口
  withFetch
)(Component)

const App = () => {
  ...

  return (
    <NetWorkComponent
      // params 入参交给 withFetch 消化
      url={url}
      // error 入参交给 withError 消化
      error={error}  
      // isLoading 入参交给 withLoading 消化
      isLoading={isLoading}
    />
  )
}
```
高阶组件本质上也是函数。所以**无论组件的载体是类还是函数，React 的代码重用思路总是函数式的。**

### 高阶组件（HOC）的局限性
看看下面这个高阶组件，它被用来进行条件渲染：
```jsx
import React from 'react'

const withError = (Component) => (props) => {
  if (props.error) {
    return <div>Here is an Error ...</div>
  }

  return <Component {...props} />
}

export default withError
```
如果有一个错误，它就渲染一个错误信息。如果没有错误，它将渲染给定的组件。<br />尽管 hook 很多场景已经可以取代高阶组件，但在“条件渲染”这个场景下，使用高阶组件仍然不失为一个最恰当的选择。<br />毕竟，Hooks 能够 return 数据，却不能够 return 组件。<br />我们探讨其实并不是类似“条件渲染”这种场景，而是对【**状态相关的逻辑】** 的重用。<br />比如下面这个高阶组件：
```jsx
import React from "react"

// 创建一个 HOC, 用于处理网络请求任务
const withFetch = (Component) => {
    
  // 注意，处理类组件时，HOC 每次都会返回一个新的类
  class WithFetch extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        data: {},
      }
    }

    componentDidMount() {
      // 根据指定的 url 获取接口内容
      fetch(this.props.url)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ data })
        })
    }

    render() {
      // 将目标数据【注入】给 Component 组件
      return (
        <>
          <Component {...this.props} data={this.state.data} />
        </>
      )
    } 
  }
  
  // 这行完全是 debug 用的，由于高阶组件每次都会返回新的类，我们需要 displayName 帮我们记住被包装的目标组件是谁
  WithFetch.displayName = `WithFetch(${Component.name})`
  
  // 返回一个被包装过的、全新的类组件
  return WithFetch
};

export default withFetch
```
这个组件主要做了这么几件事：

- 它根据 this.props 中指定的 url，请求一个后端接口
- 将获取到的数据 (data) 以 state 的形式维护在高阶组件的内部
- 将高阶组件内部的 state.data 以 props 的形式传递给目标组件 Component

用一句话来概括这个过程：**高阶组件把状态【注入】到了目标** Component **里。**<br />使用的时候：
```jsx
const FetchCommentComponent = withFetch(Component)
```
随着应用复杂度的提升，上面 HOC 的局限性也会跟着显现。
#### 可读性问题
Component 仅仅具备“获取数据”这一个能力是不够的，产品经理希望你为它增加以下功能：

1. 在请求发起前后，处理对应的 Loading 态（对应 HOC withLoading）
2. 在请求失败的情况下，处理对应的 Error 态（对应 HOC withError）

在 compose的加持下，我们可以快速写出如下代码：
```jsx
// 定义一个 NetWorkComponent，组合多个高阶组件的能力
const NetWorkComponent = compose(
  // 高阶组件 withError，用来提示错误
  withError,
  // 高阶组件 withLoading，用来提示 loading 态
  withLoading,
  // 高阶组件 withFetch，用来调后端接口
  withFetch
)(Component)

const App = () => {
  // 省略前置逻辑...

  return (
    <NetWorkComponent
      // url 入参交给 withFetch 消化
      url={url}
      // error 入参交给 withError 消化
      error={error}  
      // isLoading 入参交给 withLoading 消化
      isLoading={isLoading}
    />
  )
}
```
**上面代码很理想，**参数名和 HOC 名严格对照，我们可以轻松地推导 props 和 HOC 之间的关系。<br />但很多时候，我们见到的代码是这样的：
```jsx
// 定义一个 NetWorkComponent，组合多个高阶组件的能力
const NetWorkComponent = compose(
  // 高阶组件 withError，用来提示错误
  withError,
  // 高阶组件 withLoading，用来提示 loading 态
  withLoading,
  // 高阶组件 withFetch，用来调后端接口
  withFetch
)(Component)

const App = () => {
  // 省略前置逻辑...

  return (
    <NetWorkComponent
      // url 入参交给 withFetch 消化
      url={url}
      // icon 入参是服务于谁的呢？
      icon={icon}
      // image 入参是服务于谁的呢？
      image={icon}
    />
  )
}
```
我们通过上面知道知道 url 是供 withFetch 消化的参数。<br />但是 icon参数和 image参数又是为谁服务的呢？是为另外两个 HOC 服务的，还是为 Component组件本身服务的？<br />所以 HOC 和被包装组件 Component 之间的关系是模糊的，而且被 HOC包装后，它会变成一个全新的组件，这就导致 HOC 层面的 bug 非常难以追溯，所以才会在每个 HOC 中标记 displayName。

#### 命名冲突问题
这个问题就比较好理解了。假设我在同一个 Component 里，想要复用两次 withFetch，代码该怎么写呢？
```jsx
const FetchForTwice = compose(
  withFetch,
  withFetch,
)(Component)

const App = () => {
  ...

  const userId = '10086'

  return (
    <FetchForTwice
      // 这个 url 用于获取用户的个人信息
      url={`https://api.xxx/profile/${userId}`}
      // 这个 url 用于获取用户的钱包信息
      url={`https://api.xxx/wallet/${userId}`}
    />
  );
};
```
上面代码，当出现两个同名的 props 时，后面那个（钱包接口 url）会把前面那个（个人信息接口 url）覆盖掉。<br />FetchForTwice 确实能够 fetch 两次接口，但这两次 fetch 动作是重复的，每次都只会去 fetch 用户的钱包信息而已。

### render props 的正反两面
render props 被认为是比 HOC 更加优雅的代码重用解法。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1691829664714-6443df2d-083a-446c-b616-497d9bc0b16b.png#averageHue=%231f1a19&clientId=u6821dc99-ba28-4&from=paste&height=477&id=udcc6fa7f&originHeight=1252&originWidth=1108&originalType=binary&ratio=2&rotation=0&showTitle=false&size=432012&status=done&style=none&taskId=u69a51fb4-8a2a-49c2-b91d-fe350ccb9c3&title=&width=422)<br />上面代码， 是通过 HOC 的 withFetch 简单改写出的 render props 版本。<br />上面的红色方框圈住的是“**数据的准备工作**”（充满副作用），下面的红色方框圈住的则是“**数据的渲染工作**”（纯函数）。<br />this.props.render() 可以是任意的一个函数组件：
```jsx
<FetchComponent
  render={(data) => <div>{data.length}</div>}
  />
```
**也就是说，从 render props 这个模式开始，我们已经初步地在实践“pure/impure 分离”的函数式思想。**<br />然而，render props 也存在问题，最典型的就是回调地狱。<br />但整体而言还是好用的。

## 【函数组件 + Hooks】实现代码重用
Hooks 是无法完全替代 HOC 和 render props 的，但大部分场景可替换。比如对【**状态相关的逻辑】** 的重用 **：**<br />以 HOC 话题下的 NetWorkComponent组件为例，使用 Hooks，我们可以将它重构成这样：
```jsx
const NewWorkComponent = () => {
  const { data, error, isLoading } = useFetch('xxx')  
  if(error) {
    // 处理错误态
  }
  if(isLoading) {
    // 处理 loading 态
  }
  return <Component data={data} />
}
```
由于不存在 props 覆盖的问题，对于需要分别调用两次接口的场景，只需要像这样调用两次 useFetch 就可以了：
```jsx
const NewWorkComponent = ({userId}) => {
  const {
    data: profileData, 
    error: profileError 
    isLoading: profileIsLoading
  } = useFetch('https://api.xxx/profile/${userId}')  
  const {
    data: walletData, 
    error: walletError 
    isLoading: walletIsLoading
  } = useFetch('https://api.xxx/wallet/${userId}')    

  // ...其它业务逻辑
    
  return <Component data={data} />
}
```
Hooks 能够帮我们在【**数据的准备工作**】和【**数据的渲染工作**】之间做一个更清晰的分离。<br />具体来说，在 render props 示例中，我们并不想关心组件之间如何嵌套，我们只关心我们在 render props 函数中会拿到什么样的值；<br />在 HOC 示例中，我们也并不想关心每个 HOC 是怎么实现的、每个组件参数和 HOC 的映射关系又是什么样的，我们只关心目标组件能不能拿到它想要的 props 。<br />但在【函数组件+Hooks】这种模式出现之前，尽管开发者“并不想关心”，却“不得不关心”。**因为这些模式都没有解决根本上的问题，那就是心智模型的问题。**

## 为什么【函数组件+Hooks】是更优解？
HOC 虽然能够实现代码重用，但**没有解决逻辑和视图耦合的问题。**<br />render props 是有进步意义的，因为它以 render 函数为界，将整个组件划分为了两部分：

- **数据的准备工作——也就是“逻辑”**
- **数据的渲染工作——也就是“视图”**

其中，“视图”表现为一个纯函数组件，这个纯函数组件是高度独立的。<br />尽管”视图“是高度独立的，“逻辑”却仍然耦合在组件的上下文（this）里。这种程度的解耦是暧昧的、不彻底的。<br />【函数组件 + Hooks】模式的出现，恰好就打破了这种暧昧的状态。**状态被视作函数的入参和出参**，它可以脱离于 this 而存在，状态管理逻辑可以从组件实例上剥离、被提升为公共层的一个函数，由此便彻底地实现逻辑和视图的解耦。

## 拓展：关注点分离——容器组件与展示组件
容器组件与展示组件也是非常经典的设计模式。这个模式有很多的别名，比如：

- 胖组件/瘦组件
- 有状态组件/无状态组件
- 聪明组件/傻瓜组件

这个模式的要义在于关注点分离，具体来说，先将组件逻辑分为两类：

- **数据的准备工作——也就是“逻辑”**
- **数据的渲染工作——也就是“视图”**

然后再把这两类逻辑分别塞进两类组件中：

- 容器组件：负责做**数据的准备和分发工作**
- 展示组件：负责做**数据的渲染工作**

这个模式强调的是容器组件和展示组件之间的父子关系：

- 容器组件是父组件，它在完成数据的准备工作后，会通过 props 将数据分发给作为子组件的展示组件。

由此，我们就能够实现组件的关注点分离，使组件的功能更加**内聚**，实现**逻辑与视图的分离（最终目标都是这）**。
