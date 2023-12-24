### 1. 如果理解 HTML 语义化

思考下面两段代码谁更有语义？

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014655594.png" alt="image-20220307014655594" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014717594.png" alt="image-20220307014717594" style="zoom:50%;" />

语义化标签是⼀种写 HTML 标签的**⽅法论**（⽅式）

- 增加代码可读性，利于维护
- 让搜索引擎更容易读懂（SEO）

### 2. 块状元素&内联元素？

**块级元素**：`display`:`block`/`table` 的有 `div` `h1-h6` `table` `ulolli` `p `等

**内联元素**：`display`:`inline`/`inline-block` 的有 `span` `img` `input` `button` `strong`等

### 3.知道的网页制作会用到的图片格式有哪些？

- png，jp(e)g，gif，svg。
- 但是上面的那些都不是面试官想要的最后答案。面试官希望听到是 Webp。

### 4. 盒模型宽度计算

- `offsetWidth` = (内容宽度+内边距+边框)，`无`外边距

下面举例计算其 offsetWidth ：

```css
div {
  with: 100px;
  padding: 10px border 1px solid #ccc;
  margin: 10px;
}
```

其 offsetWidth 为 122px

注意:如果让 offsetWidth 等于 100px 如何做

```css
div {
  box-sizing: border-box;
  with: 100px;
  padding: 10px border 1px solid #ccc;
  margin: 10px;
}
```

### 5.如何简单实现一个三角形

- 首先我们需要把宽度为 0
- 其次我们就可以设置边框
- 最后只要将其三块边框设置为透明色就可以达到想要的效果

```css
#triangle {
  width: 0;
  border: 30px solid transparent;
  border-bottom-color: tomato;
}
```

### 6.如何实现一个扇形

实现扇形跟上个实现三角形是一样的，无非多加了边框圆角，其次把不需要的设置为透明色

```css
#sector{
    width: 0;
    border-top: 100px solid red;
    border-bottom: 100px solid yellow;
    border-left: 100px solid green;
    border-right: 100px solid blue;
    border-radius: 100px;
}

<div id="sector"></div>
```

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014740283.png" alt="image-20220307014740283" style="zoom:67%;" />

### 7.margin 纵向重叠问题

```css
p{
    font-size: 16px;
    line-height: 1;
    margin-top: 10px;
    margin-bottom: 15px;
}

<p>aaa</p>
<p></p>
<p></p>
<p></p>
<p>bbb</p>
```

按道理来讲：aaa 到 bbb 之间 15px + (10px + 15px )\*3+10px = 100px

但事实上 aaa 到 bbb 之间的距离为：15px

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014756875.png" alt="image-20220307014756875" style="zoom:50%;" />

### 8.对 margin 的 top left right bottom 设置为负值，有何效果？

聊这这个问题我们需要知道

- margin-top left 是平移元素自身
- margin-right bottom 平移其他元素

效果:

- margin-top 和 margin-left 负值，元素向上、向左移动
- margin-right 负值，右侧元素左移，自身不受影响
- margin-bottom 负值，下方元素上移，自身不受影响







### 什么是 BFC？如何应用？

- 块格式化上下文（block formatting context）
- 一块独立渲染区域，内部元素的渲染不会影响边界以为的元素

那么形成**BFC 的常见条件**：

- float 属性不为 none
- position 的值不是 static 或者 relative;
- overflow 不为 visible
- display 为 inline-block、table-cell、table-caption、flex、inline-flex

开启 BFC 特点作用

1. 开启 BFC 的元素不会被浮动元素覆盖
2. 开启 BFC 的元素父子外边距不会合并
3. 开启 BFC 的元素可以包含浮动的子元素（解决浮动高度塌陷）









### 11.float 布局

1. 并排一行
2. 破坏文档流
3. 包裹块状化

#### 手写 clearfix(清除浮动)

```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

### 12. flex 布局实现三个点的色子

聊这个问题之前必须得对 flex 有一个基本认识

思路：

1. 首先画出三个点和最大的盒子
2. 使用 flex 布局，且用 justify-content 分配容器的空间，两端对齐 space-between
3. 那么在第二个设置垂直居中
4. 第三个点设置垂直居下

```css
.box{
    width: 200px;
    height: 200px;
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 20px;

    display: flex;
    justify-content: space-between;
    /* flex-direction: row-reverse;  */
}
.item{
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #666;
}
.item:nth-child(2){
    align-self: center;
}
.item:nth-child(3){
    align-self: flex-end;
}


