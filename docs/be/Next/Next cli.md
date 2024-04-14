Next.js 提供了便捷的 create-next-app 脚手架，它支持 TypeScript、ESLint 等功能，无需配置即可自动编译和打包。<br />环境要求：本文基于 Next.js v14 最新版本，需要Node.js 18.17 或更高版本。

## 使用 cli 自动创建项目
### 创建项目
使用 create-next-app 是最快捷的创建项目方式：
```bash
npx create-next-app@latest
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1712216453841-ef0bd5e8-2421-4c33-a09a-ddd5f95a7fb8.png#averageHue=%23323232&clientId=u5998fa6e-321a-4&from=paste&height=462&id=ua53d85c9&originHeight=1258&originWidth=1168&originalType=binary&ratio=2&rotation=0&showTitle=false&size=191873&status=done&style=none&taskId=ua5fe4d11-d26e-458a-8eb3-daa31b9b880&title=&width=429)<br />运行此命令后，系统会提示您设置项目名称和选择一些选项，如 TypeScript、ESLint 的使用等。初学者可以选择默认设置。


### 运行项目
在项目根目录的 package.json 中，您会看到以下脚本命令：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1712216579377-ee091372-21f2-49ed-bbb0-c19df7250eb5.png#averageHue=%232b2b2b&clientId=u5998fa6e-321a-4&from=paste&height=156&id=ud7ebd424&originHeight=312&originWidth=514&originalType=binary&ratio=2&rotation=0&showTitle=false&size=26274&status=done&style=none&taskId=ue133077c-ec79-4e7d-80a5-ed523d7b26b&title=&width=257)

- npm run dev：用于开发环境。
- npm run build：构建生产环境的代码。
- npm run start：运行生产环境的项目。
- npm run lint：执行代码检查。

项目下运行 npm run dev，打开浏览器访问 http://localhost:3000，若页面显示正常，则表示项目成功运行。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1712216679364-e4f3bd54-54a5-4da4-981b-42db1541e4e1.png#averageHue=%23e7ebec&clientId=u5998fa6e-321a-4&from=paste&height=567&id=uf0272cd2&originHeight=1134&originWidth=2278&originalType=binary&ratio=2&rotation=0&showTitle=false&size=466974&status=done&style=none&taskId=u723ba3c0-e400-4ca0-bfb1-ab5cb9b91be&title=&width=1139)

### 示例代码
Next.js 在 GitHub 上提供了丰富的示例代码，如 with-redux、api-routes-cors 等。您可以通过以下命令直接基于示例代码创建项目：
```bash
npx create-next-app --example with-redux your-app-name
```

## 手动创建项目
虽然大部分情况下我们不需要手动创建项目，但了解手动创建的过程有助于理解 Next.js 项目的基础结构。
### 创建文件夹并安装依赖
创建文件夹（例如 next-app-manual），进入目录，安装以下依赖：
```bash
npm install next@latest react@latest react-dom@latest
```

### 添加脚本
编辑 package.json，添加以下 scripts 脚本：
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 创建目录与文件
在 next-app-manual 目录下创建 app 文件夹，并在其中添加 layout.js 和 page.js：
```javascript
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// app/page.js
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```

### 运行项目
执行 npm run dev，如果页面正常渲染，则表示项目运行成功。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1712217280371-ec134c76-ea13-4cc4-a0b3-67d9a36dba29.png#averageHue=%23e9e9e9&clientId=u5998fa6e-321a-4&from=paste&height=103&id=u26623f31&originHeight=206&originWidth=496&originalType=binary&ratio=2&rotation=0&showTitle=false&size=14766&status=done&style=none&taskId=u52ce3205-e554-465d-b6c4-714b0ddeccd&title=&width=248)



## Next cli
在 package.json 文件中，当我们运行 npm run dev 命令时，实际上是在执行 next dev。以下是 Next.js CLI 常用命令的快速概览。

### CLI 命令快速访问
要查看所有可用的 CLI 命令，可以在命令行中执行以下命令：
```bash
npx next -h
```
由于使用 npx 创建的项目避免了全局安装 create-next-app，本地并不会安装 next 命令。如果需要执行 next 命令，请在命令前加上 npx。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1712217434224-b1787ce1-03db-44f2-9818-34491c112edf.png#averageHue=%23323232&clientId=u5998fa6e-321a-4&from=paste&height=225&id=u281d0a4b&originHeight=450&originWidth=1592&originalType=binary&ratio=2&rotation=0&showTitle=false&size=55086&status=done&style=none&taskId=u1909d4e3-9a00-4c83-ad13-6a12ecdba4b&title=&width=796)<br />该命令会显示所有可用的 next 命令选项，其中 -h 是 --help 的简写。

### next dev
开发模式下，使用以下命令运行程序：
```bash
npx next dev
```
此命令具有热加载、错误报告等功能。默认运行在 http://localhost:3000。

### next build
next build 命令用于创建项目的生产优化版本。
```bash
npx next build
```
#### 构建输出说明
构建时，会显示每条路由的信息，如 Size 和 First Load JS。这些值表示 gzip 压缩后的大小，其中 First Load JS 会以绿色、黄色或红色标识性能等级。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1712217582549-3d2a38fa-46da-49e5-ab62-4e283caeaf2b.png#averageHue=%23373737&clientId=u5998fa6e-321a-4&from=paste&height=340&id=ub77f7928&originHeight=680&originWidth=1036&originalType=binary&ratio=2&rotation=0&showTitle=false&size=106271&status=done&style=none&taskId=u5885122b-bae9-496c-a843-e229e20f500&title=&width=518)

- Size：到达特定路由时下载的资源大小，只包含该路由的依赖项。
- First Load JS：加载页面时下载的资源总大小。
- First load JS shared by all：所有路由共享的 JS 大小。

关系如下：
```markdown
First Load JS = Size + First load JS shared by all
```
例如，如果 / 路由的 First Load JS 为 89 kB，Size 为 5.16 kB，则共享的 JS 大小为 83.9 kB。
#### 生产性能分析
使用以下命令开启 React 的生产性能分析（需要 Next.js v9.5 或更高版本）：<br />需要[需要浏览器有一个 React 插件](https://link.juejin.cn/?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Freact-developer-tools%2Ffmkadmapgofadopljbjfkapdkoienihi)：
```bash
npx next build --profile
npm run start
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1712218099603-b5379a1e-1958-49e8-871c-64e4ab579874.png#averageHue=%23c4a082&clientId=u5998fa6e-321a-4&from=paste&height=443&id=u2d02c8a6&originHeight=1062&originWidth=2028&originalType=binary&ratio=2&rotation=0&showTitle=false&size=286376&status=done&style=none&taskId=u4b5c9883-a8bb-4dac-ae84-7f2919a29f6&title=&width=845)
#### 构建调试
```bash
npx next build --debug
```
此命令会输出更详细的构建信息，如 rewrites、redirects、headers 等。

