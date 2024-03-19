Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。<br />它允许用户通过一个 YAML 文件来配置应用程序的服务，这个文件称为 docker-compose.yml。<br />使用 Docker Compose，您可以轻松地管理多个 Docker 容器的部署，包括启动、停止和重启服务，以及查看运行状态等。

## 基本组成

- Services：在 docker-compose.yml 文件中，可以定义多个服务，每个服务都将运行在一个或多个容器中。
- Networks：可以为服务指定网络，以控制容器之间的通信方式。
- Volumes：可以定义数据卷，以便在容器之间共享数据或持久化数据。

## 创建 Nest 引入 mysql 服务
创建 Nest 项目试试：
```bash
nest new docker-compose-test -p npm
```
安装 tyeporm、mysql2：
```bash
npm install @nestjs/typeorm typeorm mysql2
```
在 mysql workbench 里创建个 database：
```bash
CREATE DATABASE `test` DEFAULT CHARACTER SET utf8mb4;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709356379491-d0c5c19f-2cb4-4ee7-94f6-84b3216bef96.png#averageHue=%23f6f4f1&clientId=u175236f7-de9b-4&from=paste&height=51&id=uf75f43b1&originHeight=102&originWidth=1230&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51712&status=done&style=none&taskId=u0e5088b2-02e4-4470-9423-9cca93c7d80&title=&width=615)<br />在 AppModule 引入 TypeOrmModule：
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'xxx',
      database: 'test',
      synchronize: true,
      logging: true,
      entities: [],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
src 目录下创建 test.entity.ts：
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
```
在 entities 里注册下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709356447375-e2488ed1-d956-49c5-ae91-6cbff91c2f2b.png#averageHue=%232d2c2a&clientId=u175236f7-de9b-4&from=paste&height=233&id=u35c14794&originHeight=466&originWidth=714&originalType=binary&ratio=2&rotation=0&showTitle=false&size=46372&status=done&style=none&taskId=ub6fca654-c732-4878-9540-0f75660eafa&title=&width=357)<br />启动 Nest 服务：
```bash
npm run start:dev
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709356555132-6bfa75b3-5afe-4f25-ad6d-39e40cb3a3fe.png#averageHue=%23dcdad6&clientId=u175236f7-de9b-4&from=paste&height=345&id=u12e1cb95&originHeight=690&originWidth=1086&originalType=binary&ratio=2&rotation=0&showTitle=false&size=173030&status=done&style=none&taskId=u5a442c8f-7e7c-4a82-9332-858d2cc2366&title=&width=543)<br />mysql 服务没问题。


## 引入 redis 服务
```bash
npm install redis
```
AppModule 添加一个 redis：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688263454096-a582fef3-3ccd-40a3-9dd4-bd88edd63099.png#averageHue=%23312e2b&clientId=uf3c0a678-2fab-4&from=paste&height=419&id=uf6f2c9ee&originHeight=1012&originWidth=834&originalType=binary&ratio=2&rotation=0&showTitle=false&size=95966&status=done&style=none&taskId=u06f996d7-417a-4186-a64c-497c7749ab3&title=&width=345)
```typescript
{
  provide: 'REDIS_CLIENT',
  async useFactory() {
    const client = createClient({
      socket: {
        host: 'localhost',
        port: 6379,
      },
    });
    await client.connect();
    return client;
  },
},
```
在 AppControll 里注入下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688264019002-84e681bb-feca-4623-b93a-f2a2786afc74.png#averageHue=%23322e2b&clientId=uf3c0a678-2fab-4&from=paste&height=435&id=u89c38785&originHeight=1060&originWidth=1396&originalType=binary&ratio=2&rotation=0&showTitle=false&size=185382&status=done&style=none&taskId=uba3bdc82-3ce5-476b-bba6-3b60edaae92&title=&width=573)<br />然后访问下 [http://localhost:3000](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000) 后。<br />服务端打印了 redis 里的 key：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709357034665-40809dbd-5f72-45d6-bc5e-e5ff9951eea1.png#averageHue=%232d2d2d&clientId=u175236f7-de9b-4&from=paste&height=21&id=u46d65ff8&originHeight=42&originWidth=574&originalType=binary&ratio=2&rotation=0&showTitle=false&size=4980&status=done&style=none&taskId=ub6277ecc-4304-407f-9cc7-600c952c0eb&title=&width=287)<br />这就说明 redis 服务也连接成功了。

## 没有 docker compose
假设我们 nest 服务开发完了，想部署，那就要写这样的 dockerfile：
```dockerfile
# Step 1: 使用带有 Node.js 的基础镜像
FROM node:18-alpine as builder

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json（如果可用）
COPY package*.json ./

