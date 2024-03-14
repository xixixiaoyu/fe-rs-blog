## 项目创建与配置
新建 nest 项目：
```bash
nest new nest-multer-upload -p npm
```
安装下 multer 的 ts 类型的包：
```bash
npm install @types/multer -D
```
让 nest 服务支持跨域：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687100480800-f5a3e4b6-eb70-40b5-aaae-73daf64b45e6.png#averageHue=%23312e2b&clientId=u75d539ba-f95f-4&from=paste&height=160&id=qwDoT&originHeight=320&originWidth=1128&originalType=binary&ratio=2&rotation=0&showTitle=false&size=46858&status=done&style=none&taskId=u49b0a728-aa71-4172-b319-8ca01aa138a&title=&width=564)

## 单文件上传
添加一个 handler：
```typescript
@Post('aaa')
@UseInterceptors(
  FileInterceptor('aaa', {
    dest: 'uploads',
  }),
)
uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
  console.log('body', body);
  console.log('file', file);
}
```
这里使用 `FileInterceptor` 提取请求中的 aaa 字段，并通过 UploadedFile 装饰器将其作为参数传递。<br />当我们运行 `nest start --watch` 的时候，uploads 文件夹就会创建。

前端代码：
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
	</head>
	<body>
		<input id="fileInput" type="file" multiple />
		<script>
			const fileInput = document.querySelector('#fileInput')

			async function formData() {
				const data = new FormData()
				data.set('name', 'Yun')
				data.set('age', 20)
				data.set('aaa', fileInput.files[0])

				const res = await axios.post('http://localhost:3000/aaa', data)
				console.log(res)
			}

			fileInput.onchange = formData
		</script>
	</body>
