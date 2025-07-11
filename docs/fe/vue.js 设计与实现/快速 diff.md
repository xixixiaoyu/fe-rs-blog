## 1. 为什么需要快速 Diff 算法？
在前端开发中，虚拟 DOM 的核心任务是将新旧两组子节点进行比较，找出差异并高效更新真实 DOM。传统的简单 Diff 算法和双端 Diff 算法虽然有效，但在复杂场景下效率不高。快速 Diff 算法通过引入预处理步骤和最长递增子序列优化，显著减少了不必要的 DOM 操作。

**核心优势**：

+ **预处理**：借鉴文本 Diff 算法，先处理相同的前后节点，缩小需要比较的范围。
+ **高效移动**：通过最长递增子序列，精准判断哪些节点无需移动，减少 DOM 操作。
+ **性能优异**：实测中，快速 Diff 算法在 DOM 操作的各个方面均优于 Vue.js 2 的双端 Diff 算法。

接下来，我们将从算法的预处理步骤开始，逐步解析其实现逻辑。

---

## 2. 预处理：快速定位相同节点
快速 Diff 算法的第一个关键步骤是预处理，灵感来源于文本 Diff 算法。在文本比较中，我们会先检查两段文本是否完全相同，或者找出相同的前缀和后缀，以减少后续的比较工作。类似地，快速 Diff 算法在比较新旧子节点时，先处理相同的前置和后置节点。

### 2.1 相同前置节点的处理
假设我们有以下新旧子节点：

+ 旧子节点：`p-1, p-2, p-3`
+ 新子节点：`p-1, p-4, p-2, p-3`

通过观察，两组子节点的开头都有 `p-1`，结尾都有 `p-2, p-3`。这些节点在新旧子节点中的相对位置不变，因此无需移动，只需更新（patch）其内容。

我们用一个索引 `j` 指向两组子节点的开头，通过 `while` 循环遍历，直到遇到不同的节点：

```javascript
function patchKeyedChildren(n1, n2, container) {
  const newChildren = n2.children
  const oldChildren = n1.children
  // 处理相同的前置节点
  let j = 0
  let oldVNode = oldChildren[j]
  let newVNode = newChildren[j]
  while (oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container) // 更新节点
    j++
    oldVNode = oldChildren[j]
    newVNode = newChildren[j]
  }
}
```

在这个例子中，循环处理到 `p-1` 后，遇到 `p-2` 和 `p-4`（不同节点），循环停止。此时 `j = 1`。

### 2.2 相同后置节点的处理
接下来处理后置节点。我们引入两个索引：`oldEnd` 和 `newEnd`，分别指向旧和新子节点的最后一个节点：

```javascript
let oldEnd = oldChildren.length - 1
let newEnd = newChildren.length - 1
oldVNode = oldChildren[oldEnd]
newVNode = newChildren[newEnd]
while (oldVNode.key === newVNode.key) {
  patch(oldVNode, newVNode, container) // 更新节点
  oldEnd--
  newEnd--
  oldVNode = oldChildren[oldEnd]
  newVNode = newChildren[newEnd]
}
```

在这个例子中，循环处理了 `p-3` 和 `p-2`，最终 `oldEnd = 0`，`newEnd = 1`。此时，旧子节点已全部处理，新子节点中剩余 `p-4`。

### 2.3 新增或删除节点
预处理后，我们通过索引 `j`、`oldEnd` 和 `newEnd` 判断剩余节点的情况：

+ **新增节点**：如果 `j > oldEnd && j <= newEnd`，说明旧子节点处理完毕，新子节点有剩余，这些节点是新增的。例如，`p-4` 需要挂载：

```javascript
if (j > oldEnd && j <= newEnd) {
  const anchorIndex = newEnd + 1
  const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
  while (j <= newEnd) {
    patch(null, newChildren[j++], container, anchor) // 挂载新节点
  }
}
```

+ **删除节点**：如果 `j > newEnd && j <= oldEnd`，说明新子节点处理完毕，旧子节点有剩余，这些节点需要卸载。例如：

```javascript
else if (j > newEnd && j <= oldEnd) {
  while (j <= oldEnd) {
    unmount(oldChildren[j++]) // 卸载旧节点
  }
}
```

通过预处理，快速 Diff 算法大幅减少了需要进一步比较的节点数量，简化了后续操作。

---

## 3. 处理复杂情况：节点移动与优化
在理想情况下，预处理后可能只剩新增或删除操作。但在复杂场景中，比如以下新旧子节点：

+ 旧子节点：`p-1, p-2, p-3, p-4, p-6, p-5`
+ 新子节点：`p-1, p-3, p-4, p-2, p-7, p-5`

预处理后，只有 `p-1`（前置）和 `p-5`（后置）被处理，剩余节点需要进一步比较：

