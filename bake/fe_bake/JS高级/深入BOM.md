## 1.window

- 一个全局对象，全局变量和属性均是它的属性
- 包含 DOM 文档的窗口，表示浏览器窗口和页面可见区域



### window.isSecureContext

- 一个布尔值，标识当前上下文是否安全，安全( true )或不安全( false )，浏览器一些特性只能在安全上下文执行
- 该 API 一个重要表现就是网页是不是 https 协议
- 比如安全的： https://www.test.com，不安全的： http://www.test.com
- 不安全的情况：https://w3c.github.io/webappsec-secure-contexts



有些特殊情况也被认为是安全的，主要是为了本地的开发

- http://127.0.0.1     http://localhost
- http://*.localhost地址(比如：http://dev.whatever.localhost/地址 )
- file://url





### window.open()

- 可以打开一个指定地址的新窗口
- 返回打开的新窗口对象的引用
- 注意:如果是同源，可以直接调用新窗口的方法

语法：

```planText
let windowObjectReference = window.open(strUrl, strWindowName, [strWindowFeatures]);
strUrl: url地址
strWindowName: 新窗口的名称
strWindowFeatures：可选值，定义将要打开的窗口的一些特性（工具栏、位置）
```



点击打开新窗口开启新窗口，点击关闭可以关闭新窗口

```html
<body>
    <div>
        <button type="button" id="btnOpen">打开新窗口</button>
        <button type="button" id="btnClose">关闭</button>
    </div>

    <script>
        let winRef;
        let strWindowFeatures = `
                    menubar=yes,
                    location=yes,
                    resizable=yes,
                    scrollbars=yes,
                    status=no,
                    left=100px,
                    top=100px,
                `;

        btnOpen.addEventListener("click", function () {
            winRef = window.open("https://juejin.cn/frontend", "掘金", strWindowFeatures);
        });

        btnClose.addEventListener("click", function () {
            winRef && winRef.close();
        });
    </script>
</body>
```



同源可以互相调用其窗口的方法

父窗口：

```html
<body>
    <div>父窗口</div>

    <button id="btnOpen">打开子窗口</button>
    <button id="btnInvoke">调用子窗口方法</button>

    <script>
        let winRef;
        btnOpen.addEventListener("click", function () {
            let strWindowFeatures = `
                    menubar=yes,
                    location=yes,
                    resizable=yes,
                    scrollbars=yes,
                    status=no,
                    left=100px,
                    top=100px,
                `;

            winRef = window.open("./ifr.html", "新窗口", strWindowFeatures);
        });

        function parentMethod() {
            alert("父窗口方法执行调用");
        }

        btnInvoke.addEventListener("click", function () {
            winRef && winRef.childMethod();
        });
    </script>
</body>
```



子窗口：

```html
<body>
    <div>子窗口</div>
    
    <button id="btnInvoke">调用父窗口方法</button>

    <script>
        function childMethod() {
            alert("子窗口方法执行调用");
        }

        btnInvoke.addEventListener("click", function () {
            window && window.opener && window.opener.parentMethod();
        });
    </script>
</body>
```



操作演示：

