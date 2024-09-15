对于一些不是由用户直接触发的事件，例如元素从不可见到可见、元素大小的改变、元素的属性和子节点的修改等。

我们可以使用浏览器提供的 5 种 Observer 来监听这些变动：MutationObserver、IntersectionObserver、PerformanceObserver、ResizeObserver、ReportingObserver

## IntersectionObserver

用于监听元素与可视区域的交叉状态，例如元素从不可见到可见，或者从可见到不可见。

```React TSX
import './App.css';
import { useEffect, useRef } from 'react';

function App() {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);

  useEffect(() => {
    // 创建 IntersectionObserver 对象，用于监听元素与视口的交叉情况
    const intersectionObserver = new IntersectionObserver(
      // 当元素的可见性变化时，会调用此函数
      entries => {
        // 遍历所有被观察的元素
        entries.forEach(item => {
          // 打印每个元素及其可见部分的比例
          console.log(item.target, item.intersectionRatio);
        });
      },
      // 配置对象，设置观察器的阈值
      {
        threshold: [0.5, 1] // 当元素可见面积达到 50% 和 100% 时触发回调
      }
    );

    if (box1Ref.current) {
      intersectionObserver.observe(box1Ref.current);
    }
    if (box2Ref.current) {
      intersectionObserver.observe(box2Ref.current);
    }

    return () => {
      if (box1Ref.current) {
        intersectionObserver.unobserve(box1Ref.current);
      }
      if (box2Ref.current) {
        intersectionObserver.unobserve(box2Ref.current);
      }
    };
  }, []);

  return (
    <>
      <div className="box1" ref={box1Ref}>
        box1
      </div>
      <div className="box2" ref={box2Ref}>
        box2
      </div>
    </>
  );
}

export default App;
```

css 如下：

```css
.box1, .box2 {
  position: relative;
  width: 100px;
  height: 100px;
  background: pink;
}

.box1 {
  top: 400px;
}

.box2 {
  top: 800px;
}
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717061664475-8764dd7b-839e-44f7-8909-d11e6ff0eccc.png#averageHue=%23fafafa&clientId=ud35555b0-d68c-4&from=paste&height=915&id=u4e5373e7&originHeight=915&originWidth=993&originalType=binary&ratio=1&rotation=0&showTitle=false&size=52219&status=done&style=none&taskId=u067e3eb8-bf9c-44ad-85cd-4e320b6cb64&title=&width=993)

**用途：**

- 数据采集：确定某个元素是否可见以及何时可见。
- 懒加载：当元素可见比例达到某个阈值时触发加载。

## MutationObserver

用于监听 DOM 元素的属性和子节点的变化：

```React TSX
import { useEffect, useRef } from 'react';
import './App.css';

const BoxComponent = () => {
  // 使用 useRef 创建一个 ref 来引用 div 元素
  const boxRef = useRef(null);

  useEffect(() => {
    // 设置背景为红色，延时 2000ms
    const timer1 = setTimeout(() => {
      if (boxRef.current) {
        boxRef.current.style.background = 'green';
      }
    }, 2000);

    // 创建并添加按钮，延时 3000ms
    const timer2 = setTimeout(() => {
      if (boxRef.current) {
        const dom = document.createElement('button');
        dom.textContent = '云牧';
        boxRef.current.appendChild(dom);
      }
    }, 3000);

    // 移除第一个按钮，延时 4000ms
    const timer3 = setTimeout(() => {
      if (boxRef.current) {
        const button = boxRef.current.querySelector('button');
        if (button) {
          button.remove();
        }
      }
    }, 4000);

    // 使用 MutationObserver 监听 DOM 变化
    const mutationObserver = new MutationObserver(mutationsList => {
      console.log('mutationsList', mutationsList);
    });

    if (boxRef.current) {
      mutationObserver.observe(boxRef.current, {
        attributes: true,
        childList: true
      });
    }

    // 组件卸载时清理定时器和观察者
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      mutationObserver.disconnect();
    };
  }, []);

  return <div ref={boxRef} className="box"></div>;
};

