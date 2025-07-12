## 什么是 JSON？
JSON 是一种基于文本的数据格式，最初从 JavaScript 的对象语法演变而来，但如今独立成一种通用的标准。它的作用很简单：**在不同程序之间传递和存储数据**。比如，你的手机 App 想从服务器获取用户信息，或者前端想向后端发送数据，JSON 就是最常用的“信使”。

JSON 的魅力在于它的三大优点：

1. **易读易写**：语法简单，人和机器都能轻松看懂。
2. **轻量高效**：相比 XML，JSON 体积小，传输快，解析省力。
3. **跨语言支持**：几乎所有编程语言（Python、Java、Go、PHP 等）都有解析 JSON 的库。

## JSON 的核心语法
JSON 的语法非常简洁，只有两种主要结构：**对象**和**数组**。通过这两者的灵活组合，就能表示复杂的数据。

### 1. 对象（Object）
+ 用花括号 `{}` 包裹，里面是一系列“键值对”（key-value pairs）。
+ **键**：必须是字符串，用双引号 `"` 包裹。
+ **值**：可以是字符串、数字、布尔值、数组、对象或 `null`。
+ 键和值之间用冒号 `:` 分隔，多个键值对用逗号 `,` 分隔。

```json
{
  "name": "张三",
  "age": 25,
  "isStudent": true
}
```

### 2. 数组（Array）
+ 用方括号 `[]` 包裹，里面是一组有序的值。
+ 值之间用逗号 `,` 分隔，值可以是任意支持的类型。

```json
[
  "苹果",
  "香蕉",
  42,
  {
    "color": "红色"
  }
]
```

### 支持的数据类型
JSON 支持以下六种数据类型：

+ **字符串**：用双引号 `"` 包裹，如 `"Hello"`。
+ **数字**：整数或浮点数，如 `42` 或 `3.14`。
+ **布尔值**：`true` 或 `false`。
+ **数组**：用 `[]` 包裹的有序列表。
+ **对象**：用 `{}` 包裹的键值对集合。
+ **null**：表示空值。

### 一个综合例子
下面是一个包含各种数据类型的 JSON 示例，描述了一个用户的信息：

```json
{
  "id": 1001,
  "name": "小明",
  "isActive": true,
  "balance": 199.99,
  "hobbies": ["编程", "跑步"],
  "address": {
    "city": "上海",
    "street": "南京路 123 号"
  },
  "lastLogin": null
}
```

这个 JSON 清晰地表达了用户的 ID、姓名、账户状态、余额、兴趣爱好、地址以及最后登录时间（空值）。通过嵌套对象和数组，JSON 可以轻松表示复杂的层级结构。

## 在 JavaScript 中操作 JSON
JSON 在前端开发中应用广泛，JavaScript 提供了两个核心方法来处理它：`JSON.parse()` 和 `JSON.stringify()`。

### 1. 解析 JSON：`JSON.parse()`
`JSON.parse()` 把 JSON 格式的字符串转换为 JavaScript 对象或值，常用于处理从服务器接收的数据。

```javascript
const jsonString = '{"name": "小红", "age": 28, "skills": ["JavaScript", "Vue"]}'
const user = JSON.parse(jsonString)

console.log(user.name)      // 输出: 小红
console.log(user.skills[0]) // 输出: JavaScript
```

**注意**：如果 JSON 字符串格式不正确（比如缺少双引号或多余逗号），`JSON.parse()` 会抛出 `SyntaxError`。建议用 `try-catch` 捕获错误：

```javascript
try {
  const user = JSON.parse(jsonString)
  console.log(user)
} catch (error) {
  console.error('解析 JSON 失败：', error)
}
```

### 2. 生成 JSON：`JSON.stringify()`
`JSON.stringify()` 把 JavaScript 对象或值转换为 JSON 字符串，常用于向服务器发送数据。

