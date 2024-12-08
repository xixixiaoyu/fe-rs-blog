# Next.js 配置指南：深入理解 `next.config.js`

在现代 Web 开发中，**Next.js** 作为一个强大的 React 框架，提供了丰富的配置选项来满足不同的开发需求。通过 `next.config.js` 文件，我们可以对项目进行灵活的定制。本文将带你深入了解 `next.config.js` 的配置方式，尤其是如何通过自定义 HTTP 头部（Headers）来优化你的应用。

## 什么是 `next.config.js`？

`next.config.js` 是一个常规的 Node.js 模块，用于在 Next.js 的服务端和构建阶段进行配置。它不会被打包到客户端，因此你可以放心地在其中编写任何服务端逻辑。

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
}

module.exports = nextConfig
```

如果你需要使用 ECMAScript 模块，可以将文件命名为 `next.config.mjs`，并使用 `export default` 语法。

## 配置的灵活性

Next.js 提供了多种方式来定义配置：

1. **同步函数**：最常见的方式，直接返回配置对象。
2. **异步函数**：适用于需要异步操作的场景，比如从外部 API 获取配置。
3. **根据不同阶段自定义配置**：通过 `phase` 参数，可以根据当前的构建或运行阶段返回不同的配置。

```javascript
module.exports = async (phase, { defaultConfig }) => {
  const nextConfig = {
    /* config options here */
  }
  return nextConfig
}
```

## 常见的 `phase` 值

Next.js 提供了 5 种不同的 `phase`，你可以根据这些阶段来定制不同的配置：

- `PHASE_EXPORT`
- `PHASE_PRODUCTION_BUILD`
- `PHASE_PRODUCTION_SERVER`
- `PHASE_DEVELOPMENT_SERVER`
- `PHASE_TEST`

通过 `next/constants` 导入这些值，并根据当前阶段返回不同的配置。

```javascript
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* 开发环境配置 */
    }
  }

  return {
    /* 其他环境配置 */
  }
}
```

## 自定义 HTTP Headers

在 Next.js 中，`headers` 是一个非常强大的配置项，它允许你为特定的路径设置自定义的 HTTP 头部。通过这些头部，你可以控制浏览器的行为，提升安全性和性能。

### 基本用法

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
          {
            key: 'x-another-custom-header',
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}
```

在这个例子中，访问 `/about` 路径时，服务器会返回自定义的 HTTP 头部。

### 路径匹配

Next.js 支持三种路径匹配方式：

1. **普通路径匹配**：例如 `/blog/:slug` 会匹配 `/blog/hello-world`。
2. **通配符路径匹配**：例如 `/blog/:slug*` 会匹配 `/blog/a/b/c/d/hello-world`。
3. **正则表达式路径匹配**：例如 `/blog/:post(\\d{1,})` 只会匹配数字路径 `/blog/123`。

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/blog/:slug',
        headers: [
          {
            key: 'x-slug',
            value: ':slug',
          },
        ],
      },
    ]
  },
}
```

### Headers 的覆盖行为

如果两个 `headers` 匹配相同的路径，并且设置了相同的 `key`，后者会覆盖前者的值。

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-hello',
            value: 'there',
          },
        ],
      },
      {
        source: '/hello',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}
```

在这个例子中，访问 `/hello` 时，最终的 `x-hello` 值为 `world`，因为 `/hello` 的配置覆盖了 `/:path*` 的配置。

## 其他配置选项

### `basePath`

`basePath` 用于为应用设置一个基础路径。你可以通过设置 `basePath: false` 来排除某些路径。

```javascript
module.exports = {
  basePath: '/docs',
  async headers() {
    return [
      {
        source: '/with-basePath',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        source: '/without-basePath',
        basePath: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}
```

### `locale`

`locale` 用于处理国际化（i18n）。你可以通过设置 `locale: false` 来排除某些路径的语言处理。

```javascript
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },
  async headers() {
    return [
      {
        source: '/with-locale',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        source: '/nl/with-locale-manual',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world2',
          },
        ],
      },
    ]
  },
}
```

### `has` 和 `missing`

`has` 和 `missing` 用于根据请求中的 `header`、`cookie` 或 `query` 参数来决定是否应用某个 `header`。

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-add-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
    ]
  },
}
```

## 常见的安全性 Headers

1. **Strict-Transport-Security**：强制浏览器通过 HTTPS 访问站点。
2. **X-Frame-Options**：防止页面被嵌入到其他站点，避免点击劫持攻击。
3. **X-Content-Type-Options**：防止浏览器猜测内容类型，避免 XSS 攻击。

```javascript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