# 安装项目依赖
RUN npm install --only=production

# 安装 nest CLI 工具（确保它作为项目依赖被安装）  
RUN npm install @nestjs/cli -g

# 复制所有文件到容器中
COPY . .

# 构建应用程序
RUN npm run build

# Step 2: 运行时使用更精简的基础镜像
FROM node:18-alpine

# 创建 runc 的符号链接
RUN ln -s /sbin/runc /usr/bin/runc

WORKDIR /usr/src/app

# 从 builder 阶段复制构建好的文件
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# 暴露 3000 端口
EXPOSE 3000

# 运行 Nest.js 应用程序
CMD ["node", "dist/main"]
```
因为我们项目依赖 mysql，redis，所以我们要先运行 mysql、redis 镜像，最后才能运行 nest 镜像。<br />我们运行之后还会报错：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688268856921-01b91c9f-4280-485a-9f03-72e69b459e89.png#averageHue=%23373636&clientId=uf3c0a678-2fab-4&from=paste&height=309&id=u3ad563be&originHeight=618&originWidth=2336&originalType=binary&ratio=2&rotation=0&showTitle=false&size=245631&status=done&style=none&taskId=u1b7516c6-858d-4dcc-ba4e-45556f15e1d&title=&width=1168)<br />说是 127.0.0.1 的 6379 端口连不上。<br />注意 nest 容器里需要使用宿主机 ip 来访问 mysql、redis 服务，所以我们在 nest 应用里面要把 mysql 和 redis 的 host 全改写宿主机 ip。<br />终端输入 ifconfig，在 en0 找到自己的 ip。<br />之后 dockerfile build 一个 nest 镜像，分别按顺序运行 mysql、redis 和 nest 镜像即可。

## 引入 docker compose
**编写 docker-compose.yml 文件：**根目录添加一个 docker-compose.yml，定义服务、网络和数据卷等：
```yaml
version: '1.0'
# 定义服务，即需要运行的容器集合  
services:  
  # 定义一个名为'nest-app'的服务  
  nest-app:  
    # 构建配置，指定Dockerfile的路径和上下文  
    build:  
      # 指定Docker构建上下文的路径，通常是Dockerfile所在的目录  
      context: ./  
      # 指定Dockerfile的路径，相对于构建上下文  
      dockerfile: ./Dockerfile  
    # 定义该服务所依赖的其他服务，它们将按照依赖顺序启动  
    depends_on:  
      # 依赖名为'mysql-container'的服务  
      - mysql-container  
      # 依赖名为'redis-container'的服务  
      - redis-container  
    # 端口映射，将宿主机的3000端口映射到容器的3000端口  
    ports:  
      - '3000:3000'
    
  # 定义一个名为'mysql-container'的服务，使用mysql镜像  
  mysql-container:  
    # 指定使用mysql官方Docker镜像  
    image: mysql  
    # 端口映射，将宿主机的3306端口映射到容器的3306端口  
    ports:  
      - '3306:3306'  
    # 数据卷配置，用于持久化存储  
    volumes:  
      # 将宿主机的/Users/yunmu/Desktop/mysql目录映射到容器的/var/lib/mysql目录  
      - /Users/yunmu/Desktop/mysql:/var/lib/mysql
    environment:
      MYSQL_DATABASE: test
      MYSQL_ROOT_PASSWORD: xxx
    
  # 定义一个名为'redis-container'的服务，使用redis镜像  
  redis-container:  
    # 指定使用redis官方Docker镜像  
    image: redis  
    # 端口映射，将宿主机的6379端口映射到容器的6379端口  
    ports:  
      - '6379:6379'  
    # 数据卷配置，用于持久化存储  
    volumes:  
      # 将宿主机的/Users/yunmu/Desktop/redis目录映射到容器的/data目录  
      - /Users/yunmu/Desktop/redis:/data
