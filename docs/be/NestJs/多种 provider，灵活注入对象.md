Nest 实现了 IOC 容器，会从入口模块开始扫描，分析 Module 之间的引用关系，对象之间的依赖关系，自动把 provider 注入到目标对象。

## 类提供者
 最常用的形式，使用类本身作为提供者<br />这个类通常会有 `@Injectable()` 装饰器，表明它可以被注入：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686383099029-536adfd2-6aa1-40fc-b124-24ba0281c0e9.png#averageHue=%2334312c&clientId=ub5257429-1733-4&from=paste&height=158&id=u0496dd4d&originHeight=316&originWidth=586&originalType=binary&ratio=2&rotation=0&showTitle=false&size=31374&status=done&style=none&taskId=u0a660f55-183e-43bb-b148-aaf20e9b4cd&title=&width=293)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686383126445-a962e39a-86e9-4568-af50-26c2dca945b3.png#averageHue=%23342f2a&clientId=ub5257429-1733-4&from=paste&height=160&id=u25139e7c&originHeight=320&originWidth=678&originalType=binary&ratio=2&rotation=0&showTitle=false&size=45872&status=done&style=none&taskId=ue1509ace-918e-4a4a-8e95-c47c5d32452&title=&width=339)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686383265180-adf27559-62b8-4025-b25f-8ba25910cf9a.png#averageHue=%23302e2b&clientId=ub5257429-1733-4&from=paste&height=258&id=UpYoa&originHeight=634&originWidth=1244&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96246&status=done&style=none&taskId=uf95b2174-8d9b-4eec-ad1e-a0637f3cb07&title=&width=506)


## 使用 useClass 的 Provider
当你想要注入一个类，但是使用不同于通常实例化的类时，可以使用 useClass。
```typescript
class MyService {
  // ...
}

class MyMockService {
  // ...
}

@Module({
  providers: [
    {
      provide: MyService,
      useClass: process.env.NODE_ENV === 'development' ? MyMockService : MyService,
    },
  ],
})
export class MyModule {}
```
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
class SomeService {
  constructor(private myService: MyService) {}

  someMethod() {
    // 使用 this.myService 调用 MyService 或 MyMockService 的方法
  }
}
```

其实之前写的 `providers: [appService]` 是一种简写，完整写法：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707319780923-a74825f9-a141-40f0-8c7e-0246c1de0ab5.png#averageHue=%23302d2a&clientId=u2f2179d3-5595-4&from=paste&height=296&id=u2f63e464&originHeight=592&originWidth=646&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61398&status=done&style=none&taskId=u004ae44b-14ec-4175-91d5-2a9ee143ad6&title=&width=323)<br />通过 provide 指定注入的 token，通过 useClass 指定注入的对象的类。<br />Nest 会自动将其实例化注入：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686383265180-adf27559-62b8-4025-b25f-8ba25910cf9a.png#averageHue=%23302e2b&clientId=ub5257429-1733-4&from=paste&height=258&id=ua59b9262&originHeight=634&originWidth=1244&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96246&status=done&style=none&taskId=uf95b2174-8d9b-4eec-ad1e-a0637f3cb07&title=&width=506)<br />如果不想用构造器注入，也可以属性注入：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686383388293-75374646-092d-46a5-ae5c-6bb7ff52befa.png#averageHue=%23312f2c&clientId=ub5257429-1733-4&from=paste&height=262&id=ucb304eca&originHeight=524&originWidth=914&originalType=binary&ratio=2&rotation=0&showTitle=false&size=69817&status=done&style=none&taskId=u941e7499-b580-4c84-8781-12ad678f789&title=&width=457)<br />通过 @Inject 指定注入的 provider 的 token 即可。

这个 token 也可以是字符串：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686383515595-8187eb85-4ac4-4d50-a72d-25df37547d7c.png#averageHue=%23302e2c&clientId=ub5257429-1733-4&from=paste&height=346&id=uaf5a3d9c&originHeight=692&originWidth=1660&originalType=binary&ratio=2&rotation=0&showTitle=false&size=183278&status=done&style=none&taskId=u9be0155a-a5ff-4e77-96af-1ee345b556a&title=&width=830)

## 值提供者
除了指定 class 外，还可以直接指定一个值，让 IOC 容器来注入。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686383792594-46cc0f0c-822b-4b8d-ae07-155b502f36ff.png#averageHue=%232f2d2b&clientId=ub5257429-1733-4&from=paste&height=277&id=u7a8392db&originHeight=554&originWidth=1732&originalType=binary&ratio=2&rotation=0&showTitle=false&size=131483&status=done&style=none&taskId=u01d0fd46-8865-4b11-8d9f-74420fcdb6c&title=&width=866)

## 工厂提供者
provider 的值可能是动态产生的，Nest 支持使用 useFactory 来动态创建一个对象：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686384065462-49a78a4c-ce45-4b8c-a333-bf5b4675423c.png#averageHue=%232e2d2b&clientId=ub5257429-1733-4&from=paste&height=306&id=ua17a3a69&originHeight=612&originWidth=2120&originalType=binary&ratio=2&rotation=0&showTitle=false&size=154027&status=done&style=none&taskId=ub1a09151-b990-4efa-a382-4b1e71683f6&title=&width=1060)

useFactory 也是支持参数的注入的。<br />我们在 useFactory 通过 inject 声明了两个 token，一个是字符串 token 的 person，一个是 class token 的 AppService。<br />在调用 useFactory 方法的时候，Nest 就会注入这两个对象：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686397755099-8ed48776-2c70-4a08-825b-6ae3dbf562cc.png#averageHue=%232d2c2b&clientId=ub5257429-1733-4&from=paste&height=541&id=u02a2f800&originHeight=1292&originWidth=2336&originalType=binary&ratio=2&rotation=0&showTitle=false&size=263096&status=done&style=none&taskId=u1e1676b5-405a-4f1b-ae4c-74cfbcb0344&title=&width=979)

useFactory 还支持异步：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686398385537-751ff2e7-e493-4ef4-969f-d0ca82cdda36.png#averageHue=%232e2d2c&clientId=ub5257429-1733-4&from=paste&height=423&id=uc73e5b79&originHeight=1022&originWidth=2096&originalType=binary&ratio=2&rotation=0&showTitle=false&size=226675&status=done&style=none&taskId=u37895133-1b0a-43d2-a87d-30ac494e544&title=&width=868)<br />这样 Nest 就会等拿到异步方法的结果之后再注入，更灵活。

## 别名提供者
provider 还可以通过 useExisting 来指定别名：<br />这里给 asyncPerson 的 provider 起个新的 token 叫做 newPerson。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686398540572-512b76ba-dd1a-4d3a-9fe0-44d818c8235e.png#averageHue=%232f2d2c&clientId=ub5257429-1733-4&from=paste&height=268&id=u10125091&originHeight=536&originWidth=2026&originalType=binary&ratio=2&rotation=0&showTitle=false&size=98805&status=done&style=none&taskId=uca28cdd5-64dc-4d75-a10f-d9a22a2fec2&title=&width=1013)
