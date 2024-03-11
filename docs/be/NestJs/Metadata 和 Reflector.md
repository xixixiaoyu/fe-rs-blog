## 元数据（Metadata）
Nest 依赖注入核心 api： Reflect 的 metadata （草案阶段）：
```typescript
// 定义元数据，没有指定属性键，因此应用于整个目标对象
Reflect.defineMetadata(metadataKey, metadataValue, target);

// 定义元数据，指定了属性键，因此只应用于目标对象的特定属性
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);

// 检索元数据，没有指定属性键，因此从整个目标对象中检索
let result = Reflect.getMetadata(metadataKey, target);

// 检索元数据，指定了属性键，因此从目标对象的特定属性中检索
let result = Reflect.getMetadata(metadataKey, target, propertyKey);
```
Reflect.defineMetadata 和 Reflect.getMetadata 分别用于设置和获取某个类的元数据，如果最后传入了 propertyKey 属性名（可选），还可以单独为某个属性设置元数据。<br />如果给类或者类的静态属性添加元数据，那就保存在类上。<br />如果给实例属性添加元数据，那就保存在对象上，用类似 [[metadata]] 的 key 来存的。

要使用这个特性，首先安装 reflect-metadata 库：
```bash
npm install reflect-metadata
```
`tsconfig.json` 文件这样设置：
```json
{
  "compilerOptions": {
    "target": "es2016", // 指定 ECMAScript 目标版本：这里是 ES2016，也就是 ES7。这意味着 TypeScript 会将代码编译成符合 ES2016 标准的 JavaScript。
    "module": "commonjs", // 指定生成哪种模块系统代码。这里是 CommonJS，适用于 Node.js 环境或者早期的 JavaScript 模块加载方案。
    "experimentalDecorators": true, // 启用实验性的装饰器特性。装饰器是一种特殊类型的声明，它能够被附加到类声明、方法、访问符、属性或参数上。装饰器使用 `@expression` 形式，`expression` 求值后必须为一个函数，它会在运行时被调用。
    "emitDecoratorMetadata": true, // 启用后，编译器会为装饰器提供源代码中类型的元数据支持。这通常用于反射机制的实现，比如在 Angular 的依赖注入中。
    "esModuleInterop": true // 启用模块的 ES6 互操作性，允许默认导入从没有使用默认导出的模块。
  }
}
```
再安装 typescript：
```bash
npm install typescript -g
```
安装插件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707713866453-7474b4b7-4782-476f-b81f-94dcd18ee23b.png#averageHue=%23414344&clientId=u6d567915-7ef9-4&from=paste&height=72&id=u16a91df9&originHeight=144&originWidth=762&originalType=binary&ratio=2&rotation=0&showTitle=false&size=21128&status=done&style=none&taskId=udf660ef3-c0af-4611-aade-73d9cb73046&title=&width=381)<br />运行代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707713892485-24c3e598-c515-4441-b636-b7d7eba1c7ae.png#averageHue=%23979997&clientId=u6d567915-7ef9-4&from=paste&height=258&id=u9e26bb8d&originHeight=516&originWidth=1094&originalType=binary&ratio=2&rotation=0&showTitle=false&size=91817&status=done&style=none&taskId=u6c2dd363-33fe-45e1-93a5-b1220a91ab3&title=&width=547)<br />代码中这样使用：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707713391668-6c6ee3c4-6d3d-47d3-9dd1-c080079aac2c.png#averageHue=%232e2d2c&clientId=u6d567915-7ef9-4&from=paste&height=602&id=u8881d0ea&originHeight=1606&originWidth=1584&originalType=binary&ratio=2&rotation=0&showTitle=false&size=269785&status=done&style=none&taskId=u4e73eeb8-5084-462f-a9e1-a2b91d7fa5a&title=&width=594)<br />Reflect.metadata 装饰器当然也可以再封装一层：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707714232594-296b025d-2387-4e21-91c6-1d7c0052cc1e.png#averageHue=%23322f2c&clientId=u6d567915-7ef9-4&from=paste&height=235&id=u0012526d&originHeight=470&originWidth=1128&originalType=binary&ratio=2&rotation=0&showTitle=false&size=83742&status=done&style=none&taskId=u6ae3a811-af08-4993-ba82-9bca86171d6&title=&width=564)<br />这样使用：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707714248465-8d258821-7ec4-40dd-992e-a97c70ad7e37.png#averageHue=%232d2c2b&clientId=u6d567915-7ef9-4&from=paste&height=575&id=uc53c2f93&originHeight=1150&originWidth=1536&originalType=binary&ratio=2&rotation=0&showTitle=false&size=139032&status=done&style=none&taskId=ud84246bd-bdf6-4b11-af84-70180baad74&title=&width=768)

