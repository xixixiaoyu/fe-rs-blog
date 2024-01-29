## http 数据传输的 5 种方式
后端主要是提供 http 接口来传输数据，而这种数据传输的方式主要有 5 种：

### URL 参数（URL Params）
URL 参数通常用于 GET 请求中，用于在 URL 的路径部分传递数据。通常用于 RESTful API 中，用来指定资源。比如：
```javascript
https://example.com/api/users/123
```
在这个例子中，`123` 是一个 URL 参数，它指定了用户的 ID。

### 查询字符串（Query String）
query 也是在 url 传递额外的数据，以键值对形式出现，并且以问号 (?) 开头，多个参数之间用和号 (&) 分隔。
```javascript
https://example.com/search?query=keyword&page=2
```
这里，`query=keyword` 和 `page=2` 是查询字符串参数，用于指定搜索关键词和页码。

其中非英文的字符和一些特殊字符要经过编码，可以使用 encodeURIComponent 的 api 来编码：
```javascript
const query = "?name=" + encodeURIComponent('云牧') + "&age=" + encodeURIComponent(20)
```
或者使用 query-string 库来处理：
```javascript
const queryString = require('query-string');

queryString.stringify({
  name: '云牧',
  age: 20
});
```


### application/x-www-form-urlencoded（Form-urlencoded）
这是 HTML 表单提交的默认编码格式。只需要指定的 content-type 是 application/x-www-form-urlencoded。<br />当表单设置为这种编码类型时，表单数据会被编码成键值对，类似于查询字符串的格式。这种类型通常用于 POST 请求。<br />例如，提交表单时，数据可能会被编码为：
```javascript
username=johndoe&password=123456
```
这种格式在 HTTP 请求体中发送，适合发送简单的文本数据。<br />如果传递大量的数据，比如上传文件的时候就不是很合适了，因为文件 encode 一遍的话太慢了，这时候就可以用 form-data。<br />和使用 query 字符串的方式不同的是它放在了请求 body 里。<br />因为内容也是 query 字符串，所以也要最好用 encodeURIComponent 的 api 或者 query-string 库对内容编码下。

### multipart/form-data（Form-data）
这种编码类型用于发送表单数据，尤其是包含文件上传的表单，需指定的 content-type 为 multipart/form-data。<br />在这种情况下，每个表单项都作为请求的一个部分发送，允许二进制数据（如文件内容）和大块数据的传输。<br />例如，HTTP 请求体可能会包含这样的内容：
```javascript
POST /your-server-endpoint HTTP/1.1
Host: example.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryePkpFF7tjBAqx29L

------WebKitFormBoundaryePkpFF7tjBAqx29L
Content-Disposition: form-data; name="username"

johndoe
------WebKitFormBoundaryePkpFF7tjBAqx29L
Content-Disposition: form-data; name="userfile"; filename="example.txt"
Content-Type: text/plain

... file contents here ...
------WebKitFormBoundaryePkpFF7tjBAqx29L--
```
form data 不再是通过 & 这种 url 方式分隔数据，而是用 ------ 和 很多数字做为 boundary 分隔符。<br />这里，boundary12345 是分隔符，用于区分不同的表单项。<br />多了一些只是用来分隔的 boundary，所以请求体会增大。

### application/json（JSON）
传输 json 数据的话，直接指定 content-type 为 application/json 就行。<br />JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，易于人阅读和编写，也易于机器解析和生成。使用 application/json 类型时，数据以 JSON 格式发送。<br />例如，HTTP 请求体可能会包含这样的 JSON 数据：
```json
{
  "username": "johndoe",
  "password": "123456"
}
```
这种格式适合发送复杂结构的数据，如对象或数组。

### 总结

- **URL 参数**和**查询字符串**适用于 GET 请求，用于在 URL 中传递简单数据。
- **Form-urlencoded**适用于 POST 请求，传递简单的文本数据。
- **Form-data**适用于 POST 请求，可以上传文件。
- **JSON**适用于 POST 请求，传递复杂结构的数据，是现代 Web API 的首选格式。

