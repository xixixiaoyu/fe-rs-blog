## cookie 简介
网页的 Cookie 是一种由网站创建并保存在用户计算机上的小型数据文件，用于追踪和记住用户的信息和行为。<br />当用户访问一个网站时，网站的服务器可能会发送一个或多个 Cookie 到用户的浏览器，浏览器会将这些信息存储起来。<br />以后，当用户再次访问同一个网站时，浏览器会把这些信息发送回服务器，这样网站就可以识别用户并根据用户的以前的行为来定制内容。

Cookie 通常包含以下信息：

- **名称**：一个独特的标识符，用来识别 Cookie。
- **值**：存储在 Cookie 中的数据（通常是加密的）。
- **到期时间**：Cookie 的有效期限。过期后，Cookie 会自动删除。
- **路径**：Cookie 适用的网站路径。默认情况下，Cookie 只对设置它的网页有效。
- **域**：Cookie 适用的域名。默认情况下，只有创建 Cookie 的网站可以读取它。
- **安全标志**：指示 Cookie 是否仅通过加密的 HTTPS 连接发送。

Cookie 主要用途包括：

1. **会话管理**：保存用户的登录信息、购物车内容、游戏分数或其他需要跟踪的数据。
2. **个性化**：记录用户的偏好设置，如网站主题、语言选择或配置。
3. **追踪**：记录和分析用户的行为，以便网站运营商可以改进网站的用户体验或进行广告定位。

## Nest 中使用 Cookie

1.  **安装必要的中间件**：安装 `cookie-parser`： 
```bash
npm install cookie-parser
```

2.  **导入中间件**：主模块中导入并配置 `cookie-parser`。 
```typescript
import * as cookieParser from 'cookie-parser';

// 在 AppModule 的 imports 数组中添加
@Module({
  // ...
  imports: [
    // ...
  ],
  // ...
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes('*'); // 应用于所有的路由
  }
}
```
也可以在 main.ts 这样配置：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706427223587-769bab19-18c4-4e66-9738-889c57a1581d.png#averageHue=%23312e2b&clientId=ud97f356c-b6b9-4&from=paste&height=202&id=uead00cb0&originHeight=404&originWidth=1514&originalType=binary&ratio=2&rotation=0&showTitle=false&size=64929&status=done&style=none&taskId=u714d0791-e61a-43b5-b8b3-9b563686e75&title=&width=757)

3.  **设置读取 Cookie**：可以在控制器中使用 `@Res()` 装饰器来访问底层的 Response 对象，并设置 Cookie。 若要读取请求中的 Cookie，可以使用 `@Req()` 装饰器来获取请求对象，并从中读取 Cookie。 

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706427298132-8501e15c-95c7-44f3-bdfe-df65e8bf4be1.png#averageHue=%232d2c2b&clientId=ud97f356c-b6b9-4&from=paste&height=442&id=u28ddb4bf&originHeight=884&originWidth=2008&originalType=binary&ratio=2&rotation=0&showTitle=false&size=197472&status=done&style=none&taskId=u38587cbb-0287-4ad0-a8f5-81f258e53ed&title=&width=1004)

4. 访问测试

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706427320732-06940b32-e467-420c-86a0-b1bf5303041c.png#averageHue=%23f0f0f0&clientId=ud97f356c-b6b9-4&from=paste&height=93&id=ud9bd1f8f&originHeight=186&originWidth=660&originalType=binary&ratio=2&rotation=0&showTitle=false&size=17936&status=done&style=none&taskId=u042861d4-1870-4deb-ad9a-eeb78a3c3e5&title=&width=330)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706427334874-0d0b06e7-73ce-4d58-8d5e-ba5850a9b0e7.png#averageHue=%23e9e9e9&clientId=ud97f356c-b6b9-4&from=paste&height=92&id=ua2761f29&originHeight=184&originWidth=764&originalType=binary&ratio=2&rotation=0&showTitle=false&size=23263&status=done&style=none&taskId=u341cb18a-d1bc-4940-8ae0-f7c6c36d129&title=&width=382)

注意，当设置 Cookie 时，可以传递一个选项对象来指定 Cookie 的属性，比如 `expires`、`httpOnly`、`secure` 等，以增加安全性和控制 Cookie 的行为。<br />在生产环境中，建议设置 `httpOnly`（只允许服务器访问此 cookie） 和 `secure` （只会在 https 环境才会发送此 cookie 到服务器）选项，以减少 XSS 和 Cookie 拦截的风险。

## Nest 中 Cookie 参数
上面我们只设置了 httpOnly 选项：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706427683219-e0645f15-1d8a-449c-b8b5-e25e8ae2c363.png#averageHue=%23312e2b&clientId=ud97f356c-b6b9-4&from=paste&height=136&id=uaeac93bd&originHeight=272&originWidth=1106&originalType=binary&ratio=2&rotation=0&showTitle=false&size=54607&status=done&style=none&taskId=u53f9d1de-d56d-4d50-aee7-5551ab49aae&title=&width=553)<br />其实还有很多选项：<br />当使用 `response.cookie(name, value, [options])` 方法设置 Cookie 时，可以通过 `options` 对象来指定多种属性，以控制 Cookie 的行为。以下是一些常见的选项参数：

1.  `**maxAge**`：指定 Cookie 的最大存活时间（以毫秒为单位）。这会设置 Cookie 的 `Expires` 属性为当前时间加上 `maxAge` 的值。 
```typescript
{ maxAge: 1000 * 60 * 60 * 24 } // Cookie 将在 24 小时后过期
```

