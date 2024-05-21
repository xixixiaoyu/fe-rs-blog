## TypeORM 基础回顾
- DataSource 配置：包含数据库连接的详细信息，如用户名、密码、驱动、连接池等。
- Entity 映射：利用装饰器（如 @Entity, @PrimaryGeneratedColumn, @Column）定义数据库表结构。
- 关系映射：通过 @OneToOne, @OneToMany, @ManyToMany 等装饰器定义表间关系。
- 初始化与操作：DataSource.initialize 建立连接和表，EntityManager 负责实体的 CRUD 操作。

## nest 结合 typeorm
### 初始化环境
创建 Nest 项目：
```bash
nest new nest-typeorm -p npm
```
然后创建一个 crud 的模块：
```bash
nest g resource user
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714579782404-81d08eff-9a41-4e42-a0f2-45b6d5d9d272.png#averageHue=%2342413f&clientId=u2312f7f8-af12-4&from=paste&height=53&id=uadeb0f98&originHeight=96&originWidth=962&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=26336&status=done&style=none&taskId=uc2b28fe2-96ff-431f-ab25-e325c933cab&title=&width=534.4444586023876)<br />引入 mysql、typeorm：
```bash
npm install @nestjs/typeorm typeorm mysql2
```
@nestjs/typeorm 就是把 typeorm api 封装了一层。<br />引入动态模块 TypeOrmModule，使用 forRoot 方法进行全局注册，只需配置一次即可在任何地方使用，TypeOrmModule 是全局模块，这样就无需在每个模块中重复导入：
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'xxx',
      database: 'typeorm_test',
      synchronize: true,
      logging: true,
      entities: [User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
然后在 User 的 Entity 里加一些映射的信息：
```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'nest_user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'nest_name',
    length: 50,
  })
  name: string;
}
```
给映射的表给个名字叫 nest_user，然后有两个数据库列，分别是 id 和 nest_name。<br />运行：
```bash
npm run start:dev
```
在 workbench 看下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714580074724-b62b6dd3-494d-4113-83bd-e10fcc1cb3ed.png#averageHue=%2332302f&clientId=u2312f7f8-af12-4&from=paste&height=160&id=u13038927&originHeight=288&originWidth=386&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=23637&status=done&style=none&taskId=u8efbaa49-7465-45f2-bef4-0601fead866&title=&width=214.44445012528234)

### CRUD 操作
然后是增删改查，我们可以注入 EntityManager 来做：
```typescript
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private manager: EntityManager;

  create(createUserDto: CreateUserDto) {
    this.manager.save(User, createUserDto);
  }

  findAll() {
    return this.manager.find(User);
  }

  findOne(id: number) {
    return this.manager.findOne(User, {
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.manager.save(User, {
      id: id,
      ...updateUserDto,
    });
  }

  remove(id: number) {
    this.manager.delete(User, id);
  }
}
```
UserController 代码如下：
```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
```
我们使用 postman 发送 post 请求携带数据测试一下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714581711401-050c79eb-6291-4e39-8e9a-844fc6a07074.png#averageHue=%23272727&clientId=u2312f7f8-af12-4&from=paste&height=204&id=u600d413c&originHeight=368&originWidth=2292&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=57318&status=done&style=none&taskId=u68d7df2c-45dc-4f3f-95b8-e7087b8f53a&title=&width=1273.333367065148)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714581724378-3fe52d39-66fd-489d-a6ea-ea08c964bd57.png#averageHue=%23202020&clientId=u2312f7f8-af12-4&from=paste&height=254&id=ue9563be0&originHeight=458&originWidth=722&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=32702&status=done&style=none&taskId=u3f3f7a45-95ea-4151-be25-f989bf2f2fb&title=&width=401.1111217369271)


再试试查询：<br />全部查询：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714581765571-83e6f3ff-c1f3-4421-bb1e-6c29d3ae6034.png#averageHue=%23272727&clientId=u2312f7f8-af12-4&from=paste&height=382&id=ue3216f56&originHeight=688&originWidth=488&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=45570&status=done&style=none&taskId=uc16cdd45-9461-4d10-a043-dbb6b609bf0&title=&width=271.11111829310306)<br />单个查询：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714581793719-8e9d53ac-f3ba-47e0-95ff-17c2d9139eda.png#averageHue=%23272727&clientId=u2312f7f8-af12-4&from=paste&height=340&id=u6770fa88&originHeight=612&originWidth=516&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=44179&status=done&style=none&taskId=u299949a0-7355-478b-97e4-151559c56ed&title=&width=286.66667426074014)

再就是修改：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714581831199-092956cb-f7f9-45b9-bd0f-42f770fa26e2.png#averageHue=%23272727&clientId=u2312f7f8-af12-4&from=paste&height=204&id=ud2376ee6&originHeight=368&originWidth=496&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=28240&status=done&style=none&taskId=ufbe2fa6a-e36d-4ac1-9118-60545966215&title=&width=275.5555628552851)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714581845873-395eb874-cbb4-4eb0-b24e-0cd857605418.png#averageHue=%23272726&clientId=u2312f7f8-af12-4&from=paste&height=253&id=udadde135&originHeight=456&originWidth=706&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=47146&status=done&style=none&taskId=ua29e6868-d21c-4426-83b7-6f067d2a141&title=&width=392.22223261256306)

试试删除：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714581870098-c6163ad1-83c5-4315-bf0f-94dddbe54e8f.png#averageHue=%232c2a2a&clientId=u2312f7f8-af12-4&from=paste&height=40&id=u3916e65f&originHeight=72&originWidth=512&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=6762&status=done&style=none&taskId=u2372c9d5-1870-410a-8d1a-3d1b61dc41b&title=&width=284.4444519796491)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714581882994-47201a5d-364d-4ef4-ad32-92035a1d481a.png#averageHue=%23262626&clientId=u2312f7f8-af12-4&from=paste&height=258&id=uda997cb9&originHeight=464&originWidth=712&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=36115&status=done&style=none&taskId=u43d7a2cb-c23a-4a6a-8d04-85302257458&title=&width=395.55556603419956)<br />至此，我们就正式打通了从请求到数据库的整个流程！

## **使用 Repository 简化数据操作**
我们上面是通过 @InjectEntityManager 来注入的 entityManager 对象。<br />直接用 EntityManager 的缺点是每个 api 都要带上对应的 Entity：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687794092239-665c121f-fe30-4bdb-b10b-a3191262dd71.png#averageHue=%232f2d2b&clientId=u33c61e3b-bb39-4&from=paste&height=540&id=u7caff210&originHeight=1562&originWidth=1142&originalType=binary&ratio=2&rotation=0&showTitle=false&size=170880&status=done&style=none&taskId=uaf110df8-363c-4469-a16e-27deadb6e7d&title=&width=395)<br />可以先 getRepository(User) 拿到 user 对应的 Repository 对象，再调用这些方法。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687794182262-26258165-beeb-49c0-9641-905efaf1ede0.png#averageHue=%23312f2d&clientId=u33c61e3b-bb39-4&from=paste&height=239&id=ub9349e03&originHeight=478&originWidth=1244&originalType=binary&ratio=2&rotation=0&showTitle=false&size=87988&status=done&style=none&taskId=ue620185b-a95f-468c-b8ef-93e81727a49&title=&width=622)

若需要使用特定实体的 Repository，可以通过 forFeature 方法将实体注入对应模块，便于进行 CRUD 操作：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687794551595-46d47419-4909-42ba-8673-a49546111842.png#averageHue=%23302e2b&clientId=u33c61e3b-bb39-4&from=paste&height=285&id=u3ba7878b&originHeight=638&originWidth=1116&originalType=binary&ratio=2&rotation=0&showTitle=false&size=127326&status=done&style=none&taskId=u08f1a474-9a0c-47af-930e-c15dfe4a1a5&title=&width=498)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687794376276-434ae941-82fa-4f6a-8c91-3d352895c6db.png#averageHue=%23cd8336&clientId=u33c61e3b-bb39-4&from=paste&height=370&id=u875c2078&originHeight=1188&originWidth=1592&originalType=binary&ratio=2&rotation=0&showTitle=false&size=199113&status=done&style=none&taskId=uc2d942fa-019f-4050-a787-ed0fe9b990b&title=&width=496)<br />它有的方法和 EntityManager 一样，只能用来操作当前 Entity。<br />还可以注入 DataSource：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687794807945-096ca707-3c6b-4200-927e-97e3b3891733.png#averageHue=%23c67d34&clientId=u33c61e3b-bb39-4&from=paste&height=360&id=u8afdad78&originHeight=922&originWidth=1392&originalType=binary&ratio=2&rotation=0&showTitle=false&size=164138&status=done&style=none&taskId=u78b9cdcc-b271-4ec4-ba39-d5aead7795e&title=&width=543)<br />不过这个不常用。<br />这就是 Nest 里集成 TypeOrm 的方式。
