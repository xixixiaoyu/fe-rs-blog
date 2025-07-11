## TypeORM：传统的 ORM 框架
TypeORM 是一种传统的 ORM（对象关系映射）框架，它将数据库表映射为实体类（entity），将表之间的关联映射为实体类属性的关联。<br />完成实体类和表的映射后，通过调用 userRepository 和 postRepository 的 API（如 find、delete、save 等），<br />TypeORM 会自动生成对应的 SQL 语句并执行。这就是对象关系映射的概念，即将对象和关系型数据库之间进行映射。

## Prisma：颠覆传统的 ORM
Prisma 与 TypeORM 不同，它没有实体类的概念。<br />相反，Prisma 创造了一种领域特定语言（DSL），类似这样：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696771144003-716a30f0-68cd-4473-946c-92c546fc4472.png#averageHue=%23302e2b&clientId=u3a69cd4b-fed9-4&from=paste&height=278&id=JIznE&originHeight=724&originWidth=1304&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=96814&status=done&style=none&taskId=u42c09042-1a78-43c8-8af8-5adc76f1cc7&title=&width=501.4444580078125)<br />将数据库表映射为 DSL 中的 model，然后编译这个 DSL 将生成 Prisma Client 的代码：<br />之后，可以调用 Prisma Client 的 API（如 find、delete、create 等）来进行 CRUD（创建、读取、更新、删除）操作。虽然 Prisma 使用了 DSL 的语法，但整个流程与 TypeORM 类似。

## 开始使用 Prisma
### 项目初始化
```bash
mkdir prisma-test
cd prisma-test
npm init -y
```
安装 TypeScript 相关的包，包括 TypeScript 编译器、ts-node 和 Node.js API 的类型声明：
```bash
npm install typescript ts-node @types/node -D
```
创建 tsconfig.json：
```bash
npx tsc --init
```
安装 prisma：
```bash
npm install prisma
```

### 编写代码
#### 编写 Schema
使用以下命令生成 schema 文件：
```bash
npx prisma init --datasource-provider mysql
```
项目目录下多了 schema 和 env 文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696770523023-d1332fa9-36ca-456f-b2a3-61fd1869bee5.png#averageHue=%23384147&clientId=u3a69cd4b-fed9-4&from=paste&height=221&id=ub17d5cef&originHeight=398&originWidth=478&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=36347&status=done&style=none&taskId=u140197de-efeb-40dc-9f5a-800ecf0d6a5&title=&width=265.55556259037553)<br />Schema 文件定义了数据模型（model）的结构。可以安装 Prisma 插件来获得语法高亮等支持：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696770595787-3db778d6-c4f2-4d1f-8f7c-7afb4e47b7b8.png#averageHue=%233c4349&clientId=u3a69cd4b-fed9-4&from=paste&height=114&id=u3412190f&originHeight=206&originWidth=774&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=24367&status=done&style=none&taskId=u19fdc2d2-ede9-4aaf-94f9-bd12c0eb4ec&title=&width=430.0000113911102)

#### 配置数据库连接信息
而 .env 文件里存储着连接信息：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696770626476-3a648ab1-16d5-4ef7-92a7-8d8446f4bb54.png#averageHue=%23333231&clientId=u3a69cd4b-fed9-4&from=paste&height=260&id=u69fc54fa&originHeight=468&originWidth=1870&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=113729&status=done&style=none&taskId=u72d5b084-84df-4267-b481-7519528f286&title=&width=1038.8889164100465)<br />我们先去 mysql workbench 里创建个数据库：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696770709382-fd60b0e1-c973-4c6b-bdc5-5185dc93bea7.png#averageHue=%232c2f2c&clientId=u3a69cd4b-fed9-4&from=paste&height=162&id=u3b2eb1b5&originHeight=292&originWidth=1484&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=99958&status=done&style=none&taskId=uc1d1f91f-69d9-4fe3-a07f-8ab4fb32697&title=&width=824.4444662847642)<br />指定字符集为 utf8mb4，这个支持的字符集是最全的。<br />或者执行这个 sql：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696770861492-4f23fde4-7979-4663-bc85-4c4fe8c9cda8.png#averageHue=%233d3830&clientId=u3a69cd4b-fed9-4&from=paste&height=379&id=u95f59e88&originHeight=682&originWidth=1694&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=221163&status=done&style=none&taskId=u5d494388-241e-447a-a60d-fcdee1ee207&title=&width=941.1111360420422)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696770886543-13782a00-f3d9-4324-bfa4-06846e0878eb.png#averageHue=%23373736&clientId=u3a69cd4b-fed9-4&from=paste&height=131&id=u2db0374a&originHeight=236&originWidth=336&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=34331&status=done&style=none&taskId=ubc7d23cd-4f5d-4724-a9b2-8146b105ea7&title=&width=186.66667161164474)<br />创建完 database 后，我们改下连接信息：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696770992018-eedb8199-ac92-474c-9c7c-529dfcff704c.png#averageHue=%23333130&clientId=u3a69cd4b-fed9-4&from=paste&height=276&id=u2cc47529&originHeight=496&originWidth=1354&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=92863&status=done&style=none&taskId=ue1ca7bfe-9493-4dca-a134-0a86298780d&title=&width=752.2222421493065)

