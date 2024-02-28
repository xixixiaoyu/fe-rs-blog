nest 很多功能基于装饰器实现，我们有必要好好了解下有哪些装饰器：<br />创建 nest 项目：
```bash
nest new all-decorator -p npm
```

## @Module({})
这是一个类装饰器，用于定义一个模块。<br />模块是 Nest.js 中组织代码的单元，可以包含控制器、提供者等：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686408310818-bf8ba5fd-ff6b-4228-b39b-d135143fa318.png#averageHue=%232e2d2b&clientId=ue69b1856-feb8-4&from=paste&height=153&id=uaee8089b&originHeight=306&originWidth=816&originalType=binary&ratio=2&rotation=0&showTitle=false&size=50195&status=done&style=none&taskId=u32bf20ee-fee0-4cf5-ae6d-b6ba202b868&title=&width=408)

## @Controller() 和 @Injectable()
这两个装饰器也是类装饰器，前者控制器负责处理传入的请求和返回响应，后者定义一个服务提供者，可以被注入到控制器或其他服务中。<br />通过 `@Controller`、`@Injectable` 分别声明 controller 和 provider：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686408371516-1c8c97b5-6a8d-4958-a554-5547392feef4.png#averageHue=%2337332c&clientId=ue69b1856-feb8-4&from=paste&height=70&id=u598252e1&originHeight=140&originWidth=1300&originalType=binary&ratio=2&rotation=0&showTitle=false&size=42957&status=done&style=none&taskId=ue4378a56-0eaf-4302-b01b-5335bd367f8&title=&width=650)

## @Optional、@Inject
创建可选对象（无依赖注入），可以用 `@Optional` 声明一下，这样没有对应的 provider 也能正常创建这个对象。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686408762999-a056f8a2-43d9-4e5a-8691-ffe8cd419d3b.png#averageHue=%23312e2b&clientId=ue69b1856-feb8-4&from=paste&height=186&id=ubb8f660e&originHeight=430&originWidth=1318&originalType=binary&ratio=2&rotation=0&showTitle=false&size=72433&status=done&style=none&taskId=uaceca630-c24d-4489-bf33-64663749e9b&title=&width=571)<br />注入依赖也可以用 @Inject 装饰器。

## @Catch
filter 是处理抛出的未捕获异常，通过 `@Catch` 来指定处理的异常：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686409319833-455f489a-b50d-4891-89ec-1a8643a7eeb3.png#averageHue=%232e2d2b&clientId=ue69b1856-feb8-4&from=paste&height=388&id=u3a585d3e&originHeight=1010&originWidth=1578&originalType=binary&ratio=2&rotation=0&showTitle=false&size=175091&status=done&style=none&taskId=u62ef812c-d618-486a-9b29-3d6b40509eb&title=&width=606)

## @UseXxx、@Query、@Param
使用 @UseFilters 应用 filter 到 handler 上：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686409349507-702b3079-987e-422a-80a8-47fc916958a4.png#averageHue=%232e2d2b&clientId=ue69b1856-feb8-4&from=paste&height=316&id=u720ab824&originHeight=756&originWidth=1804&originalType=binary&ratio=2&rotation=0&showTitle=false&size=146029&status=done&style=none&taskId=u050e3117-490d-47c8-a5cb-c1707e3e77e&title=&width=755)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686409381750-0a9c6170-2aa1-4847-b543-5e6d50ca0422.png#averageHue=%231e1e1c&clientId=ue69b1856-feb8-4&from=paste&height=168&id=u62765967&originHeight=336&originWidth=724&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29996&status=done&style=none&taskId=u1698d82e-c736-4dea-ba85-caf300ae4a5&title=&width=362)<br />除了 filter 之外，interceptor、guard、pipe 也是这样用：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686409705702-e7b7d88e-862c-4b35-959c-96e47812025f.png#averageHue=%232e2d2b&clientId=ue69b1856-feb8-4&from=paste&height=454&id=u5b524288&originHeight=1340&originWidth=1416&originalType=binary&ratio=2&rotation=0&showTitle=false&size=219659&status=done&style=none&taskId=u46dae802-1e3e-4372-9430-17c6ba666a0&title=&width=480)<br />当然，pipe 更多还是单独在某个参数的位置应用：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686410053657-f745e5c6-2799-471b-8a9e-0c7938150755.png#averageHue=%23302e2b&clientId=ue69b1856-feb8-4&from=paste&height=262&id=u8962a846&originHeight=524&originWidth=1010&originalType=binary&ratio=2&rotation=0&showTitle=false&size=71292&status=done&style=none&taskId=u3252faed-1f8f-4fe0-9e99-b809ad5524d&title=&width=505)<br />这里的 `@Query` 是取 url 查询字符串参数，比如 ?bbb=true，而 `@Param` 是取路径中的参数，比如 `/xxx/111` 中的 `111`

