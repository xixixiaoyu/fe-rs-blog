### 为什么我们要减少 if...else？

if...else 本身没啥问题，但用多了容易让代码变得像一团乱麻。比如嵌套太多时，逻辑不好理清；或者需求变了，你得在密密麻麻的条件里找地方改，稍不小心就出错。所以，我们的目标是让代码更直观、更灵活，减少冗余的判断。

下面我给你分享 6 个实用方法。



### 1.对象映射法：简单枚举值的最佳拍档

如果你的条件判断是基于一些固定的值（比如状态、类型），可以用对象来映射对应的操作或结果。

假设你在写一个状态显示的功能，根据状态值调用不同的函数：

```js
// 优化前
function showStatus(status) {
  if (status === 'pending') {
    showPending()
  } else if (status === 'success') {
    showSuccess()
  } else if (status === 'error') {
    showError()
  }
}
```

我们可以用一个对象把状态和函数对应起来：

```js
function showStatus(status) {
  const statusMap = {
    pending: showPending,
    success: showSuccess,
    error: showError
  }
  statusMap[status]?.() || console.log('状态不存在')
}
```

这时想加个新状态？直接在 statusMap 里加一项就行，不用改逻辑。



### 2.策略模式

当每个分支的逻辑比较复杂时，对象映射可能不够用，这时候策略模式就派上场了。它本质上是把每个分支的处理逻辑封装成独立的策略。

假设你有个表单校验功能，要根据不同的规则验证输入：

```js
// 优化前
function validate(input, rule) {
  if (rule === 'email') {
    return /@/.test(input)
  } else if (rule === 'minLength') {
    return input.length >= 6
  } else if (rule === 'required') {
    return !!input
  }
}
```

我们可以把每种校验规则定义成独立函数，集中管理：

```js
const validators = {
  email: (val) => /@/.test(val),
  minLength: (val) => val.length >= 6,
  required: (val) => !!val
}

function validate(input, rules) {
  return rules.every(rule => validators[rule](input))
}

// 使用
const isValid = validate('test@example.com', ['email', 'required'])
```

主函数只管调度，不管具体实现，职责更清晰，而且每种校验逻辑独立，改一个不会影响到其他。



### 3.多态替代：面向对象的优雅解法

如果你喜欢面向对象编程（OOP），可以用多态来消灭 if...else。

假设不同类型的用户需要展示不同的个人主页：

```js
// 优化前
function showProfile(userType) {
  if (userType === 'admin') {
    showAdminPanel()
  } else if (userType === 'member') {
    showMemberPanel()
  }
}
```

用类和继承来实现：

```js
abstract class User {
  abstract showProfile()
}

class Admin extends User {
  showProfile() {
    showAdminPanel()
  }
}

class Member extends User {
  showProfile() {
    showMemberPanel()
  }
}

function display(user: User) {
  user.showProfile()
}

// 使用
const admin = new Admin()
display(admin)
```

每个类型的逻辑完全隔离，扩展时只管加新类。调用方不需要关心具体类型，符合“开闭原则”。



### 4.状态机：状态流转的利器

如果你的代码涉及状态之间的跳转，状态机是个很棒的选择。

比如订单状态流转：

```js
// 优化前
function nextState(current) {
  if (current === 'pending') {
    return 'processing'
  } else if (current === 'processing') {
    return 'completed'
  } else {
    return current
  }
}
```

用状态机来定义流转规则：

```js
const stateMachine = {
  pending: { next: 'processing' },
  processing: { next: 'completed' }
}

function nextState(current) {
  return stateMachine[current]?.next || current
}
```

状态和流转规则一目了然，扩展新状态只用改配置，不用动逻辑。



### 5.卫语句：干掉深层嵌套

嵌套的 if...else 是代码可读性的杀手，用卫语句（提前返回）可以让逻辑更平铺直叙。

处理用户输入：

```js
// 优化前
function processInput(input) {
  if (input) {
    if (input.length > 0) {
      console.log('处理:', input)
    } else {
      console.log('输入为空')
    }
  } else {
    console.log('输入不存在')
  }
}
```

提前处理异常情况：

```js
function processInput(input) {
  if (!input) return console.log('输入不存在')
  if (input.length === 0) return console.log('输入为空')
  console.log('处理:', input)
}
```

去掉了嵌套，主逻辑更突出。



### 6.配置化处理：动态规则的妙招

当条件逻辑会频繁变化时，可以用配置来替代硬编码的判断。

比如权限控制：

```js
// 优化前
function checkPermission(role, action) {
  if (role === 'admin' && (action === 'create' || action === 'delete')) {
    return true
  } else if (role === 'user' && action === 'view') {
    return true
  }
  return false
}
```

用配置表：

```js
const permissions = {
  admin: ['create', 'delete'],
  user: ['view']
}

function checkPermission(role, action) {
  return permissions[role]?.includes(action) || false
}
```

权限规则变成数据，改动时只用调整配置。



### 怎么选对方法？

这么多方法，怎么选呢？我给你个小指南：

- **简单分支**：用对象映射，干净利落。
- **复杂校验**：策略模式，逻辑清晰。
- **状态转换**：状态机，适合流程化。
- **类型差异**：多态，OOP 的好帮手。
- **深层嵌套**：卫语句，平铺逻辑。
- **动态规则**：配置化，灵活应对变化。

另外，结合 TypeScript 的类型守卫和组件化拆分，还能进一步减少不必要的条件判断。不过别为了优化而优化，关键还是根据你的业务场景选最合适的方案。



### 最后聊聊

减少 if...else 的核心思路是**抽象和解耦**。把条件逻辑变成映射、策略或者配置，代码不仅更简洁，还能应对未来的变化。