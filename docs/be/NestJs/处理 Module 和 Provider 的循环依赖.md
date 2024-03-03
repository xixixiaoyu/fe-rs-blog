Nest 模块之间可以通过 imports 引用其他模块。<br />那 Module 和 Module 如果相互引用怎么办？

## module 之间的循环依赖
创建一个 nest 项目：
```bash
nest new module-forward -p npm
```
创建两个 Module：
```bash
nest g module a
nest g module b
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707723023496-d1d529f8-f583-40e6-9d9d-ae9ac48f4b4d.png#averageHue=%23b67732&clientId=u4ed59f35-5f99-4&from=paste&height=335&id=u3d2ba5d4&originHeight=670&originWidth=1796&originalType=binary&ratio=2&rotation=0&showTitle=false&size=145516&status=done&style=none&taskId=uedc4417c-eff6-40c0-8fd0-15c17adff81&title=&width=898)<br />这种相互引用的情况就会报错。

使用 forwardRef 包装函数，该函数返回模块或提供者的引用，而不是直接引用，从而延迟了依赖项的解析：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707723204354-ee3b487b-973d-47c4-b368-0312687eb5a3.png#averageHue=%23302f2d&clientId=u4ed59f35-5f99-4&from=paste&height=299&id=ud1e763da&originHeight=598&originWidth=2094&originalType=binary&ratio=2&rotation=0&showTitle=false&size=184840&status=done&style=none&taskId=u6f97fdfc-c798-4b82-953c-d21a9928014&title=&width=1047)<br />这时候就没有报错了。


## provider 循环依赖
```bash
nest g service c --no-spec --flat
nest g service d --no-spec --flat
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707724446434-88ff2aa3-0b06-480f-aa76-f32bc4d61bdd.png#averageHue=%232f2d2b&clientId=u1248aef4-d1fd-4&from=paste&height=442&id=u8093c5b4&originHeight=884&originWidth=1998&originalType=binary&ratio=2&rotation=0&showTitle=false&size=240715&status=done&style=none&taskId=u57ce80ce-55c3-4f63-bfde-52c2299114b&title=&width=999)<br />两个 service 分别依赖了对方的方法。<br />这时候会报错，也是因为循环依赖导致的。<br />在提供者中通过 `@Inject(forwardRef(() => Type))` 来注入依赖：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707724247707-dcb52e4c-972d-4927-8ca5-35db6be551a1.png#averageHue=%232f2e2c&clientId=u1248aef4-d1fd-4&from=paste&height=523&id=ufce58d44&originHeight=1046&originWidth=2044&originalType=binary&ratio=2&rotation=0&showTitle=false&size=265931&status=done&style=none&taskId=u69792255-8e0d-4753-aee5-6d197da4972&title=&width=1022)<br />这样就不会报错了。<br />我们相互能不能正确获取结果，在 AppService 使用：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707724287520-18d2128f-fa59-46d6-8dd0-0b84ce09e08a.png#averageHue=%23302e2b&clientId=u1248aef4-d1fd-4&from=paste&height=205&id=u3e704454&originHeight=410&originWidth=1488&originalType=binary&ratio=2&rotation=0&showTitle=false&size=64483&status=done&style=none&taskId=u837345dc-e8b2-4c75-bb1d-4f91433e33a&title=&width=744)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707724299525-1bd7c886-2435-4ce5-a4f2-7305cd347a29.png#averageHue=%23302e2b&clientId=u1248aef4-d1fd-4&from=paste&height=228&id=u2a44f1cb&originHeight=456&originWidth=1176&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63457&status=done&style=none&taskId=ucf42a235-8842-4088-ad96-42537dde5c6&title=&width=588)<br />访问 localhost:3000：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1707724340059-5f672011-67e3-436b-bf18-dc498f56b288.png#averageHue=%23f1f1f1&clientId=u1248aef4-d1fd-4&from=paste&height=84&id=u0f7c63ff&originHeight=168&originWidth=518&originalType=binary&ratio=2&rotation=0&showTitle=false&size=12350&status=done&style=none&taskId=uc6ec0cd5-98f4-41da-817c-56f86e2421a&title=&width=259)<br />没有问题。

## 合理的设计

- 重新设计代码，避免循环依赖的产生是最好的做法。
- 可以引入新的中间件、库或服务来分解复杂的依赖关系。

