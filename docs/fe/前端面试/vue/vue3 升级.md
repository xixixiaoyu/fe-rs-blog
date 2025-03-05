### 1. Composition API vs Options API
Vue 2 主要用的是 Options API，写组件的时候你得把 `data`、`methods`、`computed` 这些分开写。逻辑复杂了之后，代码就容易散乱，维护起来有点头疼。  

Vue 3 推出了 Composition API，用一个 `setup` 函数把相关逻辑集中到一起。比如说，你以前写一个计数器可能是这样：

```javascript
// Vue 2
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

Vue 3 用 Composition API 可以改成：

```javascript
// Vue 3
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const increment = () => {
      count.value++
    }
    return { count, increment }
  }
}
```

好处是啥呢？逻辑复用更方便了。你可以把 `count` 和 `increment` 抽成一个函数（比如叫 `useCounter`），在不同组件里随便用，不用再写一堆 mixin 或者高阶组件。



### 2. 性能提升：Proxy 代替 Object.defineProperty
Vue 2 用的是 `Object.defineProperty` 来实现数据响应式，但它有个局限——没法监听数组下标变化或者对象新增属性，得用 `$set` 这种特殊方法。  
Vue 3 改用 `Proxy`，直接监听整个对象，新增属性、删属性、数组操作都能轻松响应。比如：

```javascript
// Vue 3
import { reactive } from 'vue'

export default {
  setup() {
    const obj = reactive({ name: '小明' })
    obj.age = 18  // 自动响应，不用 $set
    return { obj }
  }
}
```

而且 `Proxy` 的性能更好，尤其是大数据量的时候，初始化和更新都快了不少。



### 3. 更好的 TypeScript 支持

Vue 2 对 TypeScript 支持不太友好，类型推导经常出问题，写起来得自己补一堆类型声明。  
Vue 3 从底层就考虑了 TypeScript，Composition API 的 `ref` 和 `reactive` 都有清晰的类型定义，IDE 能自动帮你补全。比如：

```typescript
import { ref } from 'vue'

const count = ref<number>(0)  // 明确指定类型
count.value = 1  // 类型安全，写错会报错
```

这对用 TS 的开发者来说，体验提升很明显。



### 4. 构建工具升级：Vite

虽然严格来说 Vite 不是 Vue 3 的一部分，但 Vue 3 推荐用 Vite 代替 Vue CLI。Vite 用 ES Modules 原生支持，开发时不用打包整个项目，启动快得飞起，冷启动从几秒变成几百毫秒，热更新也几乎是实时的。用过之后真回不去 Vue CLI 了。



### 5. 更小的体积

Vue 3 引入了 Tree-shaking，把没用到的功能在打包时直接剔除。比如你不用 `transition` 组件，它就不会打包进去。核心库大小从 Vue 2 的 20多 KB 压缩到 Vue 3 的 10多 KB，加载更快。



### 6. 新特性：Teleport 和 Fragment

- **Teleport**：可以把组件渲染到 DOM 树的其他位置，比如弹窗直接挂到 `body` 下，不用嵌在父组件里，样式隔离更方便。
- **Fragment**：Vue 2 里组件必须有个根节点，Vue 3 不需要了，直接返回多个并列元素，写起来更自由。



### 总结一下

Vue 3 主要是更现代、更快、更灵活。Composition API 让代码组织更清晰，Proxy 提升了响应式性能，TypeScript 支持让大项目更稳，还有 Vite 这种神器加持。  

当然，升级也有成本，比如一些 API 变了（像 `Vue.set` 没了），老项目迁移得花点心思。但总体来说，Vue 3 是往更好的方向迈了一大步。