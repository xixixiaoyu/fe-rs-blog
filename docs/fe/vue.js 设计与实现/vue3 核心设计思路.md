## 1. 声明式 UI：让开发更直观
Vue.js 3 的核心设计理念之一是**声明式地描述 UI**。所谓声明式，就是开发者只需描述界面“是什么”，而不需要关心“如何”实现。相比传统的命令式编程（比如直接操作 DOM），声明式编程让代码更简洁，开发者无需关注底层的 DOM 操作细节。

在前端开发中，描述 UI 通常涉及以下几个方面：

+ **DOM 元素**：如 `<div>`、`<a>` 等标签。
+ **属性**：如 `id`、`class` 或 `<a>` 标签的 `href`。
+ **事件**：如 `click`、`keydown` 等交互行为。
+ **层级结构**：DOM 树的父子节点关系。

Vue.js 3 提供了两种方式来声明式描述 UI：**模板**和**虚拟 DOM**。

### 模板：直观且贴近 HTML
Vue.js 的模板语法几乎与 HTML 一致，开发者可以直接用类似 HTML 的方式描述 UI。例如：

```html
<div id="app" :class="cls" @click="handler">
  <span>click me</span>
</div>
```

+ DOM 元素用 `<div>`、`<span>` 等标签表示。
+ 属性通过 `id="app"` 或动态绑定 `:class="cls"` 描述。
+ 事件通过 `@click="handler"` 绑定。
+ 层级结构通过标签嵌套自然表达。

这种方式直观且易于上手，特别适合熟悉 HTML 的开发者。模板的声明式特性让代码更具可读性，开发者无需手动调用 DOM API（如 `document.createElement`）来创建元素或绑定事件。

### 虚拟 DOM：灵活的 JavaScript 表达
除了模板，Vue.js 3 还支持通过 JavaScript 对象（即虚拟 DOM）描述 UI。例如：

```javascript
const title = {
  tag: 'h1',
  props: { onClick: handler },
  children: [{ tag: 'span' }]
}
```

这等价于模板：

```html
<h1 @click="handler"><span></span></h1>
```

虚拟 DOM 的优势在于**灵活性**。例如，动态生成不同级别的标题（`h1` 到 `h6`）：

```javascript
let level = 3
const title = { tag: `h${level}` } // 动态生成 h3
```

相比之下，使用模板需要通过条件指令（如 `v-if`）逐一列举：

```html
<h1 v-if="level === 1"></h1>
<h2 v-else-if="level === 2"></h2>
<h3 v-else-if="level === 3"></h3>
<!-- ... -->
```

显然，虚拟 DOM 的方式更简洁，尤其在动态场景下。Vue.js 3 提供了 `h` 函数来简化虚拟 DOM 的创建：

```javascript
import { h } from 'vue'

export default {
  render() {
    return h('h1', { onClick: handler }, 'click me')
  }
}
```

`h` 函数本质上是创建虚拟 DOM 对象的辅助工具，返回的对象仍然是类似 `{ tag, props, children }` 的结构。



## 2. 渲染器：从虚拟 DOM 到真实 DOM
虚拟 DOM 只是 UI 的描述，真正将其渲染到浏览器页面需要**渲染器**。渲染器的核心任务是将虚拟 DOM 转换为真实 DOM，并挂载到指定的容器中。

以一个简单的虚拟 DOM 为例：

```javascript
const vnode = {
  tag: 'div',
  props: { onClick: () => alert('hello') },
  children: 'click me'
}
```

渲染器的实现逻辑如下：

```javascript
function renderer(vnode, container) {
  // 创建 DOM 元素
  const el = document.createElement(vnode.tag)

  // 处理属性和事件
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substr(2).toLowerCase(), vnode.props[key])
    }
  }

  // 处理子节点
  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }

  // 挂载到容器
  container.appendChild(el)
}
```

调用 `renderer(vnode, document.body)` 后，浏览器会显示“click me”文本，点击时弹出“hello”提示。

渲染器的核心步骤包括：

