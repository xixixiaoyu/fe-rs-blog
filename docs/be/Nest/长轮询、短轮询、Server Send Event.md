轮询是一种在客户端和服务器之间进行通信的技术，主要用于从服务器获取实时更新数据。根据轮询的机制，可以分为短轮询和长轮询。
## 短轮询
短轮询是一种简单的轮询方式，客户端以固定的时间间隔向服务器发送请求，不论服务器是否有数据更新。
```javascript
import axios from 'axios';

function shortPolling() {
  setInterval(() => {
    axios.get('/api/data')
      .then(response => {
        console.log('短轮询数据:', response.data);
        // 处理数据
      })
      .catch(error => {
        console.error('短轮询错误:', error);
      });
  }, 5000); // 每5秒请求一次
}

shortPolling();
```
适用场景：适合实时性要求不高、需要控制服务器负载的场景。


## 长轮询
长轮询是一种更加高效的轮询方式。客户端发送请求后，服务器会保持请求开放，直到有新数据可发送或达到超时时间。
```javascript
import axios from 'axios';

function longPolling() {
  function poll() {
    axios.get('/api/data', {
      timeout: 60000 // 设置长时间的超时时间
    })
      .then(response => {
        console.log('长轮询数据:', response.data);
        // 处理数据
        poll(); // 数据处理完毕后，再次发起长轮询请求
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('长轮询被取消:', error.message);
        } else {
          console.error('长轮询错误:', error);
        }
        setTimeout(poll, 5000); // 发生错误后，等待5秒再次发起请求
      });
  }

  poll();
}

longPolling();
```
适用场景：适合需要较高实时性、减少请求次数的场景。<br />短轮询和长轮询相比，都不如 WebSocket 和 Server-Sent Events（SSE）在实时性和效率上表现好。

## WebSocket 和 SSE 通信过程
#### WebSocket

- 客户端发起握手：客户端向服务器发送一个特殊的 HTTP 请求，请求中包含 Upgrade: websocket 和 Connection: Upgrade 头部字段，表明客户端希望将通信协议从 HTTP 升级到 WebSocket。
- 服务器响应握手：如果服务器支持 WebSocket，则会返回一个 HTTP 响应，状态码为 101，同时携带相应的头部字段 Upgrade: websocket 和 Connection: Upgrade，确认协议切换。
- 数据传输：握手成功后，客户端和服务器可以直接交换文本和二进制数据，不需要像传统的 HTTP 请求那样每次交互都需要发起一个新的请求。
- 关闭连接：任何一方可以通过发送一个关闭帧来发起关闭连接的握手，该帧包含关闭的原因和状态码。


#### SSE
SSE 是一种轻量级的协议，允许服务器向客户端推送实时数据。适用于如下场景：

- 私信通知
- 股票行情更新
- 新闻订阅

而基于 HTTP 协议的 Server Send Event 通信过程：

1. **客户端请求**：通过普通的HTTP GET请求，并在头部包含 Accept: text/event-stream。
2. **服务器响应**：保持连接打开，设置响应 Content-Type: text/event-stream，开始发送数据，可以多次发送。
3. **发送消息**：服务器按照 SSE 的格式发送消息，每条消息通常包含一个事件类型（event）、数据（data）和一个可选的 id。消息以两个换行符 \n\n 结尾。例如
```
data: 第一条消息内容\n\n
```
或者，如果一条消息包含多行数据，它会这样发送：
```
data: first line\n
data: second line\n\n
```
如果指定了事件类型和 id，它们将作为消息的一部分被发送：
```
id: 1
event: myMessage
data: 第二条消息内容\n\n
```

4. **客户端处理**：在 JS 中，通过创建一个 EventSource 对象并监听它的 onmessage 事件。如果服务器指定了事件类型，例如上面指定了 myMessage，客户端需要监听 myMessage 事件类型以收到数据。
5. **保持连接**：如果连接断开，客户端会尝试重新连接。如果服务器提供了 id，客户端会在重连时发送 Last-Event-ID 头部，以便服务器从正确的数据点继续发送。
6. **关闭连接**：客户端可以调用 EventSource 对象的 close() 方法关闭连接。服务器也可以通过发送特定消息指示关闭。

