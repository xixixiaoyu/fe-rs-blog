## 装饰器-Decorator

- 一种能力增强（类似游戏里面加buff）
- 装饰器，可以认为它是一个包装，对类对象，方法，属性进行包装
- javaScript中的装饰器是一种函数，写成`@+函数名`
- 装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时



### 类装饰器

- 类装饰器接受一个参数，target参数指的是类本身

```js
function addFly(target) {
  console.log("target：", target);
  target.prototype.isFly = true;
}

@addFly
class Man {
  name = "";
  hp = 0;
  constructor(name, hp = 3) {
    this.init(name, hp);
  }

  init(name, hp) {
    this.name = name;
    this.hp = hp;
  }
}

const p1 = new Man("钢铁侠1版", 5);
console.log("p1 钢铁侠是否可飞:", p1.isFly);
```



#### 类装饰器-传参以及多个执行顺序

- 由上到下依次对装饰器表达式求值
- 求值的结果会被当作函数，由下至上调用

```js
function addFly(target) {
  console.log("addFly");
  target.prototype.isFly = true;
}

function addFlyFun(flyHeight) {
  console.log("addFlyFun");
  return function (target) {
    console.log("addFlyFun 执行");
    target.prototype.fly = function () {
      console.log("飞行高度：", flyHeight);
    };
  };
}

function addTransShape() {
  console.log("addTransShape");
  return function (target) {
    console.log("addTransShape 执行");
    target.prototype.isTransShape = true;
  };
}

@addTransShape()
@addFlyFun(300)
@addFly
class Man {
  name = "";
  hp = 0;
  constructor(name, hp = 3) {
    this.init(name, hp);
  }

  init(name, hp) {
    this.name = name;
    this.hp = hp;
  }
}

const p2 = new Man("钢铁侠1版", 5);
console.log();
console.log("p2 钢铁侠是否可飞:", p2.isFly);
console.log("p2 钢铁侠是否可以变形:", p2.isTransShape);
p2.fly();
```

执行结果：