</html>
```
服务端就打印了 file 对象和 body 字段，并且文件也保存到了 uploads 目录：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687103285689-addbd491-1b1c-499f-954e-a0a3626bfcc6.png#averageHue=%23323232&clientId=u259e3beb-0c7f-4&from=paste&height=155&id=u5a1b03bd&originHeight=310&originWidth=796&originalType=binary&ratio=2&rotation=0&showTitle=false&size=55114&status=done&style=none&taskId=u8a1652cc-cf3c-4b67-bd22-d3053454865&title=&width=398)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687100676400-d2bbd478-cbcf-434c-ba4b-5c6add5893f3.png#averageHue=%23224055&clientId=u75d539ba-f95f-4&from=paste&height=36&id=u353c6d79&originHeight=72&originWidth=616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=13939&status=done&style=none&taskId=ue61ba94b-bc62-4f8c-afe7-4ea7b6cb9b0&title=&width=308)


## 多文件上传
```typescript
@Post('bbb')
@UseInterceptors(
  FilesInterceptor('bbb', 3, {
    dest: 'uploads',
  }),
)
uploadFiles(
  @UploadedFiles() files: Array<Express.Multer.File>,
  @Body() body,
) {
  console.log('body', body);
  console.log('files', files);
}
```
把 FileInterceptor 换成 FilesInterceptor，把 UploadedFile 换成 UploadedFiles，都是多加一个 s。

前端代码：
```typescript
async function formData2() {
  const data = new FormData()
  data.set('name', 'Yun')
  data.set('age', 20)
  ;[...fileInput.files].forEach(item => {
    data.append('bbb', item)
  })

  const res = await axios.post('http://localhost:3000/bbb', data, {
    headers: { 'content-type': 'multipart/form-data' },
  })
  console.log(res)
}
```
这样就可以上传多文件了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687103334280-df7120ca-602e-4b3a-b2d5-941937129a29.png#averageHue=%23303030&clientId=u259e3beb-0c7f-4&from=paste&height=326&id=u1b9d99a0&originHeight=652&originWidth=808&originalType=binary&ratio=2&rotation=0&showTitle=false&size=102874&status=done&style=none&taskId=u238f496d-34f3-4ab6-9250-de7044a40a7&title=&width=404)


如果有多个文件的字段，和 multer 里类似，使用这种方式来指定：
```typescript
@Post('ccc')
@UseInterceptors(FileFieldsInterceptor([
    { name: 'aaa', maxCount: 2 },
    { name: 'bbb', maxCount: 3 },
], {
    dest: 'uploads'
}))
uploadFileFields(@UploadedFiles() files: { aaa?: Express.Multer.File[], bbb?: Express.Multer.File[] }, @Body() body) {
    console.log('body', body);
    console.log('files', files);
}
```

前端代码：
```typescript
async function formData3() {
  const data = new FormData()
  data.set('name', 'Yun')
  data.set('age', 20)
  data.append('aaa', fileInput.files[0])
  data.append('aaa', fileInput.files[1])
  data.append('bbb', fileInput.files[2])
  data.append('bbb', fileInput.files[3])

  const res = await axios.post('http://localhost:3000/ccc', data)
  console.log(res)
}
```
后端收到了上传的 aaa、bbb 的文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687101393813-8e99cee7-79b8-4c83-982f-1c6cfd64e8e7.png#averageHue=%23303030&clientId=u5c5c353a-0543-4&from=paste&height=456&id=u1b7783cd&originHeight=1314&originWidth=848&originalType=binary&ratio=2&rotation=0&showTitle=false&size=202097&status=done&style=none&taskId=ud51ccf51-b05b-4945-a4c7-88212d35771&title=&width=294)

如果不知道前端上传字段，哪些是用于文件上传的字段，可以使用 AnyFilesInterceptor：
```typescript
@Post('ddd')
@UseInterceptors(AnyFilesInterceptor({
    dest: 'uploads'
}))
uploadAnyFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body);
    console.log('files', files);
}
```

前端代码：
```typescript
async function formData4() {
  const data = new FormData()
  data.set('name', 'Yun')
  data.set('age', 20)
  data.set('aaa', fileInput.files[0])
  data.set('bbb', fileInput.files[1])
  data.set('ccc', fileInput.files[2])
  data.set('ddd', fileInput.files[3])

  const res = await axios.post('http://localhost:3000/ddd', data)
  console.log(res)
}
```
同样识别出了所有 file 字段：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687101705266-f81c7df3-7856-49da-9559-fc3e9ba4d546.png#averageHue=%23303030&clientId=u5c5c353a-0543-4&from=paste&height=470&id=u1f47eeb5&originHeight=1212&originWidth=810&originalType=binary&ratio=2&rotation=0&showTitle=false&size=195541&status=done&style=none&taskId=u099bf578-7b3b-42f9-acc5-baf51d9d234&title=&width=314)<br />这就是 Nest 上传文件的方式。

## 自定义存储
```typescript
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const storage = multer.diskStorage({
  // 自定义目录
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync(path.join(process.cwd(), 'my-uploads'));
    } catch (e) {}

    cb(null, path.join(process.cwd(), 'my-uploads'));
  },
  // 自定义文件
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export { storage };
```
然后在 controller 使用这个 storage：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687102032096-b7ab197e-23c1-4a33-8155-5764df8132b2.png#averageHue=%2335322d&clientId=u259e3beb-0c7f-4&from=paste&height=160&id=u774e07a6&originHeight=320&originWidth=510&originalType=binary&ratio=2&rotation=0&showTitle=false&size=31918&status=done&style=none&taskId=u21c11cf6-3055-4f1e-9223-dfa78211ad4&title=&width=255)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1694614938479-af4a2dd8-c328-4095-a376-f1bc55956c04.png#averageHue=%232c2c2c&clientId=uc8c2ce47-0ed3-4&from=paste&height=385&id=u786368ff&originHeight=1180&originWidth=1946&originalType=binary&ratio=2&rotation=0&showTitle=false&size=247600&status=done&style=none&taskId=ua12fb6d0-8a28-4478-b325-410057f7a1a&title=&width=635)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1694614969292-66cfd2d0-27aa-4c95-9090-fd0ed2ab2040.png#averageHue=%23324049&clientId=uc8c2ce47-0ed3-4&from=paste&height=109&id=uebf2e958&originHeight=218&originWidth=1086&originalType=binary&ratio=2&rotation=0&showTitle=false&size=74272&status=done&style=none&taskId=u2792ba9c-2700-482b-93c3-c4961a60957&title=&width=543)<br />其实 Nest 上传文件的方式就是对 multer 做了一层简单的封装。


## 文件校验
此外我们还可能对上传文件的大小，类型做限制。这部分可以放在 pipe 做。<br />我们生成一个 pipe：
```bash
nest g pipe file-size-validation-pipe --no-spec --flat
```
添加检查文件大小的逻辑，大于 10k 就抛出异常，返回 400 的响应：
```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (value.size > 10 * 1024) {
      throw new HttpException('文件大于 10k', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
```
加到 UploadedFile 的参数里：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1706433609779-ee54f45d-6bde-4e42-90f3-f1fc32a92d3f.png#averageHue=%232e2d2b&clientId=u0476d498-2714-4&from=paste&height=284&id=uc508c724&originHeight=568&originWidth=1200&originalType=binary&ratio=2&rotation=0&showTitle=false&size=105116&status=done&style=none&taskId=ua664be83-5922-4144-804e-2eb33d0c0fc&title=&width=600)<br />当上传一个图片大于 10k 的时候：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687102475859-97d7d0f5-b63f-4b5d-9baa-fade28963b83.png#averageHue=%23f1f0f0&clientId=u259e3beb-0c7f-4&from=paste&height=71&id=ua5992bf2&originHeight=142&originWidth=836&originalType=binary&ratio=2&rotation=0&showTitle=false&size=23275&status=done&style=none&taskId=u1f30b3d4-abd3-4e92-b5e0-7c30cdc4eff&title=&width=418)

但像文件大小、类型的校验这种常见的逻辑，Nest 内置了：
```typescript
@Post('fff')
@UseInterceptors(FileInterceptor('aaa', {
    dest: 'uploads'
}))
uploadFile3(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1000 }),
      new FileTypeValidator({ fileType: 'image/jpeg' }),
    ],
})) file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
}
```
MaxFileSizeValidator 是校验文件大小、FileTypeValidator 是校验文件类型。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687102905272-8bba9e5e-7b8a-4621-be7a-e0b98f3d85a0.png#averageHue=%23f8f4f3&clientId=u259e3beb-0c7f-4&from=paste&height=82&id=u9afa9ce3&originHeight=164&originWidth=1112&originalType=binary&ratio=2&rotation=0&showTitle=false&size=28750&status=done&style=none&taskId=u054cf21b-9927-4404-bb37-1aa77b0339c&title=&width=556)<br />返回的也是 400 响应，并且 message 说明了具体的错误信息。<br />而且这个错误信息 message 可以通过 exceptionFactory 工厂函数自定义。

我们也可以自己实现这样的 validator，只要继承 FileValidator 就可以：
```javascript
import { FileValidator } from '@nestjs/common';

