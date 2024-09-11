**在 JS 中，基于 reduce()，我们不仅能够推导出其它数组方法，更能够推导出经典的函数组合过程。**

## Reduce 工作流分析
来看看 reduce 的工作流特征：
```javascript
const arr = [1, 2, 3]

// 0 + 1 + 2 + 3 
const initialValue = 0  
const add = (previousValue, currentValue) => previousValue + currentValue
const sumArr = arr.reduce(
  add,
  initialValue
)

console.log(sumArr)
// expected output: 6
```

1. 执行回调函数 add()，入参为(initialValue, arr[0])。这一步的计算结果为记为 sum0，sum0=intialValue + arr[0]，此时剩余待遍历的数组内容为 [2, 3]，待遍历元素2个。
2. 执行回调函数 add()，入参为 (sum0, arr[1])。这一步的计算结果记为 sum1，sum1 = sum0 + arr[1]，此时剩余待遍历的数组内容为 [3] ，待遍历元素1个。
3. 执行回调函数 add()，入参为 (sum1, arr[2])，这一步的计算结果记为 sum2，sum2 = sum1 + arr[2]，此时数组中剩余待遍历的元素是 []，遍历结束。
4. 输出 sum2 作为 reduce() 的执行结果， sum2 是一个单一的值。

上面代码的过程本质上是一个循环调用 add() 函数的过程，上一次  add() 函数调用的输出，会成为下一次  add() 函数调用的输入：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690472916811-a28400c0-6e6e-40b6-9694-979194a1be87.png#averageHue=%23fbfaf7&clientId=u8fff88e3-03ec-4&from=paste&height=120&id=u478d9297&originHeight=240&originWidth=1320&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75448&status=done&style=none&taskId=u0efb02a5-fb20-4abd-839c-1f5c9ee1990&title=&width=660)

## 用 reduce() 推导 map()
map：
```javascript
[1,2,3]map((num)=> num + 1)
```
用 reduce() 推导 map()：
```javascript
function add1AndPush(previousValue, currentValue) {
  // previousValue 是一个数组
  previousValue.push(currentValue + 1)
  return previousValue
}
```
用 reduce() 去调用这个 add1AndPush()：
```javascript
const arr = [1, 2, 3]
const newArray = arr.reduce(add1AndPush, [])
```
这段代码的工作内容和楼上我们刚分析过的 map() 是等价的。<br />reduce(add1AndPush, [])这个过程对应的函数调用链，它长这样：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690473425500-1cd43632-668c-4fee-ae0b-9d07d10482f3.png#averageHue=%23faf9f7&clientId=u8fff88e3-03ec-4&from=paste&height=125&id=u55fe35da&originHeight=250&originWidth=1310&originalType=binary&ratio=2&rotation=0&showTitle=false&size=82588&status=done&style=none&taskId=uc627e950-f4b2-4c82-af7a-c00f1175dd2&title=&width=655)

## Map 和 Reduce 之间的逻辑关系
map() 的过程本质上也是一个 reduce() 的过程。<br />reduce() 本体的回调函数入参可以是任何值，出参也可以是任何值。<br />而 map 则是一个相对特殊的 reduce() ，它锁定了一个数组作为每次回调的第一个入参，并且限定了 reduce() 的返回结果只能是数组。

## reduce() 映射了函数组合思想
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690472916811-a28400c0-6e6e-40b6-9694-979194a1be87.png#averageHue=%23fbfaf7&clientId=u8fff88e3-03ec-4&from=paste&height=120&id=vLZda&originHeight=240&originWidth=1320&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75448&status=done&style=none&taskId=u0efb02a5-fb20-4abd-839c-1f5c9ee1990&title=&width=660)<br />通过观察这个工作流，我们可以发现这样两个特征：

- reduce() 的回调函数在做参数组合
- reduce() 过程构建了一个函数 pipeline
### reduce() 的回调函数在做参数组合
就 reduce() 过程中的单个步骤来说，每一次回调执行，是把 2 个入参被【**组合**】进了 callback 函数里，最后转化出 1 个出参的过程。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690473675406-d4204680-c1f7-467a-ba8c-92d353ef341a.png#averageHue=%23fcfbf9&clientId=u8fff88e3-03ec-4&from=paste&height=225&id=ue27ea6c3&originHeight=450&originWidth=1296&originalType=binary&ratio=2&rotation=0&showTitle=false&size=143023&status=done&style=none&taskId=uc2faf2f3-e4ca-47b7-a5e9-b845720d5f7&title=&width=648)<br />educe 方法把多个入参，reduce（减少）为一个出参 。

### reduce() 过程是一个函数 pipeline
每次调用的都是同一个函数，但上一个函数的输出，总是会成为下一个函数的输入。<br />但上面 reduce() pipeline 里的每一个任务都是一样的，都是 add()，仅仅是入参不同：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690472916811-a28400c0-6e6e-40b6-9694-979194a1be87.png#averageHue=%23fbfaf7&clientId=u8fff88e3-03ec-4&from=paste&height=120&id=MtfjX&originHeight=240&originWidth=1320&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75448&status=done&style=none&taskId=u0efb02a5-fb20-4abd-839c-1f5c9ee1990&title=&width=660)<br />reduce()既然都能组合参数了，那能不能组合函数呢，当然可以，后文再说。

