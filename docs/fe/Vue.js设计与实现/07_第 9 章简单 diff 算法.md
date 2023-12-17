当新旧 vnode 的子节点都是一组节点时，为了以最小的性能开销完成更新操作，需要比较两组子节点，用于比较的算法就叫作 Diff 算法。

### 9.1 减少 DOM 操作的性能开销
之前我们在更新子节点时，简单地移除所有旧的子节点，然后添加所有新的子节点。<br />这种方式虽然简单直接，但会产生大量的性能开销，因为它没有复用任何 DOM 元素。<br />考虑下面的新旧虚拟节点示例：
```javascript
// 旧 vnode
const oldVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '1' },
    { type: 'p', children: '2' },
    { type: 'p', children: '3' }
  ]
}

// 新 vnode
const newVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '4' },
    { type: 'p', children: '5' },
    { type: 'p', children: '6' }
  ]
}
```
上述代码，我们会执行六次操作，三次卸载旧节点，三次添加新节点，但实际上，旧新节点都是 'p' 标签，只是它们的文本内容变了。<br />理想情况下，我们只需要更新这些 'p' 标签的文本内容就可以了，这样只需要 3 次 DOM 操作，性能提升了一倍。<br />我们可以调整 patchChildren 函数，让它只更新变化的部分：
```javascript
function patchChildren(n1, n2, container) {
	if (typeof n2.children === 'string') {
		// 省略部分代码
	} else if (Array.isArray(n2.children)) {
		// 重新实现两组子节点的更新方式
		// 新旧 children
		const oldChildren = n1.children
		const newChildren = n2.children
		// 遍历旧的 children
		for (let i = 0; i < oldChildren.length; i++) {
			// 调用 patch 函数逐个更新子节点
			patch(oldChildren[i], newChildren[i])
		}
	} else {
		// 省略部分代码
	}
}
```
上述代码，patch 函数在执行更新时，发现新旧子节点只有文本内容不同，因此只会更新其文本节点的内容<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684147888483-218c3669-3125-4287-a127-3f6d42485119.png#averageHue=%23e2e2e2&clientId=ued5afb69-cce7-4&from=paste&height=230&id=u51801046&originHeight=460&originWidth=1050&originalType=binary&ratio=2&rotation=0&showTitle=false&size=111683&status=done&style=none&taskId=u7ad2c010-948e-4377-a441-4ed619f6da9&title=&width=525)<br />但是这段代码假设新旧子节点的数量总是一样的，实际上新旧节点的数量可能发生变化，如果新节点较多，我们应该添加节点，反之则删除节点。<br />所以，我们应遍历长度较短的那组子节点，以便尽可能多地调用 patch 函数进行更新。然后，比较新旧子节点组的长度，如果新组长度更长，就挂载新子节点；反之，就卸载旧子节点：
```javascript
function patchChildren(n1, n2, container) {
	if (typeof n2.children === 'string') {
		// 省略部分代码
	} else if (Array.isArray(n2.children)) {
		const oldChildren = n1.children
		const newChildren = n2.children
		// 旧的一组子节点的长度
		const oldLen = oldChildren.length
		// 新的一组子节点的长度
		const newLen = newChildren.length
		// 两组子节点的公共长度，即两者中较短的那一组子节点的长度
		const commonLength = Math.min(oldLen, newLen)
		// 遍历 commonLength 次
		for (let i = 0; i < commonLength; i++) {
			patch(oldChildren[i], newChildren[i], container)
		}
		// 如果 newLen > oldLen，说明有新子节点需要挂载
		if (newLen > oldLen) {
			for (let i = commonLength; i < newLen; i++) {
				patch(null, newChildren[i], container)
			}
		} else if (oldLen > newLen) {
			// 如果 oldLen > newLen，说明有旧子节点需要卸载
			for (let i = commonLength; i < oldLen; i++) {
				unmount(oldChildren[i])
			}
		}
	} else {
		// 省略部分代码
	}
}
```
这样，无论新旧子节点组的数量如何，我们的渲染器都能正确地挂载或卸载它们。


