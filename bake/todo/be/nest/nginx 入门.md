# 深入浅出：Docker + Nginx 的结合使用

在现代 Web 开发中，**Nginx** 和 **Docker** 是两种非常流行的技术。Nginx 是一个高性能的 Web 服务器，常用于静态资源托管和动态资源的反向代理；而 Docker 是一种轻量级的容器技术，可以运行几乎任何服务。那么，当这两者结合使用时，会碰撞出怎样的火花呢？本文将带你一步步探索 Docker + Nginx 的核心用法。

---

## 一、用 Docker 快速启动 Nginx

### 1. 拉取并运行 Nginx 容器

首先，我们需要从 Docker Hub 上拉取 Nginx 镜像并运行容器。假设你已经安装好了 Docker，直接运行以下命令即可：

```bash
docker run --name nginx1 -p 81:80 -d nginx
```

- `--name nginx1`：为容器命名为 `nginx1`。
- `-p 81:80`：将宿主机的 81 端口映射到容器内的 80 端口。
- `-d`：后台运行容器。

运行成功后，打开浏览器访问 `http://localhost:81`，你会看到 Nginx 的默认欢迎页面。这说明 Nginx 已经在容器中成功运行。

---

## 二、静态资源托管

Nginx 的一个重要功能是托管静态资源，比如 HTML、CSS、JS 文件。接下来，我们通过一个简单的例子，学习如何用 Nginx 托管自定义的静态页面。

### 1. 找到 Nginx 的静态文件目录

Nginx 默认的静态文件目录是 `/usr/share/nginx/html`。我们可以通过以下命令将这个目录复制到宿主机：

```bash
docker cp nginx1:/usr/share/nginx/html ~/nginx-html
```

这会将容器内的静态文件目录复制到宿主机的 `~/nginx-html` 目录中。你可以在这个目录下看到默认的 `index.html` 文件。

### 2. 替换静态文件

现在，我们可以将自己的 HTML 文件放到 `~/nginx-html` 目录下，比如创建两个简单的文件：

```bash
echo "Hello, Nginx!" > ~/nginx-html/hello.html
echo "Welcome to Docker + Nginx!" > ~/nginx-html/welcome.html
```

然后将修改后的目录复制回容器中：

```bash
docker cp ~/nginx-html nginx1:/usr/share/nginx/html
```

刷新浏览器，访问 `http://localhost:81/hello.html` 或 `http://localhost:81/welcome.html`，你会看到自定义的页面内容。

---

## 三、深入理解 Nginx 配置文件

Nginx 的核心是其配置文件。默认的主配置文件路径是 `/etc/nginx/nginx.conf`，而具体的路由配置通常在 `/etc/nginx/conf.d` 目录下的子配置文件中。

### 1. 配置文件的结构

主配置文件 `/etc/nginx/nginx.conf` 的结构大致如下：

```nginx
http {
    include /etc/nginx/conf.d/*.conf;
    ...
}
```

这里的 `include` 指令会引入 `/etc/nginx/conf.d` 目录下的所有子配置文件。默认情况下，`/etc/nginx/conf.d/default.conf` 是主要的路由配置文件。

### 2. 路由配置的语法

在 Nginx 中，`location` 指令用于定义路由规则。以下是 4 种常见的 `location` 语法：

- **精准匹配**：`location = /aaa`，仅匹配 `/aaa`。
- **普通前缀匹配**：`location /bbb`，匹配以 `/bbb` 开头的路径。
- **正则匹配**：`location ~ /ccc.*html`，匹配符合正则表达式的路径（区分大小写）。
- **高优先级前缀匹配**：`location ^~ /ddd`，匹配以 `/ddd` 开头的路径，并优先于正则匹配。

优先级从高到低依次为：精准匹配（`=`） > 高优先级前缀匹配（`^~`） > 正则匹配（`~` 或 `~*`） > 普通前缀匹配。

---

## 四、动态资源的反向代理

除了静态资源托管，Nginx 的另一大功能是反向代理。它可以将用户的请求转发到后端的应用服务器，并在中间做一些处理。

### 1. 什么是反向代理？

简单来说，反向代理是用户请求的中转站。用户的请求先到达 Nginx，Nginx 再将请求转发给后端服务器。如下图所示：

- **正向代理**：代理用户的请求，方向与用户一致。
- **反向代理**：代理服务器的响应，方向与用户相反。

### 2. 配置反向代理

假设我们有一个运行在 `http://localhost:3000` 的后端服务（比如一个 Nest.js 应用），我们可以通过以下配置让 Nginx 代理这个服务：

```nginx
location ^~ /api {
    proxy_pass http://localhost:3000;
}
```

将上述配置添加到 `/etc/nginx/conf.d/default.conf` 中，并重新加载 Nginx 配置：

```bash
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
docker exec nginx1 nginx -s reload
```

现在，访问 `http://localhost:81/api`，Nginx 会将请求转发到后端服务。

---

## 五、负载均衡

当后端有多个实例时，Nginx 可以通过负载均衡将请求分发到不同的服务器。以下是 Nginx 支持的 4 种负载均衡策略：

1. **轮询**（默认）：请求依次分发到每个服务器。
2. **权重**：为每个服务器设置权重，权重越高，被分配到的请求越多。
3. **IP 哈希**：根据用户的 IP 地址分配服务器，保证同一用户的请求总是访问同一台服务器。
4. **响应时间优先**：根据服务器的响应时间分配请求（需要安装插件）。

### 配置示例

假设我们有两个后端实例，分别运行在 `http://localhost:3001` 和 `http://localhost:3002`，可以通过以下配置实现负载均衡：

```nginx
upstream backend {
    server localhost:3001;
    server localhost:3002;
}

location /api {
    proxy_pass http://backend;
}
```

如果想设置权重，可以这样写：

```nginx
upstream backend {
    server localhost:3001 weight=2;
    server localhost:3002;
}
```

重新加载配置后，Nginx 会按照权重 2:1 的比例分发请求。

---

## 六、总结

通过本文的学习，我们掌握了 Docker + Nginx 的核心用法：

1. **静态资源托管**：将文件放到 `/usr/share/nginx/html` 目录下即可。
2. **反向代理**：通过 `proxy_pass` 将请求转发到后端服务。
3. **负载均衡**：通过 `upstream` 配置多个后端实例，并选择合适的分发策略。

Nginx 的配置灵活且强大，掌握了静态资源托管、反向代理和负载均衡，你就已经掌握了 Nginx 的核心功能。未来，你还可以探索更多高级功能，比如 HTTPS 配置、缓存优化等。希望本文能为你的开发工作带来帮助！