## @Body
如果是 post、put、patch** **请求，可以通过 @Body 取到 body 部分：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686447899628-8c81c1ec-c142-424d-b6d5-e56eff03ff53.png#averageHue=%23312f2c&clientId=u56b5bc7a-51c9-4&from=paste&height=216&id=u01a01c23&originHeight=432&originWidth=1356&originalType=binary&ratio=2&rotation=0&showTitle=false&size=79656&status=done&style=none&taskId=ueff6740b-6bc9-437f-95b4-5f33fe9ad84&title=&width=678)<br />我们一般用 dto 定义的 class 来接收验证请求体里的参数。

## @Put、@Delete、@Patch、@Options、@Head
@Put、@Delete、@Patch、@Options、@Head 装饰器分别接受 put、delete、patch、options、head 请求：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686448159943-3c00c47d-cb03-4ce7-b74d-8650be342db4.png#averageHue=%2333302c&clientId=u56b5bc7a-51c9-4&from=paste&height=509&id=uf474e54e&originHeight=1288&originWidth=400&originalType=binary&ratio=2&rotation=0&showTitle=false&size=74771&status=done&style=none&taskId=uade51a13-3f39-42d7-a562-409527d9d4e&title=&width=158)

## @SetMetadata
通过 `@SetMetadata` 指定 metadata，作用于 handler 或 class<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686448932281-49c8e61a-4a35-4225-ab5f-22833ad7ba8c.png#averageHue=%23322f2c&clientId=u56b5bc7a-51c9-4&from=paste&height=263&id=udb4f3007&originHeight=526&originWidth=854&originalType=binary&ratio=2&rotation=0&showTitle=false&size=74449&status=done&style=none&taskId=uc337fdce-02f2-417e-a04d-7392fe7c22f&title=&width=427)<br />然后在 guard 或者 interceptor 里取出来：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686448981067-bdf380c3-d6e6-456a-a6d1-fa596832c1dd.png#averageHue=%23322f2b&clientId=u56b5bc7a-51c9-4&from=paste&height=426&id=uf7a010cb&originHeight=852&originWidth=1726&originalType=binary&ratio=2&rotation=0&showTitle=false&size=158590&status=done&style=none&taskId=u3aa6d19d-17d8-439a-8b8c-a295c8bdd7e&title=&width=863)

## @Headers
可以通过 @Headers 装饰器取某个请求头或者全部请求头：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686449246067-111c59af-8afd-49bd-a5e6-45bf8a7e2b82.png#averageHue=%232f2e2d&clientId=u56b5bc7a-51c9-4&from=paste&height=242&id=u5942cf5a&originHeight=636&originWidth=1994&originalType=binary&ratio=2&rotation=0&showTitle=false&size=153265&status=done&style=none&taskId=u37358733-7da1-4fb3-9738-4ac4282c9e2&title=&width=759)

## @Ip
通过 @Ip 拿到请求的 ip，通过 @Session 拿到 session 对象：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686449541437-84cbadea-f930-4246-b8e5-c9c07e4c12c7.png#averageHue=%23302e2c&clientId=u56b5bc7a-51c9-4&from=paste&height=267&id=u36c6da15&originHeight=534&originWidth=942&originalType=binary&ratio=2&rotation=0&showTitle=false&size=65269&status=done&style=none&taskId=u8a1d6e9b-b7ee-43d3-9f24-a8ae45ec80f&title=&width=471)

