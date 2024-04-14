# MongoDB

## 简介

MongoDB 是为快速开发互联网 Web 应用而设计的数据库系统，官方地址 <https://www.mongodb.com/>

数据库（DataBase）是按照数据结构来组织、存储和管理数据的仓库。是一个应用程序

mongodb 是数据库软件中的一员

## 下载安装

下载地址 <https://www.mongodb.com/download-center/community>

安装过程截图

![1](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1.png)

![2](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/2.png)

![3](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/3.png)

![4](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/4.png)

![5](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/5-1574195521250.png)

![6](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/6.png)

安装的默认位置

```
C:\Program Files\MongoDB
```

安装完毕后进行几步操作

一、为了方便在命令行下运行，可以配置 mongodb 命令的环境变量 PATH

此电脑 -> 属性 -> 高级系统设置 -> 环境变量 -> 双击 Path -> 新建 -> 设置 mongod.exe 所在文件夹路径

```sh
C:\Program Files\MongoDB\Server\3.2\bin
```

二、创建默认的仓库文件夹

```sh
c:\data\db
```

三、打开命令行窗口输入`mongod` 启动数据库服务器

![1574196036556](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1574196036556.png)

四、另起一个命令行运行 `mongo `

![1574196149538](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1574196149538.png)

注意：

mongodb 服务修改监听端口 `mongod --port=27018`

客户端连接 `mongo --port=27018`

## 使用

### 三个重要概念

- 一个 mongodb 服务可以创建多个数据库
- 数据库（database） 数据库是一个仓库，在仓库中可以存放集合
- 集合（collection） 集合类似于 JS 中的数组，在集合中可以存放文档
- 文档（document） 文档数据库中的最小单位，类似于 JS 中的对象，在 MongoDB 中每一条数据都是一个 JS 的对象

![img](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/clip_image002.jpg)

### 常用命令

#### 数据库集合命令

##### 1.显示所有的数据库

```sh
show dbs
show databases
```

##### 2.创建/切换到指定的数据库

```js
use 数据库名
```

> 在 MongoDB 中数据库只有真正的有了数据才会被创建出来。

##### 3.显示当前所在的数据库

```
db
```

> MongoDB 中默认的数据库为 test，如果你没有创建新的数据库，集合将存放在 test 数据库中。
>
> 有一些数据库名是保留的，可以直接访问这些有特殊作用的数据库。
>
> - **admin**：从权限的角度来看，这是"root"数据库。要是将一个用户添加到这个数据库，这个用户自动继承所有数据库的权限。一些特定的服务器端命令也只能从这个数据库运行，比如列出所有的数据库或者关闭服务器。
> - **local：** 这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合
>
> - **config：**当 Mongo 用于分片设置时，config 数据库在内部使用，用于保存分片的相关信息。

##### 4.删除当前数据库（先切换再删除）

1. 使用 use 命令切换到要删除的数据库
2. 使用 `db.dropDatabase()` 删除当前数据库

##### 5.创建集合

> 如果不存在集合，则在您第一次为该集合存储数据时，MongoDB 会创建该集合。

```js
db.集合名称.insert({ x: 1 });
```

MongoDB 提供 `db.createCollection()` 方法来显式创建具有各种选项的集合，例如设置最大大小或文档验证规则。如果未指定这些选项，则无需显式创建集合，因为在首次存储集合数据时，MongoDB 会创建新集合。

##### 6.显示当前数据库中的所有集合

```js
show collections
```

##### 7.删除当前集合

```js
db.集合名称.drop();
```

##### 8.重命名集合

```js
db.集合名称.renameCollection("newName");
```

#### 文档命令

