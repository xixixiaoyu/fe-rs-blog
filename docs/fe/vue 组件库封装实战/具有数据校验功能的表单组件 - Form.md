表单类组件在项目中会大量使用，比如输入框（Input）、单选（Radio）、多选（Checkbox）、下拉选择器（Select）等。<br />Form 组件的构成如下：<br />外层的 Form 表单域组件，一组表单控件只有一个 Form，它内部包含了多个 FormItem 组件，每一个表单控件都被一个 FormItem 包裹。<br />基本结构如下：
```html
<i-form>
  <i-form-item>
    <i-input v-model="form.name"></i-input>
  </i-form-item>
  <i-form-item>
    <i-input v-model="form.mail"></i-input>
  </i-form-item>
</i-form>
```
Form 要用到数据校验，并在对应的 FormItem 中给出校验失败的提示。<br />校验可以使用开源库：[async-validator](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fyiminghe%2Fasync-validator)。主流组件库基本都是基于它。<br />使用它很简单，我们写一个校验规则：
```javascript
[
  { required: true, message: '邮箱不能为空', trigger: 'blur' },
  { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
]
```
如果第一条满足要求，再进行第二条的验证。

## 接口设计
我们从 props、slots、events 三部分入手进行设计。<br />Form 和 FormItem 两个组件主要做数据校验，用不到 events。<br />Form 的 slot 就是一系列的 FormItem，FormItem 的 slot 就是具体的表单控件。<br />主要设计的就是 props 了。<br />在 Form 组件中，定义两个 props：

- model：表单控件绑定的数据对象，在校验或重置时会访问该数据对象下对应的表单数据，类型为 Object。
- rules：表单验证规则，类型为 Object。

在 FormItem 组件中，也定义两个 props：

- label：单个表单组件的标签文本，类似原生的 <label> 元素，类型为 String。
- prop：对应表单域 Form 组件 model 里的字段，用于在校验或重置时访问表单组件绑定的数据，类型为 String。

使用方式如下：
```vue
<template>
  <div>
    <i-form :model="formValidate" :rules="ruleValidate">
      <i-form-item label="用户名" prop="name">
        <i-input v-model="formValidate.name"></i-input>
      </i-form-item>
      <i-form-item label="邮箱" prop="mail">
        <i-input v-model="formValidate.mail"></i-input>
      </i-form-item>
    </i-form>
  </div>
</template>

<script>
  import iForm from '../components/form/form.vue';
  import iFormItem from '../components/form/form-item.vue';
  import iInput from '../components/input/input.vue';

  export default {
    components: { iForm, iFormItem, iInput },
    data () {
      return {
        formValidate: {
          name: '',
          mail: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          mail: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
        }
      }
    }
  }
</script>
```
Form 和 FormItem 的代码如下：
```vue
<!-- form.vue -->
<template>
  <form>
    <slot></slot>
  </form>
</template>

<script>
  export default {
    name: 'iForm',
    props: {
      model: {
        type: Object
      },
      rules: {
        type: Object
      }
    }
  }
</script>
```
```vue
<!-- form-item.vue -->
<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'iFormItem',
    props: {
      label: {
        type: String,
        default: ''
      },
      prop: {
        type: String
      }
    }
  }
</script>
```

