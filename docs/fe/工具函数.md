# utils

## 使用自定义工具包

### 1.下载工具包

```js
npm i yun-utils
```



### 2.网页中引入并使用

```html
<script src="./node_modules/yun-utils/dist/utils.js"></script>
<script>
    // 统一对外暴露yUtils对象 保存所有工具函数
    console.log(yUtils.reverseString("hello"));
</script>
```



### 3.模块化引入并使用

```js
// 使用ESM引入
import { truncate } from "yun-utils";
console.log(truncate("hello", 3));

// 使用commonjs引入
const {reverseString} = require("yun-utils");
console.log(reverseString("yunmu"));
```



## 函数相关



### call()

- 语法: call(fn, obj, ...args)
- 功能: 执行fn, 使this为obj, 并将后面的n个参数传给fn
- 功能等同于函数对象的call方法

```js
function call(fn, obj, ...args) {
    // 判断obj为ull 或者 undefined就指向全局对象
    if (obj === null || obj === undefined) {
        obj = globalThis; //全局对象
    }
    // 为obj添加临时方法
    obj.temp = fn;
    // 执行临时方法传入参数得到结果
    const reuslt = obj.temp(...args);
    // 删除临时方法
    delete obj.temp;
    // 返回结果
    return reuslt;
}


// 测试
function add(a, b) {
    // console.log(this);
    return a + b + this.c;
}
window.c = 10;
const obj = {
    c: 20,
};

console.log(call(add, null, 30, 40)); // 指向window 结果80
console.log(call(add, obj, 30, 40)); // 指向obj 结果90
```





### apply()

- 语法: apply(fn, obj, args)
- 功能: 执行fn, 使this为obj, 并将args数组中的元素传给fn
- 功能等同于函数对象的apply方法

```js
function apply(fn, obj, args) {
    // 判断obj为ull 或者 undefined就指向全局对象
    if (obj === null || obj === undefined) {
        obj = globalThis; //全局对象
    }
    // 为obj添加临时方法
    obj.temp = fn;
    // 执行临时方法传入参数得到结果
    const reuslt = obj.temp(...args);
    // 删除临时方法
    delete obj.temp;
    // 返回结果
    return reuslt;
}

// 测试
function add(a, b) {
    // console.log(this);
    return a + b + this.c
}
window.c = 10;
const obj = {
    c: 20
}

console.log(apply(add, null, [30, 40])); // 指向window 结果80
console.log(apply(add, obj, [30, 40]));  // 指向obj 结果90
```





### bind()

- 语法: bind(fn, obj, ...args)
- 功能: 返回一个新函数，该函数给fn绑定this为obj, 并指定参数为后面的n个参数
- 功能等同于函数对象的bind方法

```js
function bind(fn, obj, ...args1) {
    //  返回新函数
    return function(...args2) {
        // 新函数执行call函数返回结果
        return call(fn, obj, ...args1, ...args2)
    }
}

// 测试
function add(a, b) {
    // console.log(this);
    return a + b + this.c;
}
window.c = 10;
const obj = {
    c: 20,
};
// bind绑定this同时参数全部传递 返回新函数
const fn1 = bind(add, obj, 30, 40);
console.log(fn1()); // 90

// 返回的新函数传递参数
const fn2 = bind(add, obj);
console.log(fn2(30, 50)); // 100

// 先传递一些后面再传递完整
const fn3 = bind(add, obj, 30);
console.log(fn3(60)); // 110
```



### 函数防抖节流

- 高频事件触发会导致页面卡顿，如果发送请求，则会造成服务端不必要的压力
- 通过防抖和节流可以限制频繁的出发



#### 防抖

> 在事件被触发n秒后再执行函数，如果在这n秒内又被触发，则重新计时
>
> 场景：
>
> - 输入框实时搜索联想（keyup/input）

```js
function debounce(fn, delay) {
    // 定时器变量
    let timerId;
    return function (...args) {
        // 判断
        if (timerId) {
            // 清空定时器
            clearTimeout(timerId);
        }
        // 开启定时器执行函数
        timerId = setTimeout(() => {
            fn.apply(this, args);
            // 执行完成清空当前定时器,防止下次进来走到if逻辑
            timerId = null;
        }, delay);
    };
}

// 测试
<input type="text" />
const input = document.querySelector("input");
const debounceTask = debounce((e) => {
    console.log(e.target.value);
}, 500);
input.addEventListener("input", debounceTask);
```





#### 节流

> 每隔一段时间，只执行一次函数
>
> 场景：
>
> - 窗口调整（resize）
> - 页面滚动（scroll）
> - DOM 元素的拖拽功能实现（mousemove）
> - 抢购疯狂点击（click）

```js
function throttle(fn, delay) {
    // 定义开始时间
    let start = 0;
    return function (...args) {
        let now = Date.now();
        // 判断 当前时间 - 开始时间大于等于延迟时间
        if (now - start >= delay) {
            // 执行函数
            fn.apply(this, args);
            // 改变开始时间
            start = now;
        }
    };
}

// 测试
function task() {
    console.log("run task");
}
const throttleTask = throttle(task, 1000);
window.addEventListener("scroll", throttleTask);
```



### once

```js
function once(fn) {
    // 标识 用于控制函数只执行一次
    let done = false;
    return function (...args) {
        // 判断
        if (!done) {
            done = true;
            // 执行函数
            fn.call(this, ...args);
        }
    };
}

// 测试
let pay = once(function (money) {
    console.log(`支付：${money} RMB`);
});
pay(5);
pay(5);
pay(5);
```



### 函数柯里化

- 当一个函数有多个参数的时候先传递一部分参数调用它
- 然后返回一个新的函数接收剩余的参数，返回结果

```js
function curry(fn) {
    // 返回柯里化后函数
    return function curryFn(...args1) {
        // 如果形参和实参相同 调用函数传入对应数量的参数
        if (fn.length === args1.length) return fn(...args1);
        // 参数不够时返回函数累积参数
        return (...args2) => curryFn(...args1, ...args2);
    };
}

// 测试
function getSum(a, b, c) {
    return a + b + c;
}

let curried = curry(getSum);
console.log(curried(1)(2)(3)); // 6
console.log(curried(1)(2, 3)); // 6
console.log(curried(1, 2)(3)); // 6
console.log(curried(1, 2, 3)); // 6
```