+ 旧子节点剩余：`p-2, p-3, p-4, p-6`
+ 新子节点剩余：`p-3, p-4, p-2, p-7`

此时，索引不满足新增或删除的条件（`j <= oldEnd && j <= newEnd`），需要判断节点是否需要移动，以及如何移动。

### 3.1 构建 Source 数组
为了高效比较，我们构造一个 `source` 数组，记录新子节点在旧子节点中的位置索引：

```javascript
const count = newEnd - j + 1 // 剩余新节点数量
const source = new Array(count).fill(-1) // 初始化为 -1
const oldStart = j
const newStart = j
const keyIndex = {} // 索引表
for (let i = newStart; i <= newEnd; i++) {
  keyIndex[newChildren[i].key] = i // 构建 key 到索引的映射
}
for (let i = oldStart; i <= oldEnd; i++) {
  const oldVNode = oldChildren[i]
  const k = keyIndex[oldVNode.key]
  if (typeof k !== 'undefined') {
    const newVNode = newChildren[k]
    patch(oldVNode, newVNode, container)
    source[k - newStart] = i // 记录旧节点位置
  } else {
    unmount(oldVNode) // 旧节点不存在于新节点中，卸载
  }
}
```

对于上述例子，`source` 数组为 `[2, 3, 1, -1]`，表示：

+ 新节点 `p-3` 在旧节点中的索引为 `2`
+ 新节点 `p-4` 在旧节点中的索引为 `3`
+ 新节点 `p-2` 在旧节点中的索引为 `1`
+ 新节点 `p-7` 在旧节点中不存在，值为 `-1`

使用 `keyIndex` 索引表将时间复杂度从 `O(n^2)` 降到 `O(n)`，极大提升了效率。

### 3.2 判断节点是否需要移动
我们通过 `source` 数组判断节点是否需要移动，方法类似简单 Diff 算法：

```javascript
let moved = false
let pos = 0
let patched = 0
for (let i = oldStart; i <= oldEnd; i++) {
  const oldVNode = oldChildren[i]
  if (patched <= count) {
    const k = keyIndex[oldVNode.key]
    if (typeof k !== 'undefined') {
      const newVNode = newChildren[k]
      patch(oldVNode, newVNode, container)
      patched++
      source[k - newStart] = i
      if (k < pos) {
        moved = true // 索引非递增，需移动
      } else {
        pos = k
      }
    } else {
      unmount(oldVNode)
    }
  } else {
    unmount(oldVNode) // 多余节点卸载
  }
}
```

变量 `moved` 标记是否需要移动，`pos` 记录遍历中遇到的最大索引。如果当前索引 `k` 小于 `pos`，说明节点顺序变化，需要移动。

### 3.3 执行 DOM 移动
如果 `moved` 为 `true`，我们需要计算 `source` 数组的最长递增子序列（LIS），以确定哪些节点无需移动。假设 `source = [2, 3, 1, -1]`，其 LIS 为 `[2, 3]`，对应新节点中的 `p-3, p-4`，表示这些节点无需移动。

我们用索引 `i` 指向新子节点的最后一个节点，`s` 指向 LIS 的最后一个元素，逆序遍历：

```javascript
if (moved) {
  const seq = lis(source) // 计算 LIS，例如 [0, 1]
  let s = seq.length - 1
  let i = count - 1
  for (i; i >= 0; i--) {
    if (source[i] === -1) {
      const pos = i + newStart
      const newVNode = newChildren[pos]
      const nextPos = pos + 1
      const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null
      patch(null, newVNode, container, anchor) // 挂载新节点
    } else if (i !== seq[s]) {
      const pos = i + newStart
      const newVNode = newChildren[pos]
      const nextPos = pos + 1
      const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null
      insert(newVNode.el, container, anchor) // 移动节点
    } else {
      s-- // 无需移动，s 向前
    }
  }
}
```

在这个例子中：

+ `p-7`（`source[3] = -1`）是新节点，挂载。
+ `p-2`（`source[2] = 1`）需要移动，因其索引不在 LIS 中。
+ `p-4` 和 `p-3`（`source[1] = 3, source[0] = 2`）在 LIS 中，无需移动。

---

## 4. 为什么快速 Diff 算法高效？
快速 Diff 算法的高效性源于以下几点：

1. **预处理减少比较范围**：通过处理相同的前后节点，快速锁定需要进一步处理的节点。
2. **索引表优化查找**：将节点查找的时间复杂度从 `O(n^2)` 降到 `O(n)`。
3. **最长递增子序列**：精准判断无需移动的节点，最大限度减少 DOM 操作。

相比双端 Diff 算法，快速 Diff 算法在复杂场景下更高效，因为它避免了不必要的双端比较，直接聚焦于实际需要更新的部分。

