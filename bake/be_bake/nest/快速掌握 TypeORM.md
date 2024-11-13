## 介绍
TypeORM 是一个流行的 TypeScript 和 JavaScript ORM（对象关系映射）工具，它支持使用 MySQL、PostgreSQL、SQLite、Microsoft SQL Server、Oracle 以及 MongoDB 等多种数据库。<br />TypeORM 旨在提供一种有效的方式来管理数据库操作，并通过实体和数据库表之间的映射来简化数据层的开发。它可以在 Node.js 环境中运行，特别适合于使用 TypeScript 编写的应用程序。

## 初始化配置
新建一个 TypeORM 项目：
```bash
npx typeorm@latest init --name typeorm-test --database mysql
```
在 data-source.ts 改下用户名密码数据库，把连接 msyql 的驱动包改为 mysql2，并修改加密方式：
```typescript
// 支持装饰器的元数据反射功能
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

// 配置和管理数据库连接
export const AppDataSource = new DataSource({
	type: 'mysql', // 指定数据库类型为 MySQL
	host: 'localhost', // 数据库主机地址，这里设置为本地主机
	port: 3306, // MySQL 数据库的默认端口号
	username: 'root', // 数据库连接的用户名
	password: 'xxx', // 数据库连接的密码，这里应替换为实际密码
	database: 'typeorm_test', // 要连接的数据库名称
	synchronize: true, // 设置为 true 以允许 TypeORM 自动创建或更新数据库表结构
	logging: true, // 开启日志记录，以便于调试和监控数据库操作
	entities: [User], // 注册实体到当前数据源，这里只注册了 User 实体
	migrations: [], // 迁移文件的数组，这里为空表示没有迁移文件
	subscribers: [], // 订阅者文件的数组，这里为空表示没有订阅者文件
	poolSize: 10, // 连接池的大小，这里设置为 10
	connectorPackage: 'mysql2', // 指定连接器包为 'mysql2'，这是一个 MySQL 客户端库
	extra: {
		authPlugin: 'sha256_password', // 额外的数据库连接选项，这里指定使用 'sha256_password' 认证插件
	},
});
```
安装 mysql2：
```bash
npm install mysql2
```
在 mysql workbench 里创建个 database：
```sql
CREATE DATABASE `typeorm_test` DEFAULT CHARACTER SET utf8mb4;
```
初始化自带的 User Entity：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714466113879-bcfafaa5-2b8d-4c81-a9b4-7b751470d21b.png#averageHue=%23242221&clientId=u0e6161fd-f4d6-4&from=paste&height=260&id=Lkk0j&originHeight=588&originWidth=1048&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=63536&status=done&style=none&taskId=ua9c21dee-3ffb-4c1b-a3c0-75fabaa2210&title=&width=462.72723388671875)<br />这个 Entity 映射的主键为 INT 自增，name 是 VARCHAR(255)，age 是 INT。<br />启动项目：
```bash
npm run start
```
user 表有条数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709373688983-5aba0a81-1af5-4942-ab84-b324d2758c0e.png#averageHue=%23f3f3f3&clientId=u47cb1c1d-8127-4&from=paste&height=227&id=ub810443e&originHeight=454&originWidth=630&originalType=binary&ratio=2&rotation=0&showTitle=false&size=53020&status=done&style=none&taskId=u5746ee32-d98d-4041-bb19-1ffc1a4c260&title=&width=315)<br />在这里插入的：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1709373727842-579137d5-41ae-4a89-9333-f21e5206a910.png#averageHue=%232f2d2c&clientId=u47cb1c1d-8127-4&from=paste&height=239&id=u6d0a9479&originHeight=662&originWidth=1110&originalType=binary&ratio=2&rotation=0&showTitle=false&size=116015&status=done&style=none&taskId=uff2fdff4-8474-4168-9fac-4db3bfc7ebe&title=&width=401)


## Column 装饰器
如果我们想 numbe 类型映射 DOUBLE 呢？string 类型映射 TEXT （长文本）呢？<br />这时候就需要往 @Column 装饰器传入选项，常用的选项有这些：

1.  type：指定列的数据库类型。例如：`varchar`, `int`, `boolean`, `text` 等。如果不指定，TypeORM 会根据属性的数据类型自动推断。 
```typescript
@Column({ type: 'varchar' })
name: string;
```

2.  length：为某些列类型指定长度，常用于字符串类型。 
```typescript
@Column({ type: 'varchar', length: 150 })
name: string;
```

3.  nullable：标示该列是否可以存储 `null` 值，默认为 `false`。 
```typescript
@Column({ nullable: true })
nickname: string | null;
```

