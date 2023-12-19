# 1.Redux 核心

## 1.1. Redux 介绍

> JavaScript 状态容器，提供可预测化的状态管理

## 1.2.Redux 核心概念及流程

> View: 视图，HTML 页面
>
> Actions: 对象，描述对状态进行怎样的操作
>
> Reducers: 函数，操作状态并返回新的状态
>
> Store: 存储状态的容器，JavaScript 对象

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220209223924357.png" alt="image-20220209223924357" style="zoom:80%;" />

## 1.3.Redux 使用： 计数器案例

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redux</title>
  </head>
  <body>
    <button id="minus">-</button>
    <span id="count">0</span>
    <button id="plus">+</button>

    <script src="./redux.min.js"></script>
    <script>
      // 3. 存储默认状态
      const initialState = {
        count: 0,
      };

      // 2. 创建 reducer 函数
      function reducer(state = initialState, action) {
        switch (action.type) {
          case "increment":
            return { count: state.count + 1 };
          case "decrement":
            return { count: state.count - 1 };
          default:
            return state;
        }
      }

      // 1. 创建 store 对象
      const store = Redux.createStore(reducer);

      // 4. 定义 action
      const increment = { type: "increment" };
      const decrement = { type: "decrement" };

      // 5. 获取按钮 给按钮添加点击事件
      document.getElementById("minus").addEventListener("click", function () {
        // 6. 获取dispatch  触发 action
        store.dispatch(decrement);
      });
      document.getElementById("plus").addEventListener("click", function () {
        // 6. 获取dispatch  触发 action
        store.dispatch(increment);
      });

      // 获取store {dispatch: ƒ, subscribe: ƒ, getState: ƒ, replaceReducer: ƒ, Symbol(observable): ƒ}
      console.log(store);
      // 获取 store 中存储的状态 state
      console.log(store.getState());

      // 7.订阅数据的变化
      store.subscribe(() => {
        // console.log(store.getState());
        document.getElementById("count").innerHTML = store.getState().count;
      });
    </script>
  </body>
</html>
```

## 1.4 Redux 核心 API

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220210001447432.png" alt="image-20220210001447432" style="zoom: 67%;" />

# 2. React + Redux

## 2.1. 在 React 中不使用 Redux 时遇到的问题

> 在 React 中组件通信的数据流是单向的
>
> 顶层组件可以通过 Props 属性向下层组件传递数据，而下层组件不能向上层组件传递数据
>
> 要实现下层组件修改数据，需要上层组件传递修改数据的方法到下层组件
>
> 等项目越来越大的时候，组件间传递数据变得越来越困难

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220210172051254.png" alt="image-20220210172051254" style="zoom:50%;" />

## 2.2 在 React 项目中加入 Redux 的好处

> 使用 Redux 管理数据，由于 Store 独立于组件，使得数据管理独立于组件，解决了组件与组件之间传递数据困难的问题

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220210172117722.png" alt="image-20220210172117722" style="zoom:50%;" />

## 2.3 下载 Redux

```shell
npm install redux react-redux
```

## 2.4.Redux 工作流程

> 1. 组件通过 dispatch 方法触发 Action
> 2. Store 接受 Action 并将 Action 分发给 Reducer
> 3. Reducer 根据 Action 类型对状态进行更改并将更改后的状态返回给 Store
> 4. 组件订阅了 Store 中的状态， Store 中的状态更新会同步到组件

## 2.5 Redux 使用步骤

### 1.创建 store

```jsx
// src/store/index.js
import { createStore } from "redux";
import reducer from "./reducers/counter.reducer";
export const store = createStore(reducer);
```

在根组件中使用`store`：

```jsx
import React from "react";
import ReactDOM from "react-dom";
import Counter from "./components/Counter";
import { Provider } from "react-redux";
import { store } from "./store";
/**
 * react-redux
 * 	Provider
 * 	connect
 */

ReactDOM.render(
  // 通过 provider 组件，将store 放在了全局的组件可以够的到的地方
  <Provider store={store}>
    <Counter />
  </Provider>,
  document.getElementById("root")
);
```

### 2.创建 reducer

```jsx
// src/store/reducers/counter.reducer.js
import { DECREMENT, INCREMENT } from "../count/counter.const";

