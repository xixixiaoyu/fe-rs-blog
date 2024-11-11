# 探索 Next.js 中的 Suspense：流式渲染与选择性水合

在现代 Web 开发中，用户体验至关重要。页面加载速度、交互响应时间等因素直接影响用户的满意度。为了提升这些体验，React 18 引入了一个强大的工具——`<Suspense>` 组件。它不仅解决了传统 SSR（服务端渲染）中的一些痛点，还带来了流式渲染（Streaming Server Rendering）和选择性水合（Selective Hydration）等新特性。今天，我们就来深入探讨一下 Suspense 的工作原理及其在 Next.js 中的应用。

## 传统 SSR 的局限性

在传统的 SSR 模式下，页面的渲染是一个连续且阻塞的过程。具体步骤如下：

1. 服务端获取所有数据。
2. 服务端渲染 HTML。
3. 将 HTML、CSS 和 JavaScript 发送到客户端。
4. 客户端生成不可交互的用户界面（non-interactive UI）。
5. React 进行水合（hydrate），使页面变为可交互的用户界面（interactive UI）。

这个过程虽然能让用户较早看到页面内容，但由于数据获取和渲染是同步的，页面的交互性往往会被延迟，尤其是在数据请求较慢的情况下。所有组件必须先完成水合，用户才能与页面进行交互，这无疑增加了用户的等待时间。

## Suspense 的引入

为了解决这些问题，React 18 引入了 `<Suspense>` 组件。它允许我们推迟某些内容的渲染，直到满足特定条件（如数据加载完毕）。通过 Suspense，我们可以在数据请求的同时渲染页面的其他部分，避免整个页面的阻塞。

### 示例代码

让我们通过一个简单的例子来理解 Suspense 的工作方式：

```javascript
import { Suspense } from 'react'

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function PostFeed() {
  await sleep(2000)
  return <h1>Hello PostFeed</h1>
}

async function Weather() {
  await sleep(8000)
  return <h1>Hello Weather</h1>
}

async function Recommend() {
  await sleep(5000)
  return <h1>Hello Recommend</h1>
}

export default function Dashboard() {
  return (
    <section style={{ padding: '20px' }}>
      <Suspense fallback={<p>Loading PostFeed Component</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading Weather Component</p>}>
        <Weather />
      </Suspense>
      <Suspense fallback={<p>Loading Recommend Component</p>}>
        <Recommend />
      </Suspense>
    </section>
  )
}
```

在这个例子中，我们使用 `Suspense` 包装了三个组件，并通过 `sleep` 函数模拟了数据请求的延迟。每个组件都有一个 `fallback` UI，当数据尚未加载完成时，`fallback` 会显示在页面上，避免用户看到空白页面。

## 流式渲染（Streaming Server Rendering）

Suspense 背后的核心技术之一是流式渲染。它允许服务器将页面的 HTML 拆分成多个块（chunks），并逐步发送到客户端。这样，客户端可以在接收到部分 HTML 后立即渲染，而不必等待所有数据加载完毕。

在流式渲染中，页面的加载过程是渐进的。比如在上面的例子中，`PostFeed` 组件会在 2 秒后加载，`Weather` 组件在 8 秒后加载，而 `Recommend` 组件则在 5 秒后加载。通过流式渲染，用户可以更快地看到页面的部分内容，而不是等待所有数据加载完毕后才看到完整页面。

### HTML 结构

流式渲染的 HTML 结构大致如下：

```html
<section style="padding:20px">
  <!--$?-->
  <template id="B:0"></template>
  <p>Loading PostFeed Component</p>
  <!--/$-->
  <!--$?-->
  <template id="B:1"></template>
  <p>Loading Weather Component</p>
  <!--/$-->
  <!--$?-->
  <template id="B:2"></template>
  <p>Loading Recommend Component</p>
  <!--/$-->
</section>
```

在这个结构中，`fallback` UI 会首先显示，随着数据的返回，服务端会将渲染后的内容逐步发送到客户端，客户端再通过 JavaScript 替换 `fallback` UI。

## 选择性水合（Selective Hydration）

除了流式渲染，Suspense 还带来了选择性水合的能力。传统 SSR 模式下，所有组件必须先完成水合，用户才能与页面交互。而选择性水合允许 React 根据用户的交互行为，优先水合用户正在操作的组件。

举个例子，假设页面上有两个组件 `Sidebar` 和 `MainContent`，它们都在等待水合。如果用户点击了 `MainContent`，React 会优先水合 `MainContent`，确保用户的操作得到及时响应，而 `Sidebar` 则稍后再进行水合。

## Suspense 的渲染顺序控制

有时候，我们希望按照特定的顺序渲染组件。比如，先渲染 `PostFeed`，再渲染 `Weather`，最后渲染 `Recommend`。这时，我们可以通过嵌套 `Suspense` 组件来实现：

```javascript
export default function Dashboard() {
  return (
    <section style={{ padding: '20px' }}>
      <Suspense fallback={<p>Loading PostFeed Component</p>}>
        <PostFeed />
        <Suspense fallback={<p>Loading Weather Component</p>}>
          <Weather />
          <Suspense fallback={<p>Loading Recommend Component</p>}>
            <Recommend />
          </Suspense>
        </Suspense>
      </Suspense>
    </section>
  )
}
```

虽然组件是按顺序嵌套的，但数据请求是并行发送的，因此页面的总加载时间仍然是 8 秒，而不是 2 + 8 + 5 = 15 秒。

## Streaming 的优势

流式渲染的最大优势在于它能显著减少页面的首次内容绘制时间（FCP）和可交互时间（TTI）。尤其是在网络较慢或设备性能较差的情况下，流式渲染可以让用户更快地看到页面内容，并与页面进行交互。

传统 SSR 模式下，页面的加载是阻塞的，所有数据必须先获取完毕，页面才能渲染。而流式渲染则允许我们在数据请求的同时渲染页面的部分内容，极大地提升了用户体验。

## 结语

React 18 中的 Suspense 组件为我们带来了流式渲染和选择性水合的能力，解决了传统 SSR 模式中的一些痛点。通过 Suspense，我们可以更灵活地控制页面的渲染顺序，提升页面的加载速度和交互响应时间。

虽然 Suspense 和 Streaming 技术已经为我们带来了显著的性能提升，但它们并不是终极解决方案。未来，随着 React Server Components（RSC）的发展，我们将看到更多性能优化的可能性。Suspense 和 RSC 的结合，或许会为我们带来更加流畅的用户体验。

在实际项目中，合理使用 Suspense 和流式渲染，可以让你的应用在性能和用户体验上更上一层楼。
