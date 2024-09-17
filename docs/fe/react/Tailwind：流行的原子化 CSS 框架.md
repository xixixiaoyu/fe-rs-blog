![](https://secure2.wostatic.cn/static/nC9tbepsA5R3Jdaqi99Pfe/image.png?auth_key=1726558023-6scsj6VQeSLijMagvtDaXm-0-fa9197bb6859c87ba51ed055ac81158f)

Tailwind 是流行的原子化 css 框，star 很多，npm下载量也很大。

#### 1 什么是原子化 CSS？

传统的 CSS 写法是定义一个类，然后在类内部写样式，例如：

```HTML
<div class="text"></div>
```

```CSS
.text {
    font-size: 16px;
    border: 1px solid #000;
    padding: 4px;
}
```

而原子化 CSS 则是将样式细分为多个小的类，每个类只包含一个样式属性，例如：

```HTML
<div class="text-base p-1 border border-black border-solid"></div>
```

```CSS
.text-base {
    font-size: 16px;
}
.p-1 {
    padding: 4px;
}
.border {
    border-width: 1px;
}
.border-black {
    border-color: black;
}
.border-solid {
    border-style: solid;
}
```



#### 2 Tailwind 的优势

1. **减少命名困扰**：不需要为每个样式起名字，直接使用预定义的类名。
2. **避免样式重复**：相同的样式只需定义一次，避免了重复代码。
3. **局部作用域**：样式只作用于特定的 HTML 标签，避免全局污染。



#### 3 使用 Tailwind

1. **创建项目**：

```Bash
npx create-react-app tailwind-test
cd tailwind-test
npm install -D tailwindcss
npx tailwindcss init
```
2. **配置 Tailwind**：在入口 CSS 文件中引入 Tailwind 的基础样式、组件样式和工具样式：

![](https://secure2.wostatic.cn/static/kKrAwzwsZCyeQpT2zA1is3/image.png?auth_key=1726558023-nKkE991XbRQCSidfSHLE9Y-0-ac3851cb588b32f8cc9dfdf28ed14a73)

Tailwind CSS 有三个主要的层级：

- base: 基础样式，如重置规则和默认样式
- components: 组件级别的样式
- utilities: 工具类，用于原子化的样式定义

这些层级按照上述顺序被应用，这意味着 utilities 中的样式会覆盖 components 中的样式，而 components 中的样式会覆盖 base 中的样式。

1. **使用 Tailwind 类**：

```React JSX
import './App.css';

function App() {
  return (
    <div className='text-base p-1 border border-black border-solid'>yun</div>
  );
}

export default App;
```
2. **运行项目**：

```Bash
npm run start
```



#### 4 配置与扩展

- **修改预定义类**：在 `tailwind.config.js` 中修改配置，例如：

```JavaScript
theme: {
  extend: {
    padding: {
      '1': '30px',
    },
  },
}
```

使用 `p-1` 来应用 `30px` 的内边距。例如：

```JavaScript
<div class="p-1">  
  This div has a padding of 30px on all sides.  
</div>
```

这样设置后，`p-1` 将不再是默认的 `0.25rem`（通常是 `4px`），而是 `30px`。

- **临时设置值**：使用 `[]` 语法，例如 `text-[14px]` 生成 `font-size: 14px` 的样式。
- **响应式与状态样式**：例如 `hover:text-[30px]` 和 `md:bg-blue-500`。
- **扩展类**：使用 `@layer`（指定层级自定义样式） 和 `@apply`（直接自定义样式） 指令：

```JavaScript
// 确保自定义样式与 Tailwind 的默认样式保持一致的优先级和顺序
@layer components {  
  .custom-component {
    // 将预定义的实用工具类bg-blue-500和text-white应用到.custom-component类上。
    @apply bg-blue-500 text-white;  
  } 
}

// 在其他地方就可以很方便使用 .custom-button 这个类名应用如下样式
.custom-button {  
  @apply py-2 px-4 bg-blue-500 text-white rounded;  
}

```

    或开发 Tailwind 插件（跨项目复用）：

```JavaScript
// custom-plugin.js  
// 导入 Tailwind CSS 的插件模块  
const plugin = require('tailwindcss/plugin');  

// 导出插件函数  
module.exports = plugin(function({ addUtilities }) {  
    // 添加自定义的 CSS 工具类  
    addUtilities({  
        // 定义 .yun 类，设置背景颜色为蓝色，文字颜色为黄色  
        '.yun': {  
            background: 'blue',  
            color: 'yellow'  
        },  
        // 定义 .yun-text 类，设置字体大小为 70px  
        '.yun-text': {  
            'font-size': '70px'  
        }  
    })  
})
```

上面插件在 tailwind.config.js 里引入后，就可以在使用上面定义的类了：

```JavaScript
const plugin = require('tailwindcss/plugin');  

module.exports = {  
  content: [  
    './src/**/*.{html,js}',  
  ],  
  theme: {  
    extend: {},  
  },  
  plugins: [  
    require('./custom-plugin'),  
  ],  
}
```





#### 5 Tailwind 的实现原理

Tailwind 是一个基于 PostCSS 的插件，通过解析、转换和生成 CSS 代码。

它通过提取器（extractor）扫描 JS 和 HTML 文件中的类名，并基于这些类名生成最终的 CSS 代码。

tailwind 还有种叫 JIT 的编译方式，可以根据提取到的 class 来动态引入原子 CSS。



#### 6 反对声音与解决方案

1. **可读性与可维护性**：通过 Tailwind CSS IntelliSense 插件提供智能提示，提升开发体验。
2. **调试难度**：在 Chrome DevTools 中可以直接查看样式，调试更方便。
3. **类名冲突**：通过添加前缀解决类名冲突。

![](https://secure2.wostatic.cn/static/bxYMiQRyGrqK8SGnYwA9XR/image.png?auth_key=1726558024-wBsTfV8vCP7G5pLrA24fBs-0-80e6da833ed96ab4e726521e6ff42d89)

这个插件触发提示需要先敲一个空格，这点要注意下。



#### 7 总结

Tailwind 是一个高效、灵活的原子化 CSS 框架，简化了样式编写，避免了样式冲突，提升了开发效率。

通过配置文件和插件扩展，Tailwind 能适应各种项目需求。