![window.open](//tva4.sinaimg.cn/large/007c1Ltfgy1h4q3h7w8ggg31yj0yw4k9.gif)





### 窗体可见性

#### document.hidden

- 返回布尔值，表示页面是（true）否（false）隐藏



#### document.visibilityState

- 返回document的可见性，由此可以知道当前页面显示隐藏和正在渲染
- 可选值："visible"、"hidden" 、 "prerender"

还有一个可搭配的事件 visibilitychange 监听当前窗口可见性是否更改

代码演示：

```html
<script>
    console.log("visibilityState:", document.visibilityState, "document.hidden:", document.hidden);
    console.log("----------------------------------------");
    document.addEventListener("visibilitychange", function () {
        console.log("visibilityState:", document.visibilityState, " document.hidden:", document.hidden);
    });
</script>
```





### 滚动方法

| 方法名         | 作用             | 拥有此方法的对象 |
| -------------- | ---------------- | ---------------- |
| scroll         | 滚动到指定的位置 | Window, Element  |
| scrollTo       | 滚动到指定的位置 | Window, Element  |
| scrollBy       | 滚动指定的偏移量 | Window, Element  |
| scrolllnfoView | 滚动到可视区     | Element          |

除此之外还有一些方法

- 设置scrollTop、scrollLeft等
- 设置锚点



### window.matchMedia()

- 可被用于判定 Document 是否匹配媒体查询
- 监控一个 document 来判定它匹配了或者停止匹配了此媒体查询

```html
<body>
    <div>
        (min-width: 600px):
        <span style="color: red" id="mq-value"> </span>
    </div>
    <script>
        let mql = window.matchMedia("(min-width: 600px)");
        document.querySelector("#mq-value").innerText = mql.matches;

        mql.addEventListener("change", function () {
            mql = window.matchMedia("(min-width: 600px)");
            document.querySelector("#mq-value").innerText = mql.matches;
        });
    </script>
</body>
```





### window.getSelection()

- 等价方法：Document.getSelection()
- 表示用户选择的文本范围或光标的当前位置
- 可使用 Document.activeElement 来返回当前的焦点元素

```html
<body>
    <div>云牧是个大帅锅</div>
    <div style="margin-top: 50px"></div>
    选中的内容：
    <div id="selectedContent"></div>
    <script>
        setInterval(function () {
            selectedContent.textContent = window.getSelection().toString();
        }, 1500);
    </script>
</body>
```



### window.frameElement()

- 定义∶返回嵌入当前window对象的元素(比如`<iframe>` 或者`<object>`)
- 如果当前window对象已经是顶层窗口，则返回null
- 例子: window.frameElement 获得 iframe 节点，然后设置其 src 属性，实现调整

`index.html`

```html
<div>
    <iframe src="./ifr1.html"></iframe>
</div>
```

`ifr1.html`

```html
iframe 1
<script>
    setTimeout(function () {
        window.frameElement.src = "./ifr2.html";
    }, 3000);
</script>
```

`ifr2.html`

```html
iframe 2
<script>
    setTimeout(function () {
        window.frameElement.src = "./ifr.html";
    }, 3000);
</script>
```



### 网络状态

- navigator.onLine

```html
<body>
    <div id="message"></div>

    <script>
        message.innerHTML += `i am ${navigator.onLine ? "online" : "offline"}<br />`;
        window.onoffline = function () {
            message.innerHTML += "i am offline <br />";
        };
        window.ononline = function () {
            message.innerHTML += "i am online <br />";
        };
    </script>
</body>
```



### window.print打印

- 打开打印对话框打印当前文档

使用媒体查询，在浏览器打印的时候设置一些特殊样式

```css
<style media="print">
</style>

@media print {
    .content1 {
        color: green;
        font-size:18px
    }
}

<link rel="stylesheet" href="./print.css" media="print">

@import url("print.css") print;
```



实现一个案例：打印的时候隐藏按钮和一些文字

```html
<style media="print">
    .content1 {
        color: green;
        font-size: 18px;
    }
    .content2 {
        display: none;
    }
    #btnPrint {
        display: none;
    }
</style>
</head>

<body>
    <div class="content1">
        <h3>云牧大帅锅</h3>
    </div>
    <div class="content2">
        <h3>云牧小帅锅</h3>
    </div>

    <button id="btnPrint">打印</button>
    <script>
        btnPrint.addEventListener("click", function () {
            window.print();
        });
    </script>
</body>
```





## 2.不同窗口间如何传递消息



### 1.WebSocket

- 思路:引入第三者进行中转
- 缺点∶需要引入服务端

![image](//tva4.sinaimg.cn/mw690/007c1Ltfgy1h4q6ensl96j30p80gedin.jpg)



### 2.定时器＋客户端存储

- 思路:本地存储＋本地轮询

本地存储的方式

- cookie
- localStorage/sessionStorage
- indexDB
- chrome的FileSystem

`index.html`  iframe引入两个页面

```html
<style>
    html,
    body,
    section {
        height: 100%;
    }

    section {
        display: flex;
    }

    iframe {
        flex: 1;
        height: 100%;
    }
</style>
</head>
<body>
    <section>
        <iframe src="./page1.html"></iframe>
        <iframe src="./page2.html"></iframe>
    </section>
</body>
```



`page1.html`

```html
<body>
    <h3>Page 1</h3>
    <section style="margin-top: 50px; text-align: center">
        <input id="inputMessage" value="测试消息" />
        <input type="button" value="发送消息" id="btnSend" />
        <section id="messages">
            <p>收到的消息：</p>
        </section>
    </section>

    <script>
        let messagesEle = document.getElementById("messages");
        let messageEl = document.getElementById("inputMessage");
        let btnSend = document.getElementById("btnSend");
        let lastMessage = null;

        setInterval(() => {
            let message = sessionStorage.getItem("ls-message2");
            try {
                if (message) {
                    message = JSON.parse(message);
                    if (!lastMessage || lastMessage.date != message.date) {
                        appendMessage(message);
                        lastMessage = message;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }, 200);

        function appendMessage(data) {
            let msgEl = document.createElement("p");
            msgEl.innerText = data.date + " " + data.from + ":" + data.message;
            messagesEle.appendChild(msgEl);
        }

        btnSend.addEventListener("click", function () {
            let message = messageEl.value;

            sessionStorage.setItem(
                "ls-message1",
                JSON.stringify({
                    date: Date.now(),
                    message,
                    from: "page 1",
                })
            );
        });
    </script>
</body>
```



`page2.html`

```html
<body>
    <h3>Page 2</h3>
    <section style="margin-top: 50px; text-align: center">
        <input id="inputMessage" value="测试消息" />
        <input type="button" value="发送消息" id="btnSend" />
        <section id="messages">
            <p>收到的消息：</p>
        </section>
    </section>

    <script>
        let messagesEle = document.getElementById("messages");
        let messageEl = document.getElementById("inputMessage");
        let btnSend = document.getElementById("btnSend");
        let lastMessage = null;

        setInterval(() => {
            let message = sessionStorage.getItem("ls-message1");
            try {
                if (message) {
                    message = JSON.parse(message);
                    if (!lastMessage || lastMessage.date != message.date) {
                        appendMessage(message);
                        lastMessage = message;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }, 200);

        function appendMessage(data) {
            let msgEl = document.createElement("p");
            msgEl.innerText = data.date + " " + data.from + ":" + data.message;
            messagesEle.appendChild(msgEl);
        }

        btnSend.addEventListener("click", function () {
            let message = messageEl.value;

            sessionStorage.setItem(
                "ls-message2",
                JSON.stringify({
                    date: Date.now(),
                    message,
                    from: "page 2",
                })
            );
        });
    </script>
</body>
```



![setInterval](//tva2.sinaimg.cn/large/007c1Ltfgy1h4q7m2f5i1g31xq0xggqg.gif)





### 3.postMessage

- 思路：用某种手段建立窗口间的联系，通过 postMessage 进行跨窗体通讯
- 优点：不受同源策略的限制



`index.html`

```html
<body>
    <div>
        <iframe src="./ifr.html" id="ifr" style="width: 600px; height: 300px"></iframe>
    </div>

    index.html
    <div>
        <div>Message:</div>
        <div id="messages"></div>
    </div>
    <script>
        window.addEventListener("message", function (event) {
            messages.innerHTML += `
                <div>${event.data}</div>  
            `;
        });

        setInterval(() => {
            ifr.contentWindow.postMessage(`message from index.html: ${Date.now()}`);
        }, 2000);
    </script>
</body>
```



`ifr.html`

```html
<body>
    ifr.html
    <div>
        <div>Message:</div>
        <div id="messages"></div>
    </div>
    <script>
        window.addEventListener("message", function (event) {
            messages.innerHTML += `
                <div>${event.data}</div>  
            `;
        });

        setInterval(() => {
            window.parent.postMessage(`message from ifr.html: ${Date.now()}`);
        }, 2000);
    </script>
</body>
```



![postMessage](//tvax1.sinaimg.cn/large/007c1Ltfgy1h4q87yravmg31xq0xe40b.gif)





### 4.storage

`index.html`

```html
<body>
    <form>
        <div>
            <button id="btnSend" type="button">发送消息</button>
        </div>
        <div>消息:</div>
        <div id="message"></div>

        <script>
            btnSend.addEventListener("click", function () {
                localStorage.setItem(
                    "key",
                    JSON.stringify({
                        key: "key",
                        data: Math.random(),
                    })
                );
            });

            window.addEventListener("storage", function (ev) {
                console.log("ev:", ev);
                message.textContent = JSON.stringify({
                    oldValue: ev.oldValue,
                    newValue: ev.newValue,
                });
            });
        </script>
    </form>
</body>
```



其他页面

```html
<body>
    <div>消息:</div>
    <div id="message"></div>

    <script>
        window.addEventListener("storage", function (ev) {
            console.log("ev:", ev);
            message.textContent = JSON.stringify({
                oldValue: ev.oldValue,
                newValue: ev.newValue,
            });
        });
    </script>
</body>
```



上面 index 页面自身无法监测 storage 事件来感知修改，我们需要拦截重写一下对应的设置方法

```html
<script>
    // 拦截，监听事件
    const oriSetItem = localStorage.setItem;
    Object.defineProperty(localStorage.__proto__, "setItem", {
        value: function (key, value) {
            let oldValue = localStorage.getItem(key);
            let event = new StorageEvent("storage", {
                key,
                newValue: value,
                oldValue,
                url: document.URL,
                storageArea: localStorage,
            });
            window.dispatchEvent(event);
            oriSetItem.apply(this, arguments);
        },
    });
</script>
```



![storage](//tvax3.sinaimg.cn/large/007c1Ltfgy1h4q8lmrmcxg31fa0xagrk.gif)



### 5.Broadcast Channel（推荐）

- 允许同源的不同浏览器窗口，Tab页，frame或者 iframe 下的不同文档之间相互通信
- 缺点：需要同源

![image](//tva1.sinaimg.cn/mw690/007c1Ltfgy1h4q900qxsbj30ys0er10v.jpg)



`index.html`

```html
<style>
    html,
    body,
    section {
        height: 100%;
    }

    * {
        font-size: 28px;
    }
    section {
        display: flex;
    }

    iframe {
        flex: 1;
        height: 100%;
    }
</style>
</head>
<body>
    <section>
        <iframe src="./page1.html"></iframe>
        <iframe src="./page2.html"></iframe>
    </section>
</body>
```



`page1.html`

```html
<body>
    <h3>Page 1</h3>
    <section style="margin-top: 50px; text-align: center">
        <input id="inputMessage" value="测试消息" />
        <input type="button" value="发送消息" id="btnSend" />
        <section id="messages">
            <p>收到的消息：</p>
        </section>
    </section>

    <script>
        let messagesEle = document.getElementById("messages");
        let messageEl = document.getElementById("inputMessage");
        let btnSend = document.getElementById("btnSend");

        let channel = new BroadcastChannel("channel-BroadcastChannel");
        channel.addEventListener("message", function (ev) {
            let msgEl = document.createElement("p");
            msgEl.innerText = ev.data.date + " " + ev.data.from + ":" + ev.data.message;
            messagesEle.appendChild(msgEl);
        });

        btnSend.addEventListener("click", function () {
            let message = messageEl.value;
            channel.postMessage({
                date: new Date().toLocaleString(),
                message,
                from: "page 1",
            });
        });
    </script>
</body>
```



`page2.html`

```html
<body>
    <h3>Page 2</h3>

    <section style="margin-top: 50px; text-align: center">
        <input id="inputMessage" value="测试消息" />
        <input type="button" value="发送消息" id="btnSend" />
        <section id="messages">
            <p>收到的消息：</p>
        </section>
    </section>

    <script>
        let messagesEle = document.getElementById("messages");
        let messageEl = document.getElementById("inputMessage");
        let btnSend = document.getElementById("btnSend");

        let channel = new BroadcastChannel("channel-BroadcastChannel");
        channel.addEventListener("message", function (ev) {
            let msgEl = document.createElement("p");
            msgEl.innerText = ev.data.date + " " + ev.data.from + ":" + ev.data.message;
            messagesEle.appendChild(msgEl);
        });

        btnSend.addEventListener("click", function () {
            let message = messageEl.value;
            channel.postMessage({
                date: new Date().toLocaleString(),
                message,
                from: "page 2",
            });
        });
    </script>
</body>
```





### 6.MessageChannel

- Channel Messaging API的 MessageChannel 接口允许我们创建一个新的消息通道，并通过它的两个MessagePort属性发送数据
- 缺点：需要先建立联系
- 此方式有点别扭

`index.html`

```html
<body>
    <iframe id="ifr" src="./ifr.html" style="width: 600px; height: 300px"></iframe>

    <div>index.html</div>

    <div>
        <div>Message:</div>
        <div id="messages"></div>
    </div>

    <script>
        const channel = new MessageChannel();

        // iframe加载完成建立联系
        ifr.onload = function () {
            ifr.contentWindow.postMessage("__init__", "*", [channel.port2]);
        };
        // 监听ifr传递过来的消息
        channel.port1.onmessage = onMessage;
        function onMessage(e) {
            messages.innerHTML += `
                  <div>${event.data}</div>
              `;
        }
        // 发送消息
        setInterval(function () {
            channel.port1.postMessage(`message from index.html, ${Date.now()}`);
        }, 3000);
    </script>
</body>
```



`ifr.html`

```html
<body>
    ifr.html
    <div>
        <div>Message:</div>
        <div id="messages"></div>
    </div>
    <script>
        // 监听消息传递
        window.addEventListener("message", function (event) {
            if (event.data === "__init__") {
                initChannel(event.ports[0]);
            }
        });
        function initChannel(port) {
            port.onmessage = function (event) {
                messages.innerHTML += `
                <div>${event.data}</div>  
            `;
                port.postMessage(`message from the iframe, ${Date.now()}`);
            };
        }
    </script>
</body>
```



### 7.SharedWorker

- 这是 Web Worker 之后出来的共享的Worker，不同页面可以共享这个Worker
- 缺点∶兼容性、同源策略

`index.html`

```html
<style>
    html,
    body,
    section {
        height: 100%;
    }

    section {
        display: flex;
    }

    iframe {
        flex: 1;
        height: 100%;
    }
</style>
</head>
<body>
    <section>
        <iframe src="./page1.html"></iframe>
        <iframe src="./page2.html"></iframe>
    </section>
    <script>
        //mdn demo: https://github.com/mdn/simple-shared-worker
    </script>
</body>
```



`page1.html`

```html
<body>
    <h3>Page 1</h3>
    <section style="margin-top: 50px; text-align: center">
        <input id="inputMessage" value="测试消息" />
        <input type="button" value="发送消息" id="btnSend" />
        <section id="messages">
            <p>收到的消息：</p>
        </section>
    </section>

    <script src="./worker.js"></script>
    <script>
        let messagesEle = document.getElementById("messages");
        let messageEl = document.getElementById("inputMessage");
        let btnSend = document.getElementById("btnSend");

        if (!window.SharedWorker) {
            alert("浏览器不支持SharedWorkder!");
        } else {
            let myWorker = new SharedWorker("./worker.js");

            myWorker.port.onmessage = function (e) {
                let msgEl = document.createElement("p");
                let data = e.data;
                msgEl.innerText = data.date + " " + data.from + ":" + data.message;
                messagesEle.appendChild(msgEl);
            };

            btnSend.addEventListener("click", function () {
                let message = messageEl.value;

                myWorker.port.postMessage({
                    date: new Date().toLocaleString(),
                    message,
                    from: "page 1",
                });
            });

            myWorker.port.start();
        }
    </script>
</body>
```



`page2.html`

```html
<body>
    <h3>Page 2</h3>
    <section style="margin-top: 50px; text-align: center">
        <input id="inputMessage" value="测试消息" />
        <input type="button" value="发送消息" id="btnSend" />
        <section id="messages">
            <p>收到的消息：</p>
        </section>
    </section>

    <script src="./worker.js"></script>
    <script>
        let messagesEle = document.getElementById("messages");
        let messageEl = document.getElementById("inputMessage");
        let btnSend = document.getElementById("btnSend");

        if (!window.SharedWorker) {
            alert("浏览器不支持SharedWorkder!");
        } else {
            let myWorker = new SharedWorker("./worker.js");

            myWorker.port.onmessage = function (e) {
                let msgEl = document.createElement("p");
                let data = e.data;
                msgEl.innerText = data.date + " " + data.from + ":" + data.message;
                messagesEle.appendChild(msgEl);
            };

            btnSend.addEventListener("click", function () {
                let message = messageEl.value;

                myWorker.port.postMessage({
                    date: new Date().toLocaleString(),
                    message,
                    from: "page 2",
                });
            });

            myWorker.port.start();
        }
    </script>
</body>
```



`worker.js`

```js
let portList = [];

onconnect = function (e) {
    let port = e.ports[0];
    ensurePorts(port);
    port.onmessage = function (e) {
        let data = e.data;
        disptach(port, data);
    };
    port.start();
};

function ensurePorts(port) {
    if (portList.indexOf(port) < 0) {
        portList.push(port);
    }
}

function disptach(selfPort, data) {
    portList.filter((port) => selfPort !== port).forEach((port) => port.postMessage(data));
}
```

![SharedWorker](//tvax3.sinaimg.cn/large/007c1Ltfgy1h4q9x7hr3pg31xy0xi7a4.gif)



### 总结

| 方法方式           | 是否需要有强关联 | 遵守同源策略 | web worker可用    |
| ------------------ | ---------------- | ------------ | ----------------- |
| WebScoket          |                  |              | √                 |
| 定时器＋客户端存储 |                  | √            | indexedDB         |
| postMessage        | √                |              | 自己的postMessage |
| StorageEvent       |                  | √            | ×                 |
| Broadcast Channel  |                  | √            | √                 |
| MessageChannel     | √                |              | √                 |
| SharedWorker       |                  | √            | √                 |





## 3.location



### url

- host 包含端口号，hostname 返回域名
- 没有端口号的 url，host 和 hostname 相同

![image](//tva2.sinaimg.cn/mw690/007c1Ltfgy1h4rpd7skczj31780hq78c.jpg)



### 修改 location 属性值

- 可使用 location 对应属性替换地址栏对应的值
- 注意：location.origin属性是只读的，存在兼容问题（IE11以下不存在）
- 除hash，修改其他属性值改都会以新 URL 重新加载，并会生成一条新的历史记录在浏览器中
- 修改 pathtname 可以不用传开头/，修改 search 可以不用传？，修改 hash 可以不用传#

```js
window.location.protocol = "https";
window.location.host = "127.0.0.1:5500";
window.location.hostname = "127.0.0.1";
window.location.port = "5500";
window.location.pathname = "test/path";
window.location.search = "wd=ff";
window.location.hash = "/home";
window.location.href = "http://127.0.0.1:5500/liveSeverTest.html";
```



### 访问 location对象方式

- window.location
- document.location
- window.document.location
- location（不推荐）

```js
console.log(window.location);
console.log(window.document.location);
console.log(document.location);
console.log(location);
```



### window.location.reload

- 定义：重新加载当前文档
- 参数: false或者不传，浏览器可能从缓存中读取页面
- 参数:true，强制从服务器重新下载文档





### assign VS href  VS replace

| 属性/方法名 | 增加新纪录 |
| ----------- | ---------- |
| href        | ✔          |
| assign      | ✔          |
| replace     |            |

```html
<div>
    <button type="button" id="btnHref">href</button>
    <button type="button" id="btnAssign">assign</button>
    <button type="button" id="btnReplace">replace</button>
</div>

<script>
    btnHref.onclick = function () {
        window.location.href = "https://juejin.cn";
    };
    btnAssign.onclick = function () {
        window.location.assign("https://juejin.cn");
    };
    btnReplace.onclick = function () {
        window.location.replace("https://juejin.cn");
    };
</script>
```





### window.location.href   VS  window.open

- window.location.href是用新的域名页调换当前页，不会开新窗口
- window.open用来打开新窗口或者查找已命名的窗口，打开新窗口可能会被浏览器拦截



### hash监听方式

- `window.onhashchange = funcRef`
- `window.addEventListener("hashchange", funcRef, false)`

```html
<body>
    <button id="home">#/home</button>
    <button id="detail">#/detail</button>
    <script>
        const homeBtn = document.getElementById("home");
        const detailBtn = document.getElementById("detail");
        homeBtn.addEventListener("click", function () {
            window.location.hash = "home";
        });

        detailBtn.addEventListener("click", function () {
            window.location.hash = "test";
        });

        window.onhashchange = function hashChangeListener(e) {
            console.log("window.onhashchange: onhashchange:");
            console.log("oldUrl:", e.oldURL);
            console.log("newUrl:", e.newURL);
        };

        window.addEventListener(
            "hashchange",
            function hashChangeListener(e) {
                console.log("window.addEventListener: hashchange:");
            },
            false
        );
    </script>
</body>
```



### 动态执行脚本

```html
<body>
    <textarea id="textareaScript" cols="30" rows="20"></textarea>

    <div>
        <button type="button" id="btnCreateScript">创建脚本</button>
    </div>

    <script>
        textareaScript.value = `;(function(){
            console.log("location.href:", location.href)
        })()`;

        btnCreateScript.onclick = function () {
            const scriptEL = document.createElement("script");
            // 使用脚本内容初始化blob最终创建出一个url地址
            const scriptSrc = URL.createObjectURL(new Blob([textareaScript.value]));
            scriptEL.src = scriptSrc;
            document.body.appendChild(scriptEL);
        };
    </script>
</body>
```



### URL.searchParams

```js
const urlObj = new URL(window.location.href);
function getQueryString(key) {
    // 获取地址栏的查询字符串
    return urlObj.searchParams.get(key);
}
```

其他方法属性：

- keys()    返回iterator，此对象包含所有搜索的键名
- values()   返回iterator,此对象包含所有的value
- entries()    返回一个iterator，可以遍历所有的键值对的对象
- set()     设置一个搜索参数新值，原来有多个值将删除其他所有值
- get()     获取指定搜索参数的值
- has()   判断是否有指定的搜索参数
- getAll()   获取指定搜索参数的所有值，返回一个数组
- delete()   从搜索参数列表里删除指定的键和值
- append()  插入一个指定的键/值
- toString()   返回搜索参数组成的字符串
- sort()  按键名排序





### encodeURL  和  encodeURLComponent

- 都是编码URL，唯一的区别在于编码的字符范围不同，encodeURLComponent相对更广

```js
const test1 = ";,/?:@&=+$"; // 保留字符
const test2 = "-_.!~*'()"; // 不转义字符
const test3 = "#"; // 数字标志
const test4 = "ABC abc 123"; // 字母数字字符和空格

console.log("-----------encodeURI------------");

console.log(encodeURI(test1));
console.log(encodeURI(test2));
console.log(encodeURI(test3));
console.log(encodeURI(test4));

console.log("-----------encodeURIComponent------------");

console.log(encodeURIComponent(test1));
console.log(encodeURIComponent(test2));
console.log(encodeURIComponent(test3));
console.log(encodeURIComponent(test4));
```

执行结果如下：

![image](//tva1.sinaimg.cn/mw690/007c1Ltfgy1h4xfo8ccsxj30ml0d178a.jpg)



- 使用场景：
  - 如果要编码整个URL，使用encodeURL 
  - 如果要编码 URL 中的后面的参数，使用 encodeURLComponent 最好

例如 https://www.baidu.com/index.html?go=abc

- https://www.baidu.com/index.html  使用 encodeURL
- go  和 abc  都可以使用 encodeURLComponent 





## 4.navigator（不至于识别设备）



### navigator.userAgent 

- 识别是否微信内置浏览器

```js
//android
//mozilla/5.0 (linux; u; android 4.1.2; zh-cn; mi-one plus build/jzo54k) applewebkit/534.30 (khtml, like gecko) version/4.0 mobile safari/534.30 micromessenger/5.0.1.352

//ios
//mozilla/5.0 (iphone; cpu iphone os 5_1_1 like mac os x) applewebkit/534.46 (khtml, like gecko) mobile/9b206 micromessenger/5.0

function isWX() {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == "micromessenger";
}

if ("serviceWorker" in navigator) {
  // Supported!
}
```

- 解析userAgent的库 : `ua-parser-js`





### navigator.onLine(在线状态)

- 返回 true | false 表示浏览器的在线状态
- 使用：结合 document.ononline 与 document.onoffline 网络变化

```html
<body>
    <div id="net-change"></div>
    <script>
        function netChangeStatus(online) {
            const netChangeEl = document.getElementById("net-change");

            if (online) {
                netChangeEl.innerText = `你是在线状态`;
            } else {
                netChangeEl.innerText = `哥们你掉线了`;
            }
        }
        
        netChangeStatus(navigator.onLine);

        window.addEventListener("online", () => {
            netChangeStatus(true);
        });

        window.addEventListener("offline", () => {
            netChangeStatus(false);
        });
    </script>
```





### navigator.clipboard(剪切板)

- 返回剪切板对象
- 注意∶必须是安全上下文（local，https，wss )
- 注意：window.isSecureContext 检测安全上下文

```html
<button id="btnCopy">复制</button>

<body>
    <script>
        // 需要人为的触发
        function copyToClipboard(textToCopy) {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(textToCopy);
            } else {
                console.log("其他方式复制");
            }
        }

        btnCopy.onclick = function () {
            copyToClipboard("需要拷贝的内容")
                .then(() => console.log("拷贝成功"))
                .catch(() => console.log("拷贝失败"));
        };
    </script>
```





### navigator.cookieEnabled(cookie)

- 返回当前页面是否启用了cookie



### navigator.serviceWorker(Service Worker)

- 返回关联文件的 ServiceWorkerContainer 对象，提供对 ServiceWorker 的注册，删除，升级和通信访问
- 只能在安全上下文使用

应用场景：

- 后台数据同步
- 集中处理计算成本高的数据更新
- 性能增强，用于预获取用户需要的资源





### navigator.mediaDevices（媒体设备）

- 返回一个MdeiaDevices对象，用户获取媒体信息设备
- 应用场景：H5调用摄像头识别二维码，共享屏幕等

获取媒体设备

```js
if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
        console.log("devices==", devices);
    })
        .catch(function (err) {
        console.log(err.name + ": " + err.message);
    });
}
```





共享媒体使用

```html
<body>
    <video id="video" style="height: 800px; width: 800px" autoplay></video>
    <button id="start">开始共享屏幕</button>
    <button id="stop">停止共享屏幕</button>

    <script>
        const mediaOptions = {
            video: {
                cursor: "always",
            },
            audio: false,
        };

        let videoElem = document.getElementById("video");

        document.getElementById("start").addEventListener("click", function () {
            startShareScreen();
        });

        document.getElementById("stop").addEventListener("click", function () {
            stopShareScreen();
        });

        async function startShareScreen() {
            try {
                videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(mediaOptions);
            } catch (err) {
                console.error("Error: " + err);
            }
        }

        function stopShareScreen(evt) {
            let tracks = videoElem.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoElem.srcObject = null;
        }
    </script>
</body>
```



### navigator.storage(存储)

- 返回 StorageManager 对象，用于访问浏览器的整体存储能力
- 注意∶必须安全上下文
- 应用：获取 storage 的存储大小以及可分配大小

```js
navigator.storage.estimate().then(function (estimate) {
  console.log("使用:", estimate.usage);
  console.log("总量:", estimate.quota);
});
```



navigator.sendBeacon（上报数据）

- 作用：通过 httpPost 将少量的数据异步传输到web服务器
- 应用：它主要用于将统计数据发送到 Web 服务器，同时避免了用传统技术（如:XMLHttpRequest ）发送分析数据的一些问题

客户端代码：

```js
function log() {
    let xhr = new XMLHttpRequest();
    xhr.open("post", "http://127.0.0.1:3000/report/xhr", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("xhr=1");
}

function sendBeacon() {
    const data = new FormData();
    data.append("sendB", 2);
    navigator.sendBeacon("http://127.0.0.1:3000/report/bean", data);
}

window.addEventListener("unload", function (event) {
    sendBeacon();
});

window.addEventListener("unload", function (event) {
    log();
});
```



服务端代码：

```js
const express = require("express");

const app = express();

app.use("/report/xhr", function (req, res, next) {
    console.log("收到上报请求, from xhr");
});
app.use("/report/bean", function (req, res, next) {
    console.log("收到上报请求, from bean");
});

app.listen(3000, function () {
    console.log("listening port 3000");
});
```





### navigator.connection（网络信息）-- 实验

- 返回一个NetworkInformation 对象，其包含网络信息
- 应用：获取当前用户的宽带信息，如网络类型，下载速度等



### navigator.permissions（权限对象）-- 实验

- 返回一个 Permissions 对象
- 应用：获取权限信息

```html
<body>
    <button id="btnQuery">查询位置权限</button>
    <button id="btnGetLocation">获取位置信息</button>
    <script>
        btnQuery.onclick = function () {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                if (result.state === "granted") {
                    console.log("位置权限 granted");
                } else if (result.state === "prompt") {
                    console.log("位置权限 prompt");
                }
                console.log("位置权限:", result.state);
            })
                .catch((err) => {
                console.log("err:", err);
            });
        };
        let options = {
            enableHighAccuracy: true,
            timeout: 1200,
            maximumAge: 0,
        };

        btnGetLocation.onclick = function () {
            navigator.geolocation.getCurrentPosition(
                function (pos) {
                    let crd = pos.coords;
                    console.log(`Latitude : ${crd.latitude}`);
                    console.log(`Longitude: ${crd.longitude}`);
                },
                function (err) {
                    console.log("error", err);
                },
                options
            );
        };
    </script>
</body>
```





### navigator.mediaSession（共享媒体信息）-- 实验

- 返回一个 MediaSeeion 对象，用来与浏览器共享媒体信息。比如播放状态，标题，封面等
- 应用：通知栏自定义媒体信息







## 5.history ，网页端的方向盘



### 历史记录本质也是一个栈

![image](//tvax2.sinaimg.cn/mw690/007c1Ltfgy1h4y2ui9dy0j30nb0nvtbn.jpg)





### 旧四样



| API             | 说明                     |
| --------------- | ------------------------ |
| history.back    | 向后移动一页             |
| history.forward | 向前移动一页             |
| history.go      | 向前或者向后移动指定页数 |
| history.length  | 当前会话中的历史页面数   |



#### back & forward & length

- back：会话历史记录中向后移动一页。如果没有上一页，则此方法调用不执行任何操作
- forward：在会话历史中向前移动一页。如果没有下一页，则此方法调用不执行任何操作
- length：返回当前会话中的历史页面数，包含当前页面在内。对于新开一个 tab 加载的页面当前属性返回值



#### go

- 在会话历史中向前或者向后移动指定页数
- 负值表示向后移动，正值表示向前移动
- 如果未向该函数传参或等于0，则该函数与调用 location.reload() 具有相同的效果
- 如果需要移动的页面数，大于可以移动的页面数，不进行任何移动

```html
<body>
    <div>当前:首页</div>
    <div>
        <a href="./page1.html">去page1.html</a><br />
        <a href="./page2.html">去page2.html</a><br />
        <a href="./page3.html">去page3.html</a><br />
    </div>
    <div>历史记录长度:<span id="hlength"></span></div>
    <div>
        <button type="button" onclick="history.back()">Back</button>
        <button type="button" onclick="history.forward()">Forward</button>
        <button type="button" onclick="history.go(1)">Go(1)</button>
        <button type="button" onclick="history.go(2)">Go(2)</button>
        <button type="button" onclick="history.go(-1)">Go(-1)</button>
        <button type="button" onclick="history.go(-2)">Go(-2)</button>
    </div>
    <script>
        hlength.textContent = history.length;
    </script>
</body>
```





### 新四样



| API                  | 说明                                           |
| -------------------- | ---------------------------------------------- |
| history.pushState    | 向当前浏览器会话的历史堆栈中添加一个状态       |
| history.replacestate | 修改当前历史记录状态                           |
| history.state        | 返回在会话栈页的状态值的拷贝                   |
| window.onpopstate    | 当活动历史记录条目更改时，将触发 popstate 事件 |



#### history.pushState

- 语法： history.pushState(state, title[, url])
- 其会增加历史访问记录（即使url为空)，但不会改变页面的内容
- **改变的新的 URL 跟当前的 URL 必须是同源**



#### history.replacestate

- 语法：history.replaceState(stateObj, title,[url])
- **是替换浏览记录栈顶部的记录，不会增加栈的深度**
- 新的URL跟当前的URL必须是同源



#### window.onpopstate

- 当活动历史记录条目更改时，将触发 popstate 事件
- 调用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件
- popstate事件只会在浏览器某些行为下触发，比如点击后退、前进按钮(或者在 JavaScript 中调用history.back()、history.forward()、history.go()方法)
- a标签的锚点也会触发该事件

```html
<body>
    <div>
        state:
        <div id="stateValue"></div>
        <div>历史记录长度:<span id="hlength"></span></div>
    </div>
    <div>
        <br />
        <a href="#index">#index</a><br />
        <button type="button" id="btnPushState">pushState</button><br />
        <button type="button" id="btnReplaceState">replaceState</button><br />
    </div>

    <script>
        let index = 0;
        hlength.textContent = history.length;
        btnPushState.onclick = function (ev) {
            index++;
            history.pushState({ data: "pushState" + index }, "", `/pushState${index}.html`);
            hlength.textContent = history.length;
        };

        btnReplaceState.onclick = function (ev) {
            history.replaceState({ data: "replaceState" }, "", "/replaceState.html");
            hlength.textContent = history.length;
        };

        window.onpopstate = function (ev) {
            console.log("onpopstate trigger");
            stateValue.textContent = JSON.stringify(ev.state);
            hlength.textContent = history.length;
        };
    </script>
</body>
```



- 刷新的时候需要与服务端配合
- 方案：不管我们访问路由是否，服务端都返回同一份index.html

```js
const express = require("express");
const path = require("path");

const app = express();

app.get("*", function (req, res, next) {
  res.sendFile(path.join(__dirname, "./static/index.html"));
});

app.listen(8086, function () {
  console.log("listening on port 8086");
});
```







## 6.从0到1实现一个简易Route



### Vue Router 具备的功能

![image](//tvax4.sinaimg.cn/mw690/007c1Ltfgy1h4y9qgg6dej319l0lwqfl.jpg)



![image](//tvax3.sinaimg.cn/mw690/007c1Ltfgy1h4y9rcw51wj30zj0bg79n.jpg)







### React Router具备的功能

 ![image](//tvax4.sinaimg.cn/mw690/007c1Ltfgy1h4y9sjjnazj310e0jugxr.jpg)





### 思考：一个简单的 Router 应该具备的功能

- 业务组件 & 链接组件
- 路由
- 容器（组件)

