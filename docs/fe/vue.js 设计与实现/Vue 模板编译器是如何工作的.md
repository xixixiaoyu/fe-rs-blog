你有没有想过，我们每天在 Vue 项目里写的 `<template>`，那些看起来像 HTML 的代码，最后是怎样变成能在浏览器里高效运行的 JavaScript 代码的？这背后的魔法，就是**编译器**。

别担心，我们不是要深入研究那些能编译 C++ 或 Java 的复杂大家伙。作为前端开发者，我们接触的编译技术通常更专注、更轻量，比如处理自定义公式、或者像 Vue 模板和 JSX 这样的**领域特定语言 (DSL)**。

这篇文章会带你一步步揭开 Vue 模板编译器的神秘面纱，看看它是如何把我们熟悉的模板字符串，一步步“翻译”成最终的渲染函数的。整个过程主要分为三步：

1. **解析 (Parse)**：把模板字符串变成一种叫做“抽象语法树”(AST) 的数据结构。
2. **转换 (Transform)**：对 AST 进行加工，把它变成更适合生成代码的 JavaScript AST。
3. **生成 (Generate)**：根据 JavaScript AST，拼接出最终的渲染函数代码字符串。

听起来有点抽象？没关系，我们马上开始逐一分解。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22d5733f521b44c6888568511634358a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1658&h=262&s=47231&e=png&b=fefefe)

### 第一步：解析 (Parse) - 从字符串到 AST
解析器的任务是把一长串模板字符串，转换成一个结构化的对象，也就是**抽象语法树 (AST)**。这个 AST 就像是模板的“骨架”，用对象的形式描述了模板的层级、标签、属性和文本内容。

例如，这样一段模板：

```html
<div>
  <h1 v-if="ok">Vue Template</h1>
</div>
```

会被解析成下面这样的 AST 对象：

```javascript
const ast = {
  type: 'Root',
  children: [
    {
      type: 'Element',
      tag: 'div',
      children: [
        {
          type: 'Element',
          tag: 'h1',
          props: [
            {
              type: 'Directive',
              name: 'if',
              exp: {
                type: 'Expression',
                content: 'ok'
              }
            }
          ]
          // ... h1 的子节点
        }
      ]
    }
  ]
}
```

可以看到，AST 的结构和模板的嵌套关系是完全对应的。那么，解析器是怎么做到这一点的呢？

#### 1. 词法分析：用状态机切分 Token
首先，解析器需要像庖丁解牛一样，把整个字符串切成一个个有意义的小块，这些小块叫做 **Token**。比如，对于 `<p>Vue</p>`，它可以被切分成：

+ 开始标签 Token: `<p>`
+ 文本 Token: `Vue`
+ 结束标签 Token: `</p>`

这个切割过程的背后，是一个叫做**有限状态自动机 (FSM)** 的模型。别被这个名字吓到，它其实很好理解。想象一个机器人，它有一个初始状态，然后一个字符一个字符地读取模板字符串，并根据读到的字符在不同状态间切换。

+ **初始状态**：读到 `<`，哦，这可能是一个标签的开始，切换到“标签开始状态”。
+ **标签开始状态**：读到字母 `p`，好的，这是一个标签名，切换到“标签名状态”。
+ **标签名状态**：读到 `>`，一个开始标签完成了！生成一个 `tag` 类型的 Token，然后回到“初始状态”。
+ **初始状态**：读到字母 `V`，这应该是文本内容，切换到“文本状态”。
+ **文本状态**：继续读 `u`、`e`... 直到再次遇到 `<`。此时，把之前收集的 "Vue" 生成一个 `text` 类型的 Token，然后因为读到了 `<`，再次切换到“标签开始状态”。

这个过程会一直持续，直到所有字符都被处理完，我们就得到了一系列 Token。

下面是一个简化的 `tokenize` 函数，它用代码模拟了状态机的行为：

