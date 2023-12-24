# 在 Node.js 中操作 MongoDB

## 初始化示例项目

```shell
mkdir node-mongodb-demo

cd node-mongodb-demo

npm init -y

npm install mongodb
```

## 连接到 MongoDB

```javascript
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://127.0.0.1:27017", {
  useUnifiedTopology: true,
});

async function run() {
  try {
    // 开始连接
    await client.connect();
    const testDb = client.db("test");
    const inventoryCollection = testDb.collection("inventory");
    const ret = await inventoryCollection.find();
    console.log(await ret.toArray());
  } catch (err) {
    // 连接失败
    console.log("连接失败", err);
  } finally {
    // 关闭连接
    await client.close();
  }
}

run();

// 开始连接
// client.connect().then(() => {
//   // 连接成功了
// }).catch(() => {
//   console.log('连接失败了')
// })
```

## CRUD 操作

CRUD（创建，读取，更新，删除）操作使您可以处理存储在 MongoDB 中的数据。

### 创建文档

插入一个：

```javascript
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://127.0.0.1:27017", {
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const testDb = client.db("test");
    const inventoryCollection = testDb.collection("inventory");
    // 创建文档
    const ret = await inventoryCollection.insertOne({
      a: 1,
      b: "2",
      c: true,
      d: [1, 2, 3],
    });

    console.log(ret);
  } catch (err) {
    console.log("连接失败", err);
  } finally {
    await client.close();
  }
}

run();
```

插入多个：

```javascript
const pizzaDocuments = [
  { name: "Sicilian pizza", shape: "square" },
  { name: "New York pizza", shape: "round" },
  { name: "Grandma pizza", shape: "square" },
];

const ret = await inventoryCollection.insertMany(pizzaDocuments);
console.log(ret);
```

### 查询文档

```javascript
const ret1 = await inventoryCollection.find({
  item: "notebook",
});

const ret2 = await inventoryCollection.findOne({
  item: "notebook",
});

// find()  ret.toArray()
console.log(await ret1.toArray());

// findOne() ret
console.log(ret2);
```

### 删除文档

```javascript
const { MongoClient, ObjectID } = require("mongodb");

// 删除符合条件的单个文档
const ret = await inventoryCollection.deleteOne({
  _id: ObjectID("5fa5164f95060000060078b1"),
});
console.log(ret);

const doc = {
  pageViews: {
    $gt: 10,
    $lt: 32768,
  },
};
// 删除符合条件的多个文档
const deleteManyResult = await collection.deleteMany(doc);
console.dir(deleteManyResult.deletedCount);
```

### 修改文档

更新 1 个文档：

```javascript
const filter = { ObjectID(_id: 465) };
// update the value of the 'z' field to 42
const updateDocument = {
   $set: {
      z: 42,
   },
};

// 更新多个
const result = await collection.updateOne(filter, updateDocument);

// 更新多个
const result = await collection.updateMany(filter, updateDocument);
```

替换文档：

```javascript
const filter = { _id: 465 };
// replace the matched document with the replacement document
const replacementDocument = {
  z: 42,
};
const result = await collection.replaceOne(filter, replacementDocument);
```

# MongoDB 数据库结合 Web 服务

![image-20220108212119237](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220108212119237.png)

我们这次来搭建一个支持 MongoDB 数据库 CRUD 操作的 Web 接口服务，用来进行博客文章的管理。

通过本实战案例，希望你会对数据库及 Web 开发有更深一步的理解

## 接口设计

