在容器化技术日益普及的今天，Docker 已成为部署 Node.js 服务的常用选择。<br />同时，PM2 作为一个进程管理工具，也常被用于管理 Node.js 进程。<br />两者都提供了进程崩溃时的自动重启功能。

## docker 重启
写个 dockerfile：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY ./index.js .

CMD ["node", "/app/index.js"]
```
写如下代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709365506245-74c0e4f0-5ab8-4ab5-9cbd-15d751ba8fab.png#averageHue=%23bf9244&clientId=ubde89bd7-3207-4&from=paste&height=132&id=ua4991d18&originHeight=264&originWidth=718&originalType=binary&ratio=2&rotation=0&showTitle=false&size=33531&status=done&style=none&taskId=ub58e38bd-cf79-4fae-8b39-da975d3ba1c&title=&width=359)<br />打包镜像：
```dockerfile
docker build -t restart-test:v1.0 .
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709365864472-08bcc1ca-7f18-473b-8c0a-38ff8cbda54b.png#averageHue=%23f5f6f8&clientId=u9c67e497-5bef-4&from=paste&height=48&id=u64ff686a&originHeight=96&originWidth=2052&originalType=binary&ratio=2&rotation=0&showTitle=false&size=20186&status=done&style=none&taskId=u4b6ed8d7-5f02-49ea-aada-95dc61da29c&title=&width=1026)<br />运行镜像：
```dockerfile
docker run -d --name=restart-test-container restart-test:v1.0
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709365897773-9e5a2f17-4fb2-4adc-bcff-861d488b1e9a.png#averageHue=%23ebeced&clientId=u9c67e497-5bef-4&from=paste&height=310&id=u675f31ec&originHeight=620&originWidth=1174&originalType=binary&ratio=2&rotation=0&showTitle=false&size=95442&status=done&style=none&taskId=u1a8bc01c-3ce7-4808-901f-863709f901c&title=&width=587)<br />1s 之后，容器就停掉了。

我们可以在 docker run 的时候通过 --restart 指定重启策略：
```bash
docker run -d --restart=always --name=restart-test-container2 restart-test:v1.0
```
always 总是尝试重启容器。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709366037429-456f541f-b4f3-4a1a-add8-30600efb74e7.png#averageHue=%23f2f4f8&clientId=u9c67e497-5bef-4&from=paste&height=46&id=u48d024a4&originHeight=92&originWidth=2188&originalType=binary&ratio=2&rotation=0&showTitle=false&size=31416&status=done&style=none&taskId=u3c5b43f9-6987-4a8f-88b8-8c5d2ff6cdf&title=&width=1094)<br />打印了很多次错误日志：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709366098888-3f941302-e81f-431b-8971-d3c87e5ce7da.png#averageHue=%23e9e9ea&clientId=u9c67e497-5bef-4&from=paste&height=501&id=u033129d9&originHeight=1496&originWidth=1198&originalType=binary&ratio=2&rotation=0&showTitle=false&size=268465&status=done&style=none&taskId=u7e4346be-b65a-48ef-8885-c6f8e6a35c3&title=&width=401)<br />你可以点击停止，就不会再重启了。<br />--restart 还有一些参数：

1. `no`：这是默认的重启策略。当容器退出时，不会尝试重启它。
2. `on-failure`：：仅在容器非正常退出时自动重启。可以指定重启次数，如 `on-failure:3` 表示最多重启三次。
3. `unless-stopped`：除非手动停止，否则容器总是自动重启。与 `always` 类似，但区别在于当 Docker 守护进程重启时，`unless-stopped` 策略的容器不会自动重启。


## pm2 重启
新建 pm2.Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY ./index.js .

RUN npm install -g pm2

CMD ["pm2-runtime", "/app/index.js"]
```
然后 build 一下，生成镜像：
```bash
docker build -t restart-test:v2.0 -f pm2.Dockerfile .
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709366316567-e8af83f4-4b8f-4939-815c-d476cca3f8fb.png#averageHue=%23f6f6f8&clientId=u9c67e497-5bef-4&from=paste&height=57&id=u4721d662&originHeight=114&originWidth=2170&originalType=binary&ratio=2&rotation=0&showTitle=false&size=20713&status=done&style=none&taskId=uff5b9ca8-d5cb-427d-96af-1c719a5d4e9&title=&width=1085)<br />然后跑一下：
```bash
docker run -d --name=restart-test-container3 restart-test:v2.0
```
这时候会发现容器一直是运行状态，但是内部的进程一直在重启：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709366410284-e3ff2f74-a140-40dd-8c9c-ca85724da313.png#averageHue=%23e7e7e8&clientId=u9c67e497-5bef-4&from=paste&height=483&id=u9a988b12&originHeight=1518&originWidth=1560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=443469&status=done&style=none&taskId=u008395cc-e699-4894-bf7f-b2b5dd53d16&title=&width=496)<br />也就是说，Docker 的自动重启功能和 PM2 的自动重启功能是重合的。


## 选择哪个重启
在大多数情况下，使用 Docker 的自动重启功能已经足够满足需求，无需再使用 PM2。特别是当使用容器编排工具（如Kubernetes）时，更倾向于让容器编排工具来管理容器的重启和调度。<br />如果只是 Docker 部署，可以考虑结合 pm2 来做进程的重启，可能会更快点。

## docker compose 配置 restart
Docker Compose 是用于同时跑多个 Docker 容器的，它自然也支持 restart 的配置：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688303026227-f3888d70-be1c-4242-a443-ad27f547cc4d.png#averageHue=%23312d2b&clientId=u8d7b45e3-bd7a-4&from=paste&height=324&id=u3ed38812&originHeight=648&originWidth=672&originalType=binary&ratio=2&rotation=0&showTitle=false&size=57703&status=done&style=none&taskId=uce20fa09-0640-4fa7-a841-32652f3d9d3&title=&width=336)