## 数组相关



### forEach

- 遍历对应数组每个元素

```js
export function forEach(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i], i);
    }
}
```



### map

- 返回一个由回调函数的返回值组成的新数组

```js
function map(arr, callback) {
    // 准备一个数组
    const result = [];
    // 循环
    for (let i = 0; i < arr.length; i++) {
        // 执行函数并传入数组项和索引
        result.push(callback(arr[i], i));
    }
    // 返回重组后的数组
    return result;
}

// 测试
const arr = [2, 3, 4, 5];
const newArr = map(arr, (item, index) => {
    console.log("数组每项", item);
    console.log("数组索引", index);
    return item * 10;
});
console.log(newArr); // [20, 30, 40, 50]
```





### reduce

- 从左到右为数组每个元素执行一次回调函数
- 并把上次回调函数的返回值放在一个暂存器中当作参数传给下次回调函数
- 并返回最后一次回调函数的返回值

```js
function reduce(arr, callback, initValue) {
    // result 赋值为初始值
    let result = initValue;
    // 循环
    for (let i = 0; i < arr.length; i++) {
        // 执行函数传入初始值和数组元素将返回值重新赋值result以便于下次作为回调函数的第一个参数
        result = callback(result, arr[i]);
    }
    // 返回累计结果
    return result;
}

// 测试
const arr = [1, 2, 3, 4, 5];
const result = reduce(
    arr,
    (pre, cur) => {
        return pre + cur;
    },
    5
);
console.log(result); // 20
```





### filter

- 将所有在过滤函数中返回 `true` 的数组元素放进一个新数组中并返回

```js
function filter(arr, callback) {
    // 定义结果数组
    const result = [];
    // 循环
    for (let i = 0; i < arr.length; i++) {
        // 执行回调函数传入数组项和索引得到返回值
        const res = callback(arr[i], i);
        // 返回值为true推入结果数组
        if (res) {
            result.push(arr[i]);
        }
    }
    // 返回结果数组
    return result;
}

// 测试
const arr = [1, 2, 3, 4, 5];
const newArr = filter(arr, (item, index) => {
    return item % 2 === 0;
});
console.log(newArr); // [2, 4]
```





### find

- 找到第一个满足测试函数的元素并返回那个元素的值
- 如果找不到，则返回 `undefined`

```js
function find(arr, callback) {
    // 循环
    for (let i = 0; i < arr.length; i++) {
        // 执行回调函数传入数组项和索引得到返回值
        const res = callback(arr[i], i);
        // 判断为真
        if (res) {
            // 返回当前遍历元素
            return arr[i];
        }
    }
    // 如果返回都不为真则返回undefined
    return undefined;
}

// 测试
const arr = [1, 2, 3, 4, 5, 1024];
const result = find(arr, (item, index) => {
    return item > 1000;
});
console.log(result); // 1024
```





### findIndex

- 找到第一个满足测试函数的元素并返回那个元素的索引
- 如果找不到，则返回 `-1`

```js
function findIndex(arr, callback) {
    // 循环
    for (let i = 0; i < arr.length; i++) {
        // 执行回调函数传入数组项和索引得到返回值
        const res = callback(arr[i], i);
        // 判断为真
        if (res) {
            // 返回当前遍历元素索引
            return i;
        }
    }
    // 如果返回都不为真则返回-1
    return -1;
}

// 测试
const arr = [1, 2, 3, 4, 5, 1024];
const result = findIndex(arr, (item, index) => {
    return item > 1000;
});
console.log(result); 5
```





### every

- 如果数组中的每个元素都满足测试函数，则返回 true，否则返回 false

```js
function every(arr, callback) {
    // 循环
    for (let i = 0; i < arr.length; i++) {
        // 执行回调 返回值一个为false则返回false
        if (!callback(arr[i], i)) {
            return false;
        }
    }
    // 否则返回true
    return true;
}

// 测试
const arr = [1, 2, 3, 4, 5, 1024];
const result1 = every(arr, (item, indx) => {
    return item > 0;
});
console.log(result1); // true
```



### some

-  如果数组中至少有一个元素满足测试函数，则返回 true，否则返回 false

```js
function some(arr, callback) {
    // 循环
    for (let i = 0; i < arr.length; i++) {
        // 执行回调 返回值一个为true则返回true
        if (callback(arr[i], i)) {
            return true;
        }
    }
    // 否则返回false
    return false;
}

//  测试
const result2 = some(arr, (item, indx) => {
    return item > 10000;
});
console.log(result2); // true
```





### 数组去重



#### 方式一

- 利用ES6语法: ... + Set 或者 Array.from() + Set
- 简洁

```js
function unique1(arr) {
    // Set去重后转换为真正数组
    // return [...new Set(arr)];
    return Array.from(new Set(arr));
}

// 测试
const arr = [1, 2, 3, 3, 4, 4, 5];
const newArr = unique1(arr);
console.log(newArr); // [1, 2, 3, 4, 5]
```



#### 方式二

- 利用forEach()和indexOf()或者includes()
- 本质是双重遍历, 效率差些

```js
function unique2(arr) {
    // 准备结果数组
    const result = [];
    // 循环
    arr.forEach((item) => {
        // 数组不包含此项则推入
        // !result.includes(item)
        if (result.indexOf(item) === -1) {
            result.push(item);
        }
    });
    // 返回结果数组
    return result;
}
```



#### 方式三

- 利用forEach() + 对象容器
- 只需一重遍历, 效率高些

```js
function unique3(arr) {
    // 准备数组和对象
    const result = [];
    const obj = {};
    // 循环
    arr.forEach((item) => {
        // 使用对象key判断 如果不存在则存入
        if (!obj[item]) {
            obj[item] = true;
            result.push(item);
        }
    });
    // 返回结果数组
    return result;
}
```





### 数组合并

- 将n个数组或值与当前数组合并生成一个新数组, 原始数组不会被改变