> 基于 RESTful 接口规范。
>
> - [理解 RESTful 架构](http://www.ruanyifeng.com/blog/2011/09/restful.html)
> - [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

### 创建文章

- 请求路径：`POST` /articles
- 请求参数：Body

- - title
  - description

- - body
  - tagList

- 数据格式：application/json

```json
{
  "article": {
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "You have to believe",
    "tagList": ["reactjs", "angularjs", "dragons"]
  }
}
```

返回数据示例：

- 状态码：201
- 响应数据：

```json
{
  "article": {
    "_id": 123,
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z"
  }
}
```

### 获取文章列表

- 请求路径：`GET` /articles
- 请求参数（Query）

- - \_page：页码
  - \_size：每页大小

响应数据示例：

- 状态码：200
- 响应数据：

```json
{
  "articles": [
    {
      "_id": "how-to-train-your-dragon",
      "title": "How to train your dragon",
      "description": "Ever wonder how?",
      "body": "It takes a Jacobian",
      "tagList": ["dragons", "training"],
      "createdAt": "2016-02-18T03:22:56.637Z",
      "updatedAt": "2016-02-18T03:48:35.824Z"
    },
    {
      "_id": "how-to-train-your-dragon-2",
      "title": "How to train your dragon 2",
      "description": "So toothless",
      "body": "It a dragon",
      "tagList": ["dragons", "training"],
      "createdAt": "2016-02-18T03:22:56.637Z",
      "updatedAt": "2016-02-18T03:48:35.824Z"
    }
  ],
  "articlesCount": 2
}
```

### 获取单个文章

- 请求路径：`GET` /articles/:id

响应数据示例：

- 状态码：200
- 响应数据：

```json
{
  "article": {
    "_id": "dsa7dsa",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z"
  }
}
```

### 更新文章

- 请求路径：`PATCH` /artilces/:id
- 请求参数（Body）

- - title
  - description

- - body
  - tagList

请求体示例：

- 状态码：201
- 数据：

```json
{
  "article": {
    "title": "Did you train your dragon?"
  }
}
```

响应示例：

```json
{
  "article": {
    "_id": 123,
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z"
  }
}
```

### 删除文章

- 接口路径：`DELETE` /articles/:id

响应数据：

- 状态码：204
- 数据：

```json
{}
```

## 准备工作

```shell
mkdir article-bed

cd article-bed

npm init -y

npm i express mongodb
```

## 使用 Express 快速创建 Web 服务

```js
const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const connectUri = "mongodb://localhost:27017";
const dbClient = new MongoClient(connectUri);

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
```

## 路由设计

```js
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/articles", (req, res) => {
  res.send("post /articles");
});

app.get("/articles", (req, res) => {
  res.send("get /articles");
});

app.get("/articles/:id", (req, res) => {
  res.send("get /articles/:id");
});

app.patch("/articles/:id", (req, res) => {
  res.send("patch /articles/:id");
});

app.delete("/articles/:id", (req, res) => {
  res.send("delete /articles/:id");
});
```

## 处理 Body 请求数据

```js
// 配置解析请求体数据 application/json
// 它会把解析到的请求体数据放到 req.body 中
// 注意：一定要在使用之前就挂载这个中间件
app.use(express.json());
```

## 错误处理

```js
app.post('/articles', (req, res) => {
    try {
        ......
    } catch (err) {
         // 由错误处理中间件统一处理
        next(err);
    }
})

......
// 它之前的所有路由中调用 next(err) 就会进入这里
// 注意：4个参数，缺一不可
app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message,
    });
});

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`)
})
```

## 创建文章

```js
app.post("/articles", async (req, res, next) => {
  try {
    // 1. 获取客户端表单数据
    const { article } = req.body;

    // 2. 数据验证
    if (!article || !article.title || !article.description || !article.body) {
      return res.status(422).json({
        error: "请求参数不符合规则要求",
      });
    }

    // 3. 把验证通过的数据插入数据库中
    //    成功 -> 发送成功响应
    //    失败 -> 发送失败响应
    await dbClient.connect();

    const collection = dbClient.db("test").collection("articles");

    article.createdAt = new Date();
    article.updatedAt = new Date();
    const ret = await collection.insertOne(article);

    article._id = ret.insertedId;

    res.status(201).json({
      article,
    });
  } catch (err) {
    // 由错误处理中间件统一处理
    next(err);
    // res.status(500).json({
    //   error: err.message
    // })
  }
});
```

## 获取文章列表

```js
app.get("/articles", async (req, res, next) => {
  try {
    let { _page = 1, _size = 10 } = req.query;
    _page = Number.parseInt(_page);
    _size = Number.parseInt(_size);
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    const ret = await collection
      .find() // 查询数据
      .skip((_page - 1) * _size) // 跳过多少条 10 1 0 2 10 3 20 n
      .limit(_size); // 拿多少条
    const articles = await ret.toArray();
    const articlesCount = await collection.countDocuments();
    res.status(200).json({
      articles,
      articlesCount,
    });
  } catch (err) {
    next(err);
  }
});
```

## 获取单个文章

```js
app.get("/articles/:id", async (req, res, next) => {
  try {
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");

    const article = await collection.findOne({
      _id: ObjectID(req.params.id),
    });

    res.status(200).json({
      article,
    });
  } catch (err) {
    next(err);
  }
});
```

## 更新文章

```js
app.patch("/articles/:id", async (req, res, next) => {
  try {
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");

    await collection.updateOne(
      {
        _id: ObjectID(req.params.id),
      },
      {
        $set: req.body.article,
      }
    );

    const article = await collection.findOne({
      _id: ObjectID(req.params.id),
    });

    res.status(201).json({
      article,
    });
  } catch (err) {
    next(err);
  }
});
```

## 删除文章

```js
app.delete("/articles/:id", async (req, res, next) => {
  try {
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    await collection.deleteOne({
      _id: ObjectID(req.params.id),
    });
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
});
```

## 完整代码

```js
const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");

const connectUri = "mongodb://localhost:27017";

const dbClient = new MongoClient(connectUri);

const app = express();

// 配置解析请求体数据 application/json
// 它会把解析到的请求体数据放到 req.body 中
// 注意：一定要在使用之前就挂载这个中间件
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/articles", async (req, res, next) => {
  try {
    // 1. 获取客户端表单数据
    const { article } = req.body;

    // 2. 数据验证
    if (!article || !article.title || !article.description || !article.body) {
      return res.status(422).json({
        error: "请求参数不符合规则要求",
      });
    }

    // 3. 把验证通过的数据插入数据库中
    //    成功 -> 发送成功响应
    //    失败 -> 发送失败响应
    await dbClient.connect();

    const collection = dbClient.db("test").collection("articles");

    article.createdAt = new Date();
    article.updatedAt = new Date();
    const ret = await collection.insertOne(article);

    article._id = ret.insertedId;

    res.status(201).json({
      article,
    });
  } catch (err) {
    // 由错误处理中间件统一处理
    next(err);
    // res.status(500).json({
    //   error: err.message
    // })
  }
});

