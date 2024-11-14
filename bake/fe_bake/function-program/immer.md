## Produce 工作原理：将拷贝操作精准化
immer 使用很傻瓜，仅仅是在项目里轻轻地 Import 一个 produce：
```javascript
import produce from "immer"

// 这是我的源数据
const baseState = [
    {
        name: "云牧",
        age: 99
    },
    {
        name: "秀妍",
        age: 100
    }
]

// 定义数据的写逻辑
const recipe = draft => {
    draft.push({name: "yunmu", age: 101})
    draft[1].age = 102
}

// 借助 produce，执行数据的写逻辑
const nextState = produce(baseState, recipe)
```

- produce：入口函数，它负责把上述要素串起来。
- (base)state：源数据，是我们想要修改的目标数据。
- recipe：一个函数，我们可以在其中描述数据的写逻辑
   - draft：recipe 函数的默认入参，它是对源数据的代理，我们可以把想要应用在源数据的变更应用在 draft 上。

## Immer.js 是如何工作的
Immer.js 使用 Proxy，对目标对象的行为进行“元编程”。<br />所谓“元编程”，指的是对编程语言进行再定义。<br />借助 Proxy，我们可以给目标对象创建一个代理（拦截）层、拦截原生对象的某些默认行为，进而实现对目标行为的自定义。


## Produce 关键逻辑抽象
Immer.js 的一切奥秘都蕴含在 produce 里，包括其对 Proxy 的运用。<br />这里我们只关注 produce 函数的核心逻辑，我将其提取为如下的极简版本：
```javascript
function produce(base, recipe) {
  // 预定义一个 copy 副本
  let copy
  // 定义 base 对象的 proxy handler
  const baseHandler = {
    set(obj, key, value) {
      // 先检查 copy 是否存在，如果不存在，创建 copy
      if (!copy) {
        copy = { ...base }
      }
      // 如果 copy 存在，修改 copy，而不是 base
      copy[key] = value
      return true
    }
  }

  // 被 proxy 包装后的 base 记为 draft
  const draft = new Proxy(base, baseHandler)
  // 将 draft 作为入参传入 recipe
  recipe(draft)
  // 返回一个被“冻结”的 copy，如果 copy 不存在，表示没有执行写操作，返回 base 即可
  // “冻结”是为了避免意外的修改发生，进一步保证数据的纯度
  return Object.freeze(copy || base)
}
```
对这个超简易版的 producer 进行一系列的调用：
```javascript
// 这是我的源对象
const baseObj = {
	a: 1,
	b: {
		name: '云牧',
	},
}

// 这是一个执行写操作的 recipe
const changeA = draft => {
	draft.a = 2
}

// 这是一个不执行写操作、只执行读操作的 recipe
const doNothing = draft => {
	console.log('doNothing function is called, and draft is', draft)
}

// 借助 produce，对源对象应用写操作，修改源对象里的 a 属性
const changedObjA = produce(baseObj, changeA)

// 借助 produce，对源对象应用读操作
const doNothingObj = produce(baseObj, doNothing)

// 顺序输出3个对象，确认写操作确实生效了
console.log(baseObj)
console.log(changedObjA)
console.log(doNothingObj)

// 【源对象】 和 【借助 produce 对源对象执行过读操作后的对象】 还是同一个对象吗？
// 答案为 true
console.log(baseObj === doNothingObj)
// 【源对象】 和 【借助 produce 对源对象执行过写操作后的对象】 还是同一个对象吗？
// 答案为 false
console.log(baseObj === changedObjA)
// 源对象里没有被执行写操作的 b 属性，在 produce 执行前后是否会发生变化？
// 输出为 true，说明不会发生变化
console.log(baseObj.b === changedObjA.b)
```
执行结果：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690471122552-4232ff3c-13df-482e-afaf-641402cdeb1e.png#averageHue=%23414346&clientId=ub9c22269-0089-4&from=paste&height=186&id=ucfb2fa0a&originHeight=372&originWidth=1578&originalType=binary&ratio=2&rotation=0&showTitle=false&size=52586&status=done&style=none&taskId=uf72fafc6-ec5d-4e43-98c9-7f26a304066&title=&width=789)<br />**只要写操作没执行，拷贝动作就不会发生**。<br />只有当写操作确实执行，也就是当我们试图修改 baseObj 的 a 属性时，produce 才会去执行拷贝动作。<br />逐层的浅拷贝，则间接地实现了数据在新老对象间的共享。

## 拓展：“知其所止”的“逐层拷贝”
完整版 produce 的浅拷贝其实是**可递归**的。<br />在本文的案例中，baseObj 是一个嵌套对象，一共有两层：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690471681482-6ba951a0-7ecc-4ffd-89a7-308b4ecd924c.png#averageHue=%23242528&clientId=ub9c22269-0089-4&from=paste&height=108&id=uf7df18b2&originHeight=216&originWidth=440&originalType=binary&ratio=2&rotation=0&showTitle=false&size=21158&status=done&style=none&taskId=ua025a787-e9d1-4406-8fd5-1b79d6833fc&title=&width=220)<br />如果我对 b 属性执行了写操作：
```javascript
import produce from "immer";

// 这是一个执行引用类型写操作的 recipe
const changeB = (draft) => {
  draft.b.name = " 修个锤子"
}

// 借助 produce 调用 changeB
const changedObjB = produce(baseObj, changeB)
// 【源对象】 和 【借助 produce 对源对象执行过写操作后的对象】 还是同一个对象吗？
// 答案为 false
console.log(baseObj === changedObjB)
// 【b 属性】 和 【借助 produce 修改过的 b 属性】 还是同一个对象吗？
// 答案为 false
console.log(baseObj.b === changedObjB.b)
```
对于嵌套的对象来说，**数据内容的变化和引用的变化也能同步发生**。<br />当写操作发生时，setter 方法就会被逐层触发，呈现“逐层浅拷贝”的效果。这是 **Immer 实现数据共享的关键。**
