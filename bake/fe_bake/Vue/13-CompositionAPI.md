## 0.Vue3 升级

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/93624428-53932780-f9ae-11ea-8d16-af949e16a09f.png" alt="img" style="zoom:50%;" />

> - Vue3 性能提升
> - 源码升级：
>   - 源码 TS 重写，全新的 TS 支持
>   - 使用 Proxy 代替 defineProperty 实现响应式
>   - 重写虚拟 DOM 的实现
>     - `PatchFlag`编译模板，动态节点标记成不同类型如`TEXT PROPS`，方便 diff 算法更好区分静态和不同类型的动态节点
>     - `hoistStatic`静态节点提升父作用域缓存，多个相邻的静态节点会被合并，空间换时间的优化策略
>     - `cacheHandler`缓存事件
>   - Tree-Shaking
>     - 编译时，根据不同的情况，引入不同的 API
>   - SSR 优化
>     - 静态节点直接输出，绕过了 vdom，动态节点，还是需要动态渲染
> - 新特性：
>   - Composition API（组合 API）
>   - 新的内置组件
>     - Fragment
>     - Teleport
>     - Suspense
> - 全局 API 的改变
>   - 将全局的 API，即：`Vue.xxx`调整到应用实例（`app`）上
>
> | 2.x 全局 API（`Vue`）    | 3.x 实例 API (`app`)        |
> | ------------------------ | --------------------------- |
> | Vue.config.xxxx          | app.config.xxxx             |
> | Vue.config.productionTip | **移除**                    |
> | Vue.component            | app.component               |
> | Vue.directive            | app.directive               |
> | Vue.mixin                | app.mixin                   |
> | Vue.use                  | app.use                     |
> | Vue.prototype            | app.config.globalProperties |
>
> - 其他改变：
>
>   - 异步组件需要使用`defineAsyncComponent`创建方法，组件 v-model，自定义指令，`$attrs`包含`class`&`style`，v-for 和 v-if 优先级，过渡类名改变
>
> - `data` 选项应始终被声明为一个函数，在`beforeDestroy`生命周期的选项已更名为`beforeUnmount`，在`destroyed`生命周期的选项已更名为`unmounted`
> - 移除 keyCode 支持作为 v-on 的修饰符，同时也不再支持`config.keyCodes`
> - 移除$children、过滤器 filter、`v-on.native`修饰符（自定义事件在 emits 选项中定义，没有定义的为原生事件）、`.sync` 修饰符等等
>
>   - `$on`，`$off` 和 `$once` 实例方法已被移除
>   - .....
>
> - 更好的周边工具：Vite、Pinia
>
> 最新 Vue3.2 对 ref 性能提高巨大，建议总是都使用 ref 定义响应式，全新的 script setup 语法
>
> 组件状态驱动的动态 CSS 值：`p{color: v-bind(color)}` 其中 color 为定义的变量
>
> ....

## 1.extends

> 之前我抽离公共逻辑，使用的 Vue2 和 Vue3 都支持的 Mixin
>
> 另外一个类似于 Mixin 的方式是通过`extends`属性
>
> 在开发中 extends 用的非常少，在 Vue2 中比较推荐大家使用 Mixin，而在 Vue3 中推荐使用 Composition API

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220203133012442.png" alt="image-20220203133012442" style="zoom:50%;" />

## 2.Options API 的弊端

> 在 Vue2 中，我们编写组件的方式是 Options API，在对应的属性中编写对应的功能模块，比如 data 定义数据、methods 中定义方法、computed 中定义计算属性、watch 中监听属性改变，也包括生命 周期钩子
>
> 但是这样会有一个弊端，当我们实现某一个功能，实现的代码会被拆分到各个属性里面，当随着组件逻辑的增多，同一个功能的分散可能导致代码的难于阅读和理解

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f84e4e2c02424d9a99862ade0a2e4114~tplv-k3u1fbpfcp-watermark.image"  />

**定义数据与使用数据被分割在组件的各个位置，导致我们需要不断地翻滚页面来查看具体的业务逻辑**

伴随着组件越来越复杂，分割的情况会越来越严重，而这就是 CompositionAPI 所要解决的问题

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc0be8211fc54b6c941c036791ba4efe~tplv-k3u1fbpfcp-watermark.image"/>