### 9.2 DOM 复用与 key 的作用
上面我们通过减少操作次数提高了性能，但仍有优化空间。<br />以新旧两组子节点为例，它们的内容如下：
```javascript
// oldChildren
[
  { type: 'p' },
  { type: 'div' },
  { type: 'span' }
]

// newChildren
[
  { type: 'span' },
  { type: 'p' },
  { type: 'div' }
]
```
若使用之前的算法更新子节点，需要执行6次 DOM 操作。观察新旧子节点，发现它们只是顺序不同。<br />因此，最优处理方式是通过 DOM 移动来完成更新，而非频繁卸载和挂载。为实现这一目标，需确保新旧子节点中存在可复用节点。<br />为判断新子节点是否在旧子节点中出现，可以引入 key 属性作为虚拟节点的标识。只要两个虚拟节点的 type 和 key 属性相同，我们认为它们相同，可以复用DOM。例如：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684148705718-26d3c5a8-8789-4d0e-b0d2-049cc86a430c.png#averageHue=%23ececec&clientId=ued5afb69-cce7-4&from=paste&height=266&id=ue97bf100&originHeight=532&originWidth=1426&originalType=binary&ratio=2&rotation=0&showTitle=false&size=111708&status=done&style=none&taskId=u8b959f04-2c2f-4c38-9759-92059fa4120&title=&width=713)
```javascript
// oldChildren
[
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '2', key: 2 },
  { type: 'p', children: '3', key: 3 }
]

// newChildren
[
  { type: 'p', children: '3', key: 3 },
  { type: 'p', children: '1', key: 1 },
  { type: 'p', children: '2', key: 2 }
]
```
我们根据子节点的 key 属性，能够明确知道新子节点在旧子节点中的位置，这样就可以进行相应的 DOM 移动操作了。<br />注意 DOM 可复用并不意味着不需要更新，它可能内部子节点不一样：
```javascript
const oldVNode = { type: 'p', key: 1, children: 'text 1' }
const newVNode = { type: 'p', key: 1, children: 'text 2' }
```
所以补丁操作是在移动 DOM 元素之前必须完成的步骤，如下面的 patchChildren 函数所示：
```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 省略部分代码
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children
    // 遍历新的 children
    for (let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i]
      // 遍历旧的 children
      for (let j = 0; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j]
        // 如果找到了具有相同 key 值的两个节点，说明可以复用，但仍然需要调用 patch 函数更新
        if (newVNode.key === oldVNode.key) {
          patch(oldVNode, newVNode, container)
          break // 这里需要 break
        }
      }
    }
  } else {
    // 省略部分代码
  }
}
```
在这段代码中，我们更新了新旧两组子节点。通过两层 for 循环，外层遍历新的子节点，内层遍历旧的子节点，我们寻找并更新了所有可复用的节点。<br />例如，有如下的新旧两组子节点：
```javascript
const oldVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '1', key: 1 },
    { type: 'p', children: '2', key: 2 },
    { type: 'p', children: 'hello', key: 3 }
  ]
}

const newVNode = {
  type: 'div',
  children: [
    { type: 'p', children: 'world', key: 3 },
    { type: 'p', children: '1', key: 1 },
    { type: 'p', children: '2', key: 2 }
  ]
}

// 首次挂载
renderer.render(oldVNode, document.querySelector('#app'))
setTimeout(() => {
  // 1 秒钟后更新
  renderer.render(newVNode, document.querySelector('#app'))
}, 1000);
```
运行上述代码，1 秒钟后，key 为 3 的子节点对应的真实 DOM 的文本内容将从 'hello' 更新为 'world'。让我们仔细分析一下这段代码在执行更新操作时的过程：

- 第一步，我们选取新的子节点组中的第一个子节点，即 key 为 3 的节点。然后在旧的子节点组中寻找具有相同 key 的节点。我们发现，旧子节点 oldVNode[2] 的 key 为 3，因此调用 patch 函数进行补丁操作。这个操作完成后，渲染器会将 key 为 3 的虚拟节点对应的真实 DOM 的文本内容从 'hello' 更新为 'world'。
- 第二步，我们取新的子节点组中的第二个子节点，即 key 为 1 的节点，并在旧的子节点组中寻找具有相同 key 的节点。我们发现，旧的子节点 oldVNode[0] 的 key 为 1，于是再次调用 patch 函数进行补丁操作。由于 key 为 1 的新旧子节点没有任何差异，所以这里并未进行任何操作。
- 第三步，最后，我们取新的子节点组中的最后一个子节点，即 key 为 2 的节点，这一步的结果与第二步相同。

