在现代前端开发中，TypeScript 已经成为了许多开发者的首选工具。它不仅为 JavaScript 提供了强大的类型系统，还让代码更加健壮、可维护。今天，我们要聊的就是 TypeScript 中的函数和类，它们分别代表了面向过程和面向对象的编程理念。

### 函数：代码的灵魂

函数是编程中的核心，它帮助我们将复杂的逻辑封装起来，便于复用和维护。在 TypeScript 中，函数的类型标注尤为重要。我们不仅可以为函数的参数和返回值指定类型，还可以通过重载来实现更灵活的函数调用。

#### 参数和返回值的类型标注

在 TypeScript 中，函数的类型标注非常直观。我们可以通过 `:` 来指定参数和返回值的类型：

```typescript
function greet(name: string): string {
	return `Hello, ${name}`
}
```

在这个例子中，`name` 参数被标注为 `string` 类型，函数的返回值也是 `string`。这让我们在调用函数时，能够清楚地知道它的输入和输出是什么。

#### 可选参数与默认值

有时候，我们希望函数的某些参数是可选的，或者有默认值。TypeScript 提供了两种方式来实现这一点：

```typescript
function greet(name: string, age?: number): string {
	return age ? `${name} is ${age} years old` : `Hello, ${name}`
}

function greetWithDefault(name: string, age: number = 18): string {
	return `${name} is ${age} years old`
}
```

在第一个例子中，`age` 是一个可选参数，而在第二个例子中，`age` 有一个默认值 `18`。这让函数的调用更加灵活。

#### 函数重载

当一个函数需要根据不同的参数类型返回不同的结果时，函数重载就派上了用场。通过重载，我们可以为同一个函数定义多个签名：

```typescript
function calculate(value: number, format: true): string
function calculate(value: number, format?: false): number
function calculate(value: number, format?: boolean): string | number {
	return format ? value.toString() : value * 100
}
```

在这个例子中，`calculate` 函数根据 `format` 参数的不同，返回 `string` 或 `number`。这种灵活的设计让函数的使用更加直观。

### Class：面向对象的力量

如果说函数是面向过程编程的核心，那么类（Class）就是面向对象编程的基石。TypeScript 中的类不仅继承了 JavaScript 的语法，还引入了许多新的特性，比如访问修饰符、抽象类等。

#### 类的基本结构

一个类通常由属性、构造函数和方法组成。在 TypeScript 中，我们可以为这些成员添加类型标注：

```typescript
class Person {
	name: string
	age: number

	constructor(name: string, age: number) {
		this.name = name
		this.age = age
	}

	greet(): string {
		return `Hello, my name is ${this.name}`
	}
}
```

在这个例子中，`Person` 类有两个属性 `name` 和 `age`，它们的类型分别是 `string` 和 `number`。构造函数用于初始化这些属性，而 `greet` 方法则返回一个问候语。

#### 访问修饰符

TypeScript 提供了 `public`、`private` 和 `protected` 三种访问修饰符，帮助我们控制类成员的访问权限：

- `public`：类的成员可以在任何地方访问。
- `private`：类的成员只能在类的内部访问。
- `protected`：类的成员可以在类和子类中访问。

```typescript
class Person {
	private name: string
	protected age: number

	constructor(name: string, age: number) {
		this.name = name
		this.age = age
	}

	public greet(): string {
		return `Hello, my name is ${this.name}`
	}
}
```

在这个例子中，`name` 是私有的，只有在 `Person` 类内部可以访问，而 `age` 是受保护的，子类也可以访问它。

#### 继承与抽象类

继承是面向对象编程的重要特性，它允许我们创建一个类的子类，并在子类中扩展或重写父类的方法。TypeScript 还引入了抽象类，帮助我们定义类的结构，而不提供具体实现。

```typescript
abstract class Animal {
	abstract makeSound(): void

	move(): void {
		console.log('Moving...')
	}
}

class Dog extends Animal {
	makeSound(): void {
		console.log('Bark!')
	}
}
```

在这个例子中，`Animal` 是一个抽象类，它定义了一个抽象方法 `makeSound`，子类 `Dog` 必须实现这个方法。

### 总结

通过学习 TypeScript 中的函数和类，我们不仅掌握了如何为代码添加类型标注，还了解了如何利用面向对象的特性来构建更复杂的应用。无论是函数的重载，还是类的继承与抽象，这些特性都让我们的代码更加灵活、可维护。

接下来，我们将深入探讨 TypeScript 中的高级类型系统，了解如何使用 `any`、`unknown`、`never` 等类型，以及类型断言等工具。相信通过这些学习，你会对 TypeScript 有更深的理解，并能够在项目中更加自如地使用它。

让我们继续前行，探索更多 TypeScript 的奥秘吧！
