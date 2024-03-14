## 为什么使用 pm2
在生产环境中运行 Node.js 应用时，我们面临着一系列挑战：如何确保应用崩溃后能够自动重启？如何将应用的日志输出到指定文件以便分析？如何充分利用多核CPU来提升应用性能？以及如何监控应用的资源占用情况？这些问题都可以通过PM2（Process Manager 2）来解决。<br />PM2是一个功能强大的进程管理工具，专为 Node.js 应用设计。<br />它提供了**进程管理、日志管理、负载均衡和性能监控**等功能，帮助开发者轻松应对生产环境中的各种挑战。

## 启动 pm2
首先安装 pm2：
```bash
npm install pm2 -g
```
跑一个 node 应用，这里跑 Nest 应用：
```bash
nest new pm2-test -p npm
cd pm2-test
pnpm build
pm2 start ./dist/main.js
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687420231746-781a474d-3079-4d5c-9728-44441c6373c7.png#averageHue=%23333333&clientId=u7e94e0bc-3bfd-4&from=paste&height=129&id=u00353960&originHeight=258&originWidth=1882&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51283&status=done&style=none&taskId=u259e951a-9a9c-459a-a38e-7ec9e09f79f&title=&width=941)<br />这个 node 已经运行并且被 pm2 管理起来了。<br />可以使用 pm2 start 跑多个进程。

## pm2 日志管理
查看下日志：
```bash
pm2 logs
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687420368207-6acf6530-5d8b-43b7-afdb-b65eccfffbd8.png#averageHue=%23373737&clientId=u7e94e0bc-3bfd-4&from=paste&height=387&id=u3ff35504&originHeight=992&originWidth=1676&originalType=binary&ratio=2&rotation=0&showTitle=false&size=421050&status=done&style=none&taskId=u3dc637e7-d0b6-4329-860c-2610ef08b39&title=&width=653)<br />pm2 会把所有进程的日志打印出来，通过前面的 `“进程id|进程名字”` 来区分，比如 `0|main`。

所有的进程会写到日志文件中去，在 `~/.pm2/logs` 下，以 `“进程名-out.log”` 和 `“进程名-error.log”` 分别保存不同进程的日志：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687420562326-daa697c3-01ee-40bf-bf6b-e87da06f66c7.png#averageHue=%23fbf5e2&clientId=u7e94e0bc-3bfd-4&from=paste&height=55&id=u5cda62e9&originHeight=110&originWidth=1102&originalType=binary&ratio=2&rotation=0&showTitle=false&size=21759&status=done&style=none&taskId=u6bcbbd0e-a835-4877-b19d-bdd44d5cd47&title=&width=551)<br />比如 main-out.log 里保存了 main 进程的正常日志，而 main-error.log 里保存了它的报错日志。<br />可通过 `cat ~/.pm2/logs/main-out.log` 查看。<br />查看单个进程的日志：
```bash
pm2 logs 进程名
pm2 logs 进程id
```
日志清空，使用 `pm2 flush` 或者 `pm2 flush 进程名|id`<br />查看 main 进程的前 100 行日志：`pm2 logs main --lines 100`

## pm2 进程管理
PM2提供了丰富的进程管理功能，包括启动、重启、停止和删除进程等。<br />只需要执行 pm2 start 的时候带上几个选项就好了：<br />超过 100M 内存自动重启：
```bash
pm2 start app.js --max-memory-restart 100M
```
支持 corn 表达式，每天午夜（00:00）重启：
```bash
pm2 start app.js --cron-restart="0 0 * * *"
```
当文件内容改变自动重启：
```bash
pm2 start app.js --watch
```
不自动重启：
```bash
pm2 start app.js --no-autorestart
```


