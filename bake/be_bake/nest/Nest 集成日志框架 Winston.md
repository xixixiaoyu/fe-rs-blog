## 初步集成
创建项目：
```bash
nest new nest-winston-test -p npm
```
进入目录将服务跑起来：
```bash
npm run start:dev
```
安装 winston：
```bash
npm install winston
```
创建 logger.service.ts：
```typescript
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        // 根据需要添加更多的 transports
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
    });
  }

  log(message: string) {
    this.logger.log('info', message);
  }

  error(message: string, trace: string) {
    this.logger.log('error', `${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.log('warn', message);
  }

  // 根据需要添加更多的日志级别方法
}
```
注册：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707883271814-b3f10aba-4b5f-4031-817c-94262b88d4bf.png#averageHue=%23302d2a&clientId=u5c41f8c7-6168-4&from=paste&height=313&id=uf4cbebdd&originHeight=626&originWidth=780&originalType=binary&ratio=2&rotation=0&showTitle=false&size=65238&status=done&style=none&taskId=u5c966723-0df9-47f1-a079-3a166c83f15&title=&width=390)<br />使用：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707883303295-cb5cb27c-03bb-4b33-bbca-93ab38f8dbff.png#averageHue=%23332f2b&clientId=u5c41f8c7-6168-4&from=paste&height=263&id=ubbc280aa&originHeight=526&originWidth=848&originalType=binary&ratio=2&rotation=0&showTitle=false&size=62873&status=done&style=none&taskId=ud09cd78d-f041-47aa-a1cd-177754980d2&title=&width=424)<br />访问下 localhost:3000：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707883356213-54ac7408-43ca-4cfa-98d4-5afda2a2da9b.png#averageHue=%233a3733&clientId=u5c41f8c7-6168-4&from=paste&height=97&id=u49b77a36&originHeight=194&originWidth=1476&originalType=binary&ratio=2&rotation=0&showTitle=false&size=77881&status=done&style=none&taskId=u685409f3-9313-4716-b83e-a5a9bcd5364&title=&width=738)<br />成功打印了日志。但是和 nest 内置的日志格式不一样。我们可以模仿下。

## 添加更多
安装 dayjs 格式化日期：
```bash
npm install dayjs
```
安装 chalk 来打印颜色：
```bash
npm install chalk@4
```
注意：这里用的是 chalk 4.x 的版本。<br />然后来实现下 nest 日志的格式：
```typescript
import { LoggerService } from '@nestjs/common';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import { createLogger, format, Logger, transports } from 'winston';