```js
function concat(arr, ...args) {
    // 待合并的数组
    const result = [...arr];
    // 循环 传入的参数数组
    for (let i = 0; i < args.length; i++) {
        // 如果该项是数组则展开推入result数组
        if (Array.isArray(args[i])) {
            result.push(...args[i]);
        } else {
            // 否则直接推入
            result.push(args[i]);
        }
    }
    // 返回
    return result;
}

// 测试
const arr1 = [1, 2];
const newArr = concat(arr1, 3, [4, 5], [6, 7], 8);
console.log(newArr); // [1, 2, 3, 4, 5, 6, 7, 8]
```





数组切片

-  返回一个由 start和 end 决定的原数组的浅拷贝, 原始数组不会被改变

```js
function slice(arr, start = 0, end = arr.length) {
    // 当结束小于开始
    if (end < start) {
        end = arr.length;
    }
    // 结果数组
    const result = [];
    // 循环 当索引大于等于开始小于结束时推入
    for (let i = 0; i < arr.length; i++) {
        if (i >= start && i < end) {
            result.push(arr[i]);
        }
    }
    // 返回
    return result;
}

// 测试
const arr = [1, 2, 3, 4];
const newArr = slice(arr, 1, -1);
console.log(newArr); // [1, 2, 3, 4]
```





### 数组扁平化

- 取出嵌套数组(多维)中的所有元素放到一个新数组(一维)中
- 如: [1, [3, [2, 4]]] ==> [1, 3, 2, 4]
- 递归 + concat

```js
function flat1(arr) {
    // 准备结果数组
    const result = [];
    // 循环
    for (let i = 0; i < arr.length; i++) {
        // 如果是数组
        if (Array.isArray(arr[i])) {
            // 递归 展开 推入
            result.push(...flat1(arr[i]));
            // result = result.concat(flatten(arr[i]))
        } else {
            result.push(arr[i]);
        }
    }
    // 返回
    return result;
}

// 测试
const arr = [1, 2, [3, 4, [5, 6]], 7];
const newArr = flat1(arr);
console.log(newArr); // [1, 2, 3, 4, 5, 6, 7]
```



- some + + while +  concat

```js
function flat2(arr) {
    // 浅克隆传入数组 不改变原数组
    let result = [...arr];

    // 当数组里面有一个数组时
    while (result.some((item) => Array.isArray(item))) {
        // 展开合并
        result = [].concat(...result);
    }
    // 返回
    return result;
}
```





### 数组分块

- 语法: chunk(array, size)
- 功能: 将数组拆分成多个 size 长度的区块，每个区块组成小数组，整体组成一个二维数组
- 如: [1, 3, 5, 6, 7, 8] 调用chunk(arr, 4) ==> [[1, 3, 5, 6], [7,8]]

```js
function chunk(arr, size = 1) {
    // 准备结果和临时数组
    const result = [];
    let temp = [];
    // 遍历
    arr.forEach((item) => {
        // 当临时数组为空推入结果数组
        if (temp.length === 0) {
            result.push(temp);
        }
        // 往临时数组推入数组项
        temp.push(item);
        // 当推入数组项达到传入分块长度时重新赋值空数组循环判断 直到循环结束返回
        if (temp.length === size) {
            temp = [];
        }
    });
    // 返回
    return result;
}

// 测试
const arr = [1, 2, 3, 4, 5, 6, 7];
const newArr = chunk(arr, 3);
console.log(newArr); // [[1, 2, 3], [4, 5, 6], [7]]
```





### 数组取差异

- 语法: difference(arr1, arr2)
- 功能: 得到arr1中不在arr2的元素组成的数组(不改变原数组)
- 例子: difference([1,3,5,7], [5, 8]) ==> [1, 3, 7]

```js
unction difference(arr1, arr2 = []) {
  // 第一个数组过滤每项 判断第二个数组不包含这项就返回此项组成新数组
  return arr1.filter((item) => !arr2.includes(item));
}

// 测试
const newArr = difference([1, 2, 3, 4], [3, 4, 5]);
console.log(newArr); // [1, 2]
```



### 删除数组某些元素



#### pull(array, ...values)

- 删除原数组中与value相同的元素, 返回所有删除元素的数组，改变原数组
- 如: pull([1,3,5,3,7], 2, 7, 3, 7) ===> 原数组变为[1, 5], 返回值为[3,3,7]



#### pullAll(array, values):

- 功能与pull一致, 只是参数变为数组
- 如: pullAll([1, 3, 5, 3, 7], [2, 7, 3, 7]) ===> 数组变为[1, 5], 返回值为[3, 3, 7]

```js
function pull(arr, ...args) {
    // 声明结果数组
    const result = [];
    // 循环
    for (let i = 0; i < arr.length; i++) {
        // args如果包含数组项
        if (args.includes(arr[i])) {
            // 推入
            result.push(arr[i]);
            // 删除当前元素
            arr.splice(i, 1);
            // 下标自减
            i--;
        }
    }
    // 返回被删除的元素组成的数组
    return result;
}

function pullAll(arr, values) {
    // 第二个参数数组直接解构
    return pull(arr, ...values);
}

// 测试
const arr1 = [1, 2, 3, 4];
const newArr1 = pull(arr1, 3, 4, 5);
console.log(arr1); // [1, 2]
console.log(newArr1); // [3, 4]

const arr2 = [1, 2, 3, 4];
const newArr2 = pullAll(arr2, [3, 4, 5, 6]);
console.log(arr2); // [1, 2]
console.log(newArr2); // [3, 4, 5]
```







### 得到数组的部分元素



#### drop(array, count)

- 得到当前数组过滤掉左边count个后剩余元素组成的数组
- 说明: 不改变当前数组, count默认是1
- 如: drop([1,3,5,7], 2) ===> [5, 7]



#### dropRight(array, count)

- 得到当前数组过滤掉右边count个后剩余元素组成的数组
- 说明: 不改变当前数组, count默认是1
- 如: dropRight([1,3,5,7], 2) ===> [1, 3]

