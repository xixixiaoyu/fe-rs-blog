### 为什么需要 CRUD 生成器？

想象一下，我们的项目里需要为两个实体 —— 比如 User（用户）和 Product（产品）—— 添加 CRUD（创建、读取、更新、删除）功能。如果按传统方式，我们得一步步来：

1. 创建一个模块（nest g mo），用来组织代码，划分边界。
2. 创建一个控制器（nest g co），定义 CRUD 的路由。
3. 创建一个服务（nest g s），处理业务逻辑。
4. 定义实体类或者接口，描述数据的结构。
5. 创建 DTO，规范网络传输的数据格式。

当项目规模变大，实体越来越多，这种重复操作简直是开发者的噩梦。幸好，NestJS 的 CLI 提供了一个超级好用的生成器（schematic），能一键生成所有这些样板代码，让我们的开发体验变得轻松愉快。



### 一条命令搞定一切

使用 NestJS 的 CRUD 生成器非常简单，只需要在项目根目录运行：

```bash
$ nest g resource
```

然后根据提示选择你需要的选项，比如是用 REST API 还是 GraphQL，以及是否生成 CRUD 入口点。这条命令会自动生成模块、服务、控制器（或解析器）、实体类、DTO，甚至还有测试文件（.spec）。是不是听起来就很爽？

比如我们想为 User 实体生成 REST API 相关的代码，生成后的控制器会长这样：

```ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
```

所有的 CRUD 路由（POST、GET、PATCH、DELETE）都自动生成了，连服务注入和 DTO 的使用都安排得明明白白。我们要做的，只是去服务类里填上具体的业务逻辑，比如连接数据库的操作。



### GraphQL 生成

如果你用的是 GraphQL，也不用担心。运行生成器时选 GraphQL (code first) 或 GraphQL (schema first)，它会生成对应的解析器（resolver）而不是控制器。比如：

```bash
$ nest g resource users
```

选择 GraphQL (code first) 并确认生成 CRUD 入口点后，生成的解析器是这样的：

```ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput)
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll()
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id)
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput)
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id)
  }
}
```

这里不仅生成了查询（Query）和变更（Mutation），还把服务、实体和 DTO 都关联起来了。你只需要根据项目需求，在服务类里实现具体逻辑就行。



### 灵活又通用

这个生成器的另一个优点是，它不绑定任何特定的 ORM 或数据源。服务类里的方法默认是占位符，你可以根据项目用到的数据库（比如 TypeORM、Prisma 或 Mongoose）自由填充实现。而且，它支持多种传输层：HTTP 控制器、微服务、GraphQL 解析器，甚至 WebSocket 网关，适应性超强。

如果你不喜欢生成测试文件，可以加个 --no-spec 参数，比如：

```bash
$ nest g resource users --no-spec
```

这样就只生成核心代码，干净利落。



### 总结

NestJS 的 CRUD 生成器就像一个贴心的助手，不管你是用 REST API 还是 GraphQL，甚至是微服务和 WebSocket，它都能帮你省下大量时间。只需要一条命令，模块、服务、控制器、实体和 DTO 就全齐了，剩下的就是发挥你的创造力，去实现具体的功能。