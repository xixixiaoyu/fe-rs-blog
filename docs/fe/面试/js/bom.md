## 一、BOM 是什么？它和 DOM 有什么区别？
### 1. BOM 的本质
BOM 是 JavaScript 与浏览器交互的桥梁，提供了一套 API，让开发者可以操控浏览器的行为，比如：

+ 跳转到新页面
+ 获取屏幕尺寸
+ 操作浏览器的历史记录
+ 弹出提示框

它的核心是 `window` 对象，这个对象不仅是 BOM 的入口，也是 JavaScript 的全局对象。换句话说，任何全局变量或函数都会挂在 `window` 上，比如 `window.alert` 就是我们熟知的 `alert`。

**通俗比喻**：如果把浏览器比作一栋房子，BOM 就像是房子的控制面板，可以开关窗户、调节空调、查看门牌号。而 DOM（文档对象模型）则是房子里的家具布局，负责管理和操作网页的内容，比如移动沙发（`<div>`）或更换墙纸（`style`）。

### 2. BOM 与 DOM 的区别
面试中，考官常会问：“BOM 和 DOM 有什么区别？”以下是清晰的对比：

| **特性** | **BOM** | **DOM** |
| --- | --- | --- |
| **作用对象** | 浏览器窗口（导航、窗口尺寸等） | 网页内容（HTML 元素、属性等） |
| **核心对象** | `window` | `document` |
| **标准化** | 无统一标准，各浏览器实现略有不同 | W3C 标准，规范明确 |
| **依赖关系** | 包含 DOM（`window.document`） | 依赖 BOM 访问 |


**加分点**：可以提到 BOM 是一个“事实标准”，不同浏览器（如 Chrome、Firefox）可能有细微差异，而 DOM 遵循严格的 W3C 规范。`window` 不仅是 BOM 的核心，也是 ECMAScript 规范定义的全局对象。

---

## 二、BOM 的核心对象与常见面试题
BOM 主要围绕以下几个核心对象展开：`window`、`location`、`history`、`navigator` 和 `screen`。下面我们逐一拆解，并结合面试题讲解它们的用法。

### 1. window 对象：BOM 的核心
`window` 是 BOM 的顶级对象，包含了所有其他 BOM 对象和方法。常见的属性和方法包括：

+ **属性**：`window.location`、`window.history`、`window.navigator`、`window.screen`。
+ **方法**：`alert()`、`confirm()`、`prompt()`、`setTimeout()`、`setInterval()`、`requestAnimationFrame()`。

**面试题**：`window.alert()`、`confirm()` 和 `prompt()` 有什么区别？

+ **解答**：

**注意**：这些方法会阻塞主线程，影响用户体验，现代开发中通常用自定义的模态框（如基于 `<dialog>` 或 UI 框架）替代。

    - `alert()`：显示一个简单的提示框，只有一个“确定”按钮，适合通知用户。
    - `confirm()`：显示一个确认框，包含“确定”和“取消”按钮，返回布尔值（`true`/`false`）。
    - `prompt()`：显示一个输入框，允许用户输入文本，返回输入的字符串或 `null`。

### 2. location 对象：操作 URL
`location` 对象管理当前页面的 URL 信息，既可以读取 URL 的各个部分，也可以触发页面跳转。

**常见属性**（以 `https://www.example.com:8080/path/to/page?id=123&type=user#section-one` 为例）：

+ `location.href`：完整 URL（`'https://www.example.com:8080/path/to/page?id=123&type=user#section-one'`）
+ `location.protocol`：协议（`'https:'`）
+ `location.host`：域名 + 端口（`'www.example.com:8080'`）
+ `location.pathname`：路径（`'/path/to/page'`）
+ `location.search`：查询字符串（`'?id=123&type=user'`）
+ `location.hash`：锚点（`'#section-one'`）

**常见方法**：

