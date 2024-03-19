## 长轮询和短轮询
长轮询和短轮询是两种不同的轮询机制，都是用于从服务器定期获取数据。<br />短轮询是最简单的轮询方式，客户端在固定的时间间隔发送请求到服务器，不管服务器是否有新的数据更新。
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
而长轮询是一种更高效的轮询方式，客户端发送请求到服务器后，服务器会保持这个请求开启，直到有新的数据可以发送给客户端，或者达到某个超时时间后，才会响应请求。
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
从上面例子看出：

- 短轮询适合实时性要求不高、服务器负载需要控制在较低水平的场景。
- 长轮询适合需要较高实时性、减少请求次数的场景，

但是这两者都不如 Websocket 实时性和效率好。

## WebSocket 和 SSE 通信过程
WebSocket 双向通信，客户端和服务器可以在任何时候互相发送数据。<br />如果想更轻量级，而且只需要服务端单向往客户端推送消息，我们可以使用 Server Send Event（SSE），类似私信、股票行情，订阅新闻就很适用 SSE。<br />WebSocket 的通信过程是这样的：

- 客户端发起握手：客户端通过发送一个 HTTP 请求到服务器来初始化一个 WebSocket 连接。这个请求被称为握手请求，它包含了一个特殊的 Upgrade 头，这表明客户端想要切换协议从 HTTP 到 WebSocket。
- 服务器响应握手：如果服务器支持 WebSocket，它会发送一个 101 状态码的 HTTP 响应，其中包含 Upgrade: websocket 和 Connection: Upgrade 头，表示同意协议切换。

双方握手完成后就可以传输文本数据和二进制数据了。<br />任何一方都可以发起关闭握手（close handshake），这是通过发送一个特殊的控制帧来完成的，该控制帧包含了关闭连接的代码和原因。

而基于 HTTP 协议的 Server Send Event 通信过程：

1. **客户端请求**：客户端（通常是一个浏览器）发起一个对服务器的普通 HTTP GET 请求。这个请求的头部会包含一个特殊的 Accept 字段，值为 text/event-stream，这表明客户端希望建立一个 SSE 连接。
2. **服务器响应**：服务器识别这个请求，并保持这个连接打开，而不是像通常的 HTTP 请求那样返回数据后关闭连接。服务器设置响应的 Content-Type 为 text/event-stream，并开始发送数据，可以多次发送数据。
3. **发送消息**：服务器按照 SSE 的格式发送消息，每条消息通常包含一个事件类型（event）、数据（data）和一个可选的 id（id）。消息以两个换行符 \n\n 结尾。例如
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

4. **客户端处理**：客户端监听这个流，并在收到新消息时触发事件。在 JavaScript 中，这是通过创建一个 EventSource 对象并监听它的 onmessage 事件来实现的。如果服务器指定了事件类型，例如上面指定了 myMessage，客户端需要监听 myMessage 事件类型以收到数据。
5. **保持连接**：如果连接意外断开，客户端会自动尝试重新连接到服务器。如果服务器提供了消息的 id，客户端会在重新连接时发送一个 Last-Event-ID 头部，包含上次接收到的消息 id，这样服务器可以从断点继续发送。而 WebSocket 如果断开之后是需要手动重连的。
6. **关闭连接**：客户端可以通过调用 EventSource 对象的 close() 方法来关闭连接。服务器也可以通过发送特定的关闭消息来关闭连接。

CICD 平台的日志是实时打印的，ChatGPT 一段段加载回答，其实都是基于 SSE。<br />注意：SSE 通常传输的数据是文本格式，具体来说是使用 UTF-8 编码的文本数据。如果使用 SSE 传输大量二进制则需要编解码处理，不推荐。

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
