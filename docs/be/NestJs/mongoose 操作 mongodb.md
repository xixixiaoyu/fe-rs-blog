在 Node.js 中，我们通常会使用 mongoose 这个第三方库来操作 MongoDB 数据库。

## Node 操作 mongoose
### 初始化项目
创建项目：
```bash
mkdir mongoose-test
cd mongoose-test
npm init -y
```
接下来，我们在项目中安装 mongoose：
```bash
npm install mongoose
```

### 连接 MongoDB 插入数据
然后，使用 Node.js 代码连接到本地运行的 MongoDB 实例：<br />创建 index.js 文件：
```javascript
const mongoose = require('mongoose');

main().catch(err => console.error(err));

async function main() {
	// 连接到本地 MongoDB 实例的 'yun' 数据库
	await mongoose.connect('mongodb://localhost:27017/yun');

	// 定义一个 Person 的 Schema，描述文档结构
	const PersonSchema = new mongoose.Schema({
		name: String,
		age: Number,
    gender: String,
		hobbies: [String],
	});

	// 根据 Schema 创建一个 Model
	const Person = mongoose.model('Person', PersonSchema);

	// 创建两个 Person 文档实例并保存到数据库
	const yun = new Person({ name: '云牧', age: 20 });
	const dai = new Person({ name: '黛玉', age: 21, hobbies: ['reading', 'play'] });

	await yun.save();
	await dai.save();

	// 查询数据库中的所有 Person 记录
	const persons = await Person.find();
	console.log(persons);
}
```
**注意**：上面代码中 await mongoose.connect(...) 确保了数据库连接成功之后，才会执行后续操作。<br />在 MongoDB 中，一个 collection 中的 document 可以是任意形状的。<br />因此，我们需要先定义一个 Schema 来描述我们想要存储的数据结构，然后根据这个 Schema 创建 Model，以便进行增删改查（CRUD）操作。

### 字段值类型和对象验证
文档结构可选的常用字段类型列表：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710673636782-19697149-78e1-4588-a488-3e36ad1bfaa0.png#averageHue=%23faf9f8&clientId=u7d263aa0-fbf6-4&from=paste&height=309&id=u5205d061&originHeight=617&originWidth=955&originalType=binary&ratio=2&rotation=0&showTitle=false&size=99274&status=done&style=none&taskId=ue691acee-2e66-4890-98a8-74acddab644&title=&width=477.5)<br />Mongoose 可以使用对象形式对字段值进行更多验证：
```javascript
const PersonSchema = new mongoose.Schema({
    // 简单的字符串类型
    name: String,

    // 带有更多配置的对象类型
    name: {
        type: String,
        required: true, // 设置为必填字段
        trim: true, // 自动去除字符串两端的空格
        lowercase: true, // 自动将字符串转为小写
        unique: true, // 字段值必须唯一
        minlength: 2, // 最小长度限制
        maxlength: 50, // 最大长度限制
        // 自定义验证器
        validate: {
            validator: function(v) {
                return /[a-zA-Z]/.test(v); // 只允许字母
            },
            message: props => `${props.value} is not a valid name!`
        },
        default: '匿名' // 默认值
    },
    gender: {
      type: String,
      enum: ['男', '女'] // 设置的值必须是数组中的
    },
    // 其他字段保持不变
    age: Number,
    hobbies: [String],
});
```


### 查看数据
在 MongoDB Compass 中可以看到数据插入了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710665521471-37a252a5-e6db-47bc-8a8a-85f8129b89cd.png#averageHue=%23fefdfd&clientId=u1664cf14-4582-4&from=paste&height=549&id=uf137cbf1&originHeight=1098&originWidth=2844&originalType=binary&ratio=2&rotation=0&showTitle=false&size=199532&status=done&style=none&taskId=ua1769ac3-3756-4602-a37d-6343841fb9f&title=&width=1422)<br />我们也可以在代码中查询：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710665594518-b130585b-306d-48c2-b6bb-1bc8fa587a21.png#averageHue=%232e2e2d&clientId=u1664cf14-4582-4&from=paste&height=359&id=ue547fe79&originHeight=1024&originWidth=1284&originalType=binary&ratio=2&rotation=0&showTitle=false&size=134257&status=done&style=none&taskId=u883d7868-1ebb-40bc-922f-1055d9d69c8&title=&width=450)