![image](https://tva2.sinaimg.cn/large/007c1Ltfgy1h9hjvravswj30be078ab0.jpg)





#### 类装饰器-重载构造

```js
function classDecorator(constructor) {
  return class extends constructor {
    hp = 8;
  };
}

@classDecorator
class Man {
  name = "";
  hp = 0;
  constructor(name, hp = 3) {
    this.init(name, hp);
  }

  init(name, hp) {
    this.name = name;
    this.hp = hp;
  }

  run() {
    console.log("跑步");
  }
}

const p1 = new Man("钢铁侠", 5);
console.log(p1); // { name: '钢铁侠', hp: 8 }
```





### 方法装饰器

三参数

- target  - 目标对象
- name - 属性名
- descriptor - 属性描述符

备注：装饰器的本质是利用了 ES5 的 Object.defineProperty 属性，这三个参数其实是和 Object.cdefineProperty 参数是一致的



#### 无参



```js
function methodReadonly(target, key, descriptor) {
  console.log("target=", target, "==key=", key, "==descriptor==", descriptor);
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

class Man {
  constructor(name, hp = 3) {
    this.name = name;
    this.hp = hp;
  }

  @methodReadonly
  toString() {
    return `${this.name}的血量:${this.hp}`;
  }
}
```





#### 有参

```js
function methodDecorator(moreHp = 0) {
  return function (target, key, descriptor) {
    //获取原来的方法
    const originalMethod = descriptor.value;
    //重写该方法
    descriptor.value = function (...args) {
      console.log("当前参数=", args[1]);
      //增加血量hp
      args[1] = args[1] + moreHp;

      //注意,这里是this
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

class Man {
    name = "";
    hp = 0;
    constructor(name, hp = 3) {
        this.init(name, hp);
    }

    @methodDecorator(50)
    init(name, hp) {
        console.log("调用==", this, name, hp)
        this.name = name;
        this.hp = hp;
    }

}

const p1 = new Man("金刚侠", 5);
console.log("p1 的血量:", p1);
```





### 访问器装饰器

- 访问器装饰器和方法装饰器的参数一致

```js
function minHp(minValue) {
  return function (target, propertyKey, descriptor) {
    const oriSet = descriptor.set;
    descriptor.set = function (value) {
      if (value <= minValue) {
        return;
      }
      oriSet.call(this, value);
    };
  };
}

class Man {
  name = "";
  hp = 0;
  constructor(name, hp = 3) {
    this.init(name, hp);
  }

  init(name, hp) {
    this.name = name;
    this.hp = hp;
  }

  @minHp(0)
  set hhp(value) {
    this.hp = value;
  }
}

const p1 = new Man("金刚侠", 5);
p1.hhp = 10;
console.log("hp", p1.hp);
// 小于0无法设置成功
p1.hhp = -10;
console.log("hp", p1.hp);
```





### 属性装饰器

- javascript属性装饰器和方法装饰器的参数一致
- 注意 TypeScript 与 JavaScript 的装饰器实现是不一致的，ts属性装饰器只有前两个参数

#### 无参

```js
function propertyReadonly(target, propertyName, direction) {
  console.log(target, "====", propertyName, "===", direction);
  /*
        {} ==== name === {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: [Function: initializer]
        }
    */
  direction.writable = false;
}

class Man {
  @propertyReadonly name = "default name";

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }
}

const p1 = new Man();
console.log(p1.getName()); // default name
// p1.setName("haha"); //报错： Cannot assign to read only property 'name' of object
```



#### 有参

```js
function CheckType(type) {
  return function (target, name, descriptor) {
    console.log("descriptor.initializer:", descriptor.initializer.toString());
    let value = descriptor.initializer && descriptor.initializer.call(this);

    return {
      enumerable: true,
      configurable: true,
      get: function () {
        return value;
      },
      set: function (c) {
        var cType = typeof c == type;
        if (cType) {
          value = c;
        }
      },
    };
  };
}

class Man {
  @CheckType("string")
  name = "钢铁侠";

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }
}

const p1 = new Man();
p1.setName(55);
console.log("修改后的名字：", p1.getName()); // 钢铁侠
```



### 装饰器加载顺序

- 总体表达式求值顺序：类装饰器 > 属性装饰器，方法装饰器
- 求值结果：属性装饰器，方法装饰器＞类装饰器
- 属性与方法装饰器，谁在前面谁先执行
- 表达式：从上到下执行
- 求值结果：从下到上执行

```js
function classDecorator1() {
  console.log("classDecorator1");
  return function (target) {
    console.log("classDecorator1 执行");
  };
}

function classDecorator2() {
  console.log("classDecorator2");
  return function (target) {
    console.log("classDecorator2 执行");
  };
}

function methodDecorator1() {
  console.log("methodDecorator1");
  return function (target) {
    console.log("methodDecorator1 执行");
  };
}

function methodDecorator2() {
  console.log("methodDecorator2");
  return function (target, key, descriptor) {
    console.log("methodDecorator2 执行");
    return descriptor;
  };
}

function propertyDecorator1() {
  console.log("propertyDecorator1");
  return function (target, key, descriptor) {
    console.log("propertyDecorator1 执行");
    return descriptor;
  };
}

function propertyDecorator2() {
  console.log("propertyDecorator2");
  return function (target, key, descriptor) {
    console.log("propertyDecorator2 执行");
    return descriptor;
  };
}

@classDecorator1()
@classDecorator2()
class Man {
  constructor(name, hp = 3) {
    this.init(name, hp);
  }

  init(name, hp) {
    this.name = name;
    this.hp = hp;
  }

  @propertyDecorator1()
  @propertyDecorator2()
  name = "";

  @methodDecorator1()
  @methodDecorator2()
  run() {
    console.log("跑步");
  }

  hp = 0;
}

const p2 = new Man("钢铁侠1版", 5);
```

执行结果：

```
classDecorator1
classDecorator2
propertyDecorator1
propertyDecorator2
methodDecorator1
methodDecorator2
propertyDecorator2 执行
propertyDecorator1 执行
methodDecorator2 执行
methodDecorator1 执行
classDecorator2 执行
classDecorator1 执行
```



### 注意问题

- Decorator 本身叠加使用时没问题的，因为你的每次包装，都会将属性的 descriptor 返回给上一层的包装，最后就是一个函数包函数包函数的效果，最终返回的还是这个属性的 descriptor
- 我们尽量避免装饰器冲突
- 装饰器只能用于类和类方法，不能用于普通函数



### 装饰器模式-AOP实现（面向切面编程）

- 定义：给对象动态增加职责，并不真正改动对象自身
- 简单来说就是：包装现有的模块，使之更加强大，并不会影响原有接口的功能，可以理解为锦上添花
- ES7 装饰器是AOP的一种实现，可以很方便的实现装饰器模式
- ES7的装饰器可以修改类和方法的原有功能

完成一个需求，用户登录后打印日志

```js
const showLogin = function () {
  console.log("用户登录");
  log();
};
```

使用装饰器模式

```js
Function.prototype.after = function (afterFn) {
  var __self = this;
  return function () {
    var ret = __self.apply(this, arguments);
    afterFn.apply(this, arguments);
    return ret;
  };
};

const showLogin = function () {
  console.log("用户登录");
};

const log = function () {
  console.log("上报日志");
};

showLogin = showLogin.after(log);

showLogin();
```



### 应用场景

- 异常处理
- 日志记录
- 与工厂模式或者装饰器模式结合
- react中封装@connect装饰器等
- 节流，防抖等装饰器
- ...





## Proxy和代理模式



### Reflect

- 反射
- 它囊括了 JavaScript 引擎内部专有的 “内部方法〞。例如Object.keys、Object.getown PropertyName、Objecct.delete等

```js
var obj = {
  name: "tom"
}

// 对象实例直接操作
obj.name;
//第一个参数为被操作的对象，obj
Reflect.get(obj, "name")；

// Object 静态方法操作
object.defineProperty(obj, "age", {
	value: 100
})

Refelct.defineProperty(obj, "age", {
	value: 100
})；
```





### Proxy对象

- 创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）
- 语法：const p = new Proxy(target, handler)
- target：要使用 Proxy 包装的目标对象（可以是任何类型的对象包括原生数组，函数，甚至另一个代理）
- handler：一个对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。每个属性，代表一种可以待办的事项

![image](https://tva3.sinaimg.cn/large/007c1Ltfgy1h9jea09x49j323y0yq1kx.jpg)





### get ， set 读取和设置捕获器

```js
const obj = {};
const proxyObj = new Proxy(obj, {
  get(target, property, receiver) {
    // 目标对象或被代理对象  属性名 最初被调用对象通常是proxy本身
    console.log("get:=============== ");
    console.log("target:", target);
    console.log("property:", property);
    console.log("receiver:", receiver);
    console.log("target === obj:", target === obj);
    console.log("receiver === proxyObj:", receiver === proxyObj);
    console.log(" ");
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    // 目标对象或被代理对象  属性名 值 最初被调用对象通常是proxy本身
    console.log("set:=============== ");
    console.log("target:", target);
    console.log("property:", property);
    console.log("value:", value);
    console.log("receiver:", receiver);
    console.log("target === obj:", target === obj);
    console.log("receiver === proxyObj:", receiver === proxyObj);
    console.log("");
    return Reflect.set(target, property, value, receiver);
  },
});

// 设置属性
proxyObj.name = "yunmu";
// 读取属性
console.log("proxyObj.name:", proxyObj.name);
console.log("obj.name:", obj.name);
```

![image](https://tvax2.sinaimg.cn/mw690/007c1Ltfgy1h9jelpyg79j30hg0pugrg.jpg)





### receiver 不是代理对象的情况

情况一：

- 某个对象obj的原型是一个代理对象
- 当其设置 obj 某个属性，obj自身不存这个属性，但是原型（代理对象）上存在这个属性
- 会触发set捕捉器，这个时候 receiver === 某个对象obj

```js
const proto = {
  name: "parent",
};

let testObj;
const proxyProto = new Proxy(proto, {
  set(target, property, value, receiver) {
    console.log("触发set捕获器:");
    console.log("receiver === proxyProto:", receiver === proxyProto);
    console.log("receiver === testObj:", testObj === receiver);

    console.log("target:", target);
    console.log("property:", property);
    console.log("receiver:", receiver);
    return Reflect.set(target, property, value, receiver);
  },
});

function TestObject(message) {
  this.message = message;
}

TestObject.prototype = proxyProto;

testObj = new TestObject("message");
console.log("准备设置message属性");
testObj.message = "message";
console.log("准备设置name属性");
testObj.name = "parent";
```

执行结果：

![image](https://tvax2.sinaimg.cn/large/007c1Ltfgy1h9jex23q1qj30kk0l4q9x.jpg)



情况二：

- 某个对象obj的原型是一个代理对象
- 实例和原型都有某个属性比如name
- obi访问原型某个 getter 方法，getter里面访问this.name

```js
const proto = {
  name: "proto name",
  age: 18,
  get nameValue() {
    return this.name;
  },
};

const proxyObj = new Proxy(proto, {
  get(target, property, receiver) {
    console.log("receiver === proxyObj", receiver === proxyObj);
    console.log("receiver === obj", receiver === obj);
    // 相当于 target[property]
    return Reflect.get(target, property);

    // 相当于 receiver[property]
    // return Reflect.get(target, property, receiver);
  },
});

const obj = {
  name: "obj name",
  age: 10,
};

// 设置原型
Object.setPrototypeOf(obj, proxyObj);
// proxyObj.nameValue receiver === proxyObj
console.log("proxyObj.nameValue:", proxyObj.nameValue);
// obj.nameValue, obj不存在，访问原型链上的方法，所以触发捕获器
// 期望获取的是对象上的属性，而不是原型上的
// receiver === obj
console.log("obj.nameValue:", obj.nameValue);
// proxyObj.age
console.log("proxyObj.age:", proxyObj.age);
// obj.age
console.log("obj.age:", obj.age);
```





### apply 函数调用捕获器

- 语法：

```js
new Proxy(target, {
  // 目标对象     上下文     参数数组
  apply: function(target, thisArg， argumentsList) {}
})；
```

- 拦截范围：

```js
proxy(..args)
Function.prototype.apply()
Function.prototype.call()
Reflect.apply()
```

示例：

```js
function sum(num1, num2) {
  return num1 + num2;
}

const proxySum = new Proxy(sum, {
  apply(target, thisArg, argumentsList) {
    console.log("target:", target);
    console.log("thisArg:", thisArg);
    console.log("argumentsList:", argumentsList);
    return Reflect.apply(target, thisArg, argumentsList);
  },
});

// 正常调用 proxy(...arguments)
console.log("proxySum():", proxySum(0, -1));

// call
console.log("proxySum.call:", proxySum.call(null, 1, 2));
console.log();

// apply
console.log("proxySum.apply:", proxySum.apply(undefined, [3, 4]));

// Reflect.apply
console.log("Reflect.apply:", Reflect.apply(proxySum, {}, [5, 6]));
```



### getPrototypeof 捕获器

语法：

```js
const p = new Proxy(obj, {
	getPrototypeof(target）{}
})；
```

拦截范围：

```js
Object.getPrototypeOf()
Reflect.getPrototypeOf()
__proto__
Object.prototype.isPrototypeof()
instanceof
```

示例：

```js
const obj = new Object();

const proxyObj = new Proxy(obj, {
  getPrototypeOf(target) {
    console.log("proxyObj getPrototypeOf");
    return Reflect.getPrototypeOf(target);
  },
});

console.log("Object.getPrototypeOf:");
Object.getPrototypeOf(proxyObj);

console.log("Reflect.getPrototypeOf:");
Reflect.getPrototypeOf(proxyObj);

console.log("__proto__");
proxyObj.__proto__;

console.log("Object.prototype.isPrototypeOf");
Object.prototype.isPrototypeOf(proxyObj);

console.log("instanceof");
proxyObj instanceof Object;
```



### setPrototypeof 捕获器

```js
const handlerThrows = {
  setPrototypeOf(target, newProto) {
    throw new Error("custom error");
  },
};

const newProto = {},
  target = {};
const p2 = new Proxy(target, handlerThrows);
Object.setPrototypeOf(p2, newProto); // throws new Error("custom error")
Reflect.setPrototypeOf(p2, newProto); // throws new Error("custom error")
```





### construct 捕获器

- 拦截new操作，Function和Class都可以new，所以都可以被拦截

```js
const handler = {
  // 拦截new 操作符
  // new proxy(...args)
  // Reflect.construct()
  construct(target, argumentsList, newTarget) {
    console.log("construct:", target.name);
    return Reflect.construct(target, argumentsList, newTarget);
  },
};

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.getName = function () {
  return this.name;
};

class PersonClass {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getName() {
    return this.name;
  }
}

var proxyFun = new Proxy(Person, handler);
var proxyClass = new Proxy(PersonClass, handler);

console.log("ProxyFun:", new proxyFun("小红", 18));
console.log("");
console.log("proxyClass:", new proxyClass("小明", 12));
```



### 一个场景覆盖其他捕获器

一个对象obj有name, age, sex属性。

- name不可被配置 (defineProperty)
- 尝试删除name属性 (delete)
- 再查询name的属性描述符 (getownPropertyDescriptor)
- 让obj不可被扩展 (preventExtensions)
- 再查询obj的扩展状态 (isExtensible)
- 判断是不是 in 对象 (has)
- 打印obj的键 (ownKeys)

```js
const handler = {
  // 拦截修改属性描述符信息
  // Object.defineProperty()
  // Reflect.defineProperty()，
  // proxy.property='value'
  defineProperty(target, prop, descriptor) {
    console.log("handler:defineProperty");
    return Reflect.defineProperty(target, prop, descriptor);
  },

  // 拦截delete操作
  // delete proxy[property] 和 delete proxy.property
  // Reflect.deleteProperty()
  deleteProperty(target, prop) {
    console.log("handler:deleteProperty");
    return Reflect.deleteProperty(target, prop);
  },

  // 拦截获取属性描述符
  // Object.getOwnPropertyDescriptor()
  // Reflect.getOwnPropertyDescriptor()
  getOwnPropertyDescriptor(target, prop) {
    console.log("handler:getOwnPropertyDescriptor");
    return Reflect.getOwnPropertyDescriptor(target, prop);
  },

  // 拦截in
  // property in proxy
  // 继承属性查询: foo in Object.create(proxy)
  // with 检查: with(proxy) { (property); }
  // Reflect.has()
  has(target, prop) {
    console.log("handler:has");
    return Reflect.has(target, prop);
  },

  // Object.preventExtensions()
  // Reflect.preventExtensions()
  preventExtensions(target) {
    console.log("handler:preventExtensions");
    return Object.preventExtensions(target);
  },

  // Object.isExtensible()
  // Reflect.isExtensible()
  isExtensible(target) {
    console.log("handler:isExtensible");
    return Reflect.isExtensible(target);
    // return true; 也可以return 1;等表示为true的值
  },

  // Object.getOwnPropertyNames()
  // Object.getOwnPropertySymbols()
  // Object.keys()
  // Reflect.ownKeys()
  ownKeys(target) {
    console.log("handler:ownKeys");
    return Reflect.ownKeys(target);
  },
};

const obj = {
  name: "tom",
  age: 18,
  sex: 1,
};
const proxyObj = new Proxy(obj, handler);

// defineProperty ，让name不可配置
Object.defineProperty(proxyObj, "name", {
  configurable: false,
});
console.log("\r\n");
//delete 尝试删除
console.log("delete proxyObj.name:", delete proxyObj.name, "\r\n");

// getOwnPropertyDescriptor
console.log(
  "getOwnPropertyDescriptor",
  Object.getOwnPropertyDescriptor(proxyObj, "name"),
  "\r\n"
);

// has
console.log("name in proxyObj:", "name" in proxyObj, "\r\n");

// preventExtensions
Object.preventExtensions(proxyObj);
console.log();

console.log("proxyObj isExtensible:", Object.isExtensible(proxyObj), "\r\n");

// ownKeys
console.log("ownKeys:", Reflect.ownKeys(proxyObj), "\r\n");
```





### 注意事项

- 捕获器函数里面的this是new Proxy的第二个参数对象
- Proxy的实例，数据类型和被代理数据类型一致

```js
const obj = {};

const handler = {
  get(target, property, receiver) {
    console.log("get: this === handler:", this === handler); // set: this === handler: true
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log("set: this === handler:", this === handler); // get: this === handler: true
    return Reflect.set(target, property, value, receiver);
  },
};

const proxyObj = new Proxy(obj, handler);

// 设置属性
proxyObj.name = 1;
// 读取属性
console.log("proxyObj.name", proxyObj.name); // proxyObj.name 1



// 数据类型
function sum(num1, num2) {
  return num1 + num2;
}

const proxySum = new Proxy(sum, {
  apply(target, thisArg, argumentsList) {
    return Reflect.apply(target, thisArg, argumentsList);
  },
});

console.log("typeof proxySum:", typeof proxySum); // typeof proxySum: function
console.log("toString proxySum:", Object.prototype.toString.call(proxySum)); // toString proxySum: [object Function]
```



### 可取消代理

- Proxy.revocable(target,  handler)
- 返回值：{"proxy": proxy,  "revoke": revoke}
  - proxy：和用一般方式 new Proxy(target, handler) 创建的代理对象没什么不同
  - revoke：撤销掉和它一起生成的那个代理对象

```js
const revocable = Proxy.revocable(
  {
    name: "person",
  },
  {
    get(target, propertyKey, receiver) {
      return Reflect.get(target, propertyKey, receiver);
    },
  }
);
const proxy = revocable.proxy;
console.log("proxy.name:", proxy.name); // "person"

revocable.revoke();
console.log("typeof proxy", typeof proxy); // "object"，

// TypeError: Cannot perform 'get' on a proxy that has been revoked
console.log("proxy.name:", proxy.name);
proxy.name = 1; // 还是 TypeError
delete proxy.name; // 又是 TypeError
```





### 代理模式

- 当不方便直接访问一个对象（被代理对象），提供另外一个对象（代理对象）来控制对这个对象的访问。
- 代理对象对请求做出一些处理之后，再把请求转交给被代理对象

应用场景：

1、缓存数据

```js
function sum(a, b) {
  return a + b;
}

function cacheProxy(fn) {
  var cache = Object.create(null);
  return function (...args) {
    const key = args.map((arg) => JSON.stringify(arg)).join("__");
    if (cache[key] != null) {
      console.log("cached:", cache[key]);
      return cache[key];
    }
    const result = fn.apply(null, args);
    cache[key] = result;
    console.log("no cache:", result);
    return result;
  };
}

const proxySum = cacheProxy(sum);
proxySum(3, 5); // no cache: 8
proxySum(3, 5); // cached: 8
```



2、数据校验

```js
function sum(num1, num2) {
  return num1 + num2;
}

const proxySum = new Proxy(sum, {
  apply(target, thisArg, argumentsList) {
    const num1 = argumentsList[0];
    const num2 = argumentsList[1];

    if (typeof num1 !== "number") {
      throw new TypeError("num1 must be a number");
    }
    if (typeof num2 !== "number") {
      throw new TypeError("num2 must be a number");
    }
    return Reflect.apply(target, thisArg, argumentsList);
  },
});

console.log("3 + 9:", proxySum(3, 9));
console.log("3 + undefined:", proxySum(3));
```





### 代理模式对比装饰器模式

- 装饰器模式：增强其能力，多个装饰，层层增加其能力
- 代理模式：控制器访问能力，隐藏底层操作的具体信息







## 基于Proxy的不可变数据



### 可变数据

- 对象被赋值几次后，更改了对象的某个属性，发现其被引用的对象也发生了变化。这就是可变对象
- 因为两个对象用的相同的引用地址
- 存在问题：除非你清楚的知道要修改的 对象/属性 及其关联的对象，否则你很难发现它是何时被变化的





### 不可变的数据

> Immutable Data(不可变数据) 就是一旦创建，就不能再被更改的数据
>
> 对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象
>
> 实现原理就是使用旧数据创建新数据时，要保证旧数据可用且不变
>
> 同时为了避免 深度克隆把所有节点都复制一遍带来的性能损耗
>
> Immutable 使用了结构共享，即如果对象树中一个节点发生只修改这个节点和受它影响的父节点，其它节点则进行共享





### 不可变数据的优点

- 保护数据，减少bug
  - 防止意外的更改，没有更改就没有伤害
- 方便跟踪数据变更，便于排错
  - 每次变更，都有变更前的数据和变更后的数据



### 实现不可变数据 - 方法

- 用专门独立的方法去更改数据的属性

```js
function updateProperty(obj, key, value) {
  const newObj = {
    ...obj,
    [key]: value,
  };
  return newObj;
}

var person = {
  name: "person",
  age: 18,
};

const person1 = updateProperty(person, "name", "yunmu");

console.log("person1.name:", person1.name); // person1.name: yunmu
console.log("person === person1", person === person1); // person === person1 false
```

缺点

- 调用麻烦
- 没有面向对象编程的”气味‘





### 实现不可变数据- 自定义对象

- 自定新的对象类型，把对数据的操作细节封装在新的对象类型上

```js
class MyObject {
  constructor(obj = {}) {
    this.obj = { ...obj };
  }

  get(name) {
    return this.obj[name];
  }

  set(name, value) {
    return new MyObject({
      ...this.obj,
      [name]: value,
    });
  }
}

var person = new MyObject({
  name: "person",
  age: 18,
});

const person1 = person.set("name", "yun");

console.log("person1.name:", person1.get("name")); // person1.name: yun
console.log("person === person1", person === person1); // person === person1 false
```

著名的 immutable-js，就是这个思路,定义List、 Stack、 Map、OrderedMap、Set、OrderedSet和Record这么多对象



### 不可变对象-函数+ 复制的思路

- 通过函数调用，内部复制，产生新的对象
- 之后，你对新的对象操作
- 最后返回你更新完毕的新对象

```js
function produce(obj, recipe) {
  const newObj = { ...obj };
  recipe(newObj);
  return newObj;
}

const person = {
  name: "person",
  age: 21,
};

const person1 = produce(person, (draft) => {
  draft.name = "person 1";
  draft.age = 10;
});

console.log("person:", person); // person: { name: 'person', age: 21 }
console.log("person1", person1); // person1 { name: 'person 1', age: 10 }
console.log("person1 === person", person1 === person); // person1 === person false
```

但这种方法会有比较大的性能消耗



### 使用Proxy代理思路

```js
const arr = Array.from({ length: 10000 }, (v, index) => {
  return {
    name: "name" + index,
    age: ~~(Math.random() * 100),
    sex: ~~(Math.random() * 10) / 2,
    p4: Math.random(),
    p5: Math.random() + "",
    p6: Math.random(),
    p7: Math.random(),
    p8: Math.random(),
    p9: Math.random(),
    p10: Math.random() + "",
  };
});

function produce(obj, recipe) {
  const state = {
    base: obj, // 基础对象
    copy: {}, // 被更改后得数据
    draft: {}, // 代理信息
    currentKey: 0, // 当前操作的key
  };

  // 代理数据里面具体得某条数据得读写
  // arr[500].name
  const handlerItem = {
    get(target, property, receiver) {
      // 优先从copy里面读取
      if (state.copy[state.currentKey]) {
        return state.copy[state.currentKey][property];
      }
      // 从基础对象里面读取
      return state.base[state.currentKey][property];
    },
    set(target, property, value, receiver) {
      console.log("set:", property, value);
      return Reflect.set(state.copy[state.currentKey], property, value);
    },
  };

  // 代理数组得读写
  const handler = {
    get(target, property, receiver) {
      console.log("get:", property);
      state.currentKey = property;

      // arr[500].name = x
      // 如果读取，就进一步代理某个具体的对象
      if (!state.draft[property]) {
        const val = { ...state.base[property] };
        const proxy = new Proxy(val, handlerItem);
        state.draft[property] = proxy;
        state.copy[property] = val;
      }
      return state.draft[property];
    },
    set(target, property, value, receiver) {
      console.log("set:", property, value);
      Reflect.set(state.copy, property, value);
      console.log("state.copy[property]", state.copy);
    },
  };
  const proxyObj = new Proxy(obj, handler);
  //传递代理对象出去
  recipe(proxyObj);
  return proxyObj;
}

console.time("produce");
const arr1 = produce(arr, (draft) => {
  //draft为代理对象
  draft[500] = {};
  draft[500].name = "tom";
});
console.timeEnd("produce");

console.log("arr[500].name", arr[500].name);
console.log("arr1[500].name", arr1[500].name);
```





### 第三方不可变对象

- JavaScript 没有开箱即用的不可变结构，但有第三方实现
- 最受欢迎的是 Immutable.js 和 immerjs

- immutableJS需要使用者学习它的数据结构操作方式，没有 Immer提供的使用原生对象的操作方式简单、易用
- ImmutableJS它的操作结果需要通过toJS方法才能得到原生对象，这使得在操作一个对象的时候，时刻要注意操作的是原生对象还是ImmutableJS 的返回结果，稍不注意，就会产生意想不到的 bug
- immer 体量小巧

