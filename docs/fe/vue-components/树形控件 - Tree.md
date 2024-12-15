Tree 组件是递归类组件的典型代表，它常用于文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。<br />使用树控件可以完整展现其中的层级关系，并具有展开收起选择等交互功能。<br />我们实现下 Tree ，具有以下功能：

- 节点可以无限延伸（递归）；
- 可以展开 / 收起子节点；
- 节点可以选中，选中父节点，它的所有子节点也全部被选中，同样，反选父节点，其所有子节点也取消选择；
- 同一级所有子节点选中时，它的父级也自动选中，一直递归判断到根节点。

## API
Tree 是典型的数据驱动型组件，所以节点的配置就是一个 data，里面描述了所有节点的信息：
```javascript
data: [
  {
    title: 'parent 1',
    expand: true,
    children: [
      {
        title: 'parent 1-1',
        expand: true,
        children: [
          {
            title: 'leaf 1-1-1'
          },
          {
            title: 'leaf 1-1-2'
          }
        ]
      },
      {
        title: 'parent 1-2',
        children: [
          {
            title: 'leaf 1-2-1'
          },
          {
            title: 'leaf 1-2-1'
          }
        ]
      }
    ]
  }
]
```
每个节点的配置（props：data）描述如下：

- **title**：节点标题（本例为纯文本输出，可参考 Table 的 Render 或 slot-scope 将其扩展）；
- **expand**：是否展开直属子节点。开启后，其直属子节点将展开；
- **checked**：是否选中该节点。开启后，该节点的 Checkbox 将选中；
- **children**：子节点属性数组。

如果一个节点没有 children 字段，那它就是最后一个节点，这也是递归组件终结的判断依据。<br />同时再提供一个是否显示多选框的 props：showCheckbox，以及两个 events：

- **on-toggle-expand**：展开和收起子列表时触发；
- **on-check-change**：点击复选框时触发。

因为是数据驱动，API较为简单，复杂的逻辑都在组件本身。

## 入口 tree.vue
创建两个组件 tree.vue 和 node.vue。<br />tree.vue 是组件的入口，用于接收和处理数据，并将数据传递给 node.vue。<br />node.vue 就是一个递归组件，它构成了每一个**节点**，即一个可展开 / 关闭的按钮（+或-）、一个多选框、节点标题以及递归的下一级节点。<br />tree.vue 主要负责两件事：

1. 定义了组件的入口，即组件的 API；
2. 对接收的数据 props：data 初步处理，为了在 tree.vue 中不破坏使用者传递的源数据 data，所以会深克隆一份数据（cloneData）。
```javascript
// assist.js，部分代码省略
function typeOf(obj) {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
  };
  return map[toString.call(obj)];
}
// deepCopy
function deepCopy(data) {
  const t = typeOf(data);
  let o;

  if (t === 'array') {
    o = [];
  } else if ( t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if ( t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i]);
    }
  }
  return o;
}

export {deepCopy};
```
先来看 tree.vue 的代码：
```vue
<!-- src/components/tree/tree.vue -->
<template>
  <div>
    <tree-node
      v-for="(item, index) in cloneData"
      :key="index"
      :data="item"
      :show-checkbox="showCheckbox"
    ></tree-node>
  </div>
</template>

<script>
  import TreeNode from './node.vue';
  import { deepCopy } from '../../utils/assist.js';

  export default {
    name: 'Tree',
    components: { TreeNode },
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      showCheckbox: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        cloneData: []
      }
    },
    created () {
      this.rebuildData();
    },
    watch: {
      data () {
        this.rebuildData();
      }
    },
    methods: {
      rebuildData () {
        this.cloneData = deepCopy(this.data);
      }
    }
  }
</script>
```
根节点不一定只有一项，有可能是并列的多项。<br />`<tree-node>` 组件（node.vue）接收两个 props：

1. showCheckbox：与 tree.vue 的 showCheckbox 相同，只是进行传递；
2. data：node.vue 接收的 data 是一个 Object 而非 Array，因为它只负责渲染当前的一个节点，并递归渲染下一个子节点（即 children），所以这里对 cloneData 进行循环，将每一项节点数据赋给了 tree-node。

## 递归组件 node.vue
node.vue 是树组件 Tree 的核心，包含 4 个部分：

1. 展开与关闭的按钮（+或-）；
2. 多选框；
3. 节点标题；
4. 递归子节点。

