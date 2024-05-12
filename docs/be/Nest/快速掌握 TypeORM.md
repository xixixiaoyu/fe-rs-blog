## TypeORM 初始化配置
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
如果我们想 numbe 类型映射 DOUBLE 呢？string 类型映射 TEXT （长文本）呢？<br />这时候就需要往 Column 装饰器传入选项：

1. `type`：指定列的数据库类型，例如 `varchar`, `int`, `boolean`, 等。
2. `primary`：标记列为主键。
3. `length`：对于字符串类型，可以指定其长度。
4. `unique`：确保列的值唯一。
5. `nullable`：指定列是否可以为 `NULL`。
6. `default`：列的默认值。
7. `update`：指定在调用 `save` 方法时是否更新该列。
8. `select`：指定查询时是否选中该列。
9. `insert`：指定在插入时是否包括该列。
10. `name`：在数据库中使用的列的名称，如果与属性名不同。
11. `precision` 和 `scale`：对于 `decimal` 和 `float` 类型的列，可以指定精度和小数位数。
12. `enum`：指定列为枚举类型，并提供枚举的值。
13. `array`：在某些数据库（如 PostgreSQL）中，可以指定列为数组类型。
14. `comment`：列的注释。
15. `collation`：列的排序规则。
16. `charset`：列的字符集。
17. `width`：对于整数类型，可以指定显示宽度。
18. `readonly`：标记列为只读，不会通过 TypeORM 更新。


这样做：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687587779180-0bfb6998-0bc7-4974-9668-1b266813a6a0.png#averageHue=%232f2d2c&clientId=u17db4bee-e7a5-4&from=paste&height=529&id=u219a14ef&originHeight=1614&originWidth=650&originalType=binary&ratio=2&rotation=0&showTitle=false&size=119221&status=done&style=none&taskId=u77f7043a-6b5d-4246-b842-f7946835aee&title=&width=213)<br />我们新增了一个 Entity Aaa。

- @Entity 指定它是一个 Entity，name 指定表名为 t_aaa。
- @PrimaryGeneratedColumn 指定它是一个自增的主键，通过 comment 指定注释。
- @Column 映射属性和字段的对应关系。通过 name 指定字段名，type 指定映射的数据库类型，length 指定长度，default 指定默认值。nullable 设置 NOT NULL 约束，unique 设置 UNIQUE 唯一索引。

然后在 DataSource 的 entities 里引入下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687587953532-bd5e0b85-4550-494e-9c6d-1ea953b70201.png#averageHue=%232d2c2b&clientId=u17db4bee-e7a5-4&from=paste&height=305&id=u5f26c091&originHeight=978&originWidth=996&originalType=binary&ratio=2&rotation=0&showTitle=false&size=118823&status=done&style=none&taskId=uf40857a1-0bcb-4381-bad0-ab874b06d1d&title=&width=311)<br />重新 npm run start。 生成建表 sql 是这样的：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687588067820-398cff3a-ea28-4911-9d72-2b8426681230.png#averageHue=%23343434&clientId=u17db4bee-e7a5-4&from=paste&height=42&id=u7e5431cc&originHeight=84&originWidth=2886&originalType=binary&ratio=2&rotation=0&showTitle=false&size=38485&status=done&style=none&taskId=u031bc177-62d8-41b8-9b31-a04bb82a065&title=&width=1443)<br />格式化一下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687588137108-8d94b477-077c-4f87-86a4-8b14276cbfb4.png#averageHue=%23faf4eb&clientId=u17db4bee-e7a5-4&from=paste&height=167&id=u54ed515f&originHeight=334&originWidth=864&originalType=binary&ratio=2&rotation=0&showTitle=false&size=104815&status=done&style=none&taskId=u891afd9c-9d60-4862-924c-129f63555aa&title=&width=432)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687588238086-6494c114-d096-43c9-bbbb-7b566f2055f6.png#averageHue=%23d4d1cc&clientId=u17db4bee-e7a5-4&from=paste&height=292&id=ub58148b1&originHeight=680&originWidth=1640&originalType=binary&ratio=2&rotation=0&showTitle=false&size=187966&status=done&style=none&taskId=u82a21417-36f6-483c-9f69-ed63b7c98c3&title=&width=705)<br />在 mysql workbench 确实生成了这个表。

## 增删改查
### 初始化与实体创建
在使用 TypeORM 进行数据库操作前，首先需要创建实体并初始化数据源。<br />以下是创建 User 实体并保存到数据库的示例代码：
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
user.firstName = "aaa111";
user.lastName = "bbb";
user.age = 25;

await AppDataSource.manager.save(user);
```
其实 EntityManager 有 update 和 insert 方法，分别是修改和插入的，但是它们不会先 select 查询一次。<br />而 save 方法会先查询一次数据库来确定是插入还是修改。

### 批量操作
批量插入：
```typescript
await AppDataSource.manager.save(User, [
    { firstName: 'ccc', lastName: 'ccc', age: 21 },
    { firstName: 'ddd', lastName: 'ddd', age: 22 },
    { firstName: 'eee', lastName: 'eee', age: 23 }
]);
```
批量修改：
```typescript
await AppDataSource.manager.save(User, [
    { id: 2, firstName: 'ccc111', lastName: 'ccc', age: 21 },
    { id: 3, firstName: 'ddd222', lastName: 'ddd', age: 22 },
    { id: 4, firstName: 'eee333', lastName: 'eee', age: 23 }
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
find（查询多条记录）：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714495997325-4d572e4a-b207-49c6-8199-1252106b6c1d.png#averageHue=%232d2c2b&clientId=ud11740e7-ace6-4&from=paste&height=506&id=u95b8f207&originHeight=910&originWidth=1488&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=314295&status=done&style=none&taskId=u37549820-a0fa-4078-8322-34fadbfe9d3&title=&width=826.6666885658552)<br />指定查询的 where 条件是 id 为 4-8，指定 select 的列为 firstName 和 age，然后 order 指定根据 age 升序排列。<br />不带第二个查询条件参数，就是查询所有用户。

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