4.  default：为列指定一个默认值。 
```typescript
@Column({ default: 'new user' })
username: string;
```

5.  unique：确保列的值在整个表中是唯一的。 
```typescript
@Column({ unique: true })
email: string;
```

6.  primary：标示该列是否为表的主键。 
```typescript
@Column({ primary: true })
id: number;
```

7.  update：指定该列的值在使用实体保存时是否可以被更新，默认为 `true`。 
```typescript
@Column({ update: false })
createdAt: Date;
```

8.  select：指定在通过实体管理器或仓库API查询时，该列是否默认被选中，默认为 `true`。 
```typescript
@Column({ select: false })
password: string;
```

9.  precision 和 scale：用于 `decimal` 和 `numeric` 类型的列，指定小数点前的数字个数（精度）和小数点后的数字个数（刻度）。 
```typescript
@Column({ type: 'decimal', precision: 5, scale: 2 })
price: number;
```

10.  comment：为列添加注释。 
```typescript
@Column({ comment: '用户的名字' })
name: string;
```

11.  array：特定于 PostgreSQL，用于指定列是否为数组类型。 
```typescript
@Column({ type: 'int', array: true })
numbers: number[];
```
 

我们新增了一个 Test 实体：
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// 使用typeorm定义一个名为Test的数据库表
@Entity({
	name: 'Test', // 指定表名为Test
})
export class Test {
	// 使用PrimaryGeneratedColumn装饰器定义一个自动生成的主键列
	@PrimaryGeneratedColumn({
		comment: '这是id', // 为该列添加注释说明这是id
	})
	id: number; // 定义一个名为id的数字类型字段，作为主键

	// 使用Column装饰器定义一个普通列
	@Column({
		name: 'aa1', // 指定列名为aa1
		type: 'text', // 指定列类型为text
		comment: '这是a1', // 为该列添加注释说明这是a1
	})
	a1: string; // 定义一个名为a1的字符串类型字段

	// 使用Column装饰器定义一个具有特殊约束的列
	@Column({
		unique: true, // 该列值必须唯一
		nullable: false, // 该列不允许为空
		length: 10, // 该列的最大长度为10
		type: 'varchar', // 指定列类型为varchar
		default: '默认值', // 为该列设置默认值为“默认值”
	})
	b2: string; // 定义一个名为b2的字符串类型字段

	// 使用Column装饰器定义一个双精度浮点数列
	@Column({
		type: 'double', // 指定列类型为double
	})
	c3: number; // 定义一个名为c3的数字类型字段，存储双精度浮点数
}
```
然后在 DataSource 的 entities 里引入下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1715612549802-8e4a80ee-06d7-442b-aaea-2da0e8bd580b.png#averageHue=%23282624&clientId=u0b6e5625-2397-4&from=paste&height=132&id=uf26e7aa5&originHeight=238&originWidth=1362&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=100835&status=done&style=none&taskId=u68545742-e85a-430f-9f6a-ee6f4401ee8&title=&width=756.6666867114885)<br />重新 npm run start，生成了对应的表：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1715612345118-2efb4f4e-f76c-43fc-953c-eb5fbb6284d2.png#averageHue=%234a4b4a&clientId=u0b6e5625-2397-4&from=paste&height=501&id=ud776226b&originHeight=902&originWidth=1704&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=150293&status=done&style=none&taskId=u1991b943-7997-410f-80b5-754625066a7&title=&width=946.6666917447698)

## 增删改查
### 初始化与实体创建
创建 User 实体并保存到数据库：
```typescript
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

AppDataSource.initialize().then(async () => {
    const user = new User();
    user.firstName = "mu";
    user.lastName = "yun";
    user.age = 25;

    await AppDataSource.manager.save(user);
}).catch(error => console.log(error));
```

### 增加、修改记录
要向数据库中插入记录，可以使用 save 方法。如果未指定 id，则会创建新记录；如果指定了 id，则会更新对应的记录：
```typescript
const user = new User();
user.id = 1; // 指定 id 时，会更新 id 为 1 的记录
user.firstName = "yu";
user.lastName = "dai";
user.age = 25;

