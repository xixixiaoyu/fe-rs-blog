## 一、JavaScript 事件系统：网页交互的“感应器”
### 1. 什么是事件？
简单来说，事件就是用户或浏览器触发的某种动作。比如你点击一个按钮、滚动页面、在输入框敲下回车，这些都是事件。事件系统就像网页的“感应器”，它能捕捉这些动作，并触发相应的反应。

常见的 JavaScript 事件类型包括：

+ **鼠标事件**：如 `click`（点击）、`mouseover`（鼠标悬停）、`mouseout`（鼠标移出）。
+ **键盘事件**：如 `keydown`（按下键）、`keyup`（释放键）。
+ **表单事件**：如 `submit`（表单提交）、`change`（输入内容变化）。
+ **页面事件**：如 `load`（页面加载完成）、`resize`（窗口大小改变）。

**代码示例**：

```javascript
// 鼠标点击事件
const button = document.querySelector('button')
button.addEventListener('click', () => {
  console.log('按钮被点击了！')
})

// 键盘按下事件
document.addEventListener('keydown', (event) => {
  console.log(`按下了 ${event.key} 键`)
})

// 表单提交事件
const form = document.querySelector('form')
form.addEventListener('submit', (event) => {
  event.preventDefault() // 阻止默认提交行为
  console.log('表单提交了')
})
```

### 2. 事件监听的三种方式
在 JavaScript 中，我们可以通过以下三种方式为元素绑定事件：

1. **HTML 属性方式**（不推荐）  
直接在 HTML 标签中写事件处理代码，比如 `<button onclick="handleClick()">点击我</button>`。  
**缺点**：代码与结构混杂，维护困难，且不利于分离关注点。
2. **DOM 属性方式**  
通过 DOM 对象的属性直接绑定事件处理函数。

```javascript
const btn = document.getElementById('myBtn')
btn.onclick = function () {
  console.log('点击事件触发')
}
```

**缺点**：只能绑定一个事件处理函数，后续绑定会覆盖之前的。

3. **addEventListener 方法**（推荐）  
使用 `addEventListener` 绑定事件，灵活且功能强大。

```javascript
const btn = document.getElementById('myBtn')
btn.addEventListener('click', () => {
  console.log('这是更灵活的方式')
})
```

**优点**：支持绑定多个处理函数、可移除监听、支持事件捕获和冒泡等高级功能。

### 3. 事件流：冒泡与捕获
当一个事件发生时，它不仅在触发元素上生效，还会沿着 DOM 树传播。这个传播过程分为两个阶段：

+ **捕获阶段**：从外层元素向内层元素传递（从 `document` 到目标元素）。
+ **冒泡阶段**：从内层元素向外层元素传递（从目标元素回到 `document`）。

默认情况下，事件监听在冒泡阶段触发，但可以通过 `addEventListener` 的第三个参数设置为 `true` 来在捕获阶段触发：

```javascript
element.addEventListener('click', handleClick, true) // 捕获阶段触发
element.addEventListener('click', handleClick) // 冒泡阶段触发（默认）
```

**生活化比喻**：  

+ 冒泡就像水中的气泡，从最底层的元素“冒”到最外层。  
+ 捕获则像水流从外向内渗透，先经过外层再到目标元素。

### 4. 事件委托：高效管理大量元素
利用事件冒泡，我们可以在父元素上监听子元素的事件，而无需为每个子元素单独绑定监听器。这种方式叫**事件委托**，特别适合动态添加的元素或大量相似元素。

**代码示例**：

```javascript
const ul = document.querySelector('ul')
ul.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log('点击了列表项：', event.target.textContent)
  }
})
```

**优点**：

+ 减少内存占用，只需一个监听器。
+ 动态添加的元素无需重新绑定事件。

### 5. 实用技巧
+ **阻止默认行为**：比如阻止链接跳转或表单提交。

```javascript
link.addEventListener('click', (event) => {
  event.preventDefault() // 阻止链接跳转
})
```

+ **停止事件传播**：避免事件冒泡到父元素。