CI/CD 平台的实时日志打印，ChatGPT 的分段加载回答，通常基于 SSE 实现。<br />SSE 通常用于传输文本数据，不推荐用于传输大量二进制数据。

## Nest 实现 SSE 接口
我们实现一下，创建 nest 项目：
```bash
npx nest new sse-project
```
运行：
```bash
npm run start:dev
```
在 AppController 添加一个 stream 接口：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706957776302-c82ceab7-ecda-43f5-a51f-ef0e56c2f70f.png#averageHue=%232e2d2b&clientId=ufeae9895-cc8b-4&from=paste&height=441&id=uc1db8927&originHeight=882&originWidth=1152&originalType=binary&ratio=2&rotation=0&showTitle=false&size=113889&status=done&style=none&taskId=u92ca291f-1e75-40eb-bf07-c98b3e89604&title=&width=576)<br />使用 `@Sse()` 装饰器来标记为 SSE 端点。<br />返回的是一个 Observable 对象，然后内部用 observer.next 返回消息。<br />sse1 我们先返回了 'hello'，三秒后返回了 'world'。

我们支持下跨域：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706957258939-87c8e508-4330-4f0f-a2fd-e73ef44506df.png#averageHue=%23322f2c&clientId=ufeae9895-cc8b-4&from=paste&height=184&id=ub137bb03&originHeight=368&originWidth=1034&originalType=binary&ratio=2&rotation=0&showTitle=false&size=47604&status=done&style=none&taskId=u2941016f-d8a3-4503-9392-6745c16f3e1&title=&width=517)

## React 接收 SSE 接口数据
写一个前端页面，创建 react 项目：
```bash
npx create-react-app --template=typescript sse-project-frontend
```
在 App.tsx 里写如下代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706958281524-9804b928-785c-4f2f-905b-779c1c0aa055.png#averageHue=%23302e2c&clientId=ufeae9895-cc8b-4&from=paste&height=569&id=ue56521dd&originHeight=1138&originWidth=1508&originalType=binary&ratio=2&rotation=0&showTitle=false&size=191865&status=done&style=none&taskId=u147cf932-4fe6-4491-82e8-8345224efe2&title=&width=754)<br />通过 new EventSource 这个原生 API，监听上面的  onmessage 回调函数，获取 sse 接口的响应。



将渲染 App 外层的严格模式注释，它会导致多余的渲染。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693321854316-68ecbfc0-2674-4a3d-8fb9-acb70ef3558d.png#averageHue=%23323130&clientId=u1a56e34c-2520-4&from=paste&height=123&id=u422353c6&originHeight=246&originWidth=480&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22860&status=done&style=none&taskId=ua6cc570f-75db-4e9c-a2f1-30d8cae2501&title=&width=240)<br />执行 npm run start。

因为 3000 端口被 nest 应用占用了，react 应用跑在 3001 端口。<br />点击 event1 按钮：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706958332760-d7af04e2-6409-4ba8-a0e1-b10d7bb30519.png#averageHue=%23f0f0ef&clientId=ufeae9895-cc8b-4&from=paste&height=135&id=plUDR&originHeight=270&originWidth=564&originalType=binary&ratio=2&rotation=0&showTitle=false&size=18519&status=done&style=none&taskId=u8cc610b1-39e0-4be1-ba55-c111f6b00be&title=&width=282)<br />控制台先打印 'hello'，三秒后打印 'world'，我们可以取里面的 data 属性拿到最终数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706958389028-ae0afde1-ad92-41d6-9b25-dae31be152c1.png#averageHue=%23fbf5f3&clientId=ufeae9895-cc8b-4&from=paste&height=60&id=VZBd4&originHeight=120&originWidth=2350&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75393&status=done&style=none&taskId=ubc06cedb-7729-40a8-87c3-8d6fa323f68&title=&width=1175)

