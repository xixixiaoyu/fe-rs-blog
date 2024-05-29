 Prisma 的全部命令：
```bash
npx prisma -h
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696775230112-a7a3e784-f844-4fe4-8f93-3ef955c21d0d.png#averageHue=%23333333&clientId=u1b0bb3d4-a837-4&from=paste&height=280&id=q5FiA&originHeight=504&originWidth=1322&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=68242&status=done&style=none&taskId=u7644d35e-e49c-4805-beb7-78ac4bf8489&title=&width=734.4444639005784)

- init：创建 schema 文件，初始化项目结构。
- generate：根据 schema 文件生成客户端代码。
- db：包括数据库与 schema 的同步。
- migrate：处理数据表结构的迁移。
- studio：提供图形化界面进行 CRUD 操作。
- validate：验证 schema 文件的语法。
- format：格式化 schema 文件。
- version：显示版本信息。

## 环境设置与初始化
首先，我们需要创建一个新的项目并设置 Prisma：
```bash
mkdir prisma-all-command
cd prisma-all-command
npm init -y
npm install prisma -g
prisma init
```

## 初始化与配置
执行 init 命令：
```bash
prisma init --datasource-provider mysql
```
执行后，生成 `prisma/schema.prisma` 和 `.env` 文件，配置数据库连接。

修改数据库连接：

- 可通过修改 `.env` 文件中的 URL 来更改数据库连接，例如：
```bash
prisma init --url mysql://root:password@localhost:3306/prisma_test
```

- password：这是连接数据库的密码。在实际使用中，你应该替换成你的实际数据库密码。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714793981410-c4f5fee2-b3a2-47c6-a969-d9221abf3130.png#averageHue=%232b2a2a&clientId=u9d45ce7f-eb6e-4&from=paste&height=251&id=ub643bf4f&originHeight=502&originWidth=1572&originalType=binary&ratio=2&rotation=0&showTitle=false&size=78464&status=done&style=none&taskId=u405e9c33-17a6-4668-ae68-32e50e98e87&title=&width=786)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714796550849-d63440a8-26fb-4b61-a190-5c240db7f598.png#averageHue=%23262524&clientId=u0f66363c-4ce4-4&from=paste&height=445&id=u1f3ebe49&originHeight=712&originWidth=756&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=87868&status=done&style=none&taskId=ud59e2f46-9f23-4c64-9d93-839a604ed8b&title=&width=472.49999295920145)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714796561021-b7bd8ee1-ef7b-408d-99a5-af519316a2f8.png#averageHue=%23252524&clientId=u0f66363c-4ce4-4&from=paste&height=251&id=u44ecf081&originHeight=402&originWidth=1260&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=83180&status=done&style=none&taskId=u905d17a8-cc22-47de-86d2-7de79373df1&title=&width=787.4999882653358)

## 数据库与 Schema 同步
### 拉取数据库结构到 Schema
```bash
prisma db pull
```
此命令将数据库中的表结构同步到 Prisma 的 schema 文件中。<br />现在连接的 prisma_test 数据库里是有这两个表：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714796633947-e840b6fe-6b2b-4ed3-a6b5-6b21978325d2.png#averageHue=%23d6d2cf&clientId=u0f66363c-4ce4-4&from=paste&height=85&id=u4b9a70c4&originHeight=136&originWidth=320&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=20252&status=done&style=none&taskId=ue5aecb01-4e45-45c0-9c2d-7487f09a116&title=&width=199.99999701976782)<br />执行 `prisma db pull` 后：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714796678425-cdb29e46-d10d-4e22-b948-b9a40e534765.png#averageHue=%23252423&clientId=u0f66363c-4ce4-4&from=paste&height=556&id=u88bf445d&originHeight=890&originWidth=1432&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=137493&status=done&style=none&taskId=u4c474309-7962-4882-937f-448a71cb682&title=&width=894.999986663461)

### 推送 Schema 更改到数据库
```bash
prisma db push
```
将 schema 文件中的更改推送到数据库，同步表结构。<br />我们先把表全部删除：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714796741138-3d55eb1e-8947-48b9-9a15-f8aa731e25fc.png#averageHue=%23dfe0e0&clientId=u0f66363c-4ce4-4&from=paste&height=329&id=u98fea123&originHeight=526&originWidth=570&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=155474&status=done&style=none&taskId=u1f6ebe03-5b55-4b06-b0fb-fac0f8dfaa1&title=&width=356.2499946914614)<br />执行 `prisma db push` 后：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714796964194-90d30e01-a1fa-4800-b6f9-931950c0dbd0.png#averageHue=%232b2b2a&clientId=u0f66363c-4ce4-4&from=paste&height=305&id=u4a3757af&originHeight=488&originWidth=1222&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=158640&status=done&style=none&taskId=u319e3c99-3c8b-46d7-b904-00f62843426&title=&width=763.7499886192383)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714796885666-53cbac0b-e7df-49bc-93c2-6a549fd2c59e.png#averageHue=%23d7d4d1&clientId=u0f66363c-4ce4-4&from=paste&height=92&id=u449293fa&originHeight=148&originWidth=246&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=15544&status=done&style=none&taskId=u210d7ea2-34e8-4722-9f00-a65a2f48e95&title=&width=153.7499977089465)<br />重新生成了这两张表。

## 数据迁移
创建与应用迁移：
```bash
prisma migrate dev --name init
```
此命令根据 schema 的更改生成 SQL 文件，并执行这些 SQL 来更新数据库结构，同时生成客户端代码。<br />数据库中的 _prisma_migrations 表记录所有迁移历史，有助于跟踪每次迁移的详细信息：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714797092550-d1ee03e7-1b01-4d58-9227-2d156920fac5.png#averageHue=%23d3ccc6&clientId=u0f66363c-4ce4-4&from=paste&height=120&id=ub94f5331&originHeight=192&originWidth=346&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=28058&status=done&style=none&taskId=u2f4b4c34-8658-4952-b363-d08cf8ce1b8&title=&width=216.24999677762395)

## 数据初始化与脚本执行
### 数据初始化脚本
prisma/seed.ts：
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
	const user = await prisma.user.create({
		data: {
			name: '云牧',
			email: 'xx@xx.com',
			Post: {
				create: [
					{ title: '文章1', content: '内容1' },
					{ title: '文章2', content: '内容2' },
				],
			},
		},
	});
	console.log(user);
}

main();
```
在 package.json 中添加脚本执行命令：
```json
"prisma": {
    "seed": "npx ts-node prisma/seed.ts"
}
```
执行命令 `prisma db seed` 来插入初始数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714797499095-4fb24d8a-7e4f-4ffc-b770-b1b555a2dd77.png#averageHue=%23343332&clientId=u0f66363c-4ce4-4&from=paste&height=121&id=ue411bc3d&originHeight=194&originWidth=958&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=38908&status=done&style=none&taskId=ud819a28b-5ded-4de1-8516-fab1d37e750&title=&width=598.7499910779298)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714797515819-9e1a0e31-0df4-4e62-9f64-5668819d8a67.png#averageHue=%23f3f3f3&clientId=u0f66363c-4ce4-4&from=paste&height=257&id=u702a9868&originHeight=412&originWidth=618&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=49350&status=done&style=none&taskId=u4ce21126-60c7-40f0-8162-a73a1d84a5a&title=&width=386.2499942444266)![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714797531459-691f04fc-ad98-4d1f-9a6c-545c523ddc51.png#averageHue=%23f1f1f1&clientId=u0f66363c-4ce4-4&from=paste&height=276&id=u6deec13a&originHeight=442&originWidth=610&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=61273&status=done&style=none&taskId=u75552475-c679-4dd0-8054-147e2dd401a&title=&width=381.24999431893235)<br />数据正确插入了。

