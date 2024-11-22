我来帮你写一篇关于单 token 自动续期的技术文章，标题为《实现优雅的单 Token 自动续期方案》。

# 实现优雅的单 Token 自动续期方案

## 引言

在 Web 应用中，用户认证是一个基础且重要的功能。相比双 Token 的实现方式，单 Token 自动续期是一个更加简单优雅的解决方案。本文将详细介绍如何实现这一方案。

## 方案概述

单 Token 自动续期的核心思路是：

- 用户登录后获取一个 JWT Token（如 7 天有效期）
- 在 Token 即将过期时（比如剩余 20% 有效期），后端返回新的 Token
- 前端自动更新本地存储的 Token
- 用户只要在过期前访问过系统，Token 就会自动续期

这种方案的优势在于：

1. 实现简单，维护成本低
2. 用户体验好，实现了真正的无感刷新
3. 安全性有保障，Token 仍然有最大有效期限制

## 后端实现

首先在 NestJS 中实现 Token 的签发和验证：

```typescript:src/user/user.controller.ts
@Controller('user')
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    // ... 验证用户名密码 ...

    const token = this.jwtService.sign({
      username: loginDto.username,
      iat: Math.floor(Date.now() / 1000) // 记录 token 签发时间
    }, {
      expiresIn: '7d'
    });

    return token;
  }
}
```

实现 Token 验证和自动续期的守卫：

```typescript:src/guards/login.guard.ts
@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('未登录');
    }

    try {
      const payload = this.jwtService.verify(token);
      const exp = payload.exp;
      const iat = payload.iat;

      // 如果 token 剩余有效期小于 20%，签发新 token
      if (exp - Date.now() / 1000 < (exp - iat) * 0.2) {
        const newToken = this.jwtService.sign({
          username: payload.username,
          iat: Math.floor(Date.now() / 1000)
        }, {
          expiresIn: '7d'
        });

        response.setHeader('Access-Control-Expose-Headers', 'new-token');
        response.setHeader('new-token', newToken);
      }

      return true;
    } catch (e) {
      throw new UnauthorizedException('token 已失效');
    }
  }
}
```

## 前端实现

使用 Axios 拦截器优雅地处理 Token：

```typescript:src/utils/request.ts
import axios from 'axios';

// 请求拦截器
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
axios.interceptors.response.use(
  response => {
    const newToken = response.headers['new-token'];
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // 跳转登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 优化建议

1. **错误处理**

- 添加完善的错误处理机制
- 对 Token 解析失败等异常情况进行优雅降级

2. **安全性增强**

- 可以在 Token 中加入更多用户信息
- 考虑添加设备指纹等信息防止 Token 被盗用

3. **性能优化**

- 可以通过 Redis 缓存已失效的 Token 黑名单
- 合理设置 Token 有效期，避免过于频繁的续期操作

## 总结

单 Token 自动续期方案是一个简单且实用的用户认证方案。它既保证了安全性，又提供了良好的用户体验。相比双 Token 方案，它的实现更加简单，维护成本更低，是中小型项目的理想选择。

希望这篇文章对你实现单 Token 自动续期有所帮助！
