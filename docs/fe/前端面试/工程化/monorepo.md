### **什么是 monorepo？**

**monorepo** 是一种代码管理方式，意思是把多个项目放在同一个代码仓库（repository）里进行管理。这和传统的“一个项目一个仓库”的方式不同。

使用 monorepo 的话，你会把

- `frontend-repo`（前端）
- `backend-repo`（后端）
- `shared-utils-repo`（共享工具）

都放在一个仓库里，比如叫 `my-awesome-app-monorepo`，然后在仓库内部通过目录结构来区分不同的模块

```text
my-awesome-app-monorepo/
  ├── frontend/
  ├── backend/
  ├── shared-utils/
  └── package.json
```



### **为什么用 monorepo**？

直接共享公共代码，无需通过发布 npm 包等方式：

```js
// 假设 shared-utils 里有个工具函数
// shared-utils/utils.js
export function sayHello(name) {
  return `Hello, ${name}!`
}

// 在 frontend 里可以直接引用
import { sayHello } from '../shared-utils/utils'
console.log(sayHello('world'))
```

而且所有模块可以共享同一个 `node_modules` 目录，避免安装重复依赖。

并且 CI/CD 流程也能使用一套。



### **monorepo 的挑战**

随着项目的增多， 的代码量会变得很大，拉去代码速度会变慢。

不同的小组负责不同的模块，那么如何控制访问权限，各司其职就变得复杂了。

而且 monorepo 管理也需要一些专门的工具，比如 [Lerna ](https://lerna.js.org/)、[Nx ](https://nx.dev/)或者 [Turborepo ](https://turbo.build/repo)，这也会增加学习成本。

yarn/pnpm 也可以通过 workspaces 实现  monorepo。



### pnpm 实现 monorepo

pnpm 是个包管理工具，跟 npm、Yarn 差不多，但它有个特别的地方：它用了一种“硬链接 + 符号链接”的方式来存依赖，节省磁盘空间，安装还快。

简单说，它不会每个项目都存一份依赖，而是全局存一份，然后项目里用链接指过去。这特性跟 monorepo 的“集中管理”思路挺搭的，所以很多人喜欢用它来管 monorepo。

pnpm 提供了一个叫“workspaces”的功能，能帮你把这些子项目统一管理起来。

假设有个 monorepo 项目：

```text
my-monorepo/
  packages/
    frontend/
      package.json
    backend/
      package.json
    utils/
      package.json
  package.json
```

我们想将它结合 pnpm，首先初始化目录：

```bash
npm init -y
```

然后把这个 package.json 设置为私有（避免不小心发布），并加上 workspaces 配置：

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

这里 "packages/*" 告诉 pnpm，去 packages 文件夹里找所有的子项目。

如果没安装 pnpm，先 `npm install -g pnpm`，`pnpm --version` 检查下版本。

然后设置每个子项目的 package.json，比如 utils 的可能长这样：

```json
{
  "name": "@my-monorepo/utils",
  "version": "1.0.0",
  "main": "index.js"
}
```

frontend 可能会依赖 utils：

```json
{
  "name": "@my-monorepo/frontend",
  "version": "1.0.0",
  "dependencies": {
    "@my-monorepo/utils": "1.0.0"
  }
}
```

注意这里的 @my-monorepo/ 前缀，它是个命名空间，方便区分 monorepo 里的包。

然后在根目录安装依赖：

```bash
pnpm install
```

pnpm 会自动识别 workspaces，帮你把所有子项目的依赖装好。

同时根目录的 node_modules 里会有个 .pnpm 文件夹，里面存着全局依赖，子项目通过链接用这些依赖。

如果你想给 frontend 装个 React：

```bash
pnpm --filter @my-monorepo/frontend add react
```

--filter 让你指定某个子项目。或者想在所有子项目里跑 build：

```bash
pnpm --recursive run build
```

--recursive（或简写 -r）会遍历所有子项目执行。

可以不用  package.json 写 workspaces，单独弄个 pnpm-workspace.yaml 文件记录：

```yaml
packages:
  - 'packages/*'
```

效果是一样的，更干净点。



接下来感受下实际操作，假设 utils 里有个函数：

```js
// packages/utils/index.js
export const sayHello = () => 'Hello from utils'
```

frontend 用它：

```js
// packages/frontend/index.js
import { sayHello } from '@my-monorepo/utils'
console.log(sayHello())
```

你在根目录跑 pnpm install 后，frontend 就能直接用 utils，不需要额外发布。

因为 pnpm 会把 @my-monorepo/utils 链接到本地的 packages/utils。



用 pnpm 管 monorepo，有这些亮点：

1. **省空间**：依赖全局存一份，硬盘不炸。
2. **速度快**：安装和更新都比 npm、Yarn 快。
3. **本地依赖方便**：子项目间互相引用不用发包，直接用本地路径。
4. **命令灵活**：--filter 和 --recursive 让操作很精准。

但是一些老工具（早期的构建测试工具）可能不认 pnpm 的链接方式



总结下，pnpm 结合 monorepo，核心就是用 workspaces 把子项目连起来，靠它的依赖管理机制省空间提效率。

配置上很简单，根目录加个 package.json 或 pnpm-workspace.yaml，然后用 pnpm install 和 --filter 命令就能玩转。

