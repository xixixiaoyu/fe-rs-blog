# Vuex 使用及原理

## 1.概念

> 在 Vue 中实现集中式状态（数据）管理的一个 Vue 插件，对 vue 应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。
>
> 什么是状态管理
>
> 开发对于应用程序的各种数据如何保存，我们称之为状态管理

## 2.何时使用

- 多个组件共享数据时

![image-20220116133804723](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220116133804723.png)

## 3.搭建 vuex 环境

### 1.安装 Vuex

`npm install vuex@next `

### 2.创建文件参加传入配置项

创建文件：`src/store/index.js`

```js
import { createStore } from "vuex"; //引入Vuex

//创建并暴露store
export default createStore({
  state: {},
  //准备mutations对象——修改state中的数据
  mutations: {},
  //准备actions对象——响应组件中用户的动作
  actions: {},
  //准备state对象——保存具体的数据
  modules: {},
});
```

### 3.在`main.js`中使用 store

```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");
```

### 4.使用须知

每一个 Vuex 应用的核心就是 store（仓库）

store 本质上是一个容器，它包含着你的应用中大部分的状态（state），状态存储是响应式的

若 store 中的状态发生变化，那么对应的组件依赖的 store 的状态也会被更新

## 4.基本使用

### options API 使用 Vuex

1.dispatch 方法，派发给 action 一个叫 change 的方法

```js
methods: {
    handleClick() {
      //dispatch 和 actions 做关联
      this.$store.dispatch("change", "hello world");
    }
  }
```

2.action 里面的 change 方法感知并执行将方法提交给 mutations

```js
actions: {
    change(store, str) {
        setTimeout(() => {
            // commit 和 mutation 做关联
            store.commit("change", str)
        }, 2000)
    }
}
```

3.mutation 感知到提交的 change 改变，执行 change 方法改变数据

```js
state() {
    return {
        name: “yunmu",
    };
},
mutations: {
    // mutation 里面只允许写同步代码，不允许写异步代码
    // 这是因为devtool工具会记录mutation的前一状态和后一状态的快照的日记
    // 但是在mutation中执行异步操作，就无法追踪到数据的变化
    change(state, payload) {
        state.name = payload;
    }
},
```

组件中读取 vuex 中的数据：`$store.state.name`

组件中修改 vuex 中的数据：`$store.dispatch('action中的方法名',数据)` 或 `$store.commit('mutations中的方法名',数据)`

> 备注：若没有网络请求或其他业务逻辑，组件中也可以越过 actions，即不写`dispatch`，直接编写`commit`

Action 通常是异步的，那么如何知道 action 什么时候结束呢?

我们可以让 action 返回 Promise

```js
// store
getHomedata(context) {
    return new Promise((resolve, reject) => {
        axios
            .get("http://123.207.32.32:8000/home/multidata")
            .then((res) => {
            context.commit("addBannerData", res.data.data.banner.list);
            resolve({ name: "coderwhy", age: 18 });
        })
            .catch((err) => {
            reject(err);
        });
    });
},


setup() {
    const store = useStore();

    onMounted(() => {
      // store.dispatch返回对应action里的promise
      const promise = store.dispatch("getHomeMultidata");
      promise
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
```

### Composition API 使用 Vuex

```html
<script>
  import { useStore } from "vuex";
  export default {
    setup() {
      const store = useStore();
      const handleClick = () => {
        store.dispatch("change", "hello world");
        //store.commit("change", "hello world");
      };
    },
  };
</script>
```

## 5.getters 的使用

1.概念：当 state 中的数据需要经过加工后再使用时，可以使用 getters 加工。

2.在`store.js`中追加`getters`配置

```js
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      name: "yunmu"
      books: [
        { name: "深入Vuejs", price: 200, count: 3 },
        { name: "深入Webpack", price: 240, count: 5 },
        { name: "深入React", price: 130, count: 1 },
        { name: "深入Node", price: 220, count: 2 },
      ],
    };
  },
  getters: {
    totalPrice(state, getters) {
      let totalPrice = 0;
      for (const book of state.books) {
        totalPrice += book.count * book.price;
      }
      return totalPrice + getters.myName;
    },
    myName(state) {
      return state.name
    },
  },
});

export default store;
```

