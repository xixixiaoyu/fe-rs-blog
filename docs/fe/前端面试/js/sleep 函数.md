在 JavaScript 中，我们经常需要控制代码的执行节奏，比如模拟网络延迟、动画间隔等。

如果直接用传统的同步方式（比如 `while` 循环）来“卡住”程序运行，会导致页面卡死，用户体验非常差。所以，我们需要一种异步的方式来实现暂停功能。



### 使用 Promise 和 setTimeout

```javascript
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
```

可以通过 `async/await` 来使用这个 `sleep` 函数：

```javascript
async function run() {
  console.log('开始')
  await sleep(2000)  // 暂停 2 秒
  console.log('2 秒后')
}

run()
```

- `sleep(2000)` 会返回一个 `Promise`，这个 `Promise` 会在 2 秒后被 `resolve`。
- `await sleep(2000)` 会让程序暂停 2 秒，然后再继续执行后面的代码。





