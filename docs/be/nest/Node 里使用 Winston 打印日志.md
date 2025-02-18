为什么使用 winston：

1. **多种日志级别**：支持 npm 风格的日志级别，如 error、warn、info、verbose、debug 和 silly，
2. **自定义日志格式**：可自定义日志消息的格式，包括添加时间戳、设置日志格式（如 JSON、纯文本）、位置等。
3. **多种存储选项**：多种存储日志的方式，包括控制台、文件、数据库等。
4. **日志轮转**：可以按照文件大小或时间自动创建新的日志文件。
5. **查询日志：**提供了查询和筛选日志的 api
6. **性能和社区：**为异步日志记录设计，可以减少对应用性能的影响。同时也是 Node 最流行的日志框架，[npm 官网](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwinston)上可以看到每周千万级的下载量

## 基本使用
创建项目：
```bash
mkdir winston-test
cd winston-test
npm init -y
```
安装 winston：
```bash
npm install winston
```
创建 logger.js：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707833130862-a491b905-237f-4359-957e-5fd7d8b9a319.png#averageHue=%232e2d2c&clientId=u08bd5abf-fd9c-4&from=paste&height=485&id=u87a11096&originHeight=970&originWidth=1414&originalType=binary&ratio=2&rotation=0&showTitle=false&size=157761&status=done&style=none&taskId=ua9aabf92-f357-4243-88f9-3bdccb80039&title=&width=707)<br />创建 index.js 引入 logger：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707833212794-d538177d-e1b6-4aeb-9724-a187279cb408.png#averageHue=%23312f2c&clientId=u08bd5abf-fd9c-4&from=paste&height=148&id=ud500a970&originHeight=296&originWidth=864&originalType=binary&ratio=2&rotation=0&showTitle=false&size=54528&status=done&style=none&taskId=u098f0083-934a-44b8-9680-3bb886fa06d&title=&width=432)<br />用 node 跑一下：
```bash
node index.js
```
控制台和文件都有日志了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707833284072-8a1e106c-331a-4957-8539-3f3571557188.png#averageHue=%23444444&clientId=u08bd5abf-fd9c-4&from=paste&height=60&id=u39663b02&originHeight=120&originWidth=748&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22459&status=done&style=none&taskId=u040417d6-9f41-48c1-8080-26e421d5eb5&title=&width=374)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707833304407-2b225558-d72a-4b13-b077-831315b6f88a.png#averageHue=%232c2c2c&clientId=u08bd5abf-fd9c-4&from=paste&height=97&id=u05b7130d&originHeight=194&originWidth=1064&originalType=binary&ratio=2&rotation=0&showTitle=false&size=42581&status=done&style=none&taskId=uf115c0ba-92de-4852-85fb-31fe24e110e&title=&width=532)<br />继续使用 node index.js 跑一遍：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707833357465-e5201bc3-8fe2-49e4-9ac4-9a5f1de06989.png#averageHue=%232b2b2b&clientId=u08bd5abf-fd9c-4&from=paste&height=180&id=u08c3658d&originHeight=360&originWidth=1082&originalType=binary&ratio=2&rotation=0&showTitle=false&size=78566&status=done&style=none&taskId=ubc6204e5-e4fe-43a2-8915-cb889f23609&title=&width=541)<br />日志继续追加在后面。<br />如果内容过多，winston 能自动分割文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707833491265-1eaa83ba-d1b5-4fd7-b140-41e9ce4695ac.png#averageHue=%232e2d2c&clientId=u08bd5abf-fd9c-4&from=paste&height=182&id=u1c1bc8ec&originHeight=364&originWidth=1556&originalType=binary&ratio=2&rotation=0&showTitle=false&size=68101&status=done&style=none&taskId=uec96bfeb-c661-4ed3-aaee-40d297fca7a&title=&width=778)<br />我们指定 1024 字节，也就是超过 1kb 自动分割文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707833548348-49655122-eb37-40b1-a05b-28c5b1807317.png#averageHue=%233d3e42&clientId=u08bd5abf-fd9c-4&from=paste&height=43&id=uf2bed20f&originHeight=86&originWidth=280&originalType=binary&ratio=2&rotation=0&showTitle=false&size=8163&status=done&style=none&taskId=u99d05b71-b7a6-49f5-9612-2d821b14afa&title=&width=140)


## Transport
如果我们想按照日期分割文件，这时候就需要换 Transport，在 [winston 文档](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwinstonjs%2Fwinston%2Fblob%2FHEAD%2Fdocs%2Ftransports.md%23winston-core)里可以看到内置 Transport：

1. **Console（控制台）传输：** 将日志输出到控制台，方便开发人员在开发和调试过程中查看日志信息。
2. **File（文件）传输：** 将日志写入文件，适用于长期存储和后续分析。
3. **HTTP 传输：** 将日志通过 HTTP 请求发送到指定的远程服务器，方便集中管理和监控。
4. **Database（数据库）传输：** 将日志信息存储到数据库中，便于后续查询和分析。

