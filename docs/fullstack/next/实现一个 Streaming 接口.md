### 如何用 Next.js v14 实现一个 Streaming 接口

#### 前言

在现代 Web 开发中，流式传输（Streaming）是一种非常有用的技术，尤其是在处理大数据或需要实时更新的场景中。流式传输允许服务器将数据分块发送给客户端，而不是一次性发送完整的数据。这样可以提高用户体验，尤其是在处理像 ChatGPT 这样的应用时，用户可以看到逐步生成的响应，而不是等待整个响应完成。

本文将带你一步步实现一个基于 Next.js v14 的流式接口，并通过调用 OpenAI 的 API 来展示如何实现类似 ChatGPT 的打字效果。

---

#### 什么是 Streaming？

简单来说，Streaming 是一种将数据分段发送给客户端的技术。与传统的 HTTP 请求不同，Streaming 允许服务器在数据生成的过程中逐步发送数据，而不是等待所有数据准备好后再发送。

一个常见的例子就是 ChatGPT 的打字效果：当你向 ChatGPT 提问时，它会逐字逐句地返回答案，而不是一次性返回完整的回答。

---

#### Fetch API 与 ReadableStream

在实现流式接口之前，我们需要了解一些基础知识，特别是 Fetch API 和 ReadableStream。

##### Fetch API

Fetch API 是我们在前端常用的工具，用于发起 HTTP 请求。通常我们会这样使用它：

```javascript
fetch('http://example.com/movies.json')
  .then(response => response.json())
  .then(data => console.log(data))
```

在这个例子中，我们获取了一个 JSON 文件并将其打印。然而，`response.body` 实际上是一个 `ReadableStream`，它允许我们逐步读取数据，而不是一次性获取所有内容。

##### ReadableStream

`ReadableStream` 是一个流对象，它允许我们逐步读取数据。我们可以通过 `getReader()` 方法获取一个读取器，并使用 `read()` 方法来读取流中的数据块。

```javascript
const decoder = new TextDecoder('utf-8')
fetch('https://api.thecatapi.com/v1/images/search')
  .then(response => response.body)
  .then(body => {
    const reader = body.getReader()
    reader.read().then(function process({ done, value }) {
      if (done) {
        console.log('Stream finished')
        return
      }
      const text = decoder.decode(value)
      console.log('Received data chunk', text)
      return reader.read().then(process)
    })
  })
```

在这个例子中，我们递归地读取流中的数据，直到流关闭。

---

#### Next.js 实现 Streaming

接下来，我们将使用 Next.js 来实现一个流式接口。

##### 创建 Next.js 项目

首先，使用官方脚手架创建一个 Next.js 项目：

```bash
npx create-next-app@latest
```

在创建项目时，记得勾选 Tailwind CSS 以便于样式美化。

##### 实现 Streaming 接口

在 `api/chat/route.js` 中，我们可以通过 `ReadableStream` 来实现流式接口：

```javascript
function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

const encoder = new TextEncoder()

async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(1000)
  yield encoder.encode('<p>Two</p>')
  await sleep(1000)
  yield encoder.encode('<p>Three</p>')
}

export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)
  return new Response(stream)
}
```

这段代码通过迭代器逐步生成数据，并将其推送到流中。每隔 1 秒，流会返回一段新的数据。

##### 前端调用

在前端，我们可以使用 `ReadableStream` 来逐步读取数据并更新页面内容。修改 `app/page.js`：

```javascript
'use client'

import { useEffect, useState } from 'react'

const decoder = new TextDecoder('utf-8')

export default function Chat() {
  const [text, setText] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/api/chat')
      const reader = response.body.getReader()
      reader.read().then(function process({ done, value }) {
        if (done) {
          console.log('Stream finished')
          return
        }
        const text = decoder.decode(value)
        setText(prev => prev + text)
        return reader.read().then(process)
      })
    }

    fetchData()
  }, [])

  return <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">{text}</div>
}
```

当页面加载时，前端会逐步接收并显示从后端流式传输的数据。

---

#### 调用 OpenAI 接口

接下来，我们将实现一个调用 OpenAI API 的流式接口。首先，你需要准备一个 OpenAI API Key。

##### 修改后端接口

在 `api/chat/route.js` 中，我们可以通过 OpenAI 的 API 来实现流式响应：

```javascript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: 'https://api.openai-proxy.com/v1',
})

const encoder = new TextEncoder()

async function* makeIterator(response) {
  for await (const chunk of response) {
    const delta = chunk.choices[0].delta.content
    yield encoder.encode(delta)
  }
}

function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

export async function POST(req) {
  const { messages } = await req.json()
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
  })

  return new Response(iteratorToStream(makeIterator(response)))
}
```

##### 前端调用 OpenAI 接口

修改 `app/page.js`，让前端可以发送用户输入并接收 OpenAI 的流式响应：

```javascript
'use client'

import { useState } from 'react'

const decoder = new TextDecoder('utf-8')

export default function Chat() {
  const [text, setText] = useState('')
  const [input, setInput] = useState('')

  const handleInputChange = e => {
    setInput(e.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setText('')
    setInput('')

    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: input }] }),
    })

    const reader = response.body.getReader()
    reader.read().then(function process({ done, value }) {
      if (done) {
        console.log('Stream finished')
        return
      }
      const text = decoder.decode(value)
      setText(prev => prev + text)
      return reader.read().then(process)
    })
  }

  return (
    <div className="flex flex-col w-full max-w-md p-2 mx-auto stretch">
      <div className="whitespace-pre-wrap">{text ? 'AI: ' + text : ''}</div>
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  )
}
```

---

#### 总结

通过本文的介绍，我们从基础的 Fetch API 和 ReadableStream 开始，逐步实现了一个基于 Next.js 的流式接口。最后，我们还展示了如何调用 OpenAI 的 API 来实现类似 ChatGPT 的打字效果。希望这些内容能为你在实际项目中实现流式传输提供帮助。
