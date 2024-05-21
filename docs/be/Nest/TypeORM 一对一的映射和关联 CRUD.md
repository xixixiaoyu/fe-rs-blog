## 数据库表关系
在数据库中，表与表之间存在不同类型的关系：

- 一对一关系：例如用户（User）与身份证（IdCard）之间的关系。
- 一对多关系：例如部门（Department）与员工（Employee）之间的关系。
- 多对多关系：例如文章（Article）与标签（Tag）之间的关系。

这些关系通常通过外键（Foreign Key）来维护，而多对多关系还需要建立一个中间表（Intermediate Table）。

## 一对一映射关系创建
TypeORM 是一个 ORM 框架，它将数据库的表、字段以及表之间的关系映射为实体类（Entity Class）、属性（Property）和实体之间的关系。<br />下面是如何在 TypeORM 中映射这些关系的操作步骤：

### 创建数据库 
```sql
create database typeorm_test;
```

### 初始化项目
初始化 TypeORM 项目： 
```bash
npx typeorm@latest init --name typeorm-relation-mapping --database mysql
```
安装驱动包 mysql2：
```bash
npm install mysql2
```

### 修改 DataSource 文件的配置
```typescript
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'xxx',
	database: 'typeorm_test',
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

### 启动项目
```bash
npm run start
```

### 创建身份证表（IdCard）
```bash
npx typeorm entity:create src/entity/IdCard
```

在 `IdCard` 实体中添加属性和映射信息：
```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'id_card' })
export class IdCard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        comment: '身份证号'
    })
    cardNumber: string;
}
```
在 DataSource 的 entities 里引入下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1715698836933-c21a6142-215f-4314-b991-22760ff25387.png#averageHue=%233b3d35&clientId=u7d03e353-d513-4&from=paste&height=161&id=ua40d412d&originHeight=290&originWidth=548&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=115583&status=done&style=none&taskId=ud1ade6ed-09bb-409f-8f22-60bba86bd81&title=&width=304.4444525094682)<br />重新 npm run start：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687593652101-786552c5-291f-4f90-8b7c-2ee9e69c8cee.png#averageHue=%23f4f4f3&clientId=udd4a6f01-1fa5-4&from=paste&height=296&id=u882ca09f&originHeight=930&originWidth=2800&originalType=binary&ratio=2&rotation=0&showTitle=false&size=286667&status=done&style=none&taskId=ufa162e2f-62f4-49ac-bfb8-2ce34fd5a17&title=&width=891)<br />现在 user 和 id_card 表都有了，怎么让它们建立一对一的关联呢？

### 建立一对一关联
切换 typeorm_test 数据库，把这两个表删除：
```sql
drop table id_card,user;
```
在 `IdCard` 实体中添加 `user` 属性，并使用 `@OneToOne` 和 `@JoinColumn` 装饰器来指定与 `User` 实体的一对一关系：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687594445085-5326bb0a-5f63-4325-a780-0af3e3fa573f.png#averageHue=%23332f2b&clientId=udd4a6f01-1fa5-4&from=paste&height=358&id=u1c4a400e&originHeight=906&originWidth=598&originalType=binary&ratio=2&rotation=0&showTitle=false&size=78884&status=done&style=none&taskId=u72876202-b14d-484c-8f26-96b95d647d8&title=&width=236)<br />如果用 `@JoinColumn({ name: 'user_id' })` 会告诉 TypeORM 使用 `user_id` 作为外键列的名称，而不是默认的 `userId`。<br />一对一关系的外键列可以放在任何一方，通常，外键列放置在访问最频繁的那一方。<br />外键列放在哪一方，那一方就是拥有关系的一方（也称为拥有者方）。拥有者方负责维护关系，包括外键的更新和删除。

重新 npm run start 后，在 workbench 里看下：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714576377613-083447c6-51b7-4788-b895-057a0d30ea89.png#averageHue=%23f4f2f1&clientId=u16d5b91f-e132-4&from=paste&height=179&id=u20e7e77b&originHeight=322&originWidth=1644&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=102136&status=done&style=none&taskId=u1d8c266f-c3b2-4fb2-a2f7-7ccc1ff71f4&title=&width=913.3333575284046)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687594777179-5335c0a2-6c2a-4a8e-8356-2e4e4ffd41b2.png#averageHue=%23f2f2f2&clientId=udd4a6f01-1fa5-4&from=paste&height=152&id=u726a178e&originHeight=334&originWidth=2170&originalType=binary&ratio=2&rotation=0&showTitle=false&size=93911&status=done&style=none&taskId=u0411eee7-068f-4c49-90ee-3fb4ce46216&title=&width=990)<br />多出了 `userId` 外键列与 user 表相连。

### 级联操作
级联关系还是默认的：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687594887854-f6ffb70b-c305-41c6-b508-75a2092ec588.png#averageHue=%23e1e1e1&clientId=udd4a6f01-1fa5-4&from=paste&height=50&id=u77e08e48&originHeight=100&originWidth=434&originalType=binary&ratio=2&rotation=0&showTitle=false&size=11150&status=done&style=none&taskId=u361c0e8f-7f5e-45f6-8083-223a354b9be&title=&width=217)<br />如果我们想设置 CASCADE ，可以在第二个参数指定：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687594926250-8a273831-da77-43bb-a9a0-ed5aff7d2fda.png#averageHue=%233e453b&clientId=udd4a6f01-1fa5-4&from=paste&height=176&id=u1c424603&originHeight=464&originWidth=1180&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48337&status=done&style=none&taskId=ua5885411-ab51-49f1-a0e3-f5ba725bc70&title=&width=447)<br />我们可以将其设置为 CASCADE。

## 一对一映射关系增删改查
### 增加
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687595455993-4143de19-fbc6-4637-921f-1abb3ed5eeaa.png#averageHue=%232f2d2b&clientId=udd4a6f01-1fa5-4&from=paste&height=486&id=u7bd3ba37&originHeight=1018&originWidth=1050&originalType=binary&ratio=2&rotation=0&showTitle=false&size=165749&status=done&style=none&taskId=uec739c0b-f611-4cc9-80a0-627567dbd5c&title=&width=501)<br />创建 `User` 和 `IdCard` 对象，建立关联后保存。先保存 user，再保存 idCard。<br />npm run start 后，数据都插入成功了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687595617408-4288fa78-9e00-43b8-9335-696f92f6fb1a.png#averageHue=%23f2f2f2&clientId=udd4a6f01-1fa5-4&from=paste&height=221&id=u640d75a8&originHeight=442&originWidth=618&originalType=binary&ratio=2&rotation=0&showTitle=false&size=57182&status=done&style=none&taskId=u133ea1a2-b5a4-41b5-a61e-83782891423&title=&width=309)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687595647204-184008cd-e6bf-4928-b313-ecef792f2129.png#averageHue=%23f4f3f0&clientId=udd4a6f01-1fa5-4&from=paste&height=204&id=u9932f3c6&originHeight=408&originWidth=650&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51984&status=done&style=none&taskId=ud21d17f4-0ac3-4d25-b583-23e59f69ce3&title=&width=325)<br />上面保存还要分别保存 user 和 idCard，能不能自动按照关联关系来保存呢？<br />可以的，在 @OneToOne 那里指定 cascade 为 true：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714541936815-0b6c3b80-e641-4ff8-a81a-f20dc28a58dc.png#averageHue=%23645135&clientId=u3b8bd227-3855-4&from=paste&height=182&id=u006781b7&originHeight=328&originWidth=464&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=107778&status=done&style=none&taskId=u7e53ab9a-56ef-4b70-9d5f-658c1090b4b&title=&width=257.777784606557)<br />这样我们就不用自己保存 user 了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687598992889-137b49ff-19fd-4b55-bfb4-f693fce7b407.png#averageHue=%23312e2c&clientId=udd4a6f01-1fa5-4&from=paste&height=315&id=ueb5f8fb8&originHeight=794&originWidth=1068&originalType=binary&ratio=2&rotation=0&showTitle=false&size=122272&status=done&style=none&taskId=uf85a3882-7516-418f-9b8a-416fa5b5eda&title=&width=424)

### 查询
使用 `find` 方法或 `QueryBuilder` 来查询数据，可以通过指定 `relations` 参数来实现关联查询：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687599659950-619f1310-3a8c-444c-9769-61615508e893.png#averageHue=%232e2d2b&clientId=udd4a6f01-1fa5-4&from=paste&height=230&id=u519c0a19&originHeight=538&originWidth=1348&originalType=binary&ratio=2&rotation=0&showTitle=false&size=73247&status=done&style=none&taskId=ue4493ffd-6f35-497b-b60a-f7c2f07ad41&title=&width=577)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687599312693-40c85103-e82b-4ca6-9197-25a15ac76bc3.png#averageHue=%23303030&clientId=udd4a6f01-1fa5-4&from=paste&height=167&id=u34892e43&originHeight=334&originWidth=946&originalType=binary&ratio=2&rotation=0&showTitle=false&size=32496&status=done&style=none&taskId=u6498c24b-8285-46f9-aa82-d52007a89f3&title=&width=473)

`QueryBuilder`进行更复杂查询：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687599719184-06489eaf-c129-4897-91b4-a952b55ada6e.png#averageHue=%23322f2c&clientId=udd4a6f01-1fa5-4&from=paste&height=255&id=ud4944b78&originHeight=586&originWidth=1032&originalType=binary&ratio=2&rotation=0&showTitle=false&size=92375&status=done&style=none&taskId=uf4f6d379-c89f-418b-ab89-55da2f1f7e8&title=&width=449)<br />先 getRepository 拿到操作 IdCard 的 Repository 对象。<br />再创建 queryBuilder 来连接查询，给 idCard 起个别名 ic，然后连接的是 ic.user，起个别名为 u：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687599312693-40c85103-e82b-4ca6-9197-25a15ac76bc3.png#averageHue=%23303030&clientId=udd4a6f01-1fa5-4&from=paste&height=145&id=k70ns&originHeight=334&originWidth=946&originalType=binary&ratio=2&rotation=0&showTitle=false&size=32496&status=done&style=none&taskId=u6498c24b-8285-46f9-aa82-d52007a89f3&title=&width=410)<br />或者也可以直接用 EntityManager 创建 queryBuilder 来连接查询：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687599837349-a3a190e2-ac65-419d-85f6-70430ca7f40a.png#averageHue=%2332302d&clientId=udd4a6f01-1fa5-4&from=paste&height=211&id=u733a34f9&originHeight=476&originWidth=1032&originalType=binary&ratio=2&rotation=0&showTitle=false&size=84238&status=done&style=none&taskId=u25a79e2f-51a0-4e8a-ba90-33dc521ed32&title=&width=457)<br />查询的结果是一样的。

### 修改
我们来修改下数据，数据长这样：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687599970505-d425c81f-8fc2-4062-a219-e0ec23a26aec.png#averageHue=%23f3f3f0&clientId=udd4a6f01-1fa5-4&from=paste&height=223&id=ub56d5332&originHeight=446&originWidth=632&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63436&status=done&style=none&taskId=u1fbdeb5b-785b-4038-b2d8-52e15d210eb&title=&width=316)![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687599987677-9153000a-bac8-431f-94ba-5843971c2524.png#averageHue=%23f3f3f3&clientId=udd4a6f01-1fa5-4&from=paste&height=208&id=u067eec1c&originHeight=416&originWidth=668&originalType=binary&ratio=2&rotation=0&showTitle=false&size=50338&status=done&style=none&taskId=udef2134b-5c85-4279-a6cb-d8e6da4e716&title=&width=334)<br />我们给它加上 id 再 save：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687600096558-3ae6e062-48a2-4679-a56b-3f0b4952f8b3.png#averageHue=%232e2d2b&clientId=udd4a6f01-1fa5-4&from=paste&height=377&id=u009b44e2&originHeight=858&originWidth=1054&originalType=binary&ratio=2&rotation=0&showTitle=false&size=116862&status=done&style=none&taskId=u37d6d48d-b345-49c2-b1c2-0ef1a1f02eb&title=&width=463)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687600118029-df5ed230-2b49-4e5e-bf0a-0b2d3ac98b6e.png#averageHue=%23f3f3f0&clientId=udd4a6f01-1fa5-4&from=paste&height=221&id=uc0561c58&originHeight=442&originWidth=632&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61667&status=done&style=none&taskId=ue319f722-7c18-48f5-95cc-705a1dc253a&title=&width=316)![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687600134020-9a40ab28-ff4a-4aa7-94a4-5e70f7e7db8f.png#averageHue=%23f3f3f3&clientId=udd4a6f01-1fa5-4&from=paste&height=203&id=uc4868f1e&originHeight=406&originWidth=648&originalType=binary&ratio=2&rotation=0&showTitle=false&size=47526&status=done&style=none&taskId=ud9b66ea6-ebf1-4864-88e8-7f687669233&title=&width=324)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687600155336-c086e717-172f-4a8c-8987-af55cdeb2793.png#averageHue=%233c3c3c&clientId=udd4a6f01-1fa5-4&from=paste&height=54&id=ub7ead337&originHeight=108&originWidth=1764&originalType=binary&ratio=2&rotation=0&showTitle=false&size=38681&status=done&style=none&taskId=ue0c9a01f-6652-455b-a356-46308224b35&title=&width=882)<br />可以看到在一个事务内，执行了两条 update 的 sql。

### 删除
如果设置了外键的 `onDelete` 为 `cascade`，删除 `User` 实体时，关联的 `IdCard` 实体也会被自动删除：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687600207200-afbaeb12-df06-4795-a1b4-9f371f43e925.png#averageHue=%23312f2c&clientId=udd4a6f01-1fa5-4&from=paste&height=130&id=uf5a39156&originHeight=260&originWidth=1128&originalType=binary&ratio=2&rotation=0&showTitle=false&size=50576&status=done&style=none&taskId=u49ebf0aa-ea04-4730-b0d0-ca17d129841&title=&width=564)<br />如果没有设置级联删除，需要手动删除关联的实体：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687600243194-99f9b4f5-f70a-4267-86ef-76dde8a819e2.png#averageHue=%232e2c2b&clientId=udd4a6f01-1fa5-4&from=paste&height=318&id=u5c9b3d1b&originHeight=748&originWidth=1482&originalType=binary&ratio=2&rotation=0&showTitle=false&size=120150&status=done&style=none&taskId=u039cfa5b-b1ab-46bf-8e06-ec77fee7730&title=&width=631)

## 反向关系
如果现在想在 user 里访问 idCard 呢？<br />同样需要加一个 @OneToOne 的装饰器：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687600819919-5f649095-8f6d-451c-a9da-ffad1e2ffda2.png#averageHue=%23302e2b&clientId=udd4a6f01-1fa5-4&from=paste&height=365&id=u136ab208&originHeight=908&originWidth=1116&originalType=binary&ratio=2&rotation=0&showTitle=false&size=86826&status=done&style=none&taskId=u6cfd6fcd-95a2-4e2f-842a-2ccfd9e5463&title=&width=448)<br />需要通过第二个参数告诉 typeorm，外键是另一个 Entity 的哪个属性。<br />我们查一下试试：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687600857744-5575a8df-eb5f-4296-abfe-39eeb6bb2e9c.png#averageHue=%232e2d2b&clientId=udd4a6f01-1fa5-4&from=paste&height=244&id=u4b91abc1&originHeight=528&originWidth=1344&originalType=binary&ratio=2&rotation=0&showTitle=false&size=73439&status=done&style=none&taskId=ue9de5ed2-e75a-4c7f-972d-b84fac4a639&title=&width=621)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687600891080-490fd16f-9b18-4f88-bfe9-f74db8831544.png#averageHue=%23303030&clientId=udd4a6f01-1fa5-4&from=paste&height=223&id=uef289542&originHeight=446&originWidth=658&originalType=binary&ratio=2&rotation=0&showTitle=false&size=33774&status=done&style=none&taskId=u79df2b9f-cc6e-45e4-8b6b-1640f535125&title=&width=329)<br />可以看到，同样关联查询成功了。<br />这就是一对一关系的映射和增删改查。
