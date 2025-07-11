## 1. 渲染的三种模式：CSR、SSR 与同构
要做出正确的选择，我们首先得弄明白这几个概念到底是什么。

### 客户端渲染 (Client-Side Rendering, CSR)
这是目前单页应用 (SPA) 最主流的渲染模式。它的工作流程大致是这样的：

1. 浏览器向服务器请求页面。
2. 服务器返回一个几乎空白的 HTML 文件，里面只有一个 `<div id="app"></div>` 和一些指向 CSS、JavaScript 文件的链接。
3. 浏览器下载并执行这些 JavaScript 文件。
4. JavaScript 代码接管页面，开始请求数据、渲染组件，最终将内容填充到 `#app` 容器里。

在这个过程中，用户会先看到一个短暂的“白屏”，直到 JavaScript 加载执行完毕，页面内容才会出现。

+ **优点**：用户首次加载后，页面切换和交互非常流畅，就像在操作一个桌面应用。服务器压力小，因为它只负责提供静态文件。
+ **缺点**：**首屏加载慢**，存在“白屏”问题。对 **SEO (搜索引擎优化) 不友好**，因为搜索引擎爬虫抓取到的初始 HTML 是空的，看不到实质内容。

### 服务端渲染 (Server-Side Rendering, SSR)
这其实是一种“复古”的技术，在 PHP、JSP 流行的年代，网站基本都是这么做的。

1. 浏览器向服务器请求页面。
2. 服务器获取数据，将数据和模板在后端拼接成一个完整的 HTML 字符串。
3. 服务器将这个渲染好的 HTML 直接返回给浏览器。
4. 浏览器接收到即可立即显示完整页面。
+ **优点**：**首屏加载快**，用户能迅速看到页面内容，没有白屏问题。**SEO 友好**，因为返回的 HTML 是包含完整内容的。
+ **缺点**：每次页面跳转都需要服务器重新走一遍流程，用户体验上会有明显的“刷新感”，不够流畅。服务器需要处理渲染逻辑，**占用资源更多**。

### 同构渲染 (Isomorphic Rendering)
既然 CSR 和 SSR 各有优劣，我们能不能把它们的优点结合起来呢？当然可以，这就是同构渲染的魅力所在。

“同构”意味着同一套代码（比如你的 Vue 组件）既可以在服务端运行，也可以在客户端运行。它的工作流程是这样的：

1. **首次访问**：流程和 SSR 完全一样。服务器渲染出完整的 HTML 页面并返回给浏览器。用户能立刻看到内容，SEO 问题也解决了。
2. **客户端激活 (Hydration)**：浏览器在展示静态页面的同时，会下载并执行 JavaScript。但这次 JS 不会重新创建 DOM，而是会“接管”或“激活”已经存在的静态 DOM，为它们绑定事件监听器，让页面变得可交互。这个过程完成后，你的应用就变成了一个标准的 CSR 应用。
3. **后续操作**：之后所有的页面导航和交互都和 CSR 一样，通过前端路由实现，无需刷新页面，保证了流畅的用户体验。

简单来说，同构渲染就是 **“首次加载用 SSR，后续交互用 CSR”**。

| 特性 | 传统 SSR | CSR | 同构渲染 |
| :--- | :--- | :--- | :--- |
| **SEO** | 友好 | 不友好 | **友好** |
| **白屏问题** | 无 | 有 | **无** |
| **服务端资源** | 多 | 少 | 中 |
| **用户体验** | 差 | 好 | **好** |


需要注意的是，同构渲染并不能缩短**可交互时间 (TTI)**。因为页面虽然很快显示出来了，但仍然需要等待 JavaScript 下载并执行完毕、完成“激活”之后，才能响应用户的点击等操作。



## 2. Vue 是如何把虚拟 DOM 渲染成字符串的？
同构渲染的核心之一，就是在服务端将 Vue 组件（本质上是虚拟 DOM）转换成 HTML 字符串。这个过程其实就是一连串的字符串拼接。

我们来看一个简单的虚拟节点 (VNode) 对象：

```javascript
const vnode = {
  type: 'div',
  props: {
    id: 'foo'
  },
  children: [
    { type: 'p', children: 'hello' }
  ]
}
```

要把它渲染成 `<div id="foo"><p>hello</p></div>`，我们可以写一个简单的递归函数：

```javascript
function renderElementVNode(vnode) {
  // 1. 拼接开始标签和属性
  const { type: tag, props, children } = vnode
  let ret = `<${tag}`
  if (props) {
    for (const key in props) {
      ret += ` ${key}="${props[key]}"`
    }
  }
  ret += `>`

  // 2. 递归处理子节点
  if (typeof children === 'string') {
    ret += children
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      // 递归调用，处理子节点
      ret += renderElementVNode(child)
    })
  }

  // 3. 拼接结束标签
  ret += `</${tag}>`
  return ret
}
```

当然，一个生产级的实现要复杂得多，需要考虑很多边界情况：

+ **自闭合标签**：像 `<img>`, `<br>` 这样的标签没有闭合标签，需要特殊处理。
+ **属性处理**：
    - 需要忽略 `key`, `ref` 等仅用于客户端的内部属性。
    - 需要正确处理 `disabled` 这样的布尔属性。
    - 需要验证属性名的合法性，防止注入不安全的属性。
