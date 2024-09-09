## 初始化项目
首先，创建一个新的项目目录并初始化：
```bash
mkdir prisma-schema
cd prisma-schema
npm init -y
npm install prisma -g
```
在项目目录中执行初始化命令：
```bash
prisma init
```
这将生成 `.env` 和 `schema.prisma` 文件。

## 配置数据库
编辑 `.env` 文件，设置数据库连接信息：
```bash
DATABASE_URL="mysql://root:输入自己的密码@localhost:3306/prisma_test"
```
在 `schema.prisma` 文件中配置数据源和模型：
```typescript
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
}
```

## 生成客户端代码
运行以下命令生成 Prisma 客户端：
```typescript
prisma generate
```
客户端代码默认生成在 `node_modules/@prisma/client`。可以通过修改 `schema.prisma` 中的 `generator` 配置来改变输出目录：
```typescript
generator client {
  provider = "prisma-client-js"
  output   = "../generated/client"
}
```
重新运行 `prisma generate`，客户端代码将在指定的目录生成。

## 数据库迁移
使用以下命令创建和运行迁移：
```bash
prisma migrate dev --name init_migration
```
这会根据模型生成相应的 SQL 文件并执行：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714800938727-9625346e-7604-4a67-b5dc-cde83039a085.png#averageHue=%232d2b2a&clientId=u4b6e5d09-4fcd-4&from=paste&height=219&id=tUsay&originHeight=350&originWidth=554&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=40072&status=done&style=none&taskId=u35acb5a7-433c-4ae7-a9d3-a393fcf2ac4&title=&width=346.249994840473)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714800807115-aaf106c3-a35d-45b1-b739-0649a692648a.png#averageHue=%23f3f3f2&clientId=u4b6e5d09-4fcd-4&from=paste&height=262&id=u63c7c354&originHeight=420&originWidth=614&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=46443&status=done&style=none&taskId=ucbf50c28-c520-486e-b8d8-d74feddaccd&title=&width=383.74999428167945)



## 扩展模型和迁移
添加更复杂的模型，例如：
```bash
model Test {
  id Int    @id @default(autoincrement()) // 定义一个名为 id 的整数字段，作为主键，且自动递增
  t1 String @db.Text // 定义一个名为 t1 的文本字段，使用数据库的 Text 类型存储
  t2 Int    @map("tt2") @db.TinyInt // 定义一个名为 t2 的整数字段，使用数据库的 TinyInt 类型，实际在数据库中的字段名为 tt2
  t3 String @unique @db.VarChar(50) // 定义一个名为 t3 的字符串字段，限定最大长度为50，且在数据库中该字段值唯一

  @@index([t2, t3]) // 为 t2 和 t3 字段创建一个复合索引
  @@map("test_test") // 指定在数据库中该表的实际名称为 test_test
}
```
运行迁移：
```bash
npx prisma migrate dev --name m1
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714801566168-f30b82d7-42b4-46dc-b9ac-a8f12eb3ad0c.png#averageHue=%232b2b2a&clientId=ucef7a6fc-7291-4&from=paste&height=330&id=u0b7bf749&originHeight=528&originWidth=1310&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=83682&status=done&style=none&taskId=u95fe3ea9-a717-4fa6-824c-a9d878764c2&title=&width=818.7499877996745)<br />生成了表：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714801609774-d759d4e3-01d4-4e24-be43-c7e7c95f63e4.png#averageHue=%23d9d5d1&clientId=ucef7a6fc-7291-4&from=paste&height=36&id=u5259c7ef&originHeight=58&originWidth=238&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=7336&status=done&style=none&taskId=u162b77c1-b286-45ed-86a8-2e1beff599e&title=&width=148.7499977834523)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714801588169-8bc1bd74-d881-43eb-9582-8ddc86f4181f.png#averageHue=%23f3f3f3&clientId=ucef7a6fc-7291-4&from=paste&height=260&id=u043f0c68&originHeight=416&originWidth=706&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=49445&status=done&style=none&taskId=ua2961380-2395-4058-a090-5a93624c031&title=&width=441.24999342486274)

## 定义关系
定义一对多和多对多的模型关系：
```typescript
// 定义部门模型，代表数据库中的一个部门表
model Department {
  id        Int       @id @default(autoincrement())  // 部门ID，自动递增的主键
  name      String    @db.VarChar(20)                // 部门名称，最大长度20个字符
  createTime DateTime @default(now())               // 创建时间，默认为当前时间
  updateTime DateTime @updatedAt                    // 更新时间，每次记录更新时自动设置为当前时间
  employees Employee[]                              // 与 Employee 模型的一对多关系，表示部门下的员工
}

