### 声明式描述 UI：你说目标，我来实现

Vue.js 3 最大的特点就是“声明式”。啥叫声明式呢？简单说，就是你告诉它想要啥结果，不用管它怎么实现。比如你要做一个按钮：

```html
<button @click="sayHello">点我</button>
```

然后在 JavaScript 里定义一下：

```js
methods: {
  sayHello() {
    alert('你好啊！')
  }
}
```

就完事了！你不用去写 document.createElement('button') 这种命令式的代码，也不用手动绑定事件，Vue.js 自己就帮你搞定。这就是声明式的魅力 —— 你描述界面长啥样，剩下的交给框架。

那 Vue.js 是怎么做到这一点的呢？其实它提供了两种方式：模板和虚拟 DOM。

模板就是上面那种 HTML 风格的写法，直观又简单，像 `<div @click="handler">click me</div>` 这样。

而虚拟 DOM 呢，就是用 JavaScript 对象来描述界面，比如：

```js
const vnode = {
  tag: 'div',
  props: { onClick: () => alert('你好') },
  children: 'click me'
}
```

两种方式都能达到一样的效果，但它们各有千秋。模板简单好上手，像写 HTML 一样自然；虚拟 DOM 更灵活，比如你想动态生成一个标题标签（h1 到 h6），用虚拟 DOM 只要改个变量：

```js
let level = 3
const title = {
  tag: `h${level}`  // 自动变成 h3
}
```

要是用模板，得写一堆 v-if 来判断，太麻烦了。所以 Vue.js 3 干脆两种都支持，让你根据需求挑着用。



### 渲染器：虚拟 DOM 的“翻译官”

光有虚拟 DOM 可不行，得把它变成浏览器能识别的真实 DOM，这就轮到渲染器上场了。渲染器就像个翻译，把你写的虚拟 DOM 翻译成真实的 DOM 元素。原理其实不复杂，咱们自己动手写一个简单的渲染器试试：

```js
function renderer(vnode, container) {
  // 创建元素
  const el = document.createElement(vnode.tag)
  // 处理属性和事件
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key])
    }
  }
  // 处理子节点
  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  }
  // 挂载到容器
  container.appendChild(el)
}

// 测试一下
const vnode = {
  tag: 'div',
  props: { onClick: () => alert('你好') },
  children: 'click me'
}
renderer(vnode, document.body)
```

运行这段代码，页面上就会出现一个“click me”的文字，点一下弹出“你好”。是不是挺简单？渲染器干的就是这么回事：根据虚拟 DOM 的结构，调用浏览器的 DOM API，一步步把元素创建出来。

不过这只是基础版，真正的渲染器还要处理更新。比如文本从“click me”变成“click again”，它得聪明到只改文本，不重新创建整个元素。这就涉及后面会讲的 Diff 算法，咱们先记住一点：渲染器是 Vue.js 的核心，它把虚拟世界和现实世界连接起来了。



### 组件的本质：封装复用的“积木块”

说到 Vue.js，肯定离不开组件。那组件到底是啥呢？简单说，组件就是一堆 DOM 元素的封装。你可以把它想象成搭积木用的零件，单独拿出来能用，拼在一起也能组成大东西。

在 Vue.js 里，组件可以用函数表示：

```js
const MyComponent = () => {
  return {
    tag: 'div',
    props: { onClick: () => alert('你好') },
    children: 'click me'
  }
}
```

或者用对象：

```js
const MyComponent = {
  render() {
    return {
      tag: 'div',
      props: { onClick: () => alert('你好') },
      children: 'click me'
    }
  }
}
```

不管哪种形式，组件的核心是返回一个虚拟 DOM，告诉渲染器“我要渲染啥”。渲染器看到这个虚拟 DOM，发现它是个组件，就先执行组件的函数（或对象的 render 方法），拿到内容，再递归渲染出来。



### 模板的魔法：编译器的功劳

你可能会问，我平时写 `<div @click="handler">click me</div>`，怎么就变成虚拟 DOM 了呢？这背后是编译器在干活。编译器是个程序，它把你写的模板字符串分析一遍，生成一个渲染函数。比如：

```html
<div @click="handler">click me</div>
```

编译器会把它变成：

```js
render() {
  return h('div', { onClick: handler }, 'click me')
}
```

这里的 h 是 Vue.js 提供的一个工具函数，帮你快速创建虚拟 DOM。最终，渲染器拿到这个虚拟 DOM，就能渲染出页面了。所以，模板也好，手写渲染函数也好，最后都是殊途同归，靠渲染器变成真实 DOM。



### 模块配合：Vue.js 的整体美感

看到这，你可能发现了：Vue.js 不是靠单个模块牛，而是靠编译器、渲染器、虚拟 DOM 这些模块一起配合。比如编译器在编译模板时，能标记出哪些是动态内容（像 :class="cls"），生成带提示的虚拟 DOM：

```js
render() {
  return {
    tag: 'div',
    props: { id: 'foo', class: cls },
    patchFlags: 1  // 提示：class 是动态的
  }
}
```

渲染器拿到这个提示，就知道只用关心 class 的变化，不用费劲去比对其他部分。这就大大提高了性能。这种模块间的默契，是 Vue.js 设计上的精妙之处。



### 总结：从全局看 Vue.js

聊到这儿，Vue.js 3 的设计思路应该清晰了吧？它用声明式的方式让你描述 UI，支持模板和虚拟 DOM 两种风格；通过编译器把模板变成渲染函数，再靠渲染器把虚拟 DOM 渲染成真实 DOM；组件则是这些元素的封装，整个过程环环相扣，形成一个高效的整体。