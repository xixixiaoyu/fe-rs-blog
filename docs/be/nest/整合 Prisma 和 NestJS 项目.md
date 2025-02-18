## 项目初始化及配置
### 创建 NestJS 项目
```bash
nest new nest-prisma-test -p npm
cd nest-prisma-test
```
### 安装 Prisma 并初始化
```bash
npm install prisma
npx prisma init
```

### 配置数据库连接
在生成的 `.env` 文件中设置数据库连接：
```bash
DATABASE_URL="mysql://root:自己的密码@localhost:3306/prisma_test"
```
修改生成的 `schema.prisma` 文件，配置数据源：
```bash
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## 定义数据模型
在 `schema.prisma` 文件中定义数据模型：
```bash
model Department {
  id         Int        @id @default(autoincrement())
  name       String     @db.VarChar(20)
  createTime DateTime   @default(now())
  updateTime DateTime   @updatedAt
  employees  Employee[]
}

model Employee {
  id           Int        @id @default(autoincrement())
  name         String     @db.VarChar(20)
  phone        String     @db.VarChar(30)
  departmentId Int
  department   Department @relation(fields: [departmentId], references: [id])
}
```

## 数据库迁移与生成客户端代码
### 重置数据库
```bash
npx prisma migrate reset
```
### 创建并应用新的迁移
```bash
npx prisma migrate dev --name init
```

## 集成 Prisma 到 NestJS
### 创建 Prisma Service
```bash
nest g service prisma --flat --no-spec
```
在 `PrismaService` 类中，继承 `PrismaClient` 并初始化数据库连接：
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [{ emit: 'stdout', level: 'query' }],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
```

### 创建业务逻辑服务
#### Department Service
```bash
nest g service department --flat --no-spec
```
实现部门创建功能：
```typescript
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async create(data: Prisma.DepartmentCreateInput) {
    return await this.prisma.department.create({
      data,
      select: { id: true },
    });
  }
}
```

#### Employee Service
```bash
nest g service employee --flat --no-spec
```
实现员工创建功能：
```typescript
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async create(data: Prisma.EmployeeCreateInput) {
    return await this.prisma.employee.create({
      data,
      select: { id: true },
    });
  }
}
```

## 实现 API 接口
在 `AppController` 中注入服务并创建接口：
```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { EmployeeService } from './employee.service';

@Controller()
export class AppController {
  @Inject(DepartmentService) private departmentService: DepartmentService;
  @Inject(EmployeeService) private employeeService: EmployeeService;

  @Get('create')
  async create() {
    const department = await this.departmentService.create({ name: '技术部' });

    await this.employeeService.create({
      name: '云牧',
      phone: '123',
      department: { connect: { id: department.id } },
    });

    return 'done';
  }
}
```

## 启动项目
```bash
npm run start:dev
```
访问 `http://localhost:3000/create` 可以看到数据被插入数据库：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714825328771-a116ef15-4811-48eb-8622-3488cd1255db.png#averageHue=%23242422&clientId=udc411c26-7271-4&from=paste&height=259&id=u1ba199c2&originHeight=414&originWidth=754&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=65850&status=done&style=none&taskId=ue03adf35-90b5-4e46-93c9-ae8ad6b8b91&title=&width=471.2499929778279)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714825353266-e3a686fd-20d5-4224-ad61-be500a0da9d0.png#averageHue=%23232320&clientId=udc411c26-7271-4&from=paste&height=256&id=u8297c103&originHeight=410&originWidth=694&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=53658&status=done&style=none&taskId=ub97de947-5877-432a-88b3-71ed3a20457&title=&width=433.74999353662145)



