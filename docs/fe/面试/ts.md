## 一、JavaScript 和 TypeScript 的基本关系
### 1.1 超集与子集
TypeScript 是 JavaScript 的超集，意味着所有合法的 JavaScript 代码都可以直接在 TypeScript 中运行，而无需任何修改。你可以把 TypeScript 看作 JavaScript 的“升级版”，它在 JavaScript 的动态灵活性基础上，增加了静态类型系统和其他高级特性。

+ **JavaScript**：动态类型语言，代码直接在浏览器或 Node.js 中运行，灵活但容易出错。
+ **TypeScript**：在 JavaScript 基础上添加了类型检查，代码需要编译为 JavaScript 才能运行。

### 1.2 核心区别：类型系统
JavaScript 是动态类型语言，变量的类型只有在运行时才能确定。这让开发初期很快，但可能导致运行时错误。例如：

```javascript
let value = 42
value = 'hello' // 合法，但可能导致后续逻辑错误
```

TypeScript 引入了静态类型系统，允许在编写代码时显式声明变量类型，编译器会在编译时检查类型错误：

```typescript
let value: number = 42
value = 'hello' // 错误：不能将字符串赋值给 number 类型
```

通过静态类型，TypeScript 能在开发阶段发现潜在问题，减少运行时错误。

---

## 二、TypeScript 的核心特性
### 2.1 类型系统详解
TypeScript 的类型系统是其最大亮点。以下是一些核心概念和特性：

#### 基本类型
TypeScript 支持 JavaScript 的所有基本类型（`number`、`string`、`boolean`、`null`、`undefined`、`bigint`、`symbol`），并额外提供了几种特殊类型：

+ **any**：完全禁用类型检查，相当于回到 JavaScript 的动态类型世界。适合快速迁移旧代码，但应尽量避免使用。
+ **unknown**：类型安全的“any”，可以接收任何类型的值，但必须经过类型检查或断言后才能使用。
+ **never**：表示永远不会出现的类型，比如抛出异常的函数或无限循环。

```typescript
// any 示例
let anything: any = 42
anything = 'hello' // 合法
anything.foo() // 合法，但运行时可能出错

// unknown 示例
let unknownValue: unknown = 42
// unknownValue.foo() // 错误：必须先检查类型
if (typeof unknownValue === 'number') {
  console.log(unknownValue + 1) // 合法
}

// never 示例
function throwError(message: string): never {
  throw new Error(message)
}
```

#### 联合类型和字面量类型
TypeScript 允许通过联合类型（`|`）和字面量类型定义更精确的类型：

```typescript
type ID = string | number // 联合类型
type Direction = 'up' | 'down' | 'left' | 'right' // 字面量类型

let id: ID = 123 // 合法
id = 'abc' // 合法
let direction: Direction = 'up' // 合法
// direction = 'diagonal' // 错误：不在允许的字面量范围内
```

#### 接口（Interface）与类型别名（Type Alias）
接口和类型别名是 TypeScript 中定义对象结构的两种方式，但用途略有不同：

+ **接口**：主要用于定义对象的结构，支持声明合并（declaration merging），适合需要扩展的场景，比如第三方库的类型定义。

```typescript
interface User {
  name: string
  age?: number // 可选属性
}

// 声明合并
interface User {
  id: number
}

const user: User = { name: 'Alice', id: 1 } // 必须包含 id 和 name
```

+ **类型别名**：更灵活，支持联合类型、交叉类型、元组等，适合复杂类型定义。

```typescript
type Point = {
  x: number
  y: number
}

type ID = string | number // 联合类型
type Tuple = [number, string] // 元组
```

**选择建议**：

+ 如果需要声明合并（比如扩展第三方库），用 `interface`。
+ 如果需要联合类型、交叉类型或其他复杂类型操作，用 `type`。
+ 简单场景下，两者可互换，选择团队习惯的即可。

### 2.2 编译过程
JavaScript 代码可以直接在浏览器或 Node.js 中运行，而 TypeScript 代码需要通过编译器（`tsc`）转换为 JavaScript 后才能执行。编译过程由 `tsconfig.json` 文件控制，常用配置包括：

+ `target`：指定输出的 JavaScript 版本（如 `ES2020`）。
+ `strict`：启用严格类型检查，推荐开启以确保类型安全。
+ `module`：指定模块系统（如 `ESNext` 或 `CommonJS`）。

