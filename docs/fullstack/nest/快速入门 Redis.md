## 引言
MySQL是一种关系型数据库，通过表和字段来存储信息，表与表之间通过 ID 关联。它使用 SQL 语言进行数据的增删改查操作。<br />由于 MySQL 是基于硬盘存储，并且需要解析执行 SQL 语句，这可能会导致性能瓶颈。<br />通常情况下，服务端执行计算的速度很快，但等待数据库查询结果的过程却较为缓慢。

## redis 简介
在计算机科学领域，性能优化的常见策略之一是使用缓存（cache）。考虑到内存与硬盘速度的显著差异，我们通常会采用内存数据库，如 Redis 作为缓存，以提高数据访问速度。<br />Redis 通常用作数据库、缓存或消息传递中间件。它以键值对（key-value pair）的形式设计，支持多种类型的值，例如：

- 字符串（String）
- 列表（List）
- 集合（Set）
- 有序集合（Sorted Set）
- 哈希表（Hash）
- 地理信息（Geospatial）
- 位图（Bitmap）

## Redis 的使用
在 Docker Desktop 中搜索 Redis，点击 Run：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687878928060-b644fce4-5515-4a29-aa91-5ef53bafc9fe.png#averageHue=%23141f2a&clientId=u5b1f3feb-6ddf-4&from=paste&height=466&id=ucbd66b68&originHeight=1564&originWidth=2448&originalType=binary&ratio=2&rotation=0&showTitle=false&size=288281&status=done&style=none&taskId=u1b3c057a-0fed-4be3-82ca-4b9ff254cb0&title=&width=729)<br />将宿主机的 6379 端口映射到容器内的 6379 端口，以便通过本机端口访问容器内 Redis 服务。

将宿主机的目录挂载到容器内的 /data 目录，确保数据保存在本机：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687879045960-95835350-01ac-4a9c-b7b8-f71b0c3782a8.png#averageHue=%23273540&clientId=u5b1f3feb-6ddf-4&from=paste&height=463&id=uce519a2c&originHeight=1286&originWidth=1096&originalType=binary&ratio=2&rotation=0&showTitle=false&size=94862&status=done&style=none&taskId=u10423578-a300-43b6-96f1-e59516229b4&title=&width=395)<br />运行成功后：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687879111816-d9da0b29-7d70-4404-92e8-bdc9eb3bbf7c.png#averageHue=%23171c20&clientId=u5b1f3feb-6ddf-4&from=paste&height=315&id=u78503b6a&originHeight=758&originWidth=1940&originalType=binary&ratio=2&rotation=0&showTitle=false&size=156663&status=done&style=none&taskId=u413943e6-ce06-4fba-b328-55cadbf9563&title=&width=805)<br />files 里可以看到所有的容器内的文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687879239934-220e2cb7-adf8-41d1-9a99-d35a4406226b.png#averageHue=%231f2b33&clientId=u5b1f3feb-6ddf-4&from=paste&height=292&id=uebceaed7&originHeight=744&originWidth=1938&originalType=binary&ratio=2&rotation=0&showTitle=false&size=112159&status=done&style=none&taskId=u982fac44-90c1-44ff-aeb4-e3bdad16588&title=&width=761)<br />这个 mounted 标志代表挂载的目录。<br />我们在本地目录添加一个文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687879369527-61e192d0-7e9a-427a-ba41-3fe067ccf5e9.png#averageHue=%23fbf4e2&clientId=u5b1f3feb-6ddf-4&from=paste&height=27&id=uf3a5885c&originHeight=54&originWidth=1296&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15254&status=done&style=none&taskId=ucc7cb2e1-9d08-41be-8136-c89103ac646&title=&width=648)<br />在容器内的 data 目录就能访问到这个文件了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687879406132-cbe0aa54-5913-43b3-8654-4940afddba7c.png#averageHue=%23202b33&clientId=u5b1f3feb-6ddf-4&from=paste&height=183&id=AZ14E&originHeight=408&originWidth=1922&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75714&status=done&style=none&taskId=u36c21682-af4f-41e5-aee9-7c348048359&title=&width=862)<br />同样，在容器内修改了 data 目录，那本机目录下也会修改。<br />使用 redis 也可以将数据持久化到硬盘。，不用 mysql。

## Redis 命令行操作
在 terminal 输入 redis-cli，进入交互模式：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687879538022-77d4306c-a858-47cd-80bd-fcf03f9d798d.png#averageHue=%23151c21&clientId=u5b1f3feb-6ddf-4&from=paste&height=211&id=ue0867c21&originHeight=422&originWidth=990&originalType=binary&ratio=2&rotation=0&showTitle=false&size=36397&status=done&style=none&taskId=uf5d66f06-3f33-4d73-bfe3-43fc76e1cca&title=&width=495)

