## 一、响应式系统的核心：拦截与追踪
响应式系统的目标是当数据发生变化时，自动触发相关的副作用函数（如更新 UI）。这需要我们拦截数据的读取和修改操作，并在适当的时候触发更新。JavaScript 的 `Proxy` 对象为我们提供了强大的能力，可以捕获对象的所有基本操作。

### 1. 拦截读取操作
对于普通对象的属性读取（如 `obj.foo`），我们可以通过 `Proxy` 的 `get` 拦截函数来实现：

```javascript
const obj = { foo: 1 }
const p = new Proxy(obj, {
  get(target, key, receiver) {
    track(target, key) // 追踪依赖，建立响应联系
    return Reflect.get(target, key, receiver)
  }
})
```

这里的 `track` 函数负责记录当前操作的副作用函数（通常是通过 `effect` 函数注册的），将其与目标对象的 `key` 关联起来。当我们访问 `p.foo` 时，`track` 会将当前的副作用函数与 `foo` 属性绑定。

### 2. 拦截 in 操作符
`in` 操作符（如 `'foo' in obj`）也是一种读取操作。根据 ECMAScript 规范，`in` 操作符会调用对象的 `[[HasProperty]]` 内部方法，对应的 `Proxy` 拦截函数是 `has`：

```javascript
const p = new Proxy(obj, {
  has(target, key) {
    track(target, key)
    return Reflect.has(target, key)
  }
})
```

通过 `has` 拦截函数，我们可以在 `'foo' in p` 时建立副作用函数与 `key` 的响应联系。

### 3. 拦截 for...in 循环
`for...in` 循环依赖于 `Reflect.ownKeys` 获取对象的键，因此可以通过 `ownKeys` 拦截函数来追踪：

```javascript
const ITERATE_KEY = Symbol()
const p = new Proxy(obj, {
  ownKeys(target) {
    track(target, ITERATE_KEY)
    return Reflect.ownKeys(target)
  }
})
```

由于 `for...in` 循环涉及对象的键集合，我们使用唯一的 `ITERATE_KEY` 作为标识，记录副作用函数与整个键集合的依赖关系。

### 4. 触发响应
当对象属性被修改或添加时，需要触发与该属性相关的副作用函数。`set` 拦截函数可以处理属性的设置操作：

```javascript
const p = new Proxy(obj, {
  set(target, key, newVal, receiver) {
    const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
    const res = Reflect.set(target, key, newVal, receiver)
    trigger(target, key, type)
    return res
  }
})
```

`trigger` 函数会根据操作类型（`SET` 或 `ADD`）取出与 `key` 或 `ITERATE_KEY` 相关的副作用函数并执行：

```javascript
function trigger(target, key, type) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const iterateEffects = depsMap.get(ITERATE_KEY)
  const effectsToRun = new Set()

  effects?.forEach(effectFn => {
    if (effectFn !== activeEffect) effectsToRun.add(effectFn)
  })

  if (type === 'ADD' || type === 'DELETE') {
    iterateEffects?.forEach(effectFn => {
      if (effectFn !== activeEffect) effectsToRun.add(effectFn)
    })
  }

  effectsToRun.forEach(effectFn => {
    effectFn.options?.scheduler ? effectFn.options.scheduler(effectFn) : effectFn()
  })
}
```

这里我们区分了 `SET`（修改已有属性）和 `ADD`（添加新属性），因为添加或删除属性会影响 `for...in` 循环的执行，需要触发与 `ITERATE_KEY` 相关的副作用函数。

---

## 二、优化响应触发
为了让响应式系统更高效，我们需要避免不必要的副作用函数执行。

### 1. 避免重复触发
当设置属性值时，如果新值与旧值相同（考虑 `NaN` 的特殊性），应避免触发响应：

```javascript
set(target, key, newVal, receiver) {
  const oldVal = target[key]
  const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
  const res = Reflect.set(target, key, newVal, receiver)
  if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
    trigger(target, key, type)
  }
  return res
}
```

这里通过 `oldVal !== newVal` 判断值是否变化，同时用 `oldVal === oldVal || newVal === newVal` 排除 `NaN` 的干扰（因为 `NaN !== NaN`）。

### 2. 处理原型链问题
当对象继承了原型属性时，访问和设置操作可能导致副作用函数重复执行。例如：

```javascript
const obj = {}
const proto = { bar: 1 }
const child = reactive(obj)
const parent = reactive(proto)
Object.setPrototypeOf(child, parent)

effect(() => {
  console.log(child.bar) // 1
})
child.bar = 2 // 触发两次副作用函数
```

