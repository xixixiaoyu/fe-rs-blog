### 什么是 HTTP 模块？

简单来说，Nest.js 的 HTTP 模块就是个“快递员”。它帮你把请求发出去，再把服务器的回应带回来。

它利用了 Axios 这个强大的 HTTP 客户端库，然后通过 HttpModule 和 HttpService 封装了一下，让我们在 Nest.js 项目里用起来更顺手。特别酷的是，它把 HTTP 响应的结果包装成了 Observable（一种 RxJS 的数据流），这让异步操作变得更加灵活。

如果你对 Axios 不陌生，那你会发现 Nest 的封装其实就是在它的基础上加了点“ Nest 风味”。当然，如果你不喜欢用这个封装，也可以直接用 Node.js 的其他 HTTP 库，比如 got 或 undici，完全没问题。



### 怎么开始用？

#### 第一步：安装依赖

```bash
$ npm i --save @nestjs/axios axios
```

这里装了两个东西：@nestjs/axios 是 Nest 对 Axios 的封装，axios 是底层的核心库。装好后，咱们就可以动手了。

#### 第二步：导入模块

在 Nest.js 中，模块化是核心思想。要用 HttpModule，得先把它加到某个模块里。比如，咱们有个 CatsModule，可以这样写：

```ts
import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { CatsService } from './cats.service'

@Module({
  imports: [HttpModule],
  providers: [CatsService],
})
export class CatsModule {}
```

这样，HttpModule 就加入到模块里了，接下来可以用它提供的 HttpService。

#### 第三步：注入 HttpService

在服务类里，咱们通过构造函数把 HttpService 注入进来，然后就可以用它发请求了。来看个简单的例子：

```ts
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'

@Injectable()
export class CatsService {
  constructor(private readonly httpService: HttpService) {}

  findAll(): Observable<AxiosResponse<Cat[]>> {
    return this.httpService.get('http://localhost:3000/cats')
  }
}
```

这里，findAll 方法发了个 GET 请求去 http://localhost:3000/cats，返回的是一个 Observable，里面包着 AxiosResponse。这个响应对象里会有状态码、数据等信息，具体用的时候可以再拆开。



### 配置 HTTP 请求

默认的 HttpService 已经很好用了，但有时候咱们得根据项目需求调整一下底层 Axios 的行为。比如，设置超时时间或最大重定向次数。这时候可以在导入 HttpModule 时加点配置：

```ts
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,       // 超时 5 秒
      maxRedirects: 5,     // 最多重定向 5 次
    }),
  ],
  providers: [CatsService],
})
export class CatsModule {}
```

这些配置会直接传给 Axios 的构造函数，简单粗暴又好用。

#### 异步配置怎么办？

如果配置不是写死的，而是需要动态获取（比如从环境变量或配置文件里读），可以用 registerAsync。Nest 提供了好几种方法，咱们挑两个常用的看看。

##### 方法 1：工厂函数

```ts
HttpModule.registerAsync({
  useFactory: () => ({
    timeout: 5000,
    maxRedirects: 5,
  }),
})
```

如果需要依赖其他服务（比如 ConfigService），还能这么写：

```ts
import { ConfigModule } from '@nestjs/config'

HttpModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    timeout: configService.get('HTTP_TIMEOUT'),
    maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
  }),
  inject: [ConfigService],
})
```

##### 方法 2：用类配置

如果喜欢面向对象的方式，可以定义一个配置类：

```ts
import { Injectable } from '@nestjs/common'
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios'

@Injectable()
class HttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: 5000,
      maxRedirects: 5,
    }
  }
}

@Module({
  imports: [HttpModule.registerAsync({
    useClass: HttpConfigService,
  })],
})
export class CatsModule {}
```

这两种方法都能满足动态需求，看你喜欢哪种风格。



### 直接用 Axios？也可以！

有时候，HttpModule 的封装可能不够灵活，你想直接操作底层的 Axios 实例。没问题，HttpService 提供了 axiosRef，可以直接访问：

```ts
@Injectable()
export class CatsService {
  constructor(private readonly httpService: HttpService) {}

  findAll(): Promise<AxiosResponse<Cat[]>> {
    return this.httpService.axiosRef.get('http://localhost:3000/cats')
  }
}
```

这里的 axiosRef 就是 Axios 的实例，用法跟原生的 Axios 一模一样。



### 完整实战：优雅地处理请求

因为 HttpService 返回的是 Observable，咱们可以用 RxJS 的工具把它转成 Promise，方便处理。来看个完整的例子：

```ts
import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom } from 'rxjs'
import { AxiosError } from 'axios'

@Injectable()
export class CatsService {
  private readonly logger = new Logger(CatsService.name)

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Cat[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Cat[]>('http://localhost:3000/cats').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data)
          throw '出错了！'
        })
      )
    )
    return data
  }
}
```

这里用了 firstValueFrom 把 Observable 转成 Promise，还加了错误处理。如果请求失败，日志会记录错误信息，然后抛出异常。是不是很优雅？



### 小结

总结一下：

1. **安装和导入**：装好包，导入 HttpModule，注入 HttpService。
2. **基本请求**：用 httpService.get/post 等方法发请求，返回 Observable。
3. **配置灵活**：通过 register 或 registerAsync 自定义 Axios 行为。
4. **直接操作**：需要更多控制？用 axiosRef 调用原生 Axios。
5. **优雅处理**：结合 RxJS，轻松转 Promise，还能加错误处理。