### 字符串操作
set、get：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713105624846-d9f21b06-efef-4874-bc06-d7591783975f.png#averageHue=%23010100&clientId=u10b3ff1f-b6ec-4&from=paste&height=97&id=uae640dcb&originHeight=194&originWidth=434&originalType=binary&ratio=2&rotation=0&showTitle=false&size=43736&status=done&style=none&taskId=ue5e3f74a-ca42-481a-9621-2f6ca56cb31&title=&width=217)<br />incr 用于递增：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713105938668-e778795e-5d19-4fa2-aa0e-02d78b2fa940.png#averageHue=%23000100&clientId=u10b3ff1f-b6ec-4&from=paste&height=71&id=u0f23b57e&originHeight=142&originWidth=378&originalType=binary&ratio=2&rotation=0&showTitle=false&size=42622&status=done&style=none&taskId=uf3a1dd67-c759-4cf5-9393-195afa2aae1&title=&width=189)<br />适用于计数场景，如阅读量、点赞量。<br />使用 keys 命令，查询有哪些 key。keys 后支持模式匹配，如使用 * 查询所有键。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687879912993-49b0b863-d2d4-42bd-a464-43fa65f0c7f7.png#averageHue=%23000000&clientId=u5b1f3feb-6ddf-4&from=paste&height=386&id=u5d8f1ef4&originHeight=894&originWidth=442&originalType=binary&ratio=2&rotation=0&showTitle=false&size=74930&status=done&style=none&taskId=u04446dbc-29a0-4ce3-9f16-cac96b5bac0&title=&width=191)