## 使用 Nest 实现 5 种传输方式
Nest 创建一个 crud 服务是非常快的，只需要这么几步：

- 安装 @nestjs/cli，使用 nest new xxx 创建一个 Nest 的项目，
- 在根目录执行 nest g resource person 快速生成 person 模块的 crud 代码
- nest start --watch 启动 Nest 服务

这样一个有 person 的 crud 接口的服务就跑起来了。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686368649116-e8ecb7b0-5454-4d1d-b34e-f93bd3fde20b.png#averageHue=%23393834&clientId=u315e1fba-b379-4&from=paste&height=100&id=YFOKJ&originHeight=200&originWidth=1478&originalType=binary&ratio=2&rotation=0&showTitle=false&size=106518&status=done&style=none&taskId=u62357d29-1cf9-44f3-b6f0-433e6e529eb&title=&width=739)


#### 静态资源访问
main.ts 是负责启动 Nest 的 ioc 容器的，调用下 useStaticAssets 来支持静态资源的请求：
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/static' });
  await app.listen(3000);
}
bootstrap();
```
api 接口和静态资源的访问都支持了，接下来就分别实现下 5 种前后端 http 数据传输的方式吧。

### url-param
Nest 里通过 `:参数名` 的方式来声明，使用 `@Param` 装饰器来获取 URL 参数：
```typescript
@Controller('api/person')
export class PersonController {
  @Get(':id')
  paramDemo(@Param('id') id: string) {
    return `received: id=${id}`;
  }
}
```
只有 /api/person/xxx 的 get 请求才会走到这个方法，因为 @Controller('api/person') 和 @Get(':id') 会拼成一个路由。

前端代码 get 请求，参数放在 url 里：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
</head>
<body>
    <script>
        async function urlParam() {
            const res = await axios.get('/api/person/1');
            console.log(res);            
        }
        urlParam();
   </script>
</body>
```

### query
使用 `@Query` 装饰器来获取查询字符串参数：
```javascript
@Controller('api/person')
export class PersonController {
  @Get('find')
  queryDemo(@Query('name') name: string, @Query('age') age: number) {
    return `received: name=${name} age=${age}`;
  }
}
```
注意：这个 find 的路由要放到 :id 的路由前面，因为 Nest 是从上往下匹配的。<br />前端代码也是通过 axios 发送一个 get 请求：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
  </head>
  <body>
    <script>
      async function query() {
        const res = await axios.get('/api/person/find', {
          params: {
            name: '云牧',
            age: 20,
          },
        });
        console.log(res);
      }
      query();
    </script>
  </body>
</html>
```
参数通过 params 指定，axios 会做 url-encode，不需要自己做。<br />上面两种（url-param、query）是通过 url 传递数据的方式，下面 3 种是通过 body 传递数据。


### form-urlencoded
form urlencoded 其实是把 query 字符串放在了 body 里来传输数据，所以需要做 url-encode：<br />用 Nest 接收的话，使用 `@Body` 装饰器，Nest 会解析请求体，然后注入到 dto 中。<br />dto 是 data transfer object，是用于封装传输数据的对象：
```typescript
export class CreatePersonDto {
  name: string;
  age: number;
}
```
```typescript
@Controller('api/person')
export class PersonController {
  @Post()
  bodyDemo(@Body() personDto: CreatePersonDto) {
    return `received: ${JSON.stringify(personDto)}`;
  }
}
```
前端代码使用 post 方式请求，指定 content type 为 application/x-www-form-urlencoded，用 qs 做下 url-encode：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
    <script src="https://unpkg.com/qs@6.10.2/dist/qs.js"></script>
  </head>
  <body>
    <script>
      async function formUrlEncoded() {
        const res = await axios.post(
          '/api/person',
          Qs.stringify({
            name: '云牧',
            age: 20,
          }),
          {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
          },
        );
        console.log(res);
      }

      formUrlEncoded();
    </script>
  </body>
</html>
```
其实比起 form-urlencoded，使用 json 来传输更常用一些。

