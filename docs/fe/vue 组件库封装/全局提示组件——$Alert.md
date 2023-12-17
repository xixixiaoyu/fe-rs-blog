使用者可能这样使用下：
```vue
<template>
  <div>
    <Alert v-if="show">这是一条提示信息</Alert>
    <button @click="show = true">显示</button>
  </div>
</template>

<script>
  import Alert from '../component/alert.vue';

  export default {
    components: { Alert },
    data () {
      return {
        show: false
      }
    }
  }
</script>
```
这会有几个缺点：

- 每次都得注册组件，将其放到模板上
- 需要多余变量控制显示隐藏
- 不是在 body 下，可能会被其他组件遮挡

我们肯定是需要一个能使用 JavaScript 调用组件的 API。如 `window.**alert**('这是一条提示信息');`

## 1/3 先把组件写好
我们期望最终的 API 是这样的：
```vue
methods: {
  handleShow () {
    this.$Alert({
      content: '这是一条提示信息',
      duration: 3
    })
  }
}
```
this.$Alert 可以在任何位置调用，无需单独引入。该方法接收两个参数：

- content：提示内容；
- duration：持续时间，单位秒，默认 1.5 秒，到时间自动消失。

创建文件 alert.vue：
```vue
<!-- alert.vue -->
<template>
  <div class="alert">
    <div class="alert-main" v-for="item in notices" :key="item.name">
      <div class="alert-content">{{ item.content }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        notices: []
      }
    }
  }
</script>

<style>
  .alert{
    position: fixed;
    width: 100%;
    top: 16px;
    left: 0;
    text-align: center;
    pointer-events: none;
  }
  .alert-content{
    display: inline-block;
    padding: 8px 16px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    margin-bottom: 8px;
  }
</style>
```
用一个数组 notices 来管理每条通知。<br />不同于其他组件，它最终是通过 JS 来调用的，因此组件不用预留 props 和 events 接口。<br />接下来只要给数组 notices 增加数据，这个提示组件就能显示内容了。<br />我们先假设，最终会通过 JS 调用 Alert 的一个方法 add，并将 content 和 duration 传入进来
```vue
<!-- alert.vue，部分代码省略 -->
<script>
  let seed = 0;

  function getUuid() {
    return 'alert_' + (seed++);
  }

  export default {
    data () {
      return {
        notices: []
      }
    },
    methods: {
      add (notice) {
        const name = getUuid();

        let _notice = Object.assign({
          name: name
        }, notice);

        this.notices.push(_notice);

        // 定时移除，单位：秒
        const duration = notice.duration;
        setTimeout(() => {
          this.remove(name);
        }, duration * 1000);
      },
      remove (name) {
        const notices = this.notices;

        for (let i = 0; i < notices.length; i++) {
          if (notices[i].name === name) {
            this.notices.splice(i, 1);
            break;
          }
        }
      }
    }
  }
</script>
```
在 add 方法中，给每一条传进来的提示数据，加了一个不重复的 name 字段来标识。<br />并通过 setTimeout 创建了一个计时器，当达到指定的 duration 持续时间后，调用 remove 方法，将对应 name 的那条提示信息找到，并从数组中移除。<br />基于这个思路，Alert 组件就可以无限扩展，只要在 add 方法中传递更多的参数，就能支持更复杂的组件，比如是否显示手动关闭按钮、确定 / 取消按钮，甚至传入一个 Render 函数都可以。

## 2/3 实例化封装
实例化组件可以使用 Vue.extend 或 new Vue，然后用 $mount 挂载到 body 节点下。<br />新建 notification.js 文件：
```javascript
// notification.js
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
对 alert.vue 添加了一个方法 newInstance。<br />因为 alert.vue 会被 Webpack 的 vue-loader 编译，把 template 编译为 Render 函数，最终就会成为一个 JS 对象，自然可以对它进行扩展。<br />Alert 组件没有任何 props，这里在 Render Alert 组件时，还是给它加了 props，这样做的目的还是为了扩展性，如果要在 Alert 上添加 props 来支持更多特性，是要在这里传入的。<br />const alert = Instance.$children[0]; 的 alert 就是 Render 的 Alert 组件实例。在 newInstance 里，使用闭包暴露了两个方法 add 和 remove。

## 3/3 入口
最后就是调用 notification.js 创建实例，并通过 add 把数据传递过去。<br />创建文件 alert.js：
```javascript
// alert.js
import Notification from './notification.js';

let messageInstance;

function getMessageInstance () {
  messageInstance = messageInstance || Notification.newInstance();
  return messageInstance;
}

function notice({ duration = 1.5, content = '' }) {
  let instance = getMessageInstance();

  instance.add({
    content: content,
    duration: duration
  });
}

export default {
  info (options) {
    return notice(options);
  }
}
```
getMessageInstance 函数用来获取实例，它不会重复创建。只在第一次调用 Notification 的 newInstance 时来创建实例。<br />alert.js 对外提供了一个方法 info，如果还需要各种显示效果，比如成功的、失败的、警告的，可以在 info 下面提供更多的方法，比如 success、fail、warning 等。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690110110568-14c92d1f-4057-4eea-9ba1-546356a1f3a5.png#averageHue=%23c5d296&clientId=uadf6fdb9-26bd-4&from=paste&height=52&id=ub58a2931&originHeight=104&originWidth=1334&originalType=binary&ratio=2&rotation=0&showTitle=false&size=86762&status=done&style=none&taskId=u09fad0df-e48d-4c39-a06d-1dfafa63420&title=&width=667)<br />最后把 alert.js 作为插件注册到 Vue 里就行。<br />，在入口文件 src/main.js 中，通过 prototype 给 Vue 添加一个实例方法：
```javascript
// src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Alert from '../src/components/alert/alert.js'

Vue.config.productionTip = false

Vue.prototype.$Alert = Alert

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```
这样在项目任何地方，都可以通过 this.$Alert.info 来调用 Alert 组件了。
