### 认证到底是什么？咱们要干啥？

先说说需求：我们要做一个简单的认证系统，用户输入用户名和密码，服务器验证通过后返回一个 JWT（JSON Web Token），之后用户拿着这个令牌访问受保护的路由。那咱们就从头开始，分三步走：

1. **用户认证**：验证用户名和密码。
2. **颁发 JWT**：认证通过后给用户一个令牌。
3. **保护路由**：只有带有效令牌的请求才能访问特定接口。



### 第一步：搭好基础模块

咱们先把认证相关的模块和服务建起来。假设你已经装好了 Nest CLI（没装就 npm i -g @nestjs/cli），在项目里跑几条命令：

```bash
$ nest g module auth
$ nest g controller auth
$ nest g service auth
```

这会生成一个 AuthModule，里面有 AuthController（处理请求）和 AuthService（写认证逻辑）。但光有认证还不够，咱们得管用户信息，所以再建一个 Users 模块：

```bash
$ nest g module users
$ nest g service users
```

用户数据咋存呢？真实项目里你可能会用数据库（比如 TypeORM 连 MySQL），但为了简单，咱们先用一个硬编码的内存数组模拟用户列表。来看看 UsersService：

```ts
import { Injectable } from '@nestjs/common'

export type User = any

@Injectable()
export class UsersService {
  private readonly users = [
    { userId: 1, username: 'john', password: 'changeme' },
    { userId: 2, username: 'maria', password: 'guess' }
  ]

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username)
  }
}
```

这个服务很简单，就是一个用户数组和一个 findOne 方法，通过用户名找用户。

注意这里 User 类型用 any 是偷懒，实际项目里你得定义个接口，比如 { userId: number, username: string, password: string }。

UsersModule 也得改一下，把 UsersService 暴露出去给其他模块用：

```ts
import { Module } from '@nestjs/common'
import { UsersService } from './users.service'

@Module({
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
```