原因是访问 `child.bar` 会触发 `child` 和 `parent` 的 `get` 拦截，而设置 `child.bar` 会触发两者的 `set` 拦截。我们可以通过检查 `receiver` 是否是 `target` 的代理对象来避免原型引起的重复触发：

```javascript
function reactive(obj) {
  const existionProxy = reactiveMap.get(obj)
  if (existionProxy) return existionProxy
  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') return target
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, newVal, receiver) {
      const oldVal = target[key]
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, newVal, receiver)
      if (target === receiver.raw && oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
        trigger(target, key, type)
      }
      return res
    }
  })
  reactiveMap.set(obj, proxy)
  return proxy
}
```

通过 `target === receiver.raw` 判断，只有当操作的是目标对象的代理时才触发响应，从而避免原型链的干扰。

---

## 三、深响应与浅响应
默认的 `reactive` 函数实现的是深响应，即嵌套对象的属性变化也会触发响应：

```javascript
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') return target
      if (!isReadonly && typeof key !== 'symbol') track(target, key)
      const res = Reflect.get(target, key, receiver)
      if (isShallow) return res
      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) : reactive(res)
      }
      return res
    }
  })
}
```

在 `get` 拦截中，如果读取的属性值是对象，则递归调用 `reactive` 将其包装为响应式对象。而 `shallowReactive` 只对第一层属性响应：

```javascript
function reactive(obj) {
  return createReactive(obj)
}
function shallowReactive(obj) {
  return createReactive(obj, true)
}
```

### 只读与浅只读
只读数据（如组件的 `props`）需要防止修改。我们可以通过 `isReadonly` 参数实现：

```javascript
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`)
        return true
      }
      // ... 正常 set 逻辑
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`)
        return true
      }
      // ... 正常 delete 逻辑
    }
  })
}
function readonly(obj) {
  return createReactive(obj, false, true)
}
function shallowReadonly(obj) {
  return createReactive(obj, true, true)
}
```

只读模式下，`set` 和 `deleteProperty` 会抛出警告，且不建立响应联系（`get` 中不调用 `track`）。

---

## 四、代理数组的特殊处理
数组是 JavaScript 中的异质对象，其 `[[DefineOwnProperty]]` 内部方法与普通对象不同。以下是数组的特殊处理：

### 1. 索引与 length
设置数组索引可能隐式修改 `length` 属性。例如，`arr[1] = 'bar'` 会将 `length` 改为 2：

```javascript
set(target, key, newVal, receiver) {
  if (isReadonly) {
    console.warn(`属性 ${key} 是只读的`)
    return true
  }
  const oldVal = target[key]
  const type = Array.isArray(target)
    ? Number(key) < target.length ? 'SET' : 'ADD'
    : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
  const res = Reflect.set(target, key, newVal, receiver)
  if (target === receiver.raw && oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
    trigger(target, key, type, newVal)
  }
  return res
}
```

在 `trigger` 中，当操作是 `ADD` 且目标是数组时，触发与 `length` 相关的副作用函数：

```javascript
function trigger(target, key, type, newVal) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectsToRun = new Set()
  effects?.forEach(effectFn => {
    if (effectFn !== activeEffect) effectsToRun.add(effectFn)
  })
  if (type === 'ADD' || type === 'DELETE') {
    const iterateEffects = depsMap.get(ITERATE_KEY)
    iterateEffects?.forEach(effectFn => {
      if (effectFn !== activeEffect) effectsToRun.add(effectFn)
    })
  }
  if (type === 'ADD' && Array.isArray(target)) {
    const lengthEffects = depsMap.get('length')
    lengthEffects?.forEach(effectFn => {
      if (effectFn !== activeEffect) effectsToRun.add(effectFn)
    })
  }
  if (Array.isArray(target) && key === 'length') {
    depsMap.forEach((effects, key) => {
      if (key >= newVal) {
        effects.forEach(effectFn => {
          if (effectFn !== activeEffect) effectsToRun.add(effectFn)
        })
      }
    })
  }
  effectsToRun.forEach(effectFn => {
    effectFn.options?.scheduler ? effectFn.options.scheduler(effectFn) : effectFn()
  })
}
```

### 2. 遍历数组
`for...in` 遍历数组时，使用 `length` 作为追踪键：

```javascript
ownKeys(target) {
  track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
  return Reflect.ownKeys(target)
}
```

`for...of` 遍历依赖 `Symbol.iterator`，数组的迭代器会访问 `length` 和索引，因此无需额外处理即可响应。