```js
function drop(arr, size = 1) {
    return arr.filter((item, index) => index >= size);
}

function dropRight(arr, size = 1) {
    return arr.filter((item, index) => index < arr.length - size);
}

// 测试
const arr = [1, 2, 3, 4, 5];
const newArr1 = drop(arr, 2);
const newArr2 = dropRight(arr, 3);
console.log(newArr1); // [3, 4, 5]
console.log(newArr2); // [1, 2]
```





## 对象相关



### 创建对象

- Object.create()兼容性写法 函数的功能是以obj为原型创建新对象

```js
function ceateobject(obj) {
    // 创建一个临时构造函数
    function F() {}
    // 让这个临时构造函数的prototype指向o，这样一来它new出来的对象，__proto__指向了o
    F.prototype = obj;
    // 返回F的实例
    return new F();
}
```



### 自定义new

- 语法: newInstance(Fn, ...args)
- 功能: 创建Fn构造函数的实例对象

```js
function newInstanceof(Fn, ...args) {
    // 创建一个空对象，继承构造函数的 prototype 属性
    const object = Object.create(Fn.prototype);
    // 执行构造函数
    const result = Fn.call(object, ...args);
    // 如果返回结果是对象，就直接返回，否则返回默认this对象
    return result instanceof Object ? result : object;
}

// 测试
function People(name) {
    this.name = name;
}
People.prototype.sayHello = function () {
    console.log("Hi");
};
const yun = newInstanceof(People, "yunmu");
console.log(yun); // People {name: 'yunmu'}
yun.sayHello(); // Hi
```



### 自定义instanceof

- 语法: myInstanceOf(obj, Type)
- 功能: 判断obj是否是Type类型的实例
- 实现: Type的原型对象是否是obj的原型链上的某个对象, 如果是返回true, 否则返回false

```js
function myInstanceof(Fn, obj) {
    // 获取该函数显示原型
    const prototype = Fn.prototype;
    // 获取obj的隐式原型
    let proto = obj.__proto__;
    // 遍历原型链
    while (proto) {
        // 检测原型是否相等
        if (proto === prototype) {
            return true;
        }
        // 如果不等于
        proto = proto.__proto__;
    }
    return false;
}

// 测试
function People(name) {
    this.name = name;
}
const yun = newInstanceof(People, "yunmu");
console.log(myInstanceof(People, yun)); // true
console.log(myInstanceof(Object, yun)); // true
console.log(myInstanceof(Object, People)); // true
console.log(myInstanceof(Function, People)); // true
console.log(myInstanceof(Function, yun)); // false
console.log(Object.__proto__ === Function.prototype); // true
console.log(Function.__proto__ === Function.prototype); // true
console.log(Object.__proto__.__proto__ === Object.prototype); // true
console.log(myInstanceof(Object, Object)); // true
console.log(myInstanceof(Function, Function)); // true
console.log(myInstanceof(Function, Object)); // true
console.log(myInstanceof(Object, Function)); // true
```





### 合并多个对象

- 语法: object mergeObject(...objs)
- 功能: 合并多个对象, 返回一个合并后对象(不改变原对象)
- 例子:
  - { a: [{ x: 2 }, { y: 4 }], b: 1}
  - { a: { z: 3}, b: [2, 3], c: 'foo'}
  - 合并后: { a: [ { x: 2 }, { y: 4 }, { z: 3 } ], b: [ 1, 2, 3 ], c: 'foo' }

```js
function mergeObject(...objs) {
    // 定义合并对象
    const result = {};
    // 遍历对象
    objs.forEach((obj) => {
        // 遍历对象键名
        Object.keys(obj).forEach((key) => {
            // 合并对象存在相同属性
            if (result.hasOwnProperty(key)) {
                // 合并到数组
                result[key] = [].concat(result[key], obj[key]);
            } else {
                // 追加
                result[key] = obj[key];
            }
        });
    });
    // 返回
    return result;
}

// 测试
const obj1 = { a: [{ x: 2 }, { y: 4 }], b: 1 };
const obj2 = { a: { z: 3 }, b: [2, 3], c: "foo" };
console.log(mergeObject(obj1, obj2)); // {a: [{x: 2}, {y: 4}, {z: 3}], b: [1, 2, 3], c:"foo"}
```





### 浅拷贝

- 只是拷贝对象本身引用地址值，修改原数据，新的数据会跟随改变

```js
function shallowClone(target) {
    //判断对象数据类型
    if (typeof target === "object" && target !== null) {
        // 判断是否数组
        if (Array.isArray(target)) {
            return [...target];
        } else {
            return { ...target };
        }
    } else {
        return target;
    }
}

// 测试
const obj = { a: 1, b: { m: 2 } };
const cloneObj = shallowClone(obj);
obj.b.m = 666;
console.log(obj === cloneObj); //false
console.log(cloneObj);
```



### 深拷贝

- 完全拷贝一份新的，在堆内存开启新空间，新旧数据互不影响



#### 乞丐版

```js
function deepClone1(target) {
    return JSON.parse(JSON.stringify(target));
}
const obj = {
    a: 1,
    b: { m: 2 },
    c: [1, 2, 3],
    // 不能克隆方法
    d() {},
};
// 会造成循环引用
obj.c.push(obj.b);
obj.b.j = obj.c;
const cloneObj = deepClone1(obj);
obj.c.push(666);
console.log(obj);
console.log(cloneObj);
```



#### 升华版

```js
function deepClone2(target, map = new Map()) {
    // 类型判断
    if (typeof target === "object" && target !== null) {
        // 设置缓存
        const cache = map.get(target);
        // 判断缓存
        if (cache) {
            return cache;
        }
        // 判断容器
        const result = Array.isArray(target) ? [] : {};
        // 设置缓存
        map.set(target, result);
        // 遍历
        for (const key in target) {
            // 判断是否原型
            if (target.hasOwnProperty(key)) {
                result[key] = deepClone2(target[key], map);
            }
        }
        // 返回克隆回的引用数据
        return result;
    } else {
        // 返回基本数据类型
        return target;
    }
}
```



#### 面试吹逼版

- 优化遍历

