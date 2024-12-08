# 在 NestJS 中使用 Multer 处理文件上传：从基础到进阶

在现代 Web 开发中，文件上传是一个非常常见的需求。无论是图片、视频，还是文档，处理文件上传的能力几乎是每个后端框架的标配。在上一节中，我们学习了如何在 Express 中使用 `multer` 处理 `multipart/form-data` 类型的请求。而在 NestJS 中，文件上传同样是基于 `multer` 实现的。本文将带你一步步深入了解如何在 NestJS 中处理文件上传，并探索一些进阶的用法。

## 1. 初始化项目并安装依赖

首先，我们需要创建一个新的 NestJS 项目，并安装 `multer` 的 TypeScript 类型定义包：

```bash
nest new nest-multer-upload -p npm
npm install -D @types/multer
```

## 2. 单文件上传

在 NestJS 中，处理单文件上传非常简单。我们可以使用 `FileInterceptor` 来拦截文件上传请求，并通过 `@UploadedFile` 装饰器将文件作为参数传入控制器。

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
}
```

在这个例子中，`FileInterceptor` 会拦截名为 `file` 的字段，并将上传的文件保存到 `uploads` 目录。`@UploadedFile` 装饰器则会将文件对象传递给 `uploadFile` 方法。

### 前端代码

前端可以通过 `FormData` 对象来发送文件：

```html
<input id="fileInput" type="file" />
<script>
  const fileInput = document.querySelector('#fileInput')
  fileInput.onchange = async () => {
    const data = new FormData()
    data.append('file', fileInput.files[0])
    const res = await axios.post('http://localhost:3000/upload', data)
    console.log(res)
  }
</script>
```

当文件上传成功后，服务端会将文件保存到 `uploads` 目录，并打印文件信息。

## 3. 多文件上传

如果需要上传多个文件，可以使用 `FilesInterceptor`。它允许我们指定上传的文件数量，并通过 `@UploadedFiles` 装饰器获取文件数组。

```typescript
@Post('upload-multiple')
@UseInterceptors(FilesInterceptor('files', 3, { dest: 'uploads' }))
uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body);
    console.log('files', files);
}
```

### 前端代码

前端代码稍作修改，使用 `FormData` 的 `append` 方法来添加多个文件：

```html
<input id="fileInput" type="file" multiple />
<script>
  const fileInput = document.querySelector('#fileInput')
  fileInput.onchange = async () => {
    const data = new FormData()
    ;[...fileInput.files].forEach(file => data.append('files', file))
    const res = await axios.post('http://localhost:3000/upload-multiple', data)
    console.log(res)
  }
</script>
```

## 4. 多字段文件上传

有时我们需要上传多个文件字段，比如 `aaa` 和 `bbb`。这时可以使用 `FileFieldsInterceptor` 来处理。

```typescript
@Post('upload-fields')
@UseInterceptors(FileFieldsInterceptor([
    { name: 'aaa', maxCount: 2 },
    { name: 'bbb', maxCount: 3 },
], { dest: 'uploads' }))
uploadFileFields(@UploadedFiles() files: { aaa?: Express.Multer.File[], bbb?: Express.Multer.File[] }, @Body() body) {
    console.log('body', body);
    console.log('files', files);
}
```

### 前端代码

前端代码可以通过 `FormData` 分别添加不同字段的文件：

```html
<input id="fileInput" type="file" multiple />
<script>
  const fileInput = document.querySelector('#fileInput')
  fileInput.onchange = async () => {
    const data = new FormData()
    data.append('aaa', fileInput.files[0])
    data.append('bbb', fileInput.files[1])
    const res = await axios.post('http://localhost:3000/upload-fields', data)
    console.log(res)
  }
</script>
```

## 5. 动态文件字段上传

如果我们并不知道有哪些文件字段，可以使用 `AnyFilesInterceptor` 来处理任意文件字段。

```typescript
@Post('upload-any')
@UseInterceptors(AnyFilesInterceptor({ dest: 'uploads' }))
uploadAnyFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body);
    console.log('files', files);
}
```

### 前端代码

前端代码可以动态添加任意文件字段：

```html
<input id="fileInput" type="file" multiple />
<script>
  const fileInput = document.querySelector('#fileInput')
  fileInput.onchange = async () => {
    const data = new FormData()
    data.append('file1', fileInput.files[0])
    data.append('file2', fileInput.files[1])
    const res = await axios.post('http://localhost:3000/upload-any', data)
    console.log(res)
  }
</script>
```

## 6. 自定义存储方式

NestJS 允许我们自定义文件的存储方式。我们可以使用 `multer.diskStorage` 来指定文件的存储路径和文件名。

```typescript
import * as multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'my-uploads')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath)
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

export { storage }
```

然后在控制器中使用这个自定义的存储方式：

```typescript
@Post('upload-custom')
@UseInterceptors(FileInterceptor('file', { storage }))
uploadFileCustom(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
}
```

## 7. 文件校验

文件上传时，我们通常需要对文件的大小、类型等进行校验。NestJS 提供了 `ParseFilePipe` 来帮助我们实现这些校验。

```typescript
@Post('upload-validate')
@UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
uploadFileWithValidation(
    @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1000 }), // 最大 1KB
            new FileTypeValidator({ fileType: 'image/jpeg' }) // 只允许 JPEG 图片
        ]
    })) file: Express.Multer.File,
    @Body() body
) {
    console.log('body', body);
    console.log('file', file);
}
```

如果文件不符合要求，NestJS 会自动返回 400 错误，并提供详细的错误信息。

## 8. 自定义文件校验器

如果内置的校验器不能满足需求，我们还可以自定义文件校验器。只需继承 `FileValidator` 并实现 `isValid` 和 `buildErrorMessage` 方法。

```typescript
import { FileValidator } from '@nestjs/common'

export class MyFileValidator extends FileValidator {
  isValid(file: Express.Multer.File): boolean {
    return file.size <= 10000 // 自定义校验逻辑
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return `文件 ${file.originalname} 大小超出 10k`
  }
}
```

然后在控制器中使用这个自定义校验器：

```typescript
@Post('upload-custom-validate')
@UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
uploadFileWithCustomValidation(
    @UploadedFile(new ParseFilePipe({
        validators: [new MyFileValidator({})]
    })) file: Express.Multer.File,
    @Body() body
) {
    console.log('body', body);
    console.log('file', file);
}
```

## 总结

NestJS 的文件上传功能是基于 `multer` 实现的，它通过一层封装提供了更简洁的 API。我们可以使用 `FileInterceptor`、`FilesInterceptor`、`FileFieldsInterceptor` 和 `AnyFilesInterceptor` 来处理不同场景下的文件上传需求。同时，NestJS 还提供了 `ParseFilePipe` 来进行文件校验，并允许我们自定义存储方式和校验逻辑。

通过这些功能，NestJS 让文件上传变得更加灵活和强大。希望这篇文章能帮助你更好地理解和使用 NestJS 的文件上传功能。
