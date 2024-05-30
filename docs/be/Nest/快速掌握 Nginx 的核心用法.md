## docker 里使用 nginx
Nginx 是一款高性能的 Web 服务器，广泛用于静态资源托管和作为动态资源的反向代理。<br />Docker 是一个开放源代码的容器化技术，可以在容器中运行各种服务。

docker deskttop 搜索 nginx（需科学上网），点击 run：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688303838717-43d84ccc-cfe9-416c-b85d-5e3b05fb0843.png#averageHue=%231a2935&clientId=u7465b21a-3a98-4&from=paste&height=472&id=ue675f4a1&originHeight=1252&originWidth=1588&originalType=binary&ratio=2&rotation=0&showTitle=false&size=161059&status=done&style=none&taskId=u9dad22a8-d26a-47d0-b81f-2c1c94b9f06&title=&width=599)<br />输入容器名，将宿主机的 81 端口映射到容器的 80 端口，并启动容器：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688304434695-09573e8f-280f-4d54-bc69-18445385550f.png#averageHue=%231d2830&clientId=u7465b21a-3a98-4&from=paste&height=514&id=uecde54a3&originHeight=1328&originWidth=1828&originalType=binary&ratio=2&rotation=0&showTitle=false&size=160378&status=done&style=none&taskId=u4a67eb06-3b32-4632-8a63-d8fa8a687b2&title=&width=707)<br />浏览器访问下 [http://localhost:81](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A81) 可以看到 nginx 欢迎页面：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688304590915-0a6094e3-7f77-4c3a-9e77-9c9008b3d85a.png#averageHue=%23f2f2f2&clientId=u7465b21a-3a98-4&from=paste&height=241&id=u71dbb792&originHeight=534&originWidth=1680&originalType=binary&ratio=2&rotation=0&showTitle=false&size=85897&status=done&style=none&taskId=uc318f1b3-d05a-4ab9-9d5d-2e19f4d6da9&title=&width=759)

## 托管静态 html 页面
在 Docker 容器中，在 files 面板可以看到容器内的文件，静态文件默认存放在 /usr/share/nginx/html/ 目录下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688304710231-1e8624c5-63c0-4a04-b951-be0eec3ee3f3.png#averageHue=%23f6f7f8&clientId=u7465b21a-3a98-4&from=paste&height=510&id=uf1331625&originHeight=1406&originWidth=734&originalType=binary&ratio=2&rotation=0&showTitle=false&size=64779&status=done&style=none&taskId=u77ebc465-1d9f-4215-bd3a-6b0553f2e43&title=&width=266)<br />双击点开 index.html 看看：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688304777934-edd07044-6961-40ad-bab0-bba6c8c70691.png#averageHue=%23f6f6f8&clientId=u7465b21a-3a98-4&from=paste&height=443&id=uf55bbf2a&originHeight=886&originWidth=1460&originalType=binary&ratio=2&rotation=0&showTitle=false&size=138625&status=done&style=none&taskId=ufb32337c-e6c2-48a5-98fd-c625de519fc&title=&width=730)<br />就是我们之前访问的页面。

