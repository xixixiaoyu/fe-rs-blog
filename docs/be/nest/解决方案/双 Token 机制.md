# 基于双 Token 的无感刷新登录机制实现

## 一、背景介绍

在 Web 应用中,JWT (JSON Web Token) 是一种常用的用户认证方案。但单 Token 机制存在一个问题:Token 有效期短则用户体验差,有效期长则安全性低。为解决这个问题,我们可以采用双 Token 机制。

## 二、双 Token 机制介绍

双 Token 机制包含两个 Token:

- **Access Token**: 用于身份认证,有效期较短(如 30 分钟)
- **Refresh Token**: 用于刷新 Access Token,有效期较长(如 7 天)

这种机制的优势是:

1. 提高安全性 - Access Token 有效期短
2. 改善用户体验 - 可以通过 Refresh Token 自动续期
3. 降低服务器压力 - 减少重复登录

## 三、后端实现

### 1. 项目初始化

首先创建一个 NestJS 项目并安装必要依赖:

```bash
nest new access_token_and_refresh_token -p npm
npm install --save @nestjs/typeorm typeorm mysql2 @nestjs/jwt
```

### 2. 实现登录接口

```typescript:src/user/user.controller.ts
@Post('login')
async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);

    const access_token = this.jwtService.sign({
      userId: user.id,
      username: user.username,
    }, {
      expiresIn: '30m'
    });

    const refresh_token = this.jwtService.sign({
      userId: user.id
    }, {
      expiresIn: '7d'
    });

    return {
      access_token,
      refresh_token
    }
}
```

### 3. 实现 Token 刷新接口

```typescript:src/user/user.controller.ts
@Get('refresh')
async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId);

      // 生成新的 Token 对
      const access_token = this.jwtService.sign({/*...*/});
      const refresh_token = this.jwtService.sign({/*...*/});

      return { access_token, refresh_token }
    } catch(e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
}
```

## 四、前端实现

### 1. Token 管理

```typescript:src/utils/auth.ts
// 存储 Token
const saveTokens = (access_token: string, refresh_token: string) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
}

// 获取 Token
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
```

### 2. 请求拦截器配置

```typescript:src/utils/request.ts
// 请求拦截器 - 添加 Token
axios.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - Token 刷新逻辑
let refreshing = false;
const queue: PendingTask[] = [];

axios.interceptors.response.use(
  response => response,
  async error => {
    const { status, config } = error.response;

    if (status === 401 && !config.url.includes('/refresh')) {
      if (refreshing) {
        return new Promise(resolve => {
          queue.push({ config, resolve });
        });
      }

      refreshing = true;
      try {
        const res = await refreshToken();
        if (res.status === 200) {
          // 重试队列中的请求
          queue.forEach(({ config, resolve }) => {
            resolve(axios(config));
          });
          return axios(config);
        }
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

## 五、安全性考虑

双 Token 机制的安全性优势:

1. Access Token 有效期短,即使泄露风险也较小
2. Refresh Token 仅用于刷新,不能直接访问资源
3. 可以实现 Token 吊销机制
4. 支持多端登录控制

## 六、最佳实践建议

1. Access Token 有效期建议 15-30 分钟
2. Refresh Token 有效期根据业务需求设置
3. 重要操作仍需二次验证
4. 实现 Token 黑名单机制
5. 考虑并发请求的 Token 刷新处理

## 总结

双 Token 机制是一种平衡安全性和用户体验的有效方案。通过合理的前后端实现,可以让用户在无感知的情况下保持登录状态,同时保证系统安全性。这种机制被广泛应用于各类 Web 应用和移动应用中。
