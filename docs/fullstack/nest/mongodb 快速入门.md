## 前言
不同于传统的关系型数据库如 MySQL，数据存储在表格里，类似于 Excel 电子表格，其中数据按行（记录）和列（字段）组织。<br />MongoDB 是一种非关系型数据库，使用文档存储（document store），以类似 JSON 格式存储数据。

## 核心概念

- 数据库（database）：数据库是一个数据仓库，数据库服务下可以创建很多数据库，数据库中可以存放很多集合
- 集合（collection）：集合类似于 JS 中的数组，在集合中可以存放很多文档 
- 文档（document）：文档是数据库中的最小单位，类似于 JS 中的对象，文档可以包含不同的数据类型（如字符串、数字、数组、嵌套文档等）和复杂的嵌套结构。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710674313627-5b0fe936-8683-4d0b-afcf-31c7fc102892.png#clientId=u6db865b2-5ffa-4&from=paste&height=263&id=uf7796181&originHeight=656&originWidth=1028&originalType=binary&ratio=2&rotation=0&showTitle=false&size=306026&status=done&style=none&taskId=u50665938-c39f-4595-bf0d-a9faca4b33b&title=&width=412)

- MongoDB 使用 BSON， 一种类似于 JSON 的二进制格式（比 JSON 更多的数据类型，如日期和二进制数据类型），用于存储和传输 MongoDB 中的文档。
- 索引（Index）：索引支持对 MongoDB 集合中的数据进行快速搜索。默认情况下，每个集合都有一个对 _id 字段的自动索引。其他索引需要根据查询的需要手动添加。
- 复制集（Replica Set）：复制集是 MongoDB 中的数据冗余和备份机制，用于提高数据的可用性。复制集中的数据自动同步，确保所有副本都保存最新数据。在主节点故障时，复制集可以自动选举新的主节点，保证数据库的可用性。
- 分片（Sharding）：分片是 MongoDB 中的一种水平扩展方法。它涉及将数据分布在多个服务器上，每个服务器上存储数据集的一部分。分片可以提高大数据集的处理能力和吞吐量。
- 聚合（Aggregation）：聚合是一种强大的数据处理工具，用于执行复杂的数据搜索、过滤、分组和排序等操作。MongoDB 提供了聚合管道，允许用户定义一个数据处理的多阶段管道，每个阶段对数据进行操作并传递给下一阶段。
- 操作符（Operators）：在查询和更新文档时，操作符用于指定操作的类型。例如查询操作符（如 $gt、$lt 用于比较），更新操作符（如 $set 用于设置字段值），逻辑操作符（如 $and、$or）等。

##  安装与运行
### docker 安装
首先，我们需要在 docker desktop 中搜索 mongodb 镜像：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699806861129-e45bec59-3e0c-4fd5-905a-fa1f56aa1039.png#averageHue=%23172532&clientId=u55c423fb-370c-4&from=paste&height=511&id=uf01a1c8f&originHeight=1410&originWidth=1778&originalType=binary&ratio=2&rotation=0&showTitle=false&size=184441&status=done&style=none&taskId=u80fd1c66-d508-4bfc-9ab1-f7d53995320&title=&width=644)<br />运行容器，指定容器名、映射的端口号，以及挂载到 /data/db 目录：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699807065175-4c9d0cda-1c18-42f6-8bb6-8d7fffecc3e1.png#averageHue=%231e2932&clientId=u55c423fb-370c-4&from=paste&height=464&id=u31d2cd45&originHeight=1360&originWidth=1694&originalType=binary&ratio=2&rotation=0&showTitle=false&size=179411&status=done&style=none&taskId=ub1d9034f-80c6-4093-931b-29ff2e0ca4b&title=&width=578)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699807206309-286289ff-d38f-4ff4-b2b6-45a9f458da26.png#averageHue=%2328c641&clientId=u55c423fb-370c-4&from=paste&height=455&id=u6dd49e89&originHeight=1494&originWidth=2644&originalType=binary&ratio=2&rotation=0&showTitle=false&size=530218&status=done&style=none&taskId=u94e3c107-4eb6-4d1a-a655-cdb725433e9&title=&width=805)

### 普通安装

