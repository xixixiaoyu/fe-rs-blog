# vue3 开发 TodoList

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220211221512657.png" alt="image-20220211221512657" style="zoom:50%;" />

> 案例地址：[vue3-todolist · 云牧/exampleCode - 码云 - 开源中国 (gitee.com)](https://gitee.com/z1725163126/example-code/tree/master/Vue/vue3-todolist)

## 0.ToDoList 功能列表

- 添加待办事项
- 删除待办事项
- 编辑待办事项
- 切换待办事项
- 存储待办事项

## 1.添加待办事项

在输入框输入文本按下 enter 键提交待办事项：

```js
// 1. 添加待办事项
const useAdd = (todos) => {
  const input = ref("");
  const addTodo = () => {
    const text = input.value?.trim();
    if (text.length === 0) return;
    todos.value.unshift({
      text,
      completed: false,
    });
    input.value = "";
  };
  return {
    input,
    addTodo,
  };
};
```

```html
<input
  type="text"
  class="new-todo"
  placeholder="What needs to be done?"
  autocomplete="off"
  autofocus
  v-model="input"
  @keyup.enter="addTodo"
/>
```

## 2.删除待办事项

点击待办事项右侧的叉号可以删除待办事项

```js
// 2. 删除待办事项
const useRemove = (todos) => {
  const remove = (todo) => {
    const index = todos.value.indexOf(todo);
    todos.value.splice(index, 1);
  };
  return {
    remove,
  };
};
```

```html
<button class="destroy" @click="remove(todo)"></button>
```

## 3.编辑待办事项

> 双击进入编辑状态，按 esc 退出编辑，按 enter 提交编辑，如果删光了文本，则为删除这一项
>
> - 双击待办事项，展示编辑文本框
> - 按回车或者编辑文本框失去焦点，修改数据
> - 按 esc 取消编辑
> - 把编辑文本框清空按回车，删除这一项
> - 显示编辑文本框的时候获取焦点

```js
// 3. 编辑待办事项
const useEdit = (remove) => {
  let beforeEditingText = "";
  const editingTodo = ref(null);

  const editTodo = (todo) => {
    beforeEditingText = todo.text;
    editingTodo.value = todo;
  };
  const doneEdit = (todo) => {
    if (!editingTodo.value) return;
    todo.text = todo.text.trim();
    if (todo.text === "") remove(todo);
    editingTodo.value = null;
  };
  const cancelEdit = (todo) => {
    editingTodo.value = null;
    todo.text = beforeEditingText;
  };
  return {
    editingTodo,
    editTodo,
    doneEdit,
    cancelEdit,
  };
};
```

```html
<ul class="todo-list">
  <li v-for="todo in todos" :key="todo" :class="{editing: todo === editingTodo}">
    <div class="view">
      <input type="checkbox" class="toggle" />
      <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
      <button class="destroy" @click="remove(todo)"></button>
    </div>
    <input
      type="text"
      class="edit"
      v-model="todo.text"
      @keyup.enter="doneEdit(todo)"
      @blur="doneEdit(todo)"
      @keyup.esc="cancelEdit(todo)"
    />
  </li>
</ul>
```

## 4.编辑文本框获取焦点

传对象形式：

- Vue 2.x

```js
Vue.directive('editingFocus', {
  bind(el, binding, vnode, prevVnode) {},
  inserted() {},
  update() {} // remove,
  componentUpdated() {},
  unbind() {}
})
```

- Vue 3.0

```js
app.directive("editingFocus", {
  beforeMount(el, binding, vnode, prevVnode) {},
  mounted() {},
  breforeUpdate() {}, // new
  updated() {},
  beforeUnmount() {}, // new
  unmounted() {},
});
```

传函数形式：

- Vue 2.x

```js
Vue.directive("editingFocus", (el, binding) => {
  binding.value && el.focus();
});
```

- Vue 3.0

```js
app.directive("editingFocus", (el, binding) => {
  binding.value && el.focus();
});
```

代码中局部注册：

```js
export default {
  name: "App",
  directives: {
    editingFocus: (el, binding) => {
      // binding可以获取到一些参数
      binding.value && el.focus();
    },
  },
};
```

使用：

```html
<input
  v-editing-focus="todo === editingTodo"
  type="text"
  class="edit"
  v-model="todo.text"
  @keyup.enter="doneEdit(todo)"
  @blur="doneEdit(todo)"
  @keyup.esc="cancelEdit(todo)"
/>
```

## 5.切换待办事项

> 点击可以改变所有待办项状态
>
> All/Active/Completed
>
> 其他
>
> - 显示未完成代办项个数
> - 移除所有完成的项目
> - 如果没有待办项，隐藏 main 和 footer

```js
// 4. 切换待办项完成状态
const useFilter = (todos) => {
  const allDone = computed({
    get: () => {
      return !todos.value.filter((item) => !item.completed).length;
    },
    set: (value) => {
      todos.value.forEach((todo) => {
        todo.completed = value;
      });
    },
  });

  const filter = {
    all: (list) => list,
    active: (list) => list.filter((todo) => !todo.completed),
    completed: (list) => list.filter((todo) => todo.completed),
  };

  const type = ref("all");
  const filteredTodos = computed(() => filter[type.value](todos.value));

  const remainingCount = computed(() => filter.active(todos.value).length);

  const count = computed(() => todos.value.length);

  const onHashChange = () => {
    const hash = window.location.hash.replace("#/", "");
    if (filter[hash]) {
      type.value = hash;
    } else {
      type.value = "all";
      window.location.hash = "";
    }
  };

  onMounted(() => {
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
  });

  onUnmounted(() => {
    window.removeEventListener("hashchange", onHashChange);
  });

  return {
    allDone,
    filteredTodos,
    remainingCount,
    count,
  };
};
```

## 6.本地存储

```js
import useLocalStorage from "./utils/useLocalStorage";
const storage = useLocalStorage();

// 5. 存储待办事项
const useStorage = () => {
  const KEY = "TODOKEYS";
  const todos = ref(storage.getItem(KEY) || []);
  watchEffect(() => {
    storage.setItem(KEY, todos.value);
  });
  return todos;
};
```

```js
// utils/useLocalStorage.js
function parse(str) {
  let value;
  try {
    value = JSON.parse(str);
  } catch {
    value = null;
  }
  return value;
}

function stringify(obj) {
  let value;
  try {
    value = JSON.stringify(obj);
  } catch {
    value = null;
  }
  return value;
}

export default function useLocalStorage() {
  function setItem(key, value) {
    value = stringify(value);
    window.localStorage.setItem(key, value);
  }
  function getItem(key) {
    let value = window.localStorage.getItem(key);
    if (value) {
      value = parse(value);
    }
    return value;
  }
  return {
    setItem,
    getItem,
  };
}
```

## 7.完整代码

```vue
<template>
  <section id="app" class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        type="text"
        class="new-todo"
        placeholder="What needs to be done?"
        autocomplete="off"
        autofocus
        v-model="input"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main" v-show="count">
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone" />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          :key="todo"
          :class="{ editing: todo === editingTodo, completed: todo.completed }"
        >
          <div class="view">
            <input type="checkbox" class="toggle" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="remove(todo)"></button>
          </div>
          <input
            v-editing-focus="todo === editingTodo"
            type="text"
            class="edit"
            v-model="todo.text"
            @keyup.enter="doneEdit(todo)"
            @blur="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="count">
      <span class="todo-count">
        <strong>{{ remainingCount }}</strong> {{ remainingCount > 1 ? "items" : "item" }} left
      </span>
      <ul class="filters">
        <li><a href="#/all">All</a></li>
        <li><a href="#/active">Active</a></li>
        <li><a href="#/completed">Completed</a></li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="count > remainingCount">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
import "./assets/index.css";
import useLocalStorage from "./utils/useLocalStorage";
import { ref, computed, onMounted, onUnmounted, watchEffect } from "vue";

const storage = useLocalStorage();

// 1. 添加待办事项
const useAdd = (todos) => {
  const input = ref("");
  const addTodo = () => {
    const text = input.value?.trim();
    if (text.length === 0) return;
    todos.value.unshift({
      text,
      completed: false,
    });
    input.value = "";
  };
  return {
    input,
    addTodo,
  };
};

// 2. 删除待办事项
const useRemove = (todos) => {
  const remove = (todo) => {
    const index = todos.value.indexOf(todo);
    todos.value.splice(index, 1);
  };

  const removeCompleted = () => {
    todos.value = todos.value.filter((todo) => !todo.completed);
  };
  return {
    remove,
    removeCompleted,
  };
};

// 3. 编辑待办事项
const useEdit = (remove) => {
  let beforeEditingText = "";
  const editingTodo = ref(null);

  const editTodo = (todo) => {
    beforeEditingText = todo.text;
    editingTodo.value = todo;
  };
  const doneEdit = (todo) => {
    if (!editingTodo.value) return;
    todo.text = todo.text.trim();
    if (todo.text === "") remove(todo);
    editingTodo.value = null;
  };
  const cancelEdit = (todo) => {
    editingTodo.value = null;
    todo.text = beforeEditingText;
  };
  return {
    editingTodo,
    editTodo,
    doneEdit,
    cancelEdit,
  };
};

// 4. 切换待办项完成状态
const useFilter = (todos) => {
  const allDone = computed({
    get: () => {
      return !todos.value.filter((item) => !item.completed).length;
    },
    set: (value) => {
      todos.value.forEach((todo) => {
        todo.completed = value;
      });
    },
  });

  const filter = {
    all: (list) => list,
    active: (list) => list.filter((todo) => !todo.completed),
    completed: (list) => list.filter((todo) => todo.completed),
  };

  const type = ref("all");
  const filteredTodos = computed(() => filter[type.value](todos.value));

  const remainingCount = computed(() => filter.active(todos.value).length);

  const count = computed(() => todos.value.length);

  const onHashChange = () => {
    const hash = window.location.hash.replace("#/", "");
    if (filter[hash]) {
      type.value = hash;
    } else {
      type.value = "all";
      window.location.hash = "";
    }
  };

  onMounted(() => {
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
  });

  onUnmounted(() => {
    window.removeEventListener("hashchange", onHashChange);
  });

  return {
    allDone,
    filteredTodos,
    remainingCount,
    count,
  };
};

// 5. 存储待办事项
const useStorage = () => {
  const KEY = "TODOKEYS";
  const todos = ref(storage.getItem(KEY) || []);
  watchEffect(() => {
    storage.setItem(KEY, todos.value);
  });
  return todos;
};

export default {
  name: "App",
  setup() {
    const todos = useStorage();
    const { remove, removeCompleted } = useRemove(todos);
    return {
      todos,
      remove,
      removeCompleted,
      ...useAdd(todos),
      ...useEdit(remove),
      ...useFilter(todos),
    };
  },
  directives: {
    editingFocus: (el, binding) => {
      // binding可以获取到一些参数
      binding.value && el.focus();
    },
  },
};
</script>

<style></style>
```
