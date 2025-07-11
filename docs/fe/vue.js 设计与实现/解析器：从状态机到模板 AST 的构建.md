你是否好奇过，当浏览器或者像 Vue、React 这样的框架拿到一串 HTML 字符串时，它们是如何理解并将其转换成我们可以操作的 DOM 树或虚拟 DOM 的？这个神奇过程的核心就是 **解析器 (Parser)**。

今天，我们就来揭开解析器的神秘面纱。我们将一起探讨如何利用**递归下降算法**，从零开始构建一个能处理标签、属性、文本甚至 Vue 特有插值语法的模板解析器。这不仅仅是理论，更是能让你深入理解前端框架底层原理的硬核实践。

## 核心概念一：解析器的“情绪”—— 文本模式
你可能以为解析器总是一板一眼地工作，但实际上，它像人一样有不同的“情绪”或者说“工作模式”。当遇到特定的 HTML 标签时，它的行为模式会发生切换。这套机制源于 WHATWG 的 HTML 解析规范，能确保浏览器稳健地处理各种复杂的 HTML 内容。

主要有以下几种模式：

1. **DATA 模式**：这是最常见的默认模式。在此模式下，解析器会积极地识别标签（`<tag>`)、HTML 实体（`&copy;`）和插值（`{{...}}`）。我们平时写的大部分 HTML 都在这个模式下被处理。
2. **RCDATA 模式**：当解析器遇到 `<textarea>` 或 `<title>` 标签时，就会切换到这个模式。在 RCDATA 模式下，解析器会变得“迟钝”一些：
    - **它不再将 **`<`** 视为新标签的开始**。这意味着你可以在 `<textarea>` 里安全地输入 `a < b`，而不会破坏结构。
    - 但是，**它仍然会解析 HTML 实体**。比如 `<textarea>&copy;</textarea>` 会正确显示为 ©。
    - 只有当遇到匹配的结束标签（如 `</textarea>`）时，它才会“清醒”过来，退出此模式。
3. **RAWTEXT 模式**：当遇到 `<style>`, `<script>`, `<iframe>` 等标签时，解析器会进入这个最“原始”的模式。
    - **它既不识别标签，也不识别 HTML 实体**。所有内容，包括 `<` 和 `&`，都被当作纯粹的文本。这正是为什么你可以在 `<style>` 或 `<script>` 标签里写任意代码而不用担心与 HTML 语法冲突的原因。
4. **CDATA 模式**：这是一个更特殊的模式，由 `<![CDATA[...]]>` 触发。在此模式下，所有内容都会被视为纯文本，直到遇到结束标记 `]]>`。

我们可以用一个简单的表格来总结：

| 模式 | 能否解析标签 | 是否支持 HTML 实体 | 触发标签（示例） |
| :--- | :--- | :--- | :--- |
| **DATA** | 能 | 是 | (默认) |
| **RCDATA** | 否 | 是 | `<textarea>`, `<title>` |
| **RAWTEXT** | 否 | 否 | `<style>`, `<script>` |
| **CDATA** | 否 | 否 | `<![CDATA[` |


在代码中，我们通常会定义一个状态表来管理这些模式：

```javascript
const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA'
}
```

理解这些模式至关重要，因为它决定了我们的解析器在不同上下文中的行为。



## 核心概念二：递归下降算法 —— 构建 AST 的蓝图
传统的解析过程分为两步：先将模板字符串**标记化 (Tokenize)** 为一个个独立的词法单元 (Token)，然后再根据这些 Token 构建一棵**抽象语法树 (AST)**。

但其实，我们可以将这两步合二为一。因为 HTML 结构本身就是嵌套的、树状的，所以我们可以采用一种更直观的算法——**递归下降 (Recursive Descent)**。

这个算法的精髓在于：

+ **递归 (Recursive)**：当我们解析到一个开始标签（如 `<div>`）时，我们知道它内部可能包含子节点。于是，我们**再次调用解析函数**来处理 `<div>` 内部的内容。这个过程会随着标签的嵌套层层深入。
+ **下降 (Descent)**：每一次递归调用，都意味着我们在 AST 中“下降”了一层。从根节点的子节点，到子节点的子节点，最终构建出一棵完整的、自上而下的树形结构。

让我们看看解析器的基本骨架：

