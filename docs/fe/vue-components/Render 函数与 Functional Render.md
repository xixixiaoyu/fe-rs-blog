Vue2.x 使用虚拟 dom，template 的内容最后会解析为  虚拟 dom。<br />在 Vue.js 中，对于大部分场景，使用 template 足以应付。<br />但如果想完全发挥 JavaScript 的编程能力，需要使用 Vue.js 的 Render 函数。

## Render 函数
Vue.js 的 Render 函数需要使用一些特定的选项，将 template 的内容改写成一个 JavaScript 对象。<br />来看一组 template 和 Render 写法的对照：
```vue
<template>
  <div id="main" class="container" style="color: red">
    <p v-if="show">内容 1</p>
    <p v-else>内容 2</p>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        show: false
      }
    }
  }
</script>
```
```vue
export default {
  data () {
    return {
      show: false
    }
  },
  render: (h) => {
    let childNode;
    if (this.show) {
      childNode = h('p', '内容 1');
    } else {
      childNode = h('p', '内容 2');
    }
    
    return h('div', {
      attrs: {
        id: 'main'
      },
      class: {
        container: true
      },
      style: {
        color: 'red'
      }
    }, [childNode]);
  }
}
```
这里的 h，即 createElement，是 Render 函数的核心。<br />template 中的 **v-if / v-else** 等指令，都被 js 的 **if / else** 替代了，那 **v-for** 自然也会被 **for** 语句替代。<br />h 有 3 个参数，分别是：

1. 要渲染的元素或组件，可以是一个 html 标签、组件选项或一个函数（不常用），该参数为必填项。示例：
```javascript
// 1. html 标签
h('div');
// 2. 组件选项
import DatePicker from '../component/date-picker.vue';
h(DatePicker);
```

2. 对应属性的数据对象，比如组件的 props、元素的 class、绑定的事件、slot、自定义指令等，该参数是可选的，配置项很多。该参数的完整配置和示例，官网查阅即可。
3. 子节点，可选，String 或 Array，它同样是一个 h。示例：
```javascript
[
  '内容',
  h('p', '内容'),
  h(Component, {
    props: {
      someProp: 'foo'
    }
  })
]
```

## 约束
所有的组件树中，如果 vdom 是组件或含有组件的 slot，那么 vdom 必须唯一。以下两个示例都是**错误**的：
```javascript
// 局部声明组件
const Child = {
  render: (h) => {
    return h('p', 'text');
  }
}

export default {
  render: (h) => {
    // 创建一个子节点，使用组件 Child
    const ChildNode = h(Child);
    
    return h('div', [
      ChildNode,
      ChildNode
    ]);
  }
}
```
```javascript
{
  render: (h) => {
    return h('div', [
      this.$slots.default,
      this.$slots.default
    ])
  }
}
```
重复渲染多个组件或元素，可以通过一个循环和工厂函数来解决：
```javascript
const Child = {
  render: (h) => {
    return h('p', 'text');
  }
}

export default {
  render: (h) => {
    const children = Array.apply(null, {
      length: 5
    }).map(() => {
      return h(Child);
    });
    return h('div', children);
  }
}
```
对于含有组件的 slot，复用比较复杂，需要将 slot 的每个子节点都克隆一份，例如：
```javascript
{
  render: (h) => {
    function cloneVNode (vnode) {
      // 递归遍历所有子节点，并克隆
      const clonedChildren = vnode.children && vnode.children.map(vnode => cloneVNode(vnode));
      const cloned = h(vnode.tag, vnode.data, clonedChildren);
      cloned.text = vnode.text;
      cloned.isComment = vnode.isComment;
      cloned.componentOptions = vnode.componentOptions;
      cloned.elm = vnode.elm;
      cloned.context = vnode.context;
      cloned.ns = vnode.ns;
      cloned.isStatic = vnode.isStatic;
      cloned.key = vnode.key;

      return cloned;
    }

    const vNodes = this.$slots.default === undefined ? [] : this.$slots.default;
    const clonedVNodes = this.$slots.default === undefined ? [] : vNodes.map(vnode => cloneVNode(vnode));
    
    return h('div', [
      vNodes,
      clonedVNodes
    ])
  }
}
```
在 Render 函数里创建了一个 cloneVNode 的工厂函数，通过递归将 slot 所有子节点都克隆了一份，并对 VNode 的关键属性也进行了复制。<br />深度克隆 slot 并非 Vue.js 内置方法，也没有得到推荐，属于黑科技，比如 iView 组件库的穿梭框组件 Transfer，就用到了这种方法：
```html
<Transfer
    :data="data"
    :target-keys="targetKeys"
    :render-format="renderFormat">
  <div :style="{float: 'right', margin: '5px'}">
    <Button size="small" @click="reloadMockData">Refresh</Button>
  </div>
</Transfer>
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690111219128-53e92d17-5605-4302-bcef-5562dcd53d0c.png#averageHue=%23fdfdfd&clientId=u266586b4-857d-4&from=paste&height=314&id=ufe59eabc&originHeight=628&originWidth=1274&originalType=binary&ratio=2&rotation=0&showTitle=false&size=237433&status=done&style=none&taskId=u60c67558-ca2d-4e2d-b9c8-437f462a4b1&title=&width=637)<br />上面默认 slot 是一个 Refresh 按钮，使用者只写了一遍，但在 Transfer 组件中，是通过克隆 VNode 的方法，显示了两遍。<br />如果不这样做，就要声明两个具名 slot，但是左右两个的逻辑可能是完全一样的。

## Render 函数使用场景
在 Vue.js 中，使用 Render 函数的场景，主要有以下 4 点：

1. 使用两个相同 slot。Vue.js 不允许使用两个相同的 slot，比如下面这样：
```html
<template>
  <div>
    <slot></slot>
    <slot></slot>
  </div>
