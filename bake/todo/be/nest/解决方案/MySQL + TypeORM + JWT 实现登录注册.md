# 基于 Nest.js 实现完整的用户登录注册系统

## 前言

用户认证是几乎所有 Web 应用的基础功能。本文将介绍如何使用 Nest.js + TypeORM + JWT 实现一个完整的用户登录注册系统。我们将涵盖数据库设计、API 实现、参数校验、JWT 认证等关键环节。

## 技术栈

- Nest.js - Node.js 服务端框架
- MySQL - 数据库
- TypeORM - ORM 框架
- JWT - 用户认证
- class-validator - 参数校验

## 1. 项目初始化

### 1.1 创建数据库

首先创建一个新的 MySQL 数据库：

```sql
CREATE SCHEMA login_test DEFAULT CHARACTER SET utf8mb4;
```

这里使用 `utf8mb4` 字符集以支持 emoji 等特殊字符。

### 1.2 创建 Nest.js 项目

```bash
nest new login-and-register -p npm
npm install --save @nestjs/typeorm typeorm mysql2
```

### 1.3 配置 TypeORM

```typescript:src/app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "your_password",
      database: "login_test",
      synchronize: true,
      logging: true,
      entities: [],
      poolSize: 10,
      connectorPackage: 'mysql2'
    })
  ]
})
export class AppModule {}
```

## 2. 用户模块实现

### 2.1 User 实体设计

```typescript:src/user/entities/user.entity.ts
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        comment: '用户名'
    })
    username: string;

    @Column({
        length: 50,
        comment: '密码'
    })
    password: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}
```

### 2.2 实现注册功能

```typescript:src/user/user.service.ts
@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async register(user: RegisterDto) {
    // 检查用户是否存在
    const foundUser = await this.userRepository.findOneBy({
      username: user.username
    });

    if(foundUser) {
      throw new HttpException('用户已存在', 200);
    }

    // 创建新用户
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch(e) {
      return '注册失败';
    }
  }
}
```

## 3. JWT 认证实现

### 3.1 配置 JWT

```bash
npm install @nestjs/jwt
```

```typescript:src/app.module.ts
JwtModule.register({
  global: true,
  secret: 'your-secret-key',
  signOptions: {
    expiresIn: '7d'
  }
})
```

### 3.2 登录实现

```typescript:src/user/user.controller.ts
@Post('login')
async login(@Body() user: LoginDto, @Res({passthrough: true}) res: Response) {
    const foundUser = await this.userService.login(user);

    if(foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username
        }
      });
      res.setHeader('token', token);
      return 'login success';
    }
    return 'login fail';
}
```

## 4. 路由保护

### 4.1 实现登录守卫

```typescript:src/guards/login.guard.ts
@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('未登录');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload.user;
      return true;
    } catch {
      throw new UnauthorizedException('Token 已过期');
    }
  }
}
```

### 4.2 使用守卫保护路由

```typescript
@Get('protected-route')
@UseGuards(LoginGuard)
protectedRoute() {
    return 'This is a protected route';
}
```

## 5. 参数校验

### 5.1 配置验证管道

```typescript:src/main.ts
app.useGlobalPipes(new ValidationPipe());
```

### 5.2 DTO 验证规则

```typescript:src/user/dto/register.dto.ts
export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Length(6, 30)
    @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
        message: '用户名只能包含字母、数字和特殊字符'
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 30)
    password: string;
}
```

## 总结

本文介绍了如何使用 Nest.js 构建一个完整的用户认证系统。主要包括：

1. 基于 TypeORM 的数据库操作
2. JWT 实现的用户认证
3. 路由守卫实现的访问控制
4. 基于 class-validator 的参数校验

这些功能组合在一起，构成了一个安全可靠的用户认证系统。你可以基于此继续扩展更多功能，如：

- 密码重置
- 邮箱验证
- 手机号登录
- OAuth 第三方登录等
