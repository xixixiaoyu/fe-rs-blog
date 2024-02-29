## 基本使用
Post 请求的数据是通过 `@Body` 装饰器来取，并且要有一个 dto class 来接收：<br />DTO（Data Transfer Object）数据传输对象，定义客户端发送到服务器的数据结构，通常在处理 HTTP 请求时使用。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687084653095-68e7663d-1821-40ff-8288-934cdb51a055.png#averageHue=%2332302e&clientId=uf3e02141-8b8a-4&from=paste&height=135&id=u18a3f1ef&originHeight=270&originWidth=1168&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61145&status=done&style=none&taskId=u2a73e196-2127-4336-bb81-28002b74bbd&title=&width=584)<br />使用 postman 发送 post 请求：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687084604078-24007f5f-4d0b-4145-9370-60d329fffeec.png#averageHue=%23f8f8f8&clientId=uf3e02141-8b8a-4&from=paste&height=235&id=u47d6bb74&originHeight=470&originWidth=1688&originalType=binary&ratio=2&rotation=0&showTitle=false&size=59041&status=done&style=none&taskId=u1bdd7629-7943-42d5-92ba-14fe7080ed4&title=&width=844)<br />点击 send，服务端就接收到数据了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687084697680-329f784d-8125-469d-8017-00479afd8b25.png#averageHue=%23363636&clientId=uf3e02141-8b8a-4&from=paste&height=18&id=u11b264ce&originHeight=36&originWidth=816&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7344&status=done&style=none&taskId=u390cb2bc-6a48-4700-b118-584f6abd490&title=&width=408)<br />如果 age 传一个浮点数，服务端也能正常接收：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687084765410-ee65ba59-8eac-4b9f-b233-ae7c36952476.png#averageHue=%23f1f1f1&clientId=uf3e02141-8b8a-4&from=paste&height=269&id=gjeWO&originHeight=538&originWidth=1692&originalType=binary&ratio=2&rotation=0&showTitle=false&size=71110&status=done&style=none&taskId=u0d811a2d-b89f-41d2-9114-987b2265f90&title=&width=846)<br />因为它也是 number。<br />如果想要更精细的数字验证，就需要 ValidationPipe。<br />它需要两个依赖包：
```bash
npm install class-validator class-transformer -D
```
dto里面用 `@IsInt` 装饰器标记整数：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687084972287-bef25607-9cb3-4025-9111-c422def28b9b.png#averageHue=%23312f2d&clientId=uf3e02141-8b8a-4&from=paste&height=266&id=ua2e94532&originHeight=532&originWidth=1290&originalType=binary&ratio=2&rotation=0&showTitle=false&size=88822&status=done&style=none&taskId=u90f35492-eeb1-4d63-baa5-9f56c87598d&title=&width=645)<br />再次请求，就会检查参数了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687085020957-7c6fc012-20e1-4709-a31b-ce60df73bb13.png#averageHue=%23fcfafa&clientId=uf3e02141-8b8a-4&from=paste&height=128&id=u753e109a&originHeight=256&originWidth=584&originalType=binary&ratio=2&rotation=0&showTitle=false&size=23046&status=done&style=none&taskId=ucffcb417-71cf-4f7a-b3ac-ce3daa5c22c&title=&width=292)

## ValidationPipe 实现原理
那它是怎么实现的呢？<br />[class-validator](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fclass-validator) 包允许使用装饰器来添加验证规则到类属性的库<br />而 [class-transformer](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fclass-transformer) 包允许通过装饰器将普通的 JavaScript 对象转换成类的实例的库。同时，它也支持将类的实例转换回普通的 JavaScript 对象。<br />这两者结合：

- **我们声明了参数的类型为 dto 类，pipe 里拿到这个类**
- **把参数对象通过 class-transformer 转换为 dto 类的对象，之后再用 class-validator 包来对这个对象做验证。**
```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MyValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }
    const object = plainToInstance(metatype, value);

    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('参数验证失败');
    }
    return value;
  }
}
```
先拿到 `metatype` 也就是 Ooo 类型。<br />通过 `plainToInstance` 把普通对象转换为 dto class 的实例对象。<br />调用  validate 对它做验证。如果验证不通过，就抛一个异常。

替换为我们自己实现的 MyValidationPipe 后请求下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687085615141-649b2ef2-ea5c-4982-8dcd-75b695810d45.png#averageHue=%235a5754&clientId=uc43074b6-f02d-4&from=paste&height=129&id=u81f26568&originHeight=258&originWidth=1612&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61767&status=done&style=none&taskId=u9b3bc080-616a-435d-b641-f9c7bfe7620&title=&width=806)<br />同样报错。

## pipe 注入依赖和全局 pipe
pipe 里也是可以注入依赖的：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687085865835-83dc39a3-6cc4-4909-b599-6762f648e2d8.png#averageHue=%23302e2b&clientId=uc43074b6-f02d-4&from=paste&height=227&id=ua7257ee6&originHeight=454&originWidth=1380&originalType=binary&ratio=2&rotation=0&showTitle=false&size=90511&status=done&style=none&taskId=ue8e990e3-a076-4f62-9f44-23c366fbff2&title=&width=690)<br />比如，我们指定 @Inject 注入，因为标记了 @Optional，没找到对应的 provider 也不会报错。

