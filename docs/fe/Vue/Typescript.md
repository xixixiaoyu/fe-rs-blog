## 	0.强类型 VS 弱类型 静态类型 VS 动态类型

- 强类型不允许任意的隐式类型转换，而弱类型允许
- 静态类型：一个变量声明时它的类型就是明确的，声明过后,它的类型就不允许再修改
- 动态类型：运行阶段才能够明确变量类型，而且变量的类型随时可以改变

弱类型的缺陷：

- 程序中的异常在运行时才能发现
- 类型不明确函数功能会发生改变
- 对对象索引器的错误用法

强类型的优势：

- 错误更早暴露
- 代码更智能，编码更准确
- 重构更牢靠
- 减少不必要的类型判断

## 1.Typscript 的介绍

![image-20220107154243401](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220107154243401.png)

TypeScript 是 JavaScript 的一个超集，主要提供了**类型系统** 和**对 ES6+ 的支持**

TypeScript 主要有 3 大特点：

- 始于 JavaScript，归于 JavaScript

- 强大的类型系统。

- 先进的 JavaScript 提案支持

总结：TypeScript 在社区的流行度越来越高，它非常适用于一些大型项目，也非常适用于一些基础库，极大地帮助我们提升了开发效率和体验

## 2. 安装编写 TypeScript

### 安装 TS

命令行运行如下命令，全局安装 TypeScript

```
yarn add typescript --dev
```

安装完成后，在控制台运行如下命令，检查安装是否成功(3.x)：

```
tsc -V
```

### 编写 TS 程序

src/helloworld.ts

```typescript
// TypeScript 可以完全按照JavaScript 标准语法编码
const hello = (name: string) => {
  console.log(`hello, ${name}`);
};

hello("TypeScript");
```

### 手动编译代码

我们使用了 `.ts` 扩展名，但是这段代码仅仅是 JavaScript 而已。

在命令行上，运行 TypeScript 编译器：

```bash
tsc helloworld.ts
```

输出结果为一个 `helloworld.js` 文件，它包含了和输入文件中相同的 JavsScript 代码。

在命令行上，通过 Node.js 运行这段代码：

```bash
node helloworld.js
```

控制台输出：

```text
Hello, Yee
```

### vscode 自动编译

```shell
1). 生成配置文件tsconfig.json
    tsc --init
2). 修改tsconfig.json配置
    "outDir": "./js",
    "strict": false,
3). 启动监视任务:
    终端 -> 运行任务 -> 监视tsconfig.json
```

## 3.Flow

### 1.Flow 是 JavaScript 类型检查器

- https://www.saltycrane.com/cheat-sheets/flow-type/latest/

```js
// : number 叫做类型注解
function sum(a: number, b: number) {
  return a + b;
}
console.log(sum(1, 2));
```

### 2. 如何安装并使用 flow

1.  先执行`yarn init -y`

2.  执行`yarn add flow-bin`

3.  在代码中第一行添加 flow 注释：` // @flow`

4.  在函数中形参后面加上冒号和类型：`function sum (a: number, b: number)`

5.  执行`yarn flow init`创建.flowconfig

6.  执行`yarn flow`

```js
// @flow
// : number 叫做类型注解
function sum(a: number, b: number) {
  return a + b;
}
console.log(sum(1, 2));

console.log(sum("100", "100"));
```

### 3. 如何使得编译后移除 flow 注解

flow 官方提供的操作:

- `yarn add flow-remove-types --dev`

- `yarn flow-remove-types src -d dist`

使用 babel 配合 flow 转换的插件:

- `yarn add @babel/core @babel/cli @babel/preset-flow --dev`

- `.babelr`文件:

  ```js
  {
    "presets": ["@babel/preset-flow"]
  }
  ```

- `yarn babel src -d dist`

### 4. 开发工具插件

VSCode 中的插件：Flow Language Support

### 5.Flow 支持的类型

```js
/**
 * 原始类型
 * @flow
 */

const a: string = "foo";

const b: number = Infinity; // NaN // 100

const c: boolean = false; // true

const d: null = null;

const e: void = undefined;

const f: symbol = Symbol();

const arr: Array<number> = [1, 2, 3];

const arr2: number[] = [1, 2, 3];

// 元组
const foo: [string, number] = ["foo", 100];

const obj1: { foo: string, bar: number } = { foo: "string", bar: 100 };

// 问号表示可有可与的属性
const obj2: { foo?: string, bar: number } = { bar: 100 };

// 表示当前对象可以添加任意个数的键，不过键值的类型都必须是字符串
const obj3: { [string]: string } = {};
obj3.key1 = "value1";
// obj3.key2 = 100

function fn(callback: (string, number) => void) {
  callback("string", 100);
}

fn(function (str, n) {});

const fo: "foo" = "foo";

// 联合类型，变量的值只能是其中之一
const type: "success" | "warning" | "danger" = "success";

// 变量类型只能是其中的一种类型
const g: string | number = 100;

type StringOrNumber = string | number;
const h: StringOrNumber = "stri"; // 100

// maybe类型 加一个问号，变量除了可以接受number类型以外，还可以接受null或undefined
const gender: ?number = null;
// 相当于
// const gender: number | null | void = undefined

// Mixed / Any  mixed是强类型，any是弱类型，为了兼容老代码，是不安全的，尽量不用any
// string | number | boolean |...
function passMixed(value: mixed) {}
passMixed("string");
passMixed(100);

function passAny(value: any) {}
passAny("string");
passAny(100);

const element: HTMLElement | null = document.getElementById("root");
```

运行环境相关声明文件

- https://github.com/facebook/flow/blob/master/lib/core.js
- https://github.com/facebook/flow/blob/master/lib/dom.js
- https://github.com/facebook/flow/blob/master/lib/bom.js
- https://github.com/facebook/flow/blob/master/lib/cssom.js
- https://github.com/facebook/flow/blob/master/lib/node.js

## 4.Typescript 语法

TypeScript：JavaScript 的超集/扩展集

PS：个人习惯: 默认情况下, 如果可以推导出对应的标识符的类型时

### 1.原始数据类型

