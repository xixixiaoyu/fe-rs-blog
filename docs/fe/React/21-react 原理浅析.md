## vdom
- 原生 dom 属性很多很杂，更新时候不好处理
- 用 JS 对象表示 dom 后，没有和 dom 强绑定了，可以渲染到别的平台，比如 native、canvas 等。
```nginx
{
    type: 'div',
    props: {
        id: 'aaa',
        className: ['bbb', 'ccc'],
        onClick: function() {}
    },
    children: []
}
```
但是开发不可能写这样的方式去创建 dom ，所以要引入编译的手段。

## dsl 的编译
dsl 是 domain specific language，领域特定语言的意思，html、css 都是 web 领域的 dsl。<br />直接写 vdom 太麻烦了，所以前端框架都会设计一套 dsl，然后编译成 render function，执行后产生 vdom。<br />vue 和 react 都是这样：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688561889962-3da4d09d-d3d9-4fb3-a541-3c3150f4d11b.png#averageHue=%23f7d48e&clientId=u466cacc3-cda5-4&from=paste&height=136&id=u1f21f3fa&originHeight=272&originWidth=1288&originalType=binary&ratio=2&rotation=0&showTitle=false&size=77854&status=done&style=none&taskId=ucdf8f1ec-96e6-4f18-8be0-a7bd35f8010&title=&width=644)<br />这套 dsl 怎么设计呢？<br />前端领域大家熟悉的描述 dom 的方式是 html，最好的方式自然是也设计成那样。<br />所以 vue 的 template，react 的 jsx 就都是这么设计的。<br />vue 的 template compiler 是自己实现的，而 react 的 jsx 的编译器是 babel 实现的，是两个团队合作的结果。<br />比如我们可以这样写：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688572036917-996e53cc-0306-4c65-ad10-2caae64e992b.png#averageHue=%23ecd9d0&clientId=u02deef60-4e05-4&from=paste&height=124&id=u68eb4012&originHeight=248&originWidth=1450&originalType=binary&ratio=2&rotation=0&showTitle=false&size=95751&status=done&style=none&taskId=u9e4a86c1-fc74-44b3-8d09-c798735a90c&title=&width=725)<br />编译成 render function 后再执行就是我们需要的 vdom。<br />接下来渲染器把它渲染出来就行了。<br />那渲染器怎么渲染 vdom 的呢？

## 渲染 vdom
渲染 vdom 也就是通过 dom api 增删改 dom。<br />比如一个 div，那就要 document.createElement 创建元素，然后 setAttribute 设置属性，addEventListener 设置事件监听器。<br />如果是文本，那就要 document.createTextNode 来创建。<br />所以说根据 vdom 类型的不同，写个 if else，分别做不同的处理就行了。<br />不管 vue 还是 react，渲染器里这段 if else 是少不了的：
```javascript
switch (vdom.tag) {
  case HostComponent:
    // 创建或更新 dom
  case HostText:
    // 创建或更新 dom
  case FunctionComponent: 
    // 创建或更新 dom
  case ClassComponent: 
    // 创建或更新 dom
}
```
react 里是通过 tag 来区分 vdom 类型的，比如 HostComponent 就是元素，HostText 就是文本，FunctionComponent、ClassComponent 就分别是函数组件和类组件。<br />那么问题来了，组件怎么渲染呢？<br />这就涉及到组件的原理了：

## 组件
通过 vdom 描述界面，在 react 里会使用 jsx。<br />这样的 jsx 有的时候是基于 state 来动态生成的。如何把 state 和 jsx 关联起来呢？<br />封装成 function、class 或者 option 对象的形式。然后在渲染的时候执行它们拿到 vdom 就行了。<br />这就是组件的实现原理：
```javascript
switch (vdom.tag) {
  case FunctionComponent: 
       const childVdom = vdom.type(props);
       
       render(childVdom);
       //...
  case ClassComponent: 
     const instance = new vdom.type(props);
     const childVdom = instance.render();
     
     render(childVdom);
     //...
}
```
如果是函数组件，那就传入 props 执行它，拿到 vdom 之后再递归渲染。<br />如果是 class 组件，那就创建它的实例对象，调用 render 方法拿到 vdom，然后递归渲染。<br />vue 的 option 对象的组件描述方式也是执行下 render 方法而已：
```javascript
const options =  {
    data: {},
    props: {}
    render(h) {
        return h('div', {}, '');
    }
}

 const childVdom = option.render();
 
 render(childVdom);
```
平时写的单文件组件的 sfc 形式，会有专门编译器，将 template 编译成 render function，然后挂到 option 对象的 render 方法上。<br />所以组件本质上只是对产生 vdom 的逻辑的封装，函数的形式、option 对象的形式、class 的形式都可以。<br />就像 vue3 也有了函数组件一样，组件的形式并不重要。<br />基于 vdom 的前端框架渲染流程都差不多，但是管理状态的方式不一样，vue 有响应式，而 react 则是 setState 的 api 的方式。

