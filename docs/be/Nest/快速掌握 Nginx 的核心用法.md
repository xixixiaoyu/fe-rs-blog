## docker 里使用 nginx
Nginx 是一款高性能的 Web 服务器，广泛用于静态资源托管和作为动态资源的反向代理。<br />Docker 是容器化技术，可以在容器中运行各种服务。

docker deskttop 搜索 nginx（需科学上网），点击 run：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086267380-37bbee21-e396-4f31-94a5-4bf2990c62c6.png#averageHue=%230e141b&clientId=ua81a4626-f81b-4&from=paste&height=547&id=u7818daf6&originHeight=984&originWidth=2678&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=207561&status=done&style=none&taskId=u9502421c-e5c6-4933-b307-61103226559&title=&width=1487.7778171904304)<br />输入容器名，将宿主机的 81 端口映射到容器的 80 端口，并启动容器：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086317581-eea41f3e-7480-48ed-84bc-75bde7fde637.png#averageHue=%231d2730&clientId=ua81a4626-f81b-4&from=paste&height=696&id=u5e764846&originHeight=1252&originWidth=1096&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=90653&status=done&style=none&taskId=u5da5abc0-739d-4721-9969-c3addc3dc39&title=&width=608.8889050189364)<br />浏览器访问下 [http://localhost:81](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A81) 可以看到 nginx 欢迎页面：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717084576514-5984b52f-016e-496e-adc7-0caca8db917d.png#averageHue=%23191b1a&clientId=ua81a4626-f81b-4&from=paste&height=301&id=u9a951c02&originHeight=542&originWidth=1790&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=84425&status=done&style=none&taskId=u22fe87ac-4030-4cfe-9b0a-1b74b48ecb2&title=&width=994.4444707882265)

## 托管静态 html 页面
在 Docker 容器中，在 files 面板可以看到容器内的文件，静态文件默认存放在 /usr/share/nginx/html/ 目录下：<br />双击其中 index.html 看看：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717084736410-528a761a-97a2-4baa-9f7a-cf6ec5f26fc6.png#averageHue=%231c2329&clientId=ua81a4626-f81b-4&from=paste&height=828&id=u7dc93d76&originHeight=1490&originWidth=1474&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=185417&status=done&style=none&taskId=udf02e70e-84df-4238-b915-c521b0db75a&title=&width=818.8889105820367)<br />这就是我们之前访问看到的页面。