```ts
const a1: string = "foobar";
const a2: string = 'foobar';
const a3: string = `foobar`;

// number也包含NaN、Infinity
let b: number = 10;

const c: boolean = true;

// const d: boolean = null // 严格模式下不支持赋值null

const e: void = undefined; // 函数没有返回值时的返回值类型

const f: null = null;

const g: undefined = undefined;

const title1 = Symbol("title");
const title2 = Symbol("title");
const info = {
  [title1]: "程序员",
  [title2]: "老师",
};
```

### 2.TS 标准库声明

标准库就是内置对象所对应的声明

在 tsconfig.json 中写上：

```
"lib": ["ES2015", "DOM"],
```

### 3.中文错误消息

```shell
 yarn tsc --locale zh-CN
```

### 4.作用域

TS 每个文件都是全局作用域，所以在不同文件中定义同名变量会报错，解决方案：

1. 使用立即执行函数，产生作用域

```ts
(function () {
  const a = 123;
})();
```

2. 使用 export

```ts
const a = 11;
export {}; // 确保跟其他实例没有成员冲突
```

### 5.Object 类型

> TypeScript 中的 object 类型泛指所有的的非原始类型，如对象、数组、函数
>
> 对象的赋值必须与定义的属性保持一致，不能多也不能少。更专业的写法是用接口

```ts
export {}; // 确保跟其他实例没有成员冲突

const foo: object = function () {}; // [] // {}

const obj: { foo: number; bar: string } = { foo: 123, bar: "string" };

// 数组泛型，Array<元素类型> 与react jsx有冲突
const arr1: Array<number> = [1, 2, 3];

// 元素类型后面接上[]，表示由此类型元素组成的一个数组
const arr2: number[] = [1, 2, 3];

// 自动推导
const arr3 = [1, 2, 3];

function sum(...args: number[]) {
  return args.reduce((prev, current) => prev + current, 0);
}
sum(1, 2, 3);
```

### 6.元组类型

- 已知元素数量和类型的数组，例如 `Object.entries(obj)` 的返回值里面的每一个元素都是一个元组
- 声明元组一定要指明类型

```js
export {};

const tuple: [number, string] = [18, "yunmu"];

// 下标取值
// const age = tuple[0]
// const name = tuple[1]

// 数组解构
const [age, name] = tuple;
```

Hooks 里的元组：

```ts
function useState<T>(state: T): [T, (newState: T) => void] {
  let currentState = state;
  const changeState = (newState: T) => {
    currentState = newState;
  };
  // const info: [string, number] = ["abc", 18];
  const tuple: [T, (newState: T) => void] = [currentState, changeState];
  return tuple;
}

const [counter, setCounter] = useState(10);
setCounter(1000);
const [title, setTitle] = useState("abc");
const [flag, setFlag] = useState(true);
```

### 7.枚举类型

```ts
// JS中没有枚举类型，则使用对象模拟枚举类型
// const PostStatus = {
//   Draft: 0,
//   Uppublished: 1,
//   Published: 2
// }

// 枚举类型。使用时和对象属性一样
// 如果不指定值，则从0开始累加。如果制定了第一个成员的值，后面的成员则再第一个成员基础上累加。值如果是字符串，就得指定具体的值
const enum PostStatus {
  Draft = 0,
  Uppublished = 1,
  Published = 2
}

const post = {
  title: 'Hello TypeScript',
  content: 'Type...',
  status: PostStatus.Draft
}
// 如果不会使用这种索引器的方式访问枚举，可以在 enum 前面加上 const 变为常量枚举
PostStatus[0] => Draft
```

小 Case：

```ts
enum Direction {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}

function turnDirection(direction: Direction) {
  switch (direction) {
    case Direction.LEFT:
      console.log("改变角色的方向向左");
      break;
    case Direction.RIGHT:
      console.log("改变角色的方向向右");
      break;
    case Direction.TOP:
      console.log("改变角色的方向向上");
      break;
    case Direction.BOTTOM:
      console.log("改变角色的方向向下");
      break;
    default:
      const foo: never = direction;
      break;
  }
}

turnDirection(Direction.LEFT);
turnDirection(Direction.RIGHT);
turnDirection(Direction.TOP);
turnDirection(Direction.BOTTOM);
```

### 8.函数类型

```ts
// 获取不确定参数 一般顺序 必传参数 - 有默认值的参数 - 可选参数
// function func1 (a: number, b: number): string {}
// function func1 (a: number, b?: number): string {}
// function func1 (a: number, b: number = 10): string {}
function func1(a: number, b: number = 10, ...rest: number[]): string {
  return "func1";
}

func1(100, 200);

func1(100);

func1(100, 200, 300);

// 指定函数的形式
type AddFnType = (num1: number, num2: number) => number;
const func2: AddFnType = function (a: number, b: number): string {
  return a1 + a2;
};

// 参数readonly
function reverseSorted(input: readonly number[]): number[] {
  // return input.sort().reverse()  会产生副作用 给参数加上readonly
  // return input.slice().sort().reverse()
  return [...input].sort().reverse();
}


const names = ["abc", "cba", "nba"];
// item根据上下文的环境推导出来的string, 这个时候可以不添加的类型注解，因为函数执行的上下文可以帮助确定参数和返回值的类型
names.forEach(function (item) {
  console.log(item.split(""));
});

//函数默认返回void
function sum(num1: number, num2: number): void {
  console.log(num1 + num2);
}

// this类型 默认推导，也可以指定this类型，必须是参数的第一位
type ThisType = { name: string };

function eating(this: ThisType, message: string) {
  console.log(this.name + " eating", message);
}

// 显示绑定
eating.call({ name: "kobe" }, "呵呵呵");
eating.apply({ name: "james" }, ["嘿嘿嘿"]);
```

#### 函数重载

- 如果我们编写了一个 add 函数，希望可以对字符串和数字类型进行相加，应该如何编写呢？