> - MongoDB 将数据记录存储为 BSON 文档
> - BSON（Binary JSON）是 JSON 文档的二进制表示形式，它比 JSON 包含更多的数据类型
> - [BSON 规范](http://bsonspec.org/)
> - [BSON 支持的数据类型](https://docs.mongodb.com/manual/reference/bson-types/)

![img](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1604546663341-8e1f15b9-800d-4cf5-a5ef-29fa7fbe1d77.svg)

##### 0.文档结构

```json
{
   field1: value1,
   field2: value2,
   field3: value3,
   ...
   fieldN: valueN
}
```

##### 1.插入文档

```js
db.集合名称.insert(文档对象);
// 如果该集合当前不存在，则插入操作将创建该集合。
```

> \_id 字段
>
> ​ 在 MongoDB 中，存储在集合中的每个文档都需要一个唯一的 \_id 字段作为主键。如果插入的文档省略 \_id 字段，则 MongoDB 驱动程序会自动为 \_id 字段生成 ObjectId。
>
> `_id` 字段具有以下行为和约束：
>
> - 默认情况下，MongoDB 在创建集合时会在 `_id` 字段上创建唯一索引。
> - `_id` 字段始终是文档中的第一个字段
>
> - `_id` 字段可以包含任何 BSON 数据类型的值，而不能是数组。

##### 2.查询文档

```
db.collection.find(查询条件)
db.collection.findOne(查询条件)
```

##### 3.更新文档

```js
db.collection.update(查询条件,新的文档,配置对象)
// 更新一个
db.collection.updateOne(查询条件,要更新的内容[,配置对象])
// 批量更新
db.collection.updateMany(查询条件,要更新的内容[,配置对象])
//eg
db.students.update({name:'yunmu'},{$set:{age:19}})
//配置对象
{
    //可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入
    upsert: <boolean>,
    //可选，mongodb 默认是false,只更新找到的第一条记录，如果为true, 就把按条件查出来多条记录全部更新
    multi: <boolean>
}

```

##### 4.删除集合中的文档

```
db.collection.remove(查询条件)
```

#### 条件控制

##### 运算符

在 mongodb 不能 > < >= <= !== 等运算符，需要使用替代符号

- `>` 使用 `$gt`
- `<` 使用 `$lt`
- `>=` 使用 `$gte`
- `<=` 使用 `$lte`
- `!==` 使用 `$ne`

##### 逻辑或

`$in` 满足其中一个即可

```
db.students.find({age:{$in:[18,24,26]}}) //
```

`$or` 逻辑或的情况

```js
db.students.find({ $or: [{ age: 18 }, { age: 24 }] });
```

`$and` 逻辑与的情况

```
db.students.find({$and: [{age: {$lt:20}}, {age: {$gt: 15}}]});
```

##### 正则匹配

条件中可以直接使用 JS 的正则语法

```js
db.students.find({ name: /imissyou/ });
```

## Mongoose

### 介绍

Mongoose 是一个对象文档模型（ODM）库，它对 Node 原生的 MongoDB 模块进行了进一步的优化封装，并提供了更多的功能。 官网 <http://www.mongoosejs.net/>

### 作用

使用代码操作 mongodb 数据库

### 使用流程

一、安装 mongoose

在命令行下使用 npm 或者其他包管理工具安装（cnpm yarn）

```sh
npm install mongoose --save
```

二、引入包

在运行文件中引入 mongoose

```js
const mongoose = require("mongoose");
```

三、连接数据库

```js
mongoose.connect("mongodb://127.0.0.1/data");

//如果启动时遇到警告提醒， 则按照提示增加选项即可   project  数据库的名称
mongoose.connect("mongodb://127.0.0.1:27017/project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

四、监听连接事件

```js
// 设置连接成功的回调
mongoose.connection.on("open", function () {
  //下面编写数据库操作代码

  //五、创建文档结构对象
  var SongSchema = new mongoose.Schema({
    title: String, //歌名
    author: String, //歌手
  });

  //六、创建文档模型  数据库中集合的名称会自动转为『复数』
  var SongModel = mongoose.model("songs", SongSchema);

  //七、使用模型进行文档处理（这里以增加数据为例）
  SongModel.create({ title: "野狼disco", author: "宝石gem" }, function (err, data) {
    if (err) throw err; //这里判断错误

    //下面编写创建成功后的逻辑
    // ... ...
    //八、关闭数据库连接（可选，代码上线之后一般不加）
    mongoose.connection.close();
  });
});
```

### 数据类型

文档结构可选的字段类型列表

- String
- Number
- Date
- Buffer
- Boolean
- Mixed 任意类型（使用 mongoose.Schema.Types.Mixed 设置）
- ObjectId
- Array
- Decimal128 保存高精度数字（4.3 版本后加入）

### CURD

数据库的基本操作包括四个，增加（create），删除（delete），修改（update），查（read）

#### 增加

插入一条

```js
SongModel.create(
  {
    title: "给我一首歌的时间",
    author: "Jay",
  },
  function (err, data) {
    //错误
    console.log(err);
    //插入后的数据对象
    console.log(data);
  }
);
```

批量插入

```js
SongModel.insertMany(
  [
    {
      title: "给我一首歌的时间",
      author: "Jay",
    },
    {
      title: "爱笑的眼睛",
      author: "JJ Lin",
    },
    {
      title: "缘分一道桥",
      author: "Leehom Wang",
    },
  ],
  function (err, data) {
    console.log(err);
    console.log(data);
  }
);
```

#### 删除

删除一条数据

```js
SongModel.deleteOne({ _id: "5dd65f32be6401035cb5b1ed" }, function (err, data) {
  console.log(err);
  console.log(data);
});
```

批量删除

```js
SongModel.deleteMany({ author: "Jay" }, function (err, data) {
  console.log(err);
  console.log(data);
});
```

#### 更新

更新一条数据

```js
SongModel.updateOne({ author: "JJ Lin" }, { author: "林俊杰" }, function (err, data) {
  console.log(err);
  console.log(data);
});
```

批量更新数据

```js
SongModel.updateMany({ author: "Leehom Wang" }, { author: "王力宏" }, function (err, data) {
  console.log(err);
  console.log(data);
});
```

#### 查询

查询一条数据

```js
SongModel.findOne({ author: "王力宏" }, function (err, data) {
  console.log(err);
  console.log(data);
});
//根据 id 查询数据
SongModel.findById("5dd662b5381fc316b44ce167", function (err, data) {
  console.log(err);
  console.log(data);
});
```

批量查询数据

```js
//不加条件查询
SongModel.find(function (err, data) {
  console.log(err);
  console.log(data);
});
//加条件查询
SongModel.find({ author: "王力宏" }, function (err, data) {
  console.log(err);
  console.log(data);
});
```

##### 字段筛选

```js
// 1代表需要的数据 0代表不需要的数据
SongModel.find()
  .select({ _id: 0, title: 1 })
  .exec(function (err, data) {
    console.log(data);
  });
```

##### 数据排序

```js
// 排序 1为升序 -1为降序
SongModel.find()
  .sort({ hot: 1 })
  .exec(function (err, data) {
    console.log(data);
  });
```

##### 数据截取

```js
// skip跳过10条 limit取出10条
SongModel.find()
  .skip(10)
  .limit(10)
  .exec(function (err, data) {
    console.log(data);
  });
```

## 图形化操作

![1](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1-1574519196603.png)

![2](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/2-1574519223041.png)

![3](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/3-1574519211809.png)

![4](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/4-1574519235005.png)

![5](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/5-1574519240818.png)

## 用户注册

> 结合 express 和 mongodb 完成用户注册的账号密码存储

```js
const express = require("express");
var bodyParser = require("body-parser");
//引入 md5
const md5 = require("md5");
//引入 mongoose
const mongoose = require("mongoose");

//连接
mongoose.connect("mongodb://127.0.0.1:27018/shop");

//连接成功的回调
mongoose.connection.on("open", () => {
  //用户的文档结构模型
  const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
  });
  //用户模型
  const UserModel = mongoose.model("user", UserSchema);

  const app = express();
  //设置中间件
  app.use(bodyParser.urlencoded({ extended: false }));

  //设置ejs
  app.set("view engine", "ejs");
  app.set("views", "./views");

  //显示注册页面
  app.get("/register", (request, response) => {
    response.render("register");
  });

  //对数据进行保存
  app.post("/register", (request, response) => {
    //将密码加密
    request.body.password = md5(request.body.password);
    //获取请求体数据
    UserModel.create(request.body, (err, data) => {
      if (err) throw err;
      response.send("注册成功");
    });
  });

  app.listen(80);
});
```

## 附录

### mongodb 配置密码

一、启动 mongod 带验证选项

```sh
# mongod --auth
```

二、创建用户

```sh
> use admin
> db.createUser({user:"admin",pwd:"password",roles:["root"]})
```

三、连接 mongod 服务

```
> mongo
> use admin
> db.auth("admin", "password")
```

四、mongoose 连接操作

```js
mongoose.connect("mongodb://admin:password@localhost/prepare?authSource=admin");
```

### 关系型数据库（RDBS）

代表有：MySQL、Oracle、DB2、SQL Server...

特点：关系紧密，都是表

![img](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/clip_image002.png)

优点：

1、易于维护：都是使用表结构，格式一致；

2、使用方便：通用，可用于复杂查询；

3、高级查询：可用于一个表以及多个表之间非常复杂的查询。

缺点：

1、读写性能比较差，尤其是海量数据的高效率读写；

2、有固定的表结构，字段不可随意更改，灵活度稍欠；

3、高并发读写需求，传统关系型数据库来说，硬盘 I/O 是一个很大的瓶颈。

### 非关系型数据库（NoSQL not only SQL ）

代表有：MongoDB、Redis...

特点：关系不紧密，有文档，有键值对

![nosql](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/nosql.png)

优点：

1、格式灵活：存储数据的格式可以是 key,value 形式。

2、速度快：nosql 可以内存作为载体，而关系型数据库只能使用硬盘；

3、易用：nosql 数据库部署简单。

缺点：

1、不支持事务；

2、复杂查询时语句过于繁琐。

### 数据库名称规则

- 不区分大小写，但是建议全部小写
- 不能包含空字符。

- 数据库名称不能为空，并且必须少于 64 个字符。
- Windows 上的命名限制

- - 不能包括 `/\. "$*<>:|?` 中的任何内容

