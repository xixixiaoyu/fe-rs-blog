## 一、从 DOCTYPE 开始：网页的“标准通行证”
### 为什么需要 DOCTYPE？
想象一下，网页就像一封信，寄给浏览器时需要明确“格式要求”，否则浏览器可能“看不懂”或“误解”你的意图。DOCTYPE（文档类型声明）就是这封信的开头，告诉浏览器该用哪种标准（HTML 或 XHTML）来解析页面。

如果没有 DOCTYPE，浏览器会进入**怪异模式（Quirks Mode）**，导致页面排版出现意想不到的问题，比如 CSS 样式失效或布局错乱。现代开发中，我们直接使用 HTML5 的简洁声明：

```html
<!DOCTYPE html>
```

### DOCTYPE 的三大作用
1. **触发标准模式**：确保浏览器按照 W3C 标准解析页面，避免怪异模式的兼容性问题。
2. **声明版本**：明确文档遵循的 HTML 版本，HTML5 的 `<!DOCTYPE html>` 是最简洁且通用的写法。
3. **未来兼容**：HTML5 声明兼容所有现代浏览器，简化了开发流程。

### 实战建议
+ **始终放在第一行**：DOCTYPE 必须是 HTML 文件的开头，前面不能有任何内容（包括空格），否则可能触发怪异模式。
+ **坚持 HTML5**：除非有特殊需求（如维护老项目），直接用 `<!DOCTYPE html>`，简单又高效。

---

## 二、meta 标签：网页的“身份证”和“说明书”
meta 标签就像网页的“幕后英雄”，虽然用户看不到，但它对浏览器、搜索引擎和用户体验至关重要。它位于 `<head>` 标签内，定义了网页的元信息。

### 常用 meta 标签及其作用
1. **字符编码**：确保页面文字正确显示，避免乱码。

```html
<meta charset="UTF-8">
```

UTF-8 是最通用的编码方式，能支持中文等复杂字符。

2. **SEO 优化**：通过 `description` 和 `keywords` 帮助搜索引擎理解页面内容。

```html
<meta name="description" content="这是一个关于前端开发的教程网站">
<meta name="keywords" content="前端, HTML, CSS, JavaScript">
```

注意：不要堆砌关键词，否则可能被搜索引擎降权。

3. **移动端适配**：让网页在手机上显示得更友好。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

这句代码让页面宽度适配设备屏幕，初始缩放比例为 1，避免页面在手机上显示过小。

4. **控制搜索引擎行为**：决定页面是否被收录或跟踪链接。

```html
<meta name="robots" content="index, follow">
```

5. **其他实用功能**：
    - 声明作者：`<meta name="author" content="张三">`
    - 自动刷新：`<meta http-equiv="refresh" content="5;url=https://example.com">`（慎用，可能影响用户体验）

### 现代网页推荐组合
以下是现代网页常用的 meta 标签组合，简洁且实用：

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="网站描述">
  <meta name="keywords" content="关键词1, 关键词2">
  <title>页面标题</title>
</head>

```

### 实战建议
+ **优先级高的放前面**：如 `charset` 和 `viewport`，确保浏览器第一时间解析。
+ **避免冗余**：只用必要的 meta 标签，保持 `<head>` 简洁。
+ **关注 SEO**：写出简洁、准确的 `description`，吸引用户点击。

---

## 三、Canvas vs SVG：选择适合的绘图工具
在网页中需要绘制图形时，Canvas 和 SVG 是两种主要技术。它们各有优势，适合不同场景。

### Canvas：像素级画布
Canvas 就像一张空白画布，你用 JavaScript 一笔一笔画上去，但它只记住像素颜色，不记住图形本身。

```javascript
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

// 画红色矩形
ctx.fillStyle = 'red'
ctx.fillRect(10, 10, 100, 50)

// 画蓝色圆形
ctx.beginPath()
ctx.arc(200, 50, 30, 0, Math.PI * 2)
ctx.fillStyle = 'blue'
ctx.fill()
```

**特点**：

+ **像素渲染**：绘制后只保留像素信息，无法直接修改图形。
+ **性能强**：适合复杂场景（如游戏、数据可视化）。
+ **缩放模糊**：放大后图像会失真。
+ **交互复杂**：需手动实现碰撞检测等逻辑。

### SVG：矢量图形
SVG 是基于 XML 的矢量图形，保存的是图形的数学描述，可以随时修改。

```html
<svg width="300" height="100">
  <rect x="10" y="10" width="100" height="50" fill="red" />
  <circle cx="200" cy="50" r="30" fill="blue" />
