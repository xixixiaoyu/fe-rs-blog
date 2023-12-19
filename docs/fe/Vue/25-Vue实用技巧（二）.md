## 1.props限制以及透传属性和插槽

props自定义限制

```js
props: {
    size: {
        // 自定义验证函数
        validator: (val) => {
            return ["small", "medium", "large"].includes(val);
        },
    }
}
```

这个验证函数接受一个实际传入的 `prop`值，验证并返回 `true` 或 `false`

下面将要说的是透传属性和插槽，此技巧在二次封装别人组件的时候非常有用

透传属性

```html
<!-- 此组件为二次封装的中间组件 -->
<template>
  <MyComponent v-bind="$attrs"/>
</template>

<script> 
  export default { 
    // $attrs 中的所有属性不自动继承到该组件的根元素上
    inheritAttrs: false,
  }
</script>
```

- `$attrs`包含所有透传过来的对象，除显式声明接受的`props`、`emits`、`slots`
- 如不希望透传下去某些属性，可使用`useAttrs()`

```js
const attrs = useAttrs();
const filteredAttrs = computed(() => {
  return { ...attrs, style: undefined };
});
```

`$attrs`还可与`$listeners`搭配使用，`$listeners`包含了父组件传递的事件（不包含`.native`修饰器）,它可以通过`v-on="$listeners"`转发传入内部组件，进行对事件的监听处理

```html
<MyComponent v-bind="$attrs" v-on="$listeners" />
```

注意： `$listeners`组件实例属性在`Vue3.x`被取消，其监听都整合到了`$attrs`属性上



我们同样可以使用`v-bind`透传自身所有`props`到子组件，而不必一个个传递

```html
<template>
  <childComponent v-bind="$props" />
</template>
```

代替：

```html
<template>
  <childComponent :prop1="prop1" :prop2="prop2" :prop="prop3" :prop4="prop4" ... />
</template>
```





单个slot透传

```html
<Home>
    <template #about>
		<!-- 在父组件使用<template #about>....</template>的template里实际插槽内容会被替换掉该组件的name为about的slot标签并继续向Home组件传递插槽-->
        <slot name="about" />
    </template>
</Home>
```

多个slot透传

```html
<template #[slotName] v-for="(slot, slotName) in $slots" >
    <slot :name="slotName"/>
</template>
```

多个slot透传作用域插槽

```html
<template #[slotName]="slotProps" v-for="(slot, slotName) in $slots" >
    <slot :name="slotName" v-bind="slotProps"/>
</template>
<!-- Vue2则需要将v-for里面循环的$slots改成$scopedSlots -->
```





## 2.require.context()和import.meta.glob()批量引入文件

- `webpack`统一导入相同路径下的多个组件的方法

```js
const path = require("path");
// 参数一：说明需要检索的目录，参数二：是否检索子目录，参数三：：指定匹配文件名的正则表达式
const files = require.context("./components", false, /\.vue$/);
const modules = {};
files.keys().forEach((key) => {
	const name = path.basename(key, ".vue");
	modules[name] = files(key).default || files(key);
});
```

- `Vite` 支持使用特殊的 `import.meta.glob` 函数从文件系统导入多个模块：

```js
const modules = import.meta.glob('./src/*.js');

// vite 转译上面后生成的代码
const modules = {
  './src/foo.js': () => import('./src/foo.js'),
  './src/bar.js': () => import('./src/bar.js')
}
```



## 3.有条件的渲染slot

- 组件都有一个特殊的`$slots`对象，包含所有的插槽对象，结构如下：

```js
const $slots = {
	"default": [{...}],
	"slotA": [{...}],
	"slotB": [{...}]
}
```

我们可以使用`v-if`有条件的渲染`slot`更加合理，并且我们封装通用组件的时候最好预留个`slot`更好扩展

```html
<template>
  <div>
    <div v-if="$slots.default">
      <slot />
    </div>
    <div v-if="$slots.slotA">
      <slot name="slotA"/>
    </div>
  </div>
</template>
```





