# Express 开发接口服务

## 1.案例介绍

- GitHub 仓库：https://github.com/gothinkster/realworld
- 客户端在线示例：https://demo.realworld.io/
- 接口文档：https://github.com/gothinkster/realworld/tree/master/api

此文编写的案例代码：[Node/realworld-api-express · 云牧/exampleCode - 码云 - 开源中国 (gitee.com)](https://gitee.com/z1725163126/example-code/tree/master/Node/realworld-api-express)

## 2.RESTful 接口设计规范

> # RESTful API 设计规范
>
> ## 协议
>
> API 与用户的通信协议，尽量使用 HTTPS 协议。
>
> ## 域名
>
> 应该尽量将 API 部署在专用域名之下。
>
> ```plain
> https://api.example.com
> ```
>
> 如果确定 API 很简单，不会有进一步扩展，可以考虑放在主域名下。
>
> ```plain
> https://example.org/api/
> ```
>
> ## 版本
>
> 应该将 API 的版本号放入 URL。
>
> ```plain
> https://api.example.com/v1/
> ```
>
> 另一种做法是，将版本号放在 HTTP 头信息中，但不如放入 URL 方便和直观。[Github](https://developer.github.com/v3/media/#request-specific-version) 采用这种做法。
>
> ## 路径
>
> 路径又称"终点"（endpoint），表示 API 的具体网址。
>
> 在 RESTful 架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的"集合"（collection），所以 API 中的名词也应该使用复数。
>
> 举例来说，有一个 API 提供动物园（zoo）的信息，还包括各种动物和雇员的信息，则它的路径应该设计成下面这样。
>
> - https://api.example.com/v1/zoos
> - https://api.example.com/v1/animals
>
> - https://api.example.com/v1/employees
>
> ## HTTP 动词
>
> 对于资源的具体操作类型，由 HTTP 动词表示。
>
> 常用的 HTTP 动词有下面五个（括号里是对应的 SQL 命令）。
>
> - GET（读取）：从服务器取出资源（一项或多项）。
> - POST（创建）：在服务器新建一个资源。
>
> - PUT（完整更新）：在服务器更新资源（客户端提供改变后的完整资源）。
> - PATCH（部分更新）：在服务器更新资源（客户端提供改变的属性）。
>
> - DELETE（删除）：从服务器删除资源。
>
> 还有两个不常用的 HTTP 动词。
>
> - HEAD：获取资源的元数据。
> - OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。
>
> 下面是一些例子。
>
> - GET /zoos：列出所有动物园
> - POST /zoos：新建一个动物园
>
> - GET /zoos/ID：获取某个指定动物园的信息
> - PUT /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
>
> - PATCH /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
> - DELETE /zoos/ID：删除某个动物园
>
> - GET /zoos/ID/animals：列出某个指定动物园的所有动物
> - DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物
>
> ## 过滤信息
>
> 如果记录数量很多，服务器不可能都将它们返回给用户。API 应该提供参数，过滤返回结果。
>
> 下面是一些常见的参数。
>
> - ?limit=10：指定返回记录的数量
> - ?offset=10：指定返回记录的开始位置。
>
> - ?page=2&per_page=100：指定第几页，以及每页的记录数。
> - ?sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。
>
> - ?animal_type_id=1：指定筛选条件
>
> 参数的设计允许存在冗余，即允许 API 路径和 URL 参数偶尔有重复。比如，GET /zoo/ID/animals 与 GET /animals?zoo_id=ID 的含义是相同的。
>
> ## 状态码
>
> 客户端的每一次请求，服务器都必须给出回应。回应包括 HTTP 状态码和数据两部分。
>
> HTTP 状态码就是一个三位数，分成五个类别。
>
> - `1xx`：相关信息
> - `2xx`：操作成功
>
> - `3xx`：重定向
> - `4xx`：客户端错误
>
> - `5xx`：服务器错误
>
> 这五大类总共包含[100 多种](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)状态码，覆盖了绝大部分可能遇到的情况。每一种状态码都有标准的（或者约定的）解释，客户端只需查看状态码，就可以判断出发生了什么情况，所以服务器应该返回尽可能精确的状态码。
>
> 常见的有以下一些（方括号中是该状态码对应的 HTTP 动词）。
>
> - 200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
> - 201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
>
> - 202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
> - 204 NO CONTENT - [DELETE]：用户删除数据成功。
>
> - 400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
> - 401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
>
> - 403 Forbidden - [*] 表示用户得到授权（与 401 错误相对），但是访问是被禁止的。
> - 404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
>
> - 406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求 JSON 格式，但是只有 XML 格式）。
> - 410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
>
> - 422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
> - 500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
>
> 状态码的完全列表参见[这里](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)。
>
> ## 返回结果
>
> API 返回的数据格式，不应该是纯文本，而应该是一个 JSON 对象，因为这样才能返回标准的结构化数据。所以，服务器回应的 HTTP 头的 `Content-Type` 属性要设为 `application/json`。
>
> 针对不同操作，服务器向用户返回的结果应该符合以下规范。
>
> - GET /collection：返回资源对象的列表（数组）
> - GET /collection/resource：返回单个资源对象
>
> - POST /collection：返回新生成的资源对象
> - PUT /collection/resource：返回完整的资源对象
>
> - PATCH /collection/resource：返回完整的资源对象
> - DELETE /collection/resource：返回一个空文档
>
> ## 错误处理
>
> 有一种不恰当的做法是，即使发生错误，也返回 200 状态码，把错误信息放在数据体里面，就像下面这样。
>
> ```json
> HTTP/1.1 200 OK
> Content-Type: application/json
>
> {
>   "status": "failure",
>   "data": {
>     "error": "Expected at least two items in list."
>   }
> }
> ```
>
> 上面代码中，解析数据体以后，才能得知操作失败。
>
> 这种做法实际上取消了状态码，这是完全不可取的。正确的做法是，状态码反映发生的错误，具体的错误信息放在数据体里面返回。下面是一个例子。
>
> ```json
> HTTP/1.1 400 Bad Request
> Content-Type: application/json
>
> {
>   "error": "Invalid payoad.",
>   "detail": {
>      "surname": "This field is required."
>   }
> }
> ```
>
> ## 身份认证
>
> 基于 [JWT](https://jwt.io/) 的接口权限认证：
>
> - 字段名：`Authorization`
> - 字段值：`Bearer token数据`
>
> ## 跨域处理
>
> 可以在服务端设置 [CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS) 允许客户端跨域资源请求。

## 3.创建项目

```shell
mkdir realworld-api-express

cd realworld-api-express

npm init -y

npm i express
```

`app.js`

```js
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
```

![image-20220110162035915](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220110162035915.png)

## 4.目录结构

```shell
.
├── config	# 配置文件
│   └── config.default.js
├── controller	# 用于解析用户的输入，处理后返回相应的结果
├── model	# 数据持久层
├── middleware	# 用于编写中间件
├── router	# 用于配置 URL 路由规则
├── util	# 工具模块
└── app.js	# 用于自定义启动时的初始化工作
```

## 5.配置常用中间件

- 解析请求体

- - [express.json()](http://expressjs.com/en/4x/api.html#express.json)
  - express.urlencoded()

- 日志输出

- - [morgan()](http://expressjs.com/resources/middleware/morgan.html)

- 为客户端提供跨域资源请求

- - [cors()](https://github.com/expressjs/cors)

```JS
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
```

## 6.路由设计

参照：https://github.com/gothinkster/realworld/tree/master/api

### index.js 路由

```js
const express = require("express");
const router = express.Router();

// 用户相关路由
router.use(require("./user"));

// 用户资料相关路由
router.use("/profiles", require("./profile"));

// 文章相关路由
router.use("/articles", require("./article"));

// 标签相关路由
router.use(require("./tag"));

module.exports = router;
```

### user.js 用户相关路由

```js
const express = require("express");
const router = express.Router();

// Authentication 用户登录
router.post("/users/login", async (req, res, next) => {
  try {
    // 处理请求
    res.send("post /users/login");
  } catch (err) {
    next(err);
  }
});

// Registration 用户注册
router.post("/users", async (req, res, next) => {
  try {
    // 处理请求
    res.send("post /users");
  } catch (err) {
    next(err);
  }
});

// Get Current User 获取当前登录用户
router.get("/user", async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /user");
  } catch (err) {
    next(err);
  }
});

// Update User 更新用户
router.put("/user", async (req, res, next) => {
  try {
    // 处理请求
    res.send("put /user");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### profile.js 用户资料相关路由

```js
const express = require("express");
const router = express.Router();

// Get Profile 获取用户资料
router.get("/:username", async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /profile/:username");
  } catch (err) {
    next(err);
  }
});

// Follow user 关注用户
router.post("/:username/follow", async (req, res, next) => {
  try {
    // 处理请求
    res.send("post /profile/:username/follow");
  } catch (err) {
    next(err);
  }
});

// Unfollow user 取消关注用户
router.delete("/:username/follow", async (req, res, next) => {
  try {
    // 处理请求
    res.send("delete /profile/:username/follow");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### article.js 文章相关路由

```js
const express = require("express");
const router = express.Router();

// List Articles
router.get("/", async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /");
  } catch (err) {
    next(err);
  }
});

// Feed Articles
router.get("/feed", async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /articles/feed");
  } catch (err) {
    next(err);
  }
});

// Get Article
router.get("/:slug", async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /articles/:slug");
  } catch (err) {
    next(err);
  }
});

// Create Article
router.post("/", async (req, res, next) => {
  try {
    // 处理请求
    res.send("post /articles");
  } catch (err) {
    next(err);
  }
});

// Update Article
router.put("/:slug", async (req, res, next) => {
  try {
    // 处理请求
    res.send("put /articles/:slug");
  } catch (err) {
    next(err);
  }
});

// Delete Article
router.delete("/:slug", async (req, res, next) => {
  try {
    // 处理请求
    res.send("delete /articles/:slug");
  } catch (err) {
    next(err);
  }
});

// Add Comments to an Article
router.post("/:slug/comments", async (req, res, next) => {
  try {
    // 处理请求
    res.send("post /articles/:slug/comments");
  } catch (err) {
    next(err);
  }
});

// Get Comments from an Article
router.get("/:slug/comments", async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /articles/:slug/comments");
  } catch (err) {
    next(err);
  }
});

// Delete Comment
router.delete("/:slug/comments/:id", async (req, res, next) => {
  try {
    // 处理请求
    res.send("delete /articles/:slug/comments/:id");
  } catch (err) {
    next(err);
  }
});

// Favorite Article
router.post("/:slug/favorite", async (req, res, next) => {
  try {
    // 处理请求
    res.send("post /articles/:slug/favorite");
  } catch (err) {
    next(err);
  }
});

// Unfavorite Article
router.delete("/:slug/favorite", async (req, res, next) => {
  try {
    // 处理请求
    res.send("delete /articles/:slug/favorite");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### tag.js 标签相关路由

```js
const express = require("express");
const router = express.Router();

// Get Tags
router.get("/tags", async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /tags");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

## 7.提取控制器模块

> 将具体的处理请求的操作提取到控制器模块中

以 user 为例，`controller/user.js`

```js
// Authentication 用户登录
exports.login = async (req, res, next) => {
  try {
    // 处理请求
    res.send("post /users/login");
  } catch (err) {
    next(err);
  }
};

// Registration 用户注册
exports.register = async (req, res, next) => {
  try {
    // 处理请求
    res.send("post /users");
  } catch (err) {
    next(err);
  }
};

// Get Current User 获取当前登录用户
exports.getCurrentUser = async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /user");
  } catch (err) {
    next(err);
  }
};

// Update User 更新用户
exports.updateUser = async (req, res, next) => {
  try {
    // 处理请求
    res.send("put /user");
  } catch (err) {
    next(err);
  }
};
```

`router/user.js`

```js
const express = require("express");
const userCtrl = require("../controller/user");

const router = express.Router();

// Authentication 用户登录
router.post("/users/login", userCtrl.login);

// Registration 用户注册
router.post("/users", userCtrl.register);

// Get Current User 获取当前登录用户
router.get("/user", userCtrl.getCurrentUser);

// Update User 更新用户
router.put("/user", userCtrl.updateUser);

module.exports = router;
```

## 8.配置统一错误处理中间件

`middleware/error-handler.js`

```js
const util = require("util");

module.exports = () => {
  return (err, req, res, next) => {
    res.status(500).json({
      error: util.format(err),
    });
  };
};
```

`app.js`

```js
const errorHandler = require("./middleware/error-handler");

// 挂载统一处理服务端错误中间件
app.use(errorHandler());
```

## 9.Postman 统一管理

> 可至 postman 添加文件夹管理请求和区分各类环境

![image-20220226005040482](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226005040482.png)

## 10.数据库

### 安装 mongoose

`npm i mongoose`

### 连接数据库

配置数据库默认地址 `config/config.default.js`

```js
/**
 * 默认配置
 */
module.exports = {
  dbURI: "mongodb://localhost:27017/realworld",
};
```

`model/index.js`

```js
const mongoose = require("mongoose");
const { dbURI } = require("../config/config.default");

// 连接 MongoDB 数据库
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
// 当连接失败的时候
db.on("error", (err) => {
  console.log("MongoDB 数据库连接失败！", err);
});
// 当连接成功的时候
db.once("open", function () {
  console.log("MongoDB 数据库连接成功！");
});
```

app.js 引入连接数据库

```js
require("./model");
```

### 设计数据模型

`model/user.js userSchema`

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = userSchema;
```

### 导出数据模型

`model/index.js`

```js
const mongoose = require("mongoose");
const { dbURI } = require("../config/config.default");

// 连接 MongoDB 数据库
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
// 当连接失败的时候
db.on("error", (err) => {
  console.log("MongoDB 数据库连接失败！", err);
});
// 当连接成功的时候
db.once("open", function () {
  console.log("MongoDB 数据库连接成功！");
});

// 组织导出模型看类
module.exports = {
  User: mongoose.model("User", require("./user")),
  Article: mongoose.model("Article", require("./article")),
};
```

### 将数据插入数据库

```js
const { User } = require("../model");

// Registration 用户注册
exports.register = async (req, res, next) => {
  try {
    let user = new User(req.body.user);
    // 保存到数据库
    await user.save();
    // 转成json
    user = user.toJSON();
    // 删除密码属性
    delete user.password;
    // 4. 发送成功响应，返回用户数据
    res.status(201).json({
      user,
    });
  } catch (err) {
    next(err);
  }
};
```

### 测试

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226012510586.png" alt="image-20220226012510586" style="zoom:50%;" />

### 优化提取通用数据模型

> 将通用的数据模型提取出来单独创建一个文件 base-model.js，然后在需要用的地方引入即可

`model/base-model.js`

```js
module.exports = {
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
};
```

## 11.数据验证

### 接口设计步骤

1. 获取请求体数据
2. 数据验证
   1. 基本数据验证
   2. 业务数据验证
3. 验证通过，将数据保存到数据库
4. 发送成功响应

### 数据验证问题

> mongodb 会在插入数据库的时候进行数据验证 其实我们需要在插入之前就要对数据进行一些验证
>
> 可以借助第三方库来实现 `awesome-nodejs` [github.com/sindresorhu…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsindresorhus%2Fawesome-nodejs)
>
> 这里我们使用 express-validator，这是一个基于 validator 的 Express 中间件(对 validator 的包装)
>
> [express-validator/express-validator: An express.js middleware for validator.js. (github.com)](https://github.com/express-validator/express-validator)

### 使用 express-validator

> 安装： `npm i express-validator`

在 `router/user.js `中加入中间件

```js
const { body, validationResult } = require("express-validator");
const { User } = require("../model");

// Registration 用户注册
router.post(
  "/users",
  [
    // 1. 配置验证规则
    body("user.username")
      .notEmpty()
      .withMessage("用户名不能为空")
      .custom(async (value) => {
        // 查询数据库 查看数据是否存在
        const user = await User.findOne({ username: value });
        if (user) {
          return Promise.reject("用户已存在");
        }
      }),
    body("user.password").notEmpty().withMessage("密码不能为空"),
    body("user.email")
      .notEmpty()
      .withMessage("邮箱不能为空")
      .isEmail()
      .withMessage("邮箱格式不正确")
      .bail() // 如果错误就不向下执行
      .custom(async (value) => {
        // 查询数据库查看数据是否存在
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("邮箱已存在");
        }
      }),
  ],
  (req, res, next) => {
    // 2. 判断验证结果
    const errors = validationResult(req);
    // 验证失败
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // 验证通过，放行
    next();
  },
  userCtrl.register
); // 3. 通过验证，执行具体的控制器处理
```

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226013118775.png" alt="image-20220226013118775" style="zoom:50%;" />

middleware/validate.js 对验证结果进行处理，抽离在 validate 中间件

```js
const { validationResult } = require("express-validator");

// parallel processing 并行处理
// 暴露一个函数，函数接收验证规则，返回一个函数
module.exports = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};
```

validator/user.js 将【验证规则】抽离出来

```js
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { User } = require("../model");

exports.register = validate([
  // 1. 配置验证规则
  body("user.username")
    .notEmpty()
    .withMessage("用户名不能为空")
    .custom(async (value) => {
      // 查询数据库查看数据是否存在
      const user = await User.findOne({ username: value });
      if (user) {
        return Promise.reject("用户已存在");
      }
    }),

  body("user.password").notEmpty().withMessage("密码不能为空"),

  body("user.email")
    .notEmpty()
    .withMessage("邮箱不能为空")
    .isEmail()
    .withMessage("邮箱格式不正确")
    .bail() // 如果错误就不向下执行
    .custom(async (value) => {
      // 查询数据库查看数据是否存在
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject("邮箱已存在");
      }
    }),
]);
```

路由就可以简化 router/user.js

```js
const userValidator = require("../validator/user");

// Registration 用户注册
router.post("/users", userValidator.register, userCtrl.register);
```

## 12.密码加密处理

> 密码存储在数据库中是明文存储的
>
> 明文应通过 md5 算法转换成密文存储

```js
const crypto = require("crypto");

// 获取 crypto 支持的散列算法
console.log(crypto.getHashes());

// 使用
const reslut = crypto.createHash("md5").update("hello").digest("hex");

// 获取结果
console.log(reslut);
```

注意：同的字符串明文通过 md5 加密得到的结果都是一样的 可以在加密的时候混入一个明文私钥 或者进行二次 md5 加密

`util/md5.js`

```js
const crypto = require("crypto");

module.exports = (str) => {
  return crypto
    .createHash("md5")
    .update("yk" + str) //加了一个混淆字符串，安全性更好
    .digest("hex");
};
```

在模型中配置 `model/user.js`

```js
const mongoose = require("mongoose");
const baseModle = require("./base-model");
const md5 = require("../util/md5");

const userSchema = new mongoose.Schema({
  ...baseModle,
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: (value) => md5(value),
    select: false, // 这条使得返回的信息中就不包含password了
  },
  bio: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
});

module.exports = userSchema;
```

还要在控制器中删除 password 属性，这样就不会返回了

```js
// Registration 用户注册
exports.register = async (req, res, next) => {
  try {
    let user = new User(req.body.user);
    // 保存到数据库
    await user.save();
    user = user.toJSON();
    delete user.password;
    // 4. 发送成功响应
    res.status(201).json({
      user,
    });
  } catch (err) {
    next(err);
  }
};
```

## 13.登录

接口：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226161645153.png" alt="image-20220226161645153" style="zoom:50%;" />

### 登录信息验证

`validator/user.js` 在数组中配置多个 validate 前一个通过才会走下面的

```js
exports.login = [
  validate([
    body("user.emil").notEmpty().withMessage("邮箱不能为空"),
    body("user.password").notEmpty().withMessage("密码不能为空"),
  ]),
  // 验证用户是否存在
  validate([
    body("user.emil").custom(async (email, { req }) => {
      const user = await User.findOne({ email }).select([
        "email",
        "password",
        "username",
        "bio",
        "image",
      ]);
      // 查询数据库查看数据是否存在
      if (!user) {
        return Promise.reject("用户不存在");
      }
      // 将数据挂载到请求对象中，后续的中间件也可以直接使用，就不需要重复查询了
      req.user = user;
    }),
  ]),
  // 验证密码是否正确
  validate([
    body("user.password").custom(async (password, { req }) => {
      if (md5(password) !== req.user.password) {
        return Promise.reject("密码错误");
      }
    }),
  ]),
];
```

```js
// Authentication 用户登录
router.post("/users/login", userValidator.login, userCtrl.login);
```

### 基于 JWT 的身份认证

> `JSON Web Token` 简称 `JWT` 是目前最流行的跨域认证解决方案

#### 跨域认证问题

互联网服务离不开用户认证。一般流程是下面这样：

1. 用户向服务器发送【用户名】和【密码】
2. 服务器验证通过后，在当前对话 session 里面保存相关数据，比如用户角色、登录时间等等
3. 服务器向用户返回一个 session_id，写入用户的 Cookie
4. 用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器
5. 服务器收到 session_id，找到前期保存的数据，由此得知用户的身份

这种模式的问题在于，扩展性(scaling）不好。 单机当然没有问题，如果是服务器集群，或者是跨域的服务导向架构，就要求 session 数据共享，每台服务器都能够读取 session

举例来说，A 网站和 B 网站是同一家公司的关联服务。现在要求，用户只要在其中一个网站登录，再访问另一个网站就会自动登录，请问怎么实现?

一种解决方案是 session 数据持久化，写入数据库或别的持久层。各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，持久层万一挂了，就会单点失败

另一种方案是服务器不保存 session 数据，所有数据都保存在【客户端】，每次请求都发回服务器。JWT 就是这种方案的一个代表

#### JWT 原理

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样：

```js
{
	"姓名":"张三"，
	"角色":"管理员",
	"到期时间": "2021年7月1日0点0分"
}
```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。 服务器完全只靠这个对象认定用户身份

为了防止用户篡改数据，服务器在生成这个对象的时候，会加上【签名】

服务器就不保存任何 session 数据了，也就是说，服务器变成无状态了，从而比较容易实现扩展

#### JWT 的数据结构

实际上的 JWT 是这样的 ：

![image-20220226162146885](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226162146885.png)

它是一个很长的字符串，中间用点 `.` 分隔成三个部分。 注意，JWT 内部是没有换行的，这里只是为了便于展示，将它写成了几行。

JWT 的三个部分依次如下:

- Header (头部)
- Payload (负载)
- Signature（签名）

写成一行就是：

```js
Header.Payload.Signature;
```

##### Header

Header 部分是一个 JSON 对象，描述 JWT 的元数据，通常是下面这样：

```js
{
	"alg": "HS256",
	"type": "JWT"
}
```

- `alg` 属性表示签名的算法(algorithm)，默认是 HMAC SHA256(写成 HS256)
- `typ `属性表示这个令牌(token)的类型(type) ，JWT 令牌统一写为 JWT

最后，将上面的 JSON 对象使用`Base64URL` 算法转成字符串。

##### Payload

Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了 7 个官方字段，供选用：

- `iss` (issuer): 签发人
- `exp` (expiration time): 过期时间
- `sub` (subject): 主题
- `aud` (audience): 受众
- `nbf` (Not Before): 生效时间
- `iat` (lssued At): 签发时间
- `jti`(JWT ID): 编号

除了官方字段，还可以定义私有字段

```js
{
	"sub": "1234323432",
	"name": "YK",
	"admin": true
}
```

注意：JWT 默认是**不加密**的，不要把秘密信息放在这个部分

这个 JSON 对象也要使用 Base64URL 算法转换成字符串

[jwt.io/](https://link.juejin.cn/?target=https%3A%2F%2Fjwt.io%2F)

##### Signature

Signature 部分是对前两部分的签名，防止数据篡改

首先，需要指定一个密钥(secret)。这个密钥只有服务器才知道，不能泄露给用户

然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256)，按照下面的公式产生签名：

```js
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret);
```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点”(`.`）分隔，就可以返回给用户

**在 JWT 中，消息体是透明的，使用签名可以保证消息不被篡改。但不能实现数据加密功能**

##### Base64URL

前面提到，Header 和 Payload 串型化的算法是`Base64URL`，这个算法跟`Base64`算法基本类似，但有一些小的不同

JWT 作为一个令牌(token)，有些场合可能会放到 URL(比如 api.example.com/?token=xxx)

Base64 有三个字符`+`、`/`和`=`，在 URL 里面有特殊含义，所以要被替换掉:`=`被省略、`+`替换成`-`，`/`替换成`_`，这就是 Base64URL 算法

#### JWT 使用方式

客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage

此后，客户端每次与服务器通信，都要带上这个 JWT。

你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP **请求的头信息** `Authorization`字段里面

```js
Authorization: Bearer <token>
```

另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里

#### JWT 的几个特点

1. JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次
2. JWT 不加密的情况下，不能将秘密数据写入 JWT
3. JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数
4. JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑
5. JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证
6. 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输要使用 HTTPS 协议传输

#### JWT 的解决方案

[jwt.io/](https://link.juejin.cn/?target=https%3A%2F%2Fjwt.io%2F)

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226162816946.png" alt="image-20220226162816946" style="zoom:50%;" />

#### 在 Node.js 中使用 JWT

[auth0/node-jsonwebtoken: JsonWebToken)](https://github.com/auth0/node-jsonwebtoken)

```shell
npm install jsonwebtoken
```

有同步和异步两种方式，加入第三个回调函数，就是异步执行的了

```js
const jwt = require("jsonwebtoken");

// 生成jwt
jwt.sign(
  {
    name: "Yunmu",
  },
  "abcdykyk",
  // 异步生成token
  (err, token) => {
    if (err) return console.log("生成 token 失败");
    console.log("生成token成功：", token);
  }
);

// 验证jwt
jwt.verify(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWUsiLCJpYXQiOjE2MjQ5NTgxNTl9.PcFPUDaqL_HHw7bctKcyI-CnCgwNgOGZwe7tYPtAj_Y",
  "abcdykyk",
  (err, res) => {
    if (err) return console.log("token认证失败");
    console.log("token认证成功：", res);
  }
);
```

### 生成 token 并发送到客户端

`util /jwt.js`

```js
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// 解析 jwt异步不是promise形式的，可以将他转换成promise形式的
exports.sign = promisify(jwt.sign);

// 验证
exports.verify = promisify(jwt.verify);

// 不验证直接解析
// exports.decode = jwt.decode();
exports.decode = promisify(jwt.decode);
```

通过 uuid 生成一个唯一的密钥 [www.uuidgenerator.net/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.uuidgenerator.net%2F)

```js
ca8b3b61-6344-46fc-83ee-d81c0ca35480
```

在默认配置中进行设置 `config/config.default.js`

```js
/**
 * 默认配置
 */
module.exports = {
  dbURI: "mongodb://localhost:27017/realworld",
  jwtSecret: "ca8b3b61-6344-46fc-83ee-d81c0ca35480",
};
```

`controller/user.js`

```js
const jwt = require("../util/jwt");
const { jwtSecret } = require("../config/config.default");

// Authentication 用户登录
exports.login = async (req, res, next) => {
  try {
    // 处理请求
    // 得到用户信息[mongosse数据对象 转换成 json数据对象]
    const user = req.user.toJSON();
    // 生成token
    const token = await jwt.sign(
      {
        userId: user._id,
      },
      jwtSecret
    );
    // 移除密码属性
    delete user.password;
    // 发送成功响应（包含token的用户信息）
    res.status(200).json({
      ...user,
      token,
    });
    res.send("post /users/login");
  } catch (err) {
    next(err);
  }
};
```

### 设置 JWT 过期时间

```js
// 生成token
const token = await jwt.sign(
  {
    userId: user._id,
  },
  // 设置token过期时间，单位为秒
  jwtSecret,
  {
    expiresIn: 60 * 60 * 24,
  }
);
```

接口测试工具自动设置添加 token 数据：

![image-20220226174110294](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226174110294.png)

## 14.身份认证中间件

获取当前用户与更新用户的接口需要验证 token

`middleware/auth.js`

```js
const { verify } = require("../util/jwt");
const { jwtSecret } = require("../config/config.default");
const { User } = require("../model");

module.exports = async (req, res, next) => {
  // 从请求头获取token数据
  let token = req.headers.authorization;
  // 验证token是否存在
  token = token ? token.split("Token ")[1] : null;
  // 如果不存在， 发送响应 401 结束响应
  if (!token) {
    return res.status(401).end();
  }
  try {
    // 验证token是否有效
    const decodedToken = await verify(token, jwtSecret);
    // console.log('decodedToken:',decodedToken);
    // 将用户信息挂载到请求对象上
    req.user = await User.findById(decodedToken.userId);
    next();
  } catch (err) {
    return res.status(401).end();
  }
  // 如果有效，将用户信息读取，挂载到req请求对象上，继续往后执行
};
```

`router/user.js`

```js
const auth = require("../middleware/auth");

// Get Current User 获取当前登录用户
router.get("/user", auth, userCtrl.getCurrentUser);
```

`controller/user.js`

```js
// Get Current User 获取当前登录用户
exports.getCurrentUser = async (req, res, next) => {
  try {
    // 处理请求
    res.status(200).json({
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};
```

![image-20220226174407339](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226174407339.png)

router 可以给所有需要【身份认证】的接口配置上 auth 中间件

## 15.处理文章接口

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226183319259.png" alt="image-20220226183319259" style="zoom:50%;" />

### 创建文章

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226213643863.png" alt="image-20220226213643863" style="zoom:50%;" />

#### 1.定义数据模型

文章和作者关联起来，用 mongoose 的 populate [mongoosejs.com/docs/popula…](https://link.juejin.cn/?target=https%3A%2F%2Fmongoosejs.com%2Fdocs%2Fpopulate.html)

`model/article.js`

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const baseModle = require("./base-model");

const articleSchema = new mongoose.Schema({
  ...baseModle,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tagList: {
    type: [String],
    default: null,
  },
  favoritesCount: {
    type: Number,
    default: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = articleSchema;
```

#### 2.数据验证

`validator/article.js`

```js
const { body } = require("express-validator");
const validate = require("../middleware/validate");

exports.createArticle = validate([
  body("article.title").notEmpty().withMessage("文章标题不能为空"),
  body("article.description").notEmpty().withMessage("文章摘要不能为空"),
  body("article.body").notEmpty().withMessage("文章内容不能为空"),
]);
```

#### 3.处理请求

[mongoosejs.com/docs/popula…](https://link.juejin.cn/?target=https%3A%2F%2Fmongoosejs.com%2Fdocs%2Fpopulate.html)

`controller/article.js`

```js
const { Article } = require("../model");

// Create Article
exports.createArticle = async (req, res, next) => {
  try {
    // 处理请求
    const article = new Article(req.body.article);

    // 通过身份认证解析到的用户对象，获取id属性
    article.author = req.user._id;
    // 将数据映射到User并执行以下
    article.populate("author").execPopulate();

    await article.save();
    res.status(201).json({
      article,
    });
  } catch (err) {
    next(err);
  }
};
```

#### 4.路由

`router/article.js`

```js
// Create Article 创建文章
router.post("/", auth, articleValidator.createArticle, articleCtrl.createArticle);
```

### 获取文章

![image-20220226213710596](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226213710596.png)

#### 1.数据验证

`validator/article.js`

```js
const mongoose = require("mongoose");

exports.getArticle = validate([
  param("articleId").custom(async (value) => {
    if (!mongoose.isValidObjectId(value)) {
      return Promise.reject("文章ID类型错误");
    }
  }),
]);
```

#### 2.处理请求

`controller/article.js`

```js
// Get Article
exports.getArticle = async (req, res, next) => {
  try {
    // 处理请求
    const article = await Article.findById(req.params.articleId).populate("author");
    if (!article) {
      return res.status(404).end();
    }
    res.status(200).json({
      article,
    });
  } catch (err) {
    next(err);
  }
};
```

#### 3.路由

`router/article.js`

```js
// Get Article
router.get("/:articleId", articleValidator.getArticle, articleCtrl.getArticle);
```

![image-20220226185622884](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226185622884.png)

### 查询文章

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226185713168.png" alt="image-20220226185713168" style="zoom: 50%;" />

请求时，可以发送不同的参数，响应不同的数据

#### 返回所有文章

```js
// List Articles
exports.listArticles = async (req, res, next) => {
  try {
    // 处理请求
    const articles = await Article.find();
    const articlesCont = await Article.countDocuments();
    res.status(200).json({
      articles,
      articlesCont,
    });
    res.send("get /articles/");
  } catch (err) {
    next(err);
  }
};
```

![image-20220226185810408](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226185810408.png)

#### 数据分页

```js
// List Articles
exports.listArticles = async (req, res, next) => {
  try {
    // 处理请求

    // 解析数据参数，并设置默认值
    const { limit = 20, offset = 0 } = req.query;
    const articles = await Article.find()
      .skip(+offset) // 跳过多少条
      .limit(+limit); // 取多少条

    const articlesCont = await Article.countDocuments();
    res.status(200).json({
      articles,
      articlesCont,
    });
    res.send("get /articles/");
  } catch (err) {
    next(err);
  }
};
```

![image-20220226185859192](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226185859192.png)

#### 筛选标签

```js
// List Articles
exports.listArticles = async (req, res, next) => {
  try {
    // 处理请求

    // 解析数据参数，并设置默认值
    const { limit = 20, offset = 0, tag } = req.query;

    // 定义一个过滤对象
    const filter = {};
    if (tag) {
      filter.tagList = tag;
    }

    const articles = await Article.find(filter)
      .skip(+offset) // 跳过多少条
      .limit(+limit); // 取多少条
    const articlesCont = await Article.countDocuments();
    res.status(200).json({
      articles,
      articlesCont,
    });
    res.send("get /articles/");
  } catch (err) {
    next(err);
  }
};
```

![image-20220226185958129](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226185958129.png)

#### 筛选文章作者

```js
// List Articles
exports.listArticles = async (req, res, next) => {
  try {
    // 处理请求

    // 解析数据参数，并设置默认值
    const { limit = 20, offset = 0, tag, author } = req.query;

    // 定义一个过滤对象(查询用的)
    const filter = {};
    if (tag) {
      filter.tagList = tag;
    }
    if (author) {
      const user = await User.findOne({ username: author });
      filter.author = user ? user._id : null;
    }

    const articles = await Article.find(filter)
      .skip(+offset) // 跳过多少条
      .limit(+limit); // 取多少条
    const articlesCont = await Article.countDocuments();
    res.status(200).json({
      articles,
      articlesCont,
    });
    res.send("get /articles/");
  } catch (err) {
    next(err);
  }
};
```

![image-20220226190050640](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226190050640.png)

#### 数据排序

```js
const articles = await Article.find(filter)
  .skip(+offset) // 跳过多少条
  .limit(+limit) // 取多少条
  .sort({
    // 排序
    // -1：倒序   1：升序
    createdAt: -1,
  });
```

### 更新文章

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226213021732.png" alt="image-20220226213021732" style="zoom:50%;" />

#### 1.封装 验证 ID 是否有效 中间件

`validate.js`

```js
const { validationResult, buildCheckFunction } = require("express-validator");
const { isValidObjectId } = require("mongoose");

// 判断id是否是有效的ObjectID
exports.isValidObjectId = (location, fields) => {
  return buildCheckFunction(location)(fields).custom(async (value) => {
    if (!isValidObjectId(value)) {
      return Promise.reject("ID 不是一个有效的 ObjectID");
    }
  });
};
```

`validator/article.js`

```js
exports.getArticle = validate([
  validate.isValidObjectId(["params"], "articleId"),
  // param("articleId").custom(async (value) => {
  //   if (!mongoose.isValidObjectId(value)) {
  //     return Promise.reject("文章ID类型错误");
  //   }
  // }),
]);

exports.updateArticle = validate([validate.isValidObjectId(["params"], "articleId")]);
```

`router/article.js`

```js
// Update Article
router.put("/:articleId", auth, articleValidator.updateArticle, articleCtrl.updateArticle);
```

#### 2.404 和 403 验证

> 还要验证存不存在要找的文章找不到返回 404 找不到
>
> 找到的文章是不是当前登录用户创建的，不是返回 403 没有权限

`validator/article.js`

```js
exports.updateArticle = [
  // 校验id是否是ObjectID
  validate([validate.isValidObjectId(["params"], "articleId")]),
  // 校验文章是否存在
  async (req, res, next) => {
    const articleId = req.params.articleId;
    const article = await Article.findById(articleId);
    req.article = article;
    if (!article) {
      return res.status(404).end();
    }
    next();
  },
  // 判断 修改的文章作者是否是当前登录用户
  async (req, res, next) => {
    console.log(typeof req.user._id, typeof req.article.author); // object object
    if (req.user._id.toString() !== req.article.author.toString()) {
      return res.status(403).end();
    }
    next();
  },
];
```

#### 3.实现更新文章响应

`controller/article.js`

```js
// Update Article
exports.updateArticle = async (req, res, next) => {
  try {
    const article = req.article;
    const bodyArticle = req.body.article;
    article.title = bodyArticle.title || article.title;
    article.description = bodyArticle.description || article.description;
    article.body = bodyArticle.body || article.body;
    await article.save();
    res.status(200).json({
      article,
    });
  } catch (err) {
    next(err);
  }
};
```

### 删除文章

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220226213321808.png" alt="image-20220226213321808" style="zoom:67%;" />

#### 1.校验规则

`validator/article.js`

```js
exports.deleteArticle = exports.updateArticle;
```

#### 2.路由

`router/article.js`

```js
// Delete Article
router.delete("/:articleId", auth, articleValidator.deleteArticle, articleCtrl.deleteArticle);
```

#### 3.处理请求操作

`controller/article.js`

```js
// Delete Article
exports.deleteArticle = async (req, res, next) => {
  try {
    console.log(req.article);
    const article = req.article;
    await article.remove();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
```
