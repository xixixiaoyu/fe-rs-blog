## 环境搭建
首先，创建一个新的项目目录，并初始化 package.json 文件：
```bash
mkdir express-multer-test
cd express-multer-test
npm init -y
```
安装必要的包：
```typescript
npm install express multer cors
```

- `express`：一个简洁而灵活的 `Node.js Web` 应用框架。
- `multer`：一个用于处理 `multipart/form-data` 类型表单数据，特别适合于处理文件上传的中间件。
- `cors`：提供跨域资源共享（`CORS`）的中间件。

## 单文件上传
### 后端实现
在项目根目录下创建 index.js 文件，并添加以下内容：
```typescript
const express = require('express')
const multer = require('multer')
const cors = require('cors')

const app = express()

// 使用 cors 中间件，允许所有来源的请求
app.use(cors())

// 配置 multer 中间件，设置文件存储的目录为 'uploads/'
const upload = multer({ dest: 'uploads/' })

// 使用 multer 中间件处理单个文件上传
// 创建一个 POST 路由，路径为 '/aaa'，文件字段名为 'aaa'
app.post('/aaa', upload.single('aaa'), function (req, res, next) {
	console.log('req.file', req.file)
	console.log('req.body', req.body)
})

app.listen(3333)
```

### 前端实现
新建一个 index.html，并通过 npx http-server 运行：
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
	</head>
	<body>
		<input id="fileInput" type="file" />
		<script>
			const fileInput = document.querySelector('#fileInput')

			async function formData() {
				const data = new FormData()
				data.set('name', 'Yun')
				data.set('age', 20)
				data.set('aaa', fileInput.files[0])

				const res = await axios.post('http://localhost:3333/aaa', data)
				console.log(res)
			}

			fileInput.onchange = formData
		</script>
	</body>
</html>
```
通过 FormData + axios 上传文件<br />准备一张图片：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1694614209292-b99c178a-4508-41b4-a012-1e90afb2905e.png#averageHue=%232a2e2f&clientId=u171da61d-7c99-4&from=paste&height=87&id=u0a134bec&originHeight=174&originWidth=162&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15499&status=done&style=none&taskId=u5f5a7d27-3e84-45c4-a31a-6be350ba045&title=&width=81)<br />浏览器选中文件上传：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687089254896-6665ec53-c496-4645-b265-ffb07f44ac4d.png#averageHue=%23eeedeb&clientId=uc02d7cdc-ae58-4&from=paste&height=189&id=u7d5d8cd2&originHeight=378&originWidth=1034&originalType=binary&ratio=2&rotation=0&showTitle=false&size=67521&status=done&style=none&taskId=ue6155ac0-3060-4502-9bbe-cd2a638c57f&title=&width=517)<br />服务端打印的结果是：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1694614256522-098da7b0-9244-4c96-9df2-cdeb0ca8c619.png#averageHue=%23313131&clientId=u171da61d-7c99-4&from=paste&height=159&id=ufc0dba98&originHeight=318&originWidth=852&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51116&status=done&style=none&taskId=u570d510f-0197-4eab-b2e4-bee4287bfa5&title=&width=426)<br />fieldname 是前端上传过来的字段名<br />origialname 是图片的原始名称。<br />其余非文件字段在 req.body。<br />并且服务端多了 uploads 目录，里面就保存着我们上传的文件。


## 多文件上传
### 后端实现
在 index.js 中添加一个新的路由来处理多文件上传：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687090056038-24e1387d-027b-4175-83de-1e881a90482c.png#averageHue=%23302d2b&clientId=uc02d7cdc-ae58-4&from=paste&height=218&id=ua5183a5e&originHeight=482&originWidth=1492&originalType=binary&ratio=2&rotation=0&showTitle=false&size=100024&status=done&style=none&taskId=u76c6f911-c3ea-4b18-b559-999693f033f&title=&width=675)<br />bbb 路由通过 array 方法来取上传的文件，并且指定最大数量的限制。<br />上传的文件通过 req.files 来取。

### 前端实现
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
	</head>
	<body>
    <!-- input 标签添加 multiple 属性允许多选 -->
		<input id="fileInput" type="file" multiple />
		<script>
			const fileInput = document.querySelector('#fileInput')

			async function formData2() {
				const data = new FormData()
				data.set('name', 'Yun')
				data.set('age', 20)
				;[...fileInput.files].forEach(item => {
					data.append('bbb', item)
				})

				const res = await axios.post('http://localhost:3333/bbb', data)
				console.log(res)
			}

			fileInput.onchange = formData2
		</script>
	</body>
</html>
```
服务接收到了多个文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687090099237-de728485-f5f6-4484-b7a0-0faedafa92f5.png#averageHue=%23303030&clientId=uc02d7cdc-ae58-4&from=paste&height=272&id=ubc139b0b&originHeight=644&originWidth=848&originalType=binary&ratio=2&rotation=0&showTitle=false&size=103673&status=done&style=none&taskId=u5284b71a-3b4a-42b3-89ff-ca20b5a7bc6&title=&width=358)