```js
function deepClone3(target, map = new Map()) {
    if (typeof target === "object" && target !== null) {
        const cache = map.get(target);
        if (cache) {
            return cache;
        }
        const isArray = Array.isArray(target);
        const result = isArray ? [] : {};
        map.set(target, result);
        // 判断数组
        if (isArray) {
            // 数组
            target.forEach((item, index) => {
                result[index] = deepClone3(item, map);
            });
        } else {
            // 对象
            Object.keys(target).forEach((key) => {
                result[key] = deepClone3(target[key], map);
            });
        }
        return result;
    } else {
        return target;
    }
}
```





## 字符串相关



### 字符串倒序

- 语法: reverseString(str)
- 功能: 生成一个倒序的字符串

```js
function reverseString(string) {
    // return string.split("").reverse().join("");
    return [...string].reverse().join("");
}

// 测试
console.log(reverseString("hello yunmu 2022年不要孤单了"));
```





### 字符串是否是回文

- 语法: palindrome(str)
- 功能: 如果给定的字符串是回文(正序倒序都一样)，则返回 true ；否则返回 false

```js
function palindrome(string) {
  return reverseString(string) === string;
}

// 测试
 console.log(palindrome("lil")); // true
```





### 截取字符串

- 语法: truncate(str, num)
- 功能: 如果字符串的长度超过了num, 截取前面num长度部分, 并以...结束

```js
function truncate(string, size) {
    return string.slice(0, size) + "...";
}

// 测试
 console.log(truncate("hello", 3)); // hel...
```



### 判断字符串出现最多的字符

```js
function isMaxStr(string) {
    const obj = {};
    for (let i = 0; i < string.length; i++) {
        const str = string[i];
        if (obj[str]) {
            obj[str]++;
        } else {
            obj[str] = 1;
        }
    }
    let maxCount = 0;
    let maxStr = "";
    for (let key in obj) {
        if (obj[key] > maxCount) {
            maxCount = obj[key];
            maxStr = key;
        }
    }
    return {
        maxCount,
        maxStr,
    };
}

// 测试
const str = "aabbbcccc";
console.log(isMaxStr(str));
```



## DOM相关



### 手写DOM事件监听(带委托)

- 语法：addEventListener(element, type, fn, selector)
- 说明：如果selector没有，直接给element绑定事件，如果selector有，将selector对应的多个元素的事件委托绑定给父元素element

```js
function addEventListener(el, type, handler, selector) {
    // 判断
    if (typeof el === "string") {
        el = document.querySelector(el);
    }
    // 传入实际要触发事件元素
    if (selector) {
        // 给父元素绑定事件
        el.addEventListener(type, function (e) {
            // 获取实际事件源对象
            const target = e.target;
            // 选择器匹配对应元素
            if (target.matches(selector)) {
                // 执行处理函数传入上下文对象和事件对象
                handler.call(target, e);
            }
        });
    } else {
        el.addEventListener(type, handler);
    }
}


// 测试
<div>
    <p>p1</p>
    <p>p2</p>
    <p>p3</p>
    <a href="##">a1</a>
</div>

// 事件委托给父元素 当内部a选择器被点击触发事件
addEventListener(
    "div",
    "click",
    function () {
        console.log(this.innerHTML);
    },
    "a"
);
```





### 封装DOM操作

- DOM操作本身有很多API，有的要不太长，还有的缺失，比如返回自身所有兄弟元素，清空内部元素等

```js
window.dom = {
    // 创建元素 例如dom.create('<div><span>你好</span></div>')
    create(string) {
        // 创建容器   template标签可以容纳任意元素
        const container = document.createElement("template");
        // 要trim，防止拿到空字符
        container.innerHTML = string.trim();
        console.log(container.content.firstChild);
        // 必须要 使用 .content  要不然拿不到
        return container.content.firstChild;
        // 或者
        // return container.content.children[0]
    },

    // 插入后面成为兄弟
    after(node, newNode) {
        // 找到此节点的爸爸然后调用insertBefore（插入某个节点的前面）方法
        //把 newNode 插入到下一个节点的前面
        return node.parentNode.insertBefore(newNode, node.nextSibling);
    },
    // 插入前面成为兄弟
    before(node, newNode) {
        // 正常的返回DOM原生的添加前面的节点的方法即可
        return node.parentNode.insertBefore(newNode, node);
    },
    // 插入子元素
    append(newNode, node) {
        return newNode.appendChild(node);
    },
    // 包裹对应元素 第一个参数被包裹的元素 第二个参数包裹的元素  dom.wrap(test, newDiv)
    // 先把新增的爸爸节点，放到老节点的前面，再把老节点放入新增的爸爸节点的里面
    wrap(node, newNode) {
        // 先把newNode放在node节点的前面   后面也行
        dom.before(node, newNode);
        // 然后把node节点放在newNode里面
        dom.append(newNode, node);
    },
    // 移除对应元素
    remove(node) {
        node.parentNode.removeChild(node);
        //返回删除的节点
        return node;
    },
    // 清空元素内部
    empty(node) {
        let firstChild = node.firstChild,
            array = [];
        while (firstChild) {
            array.push(dom.remove(node.firstChild));
            firstChild = node.firstChild;
        }
        // 返回删除的节点
        return array;
    },
    // 查看设置元素属性 传入两个参数查询属性值 三个值设置属性
    attr(node, name, value) {
        if (arguments.length === 3) {
            // 重载
            // 设置该节点某个属性和属性值
            node.setAttribute(name, value);
        } else if (arguments.length === 2) {
            // 查看该节点某个属性的值
            return node.getAttribute(name);
        }
    },
    // 查看设置元素文本
    text(node, string) {
        if (arguments.length === 2) {
            // 重载
            if ("innerText" in node) {
                // 兼容 ie
                return (node.innerText = string);
            } else {
                return (node.textContent = string);
            }
        } else if (arguments.length === 1) {
            if ("innerText" in node) {
                return node.innerText;
            } else {
                return node.textContent;
            }
        }
    },
    // 查看设置元素内容（包含标签）
    html(node, string) {
        if (arguments.length === 2) {
            node.innerHTML = string;
        } else if (arguments.length === 1) {
            return node.innerHTML;
        }
    },
    // 样式 三个值设置样式，两个值查询样式，统一设置样式可第二个参数传入对象
    style(node, name, value) {
        if (arguments.length === 3) {
            // dom.style(xxx,'color','red')
            node.style[name] = value;
        } else if (arguments.length === 2) {
            if (typeof name === "string") {
                // dom.style(xxx,'color')
                return node.style[name];
            } else if (name instanceof Object) {
                // dom.style(xxx,{color:'red'})
                const object = name;
                for (let key in object) {
                    // 不能用 style.key 是因为 key是变量
                    node.style[key] = object[key];
                }
            }
        }
    },
    class: {
        // 添加类名
        add(node, className) {
            node.classList.add(className);
        },
        // 移除类名
        remove(node, className) {
            node.classList.remove(className);
        },
        //  元素是否有该类名
        has(node, className) {
            return node.classList.contains(className);
        },
    },
    // 绑定事件
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn);
    },
    // 解绑事件
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn);
    },
    // 找寻元素
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector);
    },
    // 返回父元素
    parent(node) {
        return node.parentNode;
    },
    // 返回内部所有元素子元素
    children(node) {
        return node.children;
    },
    // 返回所有兄弟
    siblings(node) {
        return Array.from(node.parentNode.children).filter((n) => n !== node);
    },
    // 寻找下一个兄弟元素节点
    next(node) {
        let x = node.nextSibling;
        while (x && x.nodeType === 3) {
            //  1是元素节点， 3是文本节点
            x = x.nextSibling;
        }
        return x;
    },
    // 寻找上一个兄弟元素节点
    previous(node) {
        let x = node.previousSibling;
        while (x && x.nodeType === 3) {
            //  1是元素节点， 3是文本节点
            x = x.previousSibling;
        }
        return x;
    },
    // 遍历节点
    each(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i]);
        }
    },
    // 返回该元素在其父元素的索引
    index(node) {
        // 返回该元素列表
        const list = dom.children(node.parentNode);
        // 遍历
        for (let i = 0; i < list.length; i++) {
            if (list[i] === node) {
                return i;
            }
        }
    },
};
```