社区还有很多的 Transport，比如 **winston-mongodb**、**winston-redis**，就是把日志写入 mongodb 或 reids。

### winston-daily-rotate-file
**winston-daily-rotate-file**，这个就可以根据日期、小时或文件大小来轮转日志文件：<br />安装：
```bash
npm install winston-daily-rotate-file
```
改下代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707837550165-a3579c80-6a9c-4583-87d8-1a6685739ad5.png#averageHue=%232f2d2c&clientId=u08bd5abf-fd9c-4&from=paste&height=826&id=ud55b3774&originHeight=1652&originWidth=1722&originalType=binary&ratio=2&rotation=0&showTitle=false&size=311697&status=done&style=none&taskId=u3605c373-913b-41a1-a234-9845eb220dd&title=&width=861)<br />node 运行文件后：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707881994643-40cc8a9d-f628-48c9-88a7-6b3c7fe4ac0c.png#averageHue=%232c404e&clientId=u752237e1-6df9-4&from=paste&height=65&id=ud19f74eb&originHeight=130&originWidth=888&originalType=binary&ratio=2&rotation=0&showTitle=false&size=24767&status=done&style=none&taskId=u829299fe-aeff-405c-a719-85ed316fd68&title=&width=444)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707882013334-f7c3af2a-7df6-4cd8-a31e-1d7cce334b83.png#averageHue=%232c2c2c&clientId=u752237e1-6df9-4&from=paste&height=99&id=ud3e9947f&originHeight=198&originWidth=1750&originalType=binary&ratio=2&rotation=0&showTitle=false&size=71072&status=done&style=none&taskId=u1925025c-9f53-4c7c-9501-57131924e86&title=&width=875)<br />多运行几次：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707882038629-cadb9ab2-6875-482a-9cd7-a560d151333a.png#averageHue=%233f4143&clientId=u752237e1-6df9-4&from=paste&height=89&id=uf978dfaf&originHeight=178&originWidth=864&originalType=binary&ratio=2&rotation=0&showTitle=false&size=32337&status=done&style=none&taskId=u6db32b56-8583-4e7a-97cb-1d5ca77e882&title=&width=432)<br />因为设置 `zippedArchive: true`，轮转时，超出大小限制的旧文件会压缩，并且生成了 log.1 的新文件。<br />这里的轮转是基于日期模式的，`datePattern: 'YYYY-MM-DD'` 这一配置意味着每天都会创建一个新的日志文件。 <br />Winston 创建新一天文件的时候，前一天文件也会被压缩。

我们注意到上面会额外生成个 `.audit.json` 结尾的文件，这是个审计文件，包含关于日志文件轮转的元数据，比如：

- 文件名
- 轮转时间戳
- 文件的大小
- 删除的文件（如果启用了最大文件数限制）

### winston-log-server
再来试试 http 的 transport：
```bash
nest new winston-test-server -p npm
```
AppController 添加一个路由：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707838790002-04368fb1-ee32-49cb-97dd-65d04168ba9e.png#averageHue=%23312f2d&clientId=uaa7f0cd5-e56c-4&from=paste&height=108&id=u34b8ea0a&originHeight=216&originWidth=430&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22994&status=done&style=none&taskId=u53b05c0a-ca0b-41c3-bfec-a440b09bb1b&title=&width=215)<br />跑起来：
```bash
npm run start:dev
```
改下 logger.js：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707838958175-afe36a8f-a29d-41ec-afc0-9fc1abeaece0.png#averageHue=%23322f2c&clientId=uaa7f0cd5-e56c-4&from=paste&height=261&id=u46ba963b&originHeight=522&originWidth=744&originalType=binary&ratio=2&rotation=0&showTitle=false&size=60577&status=done&style=none&taskId=u39d612c6-645b-4fbe-a59e-d96c1e39410&title=&width=372)<br />使用 http 的 transport 往  localhost:3000/log 传输日志。<br />跑一下：
```bash
node ./index.js
```
nest 收到了传过来的日志：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707839038785-44ee0c8a-aa96-4bda-9482-73649b8ee650.png#averageHue=%23303030&clientId=uaa7f0cd5-e56c-4&from=paste&height=214&id=u00cf978a&originHeight=428&originWidth=488&originalType=binary&ratio=2&rotation=0&showTitle=false&size=39718&status=done&style=none&taskId=ucdb9cab2-5d41-4f58-b9e9-c6c87632af9&title=&width=244)<br />这些 transport 可以用 clear、 add、remove 方法来动态增删：
```javascript
import winston from 'winston'

const console = new winston.transports.Console()
const file = new winston.transports.File({ filename: 'log.log' })

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.simple(),
})

logger.clear()
logger.add(console)
logger.remove(console)
logger.add(file)
```
最后就只有一个 file 的 transport。

## 日志级别
winston 有 6 种级别的日志，从 0（最高优先级）到 6（最低优先级）：