export class MyFileValidator extends FileValidator {
  constructor(options) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    if (file.size > 10000) {
      return false;
    }
    return true;
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `文件 ${file.originalname} 大小超出 10k`;
  }
}
```
然后在 controller 用一下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687103043319-9d2d0a71-69d1-47ca-a65b-4ba4ed80b25a.png#averageHue=%232f2d2b&clientId=u259e3beb-0c7f-4&from=paste&height=386&id=u60d25609&originHeight=964&originWidth=1302&originalType=binary&ratio=2&rotation=0&showTitle=false&size=115084&status=done&style=none&taskId=u8a04f096-28b9-4c18-ad3f-624b17d72ce&title=&width=521)<br />浏览器上传文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687103061950-43b32953-4256-4b2b-be4d-33a6cc0d3d0f.png#averageHue=%23f7f2f2&clientId=u259e3beb-0c7f-4&from=paste&height=76&id=u3a73fa7f&originHeight=152&originWidth=1116&originalType=binary&ratio=2&rotation=0&showTitle=false&size=33460&status=done&style=none&taskId=u45744bf5-613a-492d-9ac7-67158944265&title=&width=558)<br />可以看到我们自定义的 FileValidator 生效了。<br />最后注意限制文件大小，大小超过之后文件最终还是会上传到服务器，因为文件写入才能拿到相关信息，我们可以根据路径来删除不合规的文件。
