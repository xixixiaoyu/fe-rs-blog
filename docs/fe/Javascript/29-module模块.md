# 课程简介

## Module 模块系统

### 学什么

> 初识 Module
>
> Module 的导入和导出
>
> Module 的注意事项和应用

### 初识 Module

> Module 是什么
>
> Module 的基本用法

### Module 的导入和导出

> export default 和对应的 import
>
> export 和对应的 import

### Module 的注意事项和应用

> Module 的注意事项
>
> Module 的应用

# 1.初识 Module

## Module 是什么

- 什么是模块
- 什么是模块系统

### 1.什么是模块

> 模块：一个一个的局部作用域的代码块

`base.js`

```js
(function () {
  // 默认参数
  const DEFAULTS = {
    // 初始索引
    initialIndex: 0,
    // 切换时是否有动画
    animation: true,
    // 切换速度，单位 ms
    speed: 300,
  };
  // base
  const ELEMENT_NODE = 1;
  const SLIDER_ANIMATION_CLASSNAME = "slider-animation";

  // 父类
  class BaseSlider {
    constructor(el, options) {
      if (el.nodeType !== ELEMENT_NODE) throw new Error("实例化的时候，请传入 DOM 元素！");

      // 实际参数
      this.options = {
        ...DEFAULTS,
        ...options,
      };

      const slider = el;
      const sliderContent = slider.querySelector(".slider-content");
      const sliderItems = sliderContent.querySelectorAll(".slider-item");

      // 添加到 this 上，为了在方法中使用
      this.slider = slider;
      this.sliderContent = sliderContent;
      this.sliderItems = sliderItems;

      this.minIndex = 0;
      this.maxIndex = sliderItems.length - 1;
      this.currIndex = this.getCorrectedIndex(this.options.initialIndex);

      // 每个 slider-item 的宽度（每次移动的距离）
      this.itemWidth = sliderItems[0].offsetWidth;

      this.init();
    }

    // 获取修正后的索引值
    // 随心所欲，不逾矩
    getCorrectedIndex(index) {
      if (index < this.minIndex) return this.maxIndex;
      if (index > this.maxIndex) return this.minIndex;
      return index;
    }

    // 初始化
    init() {
      // 为每个 slider-item 设置宽度
      this.setItemsWidth();

      // 为 slider-content 设置宽度
      this.setContentWidth();

      // 切换到初始索引 initialIndex
      this.move(this.getDistance());

      // 开启动画
      if (this.options.animation) {
        this.openAnimation();
      }
    }

    // 为每个 slider-item 设置宽度
    setItemsWidth() {
      for (const item of this.sliderItems) {
        item.style.width = `${this.itemWidth}px`;
      }
    }

    // 为 slider-content 设置宽度
    setContentWidth() {
      this.sliderContent.style.width = `${this.itemWidth * this.sliderItems.length}px`;
    }

    // 不带动画的移动
    move(distance) {
      this.sliderContent.style.transform = `translate3d(${distance}px, 0px, 0px)`;
    }

    // 带动画的移动
    moveWithAnimation(distance) {
      this.setAnimationSpeed(this.options.speed);
      this.move(distance);
    }

    // 设置切换动画速度
    setAnimationSpeed(speed) {
      this.sliderContent.style.transitionDuration = `${speed}ms`;
    }

    // 获取要移动的距离
    getDistance(index = this.currIndex) {
      return -this.itemWidth * index;
    }

    // 开启动画
    openAnimation() {
      this.sliderContent.classList.add(SLIDER_ANIMATION_CLASSNAME);
    }

    // 关闭动画
    closeAnimation() {
      this.setAnimationSpeed(0);
    }

    // 切换到 index 索引对应的幻灯片
    to(index) {
      index = this.getCorrectedIndex(index);
      if (this.currIndex === index) return;

      this.currIndex = index;
      const distance = this.getDistance();

      if (this.options.animation) {
        return this.moveWithAnimation(distance);
      } else {
        return this.move(distance);
      }
    }

    // 切换上一张
    prev() {
      this.to(this.currIndex - 1);
    }

    // 切换下一张
    next() {
      this.to(this.currIndex + 1);
    }

    // 获取当前索引
    getCurrIndex() {
      return this.currIndex;
    }
  }

  window.BaseSlider = BaseSlider;
})();
```

`slider.js`

```js
 // 子类
    (function () {
        class Slider extends BaseSlider {
            constructor(el, options) {
                super(el, options);
                this._bindEvent();
            }

            _bindEvent() {
                document.addEventListener(
                    'keyup',
                    ev => {
                        if (ev.keyCode === 37) {
                            this.prev();
                        } else if (ev.keyCode === 39) {
                            this.next();
                        }
                    },
                    false
                );
            }
        }

  window.Slider = Slider;
```

