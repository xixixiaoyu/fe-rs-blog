## 1.css in js 介绍

> CSS-IN-JS 是 WEB 项目中将 CSS 代码捆绑在 JS 代码中的解决方案，这种方案旨在解决 CSS 的局限性，例如缺乏动态功能，作用域和可移植性
>
> CSS-IN-JS 方案的优点：
>
> 1. 让 CSS 代码拥有独立的作用域，阻止 CSS 代码泄露到组件外部，防止样式冲突
> 2. 让组件更具可移植性，实现开箱即用，轻松创建松耦合的应用程序
> 3. 让组件更具可重用性，只需编写一次即可，可以在任何地方运行，不仅可以在同一应用程序中重用组件，而且可以在使用相同框架构建的其他应用程序中重用组件
> 4. 让样式具有动态功能，可以将复杂的逻辑应用于样式规则，如果要创建需要动态功能的复杂 UI,它是理想的解决方案
>
> 缺点：
>
> 1. 为项目增加了额外的复杂性
> 2. 自动生成的选择器大大降低了代码的可读性

## 2.Emotion 库

### 2.1 介绍

> Emotion 是一个旨在使用 JS 编写 CSS 样式的库
>
> `npm install @emotion/core @emotion/styled`

### 2.2 css 属性支持

1. JSX Pragma

通知 babel , 不再需要将 jsx 语法转换为 React.createElement 方法， 而是需要转换为 jsx 方法：

```js
/** @jsx jsx */
import { jsx } from "@emotion/core";
```

2. Babel Preset（更推荐）

```shell
npm run eject
npm install @emotion/babel-preset-css-prop
```

在 package.json 文件中找到 babel 属性，加入如下内容：

```json
"presets": [
  "react-app",
  "@emotion/babel-preset-css-prop"
]
```

使用：

```js
function App() {
  return <div css={{ width: 200, height: 200, background: "pink" }}>App works</div>;
}
```

### 2.3 css 方法

#### 1.String Styles

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213200040302.png" alt="image-20220213200040302" style="zoom:80%;" />

#### 2.Object Styles

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213200119613.png" alt="image-20220213200119613" style="zoom:80%;" />

### 2.4 css 属性的优先级

> props 对象中的 css 属性优先级⾼于组件内部的 css 属性
>
> 在调⽤组件时可以在覆盖组件默认样式

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213205056532.png" alt="image-20220213205056532" style="zoom:50%;" />

### 2.5 Styled Components 样式化组件

> 样式化组件就是⽤来构建⽤户界⾯的，是 emotion 库提供的另⼀种为元素添加样式的⽅式

#### 1.创建样式化组件

String Styles：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213220605959.png" alt="image-20220213220605959" style="zoom:50%;" />

Object Styles：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213220640078.png" alt="image-20220213220640078" style="zoom:50%;" />

示例：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213221157951.png" alt="image-20220213221157951" style="zoom:50%;" />

#### 2.根据 props 属性覆盖样式

String Styles：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213221343493.png" alt="image-20220213221343493" style="zoom:50%;" />

Object Styles：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213221407613.png" alt="image-20220213221407613" style="zoom:50%;" />

第一个默认样式，第二个传递的样式

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213221954172.png" alt="image-20220213221954172" style="zoom:50%;" />

示例：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213221912445.png" alt="image-20220213221912445" style="zoom:50%;" />

#### 3.为任何组件添加样式

String Styles：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213222211332.png" alt="image-20220213222211332" style="zoom:50%;" />

Object Styles：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213222234163.png" alt="image-20220213222234163" style="zoom:50%;" />

示例：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213222805856.png" alt="image-20220213222805856" style="zoom:50%;" />

#### 4.通过⽗组件设置子组件样式

String Styles：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213222926438.png" alt="image-20220213222926438" style="zoom:50%;" />

Object Styles：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213222946115.png" alt="image-20220213222946115" style="zoom:50%;" />

示例：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213223404950.png" alt="image-20220213223404950" style="zoom: 33%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213223718310.png" alt="image-20220213223718310" style="zoom: 33%;" />

#### 5.嵌套选择器 &

& 表示组件本身：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213223908807.png" alt="image-20220213223908807" style="zoom:50%;" />

示例：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213224217837.png" alt="image-20220213224217837" style="zoom: 33%;" />

#### 6.as 属性

要使⽤组件中的样式, 但要更改呈现的元素, 可以使⽤ as 属性：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213224312440.png" alt="image-20220213224312440" style="zoom:50%;" />

示例：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213224555854.png" alt="image-20220213224555854" style="zoom: 50%;" />

### 2.6 样式组合

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213224715322.png" alt="image-20220213224715322" style="zoom:50%;" />

在样式组合中，后调⽤的样式优先级⾼于先调⽤的样式

### 2.7 全局样式

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213225017188.png" alt="image-20220213225017188" style="zoom:50%;" />

### 2.8 关键帧动画

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213225315305.png" alt="image-20220213225315305" style="zoom:50%;" />

### 2.9 主题

#### 1.下载主题模块

```shell
npm install emotion-theming
```

#### 2.引⼊ ThemeProvider 组件

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213225540184.png" alt="image-20220213225540184" style="zoom:50%;" />

#### 3.将 ThemeProvider 放置在视图在最外层

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213225605892.png" alt="image-20220213225605892" style="zoom: 67%;" />

#### 4.添加主题内容

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213225632770.png" alt="image-20220213225632770" style="zoom:67%;" />

#### 5.获取主题内容

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213225724313.png" alt="image-20220213225724313" style="zoom:67%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220213225754922.png" alt="image-20220213225754922" style="zoom:67%;" />
