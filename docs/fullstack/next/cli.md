# 快速上手 Next.js：从创建项目到深入命令行

## 前言

欢迎来到 Next.js 的世界！在开始学习之前，最好的方式就是先动手创建一个项目。通过实际操作，你可以边学边调试，快速掌握 Next.js 的核心概念。

幸运的是，Next.js 提供了开箱即用的 `create-next-app` 脚手架工具，支持 TypeScript、ESLint 等功能，几乎不需要任何配置就能启动项目。接下来，我们将介绍两种创建 Next.js 项目的方式：**自动创建**和**手动创建**，并深入探讨开发过程中常用的脚本命令。

## 1. 自动创建项目

### 1.1 环境要求

在开始之前，请确保你的开发环境满足以下要求：

- Node.js 版本：18.17 及以上
- 支持系统：macOS、Windows、Linux

### 1.2 创建项目

最快捷的方式是使用 `create-next-app` 脚手架。只需在终端中运行以下命令：

```bash
npx create-next-app@latest
```

接下来，系统会提示你设置项目名称、是否使用 TypeScript、是否启用 ESLint、是否集成 Tailwind CSS 等。根据自己的需求选择即可。如果你不确定如何选择，默认选项已经足够好，后续可以根据需要再进行调整。

完成选择后，`create-next-app` 会自动创建项目文件并安装依赖。项目目录结构大致如下：

```
my-next-app/
├── node_modules/
├── public/
├── styles/
├── pages/
├── package.json
└── ...
```

如果你不想使用 `npx`，也可以选择 `yarn`、`pnpm` 或 `bunx` 来创建项目：

```bash
yarn create next-app
pnpm create next-app
bunx create-next-app
```

### 1.3 运行项目

项目创建完成后，查看 `package.json` 文件，你会看到以下脚本命令：

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

- `dev`：启动开发服务器
- `build`：构建生产版本
- `start`：运行生产版本
- `lint`：执行 ESLint 语法检查

在开发过程中，运行以下命令启动开发服务器：

```bash
npm run dev
```

默认情况下，项目会在 `http://localhost:3000` 运行。打开浏览器访问该地址，如果看到欢迎页面，说明项目已经成功启动。

### 1.4 示例代码

Next.js 提供了丰富的示例代码，涵盖了各种使用场景，比如 `with-redux`、`with-electron`、`with-jest` 等。你可以在 [Next.js 官方 GitHub](https://github.com/vercel/next.js/tree/canary/examples) 上找到这些示例。

如果你想直接使用某个示例代码，比如 `with-redux`，可以在创建项目时使用 `--example` 参数：

```bash
npx create-next-app --example with-redux your-app-name
```

## 2. 手动创建项目

虽然大多数情况下我们会使用自动化工具创建项目，但了解手动创建的过程有助于更深入地理解 Next.js 的核心结构。

### 2.1 创建文件夹并安装依赖

首先，创建一个项目文件夹并进入该目录：

```bash
mkdir next-app-manual
cd next-app-manual
```

然后安装 Next.js 及其依赖：

```bash
npm install next@latest react@latest react-dom@latest
```

### 2.2 添加脚本

在 `package.json` 中添加以下脚本：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 2.3 创建目录和文件

在项目根目录下创建 `app` 文件夹，并在其中创建 `layout.js` 和 `page.js` 文件：

```javascript
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// app/page.js
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```

### 2.4 运行项目

运行以下命令启动开发服务器：

```bash
npm run dev
```

如果页面正常渲染，说明项目已经成功运行。

## 3. Next.js CLI 命令详解

Next.js 提供了强大的 CLI 工具，帮助你启动、构建和导出项目。你可以通过运行以下命令查看所有可用的命令：

```bash
npx next -h
```

### 3.1 `next build`

`next build` 用于构建生产版本，执行以下命令：

```bash
npx next build
```

构建完成后，命令行会输出每个路由的大小和加载时间。你可以根据这些信息优化项目性能。

### 3.2 `next dev`

`next dev` 启动开发服务器，支持热加载和错误报告。默认情况下，服务器运行在 `http://localhost:3000`。如果你想更改端口号，可以使用 `-p` 参数：

```bash
npx next dev -p 4000
```

### 3.3 `next start`

`next start` 用于运行生产版本。你需要先执行 `next build` 构建生产代码，然后运行：

```bash
npx next start
```

同样，你可以通过 `-p` 参数更改端口号。

### 3.4 `next lint`

`next lint` 会对项目中的文件执行 ESLint 语法检查。如果你想指定检查的目录，可以使用 `--dir` 参数：

```bash
npx next lint --dir utils
```

### 3.5 `next info`

`next info` 会打印当前系统和项目的相关信息，方便在报告 bug 时提供给官方团队：

```bash
npx next info
```