```javascript
const product = {
  id: 'p001',
  name: '蓝牙耳机',
  price: 299.5,
  inStock: true
}
const jsonString = JSON.stringify(product)

console.log(jsonString)
// 输出: {"id":"p001","name":"蓝牙耳机","price":299.5,"inStock":true}
```

#### 美化输出
调试时，JSON 字符串可能挤成一行，不易阅读。你可以用 `JSON.stringify()` 的第三个参数设置缩进：

```javascript
const prettyJson = JSON.stringify(product, null, 2)
console.log(prettyJson)
/*
输出:
{
  "id": "p001",
  "name": "蓝牙耳机",
  "price": 299.5,
  "inStock": true
}
*/
```

#### 选择性转换
如果你只想转换部分属性，可以用第二个参数指定：

```javascript
const user = {
  name: '小刚',
  password: '123456',
  email: 'xiaogang@example.com'
}
const safeJson = JSON.stringify(user, ['name', 'email'])
console.log(safeJson) // 输出: {"name":"小刚","email":"xiaogang@example.com"}
```

## 在 TypeScript 中的类型安全
如果你使用 TypeScript，可以为 JSON 数据定义接口，确保类型安全：

```typescript
interface User {
  name: string
  age: number
  skills: string[]
}

const jsonString = '{"name": "小明", "age": 25, "skills": ["JavaScript", "TypeScript"]}'
const user = JSON.parse(jsonString) as User

console.log(user.name) // 类型安全，访问属性不会报错
```

这样可以避免运行时因数据结构不符导致的错误。

## 结合 API 使用 JSON
现代 Web 开发中，JSON 是前后端通信的标准格式。以下是一个使用 `fetch` 获取 JSON 数据的例子：

```javascript
const fetchData = async () => {
  try {
    const response = await fetch('https://api.example.com/users')
    const data = await response.json() // 自动解析 JSON
    console.log(data)
  } catch (error) {
    console.error('获取数据失败：', error)
  }
}
```

大多数 API 返回的都是 JSON 格式，`response.json()` 会直接将其转为 JavaScript 对象，方便操作。

## 常见错误和注意事项
JSON 虽然简单，但有些“坑”需要小心：

1. **不能有注释**：JSON 是纯数据格式，不支持注释。想加说明只能在代码或文档里。
2. **键必须用双引号**：`{name: "小明"}` 是无效的，必须写成 `{"name": "小明"}`。
3. **无尾逗号**：最后一个键值对或数组元素后不能有逗号，如 `{"name": "小明",}` 是错的。
4. **不支持 **`undefined`：JavaScript 的 `undefined` 在 JSON 中会被忽略。
5. **日期对象转为字符串**：JavaScript 的 `Date` 对象在 `JSON.stringify()` 后变成字符串，解析后需手动转为 `Date` 对象。

```javascript
const obj = { date: new Date() }
const json = JSON.stringify(obj)
console.log(json) // 输出: {"date":"2025-07-12T02:49:00.000Z"}
const parsed = JSON.parse(json)
console.log(new Date(parsed.date)) // 需手动转换回 Date 对象
```

## 实用技巧
1. **在线工具调试**：可以用 JSONLint 或 JSON Formatter 验证和格式化 JSON，快速发现语法错误。
2. **深度嵌套优化**：处理复杂 JSON 时，建议用递归函数或库（如 Lodash）来简化操作。
3. **性能优化**：大数据量 JSON 解析可能较慢，可考虑流式解析库（如 `JSONStream`）。

## 总结
JSON 是一种简单而强大的数据格式，凭借其易读、轻量、跨语言的特性，成为了现代开发中不可或缺的一部分。掌握 JSON 的语法和使用方法，你就能轻松应对前后端通信、数据存储等场景。记住它的核心：**对象和数组的嵌套**，加上 `JSON.parse()` 和 `JSON.stringify()` 两个方法，足以应对大部分需求。