### 执行 SQL 脚本
写一个 prisma/test.sql：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714797672965-aa134be6-c1cc-49f9-a304-bb91ff799596.png#averageHue=%23292928&clientId=u0f66363c-4ce4-4&from=paste&height=55&id=u39db1a15&originHeight=88&originWidth=716&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=17198&status=done&style=none&taskId=u29801c5a-aae0-4c7e-8a22-b3e6b85ca65&title=&width=447.4999933317305)<br />执行命令：
```bash
prisma db execute --file prisma/test.sql --schema prisma/schema.prisma
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714797721872-04d32d40-ad51-47ed-8164-99f7268ddc47.png#averageHue=%23373635&clientId=u0f66363c-4ce4-4&from=paste&height=41&id=LzJ5k&originHeight=66&originWidth=1850&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=17954&status=done&style=none&taskId=u9f441f27-1011-4d76-a2d5-9d5cfd52f47&title=&width=1156.2499827705326)<br />SQL 脚本执行后，会删除 id 为 2 的文章：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714797752669-6f1c20cb-7859-422f-8bfc-926a4a0c0113.png#averageHue=%23f2f2f1&clientId=u0f66363c-4ce4-4&from=paste&height=257&id=u651ce603&originHeight=412&originWidth=598&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=51302&status=done&style=none&taskId=ude4865bf-cbe4-46c9-8271-44b84f35871&title=&width=373.74999443069106)

## **重置数据库**
使用 `prisma migrate reset` 命令可以重置数据库，清空所有数据，并重新执行所有迁移和数据初始化。

## 代码生成
`prisma generate` 命令用于根据 `schema.prisma` 文件生成 Prisma 客户端代码，这些代码位于 `node_modules/@prisma/client` 目录下，主要用于实现 CRUD 操作。<br />注意：该命令不会同步数据库结构，仅根据 schema 文件生成客户端代码。

## 图形界面操作
`prisma studio` 提供了一个用户友好的图形界面，使得用户可以直接在浏览器中进行数据的增删改查操作：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714799749135-405ec6ee-a69b-4de0-8a21-a571e01fdf2a.png#averageHue=%23313130&clientId=u0f66363c-4ce4-4&from=paste&height=111&id=u5cfe968a&originHeight=178&originWidth=1030&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=29493&status=done&style=none&taskId=u58f21b10-6f51-4a6a-8a38-a92f73270a0&title=&width=643.7499904073776)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714799771550-5bae1d08-3cdf-48ec-9347-df051e6ee4df.png#averageHue=%23161923&clientId=u0f66363c-4ce4-4&from=paste&height=420&id=u9869e88a&originHeight=672&originWidth=1046&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=21983&status=done&style=none&taskId=ue055d4da-abb5-4077-8807-7d87287aaf1&title=&width=653.749990258366)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714799826353-7326ef1b-1664-4724-a5e9-619bb4db0f13.png#averageHue=%231a2535&clientId=u0f66363c-4ce4-4&from=paste&height=202&id=u87390471&originHeight=324&originWidth=2816&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=49785&status=done&style=none&taskId=u6287c920-cb68-4e64-9942-fda29b73dc3&title=&width=1759.9999737739568)<br />用户可以通过界面直接编辑、删除或新增数据记录。<br />一般我更倾向使用如 MySQL Workbench，进行数据库操作。

## Schema 验证
`prisma validate` 命令用于检查 `schema.prisma` 文件中是否存在语法错误。<br />安装 Prisma 的 VSCode 插件后，可以在编辑器内直接看到 schema 文件的错误，类似于 ESLint 的功能。

## 文件格式化
`prisma format` 命令用于自动格式化 `schema.prisma` 文件，确保文件的风格一致性和可读性。<br />安装 Prisma 的 VSCode 插件，直接使用编辑器的格式化功能来格式化 schema 文件，提高开发效率。

## 版本信息
`prisma version` 命令用于显示 Prisma CLI 和 Prisma Client 的当前版本信息。这对于调试问题或确保使用的是最新功能非常有用。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714800099208-333e83c9-c8c6-412b-a76a-c4071e526861.png#averageHue=%232e2e2d&clientId=u0f66363c-4ce4-4&from=paste&height=301&id=ud1446b7c&originHeight=482&originWidth=2252&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=135692&status=done&style=none&taskId=u4b92f599-3b03-4879-994a-0a8b0d745c5&title=&width=1407.4999790266158)