<div class="box">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
</div>
```

### 13.定位有哪些? 分别参照什么定位？

- static `无定位`
- relative 参照`自身定位`
- absolute 参照`最近一层有定位属性的祖先元素`
- fixed 参照`视口`定位
- sticky 参照`最近有滚动`的`祖先元素`

### 14.如何使一个元素水平垂直居中

**行内元素**

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014819557.png" alt="image-20220307014819557" style="zoom:67%;" />

**定位元素**

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014839737.png" alt="image-20220307014839737" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014854178.png" alt="image-20220307014854178" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014913265.png" alt="image-20220307014913265" style="zoom:50%;" />

**Flex 布局**

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014926887.png" alt="image-20220307014926887" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014939961.png" alt="image-20220307014939961" style="zoom:50%;" />

**Grid 布局**

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307014957497.png" alt="image-20220307014957497" style="zoom:50%;" />

**单元格**

- 行内元素

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307015013375.png" alt="image-20220307015013375" style="zoom:50%;" />

- 块级元素

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307015028964.png" alt="image-20220307015028964" style="zoom:50%;" />

### 15.line-height 如何继承

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307015048327.png" alt="image-20220307015048327" style="zoom:50%;" />

- 写具体数值,如 30px,则继承该值(比较好理解)
- 写比例,如 2/1.5 ,则继承该比例(比较好理解)
- 写百分比,如 200% ,则继承计算出来的值(考点)

### 16.哪些属性能继承

文本字体相关的属性普遍具有**继承性**，如

- color
- font-开头的
- list-开头的
- text-开头的
- line-开头的

### 17.消除图片底部间隙的方法

- 图片块状化 - 无基线对齐：img { display: block; }
- 图片底线对齐：img { vertical-align: bottom; }
- 父级设置 font-size:0;
- 行高足够小 - 基线位置上移：.box { line-height: 0; }

### 18.单行多行文字溢出隐藏

单行文字：

```css
#box1 {
  border: 1px solid #ccc;
  width: 100px;
  white-space: nowrap; /* 不换行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出省略 */
}
```

多行文字：

```css
#box2 {
  border: 1px solid #ccc;
  width: 100px;
  overflow: hidden;
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置子元素排列方式 */
  -webkit-line-clamp: 3; /* 显示几行，超出的省略 */
}
```

### 19.rem 是什么及 px、em、rem、%、vw/vh 的区别？

- px 像素。绝对单位，像素 px 是相当于于显示器屏幕分辨率而言的
- em 相对长度单位，相对于父元素，不常用
  - font-size 设置 em 是相当于父元素的字体大小，
  - 而 width 和 height 是相对自身的字体大小
- rem 相对于根元素 html 的字体大小，常用于移动端布局
  - font-size、width 和 height 始终相对于根字体大小
- % 相对于父元素的尺寸
- vw 屏幕宽度的 1%
- vh 屏幕高度的 1%
- vmin 两者最小值
- vmax 两者最大值

### 20.响应式布局常见的方案？

响应式是通过媒体查询技术使得一个网站兼容多种屏幕尺寸的设备

通过响应式实现 rem 布局

```css
/* 断点 320px 414px 540px 768px 992px 1200px */
html {
  font-size: 4px;
}
@media (min-width: 320px) {
  html {
    font-size: 5px;
  }
}
@media (min-width: 414px) {
  html {
    font-size: 6px;
  }
}
@media (min-width: 540px) {
  html {
    font-size: 8px;
  }
}
@media (min-width: 768px) {
  html {
    font-size: 11px;
  }
}
@media (min-width: 992px) {
  html {
    font-size: 14px;
  }
}
@media (min-width: 1200px) {
  html {
    font-size: 18px;
  }
}
```

通过 js 来实现 rem 布局

```js
{
  const docEl = document.documentElement;

  const setHtmlFontSize = () => {
    const viewWidth = docEl.clientWidth;
    // 1rem = 10px
    docEl.style.fontSize = `${viewWidth / 75}px`;
  };

  setHtmlFontSize();
  window.addEventListener("resize", setHtmlFontSize, false);
}
```

### 21.使用一个元素显示以及隐藏的方式？

- display:none; 元素不占据空间且`无法点击` 株连九族 性能消耗大
- opacity: 0; 元素占据空间`可以点击` 株连九族 性能消耗小
- visibility:hidden; 其占据的空间依旧会保留;无法点击
- 通过移动元素位置比如 margin 移动到屏幕外面进行隐藏
- 设置 height，width 等盒模型属性为 0
  - 影响元素盒模型的属性设置成 0
  - 如果元素内有子元素或内容，还应该设置其`overflow:hidden`来隐藏其子元素

### 22.CSS Sprites 是什么？它的优势和劣势？

CSS Sprite 精灵图 把一堆小的图片整合到一张大的图片

优：

1. 很好的减少网页的请求，大大提高页面的性能;
2. 解决了网页设计师在图片命名上的困扰

劣：

1. 开发较麻烦，测量繁琐
2. 维护麻烦，背景少许改动有可能影响整张图片

### 23.描述一下 CSS 中的渐进增强，优雅降级之间的区别？

**渐进增强**（从上往下）:针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能，达到更好的用户体验。

**优雅降级**（从下往上）:一开始就构建完整的功能，然后再针对低版本的浏览器进行兼容。

### 24.介绍对浏览器内核的理解

| chrome  | Blink   |
| ------- | ------- |
| Opera   | Blink   |
| IE      | Trident |
| Safari  | webkit  |
| firefox | Gecko   |

浏览器内核分或两部分:`渲染引擎`和`JS引擎`。

`渲染染引擎`:将代码转换成页面输出到浏览器界面。

`JS引擎`:解析和执行 javascript 来实现网页的动态效果。

最开始渲染引擎和 Js 引擎并没有区分得很明确，后来 Js 引擎越来越独，内核就倾向于只指渲染引擎。

### 25.重绘和重排的区别

- 元素位置是相对的 一个元素位置移动可能改变其他元素位置移动 这个过程就叫重排(reflow)
- 一些属性不会影响位置变化 只影响元素外观风格 这个过程被称为重绘(repaint)

特点：

- 重排要比重绘更消耗性能

- 重排必将重绘
- 重绘不一定重排

解决方案：

- 集中修改样式，或直接使用 `class`
- DOM 操作前先使用 `display: none` 脱离文档流
- 使用 BFC ，不影响外部的元素
- 对于频繁触发的操作（`resize` `scroll` 等）使用节流和防抖
- 使用 `createDocumentFragment` 进行批量 DOM 操作
- 优化动画，如使用 `requestAnimationFrame` 或者 CSS3（可启用 GPU 加速）

### 26.meta 标签 viewport 的理解

- 可以布局视口宽度 width 等于设备独立像素 device-width 更好进行布局

### 27.图片 img 标签 title 与 alt 属性的区别

- alt 标签是图片无法正常显示时对图片的描述
- title 鼠标悬停在元素上时会提示文字信息。

### 28.link 和@import 的区别

- link 写在 html 页面中，一般存在于 head 部分，而@import 写在 CSS 文件中。
- link 属于 XHTML 标签，除了加载 CSS 外，还能用于定义 RSS, 定义 rel 连接属性等作用，而@import 是 CSS 提供的，只能用于加载 CSS;

- link 会按照顺序加载，而@import 引用的 CSS 会等到页面被加载完再加载;

- import 是 CSS2.1 提出的，只在 IE5 以上才能被识别，而 link 是 XHTML 标签，无兼容问题;

### 29.简述一下 src 与 href 的区别

- href 标识超文本引用，用于 link 和 a 等元素应用，通过 href 将当前元素和引用资源之间建立联系；
- src 表示引用资源替换当前元素，用在 img、script、iframe，无跨越问题，`<script src="js.js"></script>`当浏览器解析时会暂停其他资源的下载,通常放在最底部。

### 30.HTML 和 XHTML 的区别

XHTML 是可以拓展的超文本标签语言，更严格的 HTML 语言，具有以下的特点：

1. 必须有根元素

2. 标签必须小写嵌套闭合

### 31.label 标签作用

- label 标签 for 属性与一个表单控件 id 值一致
- 点击 label 则自动聚焦到表单

### 32.transform 变形

1. `translate3d(x,y,z)`位移；
2. `scale3d(x,y,z)`缩放；
3. `rotateX(180deg)`旋转；
4. `skewX(30deg)`倾斜；

### 33.CSS3 动画

- `animation-name` 动画名称，
- `animation-duration` 动画时长
- `animation-timing-function`： 规定动画的速度曲线。默认是`ease`
- `animation-delay`： 规定动画何时开始。默认是 0
- `animation-iteration-count`：规定动画被播放的次数。默认是 1
- `animation-direction`： 规定动画是否在下一周期逆向地播放。默认是`normal`
- `animation-play-state` ： 规定动画是否正在运行或暂停。默认是`running`
- `animation-fill-mode`： 规定动画是否保留在最后一帧，保留在最后一帧可以用`forwards`

### 33.CSS3 过渡

- `transition-property` 参与过渡的属性
- `transition-duration` 过渡的持续时间
- `transition-delay` 设置过渡的延迟时间
- `transition-timing-function` 过渡的速率

### 34.transition 和 animation 有何区别?

- transition：用于做过渡效果，只需书写开始和结束状态和变化持续时间，由伪类事件被动触发，性能开销较小
- animation：用于做动画，可以定义多个元素变化过程中多个状态，主动出发，性能开销较大

### 35.nth-child 和 nth-of-type 的区别是什么?

- “nth-child" 选择的是父元素的子元素，要同时满足两个条件时才能生效,其一是子元素，其二是子元素刚好处在那个位置
- "nth-of-type" 选择的是某父元素的子元素，而且这个子元素是指定类型。

### 36.选择器优先级 , 怎么计算?

- ! important > 行内样式 > id 选择器 > 类选择器 > 标签选择器 > 通配符 > 继承

- 选择器越具体，其优先级越⾼
- 相同优先级，出现在后⾯的，覆盖前⾯的

- 属性后⾯加 !important 的优先级最⾼，但是要少⽤

权重算法：(0,0,0,0) ——> 第一个 0 对应的是 important 的个数，第二个 0 对应的是 id 选择器的个数，第三个 0 对应的类选择器的个数，第四个 0 对应的是标签选择器的个数，合起来就是当前选择器的权重。

比较：先从第一个 0 开始比较，如果第一个 0 大，那么说明这个选择器的权重高，如果第一个相同，比较第二个，依次类推。

(0,1,2,3) > (0,1,1,5)

### 37.CSS3 中有哪些新特性

新增各种 CSS 选择器 （:not(.input)：所有 class 不是“input”的节点）

圆角 （border-radius:8px）

多列布局 （multi-column layout）

文本效果 阴影 text-shadow，textwrap，word-break，word-wrap；

渐变 （gradient）

变换 （transform）

过渡和动画

多背景

### 38.画一条 0.5px 的线

- **采用 transform: scale()的方式**，该方法用来定义元素的 2D 缩放转换：

```css
transform: scale(0.5, 0.5);
```

### 39.Grid 布局

容器属性：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162757540.png" alt="image-20220305162757540" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162736144.png" alt="image-20220305162736144" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162822976.png" alt="image-20220305162822976" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162831417.png" alt="image-20220305162831417" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162839820.png" alt="image-20220305162839820" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162914405.png" alt="image-20220305162914405" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162938148.png" alt="image-20220305162938148" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305163003203.png" alt="image-20220305163003203" style="zoom:50%;" />

![image-20220305163018415](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305163018415.png)

项目属性：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162500800.png" alt="image-20220305162500800" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162526214.png" alt="image-20220305162526214" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162544953.png" alt="image-20220305162544953" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220305162626683.png" alt="image-20220305162626683" style="zoom:50%;" />

### 40.HTML 5 有哪些新标签？

- ⽂章相关：header main footer nav section article figure mark
- 多媒体相关：video audio svg canvas
- 表单相关：type=email type=tel

[具体参考 MDN HTML 元素 ](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)

### 41.Canvas 和 SVG 的区别

答题思路为：先说⼀，再说⼆，再说相同点，最后说不同点

Canvas 主要是⽤笔刷来绘制 2D 图形的，SVG 主要是⽤标签来绘制不规则⽮量图的

相同点：都是主要⽤来画 2D 图形的

不同点：

1. Canvas 画的是**位图**，SVG 画的是**⽮量图**
2. SVG 节点过多时渲染慢，Canvas 性能更好⼀点，但写起来更复杂
3. SVG ⽀持分层和事件，Canvas 不⽀持，但是可以⽤库实现