```javascript
// 解析器入口函数
function parse(str) {
  // 上下文对象，存储解析过程中的状态
  const context = {
    source: str, // 维护待解析的模板内容
    mode: TextModes.DATA, // 初始为 DATA 模式
    // ... 后面会添加更多辅助函数
  }
  
  // 开始解析子节点，初始没有父节点
  const nodes = parseChildren(context, [])

  // 返回一个根节点，包裹所有解析出的顶级节点
  return {
    type: 'Root',
    children: nodes
  }
}

// 解析子节点的核心函数
function parseChildren(context, ancestors) {
  let nodes = []

  // 循环解析，直到模板末尾或遇到父级的结束标签
  while (!isEnd(context, ancestors)) {
    let node
    const { source, mode } = context

    // 根据当前模式和源码的开头来决定如何解析
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      if (mode === TextModes.DATA && source.startsWith('<')) {
        // 解析标签、注释或 CDATA
        // ...
      } else if (source.startsWith('{{')) {
        // 解析插值
        node = parseInterpolation(context)
      }
    }

    // 如果没有匹配到任何特殊结构，就当作普通文本处理
    if (!node) {
      node = parseText(context)
    }

    nodes.push(node)
  }

  return nodes
}
```

`parseChildren` 是整个解析器的引擎。它像一个状态机，不断地查看当前模板内容的开头，决定下一步该调用哪个具体的解析函数（如 `parseElement`, `parseText` 等），然后消费掉已解析的部分，继续循环，直到所有子节点都被解析完毕。



## 核心概念三：状态机的启停 —— `isEnd` 函数的智慧
`parseChildren` 函数中的 `while` 循环什么时候会停下来？这就是 `isEnd` 函数要回答的问题。

想象一下解析 `<div><p>Hi</p></div>` 的过程：

1. **启动**：`parse` 调用 `parseChildren` (我们称之为“状态机 1”)。
2. **遇到 **`<div>`：状态机 1 调用 `parseElement`。`parseElement` 会解析 `<div>` 的开始标签，然后**递归调用 **`parseChildren` (我们称之为“状态机 2”) 来处理 `<div>` 的内部。同时，它会将 `div` 节点信息压入一个名为 `ancestors` 的“父级栈”中。
3. **遇到 **`<p>`：状态机 2 调用 `parseElement`，后者又会开启“状态机 3”来处理 `<p>` 的内部，并将 `p` 节点压入父级栈。
4. **遇到 **`</p>`：状态机 3 在它的 `while` 循环中检查 `isEnd`。`isEnd` 发现源码以 `</p>` 开头，并且父级栈的栈顶就是 `p`。**匹配成功，状态机 3 停止**。
5. **遇到 **`</div>`：程序控制权回到状态机 2。它继续解析，直到遇到 `</div>`。`isEnd` 发现源码以 `</div>` 开头，并且父级栈中存在 `div` 节点。**匹配成功，状态机 2 停止**。

所以，`isEnd` 的逻辑可以总结为：

1. 如果模板源码已经解析完了，停止。
2. 如果遇到了一个结束标签，并且这个标签在 `ancestors` 父级栈中存在，停止。

一个更健壮的 `isEnd` 实现会检查整个父级栈，而不仅仅是栈顶。这能更好地处理 `<div><span></div></span>` 这种标签未正确闭合的情况，并给出更准确的错误提示（如“`<span>` 标签缺少闭合标签”）。

```javascript
function isEnd(context, ancestors) {
  // 1. 模板解析完毕
  if (!context.source) {
    return true
  }

  // 2. 遇到结束标签，且该标签是某个祖先节点的结束标签
  for (let i = ancestors.length - 1; i >= 0; i--) {
    if (context.source.startsWith(`</${ancestors[i].tag}`)) {
      return true
    }
  }

  return false
}
```



## 解析实战：拆解标签、属性和文本
### 1. 解析标签 (`parseElement` 和 `parseTag`)
一个完整的元素由“开始标签”、“子节点”和“结束标签”三部分构成。`parseElement` 函数就负责统筹这三部分的解析。

```javascript
function parseElement(context, ancestors) {
  // 1. 解析开始标签，如 <div id="app">

  const element = parseTag(context) // 返回一个元素节点对象
  if (element.isSelfClosing) return element

  // 切换文本模式
  if (element.tag === 'textarea' || element.tag === 'title') {
    context.mode = TextModes.RCDATA
  } else if (/style|xmp|iframe|noembed|noframes|noscript/.test(element.tag)) {
    context.mode = TextModes.RAWTEXT
  }

  // 2. 递归调用 parseChildren 解析子节点
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  // 3. 解析结束标签，如 </div>
  if (context.source.startsWith(`</${element.tag}`)) {
    parseTag(context, 'end')
  } else {
    // 处理未闭合标签的错误
    console.error(`${element.tag} 标签缺少闭合标签`)
  }

  return element
}
```

