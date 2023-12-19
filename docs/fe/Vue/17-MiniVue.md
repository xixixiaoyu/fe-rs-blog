## 1.虚拟 DOM 的优势

> 传统开发：`HTML ==> DOM树 ==> 浏览器计算渲染`
>
> 当框架纷纷引入虚拟 DOM 对真实 DOM 进行抽象成 VNode（虚拟节点）后
>
> 对于其 diff 和 clone 等操作会变得非常简单，方便更好的表达操作逻辑
>
> 最重要是方便实现跨平台，你可以将 VNode 节点渲染成任意想要的节点，如渲染在 canvas、WebGL、SSR、Native（iOS、Android）上，当然我们也能开发属于自己的渲染器（renderer），在其他的平台上渲染
>
> Vue 虚拟 DOM 的渲染过程 ：`模板template ==> 渲染函数render function ==> 虚拟节点VNode ==> 真实元素 ==> 浏览器展示`

## 2.三大核心系统

> Vue 的源码实际包含三大核心：
>
> 1. Compiler 模块：编译模板系统
> 2. Runtime 模块：也可以称之为 Renderer 模块，真正渲染的模块
> 3. Reactivity 模块：响应式系统

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206113013480.png" alt="image-20220206113013480" style="zoom:67%;" />

编译系统： `模板template ==> 渲染函数render function`

渲染系统： `渲染函数render function ==> 虚拟节点VNode ==> 真实元素 ===> 浏览器展示`

响应式系统：`VNode变更 ==> diff算法 ==> 新的VNode ==> 真实元素 ==> 浏览器展示`

## 3.实现 Mini-Vue

> 我们实现一个简洁版的 Mini-Vue 框架，该 Vue 包括三个模块
>
> 1. 渲染系统模块
> 2. 可响应式系统模块
> 3. 应用程序入口模块

### 1.渲染系统模块

主要包含三个功能

1. h 函数，用于返回一个 VNode 对象
2. mount 函数，用于将 VNode 挂载到 DOM 上
3. patch 函数，用于对两个 VNode 进行对比，决定如何处理新的 VNode

#### h 函数实现

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206114933548.png" alt="image-20220206114933548" style="zoom: 67%;" />

#### mount 函数

> 1. 根据 tag，创建 HTML 元素，并且存储 到 vnode 的 el 中
> 2. 处理 props 属性：如果以 on 开头，那么监听事件，普通属性直接通过 setAttribute 添加即可
> 3. 处理子节点，如果是字符串节点，那么直接设置 textContent，如果是数组节点，那么遍历调用 mount 函 数

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206120016719.png" alt="image-20220206120016719" style="zoom: 50%;" />

#### patch 函数

> patch 函数的实现，分为两种情况
>
> 当 n1 和 n2 是不同类型的节点：
>
> - 找到 n1 的 el 父节点，删除原来的 n1 节点的 el
> - 挂载 n2 节点到 n1 的 el 父节点上
>
> n1 和 n2 节点是相同的节点：
>
> - 处理 props 的情况
>   - 对比新旧节点 props 不同后将新的 props 全部挂载到 el 上
>   - 判断旧节点的 props 是否不需要在新节点上，如果不需要，那么删除对应的属性
> - 处理 children 的情况
>   - 如果新节点是一个字符串类型，那么直接调用 el.textContent = newChildren
>   - 如果新节点不同一个字符串类型
>     - 旧节点是一个字符串类型
>       - 将 el 的 textContent 设置为空字符串
>       - 旧节点是一个字符串类型，那么直接遍历新节点，挂载到 el 上
>     - 旧节点也是一个数组类型
>       - 取出数组的最小长度
>       - 遍历所有的节点，新节点和旧节点进行 path 操作
>       - 如果新节点的 length 更长，那么剩余的新节点进行挂载操作
>       - 如果旧节点的 length 更长，那么剩余的旧节点进行卸载操作

对 tag 和 props 的处理：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206125019007.png" alt="image-20220206125019007" style="zoom:67%;" />

对 children 的处理：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206152003905.png" alt="image-20220206152003905" style="zoom: 67%;" />

### 2.可响应式系统模块

#### 依赖收集系统

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206194527890.png" alt="image-20220206194527890" style="zoom: 67%;" />

#### 响应式系统 Vue2 实现

之前只要当我们调用 dep.notify 所有的 watchEffect 里面的回调函数会重新执行

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206201026565.png" alt="image-20220206201026565" style="zoom:67%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206201321338.png" alt="image-20220206201321338" style="zoom:67%;" />

#### 响应式系统 Vue3 实现

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206202057001.png" alt="image-20220206202057001" style="zoom: 50%;" />

### 3.应用程序入口模块

