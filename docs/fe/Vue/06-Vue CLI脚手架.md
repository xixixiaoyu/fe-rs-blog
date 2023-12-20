## 1.Vue CLI 脚手架介绍

> 我们之前已经可以通过 webpack 来配置 Vue 的开发环境
>
> 但是真实项目，我们往往会使用脚手架来创建项目
>
> 脚手架其实是建筑工程中的一个概念，在我们软件工程中也会将一些帮助我们搭建项目的工具称之为脚手架
>
> Vue 的脚手架就是 `Vue CLI`
>
> - CLI 是`Command-Line Interface`，翻译为命令行界面
> - 我们可以通过 CLI 选择项目的配置和创建出我们的项目
> - Vue CLI 已经内置了 webpack 相关的配置，我们不需要从零来配置

## 2.Vue CLI 安装和使用

全局安装，这样在电脑任何位置都可以通过 vue 的命令来创建项目

```shell
npm install @vue/cli -g
```

旧版本 cli 升级

```shell
npm update @vue/cli -g
```

创建项目

```
vue create 项目的名称
```

## 3.vue create 项目的过程

![image-20220131003815116](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220131003815116.png)

![image-20220131003837061](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220131003837061.png)

![image-20220131003905436](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220131003905436.png)

![image-20220131003927349](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220131003927349.png)

## 4.项目的目录结构

```js
├── node_modules: 项目依赖
├── public
│   ├── favicon.ico: 页签图标
│   └── index.html: 主页面
├── src
│   ├── assets: 存放静态资源
│   │   └── logo.png
│   │── component: 存放组件
│   │   └── HelloWorld.vue
│   │── App.vue: 汇总所有组件
│   │── main.js: 入口文件
├── .gitignore: git版本管制忽略的配置
├── babel.config.js: babel的配置文件
├── package.json: 应用包配置文件
├── README.md: 应用描述文件
├── package-lock.json：包版本控制文件
```

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220131004621690.png" alt="image-20220131004621690" style="zoom:67%;" />

## 5.Vue CLI 的运行原理

![image-20220131004800138](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220131004800138.png)
