# 深入理解 NestJS 中的 Pipe：验证与转换的利器

在 NestJS 中，`Pipe` 是一个非常重要的概念，它的作用是在参数传递给处理函数（handler）之前，对参数进行验证和转换。通过使用 `Pipe`，我们可以确保传入的参数符合预期的格式和类型，从而提高代码的健壮性和可维护性。

## 什么是 Pipe？

简单来说，`Pipe` 是一个类，它实现了 `PipeTransform` 接口，并且包含一个 `transform` 方法。这个方法会在参数传递给处理函数之前被调用，用于对参数进行处理。`Pipe` 的主要功能包括：

1. **验证**：确保参数符合预期的格式或规则。
2. **转换**：将参数从一种类型转换为另一种类型。

NestJS 提供了多种内置的 `Pipe`，我们可以直接使用这些 `Pipe` 来处理常见的验证和转换需求。

## 内置的 Pipe

NestJS 内置了多个 `Pipe`，它们都实现了 `PipeTransform` 接口。以下是一些常用的内置 `Pipe`：

- `ValidationPipe`
- `ParseIntPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `DefaultValuePipe`
- `ParseEnumPipe`
- `ParseFloatPipe`
- `ParseFilePipe`

### 1. `ParseIntPipe`

`ParseIntPipe` 用于将传入的参数转换为整数。如果参数无法转换为整数，它会抛出一个异常。

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return `This action returns a #${id} item`;
}
```

当传入的参数不能被解析为整数时，默认会返回 400 错误。你也可以通过传递自定义的错误状态码和异常工厂来定制错误响应。

### 2. `ParseBoolPipe`

`ParseBoolPipe` 用于将参数转换为布尔值。它会将 `'true'` 和 `'false'` 字符串分别转换为 `true` 和 `false`。

```typescript
@Get()
findAll(@Query('isActive', ParseBoolPipe) isActive: boolean) {
  return `This action returns all active items: ${isActive}`;
}
```

### 3. `ParseArrayPipe`

`ParseArrayPipe` 用于将参数解析为数组。你可以指定数组的元素类型，并且可以通过 `optional` 参数来允许空数组。

```typescript
@Get()
findAll(@Query('ids', new ParseArrayPipe({ items: Number })) ids: number[]) {
  return `This action returns items with ids: ${ids}`;
}
```

### 4. `ParseUUIDPipe`

`ParseUUIDPipe` 用于验证传入的参数是否是有效的 UUID。它支持 UUID 的 v3、v4 和 v5 版本。

```typescript
@Get(':uuid')
findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return `This action returns a #${uuid} item`;
}
```

### 5. `DefaultValuePipe`

`DefaultValuePipe` 用于为参数设置默认值。当参数未传入时，它会使用指定的默认值。

```typescript
@Get()
findAll(@Query('limit', new DefaultValuePipe(10)) limit: number) {
  return `This action returns ${limit} items`;
}
```

### 6. `ParseEnumPipe`

`ParseEnumPipe` 用于将参数解析为枚举类型，并且可以限制参数的取值范围。

```typescript
enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Get()
findAll(@Query('role', new ParseEnumPipe(UserRole)) role: UserRole) {
  return `This action returns users with role: ${role}`;
}
```

### 7. `ParseFloatPipe`

`ParseFloatPipe` 用于将参数解析为浮点数。它的用法与 `ParseIntPipe` 类似。

```typescript
@Get()
findAll(@Query('price', ParseFloatPipe) price: number) {
  return `This action returns items with price: ${price}`;
}
```

## 自定义 Pipe

除了使用内置的 `Pipe`，我们还可以根据需求自定义 `Pipe`。自定义 `Pipe` 只需要实现 `PipeTransform` 接口，并且实现 `transform` 方法。

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'

@Injectable()
export class CustomPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isValid(value)) {
      throw new BadRequestException('Validation failed')
    }
    return value
  }

  private isValid(value: any) {
    // 自定义验证逻辑
    return true
  }
}
```

在上面的例子中，我们创建了一个自定义的 `Pipe`，它会对传入的参数进行验证。如果验证失败，它会抛出一个 `BadRequestException`。

## 使用 Pipe 的场景

`Pipe` 在 NestJS 中有很多应用场景，以下是一些常见的使用场景：

1. **参数验证**：通过 `ValidationPipe`，我们可以对传入的参数进行复杂的验证，比如验证参数是否符合某个 DTO（数据传输对象）的规则。
2. **类型转换**：通过 `ParseIntPipe`、`ParseBoolPipe` 等，我们可以将参数从字符串转换为其他类型。
3. **默认值设置**：通过 `DefaultValuePipe`，我们可以为参数设置默认值，避免参数未传入时出现错误。
4. **自定义逻辑**：通过自定义 `Pipe`，我们可以实现更加灵活的参数处理逻辑，比如根据业务需求对参数进行特殊的验证或转换。

## 总结

`Pipe` 是 NestJS 中一个非常强大的工具，它可以帮助我们在参数传递给处理函数之前对参数进行验证和转换。通过使用内置的 `Pipe`，我们可以轻松处理常见的验证和转换需求。而通过自定义 `Pipe`，我们可以根据业务需求实现更加灵活的参数处理逻辑。

在实际开发中，合理使用 `Pipe` 可以大大提高代码的健壮性和可维护性，减少不必要的错误和异常。希望通过这篇文章，你对 NestJS 中的 `Pipe` 有了更深入的理解，并能够在项目中灵活运用它们。
