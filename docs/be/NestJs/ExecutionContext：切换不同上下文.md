Nest.js 的设计允许开发者使用统一的方式处理不同类型的服务，如 HTTP、WebSocket 和基于 TCP 的微服务。<br />这是通过 `ArgumentHost` 和 `ExecutionContext` 类实现的，它们提供了跨多种上下文（context）复用 Guards、Interceptors 和 Exception Filters 的能力。

## ExecutionContext 类
`ExecutionContext` 类是一个扩展了 `ArgumentsHost` 的类。提供了更多关于当前执行过程的信息，比如当前的处理器、类和方法。

## ArgumentHost 类
`ArgumentHost` 是一个包装了当前执行上下文的参数的对象。<br />我们可以使用 `switchToHttp()`、`switchToWs()` 或 `switchToRpc()` 方法来获取特定 HTTP、WebSocket 或 RPC 的上下文信息。<br />`ArgumentHost` 是 `ExecutionContext` 的一个超集，它专门用于异常过滤器中。

## Exception Filters
创建项目试试：
```bash
nest new argument-host -p npm
```
然后创建一个 filter：
```bash
nest g filter HttpException --flat --no-spec
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707645945465-6c4451bf-dacd-4fdf-b190-635fc6c85f8b.png#averageHue=%232f2e2b&clientId=uc056eea9-e987-4&from=paste&height=174&id=u11990b19&originHeight=348&originWidth=1598&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75914&status=done&style=none&taskId=u531285de-d05b-4e10-85d8-69aed54f668&title=&width=799)<br />`@Catch()` 没有声明参数。表示会 catch 所有类型的异常。

如何声明 Exception Filter 来捕获特定类型的异常呢？<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707646085061-0dad95fc-7d03-45f4-9e1e-bd25e23a16f1.png#averageHue=%232e2d2b&clientId=uc056eea9-e987-4&from=paste&height=438&id=u06d09256&originHeight=1240&originWidth=1408&originalType=binary&ratio=2&rotation=0&showTitle=false&size=208385&status=done&style=none&taskId=u3841855e-53bc-4d31-a012-54d9b652be6&title=&width=497)<br />catch 一下 HttpException 异常。<br />AppModule 全局启用下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707645649163-94d70f48-8ed3-4bab-88ea-110fd47ad570.png#averageHue=%23302d2a&clientId=uc056eea9-e987-4&from=paste&height=315&id=ua0504623&originHeight=630&originWidth=764&originalType=binary&ratio=2&rotation=0&showTitle=false&size=59903&status=done&style=none&taskId=uab7db7cf-bf1f-4cb6-971f-2798612068e&title=&width=382)<br />AppController 抛出对应错误：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707645808548-d6e0ada0-958b-4cb6-80ce-96b89509f34c.png#averageHue=%23302d2b&clientId=uc056eea9-e987-4&from=paste&height=243&id=u3b07fb42&originHeight=620&originWidth=1652&originalType=binary&ratio=2&rotation=0&showTitle=false&size=115832&status=done&style=none&taskId=u9ffacefe-e9de-40e6-8248-ec90efb4289&title=&width=648)<br />访问 [http://localhost:3000](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000)：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707646105102-61ee24da-1047-406b-a037-c16a6a8434dc.png#averageHue=%23f6f2f2&clientId=uc056eea9-e987-4&from=paste&height=139&id=u88808dea&originHeight=278&originWidth=850&originalType=binary&ratio=2&rotation=0&showTitle=false&size=39864&status=done&style=none&taskId=u4f788559-b5c5-4702-8dad-6658588f9d2&title=&width=425)

filter 的第一个参数是异常对象，第二个参数是什么呢？<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686979767469-56ed9dde-9417-44c1-b082-8a0c239a16e3.png#averageHue=%232a3028&clientId=uf45bad73-1a9f-4&from=paste&height=276&id=u4ffd6a0c&originHeight=552&originWidth=1200&originalType=binary&ratio=2&rotation=0&showTitle=false&size=87245&status=done&style=none&taskId=uab7900fe-38af-4f07-a6cf-885524af8bf&title=&width=600)<br />可以看到，它有这些方法。<br />host.getType 方法取出当前所处上下文。<br />host.getArgs 方法就是取出当前上下文的 reqeust、response、next 参数。<br />调用 host.switchToHttp、host.swtichToWs、host.switchToRpc 方法可以分别切换 http、ws、基于 tcp 的微服务上下文。

这样，就可以在 filter 里处理多个上下文的逻辑了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707646757374-2ae4d24c-2b03-4d00-a334-66d7adc76b5b.png#averageHue=%232e2d2b&clientId=u9d4678b3-73c3-4&from=paste&height=461&id=u56f00891&originHeight=1396&originWidth=1398&originalType=binary&ratio=2&rotation=0&showTitle=false&size=231254&status=done&style=none&taskId=ucb247ae9-b2c3-4388-bb3c-5e21594c84a&title=&width=462)

访问页面：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707646786988-83372c26-b118-4c4e-8102-6bfaa8717ffc.png#averageHue=%23f8f5f5&clientId=u9d4678b3-73c3-4&from=paste&height=110&id=u2cee3426&originHeight=220&originWidth=820&originalType=binary&ratio=2&rotation=0&showTitle=false&size=24026&status=done&style=none&taskId=u76ad00f4-6d5d-4172-9178-bdb3143ffc0&title=&width=410)

<br />
## guard
那 guard 和 interceptor 里如何使用 context 呢？<br />创建个 guard：
```bash
nest g guard role --no-spec --flat
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707647019534-076bf628-16b9-4222-925b-2de1b6cb32e8.png#averageHue=%23ac783a&clientId=ucd6fec27-9461-4&from=paste&height=364&id=u3c4f6408&originHeight=952&originWidth=1706&originalType=binary&ratio=2&rotation=0&showTitle=false&size=180657&status=done&style=none&taskId=u215e206d-23bc-4de0-aa42-2031cd3ba49&title=&width=653)<br />ExecutionContext 扩展了 getClass、getHandler 方法。<br />这样 Guard、Interceptor 的逻辑可根据目标 class、handler 有没有某些装饰而决定怎么处理。

