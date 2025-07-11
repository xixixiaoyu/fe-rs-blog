## 一、双端 Diff 算法的核心思想
双端 Diff 算法（Double-End Diff Algorithm）是一种通过同时比较新旧两组子节点的头尾端点来优化 DOM 更新的算法。它的目标是通过最少的 DOM 操作（如移动、添加、删除）使真实 DOM 的结构与新虚拟 DOM 保持一致。与简单 Diff 算法相比，双端 Diff 算法能显著减少不必要的 DOM 移动操作，从而提升性能。

### 1. 为什么需要双端 Diff 算法？
简单 Diff 算法在处理某些场景时效率不高。例如，假设旧子节点顺序为 `p-1, p-2, p-3`，新子节点顺序为 `p-3, p-1, p-2`。简单 Diff 算法需要两次 DOM 移动操作：先将 `p-1` 移动到 `p-3` 后面，再将 `p-2` 移动到 `p-1` 后面。而实际上，只需一次操作——将 `p-3` 移动到 `p-1` 前面即可。这种非最优的移动操作是简单 Diff 算法的缺陷。

双端 Diff 算法通过同时比较新旧子节点的头尾端点，找到最优的复用和移动路径，从而减少 DOM 操作次数。

### 2. 双端 Diff 算法的比较方式
双端 Diff 算法的核心是维护四个索引，分别指向新旧两组子节点的头尾端点：

+ `oldStartIdx`：旧子节点列表的头部索引
+ `oldEndIdx`：旧子节点列表的尾部索引
+ `newStartIdx`：新子节点列表的头部索引
+ `newEndIdx`：新子节点列表的尾部索引

通过这四个索引，我们可以获取对应的虚拟节点（`oldStartVNode`、`oldEndVNode`、`newStartVNode`、`newEndVNode`），并进行以下四种比较：

1. **旧头 vs 新头**：比较 `oldStartVNode` 和 `newStartVNode` 的 key 值。
2. **旧尾 vs 新尾**：比较 `oldEndVNode` 和 `newEndVNode` 的 key 值。
3. **旧头 vs 新尾**：比较 `oldStartVNode` 和 `newEndVNode` 的 key 值。
4. **旧尾 vs 新头**：比较 `oldEndVNode` 和 `newStartVNode` 的 key 值。

如果某一步骤找到 key 相同的节点，则说明可以复用对应的真实 DOM，只需移动到正确位置并打补丁（patch）。如果四步都未命中，则需要额外逻辑处理非理想情况。

---

## 二、双端 Diff 算法的实现步骤
下面通过一个具体例子，逐步讲解双端 Diff 算法的实现逻辑。假设旧子节点为 `p-1, p-2, p-3, p-4`，新子节点为 `p-2, p-4, p-1, p-3`，我们来看如何通过双端 Diff 算法完成更新。

### 1. 初始化索引和节点
```javascript
function patchKeyedChildren(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children
  // 初始化四个索引
  let oldStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newStartIdx = 0
  let newEndIdx = newChildren.length - 1
  // 获取头尾虚拟节点
  let oldStartVNode = oldChildren[oldStartIdx]
  let oldEndVNode = oldChildren[oldEndIdx]
  let newStartVNode = newChildren[newStartIdx]
  let newEndVNode = newChildren[newEndIdx]
  // 进入比较循环
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 比较逻辑
  }
}
```

### 2. 比较与更新逻辑
在 `while` 循环中，算法会不断比较四个端点的节点，直到头尾索引交叉（即 `oldStartIdx > oldEndIdx` 或 `newStartIdx > newEndIdx`）。以下是第一轮比较的步骤：

+ **第一步：旧头 vs 新头**（`p-1` vs `p-2`）：key 不同，无法复用，跳过。
+ **第二步：旧尾 vs 新尾**（`p-4` vs `p-3`）：key 不同，无法复用，跳过。
+ **第三步：旧头 vs 新尾**（`p-1` vs `p-3`）：key 不同，无法复用，跳过。
+ **第四步：旧尾 vs 新头**（`p-4` vs `p-2`）：key 不同，无法复用。

由于四步均未命中，进入非理想情况处理：在新子节点的头部节点 `p-2` 中寻找旧子节点中 key 相同的节点。

### 3. 处理非理想情况
如果四步比较都未找到可复用节点，算法会遍历旧子节点列表，查找与新子节点头部节点（`newStartVNode`）key 相同的节点：

```javascript
const idxInOld = oldChildren.findIndex(node => node.key === newStartVNode.key)
if (idxInOld > 0) {
  const vnodeToMove = oldChildren[idxInOld]
  patch(vnodeToMove, newStartVNode, container)
  insert(vnodeToMove.el, container, oldStartVNode.el)
  oldChildren[idxInOld] = undefined
  newStartVNode = newChildren[++newStartIdx]
}
```

在例子中，`p-2` 在旧子节点中索引为 1，找到后：

+ 调用 `patch` 函数更新节点内容。
+ 将 `p-2` 对应的真实 DOM 移动到旧头部节点 `p-1` 之前。
+ 将旧子节点中对应位置设为 `undefined`，避免重复处理。
+ 更新 `newStartIdx` 到下一个位置。

更新后，真实 DOM 顺序变为：`p-2, p-1, p-3, p-4`。