```ts
function add(a1: number | string, a2: number | string) {
  return a1 + a2; // 报错
}

// 方式一：联合类型
function add(a1: number | string, a2: number | string) {
  if (typeof a1 === "number" && typeof a2 === "number") {
    return a1 + a2;
  } else if (typeof a1 === "string" && typeof a2 === "string") {
    return a1 + a2;
  }
}

add(10, 20);
/**
 * 通过联合类型有两个缺点:
 *  1.进行很多的逻辑判断(类型缩小)
 *  2.返回值的类型依然是不能确定
 */

// 解决方式二：函数重载 函数的名称相同, 但是形参不同的多个函数, 就是函数的重载
// 我们可以去编写不同的重载签名（overload signatures）来表示函数可以以不同的方式进行调用
// 一般是编写两个或者以上的重载签名，再去编写一个通用的函数实现
function add(num1: number, num2: number): number; // 没函数体
function add(num1: string, num2: string): string;

// 具体实现函数，不能直接调用来处理逻辑哦
function add(num1: any, num2: any): any {
  if (typeof num1 === "string" && typeof num2 === "string") {
    return num1.length + num2.length;
  }
  return num1 + num2;
}

const result1 = add(20, 30);
const result2 = add("abc", "cba");
console.log(result1);
console.log(result2);
```

### 9.任意类型

> 在某些情况下，我们确实无法确定一个变量的类型，并且可能它会发生一些变化，这个时候我们可以使用 any 类型
>
> 如果某些情况处理类型过于繁琐，或者在引入一些第三方库时，缺失了类型注解，这个时候 我们可以使用 any
>
> any 类型是为了兼容老的代码，它还是动态类型，是不安全的，尽量少用

```typescript
function stringify(value: any) {
  return JSON.stringify(value);
}

stringify("string");
stringify(100);
stringify(true);

let foo: any = "string";
foo = 100;
foo.bar();

const arr: any[] = [];
```

### 10.unknown

- unknown 是 TypeScript 中比较特殊的一种类型，它用于描述类型不确定的变量

```typescript
function foo() {
  return "abc";
}

function bar() {
  return 123;
}

// unknown类型只能赋值给any和unknown类型
// any类型可以赋值给任意类型
let flag = true;
let result: unknown; // 最好不要使用any
if (flag) {
  result = foo();
} else {
  result = bar();
}
// 不使用any下方会报错
let message: string = result;
let num: number = result;

console.log(result);
```

### 11.never

> never 表示永远不会发生值的类型，比如一个函数
>
> 如果一个函数中是一个死循环或者抛出一个异常，那么这个函数会返回东西吗？

```typescript
function foo(): never {
  // 死循环
  while (true) {}
}
// 抛出错误
function bar(): never {
  throw new Error();
}

function handleMessage(message: string | number | boolean) {
  switch (typeof message) {
    case "string":
      console.log("string处理方式处理message");
      break;
    case "number":
      console.log("number处理方式处理message");
      break;
    case "boolean":
      console.log("boolean处理方式处理message");
      break;
    default:
      const check: never = message;
  }
}

// 函数如果传递其他类型 会赋值never导致报错
handleMessage("abc");
handleMessage(123);
handleMessage(true);
```

### 12.隐式类型推断

- TS 会在没有明确的指定类型的时候推测出一个类型
- 当定义变量时赋值，推断为对应的类型，如果定义变量时没有赋值,，推断为 any 类型

```ts
let age = 18; // ts推断出类型是number
// age = 'str' // 会报错 不能将类型 “"str"” 分配给类型 “number” 。

let foo; // 此时无法推断具体类型，foo则是动态类型，any类型
foo = 1; // 不会报错
foo = "string"; // 不会报错
```

### 13.类型断言和常量断言

- 通过 TypeScript 无法获取具体的类型信息，这个我们需要使用类型断言（Type Assertions）

```ts
// 假定这个 nums 来自接口提供
const nums = [110, 120, 119, 112];

const res = nums.find((i) => i > 0);
// const res: number | undefined
// const square = res * res

const num1 = res as number; // 断言 res 是 number
const square = num1 * num1;
const num2 = <number>res; // 或者这种方式。JSX下不能使用

// 这种获取元素方式 TypeScript 只知道该函数会返回 HTMLElement，但并不知道它具体的类型
const el = document.getElementById("yun") as HTMLImageElement;
el.src = "url地址";


// Person是Student的父类
class Person {}

class Student extends Person {
  studying() {}
}

function sayHello(p: Person) {
  (p as Student).studying();
}

const stu = new Student();
sayHello(stu);


// 双重断言
type Point2D = { x: number; y: number };
type Point3D = { x: number; y: number; z: number };
type Person = { name: string; email: string };

let point2: Point2D = { x: 0, y: 0 };
let point3: Point3D = { x: 10, y: 10, z: 10 };
let person: Person = { name: "alex", email: "alex@imooc.com" };

point2 = point3;
// point3 = point2; // error point2没有point3所需的数据
point3 = point2 as Point3D; // 好吧，别骗我，相信你

// person = point3; // error
// point3 = person; // error
point3 = person as Point3D; // 少骗我，我不信
point3 = person as any as Point3D; // 拐着弯来骗我
```

常量断言：

```ts
const alex = {
  name: "alex",
  job: "developer",
} as const;

// 内部数据原本可修改，可以使用 as const 为对象里面每个属性加上 readonly
// alex.name = "jack";
// alex.job = "teacher";

// 例2
function layout(setting: { align: "left" | "center" | "left"; padding: number }) {
  console.log("Layout: ", setting);
}

const example = {
  align: "left" as const,
  padding: 0,
};

// example不加 as const 会报错，因为ts无法将原始类型映射为字面量类型
layout(example);
```

### 14.非空类型断言

- 传入的参数是有值的，这个时候我们可以使用非空类型断言

```ts
function printMessageLength(message?: string) {
  // if (message) {
  //   console.log(message.length)
  // }
  console.log(message!.length);
}
```

### 15.对象类型

- 我们希望一个函数接受的参数是对象，在对象我们可以添加属性，并且告知 TypeScript 该属性需要是什么类型
- 属性之间可以使用 , 或者 ; 来分割，最后一个分隔符可选

```ts
// ? 代表可选
function printPoint(point: { x: number; y: number; z?: number }) {
  console.log(point.x);
  console.log(point.y);
  console.log(point.z);
}

printPoint({ x: 123, y: 321 });
printPoint({ x: 123, y: 321, z: 111 });
```

### 16.联合类型

- 联合类型是由两个或者多个其他类型组成的类型，表示可以是其中任意一个类型的值
- 联合类型中的每一个类型被称之为联合成员（union's members）