### 3. 数组查找方法
数组的 `includes`、`indexOf` 等方法可能因代理对象不同导致问题。例如：

```javascript
const obj = {}
const arr = reactive([obj])
console.log(arr.includes(arr[0])) // true
console.log(arr.includes(obj)) // false
```

原因是 `arr[0]` 返回代理对象，而 `includes` 内部获取的也是代理对象，但两者不是同一个对象。解决方案是缓存原始对象到代理的映射，并重写 `includes`：

```javascript
const reactiveMap = new Map()
function reactive(obj) {
  const existionProxy = reactiveMap.get(obj)
  if (existionProxy) return existionProxy
  const proxy = createReactive(obj)
  reactiveMap.set(obj, proxy)
  return proxy
}

const arrayInstrumentations = {}
;['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrayInstrumentations[method] = function(...args) {
    let res = originMethod.apply(this, args)
    if (res === false || res === -1) {
      res = originMethod.apply(this.raw, args)
    }
    return res
  }
})
```

### 4. 隐式修改长度的方法
`push`、`pop` 等方法会修改 `length`，可能导致无限递归。我们通过 `shouldTrack` 标志避免追踪 `length`：

```javascript
let shouldTrack = true
;['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrayInstrumentations[method] = function(...args) {
    shouldTrack = false
    let res = originMethod.apply(this, args)
    shouldTrack = true
    return res
  }
})

function track(target, key) {
  if (!activeEffect || !shouldTrack) return
  // ... 正常 track 逻辑
}
```

---

## 五、代理 Set 和 Map
`Set` 和 `Map` 是集合类型，操作方式与普通对象不同。我们需要重写其方法（如 `add`、`set`）来实现响应式。

### 1. 修复 this 指向
`Set.prototype.size` 和方法（如 `add`）的 `this` 必须指向原始对象：

```javascript
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') return target
      if (key === 'size') {
        track(target, ITERATE_KEY)
        return Reflect.get(target, key, target)
      }
      return target[key].bind(target)
    }
  })
}
```

### 2. 重写集合方法
通过 `mutableInstrumentations` 重写 `add`、`set` 等方法：

```javascript
const mutableInstrumentations = {
  add(key) {
    const target = this.raw
    const hadKey = target.has(key)
    const res = target.add(key)
    if (!hadKey) trigger(target, key, 'ADD')
    return res
  },
  set(key, value) {
    const target = this.raw
    const had = target.has(key)
    const oldValue = target.get(key)
    const rawValue = value.raw || value
    target.set(key, rawValue)
    if (!had) {
      trigger(target, key, 'ADD')
    } else if (oldValue !== value || (oldValue === oldValue && value === value)) {
      trigger(target, key, 'SET')
    }
  }
}
```

### 3. 避免数据污染
设置值时需检查是否为响应式数据，若是则使用原始数据：

```javascript
const rawValue = value.raw || value
target.set(key, rawValue)
```

### 4. 处理 forEach 和迭代器
`forEach` 和迭代器方法（如 `entries`）需要包装参数为响应式数据，并与 `ITERATE_KEY` 建立联系：

```javascript
const mutableInstrumentations = {
  forEach(callback, thisArg) {
    const wrap = val => typeof val === 'object' && val !== null ? reactive(val) : val
    const target = this.raw
    track(target, ITERATE_KEY)
    target.forEach((v, k) => callback.call(thisArg, wrap(v), wrap(k), this))
  },
  [Symbol.iterator]: iterationMethod,
  entries: iterationMethod
}

function iterationMethod() {
  const target = this.raw
  const itr = target[Symbol.iterator]()
  const wrap = val => typeof val === 'object' && val !== null ? reactive(val) : val
  track(target, ITERATE_KEY)
  return {
    next() {
      const { value, done } = itr.next()
      return {
        value: value ? [wrap(value[0]), wrap(value[1])] : value,
        done
      }
    },
    [Symbol.iterator]() {
      return this
    }
  }
}
```

对于 `keys` 方法，使用 `MAP_KEY_ITERATE_KEY` 避免不必要的触发：

```javascript
const MAP_KEY_ITERATE_KEY = Symbol()
function keysIterationMethod() {
  const target = this.raw
  const itr = target.keys()
  const wrap = val => typeof val === 'object' ? reactive(val) : val
  track(target, MAP_KEY_ITERATE_KEY)
  return {
    next() {
      const { value, done } = itr.next()
      return { value: wrap(value), done }
    },
    [Symbol.iterator]() {
      return this
    }
  }
}
```