### json
对于 JSON 数据，Nest 也要使用 `@Body` 装饰器。确保你的前端请求的 Content-Type 设置为 application/json。
```javascript
@Controller('api/person')
export class PersonController {
  @Post()
  bodyDemo(@Body() personDto: CreatePersonDto) {
    return `received: ${JSON.stringify(personDto)}`;
  }
}
```
前端代码使用 axios 发送 post 请求，默认传输 json 就会指定 content type 为 application/json，不需要手动指定：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
  </head>
  <body>
    <script>
      async function json() {
        const res = await axios.post('http://localhost:3000/api/person', {
          name: '云牧',
          age: 20,
        });
        console.log(res);
      }
      json();
    </script>
  </body>
</html>
```
json 和 form-urlencoded 都不适合传递文件，想传输文件要用 form-data。

### form-data
form-data 是用 ------ 作为 boundary 分隔传输的内容的：<br />Nest 解析 form-data 使用 FilesInterceptor 的拦截器，用 @UseInterceptors 装饰器启用，然后通过 @UploadedFiles 来取。<br />通过 form-data 传输的非文件的内容，同样是通过 `@Body` 装饰器来获取：
```typescript
@Controller('api/person')
export class PersonController {
  @Post('file')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  formDataDemo(
    @Body() personDto: CreatePersonDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files);
    return `received: ${JSON.stringify(personDto)}`;
  }
}
```
需要安装 multer：
```javascript
 npm i -D @types/multer
```
前端代码使用 axios 发送 post 请求，指定 content type 为 multipart/form-data：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
  </head>
  <body>
    <input id="fileInput" type="file" multiple />
    <script>
      const fileInput = document.querySelector('#fileInput');

      fileInput.onchange = formData;

      async function formData() {
        const data = new FormData();
        data.set('name', '云牧');
        data.set('age', 20);
        data.set('file1', fileInput.files[0]);
        data.set('file2', fileInput.files[1]);

        const res = await axios.post('/api/person/file', data, {
          headers: { 'content-type': 'multipart/form-data' },
        });
        console.log(res);
      }
    </script>
  </body>
</html>
```
客户端打印了 name 和 age：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686373944121-fa1c2185-67b6-497d-89f0-dd6bfca9e9c9.png#averageHue=%23f8f8f8&clientId=ud023a9c6-9363-4&from=paste&height=55&id=ue9edb9d5&originHeight=110&originWidth=592&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15380&status=done&style=none&taskId=u18d266cc-924a-4b44-9e1f-50d425db8b7&title=&width=296)<br />服务端接收到了 file：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1686373688827-d5519d0a-6e50-4c57-bede-a236d8d47d78.png#averageHue=%232d2d2d&clientId=ud023a9c6-9363-4&from=paste&height=306&id=u82931219&originHeight=612&originWidth=1368&originalType=binary&ratio=2&rotation=0&showTitle=false&size=107859&status=done&style=none&taskId=u2173c84c-1c85-4fd0-b838-636ffa7cd94&title=&width=684)


## 总结
5 种 http/https 的数据传输方式：<br />其中前两种是 url 中的：

- **url param**： url 中的参数，Nest 中使用 @Param 来取
- **query**：url 中 ? 后的字符串，Nest 中使用 @Query 来取

后三种是 body 中的：

- **form-urlencoded**： 类似 query 字符串，只不过是放在 body 中。Nest 中使用 @Body 来取，axios 中需要指定 content-type 为 application/x-www-form-urlencoded，并且对数据用 qs 或者 query-string 库做 url-encode
- **json**： json 格式的数据。Nest 中使用 @Body 来取，axios 中不需要单独指定 content-type，axios 内部会处理。
- **form-data**：通过 ------ 作为 boundary 分隔的数据。主要用于传输文件，Nest 中要使用 FilesInterceptor 来处理其中的 binary 字段，用 @UseInterceptors 来启用，其余字段用 @Body 来取。axios 中需要指定 content type 为 multipart/form-data，并且用 FormData 对象来封装传输的内容。

这 5 种 http 的传输数据的方式涵盖了绝大多数开发场景。

