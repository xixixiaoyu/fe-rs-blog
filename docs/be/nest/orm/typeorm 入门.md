# 深入理解 TypeORM：从零开始构建一个完整项目

在上一节中，我们简单体验了 TypeORM 的基本用法。这一节，我们将深入探讨 TypeORM 的核心概念，并通过一个完整的项目实例，帮助你更好地理解和掌握它。

## 一、创建 TypeORM 项目

首先，我们需要创建一个新的 TypeORM 项目。可以通过以下命令快速初始化：

```bash
npx typeorm@latest init --name typeorm-all-feature --database mysql
```

接着，修改项目中的数据库配置，确保连接到 MySQL 数据库，并安装 `mysql2` 驱动：

```bash
npm install --save mysql2
```

在 `data-source.ts` 文件中，配置数据库连接：

```typescript
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'guang',
	database: 'practice',
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
})
```

### 配置详解

- `type`：指定数据库类型，TypeORM 支持多种数据库，如 MySQL、PostgreSQL、SQLite 等。
- `host` 和 `port`：数据库服务器的地址和端口。
- `username` 和 `password`：数据库的登录凭证。
- `database`：要操作的数据库名称。
- `synchronize`：自动同步数据库表结构，适合开发环境。
- `logging`：是否打印 SQL 语句，方便调试。
- `entities`：指定与数据库表对应的实体类。
- `poolSize`：数据库连接池的最大连接数。
- `connectorPackage`：指定使用的数据库驱动包。
- `extra`：额外的配置选项，如加密方式。

## 二、Entity 与数据库表的映射

在 TypeORM 中，实体类（Entity）是与数据库表对应的核心概念。我们可以通过装饰器来定义实体类与表的映射关系。

### 示例：创建一个新的实体类

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({
	name: 't_aaa',
})
export class Aaa {
	@PrimaryGeneratedColumn({
		comment: '这是 id',
	})
	id: number

	@Column({
		name: 'a_aa',
		type: 'text',
		comment: '这是 aaa',
	})
	aaa: string

	@Column({
		unique: true,
		nullable: false,
		length: 10,
		type: 'varchar',
		default: 'bbb',
	})
	bbb: string

	@Column({
		type: 'double',
	})
	ccc: number
}
```

### 解释

- `@Entity`：标记该类为一个实体类，并指定表名为 `t_aaa`。
- `@PrimaryGeneratedColumn`：定义自增主键，并添加注释。
- `@Column`：定义字段的映射关系，可以指定字段名、类型、长度、默认值等。

## 三、增删改查操作

### 1. 插入数据

我们可以通过 `save` 方法来插入数据：

```typescript
import { AppDataSource } from './data-source'
import { User } from './entity/User'

AppDataSource.initialize()
	.then(async () => {
		const user = new User()
		user.firstName = 'aaa'
		user.lastName = 'bbb'
		user.age = 25

		await AppDataSource.manager.save(user)
	})
	.catch(error => console.log(error))
```

### 2. 更新数据

如果指定了 `id`，TypeORM 会自动判断是更新操作：

```typescript
import { AppDataSource } from './data-source'
import { User } from './entity/User'

AppDataSource.initialize()
	.then(async () => {
		const user = new User()
		user.id = 1
		user.firstName = 'aaa111'
		user.lastName = 'bbb'
		user.age = 25

		await AppDataSource.manager.save(user)
	})
	.catch(error => console.log(error))
```

### 3. 批量插入和更新

批量插入和更新同样简单：

```typescript
await AppDataSource.manager.save(User, [
	{ firstName: 'ccc', lastName: 'ccc', age: 21 },
	{ firstName: 'ddd', lastName: 'ddd', age: 22 },
	{ firstName: 'eee', lastName: 'eee', age: 23 },
])
```

### 4. 删除数据

可以通过 `delete` 方法删除数据：

```typescript
await AppDataSource.manager.delete(User, 1)
await AppDataSource.manager.delete(User, [2, 3])
```

## 四、查询数据

### 1. 查询多条记录

使用 `find` 方法可以查询多条记录：

```typescript
const users = await AppDataSource.manager.find(User)
console.log(users)
```

### 2. 条件查询

通过 `findBy` 方法可以根据条件查询：

```typescript
const users = await AppDataSource.manager.findBy(User, {
	age: 23,
})
console.log(users)
```

### 3. 查询单条记录

使用 `findOne` 方法可以查询单条记录：

```typescript
const user = await AppDataSource.manager.findOne(User, {
	where: { id: 4 },
	select: { firstName: true, age: true },
	order: { age: 'ASC' },
})
console.log(user)
```

## 五、事务处理

在涉及多个表或复杂操作时，事务是必不可少的。TypeORM 提供了简单的事务处理方式：

```typescript
await AppDataSource.manager.transaction(async manager => {
	await manager.save(User, {
		id: 4,
		firstName: 'eee',
		lastName: 'eee',
		age: 20,
	})
})
```

## 六、使用 Repository 简化操作

每次操作都传入实体类有些繁琐，TypeORM 提供了 `getRepository` 方法来简化操作：

```typescript
const userRepository = AppDataSource.getRepository(User)
const users = await userRepository.find()
```

`Repository` 提供了与 `EntityManager` 类似的方法，但专门用于操作单个实体类。

## 七、总结

通过这节内容，我们深入了解了 TypeORM 的核心概念和常用操作。TypeORM 通过 `DataSource` 管理数据库连接，通过 `Entity` 映射数据库表，并提供了丰富的 API 来进行增删改查操作。无论是简单的查询，还是复杂的事务处理，TypeORM 都能轻松应对。

TypeORM 的灵活性和强大的功能使得它成为构建 Node.js 应用程序时的理想选择。希望通过这篇文章，你能对 TypeORM 有更深入的理解，并能在实际项目中熟练运用它。