## pm2 负载均衡
再就是负载均衡，node 应用是单进程的，而为了充分利用多核 cpu，我们会使用多进程来提高性能。<br />node 提供的 cluster 模块就是做这个的，pm2 就是基于这个实现了负载均衡。<br />我们只要启动进程的时候加上 -i num 就是启动 num 个进程做负载均衡的意思：
```bash
pm2 start app.js -i max 
pm2 start app.js -i 0
```
`-i max` 让 PM2 自动设置进程数为最大值。<br />`-i 0` 则让 PM2 自动根据 CPU 核心数动态设置进程数。<br />用多进程的方式跑 nest 应用：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687421598381-87bb54c7-7747-45bd-a3ad-c6ea3803c37f.png#averageHue=%23363636&clientId=u7e94e0bc-3bfd-4&from=paste&height=199&id=ua8ae01ca&originHeight=422&originWidth=1890&originalType=binary&ratio=2&rotation=0&showTitle=false&size=138577&status=done&style=none&taskId=u8f73f7b9-dbc4-4920-8b11-0d6b4586105&title=&width=892)<br />可以看到启动了 8 个进程，因为我是 8 核 cpu。

跑起来之后，还可以动态调整进程数，通过 pm2 scale：
```bash
pm2 scale main 1
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687421678792-34156d9b-4228-4526-96eb-9172e0a511c1.png#averageHue=%23323232&clientId=u7e94e0bc-3bfd-4&from=paste&height=251&id=ucbad356b&originHeight=558&originWidth=1894&originalType=binary&ratio=2&rotation=0&showTitle=false&size=117311&status=done&style=none&taskId=u07e2ab28-c09c-4d73-848f-2f3d8c01920&title=&width=851)<br />此时 main 的集群调整为 1 个进程。

我们同样可以添加进程数：
```bash
pm2 scale main +3
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687421758098-eccddf7e-55fd-4113-8cbe-ffee93b58ee5.png#averageHue=%23333333&clientId=u7e94e0bc-3bfd-4&from=paste&height=165&id=udf9e584d&originHeight=330&originWidth=1872&originalType=binary&ratio=2&rotation=0&showTitle=false&size=88482&status=done&style=none&taskId=u44f60c38-5e6a-4d49-a0e9-9302c084bf4&title=&width=936)<br />现在变成 4 个进程了，通过这些方式可以动态伸缩进程的数量，pm2 会把请求分配到不同进程上去。这就是负载均衡功能。

我们同样可以停止和删除所有 pm2 的进程：
```bash
pm2 stop all
pm2 delete all
```
还可以停止删除单个进程：
```bash
pm2 stop app_name_or_id
pm2 delete app_name_or_id
```
`app_name_or_id` 替换为应用程序名称或者 PM2 分配给应用程序的 ID<br />可以通过 `pm2 list` 命令查看所有 PM2 管理的应用程序及其状态。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709386931934-33f89b75-9f84-40a4-9b6b-d98cb33c9b6e.png#averageHue=%23363636&clientId=u572965dd-ab04-4&from=paste&height=109&id=u8f050511&originHeight=218&originWidth=2132&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51353&status=done&style=none&taskId=uc74637a6-4008-4238-81d8-1899f70372a&title=&width=1066)

## pm2 监控
性能监控功能，执行 pm2 monit：
```bash
pm2 monit
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687423371147-71698df3-a866-439b-9165-b127562e4a17.png#averageHue=%232d2d2d&clientId=u7e94e0bc-3bfd-4&from=paste&height=447&id=u0acb6d6f&originHeight=1146&originWidth=2184&originalType=binary&ratio=2&rotation=0&showTitle=false&size=118059&status=done&style=none&taskId=ub5788ac5-3d19-408f-94fb-470dd56a61f&title=&width=851)<br />这里可以看到不同进程的 cpu 和内存占用情况。

当进程多了之后，难道都要手动通过命令行来启动么？<br />pm2 支持配置文件的方式启动多个应用。执行 `pm2 ecosystem`，会创建一个配置文件：
```bash
pm2 ecosystem
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687423506082-0489f18b-3e6f-40d5-9949-191024cc1696.png#averageHue=%23454545&clientId=u7e94e0bc-3bfd-4&from=paste&height=30&id=ud547d856&originHeight=60&originWidth=1160&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15974&status=done&style=none&taskId=uecc873ab-f86d-472c-af94-44301661d23&title=&width=580)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687423573330-eb8287b5-380e-4f76-83bd-47240446bb49.png#averageHue=%232c2c2b&clientId=u7e94e0bc-3bfd-4&from=paste&height=453&id=u2ea86bf3&originHeight=1498&originWidth=1748&originalType=binary&ratio=2&rotation=0&showTitle=false&size=172554&status=done&style=none&taskId=ue6a81b4c-d811-4e14-9a4a-cfd6322b373&title=&width=529)<br />我们就可以把启动的选项保存在这个配置文件，pm2 根据配置文件自动执行这些命令。<br />然后用 `pm2 start ecosystem.config.js` 就可以批量跑一批应用。


