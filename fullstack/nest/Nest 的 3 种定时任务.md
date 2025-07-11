## 引入 ScheduleModule
新建项目：
```bash
nest new schedule-task -p npm
```
安装定时任务的包：
```bash
npm install @nestjs/schedule
```
在 AppModule 里引入：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708428816393-565b6f34-428f-4f93-b464-ca1fcd9aea26.png#averageHue=%23322d29&clientId=u374c54f4-3782-4&from=paste&height=271&id=uff7fcea1&originHeight=525&originWidth=1055&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=97829&status=done&style=none&taskId=u5a737b5f-71eb-424d-88c1-9baed481ecf&title=&width=544)

## 使用 cron 表达式
创建 service：
```bash
nest g service task --flat --no-spec
```
通过 @Cron 声明任务执行时间：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708432121349-03cf8ee2-bba2-48bd-a63d-5aefff1a23f4.png#averageHue=%232f2c29&clientId=u374c54f4-3782-4&from=paste&height=284&id=u7adbea87&originHeight=481&originWidth=1176&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=79806&status=done&style=none&taskId=u40798f7d-eddb-4916-88b6-d71dcf24a6b&title=&width=693.7999877929688)<br />`CronExpression.EVERY_5_SECONDS` 的值：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708432175493-18d4289a-176e-48bf-9f04-9fd2bbf2bba4.png#averageHue=%232d2a28&clientId=u374c54f4-3782-4&from=paste&height=85&id=ClMwK&originHeight=106&originWidth=1178&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=26013&status=done&style=none&taskId=u16d0811e-8c03-4fcf-ac44-7f81a4f7b87&title=&width=942.4)<br />运行：
```bash
npm run start:dev
```
每 5s 会执行一次 handleCron 函数。

cron 表达式有这 7 个字段：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693658167732-426e9a11-f437-4293-a944-838e58e6a0d4.png#averageHue=%23faf9f8&clientId=u03d9fd93-d982-4&from=paste&height=323&id=u471cfd05&originHeight=646&originWidth=1300&originalType=binary&ratio=2&rotation=0&showTitle=false&size=346730&status=done&style=none&taskId=ufa936c29-a672-4d1c-a4b2-63c4ba5e84c&title=&width=650)<br />其中年是可选的，所以一般都是 6 个。<br />此外，Cron 表达式还支持一些特殊字符：

- *：代表所有可能的值。例如，在小时字段中，* 表示“每个小时”。
- ?：用于日期和星期字段。它表示不指定值。通常，日期和星期字段不会同时被指定值，因为它们是互斥的。所以，你可以使用 ? 来表示其中一个字段不指定值。
- -：用于指定范围。例如，10-12 在小时字段中表示 10 点、11 点和 12 点。
- ,：用于指定多个值。例如，在小时字段中，10,12,14 表示 10 点、12 点和 14 点。
- /：用于指定步长。例如，0/15 在分钟字段中表示每 15 分钟。

所以 Nest 提供了一些 cron 表达式常量：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693659482386-2425a763-b1f8-41e2-8282-ac4716c93f47.png#averageHue=%2346553f&clientId=ub5e9f707-ac9e-4&from=paste&height=263&id=u949e9d51&originHeight=526&originWidth=1298&originalType=binary&ratio=2&rotation=0&showTitle=false&size=104261&status=done&style=none&taskId=u1ace797c-1a91-42cf-8a5c-061a2c6ffb1&title=&width=649)<br />这个 @Cron 装饰器还有第二个参数，可以指定定时任务的名字，还有时区：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708679972734-2be24cae-2d7d-44d0-b73a-134a4cd9a3d1.png#averageHue=%23312d29&clientId=u9adb5288-750b-4&from=paste&height=259&id=u140971d4&originHeight=324&originWidth=557&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=35801&status=done&style=none&taskId=u10c4dfe5-f9b3-4012-82ab-ca8c7e64787&title=&width=445.6)<br />时区可以在[这里](https://link.juejin.cn/?target=https%3A%2F%2Fmomentjs.com%2Ftimezone%2F)查。

## 常用的 cron 表达式

1.  **每分钟执行一次** 
```
* * * * *
```
这个表达式会在每分钟的每一秒执行任务。 

2.  **每小时执行一次** 
```
0 * * * *
```
这个表达式会在每小时的第 0 分钟执行任务。 

3.  **每天执行一次** 
```
0 0 * * *
```
这个表达式会在每天的午夜 00:00 执行任务。 

4.  **每天特定时间执行** 
```
0 8 * * *
```
这个表达式会在每天的上午 8:00 执行任务。 

5.  **每周一次** 
```
0 0 * * 1
```
这个表达式会在每周一的午夜 00:00 执行任务。 

6.  **每月一次** 
```
0 0 1 * *
```
这个表达式会在每月的第一天午夜 00:00 执行任务。 

7.  **每年一次** 
```
0 0 1 1 *
```
这个表达式会在每年的 1 月 1 日午夜 00:00 执行任务。 