`index.js`

```js
new Slider(document.querySelector(".slider"));
```

`index.html`

```
<script src="./base.js"></script>
<script src="./silder.js"></script>
<script src="./index.js"></script>
```

### 2.什么是模块系统

**模块系统需要解决的主要问题**

> ES Module
>
> ① 模块化的问题
>
> ② 消除全局变量
>
> ③ 管理加载顺序
>
> 以前的模块系统 RequireJS seaJS

## Module 的基本用法

> Module 需要服务器的环境

[![DncBqK.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DncBqK.png)](https://imgchr.com/i/DncBqK)

- 使用 Module 模块化之前的例子
- 使用 script 标签加载模块
- 分析 Module 解决的问题

### 1.使用 Module 模块化之前的例子

[![DRWKIK.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRWKIK.png)](https://imgchr.com/i/DRWKIK)

[![DRWBRg.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRWBRg.png)](https://imgchr.com/i/DRWBRg)

[![DRWyss.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRWyss.png)](https://imgchr.com/i/DRWyss)

[![DRWRoV.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRWRoV.png)](https://imgchr.com/i/DRWRoV)

`base.js`

```js
// 默认参数
const DEFAULTS = {
  // 初始索引
  initialIndex: 0,
  // 切换时是否有动画
  animation: true,
  // 切换速度，单位 ms
  speed: 300,
};
// base
const ELEMENT_NODE = 1;
const SLIDER_ANIMATION_CLASSNAME = "slider-animation";

// 父类
class BaseSlider {
  constructor(el, options) {
    if (el.nodeType !== ELEMENT_NODE) throw new Error("实例化的时候，请传入 DOM 元素！");

    // 实际参数
    this.options = {
      ...DEFAULTS,
      ...options,
    };

    const slider = el;
    const sliderContent = slider.querySelector(".slider-content");
    const sliderItems = sliderContent.querySelectorAll(".slider-item");

    // 添加到 this 上，为了在方法中使用
    this.slider = slider;
    this.sliderContent = sliderContent;
    this.sliderItems = sliderItems;

    this.minIndex = 0;
    this.maxIndex = sliderItems.length - 1;
    this.currIndex = this.getCorrectedIndex(this.options.initialIndex);

    // 每个 slider-item 的宽度（每次移动的距离）
    this.itemWidth = sliderItems[0].offsetWidth;

    this.init();
  }

  // 获取修正后的索引值
  // 随心所欲，不逾矩
  getCorrectedIndex(index) {
    if (index < this.minIndex) return this.maxIndex;
    if (index > this.maxIndex) return this.minIndex;
    return index;
  }

  // 初始化
  init() {
    // 为每个 slider-item 设置宽度
    this.setItemsWidth();

    // 为 slider-content 设置宽度
    this.setContentWidth();

    // 切换到初始索引 initialIndex
    this.move(this.getDistance());

    // 开启动画
    if (this.options.animation) {
      this.openAnimation();
    }
  }

  // 为每个 slider-item 设置宽度
  setItemsWidth() {
    for (const item of this.sliderItems) {
      item.style.width = `${this.itemWidth}px`;
    }
  }

  // 为 slider-content 设置宽度
  setContentWidth() {
    this.sliderContent.style.width = `${this.itemWidth * this.sliderItems.length}px`;
  }

  // 不带动画的移动
  move(distance) {
    this.sliderContent.style.transform = `translate3d(${distance}px, 0px, 0px)`;
  }

  // 带动画的移动
  moveWithAnimation(distance) {
    this.setAnimationSpeed(this.options.speed);
    this.move(distance);
  }

  // 设置切换动画速度
  setAnimationSpeed(speed) {
    this.sliderContent.style.transitionDuration = `${speed}ms`;
  }

  // 获取要移动的距离
  getDistance(index = this.currIndex) {
    return -this.itemWidth * index;
  }

  // 开启动画
  openAnimation() {
    this.sliderContent.classList.add(SLIDER_ANIMATION_CLASSNAME);
  }

  // 关闭动画
  closeAnimation() {
    this.setAnimationSpeed(0);
  }

  // 切换到 index 索引对应的幻灯片
  to(index) {
    index = this.getCorrectedIndex(index);
    if (this.currIndex === index) return;

    this.currIndex = index;
    const distance = this.getDistance();

    if (this.options.animation) {
      return this.moveWithAnimation(distance);
    } else {
      return this.move(distance);
    }
  }

  // 切换上一张
  prev() {
    this.to(this.currIndex - 1);
  }

  // 切换下一张
  next() {
    this.to(this.currIndex + 1);
  }

  // 获取当前索引
  getCurrIndex() {
    return this.currIndex;
  }
}

export default BaseSlider;
```

`slider.js`

```js
import BaseSlider from "./base.js";

class Slider extends BaseSlider {
  constructor(el, options) {
    super(el, options);
    this._bindEvent();
  }

  _bindEvent() {
    document.addEventListener(
      "keyup",
      (ev) => {
        if (ev.keyCode === 37) {
          this.prev();
        } else if (ev.keyCode === 39) {
          this.next();
        }
      },
      false
    );
  }
}

export default Slider;
```

`index.js`

```js
import Slider from "./slider.js";
new Slider(document.querySelector(".slider"));
```

### 2.使用 script 标签加载模块

> 一个文件就是一个模块

```html
<script src="./index.js" type="module"></script>

<script>
  console.log(Slider); //×
</script>

<!--只要你会用到 import 或 export，在使用 script 标签加载的时候，就要加上 type="module"-->
```

### 3.分析 Module 解决的问题

> ① 模块化的问题
>
> ② 消除全局变量
>
> ③ 管理加载顺序

# 2.导入和导出

### Module 的两种导出和导入

- export default 导出和对应的 import 导入
- export 导出和对应的 import 导入

#### export default 和对应的 import

- 认识导出和导入
- 基本用法

##### 1.认识导出和导入

> 导出的东西可以被导入（import），并访问到
>
> 一个模块没有导出，也可以将其导入
>
> 被导入的代码都会执行一遍，也仅会执行一遍

```html
//module.js

<script type="module">
  import "./module.js";
  import "./module.js";
  import "./module.js";
</script>
```

##### 2.基本用法

[![Dn7yon.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dn7yon.png)](https://imgchr.com/i/Dn7yon)

```js
//可以随便起名
import aaa from "./module.js";
console.log(aaa);
```

#### export 和对应的 import

- 基本用法
- 多个导出
- 导出导入时起别名
- 整体导入
- 同时导入

##### 1.基本用法

[![DgYOaV.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DgYOaV.png)](https://imgchr.com/i/DgYOaV)

[![Dgt9M9.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dgt9M9.png)](https://imgchr.com/i/Dgt9M9)

##### 2.多个导出

[![DgU8gg.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DgU8gg.png)](https://imgchr.com/i/DgU8gg)

[![DgUtDs.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DgUtDs.png)](https://imgchr.com/i/DgUtDs)

**多个导出**

[![DgUxG8.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DgUxG8.png)](https://imgchr.com/i/DgUxG8)

**多个导入**

[![DRex0g.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRex0g.png)](https://imgchr.com/i/DRex0g)

```js
//2.多个导出
function fn() {}

// export fn; // ×
// export function () {} // × 匿名不行

//export {fn}; // √
export function fn() {} // √

//class className {}

// export className; // ×
// export class  {} // 匿名不行  ×

//export { className } // √
export class className {} // √

//const age = 18;

//export { age }; // √
//export age; // ×
export const age = 18; // √

export { fn, className, age };

<script type="module">
  //import {fn} from "./js/module.js"; //console.log(fn); //import {className} from
  "./js/module.js"; //console.log(className); //import {age} from "./js/module.js";
  //console.log(age); import {(fn, className, age)} from "./js/module.js"; console.log(fn);
  console.log(className); console.log(age);
</script>;
```

##### 3.导出导入时起别名

[![DgaRyQ.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DgaRyQ.png)](https://imgchr.com/i/DgaRyQ)

```js
function fn() {}
class className {}
const age = 18;
//导出取别名
export { fn as add, className, age };
```

[![Dgahes.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dgahes.png)](https://imgchr.com/i/Dgahes)

```js
<script type="module">
    //导出取别名
    import {add, className as Person, age} from "./js/module.js";
	console.log(add);
	console.log(Person);
	console.log(age);
</script>
```

##### 4.整体导入

> 会导入所有输出，包括通过 export default 导出的

[![DgwI2T.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DgwI2T.png)](https://imgchr.com/i/DgwI2T)

```js
function fn() {}
class className {}
const age = 18;
//导出取别名
export { fn as add, className, age };

let name = "云牧";
export default name;
```

[![Dg0FZd.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dg0FZd.png)](https://imgchr.com/i/Dg0FZd)

```html
<script type="module">
  //import { add, age, className } from './module.js'
  //import name from './module.js'
  //console.log(add);
  //console.log(Person);
  //console.log(age);
  //console.log(name)

  //通配符表示所有 导出所有  导入export 和 export default的导出东西
  import * as obj from "./js/module.js";
  console.log(obj);
  console.log(obj.add);
  console.log(obj.default);
</script>
```

##### 5.同时导入

[![Dg0DoR.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/Dg0DoR.png)](https://imgchr.com/i/Dg0DoR)

```js
//同时导入 一定是 export default 的在前
import username, { add, age, className } from "./js/module.js";
console.log(add);
console.log(className);
console.log(age);
console.log(username);
```

# 3.Module 的注意事项

- 模块顶层的 this 指向
- import 关键字和 import()函数
- 导入导出的复合写法

## 1.模块顶层的 this 指向

[![DRiAC8.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRiAC8.png)](https://imgchr.com/i/DRiAC8)

[![DRimuj.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRimuj.png)](https://imgchr.com/i/DRimuj)

## 2.import 和 import()

[![DRFcWT.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRFcWT.png)](https://imgchr.com/i/DRFcWT)

```html
<script type="module">
  //2.import 和 import()
  //import 命令具有提升效果，会提升到整个模块的头部，率先执行
  console.log("我是第一 最棒的");
  console.log("我是第二 第二棒的");
  import "./js/module.js";

  /* 
	    //import 执行的时候，代码还没执行
        //import 和 export 命令只能在模块的顶层，不能在代码块中执行
      if (PC) {
         import 'pc.js';
       } else if (Mobile) {
         import 'mobile.js';
       } //×

	  */

  /* 
	    //import() 可以按条件导入  成功返回promise
        if (PC) {
          import("pc.js").then().catch();
        } else if (Mobile) {
          import("mobile.js").then().catch();
        }
	  */
</script>
```

[![DRFfOJ.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRFfOJ.png)](https://imgchr.com/i/DRFfOJ)

## 3.导入导出的复合写法

[![DREW6S.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DREW6S.png)](https://imgchr.com/i/DREW6S)

```js
// 3.导入导出的复合写法
//  export { age } from "./js/module.js";
//  复合写法导出的，无法在当前模块中使用
//  console.log(age);

// 等价于
import { age } from "./js/module.js";
export { age };
console.log(age);
```

[![DRELlT.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRELlT.png)](https://imgchr.com/i/DRELlT)

# 4.Module 的应用

## default 默认值模块

[![DRuO6x.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRuO6x.png)](https://imgchr.com/i/DRuO6x)

[![DRKAjP.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRKAjP.png)](https://imgchr.com/i/DRKAjP)

## 常量模块

[![DRQeYQ.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRQeYQ.png)](https://imgchr.com/i/DRQeYQ)

[![DRQ6te.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRQ6te.png)](https://imgchr.com/i/DRQ6te)

## 键盘控制模块

[![DR8C4S.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DR8C4S.png)](https://imgchr.com/i/DR8C4S)

[![DR86bt.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DR86bt.png)](https://imgchr.com/i/DR86bt)

## 抽离键码到常量模块

[![DR2g6s.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DR2g6s.png)](https://imgchr.com/i/DR2g6s)

[![DR8jGF.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DR8jGF.png)](https://imgchr.com/i/DR8jGF)

## 鼠标控制模块

[![DRgRIO.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRgRIO.png)](https://imgchr.com/i/DRgRIO)

# 课程总结

## Module 的加载

> 使用 script 标签加载模块时需要添加 type="module"

[![DRhC3F.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRhC3F.png)](https://imgchr.com/i/DRhC3F)

## 导出和导入

> 一个模块的导出可以被其它模块导入，并访问
>
> 没有导出，也可以将其导入
>
> 被导入的代码都会执行一遍，也仅会执行—遍

## export default 和对应的 import

> export default 用于导出一个默认值，一个模块只能有一个

> 基本用法

[![DRhm4K.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRhm4K.png)](https://imgchr.com/i/DRhm4K)

## export 和对应的 import

> export 用于导出声明或语句

[![DRhJEt.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRhJEt.png)](https://imgchr.com/i/DRhJEt)

> export 可以导出多个

[![DRhdgg.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DRhdgg.png)](https://imgchr.com/i/DRhdgg)

> export 导出导入的时候可以起别名

[![DR5mlD.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DR5mlD.png)](https://imgchr.com/i/DR5mlD)

> 可以整体导入所有导出，包括 export 和 export default 的导出

[![DR5Mmd.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DR5Mmd.png)](https://imgchr.com/i/DR5Mmd)

> 可以同时导入 export default 和 export 导出的内容

[![DR5Gff.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DR5Gff.png)](https://imgchr.com/i/DR5Gff)

## Module 的注意事项

> 模块中，顶层的 this 指向 undefined
>
> import 具有提升效果，会提升到整个模块的头部，率先执行
>
> import 执行的时候，代码还没执行
>
> import 和 export 只能在模块的顶层，不能在代码块中执行
>
> import()可以按条件导入
>
> 复合写法导出的，无法在当前模块中使用

​
