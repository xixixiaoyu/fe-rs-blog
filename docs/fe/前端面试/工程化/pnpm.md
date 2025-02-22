### pnpm 是什么

pnpm 是一个 JavaScript 的包管理工具，跟 npm 和 Yarn 是一类东西，它也是用来帮你在项目里安装、管理和删除依赖（比如 React、Lodash 这些库）的工具。它的全称是 "performant npm"，意思是“高效的 npm”，名字已经暗示了它的特点——快、省空间。



### pnpm 核心特点

pnpm 用硬链接和符号链接的技术，所有依赖只在全局存一份（默认在 ~/.pnpm-store），项目里只是个“快捷方式”。

比如你有 10 个项目都用 React，npm 会复制 10 份，而 pnpm 只存 1 份，大幅减少磁盘空间占用。

由于这种机制，有多个项目使用相同依赖时，pnpm 几乎可以做到“秒装”。

并且 pnpm 默认会阻止“幽灵依赖”（phantom dependencies）。所谓幽灵依赖，就是指那些没有在 `package.json` 中声明，但却被项目使用的依赖。

假设写个小项目，用了 React 和 React-DOM：

```js
// 用 npm
npm install react react-dom
// node_modules 里会有完整的 react 和 react-dom 文件夹，每个项目都复制一遍

// 用 pnpm
pnpm add react react-dom
// node_modules 里只是链接，实际文件在全局存储，空间占用少得多
```





### pnpm 基本用法

安装：

```text
npm install pnpm -g
```

装好后，输入 pnpm --version 检查一下版本，确保没问题。

和 npm 类似，pnpm 也可以初始化一个新的项目：

```bash
pnpm init
```

安装个 react 依赖：

```bash
pnpm add react
```

想装开发依赖（比如 TypeScript），加个 --save-dev：

```bash
pnpm add typescript --save-dev
```

如果 package.json 里有 "start": "node index.js"，直接：

```bash
pnpm start
```

如果项目是刚拉下来，要安装所有依赖：

```bash
pnpm install
```

是不是感觉跟 npm 差不多？确实，pnpm 故意设计得跟 npm 兼容，切换成本很低。



总结下，pnpm 是一个高效、省空间、速度快的包管理工具，用法跟 npm 差不多，但通过硬链接和符号链接优化了存储和安装过程。特别适合依赖多、项目多的人用。如果你硬盘空间不够，或者烦 npm 慢吞吞的速度，不妨试试 pnpm，保准有惊喜！



### 硬链接和符号链接是什么

硬链接有点像给文件起个别名。它指向硬盘上的同一个物理数据块，不占用额外空间。比如你有个文件 react.js，创建个硬链接后，两个名字指向的都是同一块数据，删除一个名字，数据还在，直到所有硬链接都没了，数据才会被清理。

符号链接更像一个“快捷方式”，它指向另一个文件路径。如果目标文件没了，符号链接就变成“死链接”。它不直接绑定数据，而是绑定路径。



pnpm 的核心在于两块地方：全局存储和项目本地 node_modules。

默认在 ~/.pnpm-store（Windows 下是 %USERPROFILE%\.pnpm-store），这里是所有依赖的“中央仓库”。每次你用 pnpm add 装依赖，pnpm 先检查全局存储里有没有。如果没有，它下载一次，解压后放进这个全局存储，之后所有项目共享这块数据。

比如你装了 react@18.2.0，全局存储里会有：

```text
~/.pnpm-store/v3/files/react/18.2.0
```

这份文件只存一次，不会重复下载或解压。

项目下的 node_modules 看起来跟 npm 差不多，但实际上是个“假象”。里面的文件大多是指向全局存储的硬链接或符号链接，而不是完整复制过来的文件。

你在 package.json 声明的依赖，会出现在 node_modules 的顶层，比如 node_modules/react，这时候 pnpm 用的符号链接：

```text
node_modules/react -> ~/.pnpm-store/v3/files/react/18.2.0
```

而依赖在 node_modules/.pnpm 文件夹里，用的是**硬链接**，比如 react 依赖了 scheduler，pnpm 会这样组织：

```text
node_modules/.pnpm/react@18.2.0/node_modules/scheduler
```

这里的 scheduler 是通过硬链接直接指向全局存储里的文件：

```text
~/.pnpm-store/v3/files/scheduler/0.23.0
```

而 node_modules/react 下的子依赖，则通过符号链接指向 .pnpm 里的对应文件夹。

这样，间接依赖被“隔离”在 .pnpm 里，避免了 npm 那种“扁平化 node_modules”导致的幽灵依赖问题。

假设你项目里装了 react 和 react-dom，他们都依赖 scheduler。用 pnpm 装完后后结构：

```text
project/
├── node_modules/
│   ├── react -> (符号链接到全局存储的 react)
│   ├── react-dom -> (符号链接到全局存储的 react-dom)
│   └── .pnpm/
│       ├── react@18.2.0/
│       │   └── node_modules/
│       │       └── scheduler -> (硬链接到全局存储的 scheduler)
│       └── react-dom@18.2.0/
│           └── node_modules/
│               └── scheduler -> (硬链接到同一个全局存储的 scheduler)
└── package.json
```

- 全局存储里，scheduler 只存一份。

- 项目里，react 和 react-dom 的 node_modules 通过符号链接找到 .pnpm 里的版本。

- .pnpm 里的 scheduler 用硬链接指向全局存储，既省空间又保证一致性。