## 4.检测点击是否发生在元素内部

```js
window.addEventListener('mousedown', e => {
  // 获取被点击的元素
  const clickedEl = e.target;

  // `targetEl` 为检测的元素
  if (targetEl.contains(clickedEl)) {
    // 在"targetEl"内部点击
  } else {
    // 在"targetEl"之外点击
  }
});
```



## 5.动态组件和递归组件

动态组件：tab切换的时候可使用动态组件动态加载并缓存提供动效

```html
<transition>
  <keep-alive>
    <!-- :is值必须是全局或者局部注册过的组件 -->
    <component :is="currentTab"></component>
  </keep-alive>
</transition>
```



递归组件：模板里面自己自己，注意需要设置条件退出，不然会无限渲染，适合嵌套菜单，树形控件等

```vue
<div v-if="item.children">
  {{ tree.label }}
  <!-- 递归调用自身 -->
  <tree v-for="(item, index) in tree.children" :tree="item" :key="index"></tree>
</div>
<script>
  export default {
    // 定义name，以使组件内部递归调用
    name: 'tree',
    // 接收外部传入的值
    props: {
      tree: {
        type:Array,
        default: () => []
      }
    }
  }
</script>
```





## 6.nextTick

- 在下次 `DOM` 更新循环结束之后执行延迟回调
- 我们可以在修改数据后立即使用此方法获取最新的`DOM`

```js
mounted(){
  this.$nextTick(() => {
    this.$refs.inputs.focus(); //通过 $refs 获取dom 并绑定 focus 方法
  })
}
```





## 7.简化 :class 和 v-if 与逻辑

```vue
<div :class="
			$route.name === 'Home' ||
			$route.name === 'Gallery' ||
			$route.name === 'Profile'
				? 'classOnlyOnThesePages'
				: ''
		"
	></div>
```

直接最佳写法如下：

```vue
<div :class="{
			classOnlyOnThesePages: ['Home', 'Gallery', 'Profile'].includes(
				$route.name
			),
		}"
	></div>
```



## 8.全局重用方法

- 遇到全局可重用的工具方法，例如

```js
class Utils {
	// 复制一段文字到剪切板
	copyToClipboard(text) {
		let copyText = document.createElement("input");
		document.body.appendChild(copyText);
		copyText.value = text;
		copyText.select();
		document.execCommand("copy");
		document.body.removeChild(copyText);
	}
}

export default new Utils();
```

我们可以抽离出来放在整个应用程序都能访问的地方

Vue2：

```js
import Utils from "./utils/utils.js";
// 设置全局方法
Vue.prototype.$utils = Utils;
```

Vue3：

```js
import Utils from "./utils/utils.js"; 
const app = createApp(App);
// 设置全局方法
app.config.globalProperties.$utils = Utils; 
app.mount("#app");
```

接下来任何地方都能愉快的访问啦

```js
this.$utils.copyToClipboard(text);

// Vue3 setup
const { proxy } = getCurrentInstance();
proxy.$utils.copyToClipboard(text);
```

这种形式看起来太麻烦了，我们甚至可以将其属性和方法挂载到`window`对象上，这样全局直接也可以访问



## 9.局部组件刷新

- 使用 `v-if` 方法来控制 `router-view` 的显示隐藏

```vue
<template>
	<div id="app">
		<router-view v-if="isActive" />
	</div>
</template>

<script>
export default {
	name: "App",
  // provider给下层组件重刷的方法
	provide() {
		return {
			reload: this.reload,
		};
	},
	data: {
      isActive: true,
	},
	method: {
		reload() {
			this.isActive = false;
			this.$nextTick(() => {
				this.isActive = true;
			});
		},
	},
};
</script>
```

需要的页面可注入该方法使用

```vue
<script>
export default {
	inject: ["reload"],
	methods: {
		refresh() {
			this.reload();
		},
	},
};
</script>
```

或者直接使用`v-if`操作该组件

````vue
<template>
	<div v-if="isShow"></div>
