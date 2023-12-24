# Grid网格布局



**什么是Grid网格布局**

- 网格布局

- 将网页划分成一个个网格，任意组合网格，做出各种各样的布局

  

![image-20210902085121922](../课程图片/image-20210902085121922.png)





![image-20210902085136601](../课程图片/image-20210902085136601.png)



**兼容问题**

![image-20210902085529232](../课程图片/image-20210902085529232.png)





## Grid基本知识

- Grid容器(container) 和项目(item)

- 行、列和单元格

- 网格线

- 其它(间距、区域、内容、轨道)

  

### 1.Grid 容器（container）和项目（item）

- 采用 Grid 网格布局的元素，称为 Grid 容器
- display: grid | inline-grid;
-  Grid 容器的所有 ***子元素*** 自动成为容器成员，称为 Grid 项目



![grid-1](../课程图片/grid-1.png)







###  2.行、列和单元格

- 容器中的水平区域称为“行”（row），垂直区域称为“列”（column）
- 行和列的交叉区域，称为“单元格”（cell）





![grid-2](../课程图片/grid-2.png)







### 3.网格线

- 划分网格的线，称为“网格线”（grid line）
- 水平网格线划分出行，垂直网格线划分出列



![grid-line](../课程图片/grid-line.png)





### 4.其它

- 行间距、列间距（gap）
- 区域（area）
- 内容（content）
- 网格轨道（track）

![grid](../课程图片/grid-1630544953757.png)





## Grid容器的属性

- **display**
- **grid-template-rows / grid-template-columnns**
- grid-auto-flow
- grid-auto-rows / grid-auto-columns
- **row-gap / column-gap/ gap**
- **grid-template-areas**
- **align-items / justify-items / place-items**
- **align-content / justify-content / place-content**
- grid-template / grid



### 1.display 属性

```html
link rel="stylesheet" href="./grid.css" />
<style>
    /* 1.display 属性 */
    .grid-1-1 {
        display: grid;
    }
    .grid-1-2 {
        display: inline-grid;
    }
</style>
<div>
    <h2>1.display 属性</h2>
    <h3>指定一个元素采用网格布局</h3>
    <h4>display: grid | inline-grid;</h4>

    <p>grid：容器元素是块级元素</p>
    <div class="grid-container grid-1-1">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
    </div>
    <!-- <div class="grid-container grid-1-1">
<div class="item item-1">1</div>
<div class="item item-2">2</div>
<div class="item item-3">3</div>
<div class="item item-4">4</div>
</div> -->

    <p>inline-grid：容器元素是内联块元素</p>
    <div class="grid-container grid-1-2">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
    </div>
    <!-- <div class="grid-container grid-1-2">
<div class="item item-1">1</div>
<div class="item item-2">2</div>
<div class="item item-3">3</div>
<div class="item item-4">4</div>
</div> -->
</div>
```





### 2.grid-template-rows/grid-template-columns 属性

