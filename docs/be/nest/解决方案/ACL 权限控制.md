# NestJS 实现 ACL 权限控制系统详解

## 引言

在 Web 应用中,除了基本的身份验证(Authentication)外,往往还需要更细粒度的权限控制(Authorization)。本文将详细介绍如何在 NestJS 中实现一个基于访问控制列表(ACL)的权限系统。

## 核心概念

在开始之前,我们需要理解两个重要概念:

1. **身份验证(Authentication)** - 验证用户是谁
2. **权限控制(Authorization)** - 控制用户能做什么

## 系统设计

我们的权限系统基于以下数据模型:

```typescript
// user.entity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'user_permission_relation',
  })
  permissions: Permission[]
}

// permission.entity.ts
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  desc: string
}
```

这是一个典型的多对多关系设计,通过中间表 `user_permission_relation` 关联用户和权限。

## 实现步骤

### 1. 基础设施搭建

首先安装必要的依赖:

```bash
npm install @nestjs/typeorm typeorm mysql2
npm install express-session @types/express-session
npm install class-validator class-transformer
npm install redis
```

### 2. 权限验证守卫

实现两个关键的 Guard:

```typescript:src/guards/login.guard.ts
@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if(!request.session?.user) {
      throw new UnauthorizedException('用户未登录');
    }
    return true;
  }
}
```

```typescript:src/guards/permission.guard.ts
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ... 权限检查逻辑
    const permissions = await this.getPermissions(user.username);
    return permissions.includes(requiredPermission);
  }
}
```

### 3. Redis 缓存优化

为了提高性能,我们使用 Redis 缓存用户权限:

```typescript:src/redis/redis.service.ts
@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async listGet(key: string) {
    return await this.redisClient.lRange(key, 0, -1);
  }

  async listSet(key: string, list: string[], ttl?: number) {
    // ... Redis 操作逻辑
  }
}
```

## 使用方式

在需要权限控制的接口上:

```typescript
@Controller('aaa')
@UseGuards(LoginGuard, PermissionGuard)
export class AaaController {
  @Get()
  @SetMetadata('permission', 'query_aaa')
  findAll() {
    return 'This action returns all aaa'
  }
}
```

## 性能优化

1. 使用 Redis 缓存用户权限,避免频繁查询数据库
2. 设置合理的缓存过期时间(如 30 分钟)
3. 可选择在用户登录时预加载权限信息

## 最佳实践

1. 合理规划权限粒度
2. 使用装饰器优雅地声明权限要求
3. 实现权限缓存机制
4. 做好错误处理和异常提示

## 总结

基于 ACL 的权限控制系统虽然实现相对简单,但需要注意以下几点:

1. 性能优化很重要,必须使用缓存
2. 权限粒度要合理设计
3. 代码要优雅,便于维护
4. 要考虑安全性

通过本文的实现方案,我们既保证了系统安全性,又兼顾了性能,是一个比较完善的权限控制方案。