### 4. 继续比较
下一轮比较继续：

+ **第一步：旧头 vs 新头**（`p-1` vs `p-4`）：key 不同。
+ **第二步：旧尾 vs 新尾**（`p-4` vs `p-3`）：key 不同。
+ **第三步：旧头 vs 新尾**（`p-1` vs `p-3`）：key 不同。
+ **第四步：旧尾 vs 新头**（`p-4` vs `p-4`）：key 相同！

发现 `p-4` 可复用，执行以下操作：

+ 调用 `patch` 更新节点内容。
+ 将 `p-4` 对应的真实 DOM 移动到旧头部节点 `p-1` 之前。
+ 更新索引：`oldEndIdx--`，`newStartIdx++`。

更新后，真实 DOM 顺序为：`p-2, p-4, p-1, p-3`。

### 5. 处理新增和移除节点
当循环结束后，可能存在以下情况：

+ **新节点遗留**（`newStartIdx <= newEndIdx`）：说明新子节点中有未处理的节点，需要挂载为新节点。
+ **旧节点遗留**（`oldStartIdx <= oldEndIdx`）：说明旧子节点中有未处理的节点，需要移除。

代码实现如下：

```javascript
if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
  for (let i = newStartIdx; i <= newEndIdx; i++) {
    patch(null, newChildren[i], container, oldStartVNode.el)
  }
} else if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
  for (let i = oldStartIdx; i <= oldEndIdx; i++) {
    unmount(oldChildren[i])
  }
}
```

---

## 三、双端 Diff 算法的优势
通过上述例子，双端 Diff 算法仅需一次 DOM 移动操作（移动 `p-3`）即可完成更新，而简单 Diff 算法需要两次移动操作。优势总结如下：

1. **更少的 DOM 操作**：通过头尾双端比较，算法能更快找到可复用节点，减少不必要的移动。
2. **灵活性更高**：能处理复杂场景，如节点顺序完全打乱或新增/删除节点。
3. **性能优化**：减少 DOM 操作次数，直接降低浏览器重排重绘的开销。

---

## 四、处理特殊场景
### 1. 新增节点
当新子节点中存在旧子节点中没有的节点（如 `p-4`），算法会在四步比较失败后，尝试查找新头部节点在旧子节点中的位置。如果找不到（`idxInOld <= 0`），则将其作为新节点挂载到头部：

```javascript
if (idxInOld <= 0) {
  patch(null, newStartVNode, container, oldStartVNode.el)
}
```

### 2. 移除节点
当旧子节点中存在新子节点中没有的节点（如 `p-2`），循环结束后会检测到 `oldStartIdx <= oldEndIdx`，通过 `unmount` 函数移除这些节点。

### 3. 跳过已处理节点
为避免重复处理，算法会检查头尾节点是否为 `undefined`，并直接跳到下一个位置：

```javascript
if (!oldStartVNode) {
  oldStartVNode = oldChildren[++oldStartIdx]
} else if (!oldEndVNode) {
  oldEndVNode = oldChildren[--oldEndIdx]
}
```

---

## 五、完整代码实现
以下是双端 Diff 算法的完整实现，包含所有逻辑：

```javascript
function patchKeyedChildren(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children
  let oldStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newStartIdx = 0
  let newEndIdx = newChildren.length - 1

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    let oldStartVNode = oldChildren[oldStartIdx]
    let oldEndVNode = oldChildren[oldEndIdx]
    let newStartVNode = newChildren[newStartIdx]
    let newEndVNode = newChildren[newEndIdx]

    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIdx]
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIdx]
    } else if (oldStartVNode.key === newStartVNode.key) {
      patch(oldStartVNode, newStartVNode, container)
      oldStartVNode = oldChildren[++oldStartIdx]
      newStartVNode = newChildren[++newStartIdx]
    } else if (oldEndVNode.key === newEndVNode.key) {
      patch(oldEndVNode, newEndVNode, container)
      oldEndVNode = oldChildren[--oldEndIdx]
      newEndVNode = newChildren[--newEndIdx]
    } else if (oldStartVNode.key === newEndVNode.key) {
      patch(oldStartVNode, newEndVNode, container)
      insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)
      oldStartVNode = oldChildren[++oldStartIdx]
      newEndVNode = newChildren[--newEndIdx]
    } else if (oldEndVNode.key === newStartVNode.key) {
      patch(oldEndVNode, newStartVNode, container)
      insert(oldEndVNode.el, container, oldStartVNode.el)
      oldEndVNode = oldChildren[--oldEndIdx]
      newStartVNode = newChildren[++newStartIdx]
    } else {
      const idxInOld = oldChildren.findIndex(node => node && node.key === newStartVNode.key)
      if (idxInOld > 0) {
        const vnodeToMove = oldChildren[idxInOld]
        patch(vnodeToMove, newStartVNode, container)
        insert(vnodeToMove.el, container, oldStartVNode.el)
        oldChildren[idxInOld] = undefined
      } else {
        patch(null, newStartVNode, container, oldStartVNode.el)
      }
      newStartVNode = newChildren[++newStartIdx]
    }
  }

  if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      patch(null, newChildren[i], container, oldStartVNode ? oldStartVNode.el : null)
    }
  } else if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      if (oldChildren[i]) unmount(oldChildren[i])
    }
  }
}
```