@Module 装饰器的实现，就调用了 Reflect.defineMetadata 来给这个类添加了一些元数据：
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
后面创建 IOC 容器的时候就会取出这些元数据来处理。

Nest 的实现原理就是通过装饰器给 class 或者对象添加元数据，然后初始化的时候取出这些元数据，进行依赖分析，创建对应的实例对象就可以了。<br />所以说，nest 实现的核心就是 Reflect metadata，但是目前这个 api 还处于草案阶段，需要使用 reflect-metadata 这个 polyfill 包才行。

还有疑问，依赖的扫描可以通过 metadata 数据，但是创建的对象需要知道构造器的参数，现在并没有添加这部分 metadata 数据。<br />比如这个 CatsController 依赖了 CatsService，但是并没有添加 metadata：
```typescript
import { Injectable, Controller } from '@nestjs/common';
import { CatsService } from './cats.service';

@Injectable()
class CatsService {
  // CatsService 的实现...
}

@Controller('cats')
class CatsController {
  constructor(private catsService: CatsService) {}

  // CatsController 的实现...
}
```
这其实是 TS 支持编译时自动添加一些 metadata 数据（`tsconfig.json` 开启 **emitDecoratorMetadata **选项）。<br />比如下面代码：
```typescript
@Controller('cats')
class CatsController {
  constructor(private catsService: CatsService) {}

  // CatsController 的实现...
}
```
编译后的 JavaScript 代码可能会看起来像这样：
```typescript
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    // 简化的装饰器应用逻辑
};
var __metadata = (this && this.__metadata) || function (k, v) {
    // 简化的元数据应用逻辑
};
require("reflect-metadata");
var decorators_1 = require("./decorators");
var cats_service_1 = require("./cats.service");

let CatsController = class CatsController {
    constructor(catsService) {
        this.catsService = catsService;
    }
};
CatsController = __decorate([
    decorators_1.Controller('cats'),
    __metadata("design:paramtypes", [cats_service_1.CatsService])
], CatsController);
```
关键点在于 _`_metadata("design:paramtypes", [cats_service_1.CatsService])` 这一行，它使用了 `__metadata` 函数来定义了 `CatsController` 构造函数的参数类型。<br />创建对象的时候可以通过 `design:paramtypes` 拿到构造器参数的类型了，这样就能正确的注入依赖了。

如果装饰的是一个方法。<br />编译后会看到多了三个元数据：

- design:type 是 Function：描述装饰目标的元数据是函数
- design:paramtypes 是 [Number]：参数的类型
- design:returntype 是 String：返回值的类型

这就是 nest 的核心实现原理：

- **通过装饰器给 class 或者对象添加 metadata，并且开启 ts 的 emitDecoratorMetadata 来自动添加类型相关的 metadata，然后运行的时候通过这些元数据来实现依赖的扫描，对象的创建等等功能。**

Nest 的装饰器都是依赖 reflect-metadata 实现的。<br />而且还提供了一个 @SetMetadata 的装饰器让我们可以给 class、method 添加一些 metadata。这个装饰器的底层实现自然是 Reflect.defineMetadata。

