# Pinia

> 一个全新的用于 Vue 的状态管理库
>
> 下一个版本的 Vuex，也就是 Vuex 5.0
>
> Pinia 已经被纳入官方账户下了，github.com/vuejs/pinia
>
> [Pinia 官网链接](https://link.juejin.cn/?target=https%3A%2F%2Fpinia.esm.dev)

![image-20220125203303545](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125203303545.png)

## 1.介绍

Pinia 最初是一个实验，目的是在 2019 年 11 月左右重新设计 Vue 状态管理在 Composite APl 上的样子，也就是下一代 Vuex。

- 之前的 vuex 主要服务于 Vue 2，选项式 API
- 如果想要在 Vue 3 中使用 Vuex，需要使用它的版本 4
  - 只是一个过渡的选择，还有很大的缺陷
- 所以在 Vue3 伴随着组合式 API 诞生之后，也设计了全新的 Vuex: Pinia，也就是 Vuex 5

![image-20220125211018148](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220125211018148.png)

提案链接: https://github.com/vuejs/rfcs/pull/271

- Vue 2 和 Vue 3 都支持

  - 除了初始化安装和 SSR 配置之外，两者的 API 都是相同的
  - 官方文档中主要针对 Vue3 进行说明，必要的时候会提供 Vue2 的注释

- 支持 Vue DevTools
  - 跟踪 actions、mutations 的时间线
  - 在使用容器的组件中就可以观察到容器本身
  - 支持 time travel 更容易的调试功能
  - 在 Vue 2 中 Pinia 使用 Vuex 的现有接口，所以不能与 Vuex 一起使用
  - 但是针对 Vue 3 中的调试工具支持还不够完美，比如还没有 time-travel 调试功能
- 模块热更新
  - 无需重新加载页面即可修改您的容器。热更新的时候保持任何现有状态支持使用插件扩展 Pinia 功能
- 支持使用插件扩展 Pinia 功能
- 相比 Vuex 有更好完美的 TypeScript 支持支持
- 服务端渲染

## 2.核心概念

Pinia 从使用角度和之前的 Vuex 几乎是一样的

Store(如 Pinia)是一个保存状态和业务逻辑的实体，它不绑定到您的组件树。换句话说**，它承载全局 state**。它有点像一个始终存在的组件，每个人都可以读取和写入。它有三个核心概念。

### state

类似组件的`data`，用来存储全局状态

```js
{
    todos : [
        { id: 1，title: '吃饭'，done: fa1se },
        { id: 2，title: '睡觉', done: true },
        { id: 3，title: '打云牧', done: false }
    ]
}
```

### getters

- getters：类似组件的`computed`，根据已有的 state 封装派生数据，也有缓存特性

```js
doneCount() {
    return todos.filter(item => item.done).length
}
```

### actions

- actions：类似组件的`methods`，用来封装业务逻辑，同步异步都可以
  - VueX 需要同步使用 `mutations`，异步操作使用`actions`

注意：Pinia 中没有`mutations`

## 3.基本示例

```js
// store/counter.js
import { defineStore } from "pinia";

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useCounterStore = defineStore("counter"，{
  // state: 返回对象的函数
  state: ()=> {
      return { count: 0 }
  },
  actions: {
      increment() {
          // 在Vuex实现需要两步  1.定义mutations 2.提交mutations
          this.count++
      }
  }
});
```

组件里面使用

```vue
<template>
  <div>
    {{ store.count }}
  </div>
</template>
<script>
// 导入 Store， 使用自己的路径
import { useCounterStore } from "@/store/counter";
export default {
  setup() {
    // 调用函数 获得Store
    const counter = useCounterStore();

    counter.count++;
    // with autocompletion ✨
    counter.$patch({ count: counter.count + 1 });
    // or using an action instead
    counter.increment();

    return {
      counter,
    };
  },
};
</script>
```

您甚至可以使用函数（类似于组件`setup()`）为更高级的用例定义 Store：

```js
export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  function increment() {
    count.value++;
  }

  return { count, increment };
});
```

如果不熟悉`setup()`Composition API，别担心，Pania 也支持类似 [Vuex 的 map helpers](https://link.juejin.cn/?target=https%3A%2F%2Fvuex.vuejs.org%2Fguide%2Fstate.html%23the-mapstate-helper)。您以相同的方式定义 stores，使用`mapStores()`, `mapState()`, 或`mapActions()`：

```js
const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

const useUserStore = defineStore('user', {
  // ...
})

export default {
  computed: {
    // other computed properties
    // ...
    // gives access to this.counterStore and this.userStore
    ...mapStores(useCounterStore, useUserStore)
    // gives read access to this.count and this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // gives access to this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
}
```

## 4.Pinia vs Vuex

Pinia API 与 Vuex≤4 有很大不同，即:

- 没有`mutations` 。mutations 被认为是非常冗长的。最初带来了 devtools 集成，但这不再是问题。
- 不再有模块的嵌套结构。您仍然可以通过在另一个 store 中导入和使用 store 来隐式嵌套 store，但 Pinia 通过设计提供扁平结构，同时仍然支持 store 之间的交叉组合方式。您甚至可以拥有 store 的循环依赖关系。
- 更好 typescript 支持。无需创建自定义的复杂包装器来支持 TypeScript，所有内容都是类型化的，并且 API 的设计方式尽可能地利用 TS 类型推断。
- 不再需要注入、导入函数、调用它们，享受自动补全!
- 无需动态添加 stores，默认情况下它们都是动态的，您甚至不会注意到。请注意，您仍然可以随时手动使用 store 来注册它，但因为它是自动的，所以您无需担心。
- 没有命名空间模块。鉴于 store 的扁平架构，“命名空间" store 是其定义方式所固有的，您可以说所有 stores 都是命名空间的。

Pinia 就是更好的 Vuex，建议在你的项目中可以直接使用它了，尤其是使用了 TypeScript 的项目。

## 5.快速入门

### 5.1. 安装

安装需要 @next 因为 Pinia 2 处于 beta 阶段, Pinia 2 是对应 Vue3 的版本

```shell
yarn add pinia
# or with npm
npm install pinia
```

### 5.2. 初始化配置

创建一个 pinia（根存储）并将其传递给应用程序：

```js
import { createPinia } from "pinia";

app.use(createPinia());
```

### 5.3. 定义 State

创建 `src/store/index.ts`

```js
import { defineStore } from "pinia";

// 参数1：容器的ID， 必须唯一，将来 Pinia会把所有的容器挂载到跟容器
// 参数2：选项对象
// 返回值: 一个函数，调用得到容器实例
export const useMainStore = defineStore("main", {
  // id: 'main', // 此处也可定义id
  // 类似组件data，用来存储全局状态的
  // 1.必须是函数：为了在服务端渲染的时候避免交叉请求导致的数据状态污染
  // 2. 必须是箭头函数，为了更好的 TS 类型推导
  state: () => {
    return {
      count: 100,
      foo: "bar",
      arr: [1, 2, 3],
    };
  },
});
```

### 5.4. 获取 state

```vue
<template>
  <div>{{ mainStore.count }}</div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/store";

const mainStore = useMainStore();
</script>
```

结合 computed 获取

```js
const count = computed(() => mainStore.count);
```

state 也可以使用解构，但使用解构会使其失去响应式，这时候可以用 pinia 的 **storeToRefs**。

```js
import { storeToRefs } from "pinia";
const { count } = storeToRefs(mainStore);

const { count } = mainStore; // 错误的写法,会丢失数据响应式
```

### 5.5. 修改 state

方式一：最简单的方式

```js
mainStore.count++;
mainStore.foo = "yunmu";
```

方式二：如果要修改多个数据，建议`$patch`批量更新

```js
mainStore.$patch({
  count: mainStore.count + 1,
  foo: "yunmu",
  arr: [...mainStore.arr, 4],
});
```

方式三：更好的批量更新的方式 `$patch`一个函数

```js
mainStore.$patch((state) => {
  state.count++;
  state.foo = "yunmu";
  state.arr.push(4);
});
```

方式四： 逻辑比较多可以封装到`actions`处理

```js
mainStore.changeState(10);
```

```js
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main'， {
  state: () => {
    return {
      count: 100,
      foo: "bar",
      arr: [1,2,3]
    }
  },
  // 类似组件的 mthods, 封装业务逻辑，修改state
  actions: {
      // 不要使用箭头函数修改action,会导致this指向丢失，因为箭头函数绑定的是外部this
      changeState(num: number) {
          // 通过this可以访问state里面的数据进行修改
          this.count += num
          this.foo = "yunmu"
          this.arrr.push(4)
          // 同样也可以使用 this.$patch({}) 或 this.$patch(state => {})
      }
  }
})
```

### 5.6. Getters

```js
import { defineStore } from 'pinia'
import { otherState } from "@/store/otherState.js";

export const useMainStore = defineStore('main'， {
  state: () => {
    return {
      count: 100,
      foo: "bar",
      arr: [1,2,3]
    }
  },
  // 类似组件的 computed, 用来封装计算属性，有缓存的功能
  gettters: {
      // 函数接受一个可选参数 state 状态对象
      countPlus10(state) {
          console.log('countPlus调用了')
          return state.count + 10
      }
      // 如果getters 中使用了this不接受state参数，则必须手动指定返回值的类型，否则无法推导出来
       countPlus20(): number{
          return this.count + 10
      }

       // 获取其它 Getter， 直接通过 this
      countOtherPlus() {
          return this.countPlus20;
      }

      // 使用其它 Store
      otherStoreCount(state) {
          // 这里是其他的 Store，调用获取 Store，就和在 setup 中一样
          const otherStore = useOtherStore();
          return otherStore.count;
      },

  }
})
```

组件使用

```js
mainStore.countPlus10;
```

### 5.7. 异步 action

action 支持 async/await 的语法，轻松应付异步处理的场景。

```js
export const useUserStore = defineStore("user", {
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd);
      return data;
    },
  },
});
```

### 5.8. action 间相互调用

action 间的相互调用，直接用 this 访问即可。

```js
export const useUserStore = defineStore("user", {
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd);
      this.sendData(data); // 调用另一个 action 的方法
      return data;
    },
    sendData(data) {
      console.log(data);
    },
  },
});
```

在 action 里调用其他 store 里的 action 也比较简单，引入对应的 store 后即可访问其内部的方法了。

```js
// src/store/user.ts
import { useAppStore } from "./app";
export const useUserStore = defineStore("user", {
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd);
      const appStore = useAppStore();
      appStore.setData(data); // 调用 app store 里的 action 方法
      return data;
    },
  },
});
```

### 5.9. 数据持久化

插件 pinia-plugin-persist 可以辅助实现数据持久化功能。

#### 1.安装

```shell
npm i pinia-plugin-persist
```

#### 2.使用

```js
// src/store/index.ts
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";

const store = createPinia();
store.use(piniaPluginPersist);

export default store;
```

在对应的 store 里开启 persist 即可

```js
export const useUserStore = defineStore("user", {
  // 开启数据缓存，数据默认存在 sessionStorage 里，并且会以 store 的 id 作为 key。
  persist: {
    enabled: true,
  },
  state: () => {
    return {
      name: "yunmu",
    };
  },
});
```

#### 3.自定义 key

- 你也可以在 strategies 里自定义 key 值，并将存放位置由 sessionStorage 改为 localStorage。

```js
persist: {
  enabled: true,
  strategies: [
    {
      key: 'userInfo',
      storage: localStorage,
    }
  ]
}
```

#### 4.持久化部分 state

- 默认所有 state 都会进行缓存，你可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。

```js
state: () => {
  return {
    name: 'yunmu',
    age: 18,
    gender: '男'
  }
},
// 只持久存储name和age到localStorage
persist: {
  enabled: true,
  strategies: [
    {
      storage: localStorage,
      paths: ['name', 'age']
    }
  ]
}
```

## 6.Pinia 实战案例

### 1.需求说明

- 商品列表

  - 展示商品列表
  - 添加到购物车

- 购物车
  - 展示购物车商品列表
  - 展示总价格
  - 订单结算
  - 展示结算状态

### 2.创建启动项目

```shell
npm init vite@latest

Need to install the following packages:
	create-vite@latest
ok to proceed? (y)
√ Project name: ... shopping-cart
√ select a framework: > vue
√ select a variant: > vue-ts

scaffo1ding project in c:\Users\yun\Projects\pinia-examp1es\shopping-cart. . .
Done. Now run:

    cd shopping-cart
    npm insta11
    npm run dev
```

### 3.页面模板

```vue
<!-- src/App.vue -->
<template>
  <div>
    <h1>Pinia - 购物车示例</h1>
    <hr />
    <h2>商品列表</h2>
    <ProductList />
    <hr />
    <ShoppingCart />
  </div>
</template>

<script setup lang="ts">
import ProductList from "./components/ProductList.vue";
import ShoppingCart from "./components/ShoppingCart.vue";
</script>

<style lang="scss" scoped></style>
```

```vue
<!-- src/ProductList.vue -->
<template>
  <ul>
    <li>商品名称 - 商品价格<br /><button>添加到购物车</button></li>
    <li>商品名称 - 商品价格<br /><button>添加到购物车</button></li>
    <li>商品名称 - 商品价格<br /><button>添加到购物车</button></li>
  </ul>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
```

```vue
<!-- src/ShoppingCart.vue -->
<template>
  <div class="cart">
    <h2>你的购物车</h2>
    <p><i>请添加一些商品到购物车</i></p>
    <ul>
      <li>商品名称 - 商品价格 × 商品数量</li>
      <li>商品名称 - 商品价格 × 商品数量</li>
      <li>商品名称 - 商品价格 × 商品数量</li>
    </ul>
    <p>商品总价：xxx</p>
    <p><button>结算</button></p>
    <p>结算成功 / 失败</p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
```

### 4.数据接口

```typescript
// src/api/shop.ts
export interface IProduct {
  id: number;
  title: string;
  price: number;
  inventory: number;
}

const _products: IProduct[] = [
  { id: 1, title: "苹果12", price: 600, inventory: 3 },
  { id: 2, title: "小米13", price: 300, inventory: 5 },
  { id: 3, title: "魅族12", price: 200, inventory: 6 },
];

// 获取商品列表
export const getProducts = async () => {
  await wait(100);
  return _products;
};

// 结算商品
export const buyProducts = async () => {
  await wait(100);
  return Math.random() > 0.5;
};

async function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
```

### 5.展示商品列表

```typescript
// src/store/products.ts
import { defineStore } from "pinia";
import { getProducts, IProduct } from "../api/shop";
export const useProductsStore = defineStore("products", {
  state: () => {
    return {
      all: [] as IProduct[], // 所有商品列表
    };
  },
  getters: {},
  actions: {
    async loadAllProducts() {
      const result = await getProducts();
      this.all = result;
    },
  },
});
```

```vue
<!-- ProductList.vue -->
<template>
  <ul>
    <li v-for="item in productsStore.all" :key="item.id">
      {{ item.title }} - {{ item.price }}￥ - 库存{{ item.inventory }}<br />
      <button>添加到购物车</button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useProductsStore } from "../store/products";
const productsStore = useProductsStore();

// 加载所有数据
productsStore.loadAllProducts();
</script>

<style lang="scss" scoped></style>
```

### 6.添加到购物车

```typescript
// src/store/cart.ts
import { defineStore } from "pinia";
import { IProduct, buyProducts } from "../api/shop";
import { useProductsStore } from "./products";

// 添加quantity类型并且合并IProduct除了inventory，最终数据 {id, title, price, quantity}
type CartProduct = {
  quantity: number;
} & Omit<IProduct, "inventory">;

export const useCartStore = defineStore("cart", {
  state: () => {
    return {
      cartProducts: [] as CartProduct[], // 购物车列表
    };
  },
  getters: {},
  actions: {
    addProductToCart(product: IProduct) {
      console.log("addProductToCart", product);
      // 检查商品是否有库存
      if (product.inventory < 1) {
        return;
      }
      // 检查购物车是否已有该商品
      const cartItem = this.cartProducts.find((item) => item.id === product.id);

      if (cartItem) {
        // 如果有则商品数量 + 1
        cartItem.quantity++;
      } else {
        // 如果没有则添加到购物车列表
        this.cartProducts.push({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1, // 第一次添加到购物车数量就是 1
        });
      }
      // 更新商品库存 引入另一个store
      // product.inventory--; 不建议这么做，不要相信函数参数，建议找到源数据修改
      const productsStore = useProductsStore();
      productsStore.decrementProduct(product);
    },
  },
});
```

```typescript
// src/store/products.ts
actions: {
    async loadAllProducts() {
      const result = await getProducts();
      this.all = result;
    },
    // 减少库存
    decrementProduct(product: IProduct) {
      const result = this.all.find((item) => item.id === product.id);
      if (result) {
        result.inventory--;
      }
    },
  },
```

```vue
<!-- ProductList.vue -->
<template>
  <ul>
    <li v-for="item in productsStore.all" :key="item.id">
      {{ item.title }} - {{ item.price }}￥ - 库存{{ item.inventory }}<br />
      <button @click="cartStore.addProductToCart(item)" :disabled="!item.inventory">
        添加到购物车
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useProductsStore } from "../store/products";
import { useCartStore } from "../store/cart";

const productsStore = useProductsStore();
const cartStore = useCartStore();

// 加载所有数据
productsStore.loadAllProducts();
</script>

<style lang="scss" scoped></style>
```

```vue
<!-- ShoppingCart.vue -->
<template>
  <div class="cart">
    <h2>你的购物车</h2>
    <p><i>请添加一些商品到购物车</i></p>
    <ul>
      <li v-for="item in cartStore.cartProducts" :key="item.id">
        {{ item.title }} - {{ item.price }}￥ × 数量{{ item.quantity }}
      </li>
    </ul>
    <p>商品总价：xxx</p>
    <p><button>结算</button></p>
    <p>结算成功 / 失败</p>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "../store/cart";
const cartStore = useCartStore();
</script>

<style lang="scss" scoped></style>
```

### 7.展示购物车总价

```typescript
// src/store/cart.ts
getters: {
    // 总价
    totalPrice(state) {
      return state.cartProducts.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },
  },
```

```vue
<!-- ShoppingCart.vue -->
<p>商品总价：{{ cartStore.totalPrice }}</p>
```

### 8.购物车案例完成

```js
// src/store/cart.ts
import { defineStore } from "pinia";
import { IProduct, buyProducts } from "../api/shop";
import { useProductsStore } from "./products";

// 添加quantity类型并且合并IProduct除了inventory，最终数据 {id, title, price, quantity}
type CartProduct = {
  quantity: number;
} & Omit<IProduct, "inventory">;

export const useCartStore = defineStore("cart", {
  state: () => {
    return {
      cartProducts: [] as CartProduct[], // 购物车列表
      checkutStatus: null as null | string, // 结算状态
    };
  },
  getters: {
    // 总价
    totalPrice(state) {
      return state.cartProducts.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },
  },
  actions: {
    addProductToCart(product: IProduct) {
      console.log("addProductToCart", product);
      // 检查商品是否有库存
      if (product.inventory < 1) {
        return;
      }
      // 检查购物车是否已有该商品
      const cartItem = this.cartProducts.find((item) => item.id === product.id);

      if (cartItem) {
        // 如果有则商品数量 + 1
        cartItem.quantity++;
      } else {
        // 如果没有则添加到购物车列表
        this.cartProducts.push({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1, // 第一次添加到购物车数量就是 1
        });
      }
      // 更新商品库存 引入另一个store
      //   product.inventory--;
      const productsStore = useProductsStore();
      productsStore.decrementProduct(product);
    },
    async checkout() {
      const result = await buyProducts();
      this.checkutStatus = result ? "成功" : "失败";
	  // 清空购物车
      if (result) {
        this.cartProducts = [];
      }
    },
  },
});
```

```vue
<!-- ShoppingCart -->
<p><button @click="cartStore.checkout">结算</button></p>
<p v-show="cartStore.checkutStatus">结算{{ cartStore.checkutStatus }}</p>
```

谢谢观看，本文部分引自：[新一代状态管理工具，Pinia.js 上手指南 - 掘金 (juejin.cn)](https://juejin.cn/post/7049196967770980389)
