## 1.学习文档

1. 英文文档: https://redux.js.org/
2. 中文文档: http://www.redux.org.cn/
3. Github: https://github.com/reactjs/redux

## 2.redux 简介

### 1.redux 是什么

1. redux 是一个专门用于做**状态管理**的 JS 库(不是 react 插件库)
2. 它可以用在 react, angular, vue 等项目中, 但基本与 react 配合使用
3. 作用: 集中式管理 react 应用中多个组件**共享**的状态

### 2.什么情况下需要使用 redux

1. 某个组件的状态，需要让其他组件可以随时拿到（共享）
2. 一个组件需要改变另一个组件的状态（通信）
3. 总体原则：能不用就不用, 如果不用比较吃力才考虑使用

### 3.redux 工作流程

> 首先组件会在 Redux 中派发一个 `action` 方法
>
> 通过调用 `store.dispatch` 方法，将 `action` 对象派发给 `store`
>
> 当 `store` 接收到 `action` 对象时，会将先前的 `state` 与传来的 `action` 一同发送给 `reducer`
>
> reducer 在接收到数据后，进行数据的更改，返回一个新的状态给 `store`
>
> 最后由 `store` 更改 `state`

![image-20220122114250341](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220122114250341.png)

## 3.redux 的核心流程

### 1. store

> `store` 是 Redux 的核心
>
> 我们可以将任何我们想要存放的数据放在 `store` 中
>
> 在我们需要使用这些数据时，我们可以从中取出相应的数据
>
> 因此我们需要先创建一个 `store` ，在 Redux 中可以使用 `createStore` API 来创建一个 `store`

我们需要在 `src` 目录下的 `redux` 文件夹中新增一个 `store.js` 文件

```jsx
// store.js
//引入createStore，专门用于创建redux中最为核心的store对象
import { createStore } from "redux";
//引入为Count组件服务的reducer
import countReducer from "./count_reducer";
//暴露store对象
export default createStore(countReducer);
```

获取当前的 `store` 管理的状态，我们可以采用 `getStore` 方法

```jsx
const state = store.getState();
```

我们可以通过 `store` 中的 `dispatch` 方法来派生一个 `action` 对象给 `store`

```jsx
store.dispatch(`action对象`);
```

监听数据的更新，我们将 `subscribe` 方法绑定在组件挂载完毕生命周期函数上

但组件数量可能很多，我们可以将 `subscribe` 函数用来监听整个 `App`组件的变化，一旦发生改变重新渲染<App/>

```jsx
// index.js
store.subscribe(() => {
  ReactDOM.render(<App />, document.getElementById("root"));
});
```

### 2.action

> `action` 是 `store` 中唯一的数据来源
>
> 我们会通过调用 `store.dispatch` 将 action 传到 store
>
> 传递的 `action` 是一个对象，它必须要有一个 `type` 值

这里我们暴露了用于返回一个 `action` 对象的方法，我们调用它时，会返回一个 `action` 对象

```jsx
export const createIncrementAction = (data) => ({
  type: INCREMENT,
  data,
});
```

### 3.reducer

