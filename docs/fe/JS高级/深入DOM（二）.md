## Webcomponent

- Web Components 是一套不同的技术，允许您创建可重用的定制元素（它们的功能封装在您的代码之外）并且在您的 web 应用中使用它们

一个简单的例子

```html
<body>
  <my-text></my-text>

  <script>
    class MyText extends HTMLElement {
      constructor() {
        super();
        this.append("hello webcomponent");
      }
    }
    window.customElements.define("my-text", MyText);
  </script>
</body>
```

刷新后页面会显示`hello webcomponent`



### 三项主要技术

- Custom elements （自定义元素）
  - 一组 JavaScript API，允许您定义 custom elements 及其行为，然后可以在您的用户界面中按照需要使用它们
- HTML templates（HTML模板）
  - template和 slot 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用
- Shadow DOM（影子DOM）
  - 一组 JavaScript API，用于将封装的“影子”DOM 树附加到元素（与主文档 DOM 分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突



#### 1.Custom elements （自定义元素）

- 自主定制元素：是独立的元素，它不继承其他内建的 HTML 元素
  - 可以直接把它们写成 HTML 标签的形式，来在页面上使用，例如 我们刚才自定义`<my-text>`
- 自定义内置元素：继承自内置的 HTML 元素。指定所需扩展的元素
  - 使用时需通过 is 属性指定 `custom element` 的名称，**必须包含一个短横线**
  - 注册的时候必须使用 extends 的属性

```html
<!-- 自定义内置元素 -->
<body>
  <p color="green" is="color-p">这是color-p的内容</p>
  <script>
    class ColorP extends HTMLParagraphElement {
      constructor() {
        super();
        this.style.color = this.getAttribute("color");
        console.log(this.style.color); // green
      }
    }
    window.customElements.define("color-p", ColorP, { extends: "p" });
  </script>
</body>
```

执行效果如下：

