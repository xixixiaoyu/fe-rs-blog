# 深入解析微前端中的 Cookie 处理：以 iframe 方案为例

在现代前端开发中，微前端架构逐渐成为一种流行的解决方案，尤其是在大型项目中，微前端可以帮助团队将不同的应用模块化，独立开发、部署和维护。而在微前端架构中，`iframe` 方案是常见的集成方式之一。本文将以 `iframe` 方案为例，深入探讨在跨域和跨站场景下，`Cookie` 的表现及处理方式。

## 什么是微前端中的 iframe 方案？

`iframe` 是一种 HTML 元素，允许在一个页面中嵌入另一个独立的网页。在微前端架构中，`iframe` 可以用来将子应用嵌入到主应用中，形成一种松耦合的集成方式。`iframe` 方案的优势在于子应用的独立性，主应用和子应用可以分别部署、更新，互不干扰。

然而，`iframe` 方案也带来了一个重要的问题：**Cookie 的处理**。在跨域和跨站的场景下，`Cookie` 的共享和携带会受到浏览器的限制，这对微前端架构中的登录态管理、用户认证等功能产生了影响。

## Cookie 在跨域和跨站中的表现

在讨论 `Cookie` 的表现之前，我们需要先明确两个概念：

- **跨域**：指的是主应用和子应用的域名不同，但属于同一个站点。例如，`example.com` 和 `sub.example.com` 是跨域的。
- **跨站**：指的是主应用和子应用的域名属于不同的站点。例如，`example.com` 和 `other.com` 是跨站的。

接下来，我们将通过三个场景来探讨 `Cookie` 在不同情况下的表现。

### 1. 主子应用同域

在同域的情况下，主应用和子应用共享相同的域名，只是路径不同。此时，`Cookie` 可以在主应用和子应用之间共享。

#### 示例代码

```javascript:same-origin/main-server.js
app.get("/", function (req, res) {
  // 设置主应用的 cookie
  res.cookie("main-app", "true");
  res.render("main", {
    micro: `http://${host}:${port.main}/micro`,
  });
});

app.get("/micro", function (req, res) {
  // 设置子应用的 cookie，并覆盖主应用的 cookie
  res.cookie("micro-app", "true").cookie("main-app", "false");
  res.render("micro");
});
```

#### 结果分析

在同域的情况下，主应用和子应用可以共享 `Cookie`，但需要注意的是，如果主应用和子应用设置了相同名称的 `Cookie`，后设置的 `Cookie` 会覆盖前者。例如，主应用设置了 `main-app=true`，而子应用将其覆盖为 `main-app=false`。

**总结**：同域情况下，`Cookie` 可以共享，但存在同名 `Cookie` 被覆盖的风险。

### 2. 主子应用跨域同站

跨域同站指的是主应用和子应用的域名不同，但属于同一个站点（即 eTLD+1 相同）。例如，`example.com` 和 `sub.example.com`。

#### 示例代码

```javascript:same-site/main-server.js
app.get("/", function (req, res) {
  // 设置主应用的 cookie，并通过 Domain 属性共享给子应用
  res.cookie("main-app-share", "true", { domain: "example.com" });
  res.render("main", {
    micro: `http://sub.example.com:${port.micro}`,
  });
});
```

#### 结果分析

在跨域同站的情况下，默认情况下主应用和子应用无法共享 `Cookie`，因为它们的域名不同。然而，通过设置 `Cookie` 的 `Domain` 属性为 `example.com`，可以使 `Cookie` 在主应用和子应用之间共享。

**总结**：跨域同站的情况下，`Cookie` 默认无法共享，但可以通过设置 `Domain` 属性来实现共享。

### 3. 主子应用跨站

跨站指的是主应用和子应用的域名属于不同的站点。例如，`example.com` 和 `other.com`。

#### 示例代码

```javascript:cross-site/micro-server.js
app.get("/", function (req, res) {
  // 设置 SameSite 和 Secure 属性，允许跨站携带 Cookie
  const cookieOptions = { sameSite: "none", secure: true };
  res.cookie("micro-app", "true", cookieOptions);
  res.cookie("main-app", "false", cookieOptions);
  res.render("micro");
});
```

#### 结果分析

在跨站的情况下，浏览器默认会阻止 `iframe` 中的 `Cookie` 设置，这是为了防止跨站请求伪造（CSRF）攻击。要解决这个问题，需要将 `Cookie` 的 `SameSite` 属性设置为 `None`，并且必须使用 `HTTPS` 协议（即设置 `Secure` 属性）。

通过使用 `Ngrok` 等工具，可以为本地应用创建 `HTTPS` 连接，从而实现跨站的 `Cookie` 携带。

**总结**：跨站情况下，`Cookie` 默认无法携带，必须使用 `HTTPS` 协议并设置 `SameSite=None` 和 `Secure` 属性。

## 小结

通过上述三个场景的分析，我们可以得出以下结论：

1. **主子应用同域**：`Cookie` 可以共享，但存在同名 `Cookie` 被覆盖的风险。
2. **主子应用跨域同站**：默认情况下 `Cookie` 无法共享，但可以通过设置 `Domain` 属性来实现共享。
3. **主子应用跨站**：`Cookie` 默认无法携带，必须使用 `HTTPS` 协议并设置 `SameSite=None` 和 `Secure` 属性。

在微前端架构中，`Cookie` 是实现单点登录（SSO）等功能的重要凭证。通过了解 `Cookie` 在不同场景下的表现，我们可以更好地设计微前端的登录态管理方案，确保应用的安全性和用户体验。

希望本文能帮助你更好地理解 `iframe` 方案中的 `Cookie` 处理。如果你对 SSO 免登或 CSRF 防御感兴趣，可以进一步研究相关的实现方案。