> reducer 的本质是一个函数，接收：preState,action，根据 action 返回加工后的状态 state
>
> reducer 有两个作用：初始化状态，加工状态
>
> reducer 被第一次调用时，是 store 自动触发的，传递的 preState 是 undefined，传递的 action 是:{type:'@@REDUX/INIT_a.2.b.4}

如下，我们对接收的 action 中传来的 type 进行判断，更改数据，返回新的状态

```jsx
// count_reducer
import { INCREMENT, DECREMENT } from "./constant";

const initState = 0; //初始化状态
export default function countReducer(preState = initState, action) {
  // console.log(preState);
  //从action对象中获取：type、data
  const { type, data } = action;
  //根据type决定如何加工数据
  switch (type) {
    case INCREMENT: //如果是加
      return preState + data;
    case DECREMENT: //若果是减
      return preState - data;
    default:
      return preState;
  }
}
```

### 4. 创建 constant 文件

正常编程中很有可能出现拼写错误的情况，为了尽可能减少

我们可以在 `redux` 目录下，创建一个 `constant` 文件用于定义需要用到的一些变量，在需要使用的地方引入即可

```jsx
export const INCREMENT = "increment";
export const DECREMENT = "decrement";
```

### 5. 实现异步 action

如果我们要实现一个异步更新数据，我们可以直接在异步任务结束后调用`dispatch`

```jsx
incrementAsync = () => {
  const { value } = this.selectNumber;
  setTimeout(() => {
    store.dispatch(createIncrementAction(value * 1));
  }, 500);
};
```

但我们如果延迟的动作不想交给组件自身，想交给 action

我们可以先尝试将它封装到 `action` 对象中调用，创建 action 的函数不再返回一般对象，而是一个函数，该函数中写异步任务

异步任务有结果后，分发一个同步的 action 去真正操作数据

异步 action 不是必须要用的,完全可以自己等待异步任务的结果了再去分发同步 action

```jsx
export const createIncrementAsyncAction = (data, time) => {
  // 无需引入 store ，在调用的时候是由 store 调用的
  return (dispatch) => {
    setTimeout(() => {
      dispatch(createIncrementAction(data));
    }, time);
  };
};
```

我们接下来引入 `redux-thunk` 中间件（需要`yarn add redux-thunk`）

```jsx
import { createStore, applyMiddleware } from "redux";
import countReducer from "./count_reducer";
//引入redux-thunk，用于支持异步action
import thunk from "redux-thunk";
//暴露store
export default createStore(countReducer, applyMiddleware(thunk));
```

调用的时候

```jsx
incrementAsync = () => {
  const { value } = this.selectNumber;
  store.dispatch(createIncrementAsyncAction(Number(value), 500));
};
```

### 6.Redux 三大原则

1. 整个 Redux 中，数据时单向数据流 `UI 组件 ---> action ---> store ---> reducer ---> store`

2. **state 只读**：在 Redux 中不能通过直接改变 state 控制状态的改变，如果想要改变 state ，则需要触发一次 action。通过 action 执行 reducer

3. **纯函数执行**：每一个 reducer 都是一个纯函数，不会有任何副作用，返回是一个新的 state，state 改变会触发 store 中的 subscribe

## 4.react-redux

### 1.容器组件和 UI 组件

1. 所有的 UI 组件都应该包裹一个容器组件，他们是父子关系
2. 容器组件是真正和 redux 打交道的，里面可以随意的使用 redux 的 api
3. UI 组件中不能使用任何 redux 的 api
4. 容器组件会传给 UI 组件 redux 中所保存的状态和用于操作状态的方法，均通过 props 传递。

![image-20220122152323173](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220122152323173.png)

在生产之中，我们一般将 UI 组件写在容器组件的代码文件当中

首先，我们在 src 目录下，创建一个 `containers` 文件夹，用于存放各种容器组件

要实现容器组件和 UI 组件的连接，我们需要通过 `connect` 来实现

```jsx
// 引入UI组件
import CountUI from "../../components/Count";
// 引入 connect 连接UI组件
import { connect } from "react-redux";
// 建立连接
export default connect()(CountUI);
```

### 2.Provider

> 由于我们的状态可能会被很多组件使用，无需自己给容器组件传递 store
>
> 所以 React-Redux 给我们提供了一个 Provider 组件
>
> 可以全局注入 redux 中的 store ，只需要把 Provider 注册在根部组件即可
>
> 使用了 react-redux 后也不用再自己检测 redux 中状态的改变了，容器组件可以自动完成这个工作。

当以下组件都需要使用 store 时，我们需要这么做

```jsx
<Count store={store}/>
{/* 示例 */}
<Demo1 store={store}/>
<Demo1 store={store}/>
<Demo1 store={store}/>
<Demo1 store={store}/>
<Demo1 store={store}/>
```

我们直接可以在根目录`index.js`中引入 `Provider`

直接用 `Provider` 标签包裹 `App` 组件，将 `store` 写在 `Provider` 中即可

这样我们在 `App.jsx` 文件中，组件无需手写指定 `store` ，即可使用 `store`

```jsx
import store from "./redux/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

### 3.connect

> UI 组件:不能使用任何 redux 的 api，只负责页面的呈现、交互等。
>
> 容器组件：负责和 redux 通信，将结果交给 UI 组件。
>
> connect(mapStateToProps,mapDispatchToProps)(UI 组件)
>
> mapStateToProps:映射状态，返回值是一个对象
>
> mapDispatchToProps:映射操作状态的方法，返回值是一个对象
>
> 容器组件中的 store 是靠 props 传进去的，而不是在容器组件中直接引入
>
> mapDispatchToProps，也可以是一个对象

#### mapStateToProps

1. mapStateToProps 函数返回的是一个对象
2. 返回的对象中的 key 就作为传递给 UI 组件 props 的 key,value 就作为传递给 UI 组件 props 的 value
3. mapStateToProps 用于传递状态

```jsx
const mapStateToProps = (state) => ({ count: state });
```

我们可以在 UI 组件中直接通过 props 来读取 `count` 值

```jsx
<h1>当前求和为：{this.props.count}</h1>
```

#### mapDispatchToProps

1. mapDispatchToProps 函数返回的是一个对象；
2. 返回的对象中的 key 就作为传递给 UI 组件 props 的 key,value 就作为传递给 UI 组件 props 的 value
3. mapDispatchToProps 用于传递操作状态的方法

```js
function mapDispatchToProps(dispatch){
	return {
		jian:number => dispatch(createDecrementAction(number))
	}
}
// 可简写为对象
{
    jian: createDecrementAction,
}
```

```jsx
// UI组件
decrement = () => {
  const { value } = this.selectNumber;
  this.props.jian(value * 1);
};
```

到这里为止我们创建 action，调用了函数，但是好像 `store` 并没有执行 `dispatch`

实际上`react-redux`已经帮我们做了优化

当调用 `actionCreator` 的时候，会立即发送 `action` 给 `store`而不用手动 dispatch 是自动的哦

### 4.完整流程

> 一个组件要和 redux“打交道”要经过哪几步？
>
> 1. 定义好 UI 组件---不暴露
>
> 2. 引入 connect 生成一个容器组件，并暴露，写法如下：
>
>    connect(
>
>    ​ state => ({key:value}), //映射状态
>
>    ​ {key:xxxxxAction} //映射操作状态的方法
>
>    ​ )(UI 组件)
>
> 3. 在 UI 组件中通过 this.props.xxxxxxx 读取和操作状态

首先我们在 `containers` 文件夹中，直接编写我们的容器组件，无需编写 UI 组件

```jsx
import React, { Component } from "react";
//引入action
import {
  createIncrementAction,
  createDecrementAction,
  createIncrementAsyncAction,
} from "../../redux/actions/count";
//引入connect用于连接UI组件与redux
import { connect } from "react-redux";

//定义UI组件
class Count extends Component {
  state = { carName: "奔驰c63" };

  //加法
  increment = () => {
    const { value } = this.selectNumber;
    this.props.jia(value * 1);
  };
  //减法
  decrement = () => {
    const { value } = this.selectNumber;
    this.props.jian(value * 1);
  };
  //奇数再加
  incrementIfOdd = () => {
    const { value } = this.selectNumber;
    if (this.props.count % 2 !== 0) {
      this.props.jia(value * 1);
    }
  };
  //异步加
  incrementAsync = () => {
    const { value } = this.selectNumber;
    this.props.jiaAsync(value * 1, 500);
  };

  render() {
    //console.log('UI组件接收到的props是',this.props);
    return (
      <div>
        <h2>我是Count组件,下方组件总人数为:{this.props.renshu}</h2>
        <h4>当前求和为：{this.props.count}</h4>
        <select ref={(c) => (this.selectNumber = c)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        &nbsp;
        <button onClick={this.increment}>+</button>&nbsp;
        <button onClick={this.decrement}>-</button>&nbsp;
        <button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
        <button onClick={this.incrementAsync}>异步加</button>&nbsp;
      </div>
    );
  }
}

//使用connect()()创建并暴露一个Count的容器组件
export default connect(
  (state) => ({
    count: state.he,
    renshu: state.rens.length,
  }),
  // mapDispatchToProps的一般写法
  /* dispatch => ({
		jia:number => dispatch(createIncrementAction(number)),
		jian:number => dispatch(createDecrementAction(number)),
		jiaAsync:(number,time) => dispatch(createIncrementAsyncAction(number,time)),
	}) */
  //mapDispatchToProps的简写
  {
    jia: createIncrementAction,
    jian: createDecrementAction,
    jiaAsync: createIncrementAsyncAction,
  }
)(Count);
```

```jsx
// redux/actions/count
import { INCREMENT, DECREMENT } from "../constant";
export const increment = (data) => ({ type: INCREMENT, data });
export const decrement = (data) => ({ type: DECREMENT, data });
export const incrementAsync = (data, time) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(increment(data));
    }, time);
  };
};
```

### 5.数据共享

> 1. 定义一个 Pserson 组件和 Count 组件通过 redux 共享数据
> 2. 为 Person 和 Count 组件编写 reducer、action，配置 constant 常量
> 3. Person 的 reducer 和 Count 的 Reducer 要使用 combineReducers 进行合并，合并后的总状态是一个对象！！！
> 4. 交给 store 的是总 reducer，最后注意在组件中取出状态的时候，记得“取到位”。

定义常量文件夹 `redux/constant.js`

```js
export const INCREMENT = "increment";
export const DECREMENT = "decrement";
export const ADD_PERSON = "add_person";
```

创建`Count`和`Peroson`组件的`action`和`reduer`

```js
// redux/actions/count.js
import { INCREMENT, DECREMENT } from "../constant";

