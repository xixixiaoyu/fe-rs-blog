## 关于 Next 中间件
Nest 中间件中间件是处于请求和响应周期中间的函数，类似 express 中间件，可以访问请求对象（`req`）、响应对象（`res`）、和应用程序的下一个中间件函数。<br />中间件的主要任务是可以执行以下操作：

1. 执行任何代码。
2. 修改请求和响应对象。
3. 结束请求-响应周期。
4. 调用堆栈中的下一个中间件函数。

如果当前中间件没有结束请求-响应周期，它必须调用 `next()` 方法将控制权传递给下一个中间件，否则请求将被挂起。

Nest 中间件应用场景：

- 请求日志记录：记录每个进入应用的请求的详细信息，如请求路径、方法、来源IP等，便于调试和监控。
- 身份验证和授权：在请求继续处理之前验证用户的身份，检查用户是否有权限访问特定的路由或资源。
- 请求数据处理：对请求中的数据进行预处理，如解析、格式化、校验等。
- 设置响应头：为即将发送的响应设置一些通用的HTTP头，如跨域资源共享（CORS）头、安全相关的头等。
- 性能监控：监控请求处理的时间，以便分析和优化性能。
- 缓存：实现缓存逻辑，减少对后端服务或数据库的请求，提高应用性能。
- 限流：控制请求的频率，防止服务被过度使用或遭受拒绝服务攻击（DDoS）。
- 错误处理：捕获请求处理过程中的异常，进行统一的错误处理。
- 国际化：根据请求头或其他指示来设置语言环境，实现内容的国际化。
- API版本管理：根据请求的版本信息（如URL路径、请求头）来路由到不同版本的处理逻辑。

