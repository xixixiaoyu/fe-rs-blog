后端开发的主要任务包括，从数据库检索数据返回给前端进行渲染，以及将前端提交的数据保存到数据库中。<br />在学习后端技术时，掌握数据库知识是非常关键的一步。

## 运行服务
通过 Docker Desktop 查询 MySQL 的镜像：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687430043709-45e79ffb-a93b-4aab-a62d-df2d96ea8bf1.png#averageHue=%235b758f&clientId=u20f06151-b083-4&from=paste&height=597&id=u022431ad&originHeight=1488&originWidth=2278&originalType=binary&ratio=2&rotation=0&showTitle=false&size=262078&status=done&style=none&taskId=u2c55c2b8-3858-46ff-8cdd-29a3fd71603&title=&width=914)<br />pull 后点击 run 传入参数：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687430319663-469f9825-0db7-429b-9c09-3cba61b5763d.png#averageHue=%231f5247&clientId=u20f06151-b083-4&from=paste&height=577&id=u6ef521af&originHeight=1564&originWidth=2298&originalType=binary&ratio=2&rotation=0&showTitle=false&size=256548&status=done&style=none&taskId=uf47cd984-88b3-4821-af8f-5fe25db2577&title=&width=848)<br />客户端连接 MySQL 使用的端口通常是 3306。MySQL 8新增了 33060 端口，用于管理服务器。<br />指定 volume，用本地目录作为数据卷挂载到容器的 /var/lib/mysql 目录，这个是 mysql 保存数据的目录。<br />指定密码 MYSQL_ROOT_PASSWORD，作为客户端连接 MySQL 服务器的密码。

点击 run，mysql 容器就跑起来了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687430554141-b726ed2e-5b51-4dc1-9535-a904b6b9b79c.png#averageHue=%233ba18c&clientId=u20f06151-b083-4&from=paste&height=541&id=ua050b024&originHeight=1564&originWidth=2298&originalType=binary&ratio=2&rotation=0&showTitle=false&size=536965&status=done&style=none&taskId=u3ed8eac3-5597-4e14-ae09-c1cbcdca082&title=&width=795)

## 命令行工具
mysql 镜像里自带命令行工具：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687430817852-6dc0edc2-fa2e-4c84-afd9-a193d0f9f107.png#averageHue=%2323c53d&clientId=u82f98d51-a388-4&from=paste&height=544&id=u05528a92&originHeight=1564&originWidth=2298&originalType=binary&ratio=2&rotation=0&showTitle=false&size=227250&status=done&style=none&taskId=u08ad8938-d0e5-420d-9b8f-59bd238562f&title=&width=800)<br />使用 mysql -u root -p 命令和之前输入的密码，就可以通过命令行工具连接 MySQL 服务器。

