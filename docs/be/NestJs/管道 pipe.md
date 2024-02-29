## 管道简介
Nest.js 的管道（Pipes）用于处理输入数据的转换和验证。可以执行以下任务：

1. **验证（Validation）**：确保传入请求的数据符合某些标准，如果数据无效，则可以抛出异常。
2. **转换（Transformation）**：将输入数据转换成期望的形式，例如从字符串转换成整数，或者从用户输入的日期字符串转换为 Date 对象。

管道有两种类型：

1. **内置管道**：Nest.js 提供了一些内置的管道，例如 `ValidationPipe`、`ParseIntPipe` 等。
2. **自定义管道**：用户可以创建自定义管道来满足特定的需求。

我们先来介绍内置管道。

## 内置管道
Nest 内置的 Pipe：

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe
- ParseEnumPipe
- ParseFloatPipe
- ParseFilePipe

创建项目：
```bash
nest new pipe-test -p npm
```

### ParseIntPipe
`ParseIntPipe` 转换参数为整数，无法转换或者转换后不是整数则抛出异常：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708918504892-c5cb3b85-ea05-448e-909d-b4d995b2d3f7.png#averageHue=%23322e2a&clientId=u0d25575b-0cee-4&from=paste&height=118&id=uef3cfa00&originHeight=147&originWidth=733&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=17691&status=done&style=none&taskId=u524c9f40-1175-411b-914b-4610bc8cc15&title=&width=586.4)<br />访问页面可以看出 age 是字符串，因为字符串 + 数字才会拼接：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708918554850-37a0d8f6-bb44-4491-b5fe-ba7fcfb2f09a.png#averageHue=%23e6e5e5&clientId=u0d25575b-0cee-4&from=paste&height=146&id=u002c0ce2&originHeight=182&originWidth=215&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=6090&status=done&style=none&taskId=udf491101-a9a4-44d9-8a8e-fab67a1d6a3&title=&width=172)<br />我们使用 `ParseIntPipe` ：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708918629100-73c4b44f-5bf7-4b98-ad59-07f0d1236c31.png#averageHue=%23312e2c&clientId=u0d25575b-0cee-4&from=paste&height=125&id=u5566231d&originHeight=156&originWidth=962&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=22441&status=done&style=none&taskId=u255ca957-92ec-4c3b-901b-15aae724b10&title=&width=769.6)<br />正确相加：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708918647386-e2d1870d-e7be-4681-8692-8fc7b5597608.png#averageHue=%23ededec&clientId=u0d25575b-0cee-4&from=paste&height=147&id=u9caf2d24&originHeight=184&originWidth=169&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=4626&status=done&style=none&taskId=uaeac825f-ea79-44eb-9d93-ba3f64b7ae3&title=&width=135.2)


传递一个无法转换整数的会报错：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708918705736-c57ad3ea-101c-4cf4-82db-27f44eb707fe.png#averageHue=%23fdfbfa&clientId=u0d25575b-0cee-4&from=paste&height=144&id=u12bda9a0&originHeight=180&originWidth=909&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=19345&status=done&style=none&taskId=ue66533c9-b704-457a-b217-7d2ad2ba14d&title=&width=727.2)<br />我们还可以自定义错误：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708918848499-b8a0a659-60d7-45d3-aca6-e04c0e681091.png#averageHue=%232f2d2b&clientId=u0d25575b-0cee-4&from=paste&height=211&id=u780bd7e1&originHeight=264&originWidth=779&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=19491&status=done&style=none&taskId=u251ebc96-e5de-472e-b748-ef5fdd54d06&title=&width=623.2)<br />重新访问：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708918875294-192162c6-fa97-4a3f-b5cf-9f4712317a2c.png#averageHue=%23fdfbfa&clientId=u0d25575b-0cee-4&from=paste&height=145&id=u441bb366&originHeight=181&originWidth=913&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=19742&status=done&style=none&taskId=uaa4cf608-e1dc-4c38-a168-461c5f5342b&title=&width=730.4)<br />这里也可以通过 exceptionFactory 选项自定义异常工厂函数，抛出异常，让异常过滤器自己处理。


### ParseFloatPipe
`ParseFloatPipe` 是将参数转换为浮点数：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708919184905-ab6878a2-09d3-46c5-a605-a88455700858.png#averageHue=%23302e2c&clientId=u0d25575b-0cee-4&from=paste&height=106&id=ue9a8124e&originHeight=133&originWidth=1029&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=20793&status=done&style=none&taskId=ufffb77b2-0d0b-4322-9f98-d55431c31f9&title=&width=823.2)<br />访问下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708919240322-45205f22-de9c-4605-a126-dcd6f553f25a.png#averageHue=%23faf9f8&clientId=u0d25575b-0cee-4&from=paste&height=76&id=ub4ef80c3&originHeight=95&originWidth=269&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=3334&status=done&style=none&taskId=u2be7461c-25e8-4b6f-8f4f-5e6cc89b6e6&title=&width=215.2)<br />同样支持  new ParseFloatPipe 的形式，可传入 errorHttpStatusCode 和 exceptionFactory 选项自定义错误。


### ParseBoolPipe
`ParseBoolPipe` 用于将输入的字符串转换为布尔值。如果输入的值无法转换为布尔值，则会抛出异常。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708932264846-b7476564-2b10-4953-b4b4-e155cd280de6.png#averageHue=%23312e2c&clientId=u0d25575b-0cee-4&from=paste&height=103&id=u3873cd63&originHeight=129&originWidth=966&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=21126&status=done&style=none&taskId=u52b745ff-dc42-4e06-8603-7cc98d9b044&title=&width=772.8)