const initialState = {
  count: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case DECREMENT:
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

```jsx
// src/store/count/counter.const.js
export const INCREMENT = "increment";
export const DECREMENT = "decrement";
```

### 3 在组件中使用 connect 接受 store 里面的 state 和 dispatch

> `connect`方法接受两个参数，返回一个高阶组件
>
> `connect`方法的第一个参数是`mapStateToProps`方法，将 store 中的 state 传递到组件的`props`中
>
> `onnect`方法的第二个参数是`mapDispatchToProps`方法，将`store`中的`dispatch`传递到组件的`props`中
>
> `connect`方法可以帮我们订阅 store，当 store 中状态发生变更的时候，帮助我们重新渲染组件
>
> `connect`方法可以让我们获取`dispatch`方法

`apStateToProps`方法的参数是`state`，返回值是一个对象，会传递到组件中：

```jsx
const mapStateToProps = (state) => ({
  count: state.count,
  a: "a", // 这里怎么定义，组件中就可以或得到一个属性
});
```

`mapDispatchToProps`方法的参数是`dispatch`，返回值是一个对象，对象中的方法可以使用`dispatch`，这个对象中的方法会传递到组件中：

```jsx
const mapDispatchToProps = (dispatch) => ({
  increment() {
    dispatch({ type: "increment" });
  },
  decrement() {
    dispatch({ type: "decrement" });
  },
});
```

此外，我们还可以通过`redux`中的`bindActionCreators`来帮我们创建`action`函数:

```jsx
import { bindActionCreators } from "redux";

// bindActionCreators 会返回一个对象
const mapDispatchToProps = (dispatch) => ({
  // 解构
  ...bindActionCreators(
    {
      increment() {
        return { type: "increment" };
      },
      decrement() {
        return { type: "decrement" };
      },
    },
    dispatch
  ),
});
```

或者写成：

```jsx
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      increment() {
        return { type: "increment" };
      },
      decrement() {
        return { type: "decrement" };
      },
    },
    dispatch
  );
```

也可以将`bindActionCreators`的第一个参数进行抽离：

```jsx
import * as counterActions from "../store/actions/counter.actions";

const mapDispatchToProps = (dispatch) => bindActionCreators(conterActions, dispatch);
```

```jsx
// src/store/actions/counter.actions.js
import { DECREMENT, INCREMENT } from "../count/counter.const";

export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });
```

`connect`方法接受`mapStateToProps`和`mapDispatchToProps`，返回一个高阶组件，然后传入`Counter`组件进行导出：

```jsx
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

最终组件代码如下：

```jsx
// src/components/Counter.js
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as counterActions from "../store/actions/counter.actions";

function Counter({ count, increment, decrement }) {
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}

// 1. connect 会帮助我们去订阅 store，当store中的状态发生了变化后，可以帮我们重新渲染组件
// 2. connect 方法可以让我们获取 store 中的状态，将状态通过组建的props属性映射给组件
// 3. connect 方法可以让我们获取 dispatch 方法

const mapStateToProps = (state) => ({
  count: state.count,
  a: "a", // 这里怎么定义，组件中就可以或得到一个属性
});

const mapDispatchToProps = (dispatch) => bindActionCreators(counterActions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

### 4 为 action 传递参数

1. 传递参数

```jsx
<button onClick={() => increment(5)}> + 5</button>
```

2. 接受参数，传递`reducer`

```jsx
export const increment = (payload) => ({ type: INCREMENT, payload });
export const decrement = (payload) => ({ type: DECREMENT, payload });
```

3. `reducer`根据接受收到的数据进行处理

```jsx
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + action.payload };
    case DECREMENT:
      return { count: state.count - action.payload };
    default:
      return state;
  }
}
```

## 2.6.redux 实现弹出框案例

> store 中的状态越多，`reducer`中的`switch`分支就会越多，不利于维护，需要拆分`reducer`

```jsx
// src/store/actions/modal.action.js
import { HIDEMODAL, SHOWMODAL } from "../const/modal.const";

export const show = () => ({ type: SHOWMODAL });
export const hide = () => ({ type: HIDEMODAL });

// src/store/const/modal.const.js
export const SHOWMODAL = "showModal";
export const HIDEMODAL = "hideModal";
```

```jsx
// src/store/reducers/counter.reducer.js
import { DECREMENT, INCREMENT } from "../const/counter.const";

const initialState = {
  count: 0,
}
export default function counterReducer (state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + action.payload };
    case DECREMENT:
      return { ...state, count: state.count - action.payload };
    default:
      return state;
  }
}

// src/store/reducers/modal.reducer.js
import { HIDEMODAL, SHOWMODAL } from "../const/modal.const";
const initialState = {
  show: false
}
export default function modalReducer (state = initialState, action) {
  switch (action.type) {
    case SHOWMODAL:
      return { ...state, show: true };
    case HIDEMODAL:
      return { ...state, show: false };
    default:
      return state;
  }
}
```

```jsx
// src/store/reducers/root.reducer.js
import { combineReducers } from "redux";
import CounterReducer from "./counter.reducer";
import ModalReducer from "./modal.reducer";

// { counter: { count: 0 }, modal: { show: false } }
export default combineReducers({
  counter: CounterReducer,
  modal: ModalReducer,
});
```

创建`store`时传入的`reducer`则来自于我们刚才定义的`root.reducer.js`

```jsx
import { createStore } from "redux";
import RootReducer from "./reducers/root.reducer";

export const store = createStore(RootReducer);
```

```jsx
// src/components/Modal.js
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as modalActions from "../store/actions/modal.actions";

function Modal({ showStatus, show, hide }) {
  const styles = {
    display: showStatus ? "block" : "none",
    width: 200,
    height: 200,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
    backgroundColor: "skyblue",
  };
  return (
    <div>
      <button onClick={show}>显示</button>
      <button onClick={hide}>隐藏</button>
      <div style={styles}></div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  showStatus: state.show,
});
const mapDispatchToProps = (dispatch) => bindActionCreators(modalActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
```

# 3.Redux 中间件

## 3.1.什么是中间件

> 中间价允许我们扩展和增强 redux 应用程序

加入了中间件 Redux 工作流程：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220210172205528.png" alt="image-20220210172205528" style="zoom:50%;" />

## 3.2.开发 Redux 中间件

开发中间件的模板代码：

```jsx
export default (store) => (next) => (action) => {};
```

开发一个中间件：

```jsx
const logger = (store) => (next) => (action) => {
  console.log(store);
  console.log(action);
  next(action); // 千万别忘了调用 next(action)，不然整个流程则会卡在此处
};
export default logger;
```

中间件在开发完成以后只有被注册才能在 Redux 的工作流程中生效：

```jsx
// src/store/index.js
import { createStore, applyMiddleware } from "redux";
import logger from "./middlewares/logger";

createStore(reducer, applyMiddleware(logger));
```

如果注册多个中间件，中间件的执行顺序就是注册顺序：

```jsx
// 先执行logger中间件，再执行test中间件
createStore(reducer, applyMiddleware(logger, test));
```

## 3.3.Redux 开发中间件实例 thunk

> 当前 thunk 中间件函数不关心你想执行什么样的异步操作，只关心你执行的是不是异步操作
>
> 如果执行的是异步操作，触发 action 的时候传递函数，同步则传递对象
>
> 异步代码写在传递的函数里面，当我们调用此函数的时候还需将`dispatch`函数传递

```jsx
// src/store/middleware/thunk.js
import { DECREMENT, INCREMENT } from "../const/counter.const";

const thunk =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (typeof action === "function") {
      return action(dispatch); // action 方法内部会发起新的 dispatch
    }
    next(action);
  };
export default thunk;
```

在 action 文件中定义异步函数 action：

```jsx
// src/store/actions/counter.actions.js
import { INCREMENT, DECREMENT, INCREMENT_ASYNC } from "../const/counter.const";

export const increment = (payload) => ({ type: INCREMENT, payload });
export const decrement = (payload) => ({ type: DECREMENT, payload });

export const increment_async = (payload) => ({ type: INCREMENT_ASYNC, payload });
```

```jsx
// src/store/actions/modal.actions.js
import { HIDEMODAL, SHOWMODAL } from "../const/modal.const";

export const show = () => ({ type: SHOWMODAL });
export const hide = () => ({ type: HIDEMODAL });

export const show_async = () => (dispatch) => {
  setTimeout(() => {
    dispatch(show());
  }, 2000);
};
```

# 4.Redux 常用中间件

## 4.1.redux-thunk

下载 redux-thunk：

```jsx
npm install redux-thunk
```

引入 redux-thunk：

```jsx
import thunk from "redux-thunk";
```

注册 redux-thunk：

```jsx
import { applyMiddleware } from "redux";
createStore(rootReducer, applyMiddleware(thunk));
```

使用 redux-thunk：

```jsx
const loadPosts = () => async (dispatch) => {
  const posts = await axios.get("/api/posts").then((response) => response.data);
  dispatch({ type: LOADPOSTSSUCCE, payload: posts });
};
```

## 4.2 redux-saga

`redux-saga`可以将异步操作从`Action Creator`文件中抽离出来，放在一个单独的文件中。

下载 redux-saga：

```shell
npm install redux-saga
```

创建注册 redux-saga 中间件：

```jsx
import counterSaga from "./sagas/counter.saga";
// src/store/index.js
import createSagaMiddleware from "redux-saga";
// 创建SagaMiddleware
const sagaMiddleware = createSagaMiddleware();
createStore(reducer, applyMiddleware(sagaMiddleware));
// 启动Saga
sagaMiddleware.run(counterSaga);
```

使用 saga 接受 action 异步执行操作：

```jsx
// src/store/actions/counter.actions.js

// 给 saga 使用
export const increment_async = (payload) => ({ type: INCREMENT_ASYNC, payload });
```

```jsx
// src/store/sagas/counter.saga.js
import { takeEvery, put, delay } from "redux-saga/effects";
import { increment } from "../actions/counter.actions";
import { INCREMENT_ASYNC } from "../const/counter.const";

// takeEvery 接收 action
// put 触发 action

function* increment_async_fn(action) {
  yield delay(2000); // 此处会暂停2秒钟
  yield put(increment(action.payload));
}

export default function* counterSaga() {
  // 接收 action
  yield takeEvery(INCREMENT_ASYNC, increment_async_fn); // 第二个函数形参会接受一个 action 函数
}
```

合并 saga：

```jsx
// src/store/saga/modal.saga.js
import { takeEvery, put, delay } from "redux-saga/effects";
import { show } from "../actions/modal.actions";
import { SHOWMODAL_ASYNC } from "../const/modal.const";

// takeEvery 接收 action
// put 触发 action

function* showModal_async_fn() {
  yield delay(2000);
  yield put(show());
}

export default function* modalSaga() {
  // 接收 action
  yield takeEvery(SHOWMODAL_ASYNC, showModal_async_fn);
}
```

```jsx
// src/store/saga/root.saga.js
import { all } from "redux-saga/effects";
import counterSaga from "./counter.saga";
import modalSaga from "./modal.saga";

export default function* rootSaga() {
  yield all([counterSaga(), modalSaga()]);
}
```

store 入口文件中的 saga 中间件启动 root.saga：

```jsx
// src/store/index.js
import rootSaga from "./sagas/root.saga";

sagaMiddleware.run(rootSaga);
```

## 4.3.redux-actions

> redux 流程中大量的样板代码读写很痛苦，使用 redux-action 可以简化 Action 和 Reducer 的处理

redux-action 下载：

```jsx
npm install redux-actions
```

创建 Action：

```jsx
//src/store/actions/counter.actions.js
import { createAction } from "redux-actions";

const increment_action = createAction("increment");
const decrement_action = createAction("decrement");
```

创建 Reducer：

```jsx
// src/store/reducers/counter.reducer.js
import { handleActions as createReducer } from "redux-actions";
import { increment, decrement } from "../actions/counter.actions";
const initialState = {
  count: 0,
};
const handleIncrement = (state, action) => ({
  count: state.count + action.payload,
});

const handleDecrement = (state, action) => ({
  count: state.count - action.payload,
});

export default createReducer(
  {
    [increment]: handleIncrement,
    [decrement]: handleDecrement,
  },
  initialState
);
```

组件使用：

```jsx
// src/components/Counter.js
function Counter({ count, increment, decrement }) {
  return (
    <div>
      <button onClick={() => decrement(1)}>-</button>
      <span>{count}</span>
      <button onClick={() => increment(1)}>+</button>
    </div>
  );
}
```

redux-actions 也可以结合在 redux-saga 中使用

# 5.购物车案例

> [React/Redux/购物车 · 云牧/exampleCode - 码云 - 开源中国 (gitee.com)](https://gitee.com/z1725163126/example-code/tree/master/React/Redux/02-购物车)
