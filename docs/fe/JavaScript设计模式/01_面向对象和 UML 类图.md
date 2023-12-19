# 面向对象
- 面向对象编程，Object-Oriented-Program（简称 OOP）是一种目前主流的编程思想
- 90年代随着 Java 一起发展壮大，现在依然是主流
- 它将抽象的编程概念，想象成**一个对象即对应生活中的实物**，更好理解
- **设计模式就是基于 OOP 编程思想的，**不适用于其他编程思想（如函数式编程）

- 类 class，即模板
```typescript
class People {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  // 如果函数不写返回值类型，则默认为 void
  eat() {
    alert(`${this.name} eat something`);
  }
  speak() {
    alert(`My name is ${this.name}, age ${this.age}`);
  }
}
```

- 对象，即实例
```typescript
// 创建实例
const zhang = new People("yun", 20);
zhang.eat();
zhang.speak();

// 创建实例
const wang = new People("mu", 21);
wang.eat();
wang.speak();
```

- Vue React 组件，也是对象
```html
<!-- page1 -->
<template>
    <some-component :name="a"></some-component>
</template>

<!-- page2 -->
<template>
    <some-component :name="b"></some-component>
</template>
```



## 三要素

- 继承-抽离公共代码，实现代码复用
```typescript
class Student extends People {
    school: string

    constructor(name: string, age: number, school: string) {
        super(name, age);
        this.school = school;
    }
    study() {
        alert(`${this.name} study`);
    }
}

const yunmu = new Student("yunmu", 10, "A小学");
yunmu.study();
yunmu.eat();
```

- 封装-高内聚，低耦合
   - 可见性修饰符
      - `public` 外部可访问，默认
      - `protected` 内部或子类可访问
      - `private` 只有内部可访问
```typescript
// People 中可增加 protected weight: number
// Student 中可增加 private girlfriend: string
```

- 多态-更好的扩展性
```typescript
interface IStyleInfo {
  [key: string]: string;
}

class JQuery {
  // 函数重载
  css(key: string, value: string);
  css(styleInfo: IStyleInfo);
  css(keyOrStyleInfo: string | IStyleInfo, value?: string) {
    if (typeof keyOrStyleInfo === "string") {
      // key-value 形式
      const key = keyOrStyleInfo;
      console.log("Set CSS", key, value);
    } else {
      // object 形式
      const styleInfo = keyOrStyleInfo;
      for (const key in styleInfo) {
        const value = styleInfo[key];
        console.log("Set CSS", key, value);
      }
    }
  }
}

const jquery = new JQuery();
jquery.css("color", "red");
jquery.css({ color: "red", "font-size": "14px" });
```

# UML

- 统一建模语言（Unified Modeling Language）
- 软件设计的绘图标准
- 使用
   - 安装 MS Visio
   - 在线画图 processon.com
- 作用
   - 需求指导设计，设计指导开发
   - UML 类图就是一个重要的工具和表达方式，可快速熟悉代码结构，核心属性和方法


## 单个类绘制

- 三个区域：名称，属性，方法
- 权限描述：`+(public)`、`#(protected)`、`-(private)`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1674453683629-5bb09a4a-c508-4f42-807f-7902c7cbfc69.png#averageHue=%23f4f4f4&clientId=u64ce3def-57c5-4&from=paste&height=271&id=uec160ddf&originHeight=542&originWidth=968&originalType=binary&ratio=1&rotation=0&showTitle=false&size=60882&status=done&style=none&taskId=u3c30e999-1568-4c22-bde5-8ae1961165d&title=&width=484)

## 类图的几种关系

- 实现 - 实现接口
- 泛化 - 继承
- 关联 - A 是 B 的一个属性 
   - 聚合 - 整体包含部分，部分可以脱离整体单独存在
   - 组合 - 整体包含部分，部分不可脱离整体
   - 依赖 - 不是属性，函数参数、返回值

【注意】聚合、组合、依赖，**都属于关联关系**，更加细化了。日常工作中没必要区分那么细致，都当做关联关系即可