</template>
<script>
export default {
	data() {
		return {
			isShow: true,
		};
	},
	method: {
		refresh() {
			this.isShow = false;
			this.$nextTick(() => {
				this.isShow = true;
			});
		},
	},
};
</script>
````

或者借助`Vue`的`diff`算法，我们给元素设置一个唯一的`key`值然后去改变它

```vue
<template>
	<div :key="keyValue"></div>
</template>
<script>
export default {
	data() {
		return {
			keyValue: 0,
		};
	},
	method: {
		refresh() {
			this.keyValue++;
		},
	},
};
</script>
```





## 10.组件封装原则

Vue组件基本由`props`、`event`、`slot`三部分构成，开发组件和阅读组件的时候一定要好好揣摩

### 属性 prop

- prop 定义了这个组件有哪些可配置的属性，组件核心功能也是由它确定
- 组件里定义的 props，都是单向数据流，即只能通过父级修改，组件自身不能修改传入的props值，传递的`props`仅仅做展示，如需修改，则应该重新初始化一份全新的响应式数据并将`props`深拷贝后作为初始值
- 写通用组件 props 最好使用对象写法，可设置更多，例如默认值、自定义校验

```html
<template>
  <button :class="'i-button-size' + size" :disabled="disabled"></button>
</template>
<script>
  export default {
    props: {
      size: {
        validator (value) {
          // 判断参数是否是其中之一
          return  ['small', 'large', 'default'].includes(value);
        },
        default: 'default'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
```

上面组件定义了尺寸size和禁用disabled，size使用了自定义验证，即值必须是**small、large、default** 中的一个

在使用的时候

```html
<yun-button size="large"></yun-button>
<yun-button disabled></yun-button>
```

在使用组件时，也可以传入一些标准的 html 特性，比如 **id**、**class**

这些属性都会默认继承在当前组件的根元素上，如不希望，在组件选项里配置 inheritAttrs: false 可禁用



### 插槽 slot

- `slot`可以给组件动态插入一些内容或组件，是实现高阶组件的重要途径

如果需要给上面的button组件添加文字内容，就需要使用到插槽slot了

```html
<template>
  <button :class="'i-button-size' + size" :disabled="disabled">
	 <!-- 具名插槽 -->
  	<slot name="icon"></slot>
     <!-- 默认插槽，不传默认内容为按钮 -->
    <slot>按钮</slot>
  </button>
</template>
```



使用的时候就可以传递插槽

```html
<yun-button>
  <i-icon slot="icon" type="checkmark"></i-icon>
  按钮 1
</yun-button>
<!-- 内容传递给默认插槽 -->
<yun-button>按钮 2</yun-button>
```

这样父级组件标签里定义的内容就会出现在对应的插槽里面



### 自定义事件 event

- `event`用于子组件向父组件传递消息

我们可以给上面按钮添加点击事件

```html
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>
<script>
  export default {
    methods: {
      handleClick (event) {
        this.$emit('on-click', event);
      }
    }
  }
</script>
```

通过 this.$emit 触发自定义事件 on-click ，在父级通过 @on-click 来监听

```html
<yun-button @on-click="handleClick"></yun-button>
```

上面的click是在组件内部button定义，我们可以直接在父级绑定原生的click事件

```html
<yun-button @click.native="handleClick"></yun-button>
```

vue2如果不写 .native 修饰符，那上面的 @click 就是自定义事件，而非原生事件

vue3则移除了 .native 修饰符，默认如果在组件选项 emits 里定义的事件就是自定义事件





## 11.错误（警告）处理

为 `Vue` 中的错误和警告提供自定义处理程序

```js
// Vue 3
const app = createApp(App);
app.config.errorHandler = (err) => {
    console.error(err);
};
// Vue 2
Vue.config.errorHandler = (err) => {
    console.error(err);
};
```





## 12.使用template标签分组

`template` 标签可以在模板内的任何地方使用，不参与实际标签渲染，可减少嵌套层级，简化代码逻辑