```html
<style>
    .container {
        display: grid;
    }
    .grid-2-1 {
        /* 固定数值 */
        /* grid-template-rows: 150px 150px 150px;
        grid-template-columns: 150px 150px 150px; */

        /* grid-template-rows: 150px 300px 150px;
        grid-template-columns: 150px 300px 150px; */

        /* 给网格线起名字 */
        /* 允许同一根网格线有多个名字 */
        grid-template-rows: [r1 r11] 150px [r2] 150px [r3] 150px [r4];
        grid-template-columns: [c1] 150px [c2] 150px [c3] 150px [c4];
    }
    .grid-2-2 {
        /* 百分比 % */
        height: 600px;
        grid-template-rows: 33.33% 33.33% 33.33%;
        grid-template-columns: 33.33% 33.33% 33.33%;
    }
    .grid-2-3 {
        /* fr */
        height: 600px;
        /* grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr; */

        /* grid-template-columns: 1fr 2fr 1fr;
        grid-template-rows: 1fr 2fr 1fr; */

        grid-template-columns: 50px 1fr 50px;
        grid-template-rows: 1fr 2fr 1fr;
    }
    .grid-2-4 {
        /* auto */
        height: 600px;
        /* grid-template-columns: 150px auto 150px; */
        /* grid-template-columns: auto auto auto;
        grid-template-columns: 1fr 1fr 1fr; */
        grid-template-columns: auto 1fr 150px;
        grid-template-rows: 1fr 2fr 1fr;
    }
    .grid-2-5 {
        /* repeat() */
        /* grid-template-rows: 150px 150px 150px;
        grid-template-columns: 150px 150px 150px; */

        /* grid-template-rows: repeat(3, 150px);
        grid-template-columns: repeat(3, 150px); */

        /* grid-template-rows: repeat(4, 25%);
        grid-template-columns: repeat(4, 25%); */

        /* grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(3, 1fr); */

        /* grid-template-columns: repeat(2, 150px 150px);
        grid-template-columns: 150px 150px 150px 150px;
        grid-template-rows: repeat(3, 150px); */

        /* 当单元格的大小固定，容器大小不确定时，如果希望每一行（或每一列）容纳尽可能多的单元格，可以使用 auto-fill 自动填充 */
        grid-template-columns: repeat(auto-fill, 150px);
        grid-template-rows: repeat(3, 150px);
    }
    .grid-2-6 {
        /* minmax() */
        grid-template-columns: 1fr minmax(150px, 300px) 1fr;
        grid-template-rows: repeat(3, 150px);
    }
</style>

<!-- 2.grid-template-rows/grid-template-columns 属性 -->
<div>
    <h2>
        2.grid-template-rows 属性，<br />
        grid-template-columns 属性
    </h2>
    <h3>
        grid-template-rows 定义每一行的行高
        <br />
        grid-template-columns 定义每一列的列宽
    </h3>
    <h4>
        grid-template-rows: 固定数值 | % | fr | auto | repeat() | minmax()
    </h4>
    <h4>
        grid-template-columns: 固定数值 | % | fr | auto | repeat() | minmax()
    </h4>

    <p>固定数值</p>
    <div class="container grid-2-1">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
    </div>

    <p>百分比 %：容器宽高的百分比（不包括内边距和边框）</p>
    <div class="container grid-2-2">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
    </div>

    <p>fr（fraction 的缩写，意为“片段”）：分配剩余可用空间</p>
    <div class="container grid-2-3">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
    </div>

    <p>auto：先于 fr 计算，获取必要的最小空间</p>
    <div class="container grid-2-4">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
    </div>

    <p>repeat()：简化重复的值</p>
    <div class="container grid-2-5">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
    </div>

    <p>minmax(min, max)：取值 >= 最小值，并且 <= 最大值</p>
    <div class="container grid-2-6">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
    </div>
</div>
```



###  3.grid-auto-flow 属性



```html
<style>
    /* 3.grid-auto-flow 属性 */
    .grid-3-1 {
        /* row */
        grid-template-columns: repeat(3, 150px);
        grid-template-rows: repeat(3, 150px);

        grid-auto-flow: row;
    }
    .grid-3-2 {
        /* column */
        grid-template-columns: repeat(3, 150px);
        grid-template-rows: repeat(3, 150px);

        grid-auto-flow: column;
    }
    .grid-3-3 {
        /* row dense */
        grid-template-columns: repeat(3, 150px);
        grid-template-rows: repeat(3, 150px);

        grid-auto-flow: row dense;
    }
    .grid-3-3 .item-1 {
        grid-column-start: 1;
        grid-column-end: 3;
    }
    .grid-3-3 .item-2 {
        grid-column-start: 1;
        grid-column-end: 3;
    }
    .grid-3-4 {
        /* column dense */
        grid-template-columns: repeat(3, 150px);
        grid-template-rows: repeat(3, 150px);

        grid-auto-flow: column dense;
    }
    .grid-3-4 .item-1 {
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .grid-3-4 .item-2 {
        grid-row-start: 1;
        grid-row-end: 3;
      }

</style>
<!-- 3.grid-auto-flow 属性 -->
    <div>
      <h2>3.grid-auto-flow 属性</h2>
      <h3>定义项目的排列顺序</h3>
      <h4>
        grid-auto-flow: row（默认值） | column | row dense | column dense;
      </h4>

      <p>row（默认值）：先填满第一行，再放入第二行</p>
      <div class="container grid-3-1">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
      </div>

      <p>column：先填满第一列，再放入第二列</p>
      <div class="container grid-3-2">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
      </div>

      <p>row dense：row，在稍后出现较小的项目时，尝试填充网格中较早的空缺</p>
      <div class="container grid-3-3">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
      </div>

      <p>
        column dense：column，在稍后出现较小的项目时，尝试填充网格中较早的空缺
      </p>
      <div class="container grid-3-4">
        <div class="item item-1">1</div>
        <div class="item item-2">2</div>
        <div class="item item-3">3</div>
        <div class="item item-4">4</div>
        <div class="item item-5">5</div>
        <div class="item item-6">6</div>
        <div class="item item-7">7</div>
        <div class="item item-8">8</div>
        <div class="item item-9">9</div>
      </div>
    </div>
```

