# 第 1 章：HTTP 相关

## 1.1 MDN 文档

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Overview

## 1.2 HTTP 请求基本过程

![image-20211226213641629](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20211226213641629.png)

1. 浏览器端向服务器发送 HTTP 请求(请求报文)

2. 后台服务器接收到请求后，处理请求, 向浏览器端返回 HTTP 响应(响应报文)

3. 浏览器端接收到响应, 解析**显示响应体**或**调用回调函数**

## 1.3 HTTP 请求报文

格式：method url

例如：GET /product_detail?id=2 或 POST /login

**1.** **请求头(一般有多个请求头)**

Host: www.baidu.com

Cookie: BAIDUID=AD3B0FA706E; BIDUPSID=AD3B0FA706;

Content-Type: application/x-www-form-urlencoded 或者 application/json

**2.** **请求体**

username=tom&pwd=123

{"username": "tom", "pwd": 123}

## 1.4. HTTP 响应报文

**1.** **响应行:**

格式：status statusText

例如：200 OK 或 404 Not Found

**2.** **响应头（一般有多个）**

Content-Type: text/html;charset=utf-8

Set-Cookie: BD_CK_SAM=1;path=/

**3.** **响应体**

html/json/js/css/图片...

## 1.5 常见的响应状态码

200 OK 请求成功。一般用于 GET 与 POST 请求

201 Created 已创建。成功请求并创建了新的资源

401 Unauthorized 未授权/请求要求用户的身份认证

404 Not Found 服务器无法根据客户端的请求找到资源

500 Internal Server Error 服务器内部错误，无法完成请求

## 1.6 请求方式与请求参数

### 1. 请求方式

1. GET(索取): 从服务器端读取数据 ----- 查(R)

2. POST(交差): 向服务器端添加新数据 ------ 增(C)

3. PUT: 更新服务器端已存在的数据 ------- 改(U)

4. DELETE: 删除服务器端数据 ---------删(D)

### 2. 请求参数

1. **query**参数（查询字符串参数）

   1. 参数包含在请求地址中，格式为:/xxxx?name=tom&age=18

   2. 敏感数据不要用 query 参数，因为参数是地址的一部分，比较危险。

   3. 备注：query 参数又称**查询字符串参数**，编码方式为 urlencoded

2. params 参数

   1. 参数包含在请求地址中，格式：http://localhost:3000/add_person/tom/18
   2. 敏感数据不要用 params 参数，因为参数是地址的一部分，比较危险

3. 请求体参数

   1. 参数包含在请求体中，可通过浏览器开发工具查看

   2. 常用的两种格式：

   3. **格式一：urlencoded 格式**

      例如：name=tom&age=18

      对应请求头：Content-Type: application/x-www-form-urlencoded

      **格式二：json 格式**

      例如: {"name": "tom", "age": 12}

      ​ 对应请求头：Content-Type: application/json

**特别注意：**

1. GET 请求不能携带请求体参数，因为 GET 请求没有请求体。

2. 理论上一次请求可以随意使用上述 3 种类型参数中的任何一种，甚至一次请求的 3 个参数可以用 3 种形式携带，但一般不这样做。

3. 一般来说我们有一些"约定俗成"的规矩：
   (1) 例如 form 表单发送 post 请求时: 自动使用请求体参数，用 urlencoded 编码。

​ (2) 例如 jQuery 发送 ajax-post 请求时：自动使用请求体参数，用 urlencoded 编码。

4. 开发中请求到底发给谁？用什么请求方式？携带什么参数？----要参考项目的 API 接口文档。

# 第 2 章：API 相关

## 2.1 API 的分类

**1.** **REST API (restful 风格的 API )**

① 发送请求进行 CRUD 哪个操作由请求方式来决定

② 同一个请求路径可以进行多个操作

③ 请求方式会用到 GET/POST/PUT/DELETE

**2.** **非 REST API ( restless 风格的 API )**

④ 请求方式不决定请求的 CRUD 操作

⑤ 一个请求路径只对应一个操作

⑥ 一般只有 GET/POST

## 2.2 使用 json-server 搭建 REST API

### 1. json-server 是什么?

用来快速搭建 REST API 的工具包，模拟 mock-server 数据

### 2. 使用 json-server

1. 在线文档: https://github.com/typicode/json-server

2. 下载: npm install -g json-server

