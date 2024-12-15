# 在 Nest 中集成 Winston：打造强大日志系统

在现代应用开发中，日志系统是不可或缺的一部分。它不仅能帮助我们追踪应用的运行状态，还能在出现问题时提供宝贵的调试信息。Nest.js 作为一个强大的 Node.js 框架，提供了灵活的日志系统，而 Winston 则是一个功能强大的日志库，支持多种日志格式和输出方式。那么，如何在 Nest 中集成 Winston 呢？本文将带你一步步实现这一目标。

## 创建 Nest 项目

首先，我们需要创建一个新的 Nest 项目：

```bash
nest new nest-winston-test
```

接下来，我们将在这个项目中集成 Winston。

## 自定义 Logger

Nest.js 默认提供了一个简单的日志系统，但我们可以通过实现 `LoggerService` 接口来自定义日志逻辑。首先，在 `src` 目录下创建一个 `MyLogger.ts` 文件：

```typescript
import { LoggerService } from '@nestjs/common'

export class MyLogger implements LoggerService {
  log(message: string, context: string) {
    console.log(`---log---[${context}]---`, message)
  }

  error(message: string, context: string) {
    console.log(`---error---[${context}]---`, message)
  }

  warn(message: string, context: string) {
    console.log(`---warn---[${context}]---`, message)
  }
}
```

在 `main.ts` 中引入并使用这个自定义的 Logger：

```typescript
// ... existing imports ...
import { MyLogger } from './MyLogger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useLogger(new MyLogger())
  await app.listen(3000)
}
bootstrap()
```

运行项目：

```bash
npm run start:dev
```

此时，日志输出已经切换为我们自定义的 `MyLogger`。接下来，我们将 Winston 集成到这个自定义 Logger 中。

## 集成 Winston

首先，安装 Winston：

```bash
npm install --save winston
```

然后修改 `MyLogger.ts`，将 `console.log` 替换为 Winston 的日志方法：

```typescript
import { LoggerService } from '@nestjs/common'
import { createLogger, format, Logger, transports } from 'winston'

export class MyLogger implements LoggerService {
  private logger: Logger

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      format: format.combine(format.colorize(), format.simple()),
      transports: [new transports.Console()],
    })
  }

  log(message: string, context: string) {
    this.logger.log('info', `[${context}] ${message}`)
  }

  error(message: string, context: string) {
    this.logger.log('error', `[${context}] ${message}`)
  }

  warn(message: string, context: string) {
    this.logger.log('warn', `[${context}] ${message}`)
  }
}
```

现在，日志输出已经由 Winston 处理了。不过，Winston 的默认日志格式和 Nest 的原生日志格式有所不同。接下来，我们将自定义日志格式，使其更接近 Nest 的风格。

## 自定义日志格式

为了让日志格式更符合 Nest 的风格，我们可以使用 `chalk` 来为日志添加颜色，使用 `dayjs` 来格式化时间。首先，安装这两个库：

```bash
npm install --save dayjs chalk@4
```

然后修改 `MyLogger.ts`：

```typescript
import { LoggerService } from '@nestjs/common'
import * as chalk from 'chalk'
import * as dayjs from 'dayjs'
import { createLogger, format, Logger, transports } from 'winston'

export class MyLogger implements LoggerService {
  private logger: Logger

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green(`[NEST]`)
              const contextStr = chalk.yellow(`[${context}]`)
              return `${appStr} ${time} ${level} ${contextStr} ${message}`
            })
          ),
        }),
      ],
    })
  }

  log(message: string, context: string) {
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    this.logger.log('info', message, { context, time })
  }

  error(message: string, context: string) {
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    this.logger.log('error', message, { context, time })
  }

  warn(message: string, context: string) {
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    this.logger.log('warn', message, { context, time })
  }
}
```

通过 `format.printf`，我们自定义了日志的输出格式，使用 `chalk` 为日志添加了颜色，并通过 `dayjs` 格式化了时间。现在，日志输出看起来已经非常接近 Nest 的原生日志格式了。

## 添加文件日志

除了在控制台输出日志，我们还可以将日志保存到文件中。我们可以为 Winston 添加一个文件 `transport`，并将日志格式化为 JSON 格式。修改 `MyLogger.ts`：

```typescript
new transports.File({
  format: format.combine(format.timestamp(), format.json()),
  filename: '111.log',
  dirname: 'log',
})
```

现在，日志不仅会输出到控制台，还会保存到 `log/111.log` 文件中，且文件中的日志是 JSON 格式的。

## 封装为动态模块

为了让 Winston 的集成更加灵活，我们可以将其封装为一个动态模块。这样，我们可以在应用的任何地方注入这个 Logger。首先，创建一个 `WinstonModule`：

```typescript
import { DynamicModule, Global, Module } from '@nestjs/common'
import { LoggerOptions, createLogger } from 'winston'
import { MyLogger } from './MyLogger'

export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER'

@Global()
@Module({})
export class WinstonModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: WinstonModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new MyLogger(options),
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    }
  }
}
```

在 `AppModule` 中引入这个模块：

```typescript
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WinstonModule } from './winston/winston.module'
import { transports, format } from 'winston'
import * as chalk from 'chalk'

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green(`[NEST]`)
              const contextStr = chalk.yellow(`[${context}]`)
              return `${appStr} ${time} ${level} ${contextStr} ${message}`
            })
          ),
        }),
        new transports.File({
          format: format.combine(format.timestamp(), format.json()),
          filename: '111.log',
          dirname: 'log',
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

最后，在 `main.ts` 中使用这个 Logger：

```typescript
app.useLogger(app.get(WINSTON_LOGGER_TOKEN))
```

## 总结

通过本文，我们成功地将 Winston 集成到了 Nest.js 中，并自定义了日志格式，使其更符合 Nest 的风格。我们还将 Winston 封装为一个动态模块，方便在应用的各个部分注入和使用。虽然我们可以自己实现这些功能，但实际上社区已经有了现成的解决方案，比如 `nest-winston`，它可以帮助我们更快速地完成集成。

无论是自定义实现还是使用现成的库，Winston 都是一个非常强大的日志工具，能够帮助我们更好地管理和分析应用的日志。
