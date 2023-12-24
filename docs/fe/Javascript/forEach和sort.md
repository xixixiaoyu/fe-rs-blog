## forEach() 介绍

> forEach()方法需要一个回调函数（这种函数，是由我们创建但是不由我们调用的）作为参数
>
> 回调函数中传递三个参数：
>
> - 第一个参数，就是当前正在遍历的元素
> - 第二个参数，就是当前正在遍历的元素的索引
> - 第三个参数，就是正在遍历的数组

代码举例：

```js
let myArr = ['王一', '王二', '王三'];

myArr.forEach((item, index, arr) => {
    console.log('item:' + item);
    console.log('index:' + index);
    console.log('arr:' + JSON.stringify(arr));
});
```

打印结果：

```js
item:王一
index:0
arr:["王一","王二","王三"]
----------
item:王二
index:1
arr:["王一","王二","王三"]
----------
item:王三
index:2
arr:["王一","王二","王三"]
----------
```

注意：forEach() 没有返回值。也可以理解成：forEach() 的返回值是 undefined

即 `let tempArry = myArr.forEach()` 这种方式接收是没有意义的





## forEach() 能不能改变原数组？

forEach() 能不能改变原数组？关于这个问题，大部分人会搞错。我们来看看下面的代码

**1、数组的元素是基本数据类型**：（无法改变原数组）

```js
let numArr = [1, 2, 3];

numArr.forEach((item) => {
    item = item * 2;
});
console.log(numArr); // 打印结果：[1, 2, 3]
```

上面这段代码，你可要看仔细了，打印结果是 `[1, 2, 3]`，不是 `[2, 4, 6]`



**2、数组的元素是引用数据类型**：（直接修改整个元素对象时，无法改变原数组）

```js
let objArr = [
    { name: '云牧', age: 20 },
    { name: '许嵩', age: 30 },
];

objArr.forEach((item) => {
    item = {
        name: '邓紫棋',
        age: '29',
    };
});
console.log(JSON.stringify(objArr)); 
// 打印结果：[{"name": "云牧","age": 20},{"name": "许嵩","age": 30}]
```



**3、数组的元素是引用数据类型**：（修改元素对象里的某个属性时，可以改变原数组）

```js
let objArr = [
    { name: '云牧', age: 28 },
    { name: '许嵩', age: 30 },
];

objArr.forEach((item) => {
    item.name = '邓紫棋';
});
console.log(JSON.stringify(objArr));
// 打印结果：[{"name":"邓紫棋","age":28},{"name":"邓紫棋","age":30}]
```



所以其实 forEach 不会直接改变调用它的对象，但是那个对象可能会被 callback 函数改变，上述现象如果了解基础数据类型赋值是值传递，而引用数据类型赋值是引用地址的传递后其实就很好理解啦

如果你需要通过 forEach 修改原数组，建议用 forEach 里面的参数 2 和参数 3 来做，具体请看下面的标准做法

**forEach() 通过参数 2、参数 3 修改原数组**：（标准做法）

```js
// 1、数组的元素是基本数据类型
let numArr = [1, 2, 3];

numArr.forEach((item, index, arr) => {
    arr[index] = arr[index] * 2;
});
console.log(JSON.stringify(numArr)); // 打印结果：[2, 4, 6]

// 2、数组的元素是引用数据类型时，直接修改对象
let objArr = [
    { name: '云牧', age: 28 },
    { name: '许嵩', age: 34 },
];

objArr.forEach((item, index, arr) => {
    arr[index] = {
        name: '小明',
        age: '10',
    };
});
console.log(JSON.stringify(objArr)); 
// 打印结果：[{"name":"小明","age":"10"},{"name":"小明","age":"10"}]

// 3、数组的元素是引用数据类型时，修改对象的某个属性
let objArr2 = [
    { name: '云牧', age: 28 },
    { name: '许嵩', age: 34 },
];

objArr2.forEach((item, index, arr) => {
    arr[index].name = '小明';
});
console.log(JSON.stringify(objArr2)); 
// 打印结果：[{"name":"小明","age":28},{"name":"小明","age":34}]
```



**总结**：

如果纯粹只是遍历数组，那么，可以用 forEach() 方法

但是，如果你想在遍历数组的同时，去改变数组里的元素内容，那么，最好是用 map() 方法来做，map() 方法本身会返回一个经过处理后全新的数组，不要用 forEach() 方法，避免出现一些低级错误




## sort() 介绍

`sort()`：对数组的元素进行从小到大来排序（会改变原来的数组）



### 如果在使用 sort() 方法时不带参，

默认排序顺序是在将元素转换为字符串按照**Unicode 编码**，从小到大进行排序

**举例 1**：（当数组中的元素为字符串时）

```js
let arr1 = ['e', 'b', 'd', 'a', 'f', 'c'];

let result = arr1.sort(); // 将数组 arr1 进行排序

console.log('arr1 =' + JSON.stringify(arr1));
console.log('result =' + JSON.stringify(result));
```

打印结果：

```js
arr1 =["a","b","c","d","e","f"]
result =["a","b","c","d","e","f"]
```

从上方的打印结果中，我们可以看到，sort 方法会改变原数组，而且方法的返回值也是同样的结果

**举例 2**：（当数组中的元素为数字时）

```js
let arr2 = [5, 2, 11, 3, 4, 1];

let result = arr2.sort(); // 将数组 arr2 进行排序

console.log('arr2 =' + JSON.stringify(arr2));
console.log('result =' + JSON.stringify(result));
```

打印结果：

```js
arr2 = [1,11,2,3,4,5]
result = [1,11,2,3,4,5]
```

上方的打印结果中，你会发现，使用 sort() 排序后，数字`11`竟然在数字`2`的前面。这是为啥呢？因为上面讲到了，`sort()`方法是按照**Unicode 编码**进行排序的。