## 创建中间件
Nest 中间件可以是一个函数，也可以是一个带有 `@Injectable()` 装饰器，实现 `NestMiddleware` 接口的类：<br />创建 Nest 项目：
```bash
nest new middleware-test -p npm
```
创建 middleware：
```bash
nest g middleware logger --no-spec --flat
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709001278293-fd660655-00c3-4068-841d-8f9a3f52264a.png#averageHue=%23302d2b&clientId=u61300a99-8906-4&from=paste&height=242&id=u678759cf&originHeight=303&originWidth=966&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=39831&status=done&style=none&taskId=uf69f8e79-05d0-435f-b5df-0d3cd7a691e&title=&width=772.8)<br />手动标注类型， 并在 next 前后插入一些代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709001514425-20e302ef-0a38-49c7-9df4-0ef7c0afa397.png#averageHue=%23332e2b&clientId=u61300a99-8906-4&from=paste&height=279&id=u5245b588&originHeight=418&originWidth=966&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=69358&status=done&style=none&taskId=u06027a0d-4a49-460a-a3ba-f9ac1d02305&title=&width=644.7999877929688)<br />或者是一个函数：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709001586654-efd7c0b1-a110-4b27-ab28-a633925de99b.png#averageHue=%232f2d2b&clientId=u61300a99-8906-4&from=paste&height=130&id=uc2e76b0b&originHeight=162&originWidth=978&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=23337&status=done&style=none&taskId=uaeb3e8d7-2f34-4e00-bed5-3f29b46bf5f&title=&width=782.4)<br />它们之间的区别也就在，类可以实现依赖注入。而函数不行。


## 使用中间件
在 AppModule 模块中，使用 `configure` 方法来设置中间件。你可以为整个应用、特定路由或一组路由应用中间件。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709001944438-586bdd3d-7710-4bd1-9a0a-21cb5f6afbc8.png#averageHue=%232e2d2b&clientId=u61300a99-8906-4&from=paste&height=274&id=u1245f570&originHeight=343&originWidth=1017&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=52350&status=done&style=none&taskId=u59a6fc53-e8ec-40e1-a9b3-f44f064cfa3&title=&width=813.6)<br />`forRoutes` 方法用于指定中间件应用到的路由。它可以接收多种不同类型的参数，以满足不同的路由匹配需求。

1.  字符串路径：<br />可以直接传递一个字符串，表示中间件将应用于该特定路径。 
```javascript
.forRoutes('users');
```

2.  路径模式（带通配符）：<br />可以使用通配符 `*` 来匹配一组路由。 
```javascript
.forRoutes('users/*');
```

3.  控制器类：<br />可以传递一个控制器类，中间件将应用于该控制器中定义的所有路由。 
```javascript
.forRoutes(UsersController);
```

4.  路由对象：<br />可以传递一个对象，其中包含 `path` 和 `method` 属性，用于更精确地定义中间件应用的路由和方法。 
```javascript
.forRoutes({ path: 'users', method: RequestMethod.GET });
```

5.  路由对象数组：<br />还可以传递一个路由对象数组，以将中间件应用于多个不同的路由和方法。 
```javascript
.forRoutes(
  { path: 'users', method: RequestMethod.GET },
  { path: 'users', method: RequestMethod.POST },
  { path: 'admin', method: RequestMethod.ALL }
);
```

6.  控制器和方法数组：<br />你可以传递一个数组，其中包含控制器类和方法，以将中间件应用于特定控制器的特定方法。 
```javascript
.forRoutes({ path: 'users', method: RequestMethod.ALL }, UsersController);
```
 使用 `forRoutes` 方法时，可以根据需要混合使用这些配置，以实现对中间件应用的精确控制。

## 创建并绑定多个中间件
绑定多个中间件，可以在 `configure` 方法中使用链式调用 `.apply()` 方法，并传入多个中间件。<br />我们先创建个中间件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709002374199-b37b8636-6296-4830-b889-40583300998b.png#averageHue=%23302d2b&clientId=u61300a99-8906-4&from=paste&height=238&id=u74c51ede&originHeight=297&originWidth=527&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=29888&status=done&style=none&taskId=u5148a8f7-d2b1-4f29-bd2b-22037baf5d3&title=&width=421.6)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709002418535-3f127d61-e1bf-4bde-8200-65c489050e9e.png#averageHue=%232f2d2b&clientId=u61300a99-8906-4&from=paste&height=234&id=u605825ad&originHeight=293&originWidth=1034&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=45001&status=done&style=none&taskId=u761ab5f0-4feb-43e1-800d-f8a65add79b&title=&width=827.2)<br />也可以这样写：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709003803973-53033dd4-981a-488e-accb-cb03f10d60c8.png#averageHue=%23322f2d&clientId=u66ab5f3c-f019-4&from=paste&height=129&id=ud1d5ec7b&originHeight=194&originWidth=929&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=41062&status=done&style=none&taskId=u0b13acf3-d45a-466c-877c-131a5d79727&title=&width=619.3333333333334)<br />中间件会按照从左到右，从上到下顺序对所有路由生效，我们访问页面，看下打印结果：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709002488960-4c971b71-b8b8-4b41-a92e-e293b21ae6be.png#averageHue=%23393735&clientId=u61300a99-8906-4&from=paste&height=88&id=ubed88405&originHeight=110&originWidth=278&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=4734&status=done&style=none&taskId=u3fd08739-d8e7-464d-8183-babc7e0c7b3&title=&width=222.4)
## 
## 创建全局中间件
全局中间件在整个应用程序中的每个路由上都会生效。<br />除了上面使用的 `forRoutes('*')`，还可以在 `main.ts` 文件中使用 `app.use()` 方法：
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger); // 将 logger 函数注册为全局中间件
  await app.listen(3000);
}
bootstrap();
```
这种形式不能注入依赖，也不能指定路由，不建议使用。


## middleware 和 interceptor 区别
Nest 的 middleware 和 interceptor 都可以在请求前后加入一些逻辑，有什么区别呢？

- interceptor 是能从 context 里拿到目标 class 和 handler，进而通过 reflector 拿到它的 metadata 等信息的，middleware 就不可以。
-  interceptor 可以用 rxjs 操作符来组织响应处理流程，middleware 也不可以。

interceptor 更适合处理与具体业务相关的逻辑，而 middleware 适合更通用的处理逻辑。