export default BoxComponent;
```

css 如下：

```css
.box {
  position: relative;
  width: 100px;
  height: 100px;
  background: pink;
}
```

一共触发了三次打印：


![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1717075803729-f90f6f02-1b32-4f5d-ba0c-d60fcf033f7c.png#averageHue=%23f9f9f9&clientId=u14546d31-4d75-4&from=paste&height=579&id=u32fb08a4&originHeight=579&originWidth=795&originalType=binary&ratio=1&rotation=0&showTitle=false&size=25838&status=done&style=none&taskId=ud978570d-143d-4edc-8caf-35f9d431796&title=&width=795)


**用途：**

- **防止水印被移除：例如 antd 的 Watermark 组件，通过监听水印节点的变化重新渲染水印。**
- **动态内容更新：检测并响应 DOM 的动态变化。**

## ResizeObserver

用于监听元素尺寸的变化：

```React TSX
import { useEffect, useRef } from 'react';

const Box = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;

    setTimeout(() => {
      if (box) {
        box.style.width = '200px';
      }
    }, 2000);

    const resizeObserver = new ResizeObserver(entries => {
      console.log('当前大小', entries);
    });

    if (box) {
      resizeObserver.observe(box);
    }

    return () => {
      if (box) {
        resizeObserver.unobserve(box);
      }
    };
  }, []);

  return (
    <div
      ref={boxRef}
      style={{
        width: '100px',
        height: '100px',
        background: 'lightgreen'
      }}
    ></div>
  );
};

export default Box;
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1719833581394-af2b2750-4548-4ba2-ac07-d0a95109a880.png#averageHue=%2390ee90&clientId=u27406dd5-1fe1-4&from=paste&height=276&id=ud72a9029&originHeight=304&originWidth=1667&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=48262&status=done&style=none&taskId=u38612d52-69ae-43fe-9739-e71c0ddd66f&title=&width=1515.4545126079536)

## PerformanceObserver

PerformanceObserver 用于监听记录 performance 数据的行为，例如时间点、时间段、资源加载耗时等。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PerformanceObserver Example</title>
  </head>
  <body>
    <button onclick="measureClick()">Measure</button>
    <img
      src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/mirror-assets/168e0858b6ccfd57fe5~tplv-t2oaga2asx-jj-mark:125:125:0:0:q75.avis"
    />
    <script>
      //  创建一个PerformanceObserver实例，用于观察性能事件
      const performanceObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          console.log(entry); // 上报
        });
      });

      // 开始观察资源、标记和度量三种类型的性能条目
      performanceObserver.observe({ entryTypes: ['resource', 'mark', 'measure'] });

      // 在代码执行到此处时，标记一个性能事件
      performance.mark('registered-observer');

      /**
       * 当按钮被点击时，测量一个性能事件
       * 该函数无参数和返回值
       */
      function measureClick() {
        //  测量从按钮被点击到measure调用之间的时间
        performance.measure('button clicked');
      }
    </script>
  </body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1719887063209-1e068204-a084-408f-ae5d-2bae129b1dce.png#averageHue=%23f0f3ee&clientId=u0abc893c-ed6d-4&from=paste&height=585&id=u45c65c35&originHeight=643&originWidth=1888&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=146847&status=done&style=none&taskId=u62d1625d-721e-4a57-ab3e-b3381beaba5&title=&width=1716.3635991624571)

## ReportingObserver

ReportingObserver 用于监听浏览器打印的过时 API 和干预报告：

```javascript
const reportingObserver = new ReportingObserver((reports, observer) => {
    for (const report of reports) {
        console.log(report.body); // 上报
    }
}, { types: ['intervention', 'deprecation'] });

reportingObserver.observe();
```