//同步action，就是指action的值为Object类型的一般对象
export const increment = (data) => ({ type: INCREMENT, data });
export const decrement = (data) => ({ type: DECREMENT, data });

//异步action，就是指action的值为函数,异步action中一般都会调用同步action，异步action不是必须要用的。
export const incrementAsync = (data, time) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(increment(data));
    }, time);
  };
};

// redux/reducers/count.js
/* 
	1.该文件是用于创建一个为Count组件服务的reducer，reducer的本质就是一个函数
	2.reducer函数会接到两个参数，分别为：之前的状态(preState)，动作对象(action)
*/
import { INCREMENT, DECREMENT } from "../constant";

const initState = 0; //初始化状态
export default function countReducer(preState = initState, action) {
  // console.log('countReducer@#@#@#');
  //从action对象中获取：type、data
  const { type, data } = action;
  //根据type决定如何加工数据
  switch (type) {
    case INCREMENT: //如果是加
      return preState + data;
    case DECREMENT: //若果是减
      return preState - data;
    default:
      return preState;
  }
}
```

```js
// redux/actions/person.js
import { ADD_PERSON } from "../constant";
//创建增加一个人的action动作对象
export const addPerson = (personObj) => ({ type: ADD_PERSON, data: personObj });

// redux/reducers/person.js
import { ADD_PERSON } from "../constant";

