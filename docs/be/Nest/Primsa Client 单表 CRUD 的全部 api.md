## 环境搭建与项目初始化
### 创建新项目
创建项目目录并初始化：
```bash
mkdir prisma-client-api
cd prisma-client-api
npm init -y
```
初始化 Prisma：
```bash
npx prisma init
```

### 配置数据库连接
修改 `.env` 文件中的数据库连接信息：
```bash
DATABASE_URL="mysql://root:自己的密码@localhost:3306/prisma_test"
```
在 `schema.prisma` 文件中设置数据源和模型：
```bash
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Test {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### 安装依赖和设置文档生成器
安装文档生成器：
```bash
npm install prisma-docs-generator -D
```
添加文档生成器配置到 `schema.prisma`：
```bash
generator docs {
  provider = "node node_modules/prisma-docs-generator"
  output   = "../generated/docs"
}
```
重置数据库并创建迁移：
```bash
npx prisma migrate reset
npx prisma migrate dev --name test
```

### 初始化 TypeScript 环境
安装 TypeScript 相关包：
```bash
npm install typescript ts-node @types/node -D
```
初始化 `tsconfig.json`：
```bash
npx tsc --init
```
在 `package.json` 中配置 `seed` 命令：
```bash
"prisma": {
  "seed": "npx ts-node prisma/seed.ts"
}
```
生成并查看 API 文档：
```bash
npx http-server ./generated/docs
```
访问 `http://localhost:8080` 查看生成的文档。

## 数据初始化
填充初始数据 (prisma/seed.ts)：
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
	log: [
		{
			emit: 'stdout',
			level: 'query',
		},
	],
});

async function main() {
	await prisma.test.createMany({
		data: [
			{ name: '云牧', email: 'yyy@yyy.com' },
			{ name: '黛玉', email: 'ddd@ddd.com' },
			{ name: '惜春', email: 'd@d.com' },
		],
	});
	console.log('done');
}

main();
```
执行数据填充：
```typescript
npx prisma db seed
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714810724866-c14b4559-78fc-48b3-a5db-c4e6d8a3c8e0.png#averageHue=%23f3f3f3&clientId=u66d44343-e1ef-4&from=paste&height=295&id=u9fa3aa6a&originHeight=472&originWidth=614&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=65573&status=done&style=none&taskId=uac37bdfa-b8b0-40d6-a609-ba2b419cd31&title=&width=383.74999428167945)

## CRUD 操作 (src/index.ts)
### 查找操作
#### findUnique
findUnique 方法用于查找具有唯一标识的记录。例如，根据主键或具有唯一索引的列：
```typescript
// src/index.ts
async function test1() {
    const userById = await prisma.aaa.findUnique({
        where: { id: 1 }
    });
    console.log(userById);

    const userByEmail = await prisma.aaa.findUnique({
        where: { email: 'bbb@xx.com' },
        select: { id: true, email: true }
    });
    console.log(userByEmail);
}

test1();
```
运行：
```bash
npx ts-node ./src/index.ts
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714810400032-e1e3be3d-1340-4d8f-9a7c-586386b0e697.png#averageHue=%23333231&clientId=u66d44343-e1ef-4&from=paste&height=61&id=u1cff9d61&originHeight=98&originWidth=1130&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=24607&status=done&style=none&taskId=ufcb9b641-483b-40ca-a8f1-6057782c046&title=&width=706.249989476055)

#### **findUniqueOrThrow**
类似于 findUnique，但如果未找到记录，则抛出异常。

#### findMany
findMany 方法用于查询多条记录。支持排序、分页和条件过滤：
```typescript
async function test() {
	const users = await prisma.test.findMany({
		where: { email: { contains: 'd' } },
		orderBy: { name: 'desc' },
		skip: 0,
		take: 3,
		select: { id: true, email: true },
	});
	console.log(users);
}

test();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714810633180-b2487ed8-b06f-4941-bd17-bd77eb3aadcb.png#averageHue=%23373635&clientId=u66d44343-e1ef-4&from=paste&height=47&id=u41b3436e&originHeight=76&originWidth=1130&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=17567&status=done&style=none&taskId=u06891368-5296-4463-a83b-fc6a55fb0dc&title=&width=706.249989476055)

#### findFirst
findFirst 方法返回符合条件的第一条记录。它的使用方法与 findMany 类似，但只返回一个结果。

