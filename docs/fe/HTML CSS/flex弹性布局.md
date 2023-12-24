# Flex弹性布局

##  Flex 基础知识



### 1.什么是 Flex 布局

> Flex布局也叫Flexbox布局，意为“弹性的盒子”，所以 Flex 布局一般也叫作“Flex 弹性布局”
>
> 任何一个 HTML 元素都可以指定为 Flex 布局
>
>  **display: flex | inline-flex;**
>
> 设为Flex布局以后，其子元素的`float`、`clear`和`vertical-align`属性将失效
>
> 它的**目标**是提供一个更有效地布局、对齐方式，并且能够使父元素在子元素的大小未知或动态变化情况下仍然能够分配好子元素之间的间隙
>
> **主要思想**是使父元素能够调整子元素的宽度、高度、排列方式，从而更好的适应可用的布局空间
>
> 设定为flex布局的元素能够放大子元素使之尽可能填充可用空间，也可以收缩子元素使之不溢出
>
> Flex弹性盒模型的优势在于只需声明布局应该具有的⾏为，⽽不需要给出具体的实现⽅式，浏览器负责完成实际布局，所以当布局涉及到不定宽度，分布对⻬的场景时，就要优先考虑弹性盒布局。



###  2.什么是 Flex 容器（flex container）

-   采用 Flex 布局的元素，称为 Flex 容器





### 3.什么是 Flex 项目（flex item）

- Flex 容器的所有 子元素 自动成为容器成员，称为 Flex 项目





###  4.什么是主轴，什么是交叉轴

- 默认情况下，水平方向的是主轴，垂直于主轴方向的是交叉轴
- Flex 项目默认沿主轴起始排列



![flex](flex弹性布局.assets/flex.png)



我们使用**弹性布局时父元素控制子元素的布局方案,不需要计算.**

> 就像我们军训一样,教官说小伙伴全部站在一起,大家向右看齐.
>
> 我们自己把左右两边间隙调整到适当的位置,
>
> 这样的话,我们所有的元素就会布局的非常的整齐了

```css
<div class="bigbox">
<div class="smallbox">1</div>
<div class="smallbox">2</div>
<div class="smallbox">1</div>
<div class="smallbox">2</div>
</div>

.bigbox{
    display:flex; /*父元素开启弹性盒模型*/
    width:800px;
    height: 300px;
    margin: 100px auto 0;
    border:1px solid black;   
}
.smallbox{
    width: 150px;
    height: 150px;
    border: 1px solid black;
}
```

**这时候和之前的排列方向有什么区别?**

> 我们在没有写弹性盒模型的时候盒子是从上往下排.
>
> 开启弹性盒模型现在是从左往右排.

- **弹性特点**

1. 指的是子元素盒子具有了弹性.从左往右排列.
2. 默认不换行，可以进行自动伸伸缩.元素如果超出一行的宽度,会挤到一起,等比例压缩
3. 弹性盒子：默认情况下，弹性盒模型的子元素高度与父元素一致,子元素相当于独占一列(但是默认宽度为0（此处与普通的块级盒模型刚好相反)





```html
<style>
    .flex-1 {
        /* Flex 容器是块级元素 */
        display: flex;

        /* display: block; */

        /* 修改主轴方向 */
        /* flex-direction: column; */
        /* flex-direction: row; */
    }
    .flex-2 {
        /* Flex 容器是内联块元素 */
        display: inline-flex;

        /* display: inline-block; */
    }
</style>

<div class="flex-container flex-1">
    <div class="flex-item">1</div>
    <div class="flex-item">2</div>
    <div class="flex-item">3</div>
    <div class="flex-item">4</div>
</div>

<div class="flex-container flex-2">
    <div class="flex-item">1</div>
    <div class="flex-item">2</div>
    <div class="flex-item">3</div>
    <div class="flex-item">4</div>
</div> 

<div class="flex-container flex-2">
    <div class="flex-item">1</div>
    <div class="flex-item">2</div>
    <div class="flex-item">3</div>
    <div class="flex-item">4</div>
</div> 
```