### ParseEnumPipe
`ParseEnumPipe` 用于确保输入的值是特定枚举中的一个有效值。如果输入的值不在枚举中，则会抛出异常。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708932976521-09ff7aee-d859-4fe5-8e96-3e611c90d3be.png#averageHue=%232e2d2b&clientId=u0d25575b-0cee-4&from=paste&height=424&id=uc6efe9f9&originHeight=530&originWidth=851&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=52685&status=done&style=none&taskId=ud4b92124-6afb-4cc1-bb16-517caa8b94a&title=&width=680.8)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708933000007-bc378202-e39c-40af-825b-9dca745ba262.png#averageHue=%23f3f1f0&clientId=u0d25575b-0cee-4&from=paste&height=98&id=u28a0b720&originHeight=122&originWidth=262&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=4583&status=done&style=none&taskId=u544003ff-fae8-4b92-aaa8-7fb8c8a27cd&title=&width=209.6)<br />如果 role 的值不是 admin 或 user，则会抛出 BadRequestException。<br />也同样可以通过 errorHttpStatusCode 和 exceptionFactory 来自定义错误。

### ParseUUIDPipe
ParseUUIDPipe 用于验证输入的字符串是否是有效的 UUID（通用唯一标识符）。如果不是有效的 UUID，则会抛出异常。<br />我们用 uuid 包可以生成 uuid：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687082116898-e8838786-5a3c-4aaf-a66f-806db4ec5a98.png#averageHue=%236a7f50&clientId=u413477c3-c385-4&from=paste&height=203&id=uaa1c4b60&originHeight=406&originWidth=1168&originalType=binary&ratio=2&rotation=0&showTitle=false&size=57632&status=done&style=none&taskId=u97781338-50d8-40b5-86b9-8a5e6f14750&title=&width=584)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708933172594-7eb03c63-78fc-40ed-a39d-1eac2d24710c.png#averageHue=%23322f2c&clientId=u0d25575b-0cee-4&from=paste&height=108&id=uba7b2a11&originHeight=135&originWidth=798&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=17511&status=done&style=none&taskId=u4c0adeaf-a761-4104-a596-f5bff026a73&title=&width=638.4)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708933876802-35492d6b-28ca-4049-8f33-d13c5a09bb90.png#averageHue=%23f0edeb&clientId=u0d25575b-0cee-4&from=paste&height=71&id=u39b3425c&originHeight=89&originWidth=577&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=11793&status=done&style=none&taskId=u4d591941-aa42-4480-b7bd-61f60f0f547&title=&width=461.6)

### DefaultValuePipe
DefaultValuePipe 用于为参数提供一个默认值：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708934065988-a2ee5b50-5327-45cb-846b-dfcc4c087ff9.png#averageHue=%23322f2d&clientId=u0d25575b-0cee-4&from=paste&height=158&id=uabfbeea8&originHeight=198&originWidth=846&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=36772&status=done&style=none&taskId=u8994affb-51ac-4bbb-8920-1daecd9927f&title=&width=676.8)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708934099936-90b6fd8b-8b8d-404b-8c29-b178aef72ca8.png#averageHue=%23faf9f8&clientId=u0d25575b-0cee-4&from=paste&height=85&id=uc73ba75f&originHeight=106&originWidth=110&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=1398&status=done&style=none&taskId=u33cc4061-d129-4a94-9c42-281d6c8b4f2&title=&width=88)

### ParseArrayPipe
用于将客户端发送的字符串数组解析为实际的数组类型：<br />先安装 class-validator 包，这是可以用装饰器和非装饰器两种方式对 class 属性做验证的库。<br />再安装 class-transformer 包，它是把普通对象转换为对应的 class 实例的包。
```bash
npm install class-validator class-transformer -D
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708934607458-14e8bff0-9616-4ce7-8b4e-57cdd30a17d6.png#averageHue=%232e2d2c&clientId=u0d25575b-0cee-4&from=paste&height=210&id=ubf1be92f&originHeight=262&originWidth=943&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=33264&status=done&style=none&taskId=u3a98be58-9d63-43e6-ba74-40e9b0b08d6&title=&width=754.4)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708934568422-93cf58c2-e5d1-40c1-ad7b-5da59d103191.png#averageHue=%23fcfbfb&clientId=u0d25575b-0cee-4&from=paste&height=134&id=u7c6ef550&originHeight=167&originWidth=170&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=4145&status=done&style=none&taskId=u9930028b-d59b-41d4-9e53-dc9d94e7ed8&title=&width=136)<br />还剩下 ValidationPipe 和 ParseFilePipe，之后再讲。


## 使用管道的 4 种方式
管道不仅支持对某个参数级别生效，也能对整个 Controller 、方法、全局都生效。
```typescript
// 参数级别的 Pipes
@Get(':id')
getUserById(@Param('id', ParseIntPipe) id: number) {
  // ...
}

// Controller 生效
@Controller('users')
@UsePipes(ValidationPipe)
export class UsersController {
  // ...
}

// 方法级别的 Pipes
@Controller('users')
export class UsersController {
  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    // ...
  }
}

// 全局 Pipes
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './pipes/validation.pipe';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```


## 创建自定义管道
创建自定义管道，需要实现 `PipeTransform` 接口，并定义 `transform` 方法。<br />下面管道，它将输入字符串转换为整数：
```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```
使用这个自定义管道：
```typescript
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ParseIntPipe } from './parse-int.pipe';

@Controller('numbers')
export class NumbersController {
  @Get()
  @UsePipes(ParseIntPipe)
  async getNumber(@Query('num') num: number): Promise<number> {
    // num 参数已经被 ParseIntPipe 转换为整数
    return num;
  }
}
```
当客户端发起请求并传递 `num` 查询参数时，`ParseIntPipe` 会自动将 `num` 转换为整数类型，然后传递给 `getNumber` 方法。
