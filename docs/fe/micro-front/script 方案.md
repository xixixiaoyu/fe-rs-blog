# 动态 Script 方案：微前端的灵活实现

在现代前端开发中，微前端架构逐渐成为一种流行的解决方案，尤其是在大型项目中，它能够帮助团队将不同的功能模块独立开发、部署和维护。上一节课程中，我们通过封装 NPM 包的方式实现了微前端架构，这种方式虽然有效，但在实际应用中，往往需要主应用升级相应的 NPM 版本依赖并进行构建处理，显得不够灵活。

为了让主应用具备线上动态管理微应用的能力，**动态加载 Script** 是一种更为灵活的方案。本文将详细介绍这种方案的实现方式、优势以及可能遇到的问题。

## 动态 Script 方案的基本思路

动态 Script 方案的核心思想是通过动态加载 JavaScript 和 CSS 文件来实现微应用的挂载和卸载。主应用通过请求获取微应用的资源列表，并根据用户的操作动态加载相应的微应用资源。以下是一个简单的示例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>微前端示例</title>
  </head>
  <body>
    <!-- 主导航 -->
    <div id="nav">
      <button onclick="handleClick('x')">x 应用</button>
      <button onclick="handleClick('y')">y 应用</button>
    </div>
    <!-- 微应用插槽 -->
    <div id="micro-app-slot"></div>

    <!-- 微应用 x -->
    <script defer src="http://xxx/x.js"></script>
    <!-- 微应用 y -->
    <script defer src="http://yyy/y.js"></script>

    <script>
      function handleClick(type) {
        switch (type) {
          case 'x':
            window.xMount('#micro-app-slot')
            window.yUnmount()
            break
          case 'y':
            window.yMount('#micro-app-slot')
            window.xUnmount()
            break
          default:
            break
        }
      }
    </script>
  </body>
</html>
```

在这个示例中，主应用通过点击按钮动态加载微应用，并通过 `window.xMount` 和 `window.yUnmount` 等全局函数来控制微应用的挂载和卸载。

## 动态加载的实现细节

在实际项目中，微应用的加载和卸载往往需要更加动态化。我们可以通过请求后端接口获取微应用的列表，并根据用户的操作动态加载相应的 JS 和 CSS 资源。以下是一个相对完整的实现思路：

1. **获取微应用列表**：主应用通过请求后端接口获取微应用的列表数据。
2. **预加载资源**：对于需要预加载的微应用，提前加载其静态资源（JS 和 CSS），以提高用户体验。
3. **动态加载和卸载**：根据用户的操作，动态加载微应用的 JS 和 CSS 文件，并调用微应用的 `mount` 和 `unmount` 函数进行挂载和卸载。

### 主应用的实现

主应用的 HTML 结构如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>微前端主应用</title>
    <style>
      h1 {
        color: red;
      }
    </style>
  </head>
  <body>
    <h1>Hello，Dynamic Script!</h1>
    <div id="nav"></div>
    <div id="micro-app-slot"></div>

    <script type="text/javascript">
      class UtilsManager {
        // 获取微应用列表
        getMicroApps() {
          return fetch('/microapps', { method: 'post' })
            .then(res => res.json())
            .catch(err => console.error(err))
        }

        // 动态加载 JS 文件
        loadScript({ script, id }) {
          return new Promise((resolve, reject) => {
            const $script = document.createElement('script')
            $script.src = script
            $script.setAttribute('micro-script', id)
            $script.onload = resolve
            $script.onerror = reject
            document.body.appendChild($script)
          })
        }

        // 动态加载 CSS 文件
        loadStyle({ style, id }) {
          return new Promise((resolve, reject) => {
            const $style = document.createElement('link')
            $style.href = style
            $style.setAttribute('micro-style', id)
            $style.rel = 'stylesheet'
            $style.onload = resolve
            $style.onerror = reject
            document.head.appendChild($style)
          })
        }

        // 删除 CSS 文件
        removeStyle({ id }) {
          const $style = document.querySelector(`[micro-style=${id}]`)
          $style && $style.parentNode.removeChild($style)
        }
      }

      class MicroAppManager extends UtilsManager {
        constructor() {
          super()
          this.init()
        }

        init() {
          this.getMicroApps().then(apps => {
            this.microApps = apps
            this.createNav()
            this.listenHashChange()
          })
        }

        // 创建导航
        createNav() {
          const nav = document.getElementById('nav')
          this.microApps.forEach(app => {
            const button = document.createElement('button')
            button.textContent = app.name
            button.id = app.id
            nav.appendChild(button)
          })
        }

        // 监听 Hash 变化
        listenHashChange() {
          window.addEventListener('hashchange', () => {
            const appId = window.location.hash.replace('#', '')
            this.microApps.forEach(async app => {
              if (app.id === appId) {
                await this.loadStyle(app)
                await this.loadScript(app)
                window[app.mount]('#micro-app-slot')
              } else {
                this.removeStyle(app)
                window[app.unmount]()
              }
            })
          })
        }
      }

      new MicroAppManager()
    </script>
  </body>
</html>
```

### 微应用的实现

微应用的 JS 和 CSS 文件可以是任何前端框架（如 React 或 Vue）打包后的资源。以下是一个简单的示例：

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
    root && root.parentNode.removeChild(root)
  }
})()
```

```css
/* micro1.css */
h1 {
  color: green;
}
```

## 动态 Script 方案的优势

1. **灵活性高**：主应用可以在不重新构建的情况下动态加载、更新或删除微应用，极大地提高了系统的灵活性。
2. **性能优化**：微应用可以进行代码分割和静态资源分离处理，支持按需加载，减少不必要的资源浪费。
3. **无需模块化适配**：与 NPM 包方案不同，动态 Script 方案不需要对微应用进行额外的库构建配置，减少了开发和维护成本。

## 可能遇到的问题

1. **全局变量冲突**：主应用和微应用之间可能会因为共享全局变量而产生冲突。为了解决这个问题，可以考虑使用 `iframe` 或者 Web Components 来隔离作用域。
2. **CSS 样式冲突**：微应用的 CSS 样式可能会覆盖主应用的样式，导致样式污染。可以通过 CSS Modules 或者 Shadow DOM 来避免这种问题。
3. **JS 文件的缓存问题**：虽然可以动态加载 JS 文件，但一旦加载后，JS 文件会一直保留在内存中，无法像 CSS 文件一样轻松移除。如果需要更新微应用的逻辑，可能需要刷新整个页面。

## 总结

动态 Script 方案为微前端架构提供了一种灵活且高效的实现方式。通过动态加载微应用的 JS 和 CSS 文件，主应用可以在不重新构建的情况下实现微应用的动态管理。然而，这种方案也存在一些潜在的问题，如全局变量和样式冲突，需要在实际项目中根据具体情况进行优化和调整。

在未来的开发中，随着微前端技术的不断发展，我们可以期待更多的工具和框架来帮助我们更好地管理和优化微前端架构。