3. 目标根目录下创建数据库 json 文件: db.json

```json
{
  "posts": [
    { "id": 1, "title": "post1", "author": "yunmu" },
    { "id": 2, "title": "post2", "author": "hanhan" }
  ],
  "comments": [{ "id": 1, "body": "some comment", "postId": 1 }],
  "profile": { "name": "typicode" }
}
```

4. 开启 json-server `json-server --watch db.json`

### 3. 使用浏览器访问测试

http://localhost:3000/posts

http://localhost:3000/posts/

### 4. 使用 postman 测试接口

测试 GET/POST/PUT/DELETE 请求

![image-20211226214817160](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20211226214817160.png)

### 5. 一般 http 请求与 ajax 请求

1. ajax 请求是一种特别的 http 请求

2. 对服务器端来说, 没有任何区别, 区别在浏览器端

3. 浏览器端发请求: 只有 XHR 或 fetch 发出的才是 ajax 请求, 其它所有的都是非 ajax 请求

4. 浏览器端接收到响应

(1) 一般请求: 浏览器一般会直接显示响应体数据, 也就是我们常说的自动刷新/跳转页面

(2) ajax 请求: 浏览器不会对界面进行任何更新操作, 只是调用监视的回调函数并传入响应相关数据

# 3.axios 使用

### 1.axios 是什么?

1. 前端最流行的 ajax 请求库
2. react/vue 官方都推荐使用 axios 发 ajax 请求
3. 文档: https://github.com/axios/axioshttps://github.com/axios/axios)

### 2.axios 特点

1. 基于 xhr + promise 的异步 ajax 请求库
2. 浏览器端/node 端都可以使用
3. 支持请求／响应拦截器
4. 支持请求取消
5. 请求/响应数据转换
6. 批量发送多个请求

### 3.axios 常用语法

> axios(config): 通用/最本质的发任意类型请求的方式
>
> axios(url[, config]): 可以只指定 url 发 get 请求
>
> axios.request(config): 等同于 axios(config)
>
> axios.get(url[, config]): 发 get 请求
>
> axios.delete(url[, config]): 发 delete 请求
>
> axios.post(url[, data, config]): 发 post 请求
>
> axios.put(url[, data, config]): 发 put 请求
>
> axios.defaults.xxx: 请求的默认全局配置
>
> axios.interceptors.request.use(): 添加请求拦截器
>
> axios.interceptors.response.use(): 添加响应拦截器
>
> axios.create([config]): 创建一个新的 axios(但它没有下面的功能)
>
> axios.CancelToken(): 用于创建取消请求的 token 对象
>
> axios.isCancel(): 是否是一个取消请求的错误
>
> axios.all(promises): 用于批量执行多个异步请求

阿里云盘 https://www.aliyundrive.com/s/BNq3caw44VP （服务端代码）

使用命令 `node server.js` 开启服务打开对应的接口文档地址开始测试

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>axios的基本使用</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
  </head>
  <body>
    <button id="btn1">点我获取所有人</button><br /><br />
    <button id="btn2">点我获取某个人</button>
    <input id="person_id" type="text" placeholder="请输入一个人的id" /><br /><br />
    <button id="btn3">点我添加一个人</button>
    <input id="person_name" type="text" placeholder="请输入名字" />
    <input id="person_age" type="text" placeholder="请输入年龄" /><br /><br />
    <button id="btn4">点我更新一个人</button>
    <input id="person_update_id" type="text" placeholder="请输入一个人的id" />
    <input id="person_update_name" type="text" placeholder="请输入名字" />
    <input id="person_update_age" type="text" placeholder="请输入年龄" /><br /><br />
    <button id="btn5">点我删除一个人</button>
    <input id="person_delete_id" type="text" placeholder="请输入删除的id" />
    <!-- 
				1.axios调用的返回值是Promise实例。
				2.成功的值叫response，失败的值叫error。
				3.axios成功的值是一个axios封装的response对象，服务器返回的真正数据在response.data中
				4.携带query参数时，编写的配置项叫做params
				5.携带params参数时，就需要自己手动拼在url中
		 -->

    <script type="text/javascript">
      //获取按钮
      const btn1 = document.getElementById("btn1");
      const btn2 = document.getElementById("btn2");
      const btn3 = document.getElementById("btn3");
      const btn4 = document.getElementById("btn4");
      const btn5 = document.getElementById("btn5");
      const personId = document.getElementById("person_id");
      const personName = document.getElementById("person_name");
      const personAge = document.getElementById("person_age");
      const personUpdateId = document.getElementById("person_update_id");
      const personUpdateName = document.getElementById("person_update_name");
      const personUpdateAge = document.getElementById("person_update_age");
      const personDeleteId = document.getElementById("person_delete_id");
    </script>
  </body>