```
每个 services 都是一个 docker 容器，名字随便指定。

**启动服务：**运行以下命令来启动所有定义的服务：
```bash
docker-compose up
```
它会把所有容器的日志一起输出，先跑的 mysql、redis，再跑的 nest。<br />也可以运行这个命令：
```bash
docker-compose up -d --build --force-recreate
```

- `-d`：Detached mode，意味着 Docker Compose 会在后台运行容器。
- -`-build`：在启动服务之前强制重构建服务关联的镜像。
- `--force-recreate`：即使容器的配置没有改变，也强制重新创建容器。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709363254519-93c3d2ca-810f-4993-9504-860e1749a36b.png#averageHue=%23f3f5f8&clientId=u7fd74fe7-e475-4&from=paste&height=200&id=ufd143476&originHeight=400&originWidth=2068&originalType=binary&ratio=2&rotation=0&showTitle=false&size=107990&status=done&style=none&taskId=u83e4d6ca-9db1-425e-a6c7-dad98fdd823&title=&width=1034)<br />成功创建。

浏览器访问下 [http://localhost:3000/](http://localhost:3000/)：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709363283358-feafd811-de15-441a-b6a8-5e16cb05e778.png#clientId=u7fd74fe7-e475-4&from=paste&height=81&id=u6f3d4779&originHeight=162&originWidth=498&originalType=binary&ratio=2&rotation=0&showTitle=false&size=12911&status=done&style=none&taskId=uf3d8faf0-3d18-4897-be9f-2c5365621f8&title=&width=249)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709362771025-4896abe9-c45a-470f-92c8-ba439b872d84.png#clientId=u7fd74fe7-e475-4&from=paste&height=513&id=uc34d78c2&originHeight=1428&originWidth=2178&originalType=binary&ratio=2&rotation=0&showTitle=false&size=344832&status=done&style=none&taskId=uaf52e422-99be-4c47-8edb-03db4aa4bfe&title=&width=782)<br />nest 容器内打印了 redis 的 key。

**停止移除 Docker Compose 启动的容器：**
```bash
docker-compose down
```
如果还想移除对应的镜像，请使用：
```bash
docker-compose down --rmi all
```

## 桥接网络
Docker 桥接网络是一种网络模式，允许容器在同一个宿主机上进行通信，同时与宿主机以及其他未连接到该桥接网络的容器隔离。<br />在 Docker 桥接网络中，每个容器都会被分配一个独立的IP地址，并且这些IP地址都是与宿主机不同的。<br />Docker 通过桥接器（bridge）将这些容器连接起来，形成一个虚拟的网络环境。<br />容器之间可以通过这个网络环境进行通信，而宿主机也可以通过桥接器与容器进行通信。

Docker桥接网络适用于在同一个宿主机上运行的容器之间的通信。如果需要在不同宿主机上的容器之间进行通信，则可以使用Docker的覆盖网络（overlay network）。

当启动一个Docker容器时，如果没有指定网络模式，那么默认会使用桥接网络。可以通过Docker命令或Docker Compose文件来配置容器的网络模式。<br />通过 docker network 来创建叫桥接网络：
```bash
docker network create common-network
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709363704107-08ded304-7fca-40bc-a5e4-ad8e5b0fe348.png#clientId=u7fd74fe7-e475-4&from=paste&height=43&id=ub3d679eb&originHeight=86&originWidth=1190&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15899&status=done&style=none&taskId=uf68f8fd7-faca-4ba7-998a-84d97b4c611&title=&width=595)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709363735932-b883c5d1-7b8d-47d8-ac98-aeb386fc239c.png#clientId=u7fd74fe7-e475-4&from=paste&height=614&id=uaf566ec0&originHeight=1227&originWidth=884&originalType=binary&ratio=2&rotation=0&showTitle=false&size=179235&status=done&style=none&taskId=u84a454f4-3d0e-414b-81a4-b0875ff5fdc&title=&width=442)<br />通过 networks 指定创建的 common-network 桥接网络，网络驱动程序指定为 bridge。<br />其实我们一直用的网络驱动程序都是 bridge，它的含义是容器的网络和宿主机网络是隔离开的，但是可以做端口映射。比如 -p 3000:3000、-p 3306:3306 这样。