```javascript
child.addEventListener('click', (event) => {
  event.stopPropagation() // 阻止冒泡
})
```

+ **一次性事件**：事件触发一次后自动移除。

```javascript
element.addEventListener('click', function handler() {
  console.log('只执行一次')
  element.removeEventListener('click', handler)
})
```

---

## 二、页面生命周期：从加载到卸载
页面的生命周期可以分为三个阶段：加载、交互和卸载。理解这些阶段有助于优化页面性能和用户体验。

### 1. 页面加载阶段
从用户输入网址到页面完全显示，这个阶段包括：

+ **解析 HTML**：浏览器下载并解析 HTML 文件，构建 DOM 树。
+ **解析 CSS**：加载并解析 CSS 文件，生成样式规则。
+ **执行 JavaScript**：遇到 `<script>` 标签时，下载并执行 JavaScript 代码。

**关键事件**：

+ `DOMContentLoaded`：DOM 树构建完成，但图片等资源可能还未加载。
+ `load`：所有资源（图片、CSS、JS 等）加载完成。

**代码示例**：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 加载完成，可以操作元素了')
})

window.addEventListener('load', () => {
  console.log('所有资源加载完成')
})
```

### 2. 页面交互阶段
这是页面生命周期中最长的阶段，用户可以进行各种交互，比如点击、滚动、输入等。JavaScript 在这个阶段负责处理事件、动态更新 DOM 或发起网络请求。

**示例**：

```javascript
const button = document.querySelector('.my-button')
button.addEventListener('click', () => {
  const content = document.querySelector('.content')
  content.innerHTML = '你点击了按钮！'
})
```

### 3. 页面卸载阶段
当用户关闭页面、刷新或导航到其他页面时，页面进入卸载阶段。

**关键事件**：

+ `beforeunload`：页面即将卸载，可提示用户保存未保存的内容。
+ `unload`：页面正在卸载，可执行清理工作，如发送统计数据。

**代码示例**：

```javascript
window.addEventListener('beforeunload', (event) => {
  if (hasUnsavedChanges) {
    event.preventDefault()
    event.returnValue = '有未保存的更改，确定要离开吗？'
  }
})

window.addEventListener('unload', () => {
  navigator.sendBeacon('/analytics', JSON.stringify(userStats))
})
```

### 4. 性能优化小贴士
+ **延迟 JavaScript 加载**：将 `<script>` 放在 `</body>` 前，或使用 `defer` 属性，避免阻塞 DOM 解析。
+ **内联关键 CSS**：将首屏渲染所需的 CSS 放在 `<head>` 中，加速页面显示。
+ **懒加载资源**：在 `load` 事件后加载非关键资源，如图片。
+ **优先 DOMContentLoaded**：将交互逻辑放在 `DOMContentLoaded` 事件中，确保 DOM 可操作。

---

## 三、e.target 与 e.currentTarget：谁触发，谁监听？
在事件处理中，`e.target` 和 `e.currentTarget` 是两个容易混淆的概念。

+ **e.target**：指向实际触发事件的元素（“谁被点击了”）。
+ **e.currentTarget**：指向绑定事件处理函数的元素（“谁在监听”）。

**生活化比喻**：  
事件像一个快递，`e.target` 是快递的发出地（触发事件的元素），`e.currentTarget` 是快递的接收地（绑定监听器的元素）。

**代码示例**：

```javascript
const parent = document.querySelector('.parent')
parent.addEventListener('click', (e) => {
  console.log('e.target:', e.target) // 实际点击的元素
  console.log('e.currentTarget:', e.currentTarget) // 绑定监听的元素（parent）
})
```

假设 HTML 是：

```html
<div class="parent">
  <div class="child">点击我</div>
</div>