比如权限验证的时候，我们会先定义几个角色：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707647304837-b723fc41-67d0-47aa-9704-2271cfe142ae.png#averageHue=%23312f2d&clientId=ucd6fec27-9461-4&from=paste&height=123&id=u1829604b&originHeight=246&originWidth=538&originalType=binary&ratio=2&rotation=0&showTitle=false&size=24412&status=done&style=none&taskId=u36075291-c3f0-4f73-906d-784bc4ea499&title=&width=269)<br />自定义装饰器添加 Metadata：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707647355936-72a050c3-dd22-48e2-bcd5-c5feb2723809.png#averageHue=%23312f2c&clientId=ucd6fec27-9461-4&from=paste&height=122&id=u9468a516&originHeight=244&originWidth=1620&originalType=binary&ratio=2&rotation=0&showTitle=false&size=59035&status=done&style=none&taskId=u5fa6efcb-cc04-4593-892b-48c97a81e38&title=&width=810)<br />然后在 handler 上添加这个装饰器，参数为 admin：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707647580277-55b54291-3349-4e5d-a3af-438b1953a2d7.png#averageHue=%232f2d2b&clientId=ucd6fec27-9461-4&from=paste&height=284&id=uf6c98430&originHeight=568&originWidth=1178&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75256&status=done&style=none&taskId=u3d35205a-d4b9-4ea2-8654-86260cf8082&title=&width=589)<br />这样在 Guard 里就可以根据这个 metadata 决定是否放行了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707647440678-de732987-c15c-4413-8853-c11eaf058393.png#averageHue=%232e2d2b&clientId=ucd6fec27-9461-4&from=paste&height=582&id=u6eebc97c&originHeight=1346&originWidth=1714&originalType=binary&ratio=2&rotation=0&showTitle=false&size=247733&status=done&style=none&taskId=ucdc656b1-44ee-4044-a88d-d0b76c45d7c&title=&width=741)<br />这里注入的 reflector，并不需要在模块的 provider 声明。<br />查看页面返回 "Forbidden resource"，说明 Guard 生效了，因为 user 是 undefined：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707647528765-1bb6cfa8-2b9f-4621-99a5-5e2980d92867.png#averageHue=%23f7f4f4&clientId=ucd6fec27-9461-4&from=paste&height=106&id=uae584667&originHeight=212&originWidth=712&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22641&status=done&style=none&taskId=ua4ec032f-6a48-4372-8222-ed2ad4408fc&title=&width=356)


## interceptor
在 interceptor 里也有这个 context：
```bash
nest g interceptor aaa --no-spec --flat
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686982848003-a72c4cef-0cb1-43d4-a0cb-897e5ac278d4.png#averageHue=%23625b21&clientId=u47a923fd-c408-4&from=paste&height=333&id=ue4ac02b5&originHeight=666&originWidth=1668&originalType=binary&ratio=2&rotation=0&showTitle=false&size=113921&status=done&style=none&taskId=u43695a3a-2932-455d-819c-47a2aff779c&title=&width=834)<br />同样可以通过 reflector 取出 class 或者 handler 上的 metdadata。
