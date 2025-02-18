## 启动 compodoc 文档
compodoc 是一个为 TypeScript 项目生成文档的工具，它支持 Angular、Nest。<br />compodoc 会分析你的代码，并生成一个包含所有类、接口、服务、控制器和模块以及它们依赖关系的文档。

创建 nest 项目：
```bash
nest new compodoc-test -p npm
```
安装 compodoc：
```bash
npm install @compodoc/compodoc -D
```
在 `package.json` 文件的 `scripts` 部分添加一个新的脚本来运行 compodoc：
```json
"scripts": {
  "compodoc": "compodoc -p tsconfig.json -s -o",
}
```

- -p 是指定 tsconfig 文件
- -s 是启动静态服务器
- -o 是打开浏览器

更多选项在 [compodoc 文档](https://link.juejin.cn/?target=https%3A%2F%2Fcompodoc.app%2Fguides%2Foptions.html)里可以看到：<br />生成预览文档：
```bash
npm run compodoc
```
自动打开浏览器，并定位到了 README 菜单：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709458507644-8cd8b8c1-303d-4a2e-b6ad-8bc6988092cd.png#averageHue=%23fafafa&clientId=u40db19a7-11a8-4&from=paste&height=387&id=uf6721fbc&originHeight=1606&originWidth=2998&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=296898&status=done&style=none&taskId=uc6c90fc0-e83c-4174-bcc8-3d54a905954&title=&width=722.45166015625)<br />这个 README 菜单其实对应了项目里面的 README：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1705747089878-f4b53017-0183-4c28-8da0-8f54f15ffb0b.png#averageHue=%23ae6930&clientId=uaf6bd440-3d50-4&from=paste&height=109&id=ub7250d0e&originHeight=218&originWidth=610&originalType=binary&ratio=2&rotation=0&showTitle=false&size=23694&status=done&style=none&taskId=u7376e3aa-081e-4321-84af-9dbb7d54605&title=&width=305)<br />改一下 READMD.md，然后重新执行命令生成：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1705747110755-8d8de72f-7b5c-438d-9e0a-e96b1b07522f.png#averageHue=%23fdfcfc&clientId=uaf6bd440-3d50-4&from=paste&height=323&id=u8bfcdd55&originHeight=646&originWidth=2206&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63160&status=done&style=none&taskId=u72417a63-5d39-4b9d-9ca5-6e7f49cbae4&title=&width=1103)



## overview
文档的 overview 部分分贝是依赖图，和项目有几个模块、controller，可注入的 provider<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1705747193552-f20c0e80-35a6-4910-aac6-24d66af9808c.png#averageHue=%23fbfafa&clientId=uaf6bd440-3d50-4&from=paste&height=534&id=ubd5c8c1e&originHeight=1068&originWidth=2188&originalType=binary&ratio=2&rotation=0&showTitle=false&size=143576&status=done&style=none&taskId=uf9b031ef-a396-46bf-9cb7-20696005e24&title=&width=1094)

我们在项目下添加几个模块：
```typescript
nest g resource test1

nest g resource test2
```
在 Test1Module 导出 Test1Service：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709458583885-7a42b325-fb5d-4ce6-a89d-88e6b57fc006.png#averageHue=%232f2d2b&clientId=u40db19a7-11a8-4&from=paste&height=256&id=u6daef73c&originHeight=564&originWidth=1246&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=104502&status=done&style=none&taskId=u6a8ce65e-44ee-454a-b605-a1959f30000&title=&width=566.3636240880354)


然后 Test2Module 引入 Test1Module：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709458656590-d9c75429-dc95-484b-b53d-1015cb884993.png#averageHue=%232f2d2b&clientId=u40db19a7-11a8-4&from=paste&height=275&id=udf6124e0&originHeight=606&originWidth=1236&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=122467&status=done&style=none&taskId=u5951eb49-c3ae-478b-a739-31005e3eca2&title=&width=561.8181696411009)<br />在 Test2Service 里注入 Test1Service：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709458760462-8c1aa4a6-0c48-4b24-8524-14d0e164317d.png#averageHue=%23322e2b&clientId=u40db19a7-11a8-4&from=paste&height=291&id=uc36e879f&originHeight=640&originWidth=1136&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=89232&status=done&style=none&taskId=u08e3ce9d-3e4a-4317-b528-907d12b3622&title=&width=516.3636251717562)<br />运行项目：
```typescript
npm run start:dev
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709458831201-5936485c-0e60-44f6-8f6c-7fd2cbbb0773.png#averageHue=%23e9e9e9&clientId=u40db19a7-11a8-4&from=paste&height=78&id=u692351b8&originHeight=172&originWidth=730&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=21223&status=done&style=none&taskId=u23b977b4-1aac-48f7-af95-bd9556511d1&title=&width=331.81817462621655)<br />这种依赖关系，compodoc 可视化之后是什么样的呢？<br />重新跑一下 compodoc：
```typescript
npm run compodoc
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709458930004-5ce51d05-d17b-440f-ac91-a13f7b2ed047.png#averageHue=%23fbfaf8&clientId=u40db19a7-11a8-4&from=paste&height=635&id=ud2e64ab9&originHeight=1396&originWidth=3006&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=217311&status=done&style=none&taskId=u65796913-a63a-4619-819e-6a8da3a87d6&title=&width=1366.3636067485027)

点击左侧的 Modules，可以看到每个模块的可视化分析：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709459082447-77edc070-cd1e-4e11-b84c-90789d5ba975.png#averageHue=%23fbfaf9&clientId=u40db19a7-11a8-4&from=paste&height=635&id=ub80135dd&originHeight=1396&originWidth=2484&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=209097&status=done&style=none&taskId=ua28e7695-7626-48f3-b318-b20828aadc5&title=&width=1129.0908846185232)<br />还可以定位到具体代码的实现：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709459124829-93b1cd45-ee3f-42d9-a05d-f30d3e4b4ac3.png#averageHue=%23fcfcfc&clientId=u40db19a7-11a8-4&from=paste&height=576&id=u43aaca10&originHeight=1268&originWidth=1416&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=136724&status=done&style=none&taskId=uc436674a-0373-4c73-b9ec-2c3abec973d&title=&width=643.6363496859215)<br />当新人接手这个项目的时候，可以通过这份文档快速了解项目的结构。


## compodoc 配置文件
命令行选项也挺多的，我们可以写在 compodoc 配置文件中。<br />项目下添加一个 `.compodoc.json` 的文件：
```json
{
    "port": 8888,
    "theme": "postmark"
}
```
改下 scripts 里 compodoc 命令：
```json
"scripts": {
   "compodoc": "compodoc -s -o -c .compodoc.json",
 }
```
-c 参数告诉 compodoc 使用指定的配置文件。<br />运行：
```bash
npm run compodoc
```
同样能使配置生效。
