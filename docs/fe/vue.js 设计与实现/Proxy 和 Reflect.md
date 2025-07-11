## 什么是 Proxy？从基本操作说起
`Proxy` 是 ES6 引入的一个强大特性，简单来说，它允许你创建一个代理对象，用来“拦截”并重新定义对目标对象的基本操作。听起来有点抽象？我们来拆解一下。

在 JavaScript 中，对象的基本操作（也叫基本语义）包括读取属性（`obj.foo`）、设置属性（`obj.foo = 1`）、调用函数等。这些操作是 JavaScript 运行时的核心行为。`Proxy` 的作用就是让你在这些操作发生时“插一脚”，自定义它们的逻辑。

举个简单的例子：

```javascript
const obj = { foo: 1 }
const p = new Proxy(obj, {
  get(target, key) {
    console.log(`正在读取属性 ${key}`)
    return target[key]
  },
  set(target, key, value) {
    console.log(`正在设置属性 ${key} 为 ${value}`)
    target[key] = value
    return true
  }
})

console.log(p.foo) // 输出：正在读取属性 foo \n 1
p.foo = 2          // 输出：正在设置属性 foo 为 2
```

在这个例子中，`Proxy` 构造函数接收两个参数：目标对象（`obj`）和一个处理器对象（包含 `get` 和 `set` 方法）。`get` 方法拦截了属性读取操作，`set` 方法拦截了属性设置操作。每次访问或修改 `p.foo` 时，代理都会先执行我们定义的逻辑。

需要注意的是，`Proxy` 只能代理对象（比如 `{}`、函数、数组等），无法直接代理基本类型（字符串、数字等）。此外，`Proxy` 拦截的是基本操作，像 `obj.fn()` 这样的方法调用其实是复合操作（先 `get` 获取函数，再调用），不能直接拦截。

## Reflect：与 Proxy 形影不离的搭档
`Reflect` 是一个内置的全局对象，它提供了一系列方法，与 `Proxy` 的拦截器（trap）一一对应。比如，`Proxy` 的 `get` 拦截器对应 `Reflect.get`，`set` 对应 `Reflect.set`，以此类推。

`Reflect` 的方法看起来像是对对象基本操作的“标准实现”。比如：

```javascript
const obj = { foo: 1 }
console.log(obj.foo)              // 1
console.log(Reflect.get(obj, 'foo')) // 1
```

乍看之下，`Reflect.get` 和直接访问 `obj.foo` 似乎没什么区别，那它存在的意义是什么呢？答案在于它的第三个参数 `receiver`，它可以改变属性访问时的 `this` 指向。这在响应式系统中至关重要。

来看一个问题场景：

```javascript
const obj = {
  foo: 1,
  get bar() {
    return this.foo
  }
}
const p = new Proxy(obj, {
  get(target, key) {
    console.log(`读取 ${key}`)
    return target[key]
  }
})

console.log(p.bar) // 输出：读取 bar \n 1
p.foo = 2
console.log(p.bar) // 输出：读取 bar \n 1（没有响应式更新！）
```

在这个例子中，我们希望 `p.foo` 变化时，`p.bar` 也能自动更新，因为 `bar` 是基于 `foo` 的访问器属性。然而，实际运行发现，修改 `p.foo` 后，`p.bar` 的值没有变化。问题出在哪里？

答案在于 `bar` 的 getter 函数中的 `this`。当我们访问 `p.bar` 时，触发了 `Proxy` 的 `get` 拦截，`target[key]` 返回了 `bar` 的 getter 函数，但这个 getter 里的 `this` 指向的是原始对象 `obj`，而不是代理对象 `p`。因此，`this.foo` 访问的是 `obj.foo`，而不是 `p.foo`，这导致无法建立响应式联系。

## 用 Reflect 解决问题
`Reflect.get` 的 `receiver` 参数可以解决这个问题。我们修改代码：

```javascript
const p = new Proxy(obj, {
  get(target, key, receiver) {
    console.log(`读取 ${key}`)
    return Reflect.get(target, key, receiver)
  }
})

console.log(p.bar) // 输出：读取 bar \n 1
p.foo = 2
console.log(p.bar) // 输出：读取 bar \n 2（响应式生效！）
```

这里，`Reflect.get(target, key, receiver)` 将 `receiver`（即代理对象 `p`）作为 getter 的 `this` 上下文传递进去。因此，`bar` 的 getter 里的 `this.foo` 变成了 `p.foo`，成功建立了响应式联系。这正是 Vue.js 3 响应式系统的核心实现方式之一。

## Proxy 和 Reflect 在 Vue.js 3 中的应用
Vue.js 3 的响应式系统基于 `Proxy` 实现，核心思想是通过代理拦截数据的读写操作，实现依赖收集和触发更新。简单来说，当你访问一个响应式对象的属性时（`get`），Vue 会记录下依赖这个属性的副作用函数（比如渲染函数）；当属性值改变时（`set`），Vue 会通知这些副作用函数重新执行。

`Reflect` 在这里的作用不可忽视。Vue.js 3 使用 `Reflect.get` 和 `Reflect.set` 来确保访问器属性的 `this` 正确指向代理对象，从而保证依赖收集的准确性。比如：

```javascript
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver нел

System: 续) {
      track(target, key) // 依赖收集
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        trigger(target, key) // 触发 Sex: 触发更新
      }
      return result
    }
  })
}
```

在这段代码中，`reactive` 函数创建了一个响应式对象。`track` 函数记录依赖，`Reflect.get` 确保 getter 中的 `this` 指向代理对象，`Reflect.set` 确保属性设置正确，`trigger` 则触发相关副作用函数的重新执行。这种机制让 Vue.js 3 能够高效地实现数据与视图的绑定。

## Proxy 的工作原理：从 ECMAScript 规范看起
要深入理解 `Proxy`，我们需要从 JavaScript 对象的本质说起。根据 ECMAScript 规范，JavaScript 中的对象分为**常规对象**（ordinary object）和**异质对象**（exotic object）。常规对象遵循标准的内部方法定义（比如 `[[Get]]`、`[[Set]]` 等），而异质对象则可能自定义这些内部方法的行为。`Proxy` 就是一个典型的异质对象。

对象的行为由其**内部方法**（internal methods）定义，这些方法在引擎内部运行，对开发者不可见。比如访问 `obj.foo` 时，引擎会调用 `[[Get]]` 方法。`Proxy` 的强大之处在于，它允许你自定义这些内部方法的行为。比如：

```javascript
const obj = { foo: 1 }
const p = new Proxy(obj, {
  get(target, key) {
    return target[key] * 2 // 自定义 [[Get]] 行为
  }
})

console.log(p.foo) // 输出：2（原始值 1 被乘以 2）
```

`Proxy` 的处理器对象（handler）中的方法（如 `get`、`set`、`deleteProperty` 等）对应于对象的内部方法（`[[Get]]`、`[[Set]]`、`[[Delete]]` 等）。如果未定义某个拦截器，`Proxy` 会调用目标对象的默认内部方法，这种“透明代理”的特性让 `Proxy` 非常灵活。

## Reflect 的更多用途
除了在响应式系统中调整 `this` 指向，`Reflect` 还有其他用途。例如，`Reflect.defineProperty` 提供了更安全的属性定义方式，`Reflect.apply` 可以更精确地控制函数调用的上下文。这些方法为开发者提供了更细粒度的操作控制，尤其在复杂场景下（如 Vue.js 的响应式系统）非常有用。