```ts
// number | string | boolean 联合类型
function printID(id: number | string | boolean) {
  // 使用联合类型的值时, 需要特别的小心
  // 比如如果我们拿到 number 类型，我们就不能调用 string 类型的方法
  // 我们可以使用缩小（narrow）联合推断更加具体的类型
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}
printID(123);
printID("abc");
printID(true);

// 一个参数一个可选类型的时候, 它其实类似于是这个参数是 类型| undefined 的联合类型
function foo(message?: string) {
  console.log(message);
}
```

### 17.联合类型和重载

- 有一个需求：定义一个函数，可以传入字符串或者数组，获取它们的长度

方案一：联合类型

```ts
function getLength(args: string | any[]) {
  return args.length;
}
console.log(getLength("abc"));
console.log(getLength([123, 321, 123]));
```

方案二：函数的重载

```ts
function getLength(args: string): number;
function getLength(args: any[]): number;
function getLength(args: any): number {
  return args.length;
}

console.log(getLength("abc"));
console.log(getLength([123, 321, 123]));
```

在开发中，尽可能选择联合类型使用

### 18.交叉类型

- 联合类型表示多个类型中满足一个，例如`type MyType = number | string`，`type Direction = "left" | "right" | "center"`
- 但交叉类似表示需要满足多个类型的条件

```ts
// 满足既要是一个 number 类型又要是一个 string 类型的值
type MyType = number & string;
```

进行交叉时，通常是对对象类型进行交叉的

```ts
interface ISwim {
  swimming: () => void;
}

interface IFly {
  flying: () => void;
}

type MyType1 = ISwim | IFly;
type MyType2 = ISwim & IFly;

const obj1: MyType1 = {
  flying() {},
};

const obj2: MyType2 = {
  swimming() {},
  flying() {},
};
```

### 19.类型别名

- 使用 type 定义类型别名(type alias)

```ts
type IDType = string | number | boolean;
type PointType = {
  x: number;
  y: number;
  z?: number;
};

function printId(id: IDType) {}

function printPoint(point: PointType) {}
```

### 20.字面量类型

```ts
// "Hello World" 也是可以作为类型的，特定的数据也能作为类型, 这就是字面量类型
const message: "Hello World" = "Hello World";

// 字面量类型的意义, 就是必须结合联合类型
type Alignment = "left" | "right" | "center";
let align: Alignment = "left";
align = "right";
align = "center";
```

### 21.字面量推理

先看一段代码：

```ts
type Method = "GET" | "POST";
function request(url: string, method: Method) {}

// 对象在进行字面量推理的时候，options是个 {url: string, method: string}
const options = {
  url: "y2y7.com",
  method: "POST",
};

// options.method会报错
// 我们没办法将一个 string 赋值给一个字面量类型
request(options.url, options.method);
```

方式一：

```ts
type Request = {
  url: string;
  method: Method;
};

const options：Request  = {
  url: "y2y7.com",
  method: "POST",
};
```

方式二：

```ts
request(options.url, options.method as Method);
```

方式三：

```ts
// const断言 能推断出的最窄或最特定的类型
const options = {
  url: "y2y7.com",
  method: "POST",
} as const;
```

### 22.字面量赋值

- 如果我们是将一个变量标识符赋值给其他的变量时，会进行 freshness 擦除操作

```ts
interface IPerson {
  name: string;
  age: number;
  height: number;
}

const info = {
  name: "why",
  age: 18,
  height: 1.88,
  address: "广州市",
};

// freshness擦除  变量标识符赋值给p会擦除掉不必要的address属性，并且不会报错哦
const p: IPerson = info;

console.log(info);
console.log(p);
```

函数传递引用对象一样会擦除

```ts
function printInfo(person: IPerson) {
  console.log(person);
}

const info = {
  name: "yun",
  age: 18,
  height: 1.88,
  address: "广州市",
};

printInfo(info);
```

### 23.类型缩小

- 缩小声明的类型路径（Type Narrowing）
- typeof padding === "number 这种可以称之为 类型守护（`type guards`）

常见的类型守护

- typeof
- 我们可以使用`Switch`或者一些相等运算符来表达相等性（比如`===`，`==`， `!==`, `!= `）
- instanceof
- in

```ts
// typeof
type IDType = number | string;
function printID(id: IDType) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}

// 使用typeof提取类型
const center = {
  x: 0,
  y: 0,
  z: 0,
};

type Point = typeof center;
// 相当于
// type Point = {
//   x: number;
//   y: number;
//   z: number;
// };
const unit: Point = {
  x: center.x + 1,
  y: center.y + 1,
  z: 0,
};

// 假设是后端传递的数据，提取其类型
const personResponse = {
  name: "alex",
  email: "alex@imooc.com",
  firstName: "alex",
  lastName: "liu",
};

type PersonResponse = typeof personResponse;

function process(person: PersonResponse) {
  console.log("full name: ", person.firstName + person.lastName);
}


// 平等缩小
type Direction = "left" | "right" | "top" | "bottom";
function printDirection(direction: Direction) {
  // 1.if判断
  if (direction === 'left') {
    console.log(direction)
  } else if ()
  // 2.switch判断
  switch (direction) {
    case 'left':
      console.log(direction)
      break;
    case ...
  }
}

// instanceof 检查一个值是否是另一个值的“实例”
function printTime(time: string | Date) {
  if (time instanceof Date) {
    console.log(time.toUTCString());
  } else {
    console.log(time);
  }
}

class Student {
  studying() {}
}

class Teacher {
  teaching() {}
}

function work(p: Student | Teacher) {
  if (p instanceof Student) {
    p.studying();
  } else {
    p.teaching();
  }
}

const stu = new Student();
work(stu);

// in运算符用于确定指定的属性在指定的对象或其原型链中，则 in 运算符返回true
type Fish = {
  swimming: () => void;
};

type Dog = {
  running: () => void;
};

function move(animal: Fish | Dog) {
  if ("swimming" in animal) {
    animal.swimming();
  } else {
    animal.running();
  }
}

const fish: Fish = {
  swimming() {
    console.log("swimming");
  },
};

move(fish);
    

// in
type Square = {
  size: number;
};

type Rectangle = {
  width: number;
  height: number;
};

type Shape = Square | Rectangle;

// function isSquare(shape: Shape): boolean {
function isSquare(shape: Shape): shape is Square {
  return "size" in shape;
}

function isRectangle(shape: Shape): shape is Square {
  return "width" in shape;
}

function area(shape: Shape) {
  //   if ("size" in shape) {
  if (isSquare(shape)) {
    return shape.size * shape.size;
  }
  //   if ("width" in shape) {
  if (isRectangle(shape)) {
    return shape.width * shape.height;
  }
}
```

