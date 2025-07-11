## RxJS 初识
RxJS 是一个组织异步逻辑的库，它有很多 operator，可以极大的简化异步逻辑的编写。<br />它是由数据源（observable）产生数据，经过一系列 operator 的处理，最后传给接收者。<br />比如这样：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687068181380-d1bee459-b838-4867-b2c3-d93ace9ab220.png#averageHue=%23302f2c&clientId=u84e413b7-c9bc-4&from=paste&height=164&id=uc294c834&originHeight=328&originWidth=1418&originalType=binary&ratio=2&rotation=0&showTitle=false&size=64688&status=done&style=none&taskId=uddce345f-ac12-4aa0-973c-070a809b01b&title=&width=709)<br />调用 of 操作符创建一个 Observable，它发送了三个值 1、2、3。<br />使用 pipe 方法，将 map 操作符添加到 Observable 上，对每个输入值进行平方运算，得到一个新的 Observable，它发送了 1、4、9。<br />再次使用 pipe 方法，将 filter 操作符添加到 Observable 上，过滤掉所有偶数值，得到一个新的 Observable，它发送了 1、9。<br />最后，调用 subscribe 方法订阅这个 Observable，当它发送新值时，调用提供的回调函数输出结果。在这个例子中，回调函数输出了每个接收到的值。

继续看这段代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687068532575-0df9555c-0ead-4b1f-8dc2-fc7bea1ee8b6.png#averageHue=%232e2d2c&clientId=u84e413b7-c9bc-4&from=paste&height=269&id=u7dcca137&originHeight=538&originWidth=1138&originalType=binary&ratio=2&rotation=0&showTitle=false&size=71095&status=done&style=none&taskId=ua5613030-4e5a-409b-a5cf-ad7e230dd90&title=&width=569)<br />调用 of 操作符创建一个 Observable，它发送了三个值 1、2、3。<br />使用 pipe 方法，将 scan 操作符添加到 Observable 上，对每个输入值进行累加操作，得到一个新的 Observable，它在每次接收到值时都会发出累加结果。在这个例子中，第一个值是 1，第二个值是 1 + 2 = 3，第三个值是 1 + 2 + 3 = 6。<br />再次使用 pipe 方法，将 map 操作符添加到 Observable 上，对每个累加结果进行平均数计算，得到一个新的 Observable，它在每次接收到值时都会发出平均数结果。在这个例子中，第一个值是 1，第二个值是 (1 + 2) / 2 = 1.5，第三个值是 (1 + 2 + 3) / 3 = 2。<br />最后，调用 subscribe 方法订阅这个 Observable，当它发送新值时，调用提供的回调函数输出结果。在这个例子中，回调函数输出了每个接收到的平均数结果。

再来看节流、防抖：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687068935576-811a596a-c1c9-42b5-b435-637f7e36dad9.png#averageHue=%2333302c&clientId=u84e413b7-c9bc-4&from=paste&height=161&id=ue71a5456&originHeight=322&originWidth=1018&originalType=binary&ratio=2&rotation=0&showTitle=false&size=58030&status=done&style=none&taskId=ue6830c0c-1fd9-4c34-8b78-21fab6685ea&title=&width=509)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687068960425-9f7ab213-f00c-4637-8e6c-cc327743c833.png#averageHue=%2333302c&clientId=u84e413b7-c9bc-4&from=paste&height=162&id=ue6e88962&originHeight=324&originWidth=1020&originalType=binary&ratio=2&rotation=0&showTitle=false&size=59637&status=done&style=none&taskId=u3058e4ad-6449-423c-b822-7d30bd69927&title=&width=510)<br />可以在官网文档看到[所有的 operator](https://link.juejin.cn/?target=https%3A%2F%2Frxjs.dev%2Fguide%2Foperators%23creation-operators-1)。<br />如果异步逻辑复杂度高， RxJS 收益还是很高的。<br />Nest 的 interceptor 集成了 RxJS，可以用它来处理响应。