### 实现接口
注意：TS 的 interface 和 Java 的不一样，TS 有属性，而 Java 的没有属性。而 UML 类图是依据 Java 语法而画的（没有属性区域），所以合并到一个区域了
![实现接口.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1674453954571-54ced927-b9d3-447e-99f0-79e4a21c4834.png#averageHue=%23ededed&clientId=u64ce3def-57c5-4&from=drop&id=u1a51e65e&originHeight=700&originWidth=724&originalType=binary&ratio=1&rotation=0&showTitle=false&size=65022&status=done&style=none&taskId=u6d95bd4a-8e59-4c68-862d-1357b552b52&title=)


### 泛化 - 继承父类
![泛化.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1674454002828-6e93d78e-eafc-4bf1-b62e-04db2d5518f2.png#averageHue=%23ececec&clientId=u64ce3def-57c5-4&from=drop&id=ue1564fb0&originHeight=708&originWidth=662&originalType=binary&ratio=1&rotation=0&showTitle=false&size=51302&status=done&style=none&taskId=u1b0e5230-506f-4e82-b188-632b12637d3&title=)

### 关联

分类

- 单项关联 - 最常见
- 双向关联
- 自关联

![关联.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1674454039958-76880b99-1d80-47a5-8cc2-46091fa0b4af.png#averageHue=%23ededed&clientId=u64ce3def-57c5-4&from=drop&id=u1d387f47&originHeight=304&originWidth=1448&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35331&status=done&style=none&taskId=u83b71e75-7faa-45a2-80dc-b9bb9db2da5&title=)

### 聚合

- 整体包含部分，部分可以脱离整体单独存在

![聚合.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1674454073548-8f0bb668-fcfb-43d4-bc03-1cd7b43e1e46.png#averageHue=%23eeeeee&clientId=u64ce3def-57c5-4&from=drop&id=u2a7c8d61&originHeight=294&originWidth=1440&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27192&status=done&style=none&taskId=ub3aad5c8-6ede-4a92-a450-9df834c70f6&title=)

### 组合

- 整体包含部分，部分不可脱离整体

![组合.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1674454105023-e65aef6e-f017-4b26-a3d8-61bfcb7a6912.png#averageHue=%23eeeeee&clientId=u64ce3def-57c5-4&from=drop&id=u8b23ead3&originHeight=298&originWidth=1442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26686&status=done&style=none&taskId=u801a5490-c71d-47d2-a7e5-117f186a3f4&title=)

### 依赖

- 不是属性，函数参数、返回值

![依赖.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1674454137924-8c341bb5-29e2-49d7-b347-d3cae1d20f30.png#averageHue=%23efefef&clientId=u64ce3def-57c5-4&from=drop&id=uc25a8ab6&originHeight=304&originWidth=1454&originalType=binary&ratio=1&rotation=0&showTitle=false&size=29169&status=done&style=none&taskId=ue4fe7a44-b645-4ffd-a6ab-2252ff5b4e4&title=)

## 总结
再次体会 UML 类图的作用

- 单个类
- 类之间的关系
- 关联关系的细分，不必过于较真

![实现-泛化.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1674454198155-4d359146-1074-47b8-93f2-4ba1215604a7.png#averageHue=%23efeeee&clientId=u64ce3def-57c5-4&from=drop&id=u7865d300&originHeight=782&originWidth=1416&originalType=binary&ratio=1&rotation=0&showTitle=false&size=129092&status=done&style=none&taskId=ub4d7a202-d4c2-4d95-931d-7101cd3ee57&title=)

![关联总结.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1674454206762-080f2f87-5dcb-4592-aa4e-cae3182eba60.png#averageHue=%23f1f1f1&clientId=u64ce3def-57c5-4&from=drop&id=uaa51968f&originHeight=1322&originWidth=1658&originalType=binary&ratio=1&rotation=0&showTitle=false&size=138920&status=done&style=none&taskId=udb0626e3-2c2d-4522-ab68-5a21a84fb07&title=)


