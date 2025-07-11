## 一、CSS 基础：从选择器到盒模型
### 1. 选择器：定位你的 HTML 元素
选择器是 CSS 的起点，它决定了哪些 HTML 元素会应用你的样式。以下是几种常见的选择器类型：

+ **标签选择器**：直接针对 HTML 标签，比如 `p { color: blue; }` 让所有段落文字变蓝。
+ **类选择器**：通过 `class` 属性定位，写法是 `.类名`，如 `.btn { background: orange; }`，灵活且可复用。
+ **ID 选择器**：通过唯一的 `id` 属性定位，写法是 `#id名`，如 `#header { height: 60px; }`，优先级最高。
+ **后代选择器**：用空格分隔，比如 `nav a { text-decoration: none; }`，选择 `nav` 内的所有 `a` 标签。
+ **子元素选择器**：用 `>` 符号，比如 `ul > li { list-style: none; }`，只选直接子元素。
+ **伪类选择器**：用单冒号 `:`，如 `a:hover { color: red; }`，处理特定状态（鼠标悬停、焦点等）。
+ **伪元素选择器**：用双冒号 `::`，如 `p::first-line { font-weight: bold; }`，操作元素的某部分（如首行）。

**优先级口诀**：`!important > 行内样式 > ID > 类/伪类/属性 > 标签 > 通配符`。同级别时，后定义的样式覆盖前面的。

**开发建议**：

+ 多用 `class`，少用 `id`，因为 `class` 更灵活，适合组件化开发。
+ 避免选择器嵌套超过 3 层，保持代码简洁。
+ 伪元素统一用双冒号 `::`，兼容现代浏览器。

### 2. 盒模型：理解元素的“包装盒”
每个 HTML 元素都可以看作一个盒子，由以下部分组成（从内到外）：

+ **内容区（content）**：元素的实际内容，如文字或图片。
+ **内边距（padding）**：内容与边框之间的空间。
+ **边框（border）**：围绕内容的框。
+ **外边距（margin）**：盒子与外部元素之间的距离。

CSS 提供两种盒模型计算方式：

+ **标准盒模型**（`box-sizing: content-box`）：总宽度 = `width` + `padding` + `border`。
+ **边框盒模型**（`box-sizing: border-box`）：总宽度 = `width`（包含 `padding` 和 `border`）。

**示例**：

```css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid #333;
  box-sizing: border-box; /* 总宽度固定为 200px */
}
```

**建议**：全局设置 `box-sizing: border-box`，让宽度计算更直观：

```css
* {
  box-sizing: border-box;
}
```

### 3. 继承：让样式“传宗接代”
CSS 中的继承就像家族遗传，子元素会自动获取父元素的某些样式，比如 `color`、`font-family` 和 `text-align`。但布局相关的属性（如 `margin`、`border`）不会继承，以避免页面布局混乱。

**控制继承的技巧**：

+ 强制继承：`inherit`，如 `border: inherit;`。
+ 恢复默认：`initial`，如 `color: initial;`。
+ 智能重置：`unset`，根据属性类型决定继承还是恢复默认。

**实用案例**：在 `body` 上设置全局字体样式，减少重复代码：

```css
body {
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 1.5;
}
```

**注意**：继承的优先级很低，直接应用的样式会覆盖继承样式。如果样式没生效，用浏览器开发者工具检查是否有其他规则覆盖。



## 二、布局核心：从文档流到现代布局
### 1. 文档流：页面的默认规则
文档流是元素在页面上的自然排列方式：

+ **块级元素**（如 `div`、`p`）：独占一行，垂直排列。
+ **内联元素**（如 `span`、`a`）：水平排列，宽度由内容决定。

**脱离文档流**的几种方式：

+ **浮动（float）**：元素向左/右移动，其他内容环绕。
+ **绝对定位（position: absolute/fixed）**：完全脱离文档流。
+ **Flex/Grid 布局**：创建新的布局上下文。

**问题与解决**：

