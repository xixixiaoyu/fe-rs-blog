## 1.前言

> 刚开始的 script setup 只是一个实验性提案
>
> 如今该组合式 API 的编译时语法糖已被正式定稿，我如今在正式项目使用就一个字：真爽（手动狗头）
>
> 相比于普通的 `<script>` 语法，它具有更多优势：
>
> - 更少的样板内容，更简洁的代码
> - 能够使用纯 Typescript 声明 props 和抛出事件
> - 更好的运行时性能 (其模板会被编译成与其同一作用域的渲染函数，没有任何的中间代理)
> - 更好的 IDE 类型推断性能 (减少语言服务器从代码中抽离类型的工作)

注意此文后面使用 Vetur，但是由于 Vue3 支持有限，会出现模板使用但是本身还是灰色未引用的情况

推荐一个支持较好的插件：

![image-20220223005808359](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220223005808359.png)

## 2.核心使用

### 顶层的绑定的变量、函数、导入组件等直接暴露模板使用

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220223005525101.png" alt="image-20220223005525101" style="zoom:80%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220223005342938.png" alt="image-20220223005342938" style="zoom:80%;" />

![image-20220222144622189](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222144622189.png)

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220223005614635.png" alt="image-20220223005614635" style="zoom:80%;" />

### 父子通信

父组件：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222145754873.png" alt="image-20220222145754873" style="zoom: 50%;" />

子组件：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222145840325.png" alt="image-20220222145840325" style="zoom: 80%;" />

![image-20220222145901246](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222145901246.png)

### v-model

父组件：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222150315016.png" alt="image-20220222150315016" style="zoom:80%;" />

子组件：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222150704482.png" alt="image-20220222150704482" style="zoom:67%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222150726132.png" alt="image-20220222150726132" style="zoom:67%;" />

### ref 和组件的 defineExpose

`script setup`定义的变量默认不会暴露出去，这时我们可以使用`definExpose({ })`来暴露组件内部属性给父组件使用

父组件：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222180132827.png" alt="image-20220222180132827" style="zoom: 67%;" />

子组件：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222170000206.png" alt="image-20220222170000206" style="zoom:67%;" />

![image-20220222170014441](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222170014441.png)

### 非 Props 属性（useAttrs）

![image-20220222171441847](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222171441847.png)

### 插槽 slot（useSlots）

父组件：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222171011179.png" alt="image-20220222171011179" style="zoom:67%;" />

子组件：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222171049389.png" alt="image-20220222171049389" style="zoom:67%;" />

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222171115013.png" alt="image-20220222171115013" style="zoom:50%;" />

### 路由和 store 钩子

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222172024050.png" alt="image-20220222172024050" style="zoom: 50%;" />

### 原型绑定与组件内使用

![image-20220222172442691](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222172442691.png)

### 对 await 的支持

不必再配合 async 就可以直接使用 await 了，这种情况下，组件的 setup 会自动变成 async setup

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222174008605.png" alt="image-20220222174008605" style="zoom: 67%;" />

### 与普通的 `<script>` 一起使用

> `<script setup>` 可以和 普通的 `<script>` 混用，一般用来声明一些 `<script setup>` 无法声明的选项

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220222174428990.png" alt="image-20220222174428990" style="zoom:50%;" />