### 24.接口

#### 基本使用

- 约束对象的结构

```ts
// 通过interface定义，可以用分号分割，分号可以省略
interface IPost {
  title: String;
  content: String;
}

//通过类型别名来声明对象类型
type IPost = { title: string; content: String };

function printPost(post: IPost) {
  console.log(post.title);
  console.log(post.content);
}

printPost({
  title: "hello",
  content: "javascript",
});
```

```ts
interface IPost {
  title: String;
  content: String;
  subtitle?: string; // 可有可无的属性。也就是说该属性为 string 或者 undefined
  readonly summary: string;
}

const hello: IPost = {
  title: "hello",
  content: "javascript",
  summary: "js",
};

//报错： Cannot assign to 'summary' because it is a read-only property.
// hello.summary = '11'
```

#### 动态（索引）属性

```ts
// 通过interface来定义索引类型   index相当于形参可随便取 number 类型
interface IndexLanguage {
  // 动态成员
  [index: number]: string;
}

const frontLanguage: IndexLanguage = {
  0: "HTML",
  1: "CSS",
  2: "JavaScript",
  3: "Vue",
};

interface ILanguageYear {
  [name: string]: number;
}

const languageYear: ILanguageYear = {
  C: 1972,
  Java: 1995,
  JavaScript: 1996,
  TypeScript: 2014,
};
```

#### 约束函数类型

```ts
// 可调用的接口
interface CalcFn {
  (n1: number, n2: number): number;
}

const add: CalcFn = (num1, num2) => {
  return num1 + num2;
};

function calc(num1: number, num2: number, calcFn: CalcFn) {
  return calcFn(num1, num2);
}

calc(20, 30, add);
```

一般情况还是推荐使用类型别名来定义函数

```ts
type CalcFn = (n1: number, n2: number) => number;
```

#### 接口继承

- 接口和类一样是可以进行继承的，也是使用 extends 关键字
- 接口是支持多继承的（类不支持多继承）

```ts
interface ISwim {
  swimming: () => void;
}

interface IFly {
  flying: () => void;
}

interface IAction extends ISwim, IFly {}

const action: IAction = {
  swimming() {},
  flying() {},
};
```

#### 接口的实现

> 接口定义后，也是可以被类实现的
>
> 如果一个接口被一个类实现，那么在之后需要传入接口的地方，都可以将这个类传入
>
> 这就是面向接口开发

```ts
interface ISwim {
  swimming: () => void;
}

interface IEat {
  eating: () => void;
}

// 类实现接口
class Animal {}

// 继承: 只能实现单继承
// 实现: 实现接口, 类可以实现多个接口
class Fish extends Animal implements ISwim, IEat {
  swimming() {
    console.log("Fish Swmming");
  }

  eating() {
    console.log("Fish Eating");
  }
}

class Person implements ISwim {
  swimming() {
    console.log("Person Swimming");
  }
}

// 编写一些公共的API: 面向接口编程
function swimAction(swimable: ISwim) {
  swimable.swimming();
}

// 所有实现了接口的类对应的对象, 都是可以传入
swimAction(new Fish());
swimAction(new Person());
swimAction({ swimming: function () {} });
```

#### interface 和 type 区别

- interface 和 type 都可以用来定义对象类型

- 如果是定义非对象类型，推荐使用`type`，比如 Direction、Alignment、Function

- 如果是定义对象类型

  - `interface` 可以重复的对某个接口来定义属性和方法（相当于合并接口）

  - 而`type`定义的是别名，别名是不能重复的

    ```ts
    interface IFoo {
      name: string;
    }
    
    interface IFoo {
      age: number;
    }
    
    // 报错
    type IBar = {
      name: string;
      age: number;
    };
    
    type IBar = {};
    ```



### 25.类

> ES6 之前的我们需要通过函数和原型链实现类和继承
>
> 从 ES6 开始，引入了 class 关键字，可以更方便的定义类和继承
>
> 虽然在实际开发中，我们更多使用函数式编程思想
>
> 但是类同样具有强大的封装性，我们也需要掌握它

#### 类的定义

> 类的定义我们通常会使用`class`关键字
>
> 在面向对象的世界里，任何事物都可以使用类的结构来描述
>
> 类中包含特有的属性和方法

我们来使用 class 定义一个 Person 类

我们可以在类的内部声明类的属性以及对应的类型，没有声明，默认 any

在默认的 strictPropertyInitialization 模式下，我们必须可以给属性设置初始化值

如果实现不希望，可以使用 `name!: string`的语法

类拥有自己的构造器 constructor，当我们通过 new 关键字创建一个实例时会被调用

类中可以有自己的函数，定义的函数称之为方法

```typescript
class Person {
  name!: string;
  age: number;

  constructor(name: string, age: number) {
    // this.name = name;
    this.age = age;
  }

  eating() {
    console.log(this.name + " eating");
  }
}

const p = new Person("yun", 18);
console.log(p.name);
console.log(p.age);
p.eating();
```

#### 类的继承

> 面向对象的其中一大特性就是继承，继承不仅仅可以减少我们的代码量，也是多态的使用前提
>
> 我们使用 extends 关键字来实现继承，子类中使用 super 来访问父类

我们来看一下 Student 类继承自 Person

Student 类可以有自己的属性和方法，并且会继承 Person 的属性和方法

在构造函数中，我们可以通过 super 来调用父类的构造方法，对父类中的属性进行初始化

```typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  eating() {
    console.log("eating 100行");
  }
}

class Student extends Person {
  sex: number;

  constructor(name: string, age: number, sex: number) {
    // super调用父类的构造器
    super(name, age);
    this.sex = sex;
  }

  eating() {
    console.log("student eating");
    super.eating();
  }

  studying() {
    console.log("studying");
  }
}

const stu = new Student("yun", 18, 111);
console.log(stu.name);
console.log(stu.age);
console.log(stu.sex);
stu.eating();
```

