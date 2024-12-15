## 一、URL 参数传递

在 Nest.js 中，URL 参数通过 `@Param` 装饰器获取。通常用于 RESTful API 的资源标识。

### 实现步骤

1. 在控制器中定义路由，使用 `:参数名` 声明动态参数。
2. 使用 `@Param` 装饰器获取参数值。

### 示例代码

```typescript
import { Controller, Get, Param } from '@nestjs/common'

@Controller('api/person')
export class PersonController {
	@Get(':id') // 定义动态路由
	getPersonById(@Param('id') id: string) {
		return `Received: id=${id}`
	}
}
```

**前端请求：**

```javascript
axios.get('/api/person/123').then(response => {
	console.log(response.data) // 输出：Received: id=123
})
```

---

## 二、查询字符串传递

查询字符串通过 `@Query` 装饰器获取，适合传递检索条件或过滤参数。

### 实现步骤

1. 在控制器中定义路由。
2. 使用 `@Query` 装饰器获取查询参数。

### 示例代码

```typescript
import { Controller, Get, Query } from '@nestjs/common'

@Controller('api/person')
export class PersonController {
	@Get('find') // 定义路由
	findPerson(@Query('name') name: string, @Query('age') age: number) {
		return `Received: name=${name}, age=${age}`
	}
}
```

**前端请求：**

```javascript
axios
	.get('/api/person/find', {
		params: {
			name: 'John',
			age: 25,
		},
	})
	.then(response => {
		console.log(response.data) // 输出：Received: name=John, age=25
	})
```

---

## 三、Form-urlencoded 数据传递

Form-urlencoded 是 HTML 表单的默认提交方式，数据以键值对形式存储在请求体中。Nest.js 使用 `@Body` 装饰器解析请求体。

### 实现步骤

1. 定义 DTO（Data Transfer Object）类，用于验证和封装传输数据。
2. 在控制器中使用 `@Body` 装饰器接收数据。
3. 确保前端请求的 `Content-Type` 为 `application/x-www-form-urlencoded`。

### 示例代码

```typescript
import { Controller, Post, Body } from '@nestjs/common'

export class CreatePersonDto {
	name: string
	age: number
}

@Controller('api/person')
export class PersonController {
	@Post()
	createPerson(@Body() personDto: CreatePersonDto) {
		return `Received: ${JSON.stringify(personDto)}`
	}
}
```

**前端请求：**

```javascript
const qs = require('qs')
axios
	.post(
		'/api/person',
		qs.stringify({
			name: 'John',
			age: 25,
		}),
		{
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		}
	)
	.then(response => {
		console.log(response.data) // 输出：Received: {"name":"John","age":25}
	})
```

---

## 四、Form-data 数据传递

Form-data 是文件上传的首选方式，Nest.js 提供了 `@UseInterceptors` 和 `@UploadedFiles` 装饰器来处理文件上传。

### 实现步骤

1. 安装 `multer` 和其类型定义：`npm install multer @types/multer`。
2. 使用 `FilesInterceptor` 拦截器处理文件上传。
3. 使用 `@UploadedFiles` 获取上传的文件。

### 示例代码

```typescript
import { Controller, Post, UseInterceptors, UploadedFiles, Body } from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'

export class CreatePersonDto {
	name: string
	age: number
}

@Controller('api/person')
export class PersonController {
	@Post('file')
	@UseInterceptors(AnyFilesInterceptor({ dest: './uploads' })) // 指定上传目录
	uploadFile(
		@Body() personDto: CreatePersonDto,
		@UploadedFiles() files: Array<Express.Multer.File>
	) {
		console.log(files) // 打印上传的文件信息
		return `Received: ${JSON.stringify(personDto)}`
	}
}
```

**前端请求：**

```javascript
const formData = new FormData()
formData.append('name', 'John')
formData.append('age', 25)
formData.append('file', fileInput.files[0])

axios
	.post('/api/person/file', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
	.then(response => {
		console.log(response.data)
	})
```

---

## 五、JSON 数据传递

JSON 是现代 Web API 的标准数据格式，Nest.js 使用 `@Body` 装饰器解析 JSON 数据。

### 实现步骤

1. 定义 DTO 类，用于验证和封装传输数据。
2. 在控制器中使用 `@Body` 装饰器接收 JSON 数据。
3. 确保前端请求的 `Content-Type` 为 `application/json`。

### 示例代码

```typescript
import { Controller, Post, Body } from '@nestjs/common'

export class CreatePersonDto {
	name: string
	age: number
}

@Controller('api/person')
export class PersonController {
	@Post()
	createPerson(@Body() personDto: CreatePersonDto) {
		return `Received: ${JSON.stringify(personDto)}`
	}
}
```

**前端请求：**

```javascript
axios
	.post('/api/person', {
		name: 'John',
		age: 25,
	})
	.then(response => {
		console.log(response.data) // 输出：Received: {"name":"John","age":25}
	})
```

---

## 总结

| 传输方式            | Nest.js 实现方式                      | 前端注意事项                                           |
| ------------------- | ------------------------------------- | ------------------------------------------------------ |
| **URL 参数**        | `@Param`                              | 参数直接拼接在 URL 中                                  |
| **查询字符串**      | `@Query`                              | 使用 `params` 传递查询参数                             |
| **Form-urlencoded** | `@Body` + DTO                         | 设置 `Content-Type: application/x-www-form-urlencoded` |
| **Form-data**       | `@UploadedFiles` + `FilesInterceptor` | 使用 `FormData` 构造请求                               |
| **JSON**            | `@Body` + DTO                         | 默认 `Content-Type: application/json`                  |

通过以上实现，Nest.js 提供了强大的装饰器和工具，能够轻松处理 HTTP 数据传输的各种方式。开发者可以根据实际需求选择合适的传输方式，构建高效、灵活的 API 服务。