经过以上更新操作后，所有节点对应的真实 DOM 元素都已更新。<br />但真实 DOM 仍保持旧的子节点顺序，即 key 为 3 的节点对应的真实 DOM 仍然是最后一个子节点。<br />然而在新的子节点组中，key 为 3 的节点已经变为第一个子节点，因此我们还需要通过移动节点来完成真实 DOM 顺序的更新。


### 9.3 找到需要移动的元素
现在，我们已经能够通过 key 值找到可复用的节点了。<br />下一步，我们确定哪些节点需要移动以及如何移动。我们逆向思考下，什么条件下节点无需移动。答案直观：新旧子节点顺序未变时，无需额外操作：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684168563555-185dac7f-308a-4012-baa2-d189aa37a8e7.png#averageHue=%23e5e5e5&clientId=ued5afb69-cce7-4&from=paste&height=257&id=ubd15889e&originHeight=514&originWidth=898&originalType=binary&ratio=2&rotation=0&showTitle=false&size=55139&status=done&style=none&taskId=u2394a3e6-2b4f-43cc-beb4-f137f08e64a&title=&width=449)<br />新旧子节点顺序未变，举例说明旧子节点索引：

- key 为 1 的节点在旧 children 数组中的索引为 0；
- key 为 2 的节点在旧 children 数组中的索引为 1；
- key 为 3 的节点在旧 children 数组中的索引为 2。

应用我们上节的更新算法：

-  第一步：取新的一组子节点中的第一个节点 p-1，它的 key 为 1。尝试在旧的一组子节点中找到具有相同 key 值的可复用节点，发现能够找到，并且该节点在旧的一组子节点中的索引为 0。
- 第二步：取新的一组子节点中的第二个节点 p-2，它的 key 为 2。尝试在旧的一组子节点中找到具有相同 key 值的可复用节点，发现能够找到，并且该节点在旧的一组子节点中的索引为 1。
- 第三步：取新的一组子节点中的第三个节点 p-3，它的 key 为 3。尝试在旧的一组子节点中找到具有相同 key 值的可复用节点，发现能够找到，并且该节点在旧的一组子节点中的索引为 2。

如果每次找到可复用节点，记录他们原先在旧子节点的位置索引，把这些位置索引值按照先后顺序排列，则可以得到一个序列：0、1、2。这是一个递增的序列，在这种情况下不需要移动任何节点。<br />我们再来看看另外一个例子：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684170452536-fa0cac47-84c1-4cba-9076-1b2a8bf1cd77.png#averageHue=%23e6e6e6&clientId=ued5afb69-cce7-4&from=paste&height=260&id=ud0468315&originHeight=520&originWidth=916&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75229&status=done&style=none&taskId=u630e6e92-3ef4-492f-a5a4-c920b86e074&title=&width=458)

- 第一步：取新的一组子节点中的第一个节点 p-3，它的 key 为 3。尝试在旧的一组子节点中找到具有相同 key 值的可复用节点，发现能够找到，并且该节点在旧的一组子节点中的索引为 2。
-  第二步：取新的一组子节点中的第二个节点 p-1，它的 key 为 1。尝试在旧的一组子节点中找到具有相同 key 值的可复用节点，发现能够找到，并且该节点在旧的一组子节点中的索引为 0。
   - 到了这一步我们发现，索引值递增的顺序被打破了。节点 p-1 在旧 children 中的索引是 0，它小于节点 p-3 在旧 children 中的索引 2。这说明节点 p-1 在旧 children 中排在节点 p-3 前面，但在新的 children 中，它排在节点 p-3 后面。因此，我们能够得出一个结论：节点 p-1 对应的真实 DOM 需要移动。
