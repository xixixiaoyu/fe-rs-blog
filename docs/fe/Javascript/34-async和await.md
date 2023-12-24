# async/await

MDN文档 [async函数 - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

- 语法介绍
- 和 Promise 的关系
- 异步本质
- for...of

**有很多 async 的面试题，例如**

- async 直接返回，是什么
- async 直接返回 promise
- await 后面不加 promise
- 等等，需要找出一个规律





## 语法介绍

用同步的方式，编写异步。

```js
//promise异步加载图片
let loadImg = (url) => {
    const p = new Promise((resolve, reject) => {
        let newImg = document.createElement("img");

        newImg.src = url;

        newImg.onload = function () {
            resolve(newImg);
        };

        newImg.onerror = function () {
            reject(new Error(`Could not load Image at ${url}`));
        };
    });

    return p;
};
const url1 = "https://s1.ax1x.com/2020/09/26/0irm1P.jpg";
const url2 = "https://s1.ax1x.com/2020/09/26/0irQ0g.jpg";

async function loadImg1() {
    const img1 = await loadImg(url1);
    return img1;
}

(async function () {
    // 注意：await 必须放在 async 函数中，否则会报错
    try {
        // 加载第一张图片 await后面跟一个async函数执行
        const img1 = await loadImg1();
        console.log(img1)
        // 加载第二张图片 await后面跟一个pormise
        const img2 = await loadImg(url2);
        console.log(img2)
    } catch (err) {
        console.error(err)
    }
})()
```



## 和 Promise 的关系

- async 函数返回结果都是 Promise 对象（如果函数内没返回 Promise ，则自动封装一下）

```js
async function fn2() {
    return new Promise(() => {})
}
console.log( fn2() )

async function fn1() {
    return 100
}
console.log( fn1() ) // 相当于 Promise.resolve(100)
```

- await 后面一般跟 Promise 对象：会阻断后续代码，等待状态变为 resolved ，才获取结果并继续执行
- await 后续跟非 Promise 对象：会直接此值作为返回值

```js
(async function () {
    const p1 = new Promise(() => {})
    await p1
    console.log('p1') // 不会执行
})()

(async function () {
    const p2 = Promise.resolve(100)
    const res = await p2
    console.log(res) // 100
})()

(async function () {
    const res = await 100
    console.log(res) // 100
})()

(async function () {
    const p3 = Promise.reject('some err')
    const res = await p3
    console.log(res) // 不会执行
})()


function timeout(){
    return new Promise(resolve => {
        setTimeout(() => {
            //console.log(1);
            resolve(1);
        },1000)
    })
}
async function fn(){
    const res = await timeout(); //等待Promise变为成功才执行后面的代码
    console.log(res);
    console.log(2);
}

fn();
```

- await 必须写在 async 函数中, 但 async 函数中可以没有 await
- 如果 await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理

```js
(async function () {
    const p4 = Promise.reject('some err')
    try {
        const res = await p4
        console.log(res)
    } catch (ex) {
        console.error(ex)
    }
})()
```

总结来看：

- async 封装 Promise
- await 处理 Promise 成功
- try...catch 处理 Promise 失败

## 异步本质

await 是同步写法，但本质还是异步调用。

```js
async function async1() {
    console.log("async1 start"); //2 重要
    await async2();
    //   await下面 都可以看做是回调函数callback里面的内容 即异步但是是微任务
    //  setTimeout(() => {console.log("async1 end"); })
    //	Promise.resolve().then(() => {    console.log("async1 end"); })  微任务和宏任务
    console.log("async1 end"); //5

}

async function async2() {
    console.log("async2"); // 3 重要
}

console.log("script start"); //1
async1();
console.log("script end"); // 4
```

即，只要遇到了 `await` ，后面的代码都相当于放在 callback 里。



```js
async function async1() {
    console.log("async1 start"); //2
    await async2();
    console.log("async1 end1"); // 5
    await async3();
    console.log("async1 end2"); //7
}

async function async2() {
    console.log("async2"); //3
}

async function async3() {
    console.log("async3"); //6
}

console.log("script start"); //1
async1();
console.log("script end"); //4
```



## for...of

```js
// 定时算乘法
function multi(num) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(num * num)
        }, 1000)
    })
}

// // 使用 forEach ，是 1s 之后打印出所有结果，即 3 个值是一起被计算出来的
// function test1 () {
//     const nums = [1, 2, 3];
//     nums.forEach(async x => {
//         const res = await multi(x);
//         console.log(res);
//     })
// }
// test1();

// 使用 for...of ，可以让计算挨个串行执行
async function test2 () {
    const nums = [1, 2, 3];
    for (let x of nums) {
        // 在 for...of 循环体的内部，遇到 await 会挨个串行计算
        const res = await multi(x)
        console.log(res)
    }
}
test2()
```