## 状态管理
react 是通过 setState 的 api 触发状态更新的，更新以后就重新渲染整个 vdom。<br />而 vue 是通过对状态做代理，get 的时候收集依赖，然后修改状态的时候就可以触发对应组件的 render 了。<br />为什么 react 不直接渲染呢？<br />想象这样一个场景，父组件把它的 setState 函数传递给子组件，子组件调用了它。<br />这时候更新是子组件触发的，但是要渲染的就只有那个组件么？<br />明显不是，还有它的父组件。所以某个组件更新可能触发任意位置的其他组件更新。所以必须重新渲染整个 vdom 才行。<br />那 Vue 为什么能精确更新变化组件呢？因为响应式依赖收集，无论哪个位置组件，用到对应状态，那就会被作为依赖收集起来，状态变化的时候就可以触<br />发它们的 render，不管是组件是在哪里的。<br />这就是为什么 react 需要重新渲染整个 vdom，而 vue 不用。<br />这个问题也导致了后来两者架构上逐渐有了差异。


## react 架构的演变
react15 的时候，和 vue 的渲染流程还是很像的，都是递归渲染 vdom，增删改 dom 就行。<br />但是因为状态管理方式的差异逐渐导致了架构的差异。<br />react 的 setState 会渲染整个 vdom，计算量可能很大。<br />js 计算时间太长会阻塞渲染，会占用每一帧的动画的重绘重排的时间，这样动画就会卡顿。<br />那我们能不能把计算量拆分一下，每一帧计算一部分，不要阻塞动画的渲染呢？<br />于是 react 改造为了 fiber 架构。

### fiber 架构
优化的目标是打断计算，分多次进行，但目前递归的渲染不能打断，主要由以下两个原因：

- 渲染时会操作 dom，这时候打断了，那已经更新到 dom 的那部分怎么办？
- 渲染 vdom 为真实 dom ，vdom 里只有 children 的信息，如果打断了，怎么找到它的父节点呢？

第一个问题可以不直接更新 dom，只找到变化的部分，打个增删改的标记，创建好 dom，等全部计算完了一次性更新到 dom 就好了。<br />所以 react 把渲染流程分为了两部分： render 和 commit。<br />render 阶段会找到 vdom 中变化的部分，创建 dom，打上增删改的标记，这个叫做 reconcile 调和。reconcile 是可以打断的，由 schedule 调度。<br />之后全部计算完，就一次性更新到 dom，叫做 commit。<br />这样 react 架构就改造为 render（reconcile + schdule） + commit 两个阶段的渲染。抛弃了之前和 vue 很像的递归渲染。<br />第二个问题，如何打断以后还能找到父节点、其他兄弟节点呢？<br />现有的 vdom 不满足，还需要加上 parent、silbing 的信息。所以 react 创造了 fiber 的数据结构。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1688635724933-919659b3-665e-4942-a0a3-f525cfbda7c3.png#averageHue=%23f7f0ea&clientId=u6257d87c-c2b7-4&from=paste&height=427&id=uc4d17980&originHeight=758&originWidth=478&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=205764&status=done&style=none&taskId=u49bb84dd-3fb8-4163-81d6-6f5cdeab25c&title=&width=269.5454406738281)<br />除了 children 信息外，额外多了 sibling、return，分别记录着兄弟节点、父节点的信息。<br />这个数据结构也叫做 fiber。（fiber 既是一种数据结构，也代表 render + commit 的渲染流程）<br />react 会先把 vdom 转换成 fiber，再去进行 reconcile，这样就是可打断的了<br />为什么这样可以打断了呢？<br />因为现在不是递归，而是循环了：
```javascript
function workLoop() {
  while (wip) {
    performUnitOfWork()
  }

  if (!wip && wipRoot) {
    commitRoot()
  }
}
```
react 里有一个 workLoop 循环，每次循环做一个 fiber 的 reconcile，当前处理的 fiber 会放在 workInProgress 这个全局变量上。<br />当循环完了，也就是 wip 为空了，那就执行 commit 阶段，把 reconcile 的结果更新到 dom。<br />每个 fiber 的 reconcile 是根据类型来做的不同处理。<br />当处理完了当前 fiber 节点，就把 wip 指向 sibling 或 return 来切到下个 fiber 节点：
```javascript
function performUnitOfWork() {
  const { tag } = wip

  switch (tag) {
    case HostComponent:
      updateHostComponent(wip)
      break
    case FunctionComponent:
      updateFunctionComponent(wip)
      break
    case ClassComponent:
      updateClassComponent(wip)
      break
    case Fragment:
      updateFragmentComponent(wip)
      break
    case HostText:
      updateHostTextComponent(wip)
      break
    default:
      break
  }

  if (wip.child) {
    wip = wip.child
    return
  }

  let next = wip

  while (next) {
    if (next.sibling) {
      wip = next.sibling
      return
    }
    next = next.return
  }

  wip = null
}
```
函数组件和 class 组件的 reconcile 都是调用相对应的函数拿到 vdom，然后继续处理渲染出的 vdom：
```javascript
function updateClassComponent(wip) {
  const { type, props } = wip
  const instance = new type(props)
  const children = instance.render()

  reconcileChildren(wip, children)
}

function updateFunctionComponent(wip) {
  renderWithHooks(wip)

  const { type, props } = wip

  const children = type(props)
  reconcileChildren(wip, children)
}
```
循环执行 reconcile，那每次处理之前判断一下是不是有更高优先级的任务，就能实现打断了。<br />所以我们在每次处理 fiber 节点的 reconcile 之前，都先调用下 shouldYield 方法：
```javascript
function workLoop() {
  while (wip && shouldYield()) {
    performUnitOfWork()
  }

  if (!wip && wipRoot) {
    commitRoot()
  }
}
```
shouldYield 方法判断任务队列中有没有优先级更高的任务，有的话就先处理那边的 fiber，这边先暂停一下。<br />这就是 fiber 架构的 reconcile 可以打断的原理。通过 fiber 的数据结构，加上循环处理前每次判断下是否打断来实现的。

