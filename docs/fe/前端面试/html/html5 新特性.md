### 1.语义化标签

写网页就像搭积木，以前我们只能用一堆 `<div>` 来堆砌，代码看着乱不说，seo 也不好。

现在 HTML5 给了更语义化的标签：

```html
<header>这里是网站标题</header>
<nav>导航菜单在这儿</nav>
<article>这是一篇独立的文章</article>
<footer>版权信息放这儿</footer>
```

不仅代码看着清爽，对 seo 也很友好。



### 2.多媒体支持

还记得以前看个视频还得装 flash 插件的日子吗？现在 html5 用 `<video>` 和 `<audio>` 标签就能嵌入媒体，连播放按钮都自带：

```html
<video src="movie.mp4" controls>你的浏览器不支持视频哦</video>
<audio src="song.mp3" controls>浏览器不支持音频</audio>
```



### 3.图形绘制

想在网页上画个动画或者做个小游戏？HTML5 的 `<canvas>` 和 `<svg>` 就是你的新画板。

- `<canvas>` 是个动态画布，配合 JavaScript，你可以画图、做动画，甚至开发个小游戏。比如画个笑脸或者实时图表，完全不在话下。
- `<svg>` 则是矢量图形，放大缩小不模糊，适合做图标或者复杂的设计。  

```html
<canvas id="myCanvas" width="200" height="100"></canvas>
<script>
  let canvas = document.getElementById('myCanvas')
  let ctx = canvas.getContext('2d')
  ctx.fillStyle = 'red'
  ctx.fillRect(10, 10, 50, 50) // 画个红方块
</script>
```



### 4.表单增强

以前网页表单就那几个类型，填个邮箱还得自己检查格式。现在 HTML5 直接内置了一堆新输入类型，像 email、date、number、color，还有超贴心的属性，比如 placeholder（提示文字）、required（必填）、autofocus（自动聚焦）。

```html
<input type="email" placeholder="输入你的邮箱" required>
<input type="date" name="birthday">
```

浏览器会自动帮你校验邮箱格式，日期还能弹出日历选择。



### 5.本地存储

以前存点数据还得靠 Cookie，不仅麻烦，容量还小得可怜。HTML5 带来了 localStorage 和 sessionStorage，简单又能装。

- localStorage 是永久存储，除非手动删，不然一直都在。
- sessionStorage 只在当前会话有效，关了浏览器就清空。

```js
localStorage.setItem('username', '小明') // 存数据
console.log(localStorage.getItem('username')) // 取出来：小明
```



### 6.离线应用

HTML5 的离线缓存功能简直是“断网救星”。通过一个 manifest 文件，告诉浏览器把哪些资源存下来，哪怕没网也能正常访问。

比如一个简单的网页：

```html
<html manifest="cache.manifest">
```

cache.manifest 文件里写上要缓存的文件，刷新一下，离线也能打开。



### 7.拖放 API

想让网页元素能拖来拖去？加个 draggable="true" 就行了。

```html
<div draggable="true">拖我试试</div>
```

配合 JavaScript 监听拖放事件，就能实现文件上传或者拖拽排序。



### 8.地理定位

想做个“附近美食推荐”？HTML5 的地理定位 API 能帮你。

```js
navigator.geolocation.getCurrentPosition(pos => {
  console.log('你在：', pos.coords.latitude, pos.coords.longitude)
})
```

当然，用户得同意分享位置，但一旦拿到经纬度，配合地图 API，就可以做出更多功能。