## 在 Form 中缓存 FormItem 实例
Form 组件的核心功能是数据校验，一个 Form 中包含了多个 FormItem，当点击提交按钮时，要逐一对每个 FormItem 内的表单组件校验。<br />校验是由使用者发起，并通过 Form 来调用每一个 FormItem 的验证方法，再将校验结果汇总后，通过 Form 返回出去<br />![](https://cdn.nlark.com/yuque/0/2023/jpeg/21596389/1690092823816-2ec449bc-5b40-4beb-9374-46401b1d2119.jpeg)<br />Form 中需要逐一调用 FormItem 的验证方法，但 Form 和 FormItem 是独立的。<br />我们需要预先将 FormItem 的每个实例缓存在 Form 中。<br />具体方法是当每个 FormItem 渲染时，将其自身（this）作为参数通过 dispatch 派发到 Form 组件中，然后通过一个数组缓存起来。<br />当 FormItem 销毁时，将其从 Form 缓存的数组中移除
```javascript
// form-item.vue，部分代码省略

import Emitter from '../../mixins/emitter.js';

export default {
  name: 'iFormItem',
  mixins: [ Emitter ],
  // 组件渲染时，将实例缓存在 Form 中
  mounted () {
    // 如果没有传入 prop，则无需校验，也就无需缓存
    if (this.prop) {
      this.dispatch('iForm', 'on-form-item-add', this);
    }
  },
  // 组件销毁前，将实例从 Form 的缓存中移除
  beforeDestroy () {
    this.dispatch('iForm', 'on-form-item-remove', this);
  }
}
```
注意：Vue.js 的组件渲染顺序是由内而外的，所以 FormItem 要先于 Form 渲染。<br />所以此时我们在 FormItem 的 mounted 向 Form 派发了事件，因为 Form 在最外层，我们在其 created 内可监听到自定义事件：
```javascript
// form.vue，部分代码省略
export default {
  name: 'iForm',
  data () {
    return {
      fields: []
    };
  },
  created () {
    this.$on('on-form-item-add', (field) => {
      if (field) this.fields.push(field);
    });
    this.$on('on-form-item-remove', (field) => {
      if (field.prop) this.fields.splice(this.fields.indexOf(field), 1);
    });
  }
}
```
定义的数据 fields 就是用来缓存所有 FormItem 实例的。

## 触发校验
Form 支持两种事件来触发校验：

- **blur**：失去焦点时触发，常见的有输入框失去焦点时触发校验；
- **change**：实时输入时触发或选择时触发，常见的有输入框实时输入时触发校验、下拉选择器选择项目时触发校验等。

我们先来编写一个简单的输入框组件 i-input。创建 input.vue 文件：
```vue
<!-- input.vue -->
<template>
  <input
         type="text"
         :value="currentValue"
         @input="handleInput"
         @blur="handleBlur"
         />
</template>

<script>
  import Emitter from '../../mixins/emitter.js';

  export default {
    name: 'iInput',
    mixins: [ Emitter ],
    props: {
      value: {
        type: String,
        default: ''
      },
    },
    data () {
      return {
        currentValue: this.value
      }
    },
    watch: {
      value (val) {
        this.currentValue = val;
      }
    },
    methods: {
      handleInput (event) {
        const value = event.target.value;
        this.currentValue = value;
        this.$emit('input', value);
        this.dispatch('iFormItem', 'on-form-change', value);
      },
      handleBlur () {
        this.dispatch('iFormItem', 'on-form-blur', this.currentValue);
      }
    }
  }
</script>
```
输入和失焦都会向上级的 FormItem 组件派发自定义事件。<br />接下来我们在 FormItem 中监听来自 Input 组件派发的自定义事件：
```javascript
// form-item.vue，部分代码省略
export default {
  methods: {
    setRules () {
      this.$on('on-form-blur', this.onFieldBlur);
      this.$on('on-form-change', this.onFieldChange);
    },
  },
  mounted () {
    if (this.prop) {
      this.dispatch('iForm', 'on-form-item-add', this);
      this.setRules();
    }
  }
}
```
当 onFieldBlur 或 onFieldChange 函数触发时，就意味着 FormItem 要对当前的数据进行一次校验。<br />通过 Form 定义的 modal 和 FormItem 定义的 prop 可拿到最终校验值。<br />我们首先得拿到 Form 中 model 里的数据，可以在 Form 中，把整个实例（this）向下提供，并在 FormItem 中注入：
```javascript
// form.vue，部分代码省略
export default {
  provide() {
    return {
      form : this
    };
  }
}
```
```javascript
// form-item.vue，部分代码省略
export default {
  inject: ['form']
}
```
准备好这些，接着就是最核心的校验功能了：
```javascript
// form-item.vue，部分代码省略
import AsyncValidator from 'async-validator';

export default {
  inject: ['form'],
  props: {
    prop: {
      type: String
    },
  },
  data () {
    return {
      validateState: '',  // 校验状态
      validateMessage: '',  // 校验不通过时的提示信息
    }
  },
  computed: {
    // 从 Form 的 model 中动态得到当前表单组件的数据
    fieldValue () {
      return this.form.model[this.prop];
    }
  },
  methods: {
    // 从 Form 的 rules 属性中，获取当前 FormItem 的校验规则
    getRules () {
      let formRules = this.form.rules;

      formRules = formRules ? formRules[this.prop] : [];

      return [].concat(formRules || []);
    },
    // 只支持 blur 和 change，所以过滤出符合要求的 rule 规则
    getFilteredRule (trigger) {
      const rules = this.getRules();
      return rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1);
    },
    /**
     * 校验数据
     * @param trigger 校验类型
     * @param callback 回调函数
     */
    validate(trigger, callback = function () {}) {
      let rules = this.getFilteredRule(trigger);

      if (!rules || rules.length === 0) {
        return true;
      }

      // 设置状态为校验中
      this.validateState = 'validating';

      // 以下为 async-validator 库的调用方法
      let descriptor = {};
      descriptor[this.prop] = rules;

      const validator = new AsyncValidator(descriptor);
      let model = {};

      model[this.prop] = this.fieldValue;

      validator.validate(model, { firstFields: true }, errors => {
        this.validateState = !errors ? 'success' : 'error';
        this.validateMessage = errors ? errors[0].message : '';

        callback(this.validateMessage);
      });
    },
    onFieldBlur() {
      this.validate('blur');
    },
    onFieldChange() {
      this.validate('change');
    }
  }
}
```
在 FormItem 的 validate() 方法中，最终做了两件事：

1. 设置了当前的校验状态 validateState 和校验不通过提示信息 validateMessage（通过值为空）；
2. 将 validateMessage 通过回调 callback 传递给调用者，这里的调用者是 onFieldBlur 和 onFieldChange。这里没啥用，后面 Form 组件有用。

除了校验，还可以对当前数据进行重置。我们可以预先缓存一份初始值。<br />同时我们将校验信息也显示在模板中，并加一些样式。相关代码如下：
```vue
<!-- form-item.vue，部分代码省略 -->
<template>
  <div>
    <label v-if="label" :class="{ 'i-form-item-label-required': isRequired }">{{ label }}</label>
    <div>
      <slot></slot>
      <div v-if="validateState === 'error'" class="i-form-item-message">{{ validateMessage }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: ''
      },
      prop: {
        type: String
      },
    },
    data () {
      return {
        isRequired: false,  // 是否为必填
        validateState: '',  // 校验状态
        validateMessage: '',  // 校验不通过时的提示信息
      }
    },
    computed: {
    	// 从 Form 的 model 中动态得到当前表单组件的数据
      fieldValue () {
        return this.form.model[this.prop];
      }
    },
    mounted () {
      // 如果没有传入 prop，则无需校验，也就无需缓存
      if (this.prop) {
        this.dispatch('iForm', 'on-form-item-add', this);

        // 设置初始值，以便在重置时恢复默认值
        this.initialValue = this.fieldValue;

        this.setRules();
      }
    },
    methods: {
      setRules () {
        let rules = this.getRules();
        if (rules.length) {
          rules.every((rule) => {
            // 如果当前校验规则中有必填项，则标记出来
            this.isRequired = rule.required;
          });
        }

        this.$on('on-form-blur', this.onFieldBlur);
        this.$on('on-form-change', this.onFieldChange);
      },
      // 从 Form 的 rules 属性中，获取当前 FormItem 的校验规则
      getRules () {
        let formRules = this.form.rules;

        formRules = formRules ? formRules[this.prop] : [];

        return [].concat(formRules || []);
      },
      // 重置数据
      resetField () {
        this.validateState = '';
        this.validateMessage = '';

        this.form.model[this.prop] = this.initialValue;
      },
    }
  }
</script>
<style>
  .i-form-item-label-required:before {
    content: '*';
    color: red;
  }
  .i-form-item-message {
    color: red;
  }
</style>
```
FormItem 代码已经完成，不过它只具有单独校验的功能。<br />如果要实现一个表单域里的所有组件一次性全部校验和重置，要在 Form 中完成。<br />Form 组件中，预先缓存了全部的 FormItem 实例，只需要逐一调用缓存的 FormItem 实例中的 validate 或 resetField 方法。相关代码如下：
```javascript
// form.vue，部分代码省略
export default {
  data () {
    return {
      fields: []
    };
  },
  methods: {
    // 公开方法：全部重置数据
    resetFields() {
      this.fields.forEach(field => {
        field.resetField();
      });
    },
    // 公开方法：全部校验数据，支持 Promise
    validate(callback) {
      return new Promise(resolve => {
        let valid = true;
        let count = 0;
        this.fields.forEach(field => {
          field.validate('', errors => {
            if (errors) {
              valid = false;
            }
            if (++count === this.fields.length) {
              // 全部完成
              resolve(valid);
              if (typeof callback === 'function') {
                callback(valid);
              }
            }
          });
        });
      });
    }
  },
}
```
resetFields 就是通过循环逐一调用 FormItem 的 resetField 方法来重置数据。<br />validate 支持两种使用方法，一种是普通的回调，比如：
```vue
<template>
  <div>
    <i-form ref="form"></i-form>
    <button @click="handleSubmit">提交</button>
  </div>
</template>

<script>
  export default {
    methods: {
      handleSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            window.alert('提交成功');
          } else {
            window.alert('表单校验失败');
          }
        })
      }
    }
  }
</script>
```
同时也支持 Promise，例如：
```vue
handleSubmit () {
  const validate = this.$refs.form.validate();
  
  validate.then((valid) => {
    if (valid) {
      window.alert('提交成功');
    } else {
      window.alert('表单校验失败');
    }
  })
}
```
这里没有使用 catch 捕获，因为没有调用 reject()，不过这个支持也很简单，自己实现下吧。

完整的测试用例如下：
```vue
<template>
  <div>
    <h3>具有数据校验功能的表单组件——Form</h3>
    <i-form ref="form" :model="formValidate" :rules="ruleValidate">
      <i-form-item label="用户名" prop="name">
        <i-input v-model="formValidate.name"></i-input>
      </i-form-item>
      <i-form-item label="邮箱" prop="mail">
        <i-input v-model="formValidate.mail"></i-input>
      </i-form-item>
    </i-form>
    <button @click="handleSubmit">提交</button>
    <button @click="handleReset">重置</button>
  </div>
</template>

<script>
  import iForm from '../components/form/form.vue';
  import iFormItem from '../components/form/form-item.vue';
  import iInput from '../components/input/input.vue';

  export default {
    components: { iForm, iFormItem, iInput },
    data () {
      return {
        formValidate: {
          name: '',
          mail: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          mail: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            window.alert('提交成功');
          } else {
            window.alert('表单校验失败');
          }
        })
      },
      handleReset () {
        this.$refs.form.resetFields();
      }
    }
  }
</script>
```
完整的示例源码可通过 GitHub 查看：<br />[github.com/icarusion/v…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ficarusion%2Fvue-component-book)
