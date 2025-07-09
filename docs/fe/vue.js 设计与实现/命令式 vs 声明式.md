## 从日常生活说起
想象一下这两种场景：

**命令式思维**：你教朋友做番茄炒蛋，需要一步步指导："先把锅烧热，放点油，打两个鸡蛋搅匀，倒进锅里炒散，再放切好的番茄翻炒，最后加点盐和糖调味。"每个步骤都必须详细说明，否则可能就做不出来。

**声明式思维**：你走进餐厅直接对服务员说："来份番茄炒蛋。"你根本不关心厨师怎么做，你只关心最终结果——一盘美味的番茄炒蛋端到你面前。

简单来说：

+ 命令式关注"**怎么做**"
+ 声明式只管"**要什么**"

## 编程世界中的两种思维
### 命令式编程：事无巨细的掌控者
假设我们要在网页上显示"你好，张三"，并且支持修改名字：

```javascript
const user = { name: '张三' }
const container = document.getElementById('app')
const nameElement = document.createElement('div')
nameElement.textContent = '你好，' + user.name
nameElement.classList.add('greeting')
container.appendChild(nameElement)

// 名字变了？还得自己动手更新
function updateName(newName) {
  user.name = newName
  nameElement.textContent = '你好，' + newName
}
```

这种编程方式就像你亲自下厨，每一步都得自己动手：创建元素、设置内容、添加样式、挂载到 dom、更新内容...所有细节都要亲力亲为。

再看看 jQuery 时代的代码：

```javascript
$('#app')
  .text('hello world')
  .on('click', () => { alert('ok') })
```

虽然比原生 dom 操作简洁了不少，但本质上还是在一步步地告诉程序"做这个"、"做那个"。

### 声明式编程：只关心结果的智者
现在看看用 vue 实现同样功能：

```vue
<template>
  <div class="greeting">你好，{{ user.name }}</div>
</template>
<script setup>
import { ref } from 'vue'

const user = ref({ name: '张三' })
</script>
```

你只需要声明"我要一个显示用户名的 div"，至于 dom 如何创建、如何更新，完全不用操心。当 `user.name` 变化时，vue 自动帮你更新界面。

那个点击弹窗的例子用 vue 实现更是简单：

```vue
<div @click="() => alert('ok')">hello world</div>
```

你只需要表达"我要一个点击时弹窗的 div"，剩下的 vue 全包了。

## 为什么声明式编程如此受欢迎？
1. **关注点分离**：你只需要关心"做什么"，而不是"怎么做"
2. **代码更简洁**：不再需要写一堆操作 dom 的繁琐代码
3. **更易维护**：当需求变化时，只需修改声明部分，而不是重写实现逻辑
4. **减少错误**：框架处理了许多边缘情况，避免了常见错误

## 背后的魔法
其实，声明式编程的背后依然是命令式的实现。vue、react 这些框架内部用命令式代码实现了复杂的 dom 操作，但对外提供了声明式的接口，让我们能够更轻松地开发应用。

就像餐厅里，你只需要点菜（声明式），而厨师则需要按步骤烹饪（命令式）。两种思维方式各有所长，在不同场景下发挥着不同的作用。

