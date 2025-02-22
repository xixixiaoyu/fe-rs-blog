本文将介绍如何在 Node.js 应用中使用 mysql2 和 TypeORM 两种方式操作 MySQL 数据库。

## 使用 mysql2 库操作 MySQL
mysql2 是 mysql 库的升级版，提供了更多特性，并且支持 Promise API。以下是使用 mysql2 进行数据库操作的基本步骤：
### 安装和配置
创建项目目录，初始化 npm，并安装 mysql2：
```bash
mkdir myproject
cd myproject
npm init -y
npm install --save mysql2
```
创建 index.js 文件，并配置数据库连接：
```javascript
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'your_password',
  database: 'practice'
});
```

### 基本操作
#### 查询操作
```javascript
connection.query('SELECT * FROM customers', (err, results, fields) => {
  if (err) throw err;
  console.log(results);
  console.log(fields.map(item => item.name));
});
```

#### 插入数据
```javascript
connection.execute('INSERT INTO customers (name) VALUES (?)', ['Zhang'], (err, results) => {
  if (err) throw err;
  console.log('Insert successful');
});
```

#### 更新数据
```javascript
connection.execute('UPDATE customers SET name="Li" WHERE name="Zhang"', (err) => {
  if (err) throw err;
  console.log('Update successful');
});
```

#### 删除数据
```javascript
connection.execute('DELETE FROM customers WHERE name="Li"', (err) => {
  if (err) throw err;
  console.log('Delete successful');
});
```

### 使用连接池提高性能
连接池可以管理多个数据库连接，提高应用性能和响应速度：
```javascript
const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'practice',
    waitForConnections: true, // 如果没有可用连接，等待而不是立即抛出错误
    connectionLimit: 10, // 连接池中最大连接数
    queueLimit: 0 // 最大排队数量，0表示不限制
  });

  const [results] = await pool.query('SELECT * FROM customers');
  console.log(results);
})();
```

## 使用 TypeORM 框架操作 MySQL
TypeORM 是一个基于 TypeScript 的 ORM (对象关系映射) 框架，它可以让开发者通过操作对象而不是 SQL 语句来处理数据库。
### 项目设置
创建并配置新项目：
```bash
npx typeorm@latest init --name typeorm-mysql-test --database mysql
```
在 data-source.ts 中配置数据库：
```javascript
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'your_password',
  database: 'practice',
  synchronize: true,
  entities: [User],
  connectorPackage: 'mysql2'
});
```

### 操作数据库
使用装饰器定义模型（Entity）：
```javascript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

#### 插入和查询数据
```javascript
import { AppDataSource } from './data-source';
import { User } from './entity/User';

AppDataSource.initialize().then(async () => {
  const user = new User();
  user.name = 'Wang';
  await AppDataSource.manager.save(user);

  const users = await AppDataSource.manager.find(User);
  console.log(users);
});
```

### 优点
使用 ORM 框架可以大大简化数据库操作，使代码更加直观和易于维护。同时，TypeORM 提供了强大的数据模型管理功能，支持自动创建表、生成 SQL 语句等。