await AppDataSource.manager.save(user);
```
其实 EntityManager 有 update 和 insert 方法，分别是修改和插入的，但是它们不会先 select 查询一次。<br />而 save 方法会先查询一次数据库来确定是插入还是修改。

### 批量操作
批量插入：
```typescript
await AppDataSource.manager.save(User, [
    { firstName: 'n1', lastName: 'n1', age: 21 },
    { firstName: 'n2', lastName: 'n2', age: 22 },
    { firstName: 'n3', lastName: 'n3', age: 23 }
]);
```
批量修改：
```typescript
await AppDataSource.manager.save(User, [
    { id: 2, firstName: 'n4', lastName: 'n4', age: 21 },
    { id: 3, firstName: 'n5', lastName: 'n5', age: 22 },
    { id: 4, firstName: 'n6', lastName: 'n6', age: 23 }
]);
```

### 删除记录
删除操作可以使用 delete 方法，传入实体类和要删除的记录的 id 或 id 数组。<br />也可以使用 remove 方法，传入要删除的实体对象：
```typescript
await AppDataSource.manager.delete(User, 1); // 删除 id 为 1 的记录
await AppDataSource.manager.delete(User, [2, 3]); // 删除 id 为 2 和 3 的记录

const user = new User();
user.id = 1;
await AppDataSource.manager.remove(User, user); // 删除 user 实体对应的记录
```

### 查询记录
find（查询多条记录）：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714495997325-4d572e4a-b207-49c6-8199-1252106b6c1d.png#averageHue=%232d2c2b&clientId=ud11740e7-ace6-4&from=paste&height=408&id=u95b8f207&originHeight=910&originWidth=1488&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=314295&status=done&style=none&taskId=u37549820-a0fa-4078-8322-34fadbfe9d3&title=&width=666.6666870117188)<br />指定查询的 where 条件是 id 为 4-8，指定 select 的列为 firstName 和 age，然后 order 指定根据 age 升序排列。<br />不带第二个查询条件参数，就是查询所有用户。

findOne（查询单条记录）：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714495910242-a27c0921-2f1e-4953-9d4c-364962c95085.png#averageHue=%232d2c2b&clientId=ud11740e7-ace6-4&from=paste&height=501&id=uf6f92803&originHeight=902&originWidth=1532&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=304610&status=done&style=none&taskId=u94275abf-2dbb-42cc-a706-dc1b44da33e&title=&width=851.1111336578564)<br />指定查询的 where 条件是 id 为 4 ，指定 select 的列为 firstName 和 age，然后 order 指定根据 age 升序排列。

findBy（根据条件查询记录集合），比较适合简单查询场景：
```typescript
const usersByAge = await AppDataSource.manager.findBy(User, { age: 23 }); // 查询年龄为 23 的用户
```

findAndCount 获取记录及其数量：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714495823043-9dbdfe4e-808b-4ef4-9340-256ce157c58a.png#averageHue=%232e2d2b&clientId=ud11740e7-ace6-4&from=paste&height=234&id=u9f5d6db5&originHeight=422&originWidth=1768&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=234546&status=done&style=none&taskId=uf84bc3ed-9284-4559-aa65-4268deee3ad&title=&width=982.2222482422259)

findOneOrFail 或者 findOneByOrFail 方法在未找到记录时抛出异常：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714495141037-8fac087f-b371-4903-b8af-e08c10ac9316.png#averageHue=%232d2c2b&clientId=u1c56d63e-770f-4&from=paste&height=357&id=ue6b969a2&originHeight=800&originWidth=1622&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=321633&status=done&style=none&taskId=ubc295df2-28c5-4d58-90d6-4ea4c3cb021&title=&width=723.1111450195312)

### 直接执行 SQL 语句
如果需要执行复杂的 SQL 语句，例如多个 Entity 的关联查询，可以使用 query 方法或 createQueryBuilder 方法：
```typescript
const users = await AppDataSource.manager.query('SELECT * FROM user WHERE age IN (?, ?)', [21, 22]);

const queryBuilder = AppDataSource.manager.createQueryBuilder();
const user = await queryBuilder
    .select("user")
    .from(User, "user")
    .where("user.age = :age", { age: 21 })
    .getOne();
```

### 事务处理
在处理关联数据的增删改时，可以使用 transaction 方法确保操作的原子性：
```typescript
await AppDataSource.manager.transaction(async manager => {
    await manager.save(User, {
        id: 4,
        firstName: 'mu',
        lastName: 'yun',
        age: 20
    });
});
```

### 简化操作
为了简化调用每个方法的时候都要先传入实体类操作，可以使用 getRepository 方法获取实体的仓库对象，然后调用增删改查方法：
```typescript
const userRepository = AppDataSource.getRepository(User);
// 使用 userRepository 进行操作
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714495202001-5792c206-82c8-4a99-98fe-ece6522b3029.png#averageHue=%232b2a2a&clientId=u1c56d63e-770f-4&from=paste&height=336&id=u2e1295cd&originHeight=604&originWidth=1458&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=261488&status=done&style=none&taskId=u88e840a4-e97c-4291-958d-38aed564dd4&title=&width=810.0000214576727)
