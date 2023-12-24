## 1.前言

> 作为网站应用的开发者或维护者，我们需要时常关注网站当前的健康状况，譬如在主流程运行正常的情况下，各方面性能体验是否满足期望，是否存在改进与提升的空间，如何进行快速且准确的问题定位等，为了满足这些诉求，我们需要进行全面且客观的性能检测

### 性能检测的认知

> 性能检测作为性能优化过程中的一环，它的目的通常是给后续优化工作提供指导方向、参考基线及前后对比的依据
>
> 性能检测并不是一次性执行结束后就完成的工作，它会在检测、记录和改进的迭代过程中不断重复，来协助网站的性能优化不断接近期望的效果
>
> 在展开介绍性能检测的方法和工具之前，我们首先需要破除有关性能的一些错误认知与理解偏差

1. **不要通过单一指标就能衡量网站的性能体验**。这是完全站在用户感知的角度上产生的认知，它只会有主观上的好与差，很难给出切实可行的优化建议。因此我们建议应当从更多维度、更多具体的指标角度来考量网站应用的性能表现，比如页面的首屏渲染时间，不同类型资源的加载次数与速度，缓存的命中率等
2. **不要一次检测就能得到网站性能表现的客观结果**。网站应用的实际性能表现通常是高度可变的，因为它会受到许多因素的影响，比如用户使用的设备状况、当前网络的连接速度等，因此若想通过性能检测来得到较为客观的优化指导，就不能仅依赖一次检测的数据，而需要在不同环境下收集尽量多的数据，然后以此来进行性能分析
3. **不要仅在开发环境中模拟进行性能检测**。在开发环境中模拟进行的性能检测具有许多优势：比如可以很方便地制定当前检测的设备状况与网络速度，可以对检测结果进行重复调试，但因其所能覆盖的场景有限，会很容易陷入“幸存者偏差”，即所发现的问题可能并非实际的性能瓶颈

据此可知，我们若想通过检测来进行有效的性能优化改进，就需要从尽可能多的角度对网站性能表现进行考量，同时保证检测环境的客观多样，能够让分析得出的结果更加贴近真实的性能瓶颈，这无疑会花费大量的时间与精力，所以在进行性能优化之前我们还需要考虑所能投入的优化成本

### 常见的检测工具

- Lighthouse
- WebPageTest
- 浏览器 DevTools
  - 浏览器任务管理器
  - Network 面板
  - Coverage 面板
  - Memory 面板
  - Performance 面板
  - Performance monitor 面板
- 性能监控 API
- 持续的性能监控方案

## 2.使用灯塔 Lighthouse 测试性能

> Lighthouse 直译过来是“灯塔”的意思，它是由 Google 开发并开源的一个 Web 性能测试工具
>
> 该性能检测工具以此命名也蕴涵了相同的含义，即通过监控和检测网站应用的各方面性能表现，来为开发者提供优化用户体验和网站性能的指导建议

### 使用方式

Lighthouse 提供了多种使用方式：