```javascript
// 定义状态
const State = {
  initial: 1,
  tagOpen: 2,
  tagName: 3,
  text: 4,
  tagEnd: 5,
  tagEndName: 6
}

function isAlpha(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
}

function tokenize(str) {
  let currentState = State.initial
  const chars = []
  const tokens = []

  while (str) {
    const char = str[0]
    switch (currentState) {
      case State.initial:
        if (char === '<') {
          currentState = State.tagOpen
          str = str.slice(1)
        } else if (isAlpha(char)) {
          currentState = State.text
          chars.push(char)
          str = str.slice(1)
        }
        break
      case State.tagOpen:
        if (isAlpha(char)) {
          currentState = State.tagName
          chars.push(char)
          str = str.slice(1)
        } else if (char === '/') {
          currentState = State.tagEnd
          str = str.slice(1)
        }
        break
      case State.tagName:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        } else if (char === '>') {
          currentState = State.initial
          tokens.push({ type: 'tag', name: chars.join('') })
          chars.length = 0
          str = str.slice(1)
        }
        break
      case State.text:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        } else if (char === '<') {
          currentState = State.tagOpen
          tokens.push({ type: 'text', content: chars.join('') })
          chars.length = 0
          str = str.slice(1)
        }
        break
      case State.tagEnd:
        if (isAlpha(char)) {
          currentState = State.tagEndName
          chars.push(char)
          str = str.slice(1)
        }
        break
      case State.tagEndName:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        } else if (char === '>') {
          currentState = State.initial
          tokens.push({ type: 'tagEnd', name: chars.join('') })
          chars.length = 0
          str = str.slice(1)
        }
        break
    }
  }

  return tokens
}
```

#### 2. 语法分析：用栈构建 AST
有了 Token 列表，我们就可以开始构建 AST 了。这个过程非常直观，因为 HTML 标签天然就是嵌套的树状结构。我们可以利用一个**栈**来追踪元素的父子关系。

我们来手动模拟一下解析 `<div><p>Vue</p></div>` 的过程：

1. **初始化**：创建一个 `Root` 根节点，并把它和 Token 列表准备好。创建一个 `elementStack` 栈，并将 `Root` 节点压入。
2. **扫描到 **`<div>`** (开始标签)**：创建一个 `Element` 节点，把它加到当前栈顶节点（`Root`）的 `children` 里。然后，把这个 `div` 节点压入栈中。现在，它成了新的父节点。
3. **扫描到 **`<p>`** (开始标签)**：同样，创建 `p` 节点，把它加到当前栈顶节点（`div`）的 `children` 里，再把 `p` 节点压入栈。
4. **扫描到 **`Vue`** (文本)**：创建 `Text` 节点，把它加到当前栈顶节点（`p`）的 `children` 里。文本节点是叶子节点，不需要入栈。
5. **扫描到 **`</p>`** (结束标签)**：这表示一个标签的结束。我们从栈中弹出栈顶元素（`p` 节点）。现在栈顶又变回了 `div` 节点。
6. **扫描到 **`</div>`** (结束标签)**：同样，弹出栈顶的 `div` 节点。

当所有 Token 都被处理完，一个完整的 AST 就构建好了。

```javascript
function parse(str) {
  const tokens = tokenize(str)

  const root = {
    type: 'Root',
    children: []
  }
  // 元素栈，用于维护父子关系
  const elementStack = [root]

  while (tokens.length) {
    const parent = elementStack[elementStack.length - 1]
    const t = tokens[0]

    switch (t.type) {
      case 'tag':
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: []
        }
        parent.children.push(elementNode)
        elementStack.push(elementNode) // 入栈
        break
      case 'text':
        const textNode = {
          type: 'Text',
          content: t.content
        }
        parent.children.push(textNode)
        break
      case 'tagEnd':
        elementStack.pop() // 出栈
        break
    }
    tokens.shift()
  }

  return root
}
```

### 第二步：转换 (Transform) - 加工和优化 AST
现在我们有了一个描述模板结构的 AST，但我们的最终目标是生成 JavaScript 代码。所以，我们需要把这个**模板 AST** 转换成一个能描述 JavaScript 代码的 **JavaScript AST**。

这个转换过程不仅是格式的改变，更是一个进行各种分析和优化的绝佳时机，比如：

+ 检查 `v-if` / `v-else` 是否配对。
+ 分析哪些属性是静态的，可以在编译期直接确定。
+ 处理插槽等复杂特性。

#### 插件化的转换架构
为了让转换过程灵活且可扩展，Vue 采用了一种插件化的架构。核心是一个 `traverseNode` 函数，它会深度优先遍历整个 AST，并在访问每个节点时，执行一系列我们注册的转换函数。

```javascript
function traverseNode(ast, context) {
  context.currentNode = ast

  // 1. 执行所有注册的转换函数 (进入阶段)
  const transforms = context.nodeTransforms
  const exitFns = []
  for (let i = 0; i < transforms.length; i++) {
    // 转换函数可以返回一个“退出阶段”的函数
    const onExit = transforms[i](context.currentNode, context)
    if (onExit) {
      exitFns.push(onExit)
    }
    // 如果节点被移除了，就没必要继续了
    if (!context.currentNode) return
  }

  // 2. 递归遍历子节点
  const children = context.currentNode.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      context.parent = context.currentNode
      context.childIndex = i
      traverseNode(children[i], context)
    }
  }
  
  // 3. 执行“退出阶段”的函数 (反向执行)
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}
```

