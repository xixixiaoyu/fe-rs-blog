如果你的网站需要支持多种语言访问，那么就需要实现国际化功能。<br />这样，中文用户访问时看到的是中文界面，英文用户访问时看到的是英文界面。<br />不仅前端需要国际化，后端也需要国际化。否则，当英文用户使用英文界面登录时，突然遇到一个“用户不存在”的错误提示，会感到非常困惑。<br />本文将介绍如何在 Nest 框架中实现国际化功能。

## 初始化项目
首先，创建一个新的 Nest 项目：
```bash
nest new nest-i18n-test -p pnpm
```
安装 nestjs-i18n 包：
```bash
pnpm install nestjs-i18n
```
## 配置 I18nModule：
在 AppModule 中引入 I18nModule：
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  // 导入模块
  imports: [
    // 配置国际化模块
    I18nModule.forRoot({
      // 设置默认语言为英语
      fallbackLanguage: 'en',
      // 加载器选项
      loaderOptions: {
        // 指定国际化文件路径
        path: path.join(__dirname, '/i18n/'),
        // 监视文件变化
        watch: true,
      },
      // 配置解析器，支持通过查询参数 'lang' 或 'l' 来指定语言
      resolvers: [new QueryResolver(['lang', 'l'])],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 添加国际化资源包
在 src 目录创建 i18n 目录，然后创建语言资源文件：<br />i18n/en/test.json：
```json
{
  "hello": "Hello World"
}
```
i18n/zh/test.json：
```json
{
  "hello": "你好世界"
}
```
同时，在 nest-cli.json 中配置资源文件的自动复制：
```json
"assets": [
  { "include": "i18n/**/*", "watchAssets": true }
]
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718003545956-8261c3cd-e32b-4758-b2a5-d8f442b719c6.png#averageHue=%23282524&clientId=uecccb8c6-542d-4&from=paste&height=237&id=u3b703024&originHeight=426&originWidth=1234&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=65249&status=done&style=none&taskId=u81e4858a-24bf-45d2-b388-43d098b9fc0&title=&width=685.5555737165762)

## 修改 AppService 以使用国际化
```typescript
import { Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  @Inject()
  private readonly i18n: I18nService;

  getHello(): string {
    return this.i18n.t('test.hello', { lang: I18nContext.current().lang });
  }
}
```
I18nService 从资源文件中获取 test.hello 的值，使用当前语言。

## 运行项目
```bash
pnpm run start:dev
```
在浏览器中访问，可以看到界面根据语言环境自动切换：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718003570791-9b324f74-d06e-4975-97e0-5e7097f1d8fc.png#averageHue=%23aeafb1&clientId=uecccb8c6-542d-4&from=paste&height=82&id=ue58920c5&originHeight=148&originWidth=622&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=13489&status=done&style=none&taskId=u2ff1a90a-b6e0-4b69-917a-ae8ede2a851&title=&width=345.55556470965183)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718003597245-253b0992-500d-428d-8f27-2e68bb525fc7.png#averageHue=%23a7a7aa&clientId=uecccb8c6-542d-4&from=paste&height=78&id=uc158fdb1&originHeight=140&originWidth=594&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=13041&status=done&style=none&taskId=uf78f0ed6-fa68-4fe3-955f-ddd72ebe924&title=&width=330.0000087420148)

## 使用其他语言解析器
除了 QueryResolver，还可以使用其他解析器，<br />例如根据自定义 header、cookie 或 accept-language 头来解析语言：
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    // 配置国际化模块
    I18nModule.forRoot({
      // 设置默认语言为英语
      fallbackLanguage: 'en',
      // 配置语言文件加载选项
      loaderOptions: {
        // 设置语言文件的路径
        path: path.join(__dirname, '/i18n/'),
        // 启用文件监视，自动重载语言文件
        watch: true,
      },
      // 配置语言解析器
      resolvers: [
        // 解析 URL 查询参数中的语言设置，支持 "lang" 和 "l" 参数
        new QueryResolver(['lang', 'l']),
        // 解析 HTTP 头部中的自定义语言设置，支持 "x-custom-lang" 头部
        new HeaderResolver(['x-custom-lang']),
        // 解析 Cookie 中的语言设置，支持 "lang" Cookie
        new CookieResolver(['lang']),
        // 解析请求头中的 Accept-Language 设置
        AcceptLanguageResolver,
      ],
    }),
  ],
  // 设置控制器
  controllers: [AppController],
  // 设置服务提供者
  providers: [AppService],
})
export class AppModule {}
```
可以在 Postman 中测试 cookie 解析器，通过添加 cookie 来切换语言：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718004870297-00fd1868-4068-4577-8f4c-ab7ac5cce501.png#averageHue=%23fafafa&clientId=uecccb8c6-542d-4&from=paste&height=207&id=ue63c5fb9&originHeight=372&originWidth=2170&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=66576&status=done&style=none&taskId=uaa90b6c4-844b-4d02-b1fc-c450c573dec&title=&width=1205.5555874918723)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718004902526-6ceb453b-e572-493a-9075-6c89acba891d.png#averageHue=%23fdfcfc&clientId=uecccb8c6-542d-4&from=paste&height=534&id=uaac3ebb3&originHeight=962&originWidth=1660&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=48824&status=done&style=none&taskId=ua0a19a10-eb75-4e89-82ae-6e71cb2a360&title=&width=922.2222466527686)<br />加一个 lang=zh：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718004965038-1cedf052-2ba8-425a-aacb-b515703bb753.png#averageHue=%23f4f3f3&clientId=uecccb8c6-542d-4&from=paste&height=390&id=u4d4d8252&originHeight=702&originWidth=1548&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=53589&status=done&style=none&taskId=u37db3b02-ed11-41b5-b94f-d951c79b365&title=&width=860.0000227822204)<br />返回就变成中文了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718004979565-80ca57ff-4342-428e-9463-bf8b1cc36c2b.png#averageHue=%23f5f5f5&clientId=uecccb8c6-542d-4&from=paste&height=208&id=ud4e46e5e&originHeight=374&originWidth=504&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=34548&status=done&style=none&taskId=u575a1e7b-975a-4157-9cb5-08d5ad7d4f6&title=&width=280.0000074174671)

## 在 DTO 中使用国际化
由于 DTO 不在 IoC 容器中，无法直接注入 I18nService。可以使用 I18nValidationPipe 来实现国际化验证消息。
### 安装验证相关的包
```bash
pnpm install class-validator class-transformer
```

### 修改 CreateUserDto 以使用国际化验证消息
加一个模块：
```bash
nest g resource user
```
```typescript
import { IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({
    message: "validate.usernameNotEmpty"
  })
  username: string;
  
  @IsNotEmpty({
    message: 'validate.passwordNotEmpty'
  })
  @MinLength(6, {
    message: 'validate.passwordNotLessThan6'
  })
  password: string;                    
}
```

### 全局启用 I18nValidationPipe
在 main.ts 中配置：
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  // 创建 Nest 应用实例
  const app = await NestFactory.create(AppModule);

  // 使用全局验证管道，进行国际化验证
  app.useGlobalPipes(new I18nValidationPipe());

  // 使用全局异常过滤器，处理国际化验证异常
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false, // 设置是否显示详细错误信息
    }),
  );

  // 启动应用，监听 3000 端口
  await app.listen(3000);
}

