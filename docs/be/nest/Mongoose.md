### 为什么选择 NestJS 和 Mongoose？

NestJS 是一个基于 TypeScript 的现代化 Node.js 框架，结构清晰，支持模块化开发，特别适合构建复杂后端。

而 Mongoose 呢，则是 MongoDB 的最佳伴侣，它帮你用对象的方式操作数据库，省去了写一堆原始查询的麻烦。把这两者结合起来，既有类型安全，又能快速开发，简直是后端开发者的福音。

在 NestJS 中，你有两种选择来连接 MongoDB：TypeORM 或者 Mongoose。



### 第一步：安装和配置

要开始使用，先得把工具装好。打开终端，输入以下命令安装依赖：

```bash
npm i @nestjs/mongoose mongoose
```

然后在项目的根模块里把 Mongoose 接上。假设你的项目有个 app.module.ts，可以这样写：

```ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest')]
})
export class AppModule {}
```

这段代码的意思是：告诉 NestJS，我要连一个本地的 MongoDB 数据库，数据库名叫 nest。

这里的 forRoot() 方法接收的配置跟原生 Mongoose 的 mongoose.connect() 差不多，想改端口或者加认证，直接在这儿调整就行，比如 mongodb://username:password@localhost:27017/nest。



### 第二步：定义 Schema，建模数据

MongoDB 是文档数据库，数据以集合（collection）的形式存储，而 Mongoose 用 Schema 来定义每个集合里文档的结构。咱们以“猫”为例，假设要存猫的名字、年龄和品种。

新建一个文件 schemas/cat.schema.ts，写上：

```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CatDocument = HydratedDocument<Cat>

@Schema()
export class Cat {
  @Prop()
  name: string

  @Prop()
  age: number

  @Prop()
  breed: string
}

export const CatSchema = SchemaFactory.createForClass(Cat)
```

简单解释一下：

- @Schema() 把 Cat 类标记为一个模式，最终映射到 MongoDB 的 cats 集合（默认加个“s”）。
- @Prop() 定义每个字段，比如 name 是字符串，age 是数字。
- SchemaFactory.createForClass() 根据类生成 Mongoose 的 Schema。

这样就定义好了一个基本的模型，如果字段更复杂，比如猫的标签是数组，可以这样写：

```ts
@Prop([String])
tags: string[]
```

或者某个字段必须填，默认值是啥，也能直接指定：

```ts
@Prop({ required: true, default: 'Unknown' })
breed: string
```



### 第三步：模块化管理

定义好 Schema 后，得让 NestJS 知道怎么用它。咱们创建一个 CatsModule，把模型注册进去。文件是 cats.module.ts：

```ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'
import { Cat, CatSchema } from './schemas/cat.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {}
```

这里用 forFeature() 注册了 Cat 模型，告诉 NestJS 在这个模块里可以用它。forFeature() 和 forRoot() 的区别是：forRoot() 是全局连接数据库，forFeature() 是模块级别的模型定义。



### 第四步：服务层操作数据

模型有了，接下来在服务层用它操作数据。看看 cats.service.ts：

```ts
import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Cat } from './schemas/cat.schema'
import { CreateCatDto } from './dto/create-cat.dto'

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto)
    return createdCat.save()
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec()
  }
}
```

- @InjectModel(Cat.name) 把 Cat 模型注入进来，类型是 Model<Cat>。
- create() 方法新建一只猫，findAll() 查所有猫，简单直接。

假设 CreateCatDto 是这样的：

```ts
export class CreateCatDto {
  name: string
  age: number
  breed: string
}
```

这样，你就能通过服务层轻松操作数据库了。



### 进阶玩法：关联、事务和多数据库

#### 1.模型关联

假如猫有个主人，主人存在另一个集合 owners 里，可以这样定义关联：

```ts
import * as mongoose from 'mongoose'

@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
owner: Owner
```

想查猫时顺便把主人信息带出来？用 populate() 就行：

```ts
this.catModel.find().populate('owner').exec()
```

#### 2.事务支持

有时候需要保证操作的原子性，比如转账。可以用会话和事务：

```ts
async transferFunds(senderId, receiverId, amount) {
  const session = await this.connection.startSession()
  session.startTransaction()
  try {
    await this.catModel.updateOne(
      { _id: senderId },
      { $inc: { balance: -amount } }
    ).session(session)
    
    await this.catModel.updateOne(
      { _id: receiverId },
      { $inc: { balance: amount } }
    ).session(session)

    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}
```

注入连接用的是 @InjectConnection()，这样能更好地管理。

#### 3.多数据库

如果项目需要连多个数据库，比如一个存猫，一个存用户：

```ts
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cats_db', { connectionName: 'cats' }),
    MongooseModule.forRoot('mongodb://localhost/users_db', { connectionName: 'users' })
  ]
})
export class AppModule {}
```

然后在模块里指定用哪个连接：

```ts
MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }], 'cats')
```



### 最佳实践和调试

#### 1.模式组织

把 Schema 放进模块的 schemas 文件夹，保持代码整洁。

#### 2.性能优化

给常用的查询字段加索引，比如：

```ts
@Prop({ index: true })
name: string
```

#### 3.调试技巧

开发时可以开启 Mongoose 的调试模式，看看查询日志：

```ts
MongooseModule.forRoot('mongodb://localhost/nest', {
  debug: process.env.NODE_ENV === 'development'
})
```