那如果我想让 arr2 里的数字，完全按照从小到大排序，怎么操作呢？继续往下看。



### sort()方法：带参时，自定义排序规则



> 如果在 sort()方法中带参，我们就可以**自定义**排序规则。具体做法如下：
>
> 我们可以在 sort()添加一个回调函数，来指定排序规则。
>
> 回调函数中需要定义两个形参，浏览器将会分别使用数组中的元素作为实参去调用回调函数。
>
> 浏览器根据回调函数的返回值来决定元素的排序：（重要）
>
> - 如果 `compareFunction(a, b)` 小于 0 ，那么 a 会被排列到 b 之前；
> - 如果 `compareFunction(a, b)` 等于 0 ， a 和 b 的相对位置不变
> - 如果 `compareFunction(a, b)` 大于 0 ， b 会被排列到 a 之前
>
> 如果只是看上面的文字，可能不太好理解，我们来看看下面的例子，你肯定就能明白

```js
let arr = [5, 2, 11, 3, 4, 1];
arr.sort(function (a, b) {
  console.log("a：" + a, "b：" + b);
});
/*
  a：2 b：5
  a：11 b：2
  a：3 b：11
  a：4 b：3
  a：1 b：4
*/
```



举例：将数组中的数字按照从小到大排序

写法 1：

```js
let arr = [5, 2, 11, 3, 4, 1];

// 自定义排序规则
let result = arr.sort(function (a, b) {
    if (a > b) {
        // 如果 a 大于 b，则 b 排列 a 之前
        return 1;
    } else if (a < b) {
        // 如果 a 小于 b，，则 a 排列 b 之前
        return -1;
    } else {
        // 如果 a 等于 b，则位置不变
        return 0;
    }
});

console.log('arr =' + JSON.stringify(arr));
console.log('result =' + JSON.stringify(result));
```

打印结果：

```js
arr = [1, 2, 3, 4, 5, 11];
result = [1, 2, 3, 4, 5, 11];
```



上方代码的写法太啰嗦了，其实也可以简化为如下写法：

写法 2：

```js
let arr = [5, 2, 11, 3, 4, 1];

// 自定义排序规则
let result = arr.sort(function (a, b) {
    return a - b; // 升序排列
    // return b - a; // 降序排列
});

console.log('arr =' + JSON.stringify(arr));
console.log('result =' + JSON.stringify(result));
```

打印结果不变。

上方代码还可以写成 ES6 的形式，也就是将 function 改为箭头函数，其写法如下

**写法 3**：（箭头函数）

```js
let arr = [5, 2, 11, 3, 4, 1];

// 自定义排序规则
let result = arr.sort((a, b) => {
    return a - b; // 升序排列
});

console.log('arr =' + JSON.stringify(arr));
console.log('result =' + JSON.stringify(result));
```

上方代码，因为函数体内只有一句话，所以可以去掉 return 语句，继续简化为如下写法

**写法 4**：（推荐）

```js
let arr = [5, 2, 11, 3, 4, 1];

// 自定义排序规则：升序排列
let result = arr.sort((a, b) => a - b);

console.log('arr =' + JSON.stringify(arr));
console.log('result =' + JSON.stringify(result));
```

上面的各种写法中，写法 4 是我们在实战开发中用得最多的。

为了确保代码的简洁优雅，接下来的代码中，凡是涉及到函数，我们将尽量采用 ES6 中的箭头函数来写



## sort 方法举例：将数组按里面某个字段从小到大排序

将数组从小到大排序，这个例子很常见。但在实际开发中，总会有一些花样。

下面这段代码，在实际开发中，经常用到，一定要掌握。完整代码如下：

```js
let dataList = [
        {
          title: "品牌鞋子，高品质低价入手",
          publishTime: 200,
        },
        {
          title: "不是很贵，但是很暖",
          publishTime: 100,
        },
        {
          title: "无法拒绝的美食，跟我一起吃吃",
          publishTime: 300,
        },
      ];

 console.log("排序前的数组：" + JSON.stringify(dataList));

 // 将dataList 数组，按照 publishTime 字段，从小到大排序。（会改变原数组）
 dataList.sort((a, b) => parseInt(a.publishTime) - parseInt(b.publishTime));

 console.log("排序后的数组：" + JSON.stringify(dataList));
```



打印结果：

```js
排序前的数组：[
    {"title":"品牌鞋子，高品质低价入手","publishTime":200},
    {"title":"不是很贵，但是很暖","publishTime":100},
    {"title":"无法拒绝的美食，跟我一起吃吃","publishTime":300}
]

排序后的数组：[
    {"title":"不是很贵，但是很暖","publishTime":100},
    {"title":"品牌鞋子，高品质低价入手","publishTime":200},
    {"title":"无法拒绝的美食，跟我一起吃吃","publishTime":300}
]
```

上方代码中，有人可能会问： publishTime 字段已经是 nuber 类型了，为啥在排序前还要做一次 parseInt() 转换？

这是因为，这种数据一般是后台接口返回给前端的，数据可能是 number 类型、也可能是 string 类型，所以还是统一先做一次 parseInt() 转换数字比较保险。这是一种良好的工作习惯。

其实上面定义时最好优先使用const，能更多保证程序安全，当需要变量时请采用let。

最后悄悄说句像 forEach、map 、filter、some、every、find、findIndex 这些数组原型上的方法除了可以接受第一个回调函数，同时可以接受第二个值用来指定前面回调函数里 this 值（很少用），但是也要注意如果回调函数如果使用箭头函数则无法绑定 this，因为箭头函数没有 this， 始终是取自上层作用域的 this（面试常考，箭头函数也没有 arguments 不过可以使用剩余参数...解决）。