```

如果你点击 `.child`：

+ `e.target` 是 `.child`（你点击的元素）。
+ `e.currentTarget` 是 `.parent`（绑定了监听器的元素）。

**实用场景**：事件委托中，`e.target` 常用于判断具体点击的子元素：

```javascript
const todoList = document.querySelector('.todo-list')
todoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.target.closest('.todo-item').remove()
  }
})
```

**注意**：在事件冒泡过程中，`e.target` 始终指向触发事件的元素，而 `e.currentTarget` 会随着冒泡层级变化。

---

## 四、NodeList 与 HTMLCollection：DOM 集合的差异
`NodeList` 和 `HTMLCollection` 是 DOM 操作中常见的集合类型，用于存储查询到的节点或元素。它们看似相似，但有重要区别。

### 1. 基本特性对比
| 特性 | NodeList | HTMLCollection |
| --- | --- | --- |
| **获取方式** | `querySelectorAll()`, `childNodes` | `getElementsByClassName()`, `children` |
| **节点类型** | 任意节点（元素、文本、注释等） | 仅元素节点（HTML 标签） |
| **实时性** | 静态（`querySelectorAll`）或实时（`childNodes`） | 实时，反映 DOM 变化 |
| **遍历方法** | 支持 `forEach`（现代浏览器） | 不支持 `forEach`，需用 `for` 循环 |


**代码示例**：

```javascript
// 静态 NodeList
const staticList = document.querySelectorAll('.item')

// 实时 HTMLCollection
const liveCollection = document.getElementsByClassName('item')

// 添加新元素
const newItem = document.createElement('div')
newItem.className = 'item'
document.body.appendChild(newItem)

console.log(staticList.length) // 不变
console.log(liveCollection.length) // 增加 1
```

### 2. 操作方法差异
+ **NodeList**：支持 `forEach`，更适合现代开发。

```javascript
const paragraphs = document.querySelectorAll('p')
paragraphs.forEach(p => {
  p.style.color = 'blue'
})
```

+ **HTMLCollection**：需用传统 `for` 循环。

```javascript
const divs = document.getElementsByClassName('container')
for (let i = 0; i < divs.length; i++) {
  divs[i].style.border = '1px solid red'
}
```

### 3. 转换为数组
为了更方便操作，常用 `Array.from` 或扩展运算符将两者转为数组：

```javascript
const array1 = Array.from(document.querySelectorAll('.items'))
const array2 = [...document.getElementsByClassName('items')]
```

### 4. 实用建议
+ **需要静态快照**：用 `querySelectorAll()` 获取 `NodeList`。
+ **需要实时更新**：用 `getElementsByClassName()` 或 `children` 获取 `HTMLCollection`。
+ **统一转为数组**：数组方法（如 `map`、`filter`）更灵活。

---

## 五、Property 与 Attribute：DOM 的两张面孔
在 DOM 操作中，`Property` 和 `Attribute` 是两个常被混淆的概念。

### 1. 核心区别
+ **Attribute**：HTML 标签上的特性，存储在 HTML 文本中，始终是字符串。例如 `<input type="text" value="初始值">` 中的 `type` 和 `value`。
+ **Property**：DOM 对象的属性，存在于 JavaScript 对象中，可以是任何数据类型。

**生活化比喻**：  

+ Attribute 是房子的“设计图”（HTML 文本）。  
+ Property 是房子建成后的“实际房间”（DOM 对象）。

### 2. 同步关系
+ 修改 Attribute 通常会同步更新 Property。
+ 修改 Property 通常不会反向更新 Attribute。

**代码示例**：

```javascript
const input = document.querySelector('input')

// 修改 Attribute
input.setAttribute('value', '新值')
console.log(input.value) // "新值"（Property 更新）

// 修改 Property
input.value = '再次修改'
console.log(input.getAttribute('value')) // "新值"（Attribute 未变）
```

### 3. 操作方式
+ **操作 Attribute**：

```javascript
element.getAttribute('class')
element.setAttribute('class', 'new-class')
element.hasAttribute('disabled')
element.removeAttribute('disabled')
```

+ **操作 Property**：

```javascript
element.className = 'new-class'
element.disabled = true
```

### 4. 特殊案例
某些 Attribute 和 Property 名称不一致：

+ HTML 的 `class` → Property 的 `className`。
+ HTML 的 `for` → Property 的 `htmlFor`。
+ `href`：Attribute 返回原始值（如 `/page`），Property 返回完整 URL（如 `https://example.com/page`）。