这个设计非常精妙：

+ `context`** 对象**：它像一个工具箱，在整个遍历过程中传递。里面存放着当前节点、父节点、以及一些辅助函数（如 `replaceNode`、`removeNode`），供所有转换函数共享使用。
+ **进入与退出阶段**：转换函数可以返回另一个函数。这个返回的函数会在当前节点的所有子节点都处理完毕后才执行。这对于需要依赖子节点信息的父节点转换来说至关重要。

#### 将模板 AST 转为 JavaScript AST
我们的目标是把模板 `<div><p>Vue</p><p>Template</p></div>` 转换成等价的渲染函数调用：

```javascript
function render() {
  return h('div', [
    h('p', 'Vue'),
    h('p', 'Template')
  ])
}
```

所以，我们需要把模板 AST 节点转换成描述 `h()` 函数调用的 JavaScript AST 节点。

+ **文本节点** (`Text`) -> **字符串字面量** (`StringLiteral`)
+ **元素节点** (`Element`) -> **函数调用** (`CallExpression`)，即 `h(...)`

我们会编写 `transformText` 和 `transformElement` 这样的转换函数，并将它们注册到 `context.nodeTransforms` 中。每个函数负责将对应类型的模板 AST 节点转换成 JS AST 节点，并存放在一个新属性 `node.jsNode` 上。

```javascript
// 转换文本节点
function transformText(node) {
  if (node.type !== 'Text') return
  // 文本节点直接变成一个字符串字面量
  node.jsNode = createStringLiteral(node.content)
}

// 转换元素节点
function transformElement(node) {
  // 在退出阶段执行，确保所有子节点都已转换完毕
  return () => {
    if (node.type !== 'Element') return

    // 创建 h() 函数调用
    const callExp = createCallExpression('h', [
      createStringLiteral(node.tag)
    ])
    
    // 处理子节点作为 h() 的第二个参数
    if (node.children.length === 1) {
      callExp.arguments.push(node.children[0].jsNode)
    } else {
      callExp.arguments.push(
        createArrayExpression(node.children.map(c => c.jsNode))
      )
    }

    node.jsNode = callExp
  }
}
```

最后，我们还需要一个 `transformRoot` 函数，在所有节点都转换完毕后，将根节点的 `jsNode` 包装成一个完整的 `render` 函数声明。

### 第三步：生成 (Generate) - 从 JS AST 到代码字符串
这是最后一步，也是最直接的一步。代码生成就是遍历我们刚刚得到的 JavaScript AST，然后拼接出最终的代码字符串。这本质上是一门“字符串拼接的艺术”。

我们会创建一个 `generate` 函数，它同样依赖一个 `context` 对象来管理生成的代码字符串、缩进等格式化信息。

```javascript
function generate(node) {
  const context = {
    code: '',
    currentIndent: 0,
    push(code) {
      this.code += code
    },
    newline() {
      this.code += '\n' + '  '.repeat(this.currentIndent)
    },
    indent() {
      this.currentIndent++
      this.newline()
    },
    deIndent() {
      this.currentIndent--
      this.newline()
    }
  }

  genNode(node, context)
  return context.code
}
```

核心是一个 `genNode` 函数，它像一个调度中心，根据不同类型的 JS AST 节点，调用相应的生成函数。

```javascript
function genNode(node, context) {
  switch (node.type) {
    case 'FunctionDecl':
      genFunctionDecl(node, context)
      break
    case 'ReturnStatement':
      genReturnStatement(node, context)
      break
    case 'CallExpression':
      genCallExpression(node, context)
      break
    case 'StringLiteral':
      genStringLiteral(node, context)
      break
    case 'ArrayExpression':
      genArrayExpression(node, context)
      break
  }
}
```

每个具体的生成函数都只做一件事：根据节点信息，调用 `context.push` 来拼接字符串。

例如，`genCallExpression` 的实现可能如下：

```javascript
function genCallExpression(node, context) {
  const { push } = context
  const { callee, arguments: args } = node
  
  push(`${callee.name}(`)
  genNodeList(args, context) // 递归生成参数列表
  push(')')
}

function genStringLiteral(node, context) {
  const { push } = context
  push(`'${node.value}'`)
}
```

通过这样层层递归，我们就能把整个 JavaScript AST “打印”成一段格式优美、可执行的渲染函数代码了。

