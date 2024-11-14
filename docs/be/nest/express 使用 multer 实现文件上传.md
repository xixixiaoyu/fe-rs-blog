# 深入理解 Express 和 Multer 文件上传：从基础到进阶

在现代 Web 开发中，文件上传是一个常见的需求。无论是用户上传头像、文档，还是其他类型的文件，服务器都需要能够处理这些文件上传请求。在 Node.js 生态中，`multer` 是一个非常流行的中间件，用于处理 `multipart/form-data` 格式的文件上传请求。本文将带你从基础到进阶，深入理解如何在 Express 中使用 `multer` 处理文件上传。

## 1. 初识 Multer：单文件上传

首先，我们从最简单的单文件上传开始。为了演示，我们需要创建一个简单的 Express 服务器，并使用 `multer` 处理文件上传。

### 1.1 初始化项目

首先，创建一个新的项目目录并初始化 `package.json`：

```bash
mkdir file-upload-demo
cd file-upload-demo
npm init -y
```

接着，安装所需的依赖：

```bash
npm install express multer cors
```

- `express`：Node.js 的 Web 框架。
- `multer`：用于处理文件上传的中间件。
- `cors`：用于处理跨域请求。

### 1.2 创建 Express 服务器

接下来，我们创建一个简单的 Express 服务器，处理单文件上传：

```javascript:index.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  console.log('Uploaded file:', req.file);
  console.log('Form data:', req.body);
  res.send('File uploaded successfully');
});

app.listen(3333, () => {
  console.log('Server is running on http://localhost:3333');
});
```

在这个例子中，我们使用 `multer` 的 `single` 方法来处理单个文件上传，并将文件保存到 `uploads/` 目录中。`req.file` 包含上传的文件信息，而 `req.body` 包含其他表单数据。

### 1.3 前端文件上传

为了测试文件上传，我们需要一个简单的前端页面：

```html:index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Upload</title>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</head>
<body>
    <input id="fileInput" type="file" />
    <script>
        const fileInput = document.querySelector('#fileInput');

        async function uploadFile() {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            const response = await axios.post('http://localhost:3333/upload', formData);
            console.log(response.data);
        }

        fileInput.onchange = uploadFile;
    </script>
</body>
</html>
```

在这个页面中，用户可以选择一个文件，文件会通过 `axios` 发送到服务器。`axios` 会自动设置 `Content-Type` 为 `multipart/form-data`，因此我们不需要手动指定。

### 1.4 运行项目

启动 Express 服务器：

```bash
node index.js
```

然后使用 `http-server` 或其他静态服务器工具启动前端页面：

```bash
npx http-server
```

访问前端页面，选择一个文件并上传。你会看到文件被成功上传到服务器，并保存在 `uploads/` 目录中。

## 2. 多文件上传

单文件上传已经搞定了，那如果我们需要上传多个文件呢？`multer` 提供了 `array` 方法来处理同一字段的多个文件上传。

### 2.1 处理多文件上传

我们可以通过以下代码来处理多文件上传：

```javascript:index.js
app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
  console.log('Uploaded files:', req.files);
  res.send('Multiple files uploaded successfully');
});
```

在这个例子中，`multer` 的 `array` 方法允许我们上传最多 5 个文件。上传的文件信息会存储在 `req.files` 中。

### 2.2 前端多文件上传

前端页面也需要做相应的修改，允许用户选择多个文件：

```html:index.html
<input id="fileInput" type="file" multiple />
<script>
    const fileInput = document.querySelector('#fileInput');

    async function uploadMultipleFiles() {
        const formData = new FormData();
        [...fileInput.files].forEach(file => {
            formData.append('files', file);
        });

        const response = await axios.post('http://localhost:3333/upload-multiple', formData);
        console.log(response.data);
    }

    fileInput.onchange = uploadMultipleFiles;
</script>
```

通过 `multiple` 属性，用户可以选择多个文件。我们使用 `forEach` 方法将每个文件添加到 `FormData` 中。

## 3. 错误处理：文件数量限制

在实际应用中，我们可能需要限制上传的文件数量或大小。`multer` 提供了内置的错误处理机制。

### 3.1 限制文件数量

我们可以通过 `multer` 的 `array` 方法限制上传的文件数量。如果用户上传的文件超过限制，`multer` 会抛出一个 `MulterError`。

```javascript:index.js
app.post('/upload-multiple', upload.array('files', 2), (req, res, next) => {
  console.log('Uploaded files:', req.files);
  res.send('Files uploaded successfully');
}, (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400).send('Too many files uploaded');
  } else {
    next(err);
  }
});
```

在这个例子中，我们限制最多上传 2 个文件。如果用户上传超过 2 个文件，服务器会返回 400 错误，并提示“文件上传过多”。

## 4. 自定义文件存储路径和文件名

默认情况下，`multer` 会将文件保存到指定的目录，并使用随机生成的文件名。如果我们想自定义文件的存储路径和文件名，可以使用 `multer.diskStorage`。

### 4.1 自定义存储引擎

我们可以通过以下代码自定义文件的存储路径和文件名：

```javascript:index.js
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'my-uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadWithCustomStorage = multer({ storage });

app.post('/upload-custom', uploadWithCustomStorage.single('file'), (req, res) => {
  console.log('Uploaded file with custom storage:', req.file);
  res.send('File uploaded with custom storage');
});
```

在这个例子中，我们使用 `multer.diskStorage` 自定义了文件的存储路径和文件名。文件名由字段名、时间戳和原始文件名的扩展名组成。

## 5. 总结

通过本文的学习，我们从基础的单文件上传到多文件上传，再到自定义存储路径和文件名，全面了解了如何使用 `multer` 处理文件上传。`multer` 是一个功能强大且灵活的中间件，能够满足各种文件上传的需求。

- **单文件上传**：使用 `single` 方法处理单个文件。
- **多文件上传**：使用 `array` 方法处理同一字段的多个文件。
- **错误处理**：通过错误处理中间件处理文件数量或大小限制。
- **自定义存储**：使用 `multer.diskStorage` 自定义文件的存储路径和文件名。

在下一篇文章中，我们将进一步探讨如何在 Nest.js 中集成 `multer`，实现更复杂的文件上传功能。
