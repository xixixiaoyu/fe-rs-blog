在现代 Web 开发中，**Server Actions** 是一个强大的工具，尤其是在处理表单提交、数据更新和错误处理时。本文将带你深入了解 Server Actions 的“标准”用法，帮助你更好地掌握如何在实际项目中使用它们。

### Server Actions 的常见搭配

在开发中，Server Actions 通常与一些 API 和库搭配使用，尤其是在处理表单提交时。接下来，我们将介绍几个常用的 API，并结合实际代码示例，帮助你更好地理解它们的用法。

#### 1. `useFormStatus`：表单状态管理

`useFormStatus` 是 React 官方提供的一个 hook，用于获取表单提交的状态信息。它可以帮助我们在表单提交时显示加载状态，提升用户体验。

```javascript
'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? 'Adding' : 'Add'}
    </button>
  )
}
```

在这个例子中，`useFormStatus` 返回了一个 `pending` 状态，当表单正在提交时，按钮会显示为“Adding”，并且按钮会被禁用，防止用户重复提交。

#### 2. `useFormState`：表单状态更新

`useFormState` 是另一个 React 官方提供的 hook，它可以根据表单的提交结果更新状态。这个 hook 非常适合处理表单提交后的数据更新。

```javascript
'use client'
import { useFormState } from 'react-dom'

export default function Home() {
  async function createTodo(prevState, formData) {
    return prevState.concat(formData.get('todo'))
  }

  const [state, formAction] = useFormState(createTodo, [])

  return (
    <form action={formAction}>
      <input type="text" name="todo" />
      <button type="submit">Submit</button>
      <p>{state.join(',')}</p>
    </form>
  )
}
```

在这个例子中，`useFormState` 通过 `createTodo` 函数更新表单的状态，每次提交表单时，新的 `todo` 项会被添加到 `state` 中，并显示在页面上。

### 实战：结合 `useFormStatus` 和 `useFormState`

为了更好地理解这两个 hook 的实际应用，我们来看一个完整的例子。假设我们有一个待办事项列表，用户可以通过表单添加新的待办事项。

```javascript
// app/form3/page.js
import { findToDos } from './actions'
import AddToDoForm from './form'

export default async function Page() {
  const todos = await findToDos()
  return (
    <>
      <AddToDoForm />
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </>
  )
}
```

在这个页面中，我们通过 `findToDos` 获取现有的待办事项，并通过 `AddToDoForm` 组件处理表单提交。

```javascript
// app/form3/form.js
'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { createToDo } from './actions'

const initialState = { message: '' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? 'Adding' : 'Add'}
    </button>
  )
}

export default function AddToDoForm() {
  const [state, formAction] = useFormState(createToDo, initialState)

  return (
    <form action={formAction}>
      <input type="text" name="todo" />
      <SubmitButton />
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
    </form>
  )
}
```

在这个表单组件中，我们使用了 `useFormState` 来管理表单的状态，并通过 `useFormStatus` 来控制提交按钮的状态。表单提交后，新的待办事项会被添加到列表中，并显示成功消息。

### 错误处理与数据验证

在开发中，错误处理和数据验证是不可忽视的部分。Server Actions 提供了多种方式来处理这些问题。

#### 1. 表单验证

Next.js 推荐使用 HTML 自带的验证属性，如 `required` 和 `type="email"`。对于更复杂的验证需求，可以使用 `zod` 这样的库来进行服务端验证。

```javascript
'use server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

export default async function createUser(formData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  // 处理数据
}
```

在这个例子中，我们使用 `zod` 来验证表单数据的结构，确保用户输入的邮箱是有效的。

#### 2. 错误处理

Server Actions 提供了两种常见的错误处理方式：返回错误信息或抛出错误。

- **返回错误信息**：当表单提交失败时，可以返回错误信息，并在客户端显示。

```javascript
'use server'
export async function createTodo(prevState, formData) {
  try {
    await createItem(formData.get('todo'))
    return revalidatePath('/')
  } catch (e) {
    return { message: 'Failed to create' }
  }
}
```

- **抛出错误**：当 Server Action 发生错误时，可以抛出错误，并由最近的 `error.js` 捕获。

```javascript
'use client'
export default function Error() {
  return <h2>error</h2>
}
```

### 乐观更新

乐观更新是一种提升用户体验的技术，它允许我们在数据请求完成之前，先更新 UI。React 提供了 `useOptimistic` hook 来实现这一功能。

```javascript
'use client'
import { useOptimistic } from 'react'
import { send } from './actions'

export function Thread({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { message: newMessage }]
  )

  return (
    <div>
      {optimisticMessages.map(m => (
        <div>{m.message}</div>
      ))}
      <form
        action={async formData => {
          const message = formData.get('message')
          addOptimisticMessage(message)
          await send(message)
        }}
      >
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

在这个例子中，用户提交消息后，UI 会立即更新，而不需要等待服务器的响应。

### 总结

Server Actions 是一个非常强大的工具，尤其是在处理表单提交、数据更新和错误处理时。通过结合 `useFormStatus`、`useFormState` 和 `useOptimistic` 等 API，我们可以轻松实现复杂的交互逻辑，并提升用户体验。

无论是表单验证、错误处理，还是乐观更新，Server Actions 都为我们提供了灵活的解决方案。希望通过本文的介绍，你能更好地掌握这些技术，并在实际项目中灵活运用。