</svg>

```

**特点**：

+ **矢量渲染**：缩放不失真，适合高清显示。
+ **DOM 可操作**：每个图形都是 DOM 元素，可通过 JavaScript 或 CSS 控制。
+ **性能瓶颈**：元素过多时会变慢。
+ **交互简单**：支持原生事件绑定（如点击、悬停）。

### 如何选择？
+ **用 Canvas**：游戏开发、复杂可视化、频繁重绘的动画。
+ **用 SVG**：图标、Logo、交互式图表、需要缩放的图形。
+ **两者结合**：比如用 SVG 做静态图标，Canvas 做动态效果。

### 实战建议
+ **性能优化**：Canvas 绘制复杂图形时，尽量减少重绘次数；SVG 避免过多 DOM 元素。
+ **兼容性**：两者在现代浏览器中支持良好，但老版本 IE 可能需要 polyfill。

---

## 四、CSS 引入：`<link>` vs `@import`
CSS 是网页样式的核心，如何引入 CSS 直接影响页面加载速度和维护性。

### `<link>`：主流选择
```html
<link rel="stylesheet" href="styles.css">
```

**优点**：

+ **并行加载**：浏览器可同时下载多个 CSS 文件，速度快。
+ **动态控制**：可用 JavaScript 动态添加或修改。
+ **高兼容性**：所有浏览器都支持。

### `@import`：模块化辅助
```css
/* 在 CSS 文件中 */
@import 'another-style.css';

/* 或在 HTML 中 */
<style>
  @import 'styles.css';
</style>

```

**缺点**：

+ **串行加载**：需先解析包含 `@import` 的文件，再加载被引入的文件，增加延迟。
+ **无法动态修改**：不适合 JavaScript 控制。
+ **兼容性稍差**：老版本 IE 可能有问题。

### 如何选择？
+ **优先用 **`<link>`：加载速度快，适合主样式表。
+ **用 **`@import`：在 CSS 文件中组织模块化样式（如 Sass 预处理器）。
+ **生产环境优化**：合并压缩 CSS 文件，减少 HTTP 请求，尽量避免 `@import`。

---

## 五、src vs href：引用资源的正确姿势
在 HTML 中，`src` 和 `href` 都用来引用外部资源，但用途不同。

### src：嵌入内容
+ **作用**：替换标签内容，如加载脚本或图片。
+ **示例**：

```html
<script src="app.js"></script>
<img src="photo.jpg">
```

+ **特点**：资源会立即加载并执行，可能阻塞页面渲染。

### href：建立关联
+ **作用**：链接到资源，如跳转页面或加载样式表。
+ **示例**：

```html
<a href="page.html">链接</a>
<link rel="stylesheet" href="style.css">
```

+ **特点**：资源加载不一定阻塞渲染，更多是建立关联。

### 记忆口诀
+ **src**：嵌入内容，替换标签本身（如脚本、图片）。
+ **href**：链接资源，建立关系（如页面跳转、样式表）。

---

## 六、async vs defer：优化脚本加载
JavaScript 脚本的加载方式直接影响页面性能，`async` 和 `defer` 是优化利器。

### 普通 `<script>`
```html
<script src="app.js"></script>

```

+ **行为**：立即下载并执行，阻塞 HTML 解析。
+ **适用**：小型脚本或必须立即执行的逻辑。

### async：异步加载
```html
<script async src="app.js"></script>

```

+ **行为**：异步下载，下载完立即执行（可能打断 HTML 解析）。
+ **适用**：独立脚本（如第三方统计工具）。
+ **缺点**：执行顺序不定，可能导致依赖问题。

### defer：延迟执行
```html
<script defer src="app.js"></script>

```

+ **行为**：异步下载，HTML 解析完后按顺序执行。
+ **适用**：依赖 DOM 或需按顺序执行的脚本。

### 实战建议
+ **操作 DOM 的脚本**：用 `defer`，确保 DOM 加载完成。
+ **独立脚本**：用 `async`，如 Google Analytics。
+ **模块化脚本**：用 `type="module"`，默认具有 `defer` 行为。

---

## 七、HTML5 新特性：让网页更强大
HTML5 带来了许多新功能，让网页开发更简单、功能更丰富。

1. **语义化标签**：如 `<header>`、`<nav>`、`<article>`，让代码结构更清晰。

```html
<header>
  <h1>网站标题</h1>
  <nav><a href="/">首页</a></nav>
</header>

