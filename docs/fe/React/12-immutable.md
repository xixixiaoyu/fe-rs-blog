# Immutable.js

> Redux要求全局状态具有不可变性
>
> React要求本地组件状态具有不可变性



## 1.数据突变与不可变



### 1.1 什么是数据突变

```js
const p1 = { name: "yunmu" }
const p2 = p1;
p2.name = "linduidui"
console.log(p2.name) // "linduidui"
console.log(p1.name) // "linduidui"
// 希望的效果当然是相互不影响啦
```

```js
const a = [4, 2, 3, 1]
const b = a.sort()
console.log(b) // [1, 2, 3, 4]
console.log(a) // [1, 2, 3, 4]
```

在JavaScript 中，对象属于引用数据类型，将一个对象赋值给另一个对象时，实际上是将对象的引用地址赋值给了另一个对象

此时两个变量同时指向了内存中的同一个对象，通过两个变量对对象进行的任何操作，都会影响另一方，这就是数据突变

由于数据突变带来的不可预测，非常容易导致改A坏B的问题



### 1.2  什么是数据的不可变

对引用类型的数据进行更改，更改并不会作用于原数据，而是返回一个更改后的全新的数据。

```js
const before = ["a", "b", "c", "d"]
const after = before.slice(0, 2)
console.log(after) // ["a", "b"]
console.log(before) // ["a", "b", "c", "d"]
```

可以把数据突变想象为"保存"，它会在原有数据上进行修改

可以把数据的不可变想象为"另存为"，它会返回全新的更改后的数据

由于数据的不可变，使数据操作更加安全，更加可预测



### 1.3 JavaScript的数据不可变

> 在JavaScript中，既提供了数据突变方法，又提供了数据不可变方法
>
> reverse、sort、splice、push、pop 、shift、unshift等就属于数据突变方法
>
> map、filter、reduce、slice等就属于数据不可变方法。
>
> JavaScript中的扩展运算符也可以比较方便的实现数据的不可变。

#### 1.3.1 添加

```js
const before = ["a", "b", "c", "d"]
const after = [...before, "e"]
console.log("after", after) // ['a', 'b', 'c', 'd', 'e']
console.log("before", before) // ['a', 'b', 'c', 'd']
```



#### 1.3.2 删除

```js
const before = ["a", "b", "c", "d"]
const after = [...before.slice(0, 2), ...before.slice(3)]
console.log("after", after) //  ['a', 'b', 'd']
console.log("before", before) // ['a', 'b', 'c', 'd']
```



#### 1.3.3 更新

```js
const before = ["a", "b", "c", "d"]
const after = [...before.slice(0, 1), "x", "y", ...before.slice(3)]
console.log("after", after) //  ['a', 'x', 'y', 'd']
console.log("before", before) // ['a', 'b', 'c', 'd']
```



### 1.4 不完整的数据不可变

> JavaScript 不具备完整的数据不可变性，因为它提供的那些具有数据不可变的方法都属于浅拷贝，对于引用数据类型嵌套的情况，内层数据仍然是引用地址的拷贝。

```js
const state = [{name: "super me"}]
const newState = state.slice(0)
newState[0].name = "李四"

console.log("newState:", newState) // newState:[{name: '李四'}]
console.log("state:", state)// // state:[{name: '李四'}]
```

以上问题可以通过深拷贝解决，但是深拷贝是有性能问题的

其一是每次深拷贝都要把整个对象递归的复制一份，递归的过程是消耗性能的

其二是在内存中多出了很多重复的相同的数据，内存占用

```js
const p1 = {name: "yunmu", skill: ["编程", "歌唱"]}
const p2 = deepClone(p1)
p2.name = "linduidui"
```

比如上例中将p1进行了深拷贝，p1和p2就变成了两个完全独立的对象

虽然解决了name属性值互不影响的问题，但同时在内存中也多出了一份完全相同的skill属性

理想状态应该是两个对象中name属性是独立的, skill属性是共享的

```js
const skill = ["编程", "歌唱"]
const p1 = {name: "yunmu", skill}
const p2 = {name: "linduidui", skill}
```





## 2.Immutable.js

> lmmutable.js中提供了不可变数据结构，主要解决两个问题，第一是防止数据突变，第二是提升数据操作性能
>
> - 防止数据突变
>   - lmmutable意为不可变数据，每次操作都会产生一个新的不可变数据，无论这个操作是增加，删除还是修改，都不会影响到原有的不可变数据。不可变数据可以防止数据突变带来的不可预测性
>
> - 提升数据操作性能
>   - 不可变数据采用了数据结构共享，返回的新的不可变数据中，发生变化的数据是独立的，其他没有发生变化的数据是共享的，数据结构共享解决了深拷贝带来的性能问题
>
> 下载: `npm install immutable@4.0.0-rc.12`
>
> 官网: https://immutable-js.github.io/immutable-js/





### 2.1 数据结构

> 在Immutable.js 中提供了多种数据结构用于实现不可变数据，常用的有两种，即 List和 Map
>
> List 对应 JavaScript 中的数组
>
> Map 对应 JavaScript 中的对象

```js
import { List, Map } from "immutable"
const l1 = new List(["a", b])
console.log(l1)
const m1 = new Map({ a: 1, b: 2 })
console.log(m1)
```





### 2.2 实例方法

 设置数据：

```js
import { List } from "immutable"
const l1 = new List(["a", b])
const l2 = li.set(0, "x")
console.log(l2) // List ["x", "b"]
console.log(l1) // List ["a", "b"]
```