- Unix 和 Linux 上的命名限制

- - 不能包括 `/\. "$` 中的任何字符

### 集合名称规则

集合名称应以下划线或字母字符开头，并且：

- 不能包含 `$`
- 不能为空字符串

- 不能包含空字符
- 不能以 `.` 开头

- 长度限制

- - 版本 4.2 最大 120 个字节
  - 版本 4.4 最大 255 个字节

### 字段名称

文档对字段名称有以下限制：

- 字段名称 `_id` 保留用作主键；它的值在集合中必须是唯一的，不可变的，并且可以是数组以外的任何类型。
- 字段名称不能包含空字符。

- 顶级字段名称不能以美元符号 `$` 开头。

- - 从 MongoDB 3.6 开始，服务器允许存储包含点 `.` 和美元符号 `$` 的字段名称

### MongoDB 中的数据类型

字段的值可以是任何 BSON 数据类型，包括其他文档，数组和文档数组。例如，以下文档包含各种类型的值：

```js
var mydoc = {
  _id: ObjectId("5099803df3f4948bd2f98391"),
  name: { first: "Alan", last: "Turing" },
  birth: new Date("Jun 23, 1912"),
  death: new Date("Jun 07, 1954"),
  contribs: ["Turing machine", "Turing test", "Turingery"],
  views: NumberLong(1250000),
};
```