## Redis GUI工具
这里的 GUI 工具用官方的 [RedisInsight](https://link.juejin.cn/?target=https%3A%2F%2Fredis.com%2Fredis-enterprise%2Fredis-insight%2F%23insight-form)。<br />点击 add database：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687880259817-62bf1a61-9d16-4840-90e0-78dbd9cff680.png#averageHue=%2332374f&clientId=u5b1f3feb-6ddf-4&from=paste&height=79&id=u7bf2fe9a&originHeight=158&originWidth=682&originalType=binary&ratio=2&rotation=0&showTitle=false&size=13500&status=done&style=none&taskId=uf5f67cc1-8950-4b27-841c-f484c5b2b13&title=&width=341)<br />连接信息用默认的就行：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687880325893-0806be3a-d3fc-4444-87d0-e5fe4a8d4c92.png#averageHue=%231f1f1f&clientId=u5b1f3feb-6ddf-4&from=paste&height=404&id=ue57fc4da&originHeight=1300&originWidth=2432&originalType=binary&ratio=2&rotation=0&showTitle=false&size=165495&status=done&style=none&taskId=u37ec69fe-ead5-4a12-b8ae-87e5119d2b5&title=&width=756)<br />然后就可以看到新建的这个链接：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687880295429-2ba9c1f6-5530-4585-b75b-56fc3c3f931c.png#averageHue=%23262626&clientId=u5b1f3feb-6ddf-4&from=paste&height=149&id=u0d522df2&originHeight=298&originWidth=2432&originalType=binary&ratio=2&rotation=0&showTitle=false&size=43849&status=done&style=none&taskId=u064cea94-16e4-4cdd-9c9d-1ab0985e6f5&title=&width=1216)<br />点击它就可以可视化看到所有的 key 和值：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687880415536-728a69f7-5980-41c6-9f5c-6a521001019f.png#averageHue=%231b1b1b&clientId=u5b1f3feb-6ddf-4&from=paste&height=531&id=ua87eb548&originHeight=1720&originWidth=2600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=164456&status=done&style=none&taskId=u4f4572e9-f559-425d-9101-86e382e79d0&title=&width=803)<br />同样也可以执行命令：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687880486637-643a107f-5136-49e9-94c3-85c4cc724afc.png#averageHue=%23171616&clientId=u5b1f3feb-6ddf-4&from=paste&height=498&id=u43e39a33&originHeight=1720&originWidth=2600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=219913&status=done&style=none&taskId=ufbecf371-1cce-41ec-88d8-438a4c38a6b&title=&width=753)

## 其他 Redis 数据结构
### 列表（List）：
#### lpush：从列表左侧添加元素
```bash
lpush list1 111
lpush list1 222
lpush list1 333
```
执行上面的命令，点击刷新，就可以最新值：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687880781634-f6c06ede-041f-40ab-a95d-c17ce8ff4e54.png#averageHue=%231b1a19&clientId=u5b1f3feb-6ddf-4&from=paste&height=304&id=u99eddbc1&originHeight=1024&originWidth=2556&originalType=binary&ratio=2&rotation=0&showTitle=false&size=127736&status=done&style=none&taskId=ufeb032dc-feac-4372-9e6d-9db7eb8af7c&title=&width=758)
#### rpush：从列表右侧添加元素
```bash
rpush list1 444
rpush list1 555
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687881081500-c4d46750-abf3-40e4-81c7-f1d4952c059c.png#averageHue=%231d1c1c&clientId=u5b1f3feb-6ddf-4&from=paste&height=234&id=u0b6d2991&originHeight=840&originWidth=2572&originalType=binary&ratio=2&rotation=0&showTitle=false&size=108822&status=done&style=none&taskId=u71fbd2c2-b268-43fb-99e2-211c311f3fb&title=&width=716)
#### lpop：从左侧移除元素
```bash
lpop list1
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687881283107-1837eb57-0ed5-437c-807d-b5be8abe1482.png#averageHue=%231e1e1e&clientId=u5b1f3feb-6ddf-4&from=paste&height=312&id=uedebb326&originHeight=704&originWidth=1166&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29482&status=done&style=none&taskId=u3abc4382-2b2b-4e37-b906-3a17ab456b7&title=&width=516)
#### rpop：从右侧移除元素
```bash
rpop list1
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687881346923-c9947096-ee6b-4c3f-bd50-694e7e97a97e.png#averageHue=%231e1e1e&clientId=u5b1f3feb-6ddf-4&from=paste&height=275&id=uf241222e&originHeight=634&originWidth=1172&originalType=binary&ratio=2&rotation=0&showTitle=false&size=26382&status=done&style=none&taskId=ub16b31c1-d355-4c19-bc6e-92c11ab1b05&title=&width=509)
#### lrange：获取列表中的元素
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687881405757-8b8971a7-4400-4c17-8688-17a7a6355b06.png#averageHue=%230e0f15&clientId=u5b1f3feb-6ddf-4&from=paste&height=100&id=u5c4990cf&originHeight=200&originWidth=1642&originalType=binary&ratio=2&rotation=0&showTitle=false&size=18471&status=done&style=none&taskId=uee6844f4-4b4e-4039-bec4-1dc2456e76b&title=&width=821)<br />`lrange list1 0 -1` 就是查询 list1 的全部数据。

### 集合（Set）
set 的特点是无序并且元素不重复。
#### sadd：添加元素，自动去重
```bash
sadd set1 111
sadd set1 111
sadd set1 111
sadd set1 222
sadd set1 222
sadd set1 333
```
刷新之后就可以看到它去重后的数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687881538067-64bb0075-2003-4a7e-8d72-57b1fc8c7d9e.png#averageHue=%231d1d1c&clientId=u5b1f3feb-6ddf-4&from=paste&height=258&id=uf020dce9&originHeight=726&originWidth=2546&originalType=binary&ratio=2&rotation=0&showTitle=false&size=95140&status=done&style=none&taskId=uaffd7fea-52bb-433d-ab02-99d18874a70&title=&width=905)
#### sismember：检查元素是否属于集合
```bash
sismember set1 111
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687881610049-5cf25dcb-f53f-4490-a686-3d6b69e8bf9a.png#averageHue=%231a1b24&clientId=u5b1f3feb-6ddf-4&from=paste&height=71&id=uafa0d067&originHeight=142&originWidth=322&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7220&status=done&style=none&taskId=u93eafeaa-69d9-4767-a48f-6a5126cef7c&title=&width=161)
```bash
sismember set1 444
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687881635695-0e1e13c3-7b0e-41c3-b841-2d2f95dff947.png#averageHue=%231d1e28&clientId=u5b1f3feb-6ddf-4&from=paste&height=67&id=ubc83a5a1&originHeight=134&originWidth=272&originalType=binary&ratio=2&rotation=0&showTitle=false&size=6902&status=done&style=none&taskId=ue91724a3-f7a3-4260-b21d-7772f12a023&title=&width=136)

### 有序集合（Sorted Set/ZSet）
#### zadd：添加元素，并指定分数（排序依据）
```bash
zadd zset1 4 yun
zadd zset1 2 yu
zadd zset1 1 dai
zadd zset1 3 mu
```
会按照分数来排序：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713192356710-9edad9f9-2030-48d1-b056-b8b265018958.png#averageHue=%231e1e1e&clientId=ufa5a5e2a-d0bf-4&from=paste&height=343&id=uf1d7e6da&originHeight=686&originWidth=1128&originalType=binary&ratio=2&rotation=0&showTitle=false&size=34596&status=done&style=none&taskId=ud1657f18-59d8-4467-a776-4d1d8e935fb&title=&width=564)
#### zrange：按分数获取元素
通过 zrange 命令取数据，比如取排名前三的数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713192892123-8df3d1bb-55aa-4690-8b2b-267b4ca8487f.png#averageHue=%2315161d&clientId=u6525ab20-63a1-4&from=paste&height=109&id=uf994493f&originHeight=218&originWidth=278&originalType=binary&ratio=2&rotation=0&showTitle=false&size=10573&status=done&style=none&taskId=uf9456134-076d-42d9-9ea8-6b11daa38b6&title=&width=139)

### 哈希表（Hash）
#### hset：设置键值对
```bash
hset hash1 key1 1
hset hash1 key2 2
hset hash1 key3 3
hset hash1 key4 4
hset hash1 key5 5
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687881910992-828ca10e-7989-4133-9c8e-508dec26a3ce.png#averageHue=%231d1d1d&clientId=u5b1f3feb-6ddf-4&from=paste&height=292&id=uca18133c&originHeight=820&originWidth=2496&originalType=binary&ratio=2&rotation=0&showTitle=false&size=112429&status=done&style=none&taskId=u737d91b7-843b-450d-8224-ecc57450e9e&title=&width=889)
#### hget：获取键对应的值
```bash
hget hash1 key3
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687881947038-f6b7dd09-8fd6-4c3a-b926-2955a3eaac93.png#averageHue=%231b1c25&clientId=u5b1f3feb-6ddf-4&from=paste&height=65&id=u7e17f1ee&originHeight=130&originWidth=232&originalType=binary&ratio=2&rotation=0&showTitle=false&size=6108&status=done&style=none&taskId=u388c1982-250b-4ab3-b1f3-14cd8c828d1&title=&width=116)

### 地理信息（Geo）
geo 的数据结构存储经纬度信息，根据距离计算周围的人用的：
#### geoadd：添加地理坐标
用 loc 作为 key，分别添加 yunyun 和 mumu 的经纬度：
```bash
geoadd loc 13.361389 38.115556 "yunyun" 15.087269 37.502669 "mumu" 
```
redis 实际使用 zset 存储的，把经纬度转化为了二维平面的坐标：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687882088040-ef1e70b8-72f2-4049-a6ec-a0eeb738c91b.png#averageHue=%231f1e1d&clientId=u5b1f3feb-6ddf-4&from=paste&height=317&id=ufa4f8054&originHeight=960&originWidth=2482&originalType=binary&ratio=2&rotation=0&showTitle=false&size=114794&status=done&style=none&taskId=ucde70336-ed34-4dd9-bc0c-8d430f0c345&title=&width=819)
#### geodist：计算两个坐标点之间的距离
```bash
geodist loc yunyun mumu
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687882230009-873284e7-f710-4eb9-9b96-6f9fe4f65031.png#averageHue=%231d1f27&clientId=u5b1f3feb-6ddf-4&from=paste&height=60&id=u6ef1cea6&originHeight=120&originWidth=358&originalType=binary&ratio=2&rotation=0&showTitle=false&size=8956&status=done&style=none&taskId=u1921af71-a310-4ffa-a11c-e4d5475d7af&title=&width=179)
#### georadius：搜索指定半径内的其他点
传入经纬度、半径和单位：
```bash
georadius loc 15 37 200 km
georadius loc 15 37 100 km
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687882297230-c944dc7a-654a-4f33-ba6a-af930e208aac.png#averageHue=%231a1b24&clientId=u5b1f3feb-6ddf-4&from=paste&height=163&id=uf969e1bb&originHeight=326&originWidth=368&originalType=binary&ratio=2&rotation=0&showTitle=false&size=21669&status=done&style=none&taskId=ub1e8a688-5484-4692-963f-667adaee9ff&title=&width=184)

## Redis的过期时间
Redis 的键可以通过 expire 命令设置过期时间，使用 ttl 命令查询剩余过期时间。<br />比如我设置 yun 的 key 为 30 秒过期：
```bash
expire yun 30
```
等到了过期时间就会自动删除。<br />想查看剩余过期时间使用 ttl：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687882871630-0fc4c8f1-6ae1-45f8-99ab-7a9d98996427.png#averageHue=%23171822&clientId=u5b1f3feb-6ddf-4&from=paste&height=148&id=ub0f7380e&originHeight=296&originWidth=720&originalType=binary&ratio=2&rotation=0&showTitle=false&size=21917&status=done&style=none&taskId=ue03773ee-44e4-4e90-b09f-99d6872ceb2&title=&width=360)<br />所有的命令都可以在官方文档查： [redis.io/commands/](https://link.juejin.cn/?target=https%3A%2F%2Fredis.io%2Fcommands%2F)