### 5. 实用建议
+ **表单元素**（如 `value`、`checked`）：优先用 Property，反应用户交互。
+ **自定义属性**（如 `data-*`）：用 Attribute，确保 HTML 一致性。
+ **操作类名**：用 `classList` API（如 `add`、`remove`、`toggle`）更方便。

---

## 六、Node 与 Element：DOM 树的基石
### 1. 什么是 Node 和 Element？
+ **Node**：DOM 树的基本单位，包含所有类型的节点，如元素节点、文本节点、注释节点等。  
+ **Element**：Node 的子集，仅指 HTML 标签（如 `<div>`、`<p>`）。

**生活化比喻**：  

+ Node 是 DOM 世界的“积木”，包括各种类型的小零件。  
+ Element 是其中的“标签积木”，专门代表 HTML 元素。

### 2. 关键区别
+ 所有 Element 都是 Node，但 Node 不一定是 Element。
+ Element 专注于标签的操作（如设置 `className`、`innerHTML`）。  
+ Node 关注节点间的关系（如 `childNodes`、`parentNode`）。

**代码示例**：

```javascript
const container = document.getElementById('container')

// 获取所有子节点（包括文本、注释）
console.log(container.childNodes.length) // 可能包含空白文本节点

// 只获取元素子节点
console.log(container.children.length) // 仅 HTML 元素
```

### 3. 常用 API
+ **Node API**：

```javascript
node.parentNode // 父节点
node.childNodes // 所有子节点
node.appendChild(newNode) // 添加子节点
```

+ **Element API**：

```javascript
element.tagName // 标签名
element.innerHTML = '<span>新内容</span>' // 设置 HTML
element.classList.add('active') // 操作类
element.querySelector('.item') // 查找子元素
```

### 4. 实际应用
```html
<div id="container">
  这是一段文本
  <p class="para">这是一个段落</p>
  <!-- 这是注释 -->
</div>

```

```javascript
const container = document.getElementById('container')

// 创建并添加新元素
const newElement = document.createElement('span')
newElement.textContent = '新添加的内容'
container.appendChild(newElement)

// 创建文本节点
const textNode = document.createTextNode('纯文本节点')
container.appendChild(textNode)
```

**建议**：

+ 需要操作标签时，用 Element API（如 `querySelector`、`classList`）。  
+ 需要处理文本或注释等非元素节点时，用 Node API（如 `childNodes`）。

---

## 七、总结与实践建议
通过以上内容，我们从事件系统到 DOM 操作，梳理了 JavaScript 在网页交互中的核心机制。以下是一些实用建议，帮助你更高效地开发：

1. **事件处理**：
    - 优先使用 `addEventListener`，避免 HTML 属性方式。
    - 对于大量元素，使用事件委托减少内存占用。
    - 善用 `e.target` 和 `e.currentTarget` 区分触发和监听元素。
2. **页面生命周期**：
    - 在 `DOMContentLoaded` 中初始化交互逻辑。
    - 使用 `defer` 或异步加载脚本，避免阻塞渲染。
    - 在 `beforeunload` 中处理未保存数据的提示。
3. **DOM 集合**：
    - 用 `querySelectorAll()` 获取静态快照，适合一次性操作。
    - 用 `getElementsByClassName()` 获取实时集合，适合动态 DOM。
    - 统一转为数组，方便使用现代数组方法。
4. **Property 与 Attribute**：
    - 操作用户交互相关内容（如表单值）时，用 Property。
    - 操作 HTML 原始特性或自定义属性时，用 Attribute。
    - 操作类名时，优先使用 `classList`。
5. **Node 与 Element**：
    - 明确需求：只操作标签用 Element，涉及文本或注释用 Node。
    - 注意 `childNodes` 和 `children` 的区别，避免意外操作非元素节点。

