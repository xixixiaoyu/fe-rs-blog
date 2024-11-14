# 使用 Docker 构建高效的 Nest.js 应用镜像

在现代开发中，Docker 已经成为了构建、部署和管理应用的标准工具之一。它不仅能让我们轻松地在不同环境中运行应用，还能通过合理的配置和优化，极大地提升应用的性能和部署效率。本文将通过一个 Nest.js 项目，详细介绍如何使用 Docker 构建高效的应用镜像，并探讨如何通过 `.dockerignore` 和多阶段构建来优化镜像体积。

## Docker 构建的核心：Docker Daemon

首先，我们需要明确一个问题：**Dockerfile 是在哪里构建的？** 是在命令行工具里，还是在 Docker 守护进程（Docker Daemon）中？

答案是：**在 Docker Daemon 中**。

当我们执行 `docker build` 命令时，命令行工具会将 Dockerfile 和构建上下文（即当前目录的所有文件）打包并发送给 Docker Daemon，后者负责实际的镜像构建工作。因此，如果 Docker Daemon 没有启动，构建过程是无法进行的。

### 构建上下文与 `.dockerignore`

在执行 `docker build` 时，我们通常会指定构建上下文的目录，比如：

```bash
docker build -t myapp:latest -f Dockerfile .
```

这里的 `.` 就是构建上下文的目录，表示当前目录的所有文件都会被打包并发送给 Docker Daemon。然而，很多文件在构建镜像时并不需要，比如文档、测试文件、开发依赖等。为了避免不必要的文件被打包，我们可以使用 `.dockerignore` 文件来指定哪些文件或目录应该被忽略。

一个典型的 `.dockerignore` 文件可能是这样的：

```plaintext
*.md
!README.md
node_modules/
.git/
.DS_Store
.vscode/
.dockerignore
```

- `*.md`：忽略所有 `.md` 结尾的文件，但 `!README.md` 表示保留 `README.md`。
- `node_modules/`：忽略 `node_modules` 目录下的所有文件。
- `.git/`：忽略 Git 相关的文件。
- `.DS_Store`：忽略 macOS 系统生成的目录配置文件。

通过 `.dockerignore`，我们可以显著减少构建上下文的大小，从而加快构建速度并减小镜像体积。

## 多阶段构建：优化镜像体积的利器

在构建应用时，通常会有一些文件在构建阶段是必须的，但在生产环境中却不再需要。比如，源代码和开发依赖在构建时需要，但在运行时只需要构建后的产物和生产依赖。为了避免将不必要的文件打包进最终的镜像，我们可以使用 Docker 的**多阶段构建**。

### 示例：Nest.js 项目的多阶段构建

假设我们有一个 Nest.js 项目，项目的 Dockerfile 可以这样编写：

```dockerfile
# build stage
FROM node:18 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]
```

#### 解释：

1. **构建阶段（build stage）**：

   - 使用 `node:18` 作为基础镜像。
   - 将 `package.json` 复制到容器中，安装依赖并执行 `npm run build`，生成构建产物。

2. **生产阶段（production stage）**：
   - 使用 `node:18` 作为基础镜像。
   - 从构建阶段的镜像中复制 `dist` 目录和 `package.json` 文件。
   - 只安装生产依赖（`npm install --production`），并运行 `node /app/main.js`。

通过这种方式，最终的生产镜像中只包含运行时所需的文件，避免了将源代码和开发依赖打包进去，从而大大减小了镜像体积。

### 使用 Alpine 镜像进一步优化

虽然多阶段构建已经显著减小了镜像体积，但我们还可以通过使用更小的基础镜像来进一步优化。`Alpine` 是一个极简的 Linux 发行版，体积非常小，非常适合用作基础镜像。

我们可以将 Dockerfile 修改为使用 `Alpine` 版本的 Node.js 镜像：

```dockerfile
# build stage
FROM node:18.0-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18.0-alpine3.14 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]
```

使用 `Alpine` 镜像后，构建出来的镜像体积会大幅减小。例如，使用 `node:18.0-alpine3.14` 作为基础镜像后，最终的镜像体积可能只有 277MB，相比标准的 Node.js 镜像要小得多。

## 总结

通过本文的介绍，我们了解了如何使用 Docker 构建高效的 Nest.js 应用镜像，并通过 `.dockerignore` 和多阶段构建来优化镜像体积。具体来说：

1. **构建上下文**：`docker build` 会将构建上下文打包发送给 Docker Daemon，使用 `.dockerignore` 可以避免不必要的文件被打包，从而加快构建速度。
2. **多阶段构建**：通过多阶段构建，我们可以将构建阶段和生产阶段分离，最终的镜像只包含运行时所需的文件，显著减小镜像体积。
3. **Alpine 镜像**：使用 `Alpine` 作为基础镜像，可以进一步减小镜像体积，适合对体积有严格要求的场景。

通过这些优化手段，我们可以构建出更小、更高效的 Docker 镜像，从而提升应用的部署和运行效率。
