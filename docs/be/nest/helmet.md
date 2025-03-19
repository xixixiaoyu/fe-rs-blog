#### Helmet 是干什么的？

Helmet 是一个专注于安全的工具，它通过设置一些 HTTP 头，帮你的应用抵御常见的 Web 漏洞。比如跨站脚本攻击（XSS）、点击劫持（Clickjacking），或者一些不安全的资源加载问题，Helmet 都能帮你防一手。它本质上是一堆中间件函数的集合，专门负责调整 HTTP 头的配置，听起来是不是挺实用？



#### 在 Express 里怎么用？

咱们先从最常见的 Express 开始说起。用 Helmet 超级简单，先装包：

```bash
$ npm i --save helmet
```

装好后，在你的项目里引入并用起来：

```ts
import helmet from 'helmet'

app.use(helmet())
```

就这一行代码，Helmet 就给你的应用加了一层默认的“安全头盔”。它会自动设置一些常见的 HTTP 头，比如 X-Content-Type-Options、Strict-Transport-Security，还有内容安全策略（CSP），帮你挡掉不少潜在威胁。

不过有个小细节：app.use(helmet()) 一定要放在其他 app.use() 或者路由定义的前面。

为什么呢？因为 Express 的中间件是按顺序执行的，如果你先定义了一堆路由，再加 Helmet，那它就只对后面的路由生效，前面的可就“裸奔”了。顺序错了，等于白忙活。

如果你用的是 @apollo/server（4.x 版本）加上 Apollo Sandbox，可能会撞上个小麻烦 —— 默认的 CSP 设置会让 Sandbox 没法正常加载。别慌，解决办法也很简单，稍微调整下配置就行：

```ts
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
      frameSrc: [`'self'`, 'sandbox.embed.apollographql.com']
    }
  }
}))
```

这样就行了，Sandbox 的图片、脚本和框架都能正常加载，不用担心被 CSP 拦下来。



#### 在 Fastify 里怎么用？

如果你用的是 Fastify，那用法稍微有点不一样。先装个专门的包：

```bash
$ npm i --save @fastify/helmet
```

然后别直接用 app.use()，因为 Fastify 不吃这套，得用 app.register() 注册插件：

```ts
import helmet from '@fastify/helmet'

await app.register(helmet)
```

这样 Helmet 就生效了，原理和 Express 差不多，但写法更符合 Fastify 的风格。

要是你用的是 apollo-server-fastify，再加上 @fastify/helmet，可能会发现 GraphQL Playground 打不开了。这也是 CSP 在捣乱。别急，改改配置就能搞定：

```ts
await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`, 'unpkg.com'],
      styleSrc: [
        `'self'`,
        `'unsafe-inline'`,
        'cdn.jsdelivr.net',
        'fonts.googleapis.com',
        'unpkg.com'
      ],
      fontSrc: [`'self'`, 'fonts.gstatic.com', 'data:'],
      imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
      scriptSrc: [
        `'self'`,
        `https: 'unsafe-inline'`,
        `cdn.jsdelivr.net`,
        `'unsafe-eval'`
      ]
    }
  }
}))
```

如果嫌麻烦，或者压根不需要 CSP，直接关掉也行：

```ts
await app.register(helmet, {
  contentSecurityPolicy: false
})
```

这样 Playground 就能正常跑起来，开发体验一点不打折。



#### 为什么 Helmet 这么重要？

咱们停下来想一想，为什么要用 Helmet？这东西到底解决了啥问题？我觉得可以从这几个角度看：

1. **默认安全**：很多开发者，尤其是新手，可能压根不知道 HTTP 头还能这么玩。Helmet 提供了一个开箱即用的方案，不用你自己去研究每个头的设置。
2. **常见漏洞防护**：像 XSS、点击劫持这些攻击，靠前端代码防不全，服务器端加点保护更稳妥。
3. **灵活调整**：默认配置不合适？你可以自己改，想开哪些头、关哪些头，全都随你。

当然，它也不是万能的。Helmet 只是安全的第一步，代码逻辑、输入验证这些还得自己搞定。但至少，它让你的应用在一开始就站得更稳。