//初始化人的列表
const initState = [{ id: "001", name: "tom", age: 18 }];
export default function personReducer(preState = initState, action) {
  const { type, data } = action;
  switch (type) {
    case ADD_PERSON: //若是添加一个人
      // preState.unshift(data) //此处不可以这样写，这样会导致preState被改写了，personReducer就不是纯函数了。
      return [data, ...preState];
    default:
      return preState;
  }
}
```

`reduers`中的`reducer`汇总到`reducers/index.js`

```jsx
//引入combineReducers，用于汇总多个reducer
import { combineReducers } from "redux";
//引入为Count组件服务的reducer
import count from "./count";
//引入为Person组件服务的reducer
import persons from "./person";

//汇总所有的reducer变为一个总的reducer
export default combineReducers({
  count,
  persons,
});
```

然后再`redux/stroe.js`合并 reducer

```js
//引入createStore，专门用于创建redux中最为核心的store对象
import { createStore, applyMiddleware, combineReducers } from "redux";
//引入为Count组件服务的reducer
//import countReducer from "./reducers/count";
//引入为Count组件服务的reducer
//import personReducer from "./reducers/person";
//引入redux-thunk，用于支持异步action
import thunk from "redux-thunk";
//引入汇总之后的reducer
import reducer from "./reducers";