**最后通过 hook 函数把定义数据与使用数据的逻辑放在一起进行处理，以达到更加易读，更加方便扩展的目的！**

  <img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cc55165c0e34069a75fe36f8712eb80~tplv-k3u1fbpfcp-watermark.image"/>

## 3.CompositionAPI 编写位置

> 使用 CompositionAPI 编写代码的位置是`setup`函数，相当于组件的另一个选项
>
> 但是这一个选项里可以代替之前大部分的选项，比如 methods、computed、watch、data、生命周期等等
>
> 官方文档: [https://v3.cn.vuejs.org/guide/composition-api-introduction.html](https://gitee.com/link?target=https%3A%2F%2Fv3.cn.vuejs.org%2Fguide%2Fcomposition-api-introduction.html)

## 4.setup 函数的参数和返回值

### setup 函数中获取组件实例

> CompositionAPI 中没有 this
>
> 可通过`getCurrentInstance`获取当前实例
>
> 注意使用的 API 都需要从 vue 中导入
>
> 例如：`import { onMounted, getCurrentInstance } from "vue"`

![image-20220204151823687](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204151823687.png)

### setup 函数参数

> setup 函数的参数有两个
>
> - 第一个参数 props 对象：组件外部传递过来，且组件内部声明接收了的属性
>
> - 第二个参数 context 上下文对象，其内部包含三个属性：
>
>   - attrs 对象：组件外部传递过来，但没有在 props 配置中声明的属性, 相当于 `this.$attrs`
>   - slots：收到的插槽内容，相当于 `this.$slots`（这个在以后渲染函数返回时会有作用，后文会写）
>   - emit：分发自定义事件的函数，相当于 `this.$emit`
>
>   注意：setup 在 beforeCreate 之前自动执行一次，this 是 undefined，所以 setup 函数里访问 this 不能找到组件实例，因为 setup 调用发生在 data、computed、methods 解析之前，自然也就不可能使用 this.$emit 等有关方法

![image-20220204210823998](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204210823998.png)

### setup 函数返回值

> 返回值：
>
> - 若返回一个对象，则对象中的属性、方法, 在模板中均可以直接使用。（重点关注！ 相当于替代了选项的 data、methods）
> - 若返回一个渲染函数：则可以自定义渲染内容。（了解）
>
> 注意：
>
> - 尽量不要与 Vue2.x 配置混用
>
>   - Vue2.x 配置（data、methos、computed...）中**可以访问到**setup 中的属性、方法
>
>   - 但在 setup 中**不能访问到**Vue2.x 配置（data、methos、computed...）
>
>   - 如果有重名, setup 优先
>
> - setup 不能是一个 async 函数，因为返回值不再是 return 的对象, 而是 promise, 模板看不到 return 对象中的属性。（后期也可以返回一个 Promise 实例，但需要 Suspense 和异步组件的配合）

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220205160710772.png" alt="image-20220205160710772" style="zoom:67%;" />

当我们点击 button 的时候 counter 变量改变了，但是 Vue 没有模板没有追踪其更新改变界面

## 5.Reactive API

> 上面如果想定义的数据提供响应式的特性，那么我们可以使用`reactive`的函数
>
> `const 代理对象= reactive(源对象)`接收一个对象（或数组），返回一个**代理对象（Proxy 的实例对象，简称 proxy 对象）**
>
> 传入的源对象是一个对象或者数组类型，否则会报警告，所以定义基础类型要用`ref`函数

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220203151558103.png" alt="image-20220203151558103" style="zoom: 50%;" />

当我们使用 reactive 函数处理数据后，就会进行依赖收集，当数据发生改变时，所有收集到的依赖都是进行对应的响应式操作（比如更新界面）

reactive 函数定义的响应式数据是“深层次的”，内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据进行操作

## 6.Ref API

> 创建一个包含响应式数据的**引用对象（reference 对象，简称 ref 对象）**，该对象作为响应式引用维护着它内部`value`属性的值
>
> - JS 中操作数据： `xxx.value`
> - 模板中读取数据: 不需要.value，直接：`<div>{{xxx}}</div>`
>
> 备注：
>
> - 接收的数据可以是：基本类型和对象类型
> - 基本类型的数据：响应式依然是靠`Object.defineProperty()`的`get`与`set`完成的
> - 对象类型的数据：内部 _“ 求助 ”_ 了 Vue3.0 中的一个新函数—— `reactive`函数

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220203153711344.png" alt="image-20220203153711344" style="zoom: 50%;" />

ref 的浅层解包

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220203154210056.png" alt="image-20220203154210056" style="zoom:50%;" />

可以使用 ref 获取元素或组件，我们只需要定义一个 ref 对象，绑定到元素或者组件的 ref 属性上即可

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204005203810.png" alt="image-20220204005203810" style="zoom:50%;" />

### reactive 对比 ref

- 从定义数据角度对比：
  - ref 用来定义：**基本类型数据**。
  - reactive 用来定义：**对象（或数组）类型数据**。
  - 备注：ref 也可以用来定义**对象（或数组）类型数据**, 它内部会自动通过`reactive`转为**代理对象**。
- 从原理角度对比：
  - ref 通过`Object.defineProperty()`的`get`与`set`来实现响应式（数据劫持）。
  - reactive 通过使用**Proxy**来实现响应式（数据劫持）, 并通过**Reflect**操作**源对象**内部的数据。
- 从使用角度对比：
  - ref 定义的数据：操作数据**需要**`.value`，读取数据时模板中直接读取**不需要**`.value`。
  - reactive 定义的数据：操作数据与读取数据：**均不需要**`.value`。

## 7.toRefs 和 toRef

> `toRef`则是转换一个 reactive 对象中的某个属性为 ref
>
> 使用场景：有一个响应式对象数据，但是模版中只需要使用其中一项数据
>
> `toRefs`可以将 reactive 返回的对象中的属性都转成 ref
>
> 使用场景：想使用响应式对象中的多个或者所有属性做为响应式数据

toRef 的使用

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220203221055113.png" alt="image-20220203221055113" style="zoom:50%;" />

toRefs 的使用

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220203220140934.png" alt="image-20220203220140934" style="zoom:50%;" />

## 8.computed

> 我们可以在 setup 函数中使用 computed 方法来编写一个计算属性

方式一：接收一个 getter 函数，并为 getter 函数返回的值，返回一个不变的 ref 对象

![image-20220204003104605](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204003104605.png)

方式二：接收一个具有 get 和 set 的对象，返回一个可变的（可读写）ref 对象

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204003147252.png" alt="image-20220204003147252" style="zoom: 50%;" />

## 9.watch 和 watchEffect

> 在 Composition API 中，我们可以使用 watchEffect 和 watch 来完成响应式数据的侦听
>
> watchEffect 用于自动收集响应式数据的依赖，当侦听到某些响应式数据变化时，我们希望执行某些操作，这个时候可以使用 watchEffect
>
> watch 需要手动指定侦听的数据源

### watchEffect 基本使用

> 首先，watchEffect 传入的函数会被立即执行一次，并且在执行的过程中会收集依赖
>
> 其次，只有收集的依赖发生变化时，watchEffect 传入的函数才会再次执行

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204003542516.png" alt="image-20220204003542516" style="zoom: 50%;" />

#### watchEffect 的停止侦听

> 我们希望停止侦听，这个时候我们可以获取 watchEffect 的返回值函数，调用该函数即可

比如上面 age，我们希望数字达到 20 就停止侦听

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204003847043.png" alt="image-20220204003847043" style="zoom: 50%;" />

#### watchEffect 清除副作用

> 清除副作用，比如我们侦听函数里执行网络请求，但是在网络请求还没有达到的时候，我们停止了侦听器，或者侦听器侦听函数依赖数据变化再次执行了
>
> 那么上一次的网络请求应该被取消掉，这个时候我们就可以清除上一次的副作用
>
> 在我们给 watchEffect 传入的函数被回调时，其实可以获取到一个参数：onInvalidate
>
> 当 副作用即将重新执行 或者 侦听器被停止 时会执行该函数传入的回调函数，在回调函数里执行一些清除工作

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204004854294.png" alt="image-20220204004854294" style="zoom: 50%;" />

#### watchEffect 的执行时机

> 默认情况下，组件更新前会执行副作用函数

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204010334211.png" alt="image-20220204010334211" style="zoom:50%;" />

上面会打印两次结果：

1. 当我们 setup 函数在执行时就会立即执行传入的副作用函数，这个时候 DOM 并没有挂载，所以打印为 null
2. 而当 DOM 挂载时，会给 title 的 ref 对象赋值新的值，副作用函数会再次执行，打印出来对应的元素

当更改 `title` 时，将在组件**更新前**执行副作用。

我们可以配置 watchEffect 的第二个参数`flush`来调整执行时机：

- 默认值是 pre，DOM 挂载或者更新之前执行
- post：DOM 挂载或更新之后执行，需要使用模板元素时使用
- sync，这将强制效果始终同步触发，不建议

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204010911622.png" alt="image-20220204010911622" style="zoom:50%;" />

### watch 的基本使用

> watch 需要侦听特定的数据源，并在回调函数中执行副作用
>
> 默认情况下它是惰性的，只有当被侦听的源发生变化时才会执行回调
>
> 与 watchEffect 的比较，watch 允许我们
>
> - 懒执行副作用（第一次不会直接执行）
> - 更具体的说明当哪些状态发生变化时，触发侦听器的执行
> - 访问侦听状态变化前后的值

#### 侦听单个数据源

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204014456211.png" alt="image-20220204014456211" style="zoom:50%;" />

#### 侦听多个数据源

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204020010406.png" alt="image-20220204020010406" style="zoom:67%;" />

#### watch 的选项

- 深度侦听，设置 deep 为 true
- 立即执行，设置 immediate 为 true

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204020305519.png" alt="image-20220204020305519" style="zoom: 50%;" />

## 10.生命周期钩子

> 上面已经使用 setup 替代了 data 、 methods 、 computed 、watch 等这些选项
>
> 我们来说如何在 setup 中使用生命周期函数

可以使用直接导入的 onX 函数注册生命周期钩子：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204022202693.png" alt="image-20220204022202693" style="zoom:50%;" />

- 与 Vue2.x 中钩子对应关系如下：
  - `beforeCreate`===>`setup()`
  - `created`=======>`setup()`
  - `beforeMount` ===>`onBeforeMount`
  - `mounted`=======>`onMounted`
  - `beforeUpdate`===>`onBeforeUpdate`
  - `updated` =======>`onUpdated`
  - `beforeUnmount` ==>`onBeforeUnmount`
  - `unmounted` =====>`onUnmounted`

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204023123214.png" alt="image-20220204023123214" style="zoom:50%;" />

## 11.其他 CompositionAPI

### 1.readonly 与 shallowReadonly

> readonly 让一个响应式数据变为只读的（深只读）
>
> 但是 readonly 包裹的原来的对象是允许被修改的，尽量避免修改进而影响 readonly 的值
>
> 本质上就是 readonly 返回的原生对象只读代理的 setter 方法被劫持了
>
> shallowReadonly：让一个响应式数据变为只读的（浅只读）
>
> 它们常见传入的参数
>
> 1. 普通对象
> 2. ref 对象
> 3. reactive 对象

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220203153332656.png" alt="image-20220203153332656" style="zoom:50%;" />

### 2.shallowReactive 和 shallowRef

- shallowReactive：只处理对象最外层属性的响应式（浅响应式）。
- shallowRef：只处理基本数据类型的响应式, 不进行对象的响应式处理。
- 什么时候使用?
  - 如果有一个对象数据，结构比较深, 但变化时只是外层属性变化 ===> shallowReactive。
  - 如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换 ===> shallowRef。

### 3.toRaw 与 markRaw

- toRaw：
  - 作用：将一个由`reactive`生成的**响应式对象**转为**普通对象**。
  - 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新。
- markRaw：
  - 作用：标记一个对象，使其永远不会再成为响应式对象。
  - 应用场景:
    1. 有些值不应被设置为响应式的，例如复杂的第三方类库等。
    2. 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。

### 4.provide 与 inject

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204023013398.png" alt="image-20220204023013398" style="zoom:50%;" />

- 作用：实现**祖与后代组件间**通信
- 父组件有一个 `provide` 选项来提供数据，后代组件有一个 `inject` 选项来开始使用这些数据，提供响应式，在 provide 提供值时使用 ref 和 reactive
- provide 可以传入两个参数： 1.提供的属性名称，2.提供的属性值
- inject 也可以传入两个参数：1.provide 提供的属性名，2.默认值
- 具体写法：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204114723937.png" alt="image-20220204114723937" style="zoom: 50%;" />

如果要修改值，最好向下层组件提供一个方法，调用该方法，该数据会在提供的位置进行修改

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204115757859.png" alt="image-20220204115757859" style="zoom:50%;" />

### 5.customRef

> 创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制
>
> 它需要一个工厂函数，该函数接受 track 和 trigger 函数作为参数
>
> 并且应该返回一个带有 get 和 set 的对象

对双向绑定的属性实现防抖效果：

![image-20220204121241058](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204121241058.png)

### 6.响应式数据的判断

> isRef: 检查一个值是否为一个 ref 对象
>
> isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理，如果该代理是 readonly 创建建的，但包裹了由 reactive 创建的另一个代理，它也会返回 true
>
> isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
>
> isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理

### 7.ref 其他的 API

> unref：获取一个 ref 引用中的 value，如果参数是 ref，返回内部值，否则返回参数本身，这是 `val = isRef(val) ? val.value : val` 的语法糖函数
>
> triggerRef：手动触发和 shallowRef 相关联的副作用

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204122629733.png" alt="image-20220204122629733" style="zoom: 50%;" />

## 12.自定义 Hook 函数

> hook 本质是一个函数，把 setup 函数中使用的 Composition API 进行了封装
>
> 类似于 vue2.x 中的 mixin，可以更好的抽离逻辑，复用代码

封装 useCounter 抽离计算器逻辑：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204124016432.png" alt="image-20220204124016432" style="zoom: 50%;" />

封装 useTitle 修改 title：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204124154475.png" alt="image-20220204124154475" style="zoom:50%;" />

封装 useScrollPosition 监听界面滚动位置

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204124435408.png" alt="image-20220204124435408" style="zoom:50%;" />

封装 useMousePosition 监听鼠标位置

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204124824552.png" alt="image-20220204124824552" style="zoom:50%;" />

封装 useLocalStorage 存储和获取数据

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204125049398.png" alt="image-20220204125049398" style="zoom:50%;" />

为这些 hook 设置统一出口（不是必需）

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220204125731235.png" alt="image-20220204125731235" style="zoom:67%;" />

需要的组件使用：

```vue
<template>
  <div>
    <h2>当前计数: {{ counter }}</h2>
    <h2>计数*2: {{ doubleCounter }}</h2>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>

    <h2>{{ data }}</h2>
    <button @click="changeData">修改data</button>

    <p class="content"></p>

    <div class="scroll">
      <div class="scroll-x">scrollX: {{ scrollX }}</div>
      <div class="scroll-y">scrollY: {{ scrollY }}</div>
    </div>
    <div class="mouse">
      <div class="mouse-x">mouseX: {{ mouseX }}</div>
      <div class="mouse-y">mouseY: {{ mouseY }}</div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import {
  useCounter,
  useLocalStorage,
  useMousePosition,
  useScrollPosition,
  useTitle,
} from "./hooks";
export default {
  setup() {
    // counter
    const { counter, doubleCounter, increment, decrement } = useCounter();

    // 修改title
    const titleRef = useTitle("yunmu");
    setTimeout(() => {
      titleRef.value = "kobe";
    }, 3000);

    // 滚动位置
    const { scrollX, scrollY } = useScrollPosition();

    // 鼠标位置
    const { mouseX, mouseY } = useMousePosition();

    // localStorage
    const data = useLocalStorage("info");
    const changeData = () => (data.value = "yunmu");

    return {
      counter,
      doubleCounter,
      increment,
      decrement,

      scrollX,
      scrollY,

      mouseX,
      mouseY,

      data,
      changeData,
    };
  },
};
</script>

<style scoped>
.content {
  width: 3000px;
  height: 5000px;
}

.scroll {
  position: fixed;
  right: 30px;
  bottom: 30px;
}
.mouse {
  position: fixed;
  right: 30px;
  bottom: 80px;
}
</style>
```