## @HostParam
@HostParam 用于取域名部分的参数。<br />下面 host 需要满足 xxx.0.0.1 到这个 controller，host 里的参数就可以通过 @HostParam 取出来：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709090008374-82ea7d36-02ac-47be-a770-7230da51448c.png#averageHue=%23464442&clientId=u97df35b2-55e4-4&from=paste&height=231&id=uaf94b119&originHeight=462&originWidth=1692&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96931&status=done&style=none&taskId=u41101f16-b56b-4af2-89d0-f6480143575&title=&width=846)
## @Req、@Request、@Res、@Response
前面取的这些都是 request 里的属性，当然也可以直接注入 request 对象：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686453804267-f4a35225-155c-4a4c-b98e-b5fd4181cec0.png#averageHue=%23302e2c&clientId=u56b5bc7a-51c9-4&from=paste&height=268&id=uc098ba31&originHeight=536&originWidth=882&originalType=binary&ratio=2&rotation=0&showTitle=false&size=76943&status=done&style=none&taskId=u7df1ed80-0303-4b8e-a521-a9a000d7969&title=&width=441)<br />@Req 或者 @Request 装饰器，这俩是同一个东西。

使用 @Res 或 @Response 注入 response 对象，但是注入 response 对象之后，服务器会一直没有响应。<br />因为这时候 Nest 就不会把 handler 返回值作为响应内容了。我们可以自己返回响应：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686453975966-a243a1a7-ec27-49af-8e8e-a4a5271034dd.png#averageHue=%23312f2c&clientId=u56b5bc7a-51c9-4&from=paste&height=186&id=u4a7edcbd&originHeight=372&originWidth=698&originalType=binary&ratio=2&rotation=0&showTitle=false&size=45611&status=done&style=none&taskId=ud99e4f87-039a-44e8-acca-e30cdf97707&title=&width=349)<br />Nest 这么设计是为了避免相互冲突。<br />如果你不会自己返回响应，可以设置 passthrough 为 true 告诉 Nest：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686454086356-faa726ef-6524-47da-b9a8-47e25129468d.png#averageHue=%232e2d2b&clientId=u56b5bc7a-51c9-4&from=paste&height=227&id=u760e6680&originHeight=480&originWidth=1142&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61878&status=done&style=none&taskId=u24b57822-e2fd-4412-be82-b7251212785&title=&width=539)

## @Next
除了注入 @Res 不会返回响应外，注入 @Next 也不会。<br />当你有两个 handler 来处理同一个路由的时候，可以在第一个 handler 里注入 next，调用它来把请求转发到第二个 handler。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709089130298-cb4e97de-f7ac-4041-82af-a6a8c68f8a61.png#averageHue=%232f2f2e&clientId=u97df35b2-55e4-4&from=paste&height=390&id=uc56698d8&originHeight=780&originWidth=1682&originalType=binary&ratio=2&rotation=0&showTitle=false&size=159768&status=done&style=none&taskId=ue52a0279-1e4a-4856-bbb9-48008b0eef5&title=&width=841)


## @HttpCode
handler 默认返回的是 200 的状态码，你可以通过 @HttpCode 修改它：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709088572795-be3329a0-6eef-4518-b6e4-c10e96ec1698.png#averageHue=%236d6b6a&clientId=u97df35b2-55e4-4&from=paste&height=135&id=u92cc8f40&originHeight=270&originWidth=1352&originalType=binary&ratio=2&rotation=0&showTitle=false&size=49629&status=done&style=none&taskId=u02203a94-30d9-4e25-b617-fdf7e9cdf68&title=&width=676)

## @Header
当然，你也可以修改 response header，通过 @Header 装饰器：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709088658283-5fbd8112-c2ab-41a3-b954-4e0e47eae6be.png#averageHue=%23686664&clientId=u97df35b2-55e4-4&from=paste&height=217&id=u978d8be6&originHeight=512&originWidth=1510&originalType=binary&ratio=2&rotation=0&showTitle=false&size=131305&status=done&style=none&taskId=u9117e0c7-3cef-467d-b5ba-e1631ddf58e&title=&width=639)