+ **高度塌陷**：浮动元素会导致父容器高度丢失。解决方法是用伪元素清除浮动：

```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

+ **创建 BFC**：通过 `overflow: hidden` 或 `display: flow-root` 解决浮动或外边距合并问题。

### 2. Margin 合并：理解和控制间距
**Margin 合并**是指垂直方向的 `margin` 不会相加，而是取最大值。常见场景：

+ 相邻兄弟元素：`margin-bottom: 20px` 和 `margin-top: 30px` 合并为 30px。
+ 父子元素：子元素的 `margin-top` 可能“穿透”父元素。
+ 空元素：自身的上下 `margin` 合并。

**避免合并的方法**：

+ 创建 BFC：`overflow: auto` 或 `display: flow-root`。
+ 添加边框或内边距：`padding-top: 1px`。
+ 使用 Flex/Grid 布局：天然避免合并。

**小技巧**：给段落设置统一的 `margin: 1em 0`，确保间距一致且不会翻倍。

### 3. 现代布局：Flex 和 Grid
+ **Flex 布局**：适合一维布局（行或列），简单且强大：

```css
.parent {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
```

+ **Grid 布局**：适合复杂的二维布局：

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
```

**建议**：优先使用 Flex 或 Grid，性能优于传统浮动布局，且代码更简洁。

### 4. 定位：精确控制元素位置
CSS 的 `position` 属性提供五种定位方式：

+ **static**：默认，遵循文档流。
+ **relative**：相对自身偏移，不影响其他元素。
+ **absolute**：脱离文档流，相对于最近的非 `static` 祖先定位。
+ **fixed**：相对于浏览器窗口固定。
+ **sticky**：滚动到特定位置时固定。

**居中技巧**：

```css
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**注意**：使用 `absolute` 或 `fixed` 时，确保父容器有明确的高度或定位。



## 三、响应式设计：适配所有设备
响应式设计让网页在手机、平板、电脑等设备上都能正常显示。以下是核心技巧：

### 1. 视口设置
在 HTML 中添加：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 2. 媒体查询
根据屏幕宽度应用不同样式：

```css
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 15px;
  }
}
```

### 3. 灵活单位
优先使用相对单位：

+ `rem`：基于根字体大小。
+ `vw/vh`：基于视口宽/高。
+ `%`：基于父元素。

**示例**：

```css
h1 {
  font-size: clamp(1.5rem, 4vw, 2rem); /* 响应式字体大小 */
}
```

### 4. 图片自适应
```css
img {
  max-width: 100%;
  height: auto;
}
```

### 5. 移动优先设计
先写手机样式，再用媒体查询覆盖大屏幕样式：

```css
.nav {
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .nav {
    flex-direction: row;
  }
}
```



## 四、性能优化：让页面更快
### 1. 重绘与重排
+ **重绘**：改变颜色、背景等不影响布局的属性。
+ **重排**：修改宽高、位置等触发布局重新计算，性能开销大。
+ **合成**：只影响 `transform`、`opacity` 等属性，性能最佳。

**优化技巧**：

+ 使用 `transform` 和 `opacity` 做动画。
+ 缓存布局属性（如 `element.offsetHeight`）。
+ 批量操作 DOM。

### 2. 初始化样式
使用 CSS Reset 或 Normalize.css 统一浏览器默认样式：

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```



## 五、创意技巧：让页面更有趣
### 1. 画三角形
利用边框属性：

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 30px solid #e74c3c;
}
```

### 2. 小字体实现
低于 12px 的字体可以用 `transform` 缩放：

```css
.tiny-text {
  font-size: 12px;
  transform: scale(0.75);
  transform-origin: left top;
}
```

### 3. CSS 函数
+ **calc()**：动态计算尺寸，如 `width: calc(100% - 20px);`。
+ **clamp()**：限制值范围，如 `font-size: clamp(16px, 4vw, 22px);`。
+ **linear-gradient()**：创建渐变背景。

