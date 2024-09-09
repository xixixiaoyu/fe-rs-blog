Minio 是一个高性能的分布式对象存储服务，它与亚马逊 S3 兼容。
## 启动 docker 的 Minio 容器
首先，我们需要安装 [docker 桌面端](https://link.juejin.cn/?target=https%3A%2F%2Fwww.docker.com%2F)。<br />打开 Docker 桌面端，搜索 Minio 镜像：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713192488784-c918354d-099c-4d9c-8c90-ec596b2ae830.png#averageHue=%23131c23&clientId=u2b38e497-d546-4&from=paste&height=431&id=u39b8e8c8&originHeight=862&originWidth=1564&originalType=binary&ratio=2&rotation=0&showTitle=false&size=102597&status=done&style=none&taskId=u65030c3a-ff4c-476e-bb9f-d1c61f91bcb&title=&width=782)<br />填写信息：

- 容器名（name）：自定义容器名称。
- 端口映射（port）：将本地 9000 和 9001 端口映射到容器内。
- 数据卷（volume）：挂载本地目录到容器内的数据目录。
- 环境变量：设置 MINIO_ROOT_USER 和 MINIO_ROOT_PASSWORD 作为登录凭据。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713192524934-579b5417-e9c0-4044-8c1d-1ebf18bfa5f1.png#averageHue=%231f2932&clientId=u2b38e497-d546-4&from=paste&height=552&id=u58bf087f&originHeight=1104&originWidth=816&originalType=binary&ratio=2&rotation=0&showTitle=false&size=241283&status=done&style=none&taskId=ud3dff659-048e-4b59-9fc2-8cf0fd67f1d&title=&width=408)<br />点击 run 运行镜像为容器。

## 访问 Minio 管理界面

1. 访问 http://localhost:9001
2. 输入之前设置的用户名和密码进入管理界面：

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713090130646-7a846581-78e1-487d-af2c-185a16cd2558.png#averageHue=%2384adc0&clientId=u6e7f45de-e8c9-4&from=paste&height=501&id=uf351449b&originHeight=1002&originWidth=2540&originalType=binary&ratio=2&rotation=0&showTitle=false&size=914542&status=done&style=none&taskId=u27c7b60c-cb95-4e2f-874e-896ef64934b&title=&width=1270)


## 管理存储桶与文件
在管理界面中，可以创建和管理存储桶（bucket）和对象（object）：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713090941649-502f9eb9-02e0-4ee9-9795-7b320494eb55.png#averageHue=%2321211f&clientId=u4bdda695-d369-4&from=paste&height=379&id=u03e6f87d&originHeight=1184&originWidth=2516&originalType=binary&ratio=2&rotation=0&showTitle=false&size=151763&status=done&style=none&taskId=u8c31b07d-600b-4c33-b3a9-494f73440f9&title=&width=806)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713090992005-7da10385-94d7-42f3-9996-930b5533357e.png#averageHue=%2320201d&clientId=u4bdda695-d369-4&from=paste&height=361&id=u159348c2&originHeight=722&originWidth=1202&originalType=binary&ratio=2&rotation=0&showTitle=false&size=54637&status=done&style=none&taskId=udb3aef6f-ebaa-41f5-9162-1176427bfbb&title=&width=601)<br />可以在这个桶中上传文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713091080809-8d05dfa7-3485-4e68-9bad-45fd4329ea15.png#averageHue=%23242320&clientId=u4bdda695-d369-4&from=paste&height=201&id=u5a128ddd&originHeight=402&originWidth=1952&originalType=binary&ratio=2&rotation=0&showTitle=false&size=56145&status=done&style=none&taskId=u909d1042-c4b0-4446-8998-5d02985e7c7&title=&width=976)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713091466271-c8d7af3e-435b-404d-80ea-4d6e068165ce.png#averageHue=%23292825&clientId=u4bdda695-d369-4&from=paste&height=398&id=u914dda5e&originHeight=796&originWidth=1956&originalType=binary&ratio=2&rotation=0&showTitle=false&size=91421&status=done&style=none&taskId=u193476b5-067e-48fe-8be9-9aadcda6e55&title=&width=978)<br />点击 share 就可以看到这个文件的 url：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713091165953-7af075aa-8a0a-431c-a0f8-cab93b3a1a79.png#averageHue=%23252421&clientId=u4bdda695-d369-4&from=paste&height=409&id=u558d267e&originHeight=818&originWidth=1928&originalType=binary&ratio=2&rotation=0&showTitle=false&size=128853&status=done&style=none&taskId=u2b765f17-f4a4-423d-bb22-e3586283ae7&title=&width=964)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713091495223-153282f2-866c-482f-82ba-884bdf2bd5f4.png#averageHue=%2332302c&clientId=u4bdda695-d369-4&from=paste&height=306&id=u871a0f58&originHeight=612&originWidth=1314&originalType=binary&ratio=2&rotation=0&showTitle=false&size=91527&status=done&style=none&taskId=u2880d1f2-4f64-49a0-a11c-35ed86ee378&title=&width=657)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713091626760-29cd1fc4-cd72-45e9-b123-bc87b56a2681.png#averageHue=%23222d24&clientId=u4bdda695-d369-4&from=paste&height=622&id=ue9fedc5a&originHeight=1244&originWidth=2274&originalType=binary&ratio=2&rotation=0&showTitle=false&size=824655&status=done&style=none&taskId=u89da21cc-b606-4374-9b5a-0ac28bd589a&title=&width=1137)<br />带了很长一串密钥才能访问。

## 设置文件访问权限
默认情况下，文件访问权限不是公开的。您可以添加匿名访问规则以允许直接访问文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713091547608-8c6adbb0-5f16-4f6d-82de-bdfc6c814136.png#averageHue=%231e1d1b&clientId=u4bdda695-d369-4&from=paste&height=427&id=uddadf76d&originHeight=854&originWidth=2410&originalType=binary&ratio=2&rotation=0&showTitle=false&size=143118&status=done&style=none&taskId=uae2eab96-94fb-4f42-a5da-1734e38da49&title=&width=1205)<br />不带后面那串密钥也可以访问了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713091699730-badc0fb3-54c9-4602-843f-b6ae8a2627f2.png#averageHue=%23222d24&clientId=u4bdda695-d369-4&from=paste&height=490&id=u651b871a&originHeight=1260&originWidth=2240&originalType=binary&ratio=2&rotation=0&showTitle=false&size=814551&status=done&style=none&taskId=uf4e0a014-ba34-45de-b57f-512fc50c261&title=&width=871)

## 使用 SDK 上传和下载文件
安装 Minio 包：
```bash
npm install minio
```
代码：
```javascript
var Minio = require('minio')

var minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'your-accessKey',
  secretKey: 'your-secretKey',
})

// 上传文件
function put() {
    minioClient.fPutObject('bucket-name', 'object-name', 'file-path', function (err, etag) {
        if (err) return console.log(err)
        console.log('上传成功');
    });
}

// 下载文件
function get() {
    minioClient.getObject('bucket-name', 'object-name', (err, stream) => {
        if (err) return console.log(err)
        stream.pipe(fs.createWriteStream('output-file-path'));
    });
}

// 调用函数
put();
get();
```
这里可以创建 accessKey：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1713091898067-6f21715a-3828-457b-9d68-d05b8d174bda.png#averageHue=%23252421&clientId=u4bdda695-d369-4&from=paste&height=278&id=u3f91d1dd&originHeight=556&originWidth=2458&originalType=binary&ratio=2&rotation=0&showTitle=false&size=91642&status=done&style=none&taskId=u7916db79-acd9-4b55-a3ae-7ada619c679&title=&width=1229)<br />所有 OSS 服务（如阿里云 OSS、Minio）其实都是相似的，因为它们都遵循 AWS 的 Simple Storage Service（S3）规范。<br />因此，无论使用哪家服务，其操作方式大致相同。<br />更多的 api 用法可以看 [minio 文档](https://link.juejin.cn/?target=https%3A%2F%2Fmin.io%2Fdocs%2Fminio%2Flinux%2Fdevelopers%2Fjavascript%2Fminio-javascript.html)。
