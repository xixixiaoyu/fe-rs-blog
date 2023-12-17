多选框组件也是由两个组件组成：CheckboxGroup 和 Checkbox。单独使用时，只需要一个 Checkbox。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690095998329-dbe99efb-cdb3-4bcc-90ce-00f47910ed34.png#averageHue=%23f0f0f0&clientId=uc86a07f8-db7f-4&from=paste&height=196&id=u74f09ac9&originHeight=520&originWidth=1058&originalType=binary&ratio=2&rotation=0&showTitle=false&size=158690&status=done&style=none&taskId=ud21cf3c3-7b0d-4373-9ad8-7290d44693e&title=&width=398)<br />独立的 Checkbox 组件需要绑定一个布尔值：
```vue
<template>
  <i-checkbox v-model="single">单独选项</i-checkbox>
</template>

<script>
  export default {
    data () {
      return {
        single: false
      }
    }
  }
</script>
```
组合使用结构如下：
```vue
<template>
  <i-checkbox-group v-model="multiple">
    <i-checkbox label="option1">选项 1</i-checkbox>
    <i-checkbox label="option2">选项 2</i-checkbox>
    <i-checkbox label="option3">选项 3</i-checkbox>
    <i-checkbox label="option4">选项 4</i-checkbox>
  </i-checkbox-group>
</template>

<script>
  export default {
    data () {
      return {
        multiple: ['option1', 'option3']
      }
    }
  }
</script>
```
v-model 用在了 CheckboxGroup 上，绑定的值为一个数组，数组的值就是内部 Checkbox 绑定的 label。<br />我们分别来开发这两种使用方式。

## 单独使用的 Checkbox
Checkbox 组件上直接使用 v-model 来双向绑定数据，那必不可少的一个 prop 就是 value，还有 event input。<br />理论上，我们只需要给 value 设置为布尔值来代表选中与否即可，但是实际数据库中并不直接保存 true / false，而是 1 / 0 或其它字符串。<br />我们可以再设计两个 props：trueValue 和 falseValue，它们允许用户指定 value 用什么值来判断是否选中。<br />除此之外，还需要一个 disabled 属性来表示是否禁用。<br />自定义事件除了 input ，还需要个 on-change，当选中 / 取消选中时触发，用于通知父级状态发生了变化。<br />slot 使用默认插槽，显示旁边辅助提醒文本。<br />新建两个文件 checkbox.vue 和 checkbox-group.vue。我们先来看 Checkbox：
```vue
<!-- checkbox.vue -->
<template>
  <label>
    <span>
      <input
             type="checkbox"
             :disabled="disabled"
             :checked="currentValue"
             @change="change">
    </span>
    <slot></slot>
  </label>
</template>

<script>
  export default {
    name: 'iCheckbox',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number, Boolean],
        default: false
      },
      trueValue: {
        type: [String, Number, Boolean],
        default: true
      },
      falseValue: {
        type: [String, Number, Boolean],
        default: false
      }
    },
    data () {
      return {
        currentValue: this.value
      };
    },
    methods: {
      change (event) {
        if (this.disabled) {
          return false;
        }

        const checked = event.target.checked;
        this.currentValue = checked;

        const value = checked ? this.trueValue : this.falseValue;
        this.$emit('input', value);
        this.$emit('on-change', value);
      }
    }
  }
</script>
```
我们定义 currentValue 复制 v-model 的 value，这样就可以随意修改了。这是自定义组件使用 v-model 的“惯用伎俩”。<br />有几个关键点说明下：

- 没有使用 html + css 模拟样式，使用 input 元素，这样可以使用浏览器默认的行为和快捷键。
- `<input>`、`<slot>` 都是包裹在一个 `<label>` 元素内的，这样当点击 `<slot>` 里的文字时，`<input>` 选框也会被触发
- currentValue 仍然是布尔值（true / false），这是组件 Checkbox 自己使用来选中取消的。而 value 可以是 String、Number 或 Boolean，这取决于 trueValue 和 falseValue 的属性。

现在实现的 v-model，通过点击 `<input>` 选择，会通知使用者，而使用者修改 value 的 prop，Checkbox 是没有做响应的，继续补充代码：
```vue
<!-- checkbox.vue，部分代码省略 -->
<script>
  export default {
    watch: {
      value (val) {
        if (val === this.trueValue || val === this.falseValue) {
          this.updateModel();
        } else {
          throw 'Value should be trueValue or falseValue.';
        }
      }
    },
    methods: {
      updateModel () {
        this.currentValue = this.value === this.trueValue;
      }
    }
  }
</script>
```
使用用 if 条件判断父级修改的值是否符合 trueValue / falseValue 再进行比较设置。<br />Checkbox 也是一个基础的表单类组件，它完全可以集成到 Form 里，所以，我们使用 Emitter 在 change 事件触发时，向 Form 派发一个事件：
```vue
<!-- checkbox.vue，部分代码省略 -->
<script>
  import Emitter from '../../mixins/emitter.js';

  export default {
    mixins: [ Emitter ],
    methods: {
      change (event) {
        // ... 
        this.$emit('input', value);
        this.$emit('on-change', value);
        this.dispatch('iFormItem', 'on-form-change', value);
      }
    },
  }
</script>
```
至此，Checkbox 已经可以单独使用了，并支持 Form 的数据校验。

