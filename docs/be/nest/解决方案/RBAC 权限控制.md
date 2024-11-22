# 深入理解 NestJS 中的 RBAC 权限控制实现

## RBAC 权限模型介绍

RBAC (Role Based Access Control) 是一种基于角色的访问控制模型。与直接给用户分配权限的 ACL (Access Control List) 相比，RBAC 引入了角色这一中间层:

- ACL: 用户 -> 权限
- RBAC: 用户 -> 角色 -> 权限

RBAC 的优势在于:

- 权限管理更加灵活,只需修改角色权限即可影响所有该角色用户
- 减少权限管理的复杂度
- 更符合企业管理的实际需求

## 技术实现要点

### 1. 数据库设计

需要创建以下实体和关系:

```typescript:src/entities/user.entity.ts
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    // ... 其他字段

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'user_role_relation'
    })
    roles: Role[]
}
```

```typescript:src/entities/role.entity.ts
@Entity()
export class Role {
    // ... 基础字段

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'role_permission_relation'
    })
    permissions: Permission[]
}
```

### 2. 权限验证实现

主要通过两个 Guard 实现:

```typescript:src/guards/login.guard.ts
@Injectable()
export class LoginGuard implements CanActivate {
    @Inject(JwtService)
    private jwtService: JwtService;

    async canActivate(context: ExecutionContext) {
        // 1. 验证 token
        // 2. 解析用户信息
        // 3. 注入到 request 中
    }
}
```

```typescript:src/guards/permission.guard.ts
@Injectable()
export class PermissionGuard implements CanActivate {
    @Inject(UserService)
    private userService: UserService;

    async canActivate(context: ExecutionContext) {
        // 1. 获取用户角色权限
        // 2. 检查是否满足接口所需权限
    }
}
```

### 3. 权限声明装饰器

```typescript:src/decorators/permission.decorator.ts
export const RequirePermission = (...permissions: string[]) =>
    SetMetadata('require-permission', permissions);

export const RequireLogin = () =>
    SetMetadata('require-login', true);
```

## 使用示例

```typescript:src/modules/user/user.controller.ts
@Controller('user')
@RequireLogin()
export class UserController {
    @Post('create')
    @RequirePermission('user:create')
    async create() {
        // 创建用户逻辑
    }
}
```

## 优化建议

1. 使用 Redis 缓存角色权限信息,避免频繁查库
2. 实现权限树结构,支持权限继承
3. 添加权限操作日志
4. 实现动态权限更新机制

## 总结

RBAC 是一种优秀的权限控制方案,通过角色这一中间层简化了权限管理。在 NestJS 中,我们可以通过 Guard、装饰器等机制优雅地实现 RBAC。本文介绍的实现方案是 RBAC0 模型,对于大多数系统来说已经足够使用。如果需要更复杂的权限控制,可以在此基础上扩展实现 RBAC1、RBAC2 等模型。
