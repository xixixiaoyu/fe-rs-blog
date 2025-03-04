### 什么是 MVC？为什么要用它？

MVC 是一种经典的设计模式，分成三个部分：

- **模型（Model）**：负责数据的管理和业务逻辑。
- **视图（View）**：展示数据给用户，通常就是 HTML 页面。
- **控制器（Controller）**：连接模型和视图，处理用户请求。

用 Nest.js 实现 MVC 的好处在于，它天生支持模块化，能让代码结构更清晰，维护起来也更轻松。





### 第一步：搭建一个 Nest 项目

要开始，咱们得先装个脚手架工具。打开终端，敲下这两行命令：

```bash
$ npm i -g @nestjs/cli
$ nest new project
```

第一行是全局安装 Nest 的 CLI，第二行会生成一个名叫 "project" 的新项目。跟着提示选个包管理器（比如 npm），几秒钟后你就有了一个基本的 Nest 应用。



### 第二步：引入模板引擎

MVC 的 "视图" 部分需要动态生成 HTML，所以咱们得装个模板引擎。

这里我选了 Handlebars（简称 hbs），因为它简单好用。当然，你也可以换成 Pug 或者 EJS。安装命令如下：

```bash
$ npm install --save hbs
```

装好后，先改一下 main.ts 文件：

```ts
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('hbs')

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

这段代码做了三件事：

1. 指定 public 文件夹放静态资源，比如 CSS 或图片。
2. 指定 views 文件夹放模板文件。
3. 告诉 Nest 用 hbs 引擎来渲染视图。



### 第三步：写一个简单的视图

现在，在项目根目录下建个 views 文件夹，然后创建一个 index.hbs 文件，内容如下：

```handlebars
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>App</title>
  </head>
  <body>
    {{ message }}
  </body>
</html>
```

这里的 {{ message }} 是个占位符，后面会从控制器传数据过来替换它。



### 第四步：控制器传数据给视图

打开 app.controller.ts，改成这样：

```ts
import { Get, Controller, Render } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' }
  }
}
```

这里用 @Render('index') 指定渲染 index.hbs 模板，root() 方法返回的对象 { message: 'Hello world!' } 会传给模板，替换掉 {{ message }}。

启动项目（用 npm run start），然后浏览器访问 http://localhost:3000，你就会看到 "Hello world!"。



### 第五步：动态渲染视图

有时候，你可能不想固定用某个模板，而是根据情况动态选择。这时候可以用 @Res() 装饰器。改一下控制器试试：

```ts
import { Get, Controller, Res, Render } from '@nestjs/common'
import { Response } from 'express'

@Controller()
export class AppController {
  @Get()
  root(@Res() res: Response) {
    return res.render('index', { message: 'Hello world!' })
  }
}
```

这里直接用 Express 的 res.render() 方法，既能指定模板，又能传数据。

用 @Res() 的时候，Nest 会注入 Express 的响应对象，给你更多灵活性。想深入了解它的 API，可以看看 [Express 文档](https://expressjs.com/en/api.html#res.render)。



### 用 Fastify 替代 Express

```bash
$ npm i --save @fastify/static @fastify/view handlebars
```

然后改 main.ts：

```ts
import { NestFactory } from '@nestjs/core'
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/'
  })
  app.setViewEngine({
    engine: { handlebars: require('handlebars') },
    templates: join(__dirname, '..', 'views')
  })
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

控制器可以这样写：

```ts
import { Get, Controller, Render } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  @Render('index.hbs')
  root() {
    return { message: 'Hello world!' }
  }
}
```

注意两点：

1. 用 @Render() 时，Fastify 要求带上文件扩展名（比如 index.hbs）。
2. 配置视图的方式和 Express 有点差别，但逻辑是一样的。

运行项目后，访问 http://localhost:3000，效果跟 Express 时一样。



### 总结：MVC 的魅力

通过这几个步骤，咱们用 Nest.js 搭了个完整的 MVC 应用。从静态渲染到动态选择模板，再到切换 Fastify，整个过程是不是比想象中简单？

MVC 的核心在于分工明确：控制器处理逻辑，视图负责展示，模型管数据（虽然这次没深入模型部分，但你可以用 Nest 的服务和实体来实现）。