// 调用 bootstrap 函数启动应用
bootstrap();
```

### 添加验证资源包
i18n/zh/validate.json：
```json
{
  "usernameNotEmpty": "用户名不能为空",
  "passwordNotEmpty": "密码不能为空",
  "passwordNotLessThan6": "密码不能少于 6 位"
}
```
i18n/en/validate.json：
```json
{
  "usernameNotEmpty": "The username cannot be empty",
  "passwordNotEmpty": "Password cannot be empty",
  "passwordNotLessThan6": "The password cannot be less than 6 characters"
}
```

### 测试
通过上述配置，可以实现根据语言环境返回不同的验证消息：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718005055285-6d282353-9054-4b2e-982f-ba79edeb6cf7.png#averageHue=%23fafafa&clientId=uecccb8c6-542d-4&from=paste&height=446&id=uebf78782&originHeight=802&originWidth=1210&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=98783&status=done&style=none&taskId=ua31b95dd-b092-41a9-b7c6-abba3f73abf&title=&width=672.2222400300301)<br />修改 cookie：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718005075706-b776c75b-fe70-4d00-a227-172e85a1a0d3.png#averageHue=%23f5f4f4&clientId=uecccb8c6-542d-4&from=paste&height=406&id=ue1e67db3&originHeight=730&originWidth=1554&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=53300&status=done&style=none&taskId=u6a7d076b-ac29-487c-b5de-02a178c67dd&title=&width=863.3333562038569)<br />报错信息为英文：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718005086630-2c46fc28-7f1f-478e-ae05-f754b80db5f7.png#averageHue=%23f9f9f9&clientId=uecccb8c6-542d-4&from=paste&height=356&id=u29846946&originHeight=800&originWidth=908&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=97370&status=done&style=none&taskId=u5b730799-0496-470e-a4d8-5995fde0f4f&title=&width=404.4444580078125)

### 使用占位符实现动态消息
可以在文案中使用占位符：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718005254486-d4ea9339-9b8c-4fb5-908d-548eee92106b.png#averageHue=%23282625&clientId=uecccb8c6-542d-4&from=paste&height=154&id=u2d357943&originHeight=278&originWidth=1050&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=56490&status=done&style=none&taskId=ud06775ae-fff5-4165-844f-68d2926d125&title=&width=583.3333487863898)<br />然后传入参数：
```typescript
@MinLength(6, {
  message: i18nValidationMessage("validate.passwordNotLessThan6", {
    len: 66
  })
})
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718005322106-2d2ef44a-bd75-4ecf-8c8d-71db0b0a8e86.png#averageHue=%23f8f7f7&clientId=uecccb8c6-542d-4&from=paste&height=442&id=u5e515419&originHeight=796&originWidth=566&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=79956&status=done&style=none&taskId=u61de429d-b321-4c97-a95a-4b2d9b446ce&title=&width=314.44445277437774)<br />在 I18nService 的 API 中同样支持占位符：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718005366917-ec75015b-e97a-4834-a81b-1a1e78474b77.png#averageHue=%23272625&clientId=uecccb8c6-542d-4&from=paste&height=102&id=uab02b442&originHeight=184&originWidth=618&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=19017&status=done&style=none&taskId=u2e952b33-5612-402d-aefd-e22194fb8ca&title=&width=343.33334242856085)
```typescript
import { Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  @Inject()
  private readonly i18n: I18nService;

  getHello(): string {
    return this.i18n.t('test.hello', {
      lang: I18nContext.current().lang,
      args: {
        name: '云牧',
      },
    });
  }
}
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1718005406389-6de2cff9-51b6-4074-b7a4-0c68c0ca2466.png#averageHue=%23f5f5f5&clientId=uecccb8c6-542d-4&from=paste&height=293&id=u9ded9d94&originHeight=528&originWidth=500&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=43312&status=done&style=none&taskId=u7827a7e7-fb92-4beb-88e4-7f9e2e54c25&title=&width=277.7777851363761)<br />通过这些配置，Nest 项目可以灵活支持多种语言，满足国际化需求。