### CURD
####  增加
 插入一条数据：
```javascript
SongModel.create({ author: '王力宏' }, function (err, data) {
  if (err) throw err;
  // 处理插入的数据
  mongoose.connection.close();
});
```
 批量插入数据：
```javascript
SongModel.insertMany([{ author: '王力宏' }, { author: '周杰伦' }], function (err) {
  if (err) throw err;
  mongoose.connection.close();
});
```

#### 删除
删除一条数据：
```javascript
SongModel.deleteOne({ _id: '5dd662b5381fc316b44ce167' }, function (err) {
  if (err) throw err;
  mongoose.connection.close();
});
```
批量删除：
```javascript
SongModel.deleteMany({ author: '王力宏' }, function (err) {
  if (err) throw err;
  mongoose.connection.close();
});
```

#### 更新
更新一条数据：
```javascript
SongModel.updateOne({ _id: '5dd662b5381fc316b44ce167' }, { author: '王力宏' }, function (err) {
  if (err) throw err;
  mongoose.connection.close();
});
```
批量更新数据：
```javascript
SongModel.updateMany({ author: 'Leehom Wang' }, { author: '王力宏' }, function (err) {
  if (err) throw err;
  mongoose.connection.close();
});
```

#### 查询
查询一条数据：
```javascript
SongModel.findOne({ author: '王力宏' }, function (err, data) {
  if (err) throw err;
  console.log(data);
  mongoose.connection.close();
});

// 根据ID查询数据
SongModel.findById('5dd662b5381fc316b44ce167', function (err, data) {
  if (err) throw err;
  console.log(data);
  mongoose.connection.close();
});
```
批量查询数据：
```javascript
// 不加条件查询
SongModel.find(function (err, data) {
  if (err) throw err;
  console.log(data);
  mongoose.connection.close();
});

// 加条件查询
SongModel.find({ author: '王力宏' }, function (err, data) {
  if (err) throw err;
  console.log(data);
  mongoose.connection.close();
});
```

### 条件控制与运算符
在 MongoDB 中，对于比较运算，我们无法直接使用传统的大于(>)、小于(<)等运算符，而需要使用特定的替代符号：

- > 使用 $gt （greater than）
- < 使用 $lt （less than）
- >= 使用 $gte （greater than or equal）
- <= 使用 $lte （less than or equal）
- !== 使用 $ne （not equal）

### 逻辑运算
MongoDB 提供了以下逻辑运算符，用于组合查询条件：

- $or：逻辑或，用于查询满足任一条件的情况。
- $and：逻辑与，用于查询同时满足多个条件的情况。
```javascript
db.students.find({$or:[{age:18},{age:24}]})

db.students.find({$and: [{age: {$lt:20}}, {age: {$gt: 15}}]});
```

### 正则匹配
MongoDB 允许使用 JavaScript 正则表达式进行模糊查询，可以直接在条件中使用：
```javascript
db.students.find({ name: /imissyou/ });
```

### 个性化读取与字段筛选
#### 字段筛选
使用 MongoDB 的查询接口，可以指定需要返回或者排除的字段：
```javascript
// 0: 不需要的字段，1: 需要的字段
SongModel.find()
  .select({ _id: 0, title: 1 }) // 筛选掉_id字段，只返回title字段
  .exec(function (err, data) {
    if (err) throw err;
    console.log(data);
    mongoose.connection.close();
  });
```

#### 数据排序
使用 .sort() 方法可以按照指定的字段进行排序：
```javascript
// 1: 升序，-1: 降序
SongModel.find()
  .sort({ hot: 1 }) // 按hot字段升序排列
  .exec(function (err, data) {
    if (err) throw err;
    console.log(data);
    mongoose.connection.close();
  });
```

#### 数据截取
.skip() 和 .limit() 方法可以用来实现数据的分页截取：
```javascript
SongModel.find()
  .skip(10) // 跳过前10条数据
  .limit(10) // 限制返回10条数据
  .exec(function (err, data) {
    if (err) throw err;
    console.log(data);
    mongoose.connection.close();
  });
```

## Nest 操作 mongoose
### 初始化项目
创建项目：
```bash
nest new nest-mongoose -p npm
```
安装依赖：
```bash
cd nest-mongoose
npm install @nestjs/mongoose mongoose
npm install class-validator class-transformer
```
启动项目：
```bash
npm run start:dev
```