</html>
```

```js
//获取所有人---发送GET请求---不携带参数
btn1.onclick = () => {
  //完整版
  axios({
    url: "http://localhost:5000/persons", //请求地址
    method: "GET", //请求方式
  }).then(
    (response) => {
      console.log("请求成功了", response.data);
    },
    (error) => {
      console.log("请求失败了", error);
    }
  );

  //精简版
  axios.get("http://localhost:5000/persons").then(
    (response) => {
      console.log("请求成功了", response.data);
    },
    (error) => {
      console.log("请求失败了", error);
    }
  );
};
```

```js
//获取所某个人---发送GET请求---携带query参数
btn2.onclick = () => {
  //完整版
  axios({
    url: "http://localhost:5000/person",
    method: "GET",
    params: { id: personId.value }, //此处写的是params，但携带的是query参数
  }).then(
    (response) => {
      console.log("成功了", response.data);
    },
    (error) => {
      console.log("失败了", error);
    }
  );

  //精简版
  axios.get("http://localhost:5000/person", { params: { id: personId.value } }).then(
    (response) => {
      console.log("成功了", response.data);
    },
    (error) => {
      console.log("失败了", error);
    }
  );
};
```

```js
//添加一个人---发送POST请求---携带json编码参数 或 urlencoded编码
btn3.onclick = () => {
  //完整版
  axios({
    url: "http://localhost:5000/person",
    method: "POST",
    data: { name: personName.value, age: personAge.value }, //携带请求体参数（json编码）
    //data:`name=${personName.value}&age=${personAge.value}`//携带请求体参数（urlencoded编码）
  }).then(
    (response) => {
      console.log("成功了", response.data);
    },
    (error) => {
      console.log("失败了", error);
    }
  );

  //精简版
  axios
    .post("http://localhost:5000/person", `name=${personName.value}&age=${personAge.value}`)
    .then(
      (response) => {
        console.log("成功了", response.data);
      },
      (error) => {
        console.log("失败了", error);
      }
    );
};
```

```js
//更新一个人---发送PUT请求---携带json编码参数 或 urlencoded编码
btn4.onclick = () => {
  //完整版
  axios({
    url: "http://localhost:5000/person",
    method: "PUT",
    data: {
      id: personUpdateId.value,
      name: personUpdateName.value,
      age: personUpdateAge.value,
    },
  }).then(
    (response) => {
      console.log("成功了", response.data);
    },
    (error) => {
      console.log("失败了", error);
    }
  );

  //精简版
  axios
    .put("http://localhost:5000/person", {
      id: personUpdateId.value,
      name: personUpdateName.value,
      age: personUpdateAge.value,
    })
    .then(
      (response) => {
        console.log("成功了", response.data);
      },
      (error) => {
        console.log("失败了", error);
      }
    );
};
```

```js
//删除一个人---发送DELETE请求---携带params参数
btn5.onclick = () => {
  axios({
    url: `http://localhost:5000/person/${personDeleteId.value}`,
    method: "DELETE",
  }).then(
    (response) => {
      console.log("成功了", response.data);
    },
    (error) => {
      console.log("失败了", error);
    }
  );
};
```

### 4.axios 常用配置项

```html
<button id="btn">点我获取所有人</button><br /><br />
<button id="btn2">点我获取测试数据</button><br /><br />
<button id="btn3">点我获取笑话信息</button><br /><br />
<script type="text/javascript">
  const btn1 = document.getElementById("btn");
  const btn2 = document.getElementById("btn2");

  //给axios配置默认属性
  //   默认超时时间
  axios.defaults.timeout = 2000;
  //  默认请求头
  axios.defaults.headers = { school: "yunmu" };
  // 默认 url
  axios.defaults.baseURL = "http://localhost:5000";

  btn1.onclick = () => {
    axios({
      url: "/persons", //请求地址
      method: "GET", //请求方式
      params: { delay: 3000 }, //配置query参数
      data: { c: 3, d: 3 }, //配置请求体参数(json编码)
      data: "e=5&f=6", //配置请求体参数(urlencoded编码)
      timeout: 2000, //配置超时时间
      headers: { school: "yunxi" }, //配置请求头
      responseType: "json", //配置响应数据的格式(默认值)
    }).then(
      (response) => {
        console.log("成功了", response.data);
      },
      (error) => {
        console.log("失败了", error);
      }
    );
  };

  btn2.onclick = () => {
    axios({
      url: "/test1", //请求地址
      method: "GET", //请求方式
      timeout: 2000, //配置超时时间
      headers: { school: "yunxi" }, //配置请求头
    }).then(
      (response) => {
        console.log("成功了", response.data);
      },
      (error) => {
        console.log("失败了", error);
      }
    );
  };
