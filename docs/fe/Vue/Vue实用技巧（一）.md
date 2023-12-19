## watch监听

侦听 `ref` 和 `reactive`

```js
const state = reactive({ count: 0 });
// 侦听reactive里面属性需要包裹在箭头函数对其返回
watch(
    () => state.count,
    (count, prevCount) => {
        /* ... */
    }
);

// watch直接接受 ref 作为监听对象，并在回调函数返回解包后的值，同样的解包操作也发生在模板和reactive中
const count = ref(0);
watch(count, (count, prevCount) => {
    /* ... */
});
```



如果我们想侦听 `props` 上的属性变化

```js
watch(
    () => props.msg,
    (newVal, oldVal) => {
        console.log(newVal, oldVal);
    }
);
```





## unref - ref的反操作

- 如果传入一个 `ref`，返回其值
- 否则原样返回

```js
import { unref, ref } from "vue";

const yun = ref("Yun");
console.log(unref(yun)); // 'Yun'

const mu = "mu";
console.log(unref(mu)); // 'mu'
```



应用：当我们编写函数的时候无论调用是否传入 `ref` 都保证拿到对应的值计算

```js
function add(
  a: Ref<number> | number,
  b: Ref<number> | number
) {
  return computed(() => unref(a) + unref(b))
}
```



上面我们发现 `number` 类型竟然书写了两次，我们可以单独抽离成一个类型方便复用

```typescript
type MaybeRef<T> = Ref<T> | T

MaybeRef<number> 
```



## 灵活的 ref 和 reactive

- 使⽤可组合的函数式，同时获得 `ref` 和 `reactive `的好处

```js
import { ref, reactive } from 'vue'

function useMouse(){
  return{
    x: ref(0),
    y: ref(0)
  }
}
// 直接使用 ES6 解构其中的 Ref 使用
const { x, y } = useMouse()

// 使用 reactive 自动解包功能
const mouse = reactive(useMouse())

console.log(mouse.x === x.value) // true
```



正常使用Hooks

```js
import { useTitle } from '@vueuse/core'

const title = useTitle()

title.value = 'Hello World'
// 网页的标题随 ref 改变
```



其实也可以绑定一个现有的 ref

```js
import { ref, computed } from 'vue'
import { useTitle } from '@vueuse/core'

const name = ref('Hello')
const title = computed(() => {
  return `${name.value} - Vue3`
})

useTitle(title) // Hello - Vue3

name.value = 'Hi' // Hi - Vue3
```

上面 `useTitle` 我们只需传入 `title` 即可 ，这个 `title` 是计算出来的一个 `ref` 数据，当我们改变 `name` 的时候，因为 `title` 依赖 `name` 所以也会改变

我们来看下这个函数的内部实现：

```js
import { ref, watch } from 'vue'
import { MaybeRef } from '@vueuse/core'

export function useTitle(
  newTitle: MaybeRef<string | null | undefined>
) {
  const title = ref(newTitle || document.title)

  watch(title, (t) => {
    if (t != null)
      document.title = t
  }, { immediate: true })

  return title
}
```

上面的 `newTitle` 参数如果传入了 `ref` 数据，则会使用传入的 `ref` 作为 `title`，反之就会构建新的 `ref` 赋值

为什么上面能重复使用已有的 `ref` 呢？

因为如果将一个 `ref` 传递给 `ref` 函数，他会原样返回，并不会产生两层

```js
const foo = ref(1); // Ref<1>
const bar = ref(foo); // Ref<1>

console.log(foo === bar); // true
```



总结：

- 使用  `ref()` 始终保证数据为 ref
- 使用 `unref()` 当想获取值时
- `MaybeRef<T>` 可以更好配合 `ref` 和 `unref` 的使用

```typescript
type MaybeRef<T> = Ref<T> | T

function useExample<T>(arg: MaybeRef<T>) {
  const reference = ref(arg) // 得到 ref
  const value = unref(arg)   // 得到值
}
```



## vueuse - useFetch

先建⽴数据间的“连结” ，然后再等待异步请求返回将数据填充

```js
const { data } = useFetch('https://api.github.com/')
const user_url = computed(()=>data.value?.user_url)
```

`useFetch.ts`

```typescript
import { Ref, shallowRef, unref, } from 'vue'
type MaybeRef<T> = Ref<T> | T

export function useFetch<T>(url: MaybeRef<string>){
  	// shallowRef 只会监听 .value 这一层变化，非深度监听数据的变化，提高性能
    const data = shallowRef<T | undefined>()
    const error = shallowRef<Error | undefined>()

    fetch(unref(url))
        .then(r => r.json())
        .then(r => data.value = r)
        .catch(e => error.value = e)

    return {
        data,
        error
    }
}
```



## 状态共享

由于组合 API 天然的灵活性，状态可以独立于组件创建和使用

`shared.ts`

```typescript
import { reactive } from 'vue'

export const state = reactive({
  foo: "Hello",
  bar: 1
})
```

共享使用

```typescript
// A.vue 
import { state } from './shared.ts' 
state.bar += 1

// B.vue 
import { state } from './shared.ts'
console.log(state.bar) // 2
```

**`此⽅案不兼容 SSR!，在 SSR 下状态可能会混乱`**



建议使⽤ `provide `和 `inject` 来共享应用层面的状态

`context.ts`

```typescript
import { InjectionKey, reactive, App, provide } from 'vue'

export interface MyState{
  id: number
  name: string
}

export const myStateKey: InjectionKey<MyState> = Symbol()

export function createMyState(){
  const state = reactive({
    id: 1,
    name: 'vue3'
  })
  return {
    install(app: App){
      app.provide(myStateKey, state)
    }
  }
}

export function useMyState(): MyState{
  return inject(myStateKey)!
}
```

`main.ts`

```typescript
const App = createApp(App)

app.use(createMyState())
```

`A.vue`

```typescript
// 在任何组件中使用这个函数来获得状态对象
const state = useMyState()
```



同样也可以父子，爷孙组件来通信

`context.ts`

```typescript
import { InjectionKey } from 'vue'

export interface UserInfo {
  id: number
  name: string
}

export const injectKeyUser: InjectionKey<UserInfo> = Symbol()
```

`parent.vue` 和 `child.vue`

```typescript
// parent.vue
import { provide } from 'vue' 
import { injectKeyUser } from './context'

export default {
  setup() {
    provide(injectKeyUser, {
      id: 1,
      name: 'yunmu'
    })
  }
}

// child.vue
import { inject } from 'vue' 
import { injectKeyUser } from './context'

export default {
  setup() {
    const user = inject(injectKeyUser) 
    // UserInfo | undefined

    if (user)
      console.log(user.name) // yunmu
  }
}
```



## useVModel

- `vueuse`中让 `props` 和 `emit` 更方便的工具

```typescript
export function useVModel(props, name) {
  const emit = getCurrentInstance().emit

  return computed({
    get() {
      return props[name]
    },
    set(v) {
      emit(`update:${name}`, v)
    }
  })
}
```

`A.vue`

```vue
<template>
  <input v-model="value" />
</template>

<script>
export default defineComponent({
  setup(props) {
     // 修改value自动emit
    const value = useVModel(props, 'value')

    return { value }
  }
})
</script>
```