1. **error** (0): 错误日志，记录系统无法运行的情况。
2. **warn** (1): 警告信息，记录不正常但不影响系统运行的情况。
3. **info** (2): 重要的运行信息，通常用于生产环境。
4. **http** (3): HTTP 请求日志，记录 HTTP 请求数据。
5. **verbose** (4): 详细信息，比 info 级别更详细的日志。
6. **debug** (5): 调试信息，通常用于开发环境。
7. **silly** (6): 最低级别，记录非常详细的调试信息或开发时的临时日志。

如果设置了日志级别，那么优先级高于等于该级别的日志信息会记录下来。<br />例如，如果设置了日志级别为 warn，那么 error 和 warn 级别的日志会记录，而 info、http、verbose、debug 和 silly 级别的则不会。

## format 格式
日志可以通过 format 指定格式：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707839233637-71055880-ae5a-4a84-a7b4-74ef87a4fe5c.png#averageHue=%232f2e2d&clientId=uaa7f0cd5-e56c-4&from=paste&height=221&id=u957d146f&originHeight=572&originWidth=958&originalType=binary&ratio=2&rotation=0&showTitle=false&size=79179&status=done&style=none&taskId=u087a1632-5b0f-40f3-9703-d52882b18cd&title=&width=370)<br />Winston 提供了多种内置的日志格式化选项：

- simple() - 输出简单的、未格式化的日志消息。
- json() - 将日志消息输出为 JSON 格式。
- colorize() - 在日志消息中添加颜色，通常用于在控制台中区分不同级别的日志。
- label() - 添加一个标签，通常用于指示日志消息来源的模块或组件。
- timestamp() - 为每条日志消息添加时间戳。
- printf() - 使用自定义模板来格式化日志消息。
- combine() - 组合多个格式化函数。

可以组合这些格式化函数来创建复杂的日志格式。<br />例如，可能想要一个带时间戳和颜色编码以及标签的简单格式，你可以这样做：
```javascript
const winston = require('winston');

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.label({ label: '标签更好查找日志哦' }),
		winston.format.colorize(),
		winston.format.timestamp(),
		winston.format.simple()
	),
	transports: [new winston.transports.Console()],
})

logger.info('云云云')
logger.error('牧牧牧')
logger.debug(666)
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1700402541450-5e2fb6fa-ec31-4f76-9385-5521cf8b2061.png#averageHue=%23dedede&clientId=u74cb49ed-0c99-4&from=paste&height=58&id=xBnVc&originHeight=116&originWidth=1166&originalType=binary&ratio=2&rotation=0&showTitle=false&size=49790&status=done&style=none&taskId=u8c5c6c99-8d00-49f3-a68e-1a974c584c8&title=&width=583)


## 多 logger 实例
有的日志只想 console，而有的日志希望写入文件。<br />我们可以创建多个 logger 实例，每个 logger 实例有不同的 format、transport、level 等配置：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707840793416-a2b90184-ec83-4960-a0f7-9407b6bdf1f8.png#averageHue=%232d2c2b&clientId=uaa7f0cd5-e56c-4&from=paste&height=500&id=u6fbc67eb&originHeight=1448&originWidth=1894&originalType=binary&ratio=2&rotation=0&showTitle=false&size=259437&status=done&style=none&taskId=uc8bd106c-02c0-4589-9809-e421233473b&title=&width=654)<br />我们就成功创建了 2 个 logger 实例，其中一个只写入 console，另一个只写入 file。<br />运行下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707840875675-f1ba006b-cfcd-41dc-9d1a-0d348fef3de8.png#averageHue=%233e3d3d&clientId=uaa7f0cd5-e56c-4&from=paste&height=41&id=ufec2688a&originHeight=82&originWidth=748&originalType=binary&ratio=2&rotation=0&showTitle=false&size=16550&status=done&style=none&taskId=uc84a1480-507d-4aee-8580-37a61bf84d7&title=&width=374)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707840887094-037be998-bb86-4dde-bf07-ff07138b53ff.png#averageHue=%232c2c2c&clientId=uaa7f0cd5-e56c-4&from=paste&height=65&id=ub156070a&originHeight=138&originWidth=1750&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48461&status=done&style=none&taskId=u10a514f9-0d7c-494d-9d4c-98c47118f3b&title=&width=828)

## 捕获错误日志
Winston 处理未捕获的错误：
```javascript
const winston = require('winston');

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.simple(),
	transports: [new winston.transports.Console()],
	// 所有未捕获的异常都将被记录到 'error.log' 文件中
	exceptionHandlers: [
		new winston.transports.File({
			filename: 'error.log',
		}),
	],
	// 所有未处理的 Promise 拒绝都将被记录到 'rejections.log' 文件中
	rejectionHandlers: [
		new winston.transports.File({
			filename: 'rejections.log',
		}),
	],
	// 默认值是 true，表示在记录未捕获的异常后退出进程
  exitOnError: true
})
```
可以代码中 `throw new Error('This is an uncaught exception');` 自行测试下。