## GUI 客户端工具
### 操作界面概览
我们用 mysql 官方的 GUI 客户端： [MySQL Workbench](https://link.juejin.cn/?target=https%3A%2F%2Fdev.mysql.com%2Fdownloads%2Fworkbench%2F)（m1 芯片要选择 arm 的包）<br />安装好后，打开 mysql workbench，点击这个 + 号：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687431024865-dc48d715-1563-47ef-8f83-4762cc46ee0f.png#averageHue=%23f2f1ef&clientId=u82f98d51-a388-4&from=paste&height=527&id=u66cd35dd&originHeight=1456&originWidth=2048&originalType=binary&ratio=2&rotation=0&showTitle=false&size=497483&status=done&style=none&taskId=u300d6ab1-0393-41bc-9465-cdb2a607a15&title=&width=741)

输入连接名，点击 store in keychain 输入密码（系统密码）<br />点击“Test Connection”测试连接是否成功：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1711282866457-efe2e661-bf20-4917-a61d-d4622bd586d4.png#averageHue=%23e9e9e8&clientId=ud3379c23-e7d4-4&from=paste&height=477&id=u003973f6&originHeight=1028&originWidth=1450&originalType=binary&ratio=2&rotation=0&showTitle=false&size=278118&status=done&style=none&taskId=u406a2201-25a2-4aae-84a6-3a21bd31e5e&title=&width=673)

之后可以点击 ok 保存设置， 进入操作界面了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687431268841-c6a33c8b-9f2e-4609-b7b7-e68c5297d13b.png#averageHue=%23e6e6e4&clientId=u82f98d51-a388-4&from=paste&height=506&id=uc59e451d&originHeight=1456&originWidth=2048&originalType=binary&ratio=2&rotation=0&showTitle=false&size=430579&status=done&style=none&taskId=u8b11c14a-384a-4d9e-9030-b95047c8391&title=&width=712)

在左侧“Schemas”标签下查看数据库、表、视图、存储过程和函数等：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687431393582-021d8cf2-0ea5-46a7-8b66-43c7db4814f1.png#averageHue=%23e6e2de&clientId=u82f98d51-a388-4&from=paste&height=505&id=u0cee94c6&originHeight=1456&originWidth=2048&originalType=binary&ratio=2&rotation=0&showTitle=false&size=372091&status=done&style=none&taskId=u5c814c29-8c85-47de-ab02-b0b39fef986&title=&width=710)<br />我们先点击这个图标看一下 sys_config 表中的数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687431446438-5eb47aed-3b78-4a99-ac26-1c83dfa1248d.png#averageHue=%23dddad6&clientId=u82f98d51-a388-4&from=paste&height=499&id=u76cd5f0f&originHeight=1468&originWidth=2162&originalType=binary&ratio=2&rotation=0&showTitle=false&size=653147&status=done&style=none&taskId=u9cf64c6f-e90b-41ab-803e-1850d034f74&title=&width=735)<br />它会自动执行对应的查询表 sql。

点击第一个图标，会展示表的信息，比如多少列、多少行、占据了多大的空间等：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687431484909-f95bb39d-4922-46a1-baa5-dc7307f92a06.png#averageHue=%23d2d2d2&clientId=u82f98d51-a388-4&from=paste&height=511&id=u34e25321&originHeight=1468&originWidth=2162&originalType=binary&ratio=2&rotation=0&showTitle=false&size=497454&status=done&style=none&taskId=ub60c248d-df36-4f59-b1e7-ec4a006da3e&title=&width=752)<br />点击第二个图标是修改表的列定义：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687431543945-653f2be8-b384-47db-a590-0a8856fd70e8.png#averageHue=%23e4e3e3&clientId=u82f98d51-a388-4&from=paste&height=507&id=u50b499fb&originHeight=1468&originWidth=2162&originalType=binary&ratio=2&rotation=0&showTitle=false&size=585977&status=done&style=none&taskId=ufa5ed907-33cd-4575-b04f-8eb93ab38d3&title=&width=746)

### 数据库和表操作
从 MySQL 5.0 版本开始，官方文档使用 schema 来指代 database，但实际上这两个词在MySQL中是等价的。<br />每个数据库中可以存储多个表（table）、视图（view）、存储过程（stored procedure）和函数（function）。<br />我们最常操作的是表。

下面五个按钮分别是创建数据库、表、视图、存储过程和函数，<br />我们创建数据库，只需输入名称，指定字符集，点击“Apply”应用：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1711288546399-7cdb8aa8-8476-4a53-9da3-9f2f6492e735.png#averageHue=%23dededd&clientId=ucd56c181-a8f3-4&from=paste&height=559&id=uccd459bd&originHeight=1118&originWidth=1646&originalType=binary&ratio=2&rotation=0&showTitle=false&size=487972&status=done&style=none&taskId=u8edc712d-5de2-4d38-9ef4-4c58bc8de20&title=&width=823)<br />创建成功之后，就可以看到我们刚建的数据库了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687435881564-56b3aaea-7104-485b-a50a-9c981cd36545.png#averageHue=%23e2e0dd&clientId=u82f98d51-a388-4&from=paste&height=415&id=u2ef6505a&originHeight=830&originWidth=556&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63726&status=done&style=none&taskId=uf319df64-2309-43a7-8ef3-786d67c4839&title=&width=278)

选中 hello-mysql 数据库，点击创建 table 的按钮，我们来建个表：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687436078596-03204d46-5165-4f42-aa23-762e5a1ed86a.png#averageHue=%23e0dbd3&clientId=u82f98d51-a388-4&from=paste&height=254&id=u769f06ab&originHeight=508&originWidth=758&originalType=binary&ratio=2&rotation=0&showTitle=false&size=106788&status=done&style=none&taskId=uf2c797ec-55d3-4c8e-88be-8d571651020&title=&width=379)<br />先建立 id 列：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687436175015-94c310d0-820a-4ee9-b103-f12474eed1be.png#averageHue=%23d7d4d0&clientId=u82f98d51-a388-4&from=paste&height=502&id=u89ceae85&originHeight=1468&originWidth=2332&originalType=binary&ratio=2&rotation=0&showTitle=false&size=510481&status=done&style=none&taskId=ua1a54676-7cbb-473c-9027-38472d98cff&title=&width=798)<br />选中主键（Primary Key）、自动递增（Auto Increment） 的约束。

- 主键区分每一行数据的哪一列，这一列一般命名为 id。primary key 自带了唯一（unique）和非空（not null）的约束。
- 勾选 auto increment 这样插入数据的时候，会自动设置 1、2、3、4、5 递增的 id。

然后依次创建 name、age、sex、email、create_time、status（是否删除） 列：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1711283446771-b8afd7dc-4df6-4538-ad4c-65db5fe01164.png#averageHue=%23e3e1e0&clientId=u6ea8875a-944a-4&from=paste&height=520&id=fUZP3&originHeight=1040&originWidth=1646&originalType=binary&ratio=2&rotation=0&showTitle=false&size=503200&status=done&style=none&taskId=ue1ba6597-521d-40e3-8339-b24dd6a927b&title=&width=823)<br />name 和 create_time 添加非空约束。<br />点击右下角的 apply，就会生成建表 sql：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687437008615-072f802f-8ff0-49ae-b5f7-c4c4001578ac.png#averageHue=%23dfedf3&clientId=u82f98d51-a388-4&from=paste&height=477&id=O4N2Y&originHeight=1296&originWidth=1800&originalType=binary&ratio=2&rotation=0&showTitle=false&size=283453&status=done&style=none&taskId=u2f82af78-c892-496a-a634-36eb8510e29&title=&width=662)<br />这就是建表语句的语法。

## 数据类型
### 数值类型

- 整型：包含多种规格，用于存储整数。 
   - `TINYINT`：非常小的整数。
   - `SMALLINT`：较小的整数。
   - `MEDIUMINT`：中等大小的整数。
   - `INT`/`INTEGER`：标准整数。
   - `BIGINT`：非常大的整数。
- 浮点型和双精度型： 
   - `FLOAT`：单精度浮点数。
   - `DOUBLE`：双精度浮点数。
- 定点数： 
   - `DECIMAL`、`NUMERIC`：用于存储精确的小数，常用于财务计算。

### 字符串类型

- `CHAR`：定长字符串，适合存储长度固定的文本。
- `VARCHAR`：变长字符串，适合存储长度可变的文本。
- `TEXT`：用于存储较长的文本数据。
- `BLOB`：用于存储二进制大对象，如图片、音频等。

### 日期和时间类型

- `DATE`：格式为 `YYYY-MM-DD`，仅存储日期。
- `TIME`：格式为 `HH:MM:SS`，仅存储时间。
- `DATETIME`：格式为 `YYYY-MM-DD HH:MM:SS`，存储日期和时间。
- `TIMESTAMP`：存储日期和时间，具有时区转换功能。
- `YEAR`：格式为 `YYYY`，仅存储年份。

### 二进制类型

- `BINARY`：定长二进制字符串。
- `VARBINARY`：变长二进制字符串。

### 枚举和集合类型

- `ENUM`：列只能有一个预定义的值。
- `SET`：列可以包含零个或多个预定义的值。

### 常用数据类型

- `INT`：用于存储整数。
- `DOUBLE`：存储双精度浮点数。
- `VARCHAR(100)`：存储最大长度为100字符的可变长度字符串。
- `CHAR`：存储固定长度字符串，不足部分自动填充空格。
- `DATE`：例如 `2023-05-27`，存储日期。
- `TIME`：例如 `10:13`，存储时间。
- `DATETIME`：例如 `2023-05-27 10:13`，存储日期和时间。
- `TIMESTAMP`：存储日期和时间，自动转换为 UTC 时间，适用于全球化应用。


## SQL 语言分类
### 数据定义语言（DDL）

- `CREATE`：创建新的数据库或表。
- `ALTER`：修改现有的数据库或表。
- `DROP`：删除数据库或表。
- `TRUNCATE`：清空表中的所有数据。
- `RENAME`：重命名数据库或表。

### 数据操作语言（DML）

- `INSERT`：向表中插入新数据。
- `UPDATE`：更新表中的数据。
- `DELETE`：从表中删除数据。
- `SELECT`：从数据库中查询数据。

### 数据查询语言（DQL）

- 主要包含 `SELECT` 语句，用于查询数据库中的数据。

