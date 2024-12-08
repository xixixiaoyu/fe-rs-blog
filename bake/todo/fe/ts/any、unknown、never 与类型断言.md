在 JavaScript 向 TypeScript 迁移的过程中，很多概念是相通的，比如基础类型标注、字面量类型、枚举、函数和类等。这些概念帮助我们从 JavaScript 逐步过渡到 TypeScript。然而，TypeScript 的强大之处不仅仅在于这些基础概念，它还提供了许多内置类型和工具，帮助我们在类型系统中获得更好的编程体验。

### 探索 TypeScript 的内置类型

在 TypeScript 中，有三个非常重要的内置类型：`any`、`unknown` 和 `never`。它们在不同的场景下扮演着不同的角色，帮助我们更灵活地处理类型。

#### 1. `any`：任意类型的万能钥匙

`any` 是 TypeScript 中最宽泛的类型，它可以表示任何类型的值。比如在 `console.log` 这样的函数中，参数可以是任何类型，这时我们就可以使用 `any` 来标注：

```typescript
function log(message?: any, ...optionalParams: any[]): void {
	console.log(message, ...optionalParams)
}
```

`any` 的灵活性让它成为了“万能钥匙”，你可以对 `any` 类型的变量进行任何操作，甚至可以将它赋值给其他类型的变量：

```typescript
let anyVar: any = 'hello'
anyVar = 42
anyVar = { name: 'TypeScript' }

const str: string = anyVar // 没问题
const num: number = anyVar // 也没问题
```

虽然 `any` 非常方便，但它也容易被滥用，导致类型检查失效。因此，尽量避免过度使用 `any`，否则 TypeScript 就会变成“AnyScript”。

#### 2. `unknown`：更安全的未知类型

与 `any` 类似，`unknown` 也可以表示任意类型，但它比 `any` 更加安全。`unknown` 类型的变量不能直接赋值给其他类型的变量，必须经过类型检查或类型断言：

```typescript
let unknownVar: unknown = 'hello'
unknownVar = 42

const str: string = unknownVar // 错误
const num: number = unknownVar // 错误

const anyVar: any = unknownVar // 没问题
const anotherUnknown: unknown = unknownVar // 没问题
```

`unknown` 的存在让我们在处理未知类型时更加谨慎，避免了 `any` 带来的随意性。

#### 3. `never`：虚无的底层类型

`never` 是 TypeScript 中最底层的类型，它表示那些永远不会发生的情况。比如，一个函数如果总是抛出错误或进入死循环，它的返回值类型就是 `never`：

```typescript
function throwError(): never {
	throw new Error('Something went wrong')
}
```

`never` 类型通常用于类型检查，确保代码中的某些分支永远不会被执行。比如在处理联合类型时，`never` 可以帮助我们确保所有类型分支都得到了处理：

```typescript
function handleInput(input: string | number | boolean) {
	if (typeof input === 'string') {
		console.log('String input')
	} else if (typeof input === 'number') {
		console.log('Number input')
	} else if (typeof input === 'boolean') {
		console.log('Boolean input')
	} else {
		const exhaustiveCheck: never = input
		throw new Error(`Unknown input type: ${exhaustiveCheck}`)
	}
}
```

在这个例子中，如果我们忘记处理某个类型分支，TypeScript 会在编译时报错，提醒我们有未处理的类型。

### 类型断言：告诉编译器“我知道我在做什么”

有时候，TypeScript 的类型推断可能不够准确，这时我们可以使用类型断言来告诉编译器某个值的具体类型。类型断言的语法是 `as`，它可以将一个值断言为特定类型：

```typescript
let someValue: unknown = 'hello'
let strLength: number = (someValue as string).length
```

类型断言可以帮助我们绕过类型检查，但也要谨慎使用，避免滥用。特别是在处理 `any` 类型时，类型断言可以让我们更精确地控制类型，而不是随意跳过类型检查。

### 双重断言与非空断言

有时候，类型断言可能会遇到类型差异过大的情况，这时我们可以使用双重断言，先将值断言为 `unknown`，再断言为目标类型：

```typescript
let someValue: string = 'hello'
;(someValue as unknown as { handler: () => void }).handler()
```

此外，TypeScript 还提供了非空断言（`!`），用于告诉编译器某个值一定不是 `null` 或 `undefined`：

```typescript
let element = document.querySelector('#myElement')!
```

非空断言非常适合在处理 DOM 元素或数组查找时使用，避免不必要的类型检查。

### 总结

在这篇文章中，我们探讨了 TypeScript 中的三大内置类型：`any`、`unknown` 和 `never`，以及类型断言的使用场景。`any` 让我们可以灵活处理任意类型，但要小心滥用；`unknown` 提供了更安全的方式来处理未知类型；而 `never` 则帮助我们确保代码的类型安全性。

TypeScript 的类型系统不仅仅是为了约束，它更像是一个工具，帮助我们编写更健壮、更安全的代码。在接下来的学习中，我们将继续探索 TypeScript 的类型工具，进一步提升我们的编程体验。