上面的字段具有以下数据类型：

- \_id 保存一个 [ObjectId](https://docs.mongodb.com/manual/reference/bson-types/#objectid) 类型
- name 包含一个嵌入式文档，该文档包含 first 和 last 字段

- birth 和 death 持有 Date 类型的值
- contribs 保存一个字符串数组

- views 拥有 NumberLong 类型的值

| 类型               | 整数标识符 | 别名（字符串标识符） | 描述                                                                                                       |
| ------------------ | ---------- | -------------------- | ---------------------------------------------------------------------------------------------------------- |
| Double             | 1          | “double”             | 双精度浮点值。用于存储浮点值。                                                                             |
| String             | 2          | “string”             | 字符串。存储数据常用的数据类型。在 MongoDB 中，UTF-8 编码的字符串才是合法的。                              |
| Object             | 3          | “object”             | 用于内嵌文档                                                                                               |
| Array              | 4          | “array”              | 用于将数组或列表或多个值存储为一个键。                                                                     |
| Binary data        | 5          | “binData”            | 二进制数据。用于存储二进制数据。                                                                           |
| ObjectId           | 7          | “objectId”           | 对象 ID。用于创建文档的 ID。                                                                               |
| Boolean            | 8          | “bool”               | 布尔值。用于存储布尔值（真/假）。                                                                          |
| Date               | 9          | “date”               | 日期时间。用 UNIX 时间格式来存储当前日期或时间。你可以指定自己的日期时间：创建 Date 对象，传入年月日信息。 |
| Null               | 10         | “null”               | 用于创建空值。                                                                                             |
| Regular Expression | 11         | “regex”              | 正则表达式类型。用于存储正则表达式。                                                                       |
| 32-bit integer     | 16         | “int”                | 整型数值。用于存储 32 位整型数值。                                                                         |
| Timestamp          | 17         | “timestamp”          | 时间戳。记录文档修改或添加的具体时间。                                                                     |
| 64-bit integer     | 18         | “long”               | 整型数值。用于存储 64 位整型数值。                                                                         |
| Decimal128         | 19         | “decimal”            | 数值类型。常用于存储更精确的数字，例如货币。                                                               |