## 组合使用的 CheckboxGroup
CheckboxGroup 的 API 很简单：

- props：value，与 Checkbox 的类似，用于 v-model 双向绑定数据，格式为数组；
- events：input、on-change，同 Checkbox；
- slots：默认，用于放置 Checkbox。

我们首先要判断父组件是否有 CheckboxGroup：
```vue
<!-- checkbox.vue，部分代码省略 -->
<template>
  <label>
    <span>
      <input
             v-if="group"
             type="checkbox"
             :disabled="disabled"
             :value="label"
             v-model="model"
             @change="change">
      <input
             v-else
             type="checkbox"
             :disabled="disabled"
             :checked="currentValue"
             @change="change">
    </span>
    <slot></slot>
  </label>
</template>

<script>
  import { findComponentUpward } from '../../utils/assist.js';

  export default {
    name: 'iCheckbox',
    props: {
      label: {
        type: [String, Number, Boolean]
      }
    },
    data () {
      return {
        model: [],
        group: false,
        parent: null
      };
    },
    mounted () {
      this.parent = findComponentUpward(this, 'iCheckboxGroup');

      if (this.parent) {
        this.group = true;
      }

      if (this.group) {
        this.parent.updateModel(true);
      } else {
        this.updateModel();
      }
    },
  }
</script>
```
在 mounted 时，通过 findComponentUpward 方法，来判断父级是否有 CheckboxGroup 组件，如果有，就将 group 置为 true，并触发 CheckboxGroup 的 updateModel 方法，下文会说。<br />在 template 里，我们又写了一个 `<input>` 来区分是否是 group 模式<br />在组合模式下，Checkbox 选中，就不用对 Form 派发事件了，应该向 CheckboxGroup 中派发，所以对 Checkbox 做最后的修改：
```vue
<!-- checkbox.vue，部分代码省略 -->
<script>
  export default {
    methods: {
      change (event) {
        if (this.disabled) {
          return false;
        }

        const checked = event.target.checked;
        this.currentValue = checked;

        const value = checked ? this.trueValue : this.falseValue;
        this.$emit('input', value);

        if (this.group) {
          this.parent.change(this.model);
        } else {
          this.$emit('on-change', value);
          this.dispatch('iFormItem', 'on-form-change', value);
        }
      },
      updateModel () {
        this.currentValue = this.value === this.trueValue;
      },
    },
  }
</script>
```
剩余的工作，就是完成 checkbox-gourp.vue 文件：
```vue
<!-- checkbox-group.vue -->
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import { findComponentsDownward } from '../../utils/assist.js';
  import Emitter from '../../mixins/emitter.js';

  export default {
    name: 'iCheckboxGroup',
    mixins: [ Emitter ],
    props: {
      value: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data () {
      return {
        currentValue: this.value,
        childrens: []
      };
    },
    methods: {
      updateModel (update) {
        this.childrens = findComponentsDownward(this, 'iCheckbox');
        if (this.childrens) {
          const { value } = this;
          this.childrens.forEach(child => {
            child.model = value;

            if (update) {
              child.currentValue = value.indexOf(child.label) >= 0;
              child.group = true;
            }
          });
        }
      },
      change (data) {
        this.currentValue = data;
        this.$emit('input', data);
        this.$emit('on-change', data);
        this.dispatch('iFormItem', 'on-form-change', data);
      }
    },
    mounted () {
      this.updateModel(true);
    },
    watch: {
      value () {
        this.updateModel(true);
      }
    }
  };
</script>
```
updateModel 方法。一共有 3 个地方调用，其中两个是 CheckboxGroup 的 mounted 初始化和 watch 监听的 value 变化时调用。另一个是在 Checkbox 里的 mounted 初始化时调用。<br />这个方法的作用就是在 CheckboxGroup 里通过 findComponentsDownward 方法找到所有的 Checkbox，然后把 CheckboxGroup 的 value 赋值给 Checkbox 的 model，并根据 Checkbox 的 label，设置一次当前 Checkbox 的选中状态。<br />这样无论是由内而外选择，或由外向内修改数据，都是双向绑定的，而且支持动态增加 Checkbox 的数量。

