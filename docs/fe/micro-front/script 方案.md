在现代前端开发中，微前端架构逐渐成为一种流行的解决方案，尤其是在大型项目中，它能够帮助团队将不同的功能模块独立开发、独立部署，最终通过主应用进行统一管理和展示。在上一节课程中，我们通过封装 NPM 包的方式实现了微前端，但这种方式需要主应用在每次更新微应用时都要重新构建和发布。为了让主应用具备更灵活的线上动态管理能力，动态加载 Script 成为了一种更为轻量的解决方案。

### 动态 Script 方案的优势

动态 Script 方案的核心思想是通过动态加载 JavaScript 和 CSS 文件，来实现微应用的加载和卸载。相比于 NPM 包的方式，动态 Script 方案具备以下几个显著的优势：

1. **动态管理微应用**：主应用可以在不重新构建的情况下，动态增加、删除或更新微应用。这意味着我们可以在生产环境中灵活地上线或下线微应用，而不需要频繁地发布主应用。
2. **性能优化**：微应用可以独立进行构建优化，比如代码分割、静态资源分离等。通过预加载（prefetch）技术，主应用可以提前获取微应用的资源，减少用户点击时的加载时间。

3. **无需模块化适配**：与 NPM 包方案不同，动态 Script 方案不需要对微应用进行额外的模块化适配。微应用只需提供挂载（mount）和卸载（unmount）函数，主应用通过这些函数来控制微应用的加载和卸载。

### 实现动态 Script 方案

为了更好地理解动态 Script 方案的实现，我们可以通过一个简单的示例来展示其工作原理。假设我们有两个微应用 `micro1` 和 `micro2`，它们分别提供了挂载和卸载的全局函数 `micro1_mount`、`micro1_unmount` 和 `micro2_mount`、`micro2_unmount`。主应用通过点击导航按钮来切换微应用，并将微应用的内容渲染到指定的插槽中。

#### 主应用的 HTML 结构

主应用的 HTML 结构非常简单，包含一个导航栏和一个用于渲染微应用的插槽：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dynamic Script Micro Frontend</title>
    <style>
      h1 {
        color: red;
      }
    </style>
  </head>
  <body>
    <h1>Hello，Dynamic Script!</h1>
    <div id="nav"></div>
    <div class="container">
      <div id="micro-app-slot"></div>
    </div>

    <script type="text/javascript">
      class MicroAppManager {
        constructor() {
          this.microApps = []
          this.init()
        }

        init() {
          this.fetchMicroApps()
          this.setupNavListener()
          this.setupHashChangeListener()
        }

        fetchMicroApps() {
          fetch('/microapps', { method: 'POST' })
            .then(res => res.json())
            .then(apps => {
              this.microApps = apps
              this.createNav()
              this.prefetchResources()
            })
        }

        createNav() {
          const nav = document.getElementById('nav')
          this.microApps.forEach(app => {
            const button = document.createElement('button')
            button.textContent = app.name
            button.id = app.id
            nav.appendChild(button)
          })
        }

        prefetchResources() {
          this.microApps.forEach(app => {
            if (app.prefetch) {
              this.prefetch(app.script, 'script')
              this.prefetch(app.style, 'style')
            }
          })
        }

        prefetch(href, as) {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.as = as
          link.href = href
          document.head.appendChild(link)
        }

        setupNavListener() {
          document.getElementById('nav').addEventListener('click', e => {
            window.location.hash = e.target.id
          })
        }

        setupHashChangeListener() {
          window.addEventListener('hashchange', () => {
            const appId = window.location.hash.replace('#', '')
            this.microApps.forEach(async app => {
              if (app.id === appId) {
                await this.loadApp(app)
                window[app.mount]('#micro-app-slot')
              } else {
                window[app.unmount]?.()
              }
            })
          })
        }

        loadApp(app) {
          return Promise.all([
            this.loadScript(app.script, app.id),
            this.loadStyle(app.style, app.id),
          ])
        }

        loadScript(src, id) {
          return new Promise((resolve, reject) => {
            if (document.querySelector(`[data-script-id="${id}"]`)) {
              return resolve()
            }
            const script = document.createElement('script')
            script.src = src
            script.setAttribute('data-script-id', id)
            script.onload = resolve
            script.onerror = reject
            document.body.appendChild(script)
          })
        }

        loadStyle(href, id) {
          return new Promise((resolve, reject) => {
            if (document.querySelector(`[data-style-id="${id}"]`)) {
              return resolve()
            }
            const link = document.createElement('link')
            link.href = href
            link.rel = 'stylesheet'
            link.setAttribute('data-style-id', id)
            link.onload = resolve
            link.onerror = reject
            document.head.appendChild(link)
          })
        }
      }

      new MicroAppManager()
    </script>
  </body>
</html>
```

#### 微应用的实现

每个微应用都需要提供挂载和卸载的全局函数。以下是 `micro1` 和 `micro2` 的简单实现：

```javascript
// micro1.js
;(function () {
  let root
  window.micro1_mount = function (slot) {
    root = document.createElement('h1')
    root.textContent = '微应用1'
    document.querySelector(slot).appendChild(root)
  }
  window.micro1_unmount = function () {
    root?.parentNode?.removeChild(root)
  }
})()
```

```javascript
// micro2.js
;(function () {
  let root
  window.micro2_mount = function (slot) {
    root = document.createElement('h1')
    root.textContent = '微应用2'
    document.querySelector(slot).appendChild(root)
  }
  window.micro2_unmount = function () {
    root?.parentNode?.removeChild(root)
  }
})()
```

#### 服务端的实现

服务端通过简单的 API 返回微应用的配置信息，包括脚本和样式的路径：

```javascript
// main-server.js
import express from 'express'
import config from './config.js'
const app = express()

app.use(express.static('public/main'))

app.post('/microapps', (req, res) => {
  res.json([
    {
      name: 'micro1',
      id: 'micro1',
      script: `http://${config.host}:${config.port.micro}/micro1.js`,
      style: `http://${config.host}:${config.port.micro}/micro1.css`,
      mount: 'micro1_mount',
      unmount: 'micro1_unmount',
      prefetch: true,
    },
    {
      name: 'micro2',
      id: 'micro2',
      script: `http://${config.host}:${config.port.micro}/micro2.js`,
      style: `http://${config.host}:${config.port.micro}/micro2.css`,
      mount: 'micro2_mount',
      unmount: 'micro2_unmount',
      prefetch: true,
    },
  ])
})

app.listen(config.port.main, config.host, () => {
  console.log(`Main app running at http://${config.host}:${config.port.main}`)
})
```

### 动态 Script 方案的挑战

尽管动态 Script 方案具备诸多优势，但它也面临一些挑战：

1. **全局变量冲突**：主应用和微应用之间可能会因为共享全局变量而产生冲突。为了解决这个问题，可以考虑使用 `iframe` 或者 `Shadow DOM` 来隔离作用域。

2. **CSS 样式冲突**：微应用的样式可能会覆盖主应用的样式，导致样式污染。为了解决这个问题，可以通过 CSS Modules 或者 BEM 命名规范来避免样式冲突。

### 总结

动态 Script 方案为微前端架构提供了一种灵活且高效的实现方式。通过动态加载微应用的资源，主应用可以在不重新构建的情况下，灵活地管理微应用的上线和下线。尽管这种方案存在一些挑战，但通过合理的设计和优化，完全可以在实际项目中应用并发挥其优势。