//汇总所有的reducer变为一个总的reducer
// const allReducer = combineReducers({
//   he: countReducer,
//   rens: personReducer,
// });

//暴露store
export default createStore(reducer, applyMiddleware(thunk));
```

再`App.jsx`里引入对应的容器组件

```jsx
import React, { Component } from "react";
import Count from "./containers/Count"; //引入的Count的容器组件
import Person from "./containers/Person"; //引入的Person的容器组件

export default class App extends Component {
  render() {
    return (
      <div>
        <Count />
        <hr />
        <Person />
      </div>
    );
  }
}
```

根目录`index.js`注入 store

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";

ReactDOM.render(
  /* 此处需要用Provider包裹App，目的是让App所有的后代容器组件都能接收到store */
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

定义对应的容器组件

`containers/Count/index.jsx`

```jsx
import React, { Component } from "react";
//引入action
import { increment, decrement, incrementAsync } from "../../redux/actions/count";
//引入connect用于连接UI组件与redux
import { connect } from "react-redux";

//定义UI组件
class Count extends Component {
  state = { carName: "奔驰c63" };

  //加法
  increment = () => {
    const { value } = this.selectNumber;
    this.props.increment(value * 1);
  };
  //减法
  decrement = () => {
    const { value } = this.selectNumber;
    this.props.decrement(value * 1);
  };
  //奇数再加
  incrementIfOdd = () => {
    const { value } = this.selectNumber;
    if (this.props.count % 2 !== 0) {
      this.props.increment(value * 1);
    }
  };
  //异步加
  incrementAsync = () => {
    const { value } = this.selectNumber;
    this.props.incrementAsync(value * 1, 500);
  };

  render() {
    //console.log('UI组件接收到的props是',this.props);
    return (
      <div>
        <h2>我是Count组件,下方组件总人数为:{this.props.renshu}</h2>
        <h4>当前求和为：{this.props.count}</h4>
        <select ref={(c) => (this.selectNumber = c)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        &nbsp;
        <button onClick={this.increment}>+</button>&nbsp;
        <button onClick={this.decrement}>-</button>&nbsp;
        <button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
        <button onClick={this.incrementAsync}>异步加</button>&nbsp;
      </div>
    );
  }
}

//使用connect()()创建并暴露一个Count的容器组件
export default connect(
  (state) => ({
    count: state.count,
    personCount: state.persons.length,
  }),
  { increment, decrement, incrementAsync }
)(Count);
```

`containers/Person/index.jsx`

```jsx
import React, { Component } from "react";
import { nanoid } from "nanoid";
import { connect } from "react-redux";
import { addPerson } from "../../redux/actions/person";

class Person extends Component {
  addPerson = () => {
    const name = this.nameNode.value;
    const age = this.ageNode.value * 1;
    const personObj = { id: nanoid(), name, age };
    this.props.addPerson(personObj);
    this.nameNode.value = "";
    this.ageNode.value = "";
  };

  render() {
    return (
      <div>
        <h2>我是Person组件,上方组件求和为{this.props.count}</h2>
        <input ref={(c) => (this.nameNode = c)} type="text" placeholder="输入名字" />
        <input ref={(c) => (this.ageNode = c)} type="text" placeholder="输入年龄" />
        <button onClick={this.addPerson}>添加</button>
        <ul>
          {this.props.persons.map((p) => {
            return (
              <li key={p.id}>
                {p.name}--{p.age}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    persons: state.persons,
    count: state.count,
  }), //映射状态
  { addPerson } //映射操作状态的方法
)(Person);
```

### 6.react-redux 开发者工具的使用

> 1. `yarn add redux-devtools-extension`
> 2. store 中进行配置
>
> ```js
> import { composeWithDevTools } from "redux-devtools-extension";
> const store = createStore(allReducer, composeWithDevTools(applyMiddleware(thunk)));
> ```