先来看 node.vue 的基本结构：
```vue
<!-- src/components/tree/node.vue -->
<template>
  <ul class="tree-ul">
    <li class="tree-li">
      <span class="tree-expand" @click="handleExpand">
        <span v-if="data.children && data.children.length && !data.expand">+</span>
        <span v-if="data.children && data.children.length && data.expand">-</span>
      </span>
      <i-checkbox
        v-if="showCheckbox"
        :value="data.checked"
        @input="handleCheck"
      ></i-checkbox>
      <span>{{ data.title }}</span>
      <tree-node
        v-if="data.expand"
        v-for="(item, index) in data.children"
        :key="index"
        :data="item"
        :show-checkbox="showCheckbox"
      ></tree-node>
    </li>
  </ul>
</template>

<script>
  import iCheckbox from '../checkbox/checkbox.vue';

  export default {
    name: 'TreeNode',
    components: { iCheckbox },
    props: {
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      showCheckbox: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style>
  .tree-ul, .tree-li{
    list-style: none;
    padding-left: 10px;
  }
  .tree-expand{
    cursor: pointer;
  }
</style>
```
第一部分 expand，如果当前节点不含有子节点，也就是没有 children 字段或 children 的长度是 0，那就说明当前节点已经是最后一级节点，所以不含有展开 / 收起的按钮。<br />多选框直接使用了之前的 Checkbox 组件，并且没有用 v-model 语法糖，因为我们需要在 @input 里要额外做一些处理。<br />这里终结递归组件的条件是 v-for="(item, index) in data.children"，当 data.children 不存在或为空数组时，自然就不会继续渲染子节点，递归也就停止了。<br />这里的 v-if="data.expand" 并不是递归组件的终结条件，它的用处是判断当前节点**的子节点**是否展开（渲染）。如果当前节点不展开，那它所有的子节点也就不会展开（渲染）。<br />上面的代码保留了两个方法 handleExpand 与 handleCheck，先来看前者：
```javascript
// node.vue，部分代码省略
import { findComponentUpward } from '../../utils/assist.js';

export default {
  data () {
    return {
      tree: findComponentUpward(this, 'Tree')
    }
  },
  methods: {
    handleExpand () {
      this.$set(this.data, 'expand', !this.data.expand);

      if (this.tree) {
        this.tree.emitEvent('on-toggle-expand', this.data);
      }
    },
  }
}
```
```javascript
// tree.vue，部分代码省略
export default {
  methods: {
    emitEvent (eventName, data) {
      this.$emit(eventName, data, this.cloneData);
    }
  }
}
```
点击 + 号时，会展开直属子节点，点击 - 号关闭。<br />这一步只需在 handleExpand 中修改 data 的 expand 数据即可，同时，我们拿到 Tree 的根组件（tree.vue）触发一个自定义事件。<br />通过 findComponentUpward 向上找到了 Tree 的实例，并调用它的 emitEvent 方法来触发自定义事件 @on-toggle-expand。<br />之所以使用 findComponentUpward 寻找组件，而不是用 $parent，是因为当前的 node.vue，它的父级不一定就是 tree.vue，因为它是递归组件，父级有<br />可能还是自己。

接下来是整个 Tree 组件最复杂的一部分，就是处理节点的响应状态。<br />树组件是有上下级关系的，它们分为两种逻辑，当选中（或取消选中）一个节点时：

1. 它下面的所有子节点都会被选中；
2. 如果同一级所有子节点选中时，它的父级也自动选中，一直递归判断到根节点。

第 1 个逻辑相对简单，当选中一个节点时，只要递归地遍历它所有子节点数据，修改所有的 checked 字段即可：
```javascript
// node.vue，部分代码省略
export default {
  methods: {
    handleCheck (checked) {
      this.updateTreeDown(this.data, checked);

      if (this.tree) {
        this.tree.emitEvent('on-check-change', this.data);
      }
    },
    updateTreeDown (data, checked) {
      this.$set(data, 'checked', checked);

      if (data.children && data.children.length) {
        data.children.forEach(item => {
          this.updateTreeDown(item, checked);
        });
      }
    }
  }
}
```
再来看第 2 个逻辑，它的难点在于，无法通过当前节点数据，修改到它的父节点，因为拿不到。<br />一种方式是将 updateTreeUp 写在 tree.vue 里，在 node.vue 的 handleCheck 方法里调用 updateTreeUp 方法找到当前数据位置再往上找到父级，这还需要给每个数据设置 key，太麻烦。<br />换个思路。一个节点，除了手动选中（或反选），还有就是第 2 种逻辑的被动选中（或反选）。<br />也就是说，如果这个节点的所有直属子节点（就是它的第一级子节点）都选中（或反选）时，这个节点就自动被选中（或反选），递归地，可以一级一级响<br />应上去。<br />有了这个思路，我们就可以通过 watch 来监听当前节点的子节点是否都选中，进而修改当前的 checked 字段：
```javascript
// node.vue，部分代码省略
export default {
  watch: {
    'data.children': {
      handler (data) {
        if (data) {
          const checkedAll = !data.some(item => !item.checked);
          this.$set(this.data, 'checked', checkedAll);
        }
      },
      deep: true
    }
  }
}
```
当 data.children 中的数据的某个字段发生变化时（这里当然是指 checked 字段），也就是说它的某个子节点被选中（或反选）了，checkedAll 最终返回<br />结果就是当前子节点是否都被选中了。<br />这里非常巧妙地利用了递归的特性，因为 node.vue 是一个递归组件，那每一个组件里都会有 watch 监听 data.children，要知道，当前的节点有两个”身份<br />“，它既是下属节点的父节点，同时也是上级节点的子节点，它作为下属节点的父节点被修改的同时，也会触发上级节点中的 watch 监听函数。**这就是递**<br />**归**。<br />[GitHub - icarusion/vue-component-book: 掘金小册《Vue.js 组件精讲》示例源码](https://github.com/icarusion/vue-component-book/tree/master)
