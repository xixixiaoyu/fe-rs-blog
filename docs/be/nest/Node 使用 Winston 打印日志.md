# 在 Node.js 中如何优雅地打印日志：深入了解 Winston

在 Node.js 中，很多初学者可能会直接使用 `console.log` 来打印日志。虽然这在开发阶段是个简单有效的方式，但在生产环境中，`console.log` 并不是一个理想的日志解决方案。为什么呢？因为服务端的日志不仅仅是为了调试，它还需要长期保存、分析、过滤，甚至在出现问题时帮助我们快速定位问题。

## 为什么不能只用 `console.log`？

`console.log` 的输出只是简单地打印在控制台上，无法满足以下需求：

1. **日志持久化**：服务端的日志需要保存到文件或数据库中，以便后续分析和排查问题。
2. **日志分级**：不同类型的日志（如错误日志、调试日志、普通信息日志）需要分级别记录，方便过滤和查看。
3. **时间戳和上下文信息**：日志需要包含时间戳、代码位置等信息，帮助我们更快地定位问题。
4. **日志文件管理**：日志文件可能会变得非常大，需要自动分割或按日期存储。

这些功能是 `console.log` 无法提供的，因此我们需要一个更强大的日志框架。这里我们推荐使用 **Winston**，这是 Node.js 中最流行的日志框架之一。

## Winston 的强大功能

Winston 是一个功能强大的日志库，支持多种日志传输方式（transports），可以将日志输出到控制台、文件、HTTP 服务，甚至数据库中。它还支持日志分级、格式化、文件分割等功能。

### 1. 快速上手 Winston

首先，我们创建一个简单的项目并安装 Winston：

```bash
mkdir winston-test
cd winston-test
npm init -y
npm install --save winston
```

接着，我们在 `index.js` 中编写以下代码：

```javascript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ dirname: 'log', filename: 'test.log' }),
  ],
})

logger.info('这是一个普通日志')
logger.error('这是一个错误日志')
logger.debug('这是一个调试日志')
```

在这段代码中，我们创建了一个 `logger` 实例，并指定了日志的级别、格式和传输方式。我们使用了两种传输方式：控制台输出和文件输出。

### 2. 日志文件自动分割

如果所有日志都写在一个文件里，随着时间推移，文件会变得非常大。Winston 提供了按文件大小自动分割日志的功能。我们可以通过设置 `maxsize` 来实现：

```javascript
new winston.transports.File({
  dirname: 'log',
  filename: 'test.log',
  maxsize: 1024, // 1KB
})
```

这样，当日志文件达到 1KB 时，Winston 会自动创建一个新的日志文件。

### 3. 按日期分割日志

除了按大小分割日志，很多时候我们希望日志文件按日期分割，比如每天生成一个新的日志文件。Winston 支持通过社区插件 `winston-daily-rotate-file` 来实现这一功能：

```bash
npm install --save winston-daily-rotate-file
```

然后我们可以这样使用：

```javascript
import winston from 'winston'
import 'winston-daily-rotate-file'

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      dirname: 'log2',
      filename: 'test-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '1k',
    }),
  ],
})
```

这样，日志文件会按日期自动分割，文件名中会包含日期信息。

### 4. 通过 HTTP 传输日志

有时候我们希望将日志发送到远程服务进行集中管理。Winston 支持通过 HTTP 传输日志。我们可以创建一个简单的 HTTP 服务来接收日志：

```bash
nest new winston-log-server
```

在服务中添加一个路由来接收日志：

```javascript
@Post('log')
log(@Body() body) {
    console.log(body);
}
```

然后在 `index.js` 中配置 HTTP 传输：

```javascript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.Http({
      host: 'localhost',
      port: '3000',
      path: '/log',
    }),
  ],
})
```

这样，日志会通过 HTTP 发送到远程服务。

### 5. 动态添加和移除传输方式

Winston 允许我们动态添加或移除传输方式。比如我们可以先清空所有传输方式，然后根据需要动态添加：

```javascript
import winston from 'winston'

const consoleTransport = new winston.transports.Console()
const fileTransport = new winston.transports.File({ filename: 'test.log' })

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
})

logger.clear()
logger.add(consoleTransport)
logger.remove(consoleTransport)
logger.add(fileTransport)

logger.info('这是一个动态添加的日志')
```

### 6. 日志格式化

Winston 提供了多种日志格式化方式，比如 `json`、`simple`、`prettyPrint` 等。我们可以通过 `format` 来指定日志的格式：

```javascript
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: 'test.log' })],
})
```

这样，日志会以 JSON 格式输出，并带有时间戳。

### 7. 多个 Logger 实例

在一些复杂的项目中，我们可能需要不同的日志配置，比如某些日志只输出到控制台，某些日志只写入文件。我们可以通过创建多个 `logger` 实例来实现：

```javascript
import winston from 'winston'

winston.loggers.add('consoleLogger', {
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
})

winston.loggers.add('fileLogger', {
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: 'test.log' })],
})

const consoleLogger = winston.loggers.get('consoleLogger')
const fileLogger = winston.loggers.get('fileLogger')

consoleLogger.info('这是控制台日志')
fileLogger.info('这是文件日志')
```

### 8. 处理未捕获的异常

Winston 还可以帮助我们处理未捕获的异常和 Promise 拒绝：

```javascript
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'exceptions.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'rejections.log' })],
})
```

这样，未捕获的异常和 Promise 拒绝都会被记录到指定的日志文件中。

## 总结

相比于简单的 `console.log`，Winston 提供了更强大的日志管理功能。它支持多种日志传输方式、日志分级、格式化、文件分割等功能，能够满足生产环境中复杂的日志需求。通过 Winston，我们可以轻松地将日志输出到控制台、文件、远程服务，甚至数据库中，并且可以根据不同的需求创建多个 `logger` 实例。

总之，Winston 是 Node.js 中不可或缺的日志工具，它让日志管理变得更加灵活和高效。
