### 条件类型与 TypeScript 的类型魔法

在 TypeScript 的世界里，类型不仅仅是用来约束变量的，它们还能进行复杂的逻辑判断和推导。今天我们要聊的就是其中一个非常强大的工具——**条件类型**。如果你熟悉 JavaScript 的三元表达式，那你会发现条件类型的语法和它非常相似：

```typescript
ValueA === ValueB ? Result1 : Result2;
TypeA extends TypeB ? Result1 : Result2;
```

但不同的是，条件类型使用 `extends` 来判断类型的**兼容性**，而不是全等性。也就是说，两个类型不需要完全相同，只要它们可以相互赋值，条件就成立。

### 条件类型的基本用法

条件类型通常和泛型一起使用。泛型参数的实际类型会在调用时被填充，而条件类型可以基于这些填充后的类型进行进一步的判断。举个例子：

```typescript
type LiteralType<T> = T extends string ? 'string' : 'other'

type Res1 = LiteralType<'hello'> // "string"
type Res2 = LiteralType<123> // "other"
```

在这个例子中，`LiteralType` 根据传入的类型是 `string` 还是其他类型，返回不同的结果。你可以把它想象成类型层面的“条件分支”。

### 多层嵌套的条件类型

就像三元表达式可以嵌套一样，条件类型也可以嵌套。比如我们可以根据不同的类型返回不同的字符串：

```typescript
export type LiteralType<T> = T extends string
	? 'string'
	: T extends number
	? 'number'
	: T extends boolean
	? 'boolean'
	: T extends null
	? 'null'
	: T extends undefined
	? 'undefined'
	: never
```

通过这种方式，我们可以处理多种类型，并根据不同的类型返回不同的结果。

### 条件类型与函数

条件类型在函数中也非常有用。比如我们有一个通用的加法函数 `universalAdd`，它可以处理 `number`、`bigint` 和 `string` 类型的加法操作：

```typescript
function universalAdd<T extends number | bigint | string>(x: T, y: T) {
	return x + (y as any)
}
```

当我们调用这个函数时，泛型 `T` 会被推导为具体的类型，比如 `number` 或 `string`。为了让返回值类型更加准确，我们可以使用条件类型来推导出基础类型：

```typescript
function universalAdd<T extends number | bigint | string>(
	x: T,
	y: T
): LiteralToPrimitive<T> {
	return x + (y as any)
}

export type LiteralToPrimitive<T> = T extends number
	? number
	: T extends bigint
	? bigint
	: T extends string
	? string
	: never
```

这样，`universalAdd` 函数的返回值类型就会根据传入的参数类型自动推导出来。

### infer 关键字

有时候，我们不仅仅想判断类型是否兼容，还想提取类型的一部分信息。这时候，`infer` 关键字就派上用场了。`infer` 可以在条件类型中提取类型的一部分，比如提取函数的返回值类型：

```typescript
type FunctionReturnType<T extends (...args: any[]) => any> = T extends (
	...args: any[]
) => infer R
	? R
	: never
```

在这个例子中，`infer R` 提取了函数的返回值类型。如果传入的类型不是函数类型，返回 `never`。

### 分布式条件类型

分布式条件类型听起来很复杂，但其实它的原理很简单。当条件类型的参数是一个联合类型时，TypeScript 会自动将这个联合类型拆开，分别对每个成员进行条件判断，然后再将结果合并。举个例子：

```typescript
type Condition<T> = T extends 1 | 2 | 3 ? T : never

type Res1 = Condition<1 | 2 | 3 | 4 | 5> // 1 | 2 | 3
```

在这个例子中，`Condition` 会对联合类型 `1 | 2 | 3 | 4 | 5` 的每个成员进行判断，最后返回符合条件的成员。

### infer 与数组、对象

`infer` 不仅可以用于函数类型，还可以用于数组和对象。比如我们可以提取数组的元素类型：

```typescript
type ArrayItemType<T> = T extends Array<infer ElementType> ? ElementType : never

type Res1 = ArrayItemType<string[]> // string
type Res2 = ArrayItemType<[string, number]> // string | number
```

同样，我们也可以提取对象的属性类型：

```typescript
type PropType<T, K extends keyof T> = T extends { [Key in K]: infer R } ? R : never

type Res1 = PropType<{ name: string }, 'name'> // string
```

### 总结

条件类型和 `infer` 关键字为我们提供了强大的类型推导和判断能力。通过这些工具，我们可以在类型层面进行复杂的逻辑判断和信息提取，让 TypeScript 的类型系统更加灵活和强大。

在接下来的学习中，我们还会深入探讨 TypeScript 的内置工具类型，以及如何利用这些工具类型来解决实际问题。类型编程的世界充满了无限可能，期待与你一起探索更多的类型魔法！