+ `location.assign(url)`：跳转到新页面，保留当前页面在历史记录中。
+ `location.replace(url)`：跳转到新页面，替换当前历史记录（无法“后退”）。
+ `location.reload()`：重新加载当前页面，可传入 `true` 强制从服务器加载。

**面试题**：`location.assign()` 和 `location.replace()` 的区别？

+ **解答**：`assign()` 会在浏览器历史记录中新增一条记录，用户可以点击“后退”返回；而 `replace()` 会替换当前记录，用户无法回退。`replace()` 适合用在不需要回退的场景，比如登录成功后跳转到首页。

**代码示例**：

```javascript
// 跳转到新页面，保留历史记录
location.assign('https://www.example.com')

// 跳转并替换当前历史记录
location.replace('https://www.example.com')

// 解析当前 URL 的查询参数
const params = new URLSearchParams(location.search)
console.log(params.get('id')) // 输出：123
```

### 3. history 对象：管理浏览器历史
`history` 对象控制浏览器的会话历史，允许开发者操作前进、后退或动态修改历史记录。

**传统方法**：

+ `history.back()`：后退，等同于点击浏览器的“后退”按钮。
+ `history.forward()`：前进。
+ `history.go(n)`：跳转到指定历史记录，`n` 为正数前进，负数后退（如 `go(-1)` 等同于 `back()`）。

**现代 History API**（单页应用的基石）：

+ `history.pushState(state, title, url)`：添加新历史记录，更新 URL 但不刷新页面。
+ `history.replaceState(state, title, url)`：修改当前历史记录，同样不刷新页面。
+ `popstate` 事件：监听用户的前进/后退操作。

**面试题**：`history.pushState` 在单页应用（SPA）中的作用是什么？

+ **解答**：`pushState` 允许在不刷新页面的情况下更新浏览器 URL，并添加历史记录。这是 SPA（如 React、Vue）实现前端路由的核心。比如，点击一个导航链接，`pushState` 更新 URL 为 `/about`，同时通过 JavaScript 渲染“关于”页面内容。监听 `popstate` 事件可以确保用户点击前进/后退时，页面内容正确更新。

**代码示例**：

```javascript
// 添加新历史记录，URL 变为 /about
history.pushState({ page: 'about' }, '', '/about')

// 监听前进/后退事件
window.addEventListener('popstate', (event) => {
  console.log('当前状态：', event.state)
  // 根据 event.state 渲染对应页面
})
```

### 4. navigator 对象：获取浏览器信息
`navigator` 提供浏览器相关信息，最常用的是 `navigator.userAgent`，返回浏览器的用户代理字符串。

**面试题**：如何检测浏览器类型？

+ **解答**：通过 `navigator.userAgent` 解析 UA 字符串，但更推荐**特性检测**，因为 UA 字符串可能被伪造，且不同浏览器版本差异大。

**代码示例**：

```javascript
const ua = navigator.userAgent
const isChrome = ua.includes('Chrome')
console.log(isChrome ? 'Chrome 浏览器' : '其他浏览器')

// 特性检测示例：检查是否支持 WebRTC
const hasWebRTC = !!window.RTCPeerConnection
console.log(hasWebRTC ? '支持 WebRTC' : '不支持 WebRTC')
```

### 5. screen 对象：获取屏幕信息
`screen` 提供用户屏幕的尺寸信息，如：

+ `screen.width`：屏幕宽度（像素）。
+ `screen.height`：屏幕高度（像素）。

**应用场景**：适配响应式设计或检测用户设备类型。

**代码示例**：

```javascript
console.log(`屏幕分辨率：${screen.width} x ${screen.height}`)
```

### 6. 定时器与动画
BOM 提供了三种定时器机制：

+ `setTimeout(fn, delay)`：延迟 `delay` 毫秒后执行一次 `fn`。
+ `setInterval(fn, interval)`：每隔 `interval` 毫秒重复执行 `fn`。
+ `requestAnimationFrame(fn)`：在浏览器下次重绘前执行 `fn`，适合高性能动画。

