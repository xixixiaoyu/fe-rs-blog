## 1.React Hooks 介绍

### 1.1 React Hooks 是用来做什么的

> 对函数型组件进行增强，让函数型组件可以存储状态，可以拥有处理副作用的能力
>
> 让开发者在不使用类组件的情况下，实现相同的功能

### 1.2 类组件的不足

> - 缺少逻辑复用的机制
>
>   - 为了复用逻辑增加无实际渲染效果的组件，增加了组件层级，显示十分臃肿，增加了调试的难度以及运行效率的降低
>
> - 类组件经常会变得很复杂难以维护
>   - 将一组相干的业务逻辑拆分到了多个生命周期函数中，在一个生命周期函数内，存在多个不相干的业务逻辑
> - 类成员方法不能保证 this 指向的正确性

## 2.React Hooks 使用

> Hooks 意为钩子， React Hooks 就是一堆钩子函数
>
> React 通过这些钩子函数对函数型组件进行增强，不同的钩子函数提供了不同的功能
>
> 案例地址：[React/Hooks · 云牧/exampleCode - 码云 - 开源中国 (gitee.com)](https://gitee.com/z1725163126/example-code/tree/master/React/Hooks/hook)

### 2.1 useState()

用于为函数组件引入状态：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212120607735.png" alt="image-20220212120607735" style="zoom:50%;" />

使用细节：

> 1. 接收唯一的参数即状态初始值，初始值可以是任意数据类型
> 2. 返回值为数组，数组中存储状态值和更改状态值的方法，此方法名称约定以 set 开头，后面加上状态名称
> 3. 方法可以被调用多次，用以保存不同状态值
> 4. 设置初始值参数可以是函数， 函数返回什么，初始状态就是什么，函数只会被调用一次，用在初始值是动态值的情况

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212122429448.png" alt="image-20220212122429448" style="zoom:50%;" />

5. 设置状态值方法参数可以是一个值也可以是一个函数，此方法本身是异步的，如果代码依赖状态值，那要写在回调函数中，如果需要对 state 进行多次操作建议使用函数式

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212122950419.png" alt="image-20220212122950419" style="zoom: 50%;" />

6. setState(obj)，如果 obj 地址不变，那么 React 就认为数据没有变化，建议总是传递一个新对象更新

### 2.2 useReducer()

useReducer 是另一种让函数组件保存状态的方式，可以将 dispatch 传给子组件方便更改状态：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212124509253.png" alt="image-20220212124509253" style="zoom:50%;" />

useReducer 表单案例：[admiring-framework-4by2t - CodeSandbox](https://codesandbox.io/s/admiring-framework-4by2t)

useReducer 替代 Redux：[interesting-volhard-lfxpm - CodeSandbox](https://codesandbox.io/s/interesting-volhard-lfxpm?file=/src/index.js)

实现上面替代 Redux 代码模块化：[priceless-jennings-gyls6 - CodeSandbox](https://codesandbox.io/s/priceless-jennings-gyls6)

### 2.3 useContext()

在跨组件层级获取数据时简化获取数据的代码：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212134710124.png" alt="image-20220212134710124" style="zoom:50%;" />

### 2.4 useEffect()

> 让函数型组件拥有处理副作用的能力，类似生命周期函数
>
> 1. useEffect 执行机制
>
> 可以把 useEffect 看做 `componentDidMount`，` componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合
>
> ```js
> useEffect(() => {}); // 模拟componentDidMount, componentDidUpdate
> useEffect(() => {}, []); // 模拟componentDidMount
> useEffect(() => () => {}); // 模拟componentWillUnmount
> ```

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212135546242.png" alt="image-20220212135546242" style="zoom:50%;" />

2. useEffect 使用方法

做一个案例， 为 window 对象添加滚动事件，设置定时器让 count 数值每隔一秒增加 1：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212140306398.png" alt="image-20220212140306398" style="zoom:67%;" />

3. useEffect 解决的问题

- 按照用途将代码进行分类（将一组相同的业务逻辑归置到了同一个副作用函数中）
- 简化重复代码，是组件内部代码更加清晰

4. 只有指定数据发生变化时触发 effect

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212140803571.png" alt="image-20220212140803571" style="zoom:50%;" />

5. useEffect 钩子函数结合异步函数

useEffect 中的参数函数不能是异步函数，因为 useEffect 函数要返回清理资源的函数

如果是异步函数就变成了返回 Promise， 最好在里面写个自执行函数执行异步操作：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212141845301.png" alt="image-20220212141845301" style="zoom:50%;" />

注意：当 useEffect 依赖[]，返回的函数组件销毁会执行，等同于 WillUnMount，但是 useEffect 无依赖或者依赖[a, b]，组件更新的时候也会执行返回函数，即下一次执行 useEffEct 之前会执行，无论更新或者卸载

### 2.6 useLayoutEffect

> useEffect 在浏览器渲染完成之后执行
>
> useLayoutEffect 在浏览器渲染之前执行
>
> 所以 useLayoutEffect 总是比 useEffect 先执行
>
> useLayoutEffect 里面的任务最好是影响了布局视图，但如果无此操作，为了用户体验，优先使用 useEffect（优先渲染视图）

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213143535492.png" alt="image-20220213143535492" style="zoom:50%;" />

### 2.5 useMemo()

> useMemo 的行为类似 Vue 中的计算属性，可以检测某个值的变化，根据变化值计算新值
>
> useMemo 会缓存计算结果，如果监测值没有发生变化，即使组件重新渲染，也不会重新计算，此行为可以有助于避免在每个渲染上进行昂贵的计算

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212142651568.png" alt="image-20220212142651568" style="zoom:50%;" />

### 2.6 memo 方法

> 性能优化，如果本组件中的数据没有发生变化，阻止组件更新，类似类组件中的 `PureComponent` 和 `shouldComponentUpdate`

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212143417434.png" alt="image-20220212143417434" style="zoom:50%;" />

### 2.7 useCallback()

性能优化，缓存函数，使组件重新渲染时得到相同的函数实例：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212144149643.png" alt="image-20220212144149643" style="zoom:50%;" />

### 2.8 useRef()

获取 DOM 元素对象：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212144720488.png" alt="image-20220212144720488" style="zoom:50%;" />

useRef 也可用来保存数据（跨组件周期），即使组件重新渲染，保存的数据仍然还在，保存的数据被更改不会触发组件重新渲染

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212145413245.png" alt="image-20220212145413245" style="zoom:50%;" />

### 2.9 forwardRef

> 少部分时候我们希望 props 包含 ref，这时候就需要 forwardRef

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213145235002.png" alt="image-20220213145235002" style="zoom:50%;" />

## 3.自定义 Hook

> 自定义 Hook 是标准的封装和共享逻辑的方式
>
> 自定义 Hook 是一个函数，其名称以 use 开头
>
> 自定义 Hook 其实就是逻辑和内置 Hook 的组合

使用自定义 Hook

封装获取文章的 hook：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212150405505.png" alt="image-20220212150405505" style="zoom:50%;" />

封装更多：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213153512655.png" alt="image-20220213153512655" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213153820320.png" alt="image-20220213153820320" style="zoom:50%;" />

封装获取鼠标位置的 Hook：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212234422883.png" alt="image-20220212234422883" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212234922754.png" alt="image-20220212234922754" style="zoom:50%;" />

封装 input 公共属性 value 和 onChange 的 Hook：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212151305101.png" alt="image-20220212151305101" style="zoom:50%;" />

## 4.React 路由 Hooks

react-router-dom 路由提供的钩子函数详见这篇文章：[React Router 6 快速上手（二十三） - 掘金 (juejin.cn)](https://juejin.cn/post/7067551904137478180)

## 5.Hooks 使用规范和注意

使用规范：

- 只能用于 React 函数组件和自定义 Hook 中，其他地方不可以
- 只能用于顶层代码，不能在循环、判断中使用 Hooks，如果违反则无法保证对应 Hook 正确赋值

注意事项：

- useState 初始化值，只有第一次有效

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212235839795.png" alt="image-20220212235839795" style="zoom:50%;" />

- useEffect 内部谨慎修改 state

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213003700672.png" alt="image-20220213003700672" style="zoom:50%;" />

上面代码 setCount(count + 1)实际上形成了 Stale Closures（[过时闭包)](https://dmitripavlutin.com/react-hooks-stale-closures/)），建议同样可以将 useEffect 第二个参数数组加上 count 或者 setCount(count => count + 1) 使用函数

- useEffect 可能出现死循环

最后我想说我觉得 React Hooks 实际上有很多不符合直觉的设计，如果使用 Vue3 就会减少这种焦虑，即使他借鉴了 React

## 6.useState 钩子函数的实现原理

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212163956483.png" alt="image-20220212163956483" style="zoom:50%;" />

使用：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212164029760.png" alt="image-20220212164029760" style="zoom:50%;" />

## 7.useEffect 钩子函数的实现原理

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212164434461.png" alt="image-20220212164434461" style="zoom:50%;" />

使用：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212164503668.png" alt="image-20220212164503668" style="zoom: 67%;" />

## 8.useReducer 钩子函数的实现原理

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220212164943240.png" alt="image-20220212164943240" style="zoom:50%;" />

## 9.拓展（副作用 Side-effect）

### 8.1 什么是副作用

> 与药物的副作用类似: 减肥药(拉肚子)，头孢(过敏)，泰诺(头痛)
>
> 副作用与纯函数相反，指一个函数处理了与返回值无关的事情
>
> 输入参数一样，而输出结果不确定的情况就是副作用，比如我们发送请求，就不一定能得到相同返回
>
> 副作用不全是坏事，很多代码必须得借助副作用才能实现如 AJAX，修改 dom，甚至是 console log，副作用会给系统添加不可控的因素，但我们也不应该想方设法躲避副作用，更应该避免的是错误的代码逻辑和思维理念

### 8.2 纯函数( pure function )

- 给一个函数同样的参数，那么这个函数永远返回同样的值
- React 组件输入相同的参数(props)，渲染 UI 应该永远一样
