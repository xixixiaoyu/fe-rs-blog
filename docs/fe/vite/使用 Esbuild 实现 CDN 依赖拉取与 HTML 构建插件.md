# 使用 Esbuild 实现 CDN 依赖拉取与 HTML 构建插件

在现代前端开发中，构建工具的选择至关重要。Esbuild 作为一个新兴的打包工具，以其极快的构建速度和灵活的插件系统，逐渐成为开发者的宠儿。然而，Esbuild 原生并不支持从 CDN 拉取依赖，也没有内置的 HTML 构建功能。本文将通过两个实战案例，展示如何通过编写 Esbuild 插件，解决这些问题。

## 实战 1: CDN 依赖拉取插件

在前端开发中，使用 CDN 来加载第三方依赖可以减少本地依赖的安装时间，并且在某些场景下可以提升应用的加载速度。比如，我们可以通过 Skypack 这样的 CDN 服务来加载 React 和 React-DOM：

```javascript
// src/index.jsx
import { render } from 'https://cdn.skypack.dev/react-dom'
import React from 'https://cdn.skypack.dev/react'

let Greet = () => <h1>Hello, juejin!</h1>

render(<Greet />, document.getElementById('root'))
```

然而，Esbuild 并不支持直接通过 HTTP 拉取依赖。为了解决这个问题，我们可以编写一个插件，拦截这些 HTTP 请求并从网络上获取模块内容。

### 插件实现

首先，我们编写一个简单的插件 `http-import-plugin.js`，用于拦截和处理 HTTP 请求：

```javascript
// http-import-plugin.js
module.exports = () => ({
  name: 'esbuild:http',
  setup(build) {
    let https = require('https')
    let http = require('http')

    // 1. 拦截 CDN 请求
    build.onResolve({ filter: /^https?:\/\// }, args => ({
      path: args.path,
      namespace: 'http-url',
    }))

    // 2. 通过 fetch 请求加载 CDN 资源
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async args => {
      let contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading: ${url}`)
          let lib = url.startsWith('https') ? https : http
          let req = lib
            .get(url, res => {
              if ([301, 302, 307].includes(res.statusCode)) {
                // 重定向
                fetch(new URL(res.headers.location, url).toString())
                req.abort()
              } else if (res.statusCode === 200) {
                // 响应成功
                let chunks = []
                res.on('data', chunk => chunks.push(chunk))
                res.on('end', () => resolve(Buffer.concat(chunks)))
              } else {
                reject(new Error(`GET ${url} failed: status ${res.statusCode}`))
              }
            })
            .on('error', reject)
        }
        fetch(args.path)
      })
      return { contents }
    })
  },
})
```

接着，我们在 `build.js` 中引入这个插件，并执行打包：

```javascript
// build.js
const { build } = require('esbuild')
const httpImport = require('./http-import-plugin')

async function runBuild() {
  build({
    absWorkingDir: process.cwd(),
    entryPoints: ['./src/index.jsx'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    splitting: true,
    sourcemap: true,
    metafile: true,
    plugins: [httpImport()],
  }).then(() => {
    console.log('🚀 Build Finished!')
  })
}

runBuild()
```

### 处理间接依赖

在实际运行中，我们发现仅处理直接依赖是不够的。以 React-DOM 为例，它还依赖了其他模块，这些间接依赖也需要被解析。为此，我们需要在插件中加入对间接依赖的处理逻辑：

```javascript
// 处理间接依赖
build.onResolve({ filter: /.*/, namespace: 'http-url' }, args => ({
  path: new URL(args.path, args.importer).toString(),
  namespace: 'http-url',
}))
```

通过这段代码，Esbuild 可以正确解析并下载所有依赖，最终成功打包。

## 实战 2: 实现 HTML 构建插件

Esbuild 虽然可以快速打包 JS 和 CSS 文件，但它并不具备生成 HTML 文件的能力。每次打包后，我们都需要手动创建 HTML 文件，并将打包后的资源引入其中。为了简化这个过程，我们可以编写一个插件，自动生成 HTML 文件。

### 插件实现

首先，我们创建一个 `html-plugin.js` 文件，插件的核心逻辑是通过 `onEnd` 钩子获取打包后的文件信息，并生成对应的 HTML 文件：

```javascript
// html-plugin.js
const fs = require('fs/promises')
const path = require('path')
const { createScript, createLink, generateHTML } = require('./util')

module.exports = () => {
  return {
    name: 'esbuild:html',
    setup(build) {
      build.onEnd(async buildResult => {
        if (buildResult.errors.length) {
          return
        }
        const { metafile } = buildResult
        const scripts = []
        const links = []
        if (metafile) {
          const { outputs } = metafile
          const assets = Object.keys(outputs)

          assets.forEach(asset => {
            if (asset.endsWith('.js')) {
              scripts.push(createScript(asset))
            } else if (asset.endsWith('.css')) {
              links.push(createLink(asset))
            }
          })
        }
        const templateContent = generateHTML(scripts, links)
        const templatePath = path.join(process.cwd(), 'index.html')
        await fs.writeFile(templatePath, templateContent)
      })
    },
  }
}
```

同时，我们还需要一些工具函数来生成 HTML 标签：

```javascript
// util.js
const createScript = src => `<script type="module" src="${src}"></script>`
const createLink = src => `<link rel="stylesheet" href="${src}"></link>`
const generateHTML = (scripts, links) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Esbuild App</title>
  ${links.join('\n')}
</head>
<body>
  <div id="root"></div>
  ${scripts.join('\n')}
</body>
</html>
`

module.exports = { createLink, createScript, generateHTML }
```

### 打包与运行

在 `build.js` 中引入 HTML 插件，并执行打包：

```javascript
// build.js
const html = require("./html-plugin");

plugins: [
  // 省略其它插件
  html()
],
```

打包完成后，`index.html` 文件会自动生成。接着，我们可以通过 `serve` 启动一个本地服务器，查看打包结果：

```bash
npm i -g serve
serve .
```

访问 `localhost:3000`，你将看到应用成功运行。

## 总结

通过这两个实战案例，我们展示了如何利用 Esbuild 的插件系统，解决从 CDN 拉取依赖和自动生成 HTML 文件的问题。Esbuild 的插件机制非常灵活，开发者可以根据项目需求，编写各种自定义插件，进一步提升开发效率。

Esbuild 的速度和灵活性使其在现代前端开发中具有巨大的潜力。随着社区的不断发展，相信会有更多优秀的插件和工具涌现出来，帮助开发者更高效地构建应用。