## 拦截器初识
创建一个测试项目：
```bash
nest new interceptor-test -p npm
```
进入目录执行：
```bash
nest g interceptor logging --flat --no-spec
```
记录下请求时间：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708939615389-374c02c2-bb04-495b-b93c-25dba4c23932.png#averageHue=%232e2c2b&clientId=ue2fd7974-2d29-4&from=paste&height=423&id=ueb45ce4a&originHeight=658&originWidth=1023&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=82487&status=done&style=none&taskId=u1eaffca0-4e87-4384-ae58-1fdc5572b0c&title=&width=658.4000244140625)

使用拦截器的方式：<br />方法级别：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708941148161-5b0f2502-60e0-49bd-a171-dad1011d6051.png#averageHue=%2337322c&clientId=ufc6967b2-e76a-4&from=paste&height=135&id=u71895d1d&originHeight=169&originWidth=493&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=17173&status=done&style=none&taskId=u297df3ee-ef5d-4183-9ef9-6c885981a97&title=&width=394.4)<br />访问页面，控制台打印：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708941124821-701d1824-1c62-49d4-9dea-0c83b3073c63.png#averageHue=%233b3937&clientId=ufc6967b2-e76a-4&from=paste&height=40&id=u43209e01&originHeight=50&originWidth=163&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=2241&status=done&style=none&taskId=u013f988f-399f-4c25-a34e-2b620dfc0db&title=&width=130.4)<br />全局：
```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  // ...
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```
控制器级别：
```typescript
import { Controller, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

@Controller('cats')
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  // ...
}
```
我们再来看看适合在 Nest 的 interceptor 里用的 operator：

## Nest 中使用 RxJS
### map
map 操作符允许对从请求处理程序返回的数据进行转换。例如，可以使用它将数据包装在一个标准的响应对象中，该对象包含状态码、消息和数据。<br />生成一个 interceptor：
```bash
nest g interceptor map-test --flat --no-spec
```
使用 map operator 对 controller 返回的数据做一些修改：
```javascript
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class MapTestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          message: 'success',
          data,
        };
      }),
    );
  }
}
```
controll 下启用：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687071404488-d423f7ec-e3b6-4a37-9bd7-d3d9578e4266.png#averageHue=%23322f2c&clientId=u84e413b7-c9bc-4&from=paste&height=135&id=u2cf66ce0&originHeight=270&originWidth=788&originalType=binary&ratio=2&rotation=0&showTitle=false&size=30146&status=done&style=none&taskId=u61048540-8f22-4ee1-9542-a6c8ad167dc&title=&width=394)<br />请求接口：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687071422542-667a9a62-700f-42c8-bcc3-94790d2396f5.png#averageHue=%23f3f2f2&clientId=u84e413b7-c9bc-4&from=paste&height=79&id=ue4e2846a&originHeight=158&originWidth=748&originalType=binary&ratio=2&rotation=0&showTitle=false&size=18685&status=done&style=none&taskId=u0536a8dc-d110-43a8-a71f-e9ab830d148&title=&width=374)


### tap
tap 操作符允许在不修改数据流的情况下执行副作用操作，比如记录日志或更新缓存。<br />这对于在请求处理过程中添加额外的日志记录或调试信息非常有用。<br />再生成个 interceptor
```bash
nest g interceptor tap-test --flat --no-spec
```
使用 tap operator 来添加一些日志、缓存等逻辑：
```javascript
import { AppService } from './app.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TapTestInterceptor implements NestInterceptor {
  constructor(private appService: AppService) {}

  private readonly logger = new Logger(TapTestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        // 这里假装下更新缓存的操作
        this.appService.getHello();

        this.logger.log(`log something`, data);
      }),
    );
  }
}
```
在 controller 返回响应的时候记录一些东西。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687071750460-49205b36-9ded-452b-93bb-117a97be05a3.png#averageHue=%23322f2c&clientId=u84e413b7-c9bc-4&from=paste&height=130&id=u5a3af03c&originHeight=260&originWidth=796&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29685&status=done&style=none&taskId=ua4fbae2b-db3a-4e6a-86b6-23239ad5eae&title=&width=398)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687071724570-99459155-431b-400b-887f-3e063737aad6.png#averageHue=%233f3d37&clientId=u84e413b7-c9bc-4&from=paste&height=26&id=uc1052c0c&originHeight=52&originWidth=1132&originalType=binary&ratio=2&rotation=0&showTitle=false&size=23975&status=done&style=none&taskId=u550396da-a842-4ff2-8b9d-849d6dd7cdb&title=&width=566)

