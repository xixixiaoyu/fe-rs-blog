# Server Actions：Next.js 全栈开发的利器

在现代 Web 开发中，前后端分离的架构已经成为主流。然而，随着技术的不断进步，开发者们也在不断寻找更简洁、更高效的方式来处理前后端交互。Next.js 的 **Server Actions** 就是这样一种新兴的解决方案，它让我们可以在服务端执行异步函数，简化了数据提交和更改的流程。

## 什么是 Server Actions？

简单来说，**Server Actions** 是在服务端执行的异步函数，它们可以在服务端和客户端组件中使用，主要用于处理数据的提交和更改。这里的“数据更改”在英文文档中被称为 **Data Mutations**，即对数据的新增、更新或删除操作。与之相对的是 **Data Queries**，即数据的读取操作。

Server Actions 的出现，极大地简化了前后端交互的流程。传统的前后端分离架构中，开发者需要定义 API 接口，前端通过这些接口与后端进行通信。而在 Next.js 的 **App Router** 下，Server Actions 让这一切变得更加简单。

## Server Actions 的基本用法

要定义一个 Server Action，我们需要使用 React 的 `"use server"` 指令。根据指令的位置，Server Actions 的定义可以分为两种：

1. **函数级别**：将 `"use server"` 放在一个 `async` 函数的顶部，表示该函数为 Server Action。
2. **模块级别**：将 `"use server"` 放在一个文件的顶部，表示该文件中导出的所有函数都是 Server Actions。

Server Actions 可以在服务端组件中使用，也可以在客户端组件中使用。不过，在客户端组件中使用时，只支持模块级别的定义方式。

### 服务端组件中的使用

在服务端组件中，我们可以直接在函数内部使用 Server Actions：

```jsx
// app/page.jsx
export default function Page() {
  // Server Action
  async function create() {
    'use server'
    // 处理逻辑
  }

  return (
    // 页面内容
  )
}
```

### 客户端组件中的使用

在客户端组件中，我们需要先创建一个单独的文件来定义 Server Actions：

```javascript
// app/actions.js
'use server'

export async function create() {
  // 处理逻辑
}
```

然后在客户端组件中导入并使用：

```jsx
import { create } from '@/app/actions'

export function Button() {
  return <button onClick={create}>Submit</button>
}
```

## Server Actions 的使用场景

在传统的 **Pages Router** 下，前后端交互需要通过 API 接口来实现。而在 **App Router** 下，Server Actions 让这一过程变得更加简洁。你不再需要手动定义 API 接口，Server Actions 直接处理数据的提交和更改。

Server Actions 常与 `<form>` 标签一起使用，但它们也可以在事件处理程序、`useEffect`、第三方库或其他表单元素（如 `<button>`）中调用。这种灵活性让 Server Actions 成为开发全栈应用时的强大工具。

## 实战：用 Server Actions 实现 ToDoList

为了更好地理解 Server Actions 的用法，我们可以通过一个简单的 ToDoList 示例来对比传统的 API 开发和 Server Actions 开发的区别。

### Pages Router - API 实现

在传统的 Pages Router 下，我们需要先定义一个 API 接口来处理待办事项的获取和新增：

```javascript
// app/api/todos/route.js
import { NextResponse } from 'next/server'

const data = ['阅读', '写作', '冥想']

export async function GET() {
  return NextResponse.json({ data })
}

export async function POST(request) {
  const formData = await request.formData()
  const todo = formData.get('todo')
  data.push(todo)
  return NextResponse.json({ data })
}
```

然后在页面中通过 `fetch` 调用这个 API：

```javascript
import { useEffect, useState } from 'react'

export default function Page() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await (await fetch('/api/todos')).json()
      setTodos(data)
    }
    fetchData()
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: new FormData(event.currentTarget),
    })
    const { data } = await response.json()
    setTodos(data)
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" name="todo" />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </>
  )
}
```

### App Router - Server Actions 实现

使用 Server Actions，我们可以省去定义 API 接口的步骤，直接在页面中处理数据：

```javascript
// app/form2/page.js
import { findToDos, createToDo } from './actions'

export default async function Page() {
  const todos = await findToDos()
  return (
    <>
      <form action={createToDo}>
        <input type="text" name="todo" />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </>
  )
}
```

在 `actions.js` 文件中定义 Server Actions：

```javascript
// app/form2/actions.js
'use server'

import { revalidatePath } from 'next/cache'

const data = ['阅读', '写作', '冥想']

export async function findToDos() {
  return data
}

export async function createToDo(formData) {
  const todo = formData.get('todo')
  data.push(todo)
  revalidatePath('/form2')
  return data
}
```

通过这种方式，我们可以直接在页面中处理数据的提交和更新，省去了定义 API 接口的繁琐步骤。

## Server Actions 的优势

1. **代码更简洁**：不需要手动创建 API 接口，Server Actions 作为函数可以在应用的任意位置复用。
2. **渐进式增强**：即使禁用 JavaScript，表单也可以正常提交。这在传统的 API 调用方式中是无法实现的。
3. **与 Next.js 缓存集成**：Server Actions 与 Next.js 的缓存和重新验证架构无缝集成，调用 Action 时，Next.js 可以一次性返回更新的 UI 和新数据。

## 注意事项

1. **参数和返回值必须可序列化**：Server Actions 的参数和返回值必须是可序列化的对象，类似于 JSON 格式。
2. **继承页面配置**：Server Actions 会继承页面或布局的运行时配置，包括 `maxDuration` 等字段。

## 总结

Server Actions 是 Next.js 全栈开发中的一项强大功能，它简化了前后端交互的流程，让开发者可以更加专注于业务逻辑的实现。随着 Next.js 的不断发展，Server Actions 将成为开发全栈应用时获取和处理数据的主要方式。掌握它，将为你的开发工作带来极大的便利。

未来，Server Actions 还会有更多的细节和功能等待我们去探索，比如如何处理表单提交的等待状态、如何进行乐观更新、如何处理错误等。相信随着时间的推移，Server Actions 会成为每个 Next.js 开发者的必备技能。
