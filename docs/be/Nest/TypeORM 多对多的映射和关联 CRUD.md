## 实体关系映射
### 一对一关系

- 使用 @OneToOne 和 @JoinColumn 注解来映射实体到数据库表，转换为表之间的外键关联。

### 一对多关系

- 通过 @OneToMany 和 @ManyToOne 注解实现，不需要使用 @JoinColumn 指定外键列，因为外键自然存在于“多”的一方。

### 多对多关系

- 多对多关系通过中间表实现，通过 @ManyToMany 注解，可以将多对多关系拆解为两个一对多关系：

![](https://cdn.nlark.com/yuque/0/2024/jpeg/21596389/1714553039031-65ba056e-19fd-48a3-b22e-46970837b5dc.jpeg)

## 多对多实体操作
### 初始化项目和配置数据库
```bash
npx typeorm@latest init --name typeorm-relation-mapping --database mysql
cd typeorm-relation-mapping
npm install mysql2
```

### 配置文件（data-source.ts）修改
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

### 创建实体生成表
这次我们创建 Article 和 Tag 两个实体：
```bash
npx typeorm entity:create src/entity/Article
npx typeorm entity:create src/entity/Tag
```
添加一些属性：
```typescript
// Article 实体
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
        comment: '文章标题'
    })
    title: string;

    @Column({
        type: 'text',
        comment: '文章内容'
    })
    content: string;
}

// Tag 实体
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    name: string;
}
```
data-source.ts 引入这两个 Entity：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687612979994-163732c7-47c5-42e4-8344-39e26a684371.png#averageHue=%232e2c2b&clientId=u93ffe049-0d80-4&from=paste&height=105&id=u4c596362&originHeight=210&originWidth=556&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22687&status=done&style=none&taskId=u8504eedd-e2a5-4c00-97ad-a6f86d2135c&title=&width=278)<br />把 index.ts 的代码去掉：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687613003594-013d9224-0dfa-4aa1-853d-b36e09a87fb7.png#averageHue=%23312f2c&clientId=u93ffe049-0d80-4&from=paste&height=114&id=u6f078904&originHeight=272&originWidth=990&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48213&status=done&style=none&taskId=ufa7de06c-abac-4153-ae57-61a27e6ee09&title=&width=415)<br />然后 npm run start：<br />可以看到它生成了两个表：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714564362176-d4ba5e7d-01ad-4d4f-9885-efe9bd8e56d4.png#averageHue=%2330302f&clientId=ub5d21632-8266-4&from=paste&height=347&id=u3037f945&originHeight=624&originWidth=898&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=188101&status=done&style=none&taskId=u454199a7-4445-4230-8fe1-cc08eb834eb&title=&width=498.88890210493145)<br />我们将其删除，然后来添加多对多的关联关系。

### 配置多对多关系
通过 @ManyToMany 关联，比如一篇文章可以有多个标签：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714564828316-5b56029b-ac51-4568-b58d-dd2d26362790.png#averageHue=%23272523&clientId=ub5d21632-8266-4&from=paste&height=609&id=ub151b7ab&originHeight=1096&originWidth=580&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=91623&status=done&style=none&taskId=u91166951-a019-4a21-ab6b-654a7bede8e&title=&width=322.22223075819625)<br />然后 npm run start：<br />会建三张表：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714564881966-14e27d97-4a0f-4531-98f1-65654c1c316f.png#averageHue=%23333332&clientId=ub5d21632-8266-4&from=paste&height=84&id=ub985445b&originHeight=152&originWidth=334&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=19512&status=done&style=none&taskId=u43bd748f-47ec-405f-badc-179b909955d&title=&width=185.55556047109923)<br />中间表 article_my_tags_tag 还有 2 个外键分别引用着两个表：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714564913585-0407e887-5d4c-4632-98b9-2a6431c44fc0.png#averageHue=%232d2d2d&clientId=ub5d21632-8266-4&from=paste&height=31&id=ud15f29d8&originHeight=56&originWidth=278&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=6565&status=done&style=none&taskId=uf5bc193e-95c7-4b5d-b93c-e1904d786ae&title=&width=154.4444485358251)<br />级联删除和级联更新都是 CASCADE，也就是说这两个表的记录删了，那它在中间表中的记录也会跟着被删：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714564724776-9469a680-fdf8-49d6-a015-a7160053103e.png#averageHue=%23333333&clientId=ub5d21632-8266-4&from=paste&height=172&id=u6f98f20a&originHeight=310&originWidth=1746&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=107099&status=done&style=none&taskId=ubb345d13-dc03-4baa-a34a-98ef9794a8f&title=&width=970.0000256962253)<br />也可以自己指定中间表的名字：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714564963399-47a4f0bb-b025-47bf-92cd-4bda1432532c.png#averageHue=%232b2824&clientId=ub5d21632-8266-4&from=paste&height=148&id=u391d4885&originHeight=266&originWidth=472&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=27266&status=done&style=none&taskId=u6b355d31-a9fe-4843-a893-0deb096dd4d&title=&width=262.22222916873903)

### 插入
```typescript
import { AppDataSource } from './data-source';
import { Article } from './entity/Article';
import { Tag } from './entity/Tag';

AppDataSource.initialize()
	.then(async () => {
		const article1 = new Article();
		article1.title = '标题一';
		article1.content = '内容一';

		const article2 = new Article();
		article2.title = '标题二';
		article2.content = '内容二';

		const tag1 = new Tag();
		tag1.name = '标签1';
		const tag2 = new Tag();
		tag2.name = '标签2';
		const tag3 = new Tag();
		tag3.name = '标签3';

    // 文章1 有两个 tag
		article1.myTags = [tag1, tag2];
    // 文章2 有三个 tag
		article2.myTags = [tag1, tag2, tag3];

		const entityManager = AppDataSource.manager;
		await entityManager.save([tag1, tag2, tag3]);
		await entityManager.save([article1, article2]);
	})
	.catch(error => console.log(error));
```
创建了两篇文章，3 个标签，建立它们的关系之后，会先保存所有的 tag，再保存 article。<br />npm run start 可以看到，3 个标签、2 篇文章，还有两者的关系，都插入成功了：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714565315799-5536c885-c765-46b9-9ca9-9a0167e55fee.png#averageHue=%23272727&clientId=ub5d21632-8266-4&from=paste&height=269&id=ue7e16343&originHeight=484&originWidth=706&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=58977&status=done&style=none&taskId=u9bb6fd18-f253-4613-83c6-afe9afc1435&title=&width=392.22223261256306)![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714565326049-9ae47624-6818-4b7c-a99d-a52c43594812.png#averageHue=%23282828&clientId=ub5d21632-8266-4&from=paste&height=267&id=u7d0b3e09&originHeight=516&originWidth=606&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=55621&status=done&style=none&taskId=u5d1575b2-835c-4a82-abc4-7035a628521&title=&width=313.66668701171875)![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714565341351-e64f4a6d-49a4-47d7-b50a-0532188f91d3.png#averageHue=%23282828&clientId=ub5d21632-8266-4&from=paste&height=262&id=u39ba93b2&originHeight=572&originWidth=744&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=61572&status=done&style=none&taskId=u5d731e6d-4e7f-4f19-b659-7313e68203d&title=&width=340.3298645019531)


### 查询
```typescript
const entityManager = AppDataSource.manager;

const article = await entityManager.find(Article, {
  relations: {
    myTags: true,
  },
});

console.log(article);
console.log(article.map(item => item.myTags));
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714565429167-0a6f4015-e7f9-4437-871f-98d5b7c0c275.png#averageHue=%23252525&clientId=ub5d21632-8266-4&from=paste&height=393&id=u64f2a52f&originHeight=708&originWidth=1054&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=68150&status=done&style=none&taskId=u9d529844-9575-4d44-9052-d097c6def8a&title=&width=585.5555710674809)<br />也可以手动用查询构建器（query builder）来获取数据，结果是一样的：
```typescript
const entityManager = AppDataSource.manager;

const article = await entityManager
  .createQueryBuilder(Article, 'a')
  .leftJoinAndSelect('a.myTags', 't')
  .getMany();

console.log(article);
console.log(article.map(item => item.myTags));
```
或者先拿到 Article 的 Repository 再创建 query builder 来查询也行：
```typescript
const entityManager = AppDataSource.manager;

const article = await entityManager
  .getRepository(Article)
  .createQueryBuilder('a')
  .leftJoinAndSelect('a.myTags', 't')
  .getMany();

console.log(article);
console.log(article.map(item => item.myTags));
```


### 更新
如果需要更新文章的标题和标签：
```typescript
const entityManager = AppDataSource.manager;

// 查询ID为2的文章，并包含其标签关系
const articleToUpdate = await entityManager.findOne(Article, {
  where: { id: 2 },
  relations: { myTags: true },
});
// 更新文章标题
articleToUpdate.title = '新标题';
// 筛选包含"标签1"的标签
articleToUpdate.myTags = articleToUpdate.myTags.filter(tag =>
  tag.name.includes('标签1')
);
// 保存更新后的文章
await entityManager.save(articleToUpdate);
```
运行后：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714565824425-9b18fe93-a02a-40ce-a59f-3b375f02e5d1.png#averageHue=%23232323&clientId=ub5d21632-8266-4&from=paste&height=274&id=u81061dc3&originHeight=494&originWidth=692&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=40289&status=done&style=none&taskId=u796f55af-2e95-4d4a-b3e8-01261c84555&title=&width=384.4444546287445)![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714565868758-45cb99cc-57ed-4c21-a21d-82ffa4e2c1dd.png#averageHue=%23282827&clientId=ub5d21632-8266-4&from=paste&height=268&id=u4824caa3&originHeight=516&originWidth=740&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=54772&status=done&style=none&taskId=u4b7df6d2-621b-470a-af45-ef1302c442f&title=&width=384.11114501953125)<br />articleId 为 2 的新标题对应的 tagId 就只有 1 个了。

### 删除
对于删除操作，由于设置了 CASCADE 级联删除，删除文章或标签时相关的关联记录也会被自动删除：
```typescript
// 删除ID为1的文章记录
await entityManager.delete(Article, 1);
// 删除ID为1的标签记录
await entityManager.delete(Tag, 1);
```
第一行代码执行后：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714566174971-10ccdb5c-a1b2-462b-a5b0-e2605765cad0.png#averageHue=%23272626&clientId=ub5d21632-8266-4&from=paste&height=251&id=Oj4f8&originHeight=452&originWidth=664&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=37922&status=done&style=none&taskId=uc63bd0c0-e921-4616-a675-b85f77267d8&title=&width=368.8888986611075)![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714566245524-2478abe1-8e20-447f-af7f-cd4da8f86fa7.png#averageHue=%23222222&clientId=ub5d21632-8266-4&from=paste&height=256&id=u3fa90060&originHeight=514&originWidth=598&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=35715&status=done&style=none&taskId=u74fa1e3a-517f-41f5-b7a0-d0e402fbbc5&title=&width=298.22222900390625)![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714566214091-0a101e2c-30ab-401f-a679-d3149ea4671b.png#averageHue=%23272727&clientId=ub5d21632-8266-4&from=paste&height=252&id=u69b3a37c&originHeight=462&originWidth=742&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=48992&status=done&style=none&taskId=u134c04e8-ca66-4c07-a279-9a29958052d&title=&width=405.2153015136719)<br />可以看到 article 表和中间表对应的数据都被删除。<br />第二行代码执行后：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714566363349-dde593ce-2397-4224-ab72-503e1cc14d8f.png#averageHue=%23212121&clientId=ub5d21632-8266-4&from=paste&height=260&id=ue855a938&originHeight=468&originWidth=664&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=35842&status=done&style=none&taskId=u42eb10eb-6902-411f-a1b5-ea09974ef76&title=&width=368.8888986611075)![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714566373138-0a4e9f3c-fb11-47f9-a499-b0e06f779099.png#averageHue=%23272727&clientId=ub5d21632-8266-4&from=paste&height=256&id=u888d7bc1&originHeight=488&originWidth=622&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=40428&status=done&style=none&taskId=u6b435bb3-7bb8-4b03-80c7-06b14865493&title=&width=326.5555725097656)![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714566389616-e594aba9-8e5b-4e7c-8917-e7a2d3656ea8.png#averageHue=%23262626&clientId=ub5d21632-8266-4&from=paste&height=256&id=u9e7841b4&originHeight=460&originWidth=744&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=33957&status=done&style=none&taskId=u0d4a903c-259d-4a00-b0fc-9e555014cda&title=&width=413.3333442829276)<br />此时中间表的数据已经清空，代表两张表没有关联的内容了。

## 反向引用
如果 tag 里也想有文章的引用呢？那就再加一个 @ManyToMany 的映射属性：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714575232522-f8bc07f1-cf33-4c3f-a4fc-5ee0ff3ba0de.png#averageHue=%23252322&clientId=ub8ab4bc6-f7d5-4&from=paste&height=379&id=ub4f68e03&originHeight=682&originWidth=1186&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=71363&status=done&style=none&taskId=u5bb7772a-4c88-4c5c-969a-76bd6c5ac98&title=&width=658.8889063434841)<br />需要第二个参数指定外键列在哪里。

article 里也要加：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714575268423-5f828b9b-1c8f-4898-a57f-8508ae9e92dc.png#averageHue=%23272523&clientId=ub8ab4bc6-f7d5-4&from=paste&height=153&id=ufd757e48&originHeight=276&originWidth=944&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=35824&status=done&style=none&taskId=uad3dfeae-86bb-4ef5-bc35-635ea4c8098&title=&width=524.4444583374781)<br />因为多对多的时候，双方都不维护外键，所以都需要第二个参数来指定外键列在哪里，怎么找到当前 Entity。

然后我们通过 tag 来关联查询下：
```typescript
const entityManager = AppDataSource.manager;

const tags = await entityManager.find(Tag, {
  relations: {
    myArticles: true,
  },
});

console.log(tags);
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714576225796-0eb0c3c1-1c63-4609-9d13-4b39fca1f3e8.png#averageHue=%232d2c2b&clientId=ub8ab4bc6-f7d5-4&from=paste&height=73&id=uaa8f8d02&originHeight=132&originWidth=754&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=19958&status=done&style=none&taskId=u6937a280-c6df-4524-b9e7-26cc9d2badc&title=&width=418.88889998565514)<br />成功关联查出来。

话说回来，之前一对一的时候， user 那方不维护外键，所以需要第二个参数来指定通过哪个外键找到 user：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687616719014-acd3240b-d65a-430d-9277-e34498069122.png#averageHue=%23302e2b&clientId=u93ffe049-0d80-4&from=paste&height=375&id=ub70f0634&originHeight=908&originWidth=1054&originalType=binary&ratio=2&rotation=0&showTitle=false&size=87370&status=done&style=none&taskId=u9d2647f4-92ea-4bf3-9743-e8370bb91c6&title=&width=435)

一对多，一对应的 department 那方，不维护外键，所以需要第二个参数来指定通过哪个外键找到 department：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687616799537-5a6748e1-f1fb-4242-84d6-6273ec26d792.png#averageHue=%232d2c2b&clientId=u93ffe049-0d80-4&from=paste&height=316&id=u48a188ab&originHeight=812&originWidth=1382&originalType=binary&ratio=2&rotation=0&showTitle=false&size=85044&status=done&style=none&taskId=uc3202dc2-a4ed-419a-bb02-fdb412b768d&title=&width=537)
