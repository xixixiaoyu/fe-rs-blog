### SSE 是什么？

简单来说，SSE 就是服务器主动“推”消息给浏览器的一种技术。

想象一下，你在餐厅点餐，服务员不用你催单，自己就每隔几分钟跑过来跟你说：“嘿，你的菜好了！” 这就有点像 SSE 的工作原理 —— 服务器通过 HTTP 连接，把更新一股脑儿推给客户端，而且是单向的，客户端只需要等着接收就好。

每条消息都以文本形式发送，末尾加上两个换行符（\n\n），告诉浏览器：“这条消息完事儿了，下一条接着来！” 这种方式特别适合需要实时更新的场景，比如实时通知、数据监控啥的。



### 用起来咋样？以 NestJS 为例

Nest 可以用 @Sse() 装饰器来搞定服务器推送。代码长这样：

```ts
import { Sse } from '@nestjs/common'
import { Observable, interval } from 'rxjs'
import { map } from 'rxjs/operators'

@Sse('sse')
sse(): Observable<MessageEvent> {
  return interval(1000).pipe(
    map((_) => ({ data: { hello: 'world' } }))
  )
}
```

- **@Sse('sse')**：这个装饰器告诉 NestJS，“嘿，这个路由叫 /sse，专门用来推消息！”
- **interval(1000)**：这是 rxjs 提供的一个工具，意思是“每 1000 毫秒（1 秒）干一次事儿”。
- **map**：把每次触发变成一个对象，里面有 data: { hello: 'world' }，就像是服务器每秒给你发一句“你好，世界”。
- **Observable**：SSE 的核心要求，返回的东西必须是这种“流”，能不停地吐数据出来。



### 客户端怎么接？

服务器推送了消息，浏览器咋知道呢？这时候就得靠 **EventSource API** 了。客户端代码超级简单：

```ts
const eventSource = new EventSource('/sse')
eventSource.onmessage = ({ data }) => {
  console.log('新消息', JSON.parse(data))
}
```

1. **new EventSource('/sse')**：告诉浏览器去连服务器的 /sse 地址，建立了连接后，服务器就开始源源不断地推送消息。
2. **onmessage**：每次收到消息，浏览器就跑来喊一声，这里的 data 是服务器发来的内容（比如 { hello: 'world' }），用 JSON.parse 转成对象就能用了。

连接会一直开着，除非你主动调用 eventSource.close() 把它关掉。消息格式是 text/event-stream，简单点说，就是纯文本，但有固定规则。



### MessageEvent 长啥样？

在 TypeScript 里，MessageEvent 接口是这样的：

```ts
export interface MessageEvent {
  data: string | object  // 消息内容，必须有
  id?: string           // 消息 ID，可选
  type?: string         // 事件类型，可选
  retry?: number        // 重试时间（毫秒），可选
}
```

- **data**：核心内容，可以是字符串，也可以是对象（比如 { hello: 'world' }）。
- **type**：如果写了这个，客户端会触发对应的事件类型；没写就默认触发 message 事件。
- **id** 和 **retry**：一般用在断线重连时，告诉客户端“这是第几条消息”或者“断了我多久再试”。

比如服务器发了个 { data: 'hi', type: 'greeting' }，客户端就能这么监听：

```ts
eventSource.addEventListener('greeting', ({ data }) => {
  console.log('收到问候：', data)  // 输出 "收到问候：hi"
})
```



### 为啥用 SSE？有啥不一样？

你可能会问：“HTTP 不都是客户端主动请求吗？SSE 咋反着来？” 其实 SSE 是基于 HTTP 的，但它利用了长连接，让服务器主动开口。跟 WebSocket 比，它简单得多：

- **SSE**：单向推送，服务器到客户端，适合通知、实时数据流。
- **WebSocket**：双向通信，客户端也能回话，适合聊天、游戏这种复杂场景。

SSE 的优点是轻量，浏览器支持好（IE 除外，哈哈），而且用 HTTP 协议，不用额外开端口。缺点是只能服务器推，客户端没法主动“聊回去”。



### 小结：SSE 好用吗？

说实话，SSE 特别适合“服务器有话要说”的场景。比如你做个实时股价监控，每秒推最新价格，或者搞个消息通知系统，SSE 都能轻松搞定。实现起来也不复杂，服务端配个 Observable，客户端挂个 EventSource，就齐活儿了。

当然，它不是万能的。如果需要双向互动，还是得找 WebSocket。不过对于简单实时推送，SSE 绝对是省心又高效的选择。