## 链式调用
```javascript
// 用于筛选大于2的数组元素
const biggerThan2 = num => num > 2  
// 用于做乘以2计算
const multi2 = num => num * 2    
// 用于求和
const add = (a, b) => a + b   

// 完成步骤 1
const filteredArr = arr.filter(biggerThan2)    
// 完成步骤 2
const multipledArr = filteredArr.map(multi2)    
// 完成步骤 3
const sum = multipledArr.reduce(add, 0)
```
上面代码如果我只需要 sum 的结果，那 filteredArr 和  multipledArr 就是没有必要的中间变量。<br />我们可以借助链式调用构建声明式的数据流：
```javascript
const sum = arr.filter(biggerThan2).map(multi2).reduce(add, 0)
```
链式调用的本质 **，是通过在方法中返回对象实例本身的 this/ 与实例 this 相同类型的对象，达到多次调用其原型（链）上方法的目的。**

## 函数组合但回调地狱
这里我直接定义几个极简的独立函数，代码如下：
```javascript
function add4(num) {
	return num + 4
}

function multiply3(num) {
	return num * 3
}

function divide2(num) {
	return num / 2
}
```
我们组合一下：
```javascript
const sum =  add4(multiply3(divide2(num)))
```
已经开始套娃执行了，我们不断把内部函数的执行结果套进下一个外部函数里作为入参。<br />如何摆脱回调地狱？<br />可以使用链式调用。

## 借助 reduce 推导函数组合
我们把**待组合的函数放进一个数组里，然后调用这个函数数组的 reduce 方法**，就可以创建一个或多个函数组成的工作流。<br />而这，正是市面上主流的函数式库实现 compose/pipe 函数的思路。

## 借助 reduce 推导 pipe
顺着这个思路，我们来考虑这样一个函数数组：
```javascript
const funcs = [func1, func2, func3]
```
我想要逐步地组合调用 funcs 数组里的函数，得到一个这样的声明式数据流：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690559049542-b240d703-8922-4a5d-9290-16dc5f3fa54d.png#averageHue=%23f6f5f3&clientId=u648193bb-e28a-4&from=paste&height=79&id=u8dec477e&originHeight=158&originWidth=1264&originalType=binary&ratio=2&rotation=0&showTitle=false&size=40248&status=done&style=none&taskId=u94d165a4-3fcf-4144-8fcc-1fcd234ee49&title=&width=632)<br />如果借助 reduce ，数据流向好像有所区别；<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1690559218600-83a6b9ea-e570-4ae3-b7cb-e046829b5db5.png#averageHue=%23faf9f7&clientId=u648193bb-e28a-4&from=paste&height=118&id=u90cd2808&originHeight=236&originWidth=1336&originalType=binary&ratio=2&rotation=0&showTitle=false&size=79446&status=done&style=none&taskId=ud181ef49-3bc0-4c85-86fc-db272c662a1&title=&width=668)<br />如何对齐？首先是入参的对齐，我们只需要把 initialValue 设定为 0 就可以了：
```javascript
const funcs = [func1, func2, func3]  

funcs.reduce(callback, 0)
```
后续我们应该让  callback(0, func1) = func1(0)。<br />callback(value1, func2) = func2(value1)。<br />callback(value2, func3) = func3(value2)。<br />callback(input, func) = func(input)。<br />推导至此，我们就得到了 callback 的实现：
```javascript
function callback(input, func) {
  func(input)
}

funcs.reduce(callback, 0)
```
封装下：
```javascript
// 使用展开符来获取数组格式的 pipe 参数
function pipe(...funcs) {
	function callback(input, func) {
		return func(input)
	}

	return function (param) {
		return funcs.reduce(callback, param)
	}
}
```

## 验证 pipe：串联数字计算逻辑
```javascript
function add4(num) {
	return num + 4
}

function multiply3(num) {
	return num * 3
}

function divide2(num) {
	return num / 2
}
```
之前我们使用回调形式，如今我们可以使用 pipe：
```javascript
const compute = pipe(add4, multiply3, divide2)
```
 compute 的函数就是 add4, multiply3, divide2 这三个函数的“合体”版本。
```javascript
// 输出 21
console.log(compute(10))
```

## compose：倒序的 pipe
pipe 用于创建一个正序的函数传送带，而 compose 则用于创建一个倒序的函数传送带。<br />我们只需把上面函数里的 reduce 改成 reduceRight：
```javascript
// 使用展开符来获取数组格式的 pipe 参数
function compose(...funcs) {
	function callback(input, func) {
		return func(input)
	}

	return function (param) {
		return funcs.reduceRight(callback, param)
	}
}
```
我们需要把入参倒序传递，如下：
```javascript
const compute = compose(divide2, multiply3, add4)
```
面向对象的核心在于继承，而**函数式编程的核心则在于组合**。