</script>
```

### 5.axios.create(config)

1. 根据指定配置创建一个新的 axios, 也就就每个新 axios 都有自己的配置

2. 新 axios 只是没有取消请求和批量发请求的方法, 其它所有语法都是一致的

3. 为什么要设计这个语法?

(1) 需求: 项目中有部分接口需要的配置与另一部分接口需要的配置不太一样, 如何处理

(2) 解决: 创建 2 个新 axios, 每个都有自己特有的配置, 分别应用到不同要求的接口请求中

```html
<button id="btn">点我获取所有人</button><br /><br />
<button id="btn2">点我获取测试数据</button><br /><br />
<button id="btn3">点我获取笑话信息</button><br /><br />
<script type="text/javascript">
  const btn = document.getElementById("btn");
  const btn2 = document.getElementById("btn2");
  const btn3 = document.getElementById("btn3");

  const axios2 = axios.create({
    timeout: 3000,
    //headers:{name:'tom'},
    baseURL: "https://api.apiopen.top",
  });

  //给axios配置默认属性
  axios.defaults.timeout = 2000;
  axios.defaults.headers = { school: "atguigu" };
  axios.defaults.baseURL = "http://localhost:5000";

  btn.onclick = () => {
    axios({
      url: "/persons", //请求地址
      method: "GET", //请求方式
      //params:{delay:3000},//配置query参数
      //data:{c:3,d:3},//配置请求体参数(json编码)
      //data:'e=5&f=6',//配置请求体参数(urlencoded编码)
      //timeout:2000,//配置超时时间
      //headers:{school:'yunxi'} //配置请求头
      //responseType:'json'//配置响应数据的格式(默认值)
    }).then(
      (response) => {
        console.log("成功了", response.data);
      },
      (error) => {
        console.log("失败了", error);
      }
    );
  };

  btn2.onclick = () => {
    axios({
      url: "/test1", //请求地址
      method: "GET", //请求方式
      //timeout:2000,//配置超时时间
      //headers:{school:'yunxi'} //配置请求头
    }).then(
      (response) => {
        console.log("成功了", response.data);
      },
      (error) => {
        console.log("失败了", error);
      }
    );
  };

  btn3.onclick = () => {
    axios2({
      url: "/getJoke",
      method: "GET",
    }).then(
      (response) => {
        console.log("成功了", response.data);
      },
      (error) => {
        console.log("失败了", error);
      }
    );
  };
</script>
```

### 6.拦截器

1. 说明: 调用 axios()并不是立即发送 ajax 请求, 而是需要经历一个较长的流程

2. 流程: 请求拦截器=> 发 ajax 请求 => 响应拦截器 =>请求的回调

```html
<button id="btn">点我获取所有人</button><br /><br />
<!-- 
            axios请求拦截器
                1.是什么？
                        在真正发请求前执行的一个回调函数
                2.作用：
                        对所有的请求做统一的处理：追加请求头、追加参数、界面loading提示等等
            
            axios响应拦截器
                1.是什么？
                        得到响应之后执行的一组回调函数
                2.作用：
                        若请求成功，对成功的数据进行处理
                        若请求失败，对失败进行统一的操作
    -->
