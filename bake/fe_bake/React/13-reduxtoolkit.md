# @reduxjs/toolkit



## 1.快速入门

> 简化Redux中样板代码流程代码的编写，对Redux进行的二次封装，使Redux的使用变得简单



1. 下载：

​					现有应用： `npm install @reduxjs/toolkit react-redux`
​					新建应用：`create-react-app react-redux-toolkit --template redux`

2. 创建Reducer、Action：

```jsx
// src/store/todos.js
import { createSlice } from "@reduxjs/toolkit";

export const TODOS_FEATURE_KEY = "todos";
const { reducer: TodosReducer, actions } = createSlice({
  name: TODOS_FEATURE_KEY,
  initialState: [],
  reducers: {
    addTodo(state, action) {
      state.push(action.payload);
    },
  },
});

export const { addTodo } = actions;
export default TodosReducer;

```



创建store：

```jsx
// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import TodosReducer, { TODOS_FEATURE_KEY } from "./todos";

export default configureStore({
  reducer: {
    [TODOS_FEATURE_KEY]: TodosReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
```

 

配置 Provider：

```jsx
// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```



组件应用状态：

```jsx
// src/Todos.js
import { addTodo, TODOS_FEATURE_KEY } from "./store/todos";
import { useDispatch, useSelector } from "react-redux";

function Todos() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state[TODOS_FEATURE_KEY]);
  return (
    <div>
      <button onClick={() => dispatch(addTodo({ title: "测试任务" }))}>添加任务</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
```



## 2.执行异步操作



### 2.1 方式一：

```jsx
// src/store/todos.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const TODOS_FEATURE_KEY = "todos";

// 创建执行异步操作的action
// payload触发action传递的参数  thunkAPI.dispatch调用action
export const loadTodos = createAsyncThunk("todos/loadTodos", (payload, thunkAPI) => {
  axios.get(payload).then((response) => thunkAPI.dispatch(setTodos(response.data)));
});

const { reducer: TodosReducer, actions } = createSlice({
  name: TODOS_FEATURE_KEY,
  initialState: [],
  reducers: {
    addTodo(state, action) {
      state.push(action.payload);
    },
    setTodos(state, action) {
      action.payload.forEach((todo) => state.push(todo));
    },
  },
});

export const { addTodo, setTodos } = actions;
export default TodosReducer;
```



```jsx
// src/Todos.js
import { addTodo, TODOS_FEATURE_KEY } from "./store/todos";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadTodos } from "./store/todos";

function Todos() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state[TODOS_FEATURE_KEY]);
  useEffect(() => {
    dispatch(loadTodos("https://jsonplaceholder.typicode.com/todos"));
  }, []);
  return (
    <div>
      <button onClick={() => dispatch(addTodo({ title: "测试任务" }))}>添加任务</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
```



### 2.2 方式二：

比较推荐

```jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const TODOS_FEATURE_KEY = "todos";

// 返回Promise
export const loadTodos = createAsyncThunk("todos/loadTodos", (payload) => {
  return axios.get(payload).then((response) => response.data);
});

const { reducer: TodosReducer, actions } = createSlice({
  name: TODOS_FEATURE_KEY,
  initialState: [],
  reducers: {
    addTodo(state, action) {
      state.push(action.payload);
    },
    setTodos(state, action) {
      action.payload.forEach((todo) => state.push(todo));
    },
  },
  extraReducers: {
    // 成功fulfilled时执行的操作  pending等待  rejected拒绝
    [loadTodos.fulfilled](state, action) {
      action.payload.forEach((todo) => state.push(todo));
    },
  },
});

export const { addTodo, setTodos } = actions;
export default TodosReducer;
```



## 3.配置中间件

```jsx
// src/store/index.js
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import TodosReducer, { TODOS_FEATURE_KEY } from "./todos";
// 需要yarn下载
import logger from "redux-logger";

export default configureStore({
  reducer: {
    [TODOS_FEATURE_KEY]: TodosReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: [...getDefaultMiddleware(), logger],
});
```



## 4.实体适配器

将状态放入实体适配器，实体适配器提供操作状态的各种方法，简化操作，提高性能

```jsx
// src/store/todos.js
import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";

export const TODOS_FEATURE_KEY = "todos";

export const loadTodos = createAsyncThunk("todos/loadTodos", (payload) => {
  return axios.get(payload).then((response) => response.data);
});

const todosAdapter = createEntityAdapter();

const { reducer: TodosReducer, actions } = createSlice({
  name: TODOS_FEATURE_KEY,
  initialState: todosAdapter.getInitialState(),
  reducers: {
    addTodo(state, action) {
      // state.push(action.payload);
      todosAdapter.addOne(state, action.payload);
    },
    setTodos(state, action) {
      // action.payload.forEach((todo) => state.push(todo));
      todosAdapter.addMany(state, action.payload);
    },
  },
  extraReducers: {
    [loadTodos.fulfilled](state, action) {
      // action.payload.forEach((todo) => state.push(todo));
      todosAdapter.addMany(state, action.payload);
    },
  },
});

export const { addTodo, setTodos } = actions;
export default TodosReducer;
```



```jsx
// src/Todos.js
import { addTodo, TODOS_FEATURE_KEY } from "./store/todos";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadTodos } from "./store/todos";

function Todos() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state[TODOS_FEATURE_KEY].entities);
  useEffect(() => {
    dispatch(loadTodos("https://jsonplaceholder.typicode.com/todos"));
  }, []);
  return (
    <div>
      <button onClick={() => dispatch(addTodo({ id: Math.random(), title: "测试任务" }))}>添加任务</button>
      <ul>
        {Object.values(todos).map((todo, index) => (
          <li key={index}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
```



## 5.状态选择器

主要目的就是简化组件中获取状态的代码：

```jsx
// src/store/todos.js
import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
...
...
const { selectAll } = todosAdapter.getSelectors();

export const selectTodosList = createSelector((state) => state[TODOS_FEATURE_KEY], selectAll);
```



```jsx
// src/Todos.js
import { addTodo, selectTodosList } from "./store/todos";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadTodos } from "./store/todos";

function Todos() {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodosList);
  useEffect(() => {
    dispatch(loadTodos("https://jsonplaceholder.typicode.com/todos"));
  }, []);
  return (
    <div>
      <button onClick={() => dispatch(addTodo({ id: Math.random(), title: "测试任务" }))}>添加任务</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
```

