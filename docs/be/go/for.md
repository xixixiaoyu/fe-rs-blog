Go 语言中的 for 是唯一的循环语句，但它的使用方式非常灵活。

### 1. 基础 for 循环（类似 C 语言）

```go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
```

这种形式包含三个部分：

- 初始化语句：`i := 0`
- 条件表达式：`i < 5`
- 后置语句：`i++`

### 2. while 形式

Go 没有 while 关键字，但可以用 for 实现相同功能：

```go
sum := 1
for sum < 100 {
    sum += sum
}
```

### 3. 无限循环

```go
for {
    fmt.Println("永远循环下去")
    // 使用 break 跳出循环
    if condition {
        break
    }
}
```

### 4. for-range 循环

这是最常用的遍历形式，可以用于：

**切片或数组**：

```go
numbers := []int{1, 2, 3, 4, 5}
for index, value := range numbers {
    fmt.Printf("索引：%d，值：%d\n", index, value)
}
```

**字符串**：

```go
str := "你好"
for index, char := range str {
    fmt.Printf("位置：%d，字符：%c\n", index, char)
}
```

**map**：

```go
m := map[string]int{"apple": 1, "banana": 2}
for key, value := range m {
    fmt.Printf("键：%s，值：%d\n", key, value)
}
```

**channel**：

```go
ch := make(chan int)
for item := range ch {
    fmt.Println(item)
}
```

### 5. 控制语句

**break**：跳出循环

```go
for i := 0; i < 10; i++ {
    if i == 5 {
        break // 当 i 等于 5 时跳出循环
    }
}
```

**continue**：跳过本次循环

```go
for i := 0; i < 10; i++ {
    if i%2 == 0 {
        continue // 跳过偶数
    }
    fmt.Println(i)
}
```

**标签跳转**：

```go
OuterLoop:
    for i := 0; i < 5; i++ {
        for j := 0; j < 5; j++ {
            if i*j == 6 {
                break OuterLoop // 跳出外层循环
            }
        }
    }
```

### 使用技巧

1. 如果只需要索引或值其中之一，可以用 `_` 忽略：

```go
// 只需要值
for _, value := range numbers {
    fmt.Println(value)
}

// 只需要索引
for index, _ := range numbers {
    fmt.Println(index)
}
```

2. 在遍历过程中修改切片长度要小心：

```go
// 安全的遍历方式
length := len(numbers)
for i := 0; i < length; i++ {
    // 处理逻辑
}
```

通过这些灵活的使用方式，Go 的 for 循环可以满足几乎所有的循环需求。记住选择最适合你具体场景的循环形式，这样可以使代码更加清晰和高效。