- 第三步：取新的一组子节点中的第三个节点 p-2，它的 key 为 2。尝试在旧的一组子节点中找到具有相同 key 值的可复用节点，发现能够找到，并且该节点在旧的一组子节点中的索引为 1。
   - 到了这一步我们发现，节点 p-2 在旧 children 中的索引 1 要小于节点 p-3 在旧 children 中的索引 2。这说明，节点 p-2 在旧 children 中排在节点 p-3 前面，但在新的 children 中，它排在节点 p-3 后面。因此，节点 p-2 对应的真实 DOM 也需要移动。

在上面的例子中，我们得出了节点 p-1 和节点 p-2 需要移动的结论。这是因为它们在旧 children 中的索引要小于节点 p-3 在旧 children 中的索引。如果我们按照先后顺序记录在寻找节点过程中所遇到的位置索引，将会得到序列：2、0、1。可以发现，这个序列不具有递增的趋势。<br />我们可以用 lastIndex 变量存储整个寻找过程中遇到的最大索引值，如下面的代码所示：
```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 省略部分代码
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children

    // 用来存储寻找过程中遇到的最大索引值
    let lastIndex = 0
    for (let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i]
      for (let j = 0; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j]
        if (newVNode.key === oldVNode.key) {
          patch(oldVNode, newVNode, container)
          if (j < lastIndex) {
            // 如果当前找到的节点在旧 children 中的索引小于最大索引值 lastIndex，
            // 说明该节点对应的真实 DOM 需要移动
          } else {
            // 如果当前找到的节点在旧 children 中的索引不小于最大索引值，
            // 则更新 lastIndex 的值
            lastIndex = j
          }
          break // 这里需要 break
        }
      }
    }
  } else {
    // 省略部分代码
  }
}
```
上述代码，如果新旧节点的 key 值相同，我们就找到了可以复用的节点。我们比较这个节点在旧子节点数组中的索引 j 与 lastIndex。<br />如果 j 小于 lastIndex，说明当前 oldVNode 对应的真实 DOM 需要移动。<br />否则，不需要移动。并将变量 j 的值赋给 lastIndex，以确保寻找节点过程中，变量 lastIndex 始终存储着当前遇到的最大索引值。

### 9.4 如何移动元素
移动节点指的是，移动一个虚拟节点所对应的真实 DOM 节点，并不是移动虚拟节点本身。<br />既然移动的是真实 DOM 节点，那么就需要取得对它的引用才行。当一个虚拟节点被挂载后，其对应的真实 DOM 节点会存储在它的 vnode.el 属性中：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684173411789-85b29d54-b03c-4a35-9db4-ed223b59b752.png#averageHue=%23dfdfdf&clientId=ued5afb69-cce7-4&from=paste&height=256&id=u6958efb0&originHeight=512&originWidth=686&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51383&status=done&style=none&taskId=u9c86697c-f3a1-4908-bdeb-309e97d9376&title=&width=343)<br />因此，我们可以通过 vnode.el 属性取得它对应的真实 DOM 节点。

当更新操作发生时，渲染器会调用 patchElement 函数在新旧虚拟节点之间进行打补丁：
```javascript
function patchElement(n1, n2) {
  // 新的 vnode 也引用了真实 DOM 元素
  const el = n2.el = n1.el
  // 省略部分代码
}
```
上述代码 patchElement 函数首先将旧节点的 n1.el 属性赋值给新节点的 n2.el 属性，这个赋值的意义其实就是 DOM 元素的复用。<br />在复用了 DOM 元素之后，新节点也将持有对真实 DOM 的引用：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684173590253-631721d5-2954-4619-907c-e22d0d99d73f.png#averageHue=%23eaeaea&clientId=ued5afb69-cce7-4&from=paste&height=289&id=u949a5f98&originHeight=578&originWidth=934&originalType=binary&ratio=2&rotation=0&showTitle=false&size=105636&status=done&style=none&taskId=u5ee5ba54-1145-4fc2-ad23-2e065aefb21&title=&width=467)<br />此时无论是新旧节点，都引用着真实 DOM，在此基础上，我们就可以进行 DOM 移动了。

