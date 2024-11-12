在现代前端开发中，TypeScript 和 ESLint 已经成为了不可或缺的工具。它们不仅帮助开发者编写更健壮的代码，还能提升代码的可维护性和可读性。今天，我们就来聊聊如何在 Next.js 项目中配置和使用 TypeScript 与 ESLint。

### TypeScript：让代码更安全

TypeScript 是 JavaScript 的超集，它通过静态类型检查让代码更安全，减少运行时错误。Next.js 内置了对 TypeScript 的支持，配置起来非常简单。

#### 1. 新项目的 TypeScript 配置

当你使用 `create-next-app` 创建新项目时，Next.js 会询问你是否使用 TypeScript。选择 "Yes" 后，Next.js 会自动安装所需的依赖并生成 `tsconfig.json` 文件。这个文件包含了推荐的 TypeScript 配置，帮助你快速上手。

#### 2. 现有项目的 TypeScript 迁移

如果你已经有一个 JavaScript 项目，想要迁移到 TypeScript，只需将文件扩展名改为 `.ts` 或 `.tsx`，然后运行 `next dev` 或 `next build`。Next.js 会自动安装 TypeScript 相关依赖，并生成 `tsconfig.json` 文件。

#### 3. TypeScript 插件

Next.js 提供了一个自定义的 TypeScript 插件，集成在 VSCode 等编辑器中，帮助你进行高级类型检查和自动补全。这个插件还能在构建时进行类型检查，确保代码的正确性。

#### 4. 静态写入链接

Next.js 还支持静态写入链接功能，防止在使用 `next/link` 时出现拼写错误。你只需在 `next.config.js` 中开启 `typedRoutes` 选项，TypeScript 就会为你生成所有路由的类型定义，确保导航地址的正确性。

### ESLint：让代码更规范

ESLint 是一个强大的代码检查工具，帮助开发者遵循最佳实践，避免常见的错误。Next.js 提供了开箱即用的 ESLint 支持，配置起来也非常简单。

#### 1. ESLint 配置选项

在创建项目时，Next.js 会询问你是否使用 ESLint。如果选择 "Yes"，Next.js 会自动安装 ESLint 相关依赖，并生成 `.eslintrc.json` 文件。你可以选择 "Strict" 模式，它包含了 Next.js 的基础配置和更严格的 Web 核心指标规则。

#### 2. 自定义 ESLint 规则

Next.js 提供了一个名为 `eslint-plugin-next` 的插件，包含了 21 条自定义规则，帮助你更好地使用 Next.js。例如，它会提示你在使用 `<Script>` 组件时必须为内联脚本分配 `id`，以便 Next.js 进行优化。

#### 3. 搭配 Prettier 使用

如果你同时使用 Prettier 进行代码格式化，可能会与 ESLint 产生冲突。为了解决这个问题，你可以安装 `eslint-config-prettier`，让 ESLint 和 Prettier 协同工作。

```bash
npm install --save-dev eslint-config-prettier
```

然后在 `.eslintrc.json` 中添加 Prettier 配置：

```json
{
  "extends": ["next", "prettier"]
}
```

#### 4. 使用 lint-staged 提升效率

在开发过程中，你可能不希望每次修改文件后都对整个项目运行 ESLint。这时可以使用 `lint-staged`，它只会对暂存的文件进行检查，极大提升了效率。

```javascript
// .lintstagedrc.js
const path = require('path')

const buildEslintCommand = filenames =>
  `next lint --fix --file ${filenames.map(f => path.relative(process.cwd(), f)).join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

### 总结

无论是 TypeScript 还是 ESLint，它们都能帮助你编写更高质量的代码。Next.js 已经为我们做好了大部分配置工作，你只需根据项目需求进行微调即可。通过合理使用这些工具，你的开发体验将会更加顺畅，代码也会更加健壮。
