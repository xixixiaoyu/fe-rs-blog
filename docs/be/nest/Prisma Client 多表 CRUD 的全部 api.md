## 项目设置
首先，创建并初始化一个新的 Node.js 项目，设置如下：
```bash
# 创建项目目录
mkdir prisma-more-client-api
cd prisma-more-client-api

# 初始化 Node.js 项目
npm init -y

# 初始化 Prisma
npx prisma init
```
此操作将生成 `.env` 和 `schema.prisma` 文件。接下来，修改 `.env` 文件中的数据库连接信息：
```bash
DATABASE_URL="mysql://root:自己的密码@localhost:3306/prisma_test"
```

## 数据模型定义
在 `schema.prisma` 文件中，配置数据源和 Prisma 客户端，并定义相关的数据模型：
```bash
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Department {
  id         Int        @id @default(autoincrement())
  name       String     @db.VarChar(20)
  createTime DateTime   @default(now())
  updateTime DateTime   @updatedAt
  employees  Employee[]
}

model Employee {
  id           Int        @id @default(autoincrement())
  name         String     @db.VarChar(20)
  phone        String     @db.VarChar(30)
  departmentId Int
  department   Department @relation(fields: [departmentId], references: [id])
}
```
执行数据库迁移：
```bash
npx prisma migrate reset
npx prisma migrate dev --name init_migration
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714813591057-4762e269-81b4-4e2c-98fa-447244aae22d.png#averageHue=%23dbd9d6&clientId=u892dac20-1036-4&from=paste&height=152&id=ubd98b414&originHeight=244&originWidth=396&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=37256&status=done&style=none&taskId=u04720814-1978-44f5-a9b7-3a438e9345c&title=&width=247.49999631196266)

## CRUD 操作
### 安装依赖和配置 TypeScript
```bash
npm install typescript ts-node @types/node -D
npx tsc --init
```
在 `tsconfig.json` 中保留以下配置：
```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "types": ["node"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### 实现 CRUD 操作
在 `src/index.ts` 文件中，实现各种 CRUD 操作：

#### 插入数据
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

async function test() {
	await prisma.department.create({
		data: {
			name: '技术部',
			employees: {
				create: [
					{
						name: '小张',
						phone: '111',
					},
					{
						name: '小李',
						phone: '222',
					},
				],
			},
		},
	});
}

test();
```
运行 `npx ts-node ./src/index.ts` 后：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714813783372-cf05d630-1013-4f86-bfd5-b35e66653600.png#averageHue=%23f6f6f3&clientId=u892dac20-1036-4&from=paste&height=265&id=u98b2682a&originHeight=440&originWidth=702&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=64232&status=done&style=none&taskId=ufccea4a6-b3d4-4f56-988d-61b8bec127f&title=&width=422.75)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714813798114-fd3c1a42-f52f-4cf7-865c-3cf569e8ec8f.png#averageHue=%23f1f0f0&clientId=u892dac20-1036-4&from=paste&height=226&id=u4c009243&originHeight=414&originWidth=736&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=64792&status=done&style=none&taskId=u0c4a9162-0095-4600-9c8b-7280fbbea1d&title=&width=401)

#### 查询数据
```typescript
async function queryDepartmentWithEmployees() {
	const department = await prisma.department.findUnique({
		where: { id: 1 },
		include: { employees: true },
	});
	console.log(department);
}

queryDepartmentWithEmployees();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714813916569-a41df501-99fe-40c5-a835-38217326c6d2.png#averageHue=%232c2c2b&clientId=u892dac20-1036-4&from=paste&height=304&id=ub8a7f91f&originHeight=486&originWidth=2174&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=103021&status=done&style=none&taskId=u43f2c3a1-0132-45b7-8074-5ba6c38526e&title=&width=1358.7499797530475)

#### 更新数据
```typescript
async function updateDepartmentAndAddEmployee() {
	const updatedDepartment = await prisma.department.update({
		where: { id: 1 },
		data: {
			name: '销售部',
			//  在 employees 关联字段进行操作
			employees: {
				//  创建一个新员工，姓名为 '小刘'，电话为 '333'
				create: [{ name: '小刘', phone: '333' }],
				// 关联一个 id 为 2 的已存在员工
				connect: [{ id: 2 }],
			},
		},
	});
	console.log(updatedDepartment);
}

updateDepartmentAndAddEmployee();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714814173568-2c1d6dd4-0455-4f0f-9bda-6d9b40fbcd98.png#averageHue=%232e2e2d&clientId=u892dac20-1036-4&from=paste&height=326&id=uaa2d718e&originHeight=522&originWidth=2170&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=138426&status=done&style=none&taskId=ufb5d31c2-1c9f-4209-9854-80791abcc96&title=&width=1356.2499797903004)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714814242103-735f654d-f3aa-414e-b462-81bb4e0ccef2.png#averageHue=%23f1f1f0&clientId=u892dac20-1036-4&from=paste&height=257&id=uc3344754&originHeight=412&originWidth=756&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=87694&status=done&style=none&taskId=u43e3ed68-bc14-4653-adc2-618b2c6ee56&title=&width=472.49999295920145)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714814203768-a3d96c72-15a0-42f3-97d1-deb56ed3e366.png#averageHue=%23f3f3f2&clientId=u892dac20-1036-4&from=paste&height=297&id=u64245671&originHeight=476&originWidth=690&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=63516&status=done&style=none&taskId=u2990b28d-ee82-49bb-b4b6-8b11f735744&title=&width=431.24999357387435)

### 删除数据
```typescript
async function deleteEmployeesOfDepartment() {
	const res = await prisma.employee.deleteMany({
		where: {
			department: { id: 1 },
		},
	});

	console.log(res);
}

deleteEmployeesOfDepartment();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714814366388-208ad071-57fc-4af0-a825-0eb68524b360.png#averageHue=%23323130&clientId=u892dac20-1036-4&from=paste&height=82&id=udee884c3&originHeight=132&originWidth=2176&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=40397&status=done&style=none&taskId=u7283e93a-c5c2-4afb-b99c-96ee3fb3bfc&title=&width=1359.999979734421)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714814389362-2c94b822-637c-4f09-899a-a900ebe91ef8.png#averageHue=%23f2f2f1&clientId=u892dac20-1036-4&from=paste&height=256&id=ud9714bf6&originHeight=410&originWidth=668&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=51452&status=done&style=none&taskId=ud3d01739-e6fa-4429-8351-747207e2bee&title=&width=417.4999937787653)


## 执行直接 SQL
在特定情况下，直接执行 SQL 可能更为直接有效：
```typescript
async function executeRawSQL() {
	// 使用 Prisma 的 $executeRaw 方法来执行一个原生 SQL 命令，清空 Department 表
	await prisma.$executeRaw`DELETE FROM Department`;

	// 使用 Prisma 的 $queryRaw 方法执行一个查询 SQL 命令，这里是从 Department 表中选取所有记录
	const departments = await prisma.$queryRaw`SELECT * FROM Department`;

	console.log(departments);
}

executeRawSQL();
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714815216428-e731a288-57e9-4cde-92e4-b802b1ef52da.png#averageHue=%2330302f&clientId=u892dac20-1036-4&from=paste&height=82&id=ue761c636&originHeight=132&originWidth=1222&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=28838&status=done&style=none&taskId=u15ebb4c0-39b8-4a69-8072-423e489e527&title=&width=763.7499886192383)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714815293080-62f40071-b5ac-4343-9624-d7a1e141228a.png#averageHue=%23f2f2f1&clientId=u3032c89c-16dc-4&from=paste&height=261&id=u69d471f3&originHeight=418&originWidth=720&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=52869&status=done&style=none&taskId=u5e7922c1-145d-473b-a4c0-4c0ae1a86ec&title=&width=449.9999932944776)