`parseTag` 函数则专注于处理开始标签和结束标签的细节，它利用正则表达式来提取标签名，并调用 `parseAttributes` 来处理属性。

### 2. 解析属性 (`parseAttributes`)
这个函数在一个循环中工作，不断地解析“属性名=属性值”这样的对，直到遇到 `>` 或 `/>`。

```javascript
function parseAttributes(context) {
  const props = []
  
  // 循环直到遇到 > 或 />
  while (
    !context.source.startsWith('>') &&
    !context.source.startsWith('/>')
  ) {
    // 用正则匹配属性名
    const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)
    const name = match[0]
    context.advanceBy(name.length)
    context.advanceSpaces() // 跳过空白

    // 消费 =
    context.advanceBy(1)
    context.advanceSpaces()

    // 解析属性值（处理有引号和无引号的情况）
    let value = ''
    // ... 省略解析 value 的逻辑 ...

    props.push({ type: 'Attribute', name, value })
  }
  return props
}
```

_为了让解析器能“前进”，我们需要在 _`context`_ 对象上实现 _`advanceBy(num)`_ 和 _`advanceSpaces()`_ 这样的辅助函数，它们的作用就是消费掉指定长度的字符或连续的空白符。_

### 3. 解析文本和解码 HTML 实体 (`parseText` 和 `decodeHtml`)
解析文本很简单：从当前位置一直读，直到遇到 `<` 或 `{{`。

```javascript
function parseText(context) {
  // 找到下一个 < 或 {{ 的位置
  let endIndex = context.source.length
  const ltIndex = context.source.indexOf('<')
  const delimiterIndex = context.source.indexOf('{{')

  if (ltIndex > -1 && ltIndex < endIndex) {
    endIndex = ltIndex
  }
  if (delimiterIndex > -1 && delimiterIndex < endIndex) {
    endIndex = delimiterIndex
  }

  // 截取内容
  const content = context.source.slice(0, endIndex)
  context.advanceBy(content.length)

  return {
    type: 'Text',
    // 关键：对文本内容进行 HTML 实体解码
    content: decodeHtml(content)
  }
}
```

真正的挑战在于 `decodeHtml`。为什么需要它？因为 Vue 模板中的文本最终会通过 `el.textContent` 等方式渲染，这些方式**不会**自动解码 HTML 实体。所以，如果用户写了 `&lt;`，我们必须在解析时就将其转换为 `<`。

解码遵循 WHATWG 规范，主要处理两类实体：

+ **命名字符引用** (如 `&lt;`)：我们通过一个巨大的映射表来查找。对于 `&ltcc` 这种省略分号的情况，规范要求采用“最短匹配原则”，即它会被解码为 `<cc` 而不是一个 `&ltcc` 实体。
+ **数字字符引用** (如 `&#60;` 或 `&#x3c;`)：我们提取出其中的数字码点，然后使用 `String.fromCodePoint()` 来转换。这个过程还需要处理各种边界情况和错误码点，以确保行为和浏览器一致。

实现一个完整的 `decodeHtml` 函数相当复杂，但其核心思想就是模拟浏览器的解码逻辑，保证鲁棒性。

### 4. 解析插值和注释
这两者的解析逻辑相对直接：找到开始和结束定界符，然后提取中间的内容。

```javascript
// 解析插值 {{...}}
function parseInterpolation(context) {
  context.advanceBy('{{'.length)
  const closeIndex = context.source.indexOf('}}')
  // ... 错误处理 ...
  const content = context.source.slice(0, closeIndex)
  context.advanceBy(content.length)
  context.advanceBy('}}'.length)

  return {
    type: 'Interpolation',
    content: {
      type: 'Expression',
      content: decodeHtml(content) // 插值内容也可能包含实体
    }
  }
}

// 解析注释 <!--...-->
function parseComment(context) {
  context.advanceBy('<!--'.length)
  const closeIndex = context.source.indexOf('-->')
  // ... 错误处理 ...
  const content = context.source.slice(0, closeIndex)
  context.advanceBy(content.length)
  context.advanceBy('-->'.length)

  return {
    type: 'Comment',
    content
  }
}
```