#### 定义 Model
在 schema 文件中定义数据模型（model），例如：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1696771089411-0f550646-87e6-4de7-8353-95e69cd2129b.png#averageHue=%232f2d2b&clientId=u3a69cd4b-fed9-4&from=paste&height=448&id=ua7ddadf4&originHeight=1282&originWidth=1562&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=171285&status=done&style=none&taskId=ubc2edf73-b2bc-4428-98a0-4e261e2be14&title=&width=545.3281860351562)
```typescript
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  name     String?
  posts    Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
```
@id 是主键<br />@default(autoincrement()) 是指定默认值是自增的数字<br />@unique 是添加唯一约束<br />@relation 是指定多对一的关联关系，通过 authorId 关联 User 的 id

#### 生成 Prisma Client 代码
```bash
npx prisma migrate dev
```
会根据 schema 文件生成 sql 并执行：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714738491656-c4dc3be4-7431-4ff9-aeab-7180d74d779f.png#averageHue=%232b2b2a&clientId=u671c8770-2d02-4&from=paste&height=286&id=u1672db1b&originHeight=558&originWidth=1320&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=93345&status=done&style=none&taskId=u16a63777-3c2a-40df-aecc-06ef1f3dda7&title=&width=676)<br />也可以通过 `npx prisma migrate dev --name test` 指定名字。<br />还会在 node_modules 下也生成了 client 代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714739489547-8ab7e2c3-9b6d-414a-b13d-eb0b122e682e.png#averageHue=%23292827&clientId=uecd84a7a-6769-4&from=paste&height=437&id=u80d237bb&originHeight=700&originWidth=650&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=67318&status=done&style=none&taskId=u085b972b-bd74-46c7-9f68-6f90e1bccd2&title=&width=406.2499939464034)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714738565735-4d50a862-582d-4354-a126-19140ec6385c.png#averageHue=%2331312f&clientId=u671c8770-2d02-4&from=paste&height=109&id=u3d4a382f&originHeight=174&originWidth=398&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=19928&status=done&style=none&taskId=u3785a96b-c76f-4901-9380-5baa4f83e7e&title=&width=248.7499962933362)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714738580937-bf6dc884-e13f-454f-8847-65ac58f3db99.png#averageHue=%23262525&clientId=u671c8770-2d02-4&from=paste&height=716&id=u8272877a&originHeight=1146&originWidth=1852&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=218168&status=done&style=none&taskId=uc3998553-33e7-430e-8c59-a315b3b0a71&title=&width=1157.4999827519061)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714738654076-445799ce-7499-4e96-b866-60a813dc3dee.png#averageHue=%23343433&clientId=u671c8770-2d02-4&from=paste&height=147&id=uadadbe5e&originHeight=236&originWidth=374&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=34466&status=done&style=none&taskId=ub4e78db7-85c3-4d1d-bb21-209e15de551&title=&width=233.74999651685363)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714739298350-aa691a82-7773-4f85-83ee-be0dc89ee735.png#averageHue=%234d4e4d&clientId=uecd84a7a-6769-4&from=paste&height=240&id=ub234d7d2&originHeight=384&originWidth=1722&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=91706&status=done&style=none&taskId=uc0763537-5019-4e2d-832f-13b54594dc6&title=&width=1076.2499839626255)


#### 编写应用代码
在 src/index.ts 中编写应用代码，例如：
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser() {
	await prisma.user.create({
		data: {
			name: '云牧',
			email: 'xx@xx.com',
		},
	});

	await prisma.user.create({
		data: {
			name: '黛玉',
			email: 'xxx@xxx.com',
		},
	});

	const users = await prisma.user.findMany();
	console.log(users);
}