```

2. **多媒体支持**：`<video>` 和 `<audio>` 替代 Flash。

```html
<video controls>
  <source src="movie.mp4" type="video/mp4">
</video>

```

3. **本地存储**：`localStorage` 和 `sessionStorage` 比 cookie 更灵活。

```javascript
localStorage.setItem('name', '张三')
console.log(localStorage.getItem('name')) // 张三
```

4. **表单增强**：新增 `email`、`date` 等输入类型，提升用户体验。

```html
<input type="email" required placeholder="请输入邮箱">
```

5. **其他特性**：
    - **地理定位**：`navigator.geolocation` 获取用户位置。
    - **Web Workers**：支持多线程运行。
    - **拖放 API**：简化拖拽交互。

---

## 八、行内元素 vs 块级元素：布局的基础
### 行内元素
+ **特点**：不独占一行，宽度由内容决定。
+ **示例**：`<span>`、`<a>`、`<img>`。
+ **限制**：不能直接设置宽高，上下 margin/padding 不影响布局。

### 块级元素
+ **特点**：独占一行，默认填满父元素宽度。
+ **示例**：`<div>`、`<p>`、`<section>`。
+ **优势**：可设置宽高、margin 和 padding。

### 转换方法
```css
/* 行内转块级 */
span {
  display: block
}

/* 块级转行内块 */
div {
  display: inline-block
}
```

### 实战场景
+ **按钮样式**：将 `<a>` 设为 `inline-block`，添加 padding 模拟按钮。
+ **消除 inline-block 间隙**：

```css
.parent {
  font-size: 0
}
.child {
  font-size: 16px
  display: inline-block
}
```

---

## 九、Web 标准与语义化：让代码更“聪明”
### Web 标准：互联网的“交通规则”
W3C 制定的 Web 标准（如 HTML5、CSS3）确保网页在不同设备和浏览器上表现一致。关注 W3C 动态能让你提前掌握新技术，如 Web Components 和 WebAssembly。

### 语义化：用对标签
语义化是用合适的标签表达内容含义，如用 `<nav>` 表示导航，而不是 `<div class="nav">`。

**好处**：

+ **SEO 友好**：搜索引擎更容易理解页面结构。
+ **无障碍访问**：屏幕阅读器能正确解读。
+ **维护方便**：代码结构清晰，易于协作。

**示例**：

```html
<!-- 语义化 -->
<header>
  <h1>标题</h1>
  <nav><a href="/">首页</a></nav>
</header>
<!-- 非语义化 -->
<div class="header">
  <div class="title">标题</div>
</div>

```

---

## 十、iframe：嵌入外部内容的“窗口”
iframe 是一个内联框架，用于在网页中嵌入另一个独立页面。

### 典型用法
```html
<iframe src="https://example.com" width="600" height="400"></iframe>

```

### 使用场景
+ **嵌入第三方内容**：如 YouTube 视频、Google 地图。
+ **广告隔离**：防止广告干扰主页面。
+ **微前端**：将不同应用整合到同一页面。

### 优缺点
**优点**：

+ 隔离性强，样式和脚本互不干扰。
+ 跨域友好，可嵌入不同域名内容。

**缺点**：

+ 性能开销大，多个 iframe 可能导致页面卡顿。
+ SEO 不友好，搜索引擎难以抓取内容。
+ 响应式设计麻烦，需额外处理。

### 实战建议
+ **用 HTTPS**：确保嵌入内容安全。
+ **加 sandbox**：限制 iframe 权限。

```html
<iframe src="https://example.com" sandbox="allow-scripts" loading="lazy"></iframe>

```

+ **延迟加载**：用 `loading="lazy"` 优化性能。
+ **提供备选**：为不支持 iframe 的用户提供提示。

---

## 十一、图片格式：选择合适的“画质与效率”平衡
网页中常用的图片格式各有特点，选择合适的格式能优化加载速度和视觉效果。

1. **JPEG**：适合照片，压缩率高，但不支持透明。
2. **PNG**：支持透明，适合图标、截图，但文件较大。
3. **SVG**：矢量格式，适合图标和 Logo，无限缩放不失真。
4. **WebP**：现代格式，兼顾压缩和质量，支持透明和动画。
5. **GIF**：适合简单动画，但色彩表现有限。

### 如何选择？
+ **网站图片**：优先 WebP，提供 JPEG/PNG 作为后备。
+ **图标/Logo**：用 SVG，缩放清晰且文件小。
+ **动画**：WebP 或 GIF。
+ **存档/专业**：TIFF 或 RAW。