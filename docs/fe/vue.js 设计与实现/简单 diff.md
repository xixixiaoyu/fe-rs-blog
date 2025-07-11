## 1. 为什么需要 Diff 算法？
在前端渲染中，页面的更新通常涉及新旧虚拟节点（Virtual Node，简称 VNode）的比较。虚拟节点是真实 DOM 的轻量级表示，包含了节点类型、属性和子节点等信息。当页面的状态发生变化时，渲染器需要根据新的虚拟节点更新真实 DOM。如果直接卸载所有旧节点并挂载新节点，虽然能完成更新，但会带来巨大的性能开销，因为 DOM 操作（如创建、删除节点）是昂贵的。

**Diff 算法**的核心目标是：通过比较新旧虚拟节点的差异，尽可能复用现有的 DOM 元素，只对必要部分进行更新，从而减少 DOM 操作的次数，提升性能。简单 Diff 算法是 Diff 算法的一种基础实现，适用于新旧虚拟节点都包含一组子节点的情况。

---

## 2. 减少 DOM 操作的性能开销
### 2.1 问题：暴力更新的低效性
假设我们有以下新旧虚拟节点：

```javascript
// 旧虚拟节点
const oldVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '1' },
    { type: 'p', children: '2' },
    { type: 'p', children: '3' }
  ]
}

// 新虚拟节点
const newVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '4' },
    { type: 'p', children: '5' },
    { type: 'p', children: '6' }
  ]
}
```

如果采用“暴力更新”的方式，即卸载所有旧子节点（3 次 DOM 删除操作）并挂载所有新子节点（3 次 DOM 添加操作），总共需要 6 次 DOM 操作。然而，通过观察可以发现：

+ 新旧子节点都是 `p` 标签，结构一致，只有文本内容发生了变化。
+ 理想的更新方式是：直接更新每个 `p` 标签的文本内容，只需 3 次 DOM 操作（更新文本节点）。

这种方式将 DOM 操作次数减半，性能提升显著。简单 Diff 算法正是基于这一思路，通过比较新旧子节点，复用 DOM 元素，仅更新必要的内容。

### 2.2 实现简单 Diff 算法
以下是简单 Diff 算法的初版实现，通过逐一比较新旧子节点，调用 `patch` 函数进行更新：

```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 处理文本子节点的情况
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children
    // 遍历旧子节点
    for (let i = 0; i < oldChildren.length; i++) {
      // 逐一更新对应位置的子节点
      patch(oldChildren[i], newChildren[i], container)
    }
  } else {
    // 其他情况
  }
}
```

在这段代码中：

+ `oldChildren` 和 `newChildren` 分别是旧和新虚拟节点的子节点数组。
+ 通过遍历旧子节点，假设新旧子节点数量相等，调用 `patch` 函数逐一更新对应位置的节点。
+ `patch` 函数会检测新旧子节点的差异（例如文本内容变化），只更新必要的部分（如文本节点）。

这样，DOM 操作从 6 次减少到 3 次，性能显著提升。

### 2.3 处理新旧子节点数量不等的情况
上述实现假设新旧子节点数量相等，但实际场景中可能存在以下情况：

+ **新子节点数量少于旧子节点**：需要卸载多余的旧节点。
+ **新子节点数量多于旧子节点**：需要挂载新增的节点。

为了处理这些情况，我们需要：

1. 遍历新旧子节点中较短的那一组，逐一调用 `patch` 更新。
2. 比较新旧子节点数量，挂载新节点或卸载旧节点。

优化后的代码如下：

```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 处理文本子节点
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children
    const oldLen = oldChildren.length
    const newLen = newChildren.length
    // 取新旧子节点中最短的长度
    const commonLength = Math.min(oldLen, newLen)
    // 更新公共部分
    for (let i = 0; i < commonLength; i++) {
      patch(oldChildren[i], newChildren[i], container)
    }
    // 挂载新节点
    if (newLen > oldLen) {
      for (let i = commonLength; i < newLen; i++) {
        patch(null, newChildren[i], container)
      }
    // 卸载旧节点
    } else if (oldLen > newLen) {
      for (let i = commonLength; i < oldLen; i++) {
        unmount(oldChildren[i])
      }
    }
  } else {
    // 其他情况
  }
}
```