### catchError
catchError 操作符允许处理在请求处理程序中抛出的异常。<br />可以先在拦截器中捕获这些异常，并执行一些额外的逻辑，比如记录错误日志或返回自定义的错误响应。<br />生成 interceptor：
```bash
nest g interceptor catch-error-test --flat --no-spec
```
使用 catchError 处理抛出的异常：
```typescript
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class CatchErrorTestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CatchErrorTestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // 使用 catchError 操作符来捕获异常
      catchError((err) => {
        this.logger.error(err.message, err.stack);

         // 重新抛出错误，让它可以被后续的错误处理器捕获
        return throwError(() => err);
      }),
    );
  }
}
```
在 controller 使用下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687072039431-c5a1d7e6-b744-4ce7-ac02-dc5cffe62f3b.png#averageHue=%23312f2c&clientId=u84e413b7-c9bc-4&from=paste&height=152&id=udc47e2ea&originHeight=304&originWidth=946&originalType=binary&ratio=2&rotation=0&showTitle=false&size=39289&status=done&style=none&taskId=u7f134333-09ef-4806-a841-6a2aa6e0c7c&title=&width=473)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687072018764-cf299ae1-ccbf-496d-9b6d-39d74c523f32.png#averageHue=%23f0f0f0&clientId=u84e413b7-c9bc-4&from=paste&height=65&id=ue651aa80&originHeight=130&originWidth=842&originalType=binary&ratio=2&rotation=0&showTitle=false&size=19320&status=done&style=none&taskId=u4b03c9e8-173f-466a-9bbb-04e1f3ef385&title=&width=421)<br />这个 500 错误，是内置的 exception filter 处理的：<br />nest 控制台会打印两次错误，报错信息都是 xxx。<br />一次是我们在 interceptor 里打印的，一次是 exception filter 打印的。

### timeout
timeout 操作符允许为请求处理程序设置一个超时时间。<br />如果在指定的时间内没有收到响应，它将抛出一个 TimeoutError 异常。<br />可以结合 catchError 操作符来处理这个异常，并返回一个适当的超时响应。<br />创建 interceptor：
```typescript
nest g interceptor timeout --flat --no-spec
```
添加如下逻辑：
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 设置超时时间为3秒
    const TIMEOUT = 3000;

    return next.handle().pipe(
      timeout(TIMEOUT), // 在3秒后如果还没有响应，则抛出TimeoutError
      catchError((error) => {
        if (error instanceof TimeoutError) {
          // 如果捕获到超时错误，则抛出HttpException
          return throwError(
            () => new HttpException('请求超时', HttpStatus.REQUEST_TIMEOUT),
          );
        }
        // 如果是其他类型的错误，则继续抛出
        return throwError(() => error);
      }),
    );
  }
}
```
这样 timeout 操作符会在 3s 没收到消息的时候抛一个错误。

在 controller 使用下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687072435684-140990b4-f0e2-441b-ba06-28f69617a9ad.png#averageHue=%23312f2c&clientId=u84e413b7-c9bc-4&from=paste&height=161&id=u453279f7&originHeight=322&originWidth=1310&originalType=binary&ratio=2&rotation=0&showTitle=false&size=55350&status=done&style=none&taskId=u5a9af593-21e4-4ac5-8a40-2072aef77da&title=&width=655)<br />浏览器访问，3s 后返回 408 响应：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708948340028-600f9581-150a-4ba0-a8dd-e8e02f8e5727.png#averageHue=%23fcfbf9&clientId=u4f9937e0-ebec-4&from=paste&height=113&id=uc13adeb4&originHeight=141&originWidth=353&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=9090&status=done&style=none&taskId=u3d98c48c-eb77-40aa-ab30-3bca2bdd150&title=&width=282.4)

## Interceptor 和 Middleware 的区别
主要区别是 Interceptor 可以拿到调用的 controller 和 handler，而 middleware 不行。
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    
    const controller = context.getClass(); // 获取当前调用的控制器
    const handler = context.getHandler(); // 获取当前调用的处理器
    
    // 执行下一个中间件或处理器
    return next.handle().pipe(
      tap(() => console.log('After...'))
    );
  }
}
```