通过 Docker 的 docker cp 命令，可以在宿主机和容器之间复制文件。<br />我们先把这个目录复制出来：
```bash
# 将名为 nginx1 的 Docker 容器中的 /usr/share/nginx/html 目录复制到宿主机的当前用户的主目录下，并命名为 nginx-html
docker cp nginx-test:/usr/share/nginx/html ~/nginx-html
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086374562-f150fd91-f512-47ea-b38e-2bd021597eb0.png#averageHue=%23353431&clientId=ua81a4626-f81b-4&from=paste&height=94&id=u7dce7473&originHeight=170&originWidth=934&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=23680&status=done&style=none&taskId=u94a1a707-04d5-41a0-bd75-84465ecfd5e&title=&width=518.8889026347506)<br />比如我们把这个目录再复制到容器里：
```bash
docker cp  ~/nginx-html/html nginx-test:/usr/share/nginx/html-test
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086416360-4ca1235a-0d02-44a8-ae38-de25762f11ce.png#averageHue=%23363532&clientId=ua81a4626-f81b-4&from=paste&height=90&id=u46c825d6&originHeight=162&originWidth=1088&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=24271&status=done&style=none&taskId=u6c9f5cda-d5e5-4c92-81ac-3d12543b888&title=&width=604.4444604567544)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086432513-0f2d9a3b-cfe4-48f1-adf5-04058b7c2403.png#averageHue=%2319252b&clientId=ua81a4626-f81b-4&from=paste&height=173&id=u526eaa4d&originHeight=312&originWidth=1334&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=22138&status=done&style=none&taskId=ud40c284c-1ba8-4220-aba8-33b349c6aa9&title=&width=741.1111307438514)<br />可以看到容器内就多了 html-test 目录。<br />我们右键删除下 html 文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086493161-46454f02-0d81-43f6-89d7-18891b329b1f.png#averageHue=%231f282e&clientId=ua81a4626-f81b-4&from=paste&height=204&id=ud982f029&originHeight=368&originWidth=420&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=20158&status=done&style=none&taskId=uf03df5ad-a249-41d7-b013-acf1f8c6b03&title=&width=233.33333951455592)<br />然后我们在宿主机进去 html-test 目录，添加两个文件，并复制到容器的 html 中：
```bash
cd nginx-html/html

echo hello test1 > test1.html

echo hello test2 > test2.html

docker cp  ~/nginx-html/html nginx-test:/usr/share/nginx/html
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086763051-bfde005f-c743-4364-b8d4-e9d05a3c45c5.png#averageHue=%2337322d&clientId=ua81a4626-f81b-4&from=paste&height=330&id=uecc3164b&originHeight=594&originWidth=1044&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=69455&status=done&style=none&taskId=u331cc3bd-6fa4-4d1e-8691-70b9567f454&title=&width=580.0000153647533)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086792898-42222056-7462-42b3-b456-fdfdbd433c43.png#averageHue=%23182328&clientId=ua81a4626-f81b-4&from=paste&height=319&id=u8d0b63bd&originHeight=574&originWidth=1330&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=45805&status=done&style=none&taskId=u87fdcad5-e4eb-4877-ae44-3f7637838d1&title=&width=738.8889084627604)<br />然后浏览器访问下试试：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086920341-86f6979f-aaa5-400e-92d6-09293fbeabbe.png#averageHue=%23191b1a&clientId=ua81a4626-f81b-4&from=paste&height=92&id=u21ac0d6b&originHeight=166&originWidth=588&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=13552&status=done&style=none&taskId=u7f010886-3dd8-4810-8dc3-c0c6e870aaf&title=&width=326.66667532037826)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717086936160-2eb9b11a-ed0d-4594-8dde-20d9beec4207.png#averageHue=%23191b1a&clientId=ua81a4626-f81b-4&from=paste&height=93&id=u30fb9016&originHeight=168&originWidth=604&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=14381&status=done&style=none&taskId=u7c3ae970-a42a-49a8-b5f6-d5b7998abbd&title=&width=335.55556444474234)<br />现在就可以访问容器内的这些目录了。<br />也就是说只要放到 /usr/share/nginx/html 下的文件，都可以通过被访问到。<br />这是因为 nginx 的默认配置。

## Nginx 配置文件解析
我们看下 nginx 主配置文件，也就是 /etc/nginx/nginx.conf，通常放一些全局配置，比如错误日志的目录等。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688307846529-e7669414-74ea-48e9-b3da-a3da9f18e88a.png#averageHue=%23f4f4f7&clientId=u7465b21a-3a98-4&from=paste&height=284&id=u5457ad31&originHeight=568&originWidth=668&originalType=binary&ratio=2&rotation=0&showTitle=false&size=40013&status=done&style=none&taskId=uc9cae638-d613-4bc1-bd54-65097c9a43d&title=&width=334)<br />复制出来看看：
```bash
docker cp  nginx1:/etc/nginx/nginx.conf ~/nginx-html
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688307922112-78b0e3b5-1188-426d-88ed-765bd6df1e4a.png#averageHue=%232b2b2b&clientId=u7465b21a-3a98-4&from=paste&height=497&id=uff59107c&originHeight=1778&originWidth=1852&originalType=binary&ratio=2&rotation=0&showTitle=false&size=224903&status=done&style=none&taskId=u0a602774-175d-483b-b37b-3205580e3a0&title=&width=518)<br />http 部分通过 include 指令引入 /etc/nginx/conf.d/*.conf 的子配置文件，这些文件通常包含具体的路由配置。<br />我们把这个目录也复制出来看看：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688308091137-df133a07-1b61-4d22-aa03-9313b01a96c0.png#averageHue=%23ce5927&clientId=u7465b21a-3a98-4&from=paste&height=346&id=u6c3568e9&originHeight=1186&originWidth=2920&originalType=binary&ratio=2&rotation=0&showTitle=false&size=215189&status=done&style=none&taskId=ue32cead2-45ef-4af1-baf0-ade9dcc5775&title=&width=852)<br />这里面就配置了 localhost:80 的虚拟主机下的所有路由。<br />虚拟主机就是可以用一台 nginx 服务器来为多个域名和端口的提供服务。<br />在 conf.d 目录下的配置文件中，可以设置针对特定虚拟主机的路由规则。

## location 指令详解
location 指令用于配置路由规则，支持多种匹配语法：

- location = /uri：精确匹配指定的 URI。
- location /uri：前缀匹配，匹配以 /uri 开头的任意路径。
- location ^~ /uri：前缀匹配，但优先级高于正则匹配。
- location ~ /pattern：正则匹配，区分大小写。
- location ~* /pattern：正则匹配，不区分大小写。