### 创建和更新操作
#### create
用于创建新记录。可以通过 select 选择返回特定字段：
```typescript
async function test() {
	const newUser = await prisma.test.create({
		data: { name: '宝钗', email: 'bbb@bbb.com' },
		select: { email: true },
	});

	// 由于上面select限制，这里只包含email字段
	console.log(newUser);
}

test();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714810901010-7e49d6b9-bb38-483a-bcd7-f420170d6b3e.png#averageHue=%23333231&clientId=u66d44343-e1ef-4&from=paste&height=46&id=uc1e297cd&originHeight=74&originWidth=1136&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=15205&status=done&style=none&taskId=u49266c44-c985-479d-9605-754a825d01b&title=&width=709.9999894201757)

#### update
更新单条记录。需要指定 where 条件和 data 更新内容：
```typescript
async function test() {
	const updatedUser = await prisma.test.update({
		where: { id: 3 },
		data: { email: 'xichun@xichun.com' },
		select: { id: true, email: true },
	});

	console.log(updatedUser);
}

test();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714811112045-bdca7e87-5a1a-457f-b6be-470910846c08.png#averageHue=%23373635&clientId=u66d44343-e1ef-4&from=paste&height=40&id=u2c04db75&originHeight=64&originWidth=1134&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=17029&status=done&style=none&taskId=u74b089f1-3015-4ce4-8cbf-abcbd5ee380&title=&width=708.7499894388021)

#### updateMany
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714811194787-d92708fa-56dc-4aac-a355-5504ecae20ac.png#averageHue=%23f5f5f1&clientId=u66d44343-e1ef-4&from=paste&height=315&id=ubd7df7bc&originHeight=504&originWidth=614&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=91125&status=done&style=none&taskId=u9384ee59-15a7-4671-88a2-64e7d08953e&title=&width=383.74999428167945)<br />用于更新多条记录，不返回具体的更新记录：
```typescript
async function test() {
	const updateResult = await prisma.test.updateMany({
		where: { email: { contains: 'com' } },
		data: { name: '红楼梦' },
	});
	console.log(updateResult);
}

test();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714811331470-bc9859f8-782c-4b30-b798-acbc70f776d6.png#averageHue=%23f3f3f0&clientId=u66d44343-e1ef-4&from=paste&height=314&id=u1cca985f&originHeight=502&originWidth=614&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=83790&status=done&style=none&taskId=ubee128f1-8e27-4d1f-971d-19f9aca809f&title=&width=383.74999428167945)

#### Upsert
upsert 方法结合了更新（update）和插入（insert）的功能。<br />根据指定条件，该方法会判断是更新现有记录还是创建新记录。
```typescript
async function test() {
	const res = await prisma.test.upsert({
		where: { id: 4 },
		update: { email: 'xifeng@xifeng.com' },
		create: {
			id: 4,
			name: '王熙凤',
			email: 'www@www.com',
		},
	});
	console.log(res);
}

test();
```

- 第一次执行时，若找不到 id 为 4 的记录，则执行插入操作。
- 第二次执行时，若记录已存在，则进行更新。

### 删除操作
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714811719086-9b96ab7c-bd27-46c4-8e5f-d00591580b9c.png#averageHue=%23f3f2ef&clientId=u66d44343-e1ef-4&from=paste&height=336&id=u1a891100&originHeight=538&originWidth=600&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=98684&status=done&style=none&taskId=ua419120d-d650-4f16-bf1b-22e6979685e&title=&width=374.9999944120646)<br />delete 和 deleteMany 方法用于删除单个或多个记录。
```typescript
async function test() {
	await prisma.test.delete({
		where: { id: 1 },
	});

	await prisma.test.deleteMany({
		where: {
			id: {
				in: [2, 3, 4],
			},
		},
	});
}

test();
```
执行后只有 id 为 7 的记录了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714811775634-28776531-f1fe-4fb6-89c4-04f2bb5794ed.png#averageHue=%23f2f2f2&clientId=u66d44343-e1ef-4&from=paste&height=259&id=u4260505b&originHeight=414&originWidth=614&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=51643&status=done&style=none&taskId=ucce0719e-6b39-4054-a11a-1b92b833dfd&title=&width=383.74999428167945)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714811844671-a0068c39-5ccf-40e4-8c04-dee241bf1d69.png#averageHue=%23333331&clientId=u66d44343-e1ef-4&from=paste&height=37&id=u1f64907a&originHeight=60&originWidth=1138&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=10336&status=done&style=none&taskId=u16a2ebfc-7c9f-4ea6-9c67-d56503f5674&title=&width=711.2499894015492)
### 统计记录数量
count 方法用于统计符合特定条件的记录数：
```typescript
async function test() {
	const count = await prisma.test.count({
		where: {
			email: {
				contains: 'b',
			},
		},
	});
	console.log(count);
}