这个版本的算法能够正确处理新旧子节点数量不等的情况，确保只执行必要的 DOM 操作。

---

## 3. DOM 复用与 `key` 的作用
### 3.1 顺序变化导致的性能问题
尽管上述算法减少了 DOM 操作次数，但在某些场景下仍有优化空间。例如，考虑以下新旧子节点：

```javascript
// 旧子节点
const oldChildren = [
  { type: 'p' },
  { type: 'div' },
  { type: 'span' }
]

// 新子节点
const newChildren = [
  { type: 'span' },
  { type: 'p' },
  { type: 'div' }
]
```

如果按照之前的算法更新：

+ 每个位置的节点类型不同（`p` vs `span`，`div` vs `p`，`span` vs `div`）。
+ 每次更新需要卸载旧节点并挂载新节点，总共需要 6 次 DOM 操作（3 次删除 + 3 次添加）。

但仔细观察可以发现，新旧子节点只是顺序发生了变化，节点本身可以复用。如果通过 DOM 移动操作调整顺序，而不是销毁和重建节点，可以进一步减少 DOM 操作。

### 3.2 引入 `key` 属性
为了实现 DOM 复用，我们需要一种方式来标识新旧子节点之间的对应关系。这就是 `key` 属性的作用。`key` 就像虚拟节点的“身份证号”，通过比较 `key` 值，我们可以判断哪些节点可以复用。例如：

```javascript
// 旧子节点
const oldChildren = [
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '2', key: 2 },
  { type: 'p', children: '3', key: 3 }
]

// 新子节点
const newChildren = [
  { type: 'p', children: '3', key: 3 },
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '2', key: 2 }
]
```

通过 `key` 属性，我们可以明确：

+ 新子节点中的 `{ type: 'p', children: '3', key: 3 }` 对应旧子节点中的第 3 个节点。
+ 只需要移动 DOM 元素并更新文本内容，而无需销毁和重建。

### 3.3 实现基于 `key` 的 Diff 算法
以下是基于 `key` 的 Diff 算法实现：

```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 处理文本子节点
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children
    // 遍历新子节点
    for (let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i]
      // 在旧子节点中寻找具有相同 key 的节点
      for (let j = 0; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j]
        if (newVNode.key === oldVNode.key) {
          // 找到可复用节点，调用 patch 更新
          patch(oldVNode, newVNode, container)
          break
        }
      }
    }
  } else {
    // 其他情况
  }
}
```

这段代码通过双层循环：

1. 外层循环遍历新子节点。
2. 内层循环在旧子节点中寻找具有相同 `key` 的节点。
3. 找到后调用 `patch` 函数更新节点内容（例如文本变化）。

这样，我们可以复用 DOM 元素，只更新必要的内容（如文本），避免不必要的节点销毁和重建。

---

## 4. 判断和实现 DOM 移动
### 4.1 如何判断节点需要移动？
即使通过 `key` 找到可复用节点，DOM 元素的顺序可能仍需调整。例如：

```javascript
// 旧子节点
const oldChildren = [
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '2', key: 2 },
  { type: 'p', children: 'hello', key: 3 }
]

// 新子节点
const newChildren = [
  { type: 'p', children: 'world', key: 3 },
  { type: 'p', children: '1', key: 1 },
 2 { type: 'p', children: '2', key: 2 }
]
```

新子节点的顺序变为 `key: 3 -> 1 -> 2`，而旧子节点是 `key: 1 -> 2 -> 3`。我们需要移动 DOM 元素以匹配新顺序。

判断节点是否需要移动的关键是：**比较节点在旧子节点中的索引与当前最大索引（**`lastIndex`**）**。如果当前节点的索引小于 `lastIndex`，说明它在新顺序中靠后，需要移动 DOM 元素。

### 4.2 实现 DOM 移动
以下是优化后的 `patchChildren` 函数，增加了节点移动逻辑：

