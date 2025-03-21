### OpenAPI 是什么？

OpenAPI 就是一套标准，用来描述你的 API 长啥样 —— 有哪些接口、参数怎么传、返回啥数据等等。它跟语言无关，不管你是用 JavaScript、Python 还是别的啥，都能用得上。

好处呢？一是方便团队协作，二是可以用工具生成文档，甚至还能自动生成客户端代码。

NestJS 里有个专门的 @nestjs/swagger 模块，基于 OpenAPI 规范，通过装饰器帮你把文档自动生成出来。



### 安装和初始化

打开终端，敲下面这行命令：

```bash
$ npm install --save @nestjs/swagger
```

装好后，咱们去 main.ts 里初始化一下。代码长这样：

```ts
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('猫咪 API')
    .setDescription('这是一个管理猫咪的 API')
    .setVersion('1.0')
    .addTag('cats')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(3000)
}
bootstrap()
```

这段代码干了啥呢？

1. 用 DocumentBuilder 设置了文档的基本信息，比如标题是“猫咪 API”，描述和版本也加上了，还给它打了个 cats 的标签。
2. SwaggerModule.createDocument 生成了一份 OpenAPI 文档。
3. SwaggerModule.setup 把文档挂到了 /api 路径下，启动后你就能在 http://localhost:3000/api 看到一个漂亮的 Swagger UI。

启动服务试试：

```bash
$ npm run start:dev
```

打开浏览器，访问 http://localhost:3000/api，是不是看到一个互动式的界面，列出了所有接口？这就成功了一半！



### 给 API 加点料

光有个空壳子还不够，咱们得让文档里显示具体的接口信息。比如说，你有个管理猫咪的控制器：

```ts
import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiProperty } from '@nestjs/swagger'

class CreateCatDto {
  @ApiProperty({ description: '猫咪名字' })
  name: string

  @ApiProperty({ description: '猫咪年龄' })
  age: number

  @ApiProperty({ description: '猫咪品种' })
  breed: string
}

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return '猫咪已创建！'
  }
}
```

这里用 @ApiProperty 给 DTO（数据传输对象）的每个字段加了描述，@ApiTags 给控制器加了个标签。重新跑一下服务，刷新页面，你会发现 /cats 下面多了个 POST 接口，点开还能看到 name、age、breed 的详细说明。是不是很直观？



### 优化体验

#### 下载 JSON 文件

想把文档保存成 JSON 文件？简单，在 setup 里加个配置：

```ts
SwaggerModule.setup('api', app, documentFactory, {
  jsonDocumentUrl: 'api/json'
})
```

现在访问 http://localhost:3000/api/json，就能下载一份完整的 OpenAPI JSON 文件，方便分享或者导入其他工具。

#### 自定义操作 ID

默认的操作 ID（operationId）可能会很长，比如 CatsController_create，看着不爽咋办？加个选项改改：

```ts
const options = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
}
const documentFactory = () => SwaggerModule.createDocument(app, config, options)
SwaggerModule.setup('api', app, documentFactory)
```

这样操作 ID 就简洁成 create 了，清爽多了。

#### 处理复杂类型

比如你有个接口返回猫咪数组咋办？用 @ApiProperty 指定类型：

```ts
@ApiProperty({ type: [CreateCatDto] })
cats: CreateCatDto[]
```

如果是枚举，比如猫咪的角色：

```ts
export enum CatRole {
  King = 'King',
  Worker = 'Worker'
}

@ApiProperty({ enum: CatRole })
role: CatRole
```

这些细节都能让文档更精确，别人用起来也更明白。



### 解决常见坑

#### CSP 冲突

如果用了 Fastify 和 Helmet，可能会遇到内容安全策略（CSP）的问题，导致 Swagger UI 加载失败。别慌，改一下配置：

```ts
import helmet from 'helmet'

app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
    }
  }
})
```

或者直接关掉 CSP：

```ts
app.register(helmet, { contentSecurityPolicy: false })
```

#### 循环依赖

如果 DTO 之间有循环引用，比如猫咪有个 parent 字段指向自己，用延迟函数搞定：

```ts
@ApiProperty({ type: () => CreateCatDto })
parent: CreateCatDto
```



### 高级玩法

#### 多文档支持

如果你的项目很大，分了好几个模块，可以为每个模块生成独立的文档。比如猫咪和狗狗分开：

```ts
const catConfig = new DocumentBuilder().setTitle('Cats API').build()
const catDocument = SwaggerModule.createDocument(app, catConfig, { include: [CatsModule] })
SwaggerModule.setup('api/cats', app, catDocument)
```

然后在主文档里加个下拉菜单：

```ts
SwaggerModule.setup('api', app, documentFactory, {
  explorer: true,
  swaggerOptions: {
    urls: [
      { url: 'api/json', name: '主 API' },
      { url: 'api/cats/json', name: '猫咪 API' }
    ]
  }
})
```

#### 安全认证

想加个登录验证？用 @ApiBearerAuth：

```ts
@ApiBearerAuth()
@Post('secure')
secureRoute() {
  return '这是一个安全接口'
}
```

然后在 DocumentBuilder 里配置：

```ts
const config = new DocumentBuilder()
  .addBearerAuth()
  .build()
```

Swagger UI 上就会多一个授权按钮，用户可以输入 Token 测试接口。



### 总结

用 NestJS 的 Swagger 模块，你不仅能快速生成 OpenAPI 文档，还能通过装饰器和配置，把每个细节都描述得清清楚楚。无论是简单的 CRUD 接口，还是复杂的多模块项目，它都能帮你省下大把时间。最重要的是，前端或者其他开发者拿到这份文档，马上就能上手调用，不用再追着你问“这个参数啥意思”。