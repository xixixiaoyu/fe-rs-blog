### 什么是双端 Diff 算法？

先从简单 Diff 算法说起吧，简单 Diff 算法通过虚拟节点的 key 属性，尽量复用 DOM 元素，然后通过移动 DOM 的方式更新页面。这样确实比老老实实删了再建效率高不少，但它有个问题：移动 DOM 的次数不一定是最优的。比如，一个简单的顺序调整，可能要挪好几次才能搞定。

双端 Diff 算法就是来解决这个问题的。它不像简单 Diff 只从头到尾单向比较，而是同时从新旧两组子节点的头和尾两端入手，通过四路夹击的方式，找到最优的更新路径。简单来说，它的目标是用最少的 DOM 操作，把旧的节点顺序调整成新的样子。



### 双端 Diff 的基本原理

想象一下，你有两个列表：旧的是 p-1, p-2, p-3，新的是 p-3, p-1, p-2。现在要把旧的变成新的，怎么操作最省事？双端 Diff 的思路是这样的：

1. **定义四个指针**

- 旧列表的头：oldStartIdx（指向 p-1）
- 旧列表的尾：oldEndIdx（指向 p-3）
- 新列表的头：newStartIdx（指向 p-3）
- 新列表的尾：newEndIdx（指向 p-2）

2. **四步比较**

每一轮，它会从这四个指针出发，做四次对比：

- 旧头 vs 新头
- 旧尾 vs 新尾
- 旧头 vs 新尾
- 旧尾 vs 新头

只要有一对匹配（key 相同），就复用这对节点，然后根据位置调整 DOM，同时更新对应的指针，继续下一轮。

来看看核心代码：

```js
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

    if (oldStartVNode.key === newStartVNode.key) {
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
    }
  }
}
```

这段代码里，while 循环控制整个对比过程，四个 if 分支对应四步比较。找到匹配的节点后，先用 patch 更新内容，再用 insert 移动 DOM，最后更新指针。

回到 p-1, p-2, p-3 变成 p-3, p-1, p-2：

- 第一轮：第四步匹配，旧尾 p-3 和新头 p-3 相同，把 p-3 移到前面。
- 第二轮：第一步匹配，旧头 p-1 和新头 p-1 相同，不用动。
- 第三轮：第一步匹配，旧头 p-2 和新头 p-2 相同，不用动。
- 结束：只移动了一次 DOM，就完成了更新。

相比简单 Diff 的两次移动，双端 Diff 明显更高效。



### 双端 Diff 的优势在哪里？

双端 Diff 的核心优势就是“少动”。简单 Diff 是顺序对比，遇到位置变化时，往往得多挪几下。而双端 Diff 通过头尾双向夹击，能更快找到可复用的节点，减少不必要的 DOM 操作。

拿刚才的例子来说，简单 Diff 需要：

1. 把 p-1 移到 p-3 后面
2. 把 p-2 移到 p-1 后面

两次移动。而双端 Diff 只需要把 p-3 移到前面，一次搞定。这种优化在节点多、顺序变化复杂时，效果更明显。



### 非理想情况怎么办？

现实中，事情不会总是那么顺利。比如，旧的是 p-1, p-2, p-3, p-4，新的是 p-2, p-4, p-1, p-3，第一轮四步对比全落空怎么办？

这时，双端 Diff 会多做一步：

- 拿新头 p-2 去旧列表里找，找到它在索引 1 的位置。
- 把 p-2 对应的 DOM 移到头部，打上补丁，旧列表对应位置标为 undefined。
- 更新指针，继续下一轮。

```js
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
    // 第一步
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 第二步
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 第三步
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 第四步
  } else {
    const idxInOld = oldChildren.findIndex(node => node.key === newStartVNode.key)
    if (idxInOld > 0) {
      const vnodeToMove = oldChildren[idxInOld]
      patch(vnodeToMove, newStartVNode, container)
      insert(vnodeToMove.el, container, oldStartVNode.el)
      oldChildren[idxInOld] = undefined
      newStartVNode = newChildren[++newStartIdx]
    }
  }
}
```



### 处理新增和删除

#### 新增节点

如果新头 p-4 在旧列表里找不到（比如旧的是 p-1, p-2, p-3，新的是 p-4, p-1, p-3, p-2），说明它是新节点，直接挂载到头部：

```js
if (idxInOld <= 0) {
  patch(null, newStartVNode, container, oldStartVNode.el)
  newStartVNode = newChildren[++newStartIdx]
}
```

如果循环结束后还有新节点没处理（比如新的是 p-4, p-1, p-2, p-3），就批量挂载：

```js
if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
  for (let i = newStartIdx; i <= newEndIdx; i++) {
    patch(null, newChildren[i], container, oldStartVNode.el)
  }
}
```

#### 删除节点

反过来，如果旧的是 p-1, p-2, p-3，新的是 p-1, p-3，循环结束后发现 p-2 多余，就卸载掉：

```js
if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
  for (let i = oldStartIdx; i <= oldEndIdx; i++) {
    unmount(oldChildren[i])
  }
}
```



### 总结：双端 Diff 的魅力

双端 Diff 算法的核心思路是用头尾四指针，通过最少的 DOM 操作完成更新。相比简单 Diff，它能更智能地处理顺序变化，减少移动次数。加上对非理想情况、新增和删除的处理，它在实际应用中非常强大，比如 Vue.js 和 React 的虚拟 DOM 更新就深受其影响。