# Next.js 重定向指南：让你的应用更智能

在 Web 开发中，**重定向** 是一种常见的操作，它可以将用户从一个 URL 自动引导到另一个 URL。无论是为了 SEO 优化、页面迁移，还是为了提升用户体验，重定向都是不可或缺的工具。今天，我们将深入探讨如何在 **Next.js** 中使用 `redirects` 配置来实现灵活的重定向。

## 什么是重定向？

简单来说，**重定向** 就是将用户请求的路径转发到另一个目标路径。通过在 `next.config.js` 中配置 `redirects`，你可以轻松实现这一功能。

### 基本用法

在 Next.js 中，`redirects` 是一个异步函数，它返回一个包含 `source`、`destination` 和 `permanent` 属性的对象数组。每个对象代表一条重定向规则。

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ]
  },
}
```

- `source`：表示传入的请求路径。
- `destination`：表示重定向的目标路径。
- `permanent`：值为 `true` 或 `false`。`true` 表示永久重定向（状态码 308），`false` 表示临时重定向（状态码 307）。

### 为什么使用 307 和 308？

传统的重定向状态码是 301（永久）和 302（临时），但它们有一个问题：很多浏览器会将重定向的请求方法修改为 `GET`，无论原本的请求方法是什么。举个例子，如果用户发送了一个 `POST` 请求到 `/v1/users`，返回了 302 状态码，重定向到 `/v2/users`，那么后续的请求会变成 `GET /v2/users`，而不是 `POST`。

为了避免这种情况，Next.js 使用了 **307** 和 **308** 状态码，它们会保留原始的请求方法。

## 高级用法

除了基本的 `source`、`destination` 和 `permanent`，Next.js 还提供了更多的配置选项，让你可以根据不同的需求进行更复杂的重定向。

### 1. 通配符路径匹配

你可以使用 `*` 来匹配任意路径。例如，`/blog/:slug*` 会匹配 `/blog/a/b/c/d/hello-world`。

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*',
        permanent: true,
      },
    ]
  },
}
```

### 2. 正则表达式路径匹配

通过正则表达式，你可以实现更精确的路径匹配。例如，`/post/:slug(\\d{1,})` 只会匹配数字路径 `/post/123`，而不会匹配 `/post/abc`。

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/post/:slug(\\d{1,})',
        destination: '/news/:slug',
        permanent: false,
      },
    ]
  },
}
```

### 3. `basePath` 和 `locale`

Next.js 支持 `basePath` 和 `locale`，它们会自动添加到 `source` 和 `destination` 中，除非你明确设置 `basePath: false` 或 `locale: false`。

```javascript
module.exports = {
  basePath: '/docs',
  async redirects() {
    return [
      {
        source: '/with-basePath',
        destination: '/another',
        permanent: false,
      },
      {
        source: '/without-basePath',
        destination: 'https://example.com',
        basePath: false,
        permanent: false,
      },
    ]
  },
}
```

在这个例子中，`/with-basePath` 会自动变成 `/docs/with-basePath`，而 `basePath: false` 的路径则不会添加 `/docs` 前缀。

### 4. `has` 和 `missing`

`has` 和 `missing` 是两个非常强大的选项，它们允许你根据请求中的 `header`、`cookie` 或 `query` 参数来决定是否应用重定向。

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-redirect-me',
          },
        ],
        destination: '/another-page',
        permanent: false,
      },
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-do-not-redirect',
          },
        ],
        destination: '/another-page',
        permanent: false,
      },
    ]
  },
}
```

- `has`：当请求中包含指定的 `header`、`cookie` 或 `query` 参数时，才会触发重定向。
- `missing`：当请求中缺少指定的 `header`、`cookie` 或 `query` 参数时，才会触发重定向。

## 实战案例

### 1. 旧博客迁移