为了阐述如何移动 DOM，，我们仍然引用上一节的更新案例：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684170452536-fa0cac47-84c1-4cba-9076-1b2a8bf1cd77.png#averageHue=%23e6e6e6&clientId=ued5afb69-cce7-4&from=paste&height=260&id=SMFV4&originHeight=520&originWidth=916&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75229&status=done&style=none&taskId=u630e6e92-3ef4-492f-a5a4-c920b86e074&title=&width=458)<br />它的更新步骤如下。

- 第一步：在新的子节点集合中选取第一个节点 p-3（key 为 3），并在旧的子节点集合中寻找具有相同 key 的可复用节点。找到了这样的节点，其在旧集合中的索引为 2。由于当前 lastIndex 为 0，且 2 大于 0，因此，p-3 的实际 DOM 无需移动，但需要将 lastIndex 更新为 2。
- 第二步：选取新集合中的第二个节点 p-1（key 为 1），并尝试在旧集合中找到相同 key 的可复用节点。找到了这样的节点，其在旧集合中的索引为 0。此时，由于 lastIndex 为 2，且 0 小于 2，所以，p-1 的实际 DOM 需要移动。此时我们知道，**新 children 的顺序即为更新后实际 DOM 应有的顺序。**因此，p-1 在新 children 中的位置决定了其在更新后实际 DOM 中的位置。由于 p-1 在新 children 中排在 p-3 后面，因此我们需要将 p-1 的实际 DOM 移动到 p-3 的实际 DOM 后面。移动后的实际 DOM 顺序为 p-2、p-3、p-1：
- ![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684174470192-26fed545-3af6-4564-9378-1e622b23a097.png#averageHue=%23ececec&clientId=ued5afb69-cce7-4&from=paste&height=308&id=u70d039e8&originHeight=740&originWidth=1114&originalType=binary&ratio=2&rotation=0&showTitle=false&size=163802&status=done&style=none&taskId=ub39c72b5-05dd-4dbf-8874-6f2d9112aad&title=&width=464)把节点 p-1 对应的真实 DOM 移动到节点 p-3 对应的真实 DOM 后面
- 第三步：选取新集合中的第三个节点 p-2（key 为 2），并尝试在旧集合中找到相同 key 的可复用节点。找到了这样的节点，其在旧集合中的索引为1。此时，由于 lastIndex 为 2，且 1 小于 2，所以，p-2 的实际 DOM 需要移动。此步骤与步骤二类似，我们需要将 p-2 的实际 DOM 移动到 p-1 的实际 DOM 后面。经过移动后，实际 DOM 的顺序与新的子节点集合的顺序相同，即为：p-3、p-1、p-2。至此，更新操作完成：
- ![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684174520624-034c5184-fb91-4352-a375-daa782b899ec.png#averageHue=%23ededed&clientId=ued5afb69-cce7-4&from=paste&height=376&id=u00274c30&originHeight=906&originWidth=1124&originalType=binary&ratio=2&rotation=0&showTitle=false&size=225811&status=done&style=none&taskId=uaf771cd4-398f-40bb-b9be-1e156e3b56f&title=&width=466)把节点 p-2 对应的真实 DOM 移动到节点 p-1 对应的真实 DOM 后面

接下来，我们来看一下如何实现这个过程。具体的代码如下：
```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 省略部分代码
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children

    let lastIndex = 0
    for (let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i]
      let j = 0
      for (j; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j]
        if (newVNode.key === oldVNode.key) {
          patch(oldVNode, newVNode, container)
          if (j < lastIndex) {
            // 代码运行到这里，说明 newVNode 对应的真实 DOM 需要移动
            // 先获取 newVNode 的前一个 vnode，即 prevVNode
            const prevVNode = newChildren[i - 1]
            // 如果 prevVNode 不存在，则说明当前 newVNode 是第一个节点，它不需要移动
            if (prevVNode) {
              // 由于我们要将 newVNode 对应的真实 DOM 移动到 prevVNode 所对应真实 DOM 后面，
              // 所以我们需要获取 prevVNode 所对应真实 DOM 的下一个兄弟节点，并将其作为锚点
              const anchor = prevVNode.el.nextSibling
              // 调用 insert 方法将 newVNode 对应的真实 DOM 插入到锚点元素前面，
              // 也就是 prevVNode 对应真实 DOM 的后面
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
    // 省略部分代码
  }
}
```
上述代码中，如果 j < lastIndex 成立，则说明当前 newVNode 对应的真实 DOM 需要移动。<br />根据之前的分析可知，我们需要获取当前 newVNode 节点的前一个虚拟节点 newChildren[i - 1]，然后使用 insert 函数完成节点的移动，其中 insert 函数依赖浏览器原生的 insertBefore 函数。如下所示：
```javascript
const renderer = createRenderer({
  // 省略部分代码

  insert(el, parent, anchor = null) {
    // insertBefore 需要锚点元素 anchor
    parent.insertBefore(el, anchor)
  }

  // 省略部分代码
})
```


### 9.5 添加新元素
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684212880420-f7e62c3a-b9da-42d5-8f86-a6957b10f775.png#averageHue=%23ececec&clientId=u98b85324-934b-4&from=paste&height=326&id=u0c206978&originHeight=652&originWidth=860&originalType=binary&ratio=2&rotation=0&showTitle=false&size=90244&status=done&style=none&taskId=ua8fe88aa-836b-4a02-85c4-ade873c0125&title=&width=430)<br />上图，我们有一个新的节点p-4， 它的 key 值为 4，这个节点在旧的节点集中不存在。该新增节点我们应该挂载：

1. 找到新节点
2. 将新节点挂载到正确位置

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684213191870-fee04cf8-40d8-4082-97e2-9bcad0cc693d.png#averageHue=%23eeeeee&clientId=u98b85324-934b-4&from=paste&height=332&id=u2c846567&originHeight=870&originWidth=1078&originalType=binary&ratio=2&rotation=0&showTitle=false&size=144934&status=done&style=none&taskId=u0bc33d3a-3fc1-466f-8b17-2af1c1369b5&title=&width=411)<br />根据上图，我们开始模拟执行简单 Diff 算法的更新逻辑：

- 第一步：我们首先检查新的节点集中的第一个节点 p-3。这个节点在旧的节点集中存在，因此我们不需要移动对应的 DOM 元素，但是我们需要将变量lastIndex的值更新为 2。
- 第二步：取新的一组子节点中第二个节点 p-1，它的 key 值为 1，尝试在旧的一组子节点中寻找可复用的节点。发现能够找到，并且该节点在旧的一组子节点中的索引值为 0。此时变量 lastIndex 的值为 2，索引值 0 小于 lastIndex 的值 2，所以节点 p-1 对应的真实 DOM 需要移动，并且应该移动到节点 p-3 对应的真实DOM 后面。移动后，DOM 的顺序将变为 p-2、p-3、p-1：
- ![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684213387421-ab91351d-5ace-4454-91dc-4e680049fb22.png#averageHue=%23ededed&clientId=u98b85324-934b-4&from=paste&height=312&id=u880b9499&originHeight=788&originWidth=1062&originalType=binary&ratio=2&rotation=0&showTitle=false&size=171296&status=done&style=none&taskId=u13fe8528-36f0-44e8-8000-463214d7870&title=&width=420)
- 第三步：我们现在查看新的节点集中的第三个节点 p-4。在旧的节点集中，我们找不到这个节点，我们需要观察节点 p-4 在新的一组子节点中的位置。由于节点 p-4 出现在节点 p-1 后面，所以我们应该把节点 p-4 挂载到节点 p-1 所对应的真实 DOM 后面。DOM 元素后面。挂载后，DOM的顺序将变为 p-2、p-3、p-1、p-4：
- ![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684213419913-454135c1-caa0-4683-b91d-7af12ae7af09.png#averageHue=%23ececec&clientId=u98b85324-934b-4&from=paste&height=364&id=u93bcd650&originHeight=852&originWidth=1040&originalType=binary&ratio=2&rotation=0&showTitle=false&size=200730&status=done&style=none&taskId=u178dd410-8f66-454b-92c5-b4b73215448&title=&width=444)
- 第四步：最后，我们查看新的节点集中的第四个节点 p-2。在旧的节点集中，这个节点的索引值为 1，这个值小于 lastIndex 的值 2，因此我们需要移动 p-2 对应的 DOM 元素。应该移动到节点 p-4 对应的真实DOM 后面。
- ![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684213464542-d5fe6507-058d-4b37-b25c-0559bb2c30f3.png#averageHue=%23efefef&clientId=u98b85324-934b-4&from=paste&height=378&id=uce19f97f&originHeight=924&originWidth=956&originalType=binary&ratio=2&rotation=0&showTitle=false&size=210297&status=done&style=none&taskId=ub88fdd2f-33c2-4fd4-8b46-284af821c7f&title=&width=391)

在此，我们看到真实 DOM 的顺序为：p-3、p-1、p-4、p-2。这表明真实 DOM 的顺序已经与新子节点的顺序一致，更新已经完成。<br />接下来，让我们通过 patchChildren 函数的代码实现来详细讲解：
```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 省略部分代码
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children

    let lastIndex = 0
    for (let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i]
      let j = 0
      // 在第一层循环中定义变量 find，代表是否在旧的一组子节点中找到可复用的节点，
      // 初始值为 false，代表没找到
      let find = false
      for (j; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j]
        if (newVNode.key === oldVNode.key) {
          // 一旦找到可复用的节点，则将变量 find 的值设为 true
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
      // 如果代码运行到这里，find 仍然为 false，
      // 说明当前 newVNode 没有在旧的一组子节点中找到可复用的节点
      // 也就是说，当前 newVNode 是新增节点，需要挂载
      if (!find) {
        // 为了将节点挂载到正确位置，我们需要先获取锚点元素
        // 首先获取当前 newVNode 的前一个 vnode 节点
        const prevVNode = newChildren[i - 1]
        let anchor = null
        if (prevVNode) {
          // 如果有前一个 vnode 节点，则使用它的下一个兄弟节点作为锚点元素
          anchor = prevVNode.el.nextSibling
        } else {
          // 如果没有前一个 vnode 节点，说明即将挂载的新节点是第一个子节点
          // 这时我们使用容器元素的 firstChild 作为锚点
          anchor = container.firstChild
        }
        // 挂载 newVNode
        patch(null, newVNode, container, anchor)
      }
    }
  } else {
    // 省略部分代码
  }
}
```
上述代码，我们通过外层循环中定义的变量 find，查找是否存在可复用的节点。<br />如果内层循环结束后，find 的值仍为 false，说明当前 newVNode 是全新的节点，需要进行挂载。<br />挂载的位置由 anchor 确定，这个 anchor 可以是 newVNode 的前一个虚拟节点的下一个兄弟节点，或者容器元素的第一个子节点。<br />现在，我们需要调整 patch 函数以支持接收第四个参数 anchor，如下所示：
```javascript
// patch 函数需要接收第四个参数，即锚点元素
function patch(n1, n2, container, anchor) {
  // 省略部分代码

  if (typeof type === 'string') {
    if (!n1) {
      // 挂载时将锚点元素作为第三个参数传递给 mountElement 函数
      mountElement(n2, container, anchor)
    } else {
      patchElement(n1, n2)
    }
  } else if (type === Text) {
    // 省略部分代码
  } else if (type === Fragment) {
    // 省略部分代码
  }
}

// mountElement 函数需要增加第三个参数，即锚点元素
function mountElement(vnode, container, anchor) {
  // 省略部分代码

  // 在插入节点时，将锚点元素透传给 insert 函数
  insert(el, container, anchor)
}
```


### 9.6 移除不存在的元素
在更新子节点时，不仅会遇到新增元素，还会出现元素被删除的情况：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684214485392-359c3698-eaf3-45df-8c1c-4694ed53effc.png#averageHue=%23ededed&clientId=u98b85324-934b-4&from=paste&height=250&id=u37351d96&originHeight=500&originWidth=852&originalType=binary&ratio=2&rotation=0&showTitle=false&size=57142&status=done&style=none&taskId=u9f468138-2ddf-4d27-8ea9-ef780e7bf34&title=&width=426)<br />假设在新的子节点组中，节点 p-2 已经不存在，这说明该节点被删除了。

我们像上面一样模拟执行更新逻辑，这之前我们先看看新旧两组子节点以及真实 DOM 节点的当前状态：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684214589560-617e78df-0a3e-42ff-9d01-5e1f874c3d14.png#averageHue=%23e8e8e8&clientId=u98b85324-934b-4&from=paste&height=288&id=ue7e59414&originHeight=576&originWidth=1018&originalType=binary&ratio=2&rotation=0&showTitle=false&size=91492&status=done&style=none&taskId=u197d8724-7a1e-45c2-b63f-79c643353ca&title=&width=509)

- 第一步：取新的子节点组中的第一个节点 p-3，它的 key 值为 3。在旧的子节点组中寻找可复用的节点，发现索引为 2 的节点可复用，此时变量 lastIndex 的值为 0，索引 2 不小于 lastIndex 的值 0，所以 节点 p-3 对应的真实 DOM 不需要移动，但需要更新变量 lastIndex 的值为 2。
- 第二步，取新的子节点组中的第二个节点 p-1，它的 key 值为 1。在旧的子节点组中发现索引为 0 的节点可复用。 并且该节点在旧的一组子节点中的索引值为 0。此时变量 lastIndex 的值为 2，索引 0 小于 lastIndex 的值 2，所以节 点 p-1 对应的真实 DOM 需要移动，并且应该移动到节点 p-3 对 应的真实 DOM 后面：
- ![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1684214823868-4bc66214-62d6-4a61-9692-abd4defe97e6.png#averageHue=%23ededed&clientId=u98b85324-934b-4&from=paste&height=356&id=u81a63942&originHeight=712&originWidth=1076&originalType=binary&ratio=2&rotation=0&showTitle=false&size=136889&status=done&style=none&taskId=u0f8ce880-25bc-4d54-bab5-dcf05cfe19a&title=&width=538)
- 最后，我们发现节点 p-2 对应的真实 DOM 仍然存在，所以需要增加逻辑来删除遗留节点。

我们可以在基本更新结束后，遍历旧的子节点组，然后去新的子节点组中寻找具有相同 key 值的节点。如果找不到，说明应删除该节点，如下面 patchChildren 函数的代码所示：
```javascript
function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    // 省略部分代码
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children

    let lastIndex = 0
    for (let i = 0; i < newChildren.length; i++) {
      // 省略部分代码
    }

    // 上一步的更新操作完成后
    // 遍历旧的一组子节点
    for (let i = 0; i < oldChildren.length; i++) {
      const oldVNode = oldChildren[i]
      // 拿旧子节点 oldVNode 去新的一组子节点中寻找具有相同 key 值的节点
      const has = newChildren.find(vnode => vnode.key === oldVNode.key)
      if (!has) {
        // 如果没有找到具有相同 key 值的节点，则说明需要删除该节点
        // 调用 unmount 函数将其卸载
        unmount(oldVNode)
      }
    }
  } else {
    // 省略部分代码
  }
}
```
上述代码，在上一步的更新操作完成之后，我们还需要遍历旧的一组子节点，目的是检查旧子节点在新的一组子节点中是否仍然存在，如果已经不存在了，则调用 unmount 函数将其卸载。

### 9.7 总结
本章我们讨论 Diff 算法的作用，Diff 是用来计算两组子节点的差异，并最大程度复用 DOM 元素。<br />最开始我们采用了一种简单的方式来更新子节点，即卸载所有旧子节点，再挂载所有新子节点。然而这种操作无疑是非常消耗性能的。<br />于是我们改进为：遍历新旧两组子节点中数量较少的那一组，并逐个调用 patch 函数进行打补丁，然后比较新旧两组子节点的数量，如果新的一组子节点数量更多，说明有新子节点需要挂载；否则说明在旧的一组子节点中，有节点需要卸载。<br />然后我们讨论了 key 值作用，，它就像虚拟节点 的“身份证号”。渲染器通过 key 找到可复用元素，避免对 DOM 元素过多的销毁重建。<br />接着我们讨论了简单 Diff 逻辑：在新的一组节点中去寻找旧节点可复用的元素。如果找到了，则记录该节点的位置索引。我们把这个位置索引称为最大索引。在整个更新过程中，如果一个节点的索引值小于最大索引，则说明该节点对应的真实 DOM 元素需要移动。<br />最后，我们讲解了渲染器是如何移动、添加、删除 虚拟节点所对应的 DOM 元素的。