```js
import { Map } from "immutable"

const m1 = new Map({a: 1, b: 2})
const m2 = m1.set("a", 100)
console.log(m2) // Map {a: 100, b: 2}
console.log(m1) // Map {a:1, b: 2}
```



获取数据：

```js
import { List } from "immutable"

const l1 = new List(["a", b])
console.log(l1.get(0)) // "a"
```

```js
import { Map } from "immutable"

const m1 = new Map({a: 1, b: 2})
console.log(m1.get("a")) // 1
```



合并数据：

```js
import { List } from "immutable"

const l1 = new List(["a", "b"])
const l2 = new List(["c", "d"])
const l3 = l1.merge(l2)
console.log(l3) // List ["a", "b", "c", "d"]
console.log(l1) // List ["a", "b"]
console.log(l2) // List ["c", "d"]
```

```js
import { Map } from "immutable"

const m1 = new Map({a: 1, b: 2})
const m2 = new Map({c: 3, d: 4})
const m3 = m1.merge(m2)
console.log(m3) // Map {a: 1, b: 2, c: 3, d: 4}
console.log(m1) // Map {a: 1, b: 2}
console.log(m2) // Map {c: 3, d: 4}
```



删除数据：

```js
import { List } from "immutable"

const l1 = new List(["a", "b"])
const l2 = l1.remove(0)
console.log(l2) // List ["b"]
console.log(l1) // List ["a", "b"]
```

```js
import { Map } from "immutable"

const m1 = new Map({a: 1, b: 2})
const m2 = m1.remove("a")
console.log(m2) // Map {b: 2}
console.log(m1) // Map {a: 1, b: 2}
```



更新数据：

```js
import { List } from "immutable"

const l1 = new List(["a", "b"])
const l2 = li.update(0, target => target + "Hello Yun")
console.log(l2) // List ["aHello Yun", "b"]
console.log(l1) // List ["a", "b"]
```

```js
import { Map } from "immutable"

const m1 = new Map({a: 1, b: 2})
const m2 = m1.update("b", target => target * 2)
console.log(m2) // Map {a: 1, b: 4}
console.log(m1) // Map {a: 1, b: 2}
```



数据类型转换：

> 使用`fromJS`方法将数组和对象转换为不可变数据，数组转为List，对象转为Map
>
> Map和List方法在创建数据时不支持深层嵌套，fromJS方法支持深层嵌套

不支持深层嵌套：

```js
import { Map } from "immutable"

const m1 = new Map({a: {b: {c: 1}}})
console.log(m1) // {"a": [object Object]}
```



```js
import { fromJS } from "immutable"

const f1 = fromJS({a: {b: {c: 1}}})
console.log(f1) // Map {"a": Map {b: Map {c: 1}}}
```



```js
import { fromJS } from "immutable"

const f1 = fromJS({a: {b: {c: 1}}})
// 修改嵌套数据调setIn方法
const f2 = setIn(["a", "b", "c"], 100)
console.log(f2) // Map {"a": Map {b: Map {c: 100}}}
console.log(f1) // Map {"a": Map {b: Map {c: 1}}}
```



数据比较：

> 使用 `is`  方法判断两个不可变数据是否相同

```js
import { fromJS, is } from "immutable"

const f1 = fromJS({a: {b: {c: 1}}})
const f2 = fromJS({a: {b: {c: 1}}})

console.log(is(f1, f2)) // true
```



## 3.Immutable.js && React



### 3.1 性能优化

> 在React 中，当调用setState方法更新数据时，即使传入的数据和以前的数据一样，React也会执行diff 的过程，因为JavaScript中对象与对象的比较采用的是引用地址，所以即使两个对象长的一样，其实也是不相等的，所以会走diff 的过程
>
> 为了解决这个问题, React提供了PureComponent，但是PureComponent 采用的是浅层比较，当数据结构比较复杂时，依然会存在无效的diff 操作
>
> immutable.js 提供了数据结构共享特性，能够快速进行差异比较，使组件更加智能的渲染

```jsx
import { fromJS, is } from "immutable";
import { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = {
      person: fromJS({
        name: "yunmu",
      }),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!is(this.state.person, nextState.person)) {
      return true;
    }
    return false;
  }

  render() {
    console.log("render...");
    return (
      <div>
        <p>{this.state.person.get("name")}</p>
        <button
          onClick={() =>
            this.setState({
              person: this.state.person.set("name", "linduidui"),
            })
          }
        >
          按钮
        </button>
      </div>
    );
  }
}
export default App;
```





### 3.2 防止数据突变

```jsx
import { fromJS, is } from "immutable";
import { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = {
      person: fromJS({
        name: "yunmu",
        age: 18,
      }),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!is(this.state.person, nextState.person)) {
      return true;
    }
    return false;
  }

  render() {
    console.log("render...");
    return (
      <div>
        <p>{this.state.person.get("name")}</p>
        <p>{this.state.person.get("age")}</p>
        <button
          onClick={() =>
            this.setState({
              person: this.state.person.set("name", "linduidui"),
            })
          }
        >
          按钮
        </button>
      </div>
    );
  }
}
export default App;
```



### 3.3 Immutable && Redux

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { fromJS } from "immutable";

const initialState = fromJS({ count: 0 });

function reducer(state = initialState, action) {
  let count = state.get("count");
  switch (action.type) {
    case "increment":
      return state.set("count", count + 1);
    case "decrement":
      return state.set("count", count - 1);
    default:
      return state;
  }
}

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```



```jsx
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.get("count"));
  return (
    <div>
      {count}
      <button onClick={() => dispatch({ type: "increment" })}>+1</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-1</button>
    </div>
  );
}
export default App;
```