export class WinstonLoggerService implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green(`[NEST]`);
              const contextStr = chalk.yellow(`[${context}]`);

              return `${appStr} ${time} ${level} ${contextStr} ${message} `;
            }),
          ),
        }),
      ],
    });
  }

  getTime() {
    return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  }

  log(message: string, context: string) {
    this.logger.info(message, { context, time: this.getTime() });
  }

  error(message: string, context: string) {
    this.logger.error(message, { context, time: this.getTime() });
  }

  warn(message: string, context: string) {
    this.logger.warn(message, { context, time: this.getTime() });
  }
}
```
main.ts 替换 Nest.js 内置的 logger：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707885613830-c86b6be6-0cb8-4c38-bc1e-f4e0bffb67c1.png#averageHue=%2335302c&clientId=uc82e9450-f60c-4&from=paste&height=212&id=u1191e7e3&originHeight=424&originWidth=1066&originalType=binary&ratio=2&rotation=0&showTitle=false&size=60538&status=done&style=none&taskId=ufca4e0ad-93de-48af-865b-6a56c03d71a&title=&width=533)<br />加下第二个上下文参数：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707885661343-e0e6e9d2-196c-4182-a6af-6dc3a52aaad4.png#averageHue=%232d2c2b&clientId=uc82e9450-f60c-4&from=paste&height=105&id=u66e451fc&originHeight=210&originWidth=1206&originalType=binary&ratio=2&rotation=0&showTitle=false&size=31389&status=done&style=none&taskId=u710b8876-eb77-47c9-9fc4-7790f100783&title=&width=603)<br />访问下页面：打印：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707885695188-23fb4170-0209-48d1-9a18-b42a1a022af2.png#averageHue=%23363636&clientId=uc82e9450-f60c-4&from=paste&height=96&id=u764006ec&originHeight=192&originWidth=1418&originalType=binary&ratio=2&rotation=0&showTitle=false&size=77345&status=done&style=none&taskId=u2149c7f0-e44a-4345-857d-8680bea79d3&title=&width=709)<br />然后加一个 File 的 transport。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707885527091-417e90f7-9931-4100-9d6c-a6e16034ec0c.png#averageHue=%23302d2b&clientId=uc82e9450-f60c-4&from=paste&height=393&id=u2e42116f&originHeight=786&originWidth=1384&originalType=binary&ratio=2&rotation=0&showTitle=false&size=83066&status=done&style=none&taskId=ub446c3f9-1e6c-43e6-8576-98160df2add&title=&width=692)<br />会生成日志文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707885748309-12dab399-5f4f-4e92-a514-50154b81c34e.png#averageHue=%232b2b2b&clientId=uc82e9450-f60c-4&from=paste&height=102&id=u358a54a6&originHeight=204&originWidth=2560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=108781&status=done&style=none&taskId=u620030d6-998d-4f70-8fa3-1323e340cab&title=&width=1280)

## 封装成动态模块
我们可以将 winston 集成到 nest 中，社区也有对应的包：`nest-winston`，我们来自己封装下叭：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1700403882747-c31aea4f-b747-4a54-b24f-47132ebe6adc.png#averageHue=%23414141&clientId=uf5cbb3a7-cc9d-4&from=paste&height=34&id=u83d4a8eb&originHeight=68&originWidth=794&originalType=binary&ratio=2&rotation=0&showTitle=false&size=19338&status=done&style=none&taskId=u94af9021-005e-4ceb-8d81-0fdc224aa2c&title=&width=397)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708071910107-9968b32e-f327-4893-8255-4f2222c07c8a.png#averageHue=%232e2d2d&clientId=u9886ed22-5747-4&from=paste&height=641&id=u501baf2d&originHeight=1282&originWidth=2276&originalType=binary&ratio=2&rotation=0&showTitle=false&size=349900&status=done&style=none&taskId=u3c305e7f-22a2-480a-8cc2-545a31c024f&title=&width=1138)<br />logger.service.ts：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1700404008332-435a6878-d0a2-42f8-a04f-ef666c9cc97d.png#averageHue=%2338322c&clientId=uf5cbb3a7-cc9d-4&from=paste&height=70&id=u115cee29&originHeight=140&originWidth=648&originalType=binary&ratio=2&rotation=0&showTitle=false&size=19207&status=done&style=none&taskId=ufb954294-85c8-4259-82b0-28ecd04c490&title=&width=324)<br />然后在 AppModule 引入下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708072040493-7c454b12-23d4-4510-8921-d9d32b809648.png#averageHue=%232d2c2b&clientId=u9886ed22-5747-4&from=paste&height=625&id=u87336bc8&originHeight=1250&originWidth=1566&originalType=binary&ratio=2&rotation=0&showTitle=false&size=183034&status=done&style=none&taskId=ub6f14cef-4e74-4d27-ac04-e3766f257ef&title=&width=783)<br />改一下 main.ts 里用的 logger：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1700404118731-d7ce2084-f967-4be8-bef7-66f72a2be63c.png#averageHue=%2335312c&clientId=uf5cbb3a7-cc9d-4&from=paste&height=135&id=ub0e4bb3e&originHeight=270&originWidth=810&originalType=binary&ratio=2&rotation=0&showTitle=false&size=44172&status=done&style=none&taskId=ue35db20a-ea54-4ce3-9a39-dca3dc51440&title=&width=405)<br />正常打印：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708072542330-fa700b5e-803c-403f-b2bd-84f6bca93b28.png#averageHue=%233a3936&clientId=u9886ed22-5747-4&from=paste&height=94&id=u33358f99&originHeight=188&originWidth=1480&originalType=binary&ratio=2&rotation=0&showTitle=false&size=84749&status=done&style=none&taskId=u8d6de08a-df39-4c1a-9bc6-1417050de91&title=&width=740)<br />使用：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708072575522-70f340b1-3a02-4240-9763-dd4758effa70.png#averageHue=%23312e2a&clientId=u9886ed22-5747-4&from=paste&height=257&id=u027e7f53&originHeight=514&originWidth=1238&originalType=binary&ratio=2&rotation=0&showTitle=false&size=71554&status=done&style=none&taskId=uc58c74c8-d5cb-4c12-be66-82d8b45b2e8&title=&width=619)