createUser();
```

### 运行代码
```bash
npx ts-node ./src/index.ts
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714738779957-78bd6ae7-32f1-4ac7-b533-7c9bb82b38cb.png#averageHue=%232c2c2b&clientId=u671c8770-2d02-4&from=paste&height=106&id=u2feaabcd&originHeight=170&originWidth=1032&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=27311&status=done&style=none&taskId=u7311a662-9f19-4ca2-a35e-21e21cec2b7&title=&width=644.9999903887511)<br />user 表确实插入了 2 条记录：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714739578147-65cffbbd-2330-42e5-905f-5f86f395271d.png#averageHue=%23cccdcc&clientId=uecd84a7a-6769-4&from=paste&height=79&id=u84e0e414&originHeight=126&originWidth=360&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=17173&status=done&style=none&taskId=uaac2cf5a-ef20-49e9-8ded-5fcae1aa557&title=&width=224.9999966472388)


## CRUD 全流程
我们再来插入一个新的 user 和它的两个 post：
```typescript
import { PrismaClient } from '@prisma/client';

// 初始化 Prisma 客户端实例，并配置日志选项以输出查询日志到标准输出
const prisma = new PrismaClient({
	log: [
		{
			emit: 'stdout',
			level: 'query', // 设置日志级别为查询（query），这样只有查询语句会被记录
		},
	],
});

async function test() {
	const user = await prisma.user.create({
		data: {
			name: '云牧-牧云',
			email: 'ss@ss.com',
			// 在创建用户的同时创建关联的文章
			posts: {
				create: [
					{
						title: '文章1',
						content: '内容1',
					},
					{
						title: '文章2',
						content: '内容2',
					},
				],
			},
		},
	});
	console.log(user);
}

test();
```
执行：
```bash
npx ts-node ./src/index.ts
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714740024741-753d8dde-31c9-44c8-93c5-f5d49a53cf08.png#averageHue=%232f2f2e&clientId=uecd84a7a-6769-4&from=paste&height=159&id=u92f065bd&originHeight=254&originWidth=2080&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=82621&status=done&style=none&taskId=uc8f3fa44-210e-400d-b478-b6b6eeb3308&title=&width=1299.9999806284907)<br />可以看到被事务包裹的三条 insert 语句。<br />看下数据库：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714740068339-fa838ebb-7594-4868-a66b-ff9931a4c756.png#averageHue=%23272725&clientId=uecd84a7a-6769-4&from=paste&height=295&id=u10f890fc&originHeight=472&originWidth=626&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=71595&status=done&style=none&taskId=ub23dc688-ca13-4f2e-8588-e44f20c5a04&title=&width=391.2499941699208)![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714740082552-b2a89ae8-30a6-4392-a84e-e6abefc43a38.png#averageHue=%23252523&clientId=uecd84a7a-6769-4&from=paste&height=280&id=uca34b8a5&originHeight=448&originWidth=620&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=63307&status=done&style=none&taskId=u5b998bec-5cdb-462b-b150-260453cf25b&title=&width=387.49999422580015)

更新：
```typescript
async function test() {
	await prisma.post.update({
		where: {
			id: 2,
		},
		data: {
			content: '修改后的内容',
		},
	});
}

test();
```
执行 `npx ts-node ./src/index.ts`：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714740227265-ef977dc3-4f80-49cc-ad3e-79c2a6046ab7.png#averageHue=%23272724&clientId=uecd84a7a-6769-4&from=paste&height=277&id=u7209e2eb&originHeight=444&originWidth=600&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=65952&status=done&style=none&taskId=ucf5fed0a-2d90-40d4-96ab-85bbff23fd9&title=&width=374.9999944120646)<br />修改成功。

删除：
```typescript
async function test() {
	await prisma.post.delete({
		where: {
			id: 2,
		},
	});
}
test();
```
执行 `npx ts-node ./src/index.ts`：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714740295247-5fedec42-9a6d-482c-a142-348092d19459.png#averageHue=%23232321&clientId=uecd84a7a-6769-4&from=paste&height=259&id=u15535ad4&originHeight=414&originWidth=610&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=53898&status=done&style=none&taskId=ue295a715-e94f-4638-aa4e-a3e3b0caa45&title=&width=381.24999431893235)<br />删除成功。