### next start
生产模式下，使用以下命令运行程序：
```bash
npx next start
```
在运行此命令之前，需要先执行 next build 生成生产代码。默认运行在 http://localhost:3000。
#### 端口设置
```bash
npx next start -p 4000
```

### next lint
执行以下命令进行 ESLint 检查：
```bash
npx next lint
```
默认检查 pages/、app/、components/、lib/、src/ 目录下的文件。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1712218457361-c8b96890-3574-459d-839b-35630ac99272.png#averageHue=%233c3c3c&clientId=u5998fa6e-321a-4&from=paste&height=32&id=ufb9ab29f&originHeight=64&originWidth=794&originalType=binary&ratio=2&rotation=0&showTitle=false&size=12926&status=done&style=none&taskId=ub1570aa2-1df8-4bf2-9e32-88013c02736&title=&width=397)

#### 指定检查目录
```bash
npx next lint --dir utils
```

### next info
打印当前系统相关信息，以便报告 Next.js 程序的 bug：
```bash
npx next info
```
这些信息可帮助开发者或 Next.js 官方团队排查问题。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1712218484709-5384937c-26b0-42c1-9a29-3fb4796fbce7.png#averageHue=%23313131&clientId=u5998fa6e-321a-4&from=paste&height=384&id=ucc1c9b35&originHeight=768&originWidth=2166&originalType=binary&ratio=2&rotation=0&showTitle=false&size=120893&status=done&style=none&taskId=ua6ceae80-7998-42fc-ba61-782383b5c49&title=&width=1083)