8.  **每小时的第 15 分钟执行** 
```
0 15 * * * *
```
这个表达式会在每小时的第 15 分钟执行任务。 

9.  **每天的上午 9 点到下午 5 点，每小时执行一次** 
```
0 0 9-17 * * *
```
这个表达式会在每天的上午 9 点到下午 5 点之间，每小时的开始执行任务。 

10.  **每周一至周五，每天上午 8 点执行** 
```
0 0 8 * * 1-5
```
这个表达式会在每周的工作日（周一至周五）的上午 8:00 执行任务。 

11.  **每月最后一天的午夜执行** 
```
0 0 0 L * *
```
这个表达式会在每月的最后一天午夜 00:00 执行任务。请注意，`L` 是 Quartz Scheduler 的特殊字符，不是所有的 `cron` 实现都支持它。 

12.  **每月第一个星期一的上午 8 点执行** 
```
0 0 8 ? * 2#1
```
这个表达式会在每月的第一个星期一的上午 8:00 执行任务。同样地，`?` 和 `#` 是 Quartz Scheduler 的特殊字符。 

注意：如果你使用的是标准的 Unix/Linux `cron`，请确保不要使用 Quartz Scheduler 的特殊字符。


## @Interval 和 @Timeout
除了 @Cron 之外，可以用 @Interval 指定任务的执行间隔，参数是毫秒值：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693659581809-cf03f411-1b67-4a6d-8c84-30ee32705be2.png#averageHue=%23312f2c&clientId=ub5e9f707-ac9e-4&from=paste&height=97&id=u8369a213&originHeight=194&originWidth=472&originalType=binary&ratio=2&rotation=0&showTitle=false&size=21395&status=done&style=none&taskId=u87ece6ee-90cb-4cbe-82f6-6ff5652a328&title=&width=236)

用 @Timeout 指定多长时间后执行一次：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693659625102-194203c4-a386-40ec-b341-10bec7d9e81a.png#averageHue=%23312f2c&clientId=ub5e9f707-ac9e-4&from=paste&height=97&id=uf94c1668&originHeight=194&originWidth=468&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22032&status=done&style=none&taskId=ud2be760d-2915-47fe-8e6b-c02ed2ce63a&title=&width=234)

综上，我们可以通过 @Cron、@Interval、@Timeout 创建 3 种定时任务。


## 管理定时任务
我们可以对定时任务增删改查，注入 SchedulerRegistry：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1708681399221-8d0517ae-0b6f-4df0-b986-f6e6bdaf5948.png#averageHue=%23312e2a&clientId=u8e32aced-1918-4&from=paste&height=62&id=u012ddee9&originHeight=78&originWidth=668&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=14249&status=done&style=none&taskId=ueb31ffe5-14a7-4ec5-a5dc-bcf793007ec&title=&width=534.4)<br />然后在 onApplicationBootstrap 的声明周期里拿到所有的 cronJobs 打印下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693703122473-a951f40e-bfd1-46c3-9aa3-2bcc99adce46.png#averageHue=%2334312d&clientId=ub3b9e1ce-b27a-4&from=paste&height=94&id=u10baf0a6&originHeight=188&originWidth=1142&originalType=binary&ratio=2&rotation=0&showTitle=false&size=47085&status=done&style=none&taskId=u406c06da-ef99-48f1-9e7a-7faaad8c257&title=&width=571)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693703095923-e268143d-84e6-4b79-9c9c-5fe80d42c22d.png#averageHue=%23303030&clientId=ub3b9e1ce-b27a-4&from=paste&height=697&id=u36246100&originHeight=1394&originWidth=710&originalType=binary&ratio=2&rotation=0&showTitle=false&size=179119&status=done&style=none&taskId=ua6fd226e-aa51-409a-a983-6620111d593&title=&width=355)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693702892298-ed104988-3f60-43a5-a888-5066a80d4361.png#averageHue=%2335322d&clientId=ub3b9e1ce-b27a-4&from=paste&height=144&id=ucfd406b8&originHeight=288&originWidth=1146&originalType=binary&ratio=2&rotation=0&showTitle=false&size=84636&status=done&style=none&taskId=u784574d6-00c1-4527-b4ce-94223a01354&title=&width=573)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693702877481-ab36a2c3-dd6e-4fe8-b059-5c675dec76ce.png#averageHue=%23323231&clientId=ub3b9e1ce-b27a-4&from=paste&height=349&id=ue90cf380&originHeight=842&originWidth=610&originalType=binary&ratio=2&rotation=0&showTitle=false&size=117353&status=done&style=none&taskId=ucc1d65b5-599e-4f64-aef9-d59d9ad8c86&title=&width=253)<br />能拿到单个或者全部的定时任务。<br />后面我们要自己创建定时任务，需要 `npm install cron` 后。<br />SchedulerRegistry 提供了 api 让我们删除和添加这三种类型的定时任务。