```vue
<template>
    <div class="card">
        <h3>
            {{ title }}
        </h3>
        <h4 v-if="isShow" class="card-desc">
            {{ description }}
        </h4>
        <div v-if="isShow">
            <slot />
        </div>
        <Home v-if="isShow" />
    </div>
</template>
```

上面代码`v-if`逻辑分组后：

```vue
<template>
    <div class="card">
        <h3>
            {{ title }}
        </h3>
        <template v-if="isShow">
            <h4 class="card-desc">
                {{ description }}
            </h4>
            <div>
                <slot />
            </div>
            <Home />
        </template>
    </div>
</template>
```



## 13.在 v-for 中解构

在模板中使用 `v-for` 遍历输出数据，可以使用解构语法

```html
<div
			v-for="{ id, user } in [
				{ id: 1, user: 'yun' },
				{ id: 2, user: 'mu' },
			]"
			:key="id"
		>
			{{ user }}
</div>
```





## 14.全局和局部style混合及样式穿透

```vue
<style>
  /* 全局有效 */
  .content p {
    font-size: 12px;
  }
</style>
  
<style scoped>
  /* 只在该组件内有效 */
  .content {
    background: green;
  }
</style>
```

有时候我们想跳出`scoped`这个限定作用域，更改子组件的样式但不会影响全局样式，我们就可以使用深度选择器来完成

```vue
<style scoped>
:deep(.ant-card-head-title){
    background: green;
  }
</style>
```

上面代码会被解析为

```css
[data-v-e44d851a] .ant-card-head-title {
    background: green;
}
```

注意：`vue`版本和预处理器不同，深度选择器的写法也会不同，灵活使用即可



## 15.借用props类型

当我们当前组件使用到了`Card`组件

```html
<Card :type="Mytype" :color="Mycolor">
```

其中的`Mytype`和`Mycolor`是我们通过`props`接收而来的

```js
import Card from './Card.vue';
export default {
  components: { Card },
  props: {
    Mytype: {
      type: String,
      required: true,
    },
    Mycolor: {
      type: String,
      default: "green",
    }
  },
};
```

我们可以简写为

```js
import Card from './Card.vue';

const cardProps = {};

Object.entries(Card.props).forEach(([key, value]) => {
	cardProps[`My${key}`] = value;
});

export default {
  components: { Card },
  props: {
  	...cardProps
  },
};
```





## 16.$on("hook:")简化代码

- 通用事件监听需要在某些时机移除，这样有助于避免内存泄漏和事件冲突
- 如果在 `created` 或 `mounted` 的钩子绑定事件，则需要在`beforeDestroy` 钩子中移除

```js
mounted () {
    window.addEventListener('resize', this.resizeHandler);
},
beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler);
}
```

使用可以 `$on('hook:')`在一个生命周期方法中定义和移除事件

```js
mounted () {
  window.addEventListener('resize', this.resizeHandler);
  this.$on("hook:beforeDestroy", () => {
    window.removeEventListener('resize', this.resizeHandler);
  })
}
```

这样的特性还可以用来在父组件监听子组件的生命周期钩子

```js
<child-comp @hook:mounted="someFunction" />
```





## 17.动态指令参数

- 动态改变组件的指令参数
- 假如有一个按钮组件，某些情况下监听单击事件，某些情况下监听双击事件

```html
<template>
  <yunButton @[someEvent]="handleSomeEvent()" />
</template>

<script>
  data(){
    return{
      someEvent: someCondition ? "click" : "dbclick"
    }
  },
    methods: {
      handleSomeEvent(){
        // handle some event
      }
    }  
</script>
```





## 18.重用相同路由的组件

- 有时候多个路由同时对应一个Vue组件
- Vue出于性能考虑，不会重复卸载挂载，而是会重用

```js
const routes = [
  {
    path: "/home",
    component: MyComponent
  },
  {
    path: "/about",
    component: MyComponent
  },
];
```

如果仍然希望重新渲染这些组件，则可以通过在 `router-view` 组件中提供 `:key` 属性来实现

```html
<template>
    <router-view :key="$route.path"></router-view>
</template>
```







