# 在 Vite 中实现前端样式工程化：从 CSS 预处理器到原子化框架

在上一节中，我们已经使用 Vite 初始化了一个 Web 项目，迈出了使用 Vite 的第一步。然而，实际开发中，单靠 Vite 官方的脚手架项目往往是不够的。为了构建一个真正工程化的项目，我们需要结合 Vite 的配置和业界的各种生态工具，搭建一个完整的脚手架工程。

在接下来的内容中，我们将通过实战的方式，逐步搭建一个完整的 Vite 项目架构。你可以跟着我一起编码，从零开始构建一个完整的 Vite 项目。在这个过程中，你不仅会对 Vite 的功能有全面的了解，还能学会如何将它应用到实际项目中。

## 样式方案的意义

在前端开发中，样式是不可或缺的一部分。最初，大家都是手写原生的 CSS，但随着项目复杂度的增加，原生 CSS 的局限性逐渐显现：

1. **开发体验差**：原生 CSS 不支持嵌套选择器，导致代码冗长且难以维护。
2. **样式污染**：不同文件中的相同类名可能会互相覆盖，导致样式冲突。
3. **浏览器兼容性问题**：为了兼容不同浏览器，开发者需要手动添加前缀，增加了代码的复杂性。
4. **打包体积大**：没有工程化方案的 CSS 会导致未使用的样式也被打包，增加了产物体积。

针对这些问题，社区中诞生了多种解决方案，常见的有以下几类：

- **CSS 预处理器**：如 Sass、Less、Stylus，提供嵌套、变量、条件判断等功能，提升了开发体验。
- **CSS Modules**：通过将类名哈希化，避免样式污染。
- **PostCSS**：可以自动添加浏览器前缀、转换单位等，解决兼容性问题。
- **CSS in JS**：如 Emotion、Styled-components，允许在 JS 中编写样式，灵活且强大。
- **CSS 原子化框架**：如 Tailwind CSS、Windi CSS，通过类名快速定义样式，提升开发效率。

接下来，我们将通过实战，逐步在 Vite 中引入这些样式方案。

## CSS 预处理器

Vite 对主流的 CSS 预处理器（如 Sass、Less、Stylus）提供了开箱即用的支持。我们以 Sass 为例，展示如何在 Vite 中使用 CSS 预处理器。

首先，安装 Sass：

```bash
pnpm i sass -D
```

然后，在项目中新建一个 `Header` 组件，并创建对应的 `.scss` 文件：

```tsx
// src/components/Header/index.tsx
import './index.scss'

export function Header() {
  return <p className="header">This is Header</p>
}
```

```scss
// src/components/Header/index.scss
.header {
  color: red;
}
```

在 `App.tsx` 中引入并使用这个组件：

```tsx
// src/App.tsx
import { Header } from './components/Header'

function App() {
  return (
    <div>
      <Header />
    </div>
  )
}

export default App
```

运行项目后，你会看到页面上显示红色的文字，说明 Sass 样式已经生效。

### 全局样式变量

为了更好地管理样式，我们可以将一些常用的样式变量提取到全局文件中。新建 `src/variable.scss` 文件：

```scss
// src/variable.scss
$theme-color: red;
```

然后在 `Header` 组件中引入这个变量：

```scss
// src/components/Header/index.scss
@import '../../variable';

.header {
  color: $theme-color;
}
```

每次手动引入全局样式文件显然不够方便。我们可以在 Vite 的配置文件中进行全局引入：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import { normalizePath } from 'vite'

const variablePath = normalizePath(path.resolve('./src/variable.scss'))

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${variablePath}";`,
      },
    },
  },
})
```

这样，所有的 `.scss` 文件都会自动引入全局变量，极大地简化了开发流程。

## CSS Modules

Vite 对 CSS Modules 也提供了开箱即用的支持。我们只需要将样式文件命名为 `.module.scss`，Vite 就会自动应用 CSS Modules。

```tsx
// src/components/Header/index.tsx
import styles from './index.module.scss'

export function Header() {
  return <p className={styles.header}>This is Header</p>
}
```

```scss
// src/components/Header/index.module.scss
.header {
  color: blue;
}
```

在浏览器中查看，你会发现类名已经被处理成了哈希值，避免了样式污染。

## PostCSS

PostCSS 是一个强大的工具，可以通过插件实现各种 CSS 转换。我们以 `autoprefixer` 为例，展示如何在 Vite 中使用 PostCSS。

首先，安装 `autoprefixer`：

```bash
pnpm i autoprefixer -D
```

然后在 Vite 配置文件中添加 PostCSS 配置：

```ts
// vite.config.ts
import autoprefixer from 'autoprefixer'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11'],
        }),
      ],
    },
  },
})
```

这样，PostCSS 会自动为样式添加浏览器前缀，解决兼容性问题。

## CSS in JS

在 Vite 中集成 CSS in JS 方案（如 Emotion 或 Styled-components）也非常简单。我们以 Emotion 为例，展示如何在 Vite 中使用 CSS in JS。

首先，安装必要的依赖：

```bash
pnpm i @emotion/react @emotion/styled -D
```

然后在 Vite 配置文件中添加 Babel 插件：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
      jsxImportSource: '@emotion/react',
    }),
  ],
})
```

现在，你可以在项目中使用 Emotion 编写样式了：

```tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const headerStyle = css`
  color: blue;
`

export function Header() {
  return <p css={headerStyle}>This is Header</p>
}
```

## CSS 原子化框架

CSS 原子化框架通过类名快速定义样式，极大地提升了开发效率。我们以 Windi CSS 为例，展示如何在 Vite 中集成原子化框架。

首先，安装 Windi CSS 及其 Vite 插件：

```bash
pnpm i windicss vite-plugin-windicss -D
```

然后在 Vite 配置文件中引入 Windi CSS 插件：

```ts
// vite.config.ts
import windi from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [windi()],
})
```

在项目入口文件中引入 Windi CSS：

```ts
// src/main.tsx
import 'virtual:windi.css'
```

现在，你可以在组件中使用 Windi CSS 的类名：

```tsx
// src/components/Header/index.tsx
export function Header() {
  return (
    <div className="p-20px text-center">
      <h1 className="font-bold text-2xl mb-2">This is Header</h1>
    </div>
  )
}
```

## 总结

在本节中，我们通过实战展示了如何在 Vite 中集成各种样式方案，包括 CSS 预处理器、CSS Modules、PostCSS、CSS in JS 和 CSS 原子化框架。每种方案都有其独特的优势，开发者可以根据项目需求选择合适的方案。通过这些工具的结合，我们可以大大提升前端开发的效率和体验。
