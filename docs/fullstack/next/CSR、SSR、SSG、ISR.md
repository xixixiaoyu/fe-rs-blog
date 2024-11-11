# 探索 Next.js 渲染模式：从 CSR 到 ISR

在前端开发的世界里，Next.js 一直是一个备受瞩目的框架。它不仅让我们能够轻松构建现代化的 React 应用，还提供了多种渲染模式，帮助我们在不同场景下优化性能和用户体验。随着 Next.js v13 的发布，App Router 和 React Server Component 的引入让开发者的选择更加丰富，但理解传统的渲染模式依然是掌握 Next.js 的关键。

今天，我们将一起回顾 Next.js 中的四种主要渲染模式：CSR（客户端渲染）、SSR（服务端渲染）、SSG（静态站点生成）和 ISR（增量静态再生）。这些模式各有优劣，适用于不同的应用场景。

## 1. CSR：客户端渲染

**客户端渲染（Client-side Rendering, CSR）** 是最传统的渲染方式。页面的 HTML 结构在客户端生成，浏览器首先下载一个简单的 HTML 文件和 JavaScript 文件，随后通过 JavaScript 请求数据并渲染页面。

这种方式的优点是开发体验好，页面交互性强，但缺点也很明显：在 JavaScript 加载和数据请求完成之前，用户只能看到一个空白页面或加载动画，影响首屏体验。

在 Next.js 中，CSR 可以通过 `useEffect` 或数据获取库（如 SWR）来实现。以下是一个简单的例子：

```javascript
// pages/csr.js
import React, { useState, useEffect } from 'react'

export default function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
      const result = await response.json()
      setData(result)
    }
    fetchData()
  }, [])

  return <p>{data ? `Your data: ${JSON.stringify(data)}` : 'Loading...'}</p>
}
```

在这个例子中，数据请求在客户端发起，页面初始显示“Loading...”，数据返回后再更新页面内容。

## 2. SSR：服务端渲染

**服务端渲染（Server-side Rendering, SSR）** 则是将页面的 HTML 结构在服务端生成，用户请求页面时，服务端直接返回完整的 HTML 文件。这种方式可以显著提升首屏加载速度，尤其是在网络条件不佳的情况下。

Next.js 提供了 `getServerSideProps` 方法来实现 SSR：

```javascript
// pages/ssr.js
export default function Page({ data }) {
  return <p>{JSON.stringify(data)}</p>
}

export async function getServerSideProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  const data = await res.json()
  return { props: { data } }
}
```

每次用户请求页面时，服务端都会重新获取数据并渲染 HTML。这种方式适合需要实时数据的页面，但由于每次请求都需要重新渲染，响应时间（TTFB）会比静态页面稍长。

## 3. SSG：静态站点生成

**静态站点生成（Static Site Generation, SSG）** 是一种在构建时生成静态 HTML 文件的渲染方式。对于内容不经常变化的页面，SSG 是一种非常高效的选择。页面在构建时就已经生成好，用户访问时直接返回静态 HTML，速度极快。

Next.js 提供了 `getStaticProps` 来实现 SSG：

```javascript
// pages/ssg.js
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()
  return {
    props: {
      posts,
    },
  }
}
```

在构建时，Next.js 会调用 `getStaticProps` 获取数据并生成静态 HTML 文件。对于不需要频繁更新的内容，SSG 是最佳选择。

## 4. ISR：增量静态再生

**增量静态再生（Incremental Static Regeneration, ISR）** 是 Next.js 提供的一种混合模式。它结合了 SSG 的高效性和 SSR 的灵活性。页面在构建时生成静态 HTML，但可以在后台定期更新这些静态页面，确保内容的时效性。

通过在 `getStaticProps` 中添加 `revalidate` 参数，我们可以轻松实现 ISR：

```javascript
// pages/post/[id].js
export async function getStaticProps({ params }) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`)
  const post = await res.json()
  return {
    props: { post },
    revalidate: 10, // 每 10 秒更新一次页面
  }
}
```

在这个例子中，页面会在初次请求时生成静态 HTML，之后每隔 10 秒会重新生成一次，确保内容的更新。

## 5. 混合使用渲染模式

Next.js 的强大之处在于它允许我们在同一个应用中混合使用多种渲染模式。比如，我们可以使用 SSG 提供初始的静态页面，再通过 CSR 动态更新部分内容：

```javascript
// pages/postList.js
import React, { useState } from 'react'

export default function Blog({ posts }) {
  const [data, setData] = useState(posts)
  return (
    <>
      <button
        onClick={async () => {
          const res = await fetch('https://jsonplaceholder.typicode.com/posts')
          const posts = await res.json()
          setData(posts.slice(10, 20))
        }}
      >
        换一批
      </button>
      <ul>
        {data.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()
  return {
    props: {
      posts: posts.slice(0, 10),
    },
  }
}
```

在这个例子中，页面初始数据通过 SSG 生成，用户点击按钮后，新的数据通过 CSR 动态获取并更新页面。

## 总结

Next.js 提供了多种渲染模式，帮助我们在不同场景下优化应用的性能和用户体验。无论是传统的 CSR，还是高效的 SSG 和 ISR，每种模式都有其独特的优势。随着 App Router 和 React Server Component 的引入，Next.js 的渲染模式变得更加灵活和强大。理解这些渲染模式的原理和应用场景，将帮助你更好地构建现代化的 Web 应用。
