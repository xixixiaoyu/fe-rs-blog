# Web Components：现代 Web 开发的组件化新思路

在现代 Web 开发中，**组件化** 是一个非常重要的概念。它不仅能提高代码的复用性，还能让开发者更好地管理复杂的应用。随着前端技术的不断发展，浏览器原生支持的 **Web Components** 逐渐成为一种新的组件化方案。本文将带你深入了解 Web Components 的工作原理，并通过一个简单的微应用示例，展示如何在项目中使用 Web Components。

## 什么是 Web Components？

Web Components 是一组由 W3C 标准定义的技术，允许开发者创建可复用的、封装良好的自定义 HTML 元素。它主要由以下三部分组成：

1. **Custom Elements**：自定义 HTML 标签，允许开发者定义自己的元素及其行为。
2. **Shadow DOM**：为元素提供封装的 DOM 和样式，避免与页面其他部分的样式冲突。
3. **HTML Templates**：定义可复用的 HTML 结构。

通过这些技术，Web Components 可以像原生 HTML 元素一样使用，并且具备良好的封装性和复用性。

## Web Components 的优势

相比于传统的动态 Script 方案，Web Components 具有以下几个显著的优势：

1. **复用性**：Web Components 不需要对外暴露加载和卸载的全局 API，组件的复用能力更强。
2. **标准化**：Web Components 是 W3C 标准，未来浏览器会持续支持和优化，甚至可能支持 JavaScript 上下文隔离，进一步提升安全性。
3. **插拔性**：Web Components 可以轻松移植到不同的项目中，组件的替换和升级也非常方便。

## Web Components 的劣势

当然，Web Components 也并非完美无缺，它也存在一些劣势：

1. **兼容性**：Web Components 在一些老旧的浏览器（如 IE）上不兼容，需要通过 Polyfill 来解决兼容性问题。
2. **学习曲线**：相较于传统的 Web 开发，Web Components 引入了新的概念和技术，开发者需要花时间去学习和掌握。

## Web Components 实现微应用

接下来，我们通过一个简单的示例，展示如何使用 Web Components 来实现微应用的加载和切换。

### 项目结构

项目的文件结构如下所示：

```
├── public                  # 托管的静态资源目录
│   ├── main/               # 主应用资源目录
│   │   └── index.html
│   └── micro/              # 微应用资源目录
│        ├── micro1.css
│        ├── micro1.js
│        ├── micro2.css
│        └── micro2.js
├── config.js                # 公共配置
├── main-server.js           # 主应用服务
└── micro-server.js          # 微应用服务
```

### 主应用 HTML 实现

主应用的 HTML 代码如下所示：

```html
<!-- public/main/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web Components Demo</title>
    <style>
      h1 {
        color: red;
      }
    </style>
  </head>
  <body>
    <h1>Hello，Web Components!</h1>
    <div id="nav"></div>
    <div class="container">
      <div id="micro-app-slot"></div>
    </div>

    <script type="text/javascript">
      class UtilsManager {
        // ... 省略部分代码 ...
      }

      class MicroAppManager extends UtilsManager {
        micrpApps = []

        constructor() {
          super()
          this.init()
        }

        init() {
          this.processMicroApps()
          this.navClickListener()
          this.hashChangeListener()
        }

        processMicroApps() {
          this.getMicroApps().then(res => {
            this.microApps = res
            this.prefetchMicroAppStatic()
            this.createMicroAppNav()
          })
        }

        prefetchMicroAppStatic() {
          const prefetchMicroApps = this.microApps?.filter(microapp => microapp.prefetch)
          prefetchMicroApps?.forEach(microApp => {
            microApp.script && this.prefetchStatic(microApp.script, 'script')
            microApp.style && this.prefetchStatic(microApp.style, 'style')
          })
        }

        createMicroAppNav() {
          const fragment = new DocumentFragment()
          this.microApps?.forEach(microApp => {
            const button = document.createElement('button')
            button.textContent = microApp.name
            button.id = microApp.id
            fragment.appendChild(button)
          })
          const nav = document.getElementById('nav')
          nav.appendChild(fragment)
        }

        navClickListener() {
          const nav = document.getElementById('nav')
          nav.addEventListener('click', e => {
            window.location.hash = e?.target?.id
          })
        }

        hashChangeListener() {
          const $slot = document.getElementById('micro-app-slot')

          window.addEventListener('hashchange', () => {
            this.microApps?.forEach(async microApp => {
              const $webcomponent = document.querySelector(`[micro-id=${microApp.id}]`)

              if (microApp.id === window.location.hash.replace('#', '')) {
                console.time(`fetch microapp ${microApp.name} static`)
                microApp?.style && !this.hasLoadStyle(microApp) && (await this.loadStyle(microApp))
                microApp?.script &&
                  !this.hasLoadScript(microApp) &&
                  (await this.loadScript(microApp))
                console.timeEnd(`fetch microapp ${microApp.name} static`)

                if (!$webcomponent) {
                  const $webcomponent = document.createElement(microApp.customElement)
                  $webcomponent.setAttribute('micro-id', microApp.id)
                  $slot.appendChild($webcomponent)
                } else {
                  $webcomponent.style.display = 'block'
                }
              } else {
                this.removeStyle(microApp)
                if ($webcomponent) {
                  $webcomponent.style.display = 'none'
                }
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

以 `micro1.js` 为例，微应用的代码如下：

```javascript
// micro1.js
class MicroApp1Element extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    console.log(`[micro-app-1]：执行 connectedCallback 生命周期回调函数`)
    this.mount()
  }

  disconnectedCallback() {
    console.log(`[micro-app-1]：执行 disconnectedCallback 生命周期回调函数`)
    this.unmount()
  }

  mount() {
    const $micro = document.createElement('h1')
    $micro.textContent = '微应用1'
    this.appendChild($micro)
  }

  unmount() {
    // 这里可以去除相应的副作用处理
  }
}

window.customElements.define('micro-app-1', MicroApp1Element)
```

### 主应用服务

在 `main-server.js` 中，我们通过接口返回微应用的配置信息：

```javascript
// main-server.js
app.post('/microapps', function (req, res) {
  res.json([
    {
      name: 'micro1',
      id: 'micro1',
      customElement: 'micro-app-1',
      script: `http://${host}:${port.micro}/micro1.js`,
      style: `http://${host}:${port.micro}/micro1.css`,
      prefetch: true,
    },
    {
      name: 'micro2',
      id: 'micro2',
      customElement: 'micro-app-2',
      script: `http://${host}:${port.micro}/micro2.js`,
      style: `http://${host}:${port.micro}/micro2.css`,
      prefetch: true,
    },
  ])
})
```

## 总结

通过 Web Components，我们可以轻松实现微应用的加载和切换。相比于传统的动态 Script 方案，Web Components 提供了更好的封装性和复用性，同时也减少了全局变量的污染。虽然它在兼容性和学习曲线上存在一定的挑战，但随着浏览器的不断升级，Web Components 的未来前景非常广阔。

如果你正在寻找一种现代化的组件化方案，不妨尝试一下 Web Components。
