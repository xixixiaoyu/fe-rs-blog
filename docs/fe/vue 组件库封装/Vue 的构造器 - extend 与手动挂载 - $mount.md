## 使用场景
写 Vue 一般会创建一个根实例，CDN 引入：
```vue
<body>
  <div id="app"></div>
</body>
<script>
  const app = new Vue({
    el: '#app'
  });
</script>
```
Webpack 也类似，一般在入口文件 main.js 里创建：
```javascript
import Vue from 'vue';
import App from './app.vue';

new Vue({
  el: '#app',
  render: h => h(App)
});
```
有了初始化的实例，之后所有的页面，都由 vue-router 帮我们管理。<br />组件的使用有些特点：

1. 所有的内容，都是在 #app 节点内渲染的；
2. 组件的模板，是事先定义好的；
3. 由于组件的特性，注册的组件只能在当前位置渲染。

比如使用一个组件 `<i-date-picker>`，渲染时，这个自定义标签就会被替换为组件的内容，而且在哪写的，就在哪里被替换。<br />所以常规的组件使用方式，只能在规定的地方渲染组件，这在一些特殊场景下就比较局限了，例如：

1. 组件的模板是通过调用接口从服务端获取的，需要动态渲染组件；
2. 实现类似原生 window.alert() 的提示框组件，它的位置是在 `<body>` 下，而非 `<div id="app">`，并且不会通过常规的组件自定义标签的形式使用，而是像 JS 调用函数一样使用。

对于这两种场景，Vue.extend 和 vm.$mount 语法就派上用场了。

## 用法
上文说到，创建一个 Vue 实例时，都会有一个选项 el，来指定实例的根节点，如果不写 el 选项，那组件就处于未挂载状态。<br />Vue.extend 的作用，就是基于 Vue 构造器，创建一个“子类”，它的参数跟 new Vue 的基本一样，注意 data 要是个函数，再配合 $mount ，就可以让组件渲染，并且挂载到任意指定的节点上，比如 body。<br />比如上文的场景，可以这样写：
```javascript
import Vue from 'vue';

const AlertComponent = Vue.extend({
  template: '<div>{{ message }}</div>',
  data () {
    return {
      message: 'Hello, Aresn'
    };
  },
});
```
这一步，我们创建了一个构造器，这个过程就可以解决异步获取 template 模板的问题，下面要手动渲染组件，并把它挂载到 body 下：
```javascript
const component = new AlertComponent().$mount();
```
此时的 component 已经是一个标准的 Vue 组件实例，通过它的 $el 属性挂载它：
```javascript
document.body.appendChild(component.$el);
```
$mount 也有一些快捷的挂载方式，以下两种都是可以的：
```javascript
// 在 $mount 里写参数来指定挂载的节点
new AlertComponent().$mount('#app');
// 不用 $mount，直接在创建实例时指定 el 选项
new AlertComponent({ el: '#app' });
```
除了用 extend 外，也可以直接创建 Vue 实例，并且用一个 Render 函数来渲染一个 .vue 文件：
```javascript
import Vue from 'vue';
import Notification from './notification.vue';

const props = {};  // 这里可以传入一些组件的 props 选项

const Instance = new Vue({
  render (h) {
    return h(Notification, {
      props: props
    });
  }
});

const component = Instance.$mount();
document.body.appendChild(component.$el);
```
操作 Render 的 Notification 实例：
```javascript
const notification = Instance.$children[0];
```
因为 Instance 下只 Render 了 Notification 一个子组件，所以可以用 $children[0] 访问到。<br />注意：，我们是用 $mount 手动渲染的组件，如果要销毁，也要用 $destroy 来手动销毁实例，必要时，也可以用 removeChild 把节点从 DOM 中移除。