通过 Docker 的 docker cp 命令，可以在宿主机和容器之间复制文件。<br />我们先把这个目录复制出来：
```bash
docker cp  nginx1:/usr/share/nginx/html ~/nginx-html
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688305440805-2caf68a6-68ef-49db-8cb2-82728dbf88de.png#averageHue=%23fcf5e2&clientId=u7465b21a-3a98-4&from=paste&height=163&id=u59f47f7b&originHeight=326&originWidth=1954&originalType=binary&ratio=2&rotation=0&showTitle=false&size=71008&status=done&style=none&taskId=u74a3b534-312e-4ed8-aa3b-ce9a6342af7&title=&width=977)<br />比如我们把这个目录再复制到容器里：
```bash
docker cp  ~/nginx-html nginx1:/usr/share/nginx/html-xxx
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688305553217-e2e49e03-4880-4739-8a1c-5947ec0eb955.png#averageHue=%23f6f6f7&clientId=u7465b21a-3a98-4&from=paste&height=289&id=u2108ecc1&originHeight=648&originWidth=1490&originalType=binary&ratio=2&rotation=0&showTitle=false&size=52060&status=done&style=none&taskId=ue25d0c14-c1a0-4402-9769-9371365af8c&title=&width=664)<br />可以看到容器内就多了这个目录。<br />然后我们在这个目录下添加两个 html 来试试看：
```bash
echo aaa > aaa.html

echo bbb > bbb.html

docker cp  ~/nginx-html nginx1:/usr/share/nginx/html
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688306093576-28575997-1cc7-438f-aaf8-5b3dd5149bc0.png#averageHue=%23f5f6f7&clientId=u7465b21a-3a98-4&from=paste&height=316&id=uea4a413e&originHeight=632&originWidth=324&originalType=binary&ratio=2&rotation=0&showTitle=false&size=26614&status=done&style=none&taskId=uf0a37c73-cc75-4baf-bcb3-0810f86c330&title=&width=162)<br />我们需要先删除容器的这个目录，再复制：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688306114285-d3302821-8ec3-45a6-8c56-d46234aca79c.png#averageHue=%231d1e1e&clientId=u7465b21a-3a98-4&from=paste&height=153&id=ud601d404&originHeight=306&originWidth=500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=20477&status=done&style=none&taskId=u5b27afa4-21f3-40d9-b491-9ade1769e75&title=&width=250)
```bash
docker cp  ~/nginx-html nginx1:/usr/share/nginx/html
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688306164046-59ba024b-bd0e-4f11-b232-bb953d3f500b.png#averageHue=%23f3f4f6&clientId=u7465b21a-3a98-4&from=paste&height=285&id=u26298397&originHeight=570&originWidth=336&originalType=binary&ratio=2&rotation=0&showTitle=false&size=23902&status=done&style=none&taskId=ud979f499-e3d4-4f6d-89b9-56850f87955&title=&width=168)<br />这样就好了。<br />然后浏览器访问下试试：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688306198940-63354e70-f009-407f-a248-e2f8d6afa768.png#averageHue=%23f0f0f0&clientId=u7465b21a-3a98-4&from=paste&height=75&id=u5d2c65b4&originHeight=150&originWidth=602&originalType=binary&ratio=2&rotation=0&showTitle=false&size=11467&status=done&style=none&taskId=ue73361b0-fb8d-4b21-af67-a97cc77e6d1&title=&width=301)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688306222634-6ad5e199-9c16-4fba-80ba-4edb6eb3ebaf.png#averageHue=%23ececed&clientId=u7465b21a-3a98-4&from=paste&height=72&id=ub05287a1&originHeight=144&originWidth=592&originalType=binary&ratio=2&rotation=0&showTitle=false&size=11473&status=done&style=none&taskId=u19246c71-4bd4-4651-bd5a-c537bd82c44&title=&width=296)<br />现在就可以访问容器内的这些目录了。<br />也就是说只要放到 /usr/share/nginx/html 下的文件，都可以通过被访问到。<br />可是为什么呢？

## Nginx 配置文件解析
这是因为 nginx 的默认配置。<br />我们看下 nginx 主配置文件，也就是 /etc/nginx/nginx.conf，通常放一些全局配置，比如错误日志的目录等。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688307846529-e7669414-74ea-48e9-b3da-a3da9f18e88a.png#averageHue=%23f4f4f7&clientId=u7465b21a-3a98-4&from=paste&height=284&id=u5457ad31&originHeight=568&originWidth=668&originalType=binary&ratio=2&rotation=0&showTitle=false&size=40013&status=done&style=none&taskId=uc9cae638-d613-4bc1-bd54-65097c9a43d&title=&width=334)<br />复制出来看看：
```bash
docker cp  nginx1:/etc/nginx/nginx.conf ~/nginx-html
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688307922112-78b0e3b5-1188-426d-88ed-765bd6df1e4a.png#averageHue=%232b2b2b&clientId=u7465b21a-3a98-4&from=paste&height=497&id=uff59107c&originHeight=1778&originWidth=1852&originalType=binary&ratio=2&rotation=0&showTitle=false&size=224903&status=done&style=none&taskId=u0a602774-175d-483b-b37b-3205580e3a0&title=&width=518)<br />http 部分通过 include 指令引入 /etc/nginx/conf.d/*.conf 的子配置文件，这些文件通常包含具体的路由配置。

我们把这个目录也复制出来看看：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688308091137-df133a07-1b61-4d22-aa03-9313b01a96c0.png#averageHue=%23ce5927&clientId=u7465b21a-3a98-4&from=paste&height=346&id=u6c3568e9&originHeight=1186&originWidth=2920&originalType=binary&ratio=2&rotation=0&showTitle=false&size=215189&status=done&style=none&taskId=ue32cead2-45ef-4af1-baf0-ade9dcc5775&title=&width=852)<br />这里面就配置了 localhost:80 的虚拟主机下的所有路由。<br />虚拟主机就是可以用一台 nginx 服务器来为多个域名和端口的提供服务。<br />在 conf.d 目录下的配置文件中，可以设置针对特定虚拟主机的路由规则。

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
`nginx -s reload` 重新加载配置：<br />![](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688308516895-2952207a-8430-46af-abed-b2e485782dff.png?x-oss-process=image%2Fformat%2Cwebp#averageHue=%23537a9a&from=url&height=189&id=bFLhn&originHeight=356&originWidth=886&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&title=&width=471.5426025390625)

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