## 错误处理
在 express 里，约定有 4 个参数的中间件为错误处理中间件：
```typescript
app.post('/bbb', upload.array('bbb', 2), (req, res, next) => {
    // ...之前的代码
}, (err, req, res, next) => {
    if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).end('Too many files uploaded');
    }
});
```

## 不同字段上传
### 后端实现
如果需要处理多个字段上传文件，可以使用 fields 方法：
```typescript
app.post(
	'/ccc',
	upload.fields([
		{ name: 'aaa', maxCount: 3 },
		{ name: 'bbb', maxCount: 2 },
	]),
	function (req, res, next) {
		console.log('req.files', req.files)
		console.log('req.body', req.body)
	}
)
```

### 前端实现
```typescript
async function formData3() {
  const data = new FormData()
  data.set('name', 'Yun')
  data.set('age', 20)
  data.append('aaa', fileInput.files[0])
  data.append('aaa', fileInput.files[1])
  data.append('bbb', fileInput.files[2])
  data.append('bbb', fileInput.files[3])

  const res = await axios.post('http://localhost:3333/ccc', data)
  console.log(res)
}
```
上传后，服务器打印的信息：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687090943332-74b533b7-2e14-4c91-8d37-d4b5dac51bff.png#averageHue=%232f2f2f&clientId=uc02d7cdc-ae58-4&from=paste&height=495&id=u583cdde6&originHeight=1328&originWidth=854&originalType=binary&ratio=2&rotation=0&showTitle=false&size=184596&status=done&style=none&taskId=u1ad76983-dff4-406b-87d5-12269719793&title=&width=318)


## 不固定字段上传
### 后端实现
如果没有明确前端传过来的哪些字段是 file ，可以使用 any 接收：
```typescript
app.post('/ddd', upload.any(), function (req, res, next) {
	console.log('req.files', req.files)
	console.log('req.body', req.body)
})
```

### 前端实现
改下前端代码，这次设置 aaa、bbb、ccc、ddd 4 个 file 字段：
```typescript
async function formData4() {
  const data = new FormData()
  data.set('name', 'Yun')
  data.set('age', 20)
  data.set('aaa', fileInput.files[0])
  data.set('bbb', fileInput.files[1])
  data.set('ccc', fileInput.files[2])
  data.set('ddd', fileInput.files[3])

  const res = await axios.post('http://localhost:3333/ddd', data)
  console.log(res)
}
```
再次上传 4 个文件，可以看到服务端打印的消息：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687091278947-5f697020-0d50-4058-b721-a911bfbdb652.png#averageHue=%23363636&clientId=uc02d7cdc-ae58-4&from=paste&height=602&id=u02b72d8e&originHeight=1204&originWidth=862&originalType=binary&ratio=2&rotation=0&showTitle=false&size=180872&status=done&style=none&taskId=ud8fcec82-42af-438c-b23b-c38a417334e&title=&width=431)<br />只不过这时候不是 key、value 的形式了，需要自己遍历数组来查找。

## 文件名和存储目录自定义
之前通过 dest 指定了保存的目录：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687091683844-3b5b5ca8-3048-41b3-91f5-ffde53846419.png#averageHue=%2334302c&clientId=uc02d7cdc-ae58-4&from=paste&height=31&id=u2b7411b6&originHeight=62&originWidth=950&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15421&status=done&style=none&taskId=u5c8053d8-b55e-4811-bb9b-900c735e67d&title=&width=475)<br />现在重新指定：
```typescript
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())

// 磁盘存储
const storage = multer.diskStorage({
  // 自定义目录
	destination: function (req, file, cb) {
		try {
      // 尝试创建一个文件夹
			fs.mkdirSync(path.join(process.cwd(), 'my-uploads'))
		} catch (e) {}

		cb(null, path.join(process.cwd(), 'my-uploads'))
	},
  // 自定义文件名
	filename: function (req, file, cb) {
		const uniqueSuffix =
			Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname

    // 设置文件名为字段名+唯一后缀
		cb(null, file.fieldname + '-' + uniqueSuffix)
	},
})

const upload = multer({ storage })

app.post('/ddd', upload.any(), function (req, res, next) {
	console.log('req.files', req.files)
	console.log('req.body', req.body)
})

app.listen(3333)
```
file 对象没变：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687091969362-d360e07e-8397-4329-aa28-30e144862211.png#averageHue=%23363636&clientId=uc02d7cdc-ae58-4&from=paste&height=140&id=u4bc28666&originHeight=280&originWidth=716&originalType=binary&ratio=2&rotation=0&showTitle=false&size=41830&status=done&style=none&taskId=u6f82957e-22b4-4157-b862-449d34d2b5e&title=&width=358)<br />浏览器再次上传，就可以看到目录和文件名都修改了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687092322049-04f61b48-17a1-46f4-b878-5b552eb5c91d.png#averageHue=%233f4345&clientId=uc02d7cdc-ae58-4&from=paste&height=104&id=u94b28f6e&originHeight=208&originWidth=678&originalType=binary&ratio=2&rotation=0&showTitle=false&size=46361&status=done&style=none&taskId=u2f6bf090-c981-411e-a57f-413cbdfa4d5&title=&width=339)