## @SetMetadata 搭配 reflector
新建个项目：
```typescript
nest new metadata-and-reflector -p npm
```
创建 guard 和 interceptor：
```bash
nest g interceptor aaa --flat --no-spec
nest g guard aaa --flat --no-spec
```
使用 guard 和 interceptor，并用 @SetMetadata 加个 metadata：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686991895767-4f90af46-77c5-4f06-ba0d-f1b7cb7b8d59.png#averageHue=%23312e2c&clientId=u5986a466-62a9-4&from=paste&height=318&id=ue5e68d10&originHeight=636&originWidth=1248&originalType=binary&ratio=2&rotation=0&showTitle=false&size=100554&status=done&style=none&taskId=ue2253008-0123-4ee7-9074-83ced8c39f6&title=&width=624)<br />通过 reflector.get 取出 handler 上的 metadata，guard 使用：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686991971891-ded99e0e-7332-419c-8cc4-4460c1c7d208.png#averageHue=%23302d2b&clientId=u5986a466-62a9-4&from=paste&height=270&id=u11b17679&originHeight=584&originWidth=1654&originalType=binary&ratio=2&rotation=0&showTitle=false&size=99050&status=done&style=none&taskId=u868787ea-9cb5-471b-bb0c-a335dd17fb9&title=&width=764)<br />interceptor 里也是这样，这里换种属性注入方式：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686991995384-0259a8dc-daa0-4bda-87bf-fab534eefa9e.png#averageHue=%232e2d2b&clientId=u5986a466-62a9-4&from=paste&height=371&id=u2a510966&originHeight=802&originWidth=1664&originalType=binary&ratio=2&rotation=0&showTitle=false&size=116996&status=done&style=none&taskId=u53bd6800-9bf8-4d85-95fe-2633f6eaab3&title=&width=769)<br />刷新下页面，就可以看到已经拿到了 metadata：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686992074829-dd5d2c47-1cc2-4224-8128-1e5b9f6c1dac.png#averageHue=%233a3a3a&clientId=u5986a466-62a9-4&from=paste&height=28&id=uea963168&originHeight=56&originWidth=332&originalType=binary&ratio=2&rotation=0&showTitle=false&size=6727&status=done&style=none&taskId=ufb313dcf-6bba-4e97-94fb-80d8c054789&title=&width=166)<br />我们拿到 metadata 后可以判断权限，比如这个路由需要 admin 角色，取出 request 的 user 对象，看看它有没有这个角色，有才放行。<br />除了能拿到 handler 上的装饰器，也可以拿到 class 上的：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686993048943-5bd8c255-4f10-43c6-9add-b0bb412658d3.png#averageHue=%23332f2b&clientId=u5986a466-62a9-4&from=paste&height=316&id=uaac6ed88&originHeight=632&originWidth=1248&originalType=binary&ratio=2&rotation=0&showTitle=false&size=101237&status=done&style=none&taskId=uc9547d52-1a96-417a-90c9-18f8fc83764&title=&width=624)	<br />获取：
```typescript
console.log('Interceptor', this.reflector.get('roles', context.getClass()));
```

reflector 还有 3 个方法：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686993123853-642a3ddd-3dab-48e6-a98e-90d7e5984b57.png#averageHue=%232b3137&clientId=u5986a466-62a9-4&from=paste&height=144&id=ue06424b5&originHeight=288&originWidth=1216&originalType=binary&ratio=2&rotation=0&showTitle=false&size=38021&status=done&style=none&taskId=u57d0df31-8361-4927-8402-1da4b7cfb1f&title=&width=608)<br />get 的实现就是 Reflect.getMetadata。<br />getAll 是返回一个 metadata 的数组。<br />getAllAndMerge，会把它们合并为一个对象或者数组。<br />getAllAndOverride 会返回第一个非空的 metadata。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686994261405-2fe8b703-d26f-45bd-8f4e-4625d14de452.png#averageHue=%23312f2c&clientId=u5986a466-62a9-4&from=paste&height=346&id=u205e0c3d&originHeight=692&originWidth=1244&originalType=binary&ratio=2&rotation=0&showTitle=false&size=112810&status=done&style=none&taskId=u90a60a42-5e04-4d77-811b-31f793d0c31&title=&width=622)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686994355680-93da6878-aa50-4efa-a00e-33190503c990.png#averageHue=%232e2d2c&clientId=u5986a466-62a9-4&from=paste&height=474&id=ub52809aa&originHeight=1232&originWidth=1528&originalType=binary&ratio=2&rotation=0&showTitle=false&size=160540&status=done&style=none&taskId=ub62331c2-01b7-40a4-9615-a63ee426c37&title=&width=588)
