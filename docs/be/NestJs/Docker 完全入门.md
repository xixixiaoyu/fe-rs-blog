## docker 介绍和优势
Docker 是一个开源的容器化平台，它允许开发者打包应用及其依赖到一个可移植的容器中，然后可以在任何支持 Docker 的机器上运行这个容器。<br />后端会部署很多服务，比如 mysql 和 redis 等中间件的服务，部署他们需要安装一系列的依赖和进行环境变量设置。<br />如果我们部署多台机器，同样的操作需要重复多次，服务才能正常启动，环境配置很麻烦。

docker 的诞生无疑是伟大的。<br />docker 将系统中的所有文件和环境封装成一个镜像，然后将该镜像作为容器运行，保证了开发、测试和生产环境的一致性。<br />在一台机器上可以运行多个容器，每个容器都有独立的操作系统环境，例如文件系统和网络端口。<br />非常适合微服务，每个服务可以打包成一个独立的容器，还可以运行多个容器就可以部署多个实例，便于管理和扩展。

相比之下虚拟机也是一种带环境安装的解决方案，它可以在一种操作系统内运行另一种操作系统。然而，虚拟机存在资源占用多、冗余步骤多和启动慢等缺点。

docker 的诞生无疑是伟大的，它保证了开发、测试和生产环境的一致性，并且
## 安装 docker
首先需要安装 Docker，直接从[官网](https://www.docker.com/products/docker-desktop/)下载 docker desktop 就行。<br />安装完成命令行输入 `docker -h` 看下 docker 命令是否可用，如果不可用，在 Settings > Advanced 设置下环境变量即可。

docker 的界面 images 是本地的所有镜像，containers 是镜像跑起来的容器，volumes 是数据卷：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687188411567-ef53d38a-44a8-4120-93a5-2f2667c6716b.png#averageHue=%23d7e0eb&clientId=ua5797894-9318-4&from=paste&height=459&id=uc368ca40&originHeight=1456&originWidth=2386&originalType=binary&ratio=2&rotation=0&showTitle=false&size=255396&status=done&style=none&taskId=u40f83dcb-926f-45fb-9198-5923f04f929&title=&width=752)

## docker 核心概念

1. **镜像（Image）**：Docker 镜像是一个只读的模板，例如一个操作系统的镜像，或者带有应用程序及其依赖的镜像。镜像用来创建 Docker 容器。Docker 用户可以创建自己的镜像或者使用别人发布的镜像。
2. **容器（Container）**：容器是镜像的运行实例。它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证安全的平台。你可以把容器看作是一个简易版的 Linux 环境（包括根用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序。
3. **仓库（Repository）**：Docker 仓库用来保存镜像，可以理解为代码控制中的代码仓库。Docker Hub 和 Docker Cloud 是最著名的公共仓库，用户也可以搭建自己的私有仓库。
4. **数据卷（Volume）**：卷用于数据持久化和数据共享。当 Docker 容器被删除时，保存在容器内的数据也会被删除。而卷则存在于一个或多个容器之外，即使容器被删除，卷里的数据也仍然存在。
5. **Dockerfile：**Dockerfile 是一个文本文件，包含了一系列的指令，每一条指令构建一层，用于自动化构建 Docker 镜像。Dockerfile 从基础镜像开始，执行一系列命令，最终构成你想要的镜像。
6. **网络（Network）**：Docker 网络允许容器间相互通信，以及容器与外部通信。Docker 提供了多种网络模式，包括桥接模式、主机模式、覆盖模式等，以支持不同的使用场景。

## 拉取运行镜像
搜索镜像，点击 pull（搜索这步需要科学上网，不然搜不到）：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709095898411-f318e822-4498-47dd-84ce-90a7b4a138a1.png#averageHue=%237795b3&clientId=u25db91f4-bd25-4&from=paste&height=459&id=ucab07e2e&originHeight=918&originWidth=1468&originalType=binary&ratio=2&rotation=0&showTitle=false&size=186668&status=done&style=none&taskId=uc0785628-a7c8-4ca7-bedc-43a52b8a1b7&title=&width=734)<br />pull 下来之后，就可以在本地 images 看到了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687188864583-d17ecfbd-fb50-4203-b735-57d5a3ac200d.png#averageHue=%23e4eaf2&clientId=ua5797894-9318-4&from=paste&height=486&id=u8cc6e8c5&originHeight=1402&originWidth=2208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=200262&status=done&style=none&taskId=u6adff2a7-9c19-4644-a51f-b7c1cd12c4c&title=&width=766)<br />点击 run 填写一些参数：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687188952017-099b8e2e-009c-47c0-a783-7c6aaedd2a5b.png#averageHue=%23eeeff2&clientId=ua5797894-9318-4&from=paste&height=61&id=ud694b503&originHeight=122&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22643&status=done&style=none&taskId=u64579c98-f76a-4104-870e-77b43452f6d&title=&width=800)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709106368833-a9929a77-b93f-4c31-b30a-6e39bd9e74de.png#averageHue=%23fcfcfc&clientId=u4197bf61-cca8-4&from=paste&height=635&id=ud221295e&originHeight=1270&originWidth=1064&originalType=binary&ratio=2&rotation=0&showTitle=false&size=92199&status=done&style=none&taskId=uec2f6e98-b9a6-4953-91c4-ce985f705b1&title=&width=532)<br />我们来看下这些选项

- 名字：如果不填，docker desktop 会给你生成随机的容器名字。
- 端口：容器内跑的 nginx 服务是在 80 端口，我们需要将容器的 80 端口映射到宿主机的某个端口。
- 数据卷 volumes：通过将宿主机的目录挂载到容器内部，可以确保容器内的数据持久化存储。即使容器被删除，只要再次创建容器时将同一个宿主机目录挂载到新容器，之前保存的数据仍然可以被访问。这样做的目的是为了防止数据随容器的消失而丢失。
- 环境变量：设置后，可以被容器内运行的应用程序读取。

这里我们挂载本地的 /tmp/test（window：D://tmp/test） 到容器内的 /usr/share/nginx/html 目录。

点击 run：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687189363428-d2337b27-69d4-4d51-a4b8-61924f719797.png#averageHue=%233ba18c&clientId=ua5797894-9318-4&from=paste&height=481&id=ud4f394d8&originHeight=1402&originWidth=2208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=390036&status=done&style=none&taskId=u35e7f701-907f-4757-a666-ed7f4b51b1e&title=&width=757)<br />这样容器内的 nginx 服务跑起来了。

## 挂载卷
我们进入/tmp/test 目录下：
```typescript
cd /tmp/aaa
```
添加一个 index.html：
```typescript
echo "hello" >./index.html
```
浏览器访问 [http://localhost](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost) 就可以访问到：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687189652879-6ad1eb7b-fd33-49f0-9b3b-a13cfade0685.png#averageHue=%23ededee&clientId=ua5797894-9318-4&from=paste&height=77&id=u6ab5834c&originHeight=154&originWidth=422&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7920&status=done&style=none&taskId=u8d6e084e-09e9-4c31-a782-063b90f5123&title=&width=211)<br />这就说明数据卷挂载成功了。

点击 files 标签就可以看到容器内的文件。可以看到 /usr/share/nginx/html 被标识为 mounted，就是挂载目录的意思，这意味着我们本地相应牡蛎添加 index.html， 这里面也会实时添加：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687191033223-78d7d3a3-4199-4500-9c83-6b28ffbbd155.png#averageHue=%23e5ebf3&clientId=ua5797894-9318-4&from=paste&height=474&id=ub6bd4b50&originHeight=1402&originWidth=2208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=282461&status=done&style=none&taskId=u19ea21d4-3da7-4d15-b6ce-8ff0869a778&title=&width=746)

如果你挂载某些目录报错，需在 Settings > Resources > File Sharing 配置对应挂载目录：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687191252220-85519f07-ecea-422a-99cc-178a2963f479.png#averageHue=%23e8edf5&clientId=ua5797894-9318-4&from=paste&height=502&id=u6aebf262&originHeight=1402&originWidth=2208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=201536&status=done&style=none&taskId=ufccabffe-afe3-4c49-8f60-e2e07495295&title=&width=791)<br />至于挂载到的目录，在镜像搜索结果页有写：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687191378957-3ea23bb9-bac7-45a5-ac18-a01ef7703e2e.png#averageHue=%23b7d2e3&clientId=ua5797894-9318-4&from=paste&height=495&id=ubf9041e3&originHeight=1402&originWidth=2208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=273442&status=done&style=none&taskId=ub9c7653f-e85d-46b3-9db0-30006194118&title=&width=780)<br />通过命令行 docker run 来跑镜像， -v 是指定挂载的数据卷，后面的 :ro 代表 readonly，也就是容器内这个目录只读，:rw 表示容器内可以读写这个目录。<br />这就是数据卷的作用。<br />我们还可以进入容器内执行各种命令：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687191493942-9a39e743-55c2-4687-8da6-e0d7503feca0.png#averageHue=%2323c53d&clientId=ua5797894-9318-4&from=paste&height=477&id=aGAOo&originHeight=1402&originWidth=2208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=172803&status=done&style=none&taskId=u7782c352-9a76-43ad-beff-0660f48d04c&title=&width=751)

## docker 命令
### 拉取镜像
服务器上没有 Docker Desktop 这种可视化操作，就需要敲命令。<br />比如我们点击 pull 按钮，就相当于执行了 docker pull：
```typescript
docker pull nginx:latest
```
latest 是标签，也就是这个：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687191574066-eeb8e70e-0e86-4f53-8c56-551b91650d4c.png#averageHue=%23739b92&clientId=ua5797894-9318-4&from=paste&height=527&id=u1bd3f2bc&originHeight=1402&originWidth=2208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=301489&status=done&style=none&taskId=udead1256-93d2-46f2-9f35-7bf57d0dd73&title=&width=830)

### 运行镜像
然后我们点击 run 按钮，填完表单，就相当于执行了 docker run：
```bash
docker run --name nginx-test2 -p 81:80 -v /tmp/test:/usr/share/nginx/html -e KEY1=VALUE1 -d nginx:latest
```

- --name 取名：给新启动的容器命名为 nginx-test2。
- -p 端口映射：容器内的 80 端口映射到宿主机的 81 端口上
- -v 指定数据卷挂载目录：将宿主机上的 /tmp/test 目录挂载到容器内的 /usr/share/nginx/html 目录。
- -e 指定环境变量：设置了一个环境变量 KEY1，其值为 VALUE1。容器内部的应用程序可以读取这个环境变量。
- -d 后台运行
- nginx:latest 指定使用的 Docker 镜像的名称和标签

<br />docker run 会返回一个容器的 hash：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709108417262-14395d1c-9d88-4a06-ac05-720f226fb23c.png#averageHue=%23fbf5e2&clientId=u4197bf61-cca8-4&from=paste&height=72&id=u244bee27&originHeight=162&originWidth=1930&originalType=binary&ratio=2&rotation=0&showTitle=false&size=103760&status=done&style=none&taskId=u8fe7f5ac-392e-44f3-8620-d0377f93fa3&title=&width=853)<br />就是这里的 id：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709108479227-a44f7aee-d261-41bf-b8d2-611420e24b00.png#averageHue=%23f4f5f8&clientId=u4197bf61-cca8-4&from=paste&height=435&id=udeb2b12a&originHeight=870&originWidth=2096&originalType=binary&ratio=2&rotation=0&showTitle=false&size=205535&status=done&style=none&taskId=u8ca60c2a-9ee8-4cbf-8e8b-4e58e5653e1&title=&width=1048)

### 获取容器列表
上面容器列表界面可以用 docker ps 来获取：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709108553600-e49d659d-ea51-4dda-b05d-63f17cea3aab.png#averageHue=%23fcf5e1&clientId=u4197bf61-cca8-4&from=paste&height=118&id=ue277dc4c&originHeight=386&originWidth=2338&originalType=binary&ratio=2&rotation=0&showTitle=false&size=177515&status=done&style=none&taskId=ub09d470b-f236-4c8d-9c8d-73bf64858a5&title=&width=712)<br />默认显示运行中的容器。

如果想显示全部，加个 -a<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709108644730-4f5a9c02-40cb-47f5-a53d-115a200d91d1.png#averageHue=%23fcf5e2&clientId=u4197bf61-cca8-4&from=paste&height=406&id=uf808a073&originHeight=812&originWidth=2342&originalType=binary&ratio=2&rotation=0&showTitle=false&size=423326&status=done&style=none&taskId=u72f48dd3-9dcf-44a4-8f60-b0fa845b6dd&title=&width=1171)

### 获取镜像列表
image 镜像列表可以通过 docker images 命令获取：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709108672223-04aa8a61-3825-400b-bce6-10ad7b51a699.png#averageHue=%23fcf5e2&clientId=u4197bf61-cca8-4&from=paste&height=201&id=u43cd01dd&originHeight=536&originWidth=1860&originalType=binary&ratio=2&rotation=0&showTitle=false&size=268416&status=done&style=none&taskId=u46114dec-4c9d-4f15-b3c8-1e3fca4dbf5&title=&width=697)

### 进入退出容器 terminal
我们在容器的 terminal 里执行命令：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687192052981-7b17c7a5-7e63-42c5-9933-4ef1d7863427.png#averageHue=%23f3f4f8&clientId=ua5797894-9318-4&from=paste&height=130&id=u3decedb5&originHeight=260&originWidth=872&originalType=binary&ratio=2&rotation=0&showTitle=false&size=28113&status=done&style=none&taskId=uc007d4e2-a984-49ae-9888-182b4e07ad4&title=&width=436)<br />对应的是 docker exec 命令：
```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

- [OPTIONS]：可选的参数，可以用来修改命令的行为。例如，使用 -d 或 --detach 选项可以在后台运行命令，而 -i 或 --interactive 让命令保持交互性，-t 或 --tty 则分配一个伪终端。
- CONTAINER：这是你想要执行命令的容器的名称或 ID。
- COMMAND：这是你想在容器内执行的命令。
- [ARG...]：这是传递给命令的额外参数。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709109370190-1fc4768e-fdf9-41fb-99d9-0e6dca041248.png#averageHue=%23fcf4e0&clientId=u0982da9d-d9f0-4&from=paste&height=237&id=u4b58a797&originHeight=474&originWidth=2336&originalType=binary&ratio=2&rotation=0&showTitle=false&size=227823&status=done&style=none&taskId=u74438c6c-b26f-4ea5-817b-e9f940f2b2a&title=&width=1168)<br />上面命令会启动一个交互式的 bash shell 在容器内部，允许你直接运行容器内命令。

退出容器 terminal：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709109702304-a1a825c3-f2cd-484c-afb7-a2e32eb0347a.png#averageHue=%23fcf5e2&clientId=u0982da9d-d9f0-4&from=paste&height=57&id=u8d85a3d9&originHeight=114&originWidth=624&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22198&status=done&style=none&taskId=u998c4d7e-0f21-4908-8ee1-6e7937701d7&title=&width=312)

### 查看日志
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709138306618-6e6cd9ef-847f-42a1-b040-7c5af8d6bd04.png#averageHue=%23e7e8ea&clientId=ua089cfaa-ce7f-4&from=paste&height=314&id=ucb70f91e&originHeight=984&originWidth=1790&originalType=binary&ratio=2&rotation=0&showTitle=false&size=291335&status=done&style=none&taskId=u8f036953-c212-4ab7-8a9e-254c43da982&title=&width=571)<br />对应 docker logs 命令：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709138390108-1916125e-be75-48ea-ad4b-ce4e64fbf317.png#averageHue=%23fcf5e2&clientId=ua089cfaa-ce7f-4&from=paste&height=365&id=u42bc6ac7&originHeight=1244&originWidth=2128&originalType=binary&ratio=2&rotation=0&showTitle=false&size=667194&status=done&style=none&taskId=ua0e1d097-07b9-49b6-9dd2-592a0b8b698&title=&width=625)

### 查看容器的详情
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687192259502-c72f9238-f365-4e88-9ff1-279be0406ef3.png#averageHue=%23e5ebf3&clientId=ua5797894-9318-4&from=paste&height=441&id=ubafdaf2d&originHeight=1402&originWidth=2208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=188120&status=done&style=none&taskId=ub66fc860-a9c1-4f72-841f-a3b87818023&title=&width=694)<br />对应 docker inspect  命令：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709109854512-23aa34c9-9dfd-4633-8737-6ae874ef06df.png#averageHue=%23fcf5e2&clientId=u0982da9d-d9f0-4&from=paste&height=315&id=uf49d44d5&originHeight=856&originWidth=1954&originalType=binary&ratio=2&rotation=0&showTitle=false&size=197699&status=done&style=none&taskId=u6da163cd-f220-4608-95bb-58aa935b384&title=&width=718)

### 推送镜像
Docker 提供了 Docker Hub 镜像仓库，可以把本地镜像 push 到仓库，或从仓库 pull 镜像到本地。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687160408051-10ba7f7b-d4ae-4275-ac44-f970b0d13c0a.png#averageHue=%23e5eae2&clientId=udd7a494d-294b-4&from=paste&height=298&id=iS8YC&originHeight=415&originWidth=866&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=197267&status=done&style=none&taskId=u4a7f84b1-a1f6-45bd-9c69-ec62f9bf3c8&title=&width=622.7999877929688)<br />首先去 [docker hub](https://hub.docker.com/) 注册一个账户，登录 docker hub，输入用户名密码：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709823993174-a10989d2-c407-43ef-acc7-c07977c6c8f1.png#averageHue=%23fcf5e1&clientId=u0291f601-083e-4&from=paste&height=302&id=ub086d26c&originHeight=604&originWidth=1934&originalType=binary&ratio=2&rotation=0&showTitle=false&size=99673&status=done&style=none&taskId=u52d8c5bc-9539-463f-afcb-62e82e28f5c&title=&width=967)<br />首先对对镜像进行标记（tag）：
```bash
docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
```

- SOURCE_IMAGE[:TAG] 是本地已有的镜像名称和标签。
- TARGET_IMAGE[:TAG] 是要推送到仓库的目标镜像名称和标签。

发布镜像：
```bash
docker push TARGET_IMAGE[:TAG]
```

- TARGET_IMAGE[:TAG] 是已经标记的目标镜像名称和标签。

发布后，其他人可拉取并运行你的镜像。

### 管理数据卷
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687192311520-5276d29c-fa6d-4031-8798-3b5b4a230e77.png#averageHue=%23d2dde9&clientId=ua5797894-9318-4&from=paste&height=458&id=u686e1161&originHeight=1402&originWidth=2208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=256270&status=done&style=none&taskId=ud39914e4-a2ba-4105-afcc-cf4f400d015&title=&width=721)<br />使用 docker volume 命令：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709109905138-5ae56b5c-78fb-477d-9068-6347f99b5ca0.png#averageHue=%23fcf5e2&clientId=u0982da9d-d9f0-4&from=paste&height=251&id=u8f509bd2&originHeight=758&originWidth=1674&originalType=binary&ratio=2&rotation=0&showTitle=false&size=170167&status=done&style=none&taskId=ua9d9a3cd-63e7-4289-9ef2-6557b94e0a2&title=&width=555)

### 启动停止删除容器
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709110135665-7a2866b7-efb5-405a-bdad-047f2e129d1a.png#averageHue=%23f4f5f8&clientId=u0982da9d-d9f0-4&from=paste&height=201&id=U3vVI&originHeight=402&originWidth=2096&originalType=binary&ratio=2&rotation=0&showTitle=false&size=108094&status=done&style=none&taskId=u782604a5-53ee-4a63-967e-84a873f47e9&title=&width=1048)

- docker start container_name_or_id 启动一个已经停止的容器
- docker stop container_name_or_id  停止一个容器
- docker rm container_name_or_id 删除一个容器，如果正在运行，且你想强制删除：docker rm --force container_name_or_id

## 制作 dockerfile
Dockerfile 是一个文本文件，包含了一系列指令和配置，用来定义如何自动化构建 Docker 镜像。例如，可以指定基础镜像、工作目录、需要复制的文件、运行命令等。<br />Dockerfile 的基本结构非常简单，通常是从基础镜像开始，然后添加一系列的层，每一层都代表一个指令。

### 常用指令

1. **FROM：**指定基础镜像，后续的指令都是基于这个镜像进行的，所有的 Dockerfile 都必须以一个 FROM 指令开始。例如`FROM ubuntu:latest` 表示使用最新的 `Ubuntu` 镜像作为基础。
2. **RUN**：用于在镜像构建过程中运行命令。这些命令会在当前镜像的顶层添加一个新的层。
3. **CMD**：提供容器启动时的默认命令。一个 Dockerfile 中只能有一个 CMD 指令。 例如 `CMD ["nginx", "-g", "daemon off;"]` 会启动 nginx 服务器。
4. **LABEL**：添加元数据到镜像，比如作者、版本、描述等。例如 `LABEL version="1.0"`。
5. **EXPOSE**：声明容器运行时监听的端口。 例如：`EXPOSE 80` 表示容器将在运行时监听 `80` 端口。
6. **ENV**：设置环境变量。例如 `ENV NGINX_VERSION 1.15.8` 会设置一个名为 `NGINX_VERSION` 的环境变量，其值为 `1.15.8`。
7. **COPY**：复制本地文件或目录到镜像中，例如：`COPY . /app` 会将当前目录下的所有文件和目录复制到镜像的 `/app` 目录中。
8. **ADD**：与 COPY 类似，但可以自动解压压缩文件，并可以从 URL 添加文件。不过，推荐使用 COPY 指令，因为它更明确且易于理解。
9. **ENTRYPOINT**：配置容器启动时运行的命令，可以与 CMD 配合使用。

VOLUME：创建一个挂载点，用于容器与宿主机之间的数据共享。例如，`VOLUME /data` 会创建一个名为 `/data` 的挂载点，会生成一个临时目录关联容器 app 目录，这样就算后面 docker run 没 -v 指定数据卷，将来也可以找回数据。

10. **USER**：指定运行容器时的用户名或UID。例如 `USER nginx` 会以 `nginx` 用户的身份运行容器。
11. **WORKDIR**：设置工作目录，后续的 RUN、CMD、ENTRYPOINT、COPY 和 ADD 指令都会在这个目录下执行。例如  `WORKDIR /app`。

### ENTRYPOINT 与 CMD 的区别
在 Dockerfile 中，`ENTRYPOINT` 和 `CMD` 都可以用来指定容器启动时执行的命令，但还是有差别的：
#### ENTRYPOINT
`ENTRYPOINT` 的主要目的是指定容器启动时需要执行的命令和参数，它可以确保容器作为一个特定的应用或服务运行。<br />当使用 `ENTRYPOINT` 时，容器启动的命令会被固定下来，用户在运行容器时传递的任何额外参数都会被追加到 `ENTRYPOINT` 指定的命令之后。<br />例如，如果 Dockerfile 包含如下 `ENTRYPOINT`：
```dockerfile
ENTRYPOINT ["executable", "param1", "param2"]
```
那么在运行容器时传递的任何参数都会追加到这个命令之后。假设运行容器时传递了 `param3` 和 `param4`，那么容器实际执行的命令会变成：
```shell
executable param1 param2 param3 param4
```

#### CMD
`CMD` 也可以用来指定容器启动时执行的命令，但它更灵活。<br />如果 Dockerfile 中同时指定了 `CMD` 和 `ENTRYPOINT`，那么 `CMD` 中的内容会作为默认参数传递给 `ENTRYPOINT`。<br />如果只指定了 `CMD` 而没有指定 `ENTRYPOINT`，那么 `CMD` 中的命令和参数会在容器启动时执行。<br />用户在运行容器时传递的任何参数会覆盖 `CMD` 中的默认参数。<br />例如，Dockerfile 如下：
```dockerfile
CMD ["executable", "param1", "param2"]
```
如果用户在运行容器时没有传递任何参数，那么容器启动时执行的命令就是 `executable param1 param2`。<br />但如果用户传递了 `param3` 和 `param4`，那么这些将覆盖 `CMD` 中的默认参数，容器启动时执行的命令将变为 `executable param3 param4`。

#### 结合使用
在实践中，`ENTRYPOINT` 和 `CMD` 可以结合使用来提供更大的灵活性。<br />`ENTRYPOINT` 定义了容器的主要执行命令，而 `CMD` 提供了该命令的默认参数。<br />用户在运行容器时传递的任何参数都会追加到 `ENTRYPOINT` 指定的命令之后，这允许用户覆盖 `CMD` 中指定的默认参数。<br />例如：
```dockerfile
ENTRYPOINT ["executable"]
CMD ["param1", "param2"]
```
这样，如果用户在运行容器时没有传递任何参数，那么执行的命令会是 `executable param1 param2`。<br />如果用户传递了 `param3`，那么执行的命令将变为 `executable param3`，这里的 `param3` 覆盖了 `CMD` 中的默认参数。

### docker build 命令
`docker build` 用于创建 Docker 镜像：
```bash
docker build [OPTIONS] PATH | URL | -
```

- [OPTIONS]：构建镜像时可以指定的一系列选项。
- PATH | URL | -：指定 Dockerfile 所在的路径、URL 或者从标准输入读取 Dockerfile 的内容。

常见选项：

- `-t, --tag`：给创建的镜像打上标签，格式为 name:tag。
- `--build-arg`：设置构建镜像时的变量。
- `--file, -f`：指定要使用的 Dockerfile 路径。
- `--no-cache`：构建镜像时不使用缓存。
- `--rm`：设置为在构建过程失败时不移除中间容器，默认开启。
- `--squash`：将构建过程中产生的所有层合并成一层，减小镜像大小。

### 使用 dockerfile 构建一个镜像
```dockerfile
# 使用官方nginx镜像作为基础镜像  
FROM nginx:stable-alpine  
  
# 设置工作目录为/usr/share/nginx/html  
WORKDIR /usr/share/nginx/html  
  
# 将当前目录下的index.html文件复制到镜像的/usr/share/nginx/html目录中  
COPY index.html .  
  
# 暴露80端口供容器运行时使用  
EXPOSE 80  
  
# 启动nginx服务器并以前台模式运行（注意这里使用了CMD指令而不是ENTRYPOINT指令）  
CMD ["nginx", "-g", "daemon off;"]
```
后续项目目录执行：
```bash
docker build -t my-nginx-image:latest .
```
其中，`-t` 选项用于指定镜像的名称和标签，`.` 表示 Dockerfile 所在的当前目录。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709198264584-51fecabe-f8ac-4971-a910-e1a1a76b80fd.png#averageHue=%23c0954e&clientId=u2dd79188-9aeb-4&from=paste&height=390&id=u7715fad9&originHeight=1424&originWidth=2412&originalType=binary&ratio=2&rotation=0&showTitle=false&size=237716&status=done&style=none&taskId=u69ef4eef-4a18-40d8-bb61-53ccdc6850f&title=&width=661)<br />Docker 默认使用名为 Dockerfile 的文件作为构建指令的来源，但也可以通过 -f 参数指定其他文件名。<br />我们使用 docker build 命令构建一个名为 `my-app`、标签为 `v1` 的镜像：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709198386836-0ab851bc-ecee-46bc-9947-c7652b09a530.png#averageHue=%23f4f4f6&clientId=u2dd79188-9aeb-4&from=paste&height=411&id=u9474314e&originHeight=822&originWidth=2658&originalType=binary&ratio=2&rotation=0&showTitle=false&size=145588&status=done&style=none&taskId=ua02c6634-786e-406f-a2e0-18ccd3afc56&title=&width=1329)<br />点击 run 填写参数<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709198446044-66f33e17-ecd2-47c4-8e14-aecf5481bac9.png#averageHue=%23fcfcfc&clientId=u2dd79188-9aeb-4&from=paste&height=320&id=u4b13d125&originHeight=1264&originWidth=1068&originalType=binary&ratio=2&rotation=0&showTitle=false&size=84068&status=done&style=none&taskId=ub5fc8061-30e3-4950-88d3-b0f232dad98&title=&width=270)<br />点击 Run 之后，访问页面 [http://localhost:9999/](http://localhost:9999/)：<br /> ![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709198489406-39713ac9-57e4-439f-93e1-3aa42cb3190d.png#averageHue=%23f0f0f0&clientId=u2dd79188-9aeb-4&from=paste&height=86&id=u1626c4d7&originHeight=172&originWidth=578&originalType=binary&ratio=2&rotation=0&showTitle=false&size=19287&status=done&style=none&taskId=u32bd5860-94a0-4312-97be-a7dad0fb7b0&title=&width=289)<br />进入容器 files：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709198694937-df32bfce-b90c-41df-85ac-85e56127c9da.png#averageHue=%23f4f5f7&clientId=u2dd79188-9aeb-4&from=paste&height=377&id=u661b9aed&originHeight=1336&originWidth=826&originalType=binary&ratio=2&rotation=0&showTitle=false&size=93777&status=done&style=none&taskId=ub015e159-57fe-4af7-ac59-dd5bb20867f&title=&width=233)<br />可以发现这个 index.html 文件就是我们之前项目目录下 index.html 文件。<br />有没有办法，我们项目 index.html 改动容器内跟着改？<br />运行镜像：
```bash
docker run --name my-app-test2 -d -v ./:/usr/share/nginx/html -p 8888:80 my-app:v1
```

- `-v ./:/usr/share/nginx/htm`：当前目录（./）被映射到容器内的 `/usr/share/nginx/html` 目录。这意味着对宿主机当前目录的任何更改都会反映在容器的 `/usr/share/nginx/html` 目录中，反之亦然。

修改 index.html 文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709200027084-8acc88c7-6776-4e4f-8de3-47787e615789.png#averageHue=%23343330&clientId=uec1bf033-c89b-4&from=paste&height=238&id=u46f73118&originHeight=476&originWidth=592&originalType=binary&ratio=2&rotation=0&showTitle=false&size=49143&status=done&style=none&taskId=u45aa23f3-cffa-4fe8-9b43-868eff70be6&title=&width=296)<br />访问 [http://localhost:8888/](http://localhost:8888/)：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709200043745-e1b7d96e-077a-4868-872a-9d2d976febeb.png#averageHue=%23ebebeb&clientId=uec1bf033-c89b-4&from=paste&height=79&id=u9c426bc5&originHeight=158&originWidth=574&originalType=binary&ratio=2&rotation=0&showTitle=false&size=21076&status=done&style=none&taskId=u014a0eeb-f54a-4705-90c8-feafad47570&title=&width=287)<br />没问题。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709208180967-c3a95892-8248-4469-a71c-f997b2c81bfc.png#averageHue=%23acd890&clientId=u8d2574ea-c654-4&from=paste&height=65&id=ub0c980b0&originHeight=130&originWidth=1122&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48866&status=done&style=none&taskId=ucee10b6b-c972-4ede-9c54-b6abf3a00fe&title=&width=561)<br />这样一套流程就打通了。

## docker 原理

- Namespace 机制：实现资源的隔离
   - PID namespace：独立的进程 ID
   - IPC namespace：进程间通信限制
   - Mount namespace：文件系统隔离
   - Network namespace：网络资源隔离
   - User namespace：用户和用户组隔离
   - UTS namespace：主机名和域名隔离

通过这些 Namespace，Docker 确保了每个容器的独立性，使得在容器内运行的代码就像在一个独立的系统中运行一样。

- Control Group：资源访问限制
   - 通过设定 CPU、内存、磁盘使用参数，限制容器资源占用
- UnionFS：文件系统分层存储
   - 分层镜像设计，通过 UnionFS 合并形成完整文件系统
   - 镜像层的共享减少磁盘空间占用

Docker 的实现原理依赖于 Linux 的 Namespace、Control Group 和 UnionFS 这三种机制。