app.get("/articles", async (req, res, next) => {
  try {
    let { _page = 1, _size = 10 } = req.query;
    _page = Number.parseInt(_page);
    _size = Number.parseInt(_size);
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    const ret = await collection
      .find() // 查询数据
      .skip((_page - 1) * _size) // 跳过多少条 10 1 0 2 10 3 20 n
      .limit(_size); // 拿多少条
    const articles = await ret.toArray();
    const articlesCount = await collection.countDocuments();
    res.status(200).json({
      articles,
      articlesCount,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/articles/:id", async (req, res, next) => {
  try {
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");

    const article = await collection.findOne({
      _id: ObjectID(req.params.id),
    });

    res.status(200).json({
      article,
    });
  } catch (err) {
    next(err);
  }
});

app.patch("/articles/:id", async (req, res, next) => {
  try {
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");

    await collection.updateOne(
      {
        _id: ObjectID(req.params.id),
      },
      {
        $set: req.body.article,
      }
    );

    const article = await await collection.findOne({
      _id: ObjectID(req.params.id),
    });

    res.status(201).json({
      article,
    });
  } catch (err) {
    next(err);
  }
});

app.delete("/articles/:id", async (req, res, next) => {
  try {
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    await collection.deleteOne({
      _id: ObjectID(req.params.id),
    });
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
});

// 它之前的所有路由中调用 next(err) 就会进入这里
// 注意：4个参数，缺一不可
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
  });
});

