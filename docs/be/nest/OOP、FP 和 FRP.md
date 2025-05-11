## OOP (Object-Oriented Programming) - 面向对象编程
oop 的主要思想是把数据和操作这些数据的方法（函数）捆绑在一起，形成一个“对象”。程序就是由一堆这样的对象互相协作来完成任务的。

**主要特点：**

+ **封装 (Encapsulation)：**把对象的内部细节藏起来，只对外暴露一些必要的接口（方法）来跟它打交道。
+ **继承 (Inheritance)：**子类可以自动拥有父类的属性和方法，并且还能有自己独特的东西。
+ **多态 (Polymorphism)：** “同样的行为，不同对象做出来效果不一样”。比如，你对“动物”下达“叫”的指令，狗会“汪汪”，猫会“喵喵”。同一个 `makeSound()` 方法，不同的动物对象调用，表现不同。

封装让代码更安全，也更容易维护，继承则可以代码复用，多态让代码更灵活，扩展性更好。

```javascript
// 定义一个“动物”类 (父类)
class Animal {
  constructor(name) {
    this.name = name
  }

  speak() {
    console.log(`${this.name} 发出了一些声音`)
  }
}

// 定义一个“狗”类，继承自“动物”
class Dog extends Animal {
  constructor(name, breed) {
    super(name) // 调用父类的 constructor
    this.breed = breed
  }

  speak() { // 重写父类的方法 (多态的一种体现)
    console.log(`${this.name} 汪汪叫!`)
  }

  fetch() {
    console.log(`${this.name} 跑去捡球了`)
  }
}

let myDog = new Dog('旺财', '哈士奇')
myDog.speak() // 输出: 旺财 汪汪叫!
myDog.fetch() // 输出: 旺财 跑去捡球了

let genericAnimal = new Animal('某动物')
genericAnimal.speak() // 输出: 某动物 发出了一些声音
```

当你处理的系统比较复杂，有很多实体和它们之间的交互时，OOP 非常有用。比如游戏开发、企业级应用等。它能帮你把复杂问题拆解成一个个小模块（对象），让代码结构更清晰。



## FP (Functional Programming) - 函数式编程
想象一下数学里的函数，比如 `y = f(x)`。

FP  把程序看作是一系列数学函数的组合。你给函数一个输入，它就给你一个输出。强调的是“纯函数 (Pure Functions)”，避免副作用 (Side Effects) 和共享状态 (Shared State)。

主要特点：

+ **纯函数 (Pure Functions)：**给它同样的输入，永远得到同样的输出，并且不会改变函数外部的任何东西（没有副作用）。
+ **不可变性 (Immutability)：**数据一旦创建，就不能被修改。如果你想改，那就创建一个新的数据副本，在副本上改。
+ **函数是一等公民 (First-class Functions)：** 函数跟普通变量一样，可以赋值给其他变量，可以作为参数传递给别的函数，也可以作为函数的返回值。
+ **高阶函数 (Higher-Order Functions)：**能接收函数作为参数，或者能返回一个函数的函数。常见的 `map`, `filter`, `reduce` 就是高阶函数。

纯函数使结果可预测，不可变性减少了意外修改的麻烦，一等公民可以写出更简洁强大的代码，高阶函数则可以抽离通用操作，让代码更精炼。

```javascript
// 纯函数示例：加法
function add(a, b) {
  return a + b // 同样输入，同样输出，无副作用
}

// 不可变性示例 (通常配合库或特定写法)
const numbers = [1, 2, 3]
// 想添加一个元素，不是修改原数组，而是创建一个新数组
const newNumbers = [...numbers, 4] // numbers 还是 [1, 2, 3]

// 高阶函数示例：map
const names = ['Alice', 'Bob', 'Charlie']
const greetings = names.map(name => `Hello, ${name}!`)
// greetings 会是: ['Hello, Alice!', 'Hello, Bob!', 'Hello, Charlie!']
// map 接收了一个箭头函数作为参数
```

当你需要处理数据转换、并发程序，或者希望代码更简洁、可预测、易于测试时，FP 是个好选择。

很多现代前端框架（如 React）和数据处理库都大量借鉴了 FP 的思想。



## FRP (Functional Reactive Programming) - 函数响应式编程
这个稍微复杂一点，可以看作是 FP 在处理“随时间变化的数据流”上的应用。

FRP 把所有东西都看成是“流 (Streams)”。比如用户点击鼠标、键盘输入、网络请求响应等等，这些都是一连串的事件或数据，就像水流一样。你用函数式的方法来处理和响应这些流。

主要特点：

+ **数据流 (Streams / Observables)：** 一系列随时间发生的事件或数据。想象一下水龙头里流出来的水，或者股票市场上不断变化的股价。
+ **响应式 (Reactive)：**当流中的数据发生变化时，相关的处理会自动执行。就像 Excel 表格，你改了一个单元格的数字，依赖这个单元格的其他单元格会自动更新计算结果。
+ **函数式操作符 (Functional Operators)：** 提供一堆像 `map`, `filter`, `merge`, `debounce` (防抖) 这样的函数式工具，用来组合、转换、过滤这些数据流。

实现 FRP ，通常我们会使用 **RxJS **这样的库，想象一下我们想实现：用户在搜索框里输入文字，停顿 300 毫秒后才真正去搜索：

```javascript
// 这只是一个概念性的伪代码，实际需要 RxJS 这样的库
// import { fromEvent } from 'rxjs'
// import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

// 假设 searchInput 是一个输入框 DOM 元素
// 1. 从输入框的 'input' 事件创建一个事件流
const inputStream = fromEvent(searchInput, 'input')

inputStream.pipe(
  map(event => event.target.value),     // 2. 从事件对象中提取输入的值 (转换流)
  debounceTime(300),                  // 3. 防抖：300ms 内没有新输入才让数据通过
  distinctUntilChanged(),             // 4. 只有当值真正改变时才通过
  switchMap(query => searchApi(query)) // 5. 用最新的查询值去调用搜索 API (切换到新的结果流)
).subscribe(results => {
  // 6. 订阅结果流，拿到搜索结果并更新 UI
  displayResults(results)
})

// searchApi(query) 是一个返回 Promise 或 Observable 的函数
// function searchApi(query) { ... }
// function displayResults(results) { ... }
```

FRP 非常适合处理复杂的异步场景和用户界面交互。比如：

+ UI 事件处理（点击、拖拽、输入等）
+ 实时数据更新（聊天、股票行情）
+ 复杂的异步流程编排（多个网络请求依赖关系）

它能让你的异步代码更清晰、更易于管理，避免所谓的“回调地狱 (Callback Hell)”。



## 总结
+ **OOP (面向对象)：** 把世界看作一堆对象，每个对象有自己的属性和行为。适合构建结构清晰的大型应用。
+ **FP (函数式)：** 把程序看作数学函数的组合，强调纯函数和不可变性。适合数据处理、并发和追求代码简洁可预测的场景。
+ **FRP (函数响应式)：** 用函数式的方法处理随时间变化的数据流。是处理复杂异步和 UI 交互的利器。

这三者并不是互斥的，很多时候可以结合使用它们各自的优点。比如，你可以在一个 OOP 构建的系统里，用 FP 的思想来处理某些数据转换逻辑，或者用 FRP 来管理 UI 的异步事件。