- display: flex;  默认是display:block-flex;  对外块元素,对内弹性盒模型
- display: inline-flex;  对外表现为行内元素,对内是弹性盒模型





## Flex容器的属性

### 1.flex-direction 属性

- **元素的排列方向叫做flex-direction**
  - **1.row(行)** 横向**从左往右**
  - **2.row-reverse** 横向的反向 从右往左 主轴的方向变为**从右到左**
  - **3.column(列)** 纵向 **从上往下**
  - **4.column-reverse**  纵向的反向 **从下往上**

从左往右,从右往左,从上往下 还有从下往上 最多有四个方向

```html
<style>
    .flex-container {
        display: flex;
    }

    /* 1.flex-direction 属性 */
    .flex-1-1 {
        flex-direction: row;
    }
    .flex-1-2 {
        flex-direction: row-reverse;
    }
    .flex-1-3 {
        flex-direction: column;
    }
    .flex-1-4 {
        flex-direction: column-reverse;
    }
</style>


<div>
    <h2>1.flex-direction 属性</h2>

    <p>row（默认值）：主轴为水平方向，起点在左端</p>
    <div class="flex-container flex-1-1">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
    </div>

    <p>row-reverse：主轴为水平方向，起点在右端</p>
    <div class="flex-container flex-1-2">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
    </div>

    <p>column：主轴为垂直方向，起点在上沿</p>
    <div class="flex-container flex-1-3">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
    </div>

    <p>column-reverse：主轴为垂直方向，起点在下沿</p>
    <div class="flex-container flex-1-4">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
    </div>
</div>
```





###  2.flex-wrap 属性

- flex-wrap:nowrap(默认不换行.多出来元素挤在一堆)
- wrap(正常换行,只有向右和向下)
  - **wrap具体的换行方向由主轴决定** 
  - **如果主轴方向是竖直方向**(无论是向上还是向下),**都会朝着右边进行换行**
  - **主轴是水平方向**(无论向右还是向左),**换行方向是往下的**
- warp-rerverse(反向换行 只有向上或向左,具体由主轴进行决定)



注意：如果换行子元素的宽高大于父元素,则会超出父元素的边界显示

```html
<style>
    /* 2.flex-wrap 属性 */
    .flex-2-1 {
        flex-wrap: nowrap;
    }
    .flex-2-2 {
        flex-wrap: wrap;
    }
    .flex-2-3 {
        flex-wrap: wrap-reverse;
    }
</style>
<div>
    <h2>2.flex-wrap 属性</h2>

    <p>nowrap（默认）：不换行</p>
    <div class="flex-container flex-2-1">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
    </div>

    <p>wrap：换行，第一行在上方</p>
    <div class="flex-container flex-2-2">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
    </div>

    <p>wrap-reverse：换行，第一行在下方</p>
    <div class="flex-container flex-2-3">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
    </div>
</div>
```



### 3.flex-flow 属性

>  flex-flow：flex-direction flex-wrap;(两个属性的简写)

```html
<style>
    .flex-3 {
        /* flex-flow: row nowrap; */
        flex-flow: row wrap;
    }
</style>

<div>
    <h2>3.flex-flow 属性</h2>
    <div class="flex-container flex-3">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
    </div>
</div>
```





### 4.justify-content 属性

