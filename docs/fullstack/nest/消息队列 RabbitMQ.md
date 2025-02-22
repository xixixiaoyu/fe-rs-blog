## 前端监控系统概述
前端监控系统主要负责采集用户端的异常、性能、业务埋点等数据，并将这些数据上报到服务端进行存储与可视化分析。<br />随着用户量的增加，数据量也会相应增大，这会对服务端产生较大的并发压力。直接将大量数据存入数据库可能会导致数据库服务崩溃。

## 解决方案：使用消息队列
为了应对高并发情况，可以采用消息队列（如 RabbitMQ）来优化数据处理流程。<br />具体流程如下：

- 数据接收与缓存：一个 Web 服务接收前端发送的数据请求，将数据存入 RabbitMQ，而不是直接写入数据库。
- 数据处理与存储：另一个 Web 服务从 RabbitMQ 中取出数据，然后存入数据库。

这样做的好处是，消息队列的并发处理能力远高于数据库，可以快速响应并缓存大量请求，从而减轻数据库的直接压力。<br />![](https://cdn.nlark.com/yuque/0/2024/jpeg/21596389/1715590462082-31153c2b-597d-448f-ad1d-5f846f6bb8f0.jpeg)

## 消息队列的并发控制
通过设置消息队列的消费速率来控制数据流向数据库的速度，例如设置每次从队列中取出 1w 条消息进行处理。<br />这种方法可以有效避免数据库因突发大流量而崩溃，实现了流量削峰。<br />![](https://cdn.nlark.com/yuque/0/2024/jpeg/21596389/1715590001608-87e6cb85-f599-434f-8fed-532340505a9f.jpeg)

## 消息队列的扩展性
RabbitMQ 支持水平扩展，可以增加多个 Web 服务同时消费队列中的消息，进一步增强系统的处理能力。<br />![](https://cdn.nlark.com/yuque/0/2024/jpeg/21596389/1715590262855-53064aa8-64c8-43db-8d6f-a8920702127d.jpeg)

## 运行 RabbitMQ 服务
我们可以通过 docker 来跑 RabbitMQ。<br />搜索 rabbitmq 的镜像，选择 3.11-management 的版本：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1694533498849-9256beb5-cec9-4a03-a675-09e589dcdd1d.png#averageHue=%231e3040&clientId=u7e184db5-dfa1-4&from=paste&height=483&id=u8d0bf8c0&originHeight=966&originWidth=1614&originalType=binary&ratio=2&rotation=0&showTitle=false&size=158592&status=done&style=none&taskId=u12cffc1e-9982-46a8-a3f1-b775b124b61&title=&width=807)<br />这个版本是有 web 管理界面的。<br />点击 run：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1694533654556-db29d9d0-1546-482f-80f6-b3c7dadd8918.png#averageHue=%2325323d&clientId=u7e184db5-dfa1-4&from=paste&height=474&id=u76a7c3b0&originHeight=1396&originWidth=1046&originalType=binary&ratio=2&rotation=0&showTitle=false&size=93776&status=done&style=none&taskId=u4beaa8bb-ccda-44d2-a7d9-8c4f068d170&title=&width=355)<br />run 运行后，可以通过浏览器访问 http://localhost:15672 来管理消息队列，这就是它的 web 管理界面：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717333986050-d6f6e1a1-18e8-411a-bd2c-8b0f9ad77716.png#averageHue=%23f3efec&clientId=u4ad325dc-05ac-4&from=paste&height=302&id=ucffdc79a&originHeight=484&originWidth=964&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=26008&status=done&style=none&taskId=u3c4a1474-2203-4079-b5fb-6754582f306&title=&width=602.4999910220505)<br />账号密码全输入 guest ，进入管理页面：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1694533818872-729e0c9e-b862-41b9-b977-1592cf4a0973.png#averageHue=%23efeeed&clientId=u7e184db5-dfa1-4&from=paste&height=378&id=u7018426b&originHeight=756&originWidth=1180&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75094&status=done&style=none&taskId=u393862cd-da27-4a71-b0f0-8a1619ec39c&title=&width=590)<br />可以看到 connection、channel、exchange、queue 的分别的管理页面。

## Node.js 实现 RabbitMQ
### 环境准备
首先，创建一个新的项目目录，并初始化 Node.js 项目：
```bash
mkdir rabbitmq-test
cd rabbitmq-test
npm init -y
```
### 安装依赖
安装 amqplib 包：
```bash
npm install amqplib
```
### 配置项目
由于我们将使用 ES module 语法和顶层 await，您需要在 package.json 中添加以下配置：
```json
"type": "module"
```

### 生产者设置
创建 src/producer.js 文件，并编写以下代码：
```javascript
// 引入 amqplib 库，用于操作 AMQP 协议（高级消息队列协议）
import * as amqp from 'amqplib';

// 连接到本地的 RabbitMQ 服务，端口默认为 5672
const connect = await amqp.connect('amqp://localhost:5672');
// 创建一个通道，大部分的 API 操作都在通道中进行
const channel = await connect.createChannel();

// 声明一个队列，如果队列不存在则创建，名为 'test1'
await channel.assertQueue('test1');
// 向名为 'test1' 的队列发送消息，消息内容为 'hello yun'
await channel.sendToQueue('test1', Buffer.from('hello yun'));

// 控制台打印消息，表示消息已被发送
console.log('消息已发送');
```
运行生产者脚本：
```bash
node ./src/producer.js
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717334103566-2503dab9-77a5-4665-a2f5-d3fe066a37fa.png#averageHue=%23363534&clientId=u4ad325dc-05ac-4&from=paste&height=42&id=u16d617e7&originHeight=68&originWidth=1006&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=14456&status=done&style=none&taskId=u429d639f-fe87-4c3f-99dc-75b208bff51&title=&width=628.749990630895)

### 消费者设置
创建 src/consumer.js 文件，并编写以下代码：
```javascript
import * as amqp from 'amqplib';

// 连接到本地 RabbitMQ 服务器，端口为 5672
const connect = await amqp.connect('amqp://localhost:5672');
// 在连接上创建一个通道
const channel = await connect.createChannel();

// 确保 'test1' 队列存在，如果不存在则创建
const { queue } = await channel.assertQueue('test1');
// 消费 'test1' 队列中的消息
channel.consume(
	queue, // 指定要消费的队列名
	msg => {
		// 当收到消息时，执行的回调函数
		console.log('收到消息：', msg.content.toString());
	},
	{ noAck: true } // 消费配置选项，noAck 为 true 表示不需要发送确认
);
```
运行消费者脚本：
```bash
node ./src/consumer.js
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717334494508-4e66ba1f-54af-4be9-b06b-9169c672bb2f.png#averageHue=%23353534&clientId=u4ad325dc-05ac-4&from=paste&height=47&id=u168a4217&originHeight=76&originWidth=1012&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=15805&status=done&style=none&taskId=ub4576a97-8554-40ee-bf1e-b63ab9803d5&title=&width=632.4999905750157)

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717338882098-e1af8693-5315-4ec4-a344-4390f099a281.png#averageHue=%23f1f1f1&clientId=uc975f8d6-8cf7-4&from=paste&height=574&id=u057cad2f&originHeight=918&originWidth=2064&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=153233&status=done&style=none&taskId=u05460e3b-d706-4d96-817d-0ba0247527d&title=&width=1289.9999807775023)

### 控制消息并发
#### 生产者并发控制
修改 src/producer.js，以每 0.5 秒发送一条消息：
```javascript
import * as amqp from 'amqplib';

// 连接到 RabbitMQ 服务器
const connect = await amqp.connect('amqp://localhost:5672');

// 创建一个通道
const channel = await connect.createChannel();

// 声明一个名为 'test2' 的队列，并设置其持久化
await channel.assertQueue('test2', { durable: true });

let i = 1;

// 每隔 500 毫秒发送一条消息到 'test2' 队列
setInterval(async () => {
	const msg = 'hello' + i; // 构建消息内容
	console.log('发送消息：', msg); // 打印发送的消息
	await channel.sendToQueue('test2', Buffer.from(msg)); // 发送消息到队列
	i++; // 递增消息计数器
}, 500);
```

#### 消费者并发控制
修改 src/consumer.js，设置 prefetch 为 3，并每秒确认一次消息：
```javascript
import * as amqp from 'amqplib';

async function startConsumer() {
	try {
		const connect = await amqp.connect('amqp://localhost:5672');
		// 创建一个通道，用于消息的发送和接收
		const channel = await connect.createChannel();

		// 声明（如果不存在则创建）一个名为 'test2' 的队列，并获取队列的信息
		const { queue } = await channel.assertQueue('test2');

		// 设置该通道一次只接收并处理 3 条消息
		channel.prefetch(3);

		// 用于存储当前接收到但还未处理的任务
		const currentTask = [];
		// 监听名为 'test2' 的队列，接收到消息后执行回调函数
		channel.consume(
			queue,
			msg => {
				// 将接收到的消息添加到 currentTask 数组中
				currentTask.push(msg);
				// 控制台打印接收到的消息内容
				console.log('收到消息：', msg.content.toString());
			},
			// 设置不自动确认消息，需要手动调用 ack 方法确认
			{ noAck: false }
		);

		// 每隔 1000 毫秒（1 秒）检查 currentTask 数组，如果有任务则从数组中取出并确认消息
		setInterval(() => {
			if (currentTask.length > 0) {
				const curMsg = currentTask.shift(); // 使用 shift 方法从数组头部取出消息
				if (curMsg) {
					// 手动确认消息，告诉 RabbitMQ 该消息已被正确处理
					channel.ack(curMsg);
				}
			}
		}, 1000);
	} catch (error) {
		console.error('Error in consumer:', error);
	}
}

// 启动消费者
startConsumer();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717335901592-d7af0349-1716-4292-8a62-fa25275fdca5.png#averageHue=%232a2a29&clientId=u4ad325dc-05ac-4&from=paste&height=307&id=uae4b916d&originHeight=492&originWidth=2332&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=126275&status=done&style=none&taskId=u657e9f45-57b2-49c0-b68b-1df12272eab&title=&width=1457.4999782815578)

## RabbitMQ 架构图解
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1694563820432-380ba235-ff9c-48ff-873d-83b7e3144277.png#averageHue=%23f7be17&clientId=ufc04976e-72b1-4&from=paste&height=394&id=QwKLx&originHeight=1034&originWidth=2068&originalType=binary&ratio=2&rotation=0&showTitle=false&size=495234&status=done&style=none&taskId=u39e8b567-0bd8-493e-9326-56049f32ce6&title=&width=788.9931640625)

1. Producer 和 Consumer：分别代表消息的生产者和消费者。
2. Connection 和 Channel：Connection 是连接，但并不是每次使用 RabbitMQ 都创建一个单独的 Connection。相反，我们在一个 Connection 中创建多个 Channel，每个 Channel 负责自己的任务。
3. Queue：消息存取的地方。
4. Broker：整个接收和转发消息的服务。
5. Exchange：用于将消息路由到不同的队列中。

## Exchange 类型
Exchange 主要有四种类型：

- direct：将消息路由到指定的队列。
- topic：支持模糊匹配，根据模式将消息路由到相应的队列。
- fanout：将消息广播到所有绑定的队列中。
- headers：根据消息的 headers 属性进行路由。

## 使用 direct 类型的 Exchange
### 生产者端
src/direct.js
```javascript
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');

// 创建一个通道
const channel = await connect.createChannel();

// 声明一个名为 'direct-test-exchange' 的直连交换机
await channel.assertExchange('direct-test-exchange', 'direct');

// 发送消息 'hello1' 到交换机 'direct-test-exchange'，路由键为 'test1'
channel.publish('direct-test-exchange', 'test1', Buffer.from('hello1'));

// 发送消息 'hello2' 到交换机 'direct-test-exchange'，路由键为 'test2'
channel.publish('direct-test-exchange', 'test2', Buffer.from('hello2'));

// 发送消息 'hello3' 到交换机 'direct-test-exchange'，路由键为 'test3'
channel.publish('direct-test-exchange', 'test3', Buffer.from('hello3'));
```
在这里，我们创建了一个 direct 类型的 Exchange，然后发布三条消息，指定不同的 routing key。

### 消费者端
```javascript
// src/direct-consumer1.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');

// 创建一个通道
const channel = await connect.createChannel();

// 声明一个名为 'queue1' 的队列，如果该队列不存在则会被创建
const { queue } = await channel.assertQueue('queue1');

// 将队列绑定到名为 'direct-test-exchange' 的交换机，并指定路由键为 'test1'
await channel.bindQueue(queue, 'direct-test-exchange', 'test1');

// 消费队列中的消息，并在收到消息时打印消息内容
channel.consume(
	queue,
	msg => {
		console.log(msg.content.toString()); // 打印消息内容
	},
	{ noAck: true } // 设置为自动确认消息
);
```
```javascript
// src/direct-consumer2.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');
const channel = await connect.createChannel();

const { queue } = await channel.assertQueue('queue2');
await channel.bindQueue(queue, 'direct-test-exchange', 'test2');

channel.consume(
	queue,
	msg => {
		console.log(msg.content.toString());
	},
	{ noAck: true }
);
```
两个消费者分别监听不同的队列，并绑定到相应的 routing key。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717336906123-ae64d69b-ad9b-42c1-9547-27bee07331d3.png#averageHue=%232a2929&clientId=uc975f8d6-8cf7-4&from=paste&height=107&id=u712702ec&originHeight=172&originWidth=2592&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=22942&status=done&style=none&taskId=u06e7d104-da47-450c-86e4-680d506857a&title=&width=1619.9999758601193)<br />在管理页面上也可以看到这个交换机的信息：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717339145611-c8f3928d-137f-4c22-9c67-914d63d98868.png#averageHue=%23eaeaea&clientId=uc975f8d6-8cf7-4&from=paste&height=282&id=uf1b6feb6&originHeight=526&originWidth=1588&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=80773&status=done&style=none&taskId=uccb36521-7a09-457d-b049-23fd1f1b8ff&title=&width=850.5)<br />包括 exchange 下的两个 queue 以及各自的 routing key：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717339162603-2ddad057-fa68-4c3d-9037-a67ab5b841cc.png#averageHue=%23f1f1f1&clientId=uc975f8d6-8cf7-4&from=paste&height=372&id=u342d6e43&originHeight=596&originWidth=832&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=38652&status=done&style=none&taskId=u65d3c0c3-5400-492a-862f-e56c4ec21e4&title=&width=519.9999922513963)<br />这里还能发送消息：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717339245428-7d25db72-7c26-4643-b0c9-6a6a58d10f08.png#averageHue=%23f8f8f8&clientId=u89770ab5-a75d-4&from=paste&height=462&id=ubaa544a6&originHeight=1072&originWidth=1650&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=64758&status=done&style=none&taskId=uac0c12d1-85b0-49fc-89d1-e3c124ac4aa&title=&width=711.25)

## 使用 topic 类型的 Exchange
### 生产者端
```javascript
// src/topic.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');
const channel = await connect.createChannel();

await channel.assertExchange('direct-test-exchange2', 'topic');

channel.publish('direct-test-exchange2', 'test1.111', Buffer.from('hello1'));
channel.publish('direct-test-exchange2', 'test1.222', Buffer.from('hello2'));
channel.publish('direct-test-exchange2', 'test2.1111', Buffer.from('hello3'));
```

### 消费者端
```javascript
// src/topic-consumer1.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');
const channel = await connect.createChannel();

await channel.assertExchange('direct-test-exchange2', 'topic');

const { queue } = await channel.assertQueue('queue1');

await channel.bindQueue(queue, 'direct-test-exchange2', 'test1.*');

channel.consume(
	queue,
	msg => {
		console.log(msg.content.toString());
	},
	{ noAck: true }
);
```
```javascript
// src/topic-consumer2.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');
const channel = await connect.createChannel();

await channel.assertExchange('direct-test-exchange2', 'topic');

const { queue } = await channel.assertQueue('queue2');
await channel.bindQueue(queue, 'direct-test-exchange2', 'test2.*');

channel.consume(
	queue,
	msg => {
		console.log(msg.content.toString());
	},
	{ noAck: true }
);
```
两个消费者监听不同的模糊匹配模式的 routing key。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717338303978-0f5824a9-a27f-4e71-8415-4a7693df5d78.png#averageHue=%232b2b2a&clientId=uc975f8d6-8cf7-4&from=paste&height=91&id=u35d24d19&originHeight=146&originWidth=2590&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=25448&status=done&style=none&taskId=ub071bc92-b76b-4588-a95e-1f035a4aab3&title=&width=1618.7499758787458)


## 使用 fanout 类型的 Exchange
### 生产者端
```typescript
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');

const channel = await connect.createChannel();

// 声明一个名为 'direct-test-exchange3' 的交换机，类型为 'fanout'
// 'fanout' 类型的交换机会将消息广播给所有绑定到该交换机的队列
await channel.assertExchange('direct-test-exchange3', 'fanout');

// 向交换机 'direct-test-exchange3' 发布消息 'hello1'
// 因为是 'fanout' 类型的交换机，不需要指定 routingKey，routingKey 为空字符串
channel.publish('direct-test-exchange3', '', Buffer.from('hello1'));

// 向交换机 'direct-test-exchange3' 发布消息 'hello2'
channel.publish('direct-test-exchange3', '', Buffer.from('hello2'));

// 向交换机 'direct-test-exchange3' 发布消息 'hello3'
channel.publish('direct-test-exchange3', '', Buffer.from('hello3'));
```

### 消费者端
```typescript
// src/fanout-consumer1.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');
const channel = await connect.createChannel();

await channel.assertExchange('direct-test-exchange3', 'fanout');

const { queue } = await channel.assertQueue('queue1');
await channel.bindQueue(queue, 'direct-test-exchange3');

channel.consume(
	queue,
	msg => {
		console.log(msg.content.toString());
	},
	{ noAck: true }
);
```
```typescript
// src/fanout-consumer2.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');
const channel = await connect.createChannel();

await channel.assertExchange('direct-test-exchange3', 'fanout');

const { queue } = await channel.assertQueue('queue2');
await channel.bindQueue(queue, 'direct-test-exchange3');

channel.consume(
	queue,
	msg => {
		console.log(msg.content.toString());
	},
	{ noAck: true }
);
```
两个消费者监听同一个 fanout 类型的 Exchange，都会接收到消息。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717338504099-a96256ce-44ab-4530-8822-76172198061f.png#averageHue=%23292929&clientId=uc975f8d6-8cf7-4&from=paste&height=125&id=u7d85bef1&originHeight=200&originWidth=2578&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=27628&status=done&style=none&taskId=u0bbc9c3c-ad89-4a69-b5c2-3da2d80480d&title=&width=1611.2499759905045)

## 使用 headers 类型的 Exchange
### 生产者端
```javascript
// src/headers.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');
const channel = await connect.createChannel();

await channel.assertExchange('direct-test-exchange4', 'headers');

channel.publish('direct-test-exchange4', '', Buffer.from('hello1'), {
	headers: {
		name: 'yun', // 设置消息头部属性 name 为 'yun'
	},
});
channel.publish('direct-test-exchange4', '', Buffer.from('hello2'), {
	headers: {
		name: 'yun', // 设置消息头部属性 name 为 'yun'
	},
});
channel.publish('direct-test-exchange4', '', Buffer.from('hello3'), {
	headers: {
		name: 'mu', // 设置消息头部属性 name 为 'mu'
	},
});
```

### 消费者端
```javascript
// src/headers-consumer1.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');
const channel = await connect.createChannel();

await channel.assertExchange('direct-test-exchange4', 'headers');

const { queue } = await channel.assertQueue('queue1');

await channel.bindQueue(queue, 'direct-test-exchange4', '', { name: 'yun' });

channel.consume(
	queue,
	msg => {
		console.log(msg.content.toString());
	},
	{ noAck: true }
);
```
```javascript
// src/headers-consumer2.js
import * as amqp from 'amqplib';

const connect = await amqp.connect('amqp://localhost:5672');
const channel = await connect.createChannel();

await channel.assertExchange('direct-test-exchange4', 'headers');

const { queue } = await channel.assertQueue('queue2');

await channel.bindQueue(queue, 'direct-test-exchange4', '', { name: 'mu' });

channel.consume(
	queue,
	msg => {
		console.log(msg.content.toString());
	},
	{ noAck: true }
);
```
两个消费者分别根据消息头的属性接收不同的消息。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717338735548-1cb7c436-0efa-49e7-b7fc-9e74f57461bb.png#averageHue=%232a2a29&clientId=uc975f8d6-8cf7-4&from=paste&height=114&id=u93b10fc8&originHeight=182&originWidth=2598&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=25498&status=done&style=none&taskId=uaa8e8a6c-97d3-4294-87dd-a97f7691bfb&title=&width=1623.74997580424)

### 总结
RabbitMQ 通过以下几种方式解决了常见的问题：

1. 流量削峰：可以将大量流量放入消息队列中，然后慢慢处理，避免系统崩溃。
2. 应用解耦：应用程序之间不直接依赖，即使某个应用程序挂掉，也可以在恢复后继续从消息队列中消费消息，不会影响到其他应用。