2.  `**expires**`：指定一个 `Date` 对象，即 Cookie 的到期时间。如果未设置或设置为 `0`，则创建一个会话 Cookie。 
```typescript
{ expires: new Date(Date.now() + 1000 * 60 * 60 * 24) } // 同样设置为 24 小时后过期
```

3.  `**httpOnly**`：设置为 `true` 时，Cookie 仅通过 HTTP(S) 协议传输，无法通过客户端脚本（如 JavaScript）访问。这有助于防止跨站脚本攻击（XSS）。 
```typescript
{ httpOnly: true }
```

4.  `**secure**`：设置为 `true` 时，Cookie 仅在 HTTPS 连接上发送。在开发环境中，通常设置为 `false`。 
```typescript
{ secure: true }
```

5.  `**domain**`：指定 Cookie 的域，只有来自该域的请求才会包含该 Cookie。 
```typescript
{ domain: 'example.com' }
```

6.  `**path**`：指定 Cookie 的路径，只有请求该路径或其子路径的请求才会包含该 Cookie。 
```typescript
{ path: '/' } // 对整个网站有效
```

7.  `**sameSite**`：这是一个用于防止 CSRF 攻击和用户追踪的安全性设置，它可以有以下值： 
   - `'strict'`：Cookie 仅在请求来自同一网站时发送。
   - `'lax'`：在一些第三方请求中发送，例如用户从另一个网站通过链接访问。
   - `'none'`：即使是在跨站请求中也会发送 Cookie，但此时必须设置 `secure` 为 `true`。
```typescript
{ sameSite: 'lax' }
```

8.  `**signed**`：如果设置为 `true`，Cookie 会被签名，这可以防止客户端篡改 Cookie 的值。为了使用签名功能，你需要设置一个签名密钥。 
```typescript
{ signed: true }
```
 这些选项可以根据应用需求进行组合使用，以确保 Cookie 的安全性和正确的行为。<br />例如，对于需要保护的 Cookie（如认证令牌），可能会同时设置 `httpOnly`、`secure`、`sameSite` 和 `maxAge` 或 `expires` 选项。<br />删除 Cookie 只需要设置 maxAge:0 选项即可。


## Nest 中 Cookie 加密
之前我们的 cookie 都是明文存储的，浏览器控制台可以看见：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706428258785-5dd0c73c-e4ee-43f8-bfff-2c920561d778.png#averageHue=%23f7f6f5&clientId=ud97f356c-b6b9-4&from=paste&height=337&id=ua783c3d7&originHeight=674&originWidth=2440&originalType=binary&ratio=2&rotation=0&showTitle=false&size=134434&status=done&style=none&taskId=u13d324dd-1559-4631-9eee-31b68134b68&title=&width=1220)<br />我们需要配置 cookie 加密：

1. 配置中间件的时候需要传参：

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706428078831-c15c59e9-382f-41ac-8573-861f53fb9b8a.png#averageHue=%23322e2b&clientId=ud97f356c-b6b9-4&from=paste&height=179&id=ud5834c00&originHeight=358&originWidth=1536&originalType=binary&ratio=2&rotation=0&showTitle=false&size=74251&status=done&style=none&taskId=u295a6515-6998-454d-822c-fd4f03f55e1&title=&width=768)

2. 设置 cookie 的时候配置 signed 属性：

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706428321264-832fac52-8b04-4b5c-9da0-ca30b901a123.png#averageHue=%23302d2b&clientId=ud97f356c-b6b9-4&from=paste&height=138&id=ub7982277&originHeight=276&originWidth=1406&originalType=binary&ratio=2&rotation=0&showTitle=false&size=58837&status=done&style=none&taskId=u0264e9c3-daae-4943-8873-049e8abc669&title=&width=703)<br />访问下页面重新设置 cookie：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706428347197-8eef8217-99a7-4499-9f94-280f9babd051.png#averageHue=%23ededed&clientId=ud97f356c-b6b9-4&from=paste&height=77&id=ucba5bd10&originHeight=154&originWidth=660&originalType=binary&ratio=2&rotation=0&showTitle=false&size=17228&status=done&style=none&taskId=u8ae31502-cff2-4bb1-8217-0c60e380223&title=&width=330)<br />存储后的值已经变成加密后的了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706428373092-0580e866-3524-4594-86e0-75632f47d6a1.png#averageHue=%23f2f5f9&clientId=ud97f356c-b6b9-4&from=paste&height=199&id=ub5e770e5&originHeight=398&originWidth=2038&originalType=binary&ratio=2&rotation=0&showTitle=false&size=60239&status=done&style=none&taskId=u85aa627a-a40c-4576-a22f-1a4a2cf9078&title=&width=1019)<br />注意现在代码里面获取 cookie 要这样写：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706428462821-5f174d15-4598-4bdd-b6cc-1173b733d5ea.png#averageHue=%232f2d2c&clientId=ud97f356c-b6b9-4&from=paste&height=132&id=u5d39268f&originHeight=264&originWidth=1728&originalType=binary&ratio=2&rotation=0&showTitle=false&size=72993&status=done&style=none&taskId=ua7d5034c-38c2-4929-b269-d3490adeb96&title=&width=864)<br />访问下页面：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706428475187-8c6b146c-4447-4174-a9d0-260f65ec3dc9.png#averageHue=%23e4e4e4&clientId=ud97f356c-b6b9-4&from=paste&height=78&id=uf53d17aa&originHeight=156&originWidth=760&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22813&status=done&style=none&taskId=u3cde9262-5048-4af9-aca0-9d82adf2a74&title=&width=380)<br />成功获取到了我们设置的值。

最后我们也可以使用 cookie-session 或者 express-session 等第三方包配合 cookie-parser 来创建加密的 cookie。
