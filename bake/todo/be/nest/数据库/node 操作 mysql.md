# 深入探讨 Node.js 中的 MySQL 操作：从 mysql2 到 TypeORM

在现代 Web 开发中，数据库操作是不可或缺的一部分。无论是简单的增删改查，还是复杂的事务处理，如何高效、简洁地与数据库交互，直接影响到应用的性能和开发体验。在 Node.js 中，操作 MySQL 数据库的方式有很多，今天我们将重点讨论两种常见的方式：**mysql2** 和 **TypeORM**。

## 1. 使用 mysql2 直接操作 MySQL

### 1.1 什么是 mysql2？

`mysql2` 是 Node.js 中最常用的 MySQL 连接库之一，它是 `mysql` 包的升级版，提供了更好的性能和更多的特性。通过 `mysql2`，我们可以直接执行 SQL 语句，像在 MySQL Workbench 中一样操作数据库。

### 1.2 基本用法

首先，我们需要安装 `mysql2`：

```bash
npm install --save mysql2
```

接着，我们可以通过以下代码连接 MySQL 数据库并执行查询：

```javascript
const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'your_password',
  database: 'practice',
})

connection.query('SELECT * FROM customers', (err, results, fields) => {
  if (err) throw err
  console.log(results)
  console.log(fields.map(item => item.name))
})
```

在这个例子中，我们通过 `mysql2` 连接到 MySQL 数据库，并执行了一条简单的 `SELECT` 查询。`results` 是查询结果，`fields` 则包含了字段的元信息。

### 1.3 使用占位符防止 SQL 注入

为了防止 SQL 注入，我们可以使用占位符来传递参数：

```javascript
connection.query('SELECT * FROM customers WHERE name LIKE ?', ['李%'], (err, results, fields) => {
  if (err) throw err
  console.log(results)
})
```

通过占位符 `?`，我们可以安全地传递参数，避免 SQL 注入攻击。

### 1.4 增删改操作

除了查询，`mysql2` 还支持插入、更新和删除操作：

- **插入数据**：

  ```javascript
  connection.execute('INSERT INTO customers (name) VALUES (?)', ['光'], (err, results) => {
    if (err) throw err
    console.log('数据插入成功')
  })
  ```

- **更新数据**：

  ```javascript
  connection.execute('UPDATE customers SET name="guang" WHERE name="光"', err => {
    if (err) throw err
    console.log('数据更新成功')
  })
  ```

- **删除数据**：

  ```javascript
  connection.execute('DELETE FROM customers WHERE name=?', ['guang'], err => {
    if (err) throw err
    console.log('数据删除成功')
  })
  ```

### 1.5 使用连接池提高性能

直接创建和释放连接的方式虽然简单，但在高并发场景下性能并不理想。为了解决这个问题，我们可以使用连接池。连接池可以复用多个连接，避免频繁的连接创建和销毁。

```javascript
const mysql = require('mysql2/promise')

;(async function () {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'practice',
    connectionLimit: 10,
  })

  const [results] = await pool.query('SELECT * FROM customers')
  console.log(results)
})()
```

通过连接池，我们可以显著提高数据库操作的性能，尤其是在高并发的场景下。

## 2. 使用 TypeORM 操作 MySQL

### 2.1 什么是 ORM？

ORM（Object Relational Mapping）是一种将关系型数据库的表映射为面向对象编程中的类的技术。通过 ORM，我们可以直接操作对象，ORM 框架会自动生成相应的 SQL 语句并与数据库交互。这样，我们不需要手动编写 SQL，大大简化了数据库操作。

### 2.2 TypeORM 简介

`TypeORM` 是一个流行的 Node.js ORM 框架，支持多种数据库（包括 MySQL）。它通过装饰器的方式将数据库表与类进行映射，并提供了丰富的 API 来操作数据库。

### 2.3 初始化 TypeORM 项目

首先，我们可以通过以下命令创建一个 TypeORM 项目：

```bash
npx typeorm@latest init --name typeorm-mysql-test --database mysql
```

接着，修改 `data-source.ts` 文件，配置数据库连接：

```typescript
import { DataSource } from 'typeorm'
import { User } from './entity/User'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'your_password',
  database: 'practice',
  synchronize: true,
  entities: [User],
})
```

在这里，我们指定了数据库连接信息，并将 `User` 实体类映射到数据库中的 `user` 表。

### 2.4 定义实体类

在 TypeORM 中，实体类是数据库表的映射。我们可以通过装饰器来定义表的结构：

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
```

这个 `User` 类对应数据库中的 `user` 表，`id` 是主键，`name` 是普通字段。

### 2.5 使用 TypeORM 进行增删改查

通过 TypeORM，我们可以像操作对象一样操作数据库：

- **插入数据**：

  ```typescript
  const user = new User()
  user.name = '光'
  await AppDataSource.manager.save(user)
  console.log('用户已保存')
  ```

- **查询数据**：

  ```typescript
  const users = await AppDataSource.manager.find(User)
  console.log('已查询到的用户：', users)
  ```

- **更新数据**：

  ```typescript
  const user = await AppDataSource.manager.findOneBy(User, { name: '光' })
  if (user) {
    user.name = 'guang'
    await AppDataSource.manager.save(user)
    console.log('用户已更新')
  }
  ```

- **删除数据**：

  ```typescript
  const user = await AppDataSource.manager.findOneBy(User, { name: 'guang' })
  if (user) {
    await AppDataSource.manager.remove(user)
    console.log('用户已删除')
  }
  ```

### 2.6 TypeORM 的优势

TypeORM 的最大优势在于它将数据库操作抽象为对象操作，开发者不需要关心底层的 SQL 语句。通过装饰器和类的定义，TypeORM 可以自动生成建表、插入、更新、删除等 SQL 语句。此外，TypeORM 还支持事务、关系映射等高级功能，极大地提高了开发效率。

## 3. 总结

在 Node.js 中操作 MySQL 数据库，我们可以选择直接使用 `mysql2` 来执行 SQL 语句，也可以使用 `TypeORM` 这样的 ORM 框架来简化数据库操作。

- **mysql2** 适合那些熟悉 SQL 并且希望直接控制数据库操作的开发者。它提供了灵活的 API 和连接池机制，适合高并发场景。
- **TypeORM** 则更适合那些希望通过对象操作数据库的开发者。它通过类和装饰器的方式将数据库表映射为对象，极大地简化了数据库操作。

无论选择哪种方式，都可以根据项目的需求和开发者的习惯来决定。希望这篇文章能帮助你更好地理解和使用这两种方式来操作 MySQL 数据库。
