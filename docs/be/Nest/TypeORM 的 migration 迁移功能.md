## TypeORM 简介与环境配置
TypeORM 是一个基于 TypeScript 的 ORM 框架，支持使用 TypeScript 或 JavaScript 进行数据库操作。<br />它提供了一个高级的接口来操作数据库，使得数据库操作更加简洁和高效。

### 环境搭建步骤
#### 创建 TypeORM 项目
```bash
npx typeorm@latest init --name typeorm-migration --database mysql
cd typeorm-migration
```

#### 安装 MySQL2
```bash
npm install mysql2
```

#### 配置数据源（data-source.ts）
```typescript
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'xxx',
	database: 'migration-test',
	synchronize: true,
	logging: true,
	entities: [User],
	migrations: [],
	subscribers: [],
	poolSize: 10,
	connectorPackage: 'mysql2',
	extra: {
		authPlugin: 'sha256_password',
	},
});
```

#### 创建数据库
可以使用 MySQL Workbenc：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714215666560-9ec034d4-9bfb-4963-92c4-b6fd887d085e.png#averageHue=%23373737&clientId=ue637fccf-c552-4&from=paste&height=532&id=u10d0f311&originHeight=1064&originWidth=1768&originalType=binary&ratio=2&rotation=0&showTitle=false&size=213337&status=done&style=none&taskId=u96c5a290-2659-4127-8a5e-7c554d9611f&title=&width=884)<br />也可以执行 sql 命令：
```bash
CREATE SCHEMA `migration-test` DEFAULT CHARACTER SET utf8mb4 ;
```

#### 运行项目
```bash
npm run start
```
生成对应的表并插入了数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714215791842-aeb577b9-5632-4df3-9a90-46d7f959294b.png#averageHue=%23363635&clientId=ue637fccf-c552-4&from=paste&height=144&id=ucdc7f10d&originHeight=288&originWidth=1188&originalType=binary&ratio=2&rotation=0&showTitle=false&size=80787&status=done&style=none&taskId=ud346201e-a274-4666-b1a4-81b8a4cc966&title=&width=594)<br />因为代码默认 save 了一条数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714215915743-15df5e38-52f4-4e01-a2f0-6455f5f52c6d.png#averageHue=%23272524&clientId=ue637fccf-c552-4&from=paste&height=419&id=ueaf9e48e&originHeight=1080&originWidth=1808&originalType=binary&ratio=2&rotation=0&showTitle=false&size=232947&status=done&style=none&taskId=u78edf829-034f-4b78-a871-919fbfbd289&title=&width=702)

## 开发环境与生产环境的差异
在开发环境中，使用 synchronize 功能可以在修改代码后，自动创建和修改表结构，极大地方便了开发。<br />然而，在生产环境中，这种做法可能会导致数据丢失，因此不推荐使用。

## 迁移（Migration）的使用
迁移允许你以编程方式管理数据库的变更，每次变更都会被记录，可以随时撤销。

### 创建和执行迁移的步骤：
#### 创建迁移文件
使用命令 `npx typeorm-ts-node-esm migration:create ./src/migration/first` 创建一个新的迁移文件。<br />生成了 时间戳-first 的 ts 文件：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714216015135-06e6b047-9bd7-4a22-9673-e4dbce0c785d.png#averageHue=%23252423&clientId=ue637fccf-c552-4&from=paste&height=308&id=u48dbbe8a&originHeight=616&originWidth=1464&originalType=binary&ratio=2&rotation=0&showTitle=false&size=110331&status=done&style=none&taskId=u0a506970-58bd-44a3-9210-6cc8b96f2ed&title=&width=732)

#### 编写迁移逻辑
在上面生成的迁移文件中，可以使用 SQL 语句编写创建或修改表的逻辑。

#### 执行迁移
使用命令 `npx typeorm-ts-node-esm migration:run -d ./src/data-source.ts` 执行迁移，应用数据库变更。

#### 生成迁移文件
我们修改下实体：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714216155169-d806e72c-b2ba-4c9d-83a6-e2dbd4628a4b.png#averageHue=%23242322&clientId=ue637fccf-c552-4&from=paste&height=434&id=CgkcF&originHeight=868&originWidth=1480&originalType=binary&ratio=2&rotation=0&showTitle=false&size=101332&status=done&style=none&taskId=u51974d88-59a7-4a4a-988f-e572bac4c3e&title=&width=740)<br />这时实体已经发生变化，可以使用 `npx typeorm-ts-node-esm migration:generate ./src/migration/first -d ./src/data-source.ts` 命令自动生成迁移文件，简化迁移流程。<br />生成的文件如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714217766579-4ea6255b-b1df-490b-983a-73bbaa18afd3.png#averageHue=%23262524&clientId=u02bf9c96-5e9b-4&from=paste&height=387&id=u793cc9b5&originHeight=774&originWidth=1818&originalType=binary&ratio=2&rotation=0&showTitle=false&size=176398&status=done&style=none&taskId=ub07001da-c3d3-47b8-ad11-a7fccf55d48&title=&width=909)<br />把 synchronize 关掉，用 migration 来手动建表：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714217055145-c2254976-0fd3-4f23-aae3-2af216ba9c31.png#averageHue=%23272423&clientId=ue637fccf-c552-4&from=paste&height=464&id=u3569edfa&originHeight=928&originWidth=952&originalType=binary&ratio=2&rotation=0&showTitle=false&size=123568&status=done&style=none&taskId=ub95044e7-9b7d-47c8-8590-42925959fd6&title=&width=476)<br />`npx typeorm-ts-node-esm migration:run -d ./src/data-source.ts` 执行下迁移后：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714218042678-068903d8-a43c-42b0-825a-c94b06f1eb26.png#averageHue=%23323130&clientId=uf06babd4-739c-4&from=paste&height=221&id=u58bc45a6&originHeight=442&originWidth=2128&originalType=binary&ratio=2&rotation=0&showTitle=false&size=707065&status=done&style=none&taskId=ueadef3d2-7b54-4b39-b733-e28758ca54a&title=&width=1064)<br />确实没有 age 字段了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714217671342-903d1026-1e2a-4265-ba9b-d8556fd21569.png#averageHue=%23212220&clientId=u02bf9c96-5e9b-4&from=paste&height=243&id=ue5a58201&originHeight=486&originWidth=682&originalType=binary&ratio=2&rotation=0&showTitle=false&size=57180&status=done&style=none&taskId=u3a0735fa-1763-44bb-8743-28e741d87c7&title=&width=341)

### 撤销迁移
使用命令 `npx typeorm-ts-node-esm migration:revert -d ./src/data-source.ts` 撤销上一次的迁移操作。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714217744456-4ce72df6-2b70-43a8-96e5-1c9937bc23fc.png#averageHue=%23333230&clientId=u02bf9c96-5e9b-4&from=paste&height=223&id=u1891cf15&originHeight=446&originWidth=2196&originalType=binary&ratio=2&rotation=0&showTitle=false&size=158362&status=done&style=none&taskId=ue1bc82e5-28df-4ad6-a01a-8be0f10121e&title=&width=1098)<br />看看数据库：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714217811883-b35749d2-f813-4897-bf65-1e1a23fc590b.png#averageHue=%231e1e1d&clientId=u02bf9c96-5e9b-4&from=paste&height=226&id=u82c3a4d7&originHeight=452&originWidth=718&originalType=binary&ratio=2&rotation=0&showTitle=false&size=54268&status=done&style=none&taskId=ufaea7822-6fa2-4179-bfd9-ce96b6605d8&title=&width=359)<br />age 添加回来了。