+ **安全性**：为了防止 XSS 攻击，所有用户提供的内容（文本和属性值）都必须进行 HTML 转义，比如把 `<` 转换成 `&lt;`，把 `"` 转换成 `&quot;`。

对于**组件**的渲染，原理也很直观：执行组件的 `setup` 或 `render` 函数，得到它要渲染的子树 (subTree)，也就是另一个 VNode，然后递归地去渲染这个子树。

一个关键的区别是，在服务端渲染时，数据不需要是响应式的。因为服务端渲染只是一个“一次性”的快照，不存在数据变化后更新视图的场景。这可以省去创建响应式对象的开销，提升性能。



## 3. 客户端激活 (Hydration) 的魔法
当服务器渲染的 HTML 到达浏览器后，页面虽然可见，但却是“死的”——没有交互能力。这时，客户端的 JavaScript 就需要登场，让这个静态页面“活”过来。这个过程就是**激活 (Hydration)**。

激活主要做两件事：

1. **建立联系**：遍历虚拟 DOM 树和真实的 DOM 树，将 VNode 节点和页面上已经存在的 DOM 元素一一对应起来（通过 `vnode.el = element`）。
2. **绑定事件**：为 DOM 元素添加在服务端被忽略的事件监听器，比如 `@click`。

Vue 的渲染器通过 `hydrate` 函数来执行这个过程。它会从根容器的第一个子节点开始，递归地对比 VNode 和真实 DOM。如果发现类型不匹配（比如 VNode 是 `<div>`，而真实 DOM 是 `<span>`），就会发出警告，这通常意味着服务端和客户端渲染的内容不一致，需要开发者去排查。

通过激活，Vue 成功地在不重新创建 DOM 的情况下，接管了整个页面，为后续的客户端交互做好了准备。



## 4. 编写同构代码的艺术
既然同一套代码要跑在两个不同的环境（Node.js 和浏览器），我们在写代码时就需要特别注意一些事情。

### 1. 注意生命周期钩子
在服务端，组件的渲染流程是“即时”的，不会有挂载到真实 DOM、更新、卸载等过程。因此，只有 `beforeCreate` 和 `created` 这两个钩子会在服务端执行。

像 `mounted`, `updated`, `beforeUnmount` 等钩子都**只会在客户端执行**。

一个常见的错误是在 `created` 里设置定时器 `setInterval`，却没有在 `beforeUnmount` 里清除。这在服务端会造成内存泄漏，因为 `beforeUnmount` 永远不会被调用。

**正确做法**：将这类只应在客户端执行的逻辑（如 DOM 操作、定时器、事件监听）放到 `onMounted` 钩子中。

### 2. 使用跨平台 API
避免直接使用平台特有的全局变量，比如浏览器的 `window`、`document`，或者 Node.js 的 `process`。

如果必须使用，可以用构建工具提供的环境变量（如 Vite 的 `import.meta.env.SSR`）来做判断：

```javascript
if (!import.meta.env.SSR) {
  // 这段代码只会在客户端执行
  const screenWidth = window.innerWidth
}
```

对于网络请求等常见需求，最好选择像 Axios 这样本身就支持跨平台的库。

### 3. 避免状态污染
在服务器上，多个用户的请求会共享同一个 Node.js 进程。如果你在组件的顶层作用域定义了一个变量，它就会变成一个“单例”状态，被所有请求共享，从而导致一个用户的数据泄露给另一个用户。

**错误示例**：

```javascript
// 这是一个模块级别的变量，会被所有请求共享
let count = 0

export default {
  created() {
    count++ // 每个用户的请求都会累加这个 count
  }
}
```

**正确做法**：始终遵循 **“一个请求，一个应用实例”** 的原则。将状态封装在组件实例内部（比如 `data` 选项或 `setup` 函数中），不要使用模块级的可变变量来存储请求相关的状态。

##### 4. 使用 `<ClientOnly>` 组件
有时候，你会用到一些完全不兼容 SSR 的第三方组件。这时，我们可以用一个 `<ClientOnly>` 组件把它包裹起来，让它只在客户端渲染。

```vue
<template>
  <div>
    <p>这部分内容会在服务端和客户端都渲染</p>
    <ClientOnly>
      <!-- 这个第三方组件只会在客户端渲染 -->
      <SsrIncompatibleComp />
    </ClientOnly>
  </div>
</template>

```

`<ClientOnly>` 的实现原理很简单，它利用了 `onMounted` 钩子只在客户端执行的特性。在服务端，它什么都不渲染；在客户端，它等到组件挂载后，再将插槽里的内容渲染出来。

```javascript
// ClientOnly.js 的一个简单实现
import { ref, onMounted, defineComponent } from 'vue'

export const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const show = ref(false)
    // onMounted 只在客户端执行
    onMounted(() => {
      show.value = true
    })
    // 服务端 show.value 是 false，返回 null
    // 客户端挂载后 show.value 变为 true，渲染默认插槽
    return () => (show.value && slots.default ? slots.default() : null)
  }
})
```