#### 类的多态

多态前提：父类的引用指向子类对象

看起来相同的类型，执行的方法却是不一样的

```typescript
class Animal {
  action() {
    console.log("animal action");
  }
}

class Dog extends Animal {
  action() {
    console.log("dog running!!!");
  }
}

class Fish extends Animal {
  action() {
    console.log("fish swimming");
  }
}

// animal: dog/fish
// 多态的目的是为了写出更加具备通用性的代码
function makeActions(animals: Animal[]) {
  animals.forEach((animal) => {
    animal.action();
  });
}

makeActions([new Dog(), new Fish(), new Person()]);
```

#### 类的成员修饰符

> 在 TypeScript 中，类的属性和方法支持三种修饰符： public、private、protected
>
> - public 修饰的是在任何地方可见、公有的属性或方法，默认编写的属性就是 public 的
> - private 修饰的是仅在同一类中可见、私有的属性或方法
> - protected 修饰的是仅在类自身及子类中可见、受保护的属性或方法

`private`

```typescript
class Person {
  private name: string = "";
  // 封装了两个方法, 只能在内部通过方法来访问私有属性name
  getName() {
    return this.name;
  }
  setName(newName) {
    this.name = newName;
  }
}

const p = new Person();
console.log(p.getName());
p.setName("yun");
```

`protected `

```typescript
// protected: 在类内部和子类中可以访问
class Person {
  protected name: string = "123";
}

class Student extends Person {
  getName() {
    return this.name;
  }
}

const stu = new Student();
console.log(stu.getName());
```

构造器私有化后不能 new

```ts
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class Student extends Person {
  private constructor(name: string, age: number) {
    super(name, age);
  }
  static create(name: string, age: number) {
    return new Student(name, age);
  }
}
const jack = Student.create("yunmu", 18);
console.log(jack);
```

#### 只读属性 readonly

> 如果有一个属性我们不希望外界可以任意的修改，只希望确定值后直接使用，那么可以使用`readonly`

```typescript
class Person {
  // 1.只读属性是可以在构造器中赋值, 赋值之后就不可以修改
  // 2.属性本身不能进行修改, 但是如果它是对象类型, 对象中的属性是可以修改
  readonly name: string;
  age?: number;
  readonly friend?: Person;
  constructor(name: string, friend?: Person) {
    this.name = name;
    this.friend = friend;
  }
}

const p = new Person("yun", new Person("kobe"));
console.log(p.name);
console.log(p.friend);

// 不可以直接修改friend
// p.friend = new Person("james")
if (p.friend) {
  p.friend.age = 30;
}
```

#### 访问器 getters/setters

> 之前我们一些私有属性不能直接访问，某些属性我们想要监听它的获取(getter)和设置(setter)的过程，这个时候我们可以使用存取器

```typescript
class Person {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }
  // 访问器setter/getter
  // setter
  set name(newName) {
    this._name = newName;
  }
  // getter
  get name() {
    return this._name;
  }
}

const p = new Person("yun");
p.name = "yunmu";
console.log(p.name); // yunmu
```

#### 静态成员

> 前面我们在类中定义的成员和方法都属于对象级别的
>
> 在开发中, 我们有时候也需要定义类级别的成员和方法
>
> 在 TypeScript 中通过关键字 static 来定义

```typescript
class Student {
  static time: string = "20:00";

  static attendClass() {
    console.log("去学习~");
  }
}

console.log(Student.time);
Student.attendClass();
```

#### 抽象类 abstract

> 继承是多态使用的前提
>
> 所以在定义很多通用的调用接口时, 我们通常会让调用者传入父类，通过多态来实现更加灵活的调用方式
>
> 但是，父类本身可能并不需要对某些方法进行具体的实现，所以父类中定义的方法，我们可以定义为抽象方法
>
> 什么是抽象方法? 在 TypeScript 中没有具体实现的方法(没有方法体)，就是抽象方法
>
> - 抽象方法，必须存在于抽象类中
> - 抽象类是使用 abstract 声明的类
>
> 抽象类有如下的特点
>
> - 抽象类不能实例化（也就是不能通过 new 创建）
> - 抽象方法必须被子类实现

```typescript
function makeArea(shape: Shape) {
  return shape.getArea();
}

// 抽象方法不需要方法体，子类必须要实现抽象方法
abstract class Shape {
  abstract getArea(): number;
}

// 非抽象类 Rectangle 不会实现继承自 Shape 类的抽象成员 getArea
class Rectangle extends Shape {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  private r: number;

  constructor(r: number) {
    super();
    this.r = r;
  }

  getArea() {
    return this.r * this.r * 3.14;
  }
}

const rectangle = new Rectangle(20, 30);
const circle = new Circle(10);

console.log(makeArea(rectangle));
console.log(makeArea(circle));
// 以下都报错
// makeArea(new Shape())
// makeArea(123)
// makeArea("123")
```

#### 类的类型

> 类本身也是可以作为一种数据类型的

```typescript
class Person {
  name: string = "123";
  eating() {}
}
const p = new Person(); // Person类型

const p1: Person = {
  name: "yun",
  eating() {},
};
function printPerson(p: Person) {
  console.log(p.name);
}

printPerson(new Person());
printPerson({ name: "kobe", eating: function () {} });
```

### 26.泛型

> 指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定具体类型的一种特性

#### 泛型实现类型参数化

> 在定义这个函数时, 我不决定这些参数的类型
>
> 而是让调用者以参数的形式告知，我这里的函数参数应该是什么类型
>
> 把类型作为参数，放在尖括号中

```ts
function sum<Type>(num: Type): Type {
  return num;
}
// 调用方式一:通过 <类型> 的方式将类型传递给函数
sum<number>(20);
sum<{ name: string }>({ name: "why" });
sum<any[]>(["abc"]);

// 调用方式二: 类型推导，自动推到出我们传入变量的类型
sum(50);
sum("abc");
```

```ts
function createNumberArray(length: number, value: number): number[] {
  const arr = Array<number>(length).fill(value);
  return arr;
}

const res = createNumberArray(3, 100); // [100, 100, 100]

function createArray<T>(length: Number, value: T): T[] {
  const arr = Array<T>(length).fill(value);
}

const arrRes = createArray<string>(3, "foo"); // ['foo', 'foo', 'foo']
```