```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 处理文本子节点
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children
    let lastIndex = 0
    for (let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i]
      for (let j = 0; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j]
        if (newVNode.key === oldVNode.key) {
          patch(oldVNode, newVNode, container)
          if (j < lastIndex) {
            // 需要移动 DOM
            const prevVNode = newChildren[i - 1]
            if (prevVNode) {
              const anchor = prevVNode.el.nextSibling
              insert(newVNode.el, container, anchor)
            }
          } else {
            lastIndex = j
          }
          break
        }
      }
    }
  } else {
    // 其他情况
  }
}
```

**代码逻辑**：

+ 使用 `lastIndex` 记录寻找过程中遇到的最大索引值。
+ 如果找到的旧节点索引 `j` 小于 `lastIndex`，说明该节点在新顺序中靠后，需要移动其对应的真实 DOM。
+ 移动时，获取前一个新节点（`prevVNode`）的下一个兄弟节点作为锚点（`anchor`），然后调用 `insert` 函数将当前节点的 DOM 插入到锚点前。

**insert 函数**：

```javascript
const renderer = createRenderer({
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  }
  // 其他方法
})
```

通过浏览器原生的 `insertBefore` 方法，我们可以高效地移动 DOM 元素。

---

## 5. 处理新增和删除节点
### 5.1 新增节点
当新子节点中存在旧子节点中没有的节点时，需要将其挂载。例如：

```javascript
// 旧子节点
const oldChildren = [
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '2', key: 2 },
  { type: 'p', children: '3', key: 3 }
]

// 新子节点
const newChildren = [
  { type: 'p', children: '3', key: 3 },
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '4', key: 4 },
  { type: 'p', children: '2', key: 2 }
]
```

新子节点中多了 `key: 4` 的节点，需要挂载。实现代码如下：

```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 处理文本子节点
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children
    let lastIndex = 0
    for (let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i]
      let find = false
      for (let j = 0; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j]
        if (newVNode.key === oldVNode.key) {
          find = true
          patch(oldVNode, newVNode, container)
          if (j < lastIndex) {
            const prevVNode = newChildren[i - 1]
            if (prevVNode) {
              const anchor = prevVNode.el.nextSibling
              insert(newVNode.el, container, anchor)
            }
          } else {
            lastIndex = j
          }
          break
        }
      }
      // 新增节点
      if (!find) {
        const prevVNode = newChildren[i - 1]
        let anchor = null
        if (prevVNode) {
          anchor = prevVNode.el.nextSibling
        } else {
          anchor = container.firstChild
        }
        patch(null, newVNode, container, anchor)
      }
    }
  } else {
    // 其他情况
  }
}
```

**逻辑说明**：

+ 使用 `find` 变量记录是否找到可复用节点。
+ 如果遍历完旧子节点后 `find` 仍为 `false`，说明当前 `newVNode` 是新节点，需要挂载。
+ 挂载时，获取前一个节点的下一个兄弟节点作为锚点（或容器第一个子节点），调用 `patch` 函数挂载新节点。

### 5.2 删除节点
当旧子节点中存在新子节点中没有的节点时，需要卸载。例如：

```javascript
// 旧子节点
const oldChildren = [
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '2', key: 2 },
  { type: 'p', children: '3', key: 3 }
]

// 新子节点
const newChildren = [
  { type: 'p', children: '3', key: 3 },
  { type: 'p', children: '1', key: 1 }
]
```

`key: 2` 的节点在新子节点中不存在，需要卸载。实现代码如下：

```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 处理文本子节点
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children
    let lastIndex = 0
    for (let i = 0; i < newChildren.length; i++) {
      // 移动和新增逻辑（同上）
    }
    // 删除不存在的节点
    for (let i = 0; i < oldChildren.length; i++) {
      const oldVNode = oldChildren[i]
      const has = newChildren.find(vnode => vnode.key === oldVNode.key)
      if (!has) {
        unmount(oldVNode)
      }
    }
  } else {
    // 其他情况
  }
}
```

**逻辑说明**：

+ 在新子节点更新完成后，遍历旧子节点。
+ 对每个旧节点，在新子节点中查找相同 `key` 的节点。
+ 如果找不到，调用 `unmount` 函数卸载该节点。