## pm2 网站

访问 pm2 的网站，登录，创建 bucket：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687425060757-89c5a6c3-b34f-4e9b-b478-33d5173f91b7.png#averageHue=%231f2a35&clientId=u7e94e0bc-3bfd-4&from=paste&height=544&id=uce3e9215&originHeight=1188&originWidth=2026&originalType=binary&ratio=2&rotation=0&showTitle=false&size=89986&status=done&style=none&taskId=udb9963f9-7e14-47c0-8d5b-c95493008cc&title=&width=927)<br />然后执行下面 pm2 link xxx：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687425124265-631d4e94-3fa2-4739-9af4-c707095623d9.png#averageHue=%23232d38&clientId=u7e94e0bc-3bfd-4&from=paste&height=471&id=u68664fad&originHeight=1224&originWidth=2410&originalType=binary&ratio=2&rotation=0&showTitle=false&size=248737&status=done&style=none&taskId=u1cdccae3-4311-4901-9c33-e5abfaa1b65&title=&width=927)<br />再执行 pm2 plus 就会打开 bucket 对应的网页，在线监控本地的应用。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709385222490-b6fdc7e3-81c0-4391-8e30-7e331db55dae.png#averageHue=%231d2833&clientId=ue4ab3092-c6d3-4&from=paste&height=342&id=u75535af7&originHeight=984&originWidth=2496&originalType=binary&ratio=2&rotation=0&showTitle=false&size=247568&status=done&style=none&taskId=u31b01b26-ec70-4594-9813-521a1d4277f&title=&width=867)


## docker 结合 pm2
一般都是 [docker 镜像](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FUnitech%2Fpm2%2Fblob%2Fmaster%2Fexamples%2Fdocker-pm2%2FDockerfile)内安装 pm2 来跑 node 应用：<br />之前我们写的 Nest 的 dockerfile 需要更改一下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687428912169-bec80001-58a5-4b53-995d-3ed8d7462b35.png#averageHue=%232d2b2a&clientId=u7e94e0bc-3bfd-4&from=paste&height=380&id=udb9c0800&originHeight=932&originWidth=1334&originalType=binary&ratio=2&rotation=0&showTitle=false&size=105090&status=done&style=none&taskId=u4a1f8dc7-bd2b-4050-822b-abe17e1b83a&title=&width=544)<br />pm2-runtime 代表 node 命令跑应用。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709386556910-f230f12e-0750-44c8-bff1-568299632755.png#averageHue=%232d2c2c&clientId=ue4ab3092-c6d3-4&from=paste&height=505&id=ub9224adc&originHeight=1010&originWidth=1804&originalType=binary&ratio=2&rotation=0&showTitle=false&size=160861&status=done&style=none&taskId=u570c2a58-b640-4cf5-b23b-8243bf25243&title=&width=902)<br />打包镜像：
```bash
docker build -t nest-pm2-test:v1.0 .
```
运行镜像：
```bash
docker run -p 3000:3000 -d nest-pm2-test:v1.0
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709386585818-53b999bd-70df-4d10-9a62-42c575f636d6.png#averageHue=%23eeeeee&clientId=ue4ab3092-c6d3-4&from=paste&height=85&id=uf6bbcf37&originHeight=170&originWidth=488&originalType=binary&ratio=2&rotation=0&showTitle=false&size=13281&status=done&style=none&taskId=u52621ee7-efad-44dd-9151-8996d2510d2&title=&width=244)<br />可以在 docker 看到 pm2 打印的日志。在 terminal 使用 pm2 的命令：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709386617488-b69cd467-397c-4dc2-aa78-0a35a377a22e.png#averageHue=%238a8e89&clientId=ue4ab3092-c6d3-4&from=paste&height=408&id=u7b456e04&originHeight=1656&originWidth=2810&originalType=binary&ratio=2&rotation=0&showTitle=false&size=212178&status=done&style=none&taskId=u9b1af739-8221-45ea-97e2-c07a977f4fa&title=&width=693)<br />现在这个容器内的 node 进程在崩溃时就会自动重启。
