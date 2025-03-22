1. **语义化标签**  
   新增了像 `<header>`、`<footer>`、`<nav>`、`<article>`、`<section>` 这些标签，让网页结构更清晰，搜索引擎也更容易理解内容。

2. **媒体支持**  
   直接嵌入视频和音频不用插件了：
   ```html
   <video src='movie.mp4' controls></video>
   <audio src='song.mp3' controls></audio>
   ```

3. **图形绘制**  
   `<canvas>` 标签可以动态画图，配合 JavaScript 做动画或游戏都很方便。

4. **表单增强**  
   输入框类型多了 `email`、`date`、`number` 等，还有 `placeholder` 提示和自动验证：
   ```html
   <input type='email' placeholder='输入邮箱' required>
   ```

5. **本地存储**  
   `localStorage` 和 `sessionStorage` 存数据比 Cookie 更简单，容量也更大：
   ```javascript
   localStorage.setItem('name', '小明')
   console.log(localStorage.getItem('name')) // 小明
   ```

6. **离线应用**  
   通过 `manifest` 文件缓存资源，断网也能访问页面。

7. **拖放 API**  
   用 `draggable` 属性就能轻松实现拖拽元素：
   ```html
   <div draggable='true'>拖我试试</div>
   ```

8. **地理定位**  
   获取用户位置（需授权）：
   ```javascript
   navigator.geolocation.getCurrentPosition(position => {
     console.log('纬度：', position.coords.latitude)
   })
   ```

9. **Web Workers**  
   后台运行脚本不卡页面：
   ```javascript
   const worker = new Worker('task.js')
   worker.postMessage('开始计算')
   ```

10. **WebSocket**  
    实时双向通信，适合聊天或游戏：
    ```javascript
    const socket = new WebSocket('ws://example.com')
    socket.onmessage = event => {
      console.log('收到消息：', event.data)
    }
    ```
