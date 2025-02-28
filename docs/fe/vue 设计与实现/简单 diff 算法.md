### 从“暴力拆建”到“精打细算”

先想象一个场景：你家有个书架，上面摆着三本书，分别是《1》、《2》、《3》。有一天你想把它们换成《4》、《5》、《6》。最简单粗暴的办法是什么？把旧书全扔了，再把新书一本本摆上去。这样确实能搞定，但问题是，你得多跑几趟书店，多花不少力气。在代码里，这就像是直接卸载所有旧的 DOM 节点，再挂载新的 DOM 节点。举个例子：

```js
// 旧的虚拟节点
const oldVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '1' },
    { type: 'p', children: '2' },
    { type: 'p', children: '3' }
  ]
}

// 新的虚拟节点
const newVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '4' },
    { type: 'p', children: '5' },
    { type: 'p', children: '6' }
  ]
}
```

如果按“暴力拆建”的思路，更新的时候得这么干：

- 把 3 个旧的 `<p>` 标签删掉，3 次 DOM 删除操作；
- 把 3 个新的 `<p>` 标签加进去，3 次 DOM 添加操作。

总共 6 次 DOM 操作！要知道，操作 DOM 的开销可不小，这种方式简直是“性能杀手”。但你仔细瞧瞧，新旧节点其实都是 `<p>` 标签，只是里面的文本变了。能不能直接改文本呢？答案是：当然可以！比如，把第一个 `<p>` 的文本从 '1' 改成 '4'，只需要 1 次 DOM 操作就行了。三个节点都这么搞，总共就 3 次操作，性能直接翻倍！

于是，我们可以写个更聪明的更新逻辑：

```js
function patchChildren(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children
  for (let i = 0; i < oldChildren.length; i++) {
    patch(oldChildren[i], newChildren[i], container)
  }
}
```

这里我们假设新旧子节点数量一样，挨个对比更新。这样就从 6 次 DOM 操作减到 3 次，省了一半力气。

但问题来了：如果新旧子节点数量不一样咋办？比如旧的有 4 个，新的只有 3 个，多出来的那个得删掉；或者新的有 4 个，旧的只有 3 个，得加一个。于是我们得再优化一下：

```js
function patchChildren(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children
  const oldLen = oldChildren.length
  const newLen = newChildren.length
  const commonLength = Math.min(oldLen, newLen)

  // 先更新公共部分
  for (let i = 0; i < commonLength; i++) {
    patch(oldChildren[i], newChildren[i], container)
  }

  // 新的比旧的多，挂载新增的
  if (newLen > oldLen) {
    for (let i = commonLength; i < newLen; i++) {
      patch(null, newChildren[i], container)
    }
  }
  // 旧的比新的多，卸载多余的
  else if (oldLen > newLen) {
    for (let i = commonLength; i < oldLen; i++) {
      unmount(oldChildren[i])
    }
  }
}
```

这么一改，不管新旧子节点数量咋变，都能妥妥处理。是不是感觉有点“精打细算”的味道了？



### DOM 复用：别拆了重建，搬家得了

上面这个方案虽然不错，但还有进步空间。假设新旧子节点的标签类型变了，或者顺序变了呢？比如：

```js
// 旧的
const oldChildren = [
  { type: 'p' },
  { type: 'div' },
  { type: 'span' }
]

// 新的
const newChildren = [
  { type: 'span' },
  { type: 'p' },
  { type: 'div' }
]
```

按之前的逻辑，每个位置的标签都不一样，得删旧的再装新的，还是 6 次 DOM 操作。但其实新旧节点只是顺序变了，标签类型都还在。如果能把 DOM 元素“搬家”，而不是拆了重建，性能会更好。可问题是，怎么知道哪些节点可以复用呢？

光看标签类型（vnode.type）不行，因为可能全是 `<p>`，但内容不同，比如：

```js
// 旧的
const oldChildren = [
  { type: 'p', children: '1' },
  { type: 'p', children: '2' },
  { type: 'p', children: '3' }
]

// 新的
const newChildren = [
  { type: 'p', children: '3' },
  { type: 'p', children: '1' },
  { type: 'p', children: '2' }
]
```

这时候就需要给每个节点加个“身份证” —— key：

```js
// 旧的
const oldChildren = [
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '2', key: 2 },
  { type: 'p', children: '3', key: 3 }
]

// 新的
const newChildren = [
  { type: 'p', children: '3', key: 3 },
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '2', key: 2 }
]
```

有了 key，我们就能知道新旧节点怎么对应。比如 key: 3 的节点跑到第一个了，那就把它的 DOM 搬到前面。代码可以这么写：

```js
function patchChildren(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children
  for (let i = 0; i < newChildren.length; i++) {
    const newVNode = newChildren[i]
    for (let j = 0; j < oldChildren.length; j++) {
      const oldVNode = oldChildren[j]
      if (newVNode.key === oldVNode.key) {
        patch(oldVNode, newVNode, container)
        break
      }
    }
  }
}
```

这样就能找到可复用的节点，再根据新顺序调整位置，尽量少干“拆建”的活儿。



### 搬家指南：谁该动，往哪动？

找到可复用的节点后，怎么知道哪些需要搬？用个小技巧：记录旧节点的位置索引，看它们在新顺序里是不是“乱了”。比如新顺序是 3、1、2，旧的是 1、2、3，我们挨个找：

- key: 3 在旧的里是第 2 位（索引 2）；
- key: 1 在旧的里是第 0 位（索引 0），比之前的小，说明得动；
- key: 2 在旧的里是第 1 位（索引 1），也比 2 小，也得动。

用个 lastIndex 存最大索引，判断逻辑就有了：

```js
function patchChildren(n1, n2, container) {
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
          // 需要移动
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
}
```

往哪动呢？看新顺序就行。比如 key: 1 在 key: 3 后面，就把 key: 1 的 DOM 插到 key: 3 的 DOM 后面，用 insert 函数搞定。



### 新朋友来了，老朋友走了

有时候会有新节点加入，或者旧节点退出。新增的节点没在旧的里找到，直接挂载；旧的多出来的，删掉。完整逻辑是：

```js
function patchChildren(n1, n2, container) {
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
    if (!find) {
      const prevVNode = newChildren[i - 1]
      const anchor = prevVNode ? prevVNode.el.nextSibling : container.firstChild
      patch(null, newVNode, container, anchor)
    }
  }
  // 删多余的
  for (let i = 0; i < oldChildren.length; i++) {
    const oldVNode = oldChildren[i]
    const has = newChildren.find(vnode => vnode.key === oldVNode.key)
    if (!has) {
      unmount(oldVNode)
    }
  }
}
```



### 总结：从傻干到巧干

简单 Diff 算法的核心就是“少折腾 DOM”。从最初的“全拆全建”，到“只改文本”，再到“搬家复用”，最后还能处理“新来旧走”，一步步优化下来，性能提升不是一点半点。key 是它的灵魂，帮我们精准定位复用节点；索引对比和 DOM 移动则是它的巧手，让更新又快又稳。
