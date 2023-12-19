## Vue3更新(响应式变更)

`Vue2`使用`Object.defineProperty()`监听 **对象中某个属性的 `get` 和 `set`**

缺点：

- 深度监听需要一次性递归将数据变成响应式

- 无法监听新增属性/删除属性( Vue.set Vue.delete )

- 无法原生监听数组,需要特殊处理(重写数组原型链)

  

  

### `Object.defineProperty`基本用法

对象定义一个name属性 去监听其获取`getter`和设置`setter`

```js
const obj = {};
let user = "yunmu";
Object.defineProperty(obj, "UserName", {
  get() {
    //当获取值的时候触发的函数
    console.log("get");
    return user;
  },
  set(newVal) {
    //当设置值的时候触发的函数,设置的新值通过参数newVal拿到
    console.log("set");
    user = newVal;
  },
});

// 测试
console.log(obj.UserName); // get yunmu
obj.UserName = "yunxi"; // set
console.log(obj.UserName); // get yunxi
```



### Object.defineProperty 实现响应式

- 监听对象，监听数组
- 复杂对象，深度监听

```js
//更新视图
function updateView() {
  console.log("视图更新");
}

function observer(target) {
  // 不是对象或数组
  if (typeof target !== "object" || target === null) {
    return target;
  }

  //重新定义各个属性 (for in 也能遍历数组)
  for (let key in target) {
    defineReative(target, key, target[key]);
  }
}

function defineReative(target, key, value) {
  //深度监听
  observer(value);

  //核心API
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        //  设置新值 value在闭包能保证下次触发get获取上次设置的值
        value = newValue;
        //深度监听
        observer(newValue);
        // 更新视图
        updateView();
      }
    },
  });
}

//准备数据
const obj = {
  name: "云牧",
  age: 18,
  info: {
    city: "长沙", //需要深度监听
  },
};

observer(obj);

obj.name = "云溪";
obj.age = 16;
obj.info.city = "怀化"; // 深度监听
obj.age = { num: 21 }; // 深度监听新增对象属性
console.log(obj.age.num)
// obj.x = 100; // 新增属性  监听不到  所以有Vue.set
// delete obj.name; // 删除属性 监听不到 所以有Vue.delete
```



**特殊处理(监听原生数组)**

```js
//更新视图
function updateView() {
  console.log("视图更新");
}

// 创建新对象，原型指向 数组原型，再扩展新的方法不会影响原型
const arrProto = Object.create(Array.prototype);
["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach((methodName) => {
  arrProto[methodName] = function (...args) {
    // 触发视图更新
    updateView();
    // 执行数组原型的方法
    Array.prototype[methodName].apply(this, args);
  };
});

// 重新定义属性，监听起来
function defineReactive(target, key, value) {
  // 深度监听
  observer(value);

  // 核心 API
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        // 设置新值 注意，value在闭包能保证下次触发get获取上次设置的值
        value = newValue;
        // 深度监听
        observer(newValue);
        // 触发更新视图
        updateView();
      }
    },
  });
}

function observer(target) {
  if (typeof target !== "object" || target === null) {
    // 不是对象或数组
    return target;
  }

  if (Array.isArray(target)) {
    target.__proto__ = arrProto;
  }

  //重新定义各个属性 (for in 也能遍历数组)
  for (let key in target) {
    defineReactive(target, key, target[key]);
  }
}

//准备数据
const obj = {
  name: "云牧",
  age: 18,
  info: {
    city: "长沙", //需要深度监听
  },
  nums: [10, 20, 30],
};

// 监听数据
observer(obj);
obj.nums.push(4); // 监听数组
```



`Vue3`使用了 `Proxy` + `Reflect` 代替 `Object.defineProperty()` 实现响应式

- 深度监听，性能更好（用到的数据转换响应式）
- 可监听新增/删除属性（get set deleteProperty）
- 可原生监听数组变化

缺点：

-  Proxy无法兼容所有浏览器，无法polyfill

`refelct`

- 和Proxy能力一一对应
- 规范化，标准化，函数式
- 替代Object上的工具函数

```js
const obj = { a: 1, b: 2 };
// 获取属性
console.log(obj.a);
console.log(Reflect.get(obj, "a"));

// 新增属性
obj.c = 3;
Reflect.set(obj, "d", "789");
console.log(obj);

// 删除属性
console.log(delete obj.a);
console.log(Reflect.deleteProperty(obj, "b"));
// 对象是否拥有的属性
console.log("a" in obj);
console.log(Reflect.has(obj, "a"));

// 遍历非原型的属性
console.log(Object.getOwnPropertyNames(obj));
console.log(Reflect.ownKeys(obj));
console.log(obj);
```



### Proxy基本使用

```js
// const data = {
//   name: "云牧",
//   age: 20,
// };
const data = [1, 2, 3];

const proxyData = new Proxy(data, {
    get(target, key, receiver) {
        // 只处理本身（非原型的）属性
        const ownKeys = Reflect.ownKeys(target);
        if (ownKeys.includes(key)) {
            console.log("get", key); // 监听
        }
        const result = Reflect.get(target, key, receiver);
        return result; // 返回结果
    },
    set(target, key, val, receiver) {
        // 重复的数据，不处理
        if (val === target[key]) {
            return true;
        }
        const result = Reflect.set(target, key, val, receiver); // 返回true或false
        console.log("set", key, val);
        return result; // 是否设置成功
    },
    deleteProperty(target, key) {
        const result = Reflect.deleteProperty(target, key); // 返回true或false
        console.log("delete property", key);
        return result; // 是否删除成功
    },
});

// proxyData.age = 18;
// console.log(proxyData.age);
// delete proxyData.age;
// console.log(proxyData);
proxyData.push(666);
```





### Proxy实现响应式

```js
// 创建响应式
function reactive(target = {}) {
    // 不是对象或数组，则返回
    if (typeof target !== "object" || target == null) {
        return target;
    }

    // 代理配置
    const proxyConf = {
        get(target, key, receiver) {
            // 只处理本身（非原型的）属性
            const ownKeys = Reflect.ownKeys(target);
            if (ownKeys.includes(key)) {
                console.log("get", key); // 监听
            }

            const result = Reflect.get(target, key, receiver);
            // 深度监听
            // 性能如何提升的？
            return reactive(result);
        },
        set(target, key, val, receiver) {
            // 重复的数据，不处理
            if (val === target[key]) {
                return true;
            }
            const ownKeys = Reflect.ownKeys(target);
            if (ownKeys.includes(key)) {
                console.log("已有的 key", key);
            } else {
                console.log("新增的 key", key);
            }
            console.log("set", key, val);
            return Reflect.set(target, key, val, receiver); // 是否设置成功
        },
        deleteProperty(target, key) {
            console.log("delete property", key);
            return Reflect.deleteProperty(target, key); // 是否删除成功
        },
    };

    // 生成代理对象
    const observed = new Proxy(target, proxyConf);
    return observed;
}

// 测试数据
const data = {
    name: "云牧",
    age: 20,
    info: {
        city: "长沙",
        a: {
            b: {
                c: {
                    d: {
                        e: 100,
                    },
                },
            },
        },
    },
};

const proxyData = reactive(data);
// console.log(proxyData.age);
// console.log(proxyData.info.city); // 深度监听
proxyData.name = "云溪";
// proxyData.info.city = "杭州"; // 深度监听
// proxyData.age = { num: 22 }; // 深度监听
// console.log(proxyData.age.num);
```
