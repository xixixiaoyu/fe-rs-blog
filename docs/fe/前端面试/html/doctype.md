DOCTYPE 是 HTML 文件开头的文档类型声明，你可以把它理解为浏览器解读网页的「说明书」。

它主要有两个核心作用：

1. **触发标准模式**：现代浏览器会根据 DOCTYPE 决定用哪种模式渲染页面。比如 `<!DOCTYPE html>` 会让浏览器使用最新的 HTML5 标准模式，避免老旧的「怪异模式」导致布局错乱

2. **版本标识**：明确告诉浏览器当前文档遵循的 HTML 规范版本。例如早期 HTML4 的写法是：
```html
<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'>
```
而 HTML5 简化成了：
```html
<!DOCTYPE html>
```

实际工作中最常见的情况是：如果忘记写 DOCTYPE，页面可能会在 IE 等浏览器中出现盒模型计算错误、浮动布局异常等问题。举个真实案例：曾经有同事漏写声明导致页面在 IE 下宽度溢出 20px，加上 `<!DOCTYPE html>` 后立即恢复正常。

现代开发直接使用 HTML5 的极简声明即可，既兼容所有现代浏览器，又能确保页面按最新标准渲染。