这些匹配语法的优先级顺序为：精确匹配（=） > 高优先级前缀匹配（^~） > 正则匹配 （~ 和 ~*）> 前缀匹配（/）。<br />例如：
```nginx
server {
    listen 80;
    server_name example.com;

    # 精确匹配 /，通常用于网站首页
    location = / {
        root /var/www/html;
        index index.html index.htm;
    }

    # 普通字符串匹配，匹配任何以 /images 开头的请求
    location /images/ {
        root /var/www/html;
    }

    # 正则匹配，区分大小写，匹配以 .png 结尾的请求
    location ~ \.png$ {
        root /var/www/images;
    }

    # 正则匹配，不区分大小写，匹配以 .jpg 或 .jpeg 结尾的请求
    location ~* \.(jpg|jpeg)$ {
        root /var/www/images;
    }

    # 最长非正则前缀匹配，匹配任何以 /documents 开头的请求
    # 并且不再检查后续的正则 location 块
    location ^~ /documents/ {
        root /var/www/html;
    }

    # 如果以上 location 块都不匹配，则使用这个默认的 location
    location / {
        root /var/www/html;
        index index.html index.htm;
    }
}
```

## root 与 alias 指令
root 和 alias 是 Nginx 配置中用来指定资源路径的两个指令，它们都可以用来定义服务器上文件的位置。
### root 指令
root 指令用于设置服务器中请求的根目录。当请求到来时，Nginx 会将请求的 URI 直接附加到 root 指定的路径后面，以此来定位文件：
```nginx
location /images/ {
    root /data;
}
```
如果有一个请求是 [http://example.com/images/cat.png](http://example.com/images/cat.png)，Nginx 会在 /data/images/cat.png 的位置寻找文件。

### alias 指令
alias 指令用于将请求的 URI 映射到服务器上的一个不同的路径，但它不会像 root 那样直接附加 URI：
```nginx
location /images/ {
    alias /data/pictures/;
}
```
如果有一个请求是 [http://example.com/images/cat.png](http://example.com/images/cat.png)，Nginx 会在 /data/pictures/cat.png 的位置寻找文件，注意这里的 URI /images/ 被替换成了 /data/pictures/。

综上所述，如果只是想为整个服务器或者某个特定的 location 设置一个基础路径，那么 root 是一个不错的选择。如果需要将某个 location 映射到一个完全不同的路径，那么 alias 更加合适。

## 文件访问机制
当客户端请求一个 URL 时，Nginx 根据配置文件中的 location 指令查找相应的文件：

1. 解析 URL：Nginx 解析客户端请求的 URL。
2. 匹配路径：根据 location 指令匹配请求路径。
3. 查找文件：使用 root 指定的目录作为基准目录，将请求路径拼接在 root 指定的目录后，查找相应的文件。

例如，当客户端请求 http://localhost/test1.html 时，Nginx 将：

1. 解析请求路径 /test1.html。
2. 匹配 location / 指令。
3. 使用 root /usr/share/nginx/html 指定的目录，将路径 /test1.html 拼接在后面，查找文件 /usr/share/nginx/html/test1.html。

因此，只要将文件放在 /usr/share/nginx/html 目录下，Nginx 就能根据请求路径正确找到并返回这些文件。

## 配置示例
以下是一些 location 配置示例，展示了如何返回静态 HTML 文件：
```nginx
location /222 {
  alias /usr/share/nginx/html;
}

location ~ ^/333/bbb.*\.html$ {
  alias /usr/share/nginx/html/bbb.html;
}
```
修改配置后，将宿主机上的 Nginx 配置文件 default.conf 复制到名为 nginx1 的 Docker 容器内的 /etc/nginx/conf.d/ 目录下：
```nginx
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```
在容器 exec 内输入 `nginx -s reload` 重新加载配置：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717087441595-b0c71b28-3c56-4adb-859d-ffc48a70ca40.png#averageHue=%2312191d&clientId=ua81a4626-f81b-4&from=paste&height=199&id=u39fbba25&originHeight=358&originWidth=1462&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=49064&status=done&style=none&taskId=uda9feca9-8523-4689-9fdf-03acfdf55fe&title=&width=812.2222437387637)

## 动态资源的反向代理
请求发给 nginx，由它转发给应用服务器，这一层也可以叫做网关。
### 正向代理与反向代理的区别

- 正向代理：用户通过代理服务器访问互联网，代理服务器代表用户发出请求，因此称为正向代理。
- 反向代理：用户请求服务器资源时，由代理服务器代替原始服务器响应请求，对用户来说是透明的，因此称为反向代理。

###  Nginx 反向代理配置实践
#### 创建 Nest.js 服务
```bash
npx nest new nest-app -p npm
```
启动服务：
```bash
npm run start:dev
```
当在浏览器访问 [http://localhost:3000](http://localhost:3000) 出现 "hello world" 时，表示服务启动成功。

#### Nginx 反向代理配置
首先，在 Nginx 配置文件中添加一个路由规则：
```bash
location ^~ /api {
    proxy_pass http://192.168.1.6:3000;
}
```
这条规则将所有以 /api 开头的 URL 请求代理到 [http://192.168.1.6:3000](http://192.168.1.6:3000)。其中，^~ 用于提高匹配优先级。<br />将修改后的配置文件复制到 Docker 容器中，并重新加载 Nginx 配置：
```bash
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```
此时，通过访问 [http://localhost:81/api](http://localhost:81/api)，可以看到 Nest.js 服务返回的响应。<br />实际路径上是从 Nest -> Nginx -> 浏览器 。

### Nginx 反向代理的作用
通过 Nginx 反向代理，我们可以在这一层进行多种操作，例如修改请求、响应信息，修改 HTTP 头部信息。<br />此外，Nginx 还可以实现负载均衡，通过将请求分配到不同的服务器来提高系统的可用性和扩展性。

## Nginx 负载均衡配置
Nginx 通过负载均衡机制，将接收到的请求按照预定规则分配到多个服务器上，以此提高系统的处理能力和可用性。
### 负载均衡策略
Nginx 支持多种负载均衡策略，包括：

- 轮询（Round Robin）：默认方式，。请求按时间顺序逐一分配到不同的后端服务器。
- 权重（Weight）：基于轮询，但可以设置不同服务器的权重。
- IP 哈希（IP Hash）：根据用户 IP 的哈希结果分配，可以解决会话持久性问题。
- 最少连接（Least Connections）：选择当前连接数最少的服务器。
- 响应时间（Fair）：根据服务器的响应时间来分配请求，需要安装 nginx-upstream-fair 插件。

### 实现权重和 IP 哈希策略
把之前 nest 服务停掉，在 3001 和 3002 端口 npm run start 各跑一个。<br />改下 nginx 配置文件，我们可以在 Nginx 配置文件的 upstream 模块中设置服务器实例：<br />![](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688313013678-7aaa1da1-8c2b-41a8-a71c-3298365b93f0.png?x-oss-process=image%2Fformat%2Cwebp#averageHue=%232e2d2b&from=url&height=404&id=bxHFZ&originHeight=970&originWidth=1354&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&title=&width=564.178955078125)<br />proxy_pass 通过 upstream 的名字来指定。此时是默认轮询的方式。<br />proxy_set_header 是设置请求头。

指定权重的策略：<br />![](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688313175614-acec1c6e-2daf-45cd-81a3-30fe2d8cbb79.png?x-oss-process=image%2Fformat%2Cwebp#averageHue=%2335302b&from=url&height=129&id=X11iB&originHeight=216&originWidth=888&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&title=&width=529.5426025390625)

我们也可以用  ip_hash 的方式（使用 ip_hash 算法实现会话粘性，即相同的客户端请求会被分发到同一台服务器上）<br />![](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688313469434-1c61e39d-47fc-4f4d-bc63-220a402e86a4.png?x-oss-process=image%2Fformat%2Cwebp#averageHue=%232b2b2b&from=url&height=154&id=E54mq&originHeight=262&originWidth=666&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&title=&width=391.99432373046875)<br />然后，将配置文件复制到 Docker 容器中，并 `nginx -s reload` 重新加载 Nginx 配置：
```bash
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```
在 nest 中加个路由：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688312144634-8bc3a79a-86a1-4c1a-8e57-3ceac9e7b254.png#averageHue=%23322f2c&clientId=u7465b21a-3a98-4&from=paste&height=161&id=oIAmN&originHeight=322&originWidth=846&originalType=binary&ratio=2&rotation=0&showTitle=false&size=41907&status=done&style=none&taskId=uc1edbf9f-7b5f-4ee4-a03b-0eb09b07449&title=&width=423)<br />添加一个全局的前缀：<br />![](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688311720669-035bb2fa-796e-495b-a5a7-021d4af28227.png?x-oss-process=image%2Fformat%2Cwebp#averageHue=%2334302b&from=url&height=207&id=LUJfY&originHeight=436&originWidth=1096&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&title=&width=521.178955078125)<br />访问 [http://localhost:81/api](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A81%2Fapi) ，看打印日志权重差不多是 1： 2 轮询几率：<br />![](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688313380863-8bb8d58a-a821-4e49-aeff-4f400f85e0c8.png?x-oss-process=image%2Fformat%2Cwebp#averageHue=%23353535&from=url&id=e4cjn&originHeight=474&originWidth=2630&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&title=)<br />command + k 清空控制台，然后请求，可以发现 ip_hash 是一直请求一台服务器：<br />![](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688313640245-05478eba-400d-48d4-801a-c2a2249537bb.png?x-oss-process=image%2Fformat%2Cwebp#averageHue=%23353535&from=url&id=UzoZ8&originHeight=620&originWidth=2092&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&title=)<br />这就是负载均衡。
