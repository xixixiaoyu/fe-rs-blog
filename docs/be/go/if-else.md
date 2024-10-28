### 1. 基本语法

```go
if 条件 {
    // 条件为 true 时执行
} else {
    // 条件为 false 时执行
}
```

### 2. 特点和使用方法

1. **初始化语句**
   Go 的 if 支持在条件判断前执行一个简单的语句：

```go
if num := 10; num > 0 {
    fmt.Println("正数")
} else {
    fmt.Println("负数或零")
}
```

2. **多条件判断**

```go
if score >= 90 {
    fmt.Println("优秀")
} else if score >= 80 {
    fmt.Println("良好")
} else if score >= 60 {
    fmt.Println("及格")
} else {
    fmt.Println("不及格")
}
```

3. **不需要括号**
   与其他语言不同，Go 的条件表达式不需要括号：

```go
// Go 风格
if x > 0 {
    // ...
}

// 不推荐的写法
if (x > 0) {  // 不需要括号
    // ...
}
```

### 3. 实用示例

```go
func handleError() {
    // 错误处理示例
    if file, err := os.Open("test.txt"); err != nil {
        fmt.Println("无法打开文件:", err)
    } else {
        defer file.Close()
        // 处理文件
    }
}

func checkAge(age int) string {
    // 多条件判断示例
    if age < 0 {
        return "年龄不能为负数"
    } else if age < 18 {
        return "未成年"
    } else if age < 60 {
        return "成年人"
    } else {
        return "老年人"
    }
}
```

### 4. 注意事项

1. **花括号位置**

- Go 语言强制要求 `{` 必须与 if/else 在同一行
- 错误写法：

```go
if x > 0    // 错误
{

}
```

2. **作用域**

- 在 if 初始化语句中声明的变量，只在 if-else 块中可见

```go
if value := getValue(); value > 0 {
    fmt.Println(value)
} else {
    fmt.Println(value)
}
// 这里无法访问 value 变量
```

3. **避免过多嵌套**

- 建议通过提前返回来减少嵌套层级

```go
// 推荐写法
func process(data int) error {
    if data < 0 {
        return errors.New("invalid data")
    }
    if data == 0 {
        return nil
    }
    // 处理正数情况
    return nil
}
```

### 5. 最佳实践

1. 优先处理错误情况，提前返回
2. 保持代码简洁，避免过多的 else-if 分支
3. 合理使用初始化语句简化代码
4. 遵循 Go 的代码格式规范