点击 even2 按钮：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706958485756-29195a0c-23f0-4ba7-97cf-f4015f303063.png#averageHue=%23f0efef&clientId=ufeae9895-cc8b-4&from=paste&height=123&id=u7fd697c3&originHeight=246&originWidth=546&originalType=binary&ratio=2&rotation=0&showTitle=false&size=16279&status=done&style=none&taskId=u339f97ca-6555-48a5-b939-096ff7a1c77&title=&width=273)<br />控制台不断打印：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706958516008-d79ecf9e-a04a-478c-af6f-56e849446a23.png#averageHue=%23fcf8f8&clientId=ufeae9895-cc8b-4&from=paste&height=168&id=u41370181&originHeight=336&originWidth=2346&originalType=binary&ratio=2&rotation=0&showTitle=false&size=160010&status=done&style=none&taskId=u5dd2fe4a-4281-41a9-a3c9-8bd778a388c&title=&width=1173)<br />表明我们不断收到服务端推送的数据。

响应的 Content-Type 是 text/event-stream：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706958596680-d9d96ab7-bf39-4fc2-a5ac-54baecd98b17.png#averageHue=%23f5f4f3&clientId=ufeae9895-cc8b-4&from=paste&height=197&id=uf7f830d5&originHeight=394&originWidth=1424&originalType=binary&ratio=2&rotation=0&showTitle=false&size=66690&status=done&style=none&taskId=u4a185a28-952f-4f0a-8875-41c09f50f20&title=&width=712)<br />然后在 EventStream 可以看到每次收到的消息：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706958609967-756f2155-fee0-461a-b770-95fa71c0d5e2.png#averageHue=%23f0f1f4&clientId=ufeae9895-cc8b-4&from=paste&height=230&id=u39fcd0f9&originHeight=460&originWidth=2166&originalType=binary&ratio=2&rotation=0&showTitle=false&size=131905&status=done&style=none&taskId=u81eda92c-fe0c-4b09-8a29-b08e58d01d7&title=&width=1083)

## SSE 日志实时推送
`tail -f` 命令可以实时看到文件的最新内容：<br />我们可以通过 child_process 模块的 exec 来执行这个命令，监听 log 文件改动，返回给客户端改动内容：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706960582471-d23b3542-b24f-4a21-b62b-5b3aadfb7b9a.png#averageHue=%232e2d2b&clientId=u133b2606-de2a-4&from=paste&height=261&id=u10db5977&originHeight=522&originWidth=1226&originalType=binary&ratio=2&rotation=0&showTitle=false&size=81344&status=done&style=none&taskId=ud53b7c62-ce55-4804-b6bf-7fba34ec419&title=&width=613)<br />./log 指的是当前工作目录下名为 log 的文件。在这里，. 表示当前工作目录。<br />可以输入 `node` 然后再输入 `process.cwd()` 来查看当前的工作目录。<br />前端连接这个新接口：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706960706384-7f1449b6-ef06-4a09-8c47-73d6d2d8db6e.png#averageHue=%232e2d2b&clientId=u133b2606-de2a-4&from=paste&height=181&id=u4598cb2c&originHeight=362&originWidth=1488&originalType=binary&ratio=2&rotation=0&showTitle=false&size=60448&status=done&style=none&taskId=ua58e4515-8e37-448c-8ecf-19fd8061d6d&title=&width=744)<br />输入 111 保存，再输入 222 保存：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706960834211-470fe49a-2a01-47b3-a542-f9ae2ba7a4ad.png#averageHue=%23303030&clientId=u133b2606-de2a-4&from=paste&height=77&id=u5e9918ed&originHeight=154&originWidth=274&originalType=binary&ratio=2&rotation=0&showTitle=false&size=8103&status=done&style=none&taskId=u70cc0b48-eb02-436b-9822-7a35c956e3e&title=&width=137)<br />控制台打印两条信息：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706960781896-cdaeae42-34c8-4cea-b25d-a4805849c92b.png#averageHue=%23faf4f4&clientId=u133b2606-de2a-4&from=paste&height=48&id=u1203ce27&originHeight=96&originWidth=2346&originalType=binary&ratio=2&rotation=0&showTitle=false&size=73380&status=done&style=none&taskId=ub7b3a8b6-5015-4ff6-8ba0-8eb77ae65cd&title=&width=1173)<br />浏览器收到了实时的日志，可以对 data 属性值进行 `JSON.parse()`。<br />很多构建日志都是通过 SSE 的方式实时推送的。