### 配置 MongooseModule
在 AppModule 中引入 MongooseModule 并配置数据库连接：
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/yun')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 定义 Dog 实体
使用 Nest CLI 创建 dog 模块，并排除测试文件：
```bash
nest g resource dog --no-spec
```
在 dog.entities.ts 中使用装饰器定义 Dog 实体：
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * 定义一个名为Dog的mongoose模式类，用于数据库中的狗的文档表示。
 */
@Schema()
export class Dog {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop([String])
  tags: string[];
}

// 定义Dog模式类的文档类型，这是mongoose处理后带有一些额外字段的Dog类实例。
export type DogDocument = HydratedDocument<Dog>;

// 创建并返回Dog模式的实例，供nestjs/mongoose使用。
export const DogSchema = SchemaFactory.createForClass(Dog);
```
HydratedDocument 只是在 Dog 类型的基础上加了一个 _id 属性：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710672948418-08ea48ee-5152-468f-9693-04aa52a8e22a.png#averageHue=%232c2c2b&clientId=u78be6067-8b0c-4&from=paste&height=173&id=ua95d8a80&originHeight=346&originWidth=1468&originalType=binary&ratio=2&rotation=0&showTitle=false&size=66438&status=done&style=none&taskId=ue22e5f1c-40db-4a5f-a90e-2019626dbe8&title=&width=734)

### DogModule 配置
在 dog.module.ts 中引入 DogSchema 并注册到 MongooseModule：
```typescript
import { Module } from '@nestjs/common';
import { DogService } from './dog.service';
import { DogController } from './dog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dog, DogSchema } from './entities/dog.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dog.name, schema: DogSchema }])],
  controllers: [DogController],
  providers: [DogService],
})
export class DogModule {}
```

### 定义数据传输对象（DTO）
在 create-dog.dto.ts 文件中定义创建 Dog 实体的数据验证规则：
```typescript
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateDogDto {
  // 狗狗的名字必须是字符串类型，不能为空，且长度至少为3个字符
  @IsString()
  @IsNotEmpty()
  @Length(3)
  name: string;

  // 狗狗的年龄必须是数字类型，且不能为空
  @IsNumber()
  @IsNotEmpty()
  age: number;

  // 狗狗的标签，以字符串数组形式存储
  tags: string[];
}
```

### DogService 实现
在 dog.service.ts 中实现 CRUD 操作：
```typescript
import { Injectable } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dog } from './entities/dog.entity';

/**
 * 提供对狗信息的增删改查服务
 */
@Injectable()
export class DogService {
  /**
   * 通过@InjectModel装饰器注入Dog模型
   */
  @InjectModel(Dog.name)
  private dogModel: Model<Dog>;

  /**
   * 创建一个新的狗记录
   * @param createDogDto 创建狗所需的DTO
   * @returns 返回创建的狗记录
   */
  create(createDogDto: CreateDogDto) {
    const dog = new this.dogModel(createDogDto);
    return dog.save();
  }

  /**
   * 查找所有狗记录
   * @returns 返回所有狗记录的数组
   */
  findAll() {
    return this.dogModel.find();
  }

  /**
   * 根据ID查找一个狗记录
   * @param id 狗的ID
   * @returns 返回找到的狗记录，如果没有找到则返回null
   */
  findOne(id: string) {
    return this.dogModel.findById(id);
  }

  /**
   * 根据ID更新一个狗记录
   * @param id 狗的ID
   * @param updateDogDto 更新狗所需的DTO
   * @returns 返回更新后的狗记录
   */
  update(id: string, updateDogDto: UpdateDogDto) {
    return this.dogModel.findByIdAndUpdate(id, updateDogDto);
  }