- 主轴(元素排列方向)的布局方案
- 可选值
  - 1.主轴的开始位置 flex-start:
  - 2.主轴的结束位置  flex-end;
  - 3.元素在主轴上挤在一起居中  center
  - 4.散开
    - 1.space-around(around是环绕的意思,每个flex子元素两侧都有互不干扰的等宽空白间距.最终视觉上子元素之间的间距只有子元素到父元素间距的一半)
    - 2.justify-content:space-between;(表现为两端对齐,between是中间的意思,只有子元素之间有空隙,并且均分)
    - 3.justify-content: space-evenly;(evenly是匀称平等的意思,最终子元素和父元素,子元素和子元素间距都一样



```html
<style>
    .flex-4-1 {
        justify-content: flex-start;
    }
    .flex-4-2 {
        justify-content: flex-end;
    }
    .flex-4-3 {
        justify-content: center;
    }
    .flex-4-4 {
        justify-content: space-between;
    }
    .flex-4-5 {
        justify-content: space-around;
    }
</style>

<div>
    <h2>4.justify-content 属性</h2>

    <p>flex-start（默认值）：左对齐（flex-direction: row）</p>
    <div class="flex-container flex-4-1">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
    </div>

    <p>flex-end：右对齐（flex-direction: row）</p>
    <div class="flex-container flex-4-2">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
    </div>

    <p>center： 居中（水平居中）</p>
    <div class="flex-container flex-4-3">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
    </div>

    <p>space-between：Flex 项目之间的间隔都相等</p>
    <div class="flex-container flex-4-4">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
    </div>

    <p>
        space-around：每个 Flex
        项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍
    </p>
    <div class="flex-container flex-4-5">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
    </div>
</div> 
```







### 5.align-items 属性 

- 定义单行主轴元素在交叉轴的对齐方式
- 可选值
  - 1.strech(默认值) 自动把元素拉伸成容器的高度
  - 2.flex-start交叉轴的起点对齐
  - 3.flex-end 交叉轴的终点对齐
  - 4.center交叉轴的中点对齐
  - 5.baseline基线对齐

```html
<style>
    .flex-5-1 {
        align-items: stretch;
    }
    .flex-5-1 .flex-item {
        height: auto;
    }
    .flex-5-2 {
        align-items: flex-start;
    }
    .flex-5-3 {
        align-items: flex-end;
    }
    .flex-5-4 {
        align-items: center;
    }
    .flex-5-5 {
        align-items: baseline;
    }
    .flex-5-5 .flex-item {
        text-decoration: underline;

        font-size: 40px;
    }
    .flex-5-5 .item-tall {
        font-size: 120px;
      }
</style>

<div>
    <h2>5.align-items 属性</h2>

    <p>
        stretch（默认值）：如果 Flex 项目未设置交叉轴方向的大小或设为
        auto，将占满整个容器交叉轴方向的大小
    </p>
    <div class="flex-container flex-5-1">
        <div class="flex-item">1</div>
        <div class="flex-item item-tall">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item item-tall">4</div>
    </div>

    <p>flex-start：交叉轴的起点对齐</p>
    <div class="flex-container flex-5-2">
        <div class="flex-item">1</div>
        <div class="flex-item item-tall">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item item-tall">4</div>
    </div>

    <p>flex-end：交叉轴的终点对齐</p>
    <div class="flex-container flex-5-3">
        <div class="flex-item">1</div>
        <div class="flex-item item-tall">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item item-tall">4</div>
    </div>

    <p>center：交叉轴的中点对齐（垂直居中）</p>
    <div class="flex-container flex-5-4">
        <div class="flex-item">1</div>
        <div class="flex-item item-tall">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item item-tall">4</div>
    </div>

    <p>baseline: Flex 项目的第一行文字的基线对齐</p>
    <div class="flex-container flex-5-5">
        <div class="flex-item">S</div>
        <div class="flex-item item-tall">p</div>
        <div class="flex-item">q</div>
        <div class="flex-item item-tall">h</div>
    </div>

    <img src="./baseline.png" alt="baseline" />
</div>
```





### 6.align-content 属性

- 此属性只在flex容器中有多行flex元素时才有作用(使用flex-wrap)
- 定义多行属性整体在交叉轴上的对齐方式
  1. align-content:stretch; 默认交叉轴方向的长度是等比例填充的,如果元素换行后仍然有多余空间,元素会平分剩余空间，如果子元素没有高度,元素则会拉伸到父元素的高度,每行平分父元素的高度
  2. align-content:flex-start;  元素在交叉轴的开始位置排列
  3. align-content:flex-end;   元素在交叉轴的结束位置排列,元素位于容器的结尾
  4. 散开
     - space-around(around是环绕的意思,每个flex子元素两侧都有互不干扰的等宽空白间距.最终视觉上子元素之间的间距只有子元素到父元素间距的一半)
     - justify-content:space-between;(表现为两端对齐,between是中间的意思,只有子元素之间有空隙,并且均分)
     - justify-content: space-evenly;(evenly是匀称平等的意思,最终子元素和父元素,子元素和子元素间距都一样

```html
<style>

    /* 6.align-content 属性 */
    .flex-6 {
        flex-wrap: wrap;
    }
    .flex-6-1 {
        align-content: stretch;
    }
    .flex-6-1 .flex-item {
        height: auto;
    }
    .flex-6-2 {
        align-content: flex-start;
    }
    .flex-6-3 {
        align-content: flex-end;
    }
    .flex-6-4 {
        align-content: center;
    }
    .flex-6-5 {
        align-content: space-between;
    }
    .flex-6-6 {
        align-content: space-around;
    }
</style>

<div>
    <h2>6.align-content 属性</h2>

    <p>stretch（默认值）：主轴线平分 Flex 容器交叉轴方向上的空间</p>
    <div class="flex-container container-tall flex-6 flex-6-1">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
        <div class="flex-item">8</div>
        <div class="flex-item">9</div>
    </div>

    <p>flex-start：与交叉轴的起点对齐</p>
    <div class="flex-container container-tall flex-6 flex-6-2">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
        <div class="flex-item">8</div>
        <div class="flex-item">9</div>
      </div>

    <p>flex-end：与交叉轴的终点对齐</p>
    <div class="flex-container container-tall flex-6 flex-6-3">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
        <div class="flex-item">8</div>
        <div class="flex-item">9</div>
    </div>

    <p>center：与交叉轴的中点对齐</p>
    <div class="flex-container container-tall flex-6 flex-6-4">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
        <div class="flex-item">8</div>
        <div class="flex-item">9</div>
    </div>

    <p>space-between：与交叉轴两端对齐，轴线之间的间隔平均分布</p>
    <div class="flex-container container-tall flex-6 flex-6-5">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
        <div class="flex-item">8</div>
        <div class="flex-item">9</div>
    </div>

    <p>
        space-around：每根轴线两侧的间隔都相等，
        所以轴线之间的间隔比轴线与边框的间隔大一倍
    </p>
    <div class="flex-container container-tall flex-6 flex-6-6">
        <div class="flex-item">1</div>
        <div class="flex-item">2</div>
        <div class="flex-item">3</div>
        <div class="flex-item">4</div>
        <div class="flex-item">5</div>
        <div class="flex-item">6</div>
        <div class="flex-item">7</div>
        <div class="flex-item">8</div>
        <div class="flex-item">9</div>
    </div>
</div>
```







**元素的换行方向(默认不换行)**

> 那元素的换行方向是不是可以可以由主轴方向决定,
>
> 元素排列方向也就是主轴方向从左往右开始排列.
>
> 换行方向只可能有两个方向要么是朝下换行要么是朝上换行.
>
> 如果主轴方向是竖直方向,竖直向上或竖直向下时.
>
> 换行方向也只有两个,一个是向左一个是向右.
>
> **所以元素的换行方向是可以由主轴方向决定的,并且最多有三个情况(包括不换行)**

我们的换行方向用的单词叫做flex-wrap

**我们给换行方向取一个名字叫交叉轴**



```css
flex-direction: row;
flex-wrap: wrap;
/*正常换行,主轴方向从左往右,朝下换行.*/
```

```css
flex-direction: row-reverse;/*朝下换行,此时元素的排列方向为从左往右*/
flex-wrap: wrap/*此时12345678的盒子按照正常方向进行换行*/
```

```css
flex-direction: column;
flex-wrap: wrap;
/*此时每一行都进行了换行,换行方向是向右的,放不下的元素都朝右去进行排列*/
```

```css
flex-direction:column-reverse;/*依然是从左往右换行,只是主轴方向是从下面往上面*/
```

*

但是还有一个值****

```css
flex-direction:row;
flex-wrap: wrap-reverse;
/*换行方向为反向,元素由原来的从上往下换行变为从下往上进行换行,元素自然而然往下排列进行向上的换行*/
```

```css
flex-direction:column;
flex-wrap: wrap-reverse;/*此时的换行方向变为由朝着右边换行变为朝着左边进行换行*/
```

```css
flex-direction:column-reverse;
flex-wrap: wrap-reverse;/*依然朝着左边进行换行,但是元素的排列方向也就是主轴是从下往上的*/
```



**总结:**

​	**弹性盒模型(父元素控制子元素的整体口号)**

**1.主轴  交叉轴**

**2,元素在主轴上的对齐方式  justify-content**

**3.多行元素看成一个整体,这个整体在交叉轴的方向上的对齐方式 align-content**

**4.单行主轴元素在交叉轴的对齐方式 align-items**





## Flex项目的属性

子元素有以下六个属性：

- order
- flex-grow
- flex-shrink
- flex-basis
- flex
- align-self



### 1. order

- 定义了 Flex 项目的排列顺序
- 数值越小，排列越靠前，默认为 0，可以为负数
- order: \<integer>;  /* default 0 */





### 2.flex-grow 属性

- 定义了 Flex 项目在主轴方向上的放大比例，默认为 0，即如果存在剩余空间，该项目也不放大
- 如果分数和小于1  按百分比算，大于1剩余空间全部分配，大于1 很多元素设置  按照设置比例分
- flex-grow: \<number>; /* default 0 */



### 3.flex-shrink

- 定义了 Flex 项目在主轴方向上的缩小比例，默认为 1，即如果空间不足，该项目将缩小
- 如果一个项目的 flex-shrink 属性为0，其他项目都为1，则空间不足时，前者不缩小
- flex-shrink: \<number>;  /* default 1 */





###  4.flex-basis

- 定义了在分配多余空间之前，Flex 项目占据的主轴大小（main size）
- 如果主轴是横向   则该值指定的是元素宽度
- 如果主轴是纵向   则该值指定的是元素高度
- 它的默认值为 auto，即参考元素自身的宽高
- 如果你给flex-basis值 以这个值为准
- 浏览器根据这个属性，计算主轴是否有多余空间
- flex-basis: \<length>; | auto; /* default auto */



### 5.flex

- 是 flex-grow, flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto
- flex: \<flex-grow> || \<flex-shrink> || \<flex-basis>
- 该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)
  - flex:none  当盒子变小时不会压缩,变大的话也不会拉伸
  - flex:auto   缩小盒子时等比例缩小,放大盒子也会拉伸



### 6.align-self

-   子元素覆盖的对齐方式
-  设置单个弹性子元素在交叉轴上的对齐方式
-  可覆盖Flex父容器上的 align-items 属性
- align-self: auto（默认值） | flex-start | flex-end | center | stretch | baseline;



```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Flex 项目的属性</title>
        <link rel="stylesheet" href="./basic.css" />
        <style>
            .flex-container {
                display: flex;
            }

            /* 1.order 属性 */
            .flex-1 .order {
                order: -1;
            }

            /* 2.flex-grow 属性 */
            .flex-2-1 .flex-item {
                flex-grow: 1;
            }
            .flex-2-1 .grow-2 {
                flex-grow: 2;
            }
            .flex-2-2 .grow {
                flex-grow: 1;
            }

            /* 3.flex-shrink 属性 */
            .flex-3 .flex-item {
                flex-shrink: 2;
            }
            .flex-3 .shrink-0 {
                flex-shrink: 0;
            }

            /* 4.flex-basis 属性 */
            .flex-4 .flex-item {
                /* width: 400px; */
                flex-basis: 400px;
                /* height: 400px; */
            }
            .flex-4 {
                flex-direction: column;
            }

            /* 5.flex 属性 */
            .flex-5-1 .flex-item {
                /* flex: 0 1 auto; */
                flex: auto;
            }
            .flex-5-2 .flex-item {
                flex: none;
            }

            /* 6.align-self 属性 */
            .flex-6 {
                height: 600px;

                /* align-items: stretch; */
                align-items: center;
            }

            .flex-6 .flex-item {
                /* height: auto; */
                align-self: baseline !important;
                text-decoration: underline;
            }

            .flex-6 .auto {
                align-self: auto;
            }
            .flex-6 .start {
                align-self: flex-start;
            }
            .flex-6 .end {
                align-self: flex-end;
            }
            .flex-6 .center {
                align-self: center;
            }
            .flex-6 .stretch {
                height: auto;
                align-self: stretch;
            }
            .flex-6 .baseline {
                font-size: 24px;
                align-self: baseline;
            }
        </style>
    </head>
    <body>
        <img src="./flex.png" alt="flex" />

        <!-- 1.order 属性 -->
        <div>
            <h2>1.order 属性</h2>
            <div class="flex-container flex-1">
        <div class="flex-item">1</div>
          <div class="flex-item">2</div>
          <div class="flex-item">3</div>
          <div class="flex-item order">
              4
              <span class="desc">order: -1</span>
          </div>
        </div>
      </div>

      <!-- 2.flex-grow 属性 -->
      <div>
          <h2>2.flex-grow 属性</h2>
          <p>
              如果所有项目的 flex-grow 属性都为 1，则它们将等分剩余空间（如果有的话）
          </p>
          <div class="flex-container flex-2-1">
              <div class="flex-item">
                  1
                  <span class="desc">flex-grow: 1</span>
          </div>
          <div class="flex-item">
              2
              <span class="desc">flex-grow: 1</span>
          </div>
          <div class="flex-item">
              3
              <span class="desc">flex-grow: 1</span>
          </div>
        </div>

        <p>
            如果一个项目的 flex-grow 属性为 2，其他项目都为
            1，则前者占据的剩余空间将比其他项多一倍
        </p>
        <div class="flex-container flex-2-1">
            <div class="flex-item">
                1
                <span class="desc">flex-grow: 1</span>
            </div>
        <div class="flex-item grow-2">
          2
            <span class="desc">flex-grow: 2</span>
          </div>
          <div class="flex-item">
              3
              <span class="desc">flex-grow: 1</span>
          </div>
        </div>

        <p>
            如果有的 Flex 项目有 flex-grow 属性，有的项目没有 flex-grow 属性，但有
            width 这样的属性，有 flex-grow 属性的项目将等分剩余空间
        </p>
        <div class="flex-container flex-2-2">
            <div class="flex-item grow">
            1
            <span class="desc">flex-grow: 1</span>
          </div>
          <div class="flex-item">
              2
              <span class="desc">width: 200</span>
          </div>
          <div class="flex-item grow">
              3
              <span class="desc">flex-grow: 1</span>
          </div>
        </div>
      </div>

      <!-- 3.flex-shrink 属性 -->
      <div>
          <h2>3.flex-shrink 属性</h2>

          <p>
              如果所有项目的 flex-shrink 属性都不为 0，当空间不足时，都将等比例缩小
          </p>
          <div class="flex-container flex-3">
              <div class="flex-item">
          1
            <span class="desc">flex-shrink: 1</span>
          </div>
          <div class="flex-item">
              2
              <span class="desc">flex-shrink: 1</span>
          </div>
          <div class="flex-item">
              3
              <span class="desc">flex-shrink: 1</span>
          </div>
          <div class="flex-item">
              4
              <span class="desc">flex-shrink: 1</span>
          </div>
          <div class="flex-item">
              5
              <span class="desc">flex-shrink: 1</span>
          </div>
        </div>

        <p>
            如果一个项目的 flex-shrink 属性为 0，其他项目都为
            1，则空间不足时，前者不缩小
        </p>
        <div class="flex-container flex-3">
            <div class="flex-item shrink-0">
                1
                <span class="desc">flex-shrink: 0</span>
            </div>
            <div class="flex-item">2</div>
            <div class="flex-item">3</div>
            <div class="flex-item">4</div>
            <div class="flex-item">5</div>
        </div>
      </div>

      <!-- 4.flex-basis 属性 -->
      <div>
          <h2>4.flex-basis 属性</h2>

          <div class="flex-container flex-4">
              <div class="flex-item">1</div>
              <div class="flex-item">2</div>
              <div class="flex-item">3</div>
          </div>
      </div>

      <!-- 5.flex 属性 -->
      <div>
          <h2>5.flex 属性</h2>
          <p>flex: auto (1 1 auto)</p>
          <div class="flex-container flex-5-1">
              <div class="flex-item">1</div>
              <div class="flex-item">2</div>
              <div class="flex-item">3</div>
              <div class="flex-item">4</div>
              <div class="flex-item">5</div>
              <div class="flex-item">6</div>
          </div>

          <p>flex: none (0 0 auto)</p>
          <div class="flex-container flex-5-2">
              <div class="flex-item">1</div>
              <div class="flex-item">2</div>
              <div class="flex-item">3</div>
            <div class="flex-item">4</div>
            <div class="flex-item">5</div>
            <div class="flex-item">6</div>
        </div>
      </div>

      <!-- 6.align-self 属性 -->
      <div>
          <h2>6.align-self 属性</h2>
          <div class="flex-container flex-6">
              <div class="flex-item auto">
                  1
                  <span class="desc">auto</span>
              </div>
              <div class="flex-item start">
                  2
                  <span class="desc">flex-start</span>
              </div>
              <div class="flex-item end">
                  3
                  <span class="desc">flex-end</span>
              </div>
              <div class="flex-item center">
              4
              <span class="desc">center</span>
          </div>
          <div class="flex-item stretch">
              5
              <span class="desc">stretch</span>
          </div>
          <div class="flex-item baseline">
              6
              <span class="desc">baseline</span>
          </div>
        </div>

        <img src="./baseline.png" alt="baseline" />
      </div>
    </body>
</html>
```



## 圣杯布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>圣杯布局</title>
    <link rel="stylesheet" href="css/iconfont.css" />
    <style>
      * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
      }

      body {
        background-color: #e2e2e2;
        color: #595b66;
      }

      a {
        font-size: 12px;
        color: #686868;
        text-decoration: none;
      }

      li {
        list-style: none;
      }

      body {
        display: flex;
        flex-direction: column;
        height: 100vh;

        /* background-color: pink; */
        font-size: 24px;
      }

      .header-layout,
      .footer-layout{
        height: 80px;
      }

      .header-layout {
        background-color: red;
      }
        
      .footer-layout {
        background-color: yellow;
      }

        .main-layout {
            flex-grow: 1;
            background-color: gray;
        }

        .nav-layout {
            width: 200px;
            background-color: green;
            order: -1;
        }
        .aside-layout {
            width: 200px;
            background-color: lightblue;
        }

        .body-layout {
            flex-grow: 1;
            display: flex;
            /* align-items: stretch; */
        }

     

      .tabbar {
        display: flex;
        height: 100%;
        align-items: center;
      }

      .tabbar-item {
        flex: 1;
      }

      .tabbar-link {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .tabbar-link .iconfont {
        font-size: 24px;
      }

      .tabbar-item-active .tabbar-link {
        color: #de181b;
      }

      /* 垂直水平居中 */
      .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <header class="header-layout flex-center">头部</header>

    <div class="body-layout">
      <main class="main-layout flex-center">主体部分</main>
      <nav class="nav-layout flex-center">导航</nav>
      <aside class="aside-layout flex-center">侧栏</aside>
    </div>

    <footer class="footer-layout">
      <ul class="tabbar">
        <li class="tabbar-item tabbar-item-active">
          <a href="##" class="tabbar-link">
            <i class="iconfont icon-home"></i>
            <span>首页</span>
          </a>
        </li>
        <li class="tabbar-item">
          <a href="##" class="tabbar-link">
            <i class="iconfont icon-category"></i>
            <span>分类页</span>
          </a>
        </li>
        <li class="tabbar-item">
          <a href="##" class="tabbar-link">
            <i class="iconfont icon-cart"></i>
            <span>购物车</span>
          </a>
        </li>
        <li class="tabbar-item">
          <a href="##" class="tabbar-link">
            <i class="iconfont icon-personal"></i>
            <span>个人中心</span>
          </a>
        </li>
      </ul>
    </footer>
  </body>
</html>
```

