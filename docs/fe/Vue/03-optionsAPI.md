# optionsAPI

> 我们知道，在模板中可以直接通过插值语法显示一些 data 中的数据
>
> 在某些情况我们可能会对于数据进行复杂的处理展示
>
> 按以前的做法是我们在模板中使用表达式或者将逻辑抽离到 method 中
>
> 但是显然还有另一种更好的方式就是`computed`

## 1.计算属性 computed

> 要用的属性不存在，要通过已有属性计算得来
>
> 底层借助了 Objcet.defineproperty 方法提供的 getter 和 setter
>
> 对于任何响应式数据的复杂逻辑，实际都应该优先计算属性
>
> 里面的计算属性可以为函数或者对象
>
> 我们通过三个案例来学习一下

案例一：我们有两个变量：firstName 和 lastName，希望它们拼接之后在界面上显示

案例二：我们有一个分数 score，当 score 大于 60 的时候，在界面上显示及格，当 score 小于 60 的时候，在界面上显示不及格

案例三：我们有一个变量 message，记录一段文字：比如 Hello World，对其反转

![image-20220129140031877](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129140031877.png)

实现一：

- 使用插值语法，模板存在大量逻辑不利于维护和复用，多次使用也没有缓存

![image-20220129135205756](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129135205756.png)

实现二：

- 使用 methods，显示值的地方变成了函数调用，多次调用也没有缓存

![image-20220129135406159](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129135406159.png)

实现三：

- computed 实现，使用时候不需要加（），而且会缓存对应的值

![image-20220129135731764](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129135731764.png)

### 计算属性的缓存

> 计算属性会基于自身的依赖关系进行缓存，methods 不会
>
> 当我们多次使用相同计算属性时, 计算属性中的运算只会执行一次
>
> 但是如果依赖的数据发生变化，在使用时，计算属性依然会重新进行计算
>
> 所以 get 函数会在初次读取时会执行一次，当依赖的数据发生改变时会被再次调用

![image-20220129140833504](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129140833504.png)

### 计算属性的 setter 和 getter

> 计算属性绝大多数情况只需要一个`getter`方法即可，所以我们会写成一个函数
>
> 如果想设置计算属性的值。我们也可以设置一个`setter`方法

![image-20220129141130518](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129141130518.png)

Vue3 源码对于`setter`和`getter`内部做了逻辑判断，

![image-20220129145118382](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129145118382.png)

## 2.侦听器 watch

> 当被监视的属性变化时, 回调函数自动调用, 进行相关操作
>
> 我们如果希望在代码逻辑中监听某个数据的变化，这个时候就需要用侦听器`watch`来完成了

比如现在我们希望用户在 input 中输入一个问题，每当用户输入了最新的内容，我们就获取到最新的内容，并且使用该问题去服务器查询答案

![image-20220129150336331](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129150336331.png)

### 侦听器 watch 的配置选项

> 先看一个场景：
>
> 当我们侦听 info 对象，但是点击按钮修改 info.name 的值，这是不能被侦听到变化的
>
> 默认情况下`watch`只是在侦听 ino 的引用变化，对于内部的属性变化不会响应
>
> 这时候我们就需要使用一个选项`deep`进行深层的侦听了
>
> 并且如果我们希望一开始侦听器就执行一次可以使用`immediate`选项

当变更的对象或数组使用`deep`选项时，旧值和新值会指向同一个对象或数组，因为引用相同，所以 Vue 不会保留之前值的副本

![image-20220129155033133](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129155033133.png)

侦听对象的属性：

![image-20220129160254408](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129160254408.png)

使用 $watch 的 API：

![image-20220129160604845](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129160604845.png)

## 3.computed 和 watch 之间的区别

- computed 能完成的功能，watch 都可以完成
- watch 能完成的功能，computed 不一定能完成，例如：watch 可以进行异步操作

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220130202419975.png" alt="image-20220130202419975" style="zoom: 67%;" />

两个重要的原则：

- 所被 Vue 管理的函数，最好写成普通函数，这样 this 的指向才是 app 或 组件实例对象
- 所有不被 Vue 所管理的函数（定时器的回调函数、ajax 的回调函数等、Promise 的回调函数），最好写成箭头函数，这样 this 的指向才是 app 或组件实例对象

## 4.综合案例

![image-20220129160709921](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220129160709921.png)

- 在界面上以表格的形式，显示一些书籍的数据
- 在底部显示书籍的总价格
- 点击+或者-可以增加或减少书籍数量（如果为 1，那么不能继续 - ）
- 点击移除按钮，可以将书籍移除（当所有的书籍移除完毕时，显示：购物车为空~）

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <div id="app"></div>

    <template id="my-app">
      <template v-if="books.length > 0">
        <table>
          <thead>
            <th>序号</th>
            <th>书籍名称</th>
            <th>出版日期</th>
            <th>价格</th>
            <th>购买数量</th>
            <th>操作</th>
          </thead>
          <tbody>
            <tr v-for="(book, index) in books">
              <td>{{index + 1}}</td>
              <td>{{book.name}}</td>
              <td>{{book.date}}</td>
              <td>{{formatPrice(book.price)}}</td>
              <td>
                <button :disabled="book.count <= 1" @click="decrement(index)">-</button>
                <span class="counter">{{book.count}}</span>
                <button @click="increment(index)">+</button>
              </td>
              <td>
                <button @click="removeBook(index)">移除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <h2>总价格: {{formatPrice(totalPrice)}}</h2>
      </template>
      <template v-else>
        <h2>购物车为空~</h2>
      </template>
    </template>

    <script src="../js/vue.js"></script>
    <script src="./index.js"></script>
  </body>
</html>
```

`style.css`

```css
table {
  border: 1px solid #e9e9e9;
  border-collapse: collapse;
  border-spacing: 0;
}

th,
td {
  padding: 8px 16px;
  border: 1px solid #e9e9e9;
  text-align: left;
}

th {
  background-color: #f7f7f7;
  color: #5c6b77;
  font-weight: 600;
}

.counter {
  margin: 0 5px;
}
```

`index.js`

```js
Vue.createApp({
  template: "#my-app",
  data() {
    return {
      books: [
        {
          id: 1,
          name: "《算法导论》",
          date: "2006-9",
          price: 85.0,
          count: 1,
        },
        {
          id: 2,
          name: "《UNIX编程艺术》",
          date: "2006-2",
          price: 59.0,
          count: 1,
        },
        {
          id: 3,
          name: "《编程珠玑》",
          date: "2008-10",
          price: 39.0,
          count: 1,
        },
        {
          id: 4,
          name: "《代码大全》",
          date: "2006-3",
          price: 128.0,
          count: 1,
        },
      ],
    };
  },
  computed: {
    totalPrice() {
      let finalPrice = 0;
      for (let book of this.books) {
        finalPrice += book.count * book.price;
      }
      return finalPrice;
    },
    // Vue3不支持过滤器了, 推荐两种做法: 使用计算属性/使用全局的方法
    filterBooks() {
      return this.books.map((item) => {
        const newItem = Object.assign({}, item);
        newItem.price = "¥" + item.price;
        return newItem;
      });
    },
  },
  methods: {
    increment(index) {
      // 通过索引值获取到对象
      this.books[index].count++;
    },
    decrement(index) {
      this.books[index].count--;
    },
    removeBook(index) {
      this.books.splice(index, 1);
    },
    formatPrice(price) {
      return "¥" + price;
    },
  },
}).mount("#app");
```
