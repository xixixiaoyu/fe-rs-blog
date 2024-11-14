# 从零开始构建 Docker 镜像：一步步打造属于你的容器

在上节中，我们通过 Docker Hub 拉取了 Nginx 镜像，并成功运行了一个 Nginx 服务。你可能会好奇：如果我们想要自己制作一个类似的镜像，该怎么做呢？今天我们就来聊聊如何从零开始构建一个 Docker 镜像。

## Docker 容器的本质

Docker 容器本质上是一个独立的系统环境。想象一下，如果你在一台全新的服务器上安装 Nginx，你需要做什么？你可能会执行一些命令，复制一些文件，最后启动服务。制作 Docker 镜像的过程其实类似，只不过我们可以通过 Dockerfile 来自动化这些步骤。

## 什么是 Dockerfile？

Dockerfile 是一个文本文件，里面包含了一系列指令，告诉 Docker 如何构建镜像。每个指令都对应一个操作，比如安装软件、复制文件、暴露端口等。Docker 会根据这些指令一步步构建出一个镜像。

### 一个简单的 Dockerfile 示例

我们来看一个简单的 Dockerfile，它会构建一个基于 Node.js 的静态文件服务器：

```dockerfile
FROM node:latest

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install -g http-server

EXPOSE 8080

CMD ["http-server", "-p", "8080"]
```

#### 指令解析

- **FROM**：指定基础镜像，这里我们选择了 `node:latest`，它已经包含了 Node.js 和 npm。
- **WORKDIR**：设置工作目录为 `/app`，后续的操作都会在这个目录下进行。
- **COPY**：将当前目录的所有文件复制到容器的 `/app` 目录中。
- **RUN**：执行命令，这里我们设置了 npm 的镜像源，并全局安装了 `http-server`。
- **EXPOSE**：声明容器会使用的端口，这里是 8080。
- **CMD**：指定容器启动时执行的命令，这里是启动 `http-server`，并监听 8080 端口。

### 构建镜像

将上面的 Dockerfile 保存到项目根目录，然后在同级目录下创建一个简单的 `index.html` 文件。接下来，我们可以通过以下命令构建镜像：

```bash
docker build -t my-static-server:1.0 .
```

- `-t`：指定镜像的名称和标签，这里我们命名为 `my-static-server:1.0`。
- `.`：表示 Dockerfile 所在的当前目录。

构建完成后，你可以在 Docker Desktop 的镜像列表中看到这个新镜像。

### 运行容器

构建好镜像后，我们可以通过以下命令运行容器：

```bash
docker run -d -p 8888:8080 my-static-server:1.0
```

- `-d`：让容器在后台运行。
- `-p`：将宿主机的 8888 端口映射到容器的 8080 端口。

现在，打开浏览器访问 `http://localhost:8888`，你应该能看到 `index.html` 的内容。

## 挂载数据卷：让文件修改更方便

如果你想在不重建镜像的情况下修改静态文件，进入容器内部修改显然不太方便。我们可以通过挂载数据卷的方式，将宿主机的目录映射到容器内。

### 修改 Dockerfile

我们可以将 `/app` 目录设置为挂载点，修改后的 Dockerfile 如下：

```dockerfile
FROM node:latest

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install -g http-server

EXPOSE 8080

VOLUME ["/app"]

CMD ["http-server", "-p", "8080"]
```

这里我们新增了 `VOLUME` 指令，声明 `/app` 目录为挂载点。

### 重新构建镜像

保存修改后的 Dockerfile，并重新构建镜像：

```bash
docker build -t my-static-server:2.0 .
```

### 运行容器并挂载数据卷

这次我们运行容器时，将宿主机的某个目录挂载到容器的 `/app` 目录：

```bash
docker run -d -p 8888:8080 -v ~/Desktop:/app my-static-server:2.0
```

这样，宿主机桌面上的文件会自动映射到容器的 `/app` 目录。你可以直接在桌面上修改文件，刷新浏览器就能看到变化。

## VOLUME 指令的作用

你可能会问：既然可以通过 `-v` 参数挂载数据卷，为什么还要在 Dockerfile 里指定 `VOLUME` 呢？

在 Dockerfile 中指定 `VOLUME` 的好处是，即使你在运行容器时没有手动挂载数据卷，Docker 也会自动为你创建一个临时目录来保存数据。这样，即使你删除了容器，数据也不会丢失。

举个例子，MySQL 的官方 Dockerfile 中就声明了 `VOLUME`，确保数据库的数据不会因为容器的删除而丢失。

## 总结

通过这篇文章，我们从零开始构建了一个简单的 Docker 镜像，并通过 Dockerfile 自动化了镜像的构建过程。我们学习了如何使用 `FROM`、`WORKDIR`、`COPY`、`RUN`、`EXPOSE`、`CMD` 等指令来构建镜像，并通过 `VOLUME` 指令确保数据的持久化。

Dockerfile 是构建 Docker 镜像的核心工具，掌握它可以让你轻松构建出适合自己需求的镜像。希望通过这次实践，你对 Docker 镜像和容器有了更深入的理解。