泛型接受多个类型参数：

```typescript
function foo<T, E, O>(arg1: T, arg2: E, arg3?: O, ...args: T[]) {}

foo<number, string, boolean>(10, "abc", true);
```

平时在开发中我们可能会看到一些常用的名称

- T：Type 的缩写，类型
- K、V：key 和 value 的缩写，键值对
- E：Element 的缩写，元素
- O：Object 的缩写，对象

#### 泛型接口

在定义接口的时候我们也可以使用泛型

![image-20220124174347166](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220124174347166.png)

指定默认值

```typescript
interface IFoo<T = number> {}
```

#### 泛型类的使用

```typescript
class Point<T> {
  x: T;
  y: T;
  z: T;

  constructor(x: T, y: T, z: T) {
    this.x = x;
    this.y = y;
    this.z = y;
  }
}

const p1 = new Point("1.33.2", "2.22.3", "4.22.1");
const p2 = new Point<string>("1.33.2", "2.22.3", "4.22.1");
const p3: Point<string> = new Point("1.33.2", "2.22.3", "4.22.1");

const names2: Array<string> = ["abc", "cba", "nba"]; // 不推荐(与react jsx有冲突)
const names1: string[] = ["abc", "cba", "nba"];
```

#### 类型的泛型约束

> 有时候我们希望传入的类型有某些共性，但是这些共性可能不是在同一种类型中
>
> 比如 string 和 array 都是有 length 的，或者某些对象也是会有 length 属性的
>
> 那么只要是拥有 length 的属性都可以作为我们的参数类型，那么应该如何操作呢？

```typescript
interface ILength {
  length: number;
}

function getLength<T extends ILength>(arg: T) {
  return arg.length;
}

getLength("abc");
getLength(["abc", "cba"]);
getLength({ length: 100 });
```

### 27.模块化开发

> TypeScript 支持两种方式来控制我们的作用域
>
> - 模块化：每个文件可以是一个独立的模块，支持 ES Module，也支持 CommonJS
> - 命名空间：通过 namespace 来声明一个命名空间

```typescript
export function add(num1: number, num2: number) {
  return num1 + num2;
}

export function sub(num1: number, num2: number) {
  return num1 - num2;
}
```

#### 命名空间 namespace

> 命名空间在 TypeScript 早期时，称之为内部模块
>
> 主要目的是将一个模块内部再进行作用域的划分，防止一些命名冲突的问题

```typescript
export namespace time {
  export function format(time: string) {
    return "2222-02-22";
  }
  export let name: string = "abc";
}

export namespace price {
  export function format(price: number) {
    return "99.99";
  }
}
```

### 28.类型声明

#### 类型的查找

> 之前我们所有的 typescript 中的类型，几乎都是自己编写的，但是我们也有用到一些其他的类型
>
> 比如`const imageEl = document.getElementById ("image") as HTMLImageElement;`
>
> 这里的其实这里就涉及到 typescript 对类型的管理和查找规则了，HTMLImageElement 类型来自哪里呢？
>
> 其实这里就涉及到 typescript 对类型的管理和查找规则了
>
> typescript 还有另外一种文件`.d.ts`文件，它是用来做类型的声明(declare)，告诉我们有哪些类型
>
> 那么 typescript 会在哪里查找我们的类型声明呢？
>
> - 内置类型声明
> - 外部定义类型声明
> - 外部定义类型声明

### 29.内置对象

> JavaScript 中有很多内置对象，它们可以直接在 TypeScript 中当做定义好了的类型
>
> 内置对象是指根据标准在全局作用域（Global）上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准

1. ECMAScript 的内置对象

- Boolean
- Number
- String
- Date
- RegExp
- Error

```typescript
/* 1. ECMAScript 的内置对象 */
let b: Boolean = new Boolean(1);
let n: Number = new Number(true);
let s: String = new String("abc");
let d: Date = new Date();
let r: RegExp = /^1/;
let e: Error = new Error("error message");
b = true;
// let bb: boolean = new Boolean(2)  // error
```

2. BOM 和 DOM 的内置对象

- Window
- Document
- HTMLElement
- DocumentFragment
- Event
- NodeList

```typescript
const div: HTMLElement = document.getElementById("test");
const divs: NodeList = document.querySelectorAll("div");
document.addEventListener("click", (event: MouseEvent) => {
  console.dir(event.target);
});
const fragment: DocumentFragment = document.createDocumentFragment();
```

#### 内置类型声明