</template>
```
解决方案就是上文中讲到的**约束**，使用一个深度克隆 VNode 节点的方法。

2. 在 SSR 环境（服务端渲染），非常规的 template 写法，比如通过 Vue.extend 和 new Vue 构造来生成的组件实例，是编译不过的，前面的 $Alert 组件的 notification.js 文件，当时是使用 Render 函数来渲染 Alert 组件，如果改成另一种写法，在 SSR 中会报错，对比两种写法：
```javascript
// 正确写法
import Alert from './alert.vue';
import Vue from 'vue';

Alert.newInstance = properties => {
  const props = properties || {};

  const Instance = new Vue({
    data: props,
    render (h) {
      return h(Alert, {
        props: props
      });
    }
  });

  const component = Instance.$mount();
  document.body.appendChild(component.$el);

  const alert = Instance.$children[0];

  return {
    add (noticeProps) {
      alert.add(noticeProps);
    },
    remove (name) {
      alert.remove(name);
    }
  }
};

export default Alert;
```
```javascript
// 在 SSR 下报错的写法
import Alert from './alert.vue';
import Vue from 'vue';

Alert.newInstance = properties => {
  const props = properties || {};

  const div = document.createElement('div');
  div.innerHTML = `<Alert ${props}></Alert>`;
  document.body.appendChild(div);
  
  const Instance = new Vue({
    el: div,
    data: props,
    components: { Alert }
  });

  const alert = Instance.$children[0];

  return {
    add (noticeProps) {
      alert.add(noticeProps);
    },
    remove (name) {
      alert.remove(name);
    }
  }
};

export default Alert;
```

3. 在 runtime 版本的 Vue.js 中，如果使用 Vue.extend 手动构造一个实例，再使用 template 选项是会报错的，这时候就需要 Render 了。
4. 最重要的一点：有组件需要从父级传递来显示，就需要 Render 函数，它可以渲染一个完整的 Vue.js 组件。slot 也行，但是特殊组件中，比如一个表格组件 Table，它只接收两个 props：列配置 columns 和行数据 data。这种场景只用 slot 是不行的，没办法确定是哪一列的 slot。。这种场景有两种解决方案，其一就是 Render 函数，另外就是使用作用域 slot（slot-scope）。

## Functional Render
Vue.js 提供了一个 functional 的布尔值选项，设置为 true 可以使组件无状态和无实例，也就是没有 data 和 this 上下文。<br />这样用 Render 函数返回虚拟节点可以更容易渲染，因为函数化组件（Functional Render）只是一个函数，渲染开销要小很多。<br />使用函数化组件，Render 函数提供了第二个参数 context 来提供临时上下文。组件需要的 data、props、slots、children、parent 都是通过这个上下文来传递的。<br />函数化组件主要适用于以下两个场景：

- 程序化地在多个组件中选择一个。
- 在将 children、props、data 传递给子组件之前操作它们。

比如上文说过的，某个组件需要使用 Render 函数来自定义，而不是通过传递普通文本或 v-html 指令，这时就可以用 Functional Render，来看下面的示例：<br />首先创建一个函数化组件 **render.js**：
```javascript
// render.js
export default {
  functional: true,
  props: {
    render: Function
  },
  render: (h, ctx) => {
    return ctx.props.render(h);
  }
};
```
这是一个中间文件，只定义了一个 props：render。<br />创建组件：
```vue
<!-- my-component.vue -->
<template>
  <div>
    <Render :render="render"></Render>
  </div>
</template>

<script>
  import Render from './render.js';
  
  export default {
    components: { Render },
    props: {
      render: Function
    }
  }
</script>
```
使用上面的 my-compoennt 组件：
```vue
<!-- demo.vue -->
<template>
  <div>
    <my-component :render="render"></my-component>
  </div>
</template>

<script>
  import myComponent from '../components/my-component.vue';
  
  export default {
    components: { myComponent },
    data () {
      return {
        render: (h) => {
          return h('div', {
            style: {
              color: 'red'
            }
          }, '自定义内容');
        }
      }
    }
  }
</script>
```