示例 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "outDir": "./dist"
  }
}
```

### 2.3 工具类型
TypeScript 提供了一系列内置工具类型，用于基于已有类型创建新类型，大大提升了类型定义的灵活性。以下是几个常用的工具类型：

+ **Partial**：将类型 T 的所有属性变为可选。
+ **Required**：将类型 T 的所有属性变为必选。
+ **Pick<T, K>**：从类型 T 中选取指定属性 K。
+ **Omit<T, K>**：从类型 T 中排除指定属性 K。
+ **Record<K, T>**：创建键为 K、值为 T 的对象类型。

示例：

```typescript
interface User {
  name: string
  age?: number
  email: string
}

type PartialUser = Partial<User> // { name?: string; age?: number; email?: string }
type RequiredUser = Required<User> // { name: string; age: number; email: string }
type NameAndEmail = Pick<User, 'name' | 'email'> // { name: string; email: string }
type UserWithoutAge = Omit<User, 'age'> // { name: string; email: string }
type StringMap = Record<string, string> // { [key: string]: string }
```

#### 自定义工具类型
你也可以创建自己的工具类型。例如，将对象的所有属性值转为布尔类型：

```typescript
type BooleanFlags<T> = {
  [K in keyof T]: boolean
}

interface Features {
  darkMode: string
  notifications: number
}

type FeatureFlags = BooleanFlags<Features>
// { darkMode: boolean; notifications: boolean }
```

### 2.4 泛型
泛型（Generics）允许创建可复用的类型或函数，适用于多种数据类型。例如：

```typescript
function identity<T>(value: T): T {
  return value
}

const num = identity<number>(42) // 类型为 number
const str = identity<string>('hello') // 类型为 string
```

泛型还可以配合接口或类使用：

```typescript
interface Box<T> {
  value: T
}

const numberBox: Box<number> = { value: 42 }
const stringBox: Box<string> = { value: 'hello' }
```

---

## 三、JavaScript 和 TypeScript 的开发体验对比
### 3.1 TypeScript 的优势
1. **错误提前发现**：编译时即可捕获类型错误，减少运行时问题。
2. **更好的工具支持**：IDE 提供更智能的代码补全、跳转定义和重构功能。
3. **代码即文档**：类型定义清晰表达了代码的意图，减少注释需求。
4. **适合大型项目**：类型系统让代码更易维护，特别适合团队协作。

### 3.2 TypeScript 的成本
1. **学习曲线**：需要理解类型系统、泛型等新概念。
2. **开发速度**：初期需要编写类型定义，可能会减慢开发速度。
3. **构建步骤**：需要配置编译器和构建流程。

### 3.3 选择建议
+ **小型项目或快速原型**：JavaScript 更灵活，适合快速迭代。
+ **中大型项目或团队开发**：TypeScript 的类型安全和可维护性优势明显。
+ **初学者**：先掌握 JavaScript 的核心概念，再学习 TypeScript。
+ **已有 JavaScript 项目**：可以逐步引入 TypeScript，兼容性极高。

---

## 四、高频面试题与实战技巧
### 4.1 实现深度只读类型
一个常见面试题是实现 `DeepReadonly<T>`，使对象及其嵌套属性的所有属性只读：

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

interface User {
  name: string
  address: {
    city: string
    zip: number
  }
}

type ReadonlyUser = DeepReadonly<User>
const user: ReadonlyUser = {
  name: 'Alice',
  address: { city: 'Beijing', zip: 100000 }
}
// user.name = 'Bob' // 错误：只读属性
// user.address.city = 'Shanghai' // 错误：只读属性
```

### 4.2 手写防抖函数（带类型注解）
防抖（debounce）是前端开发中常见的功能，以下是带 TypeScript 类型注解的实现：

```typescript
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

// 使用示例
const log = (message: string) => console.log(message)
const debouncedLog = debounce(log, 500)
debouncedLog('Hello') // 500ms 后打印 "Hello"
```

### 4.3 处理第三方库类型
当使用没有类型定义的第三方库时，可以通过以下方式处理：

1. 安装官方类型声明：`npm install @types/<library>`（如 `@types/react`）。
2. 自定义声明文件：创建一个 `.d.ts` 文件，定义缺失的类型。

示例自定义声明：

```typescript
// custom.d.ts
declare module 'my-library' {
  export function doSomething(value: string): void
}
```

---

## 五、TypeScript 的新特性（4.x–5.x）
TypeScript 不断进化，以下是近年来的重要更新：

+ **satisfies 操作符**：验证值符合类型，同时保留字面量类型信息。
+ **using 关键字**：支持显式资源管理，自动释放作用域内资源。
+ **改进的类型推断**：控制流分析更精准，减少手动类型注解。