如果标记了 @Optional 就不能用 new 的方式了，直接指定 class，让 Nest 去创建对象放到 ioc 容器里。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687085974503-123bde60-a901-4395-ac24-b548198219c8.png#averageHue=%23332f2b&clientId=uc43074b6-f02d-4&from=paste&height=104&id=uc6cf01e3&originHeight=208&originWidth=968&originalType=binary&ratio=2&rotation=0&showTitle=false&size=32383&status=done&style=none&taskId=u289dca8b-c373-49f9-bad7-708bffee52e&title=&width=484)<br />当我们在 module 里添加了这个 provider ：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687086007516-8698908b-968e-498e-8a86-2d348c1efd66.png#averageHue=%232d2c2b&clientId=uc43074b6-f02d-4&from=paste&height=384&id=u15a713d7&originHeight=910&originWidth=804&originalType=binary&ratio=2&rotation=0&showTitle=false&size=72351&status=done&style=none&taskId=u75056c76-da43-4a5b-8995-2f1dde08475&title=&width=339)<br />这样就可以正常注入了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687086066440-1654ade7-06dc-475c-bf97-887cdfde4b84.png#averageHue=%233d3d3d&clientId=uc43074b6-f02d-4&from=paste&height=89&id=u50d50900&originHeight=178&originWidth=538&originalType=binary&ratio=2&rotation=0&showTitle=false&size=37678&status=done&style=none&taskId=u3807850e-4e04-4a31-ac72-edad46d297b&title=&width=269)

如果注册为全局的 pipe：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707732450787-a7cc76a8-0d47-43c7-bbec-1c9802dbd0c6.png#averageHue=%23d07114&clientId=u90adba7e-5260-4&from=paste&height=384&id=u11f9e602&originHeight=768&originWidth=910&originalType=binary&ratio=2&rotation=0&showTitle=false&size=124300&status=done&style=none&taskId=u959715ef-0733-43a6-8af3-d4c0a12e97a&title=&width=455)<br />其余的 filter、guard、interceptor 也可以通过这种方式声明为全局生效的。<br />此时方法里面去掉 ValidationPipe 依然会生效：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687086419957-f4819007-ff74-43cd-a1f5-e0ea5b389614.png#averageHue=%23fcfafa&clientId=uc43074b6-f02d-4&from=paste&height=124&id=u99423b55&originHeight=248&originWidth=588&originalType=binary&ratio=2&rotation=0&showTitle=false&size=23261&status=done&style=none&taskId=u4a67cbfb-0eff-434d-b2cc-87c96ad5c78&title=&width=294)

如果我们不注入依赖，这种方式也可以声明全局 pipe：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687086509549-7cd28f4b-be78-48f3-ac51-3e21299ea443.png#averageHue=%2335302b&clientId=uc43074b6-f02d-4&from=paste&height=327&id=uebefad65&originHeight=654&originWidth=1110&originalType=binary&ratio=2&rotation=0&showTitle=false&size=110357&status=done&style=none&taskId=u57161ecf-9d14-44c7-ab50-4c2709e7e6b&title=&width=555)

## class-validator 验证方式
我们声明这样一个 dto class：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707733461300-6e2b9fc8-519c-4e3a-8b24-813a4fc22d88.png#averageHue=%232d2c2b&clientId=u6ed857c3-48ff-4&from=paste&height=729&id=ud4879049&originHeight=1458&originWidth=1256&originalType=binary&ratio=2&rotation=0&showTitle=false&size=248403&status=done&style=none&taskId=u90452dc0-7d49-4c5d-81b9-951c3ab4526&title=&width=628)<br />添加路由：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707733725405-47f6c34e-7025-4cb4-820b-94e3d07d1c08.png#averageHue=%23302e2c&clientId=u6ed857c3-48ff-4&from=paste&height=124&id=u4692298c&originHeight=248&originWidth=830&originalType=binary&ratio=2&rotation=0&showTitle=false&size=36237&status=done&style=none&taskId=ufcfa26fd-041b-4753-96b5-1c47e7343b4&title=&width=415)<br />参数不正确：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707733601721-d65882cd-5387-4250-9290-35564cc8a578.png#averageHue=%23f9f8f8&clientId=u6ed857c3-48ff-4&from=paste&height=467&id=FxNt6&originHeight=934&originWidth=708&originalType=binary&ratio=2&rotation=0&showTitle=false&size=111056&status=done&style=none&taskId=u5b3bfd77-ca96-4e3a-b2d8-315119911d2&title=&width=354)<br />参数正确：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707733697770-ff5c02e6-47af-4494-b5d4-608231556c6a.png#averageHue=%23f7f6f6&clientId=u6ed857c3-48ff-4&from=paste&height=347&id=u60a015e8&originHeight=694&originWidth=572&originalType=binary&ratio=2&rotation=0&showTitle=false&size=66821&status=done&style=none&taskId=u89e6c598-491b-417f-bb0b-d3cdcbe6ead&title=&width=286)

这个错误消息还可以有更多信息：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707734002182-c8d31408-3608-435f-ba1b-631d90bc9717.png#averageHue=%2332302e&clientId=u6ed857c3-48ff-4&from=paste&height=283&id=u5a70260d&originHeight=566&originWidth=1494&originalType=binary&ratio=2&rotation=0&showTitle=false&size=143837&status=done&style=none&taskId=u7d7ae749-a7fd-46a8-a08b-d454a72b46e&title=&width=747)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707734041422-13b04fbf-7fa6-4f54-86ce-6ffcca92195a.png#averageHue=%23f8f7f7&clientId=u6ed857c3-48ff-4&from=paste&height=445&id=u8af621ec&originHeight=890&originWidth=580&originalType=binary&ratio=2&rotation=0&showTitle=false&size=90368&status=done&style=none&taskId=u23d97bbe-4064-4eee-a302-cf5107f4a6f&title=&width=290)<br />更多校验装饰器可以看 [class-validator 文档](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fclass-validator)。
