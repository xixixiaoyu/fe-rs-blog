### **先从 Vite 的本质聊起**

Vite 是个现代前端构建工具，它的性能优势主要来自它的设计理念。简单来说，它有两种模式：

1. **开发模式**：用的是浏览器原生支持的 ES 模块（ESM）。你改一行代码，浏览器只重新加载那一个模块，不用像 Webpack 那样每次都打包整个项目。这就让启动和热更新（HMR）快得飞起。
2. **生产模式**：切换到 Rollup，打包出优化后的静态文件，适合上线部署。

所以，优化 Vite 性能，咱们得从这两个阶段入手：开发时让它更快响应，生产时让打包结果更小、更高效。



### **开发模式：让写代码更爽**

开发时的体验直接影响效率，咱们先从这块优化。

#### **1. 别让依赖拖后腿**
Vite 启动时会扫描 `node_modules`，把依赖预构建成 ESM 格式。如果项目依赖多，这个过程可能会慢下来。咋办呢？
- **手动指定预构建范围**：在 `vite.config.js` 里用 `optimizeDeps.include` 和 `exclude` 告诉 Vite 哪些依赖需要提前处理，哪些可以跳过。比如：
  
  ```javascript
  export default {
    optimizeDeps: {
      include: ['lodash-es', 'axios'], // 常用库提前预构建
      exclude: ['big-heavy-lib'] // 不常用的跳过
    }
  }
  ```

#### **2. HMR 再提速**
Vite 的热更新已经很快了，但如果改个文件还是感觉卡，可以试试：
- **模块化拆分**：别让单个文件太大，几十 KB 的代码改起来肯定比几 MB 快。
- **更新预处理器**：用 Sass 或 Less？检查一下插件版本，老版本可能会拖慢编译速度。

#### **3. 接口代理搞顺畅**
开发时如果老跟后端接口打交道，配置个代理能省不少麻烦。不仅解决跨域，还能减少网络延迟。比如：
```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}
```
这样请求 `/api/data` 就直接走代理，开发体验丝滑。



### **生产模式：让上线更快更稳**

生产环境的目标是让用户加载快、体验好，咱们从打包结果入手。

#### **1. 代码分割和懒加载**
Vite 默认用 Rollup 打包，支持代码分割。想让首屏更快？试试动态导入：
```javascript
const BigComponent = () => import('./BigComponent.vue')
```
这样 `BigComponent` 不会一开始就加载，用户点到它时再下载，省下不少流量。

#### **2. Tree Shaking 扫垃圾**
Tree Shaking 是 Vite 和 Rollup 的杀手锏，能自动删掉没用到的代码。怎么用好它？
- **用 ESM 语法**：别用 `require`，坚持 `import/export`。
- **按需导入**：别整个库都引进来，比如：
  ```javascript
  // 不好
  import _ from 'lodash'
  // 好
  import { throttle } from 'lodash-es'
  ```
  这样没用的代码就被抖掉了。

#### **3. 压缩到极致**
Vite 默认用 Terser 压缩代码，但你可以加点料。比如用 `vite-plugin-compression` 做 Gzip 或 Brotli 压缩：
```javascript
import viteCompression from 'vite-plugin-compression'

export default {
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240 // 大于 10 KB 的才压
    })
  ]
}
```
文件小了，加载自然快。

#### **4. 静态资源也得瘦身**
图片、字体这些资源也能优化：
- **小文件转 Base64**：Vite 默认把小于 4 KB 的文件转成 Base64，嵌进代码里，少发请求。
- **CDN 加速**：资源多的话，可以放 CDN 上，配置 `base`：
  ```javascript
  export default {
    base: 'https://cdn.example.com/assets/'
  }
  ```
- **图片压缩**：用 `vite-plugin-imagemin` 压一压图片，效果立竿见影。

#### **5. 缓存玩出花**
Vite 默认给文件名加哈希（比如 `main.123abc.js`），保证文件更新时浏览器能及时刷新。配合服务器缓存策略，比如 Nginx：
```nginx
location /assets/ {
  add_header Cache-Control 'public, max-age=31536000, immutable';
}
```
用户第二次访问就直接用缓存，速度飞起。



### **锦上添花的小技巧**

#### **1. 分析打包体积**
想知道哪些文件拖了后腿？用 `rollup-plugin-visualizer`：
```javascript
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [
    visualizer({
      open: true,
      filename: 'stats.html'
    })
  ]
}
```
构建完自动打开报告，哪儿大一目了然。

#### **2. 保持版本新鲜**
Vite 团队一直在优化性能，定期更新 Vite 和插件，能吃到最新的红利。

#### **3. CDN 提速第三方库**
把 Vue、Lodash 这些放 CDN 上，用 `vite-plugin-cdn-import`：
```javascript
import importToCDN from 'vite-plugin-cdn-import'

export default {
  plugins: [
    importToCDN({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: 'https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js'
        }
      ]
    })
  ]
}
```
本地包少了，构建更快。



### **总结：优化的套路**

Vite 性能优化其实就两条主线：
- **开发时**：少加载依赖、HMR 提速、代理搞定接口。
- **生产时**：代码分割、Tree Shaking、压缩资源、用好缓存。

实操建议：
1. 先用 `visualizer` 找到大包，优先解决。
2. 首屏控制在 500 KB 内，用 Lighthouse 测一测。
3. 前三步（依赖、分割、压缩）做好，80% 的性能问题就没了。

