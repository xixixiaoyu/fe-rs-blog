## Node节点

- DOM包含多种节点，每种节点都有不同的对象模型，我们通常获取的标签，只是节点中的一种：

![image](//tva3.sinaimg.cn/mw690/007c1Ltfgy1h5ejzt5mgdj317s0l911z.jpg)

其实各类的 DOM API 对象都继承自 Node 接口

```js
function getParents(el) {
    if (typeof el !== "object" || el === null) {
        throw new Error("el应该是一个对象");
    }
    let _el = el;
    const result = [];
    // 递归查找原型
    while (_el.__proto__ !== null) {
        result.push(_el.__proto__.constructor.name);
        _el = _el.__proto__;
    }
    return result;
}
console.log(getParents(document));
console.log(getParents(document.createElement("div")));
console.log(getParents(new Text("云牧")));
```

打印结果如下：

![image](//tva4.sinaimg.cn/mw690/007c1Ltfgy1h5ek4wm805j30yg03v780.jpg)

可以看到上述的节点都有 Node 的身影



## 节点类型

- 每个节点都有对应的 NodeType，下面是一些重点的：

| nodeType | 节点名称                                    |
| -------- | ------------------------------------------- |
| 1        | 元素节点，例如div、span                     |
| 3        | 文本节点；对象模型：Text                    |
| 8        | 注释节点；对象模型：Commet                  |
| 9        | 文档（document节点）；对象模型：Commet      |
| 10       | 文档类型（DTD节点）；对象模型：DocumentType |
| 11       | 文档碎片；对象模型：DocumentFragment        |

每个节点有`nodeName`属性，文本节点和属性节点有`nodeValue`属性可以取值。



### Text - 3

-  注意标签之前的空白也算文本节点
- 可使用 `childNodes` 访问

`splitText` 和 `normalize` 可以拆分和合并文本节点

```html
<body>
    <div id="div1">Hello Yunmu</div>
    <div>
        <button id="btnSplit">拆分</button>
        <button id="btnNormalize">合并</button>
    </div>
    <script>
        const div1El = document.getElementById("div1");
        btnSplit.addEventListener("click", function () {
            console.log("splitText before:", div1El.childNodes, div1El.childNodes[0].nodeValue);
            // 从第五个字母开始分割成独立的两个兄弟文本节点
            div1El.firstChild.splitText(5);
            console.log("splitText after:", div1El.childNodes, div1El.childNodes.length);
        });
        btnNormalize.addEventListener("click", function () {
            // 合并
            div1El.normalize();
            console.log("normalize:", div1El.childNodes, div1El.childNodes.length);
        });
    </script>
</body>
```

打印结果如下：

![image](//tva3.sinaimg.cn/mw690/007c1Ltfgy1h5epypipraj30iz03bdhg.jpg)





### Comment - 8

- 注释为 `<!-- ... -->` 之间的内容
- `nodeValue` 获取其内容

```html
<body>
    <div id="div1">div1内容</div>

    <script>
        const commentEl = new Comment("这是注释");
        div1.appendChild(commentEl);
        console.log("注释内容:", commentEl.nodeValue); // 注释内容: 这是注释
    </script>
</body>
```





### Document  -  9

重要的方法和属性：

- 节点查找：`document.querySelector` 、`document.querySelectorAll` 等等
- 节点集合信息：`document.all`、 `document.forms`、`document.scripts`、 `document.images`，`document.links`等等
- cookie：document.cookie

其实还有一种`document`，它属于 `XML`

```js
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(
    `
            <xml>
                <persons>
                    <person>
                        <name>小明</name>
                        <age>18</age>
                    </person>
                    <person>
                        <name>小红</name>
                        <age>19</age>
                    </person>
                </persons>
            </xml>
        `,
    "text/xml"
);

console.log("constructor:", xmlDoc.__proto__.constructor);
// 提取 xml 数据为数组
const persons = xmlDoc.querySelectorAll("person");
const personsJSON = Array.from(persons).map((node) => {
    return {
        name: node.querySelector("name").childNodes[0].nodeValue,
        age: node.querySelector("age").childNodes[0].nodeValue,
    };
});

console.log("personsJSON:", personsJSON);
```

打印结果如下：

![image](//tvax4.sinaimg.cn/mw690/007c1Ltfgy1h5eqbls9nej30ha05hdi5.jpg)



### DocumentType - 10

- 访问方式： `document.doctype` 、`document.firstChild`
- 通过 `name` 属性返回 `"html"`

```js
document.doctype.name  // "html"
document.firstChild.name // "html"
```





### DocumentFragment - 11

- 可以像标准的 `document` 一样，存储由节点组成的文档结构
- 所有的节点会被一次插入到文档中，而这个操作仅发生一个重渲染的操作
- 常用于批量创建大量节点，提高性能

```html
<body>
    <div>
        <button id="btnBatch">批量创建</button>
        <button id="btnSingle">单独创建</button>
    </div>
    <div id="root" style="height: 1000px; overflow: auto"></div>

    <script type="text/javascript">
        const rootEl = document.getElementById("root");
        const items = Array.from({ length: 100000 }, (v, i) => ({
            name: "name" + i,
            age: i,
            sex: i % 2,
        }));
       
        function createByS() {
            console.time("单独创建");
            items.forEach(function (item) {
                const div = document.createElement("div");
                div.innerHTML = `name:${item.name} - age: ${item.age} - sex: ${item.sex}`;
                rootEl.appendChild(div);
            });
            console.timeEnd("单独创建");
        }

        function createByB() {
            console.time("批量创建");
            const fragment = document.createDocumentFragment();
            items.forEach(function (item) {
                const div = document.createElement("div");
                div.innerHTML = `name:${item.name} - age: ${item.age} - sex: ${item.sex}`;
                fragment.appendChild(div);
            });
            rootEl.appendChild(fragment);
            console.timeEnd("批量创建");
        }

        btnBatch.addEventListener("click", createByB);
        btnSingle.addEventListener("click", createByS);
    </script>
</body>
```

打印结果如下（在节点越多越复杂时候越明显）：

![image](//tva3.sinaimg.cn/mw690/007c1Ltfgy1h5er2ju21tj30bj023dgm.jpg)

除了以上方式还可以通过 `cloneNode` 和 `innerHTML` 等方式创建节点，总体还是 `fragment` 性能最高



### Element系列 - 1

- 创建: `document.createElement`
- `children`（只返回 `nodeType` = 1的元素节点）和`childNodes`（返回全部节点）
- 获取属性`getAttribute`，设置属性值`setAttribute`

```html
<body>
    <div id="root">
        <!-- 注释-->
        文本1
        <span>aa</span>
    </div>
    <script>
        console.log(root.children);
        console.log(root.childNodes);
    </script>
</body>
```

打印结果如下：

![image](//tva3.sinaimg.cn/mw690/007c1Ltfgy1h5er98a6cvj30ha024mxv.jpg)





## 查询遍历节点

- `document.getElementById()`   通过`id` 获取元素
- `getElementsByClassName()`  通过`class`类名获取元素数组
- `getElementsByTagName()`    通过标签名获取元素数组
- `getElementsByName()`   通过元素`name`获取
- `querySelector()`  通过选择器获取元素
- `querySelectorAll()`   通过选择器获取元素数组

注意：

- `getElementById`和 `getElementsByName` 是必须以 `document` 开头
- `getElementById`和`querySelectorAll`是静态获取，即 DOM 更新也不会更改已获取到的类数组

特殊元素的获取

```html
<body>
    <style>
      .nihao::before {
        content: "你好";
        display: block;
      }
    </style>
    <div class="nihao" id="nihao">Tom</div>

    <script>
        const content = window.getComputedStyle(nihao, "before")["content"]; // 伪元素
        console.log(content);
        console.log(document.head); // head
        console.log(document.body); // body
        console.log(document.title); // title标签的文字内容，可以赋值修改title
        console.log(document.styleSheets); // 样式表
        console.log(document.documentElement); // html
    </script>
  </body>
```

如果想更详细，看一些例子，可以看我这两篇文章

- [JS基础DOM操作 - 掘金 (juejin.cn)](https://juejin.cn/post/7042664503502176270)
- [DOM进阶 - 掘金 (juejin.cn)](https://juejin.cn/post/7044032089938722823)



## 增加、删除、克隆节点



### 创建

- 创建了节点，未加入文档，是没有任何视觉效果的

```js
// new
const commentNode = new Comment("注释");
const textNode = new Text("文本");
// document.create
const el = document.createElement("div");
const commentNode = document.createComment("注释");
const textNode = document.createTextNode("文本");
const fragment = document.createDocumentFragment();
```





### 挂载

#### Node节点挂载

- `appendChild()`     将一个节点添加到指定父节点的子节点列表的末尾
- `insertBefore()`    在参考节点之前插入一个拥有指定父节点的子节点
- `replaceChild()`    指定的节点替换当前节点的一个子节点，并返回被替换掉的节点
- `textContent()`      一个节点及其后代的文本内容

```html
<body>
    <div style="margin-left: 50px">
        <button id="btnAppendChild">appendChild</button>
        <button id="btnInsertBefore">insertBefore</button>
        <button id="btnReplaceChild">replaceChild</button>
        <button id="btnTextContent">textContent</button>
    </div>
    <div style="margin: 50px">
        <div id="buttons">
            <button id="btnBase">基准按钮</button>
        </div>

        <div id="contents">
            <span id="textContent">基础文本</span>
        </div>
    </div>

    <script>
        btnAppendChild.addEventListener("click", function (e) {
            const btn = document.createElement("button");
            btn.textContent = "appendChild";
            // parentNode.appendChild();
            buttons.appendChild(btn);
        });

        btnInsertBefore.addEventListener("click", function (e) {
            const btn = document.createElement("button");
            btn.textContent = "btnInsertBefore";
            // 语法： const insertedNode = parentNode.insertBefore(newNode, referenceNode);
            buttons.insertBefore(btn, btnBase);
        });

        btnReplaceChild.addEventListener("click", function () {
            const btn = document.createElement("button");
            btn.textContent = "replaceChild";
            // parentNode.replaceChild(newChild, oldChild);
            buttons.replaceChild(btn, btnBase);
        });

        btnTextContent.addEventListener("click", function () {
            textContent.textContent = "textContent";
        });
    </script>
</body>
```

操作演示如下：

![node](//tva4.sinaimg.cn/large/007c1Ltfgy1h5et4gq63pg30o00b6q7s.gif)





#### Element挂载节点

- `after()`    在该节点之后插入一组Node
- `before()`  在该节点之前插入一组Node
- `append()`   在节点最后一个子节点之后插入一组Node
- `prepend()`    在节点的第一个子节点之前插入—组Node
- `insertAdjacentElement()`     将节点插入给定的一个位置（只能传 `element` 节点）
- `insertAdjacentHTML()`      将文本解析为节点并插入到给定的位置 （只能传入 `html` 字符串）
- `insertAdjacentText()`      将文本节点插入到给定的位置（只能传入文本）
- `replaceChildren()`   将后代替换为指定节点
- `replaceWith()`    将后代替换为指定节点集合



演示下 after、before、append、prepend

```html
<body>
    <div style="margin-left: 50px">
        <button id="btnAfter">after</button>
        <button id="btnBefore">before</button>
        <button id="btnAppend">append</button>
        <button id="btnPrepend">prepend</button>
    </div>
    <div style="margin: 50px">
        <div id="buttons">
            <button id="btnBase">基准按钮</button>
        </div>
    </div>

    <script>
        btnAfter.addEventListener("click", function (e) {
            const btn = document.createElement("button");
            btn.textContent = "after button";
            // Element.after(...nodesOrDOMStrings);
            btnBase.after(btn, "after text");
        });

        btnBefore.addEventListener("click", function (e) {
            const btn = document.createElement("button");
            btn.textContent = "before button";
            // Element.before(...nodesOrDOMStrings);
            btnBase.before(btn, "before text");
        });

        btnAppend.addEventListener("click", function () {
            const btn = document.createElement("button");
            btn.textContent = "append button";
            // Element.append(...nodesOrDOMStrings)
            buttons.append(btn, "append text");
        });

        btnPrepend.addEventListener("click", function () {
            const btn = document.createElement("button");
            btn.textContent = "prepend button";
            // Element.prepend(...nodesOrDOMStrings)
            buttons.prepend(btn, "prepend text");
        });
    </script>
</body>
```







#### insertAdjacentElement等

- `insertAdjacentElement` 、` insertAdjacentHTML` 、`insertAdjacentText`
- 三个方法节点依次要求是：元素、html字符串、文本字符串
- 参照节点是自身，位置分为： `beforebegin`、`afterbegin`、 `beforeend`、 `afterend`

参照位置如下图所示：

![image](//tvax2.sinaimg.cn/mw690/007c1Ltfgy1h5g07ly6fej31gv0eyk24.jpg)

```html
<body>
    <div class="parent">
        <div class="child">child</div>
    </div>

    <script>
        function createDiv(content) {
            const el = document.createElement("div");
            el.innerHTML = content;
            return el;
        }

        const pEl = document.querySelector(".parent");
        pEl.insertAdjacentElement("afterbegin", createDiv("afterbegin"));
        pEl.insertAdjacentElement("afterend", createDiv("afterend"));
        pEl.insertAdjacentElement("beforebegin", createDiv("beforebegin"));
        pEl.insertAdjacentElement("beforeend", createDiv("beforeend"));
    </script>
</body>
```

插入效果图如下：

![image](//tvax2.sinaimg.cn/mw690/007c1Ltfgy1h5g0crxbh0j30cv0lvjw3.jpg)



#### replaceChildren 和 replaceWith

- 都是全面替换子节点
- 参数是多个节点或者字符串







#### append 和 appendChild

| 方法        | 参数                        | 返回值   | 来源              |
| ----------- | --------------------------- | -------- | ----------------- |
| appendChild | Node节点                    | Node节点 | Node.prototype    |
| append      | 一组 Node 或 DOMString 对象 | void     | Element.prototype |





#### innerHTML 和 innerText

- `innerHTML`：批量创建并生成节点
- `innerText`：生成文本节点。本质是 `HTMLElement` 上的属性



### 删除

- `Node.removeChild()`
- `Element.remove()`
- `outerHTML` 或者 `innerHTML`
- `replaceChildren()` 和 `replaceWith()`
- `Document.adoptNode()`     后文会介绍

循环删除

```html
<body>
    <ul class="list list-1">
        <li class="item">list-one</li>
        <li class="item">list-two</li>
        <li class="item">list-three</li>
    </ul>

    <script>
        function clearChildNodes(node) {
            while (node.hasChildNodes()) {
                node.removeChild(node.firstChild);
            }
        }

        const ul = document.querySelector(".list");
        console.log("nodes:", ul.childNodes.length); // 7
        clearChildNodes(ul);
        console.log("nodes:", ul.childNodes.length); // 0
    </script>
</body>
```



### 克隆

- `Node.cloneNode()`             
  - 分为浅克隆和深克隆，建议写上参数，true为深克隆（克隆自身及其子节点），false为浅克隆（只克隆自身）

- `Document.importNode()`     
  - 从内外文档引入节点及其后代节点，源节点会被保留

- `Document.adoptNode()`     
  -  从内外文档获取节点，节点及其后代节点会从源节点删除

- `Element.innerHTML、textContent、innerText` 也具备一定复制能力

注意：cloneNode会拷贝其元素上的属性和其值，当然包括其绑定在元素的上的事件（比如onClick = "alert(1)"，但是如果写在 `JS` 里面使用 `node.addEventListener()` 和 `node.onClick = fn` 绑定的事件就无能为力啦

```html
<body>
    <iframe src="iframe.html" id="ifr"></iframe>

    <div id="container"></div>

    <div>
        <button id="btnCloneNode">cloneNode</button>
        <button id="btnImportNode">importNode</button>
        <button id="btnAdoptNode">adoptNode</button>
    </div>

    <script>
        const ifrEl = document.getElementById("ifr");
	    // cloneNode
        ifrEl.onload = function () {
            const docEx = ifr.contentWindow.document;
            btnCloneNode.addEventListener("click", function () {
                const node = docEx.getElementById("divCloneNode").cloneNode(true);
                container.append(node);
            });
		   //importNode
            btnImportNode.addEventListener("click", function () {
                // true 代表导入其后代节点
                const node = document.importNode(docEx.getElementById("divImportNode"), true);
                container.append(node);
            });
		   // adoptNode
            btnAdoptNode.addEventListener("click", function () {
                const node = document.adoptNode(docEx.getElementById("divAdoptNode"));
                container.append(node);
            });
        };
    </script>
</body>
```

操作示意如下图：

![clone](//tvax3.sinaimg.cn/large/007c1Ltfgy1h5icnj5stag30dc0ein02.gif)



`iframe.html`

```html
<body>
    <div id="container">
        <div id="divCloneNode" style="background-color: skyblue; color: #fff">cloneNode</div>
        <div id="divImportNode" style="background-color: pink; color: #fff">importNode</div>
        <div id="divAdoptNode" style="background-color: green; color: #fff">adoptNode</div>
    </div>
</body>
```



 同文档也可以哒

```html
<body>
    <div style="display: flex">
        <div style="flex: 0 0 200px">
            <div>
                <button id="btnImportNode">importNode container1</button>
                <button id="btnAdoptNode">adoptNode container2</button>
            </div>
            <div id="container1"></div>
        </div>
        <div>
            <div id="content1">
                content1
                <div>child1</div>
                <div>child2</div>
            </div>

            <div id="content2">
                content2
                <div>child1</div>
                <div>child2</div>
            </div>
        </div>
    </div>

    <script>
        btnImportNode.addEventListener("click", function () {
            const node = document.importNode(content1, true);
            container1.append(node);
        });

        btnAdoptNode.addEventListener("click", function () {
            const node = document.adoptNode(content2);

            container1.append(node);
        });
    </script>
</body>
```



## 内存泄漏

可通过 `WeakRef` 检测 `DOM` 是否回收

```js
const wkRef = new WeakRef(el);
if (wkRef.deref()) {
    console.log("el未回收");
} else {
    console.log("el已回收");
}
```



内存泄漏的几个场景

- var 声明接受的节点对象是全局的，不会被回收，除非手动置为 `null`
- 闭包的值比如外层事件函数，使用完了除了删除节点还需将其函数置为 `null`
- 不要用 `eval`，这是个恶魔



## 子节点集合

- `Node.childNodes`：节点的子节点集合，包括元素节点、文本节点、注释节点等
- `Element.children`：返回的只是元素节点集合，即 `nodeType`为 `1` 的节点





## HTMLElement.innerText  和 Node.textContent

- `HTMLElement.innerText`：表示一个节点及后代被**渲染**的文本内容，可能会触发浏览器重绘，产生性能问题
- `Node.textContent`：表示一个节点及其后代节点的文本内容

|                                                  | Node.textContent | HTMLElement.innerText |
| ------------------------------------------------ | ---------------- | --------------------- |
| style、script标签和隐藏的内容(比如display:none ) | 有效             | 无效                  |
| \<br/>                                           | 无效             | 有效                  |
| lt、\r、\n等                                     | 有效             | 剔除                  |
| 连续空格                                         | 有效             | 合并为一个            |



```html
<style>
    body {
        margin: 0;
    }

    h3 {
        margin-top: 0;
        margin-bottom: 0;
    }
</style>
</head>

<body>
    <div style="display: flex">
        <p id="source">
            <style>
                #source {
                    color: red;
                    font-size: 30px;
                }
            </style>
            <script>
                document.getElementById("source");
            </script>
            JS <br />进阶      空格
            云牧DSB
            <span style="display: none">隐藏文本</span>
        </p>
        <div>
            <xmp>
                <style>
                    #source {
                        color: red;
                        font-size: 20px;
                    }
                </style>
                <script>
                    document.getElementById("source");
                </script>
                JS <br /> 进阶 实战 空格<br /> 讲解
                下一层.
                <span style="display:none">隐藏文本</span>

            </xmp>
        </div>
    </div>

    <div style="display: flex">
        <div>
            <h3>Node.textContent:</h3>
            <textarea id="textContentOutput" rows="15" cols="50" readonly></textarea>
        </div>
        <div>
            <h3>HTMLElement.innerText:</h3>
            <textarea id="innerTextOutput" rows="15" cols="50" readonly></textarea>
        </div>
    </div>

    <script>
        const source = document.getElementById("source");
        const textContentOutput = document.getElementById("textContentOutput");
        const innerTextOutput = document.getElementById("innerTextOutput");

        textContentOutput.innerHTML = source.textContent;
        innerTextOutput.innerHTML = source.innerText;
    </script>
</body>
```

 渲染图如下：

![image](//tva4.sinaimg.cn/mw690/007c1Ltfgy1h5iascfq6qj310e0pbjzx.jpg)





## Node.nodeValue  和 value 

- `nodeValue` 对于  文本节点`text(3)`、注释节点`comment(8)`、和 `CDATA(4)` 节点返回其节点文本内容，对于 属性节点`attribute` 节点来说，返回该属性的属性值
- 特定的一些 `HTMLElement` 元素，用 `value` 属性获取其值
  - HTMLInputElement         `<input value="yunmu" >`
  - HTMLTextAreaElement   `<textarea value="yunmu"/>`
  - HTMLButtonElement       `<button value="yunmu"/>`
  - HTMLSelectElement 和 HTMLOptionElement      `<select><option value ="volvo">Volvo</option>  `
  - HTMLDataElement        `<data value="yunmu">圣女果</data>`
  - HTMLParamElement       `<progress value="yunmu" max="100"></progress>`
  - HTMLParamElement       `<object classid="xxx" id="xxx" width="100" height="50"> <param name="BorderStyle" value="yunmu"> </object>`



## clientWidth  和 offsetWidth 和 scrollWidth

- `clientWidth`
  - `Element.clientWidth`（元素宽度）
  - `width` + 左右`padding` (不包含`border`、`margin`、`滚动条`)
- `offsetWidth`
  - `HTMLElement.offsetWidth` (元素布局宽度)
    - `width` +左右`padding` +左右`border` ＋ `滚动条`（不包含`margin`)
- `scrollWidth`
  - `Element.scrollWidth`（元素内容宽度）
  - `width` +  左右`padding`  + `overflow` 溢出而在屏幕上**不可见的内容**（不包含`border`、`margin`、`滚动条`)

```html
<style>
    .box {
        box-sizing: content-box;
        position: relative;
        width: 300px;
        height: 300px;
        overflow: auto;
        border: 5px solid skyblue;
        padding: 10px;
        margin: 0 40px;
        background: pink;
    }

    .content {
        position: relative;
        width: 1000px;
        height: 150px;
        background: greenyellow;
        color: #fff;
        font-size: 30px;
    }
</style>

<body>
    <div id="box" class="box scrollbar">
        <div class="content">
            云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB云牧DSB
        </div>
    </div>
    <script>
        const box = document.getElementById("box");
        console.log("clientWidth ==", box.clientWidth);
        console.log("offsetWidth ==", box.offsetWidth);
        console.log("scrollWidth ==", box.scrollWidth);
    </script>
</body>
```

执行结果如下：

![image](//tva4.sinaimg.cn/mw690/007c1Ltfgy1h5ibcblhyij30fq0pg44n.jpg)





## 节点位置关系

- `Node.compareDocumentPosition`
  - 返回一个数字值相加，可以表示两个节点的关系（是否包含，谁在前，谁在后）
- `Node.contains`
  - 返回的是一个布尔值，来表示传入的节点是否为该节点的后代节点

```html
<body>
    <div id="parent">
        <div id="child"></div>
    </div>

    <script>
        const pEl = document.getElementById("parent");
        const cEl = document.getElementById("child");
        // node.compareDocumentPosition(otherNode)
        // 不在同一文档中        1
        // otherNode在node之前  2
        // otherNode在node之后 	4  ✔
        // otherNode包含node    8
        // otherNode被node包含  16 ✔
        console.log("compareDocumentPosition:", pEl.compareDocumentPosition(cEl)); // 4 + 16 = 20

        console.log("contains:", pEl.contains(cEl)); // true
    </script>
</body>
```





## 大小位置 

- `Element.getlBoundingClientRect`
  - 返回元素的大小及其相对于视口的位置

```html
<body>
    <style>
        #container {
            top: 100px;
            left: 100px;
            position: relative;
            width: 100px;
            height: 100px;
            background-color: skyblue;
        }
    </style>
    <div id="container"></div>
    <div>
        <button id="btnGet">获取</button>
    </div>
    <script>
        btnGet.addEventListener("click", function () {
            const rect = container.getBoundingClientRect();
            console.log(rect);
        });
    </script>
</body>
```

执行结果如下：

![image](//tvax4.sinaimg.cn/mw690/007c1Ltfgy1h5ibpmntu7j30i40w4gv5.jpg)







- `Element.getClientRect`
  - 返回盒子的边界矩形集合
  - 对于行内元素，元素内部的每一行都会有一个边框
  - 对于块级元素，如果里面没有其他元素，一整块元素只有一个边框

```html
<style>
    .multi-client-rects {
        display: inline-block;
        width: 100px;
        position: relative;
    }
</style>
</head>

<body>
    <p class="single-client-rects">
        <span>Paragraph that spans single line</span>
    </p>
    <p class="multi-client-rects">
        <span>Paragraph that spans multiple lines</span>
    </p>

    <div>
        <button id="btnAddByBorder">添加边框(Border)</button>
        <button id="btnAddByRect">添加边框(DOMRect)</button>
    </div>
    <script>
        const $ = (selector) => document.querySelector(selector);

        const elSingle = $(".single-client-rects span");
        const elMulti = $(".multi-client-rects span");

        console.log("elSingle length:", elSingle.getClientRects().length);
        console.log("elMulti length:", elMulti.getClientRects().length);

        console.log("elSingle ClientRects:", elSingle.getClientRects());
        console.log("elMulti ClientRects:", elMulti.getClientRects());

        btnAddByRect.addEventListener("click", function () {
            addBorder(elMulti);
        });

        btnAddByBorder.addEventListener("click", function () {
            elMulti.style.cssText = "border:solid 1px red;";
        });

        function addBorder(el) {
            const rects = el.getClientRects();

            const scrollEl = document.scrollingElement;
            for (let i = 0; i != rects.length; i++) {
                const rect = rects[i];
                const elDiv = document.createElement("div");
                elDiv.style.position = "absolute";
                elDiv.style.border = "1px solid red";
                const scrollTop = scrollEl.scrollTop;
                const scrollLeft = scrollEl.scrollLeft;
                elDiv.style.margin = elDiv.style.padding = "0";
                elDiv.style.top = rect.top + scrollTop + "px";
                elDiv.style.left = rect.left + scrollLeft + "px";

                // 减掉border的2px
                elDiv.style.width = rect.width - 2 + "px";
                elDiv.style.height = rect.height - 2 + "px";
                document.body.appendChild(elDiv);
            }
        }
    </script>
</body>
```

执行结果如下：

![image](//tva4.sinaimg.cn/mw690/007c1Ltfgy1h5ic0dgajqj30pa0w6dv9.jpg)





## 加载完毕事件监听

- `window.onload`
  - 在文档装载完成后会触发 load 事件。此时，在文档中的所有对象都在 DOM 中，所有图片，脚本，链接以及子框架（iframe）都完成了装载
- `DOMContentLoaded`
  - 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded事件被触发，而无需等待样式表、图片和子框架（iframe）的完全加载

优先使用 `DOMContentLoaded` 尽快操作

```html
<body>
    <img src="//tva1.sinaimg.cn/large/007c1Ltfgy1h0plytaly5j32yo1o0tj6.jpg"/>
    
    <script>
        let contentLoadedTime;
        let onloadTime;
        document.addEventListener("DOMContentLoaded", function () {
            console.log("DOMContentLoaded:");
            contentLoadedTime = performance.now();
        });
        window.onload = function () {
            console.log("onload:");
            onloadTime = performance.now();

            console.log("gap:", onloadTime - contentLoadedTime);
        };
    </script>
</body>
```