> 内置类型声明是 Typescript 自带的、帮助我们内置了 JavaScript 运行时的一些标准化 API 的声明文件
>
> 包括比如 Math、Date 等内置类型，也包括 DOM API，比如 Window、Document 等
>
> 内置类型声明通常在我们安装 typescript 的环境中会带有的
>
> - [TypeScript/lib at main · microsoft/TypeScript (github.com)](https://github.com/microsoft/TypeScript/tree/main/lib)

#### 外部定义类型声明

> 外部类型声明通常是我们使用一些库（比如第三方库）时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能
>
> 这些库通常有两种类型声明方式：
>
> - 方式一：在自己库中进行类型声明（编写.d.ts 文件），比如 axios
> - 方式二：通过社区的一个公有库 DefinitelyTyped 存放类型声明文件
>   - 该库的 GitHub 地址：https://github.com/DefinitelyTyped/DefinitelyTyped/
>   - 该库查找声明安装方式的地址：https://www.typescriptlang.org/dt/search?search=
>   - 比如我们安装 react 的类型声明： npm i @types/react --save-dev

#### 自定义声明

> 什么情况下需要自己来定义声明文件呢？
>
> - 情况一：我们使用的第三方库是一个纯的 JavaScript 库，没有对应的声明文件；比如 lodash
> - 情况二：我们给自己的代码中声明一些类型，方便在其他地方直接进行使用

#### 声明模块

> 我们也可以声明模块，比如 lodash 模块默认不能使用的情况，可以自己来声明这个模块
>
> 声明模块的语法: declare module '模块名' {}
>
> 在声明模块的内部，我们可以通过 export 导出对应库的类、函数等

```typescript
declare module "lodash" {
  export function join(arr: any[]): any;
}
```

#### 声明变量-函数-类

```typescript
// index.html
import { camelCase } from "lodash";
let whyName = "yunmu";
let whyAge = 18;
let whyHeight = 1.88;

function Foo() {
  console.log("whyFoo");
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

// .d.ts
// 声明变量/函数/类
declare let whyName: string;
declare let whyAge: number;
declare let whyHeight: number;

declare function whyFoo(): void;

declare function camelCase(input: string): string;

const res = camelCase("yunmu");

declare class Person {
  name: string;
  age: number;
  constructor(name: string, age: number);
}
```

#### declare 声明文件

> 在某些情况下，我们也可以声明文件
>
> 比如在开发 vue 的过程中，默认是不识别我们的 `.vue` 文件的，那么我们就需要对其进行文件的声明
>
> 比如在开发中我们使用了 `.jpg` 这类图片文件，默认 Typescript 也是不支持的，也需要对其进行声明

```typescript
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}
```

#### declare 命名空间

> 比如我们在`index.html`中直接引入了`jQuery`
>
> - CDN 地址： https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js

我们可以进行命名空间的声明：

```typescript
declare namespace $ {
  export function ajax(settings: any): any;
}
```

在 main.ts 中就可以使用了：

```typescript
$.ajax({
  url: "http://123.207.32.32:8000/home/multidata",
  success: (res: any) => {
    console.log(res);
  },
});
```

#### tsconfig.json 文件

> `tsconfig.json`是用于配置 TypeScript 编译时的配置选项
>
> [TypeScript: TSConfig Reference - Docs on every TSConfig option (typescriptlang.org)](https://www.typescriptlang.org/tsconfig)

![image-20220124184255908](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220124184255908.png)

![image-20220124184328878](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220124184328878.png)





### 30.工具类型

- Partial 部分类型
- Required 必填类型
- Readonly 只读类型
- Exclude 排除类型
- Extract 提取类型
- Pick / Omit（主要针对对象）排除 key 类型
- ReturnType 返回值类型

```ts
interface User {
  id: string;
  name: string;
}

const user1: Partial<User> = {
  name: "yunmu",
};
// 相当于
// interface User {
//   id?: string | undefined;
//   name?: string | undefined;
// }

// User类型所有都必须实现，即使加了?
const user2: Required<User> = {
  id: "1",
  name: "yunmu",
};

// User类型所有都只读
const user3: Readonly<User> = {
  id: "1",
  name: "yunmu",
};

interface IObj {
  id?: string;
  name: string;
  age: number;
}

// 只选择 id 和 name
type God1 = Pick<User, "id" | "name">;
// 相当于
// interface God1 {
//   id: string;
//   name: string;
// }
// 排除age
type God2 = Omit<User, "age">;

type Dir1 = "东" | "南" | "西" | "北";
// 提取
type Dir2 = Extract<Dir1, "西" | "北">; // "西" | "北"
// 排除
type Dir3 = Exclude<Dir1, "北">; // "东" | "南" | "西"

function f(a: number, b: number) {
  return a + b;
}
// ReturnType 接受类型返回f函数的返回值类型
type A = ReturnType<typeof f>;

type a = Record<string, number>;
// 相当于
// type a = {
//   [x: string]: number;
// };
```



### 31.keyof

- keyof会取得对象中所有键名的联合类型

```ts
type Person = {
  name: string;
  age: number;
  location: string;
};

const alex: Person = {
  name: "alex",
  age: 35,
  location: "广州",
};

// function getValueByKey(obj: any, key: string) {}
// function getValueByKey(obj: any, key: "name" | "age" | "email") {}
// function getValueByKey(obj: Person, key: keyof Person) {}
// type PersonKey = keyof Person
function getValueByKey<Obj, Key extends keyof Obj>(obj: Obj, key: Key) {
  const value = obj[key];
  console.log("Getting: ", key, value);
  return value;
}

const age = getValueByKey(alex, "age");
// const email = getValueByKey(alex, "email"); error

function setValueByKey<Obj, Key extends keyof Obj>(obj: Obj, key: Key, value: Obj[Key]) {
  obj[key] = value;
}

setValueByKey(alex, "age", 18);
```





### 32.类型查找

```ts
// 服务器的数据结构
export type RequestData = {
  transactionId: string;
  user: {
    name: string;
    email: string;
    phone: string;
    nickname: string;
    gender: string;
    dob: string;
    nationality: string;
    address: {
      stress: string;
      unitNumber: string;
      city: string;
      provance: string;
      contury: string;
    }[];
  };
  dirverInfo: {
    licenceNumber: string;
    exporyDate: string;
    classes: string;
    status: string;
  };
  payment: {
    creditCardNumber: string;
  };
  //   payment: PaymentRequest
};

// type PaymentRequest = {
//   creditCardNumber: string;
// };

type PaymentRequest = RequestData["payment"];

export function getPayment(): PaymentRequest {
  return {
    creditCardNumber: "1234567890",
  };
}

export function getAddress(): RequestData["user"]["address"][0] {
  return {
    stress: "太古广场",
    unitNumber: "1号",
    city: "广州",
    provance: "广东",
    contury: "中国",
  };
}
```





### 33.类型映射

```ts
type Point = {
  x: number;
  y: number;
  z: number;
};

// type ReadonlyPoint = {
//   readonly x: number;
//   readonly y: number;
//   readonly z: number;
// };

type ReadonlyPoint = {
  readonly [item in keyof Point]: Point[item];
};

type ReadOnly<T> = {
  readonly [item in keyof T]: T[item];
};

const center: ReadOnly<Point> = {
  x: 0,
  y: 0,
  z: 0,
};

// center.x = 100; //error
```

 



### 34.映射修饰符

```ts
type Point = {
  readonly x: number;
  y?: number;
};

type Mapped<T> = {
  -readonly // -readonly代表去除readonly  ?使得所有类型可选 在前面加上-?则使得必选
  [P in keyof T]?: T[P];
};

type Result = Mapped<Point>;

//--------------------------

// export type Partial<T> = {
//   [P in keyof T]?: T[P];
// };

export class State<T> {
  constructor(public current: T) {}
  update(next: Partial<T>) {
    this.current = { ...this.current, ...next };
  }
}

const state = new State({ x: 0, y: 0 });
state.update({ y: 123 });
console.log(state.current);
```

