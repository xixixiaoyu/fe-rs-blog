# 使用 Docker Compose 优雅部署 Nest 项目：从零到一的实战指南

在现代 Web 开发中，微服务架构和容器化技术已经成为主流。对于一个典型的后端项目，比如基于 Nest.js 的服务，往往需要依赖多个服务，比如 MySQL 数据库和 Redis 缓存。为了简化开发和部署流程，我们可以利用 Docker 和 Docker Compose 来实现高效的容器管理。

本文将带你从零开始，逐步构建一个基于 Nest.js 的项目，并通过 Docker Compose 实现多容器的高效管理。无论你是初学者还是有一定经验的开发者，都能从中找到实用的技巧。

---

## 1. 项目背景：为什么需要 Docker Compose？

在开发 Nest.js 项目时，我们通常会依赖以下服务：

- **MySQL**：用于持久化存储数据。
- **Redis**：用于缓存和消息队列。
- **Nest.js 服务**：作为核心业务逻辑的实现。

这些服务通常运行在不同的 Docker 容器中。如果我们直接使用 Docker 来管理这些容器，可能会遇到以下问题：

1. **启动繁琐**：每次启动项目都需要手动运行多个 `docker run` 命令。
2. **启动顺序问题**：Nest.js 服务依赖 MySQL 和 Redis，如果它们未启动完成，Nest.js 服务可能会报错。
3. **配置复杂**：需要手动管理容器的端口映射、数据卷挂载等。

为了解决这些问题，Docker 提供了一个强大的工具——**Docker Compose**。它允许我们通过一个简单的配置文件（`docker-compose.yml`）来定义和管理多个容器，极大地简化了开发和部署流程。

---

## 2. 从零开始：构建 Nest.js 项目

### 2.1 初始化 Nest.js 项目

首先，我们创建一个新的 Nest.js 项目：

```bash
nest new docker-compose-test -p npm
```

安装必要的依赖：

```bash
npm install --save @nestjs/typeorm typeorm mysql2 redis
```

### 2.2 配置 MySQL 数据库

在 `AppModule` 中引入 `TypeOrmModule`，并配置 MySQL 数据库连接：

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // 后续会改为 Docker 容器的网络名
      port: 3306,
      username: 'root',
      password: 'guang',
      database: 'aaa',
      synchronize: true,
      logging: true,
      entities: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

在 MySQL 中创建一个名为 `aaa` 的数据库：

```sql
CREATE DATABASE `aaa` DEFAULT CHARACTER SET utf8mb4;
```

### 2.3 配置 Redis 缓存

添加一个 Redis 客户端的 provider：

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common'
import { createClient } from 'redis'

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost', // 后续会改为 Docker 容器的网络名
            port: 6379,
          },
        })
        await client.connect()
        return client
      },
    },
  ],
})
export class AppModule {}
```

在 `AppController` 中注入 Redis 客户端，并测试连接：

```typescript
// src/app.controller.ts
import { Controller, Get, Inject } from '@nestjs/common'
import { RedisClientType } from 'redis'

@Controller()
export class AppController {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  @Get()
  async getHello() {
    const keys = await this.redisClient.keys('*')
    console.log(keys)
    return 'Hello World!'
  }
}
```

---

## 3. 使用 Docker 构建和运行服务

### 3.1 编写 Dockerfile

在项目根目录下创建一个 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18.0-alpine3.14 as build-stage
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM node:18.0-alpine3.14 as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json
RUN npm install --production
EXPOSE 3000
CMD ["node", "/app/main.js"]
```

构建镜像：

```bash
docker build -t nest-app .
```

### 3.2 手动运行容器

分别运行 MySQL、Redis 和 Nest.js 容器：

```bash
docker run -d -p 3306:3306 --name mysql-container -e MYSQL_ROOT_PASSWORD=guang mysql
docker run -d -p 6379:6379 --name redis-container redis
docker run -d -p 3000:3000 --name nest-container nest-app
```

此时，你可能会发现 Nest.js 服务无法连接到 MySQL 和 Redis。这是因为容器之间的网络隔离导致的。为了解决这个问题，我们需要使用 Docker Compose。

---

## 4. 使用 Docker Compose 优化部署

### 4.1 编写 docker-compose.yml

在项目根目录下创建一个 `docker-compose.yml` 文件：

```yaml
version: '3.8'
services:
  mysql-container:
    image: mysql
    ports:
      - '3306:3306'
    environment:
      MYSQL_ROOT_PASSWORD: guang
      MYSQL_DATABASE: aaa
    volumes:
      - ./mysql-data:/var/lib/mysql

  redis-container:
    image: redis
    ports:
      - '6379:6379'
    volumes:
      - ./redis-data:/data

  nest-app:
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      - mysql-container
      - redis-container
    ports:
      - '3000:3000'
```

### 4.2 启动服务

运行以下命令启动所有容器：

```bash
docker-compose up
```

Docker Compose 会按照 `depends_on` 的顺序启动容器，确保 MySQL 和 Redis 在 Nest.js 服务之前启动。

---

## 5. 验证服务

访问 `http://localhost:3000`，检查日志输出，确认 MySQL 和 Redis 服务连接成功。

---

## 6. 总结

通过本文的实践，我们完成了以下内容：

1. 使用 Docker 构建和运行 Nest.js 项目。
2. 通过 Docker Compose 实现多容器的高效管理。
3. 简化了容器的启动流程，解决了服务依赖的启动顺序问题。

Docker Compose 的核心价值在于**声明式管理**和**自动化部署**。对于依赖多个服务的项目，它是不可或缺的工具。希望本文能帮助你更好地理解和使用 Docker Compose，让你的开发和部署更加高效！
