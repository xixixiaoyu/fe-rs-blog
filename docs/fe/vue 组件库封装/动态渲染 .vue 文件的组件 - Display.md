我们都浏览器过一些网站，旁边写代码，右侧能实时渲染更新。<br />我们来实现这样一个能够动态渲染 .vue 文件的 Display 组件，需要用上节说的 extend 和 $mount。

## 接口设计
一个常规的 .vue 文件一般都会包含 3 个部分：

- `<template>`：组件的模板；
- `<script>`：组件的选项，不包含 el；
- `<style>`：CSS 样式。

我们只需要把 `<template>`、`<script>`、`<style>（ 与 Vue.js 无关）` 使用正则分割，把对应的部分传递给 extend 创建的实例就可以。<br />Display 是一个功能型的组件，没有交互和事件，只需要一个 code 的 props 将内容传递过来即可，其余工作都是在组件内完成的。<br />当然也可以设计成三个 props，分别对应 html、js、css，那分割的工作就要使用者来完成。

## 实现
新建 display.vue 文件，基本结构如下：
```vue
<!-- display.vue -->
<template>
  <div ref="display"></div>
</template>

<script>
  export default {
    props: {
      code: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        html: '',
        js: '',
        css: ''
      }
    },
  }
</script>
```
父级传递 code 后，将其分割，并保存在 data 的 html、js、css 中，后续使用。<br />我们使用正则，基于 `<>` 和 `</>` 的特性进行分割：
```javascript
// display.vue，部分代码省略
export default {
  methods: {
    getSource (source, type) {
      const regex = new RegExp(`<${type}[^>]*>`);
      let openingTag = source.match(regex);

      if (!openingTag) return '';
      else openingTag = openingTag[0]; // 获取起始标签的字符串

      // 从起始标签之后的位置开始，查找结束标签并返回中间的内容
      return source.slice(source.indexOf(openingTag) + openingTag.length, source.lastIndexOf(`</${type}>`));
    },
    splitCode () {
      const script = this.getSource(this.code, 'script').replace(/export default/, 'return ');
      const style = this.getSource(this.code, 'style');
      const template = '<div id="app">' + this.getSource(this.code, 'template') + '</div>';

      this.js = script;
      this.css = style;
      this.html = template;
    },
  }
}
```
getSource 方法接收两个参数：

- source：.vue 文件代码，即 code；
- type：分割的部分，对应 template、script、style。

分割后，返回的内容不再包含 `<template>` 等标签，直接是对应的内容。<br />有两个细节需要注意：

1. .vue 的 `<script>` 部分一般都是以 export default 开始的，但是我们将其替换成了 return
2. 在分割的 `<template>` 外层套了一个 `<div id="app">`，这是为了容错，有时使用者传递的 code 可能会忘记在外层包一个节点。

上面 this.js 是字符串，我们需要转换为对象，或者使用 new Function 或者 eval 直接解析字符串执行。
```javascript
const sum = new Function('a', 'b', 'return a + b');

console.log(sum(2, 6)); // 8
```
```vue
<!-- display.vue，部分代码省略 -->
<template>
  <div ref="display"></div>
</template>

<script>
  import Vue from 'vue';
  
  export default {
    data () {
      return {
        component: null
      }
    },
    methods: {
      renderCode () {
        this.splitCode();

        if (this.html !== '' && this.js !== '') {
          const parseStrToFunc = new Function(this.js)();

          parseStrToFunc.template = this.html;
          const Component = Vue.extend( parseStrToFunc );
          this.component = new Component().$mount();

          this.$refs.display.appendChild(this.component.$el);
        }
      }
    },
    mounted () {
      this.renderCode();
    }
  }
</script>
```
挂载到了组件唯一的节点 <div ref="display"> 上。<br />加载 css 直接创建一个 `<style>` 标签，然后把 css 写进去，再插入到页面的 `<head>` 中，这样 css 就被浏览器解析了。<br />为了便于后面在 this.code 变化或组件销毁时移除动态创建的 <style> 标签，我们给每个 style 标签加一个随机 id 用于标识。<br />新建 random_str.js：
```javascript
// 生成随机字符串
export default function (len = 32) {
  const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const maxPos = $chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}
```
这个方法是从指定的 a-zA-Z0-9 中随机生成 32 位的字符串。<br />补全 renderCode 方法：
```javascript
// display.vue，部分代码省略
import randomStr from '../../utils/random_str.js';

export default {
  data () {
    return {
      id: randomStr()
    }
  },
  methods: {
    renderCode () {
      if (this.html !== '' && this.js !== '') {
        // ...
        if (this.css !== '') {
          const style = document.createElement('style');
          style.type = 'text/css';
          style.id = this.id;
          style.innerHTML = this.css;
          document.getElementsByTagName('head')[0].appendChild(style);
        }
      }
    }
  }
}
```
当 Display 组件销毁时，也要手动销毁 extend 创建的实例以及上面的 css：
```javascript
// display.vue，部分代码省略
export default {
  methods: {
    destroyCode () {
      const $target = document.getElementById(this.id);
      if ($target) $target.parentNode.removeChild($target);

      if (this.component) {
        this.$refs.display.removeChild(this.component.$el);
        this.component.$destroy();
        this.component = null;
      }
    }
  },
  beforeDestroy () {
    this.destroyCode();
  }
}
```
当 this.code 更新时，整个过程要重新来一次，所以要对 code 进行 watch 监听：
```javascript
// display.vue，部分代码省略
export default {
  watch: {
    code () {
      this.destroyCode();
      this.renderCode();
    }
  }
}
```
以上就是 Display 组件的所有内容。

## 使用
```vue
<!-- src/views/display.vue -->
<template>
  <div>
    <h3>动态渲染 .vue 文件的组件—— Display</h3>

    <i-display :code="code"></i-display>
  </div>
</template>

<script>
  import iDisplay from '../components/display/display.vue';
  import defaultCode from './default-code.js';

  export default {
    components: { iDisplay },
    data () {
      return {
        code: defaultCode
      }
    }
  }
</script>
```
```javascript
// src/views/default-code.js
const code =
  `<template>
    <div>
        <input v-model="message">
        {{ message }}
    </div>
</template>
<script>
    export default {
        data () {
            return {
                message: ''
            }
        }
    }
</script>`;

export default code;
```
