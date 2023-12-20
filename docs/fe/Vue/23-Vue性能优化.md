## 模板



### 结合场景使用 v-show 和 v-if

- `v-if`只有当其中表达式返回值为true的时候才会被渲染，为false的时候，元素是不存在于文档中的；

- `v-show`则不管指令表达式的返回值是什么，都会被渲染，基于CSS属性`display`控制

  

`v-if`的优势体现在初始化时，`v-show`则更多体现在更新时

频繁切换显示状态用v-show ，否则用v-if





### 避免 v-for 和 v-if 同时使用

- `v-for` 和 `v-if` 存在优先级问题，可以将`v-if`使用在外层的template上解决





### v-for 遍历为每项添加 key，并且不要用index

为每一项设置唯一key值，方便diff比较时准确更新差异





### 使用 keep-alive

```vue
<template>
	<div>
    	<keep-alive>
        	<component :is="currentComponent" />
    	</keep-alive>
    </div>
</template>
```

`keep-alive`的作用就是将它包裹的组件在第一次渲染后就缓存起来，下次需要时就直接从缓存里面取，提高组件加载速度，但注意组件被缓存时会占用内存。







### computed 和 watch 区分使用场景

- `computed`计算属性：根据依赖的值计算出来新值，该值会缓存下来，当依赖的值变化，会重新计算

- `watch`侦听器：监听数据变化执行后续操作

`computed`能完成，`watch`都可以完成

`watch`能完成，`computed`不一定能完成，例如异步操作

能用`computed `建议使用`computed `，因为缓存









## script优化



### data层级不要过深

- 防止数据递归响应式的过程过长



### 使用函数式组件

- 只显示数据，不需要监听管理，初始化不需要创建实例，初始化状态，处理生命周期等

```vue
<template functional>
  <div class="user-profile">{{ props.name }}</div>
</template>
```





### 合理使用异步组件

- 使用() => import()

- defineAsyncComponent(() => import("./AsyncComp.vue"))

  







### 长列表性能优化

- 不需要Vue劫持数据实现视图响应数据，纯粹数据展示
- 使用Object.freeze 方法来冻结一个对象，一旦被冻结的对象就再也不能被修改了

```js
export default {
    data() {
        return {
            users: {}
        }
    }
    async created() {
        const users = await axios.get("/api/users");
        this.users = Object.freeze(users);
    }
};
```





### 优化无限列表性能

- 如果应用存在很长甚至无限滚动的列表，可以采用窗口化的技术优化性能
- 只需要渲染少部分区域的内容，减少重新渲染组件和创建 dom 节点的时间





### 自定义事件和DOM的销毁

- JS内使用 `addEventListener` 等方式绑定的事件在组件销毁时不会被自动销毁，需要我们手动移除，避免内存泄漏

```js
created() {
    addEventListener('click', this.handleClick, false)
},
beforeDestroy() {
    removeEventListener('click', this.handleClick, false)
}
```



### 图片资源懒加载

- 使用[IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver) webAPI或插件监听是否进入可视区域，进入则加载图片或所需数据



### 路由懒加载

- 当路由被访问到时才去加载对应的组件，提高首屏加载速度，降低其他页面速度

```js
const router = new VueRouter({
    routes: [
        { path: '/foo', component:() => import('./Foo.vue') }
    ]
})
```





### 第三方插件的按需引入

- 引入第三方插件如element组件库，只引入需要的组件，以达到减小项目体积的目的





### 服务端渲染 SSR

> 渲染HTML的任务放在服务端完成，然后直接返回给客户端

优点

- 首屏加载速度更快，无需等待JS文件下载完再去渲染
- 更友好的SEO，搜索引擎不会等待抓取 `Ajax` 异步得到的数据， 而`SSR`返回的是包含数据的页面

缺点

- 服务端开发和负载压力变大