1. **创建元素**：通过 `document.createElement` 创建 DOM 节点。
2. **处理属性和事件**：遍历 `props`，为事件绑定处理函数（如 `onClick` 转换为 `click` 事件）。
3. **处理子节点**：如果是文本节点，使用 `createTextNode`；如果是数组，递归渲染子节点。

### 更新的精髓：高效 Diff
渲染器真正的复杂性在于**更新**。当虚拟 DOM 发生变化时，渲染器需要找出变更点并只更新必要部分。例如，如果 `children` 从“click me”变为“click again”，渲染器应只更新文本内容，而不重新创建整个 DOM 树。这依赖于 **Diff 算法**，Vue.js 3 对此进行了优化，后续章节会深入探讨。



## 3. 组件的本质：虚拟 DOM 的封装
Vue.js 3 的组件是框架的核心概念之一。简单来说，**组件是一组 DOM 元素的封装**，其渲染内容通过虚拟 DOM 描述。组件可以是函数或对象，返回值是虚拟 DOM。

### 函数式组件
一个简单的函数式组件如下：

```javascript
const MyComponent = function () {
  return {
    tag: 'div',
    props: { onClick: () => alert('hello') },
    children: 'click me'
  }
}
```

在虚拟 DOM 中，组件通过 `tag` 属性表示：

```javascript
const vnode = { tag: MyComponent }
```

渲染器需要区分普通标签和组件：

```javascript
function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container)
  } else if (typeof vnode.tag === 'function') {
    mountComponent(vnode, container)
  }
}

function mountComponent(vnode, container) {
  const subtree = vnode.tag() // 执行组件函数获取虚拟 DOM
  renderer(subtree, container) // 递归渲染
}
```

### 对象式组件
组件也可以是对象，包含 `render` 函数：

```javascript
const MyComponent = {
  render() {
    return {
      tag: 'div',
      props: { onClick: () => alert('hello') },
      children: 'click me'
    }
  }
}
```

渲染器只需稍作调整：

```javascript
function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container)
  } else if (typeof vnode.tag === 'object') {
    mountComponent(vnode, container)
  }
}

function mountComponent(vnode, container) {
  const subtree = vnode.tag.render()
  renderer(subtree, container)
}
```

这种灵活性让 Vue.js 3 能适应不同的组件定义方式。



## 4. 模板与编译器：从字符串到渲染函数
Vue.js 3 支持模板和虚拟 DOM 两种 UI 描述方式。模板（如 `<div @click="handler">click me</div>`）本质上是字符串，需要通过**编译器**转换为渲染函数。

以一个 `.vue` 文件为例：

```html
<template>
  <div @click="handler">click me</div>
</template>
<script>
export default {
  methods: {
    handler: () => { /* ... */ }
  }
}
</script>
```

编译器会将模板编译为：

```javascript
export default {
  methods: {
    handler: () => { /* ... */ }
  },
  render() {
    return h('div', { onClick: handler }, 'click me')
  }
}
```

编译器的作用是将模板字符串解析为虚拟 DOM 的生成逻辑，最终通过渲染器渲染为真实 DOM。



## 5. 模块协作：编译器与渲染器的配合
Vue.js 3 的模块（如编译器、渲染器）并非孤立工作，而是形成一个有机整体。以模板 `<div id="foo" :class="cls"></div>` 为例，编译器生成：

```javascript
render() {
  return {
    tag: 'div',
    props: {
      id: 'foo',
      class: cls
    },
    patchFlags: 1 // 标记 class 为动态属性
  }
}
```

这里的 `patchFlags` 是编译器为渲染器提供的“提示”，表明只有 `class` 属性是动态的。渲染器接收到这个信息后，无需遍历所有属性来寻找变更点，直接更新 `class`，从而提升性能。

这种协作体现了 Vue.js 3 的设计哲学：**模块间通过虚拟 DOM 传递信息，优化性能**。编译器分析模板的静态和动态部分，生成带标记的渲染函数；渲染器利用这些标记高效更新 DOM。