假设你的网站从 `/old-blog` 迁移到了 `/news`，你可以使用重定向来确保用户访问旧链接时自动跳转到新链接。

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  },
}
```

### 2. 国际化重定向

如果你的网站支持多语言，你可以根据用户的语言设置自动重定向到相应的语言版本。

```javascript
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },
  async redirects() {
    return [
      {
        source: '/with-locale',
        destination: '/another',
        permanent: false,
      },
      {
        source: '/nl/with-locale-manual',
        destination: '/nl/another',
        locale: false,
        permanent: false,
      },
    ]
  },
}
```

### 3. 根据请求参数重定向

你可以根据请求中的 `query` 参数或 `cookie` 来决定是否进行重定向。例如，只有当用户的 `authorized` cookie 为 `true` 时，才会重定向到 `/home`。

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        destination: '/home',
        permanent: false,
      },
    ]
  },
}
```

在现代 Web 开发中，用户体验和性能优化是至关重要的，而 URL 重写（rewrites）作为一种强大的工具，能够帮助开发者在不改变用户可见 URL 的情况下，灵活地调整路由逻辑。通过重写，开发者可以将请求路径映射到不同的目标路径，而用户在浏览器中看到的 URL 并不会发生变化。这种方式不仅提升了用户体验，还为开发者提供了更多的灵活性。

### 什么是 URL 重写？

简单来说，URL 重写就像是一个“隐形的导航员”。当用户访问某个页面时，表面上他们看到的 URL 没有变化，但实际上，服务器已经将请求重定向到了另一个路径。与重定向不同，重写不会改变浏览器地址栏中的 URL，而是悄悄地在后台完成路径的转换。

举个例子，假设你有一个网站 `/about` 页面，但你希望用户访问 `/about` 时，实际上加载的是首页 `/` 的内容。通过 URL 重写，你可以轻松实现这一点：

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/',
      },
    ]
  },
}
```

在这个例子中，用户访问 `/about` 时，页面内容实际上是首页的内容，但用户并不会察觉到这一点，因为浏览器中的 URL 依然是 `/about`。

### URL 重写的应用场景

1. **SEO 优化**：通过重写 URL，你可以为不同的内容创建更友好的 URL 结构，提升搜索引擎的抓取效率。
2. **渐进式迁移**：当你逐步将旧网站迁移到新框架（如 Next.js）时，重写可以帮助你在不影响用户体验的情况下，逐步替换旧页面。
3. **多语言支持**：结合 `i18n`，你可以为不同语言的用户提供不同的页面内容，而无需改变 URL 结构。

### URL 重写的高级用法

除了简单的路径映射，Next.js 的 URL 重写还支持更复杂的逻辑，比如基于查询参数、请求头、Cookie 等条件进行重写。比如，你可以根据请求中的某个查询参数来决定是否应用重写：

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/some-page',
          destination: '/somewhere-else',
          has: [{ type: 'query', key: 'overrideMe' }],
        },
      ],
    }
  },
}
```

在这个例子中，只有当请求中包含 `overrideMe` 查询参数时，才会将 `/some-page` 重写到 `/somewhere-else`。

### 重写与正则表达式

Next.js 还支持使用正则表达式进行路径匹配，这为复杂的 URL 结构提供了极大的灵活性。比如，你可以通过正则表达式匹配某些特定格式的 URL：

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/post/:slug(\\d{1,})',
        destination: '/blog/:slug',
      },
    ]
  },
}
```

在这个例子中，只有当 `slug` 是数字时，才会将 `/post/123` 重写到 `/blog/123`，而 `/post/abc` 则不会匹配。

### 重写到外部 URL

有时候，你可能需要将某些请求重写到外部网站。比如，你的博客内容托管在另一个域名上，但你希望用户通过你的网站访问这些内容。通过 URL 重写，你可以轻松实现这一点：

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: 'https://example.com/blog',
      },
      {
        source: '/blog/:slug',
        destination: 'https://example.com/blog/:slug',
      },
    ]
  },
}
```

这样，用户访问 `/blog` 或 `/blog/某篇文章` 时，实际上会被重写到外部的博客网站。

### 总结

URL 重写是一个非常强大的工具，它不仅可以帮助你优化网站的路由结构，还能提升用户体验和 SEO 效果。通过灵活的配置，你可以根据不同的条件、路径、甚至是正则表达式来控制请求的重写逻辑。无论是渐进式迁移、外部 URL 重写，还是多语言支持，Next.js 的 URL 重写功能都能为你提供强大的支持。

在实际开发中，合理利用 URL 重写，可以让你的网站更加灵活、易于维护，同时也能为用户提供更好的体验。
