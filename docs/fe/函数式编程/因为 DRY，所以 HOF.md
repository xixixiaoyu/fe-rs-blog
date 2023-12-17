DRY(Don't Repeat Yourself) 是一种软件设计原则，“不要重复你自己”，代码要学会封装和复用。<br />HOF(High Order Function)指高阶函数。<br />比如以下代码：
```javascript
// 迭代做加法
function arrAdd1(arr) {
	const newArr = []
	for (let i = 0; i < arr.length; i++) {
		newArr.push(arr[i] + 1)
	}
	return newArr
}

// 迭代做乘法
function arrMult3(arr) {
	const newArr = []
	for (let i = 0; i < arr.length; i++) {
		newArr.push(arr[i] * 3)
	}
	return newArr
}

// 迭代做除法
function arrDivide2(arr) {
	const newArr = []
	for (let i = 0; i < arr.length; i++) {
		newArr.push(arr[i] / 2)
	}
	return newArr
}

// 输出 [2, 3, 4]
console.log(arrAdd1([1, 2, 3]))
// 输出 [3, 6, 9]
console.log(arrMult3([1, 2, 3]))
// 输出 [1, 2, 3]
console.log(arrDivide2([2, 4, 6]))
```

1. 迭代做加法：函数入参为一个数字数组，对数组中每个元素做 +1 操作，并把计算结果输出到一个新数组 newArr。<br />fe：输入 [1,2,3]，输出 [2,3,4]
2. 迭代做乘法：函数入参为一个数字数组，对数组中每个元素做 *3 操作，并把计算结果输出到一个新数组 newArr。<br />fe：输入 [1,2,3]，输出 [3,6,9]
3. 迭代做除法：函数入参为一个数字数组，对数组中每个元素做 /2 操作，并把计算结果输出到一个新数组 newArr。<br />fe：输入 [2,4,6]，输出 [1,2,3]

上面代码，不符合 DRY 原则。

## DRY 原则的 JS 实践：HOF(高阶函数）
对于上面三个函数来说，迭代 loop、数组 push 动作都是一毛一样的，变化的仅仅是循环体里的数学算式而已：
```javascript
// +1 函数
function add1(num) {
	return num + 1
}

// *3函数
function mult3(num) {
	return num * 3
}

// /2函数
function divide2(num) {
	return num / 2
}

function arrCompute(arr, compute) {
	const newArr = []
	for (let i = 0; i < arr.length; i++) {
		// 变化的算式以函数的形式传入
		newArr.push(compute(arr[i]))
	}
	return newArr
}

// 输出 [2, 3, 4]
console.log(arrCompute([1, 2, 3], add1))
// 输出 [3, 6, 9]
console.log(arrCompute([1, 2, 3], mult3))
// 输出 [1, 2, 3]
console.log(arrCompute([2, 4, 6], divide2))
```
arrCompute() 函数，就是一个高阶函数。<br />**高阶函数，指的就是接收函数作为入参，或者将函数作为出参返回的函数。**

<br />