接下来我们说说 commit 阶段：<br />前面说过，为了变为可打断的，reconcile 阶段并不会真正操作 dom，只会创建 dom 然后打个 effectTag 的增删改标记。<br />commit 阶段就根据标记来更新 dom 就可以了。<br />但是 commit 阶段还要再遍历一次 fiber 来查找有 effectTag 的节点，更新 dom 么？<br />当然不用，我们可以直接在 reconcile 的时候把有 effectTag 的节点收集到一个队列里，然后 commit 阶段直接遍历这个队列就行了。<br />这个队列叫做 effectList。<br />react 会在 commit 阶段遍历 effectList，根据 effectTag 来增删改 dom。<br />实际上 react 把 commit 阶段也分成了 3 个小阶段。<br />before mutation、mutation、layout。<br />mutation 就是遍历 effectList 来更新 dom 的。<br />before mutation，会异步调度 useEffect 的回调函数。<br />它之后就是 layout 阶段了，这个阶段已经可以拿到布局信息了，会同步调用 useLayoutEffect 的回调函数。而且这个阶段可以拿到新的 dom 节点，还会更新下 ref。


## 总结
react 和 vue 都是基于 vdom 的前端框架，之所以用 vdom 是因为可以精准的对比更新的属性，而且还可以跨平台渲染。<br />但是开发不会直接写 vdom，而是通过 jsx 这种接近 html 语法的 DSL，编译产生 render function，执行后产生 vdom。<br />vdom 的渲染就是根据不同的类型来用不同的 dom api 来操作 dom。<br />渲染组件的时候，如果是函数组件，就执行它拿到 vdom。class 组件就创建实例然后调用 render 方法拿到 vdom。vue 的那种 option 对象的话，也是调用 render 方法拿到 vdom。<br />组件本质上就是对一段 vdom 产生逻辑的封装，函数、class、option 对象甚至其他形式都可以。<br />react 和 vue 最大的区别在状态管理方式上，vue 是通过响应式，react 是通过 setState 的 api。我觉得这个是最大的区别，因为它导致了后面 react 架构的变更。<br />react 的 setState 的方式，导致它并不知道哪些组件变了，需要渲染整个 vdom 才行。但是这样计算量又会比较大，会阻塞渲染，导致动画卡顿。<br />所以 react 后来改造成了 fiber 架构，目标是可打断的计算。<br />为了这个目标，把渲染分为了 render 和 commit 两个阶段，render 阶段通过 schedule 调度来进行 reconcile，也就是找到变化的部分，创建 dom，打上增删改的 tag，等全部计算完之后，commit 阶段一次性更新到 dom。<br />打断之后要找到父节点、兄弟节点，所以 vdom 也改造成了 fiber 的数据结构，有了 parent、sibling 的信息。<br />所以 fiber 既指这种链表的数据结构，又指这个 render、commit 的流程。<br />reconcile 阶段每次处理一个 fiber 节点，处理前会判断下 shouldYield，如果有更高优先级的任务，那就先执行别的。<br />commit 阶段不用再次遍历 fiber 树，为了优化，react 把有 effectTag 的 fiber 都放到了 effectList 队列中，遍历更新即可。<br />在dom 操作前，会异步调用 useEffect 的回调函数，异步是因为不能阻塞渲染。<br />在 dom 操作之后，会同步调用 useLayoutEffect 的回调函数，并且更新 ref。<br />所以，commit 阶段又分成了 before mutation、mutation、layout 这三个小阶段，就对应上面说的那三部分。<br />我觉得理解了 vdom、jsx、组件本质、fiber、render(reconcile + schedule) + commit(before mutation、mutation、layout)的渲染流程，就算是对 react 原理有一个比较深的理解了。