3.组件中读取数据：`$store.getters.totalPrice`

注意：getters 中的函数本身可以返回函数，使用的时候调用函数即可

## 6.派发风格

action 和 mutation 都可以使用对象形式进行派发

```js
this.$store.commit({
  type: "increment",
  name: "yunmu",
  age: 18,
});

this.$store.dispatch({
  type: "increment",
  name: "yunmu",
  age: 18,
});
```

## 7.模块化+命名空间

目的：解决单一状态树过于臃肿的问题，让代码更好维护，让多种数据分类更加明确。

`store`

```js
const countAbout = {
  namespaced:true,//开启命名空间
  state:{...},
  mutations: { ... },
  actions: { ...
 	incrementAction({ commit, dispatch, state, rootState, getters,rootGetters}) {}
   },
  getters: {
    bigSum(state){
       return state.sum * 10
    }
    doubleHomeCounter(state, getters, rootState, rootGetters) {
        // 对根状态提交
        commit("increment", null, { root: true });
     }
  }
}

const personAbout = {
  namespaced:true,//开启命名空间
  state:{ ...,  },
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  modules: {
    countAbout,
    personAbout,
  },
});
```

开启命名空间后，组件中读取 state 数据：

```js
//方式一：自己直接读取
this.$store.state.personAbout.list;
//方式二：借助mapState读取：
...mapState("countAbout", ["sum", "school", "subject"]);
// 方式三：借助createNamespacedHelpers映射出该模块的mapState等
const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers("countAbout")
```

开启命名空间后，组件中读取 getters 数据：

```js
//方式一：自己直接读取
this.$store.getters["personAbout/firstPersonName"];
//方式二：借助mapGetters读取：
...mapGetters("countAbout", ["bigSum"]);
```

开启命名空间后，组件中调用 dispatch

```js
//方式一：自己直接dispatch
this.$store.dispatch("personAbout/addPersonWang", person);
//方式二：借助mapActions：
...mapActions("countAbout", { incrementOdd: "jiaOdd", incrementWait: "jiaWait" });
```

开启命名空间后，组件中调用 commit

```js
//方式一：自己直接commit
this.$store.commit("personAbout/ADD_PERSON", person);
//方式二：借助mapMutations：
...mapMutations("countAbout", { increment: "JIA", decrement: "JIAN" });
```

## 8.四个 map 方法的使用

1.**mapState 方法：**用于帮助我们映射`state`中的数据为计算属性

```js
// store
state() {
    return {
      counter: 100,
      name: "yunmu",
 }

computed: {
    //借助mapState生成计算属性：yunmu、age（对象写法）
      ...mapState({
          sCounter: (state) => state.counter,
          sName: (state) => state.name,
    	}),

    //借助mapState生成计算属性：yunmu、age（数组写法）
    ...mapState(["counter", "name"]),
},
```

2.<strong>mapGetters 方法：</strong>用于帮助我们映射`getters`中的数据为计算属性

```js
// store
getters: {
    nameInfo(state) {
      return `name: ${state.name}`;
    },
    ageInfo(state) {
      return `age: ${state.age}`;
    },
}



computed: {
    //借助mapGetters生成计算属性：bigSum（对象写法）
  	...mapGetters({
       sNameInfo: "nameInfo",
       sAgeInfo: "ageInfo",
    }),

    //借助mapGetters生成计算属性：bigSum（数组写法）
    ...mapGetters(["nameInfo", "ageInfo"]),
},
```

3.**mapActions 方法：**用于帮助我们生成与`actions`对话的方法，即：包含`$store.dispatch(xxx)`的函数

