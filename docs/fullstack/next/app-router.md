# 探索 Next.js 的 App Router：更强大、更灵活的路由解决方案

在现代 Web 开发中，路由系统是至关重要的一环。它决定了用户如何与页面交互，如何在不同的页面之间导航。而在 Next.js 中，路由系统的演变也经历了一个重要的转折点——从 **Pages Router** 到 **App Router**。今天，我们就来聊聊这个转变，以及 App Router 带来的新特性。

## 1. 从 Pages Router 到 App Router：为什么要升级？

在 Next.js 13.4 之前，开发者们使用的是 Pages Router。这个路由系统基于文件系统，简单易用，但也有一些局限性。比如，所有的页面文件都必须放在 `pages` 目录下，这导致了组件和页面文件的混杂，代码组织不够灵活。

而 App Router 的出现，正是为了解决这些问题。它不仅保留了文件系统路由的优点，还引入了更多的约定和功能，使得代码结构更加清晰，开发体验更加流畅。

### Pages Router 的局限性

在 Pages Router 中，所有的页面文件都必须放在 `pages` 目录下。比如：

```
└── pages
    ├── index.js
    ├── about.js
    └── more.js
```

这种方式虽然简单，但也有一个明显的缺点：**组件不能放在 `pages` 目录下**。这意味着你必须在其他地方创建组件文件夹，导致代码分散，不利于维护。

### App Router 的优势

App Router 则通过引入 `app` 目录，解决了这个问题。新的目录结构如下：

```
src/
└── app
    ├── page.js
    ├── layout.js
    ├── template.js
    ├── loading.js
    ├── error.js
    └── not-found.js
    ├── about
    │   └── page.js
    └── more
        └── page.js
```

你会发现，`app` 目录下多了很多文件，这些文件并不是随意命名的，而是 Next.js 规定的一些特殊文件。比如 `layout.js` 用于定义布局，`loading.js` 用于定义加载状态，`error.js` 用于错误处理，等等。

这种结构不仅让代码更加模块化，还让开发者可以更灵活地组织页面和组件。

## 2. App Router 的核心概念

### 2.1 文件夹即路由

在 App Router 中，文件夹被用来定义路由。每个文件夹都代表一个 URL 片段。比如，`app/dashboard/settings` 目录对应的路由地址就是 `/dashboard/settings`。

### 2.2 页面文件：`page.js`

要让一个路由可以被访问，你需要在对应的文件夹下创建一个 `page.js` 文件。这个文件就是页面的入口。比如：

```javascript
// app/page.js
export default function Page() {
	return <h1>Hello, Next.js!</h1>
}
```

这个文件会映射到 `/` 路由，访问 `http://localhost:3000/` 就能看到页面内容。

### 2.3 布局文件：`layout.js`

布局是多个页面共享的 UI，比如导航栏、侧边栏等。你可以在 `app` 目录下创建一个 `layout.js` 文件，定义全局布局：

```javascript
// app/layout.js
export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<nav>导航栏</nav>
				{children}
			</body>
		</html>
	)
}
```

这个布局会应用到所有的页面，`children` 表示嵌套的页面内容。

### 2.4 模板文件：`template.js`

模板和布局类似，但它不会保留状态。每次路由切换时，模板会重新渲染，而布局则不会。模板适用于那些不需要状态保持的场景，比如表单重置、页面访问计数等。

### 2.5 加载界面：`loading.js`

当页面加载时，App Router 会自动展示 `loading.js` 中定义的加载界面。这个功能依赖于 React 的 `Suspense` API，非常适合处理异步数据加载。

```javascript
// app/dashboard/loading.js
export default function DashboardLoading() {
	return <>Loading dashboard...</>
}
```

### 2.6 错误处理：`error.js`

当页面发生错误时，`error.js` 会捕获并展示错误信息。你可以在这个文件中定义自定义的错误界面，并提供重试功能。

```javascript
// app/dashboard/error.js
export default function Error({ error, reset }) {
	return (
		<div>
			<h2>Something went wrong!</h2>
			<button onClick={() => reset()}>Try again</button>
		</div>
	)
}
```

### 2.7 404 页面：`not-found.js`

当用户访问不存在的路由时，`not-found.js` 会展示自定义的 404 页面。

```javascript
// app/not-found.js
export default function NotFound() {
	return (
		<div>
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<a href="/">Return Home</a>
		</div>
	)
}
```

## 3. App Router 的灵活性

App Router 的设计让开发者可以更灵活地组织代码。你可以在同一个目录下定义页面、布局、模板、加载界面、错误处理等，所有的逻辑都集中在一起，方便管理。

此外，App Router 还支持嵌套路由和嵌套布局。比如，你可以在 `app/dashboard` 目录下定义一个 `layout.js`，然后在 `app/dashboard/settings` 目录下再定义一个 `layout.js`，实现多层布局嵌套。

## 4. 小结

App Router 是 Next.js 路由系统的一次重大升级。它不仅解决了 Pages Router 的局限性，还引入了更多的功能和约定，让代码组织更加清晰，开发体验更加流畅。

通过 App Router，你可以轻松定义页面、布局、模板、加载界面、错误处理和 404 页面，所有的逻辑都集中在 `app` 目录下，代码结构更加模块化。

如果你还在使用 Pages Router，不妨尝试一下 App Router，相信你会爱上它的灵活性和强大功能！

下一篇文章，我们将继续深入探讨 App Router 的更多高级特性，敬请期待！
