### 什么是快速 Diff 算法？

快速 Diff 算法是一种用来比较新旧两组子节点的高效方法。它最早出现在 ivi 和 inferno 这两个框架里，后来 Vue.js 3 看它表现这么好，就拿过来用了，还顺手优化了一波。相比 Vue.js 2 里的双端 Diff 算法，快速 Diff 的速度确实有优势，尤其是在 DOM 操作频繁的场景下。

那它为什么这么快呢？秘诀就在于它多了一个“预处理”步骤。这个思路其实是从纯文本 Diff 算法里借来的。



### 预处理：先搞定简单部分

想象一下，你在对比两段文字：

- TEXT1: I use vue for app development
- TEXT2: I use react for app development

你一眼就能看出，这两段话开头 I use 和结尾 for app development 是一样的，只有中间的 vue 和 react 不一样。

纯文本 diff 也是这么做的，先把相同的开头和结尾找出来，直接跳过，只对比中间不同的部分。这样问题就简化了，只用处理 vue 和 react 的差异。

快速 Diff 算法把这个思路搬到了 DOM 节点上。假设有两组子节点：

- 旧的：p-1, p-2, p-3
- 新的：p-1, p-4, p-2, p-3

你会发现，p-1 是相同的开头（前置节点），p-2, p-3 是相同的结尾（后置节点）。那这些相同的部分直接更新一下内容（打个补丁），剩下的 p-4 再单独处理。这就是预处理的妙处 —— 先把简单的情况解决掉，剩下的复杂部分再慢慢搞。



### 怎么实现预处理？

假设有个函数 patchKeyedChildren 负责比较新旧子节点，它的预处理部分长这样：

```js
function patchKeyedChildren(n1, n2, container) {
  const newChildren = n2.children
  const oldChildren = n1.children

  // 处理相同的前置节点
  let j = 0
  let oldVNode = oldChildren[j]
  let newVNode = newChildren[j]
  while (oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container) // 更新节点内容
    j++
    oldVNode = oldChildren[j]
    newVNode = newChildren[j]
  }

  // 处理相同的后置节点
  let oldEnd = oldChildren.length - 1
  let newEnd = newChildren.length - 1
  oldVNode = oldChildren[oldEnd]
  newVNode = newChildren[newEnd]
  while (oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container)
    oldEnd--
    newEnd--
    oldVNode = oldChildren[oldEnd]
    newVNode = newChildren[newEnd]
  }

  // 接下来处理剩余的节点
}
```

代码里用了两个 while 循环：

1. **前置节点**：从头开始比较，只要 key 一样，就更新节点内容，索引 j 往后走。
2. **后置节点**：从尾巴开始比较，key 一样就更新，索引 oldEnd 和 newEnd 往前走。

处理完这两步，相同的节点都更新好了，剩下的就是新增或删除的节点。比如上面例子里的 p-4，它是个新节点，需要挂载到正确的位置。



### 新增和删除怎么判断？

预处理完后，看看索引的关系就能知道接下来干啥：

- **新增节点**：如果 j > oldEnd 且 j <= newEnd，说明旧节点处理完了，但新节点还有剩的，这些就是新增的。比如 p-4，可以用 patch 函数挂载：

```js
if (j > oldEnd && j <= newEnd) {
  const anchorIndex = newEnd + 1
  const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
  while (j <= newEnd) {
    patch(null, newChildren[j++], container, anchor)
  }
}
```

- **删除节点**：如果 j > newEnd 且 j <= oldEnd，说明新节点处理完了，但旧节点还有剩的，这些就得删掉。比如旧节点里有 p-2，新节点里没有，就卸载：

```js
else if (j > newEnd && j <= oldEnd) {
  while (j <= oldEnd) {
    unmount(oldChildren[j++])
  }
}
```

简单的场景就搞定了。但现实往往没这么理想，接下来咱们看看复杂情况。



### 复杂情况：节点需要移动怎么办？

假设有这么两组子节点：

- 旧的：p-1, p-2, p-3, p-4, p-6, p-5
- 新的：p-1, p-3, p-4, p-2, p-7, p-5

预处理后，p-1 和 p-5 是相同的，剩下的节点顺序乱了套。这时候就需要：

1. 判断哪些节点要移动。
2. 找出新增或删除的节点。

咱们先建一个 source 数组，记录新节点在旧节点里的位置。比如上面例子，预处理后剩 p-3, p-4, p-2, p-7，source 初始是 [-1, -1, -1, -1]，填充后变成 [2, 3, 1, -1]（-1 表示新节点，比如 p-7）。

为了效率，用个索引表优化一下查找：

```js
const count = newEnd - j + 1
const source = new Array(count)
source.fill(-1)

const keyIndex = {}
for (let i = j; i <= newEnd; i++) {
  keyIndex[newChildren[i].key] = i
}
for (let i = j; i <= oldEnd; i++) {
  const oldVNode = oldChildren[i]
  const k = keyIndex[oldVNode.key]
  if (typeof k !== 'undefined') {
    const newVNode = newChildren[k]
    patch(oldVNode, newVNode, container)
    source[k - j] = i
  } else {
    unmount(oldVNode)
  }
}
```

这就把时间复杂度从 O(n²) 降到了 O(n)，效率高多了。



### 判断是否需要移动

有了 source 数组，怎么知道节点要不要动呢？加两个变量：

- moved：表示是否需要移动，默认 false。
- pos：记录遍历时遇到的最大索引。

```js
let moved = false
let pos = 0
for (let i = j; i <= oldEnd; i++) {
  const k = keyIndex[oldVNode.key]
  if (typeof k !== 'undefined') {
    source[k - j] = i
    if (k < pos) {
      moved = true // 索引不是递增的，需要移动
    } else {
      pos = k
    }
  }
}
```

如果 moved 是 true，说明得调整顺序。怎么调呢？靠最长递增子序列。



### 用最长递增子序列移动节点

source 是 [2, 3, 1, -1]，它的最长递增子序列是 [2, 3]，对应新节点里的 p-3, p-4，它们位置没变，不用动。剩下的 p-2 和 p-7 得调整。

```js
if (moved) {
  const seq = lis(source) // 比如 [0, 1]
  let s = seq.length - 1
  let i = count - 1
  for (; i >= 0; i--) {
    if (source[i] === -1) {
      const pos = i + j
      const newVNode = newChildren[pos]
      const anchor = pos + 1 < newChildren.length ? newChildren[pos + 1].el : null
      patch(null, newVNode, container, anchor) // 新节点挂载
    } else if (i !== seq[s]) {
      const pos = i + j
      const newVNode = newChildren[pos]
      const anchor = pos + 1 < newChildren.length ? newChildren[pos + 1].el : null
      insert(newVNode.el, container, anchor) // 移动节点
    } else {
      s-- // 不动，跳下一个
    }
  }
}
```

这里 lis 函数算出最长递增子序列（具体实现网上有很多，这里不展开），然后从后往前遍历，遇到新节点挂载，遇到需要移动的用 insert 调整位置。



#### 总结：为什么它这么快？

快速 Diff 算法厉害的地方在于：

1. **预处理**：先搞定相同的开头和结尾，减少后续工作量。
2. **索引表**：优化查找，时间复杂度降到 O(n)。
3. **最长递增子序列**：精准判断哪些节点不用动，尽量减少 DOM 操作。

相比双端 Diff，它更聪明地利用了节点顺序的信息，所以在实际测试中性能更优。Vue.js 3 用它来更新 DOM，既快又省力。