```js
methods:{
    //靠mapActions生成：incrementOdd、incrementWait（对象形式）
    ...mapActions({incrementOdd: "jiaOdd",incrementWait: "jiaWait"})

    //靠mapActions生成：incrementOdd、incrementWait（数组形式）
        ...mapActions(["jiaOdd", "jiaWait"])
}

// setup里使用
import { mapActions } from "vuex";
setup() {
    const actions1 = mapActions(["incrementAction", "decrementAction"]);
    const actions2 = mapActions({
        add: "incrementAction",
        sub: "decrementAction",
    });

    return {
        ...actions1,
        ...actions2,
    };
},
```

4.**mapMutations 方法：**用于帮助我们生成与`mutations`对话的方法，即：包含`$store.commit(xxx)`的函数

```js
methods:{
    //靠mapActions生成：increment、decrement（对象形式）
    ...mapMutations({increment: "JIA",decrement: "JIAN"}),

    //靠mapMutations生成：JIA、JIAN（对象形式）
    ...mapMutations(["JIA", "JIAN"]),
}

// setup里使用
import { mapMutations } from "vuex";
setup() {
    const storeMutations1 = mapMutations(["increment", "decrement"]);
    const storeMutations2 = mapMutations({
          add: "increment",
        }),
    return {
        ...storeMutations1,
        ...storeMutations2,
    };
}
```

> 备注：mapActions 与 mapMutations 使用时，若需要传递参数需要：在模板中绑定事件时传递好参数，否则参数是事件对象。

setup 使用 map 的两个映射方法`mapState`和`mapGetters`需要封装才能使用

`hooks/useState.js`

```js
import { computed } from "vue";
import { mapState, useStore } from "vuex";

export function useState(mapper) {
  // 拿到store独享
  const store = useStore();

  // 获取到对应的对象的functions: {name: function, age: function}
  const storeStateFns = mapState(mapper);

  // 对数据进行转换
  const storeState = {};
  Object.keys(storeStateFns).forEach((fnKey) => {
    const fn = storeStateFns[fnKey].bind({ $store: store });
    storeState[fnKey] = computed(fn);
  });

  return storeState;
}
```

`hooks/useGetters`

```js
import { computed } from "vue";
import { mapGetters, useStore } from "vuex";

export function useGetters(mapper) {
  // 拿到store独享
  const store = useStore();

  // 获取到对应的对象的functions: {name: function, age: function}
  const storeStateFns = mapGetters(mapper);

  // 对数据进行转换
  const storeState = {};
  Object.keys(storeStateFns).forEach((fnKey) => {
    const fn = storeStateFns[fnKey].bind({ $store: store });
    storeState[fnKey] = computed(fn);
  });

  return storeState;
}
```

代码逻辑重复进行封装

`hooks/useMapper.js`

```js
import { computed } from "vue";
import { useStore } from "vuex";

export function useMapper(mapper, mapFn) {
  // 拿到store独享
  const store = useStore();

  // 获取到对应的对象的functions: {name: function, age: function}
  const storeStateFns = mapFn(mapper);

  // 对数据进行转换
  const storeState = {};
  Object.keys(storeStateFns).forEach((fnKey) => {
    const fn = storeStateFns[fnKey].bind({ $store: store });
    storeState[fnKey] = computed(fn);
  });

  return storeState;
}
```

`hooks/useState.js`

```js
import { mapState } from "vuex";
import { useMapper } from "./useMapper";

export function useState(mapper) {
  return useMapper(mapper, mapState);
}
```

`hooks/useGetters`

```js
import { mapGetters, createNamespacedHelpers } from "vuex";
import { useMapper } from "./useMapper";

export function useState(mapper) {
  return useMapper(mapper, mapGetters);
}
```

进一步对其完善支持模块化

`hooks/useState.js`

```js
import { mapState, createNamespacedHelpers } from "vuex";
import { useMapper } from "./useMapper";

export function useState(moduleName, mapper) {
  let mapperFn = mapState;
  if (typeof moduleName === "string" && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapState;
  } else {
    mapper = moduleName;
  }

  return useMapper(mapper, mapperFn);
}
```