![image](https://tvax1.sinaimg.cn/mw690/007c1Ltfgy1h8zzj458llj308601wwer.jpg)



之前我们处理的`<my-text>`元素必须先使用标签再注册才能生效

推荐在`connectedCallback`生命周期函数中处理，这样就无需关心顺序问题

```html
<body>
  <my-text></my-text>

  <script>
    class MyText extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        this.append("我的文本");
      }
    }
    window.customElements.define("my-text", MyText);
  </script>
  <my-text></my-text>
</body>
```





##### 生命周期

1. connectedCallback：插入文档时
   1. 对节点的操作应位于此生命周期
   2. 可能被多次触发，比如删除后又添加到文档，所以 disconnectedCallback可配置做清理工作
2. disconnectedCallback：从文档删除时
3. adoptedCallback：被移动新文档时
4. attributeChangedCallback：属性变化时
   1. 配合observedAttributess属性一起使用，指定监听的属性
   2. 使用 setAttribute 方法更新属性



![image](https://tvax2.sinaimg.cn/large/007c1Ltfgy1h8zzugzkokj310s0lc79w.jpg)



`生命周期.html`

```html
<body>
  <div id="container1">
    <p is="my-text" text="大家好" id="myText"></p>
  </div>
  <div id="container2"></div>

  <div>
    <button id="btnUpdateText">更新属性</button><br />
    <button id="btnRemove">删除节点</button>
    <button id="btnRestore">恢复节点</button>
  </div>

  <script>
    class MyText extends HTMLParagraphElement {
      constructor() {
        super();
      }

      connectedCallback() {
        console.log("生命周期:connectedCallback");
        this.append("我说:" + this.getAttribute("text"));
      }

      disconnectedCallback() {
        console.log("生命周期:disconnectedCallback");
        this.innerHTML = "";
      }

      static get observedAttributes() {
        // return [''];
        return ["text"];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        console.log("生命周期:attributeChangedCallback", nname, oldValue, newValue);
        // 先触发 changed 再触发 connectedCallback
        // 所以这里判断是不是一次触发 changed
        // 第一次的话，交给 connectedCallback 处理
        if (oldValue != null) {
          this.replaceChildren("我说:" + newValue);
        }
      }

      adoptedCallback() {
        console.log("生命周期:adoptedCallback");
      }
    }

    window.customElements.define("my-text", MyText, { extends: "p" });

    const myTextEl = document.getElementById("myText");
    btnUpdateText.addEventListener("click", function (e) {
      myTextEl.setAttribute("text", "随机的文本" + Math.random());
    });

    btnRemove.addEventListener("click", function (e) {
      myTextEl.remove();
    });

    btnRestore.addEventListener("click", function (e) {
      container1.appendChild(myTextEl);
    });
  </script>
</body>
```

`index.html`

```html
<body>
  <div id="container"></div>
  <button id="btnAdopt">adoptNode</button>

  <iframe id="ifr" src="./生命周期.html"> </iframe>

  <script>
    btnAdopt.addEventListener("click", function (e) {
      const textNode = ifr.contentWindow.document.getElementById("myText");

      container.appendChild(document.adoptNode(textNode));
    });
  </script>
</body>
```



#### 2.HTML templates（HTML模板）

- 使用 JS 对象模型创建节点过于复杂
- ES字符串模板，不友好、缺乏提示、复用性差等

```html
	<!-- 模板字符串 -->
	<body>
		<product-item
			name="关东煮"
			img="//img10.360buyimg.com/seckillcms/s200x200_jfs/t1/121953/18/20515/175357/61e7dc79Ee0acbf20/4f4f56abd2ea2f75.jpg!cc_200x200.webp"
			price="49.8"
		></product-item>

		<script>
			class ProductItem extends HTMLElement {
				constructor() {
					super();
				}

				connectedCallback() {
					const content = `
                    <img class="img" src="https://misc.360buyimg.com/lib/skin/e/i/error-jd.gif" />
                    <div class="name"></div>
                    <div class="price"></div>
                `;
					this.innerHTML = content;
					this.querySelector(".img").src = this.getAttribute("img");
					this.querySelector(".name").innerText = this.getAttribute("name");
					this.querySelector(".price").innerText = this.getAttribute("price");
				}
			}
			window.customElements.define("product-item", ProductItem);
		</script>
	</body>
```



template方式

```html
<body>
  <!-- template -->
  <template id="tpl-product-item">
    <img
         class="img"
         src="https://misc.360buyimg.com/lib/skin/e/i/error-jd.gif"
         />
    <div class="name"></div>
    <div class="price"></div>
  </template>

  <product-item
                name="关东煮"
                img="//img10.360buyimg.com/seckillcms/s200x200_jfs/t1/121953/18/20515/175357/61e7dc79Ee0acbf20/4f4f56abd2ea2f75.jpg!cc_200x200.webp"
                price="49.8"
                ></product-item>

  <script>
    class ProductItem extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        const content = document
        .getElementById("tpl-product-item")
        .content.cloneNode(true);
        this.append(content);
        this.querySelector(".img").src = this.getAttribute("img");
        this.querySelector(".name").innerText = this.getAttribute("name");
        this.querySelector(".price").innerText = this.getAttribute("price");
      }
    }
    window.customElements.define("product-item", ProductItem);
  </script>
</body>
```





slot

```html
<body>
		<template id="tpl-test">
			<style type="text/css">
				.title {
					color: green;
				}
			</style>
			<div class="title">标题</div>
			<slot name="slot-des">默认内容</slot>
		</template>

		<test-item>
			<div slot="slot-des">不是默认内容哦</div>
		</test-item>

		<script>
			class TestItem extends HTMLElement {
				constructor() {
					super();
				}

				connectedCallback() {
					const content = document.getElementById("tpl-test").content.cloneNode(true);

					// 结果呢？ 不生效，想slot生效，就要解开下面的注释，将当前的this.append(content)注释
					this.append(content);
					// const shadow = this.attachShadow({mode: "open"});
					// shadow.append(content);
				}
			}
			window.customElements.define("test-item", TestItem);
		</script>
	</body>
```

![image](https://tva1.sinaimg.cn/large/007c1Ltfgy1h900gnqw53j307s0363ym.jpg)





#### 3.Shadow DOM（影子DOM）

![image](https://tvax4.sinaimg.cn/large/007c1Ltfgy1h900l0lv4qj31f20cg133.jpg)



- 影子DOM，其内部样式不共享

```html
<body>
		<my-item></my-item>
		<my-item-s></my-item-s>
		<div class="container">My item</div>
		<div class="container2">My item</div>

		<style>
			.container.container {
				color: blue;
			}
		</style>
		<template id="tpl-my-item">
			<style>
				.container {
					color: red;
				}

				.container2 {
					color: blue;
				}
			</style>
			<div class="container">My Item</div>
		</template>

		<script>
			class MyItem extends HTMLElement {
				constructor() {
					super();
				}

				connectedCallback() {
					const content = document
						.getElementById("tpl-my-item")
						.content.cloneNode(true);
					this.append(content);
				}
			}

			class MyItemShadow extends HTMLElement {
				constructor() {
					super();
				}

				connectedCallback() {
					const content = document
						.getElementById("tpl-my-item")
						.content.cloneNode(true);

					const shadow = this.attachShadow({ mode: "open" });

					shadow.append(content);
				}
			}

			window.customElements.define("my-item", MyItem);
			window.customElements.define("my-item-s", MyItemShadow);
		</script>
</body>
```

执行如下：

![image](https://tva1.sinaimg.cn/large/007c1Ltfgy1h900qe3ipqj304m05edgd.jpg)





- 影子DOM，其内部元素不可以直接被访问到
- 有一个重要的参数mode
  - open：shadow root元素可以从 js 外部访问根节点
  - closed：拒绝从 js 外部访问关闭的 shadow root 节点

```html
<body>
    <template id="tpl-note">
        <style>
            .title {
                color: red;
                font-size: 22px;
                font-weight: bold
            }

            .des {
                color: #999;
            }
        </style>
        <div class="title"></div>
        <div class="des"></div>
    </template>

    <note-item class="note-item" title="冬奥会" , des="中国队加油! 祝贺运动员们获得好成绩......."></note-item>

    <script>
        class NoteItem extends HTMLElement {
            constructor() {
                super();
            }

            connectedCallback() {
                const content = document.getElementById("tpl-note").content.cloneNode(true);

                const shadow = this.attachShadow({ mode: "closed" })
                shadow.append(content);

                shadow.querySelector('.title').textContent = this.getAttribute("title");
                shadow.querySelector('.des').textContent = this.getAttribute("des");
            }
        }
        window.customElements.define("note-item", NoteItem);
    </script>
<!-- 如果是open则可以通过document.querySelector(".note-item").shadowRoot.querySelector继续操作内部dom -->
</body>
```



引入外部样式

```html
<body>
    <my-item-s></my-item-s>
    <div class="container">My item</div>
    <div class="container2">My item</div>
    <template id="tpl-my-item">
       <!-- 第一种方式 -->
       <link rel="stylesheet" href="4.css">
        <div class="container">
            My Item
        </div>
    </template>

    <script>
        class MyItemShadow extends HTMLElement {
            constructor() {
                super();
            }
            connectedCallback() {
                const content = document.getElementById("tpl-my-item").content.cloneNode(true);

                const shadow = this.attachShadow({ mode: "open" });

                shadow.append(content);
							  <!-- 第二种方式 -->
                const linkElem = document.createElement('link');
                linkElem.setAttribute('rel', 'stylesheet');
                linkElem.setAttribute('href', 'index.css');
                shadow.appendChild(linkElem);
            }
        }

        window.customElements.define("my-item-s", MyItemShadow);
    </script>
</body>
```

 



### 动态创建webComponent组件例子

- 获取商品
- 动态创建元素节点
- 点击商品，跳转（事件）

```html
<body>
    <div id="product-list" style="display: flex"></div>

    <template id="product-item">
        <style>
            .product-item {
                margin-left: 15px;
                cursor: pointer;
            }

            .img {
                width: 100px
            }

            .name {
                text-align: center;
            }

            .price {
                color: #999;
                text-align: center;
            }
        </style>
        <div class="product-item">
            <img class="img" src="https://misc.360buyimg.com/lib/skin/e/i/error-jd.gif" />
            <div class="name"></div>
            <div class="price"></div>
        </div>
    </template>

    <script>
        class ProductItemElement extends HTMLElement {
            constructor(props) {
                super(props);
                this.addEventListener("click", ()=> {
                    window.open(`https://item.jd.com/${this.id}.html`)
                });
            }

            connectedCallback() {
                var shadow = this.attachShadow({ mode: 'open' });
                var doc = document;
                var templateElem = doc.getElementById('product-item');
                var content = templateElem.content.cloneNode(true);

                content.querySelector('.img').src = this.img;
                content.querySelector('.name').innerText = this.name;
                content.querySelector('.price').innerText = this.price;

                shadow.appendChild(content);
            }
        }
        window.customElements.define('product-item', ProductItemElement);
    </script>

    <script>
        var products = [{
            name: "关东煮",
            img: "//img10.360buyimg.com/seckillcms/s200x200_jfs/t1/121953/18/20515/175357/61e7dc79Ee0acbf20/4f4f56abd2ea2f75.jpg!cc_200x200.webp",
            id: '10026249568453',
            price: 49.8
        }, {
            name: "土鸡蛋",
            img: "//img11.360buyimg.com/seckillcms/s200x200_jfs/t1/172777/32/27438/130981/61fbd2e0E236000e0/7f5284367e2f5da6.jpg!cc_200x200.webp",
            id: "10024773802639",
            price: 49.8
        }, {
            name: "东北蜜枣粽子",
            img: "//img20.360buyimg.com/seckillcms/s200x200_jfs/t1/129546/31/19459/110768/60b1f4b4Efd47366c/3a5b80c5193bc6ce.jpg!cc_200x200.webp",
            id: "10035808728318",
            price: 15
        }];

        var proList = document.getElementById("product-list");

        function createProductItem(attrs) {
            const el = document.createElement("product-item");
            el.img = attrs.img;
            el.name = attrs.name;
            el.price = attrs.price;
            el.id = attrs.id;
            return el;
        }
        var elList = products.map(createProductItem)
        proList.append.apply(proList, elList)
    </script>
</body>
```





## DOM事件原理和避坑指南



### window 和 document的关系

- BOM (Browser Object Model)：浏览器对象模型，没有相关标准，一些和网页无关的浏览器功能，如window.location、navigator、 screen、 history等对象
- DOM (Document Object Model)：文档对象模型，W3C 的标准，HTML和XML文档的编程接口
- window 属于BOM, document是DOM中的核心。但是 winodw 引用着document，仅此而已



### DOM0级事件

#### 优点

- 效率高
- 节点上onclick属性被Node.cloneNode克隆，通过JS赋值的onclick不可以
- 移除事件非常简单
- 兼容性好



#### 注意：

- 事件处理函数中，this是当前的节点
- 如果调用函数，会在全局作用域查找
- 唯一性，相同事件只能定义一个回调函数

```html
<body>
  <div>
    <button id="btn1" onclick="console.log('按钮1被点击了')">
      按钮1(代码)
    </button>
  </div>
  <div>
    <button onclick="onClick2()">按钮2(函数)</button>
  </div>
  <div>
    <button onclick="console.log(this.className, this);" class="button3">
      按钮3(this)
    </button>
  </div>

  <div>
    <button onclick="onClick4()" class="button3">按钮4(全局作用域)</button>
  </div>

  <script>
    function onClick2() {
      console.log("按钮2被点击了");
    }

    (function () {
      function onClick4() {
        console.log("按钮4被点击了");
      }
    })();
  </script>
</body>
```



#### DOM0级事件的复制

```html
<body>
  <div id="sourceZone">
    <div>原始区域:</div>

    <div id="sourceButtons">
      <div>
        <button class="btn1" onclick="console.log('按钮1被点击了')">
          按钮1(代码)
        </button>
      </div>
      <div>
        <button class="btn2">按钮2(函数)</button>
      </div>
    </div>
  </div>
		<!-- 复制了绑定在按钮1上的事件，而不会复制按钮2的 -->
  <div id="copyZone">
    <div>复制区域:</div>
  </div>

  <script>
    document.querySelector(".btn2").onclick = onClick2;

    copyZone.append(sourceButtons.cloneNode(true));

    function onClick2() {
      console.log("按钮2被点击了");
    }
  </script>
</body>
```



### DOM2级的事件

![image](https://tva1.sinaimg.cn/large/007c1Ltfgy1h90759xnpej31aa0ok46a.jpg)



#### 注册

```js
target.addEventListener(type, listener, useCapture)；
target.addEventListener(type, listener， options)；
```

- useCapture：true，捕获阶段传播到目标的时候触发，反之冒泡阶段传到目标的时候触发。默认值flase，即冒泡时

```html
<body>
  <button id="btn">按钮</button>

  <script>
     window.addEventListener("click", function () {
      console.log("捕获:window")
    }, true)

    document.addEventListener("click", function () {
      console.log("捕获:document");
    }, true)

    btn.addEventListener(
      "click",
      function (ev) {
        console.log("捕获:btn");
      },
      true
    );

    btn.addEventListener("click", function (ev) {
      console.log("冒泡:btn");
    });

    document.addEventListener("click", function () {
      console.log("冒泡:document");
    })

    window.addEventListener("click", function () {
      console.log("冒泡:window")
    })

  </script>
</body>
```

![image](https://tva2.sinaimg.cn/mw690/007c1Ltfgy1h9079vx4pij308s0a275d.jpg)



#### once

- 是否只响应一次
- 最典型的应用就是 视频播放，现代浏览器可能需要用户参与后，视频才可以有声播放

```html
<body>
    <video id="video" controls width="250" autoplay>
        <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm">
        <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
        Sorry, your browser doesn't support embedded videos.
    </video>

    <script>
        document.addEventListener("click", ()=>{
            console.log("播放视频")
            video.play();
        },{
            once: true,
        })
    </script>
</body>
```



#### passive

- 设置为true时，事件处理成不会调用preventDefault()，可提高性能
- 某些触摸事件（以及其他）的事件监听器在尝试处理滚动时，可能阻止浏览器的主线程，从而导致滚动处理期间性能可能大大降低

```js
ele.addEventListener("touchmove", ()=>{}, {
  passive: true,
})
```





#### signal

- AbortSignal，该 AbortSignal 的 abort0 方法被调用时，监听器会被移除
- AbortSignal 也被用于取消 fetch 请求

```html
<body>
    <button id="btn">按钮</button>

    <script>
        var controller = new AbortController();
        var signal = controller.signal;

        btn.addEventListener("click", ev => {
            console.log("按钮被点击了");
            controller.abort();
        }, {
            signal
        });
    </script>
</body>
```





#### 有趣的 useCapture

- 如果这个参数相同并且事件回调函数相同，事件不会被添加

```html
<body>
    <button id="btn">按钮</button>

    <script>
        function onClick(){
            // 只打印两次
            console.log("按钮被点击了");
        }
        // capture选项都是false, 只有一个添加成功
        btn.addEventListener("click", onClick);
        btn.addEventListener("click", onClick);

        // capture选项都是true, 只有一个添加成功
        btn.addEventListener("click", onClick, {
            capture: true,
        });
        btn.addEventListener("click", onClick, {
            capture: true,
            once: true,
        });
    </script>
</body>
```



#### event.preventDefault

- 阻止默认的行为，比如有 href 属性的 a 标签不会跳转，checkbox的选中不会生效等
- 事件依旧还会继续传

```html
<body>
    <div>
        <a id="linkMK" target="_blank" href="https://www.imooc.com/">跳转到慕课</a>
    </div>
    <div>
        <input id="ckBox" type="checkbox"><label for="ckBox">我统一</label>
    </div>

    <script>
        linkMK.addEventListener("click", function(ev){
            ev.preventDefault();
        })

        ckBox.addEventListener("click", function(ev){
            ev.preventDefault();
        })
    </script>
</body>
```





#### stopPropagation

- 阻止捕获和冒泡阶段中当前事件的进一步传播

```html
<body>
  <button id="btn">按钮</button>

  <script>
    btn.addEventListener("click", function (ev) {
      console.log("冒泡:btn");
    });

    btn.addEventListener(
      "click",
      function (ev) {
        console.log("捕获:btn");
      },
      true
    );

    document.addEventListener("click", function () {
      console.log("冒泡:document");
    })

    document.addEventListener("click", function (ev) {
      console.log("捕获:document");
      ev.stopPropagation();
    }, true)
  </script>
</body>
```

![image](https://tvax1.sinaimg.cn/mw690/007c1Ltfgy1h907o4g54tj308e01e3yi.jpg)





#### stoplmmediatePropagation

- 阻止监听同一事件的其他事件监听器被调用

```html
<body>
  <button id="btn">按钮</button>

  <script>
    btn.addEventListener("click", function (ev) {
      console.log("冒泡:btn");
    });

    btn.addEventListener(
      "click",
      function (ev) {
        console.log("捕获:btn 1");
      },
      true
    );

    btn.addEventListener(
      "click",
      function (ev) {
        ev.stopImmediatePropagation();
        // ev.stopPropagation();
        console.log("捕获:btn 2");
      },
      true
    );

    btn.addEventListener(
      "click",
      function (ev) {
        console.log("捕获:btn 3");
      },
      true
    );

    document.addEventListener("click", function () {
      console.log("冒泡:document");
    });

    document.addEventListener(
      "click",
      function (ev) {
        console.log("捕获:document");
      },
      true
    );
  </script>
</body>
```

![image](https://tvax4.sinaimg.cn/mw690/007c1Ltfgy1h907qjafzjj308m04m0t5.jpg)





#### target 和 currentTarget

- target： 触发事件的元素。谁触发
- currentTarget: 事件绑定的元素。谁添加的事件监听函数

```html
<body>
  <button id="btn">按钮</button>

  <script>
    btn.addEventListener("click", function (ev) {
    });

    document.addEventListener("click", function(ev){
      console.log("ev.target:", ev.target)
      console.log("ev.currentTarget:", ev.currentTarget)
    })
  </script>
</body>
```





#### 事件委托

- 利用事件传播的机制，利用外层节点处理事件的思路。
- 优点："动态性"更好、减少内存消耗

```html
<body>
    <ul id="ulList">
        <li>
            <div>白菜</div>
            <a class="btn-buy" data-id="1">购买</a>
        </li>
        <li>
            <div>萝卜</div>
            <a class="btn-buy" data-id="2">购买</a>
        </li>
    </ul>

    <script>
        ulList.addEventListener("click", function (ev) {
            // 识别节点
            if (ev.target.classList.contains("btn-buy")) {
                console.log("商品id:", ev.target.dataset.id)
            }
        })
    </script>
</body>
```





### DOM3级事件

- DOM3 Events在 DOM2 Events 基础上重新定义了事件，并增加了新的事件类型

![image](https://tva4.sinaimg.cn/large/007c1Ltfgy1h907u09tatj31i40g47c0.jpg)





### 注意事项和建议

1. DOMO级事件一定程度上可以复制
2. DOM2级别事件不可以复制
3. 合理利用选项once
4. 合理利用选型passive提升性能
5. capture选项相同和并且事件回调函数相同，事件不会被添加
6. 因为都是继承于EventTarget，任何一个节点都是事件中心
7. 合理利用事件代理





## 自定义事件



### 内置的事件类型

- 比如点击保存按钮，这是就是点击事件 (click)
- 某个文本失去焦点后检查输入的内容是否合法，这是 blur事件
- 鼠标滚动页，页面滚动的，这是 mousewheel 事件



### 触发内置事件

- `elment.[evenType]()` 直接调用
- new [Event] + dispatchEvent



`elment.[evenType]()`

```html

<body>
    <div>
        <button type="button" id="btnDownload">下载文件</button>
    </div>

    <script>
        function createBlob(content, type) {
            var blob = new Blob([content], {type});
            return blob;
        }

        function downloadFile(filename, content, type = "text/plain") {
            var aEl = document.createElement('a');
            // 指定下载文件名
            aEl.download = filename;

            const blob = createBlob(content, type);
            // 生成url地址
            const url = URL.createObjectURL(blob);
            aEl.href = url;
            document.body.appendChild(aEl);

            // 触发点击事件
            aEl.click();
            document.body.removeChild(aEl);

            // 释放url
            URL.revokeObjectURL(url);
        }

        const content = "测试的文本";
        btnDownload.addEventListener("click", function () {
            console.log("点击了")
            downloadFile("测试.txt", content)
        })
    </script>
</body>
```



如果改造成自定义事件触发

```js
// aEl.click();
// 触发点击事件
var event = new MouseEvent("click");
aEl.dispatchEvent(event);
```



前端快捷生成uuid

```js
URL.createObjectURL(new Blob([""])).split("/").pop()
```





### 自定义事件三种方式

1. document.createEvent()（废弃）
2. new Event()
3. new CustomEvent()



#### document.createEvent()

- `var event  = document.createEvent(type);`



#### new Event

- `event = new Event(type, eventInit);`

![image](https://tva3.sinaimg.cn/large/007c1Ltfgy1h90a30qsh5j316e0kutc1.jpg)

简单使用

```html
<body>
  <div id="divWrapper">
    <button type="button" id="btnTrigger">触发事件</button>
  </div>

  <script>
    btnTrigger.addEventListener("myEvent", function () {
      console.log("DOM2: myEvent");
    });

    btnTrigger.onmyEvent = function (event) {
      console.log("DOM0: myEvent");
    };

    const event = new MouseEvent("myEvent");
    btnTrigger.dispatchEvent(event);
  </script>
</body>
```



更复杂的使用new Event来处理流程

`event.html`

```html
<body>
  <div class="container">
    <button id="btn">开始吧</button>
  </div>

  <div>
    <div>
      流程1:
      <div id="step1"></div>
    </div>
    <div>
      流程2:
      <div id="step2"></div>
    </div>
  </div>

  <script>
    function dispatchEE(target, type) {
      var event = new Event(type);
      target.dispatchEvent(event);
    }

    btn.addEventListener("click", function () {
      // 做了很多的工作
      setTimeout(() => {
        dispatchEE(step1, "step-1");
      }, 2000);
    });

    // 解耦
    step1.addEventListener("step-1", function () {
      step1.textContent = "流程1进行中......";
      setTimeout(() => {
        dispatchEE(step2, "step-2");
      }, 2000);
    });

    // 解耦
    step2.addEventListener("step-2", function () {
      step2.textContent = "流程2进行中......";
      setTimeout(() => {
        dispatchEE(window, "finished");
      }, 2000);
    });

    window.addEventListener("finished", function () {
      alert("finished successfully");
    });
  </script>
</body>
```





#### new CustomEvent

- `event = new Event(type, eventInit);`

![image](https://tva2.sinaimg.cn/large/007c1Ltfgy1h90abv69v4j316m0ei0vc.jpg)

它可以携带detail参数了！改造之前的案例

```html
<body>
  <div class="container">
    <button id="btn">开始吧</button>
  </div>

  <div>
    <div>
      流程1:
      <div id="step1"></div>
    </div>
    <div>
      流程2:
      <div id="step2"></div>
    </div>
  </div>

  <script>
    function dispatchEE(target, type, data) {
      var event = new CustomEvent(type, {
        detail: data,
      });
      target.dispatchEvent(event);
    }

    btn.addEventListener("click", function () {
      // 做了很多的工作
      setTimeout(() => {
        dispatchEE(step1, "step-1", { param: "step1的启动参数" });
      }, 2000);
    });

    // 解耦
    step1.addEventListener("step-1", function (ev) {
      step1.textContent = "流程1进行中......,参数:" + ev.detail.param;
      setTimeout(() => {
        dispatchEE(step2, "step-2", { param: "step2的启动参数" });
      }, 2000);
    });

    // 解耦
    step2.addEventListener("step-2", function (ev) {
      step2.textContent = "流程2进行中......,参数:" + ev.detail.param;
      setTimeout(() => {
        dispatchEE(window, "finished", "我是结果");
      }, 2000);
    });

    window.addEventListener("finished", function (ev) {
      alert("finished successfully,结果:" + ev.detail);
    });
  </script>
</body>
```



兼容垫片

```js
(function(){    
    if(typeof CustomEvent !== "function"){
     var CustomEvent = function(event, params){
         params = params || { bubbles: false, cancelable: false, detail: undefined };

         var evt = document.createEvent('CustomEvent');

         evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

         return evt;
     };

     CustomEvent.prototype = window.Event.prototype;

     window.CustomEvent = CustomEvent;
 }
})();
```





## JS操作样式



### 样式来源

1. 浏览器默认样式
2. link引入的外部样式
3. style标签
4. style属性：内联样式



### 样式优先级

1. 内联样式(style="color: red"）
2. ID选择器（#id{}）
3. 类和伪类选择器(.div )
4. 标签选择器 (div {}）
5. 通配符选择器（*）
6. !important



### 操作元素节点上的style属性

- 多个单词使用驼峰

```js
el.style.backgroundColor = "red";
el.stvle.fontSize = "1Opx";
```

- style.cssText 批量赋值

```js
el.style.cssText ="background-color： green !important; font-size: 40px;
```



### DOMTokenList.toggle

- 定义：从列表中删除一个给定的标记 并返回 false。如果标记不存在，则添加并且函数返回 true
- 语法：tokenList.toggle(token, force)
- force参数：如果force为真，就变为单纯的添加

```html
<body>
  <div>
    <button type="button" id="btnToggleFalse">toggle(false)</button>
    <button type="button" id="btnToggleTrue">toggle(true)</button>
  </div>

  <div id="container">
    <div>文字</div>
  </div>
  <style>
    .test-div {
      color: red;
    }
  </style>

  <script>
    const el = container.firstElementChild;
    // toggle false
    btnToggleFalse.addEventListener("click", function () {
      el.classList.toggle("test-div");
    });
    // toggle true
    btnToggleTrue.addEventListener("click", function () {
      el.classList.toggle("test-div", true);
    });
  </script>
</body>
```



### 操作style节点内容

- 本质还是Node节点
- 所以可以直接替换节点内容

```html
<style id="ss-test">
  .div {
    background-color: red;
    font-size: 30px;
  }
</style>
</head>

<body>
  <div>
    <button id="btnReplace" type="button">替换</button>
  </div>
  <div class="div">文本</div>

  <script>
    const ssEl = document.getElementById("ss-test");
    btnReplace.addEventListener("click", function () {
      ssEl.textContent = ssEl.textContent.replace(
        "background-color: red",
        "background-color: blue"
      );
    });
  </script>
</body>
```





### 操作已有的style节点

- CSSOM: CSS Object Model 是一组允许用JavaScript操纵CSS的APl。它是继DOM和HTML APl之后，又一个操纵CSS的接口，从而能够动态地读取和修改CSS样式

![image](https://tvax2.sinaimg.cn/large/007c1Ltfgy1h90c2cii2zj31f80lytf7.jpg)



![image](https://tva4.sinaimg.cn/large/007c1Ltfgy1h90c2tst7bj314s0pu11r.jpg)



```html
<style id="ss-test">
  .div {
    background-color: red;
    font-size: 30px;
  }

  div {
    font-size: 26px
  }
</style>
<body>
  <div>
    <button type="button" id="btnUpdate">更改style节点</button>
  </div>
  <div class="div">文本</div>

  <script>

    document.getElementById("btnUpdate").addEventListener("click", updateStyleNode)

    function updateStyleNode() {
      const styleSheets = Array.from(document.styleSheets);
      // ownerNode获得styleSheet对应的节点
      const st = styleSheets.find(s=> s.ownerNode.id === "ss-test");
      // 选过选择器找到对应的rule
      const rule = Array.from(st.rules).find(r=> r.selectorText === ".div");

      // 兼容性 
      const styleMap = rule.styleMap;
      styleMap.set("background-color", "blue");

    }

  </script>
</body>
```





### 操作外部样式

```html
<link rel="stylesheet" href="./2.3.css" />
<link rel="stylesheet" href="./2.3.1.css" />
<body>
  <div>
    <button type="button" id="btnUpdate">更改style节点</button>
  </div>
  <div class="div">文本</div>

  <style>
    .a {
    }
  </style>
  <script>
    document.getElementById("btnUpdate").addEventListener("click", updateStyleNode);

    function updateStyleNode() {
      const styleSheets = Array.from(document.styleSheets);
      const st = styleSheets.find((s) => s.href.endsWith("2.3.1.css"));
      const rule = Array.from(st.rules).find(
        (r) => r.selectorText === ".div"
      );

      // 兼容性
      const styleMap = rule.styleMap;
      styleMap.set("background-color", "green");
    }
  </script>
</body>
```





### 动态创建link节点引入样式

```js
function importcSSByUr1(ur1){
  const link = document.createElement("link")；
  link.type = 'text/css'；
  link.rel = 'stylesheet’；
  link.href = url；
  document.head.appendChild(link)；
}
```





### window.getComputeStyle

- 返回一个对象，包含元素计算之后的css属性值
- 语法：let style = window.getComputedStyle(element, [pseudoElt]); pseudoElt参数可以让它查询伪元素



注意：

- 计算后的样式不等同于css文件，style标签和属性设置的样式的值
- 可以获取伪类样式
- 此方法会引起重排

```html
<body>
		<div id="ddddd">
			<div id="div-test" class="div">文本</div>
		</div>
		<hr />
		<div>
			伪类的样式:
			<pre id="divGc"></pre>
		</div>
		<style>
			.div:before {
				content: "(你好)";
				font-size: 1.6rem;
			}
		</style>

		<script>
			const divEl = document.getElementById("div-test");
			const styleDeclaration = window.getComputedStyle(divEl, "before");
			const fontSize = styleDeclaration.fontSize;
			const content = styleDeclaration.content;

			divGc.textContent = `
            fontSize: ${fontSize}
            content: ${content}
        `;
		</script>
	</body>
```





### 重排和重绘

- 重排：元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为重排
- 重绘：元素样式的改变并不影响它在文档流中的位置或者尺寸的时候，例如：color, backgound-color, outline-color等，浏览器会重新绘制元素，这个过程称为重绘

```html
<body>
  <div>
    <button id="btnAdd">动态创建节点并动画</button>
  </div>
  <div id="container"></div>
  <style>
    .ani {
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: blue;
      transition: all 3s;
    }
  </style>
  <script>
    btnAdd.addEventListener("click", createAni);
    function createAni() {
      var div = document.createElement("div");
      div.className = "ani";
      container.appendChild(div);

      div.style.left = "0px";
      // 去掉这行代码就不会有动画
      // window.getComputedStyle(div).height

      setTimeout(() => {
        div.style.left = "200px";
      }, 0);
    }
  </script>
</body>
```





## 订阅发布中心

- 是什么：是一种消息通知机制，也是一种发布订阅模式的的实际应用
- 应用场景：公众号消息，短信提醒等等



### 四行代码实现

```html
    <script>
        window._on = window.addEventListener,

        window._off = window.removeEventListener;

        window._emit = (type, data) => window.dispatchEvent(new CustomEvent(type, { detail: data }));;

        window._once = (type, listener) => window.addEventListener(type, listener, { once: true, capture: true });
    </script>

    <script>
        function onEventX(ev) {
            console.log("event-x 收到数据:", ev.detail);
        }

        // 订阅
        window._on("event-x", onEventX);
        window._once("event-once", ev => console.log("event-once 收到数据:", ev.detail));

        // once
        window._emit("event-once", { uid: -100, message: "you love me" });
        window._emit("event-once", { uid: -100, message: "you love me" });
        // 订阅和取消订阅
        window._emit("event-x", { uid: 100, message: "i love you" })
        window._off("event-x", onEventX);
        window._emit("event-x", { uid: 100, message: "i love you" })
    </script>
```



原理：

- window是表象，根源是EventTarget
- Window、document和元素节点也是继承于EventTarget
- XMLHttpRequest、 WebSocket也继承于EventTarget
- 继承于它，就是一个事件中心，可以EventTarget.addEventListener() 、 EventTarget.removeEventListener() 、EventTarget.dispatchEvent



### 简化三行代码实现

```html
<script>

  (window._on = window.addEventListener, window._off = window.removeEventListener);

  window._emit = (type, data) => window.dispatchEvent(new CustomEvent(type, { detail: data }));;

  window._once = (type, listener) => window.addEventListener(type, listener, { once: true, capture: true });

</script>
```

缺点：

- 不能多实例化
- 挂载window上太丑了
- 不能传递多参数啊
- 参数从ev.detail上获取，不合理
- 不能在nodejs中使用



### 升级6行

```html
<script>
  class EventEmitter extends EventTarget {
    on = this.addEventListener;

    off = this.removeEventListener;

    emit = (type, data) => this.dispatchEvent(new CustomEvent(type, { detail: data }));

    once = (type, listener) => this.on(type, listener, { once: true, capture: true });
  }
</script>
<script>
  const emitter = new EventEmitter();
  function onEventX(ev) {
    console.log("event-x 收到数据:", ev.detail);
  }

  // 订阅
  emitter.on("event-x", onEventX);
  emitter.once("event-once", ev => console.log("event-once 收到数据:", ev.detail));

  // 发布
  emitter.emit("event-once", { uid: -100, message: "you love me" });
  emitter.emit("event-once", { uid: -100, message: "you love me" });

  emitter.emit("event-x", { uid: 100, message: "i love you" })
  emitter.off("event-x", onEventX);
  emitter.emit("event-x", { uid: 100, message: "i love you" })
</script>
```

缺点：

- ev.detail上获取参数
- 不能传递多个参数



### 继续升级8行

```html
<script>
  class EventEmitter extends EventTarget {
    on = (type, listener, options) => this.addEventListener(type, function wrap(e) {
      return (listener.__wrap__ = wrap, listener.apply(this, e.detail || []))
    }, options)

    off = (type, listener) => this.removeEventListener(type, listener.__wrap__);

    emit = (type, ...args) => this.dispatchEvent(new CustomEvent(type, { detail: args }));

    once = (type, listener) => this.on(type, listener, { once: true, capture: true });
  }
</script>


<script>
  const emitter = new EventEmitter();
  function onEventX(uid, msg) {
    console.log("event-x 收到数据:", this, uid, msg);
  }

  // 订阅
  emitter.on("event-x", onEventX);
  emitter.once("event-once", (uid, msg) => console.log("event-once 收到数据:", uid, msg));

  // 发布
  emitter.emit("event-once", -100, "you love me");
  emitter.emit("event-once", -100, "you love me");

  emitter.emit("event-x", 100, "i love you");
  emitter.off("event-x", onEventX);
  emitter.emit("event-x", 100, "i love you");

</script>
```

