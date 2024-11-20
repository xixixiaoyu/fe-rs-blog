# 使用 TypeORM 实现多级分类存储：从理论到实践

在日常开发中，我们经常会遇到多级分类的场景。比如电商平台的商品分类，新闻网站的新闻分类等。这些分类通常是多层级的，如何高效地存储和查询这些多级分类数据，是一个值得探讨的问题。

## 多级分类的存储挑战

最简单的想法是使用多张表来存储不同层级的分类，比如二级分类用两张表，三级分类用三张表。虽然这种方式可以实现，但存在以下问题：

1. **冗余**：所有分类的表结构是一样的，分成多张表显得冗余。
2. **灵活性差**：如果层级关系经常调整，比如有时是二级分类，有时是三级或更多级分类，使用多表结构就显得不够灵活。

因此，针对这种多级分类的场景，通常我们会选择在一张表中存储所有分类数据，并通过 `parentId` 字段来实现父子关系的关联。

## TypeORM 的 Tree Entity 支持

在 TypeORM 中，针对这种多级分类的场景，提供了 `Tree Entity` 的支持。接下来，我们通过一个实际的例子，展示如何使用 TypeORM 实现多级分类的存储和查询。

### 项目初始化

首先，我们使用 NestJS 创建一个新项目，并安装 TypeORM 相关的依赖：

```bash
nest new typeorm-tree-entity-test
cd typeorm-tree-entity-test
nest g resource city --no-spec
npm install --save @nestjs/typeorm typeorm mysql2
```

在 `app.module.ts` 中引入 `TypeOrmModule`，并配置数据库连接：

```typescript:src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './city/city.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './city/city.entity';

@Module({
  imports: [
    CityModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "password",
      database: "tree_test",
      synchronize: true,
      logging: true,
      entities: [City],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 创建 City 实体

接下来，我们在 `city.entity.ts` 中定义 `City` 实体，并使用 TypeORM 的 `@Tree` 装饰器来标识它为树形结构：

```typescript:src/city/city.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from "typeorm";

@Entity()
@Tree('closure-table')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    status: number;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @Column()
    name: string;

    @TreeChildren()
    children: City[];

    @TreeParent()
    parent: City;
}
```

在这里，我们使用了 `@TreeChildren` 和 `@TreeParent` 来分别标识子节点和父节点的关系。`@Tree('closure-table')` 表示我们使用的是闭包表（closure-table）模式来存储树形结构。

### 插入和查询数据

接下来，我们在 `CityService` 中插入一些数据，并通过 `getTreeRepository` 来查询树形结构：

```typescript:src/city/city.service.ts
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { City } from './city.entity';

@Injectable()
export class CityService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async findAll() {
    const city = new City();
    city.name = '华北';
    await this.entityManager.save(city);

    const cityChild = new City();
    cityChild.name = '山东';
    const parent = await this.entityManager.findOne(City, {
      where: { name: '华北' }
    });
    if (parent) {
      cityChild.parent = parent;
    }
    await this.entityManager.save(cityChild);

    return this.entityManager.getTreeRepository(City).findTrees();
  }
}
```

在这个例子中，我们创建了两个 `City` 实体，第二个实体的 `parent` 指定为第一个实体。通过 `getTreeRepository(City).findTrees()` 方法，我们可以查询出树形结构的数据。

### 其他常用 API

除了 `findTrees`，TypeORM 还提供了其他一些实用的 API 来处理树形结构的数据：

1. **findRoots**：查询所有根节点。
2. **findDescendantsTree**：查询某个节点的所有后代节点。
3. **findAncestorsTree**：查询某个节点的所有祖先节点。
4. **countDescendants** 和 **countAncestors**：分别统计某个节点的后代和祖先数量。

例如，查询某个节点的所有后代节点：

```typescript:src/city/city.service.ts
async findDescendants() {
  const parent = await this.entityManager.findOne(City, {
    where: { name: '云南' }
  });
  return this.entityManager.getTreeRepository(City).findDescendantsTree(parent);
}
```

### 存储模式：Closure Table vs Materialized Path

TypeORM 提供了多种存储树形结构的方式，最常用的有两种：

1. **Closure Table**：使用两张表来存储父子关系，适合频繁查询树形结构的场景。
2. **Materialized Path**：使用单张表，并通过路径字段（`mpath`）来存储节点的访问路径，适合层级较深的树形结构。

我们可以通过修改 `@Tree` 装饰器的参数来切换存储模式：

```typescript:src/city/city.entity.ts
@Tree('materialized-path')
export class City {
    // ...
}
```

在 `materialized-path` 模式下，TypeORM 会在表中增加一个 `mpath` 字段，用于存储节点的路径信息。

### 总结

通过本文的示例，我们展示了如何使用 TypeORM 的 `Tree Entity` 来实现多级分类的存储和查询。无论是使用 `closure-table` 还是 `materialized-path`，都可以灵活地处理任意层级的分类数据。

在实际开发中，遇到多级分类的存储需求时，TypeORM 的 `Tree Entity` 是一个非常实用的工具。通过简单的配置和 API 调用，我们可以轻松实现复杂的树形结构存储和查询。

希望这篇文章能帮助你更好地理解和应用 TypeORM 的树形结构存储。如果你有类似的需求，不妨试试 `Tree Entity` 吧！
