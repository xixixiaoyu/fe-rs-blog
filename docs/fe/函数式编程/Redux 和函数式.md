我们探讨些主流的**函数式状态管理解法**，它们分别是：

- **React** 状态管理中的“不可变数据”
- **Redux** 设计&实践中的函数式要素
   - 纯函数
   - 不可变值
   - 高阶函数&柯里化
   - 函数组合
- **RxJS** 对响应式编程与“盒子模式”的实践
   - 如何理解“响应式编程”
   - 如何把副作用放进“盒子”



## React 状态管理中的“不可变数据”
“不可变值/不可变数据”是 React 强烈推荐开发者遵循的一个原则。<br />state props 数据一旦被创建，就不能被修改，只能通过创建新的数据来实现更新。<br />在 React 中，如果不遵循不可变数据的原则，可能会导致一些不可预期的问题：
```jsx
import React, { useState } from 'react'

function MutableComponent() {
  const [items, setItems] = useState(['apple', 'banana', 'orange'])

  const handleRemove = (index) => {
    // 直接修改了原数组，违背了不可变原则
    items.splice(index, 1) 
    setItems(items)
  }

  return (
    <ul>
      {items.map((item, index) => (
      <li key={index}>
        {item}
        <button onClick={() => handleRemove(index)}>remove</button>
      </li>
    ))}
    </ul>
  )
}
```
上述代码，React 预期我们针对新的状态创建一个全新的数组，以此来确保新老数据的不可变性。<br />但是我们没有这样做，所以这段代码会导致组件无法正常更新。还会导致性能问题，使用可变数据，React 就需要对每个可变数据进行深度比较。<br />**为了避免这类问题出现，我们应该始终使用不可变数据。**<br />实现不可变数据的思路有很多，比如先对原始数组做一次拷贝：
```jsx
import React, { useState } from 'react'

function ImmutableComponent() {
  const [items, setItems] = useState(['apple', 'banana', 'cherry'])

  const handleRemove = (index) => {
    // 基于原始数组，创建一个新数组
    const newItems = [...items]  
    newItems.splice(index, 1) 
    setItems(newItems)
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item}
          <button onClick={() => handleRemove(index)}>remove</button>
        </li>
      ))}
    </ul>
  )
}
```
**上述代码，在 **setState **前后，新老状态相互独立、各有各的引用，这就是 React 所期待的“状态不可变”** 。<br />**这只是表象，为什么数据就一定要不可变！**

### 内核：“数据-视图”间高度确定的函数式映射关系
**React 组件是一个吃进数据、吐出 UI 的【纯函数】。**<br />**纯函数**意味着**确定性**，意味着严格的一对一映射关系，意味着**对于相同的数据输入，必须有相同的视图输出**。<br />在这个映射关系的支撑下，对于同一个函数（React 组件）、同一套入参（React 状态）来说，组件所计算出的视图内容必定是一致的。<br />也就是说，**在数据没有发生变化的情况下，React 是有权不去做【重计算】的**。<br />这也是我们可以借助Pure Component 和 React.memo() 等技术缓存 React 组件的根本原因。<br />React 之所以以“不可变数据”作为状态更新的核心原则，根源就在于它的**函数式内核**，在于它追求的是**数据（输入）和视图（输出）之间的高度确定的映射关系。**<br />如果数据可变（注意，“可变”指的是引用不变，但数据内容变了），就会导致数据和 UI 之间的映射关系不确定，从而使得 React 无法确定“有没有必要进行重计算”，最终导致渲染层面的异常。<br />也就是说，**React 组件的纯函数特性和不可变数据原则是相互支持、相互依赖的**。<br />它们的本质目的都是为了确保 React 的渲染过程高度确定、高度可预测，从而提高应用的性能和可维护性。

## Redux
和 React 一样，Redux 在前端社区中也扮演了一个推广函数式编程的重要角色。<br />来说说其中最核心的 5 个 buff：**纯函数、不可变数据、高阶函数、柯里化和函数组合**。

### 纯函数
在 Redux 中，所有的状态变化都是由纯函数（称为 reducer）来处理的，这些函数接收当前的状态（state）和一个 action 对象，返回一个新的状态：
```jsx
// 定义初始状态
const initialState = {
  count: 0,
};

// 定义 reducer 函数，接收当前状态和动作对象，返回新状态
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 }
    case "decrement":
      return { ...state, count: state.count - 1 }
    default:
      return state;
  }
}

// 创建 store，将 reducer 函数传入
const store = Redux.createStore(counterReducer)


// 分发动作对象，触发状态变化
store.dispatch({ type: "increment" })
store.dispatch({ type: "decrement" })
```
上述代码，counterReducer 函数就是一个 reducer。它接收当前 state 和一个 action 对象作为入参，返回一个新的 state 作为计算结果<br />Redux 的设计原则要求整个 reducer 的函数体**除了计算、啥也不干**，因此 reducer 是标准的纯函数。<br />由于纯函数要求我们保持外部数据的不可变性，这里我们在更新 count 属性时，使用了扩展运算符来拷贝当前状态。<br />这就又引出了我们喜闻乐见的“不可变数据”原则。<br />由此可见，纯函数和不可变数据真的是一对好基友，它们总是相互支持、相互成就的。

### 不可变数据
Redux 的不可变数据原则体现在它的 state 数据结构上。<br />Redux 要求我们在修改 state 时使用不可变数据——也就是创建一个新的 state 对象，而不是在原有的 state 上进行修改。

### 高阶函数&柯里化
在 Redux 中，高阶函数的应用非常广泛。比如在 Redux 中，中间件是一个函数，它【**嵌套地**】接收三个入参：store、next 和action。<br />其中，store 是 Redux 唯一的状态树，next 是一个函数，用于将当前 action 传递给下一个中间件或者传递给 reducer，而 action 则是当前需要处理的行为信息对象。<br />下面是一个简单的 Redux 中间件，用于在状态更新的前后输出两行 log：
```jsx
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('dispatching the action:', action)
  const result = next(action)
  console.log('dispatched and new state is', store.getState())
  return result
}

const store = createStore(reducer, applyMiddleware(loggerMiddleware))
```
我们定义了一个名为 loggerMiddleware 的中间件。<br />它接收一个 store 对象，返回一个结果函数 A，A 函数接收一个 next 函数，返回一个新的结果函数 B。<br />这个结果函数 B 会接收一个 action 对象，最终执行完整个中间件逻辑，并返回执行结果。<br />loggerMiddleware 是柯里化函数，通过柯里化，Redux 中间件可以将参数相同的多次调用转化为单次调用，提高了代码复用性和可维护性，也为“延迟执行”。

### 函数组合
以下是 Redux 中组合不同中间件的示例代码：
```jsx
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

const middleware = [thunk, logger, errorReport]

const store = createStore(
  reducer,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)
```
我们将 thunk、logger 和 errorReport 这三个中间件函数通过 compose 函数组合起来，并使用 applyMiddleware 函数将这些中间件函数应用到 Redux的 store 中。