<script type="text/javascript">
  const btn = document.getElementById("btn");

  //请求拦截器
  axios.interceptors.request.use((config) => {
    console.log("请求拦截器1执行了");
    if (Date.now() % 2 === 0) {
      config.headers.token = "yunmu";
    }
    return config;
  });

  //响应拦截器
  axios.interceptors.response.use(
    (response) => {
      console.log("响应拦截器成功的回调执行了", response);
      if (Date.now() % 2 === 0) return response.data;
      else return "时间戳不是偶数，不能给你数据";
    },
    (error) => {
      console.log("响应拦截器失败的回调执行了");
      alert(error);
      return new Promise(() => {});
    }
  );

  btn.onclick = async () => {
    const result = await axios.get("http://localhost:5000/persons21");
    console.log(result);
  };
</script>
```

### 7.取消请求

1. 基本流程

① 配置 cancelToken 对象

② 缓存用于取消请求的 cancel 函数

③ 在后面特定时机调用 cancel 函数取消请求

④ 在错误回调中判断如果 error 是 cancel, 做相应处理

2. 实现功能

点击按钮, 取消某个正在请求中的请求

在请求一个接口前, 取消前面一个未完成的请求

```html
<button id="btn">点我获取测试数据</button><br /><br />
<button id="btn">点我获取测试数据</button><br /><br />
<button id="btn2">取消请求</button><br /><br />
<script type="text/javascript">
  const btn = document.getElementById("btn");
  const btn2 = document.getElementById("btn2");
  const { CancelToken } = axios; //CancelToken能为一次请求“打标识”
  let cancel;

  btn.onclick = async () => {
    axios({
      url: "http://localhost:5000/test1?delay=3000",
      cancelToken: new CancelToken((c) => {
        //c是一个函数，调用c就可以关闭本次请求
        cancel = c;
      }),
    }).then(
      (response) => {
        console.log("成功了", response.data);
      },
      (error) => {
        console.log("失败了", error);
      }
    );
  };

  btn2.onclick = () => {
    cancel();
  };
</script>
```

取消请求和拦截器搭配使用

```html
<button id="btn">点我获取测试数据</button><br /><br />
<button id="btn2">取消请求</button><br /><br />
<script type="text/javascript">
  const btn = document.getElementById("btn");
  const btn2 = document.getElementById("btn2");
  const { CancelToken, isCancel } = axios; //CancelToken能为一次请求“打标识”
  let cancel;

  btn.onclick = async () => {
    if (cancel) cancel();
    axios({
      url: "http://localhost:5000/test1?delay=3000",
      cancelToken: new CancelToken((c) => {
        //c是一个函数，调用c就可以关闭本次请求
        cancel = c;
      }),
    }).then(
      (response) => {
        console.log("成功了", response.data);
      },
      (error) => {
        if (isCancel(error)) {
          //如果进入判断，证明：是用户取消了请求
          console.log("用户取消了请求，原因是：", error.message);
        } else {
          console.log("失败了", error);
        }
      }
    );
  };

  btn2.onclick = () => {
    cancel("任性，就是不要了");
  };
</script>
```

连续点击将上一次的请求取消

```html
<button id="btn">点我获取测试数据</button><br /><br />
<button id="btn2">取消请求</button><br /><br />
<script type="text/javascript">
  const btn = document.getElementById("btn");
  const btn2 = document.getElementById("btn2");
  const { CancelToken, isCancel } = axios; //CancelToken能为一次请求“打标识”
  let cancel;

  axios.interceptors.request.use((config) => {
    if (cancel) cancel("取消了");
    config.cancelToken = new CancelToken((c) => (cancel = c));
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      if (isCancel(error)) {
        //如果进入判断，证明：是用户取消了请求
        console.log("用户取消了请求，原因是：", error.message);
      } else {
        console.log("失败了", error);
      }
      //   中断Promise链
      return new Promise(() => {});
    }
  );

  btn.onclick = async () => {
    const result = await axios.get("http://localhost:5000/test1?delay=3000");
    console.log(result);
  };

  btn2.onclick = () => {
    cancel("任性，就是不要了");
  };
</script>
```

### 8.同时发送请求

```html
<button id="btn">点我批量发送请求</button><br /><br />
<script type="text/javascript">
  const btn = document.getElementById("btn");

  btn.onclick = async () => {
    // 三个请求地址同时发送
    axios
      .all([
        axios.get("http://localhost:5000/test1"),
        axios.get("http://localhost:5000/test2?delay=3000"),
        axios.get("http://localhost:5000/test3"),
      ])
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  };
</script>
```