**面试题**：`setTimeout` 和 `requestAnimationFrame` 哪个更适合动画？为什么？

+ **解答**：`requestAnimationFrame` 更适合动画，原因如下：
    1. **同步刷新率**：与屏幕刷新率（通常 60Hz，约 16.7ms）同步，避免丢帧或卡顿。
    2. **性能优化**：页面不可见时（如切换标签页），浏览器会暂停 `requestAnimationFrame`，节省资源，而 `setTimeout` 继续运行。
    3. **减少抖动**：浏览器优化多个 `requestAnimationFrame` 回调，集中处理 DOM 操作。

**代码示例**（实现简单动画）：

```javascript
const box = document.getElementById('box')
let pos = 0

function move() {
  pos += 1
  box.style.left = `${pos}px`
  if (pos < 300) {
    requestAnimationFrame(move)
  }
}

requestAnimationFrame(move)
```

---

## 三、综合实践：实现一个简单的 Hash 路由
**需求**：实现一个单页应用导航，点击不同链接（如 `#/home`、`#/about`）时，不刷新页面，动态更新内容区域。

**实现思路**：

1. 使用 `location.hash` 获取当前 URL 的锚点。
2. 监听 `hashchange` 事件，响应 URL 变化。
3. 定义路由表，映射 hash 值到页面内容。
4. 页面加载时初始化内容。

**代码实现**：

```html
<!-- index.html -->
<nav>
  <a href="#/home">首页</a>
  <a href="#/about">关于</a>
  <a href="#/profile">我的</a>
</nav>
<div id="content"></div>

```

```javascript
// router.js
const contentEl = document.getElementById('content')

// 路由表
const routes = {
  '/home': '欢迎来到首页',
  '/about': '关于我们',
  '/profile': '个人中心'
}

// 更新内容
function updateContent() {
  const hash = location.hash.slice(1) || '/home' // 默认首页
  contentEl.innerHTML = routes[hash] || '404 - 页面未找到'
}

// 监听 hash 变化
window.addEventListener('hashchange', updateContent)

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', updateContent)
```

**解析**：

+ 使用 `location.hash` 获取锚点，`slice(1)` 去掉 `#` 前缀。
+ `hashchange` 事件在用户点击链接或修改 URL 锚点时触发。
+ 路由表 `routes` 映射 hash 值到内容，简化内容管理。
+ `DOMContentLoaded` 确保页面加载时显示初始内容。

**面试加分点**：可以扩展讨论如何结合 `history.pushState` 实现更现代的无 `#` 路由，或者如何处理动态加载的组件。

---

## 四、进阶知识：事件委托与内存管理
### 1. 事件委托
事件委托利用事件冒泡，将事件监听器绑定到父元素，减少内存占用，适合动态生成的元素。

**代码示例**：

```javascript
function bindEvent(parent, eventType, selector, callback) {
  parent.addEventListener(eventType, (e) => {
    if (e.target.matches(selector)) {
      callback.call(e.target, e)
    }
  })
}

// 示例：监听 #nav 下所有 a 标签的点击
const nav = document.getElementById('nav')
bindEvent(nav, 'click', 'a', function(e) {
  console.log(`点击了：${this.textContent}`)
})
```

**优势**：

+ 减少事件监听器数量，提升性能。
+ 动态添加的元素无需重新绑定事件。

### 2. 内存管理
在老版本 IE 中，BOM/DOM 对象的垃圾回收依赖引用计数，容易因循环引用导致内存泄漏。

**解决方法**：

+ 手动解除引用，如事件监听移除或置空对象：

```javascript
element.onclick = null // 移除事件
element = null // 解除 DOM 引用
```

**现代浏览器**：大多采用标记清除算法，循环引用问题较少，但仍需注意大型应用的内存管理。