> createApp 用于创建一个 app 对象
>
> 该 app 对象有一个 mount 方法，可以将根组件挂载到某一个 dom 元素上

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220206203955936.png" alt="image-20220206203955936" style="zoom:67%;" />

### 4.Mini-Vue 大功告成

`mini-vue/index.js`

```js
function createApp(rootComponent) {
  return {
    mount(selector) {
      const container = document.querySelector(selector);
      let isMounted = false;
      let oldVNode = null;

      watchEffect(function () {
        if (!isMounted) {
          oldVNode = rootComponent.render();
          mount(oldVNode, container);
          isMounted = true;
        } else {
          const newVNode = rootComponent.render();
          patch(oldVNode, newVNode);
          oldVNode = newVNode;
        }
      });
    },
  };
}
```

`mini-vue/reactive.js`

```js
class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }

  notify() {
    this.subscribers.forEach((effect) => {
      effect();
    });
  }
}

let activeEffect = null;
function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

const targetMap = new WeakMap();
function getDep(target, key) {
  // 1.根据对象(target)取出对应的Map对象
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // 2.取出具体的dep对象
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

// vue3对raw进行数据劫持
function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key);
      dep.depend();
      return target[key];
    },
    set(target, key, newValue) {
      const dep = getDep(target, key);
      target[key] = newValue;
      dep.notify();
    },
  });
}
```

`mini-vue/renderer.js`

```js
const h = (tag, props, children) => {
  // vnode -> javascript对象 {}
  return {
    tag,
    props,
    children,
  };
};

// vnode -> element
const mount = (vnode, container) => {
  // 1.创建出真实的原生, 并且在vnode上保留el
  const el = (vnode.el = document.createElement(vnode.tag));

  // 2.处理props
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key];

      if (key.startsWith("on")) {
        // 对事件监听的判断
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  // 3.处理children
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach((item) => {
        mount(item, el);
      });
    }
  }

  // 4.将el挂载到container上
  container.appendChild(el);
};

// n1旧节点 n2新节点
const patch = (n1, n2) => {
  // 如果元素标签不一样，直接删除重建
  if (n1.tag !== n2.tag) {
    const n1ElParent = n1.el.parentElement;
    n1ElParent.removeChild(n1.el);
    mount(n2, n1ElParent);
  } else {
    // 1.取出element对象, 并且在n2中进行保存
    const el = (n2.el = n1.el);

    // 2.处理props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 2.1.获取所有的newProps添加到el
    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        if (key.startsWith("on")) {
          // 对事件监听的判断
          el.addEventListener(key.slice(2).toLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }

    // 2.2.删除旧的props
    for (const key in oldProps) {
      if (key.startsWith("on")) {
        // 对事件监听的判断
        const value = oldProps[key];
        el.removeEventListener(key.slice(2).toLowerCase(), value);
      }
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }

    // 3.处理children
    const oldChildren = n1.children || [];
    const newChidlren = n2.children || [];

    if (typeof newChidlren === "string") {
      // 情况一: newChildren本身是一个string
      // 边界情况 (edge case)
      if (typeof oldChildren === "string") {
        if (newChidlren !== oldChildren) {
          el.textContent = newChidlren;
        }
      } else {
        el.innerHTML = newChidlren;
      }
    } else {
      // 情况二: newChildren本身是一个数组
      if (typeof oldChildren === "string") {
        el.innerHTML = "";
        newChidlren.forEach((item) => {
          mount(item, el);
        });
      } else {
        // oldChildren: [v1, v2, v3, v8, v9]
        // newChildren: [v1, v5, v6]
        // 1.前面有相同节点的元素进行patch操作
        const commonLength = Math.min(oldChildren.length, newChidlren.length);
        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChidlren[i]);
        }

        // 2.newChildren.length > oldChildren.length
        if (newChidlren.length > oldChildren.length) {
          newChidlren.slice(oldChildren.length).forEach((item) => {
            mount(item, el);
          });
        }

        // 3.newChildren.length < oldChildren.length
        if (newChidlren.length < oldChildren.length) {
          oldChildren.slice(newChidlren.length).forEach((item) => {
            el.removeChild(item.el);
          });
        }
      }
    }
  }
};
```

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./renderer.js"></script>
    <script src="./reactive.js"></script>
    <script src="./index.js"></script>

    <script>
      // 1.创建根组件
      const App = {
        data: reactive({
          counter: 0,
        }),
        render() {
          return h("div", null, [
            h("h2", null, `当前计数: ${this.data.counter}`),
            h(
              "button",
              {
                onClick: () => {
                  this.data.counter++;
                  console.log(this.data.counter);
                },
              },
              "+1"
            ),
          ]);
        },
      };

      // 2.挂载根组件
      const app = createApp(App);
      app.mount("#app");
    </script>
  </body>
</html>
```
