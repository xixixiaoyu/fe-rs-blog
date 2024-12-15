在现代软件开发中，工程化已经成为提升开发效率和代码质量的关键手段。

无论是前端还是后端，工程化工具的使用都能帮助开发者从繁琐的重复劳动中解放出来，专注于业务逻辑的实现。

对于后端开发，NestJS 作为一个强大的 Node.js 框架，其 CLI 工具（@nestjs/cli）无疑是工程化开发的得力助手。本文将带你深入了解 NestJS CLI 的核心功能及其背后的工程化思维。

---

## 为什么需要工程化工具？

在开发一个项目时，你是否遇到过以下问题：

- **项目初始化繁琐**：每次创建新项目都需要手动搭建目录结构、配置文件和依赖。
- **模块开发重复性高**：新增功能模块时需要手动创建多个文件，并手动配置依赖关系。
- **开发效率低下**：每次修改代码后都需要手动编译、重启服务。
- **代码风格不统一**：团队成员的代码结构和风格可能因人而异，导致维护成本增加。

这些问题不仅浪费时间，还容易引发错误。而 NestJS CLI 的出现，正是为了解决这些痛点。它通过一系列命令和配置选项，将项目开发的各个环节标准化、自动化，让开发者能够更加高效地完成工作。

---

## NestJS CLI 的核心功能

NestJS CLI 提供了一整套工具链，涵盖了从项目初始化到代码生成、构建和运行的各个环节。以下是其核心功能的详细介绍。

### 1. 快速创建项目：`nest new`

`nest new` 是 NestJS CLI 提供的项目脚手架命令，用于快速创建一个新的 Nest 项目。它不仅会生成标准化的项目结构，还会自动安装依赖，让开发者可以立即开始编码。

```Bash
# 全局安装 CLI 工具
npm install -g @nestjs/cli

# 创建新项目
nest new my-project
```

在创建项目时，CLI 提供了一些实用的选项：

- `--skip-git`：跳过 Git 初始化。
- `--skip-install`：跳过依赖安装。
- `--package-manager`：指定包管理器（如 npm 或 yarn 或 pnpm）。
- `--strict`：启用 TypeScript 的严格模式。

这些选项让开发者可以根据自己的需求灵活定制项目初始化过程。

我一般习惯 `nest new my-project -p pnpm`

---

### 2. 快速生成代码：`nest generate`

在开发过程中，新增模块、控制器、服务等是常见的需求。

`nest generate` 命令可以帮助开发者快速生成这些代码，并自动完成依赖的引入和配置。

```Bash
# 生成模块
nest generate module users

# 生成控制器
nest generate controller users

# 生成服务
nest generate service users
```

特别值得一提的是 `nest generate resource` 命令，它可以一次性生成一个完整的 CRUD 模块，包括控制器、服务、模块和实体代码：

```Bash
# 生成 CRUD 模块
nest generate resource users
```

在生成资源时，CLI 还会提示开发者选择 API 风格（如 REST 或 GraphQL）以及是否生成 CRUD 代码。这种高度自动化的能力，大大提升了开发效率。

---

### 3. 灵活的构建系统：`nest build`

`nest build` 命令用于将 TypeScript 代码编译为 JavaScript。它支持两种构建方式：

- **TypeScript 编译器（tsc）**：适合简单项目，编译速度快。
- **Webpack**：适合需要打包优化的大型项目。

```Bash
# 使用 tsc 编译
nest build

# 使用 Webpack 编译
nest build --webpack
```

此外，`nest build` 还支持文件监听模式（`--watch`），可以在文件发生变动时自动重新编译。这对于开发阶段的快速迭代非常有用。

---

### 4. 开发服务器：`nest start`

`nest start` 命令用于启动开发服务器。它支持文件监听和自动重载功能，开发者只需专注于代码编写，无需手动重启服务。

```Bash
# 启动开发服务器
nest start --watch
```

此外，`nest start` 还支持调试模式（`--debug`）和自定义运行时（`--exec`），为开发者提供了更多灵活性。

---

### 5. 配置文件：`nest-cli.json`

`nest-cli.json` 是 NestJS CLI 的核心配置文件，开发者可以通过它对 CLI 的行为进行定制。例如：

```JSON
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "webpack": false,
    "deleteOutDir": true
  },
  "generateOptions": {
    "spec": false,
    "flat": true
  }
}
```

- **`compilerOptions`**：配置构建选项，如是否使用 Webpack。
- **`generateOptions`**：配置代码生成选项，如是否生成测试文件。
- **`sourceRoot`**：指定源码目录。
- **`entryFile`**：指定入口文件。

通过合理配置 `nest-cli.json`，团队可以统一开发规范，减少沟通成本。

---

## 工程化思维的启示

NestJS CLI 的设计理念体现了现代工程化开发的核心思想：

1. **标准化**：通过 CLI 工具强制执行项目规范，确保代码结构统一。
2. **自动化**：减少重复劳动，让开发者专注于业务逻辑。
3. **可配置性**：通过配置文件适应不同项目需求。
4. **开发体验**：提供完善的工具链，提升开发效率。

这些理念不仅适用于 NestJS，也适用于其他框架和工具的设计与使用。

---

## 实践建议

为了更好地利用 NestJS CLI，以下是一些实践建议：

1. **充分利用代码生成器**：使用 `nest generate` 和 `nest generate resource` 快速搭建功能模块，避免手动创建文件。
2. **合理配置 CLI**：根据项目需求修改 `nest-cli.json`，统一团队的开发规范。
3. **选择合适的构建方式**：小型项目使用 tsc，大型项目使用 Webpack。
4. **保持 CLI 工具更新**：定期更新 CLI 工具，享受新特性和性能优化。

---

## 总结

NestJS CLI 是一个功能强大且易用的工程化工具，它不仅简化了项目开发的各个环节，还通过标准化和自动化提升了开发效率。通过合理使用 CLI 工具，开发者可以专注于业务逻辑的实现，而不必为重复性工作分心。