`hooks/useGetters`

```js
import { mapGetters, createNamespacedHelpers } from "vuex";
import { useMapper } from "./useMapper";

export function useGetters(moduleName, mapper) {
  let mapperFn = mapGetters;
  if (typeof moduleName === "string" && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapGetters;
  } else {
    mapper = moduleName;
  }

  return useMapper(mapper, mapperFn);
}
```

## 9.Vuex 模拟实现

回顾基础示例，自己模拟实现一个 Vuex 实现同样的功能

```js
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    count: 0,
    msg: "Hello World",
  },
  getters: {
    reverseMsg(state) {
      return state.msg.split("").reverse().join("");
    },
  },
  mutations: {
    increate(state, payload) {
      state.count += payload.num;
    },
  },
  actions: {
    increate(context, payload) {
      setTimeout(() => {
        context.commit("increate", { num: 5 });
      }, 2000);
    },
  },
});
```

### 实现思路

- 实现 install 方法

  - Vuex 是 Vue 的一个插件，所以和模拟 VueRouter 类似，先实现 Vue 插件约定的 install 方 法

- 实现 Store 类
  - 实现构造函数，接收 options
  - state 的响应化处理
  - getter 的实现
  - commit、dispatch 方法

### 完整源码

Myvuex/index.js

```js
let _Vue = null;

class Store {
  constructor(options) {
    const { state = {}, getters = {}, mutations = {}, actions = {} } = options;
    this.state = _Vue.observable(state);
    this.getters = Object.create(null);
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](state),
      });
    });
    this._mutaions = mutations;
    this._actions = actions;
  }

  commit(type, payload) {
    this._mutaions[type](this.state, payload);
  }

  dispatch(type, payload) {
    this._actions[type](this, payload);
  }
}

function install(Vue) {
  _Vue = Vue;
  _Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        _Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default {
  Store,
  install,
};
```

将 store/index.js 中的 vuex 的导入替换成 myvuex

```js
import Vuex from "../myvuex";
// 注册插件
Vue.use(Vuex);
```

## 10.购物车案例

[Vue/vuex-cart-demo · 云牧/exampleCode - 码云 - 开源中国 (gitee.com)](https://gitee.com/z1725163126/example-code/tree/master/Vue/vuex-cart-demo)

#### 1. 模板

地址：https://github.com/goddlts/vuex-cart-demo-template.git

用到了 ElementUI、Vuex、Vue-Router

项目根目录下的 server.js 文件是一个 node 服务，为了模拟项目接口。

页面组件和路由已经完成了，我们需要使用 Vuex 完成数据的交互。

三个组件：

- 商品列表组件
- 购物车列表组件
- 我的购物车组件（弹出窗口）

#### 2. 商品列表组件

- 展示商品列表
- 添加购物车

#### 3. 我的购物车组件

- 购买商品列表
- 统计购物车中的商品数量和价格
- 购物车上的商品数量
- 删除按钮

#### 4. 购物车组件

- 展示购物车列表
- 全选功能
- 增减商品功能和统计当前商品的小计
- 删除商品
- 统计选中商品和价格

#### 5. Vuex 插件介绍

- Vuex 的插件就是一个函数
- 这个函数接受一个 store 参数

这个参数可以订阅一个函数，让这个函数在所有的 mutation 结束之后执行。

```js
const myPlugin = (store) => {
  // 当store初始化后调用
  store.subscribe((mutation, state) => {
    // 每次mutation之后调用
    // mutation的格式为{ type, payload }
  });
};
```

Store/index.js

```js
import Vue from "vue";
import Vuex from "vuex";
import products from "./modules/products";
import cart from "./modules/cart";
Vue.use(Vuex);

const myPlugin = (store) => {
  store.subscribe((mutation, state) => {
    if (mutation.type.startsWith("cart/")) {
      window.localStorage.setItem("cart-products", JSON.stringify(state.cart.cartProducts));
    }
  });
};

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    products,
    cart,
  },
  plugins: [myPlugin],
});
```