// 定义员工模型，代表数据库中的一个员工表
model Employee {
  id          Int        @id @default(autoincrement())  // 员工ID，自动递增的主键
  name        String     @db.VarChar(20)                // 员工名称，最大长度20个字符
  phone       String     @db.VarChar(30)                // 员工电话，最大长度30个字符
  departmentId Int                                     // 关联的部门ID
  department  Department @relation(fields: [departmentId], references: [id])  // 建立与 Department 模型的多对一关系
}

// 定义帖子模型，代表数据库中的一个帖子表
model Post {
  id        Int         @id @default(autoincrement())  // 帖子ID，自动递增的主键
  title     String                                     // 帖子标题
  content   String?                                    // 帖子内容，可选字段
  published Boolean     @default(false)                // 发布状态，默认为未发布
  tags      TagOnPosts[]                               // 与 TagOnPosts 模型的一对多关系，表示帖子与标签的关联
}

// 定义标签模型，代表数据库中的一个标签表
model Tag {
  id    Int         @id @default(autoincrement())  // 标签ID，自动递增的主键
  name  String                                     // 标签名称
  posts TagOnPosts[]                               // 与 TagOnPosts 模型的一对多关系，表示标签与帖子的关联
}

// 定义帖子与标签的关联模型，代表数据库中的一个中间表，用于实现多对多关系
model TagOnPosts {
  post   Post @relation(fields: [postId], references: [id])  // 关联到 Post 模型，表示帖子
  postId Int                                                // 帖子ID
  tag    Tag @relation(fields: [tagId], references: [id])   // 关联到 Tag 模型，表示标签
  tagId  Int                                                // 标签ID
  @@id([postId, tagId])                                     // 设置 postId 和 tagId 的组合为表的主键，确保唯一性
}
```

- Department 模型：代表一个部门，包含基本信息和与员工的关联。部门可以有多个员工。
- Employee 模型：代表一个员工，包含基本信息和与部门的关联。每个员工属于一个部门。
- Post 模型：代表一个帖子，包含标题、内容和发布状态。帖子可以有多个标签。
- Tag 模型：代表一个标签，可以标记多个帖子。
- TagOnPosts 模型：是一个中间表模型，用于实现帖子和标签之间的多对多关系。每个记录都包含一个帖子和一个标签的关联。

## 使用枚举
定义枚举类型并在模型中使用：
```typescript
// 定义一个名为 Role 的枚举类型，包含三个可能的值：ADMIN、USER、GUEST
enum Role {
  ADMIN, // 表示管理员角色
  USER,  // 表示用户角色
  GUEST  // 表示访客角色
}

// 定义一个名为 Account 的模型，代表账户信息
model Account {
  id      Int      @id @default(autoincrement()) // 账户的唯一标识ID，自增长
  name    String?  // 账户的名称，是一个可选字段（可能为 null）
  role    Role     @default(USER) // 账户的角色，如果没有指定，默认为 USER（用户）
}
```

## 生成文档
安装并配置额外的 generator，例如文档：
```bash
npm install prisma-docs-generator -D
```
schema.prisma：
```typescript
generator docs {
  provider = "node node_modules/prisma-docs-generator"
  output   = "../generated/docs"
}
```
运行 `npx prisma generate` 生成文档。

## 查看生成的文档
使用 HTTP 服务器查看生成的文档：
```bash
npx http-server ./generated/docs
```
文档中会列出所有模型的字段、CRUD 方法及其参数类型等：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714804017997-0144db7a-e484-49ad-890f-d1e4e8d4a3f7.png#averageHue=%23fafafa&clientId=u7b20ece1-143e-4&from=paste&height=1112&id=ub7a1daa5&originHeight=1780&originWidth=2396&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=244150&status=done&style=none&taskId=ue4c1b81a-57a6-42bf-8368-683202be58c&title=&width=1497.4999776855113)

## 总结
generator 部分可以指定多种生成器，比如生成 docs 等，可以指定生成代码的位置。<br />datasource 是配置数据库的类型和连接 url 的。<br />model 部分定义和数据库表的对应关系：

- @id 定义主键
- @default 定义默认值
- @map 定义字段在数据库中的名字
- @db.xx 定义对应的具体类型
- @updatedAt 定义更新时间的列
- @unique 添加唯一约束
- @relation 定义外键引用
- @@map 定义表在数据库中的名字
- @@index 定义索引
- @@id 定义联合主键

此外，还可以通过 enum 来创建枚举类型。<br />这些就是常用的 schema 语法了。
