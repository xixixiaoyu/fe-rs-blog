## 1.流行的开源React UI组件库

### material-ui(国外)

1. 官网: [http://www.material-ui.com/#/](https://github.com/xixixiaoyu/front-end-notes/blob/810d3d6c45b1f41a1d5a26de42c38105ab03b239/前端框架/React/React.md#/)
2. github: https://github.com/callemall/material-ui

### ant-design(国内蚂蚁金服)

1. 官网: https://ant.design/index-cn
2. Github: https://github.com/ant-design/ant-design/



## 2.Antd 组件基本使用

使用 `Antd` 组件非常的简单，引入，暴露，使用。

首先我们通过组件库来实现一个简单的按钮

1. 安装`antd`包  `yarn add antd`
2. 在我们需要使用的文件下引入

```jsx
import { Button } from 'antd'
```

3. 愉快的使用

```jsx
<div>
    <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="dashed">Dashed Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
</div>
```

但是你会发现这些按钮少了样式，我们还需要引入 `antd` 的 CSS 文件

```jsx
@import '/node_modules/antd/dist/antd.less';
```



## 3.自定义主题颜色+按需引入

1. 安装依赖：yarn add react-app-rewired customize-cra babel-plugin-import less less-loader
2. 修改package.json

```json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
},
```

1. 根目录下创建config-overrides.js

```js
//配置具体的修改规则
const { override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        lessOptions:{
            javascriptEnabled: true,
            modifyVars: { '@primary-color': 'green' },
        }
    }),
);
```

4. 备注：不用在组件里亲自引入样式了，即：import 'antd/dist/antd.css'应该删掉



在 `antd` 最新版中，引入了 `craco` 库，我们可以使用 `craco` 来实现自定义颜色的效果

1. 安装 craco：`yarn add @craco/craco`
2. 更改 `package.json` 中的启动文件

```json
"scripts": {
  "start": "craco start",
  "build": "craco build",
  "test": "craco test",
  "eject": "react-scripts eject"
},
```

3. 在根目录下新建一个 `craco.config.js` 文件，用于配置自定义内容

```js
const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': 'skyblue' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
```

`antd` 组件是采用 `less` 编写的，我们需要通过重新配置的方式去更改它的值

```json
@import '/node_modules/antd/dist/antd.less';
```

