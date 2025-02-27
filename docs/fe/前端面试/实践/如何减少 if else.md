写代码的时候，一个个 if/else 堆上去，逻辑看着像搭积木，越搭越高，最后自己都头晕？这不仅让代码变得臃肿，后续维护的时候也容易出错。其实，在前端开发中，减少 if/else 的使用可以让代码更简洁、更容易维护。



### 1.用策略模式干掉分支堆砌

假如你需要在不同条件下执行不同的逻辑，比如支付场景里根据类型调用不同的支付方式，传统的 if/else 写法可能长这样：

```js
function pay(type) {
  if (type === 'wechat') {
    wechatPay()
  } else if (type === 'alipay') {
    alipayPay()
  } else {
    console.log('不支持的支付方式')
  }
}
```

看着还行，但如果支付方式再多几种，代码就变得又臭又长。咱们可以用**策略模式**来优化：把每种逻辑封装成一个函数，用对象存起来，需要的时候直接拿来用。

```js
const paymentStrategies = {
  wechat: () => wechatPay(),
  alipay: () => alipayPay(),
  default: () => console.log('不支持的支付方式')
}

function pay(type) {
  paymentStrategies[type]?.() || paymentStrategies.default()
}
```

这样多爽啊！不仅代码变短了，想加新支付方式也简单 —— 直接往 paymentStrategies 里加个键值对就行。Vue 或 React 项目里处理动态表单提交、事件分发的时候，这个方法特别好使。



### 2.多态或状态模式，应对复杂状态流转

有些业务逻辑，比如订单状态管理，状态之间会互相跳转，传统写法可能是一堆条件判断嵌套，看着就头疼。比如：

```js
function handleOrder(state, action) {
  if (state === 'pending' && action === 'confirm') {
    return 'confirmed'
  } else if (state === 'confirmed' && action === 'ship') {
    return 'shipped'
  } else {
    return state
  }
}
```

这种代码改起来费劲，状态多了还容易漏逻辑。咱们可以用**状态模式**来优化，把每个状态的行为单独定义好

```js
const stateMachine = {
  pending: {
    confirm: () => 'confirmed',
    cancel: () => 'canceled'
  },
  confirmed: {
    ship: () => 'shipped'
  }
}

function handleOrder(state, action) {
  return stateMachine[state]?.[action]?.() || state
}
```

这样每个状态的逻辑都独立了，改代码的时候只需要调整对应状态的处理函数，既清晰又安全。React 里用状态机库（如 XState）或者自己手写都很常见。



### 3.提前返回，拒绝嵌套地狱

条件检查是代码里最常见的场景，但嵌套太多会让逻辑变得难以追踪。比如：

```js
function processData(data) {
  if (data) {
    if (data.length > 0) {
      // 处理逻辑
    } else {
      console.log('数据为空')
    }
  } else {
    console.log('数据不存在')
  }
}
```

这种嵌套看着就累，咱们可以用**提前返回**把异常情况先处理掉：

```js
function processData(data) {
  if (!data) return console.log('数据不存在')
  if (data.length === 0) return console.log('数据为空')
  // 处理逻辑
}
```

主逻辑一下子就扁平了，读起来也顺畅多了。表单校验、API 数据处理时，这个方法能大大提高代码可读性。



### 4.配置化处理，把规则交给数据

有时候条件判断是基于一堆动态规则，比如判断用户能不能领优惠券。传统写法可能是：

```js
function handleUser(user) {
  if (user.vipLevel > 5) {
    sendPremiumGift(user)
  } else if (user.activityJoined) {
    sendActivityCoupon(user)
  }
}
```

如果规则经常变，每次都要改代码，太麻烦了。咱们可以用**配置化**的方式，把规则和处理逻辑写成一个表：

```js
const RULE_CONFIG = [
  { condition: user => user.vipLevel > 5, handler: sendPremiumGift },
  { condition: user => user.activityJoined, handler: sendActivityCoupon }
]

function handleUser(user) {
  const rule = RULE_CONFIG.find(r => r.condition(user))
  rule?.handler(user)
}
```

这样规则一目了然，想加新规则直接往数组里插个对象就行，代码完全不用动。React 项目里处理权限控制、动态提示的时候，这个思路特别实用。



### 5.责任链模式，顺序处理多条件

如果你的逻辑需要按顺序检查多个条件，比如表单校验，传统的写法可能是连串的 if：

```js
function validate(input) {
  if (!input) return false
  if (input.length < 5) return false
  if (!/[a-z]/.test(input)) return false
  return true
}
```

这还好，但如果校验逻辑复杂起来，代码就不好维护了。咱们可以用**责任链模式**，把每步校验拆成独立函数：

```js
class ValidatorChain {
  constructor() {
    this.chain = []
  }

  add(validator) {
    this.chain.push(validator)
    return this
  }

  run(input) {
    return this.chain.every(fn => fn(input))
  }
}

const validator = new ValidatorChain()
  .add(input => !!input)
  .add(input => input.length >= 5)
  .add(input => /[a-z]/.test(input))

console.log(validator.run('test123'))
```



### 6.善用 TypeScript 类型系统

如果你用 TypeScript，有些运行时的类型判断其实可以交给类型系统。比如判断一个元素是不是按钮：

```js
function handleClick(element: HTMLElement) {
  if (element.tagName === 'BUTTON') {
    (element as HTMLButtonElement).disabled = true
  }
}
```

可以用**类型守卫**优化：

```js
function isButton(element: HTMLElement): element is HTMLButtonElement {
  return element.tagName === 'BUTTON'
}

function handleClick(element: HTMLElement) {
  if (isButton(element)) {
    element.disabled = true  // TS 自动推断类型
  }
}
```

这样不仅去掉了类型断言，还让代码更安全，编译时就能发现问题。TS 项目里处理 DOM 操作时，这个技巧能省不少心。



#### **一点小建议**

这些方法虽然好用，但也不是万能药。我的经验是：

1. **简单条件别强行优化**：如果只有一两个分支，直接用 if 可能更直观。
2. **可读性优先**：别为了减少 if/else 牺牲代码的清晰度。
3. **高频改动的逻辑尽量解耦**：用策略模式或配置化，能让后续调整更轻松。
4. **结合框架特性**：Vue 的计算属性、React 的 Hooks 都能帮你少写条件。

这些技巧在实际项目里，比如表单校验、状态管理、支付流程优化中都很常见。关键是根据业务复杂度选对方法，别一味追求形式。