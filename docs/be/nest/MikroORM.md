### 什么是 MikroORM？

先说说 MikroORM 是啥。简单讲，它是一个专门为 TypeScript 打造的 ORM（对象关系映射工具），用在 Node.js 项目里。它背后用的是数据映射器（Data Mapper）、工作单元（Unit of Work）和身份映射（Identity Map）这些模式，听起来有点高大上，但其实就是帮你更方便地操作数据库。比如，你可以用对象的方式来增删改查数据，而不用老写一堆 SQL。

跟 TypeORM 比起来，MikroORM 的代码更简洁，类型支持更强。如果你之前用过 TypeORM，切换到 MikroORM 也不会太费劲。想了解更多细节，可以看看[官方文档](https://mikro-orm.io/docs)，信息很全。



### 第一步：安装和配置

要在 Nest 里用 MikroORM，最简单的方式是借助 @mikro-orm/nestjs 这个模块。安装的时候，除了核心包，还得装上对应的数据库驱动，比如 SQLite、PostgreSQL 或者 MongoDB。咱们以 SQLite 为例，跑个命令就搞定：

```bash
npm i @mikro-orm/core @mikro-orm/nestjs @mikro-orm/sqlite
```

装好后，接下来得在 Nest 的根模块（一般是 AppModule）里把 MikroORM 引入。代码长这样：

```ts
import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { SqliteDriver } from '@mikro-orm/sqlite'

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      dbName: 'my-db-name.sqlite3',
      driver: SqliteDriver,
    }),
  ],
})
export class AppModule {}
```

这里 forRoot 是用来初始化 MikroORM 的，里面传的配置对象跟 MikroORM 本身的 init 方法一样。你可以指定实体文件路径（entities 和 entitiesTs）、数据库名（dbName）和驱动（driver）。SQLite 只是个例子，如果你用 PostgreSQL 或者 MongoDB，只要换个驱动就行，具体支持的驱动可以去[文档](https://mikro-orm.io/docs/usage-with-sql/)查。

不想每次都写这么多配置？也可以单独弄个 mikro-orm.config.ts 文件，然后直接用：

```ts
@Module({
  imports: [
    MikroOrmModule.forRoot(),
  ],
})
export class AppModule {}
```

不过如果你的项目用的是 Webpack 这种支持 Tree Shaking 的工具，最好还是显式传配置，避免一些意外问题。



### 第二步：注入 EntityManager

配置好了，MikroORM 的核心工具 EntityManager 就可以在项目里随便用了。怎么用呢？直接在服务里注入就行：

```ts
import { Injectable } from '@nestjs/common'
import { EntityManager, MikroORM } from '@mikro-orm/sqlite'

@Injectable()
export class MyService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  async findSomething() {
    return this.em.find(/* 你的查询逻辑 */)
  }
}
```

EntityManager 是操作数据库的关键，比如查数据、加数据啥的都靠它。注意，它得从具体的驱动包里导入（比如 @mikro-orm/sqlite），或者用 @mikro-orm/knex 也行。



### 第三步：玩转存储库（Repositories）

MikroORM 还有个很酷的功能叫存储库模式，每个实体都能有个自己的存储库，专门用来处理跟这个实体相关的操作。比如你有个 Photo 实体，可以在模块里注册它的存储库：

```ts
@Module({
  imports: [MikroOrmModule.forFeature([Photo])],
  providers: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
```

然后在服务里注入：

```ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/sqlite'
import { Photo } from './photo.entity'

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: EntityRepository<Photo>,
  ) {}

  async getPhotos() {
    return this.photoRepository.findAll()
  }
}
```