app.listen(3000, () => {
  console.log("app listenning at port 3000.");
});
```

# MongoDB 基础操作（CRUD）

数据的增删改查，简称 CRUD

> - **C**reate 创建
> - **R**ead 读取
>
> - **U**pdate 更新
> - **D**elete 删除

# 创建文档

创建或插入操作将新文档添加到集合中。如果集合当前不存在，则插入操作将创建集合。

MongoDB 提供以下方法，用于将文档插入集合中：

| `db.collection.insertOne()`  | 插入单个文档到集合中          |
| ---------------------------- | ----------------------------- |
| `db.collection.insertMany()` | 插入多个文档到集合中          |
| `db.collection.insert()`     | 将 1 个或多个文档插入到集合中 |

![img](https://cdn.nlark.com/yuque/0/2020/svg/152778/1604313944549-a98ee89a-a84d-4115-8d2a-9c32e1d93759.svg)

## 插入单个文档

```javascript
db.inventory.insertOne({
  item: "canvas",
  qty: 100,
  tags: ["cotton"],
  size: { h: 28, w: 35.5, uom: "cm" },
});
```

## 插入多个文档

```javascript
db.inventory.insertMany([
  { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
  { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
  { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } },
]);
```

## 插入行为

1、集合创建

如果该集合当前不存在，则插入操作将创建该集合。

2、\_id 字段

在 MongoDB 中，存储在集合中的每个文档都需要一个唯一的 \_id 字段作为主键。如果插入的文档省略 \_id 字段，则 MongoDB 驱动程序会自动为 \_id 字段生成 ObjectId。

# 查询文档

## 基本查询

读取操作从集合中检索文档；即查询集合中的文档。 MongoDB 提供了以下方法来从集合中读取文档：

- db.collection.find(query, projection)

- - query ：可选，使用查询操作符指定查询条件
  - projection ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。

- db.collection.findOne()

![img](https://cdn.nlark.com/yuque/0/2020/svg/152778/1604313990615-962088f4-0f71-4413-97c6-f1e1577e5651.svg)

有关示例，请参见：

- [Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/)
- [Query on Embedded/Nested Documents](https://docs.mongodb.com/manual/tutorial/query-embedded-documents/)

- [Query an Array](https://docs.mongodb.com/manual/tutorial/query-arrays/)
- [Query an Array of Embedded Documents](https://docs.mongodb.com/manual/tutorial/query-array-of-documents/)

开始下面的练习之前先来生成一些测试数据：

```javascript
db.inventory.insertMany([
  { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
  { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
  { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
  { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
  { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },
]);
```

### 查询所有文档

```javascript
db.inventory.find({});
```

等价于 SQL 中的 `SELECT * FROM inventory` 语句。

格式化打印结果：

```javascript
db.myCollection.find().pretty();
```

### 指定返回的文档字段

```javascript
db.inventory.find(
  {},
  {
    item: 1,
    qty: 1,
  }
);
```

### 相等条件查询

```javascript
db.inventory.find({ status: "D" });
```

等价于 SQL 中的 `SELECT * FROM inventory WHERE status = "D"` 语句。

### 指定 AND 条件

以下示例检索状态为“ A”且数量小于（$ lt）30 的清单集合中的所有文档：

```javascript
db.inventory.find({ status: "A", qty: { $lt: 30 } });
```

该操作对应于以下 SQL 语句：

```sql
SELECT * FROM inventory WHERE status = "A" AND qty < 30
```

### 指定 OR 条件

使用 `$or` 运算符，您可以指定一个复合查询，该查询将每个子句与一个逻辑或连接相连接，以便该查询选择集合中至少匹配一个条件的文档。

下面的示例检索状态为 `A` 或数量小于 `$lt30` 的集合中的所有文档：

```javascript
db.inventory.find({
  $or: [{ status: "A" }, { qty: { $lt: 30 } }],
});
```

该操作对应于以下 SQL 语句：

```sql
SELECT * FROM inventory WHERE status = "A" OR qty < 30
```

### 指定 AND 和 OR 条件

在下面的示例中，复合查询文档选择状态为“ A”且 qty 小于（$ lt）30 或 item 以字符 p 开头的所有文档：

```javascript
db.inventory.find({
  status: "A",
  $or: [{ qty: { $lt: 30 } }, { item: /^p/ }],
});
```

该操作对应于以下 SQL 语句：

```sql
SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
```

### 使用查询运算符指定条件

下面的示例从状态为“ A”或“ D”等于“库存”的清单集中检索所有文档：

```javascript
db.inventory.find({ status: { $in: ["A", "D"] } });
```

该操作对应以下 SQL 语句：

```sql
SELECT * FROM inventory WHERE status in ("A", "D")
```

完成的查询运算符参考：https://docs.mongodb.com/manual/reference/operator/query/。

### 查询运算符

参考：https://docs.mongodb.com/manual/reference/operator/query-comparison/

比较运算符：

| 名称   | 描述                       |
| ------ | -------------------------- |
| `$eq`  | 匹配等于指定值的值。       |
| `$gt`  | 匹配大于指定值的值。       |
| `$gte` | 匹配大于或等于指定值的值。 |
| `$in`  | 匹配数组中指定的任何值。   |
| `$lt`  | 匹配小于指定值的值。       |
| `$lte` | 匹配小于或等于指定值的值。 |
| `$ne`  | 匹配所有不等于指定值的值。 |
| `$nin` | 不匹配数组中指定的任何值。 |

逻辑运算符：

| 名称   | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| `$and` | 将查询子句与逻辑连接，并返回与这两个子句条件匹配的所有文档。 |
| `$not` | 反转查询表达式的效果，并返回与查询表达式不匹配的文档。       |
| `$nor` | 用逻辑 NOR 连接查询子句，返回所有不能匹配这两个子句的文档。  |
| `$or`  | 用逻辑连接查询子句，或返回与任一子句条件匹配的所有文档。     |

## 查询嵌套文档

### 匹配嵌套文档

要在作为嵌入/嵌套文档的字段上指定相等条件，请使用查询过滤器文档 `{<field>: <value>}`，其中 `<value>` 是要匹配的文档。

例如，以下查询选择字段大小等于文档 `{h: 14, w: 21, uom: "cm"}` 的所有文档：

```javascript
db.inventory.find({
  size: { h: 14, w: 21, uom: "cm" },
});
```

整个嵌入式文档上的相等匹配要求与指定的 `<value>` 文档完全匹配，包括字段顺序。例如，以下查询与库存收集中的任何文档都不匹配：

```javascript
db.inventory.find({
  size: { w: 21, h: 14, uom: "cm" },
});
```

### 查询嵌套字段

要在嵌入式/嵌套文档中的字段上指定查询条件，请使用点符号 `("field.nestedField")`。

注意：使用点符号查询时，字段和嵌套字段必须在引号内。

#### 在嵌套字段上指定相等匹配

以下示例选择嵌套在 size 字段中的 uom 字段等于 `"in"` 的所有文档：

```javascript
db.inventory.find({
  "size.uom": "in",
});
```

#### 使用查询运算符指定匹配项

查询过滤器文档可以使用查询运算符以以下形式指定条件：

```javascript
{ <field1>: { <operator1>: <value1> }, ... }
```

以下查询在 `size` 字段中嵌入的字段 `h` 上使用小于运算符 `$lt`

```javascript
db.inventory.find({
  "size.h": { $lt: 15 },
});
```

#### 指定 AND 条件

以下查询选择嵌套字段 `h` 小于 15，嵌套字段 `uom` 等于 `"in"`，状态字段等于 `"D"` 的所有文档：

```javascript
db.inventory.find({
  "size.h": { $lt: 15 },
  "size.uom": "in",
  status: "D",
});
```

## 查询数组

练习之前，先插入测试数据：

```javascript
db.inventory.insertMany([
  { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [14, 21] },
  { item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [14, 21] },
  { item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [14, 21] },
  { item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [22.85, 30] },
  { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [10, 15.25] },
]);
```

### 匹配一个数组

要在数组上指定相等条件，请使用查询文档 `{<field>: <value>}`，其中 `<value>` 是要匹配的精确数组，包括元素的顺序。

下面的示例查询所有文档，其中字段标签值是按指定顺序恰好具有两个元素 `"red"` 和 `"blank"` 的数组：

```javascript
db.inventory.find({
  tags: ["red", "blank"],
});
```

相反，如果您希望找到一个同时包含元素 `"red"` 和 `"blank"` 的数组，而不考虑顺序或该数组中的其他元素，请使用 `$all` 运算符：

```javascript
db.inventory.find({
  tags: { $all: ["red", "blank"] },
});
```

### 查询数组中的元素

要查询数组字段是否包含至少一个具有指定值的元素，请使用过滤器` {<field>: <value>}`，其中 `<value>` 是元素值。

以下示例查询所有文档，其中 `tag` 是一个包含字符串 `"red"` 作为其元素之一的数组：

```javascript
db.inventory.find({
  tags: "red",
});
```

要在数组字段中的元素上指定条件，请在查询过滤器文档中使用查询运算符：

```javascript
{ <array field>: { <operator1>: <value1>, ... } }
```

例如，以下操作查询数组 `dim_cm` 包含至少一个值大于 25 的元素的所有文档。

```javascript
db.inventory.find({
  dim_cm: { $gt: 25 },
});
```

### 为数组元素指定多个条件

在数组元素上指定复合条件时，可以指定查询，以使单个数组元素满足这些条件，或者数组元素的任何组合均满足条件。

#### 使用数组元素上的复合过滤条件查询数组

以下示例查询文档，其中 `dim_cm` 数组包含以某种组合满足查询条件的元素；

例如，一个元素可以满足大于 15 的条件，而另一个元素可以满足小于 20 的条件；或者单个元素可以满足以下两个条件：

```javascript
db.inventory.find({ dim_cm: { $gt: 15, $lt: 20 } });
```

#### 查询满足多个条件的数组元素

使用 [$elemMatch](https://docs.mongodb.com/manual/reference/operator/query/elemMatch/#op._S_elemMatch) 运算符可以在数组的元素上指定多个条件，以使至少一个数组元素满足所有指定的条件。

以下示例查询在 `dim_cm` 数组中包含至少一个同时 大于 22 和 小于 30 的元素的文档：

```javascript
db.inventory.find({
  dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } },
});
```

#### 通过数组索引位置查询元素

使用点符号，可以为数组的特定索引或位置指定元素的查询条件。该数组使用基于零的索引。

注意：使用点符号查询时，字段和嵌套字段必须在引号内。

下面的示例查询数组 `dim_cm` 中第二个元素大于 25 的所有文档：

```javascript
db.inventory.find({ "dim_cm.1": { $gt: 25 } });
```

#### 通过数组长度查询数组

使用 `$size` 运算符可按元素数量查询数组。

例如，以下选择数组标签具有 3 个元素的文档。

```javascript
db.inventory.find({ tags: { $size: 3 } });
```

## 查询嵌入文档的数组

测试数据：

```javascript
db.inventory.insertMany([
  {
    item: "journal",
    instock: [
      { warehouse: "A", qty: 5 },
      { warehouse: "C", qty: 15 },
    ],
  },
  { item: "notebook", instock: [{ warehouse: "C", qty: 5 }] },
  {
    item: "paper",
    instock: [
      { warehouse: "A", qty: 60 },
      { warehouse: "B", qty: 15 },
    ],
  },
  {
    item: "planner",
    instock: [
      { warehouse: "A", qty: 40 },
      { warehouse: "B", qty: 5 },
    ],
  },
  {
    item: "postcard",
    instock: [
      { warehouse: "B", qty: 15 },
      { warehouse: "C", qty: 35 },
    ],
  },
]);
```

### 查询嵌套在数组中的文档

以下示例选择库存数组中的元素与指定文档匹配的所有文档：

```javascript
db.inventory.find({
  instock: { warehouse: "A", qty: 5 },
});
```

整个嵌入式/嵌套文档上的相等匹配要求与指定文档（包括字段顺序）完全匹配。例如，以下查询与库存收集中的任何文档都不匹配：

```javascript
db.inventory.find({
  instock: { qty: 5, warehouse: "A" },
});
```

### 在文档数组中的字段上指定查询条件

#### 在嵌入文档数组中的字段上指定查询条件

如果您不知道嵌套在数组中的文档的索引位置，请使用点（。）和嵌套文档中的字段名称来连接数组字段的名称。

下面的示例选择所有库存数组中包含至少一个嵌入式文档的嵌入式文档，这些嵌入式文档包含值小于或等于 20 的字段 qty：

```javascript
db.inventory.find({ "instock.qty": { $lte: 20 } });
```

#### 使用数组索引在嵌入式文档中查询字段

使用点表示法，您可以为文档中特定索引或数组位置处的字段指定查询条件。该数组使用基于零的索引。

注意：使用点符号查询时，字段和索引必须在引号内。

下面的示例选择所有库存文件，其中库存数组的第一个元素是包含值小于或等于 20 的字段 qty 的文档：

```javascript
db.inventory.find({ "instock.0.qty": { $lte: 20 } });
```

### 为文档数组指定多个条件

在嵌套在文档数组中的多个字段上指定条件时，可以指定查询，以使单个文档满足这些条件，或者数组中文档的任何组合（包括单个文档）都满足条件。

#### 单个嵌套文档在嵌套字段上满足多个查询条件

使用$ elemMatch 运算符可在一组嵌入式文档上指定多个条件，以使至少一个嵌入式文档满足所有指定条件。

下面的示例查询库存数组中至少有一个嵌入式文档的文档，这些文档同时包含等于 5 的字段 qty 和等于 A 的字段仓库：

```javascript
db.inventory.find({ instock: { $elemMatch: { qty: 5, warehouse: "A" } } });
```

下面的示例查询库存数组中至少有一个嵌入式文档的嵌入式文档包含的字段 qty 大于 10 且小于或等于 20：

```javascript
db.inventory.find({ instock: { $elemMatch: { qty: { $gt: 10, $lte: 20 } } } });
```

#### 元素组合满足标准

如果数组字段上的复合查询条件未使用$ elemMatch 运算符，则查询将选择其数组包含满足条件的元素的任意组合的那些文档。

例如，以下查询匹配文档，其中嵌套在库存数组中的任何文档的 qty 字段都大于 10，而数组中的任何文档（但不一定是同一嵌入式文档）的 qty 字段小于或等于 20：

```javascript
db.inventory.find({ "instock.qty": { $gt: 10, $lte: 20 } });
```

下面的示例查询库存数组中具有至少一个包含数量等于 5 的嵌入式文档和至少一个包含等于 A 的字段仓库的嵌入式文档（但不一定是同一嵌入式文档）的文档：

```javascript
db.inventory.find({ "instock.qty": 5, "instock.warehouse": "A" });
```

## 指定从查询返回的项目字段

默认情况下，MongoDB 中的查询返回匹配文档中的所有字段。要限制 MongoDB 发送给应用程序的数据量，可以包含一个投影文档以指定或限制要返回的字段。

测试数据：

```javascript
db.inventory.insertMany([
  {
    item: "journal",
    status: "A",
    size: { h: 14, w: 21, uom: "cm" },
    instock: [{ warehouse: "A", qty: 5 }],
  },
  {
    item: "notebook",
    status: "A",
    size: { h: 8.5, w: 11, uom: "in" },
    instock: [{ warehouse: "C", qty: 5 }],
  },
  {
    item: "paper",
    status: "D",
    size: { h: 8.5, w: 11, uom: "in" },
    instock: [{ warehouse: "A", qty: 60 }],
  },
  {
    item: "planner",
    status: "D",
    size: { h: 22.85, w: 30, uom: "cm" },
    instock: [{ warehouse: "A", qty: 40 }],
  },
  {
    item: "postcard",
    status: "A",
    size: { h: 10, w: 15.25, uom: "cm" },
    instock: [
      { warehouse: "B", qty: 15 },
      { warehouse: "C", qty: 35 },
    ],
  },
]);
```

### 返回匹配文档中所有字段

下面的示例返回状态为 `"A"` 的清单集合中所有文档的所有字段：

```javascript
db.inventory.find({ status: "A" });
```

### 仅返回指定字段和 `_id` 字段

通过将投影文档中的 `<field>` 设置为 `1`，投影可以显式包含多个字段。以下操作返回与查询匹配的所有文档。在结果集中，在匹配的文档中仅返回项目，状态和默认情况下的 `_id` 字段。

```javascript
db.inventory.find({ status: "A" }, { item: 1, status: 1 });
```

### 禁止 `_id` 字段

您可以通过将投影中的 `_id` 字段设置为 `0` 来从结果中删除 `_id` 字段，如以下示例所示：

```javascript
db.inventory.find({ status: "A" }, { item: 1, status: 1, _id: 0 });
```

### 返回所有但排除的字段

您可以使用投影排除特定字段，而不用列出要在匹配文档中返回的字段。以下示例返回匹配文档中状态和库存字段以外的所有字段：

```javascript
db.inventory.find({ status: "A" }, { status: 0, instock: 0 });
```

### 返回嵌入式文档中的特定字段

您可以返回嵌入式文档中的特定字段。使用点表示法引用嵌入式字段，并在投影文档中将其设置为`1`。

以下示例返回：

- `_id` 字段（默认情况下返回）
- `item` 字段

- `status` 字段
- `size` 文档中的 `uom` 字段

`uom` 字段仍嵌入在尺寸文档中。

```javascript
db.inventory.find({ status: "A" }, { item: 1, status: 1, "size.uom": 1 });
```

从 MongoDB 4.4 开始，您还可以使用嵌套形式指定嵌入式字段，例如 `{item: 1, status: 1, size: {uom: 1}}`。

### 禁止嵌入文档中的特定字段

您可以隐藏嵌入式文档中的特定字段。使用点表示法引用投影文档中的嵌入字段并将其设置为`0`。

以下示例指定一个投影，以排除尺寸文档内的 `uom` 字段。其他所有字段均在匹配的文档中返回：

```javascript
db.inventory.find({ status: "A" }, { "size.uom": 0 });
```

从 MongoDB 4.4 开始，您还可以使用嵌套形式指定嵌入式字段，例如 `{ size: { uom: 0 } }`。

### 在数组中的嵌入式文档上投射

使用点表示法可将特定字段投影在嵌入数组的文档中。

以下示例指定要返回的投影：

- `_id` 字段（默认情况下返回）
- `item` 字段

- `status` 字段
- `qty` 数组中嵌入的文档中的 `instock` 字段

```javascript
db.inventory.find({ status: "A" }, { item: 1, status: 1, "instock.qty": 1 });
```

### 返回数组中的项目特定数组元素

对于包含数组的字段，MongoDB 提供以下用于操纵数组的投影运算符：$elemMatch，$slice 和$。

下面的示例使用 $slice 投影运算符返回库存数组中的最后一个元素：

```javascript
db.inventory.find({ status: "A" }, { item: 1, status: 1, instock: { $slice: -1 } });
```

$elemMatch，$slice 和 $ 是投影要包含在返回数组中的特定元素的唯一方法。例如，您不能使用数组索引来投影特定的数组元素。例如{“ instock.0”：1}投影不会投影第一个元素的数组。

## 查询空字段或缺少字段

MongoDB 中的不同查询运算符对空值的处理方式不同。

测试数据：

```javascript
db.inventory.insertMany([{ _id: 1, item: null }, { _id: 2 }]);
```

### 相等过滤器

`{item: null}` 查询将匹配包含其值为 `null` 的 `item` 字段或不包含 `item` 字段的文档。

```javascript
db.inventory.find({ item: null });
```

该查询返回集合中的两个文档。

### 类型检查

`{ item: { $type: 10 } }` 查询仅匹配包含 `item` 字段，其值为 `null` 的文档；即 `item` 字段的值为 BSON 类型为 Null（类型编号 10）：

```javascript
db.inventory.find({ item: { $type: 10 } });
```

该查询仅返回 `item` 字段值为 `null` 的文档。

### 存在检查

以下示例查询不包含字段的文档。

`{ { item: { $exists：false }}` 查询与不包含 `item` 字段的文档匹配：

```javascript
db.inventory.find({ item: { $exists: false } });
```

该查询仅返回不包含项目字段的文档。

# 更新文档

更新操作会修改集合中的现有文档。 MongoDB 提供了以下方法来更新集合的文档：

- `db.collection.updateOne(<filter>, <update>, <options>)`
- `db.collection.updateMany(<filter>, <update>, <options>)`

- `db.collection.replaceOne(<filter>, <update>, <options>)`

您可以指定标识要更新的文档的条件或过滤器。这些过滤器使用与读取操作相同的语法。

![img](https://cdn.nlark.com/yuque/0/2020/svg/152778/1604314104709-3f5831c9-ac49-4c38-aacd-97619bf4ba99.svg)

测试数据：

```javascript
db.inventory.insertMany([
  { item: "canvas", qty: 100, size: { h: 28, w: 35.5, uom: "cm" }, status: "A" },
  { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
  { item: "mat", qty: 85, size: { h: 27.9, w: 35.5, uom: "cm" }, status: "A" },
  { item: "mousepad", qty: 25, size: { h: 19, w: 22.85, uom: "cm" }, status: "P" },
  { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "P" },
  { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
  { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
  { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },
  { item: "sketchbook", qty: 80, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
  { item: "sketch pad", qty: 95, size: { h: 22.85, w: 30.5, uom: "cm" }, status: "A" },
]);
```

## 语法

为了更新文档，MongoDB 提供了更新操作符（例如 `$set`）来修改字段值。

要使用更新运算符，请将以下形式的更新文档传递给更新方法：

```javascript
{
  <update operator>: { <field1>: <value1>, ... },
  <update operator>: { <field2>: <value2>, ... },
  ...
}
```

如果该字段不存在，则某些更新运算符（例如$ set）将创建该字段。有关详细信息，请参见各个更新操作员参考。

## 更新单个文档

下面的示例在清单集合上使用 `db.collection.updateOne()` 方法更新项目等于 `paper` 的第一个文档：

```javascript
db.inventory.updateOne(
  { item: "paper" },
  {
    $set: { "size.uom": "cm", status: "P" },
    $currentDate: { lastModified: true },
  }
);
```

更新操作：

- 使用 `$set` 运算符将 `size.uom` 字段的值更新为 `cm`，将状态字段的值更新为 `P`
- 使用 `$currentDate` 运算符将 `lastModified` 字段的值更新为当前日期。如果 `lastModified` 字段不存在，则 `$currentDate` 将创建该字段。

## 更新多个文档

以下示例在清单集合上使用 `db.collection.updateMany()` 方法来更新数量小于 50 的所有文档：

```javascript
db.inventory.updateMany(
  { qty: { $lt: 50 } },
  {
    $set: { "size.uom": "in", status: "P" },
    $currentDate: { lastModified: true },
  }
);
```

更新操作：

- 使用 $set 运算符将 size.uom 字段的值更新为 `"in"`，将状态字段的值更新为 `"p"`
- 使用 `$currentDate` 运算符将 `lastModified` 字段的值更新为当前日期。如果 `lastModified` 字段不存在，则 `$currentDate` 将创建该字段。

## 替换文档

要替换 \_id 字段以外的文档的全部内容，请将一个全新的文档作为第二个参数传递给 `db.collection.replaceOne()`。

替换文档时，替换文档必须仅由字段/值对组成；即不包含更新运算符表达式。

替换文档可以具有与原始文档不同的字段。在替换文档中，由于 `_id` 字段是不可变的，因此可以省略 `_id` 字段；但是，如果您确实包含 `_id` 字段，则它必须与当前值具有相同的值。

以下示例替换了清单集合中项目 `"paper"` 的第一个文档：

```javascript
db.inventory.replaceOne(
  { item: "paper" },
  {
    item: "paper",
    instock: [
      { warehouse: "A", qty: 60 },
      { warehouse: "B", qty: 40 },
    ],
  }
);
```

# 删除文档

删除操作从集合中删除文档。 MongoDB 提供了以下删除集合文档的方法：

- `db.collection.deleteMany()`
- `db.collection.deleteOne()`

您可以指定标准或过滤器，以标识要删除的文档。这些过滤器使用与读取操作相同的语法。

![img](https://cdn.nlark.com/yuque/0/2020/svg/152778/1604314172728-55b56ab9-9a54-41de-ae9d-5c9b3c724890.svg)

测试数据：

```javascript
db.inventory.insertMany([
  { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
  { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "P" },
  { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
  { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
  { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },
]);
```

## 删除所有文档

要删除集合中的所有文档，请将空的过滤器文档{}传递给 db.collection.deleteMany（）方法。

以下示例从清单收集中删除所有文档：

```javascript
db.inventory.deleteMany({});
```

该方法返回具有操作状态的文档。有关更多信息和示例，请参见 deleteMany()。

## 删除所有符合条件的文档

您可以指定标准或过滤器，以标识要删除的文档。筛选器使用与读取操作相同的语法。

要指定相等条件，请在查询过滤器文档中使用<field>：<value>表达式：

```javascript
{ <field1>: <value1>, ... }
```

查询过滤器文档可以使用查询运算符以以下形式指定条件：

```javascript
{ <field1>: { <operator1>: <value1> }, ... }
```

要删除所有符合删除条件的文档，请将过滤器参数传递给 deleteMany（）方法。

以下示例从状态字段等于“ A”的清单集合中删除所有文档：

```javascript
db.inventory.deleteMany({ status: "A" });
```

该方法返回具有操作状态的文档。有关更多信息和示例，请参见 deleteMany（）。

## 仅删除 1 个符合条件的文档

要删除最多一个与指定过滤器匹配的文档（即使多个文档可能与指定过滤器匹配），请使用 db.collection.deleteOne（）方法。

下面的示例删除状态为“ D”的第一个文档：

```javascript
db.inventory.deleteOne({ status: "D" });
```