  /**
   * 根据ID删除一个狗记录
   * @param id 狗的ID
   * @returns 返回删除操作的结果
   */
  remove(id: string) {
    return this.dogModel.findByIdAndDelete(id);
  }
}
```

### DogController 修改
DogController 基本没变化，只是把 +d 改成 id：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710667205344-343d77b6-afc7-4387-98c8-2c9b213e0e85.png#averageHue=%232e2d2b&clientId=u1664cf14-4582-4&from=paste&height=439&id=u483ecfbd&originHeight=1256&originWidth=1448&originalType=binary&ratio=2&rotation=0&showTitle=false&size=178857&status=done&style=none&taskId=uaf83764f-c83a-4aee-9948-333166186bd&title=&width=506)

### postman 测试
#### 创建
使用 post 请求创建两个 dog：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710667248088-a56881ad-43b9-4a7e-9502-349167b0a99e.png#averageHue=%23fbfbfb&clientId=u1664cf14-4582-4&from=paste&height=335&id=u974589b0&originHeight=854&originWidth=1656&originalType=binary&ratio=2&rotation=0&showTitle=false&size=119673&status=done&style=none&taskId=u9f5b6b29-cb78-4a8d-b675-0b5297a59a7&title=&width=650)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710667305733-e9c6ba27-d7a0-4812-a531-2c915c0c031f.png#averageHue=%23f9f9f9&clientId=u1664cf14-4582-4&from=paste&height=471&id=u2721c3e2&originHeight=942&originWidth=724&originalType=binary&ratio=2&rotation=0&showTitle=false&size=89470&status=done&style=none&taskId=uf9574d3f-b848-41a0-acf9-43eb84fe090&title=&width=362)

#### 查询
get 请求查询全部：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710667487674-5a7501e9-6116-407e-a28a-d7f30cddbb9f.png#averageHue=%23fbfafa&clientId=u1664cf14-4582-4&from=paste&height=530&id=u7e622d8e&originHeight=1060&originWidth=778&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96119&status=done&style=none&taskId=ucd08a79f-222e-4462-b08c-08131aa1b81&title=&width=389)<br />查询下单个：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710667519635-1e908e13-624b-413e-a7a0-3e35c2a7f606.png#averageHue=%23f9f9f9&clientId=u1664cf14-4582-4&from=paste&height=361&id=u1d4f6641&originHeight=722&originWidth=936&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75715&status=done&style=none&taskId=ue00f9d76-8cad-4701-8e41-9ab343a4560&title=&width=468)

#### 修改
修改下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710667642490-621cd6db-0757-4a63-a170-3b34a8e00166.png#averageHue=%23fafafa&clientId=u1664cf14-4582-4&from=paste&height=521&id=uda983bbb&originHeight=1042&originWidth=912&originalType=binary&ratio=2&rotation=0&showTitle=false&size=99386&status=done&style=none&taskId=ufd246b9b-1776-4ac7-88fc-bea5cbfdbcf&title=&width=456)<br />在查询下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710667680595-0ca8a51b-218b-4611-8046-e626f608de44.png#averageHue=%23fbfafa&clientId=u1664cf14-4582-4&from=paste&height=533&id=ua3929644&originHeight=1066&originWidth=906&originalType=binary&ratio=2&rotation=0&showTitle=false&size=101704&status=done&style=none&taskId=u246cf8a1-5010-451b-9f71-82bd3402ce7&title=&width=453)

#### 删除
删除下大黄：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710667784861-5cc1fbf4-dc11-43d5-b8ef-a2503ae1193e.png#averageHue=%23f8f8f8&clientId=u1664cf14-4582-4&from=paste&height=322&id=u2cc0ccd0&originHeight=644&originWidth=912&originalType=binary&ratio=2&rotation=0&showTitle=false&size=70249&status=done&style=none&taskId=ubf103d32-1035-4858-b718-6814df80135&title=&width=456)<br />查询下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710667820674-0713c5b3-966f-44d9-8c60-b4ac2bd26698.png#averageHue=%23fafafa&clientId=u1664cf14-4582-4&from=paste&height=395&id=uc236b846&originHeight=790&originWidth=798&originalType=binary&ratio=2&rotation=0&showTitle=false&size=68232&status=done&style=none&taskId=uab72fc98-9bcc-4429-8b28-3c3221e363f&title=&width=399)<br />Mongodb Compass 里点击刷新，也能看到对应数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1710673268453-909c7a67-68e2-4e0a-88c1-3ca30c085189.png#averageHue=%23fdfdfd&clientId=u78be6067-8b0c-4&from=paste&height=481&id=u7143ff71&originHeight=962&originWidth=2848&originalType=binary&ratio=2&rotation=0&showTitle=false&size=173398&status=done&style=none&taskId=u5f5023f9-aecc-426b-b140-6b513bc6119&title=&width=1424)<br />这就是在 nest 里对 MongoDB 做 CRUD 的方式。