test();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714811872669-e026edfb-d21f-4c02-bbd1-a5235579d378.png#averageHue=%23323130&clientId=u66d44343-e1ef-4&from=paste&height=41&id=u3f755eef&originHeight=66&originWidth=1138&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=10423&status=done&style=none&taskId=u9dff75c8-a0b2-43a3-9a97-92888e43d77&title=&width=711.2499894015492)

### 聚合查询
aggregate 方法用于执行复杂的聚合查询，如计数、平均值、最小值和最大值：<br />我们先插入些数据：<br />首先修改 model：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714812191782-1c777811-9e7a-472f-b808-9f9459b1283e.png#averageHue=%23242322&clientId=u66d44343-e1ef-4&from=paste&height=181&id=iYgdU&originHeight=290&originWidth=898&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=31913&status=done&style=none&taskId=u61e13f08-07a8-4763-bef2-a1b89d10465&title=&width=561.2499916367234)<br />重置数据库
```typescript
npx prisma migrate reset
```
prisma db push 后：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714812434780-b041e379-6008-4650-881f-01ab15e073f3.png#averageHue=%23f2f2f2&clientId=u66d44343-e1ef-4&from=paste&height=256&id=u9c586c1f&originHeight=410&originWidth=618&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=52484&status=done&style=none&taskId=u571c8035-434f-459b-8d02-1ab32b56d8d&title=&width=386.2499942444266)<br />然后执行插入数据逻辑；
```typescript
async function test() {
	const res = await prisma.test.createMany({
		data: [
			{
				name: 'n1',
				email: 'n1@n1.com',
				age: 10,
			},
			{
				name: 'n2',
				email: 'n2@n2.com',
				age: 12,
			},
			{
				name: 'n3',
				email: 'n3@n3.com',
				age: 14,
			},
		],
	});

	console.log(res);
}

test();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714812558102-58ab2c71-1325-468d-b652-9203f4bebca0.png#averageHue=%23363534&clientId=u66d44343-e1ef-4&from=paste&height=39&id=ucffd37e0&originHeight=62&originWidth=1136&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=13148&status=done&style=none&taskId=u65216892-5d4e-428b-a0bd-bab290eeaa6&title=&width=709.9999894201757)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714812576198-5fd2e19a-c4aa-440f-890e-d822383bd1ec.png#averageHue=%23f2f2f2&clientId=u66d44343-e1ef-4&from=paste&height=299&id=u271e5d13&originHeight=478&originWidth=610&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=65113&status=done&style=none&taskId=ud57c325d-4e45-4b16-9f7b-118d12eb727&title=&width=381.24999431893235)<br />聚合查询：
```typescript
async function test() {
	const res = await prisma.test.aggregate({
		where: {
			email: {
				contains: 'com',
			},
		},
		_count: {
			_all: true,
		},
		_max: {
			age: true,
		},
		_min: {
			age: true,
		},
		_avg: {
			age: true,
		},
	});
	console.log(res);
}

test();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714812631142-65a2afc8-0fa4-4b42-8f0d-d616aac3eac7.png#averageHue=%232a2a29&clientId=u66d44343-e1ef-4&from=paste&height=142&id=ue960353b&originHeight=228&originWidth=1134&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=28740&status=done&style=none&taskId=ubf7604a4-2800-4ded-9a81-2dd466c0061&title=&width=708.7499894388021)

### 分组聚合
groupBy 方法允许按指定字段进行分组，并对每个分组执行聚合操作：
```typescript
async function test() {
	const res = await prisma.test.groupBy({
		by: ['email'],
		_count: {
			_all: true,
		},
		_sum: {
			age: true,
		},
		having: {
			age: {
				_avg: {
					gt: 2,
				},
			},
		},
	});
	console.log(res);
}

test();
```
按 email 分组，并计算每个分组的年龄总和，只返回平均年龄大于 2 的分组。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714812892694-3cf22115-339d-4c57-bd83-d2583f6cff31.png#averageHue=%2330302e&clientId=u66d44343-e1ef-4&from=paste&height=125&id=u990ddb25&originHeight=200&originWidth=1132&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=39510&status=done&style=none&taskId=u9cacbe2f-f71d-4c21-ae73-c33f0dcb32e&title=&width=707.4999894574286)
