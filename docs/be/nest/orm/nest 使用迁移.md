# 在 Nest.js 项目中优雅使用 TypeORM Migration

在现代 Web 开发中，数据库的表结构管理和数据初始化是不可或缺的一部分。尤其是在生产环境中，如何优雅地管理表结构的变更和数据的初始化，直接影响到项目的稳定性和可维护性。在这篇文章中，我们将以 **Nest.js** 和 **TypeORM** 为例，深入探讨如何通过 Migration（迁移）来实现这些功能。

---

## 为什么需要 Migration？

在开发环境中，我们通常会开启 `synchronize`，让 TypeORM 自动同步实体（Entity）到数据库表。这种方式简单高效，适合快速迭代开发。比如：

- 自动创建表（`create table`）
- 自动更新表结构（`alter table`）

但在生产环境中，直接使用 `synchronize` 存在以下问题：

1. **不可控的风险**：`synchronize` 会根据实体的变化直接修改数据库表结构，可能导致数据丢失或不可预期的错误。
2. **缺乏版本管理**：无法记录表结构的变更历史，难以追溯和回滚。

因此，在生产环境中，我们通常会关闭 `synchronize`，转而使用 **Migration** 来管理表结构的变更和数据初始化。Migration 的优势在于：

- **可控性**：每次变更都需要手动生成和执行，确保变更是可控的。
- **版本管理**：通过 Migration 文件记录变更历史，支持回滚操作。

---

## 在 Nest.js 项目中使用 TypeORM Migration

接下来，我们将通过一个完整的案例，演示如何在 Nest.js 项目中使用 TypeORM 的 Migration 功能。

### 1. 创建 Nest.js 项目

首先，创建一个新的 Nest.js 项目：

```bash
nest new nest-typeorm-migration
```

安装 TypeORM 和 MySQL 相关依赖：

```bash
npm install --save @nestjs/typeorm typeorm mysql2
```

### 2. 配置 TypeORM

在 `AppModule` 中引入 TypeORM 配置：

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'guang',
      database: 'nest-migration-test',
      synchronize: true, // 开发环境下开启
      logging: true,
      entities: [],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
  ],
})
export class AppModule {}
```

### 3. 创建实体和模块

创建一个 `Article` 模块和对应的实体：

```bash
nest g resource article
```

修改 `article.entity.ts` 文件，定义 `Article` 实体：

```typescript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 30 })
  title: string

  @Column({ type: 'text' })
  content: string

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date
}
```

将 `Article` 实体添加到 `AppModule` 的 `entities` 配置中。

### 4. 验证 `synchronize` 的效果

在 MySQL 中创建一个名为 `nest-migration-test` 的数据库，然后运行项目：

```bash
npm run start:dev
```

此时，TypeORM 会根据 `Article` 实体自动创建对应的表。

---

## 使用 Migration 管理表结构和数据

在生产环境中，我们需要关闭 `synchronize`，并通过 Migration 来管理表结构和数据。

### 1. 创建 `data-source.ts`

在项目根目录下创建 `src/data-source.ts` 文件，用于配置 Migration：

```typescript
import { DataSource } from 'typeorm'
import { Article } from './article/entities/article.entity'

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'guang',
  database: 'nest-migration-test',
  synchronize: false, // 关闭 synchronize
  logging: true,
  entities: [Article],
  migrations: ['src/migrations/**.ts'],
  poolSize: 10,
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
})
```

同时，将 `AppModule` 中的 `synchronize` 设置为 `false`。

### 2. 配置 Migration 脚本

在 `package.json` 中添加以下脚本：

```json
"scripts": {
  "typeorm": "ts-node ./node_modules/typeorm/cli",
  "migration:create": "npm run typeorm -- migration:create",
  "migration:generate": "npm run typeorm -- migration:generate -d ./src/data-source.ts",
  "migration:run": "npm run typeorm -- migration:run -d ./src/data-source.ts",
  "migration:revert": "npm run typeorm -- migration:revert -d ./src/data-source.ts"
}
```

### 3. 生成表结构的 Migration

运行以下命令，生成创建表的 Migration 文件：

```bash
npm run migration:generate src/migrations/init
```

TypeORM 会对比实体和数据库表的差异，自动生成 Migration 文件。执行 Migration：

```bash
npm run migration:run
```

此时，数据库中会创建 `Article` 表，并在 `migrations` 表中记录已执行的 Migration。

### 4. 初始化数据

如果需要在生产环境中插入初始化数据，可以创建一个新的 Migration：

```bash
npm run migration:create src/migrations/data
```

在生成的 Migration 文件中，手动添加 `INSERT INTO` 语句：

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    INSERT INTO article (id, title, content, createTime, updateTime)
    VALUES
    (1, '夏日经济“热力”十足 “点燃”文旅消费新活力', '人民网北京6月17日电...', NOW(), NOW()),
    (2, '科学把握全面深化改革的方法要求', '科学的方法是做好一切工作的重要保证...', NOW(), NOW());
  `);
}
```

执行 Migration：

```bash
npm run migration:run
```

此时，数据会被插入到 `Article` 表中。

---

## 表结构变更的 Migration

当实体发生变化时（例如新增字段），可以通过 Migration 来更新表结构。

### 1. 修改实体

为 `Article` 实体新增一个 `tags` 字段：

```typescript
@Column({ length: 30 })
tags: string;
```

### 2. 生成表结构变更的 Migration

运行以下命令，生成表结构变更的 Migration 文件：

```bash
npm run migration:generate src/migrations/add-tag-column
```

TypeORM 会自动生成 `ALTER TABLE` 的 SQL 语句。执行 Migration：

```bash
npm run migration:run
```

此时，数据库中的 `Article` 表会新增一个 `tags` 列。

---

## 使用 `.env` 管理配置

为了避免数据库配置重复，我们可以使用 `.env` 文件统一管理配置。

### 1. 安装 `dotenv`

```bash
npm install --save-dev dotenv
```

### 2. 创建 `.env` 文件

在项目根目录下创建 `.env` 文件：

```env
mysql_server_host=localhost
mysql_server_port=3306
mysql_server_username=root
mysql_server_password=guang
mysql_server_database=nest-migration-test
```

### 3. 修改 `data-source.ts`

在 `data-source.ts` 中引入 `dotenv`，并读取 `.env` 文件：

```typescript
import { DataSource } from 'typeorm'
import { Article } from './article/entities/article.entity'
import { config } from 'dotenv'

config()

export default new DataSource({
  type: 'mysql',
  host: process.env.mysql_server_host,
  port: +process.env.mysql_server_port,
  username: process.env.mysql_server_username,
  password: process.env.mysql_server_password,
  database: process.env.mysql_server_database,
  synchronize: false,
  logging: true,
  entities: [Article],
  migrations: ['src/migrations/**.ts'],
  poolSize: 10,
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
})
```

---

## 总结

通过本文的案例，我们学习了如何在 Nest.js 项目中使用 TypeORM 的 Migration 功能来管理表结构和数据。主要步骤包括：

1. 创建 `data-source.ts` 配置文件。
2. 关闭 `synchronize`，改用 Migration。
3. 使用 `migration:generate` 和 `migration:create` 管理表结构和数据。
4. 使用 `.env` 文件统一管理配置。

通过 Migration，我们可以在生产环境中优雅地管理数据库的表结构和数据变更，确保项目的稳定性和可维护性。