### 可拖拽div

```js
let dragging = false;
let position = null;

xxx.addEventListener("mousedown", function (e) {
  dragging = true;
  position = [e.clientX, e.clientY];
});

document.addEventListener("mousemove", function (e) {
  if (dragging === false) {
    return;
  }
  console.log("hi");
  const x = e.clientX;
  const y = e.clientY;
  const deltaX = x - position[0];
  const deltaY = y - position[1];
  const left = parseInt(xxx.style.left || 0);
  const top = parseInt(xxx.style.top || 0);
  xxx.style.left = left + deltaX + "px";
  xxx.style.top = top + deltaY + "px";
  position = [x, y];
});
document.addEventListener("mouseup", function (e) {
  dragging = false;
});
```





### 简易JQuery

![image-20220307121457300](https://gitee.com/z1725163126/cloundImg/raw/master/image-20220307121457300.png)



![image-20220307121503872](https://gitee.com/z1725163126/cloundImg/raw/master/image-20220307121503872.png)



## 手写Ajax请求函数

- 语法：axios(options)
  - 参数配置对象：url, method, params与data
  - 返回值为：promise对象
- axios.get(url, options)
- axios.post(url, data, options)
- axios.put(url, data, options)
- axios.delete(url, options)
- 功能：使用xhr发送ajax请求的工具函数，与axios库功能类似

```js
function axios({ method, url, params, data }) {
    // Promise风格
    return new Promise((resolve, reject) => {
        // 1.创建xhr对象
        const xhr = new XMLHttpRequest();
        // 设置响应类型为json
        xhr.responseType = "json";
        // 2.监听事件 处理响应
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                // 传递响应信息
                resolve({
                    status: xhr.status,
                    message: xhr.statusText,
                    data: xhr.response,
                });
            } else {
                // 请求失败, 调用 reject(reason)
                reject(new Error("请求失败: status: " + xhr.status));
            }
        };
        // 方法转为大写
        method = method.toUpperCase();
        // 拼接params对象 a=1&b=2
        let str = "";
        for (let key in params) {
            str += `${key}=${params[key]}&`;
        }
        str = str.slice(0, -1);
        url += url.includes("?") ? "&" : "?";

        // 3.准备发送请求
        xhr.open(method, url + str, true);

        // 如果请求不为get则携带请求体参数
        if (method === "POST" || method === "PUT" || method === "DELETE") {
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send(null);
        }
    });
}

axios.get = function (url, options = {}) {
    const conifg = Object.assign(options, { method: "GET", url });
    return axios(conifg);
};

axios.post = function (url, options = {}) {
    const conifg = Object.assign(options, { method: "POST", url });
    return axios(conifg);
};

axios.put = function (url, options = {}) {
    const conifg = Object.assign(options, { method: "PUT", url });
    return axios(conifg);
};

axios.delete = function (url, options = {}) {
    const conifg = Object.assign(options, { method: "DELETE", url });
    return axios(conifg);
};

// 测试
const url1 =
      "https://www.fastmock.site/mock/13089f924ad68903046c5a61371475c4/api/register";

const url2 =
      "https://www.fastmock.site/mock/13089f924ad68903046c5a61371475c4/api/post";
const params = {
    a: 1,
    b: 2,
    c: 3,
};
const data = {
    name: "yunmu",
};
axios({
    url: url1,
    method: "POST",
    params,
    data,
}).then((res) => {
    console.log(res);
});

axios
    .get(url2, {
    params,
})
    .then((res) => console.log(res));
```





## 手写事件总线

- eventBus: 包含所有功能的事件总线对象
- eventBus.on(eventName, listener): 绑定事件监听
- eventBus.emit(eventName, data): 分发事件
- eventBus.off(eventName): 解绑指定事件名的事件监听, 如果没有指定解绑所有

```js
const eventBus = {
    // 保存类型和回调容器
    callbacks: {
        // login: [fn1, fn2]
    },
};

// 绑定事件
eventBus.on = function (eventName, callback) {
    // 判断有该类型事件
    if (this.callbacks[eventName]) {
        // 推入
        this.callbacks[eventName].push(callback);
    } else {
        // 构造该类型数组
        this.callbacks[eventName] = [callback];
    }
};

// 触发事件
eventBus.emit = function (eventName, data) {
    // 判断有该类型事件
    if (this.callbacks[eventName] && this.callbacks[eventName].length > 0) {
        // 遍历数组里函数执行传入数据
        this.callbacks[eventName].forEach((event) => event(data));
    }
};

eventBus.off = function (eventName) {
    // 如果传入事件名
    if (eventName) {
        // 删除指定事件
        delete this.callbacks[eventName];
    } else {
        // 清空
        this.callbacks = {};
    }
};

// 测试
eventBus.on("login", (data) => {
    console.log(`用户已经登陆,数据${data}`);
});

eventBus.on("login", (data) => {
    console.log(`用户已经登陆,数据${data}`);
});

eventBus.on("logout", (data) => {
    console.log(`用户已经退出,数据${data}`);
});

setTimeout(() => {
    eventBus.emit("login", "云牧");
    eventBus.emit("logout", "云牧");
}, 1000);

eventBus.off("login");
eventBus.off();
```





## 手写消息订阅与发布

- PubSub: 包含所有功能的订阅/发布消息的管理者
- PubSub.subscribe(msg, subscriber): 订阅消息: 指定消息名和订阅者回调函数
- PubSub.publish(msg, data): 发布消息: 指定消息名和数据
- PubSub.unsubscribe(flag): 取消订阅: 根据标识取消某个或某些消息的订阅

```js
const PubSub = {
  id: 1,
  callbacks: {
    // pay:{
    //   // token_1: fn1,
    //   // token_2: fn2,
    // }
  },
};

PubSub.subscribe = function (channel, callback) {
  // 唯一的编号
  let token = "token_" + this.id++;
  // 判断callbacks是否存在channel
  if (this.callbacks[channel]) {
    // 存入
    this.callbacks[channel][token] = callback;
  } else {
    // 构造出对象存入
    this.callbacks[channel] = {
      [token]: callback,
    };
  }
  return token;
};

// 订阅频道
PubSub.publish = function (channel, data) {
  // 获取当前频道所有的回调 遍历执行
  if (this.callbacks[channel]) {
    Object.values(this.callbacks[channel]).forEach((callback) =>
      callback(data)
    );
  }
};

// 取消订阅
PubSub.unsubscribe = function (flag) {
  // 没有传则全部清空
  if (!flag) {
    this.callbacks = {};
    // 判断
  } else if (typeof flag === "string") {
    // 如果包含token_
    if (flag.includes("token_")) {
      // 遍历对象找到对应token
      const callbackobj = Object.values(this.callbacks).find((obj) =>
        obj.hasOwnProperty(flag)
      );
      if (callbackobj) {
        delete callbackobj[flag];
      }
    } else {
      // 删除该订阅下所有回调
      delete this.callbacks[flag];
    }
  }
};

// 测试
const id1 = PubSub.subscribe("pay", (data) => {
    console.log("商家接受到了订单", data); 
});
const id2 = PubSub.subscribe("pay", (data) => {
    console.log("骑手接受到了订单", data);
});

const id3 = PubSub.subscribe("cancel", (data) => {
    console.log("买家取消了订单", data);
});
PubSub.unsubscribe(id1);
PubSub.publish("pay", {
    title: "鱼香肉丝",
    price: 20,
    address: "xxx",
});
PubSub.publish("cancel", {
    title: "鱼香肉丝",
    price: 20,
    address: "xxx",
});
```





## 手写Promise

- 定义整体结构
- Promise构造函数的实现
- promise.then()/catch()/finally()的实现
- Promise.resolve()/reject()的实现
- Promise.all/race()的实现

### ES5函数类

```js
function MyPromise(executor) {
  // promise的状态和值
  this.promiseState = "pending";
  this.promiseResult = null;
  // 保存成功和失败回调
  this.callbacks = [];
  const resolve = (value) => {
    //  判断状态
    if (this.promiseState !== "pending") return;
    // 更改为成功状态和值
    this.promiseState = "fulfilled";
    this.promiseResult = value;
    // 遍历执行成功的回调
    setTimeout(() => {
      this.callbacks.forEach((stateObj) => {
        stateObj.onResolved(value);
      });
    });
  };
  const reject = (reason) => {
    //  判断状态
    if (this.promiseState !== "pending") return;
    // 更改为失败状态和值
    this.promiseState = "rejected";
    this.promiseResult = reason;
    // 遍历执行失败的回调
    setTimeout(() => {
      this.callbacks.forEach((stateObj) => {
        stateObj.onRejected(reason);
      });
    });
  };
  // throw抛出错误走到reject
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

// 添加then方法
MyPromise.prototype.then = function (onResolved, onRejected) {
  // 如果不传递成功或者失败的回调函数 默认构造一个
  if (typeof onResolved !== "function") {
    onResolved = (value) => value;
  }
  if (typeof onRejected !== "function") {
    onRejected = (reason) => {
      throw reason;
    };
  }

  return new MyPromise((resolve, reject) => {
    const callback = (type) => {
      try {
        // 获取回调函数执行结果
        const result = type(this.promiseResult);
        // 判断
        if (result instanceof MyPromise) {
          // 如果是Promise类型对象
          result.then(
            (res) => {
              resolve(res);
            },
            (reason) => {
              reject(reason);
            }
          );
        } else {
          // 状态变为成功
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    };
    // 执行then成功回调
    if (this.promiseState === "fulfilled") {
      setTimeout(() => {
        callback(onResolved);
      });
    }
    // 执行then失败回调
    if (this.promiseState === "rejected") {
      setTimeout(() => {
        callback(onRejected);
      });
    }
    // 若为pending保存成功和失败回调
    if (this.promiseState === "pending") {
      this.callbacks.push({
        onResolved: () => {
          callback(onResolved);
        },
        onRejected: () => {
          callback(onRejected);
        },
      });
    }
  });
};

// catch实例方法
MyPromise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

// finally实例方法
MyPromise.prototype.finally = function (callback) {
  return this.then(
    (value) => {
      return MyPromise.resolve(callback()).then(() => value);
    },
    (reason) => {
      return MyPromise.resolve(callback()).then(() => {
        throw reason;
      });
    }
  );
};

// resolve静态方法
MyPromise.resolve = function (value) {
  return new MyPromise((resolve, reject) => {
    if (value instanceof MyPromise) {
      value.then(
        (res) => {
          resolve(res);
        },
        (reason) => {
          reject(reason);
        }
      );
    } else {
      resolve(value);
    }
  });
};

// reject静态方法
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};

// all静态方法
MyPromise.all = function (promises) {
  // 计数
  let count = 0;
  let arr = [];
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (value) => {
          // 有一个成功的Promise就+1 直到全部成功
          count++;
          arr[i] = value;
          if (count === promises.length) {
            resolve(arr);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    }
  });
};

// race静态方法
MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (value) => {
          resolve(value);
        },
        (reason) => {
          reject(reason);
        }
      );
    }
  });
};
```





### ES6类

```js
class MyPromise {
  constructor(executor) {
    // promise的状态和值
    this.promiseState = "pending";
    this.promiseResult = null;
    // 保存成功和失败回调
    this.callbacks = [];
    const resolve = (value) => {
      //  判断状态
      if (this.promiseState !== "pending") return;
      // 更改为成功状态和值
      this.promiseState = "fulfilled";
      this.promiseResult = value;
      // 遍历执行成功的回调
      setTimeout(() => {
        this.callbacks.forEach((stateObj) => {
          stateObj.onResolved(value);
        });
      });
    };
    const reject = (reason) => {
      //  判断状态
      if (this.promiseState !== "pending") return;
      // 更改为失败状态和值
      this.promiseState = "rejected";
      this.promiseResult = reason;
      // 遍历执行失败的回调
      setTimeout(() => {
        this.callbacks.forEach((stateObj) => {
          stateObj.onRejected(reason);
        });
      });
    };
    // throw抛出错误走到reject
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onResolved, onRejected) {
    // 如果不传递成功或者失败的回调函数 默认构造一个
    if (typeof onResolved !== "function") {
      onResolved = (value) => value;
    }
    if (typeof onRejected !== "function") {
      onRejected = (reason) => {
        throw reason;
      };
    }

    return new MyPromise((resolve, reject) => {
      const callback = (type) => {
        try {
          // 获取回调函数执行结果
          const result = type(this.promiseResult);
          // 判断
          if (result instanceof MyPromise) {
            // 如果是Promise类型对象
            result.then(
              (res) => {
                resolve(res);
              },
              (reason) => {
                reject(reason);
              }
            );
          } else {
            // 状态变为成功
            resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      };
      // 执行then成功回调
      if (this.promiseState === "fulfilled") {
        setTimeout(() => {
          callback(onResolved);
        });
      }
      // 执行then失败回调
      if (this.promiseState === "rejected") {
        setTimeout(() => {
          callback(onRejected);
        });
      }
      // 若为pending保存成功和失败回调
      if (this.promiseState === "pending") {
        this.callbacks.push({
          onResolved: () => {
            callback(onResolved);
          },
          onRejected: () => {
            callback(onRejected);
          },
        });
      }
    });
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally(callback) {
    return this.then(
      (value) => {
        return MyPromise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }
  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      if (value instanceof MyPromise) {
        value.then(
          (res) => {
            resolve(res);
          },
          (reason) => {
            reject(reason);
          }
        );
      } else {
        resolve(value);
      }
    });
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
  static all(promises) {
    // 计数
    let count = 0;
    let arr = [];
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (value) => {
            // 有一个成功的Promise就+1 直到全部成功
            count++;
            arr[i] = value;
            if (count === promises.length) {
              resolve(arr);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      }
    });
  }
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      }
    });
  }
}
```





## 数据类型判断

- typeof 来判断数据类型无法精确判断对象类型，而且null会判断object
- 可以使用 Object.prototype.toString 实现

```js
function typeOf(data) {
  return Object.prototype.toString.call(data).slice(8, -1);
}

// 测试
console.log(typeOf(1)); // Number
console.log(typeOf("1")); // String
console.log(typeOf(true)); // Boolean
console.log(typeOf(null)); // Null
console.log(typeOf(undefined)); // Undefined
console.log(typeOf(Symbol(1))); // Symbol
console.log(typeOf({})); // Object
console.log(typeOf([])); // Array
console.log(typeOf(function () {})); // Function
console.log(typeOf(new Date())); // Date
```





## ES5继承（寄生组合继承）

```js
function People(name) {
    this.name = name;
}

People.prototype.eat = function () {
    console.log(this.name + " is eating");
};

function Stundent(name, age) {
    People.call(this, name);
    this.age = age;
}
Stundent.prototype = Object.create(People.prototype);
// prototype对象有一个constructor属性，默认指向prototype对象所在的构造函数。
Stundent.prototype.contructor = Stundent;

Stundent.prototype.study = function () {
    console.log(this.name + " is studying");
};

// 测试
let xiaoming = new Stundent("xiaoming", 16);
console.log(xiaoming.name); // xiaoming
xiaoming.eat(); // xiaoming is eating
xiaoming.study(); // xiaoming is studying
```





## 获取 url 参数



### URLSearchParams 方法

```js
// 创建一个URLSearchParams实例
const urlSearchParams = new URLSearchParams(window.location.search);
// 把键值对列表转换为一个对象
const params = Object.fromEntries(urlSearchParams.entries());
```



### split 方法

```js
function getParams(url) {
    const result = {};
    if (url.includes("?")) {
        // 截取道？后面的参数 user=yunmu&age=16
        const str = url.split("?")[1];
        // 分割为 ['user=yunmu', 'age=16']
        const arr = str.split("&");
        // 遍历后赋值对面key value对
        arr.forEach((item) => {
            const key = item.split("=")[0];
            const val = item.split("=")[1];
            result[key] = decodeURIComponent(val); // 解码
        });
    }
    // 返回
    return result;
}

// 测试
const user = getParams("http://www.baidu.com?user=yunmu&age=16");
console.log(user); // {user: 'yunmu', age: '16'}
```