- 下载地址：  [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
- 建议选择 zip 类型， 通用性更强 配置步骤如下：
   - 将压缩包移动到 C:\Program Files 下，然后解压
   - 创建 C:\data\db 目录，mongodb 会将数据默认保存在这个文件夹
   -  以 mongodb 中 bin 目录作为工作目录，启动命令行
   - 运行命令 mongod

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1680056806229-2c2f7975-6b5a-4fdc-bca1-0f580bffccb9.png#averageHue=%232a2826&clientId=uad4cd567-6032-4&from=paste&height=267&id=u41f95f70&originHeight=397&originWidth=1084&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=457742&status=done&style=none&taskId=ud5423ad2-e02c-4f00-88fb-a162a78e6ea&title=&width=728.2000122070312)<br /> 看到最后的 `waiting for connections` 则表明服务 已经启动成功<br /> 然后可以使用 mongo 命令连接本机的 mongodb 服务<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1680056853971-f27d88b3-dbb2-43f2-a954-9c96f24254cd.png#averageHue=%23232120&clientId=uad4cd567-6032-4&from=paste&height=361&id=ua1b46515&originHeight=563&originWidth=1083&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=291640&status=done&style=none&taskId=uc5f81d99-ca59-489c-8ec7-918a63ebd2a&title=&width=694.4000244140625)<br />注意：

-  为了方便后续方便使用 mongod 命令，可以将 bin 目录配置到环境变量 Path 中
-  `千万不要选中服务端窗口的内容` ，选中会停止服务，可以`敲回车`取消选中

## 命令行操作
使用命令行操作数据库较少，了解为主。<br />通过 mongosh 命令进入 MongoDB 的交互式界面：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699807282497-24cce147-507e-490b-8773-7691c337c45e.png#averageHue=%23b0691b&clientId=u55c423fb-370c-4&from=paste&height=444&id=ICjsO&originHeight=1062&originWidth=2160&originalType=binary&ratio=2&rotation=0&showTitle=false&size=154298&status=done&style=none&taskId=ubc8c47e0-215d-49f1-b43b-3509a743c19&title=&width=903)

### 显示所有数据库
```bash
show dbs;
show databases;
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699807341389-31fad616-ecd2-4449-b462-2a946eaa103a.png#averageHue=%23000000&clientId=u55c423fb-370c-4&from=paste&height=144&id=T8SNo&originHeight=288&originWidth=316&originalType=binary&ratio=2&rotation=0&showTitle=false&size=28813&status=done&style=none&taskId=ub597d547-fc17-444a-85a6-f19bb9dca4c&title=&width=158)<br />查看下现有的 database。

### 切换创建数据库
用 use
```bash
use hello-mongo;
```
然后 db 命令查看当前 database：
```bash
db;
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699807636395-12d69248-7bf3-4a44-882c-30a875ce2314.png#averageHue=%23000000&clientId=u55c423fb-370c-4&from=paste&height=74&id=ufc5fa0c8&originHeight=148&originWidth=404&originalType=binary&ratio=2&rotation=0&showTitle=false&size=14489&status=done&style=none&taskId=ue61d2ae4-68ab-40a3-9f5f-4e089356554&title=&width=202)<br />但这时候你再用 show dbs 会发现没有这个 db：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699807658312-5428b341-f774-4719-a335-2523eeb494c6.png#averageHue=%23000000&clientId=u55c423fb-370c-4&from=paste&height=76&id=u03a3a2a9&originHeight=152&originWidth=322&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15076&status=done&style=none&taskId=u89824fcb-f377-4bfd-bd36-3bb91935a73&title=&width=161)<br />因为默认要有了一个 collection 之后才会把 database 写入硬盘。
```bash
db.createCollection('aaa');
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699807740270-dff7d34f-814f-4c25-812e-c2ed097e3eaa.png#averageHue=%23040200&clientId=u55c423fb-370c-4&from=paste&height=238&id=LG09d&originHeight=476&originWidth=624&originalType=binary&ratio=2&rotation=0&showTitle=false&size=52306&status=done&style=none&taskId=u495b6e3b-4387-476a-b7d2-55507c67004&title=&width=312)

### 删除数据库
```bash
db.dropDatabase();
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699807823019-e3c79055-afab-4ec6-bc77-d6e1087511f9.png#averageHue=%23000000&clientId=u55c423fb-370c-4&from=paste&height=40&id=NdA6m&originHeight=80&originWidth=522&originalType=binary&ratio=2&rotation=0&showTitle=false&size=12021&status=done&style=none&taskId=u0ad53a64-7e4c-41bb-bbef-5ca40ecb434&title=&width=261)<br />此时 shwo database;<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699807839198-6187b7e7-2f0e-4c13-b127-407a117fe64d.png#averageHue=%23000000&clientId=u55c423fb-370c-4&from=paste&height=72&id=mChGY&originHeight=144&originWidth=346&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15545&status=done&style=none&taskId=u51c5e182-ac35-455c-b2db-19cb9649164&title=&width=173)

### 创建集合
```javascript
db.createCollection('集合名称')
```

### 显示当前数据库中的所有集合
```javascript
show collections
```

###  重命名集合
```javascript
db.集合名.renameCollection('newName')
```

### 删除特定集合
```javascript
db.集合名.drop()
```

### 向集合中插入文档
```javascript
db.集合名.insert({name: "云牧", age: 30})
```

### 查询集合中的文档
```javascript
db.集合名.find()
```
 数据中的 _id 是 mongodb 自动生成的唯一编号，用来唯一标识文档。

- 查询特定文档：
```javascript
db.集合名.find({name: "云牧"})
```

### 更新集合中的文档
```javascript
db.集合名.update(查询条件, 新的文档)
db.集合名.update({name: "黛玉"}, {$set: {age: 31}})
```

### 删除集合中的文档
```javascript
db.集合名.remove(查询条件)
db.集合名.remove({name: "黛玉"})
```
mysql 使用 sql 来 crud 的，而 mongodb 里是用 api。<br />但完成的功能是一样的，可以在 [mongodb 文档](https://www.mongodb.com/docs/mongodb-shell/crud/)看到每个 api 对应的 sql 写法。

##  mongo compass
MongoDB 提供了官方的 GUI 工具——Mongo Compass，通过图形界面，用户就可以不敲命令来管理数据库了。<br />下载官方 GUI 工具 [Mongo Compass](https://link.juejin.cn/?target=https%3A%2F%2Fwww.mongodb.com%2Fproducts%2Ftools%2Fcompass)：<br />连接上 mongodb 的 server：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699809559979-a2d0cab5-37c6-49b4-943d-360703949474.png#averageHue=%23fefefe&clientId=u55c423fb-370c-4&from=paste&height=491&id=ucac6af5e&originHeight=982&originWidth=2102&originalType=binary&ratio=2&rotation=0&showTitle=false&size=121243&status=done&style=none&taskId=uea35e620-d884-4d51-85b2-56081190967&title=&width=1051)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699809850190-b0f7b284-8de7-4305-abde-1b2df4ebeeef.png#averageHue=%23fdfdfd&clientId=u55c423fb-370c-4&from=paste&height=408&id=u4ef2a0cd&originHeight=1298&originWidth=2838&originalType=binary&ratio=2&rotation=0&showTitle=false&size=222825&status=done&style=none&taskId=ue73f6320-7283-4d99-a09d-aaf0779acfb&title=&width=892)<br />在 GUI 工具里操作就很方便直观了。<br />可以看到所有的 database、collection、document。<br />在这里输入过滤条件后点击 find：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699809899787-839e2c71-28b3-427c-bd5b-4bd0fbc1e6e0.png#averageHue=%23fefefe&clientId=u55c423fb-370c-4&from=paste&height=345&id=u675c2d68&originHeight=690&originWidth=2550&originalType=binary&ratio=2&rotation=0&showTitle=false&size=114169&status=done&style=none&taskId=ufab078fe-ab3d-42c1-8ae5-08efca0d5dc&title=&width=1275)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699809938513-dbf653b7-e208-4e4d-abc4-ad5ba58b32e4.png#averageHue=%23fefefe&clientId=u55c423fb-370c-4&from=paste&height=109&id=u66307a01&originHeight=218&originWidth=2326&originalType=binary&ratio=2&rotation=0&showTitle=false&size=27957&status=done&style=none&taskId=u5ea33bee-6397-41cd-8391-174330379fc&title=&width=1163)<br />更新和删除也都很直观：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1699809980913-19fd8c6d-4dd4-4493-bed6-9fcb4c5042bd.png#averageHue=%23fefdfc&clientId=u55c423fb-370c-4&from=paste&height=108&id=u23f496a5&originHeight=216&originWidth=2274&originalType=binary&ratio=2&rotation=0&showTitle=false&size=30258&status=done&style=none&taskId=ub8e4ab5e-5280-4b69-814b-66d37488925&title=&width=1137)
