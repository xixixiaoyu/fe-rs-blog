### SWC 是什么？

SWC 是一个用 Rust 写的超快编译工具。它不仅能编译 TypeScript，还能打包代码，比默认的 TypeScript 编译器（tsc）快得多 —— 官方数据说是快了 20 倍！为啥这么快？因为 Rust 本身就是性能怪兽，再加上 SWC 的设计非常高效，能并行处理代码，减少不必要的开销。

在 NestJS 项目里用上 SWC，意味着你启动开发服务器、构建项目的时间会大幅缩短。想象一下，本来要等 10 秒的编译，现在 1 秒就搞定，是不是很爽？



### 安装 SWC

打开终端，敲以下命令：

```bash
npm i --save-dev @swc/cli @swc/core
```

这会安装 SWC 的核心包和命令行工具。装好后，你就可以在 NestJS 项目里用它了。



### 在 Nest CLI 中用起来

Nest CLI 是 NestJS 的命令行工具，默认用的是 tsc 编译器。我们可以用一个参数让它切换到 SWC：

```bash
nest start -b swc
```

或者你也可以写成：

```bash
nest start --builder swc
```

这就告诉 Nest CLI 用 SWC 来构建项目。你会发现启动速度快了不少。

如果不想每次命令行都要加 swc，可以直接改配置文件 nest-cli.json：

```ts
{
  "compilerOptions": {
    "builder": "swc"
  }
}
```

下次运行 nest start，它就默认用 SWC 了。



### 自定义 SWC 的行为

SWC 虽然快，但默认配置可能不完全符合你的需求。但是它支持自定义。假设你想调整一些编译选项，比如指定一个配置文件，可以在 nest-cli.json 里这么写：

```json
{
  "compilerOptions": {
    "builder": {
      "type": "swc",
      "options": {
        "swcrcPath": "infrastructure/.swcrc"
      }
    }
  }
}
```

然后在项目根目录建个 .swcrc 文件，写上你的配置。比如：

```json
{
  "sourceMaps": true,
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "baseUrl": "./"
  },
  "minify": false
}
```

这里我开了源码映射（方便调试），支持 TypeScript 语法、装饰器和动态导入，还关了代码压缩。你可以根据自己的项目需求调整。



### 类型检查怎么办？

你可能发现了，SWC 虽然快，但它不做类型检查。

默认的 tsc 会帮你检查类型，而 SWC 为了追求速度把这部分省了。不过别慌，咱们可以让它和 tsc 配合工作。试试这个命令：

```bash
nest start -b swc --type-check
```

这会让 SWC 编译代码，同时异步跑 tsc 检查类型（用 noEmit 模式，不会生成多余文件）。如果想固定这个设置，改 nest-cli.json：

```json
{
  "compilerOptions": {
    "builder": "swc",
    "typeCheck": true
  }
}
```

这样每次启动都会带类型检查，安全又高效。



### 监听模式

开发时我们经常需要实时更新代码，这时候可以用监听模式：

```bash
nest start -b swc -w
```

或者：

```bash
nest start --builder swc --watch
```

代码一改，SWC 立刻重新编译，热加载速度飞快，开发体验直接拉满。



### Monorepo 项目怎么办？

如果你的项目是个 monorepo（多个子项目在一个仓库），用 SWC 构建器可能会遇到点小麻烦，因为它默认是为单项目设计的。这时候可以用 Webpack 配合 swc-loader。先装包：

```bash
npm i --save-dev swc-loader
```

然后在项目根目录建个 webpack.config.js：

```js
const swcDefaultConfig = require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory().swcOptions

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig
        }
      }
    ]
  }
}
```

这样 Webpack 就会用 SWC 来编译 TypeScript 文件，速度依然很快。



### 处理 CLI 插件和元数据

NestJS 的 CLI 插件（比如生成元数据）默认依赖 tsc。如果你用了 SWC，可能需要手动处理。创建一个 generate-metadata.ts 文件：

```ts
import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins/plugin-metadata-generator'
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin'

const generator = new PluginMetadataGenerator()
generator.generate({
  visitors: [new ReadonlyVisitor({ introspectComments: true, pathToSource: __dirname })],
  outputDir: __dirname,
  watch: true,
  tsconfigPath: 'apps/<name>/tsconfig.app.json'
})
```

然后单独跑这个脚本：

```bash
npx ts-node src/generate-metadata.ts
```

这会生成元数据文件，供运行时加载。



### 解决循环依赖问题

用 TypeORM 或 MikroORM 的时候，可能会遇到循环导入的坑。比如两个实体互相引用，直接写类型会报错。可以用 Relation 类型解决：

```ts
import { Entity, OneToOne } from 'typeorm'

@Entity()
export class User {
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Relation<Profile>
}
```

如果 ORM 没提供类似方案，自己定义个包装类型也行：

```ts
export type WrapperType<T> = T
```

然后在依赖注入时用上：

```ts
import { Injectable, forwardRef, Inject } from '@nestjs/common'

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: WrapperType<ProfileService>
  ) {}
}
```

问题迎刃而解。



### 用 SWC 跑测试

SWC 不仅能加速开发，还能用在测试里。咱们以 Jest 为例，先装包：

```bash
npm i --save-dev jest @swc/core @swc/jest
```

然后改 package.json：

```json
{
  "jest": {
    "transform": {
      "^.+\\.(t|j)s?$": ["@swc/jest"]
    }
  }
}
```

再更新 .swcrc，加点配置：

```json
{
  "jsc": {
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    }
  }
}
```

跑测试时，速度一样飞起！



### 总结

SWC 就像给 NestJS 项目装了个加速器，编译快、配置灵活，还能无缝融入开发和测试流程。无论是单项目还是 monorepo，带类型检查还是跑测试，它都能搞定。试试看吧，保准你会爱上这种飞一般的开发体验！