修改 AppModule 的代码，改成用容器名来访问：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709364494860-91a8adb0-b1b8-4f49-a7f2-41132f9b27b4.png#averageHue=%232d2c2b&clientId=u7fd74fe7-e475-4&from=paste&height=509&id=u7395d0af&originHeight=1458&originWidth=874&originalType=binary&ratio=2&rotation=0&showTitle=false&size=160165&status=done&style=none&taskId=u746eb47f-042e-488f-9498-f50e563f41e&title=&width=305)<br />先删除之前的容器镜像：
```bash
docker-compose down --rmi all
```
运行 compose：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709364628901-07dd0946-d77b-4fb7-9a9f-06ac4ec29138.png#averageHue=%232d2d2d&clientId=u7fd74fe7-e475-4&from=paste&height=451&id=u8df2c06e&originHeight=902&originWidth=2242&originalType=binary&ratio=2&rotation=0&showTitle=false&size=278174&status=done&style=none&taskId=u0b7b4194-69b1-4838-a048-e39e42dc31a&title=&width=1121)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709364397061-0adb60f0-1e1c-4bb7-ac41-3c34f798aa0b.png#averageHue=%23f3f5f8&clientId=u7fd74fe7-e475-4&from=paste&height=192&id=uf9f21668&originHeight=384&originWidth=2092&originalType=binary&ratio=2&rotation=0&showTitle=false&size=101360&status=done&style=none&taskId=u3448c67c-f4f1-49a7-a2cb-956b1473f08&title=&width=1046)<br />成功运行。

其实不指定 networks 也可以，docker-compose 会创建个默认的：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709364588690-74d36c9d-6cc8-42b1-ae71-9e91e78022b7.png#averageHue=%232f2c2a&clientId=u7fd74fe7-e475-4&from=paste&height=523&id=u11de02fa&originHeight=1046&originWidth=756&originalType=binary&ratio=2&rotation=0&showTitle=false&size=151541&status=done&style=none&taskId=u09ef4a5c-32d6-4412-bf0d-baba8f8af78&title=&width=378)<br />运行 docker-compose up ， 你会发现它创建了一个默认的 network：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709364598644-1cbec5fb-2449-48e9-b8f3-70e0f5c67b92.png#averageHue=%232f2e2d&clientId=u7fd74fe7-e475-4&from=paste&height=266&id=u470a2be3&originHeight=531&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=268107&status=done&style=none&taskId=u2388eacc-5a7f-4b34-99b1-57ced575dd6&title=&width=750)<br />所以，不手动指定 networks，也是可以用桥接网络的。<br />我们如果不用 docker compose，可以在 docker run 的时候指定 --network，这样 3 个容器通过容器名也能互相访问。<br />比如：
```bash
docker run -d --network common-network -v /Users/yunmu/Desktop/mysql:/var/lib/mysql --name mysql-container mysql
docker run -d --network common-network -v /Users/yunmu/Desktop/redis:/data --name redis-container redis
docker run -d --network common-network -p 3000:3000 --name nest-container nest-image
```
其实本质就是对 Network Namespace 的处理，本来是 3 个独立的 Namespace，当指定了 network 桥接网络，就可以在自己 Namespace 下访问别的 Namespace 了。