- [在 Chrome DevTools 中使用 Lighthouse](https://github.com/GoogleChrome/lighthouse#using-lighthouse-in-chrome-devtools)
- [使用 Chrome 扩展 ](https://github.com/GoogleChrome/lighthouse#using-the-chrome-extension)
- [使用 Node CLI 命令行工具](https://github.com/GoogleChrome/lighthouse#using-the-node-cli)
- [使用 Node 包](https://github.com/GoogleChrome/lighthouse#using-the-node-module)

### 性能报告

关于性能报告部分的检测结果，Lighthouse 给出的信息包括：检测得分、性能指标、优化建议、诊断结果及已通过的性能，下面来分别进行介绍

#### 检测得分

经过检测，Lighthouse 会对上述五个维度给出一个 0 ～ 100 的评估得分，如果没有分数或得分为 0，则很有可能是检测过程发生了错误，比如网络连接状况异常等；如果得分能达到 90 分以上，则说明网站应用在该方面的评估表现符合最佳实践，如下图所示：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220080703632.png" alt="image-20220220080703632" style="zoom:50%;" />

关于如何得到这个评估得分，Lighthouse 首先会获得关于评估指标的原始性能数据，然后根据指标权重进行加权计算，最后以其数据库中大量的评估结果进行对数正态分布的映射并计算最终得分

- [Lighthouse Scoring calculator (googlechrome.github.io)](https://googlechrome.github.io/lighthouse/scorecalc/)
- [Lighthouse performance scoring (web.dev)](https://web.dev/performance-scoring/)

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220081146125.png" alt="image-20220220081146125" style="zoom:50%;" />

#### 性能指标

关于性能指标有以下六个关键的数据：

![image-20220220081253921](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220081253921.png)

这六个指标在基于用户体验的性能指标中详细说过，

这六种不同的指标数据需要通过加权计算，才能得到关于性能的最终评分，所加的权值越大表示对应指标对性能的影响就越大

并且权重系统还在不断优化过程中，虽然 Lighthouse 对于其中个别指标给予了较大的权重，也就意味着对该指标的优化能够带来更显著的性能评分提升，但这里还要建议在优化的过程中切勿只关注单个指标的优化，而要从整体性能的提升上来考虑优化策略

#### 优化建议

为了方便开发者更快地进行性能优化，Lighthouse 在给出关键性能指标评分的同时，还提供了一些切实可行的优化建议，如下图所示为检测报告中的优化建议：

![image-20220220081551088](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220081551088.png)

这些建议按照优化后预计能带来的提升效果从高到低进行排列，每一项展开又会有更加详细的优化指导建议，从上到下依次包括以下内容：

1. **移除阻塞渲染的资源**，部分 JavaScript 脚本文件和样式表文件可能会阻塞系统对网站页面的首次渲染，建议可将其以内嵌的方式进行引用，并考虑延迟加载。报告会将涉及需要优化的资源文件排列在下面，每个文件还包括尺寸大小信息和优化后预计提升首屏渲染时间的效果，据此可安排资源文件优化的优先级
2. **预连接所要请求的源**，提前建立与所要访问资源之间的网络连接，或者加快域名的解析速度都能有效地提高页面的访问性能。这里给出了两种方案：一种是设置〈link rel="preconnect"〉的预连接，另一种是设置〈link rel="dns-prefetch"〉的 DNS 预解析
3. **降低服务器端响应时间**，通常引起服务器响应缓慢的原因有很多，因此也有许多改进方法：比如升级服务器硬件以拥有更多的内存或 CPU，优化服务器应用程序逻辑以更快地构建出所需的页面或资源，以及优化服务器查询数据库等，不要以为这些可能并非属于前端工程师的工作范围就不去关注，通常 node 服务器转发层就需要前端工程师进行相应的优化
4. **适当调整图片大小**，使用大小合适的图片可节省网络带宽并缩短加载用时，此处的优化建议通常对于本应使用较小尺寸的图片就可满足需求，但却使用了高分辨率的大图，对此进行适当压缩即可
5. **移除未使用的 CSS**，这部分列出了未使用但却被引入的 CSS 文件列表，可以将其删除来降低对网络带宽的消耗，若需要对资源文件的内部代码使用率进行进一步精简删除，则可以使用 Chrome 开发者工具的 Coverage 面板进行分析

#### 诊断结果

这部分 Lighthouse 分别从影响网站页面性能的多个主要维度，进行详细检测和分析得到的一些数据，下面我们来对其进行介绍：

![image-20220220082131267](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220082131267.png)

1. **对静态资源文件使用高效的缓存策略**，这里列出了所有静态资源的文件大小及缓存过期时间，开发者可以根据具体情况进行缓存策略的调整，比如延迟一些静态资源的缓存期限来加快二次访问时的速度

2. **减少主线程的工作**，浏览器渲染进程的主线程通常要处理大量的工作：如解析 HTML 构建 DOM，解析 CSS 样式表文件并应用指定的样式，以及解析和执行 JavaScript 文件，同时还需要处理交互事件，因此渲染进程的主线程过忙很容易导致用户响应延迟的不良体验，Lighthouse 给我们提供了这一环节网站页面主线程对各个任务的执行耗时，让开发者可针对异常处理过程进行有目标的优化
3. **降低 JavaScript 脚本执行时间**，前端项目的逻辑基本都是依托于 JavaScript 执行的，所以 JavaScript 执行效率与耗时也会对页面性能产生不小的影响，通过对这个维度的检测可以发现执行耗时过长的 JavaScript 文件，进而针对性的优化 JavaScript 解析、编译和执行的耗时
4. **避免存在较大尺寸网络资源的请求**，因为如果一个资源文件尺寸较大，那么浏览器就需要等待其完全加载好后，才能进行后续的渲染操作，这就意味着单个文件的尺寸越大其阻塞渲染流程的时间就可能越长，并且网络传输过程中存在丢包的风险，一旦大文件传输失败，重新传输的成本也会很高，所以应当尽量将较大尺寸的资源进行优化，通常一个尺寸较大的代码文件可以通过构建工具打包成多个尺寸较小的代码包；对于图片文件如非必要还是建议在符合视觉要求的前提下尽量进行压缩。可以看出该检测维度列出的大尺寸资源文件，基本都是图片文件
5. **缩短请求深度**，浏览器通常会对同一域名下的并发请求进行限制，超过限制的请求会被暂时挂起，如果请求链的深度过长，则需要加载资源的总尺寸也会越大，这都会对页面渲染性能造成很大影响。因此建议在进行性能检测时，对该维度进行关注和及时优化

#### 已通过的性能

这部分列出的优化项为该网站已通过的性能审核项：

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220082927496.png" alt="image-20220220082927496" style="zoom:50%;" />

1. 延迟加载首屏视窗外的图片，对首屏关键资源加载完毕后，延迟首屏外或处于隐藏状态的图片加载能够有效缩短用户可交互前的等待时间，提升用户访问体验
2. 压缩 CSS 文件，可降低网络负载规模
3. 压缩 JavaScript 文件，可降低网络负载规模
4. 对图片文件采用高效的编码方式，经过编码优化的图片文件，不但其加载速度会更快，而且需要传输的数据规模也会越小
5. 采用新一代的图片文件格式，WebP、JPEG XR、JPEG 2000 等较新的图片文件格式通常比传统的 PNG 或 JPEG 有更好的压缩效果，能够获得更快的下载速度和更少的流量消耗，但使用的同时还需要注意对新格式的兼容性处理
6. 开启文本压缩，对于文本资源，先压缩再提供能够最大限度地减少网络传输的总字节数，常用的压缩方式有 gzip、 deflate 和 brotli，至少采用其中一种即可
7. 避免多次页面重定向，过多的重定向会在网页加载前造成延迟
8. 预加载关键请求，通过 `<link rel="preload">` 来预先获取在网页加载后期需要请求的资源，这主要是为了充分利用网站运行的间歇期
9. 使用视频格式提供动画内容，建议通过 WebM 或 MPEG4 提供动画，来取代网站页面中大型 GIF 的动画
10. 避免 DOM 的规模过大，如果 DOM 规模过大，则可能会导致消耗大量的内存空间、过长的样式计算耗时及较高的页面布局重排代价。Lighthouse 给出的参考建议是，页面包含的 DOM 元素最好少于 1500 个，树的深度尽量控制不要超过 32 层
11. 确保在网页字体加载期间文本内容可见，使用 CSS 的 font-display 功能，来让网站页面中的文本在字体加载期间始终可见

## 3.使用 WebPageTest 测试性能

> [WebPageTest ](https://www.webpagetest.org/) 是一款非常专业的 Web 页面性能分析工具，它可以对检测分析的环境配置进行高度自定义化，内容包括测试节点的物理位置、设备型号、浏览器版本、网络条件和检测次数等，除此之外，它还提供了目标网站应用于竞品之间的性能比较，以及查看网络路由情况等多种维度下的测试工具
>
> 可直接打开 WEBPAGETEST 的主页面，在配置好目标网站应用的网址和检测参数后便可启动测试，等待检测运行结束就能查看详细的测试报告

### 基本使用

参考官方文档的[起步教程](https://docs.webpagetest.org/getting-started/)即可

### 本地部署 WebPageTest 工具

1、安装 Docker
2、拉取镜像

```shell
docker pull webpagetest/server
docker pull webpagetest/agent
```

3、运行实例

```shell
docker run -d -p 4000:80 --rm webpagetest/server

docker run -d -p 4001:80 --network="host" -e "SERVER_URL=http://localhost:4000/work/" -e "LOCATION=Test" webpagetest/agent
```

## 4.使用 Chrome DevTools 测试性能

### 浏览器任务管理器

> 通过 Chrome 任务管理器我们可以查看当前 Chrome 浏览器中，所有进程关于 GPU、网络和内存空间的使用情况，这些进程包括当前打开的各个页签，安装的各种扩展插件，以及 GPU、网络、渲染等浏览器的默认进程，通过监控这些数据，我们可以在有异于其他进程的大幅开销出现时，去定位到可能存在内存泄漏或网络资源加载异常的问题进程

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220084801729.png" alt="image-20220220084801729" style="zoom:50%;" />

### Network 网络分析

> Network 面板是 Chrome 开发者工具中一个经常会被用到的工具面板，通过它可以查看到网站所有资源的请求情况，包括加载时间、尺寸大小、优先级设置及 HTTP 缓存触发情况等信息，从而帮助我们发现可能由于未进行有效压缩而导致资源尺寸过大的问题，或者未合理配置缓存策略导致二次请求加载时间过长的问题等
>
> 参考：https://developer.chrome.com/docs/devtools/network/

#### 查看网络请求信息

![image-20220220084954382](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220084954382.png)

#### 面板设置

![image-20220220085315327](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220085315327.png)

#### 缓存测试

![image-20220220085518662](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220085518662.png)

#### 网络吞吐测试

![image-20220220085614532](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220085614532.png)

#### 网络请求阻止

- 打开方式：Ctrl+ Shift + P 搜索网络请求阻止
- 启用网络请求阻止
- 添加阻止规则

![image-20220220091322483](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220091322483.png)

### Coverage 面板

- 打开方式：Ctrl+ Shift + P 搜索覆盖

![image-20220220091659787](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220091659787.png)

### Memory 面板

> 前端主要使用 JavaScript 代码来处理业务逻辑，所以保证代码在执行过程中内存的良性开销对用户的性能体验来说尤为重要，如果出现内存泄漏，那么就可能会带来网站应用卡顿或崩溃的后果。
>
> 为了更细致和准确地监控网站应用当前的内存使用情况，Chrome 浏览器开发者工具提供了 Memory 面板，通过它可以快速生成当前的堆内存快照，或者查看内存随时间的变化情况。据此我们可以查看并发现可能出现内存泄漏的环节，下图是使用 Memory 面板查看堆内存使用快照的情况

- 打开方式：Ctrl+ Shift + P 内存

![image-20220220092010461](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220092010461.png)

### Performance 面板

> 使用 Performance 面板主要对网站应用的运行时性能表现进行检测与分析，其可检测的内容不仅包括页面的每秒帧数（FPS）、CPU 的消耗情况和各种请求的时间花费，还能查看页面在前 1ms 与后 1ms 之间网络任务的执行情况等内容

- 打开方式：Ctrl+ Shift + P 内存
- 这里建议在 Chrome 浏览器的匿名模式下使用该工具，因为在匿名模式下不会受到既有缓存或其他插件程序等因素的影响，能够给性能检测提供一个相对干净的运行环境

![image-20220220093058884](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220093058884.png)

Performance 面板中常用的是图中标出的三个按钮。通常当我们需要检测一段时间内的性能状况时，可单击两次“启动/停止检测”按钮来设置起止时间点，当单击第二次按钮停止检测后，相应的检测信息便出现在控制面板下方的区域

图中的“启动检测并刷新页面”按钮用来检测页面刷新过程中的性能表现，单击它会首先清空目前已有的检测记录，然后启动检测刷新页面，当页面全部加载完成后自动停止检测

打开测试示例：https://googlechrome.github.io/devtools-samples/jank/

#### 面板信息

![image-20220220093203842](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220093203842.png)

##### 控制面板

1. Screenshots：表示是否截取每一帧的屏幕截图，默认会勾选，并且在概览面板中展示随时间变化的每帧截屏画面，如果取消勾选，则不会在概览面板中展示这部分内容
2. Memory：表示是否记录内存消耗，默认不会勾选，如果勾选则会在线程面板与统计面板之间展示出各种类型资源的内存消耗曲线

![image-20220220093333274](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220093333274.png)

3. 网页指标：表示是否展示性能指标信息，默认不会勾选，如果勾选则会在网络和 Frames 之间展示出核心指标的节点状态

![image-20220220093529447](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220093529447.png)

4. Disable javaScript samples：如果勾选则表示关闭 JavaScript 示例，减少在手机端运行时的开销，若要模拟手机端的运行环境时则需要勾选
5. Enable advanced paint instrumentation（slow）：如果选中则表示开启加速渲染工具，用来记录渲染事件的相关细节。因为该功能比较消耗性能，所以开启后重新生成检测报告的速度会变慢
6. Network：在性能检测时，用以切换模拟网络环境
7. CPU：限制 CPU 处理速度，主要用于模拟低速 CPU 运行时的性能

##### 概览面板

> 在概览面板的时间轴上，可以通过选择一个起始时间点，然后按住鼠标左键滑动选择面板中的局部范围，来进行更小范围内的性能观察
>
> 这部分可观察的性能信息包括：FPS、CPU 开销和网络请求时间。对每秒帧数而言，尽量保持在 60FPS 才能让动画有比较流畅的视觉体验
>
> 对 CPU 开销而言，不仅可以在整个检测时间轴上以曲线的形式观察 CPU 处理任务所花费时间的变化情况，同时还可以在统计面板中查看当前选中时间区域里各个任务花费时间的占比，其中占比较大的部分就有可能存在性能问题，可以进一步检测与分析
>
> 对网络请求时间而言，概览面板提供的信息可能不够清晰，这里建议在线程面板的 Network 部分中具体查看，比如时间轴上每个请求的耗时及起止时间点都会更加清楚，从而方便开发者发现响应过长的网络请求并进行优化

![image-20220220094248476](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220094248476.png)

##### 线程面板

> 这部分最主要的信息即为主线程执行过程的火焰图，主线程在解析 HTML 和 CSS、页面绘制及执行 JavaScript 的过程中，每个事件调用堆栈和耗时的情况都会反映在这张图上，其中每一个长条都代表了一个事件，将鼠标悬浮其上的时候可以查看到相应事件的执行耗时与事件名。
>
> 这个火焰图的横轴表示执行时间，纵轴表示调用栈的情况，上面的事件会调用下面的事件，越往下事件数量越少，所以火焰图是倒立的形式

![image-20220220094420215](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220094420215.png)

火焰图中的事件会以不同颜色进行标注，常见的事件类型有以下几种：HTML 解析、JavaScript 事件（例如鼠标单击、滚动等）、页面布局更改、元素样式重新计算及页面图层的绘制。了解并熟知这些事件的执行情况，有助于发现潜在的性能问题

##### 统计面板

> 统计面板会根据在概览面板中选择时间区域的不同，绘制出不同类型任务执行耗时的可视化图标，统计面板中包含四个页签

其中 Summary 页签中会展示各类任务事件耗时的环形图：

![image-20220220094533626](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220094533626.png)

Bottom-Up 页签中可以查看各个事件耗费时间的排序列表，列表会包含两个维度：去除子事件后该事件本身的耗时和包含子事件从开始到结束的总耗时：

![image-20220220094609233](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220094609233.png)

Call Tree 页签中可以查看全部或指定火焰图中某个事件的调用栈，如下图所示：

![image-20220220094633548](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220094633548.png)

Event Log 页签中可查看关于每个事件的详细日志信息，如图下图所示：

![image-20220220094659685](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220094659685.png)

### 保存测试记录

![image-20220220094741772](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220094741772.png)

### FPS 计数器

- 另一个非常方便的工具是 FPS 计数，可在页面运行时提供对 FPS 的实时估计
- Control+Shift+P 搜索 FPS

![image-20220220094913392](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220094913392.png)

### Performance monitor

> 虽然使用 Performance 面板来进行检测能够得到较为全面的性能数据，但依然存在两个使用上的问题，即面板信息不够直观和数据的实时性不够强
>
> 为了弥补这两方面的不足，Chrome 从 64 版本开始便在开发者工具中引入了 Performance monitor 面板，通过它让我们可以实时监控网站应用运行过程中，诸如 CPU 占用率、JavaScript 内存使用大小、内存中挂的 DOM 节点数、JavaScript 事件监听次数及页面发生重绘与重排的处理时间等信息
>
> 据此如果我们发现，当与页面的交互过程中出现某项指标有较为陡峭的增长，就意味着可能有影响性能体验的风险存在

![image-20220220095111370](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220220095111370.png)

如图所示为 Performance monitor 面板，图中出现的明显波动是执行刷新页面操作所产生的，可观察到 JavaScript 堆内存大小与 DOM 节点数的指标都有一个明显的断崖式下跌，这正是刷新操作清除了原有 DOM 节点后，还未重新渲染出新节点的时间点

### 参考链接

- https://docs.microsoft.com/zh-cn/microsoft-edge/devtools-guide-chromium/evaluate-performance/
- https://developer.chrome.com/docs/devtools/evaluate-performance/

## 5.性能监控

- [[WEB\] 前端性能监控开源方案 - 简书 (jianshu.com)](https://www.jianshu.com/p/a87c2e84bd56)
- [如何进行 web 性能监控？ | AlloyTeam](http://www.alloyteam.com/2020/01/14184/)
- [前端性能监控实践 - 掘金 (juejin.cn)](https://juejin.cn/post/6844904094616780813)
- [前端性能监控及推荐几个开源的监控系统 - 云+社区 - 腾讯云 (tencent.com)](https://cloud.tencent.com/developer/news/682347)
- [蚂蚁金服如何把前端性能监控做到极致?-InfoQ](https://www.infoq.cn/article/dxa8am44oz*lukk5ufhy)
- [你是如何搭建 Web 前端性能监控系统的？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/37585246)
