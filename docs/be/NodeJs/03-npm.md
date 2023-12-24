## NPM

### 1. Node.js软件包

> 每一个基于 Node.js 平台开发的应用程序都是 Node.js 软件包。
>
> 所有 Node.js 软件包都被托管在 www.npmjs.com 中。





### 2. 什么是 NPM

> 全称：Node Package Manager , Node .js的软件包管理器，也是一个应用程序，Node.js 环境中的软件包管理器。
>
> 它可以将 Node 软件包添加到我们的应用程序中并对其进行管理，比如下载，删除，更新，查看版本等。
>
> 它没有用户界面，需要在命令行工具中通过命令的方式使用，对应的命令就是 npm。
>
> NPM 和 Node 是两个独立的应用程序，只是被捆绑安装了，可以通过版本号证明。
>
> Node.js 的包基本遵循 CommonJS 规范，将一组相关的模块组合在一起，形成一个完整的工具



### 3. package.json

> Node.js 规定在每一个软件包中都必须包含一个叫做 package.json 的文件。
>
> 它是应用程序的描述文件，包含和应用程序相关的信息，比如应用名称，应用版本，应用作者等等。 
>
> 通过 package.json 文件可以方便管理应用和发布应用。 
>
> 查看 npm 的版本 `npm -v `
>
> 创建 package.json 文件: `npm init` 
>
> 快速创建 package.json 文件: `npm init --yes`

运行后会创建 package.json 文件             

```json
{
  "name": "1-npm",      #包的名字
  "version": "1.0.0",   #包的版本
  "description": "",    #包的描述
  "main": "index.js",   #包的入口文件
  "scripts": {			#脚本配置
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",			#作者
  "license": "ISC"		#版权声明
}
```

> 注意生成的包名不能使用中文，大写 ！！



关于开源证书扩展阅读

<http://www.ruanyifeng.com/blog/2011/05/how_to_choose_free_software_licenses.html>



### 4.  下载Node.js软件包

> 一般在搜索工具包的时候，会到 https://npmjs.org 搜索
>
> 在应用程序的根目录执行命令： `npm install 包名`  或者 `npm i  包名`

`npm install lodash`软件包下载完成后会发生三件事：

1. 软件包会被存储在 node_modules 文件夹中，如果在应用中不存在此文件夹，npm 会自动创建。
2. 软件包会被记录在 package.json 文件中. 包含软件包的名字以及版本号。
3. npm 会在应用中创建 package-lock.json 文件, 用于记录软件包及软件包的依赖包的下载地址及版本。

#### 安装工具包

```sh
npm install jquery
npm i jquery

# 安装并在 package.json 中保存包的信息(dependencies 属性 生产依赖)
npm install jquery --save
npm install jquery -S

# 安装并在 package.json 中保存包的信息(devDependencies 属性  开发依赖)
npm install babel --save-dev
npm install babel -D
```

>  6 版本的 npm ，安装包时会自动保存在 dependencies 中，可以不用写 --save



#### 本地安装和全局安装

> 本地安装：将软件包下载到应用根目录下的 `node_modules` 文件夹中，软件包只能在当前应用中 使用。
>
> 全局安装：将软件包下载到操作系统的指定目录中，可以在任何应用中使用。
>
> 全局安装一般用于安装全局工具，如 `cnpm`，`yarn`，`webpack` ，`gulp`等，全局命令的安装位置
>
> 通过 -g 选项将软件包安装到全局： `npm install <pkg>  -g`
>
> 查看全局软件包安装位置： `npm root -g`
>
> 删除全局中的软件包: `npm un npm-check-updates -g`
>
> 查看全局中安装了哪些软件包: `npm list -g --depth 0`
>
> 查看全局中有哪些过期软件包: `npm outdated -g`

```
C:\Users\你的用户名\AppData\Roaming\npm
```



#### nodemon

> 问题：在 node 环境中每次修改 JavaScript 文件后都需要重新执行该文件才能看到效果。
>
> 通过 nodemon 可以解决此烦恼，它是命令工具软件包，可以监控文件变化，自动重新执行文件。
>
> `npm install nodemon@2.0.7 -g`



#### npm-check-updates 强制更新

> npm-check-updates 可以查看应用中有哪些软件包过期了，可以强制更新 package.json 文件中 软件包版本
>
> 将 npm-check-updates 安装到全局： `npm install npm-check-updates -g`
>
>  查看过期软件包： `npm-check-updates`
>
> 更新 package.json： `ncu -u`



### 5. 使用 Node.js 软件包

> 在引入第三方软件包时，在 require 方法中不需要加入路径信息，只需要使用软件包的名字即可， require 方法会自动去 node_modules 文件夹中进行查找。

```js
const _ = require("lodash")
const array = ["a", "b", "c", "d"]
// chunk 对数组中的元素进行分组
// 参数一表示要进行操作的数组
// 参数二表示每一组中包含的元素个数
console.log(_.chunk(array, 2)) // [ [ 'a', 'b' ], [ 'c', 'd' ] ]
```



### 6. 软件包依赖问题说明

1. 比如在我的应用中要依赖 mongoose 软件包，于是我下载了它，但是在 node_modules 文件夹中 除了包含 mongoose 以外还多出了很多其他软件包，为什么会多出这么多软件包呢？ 

> 实际上它们又是 mongoose 依赖的软件包。

2. 为什么 mongoose 依赖的软件包不放在 mongoose 文件夹中呢？

> 在早期的 npm 版本中, 某个软件包依赖的其他软件包都会被放置在该软件包内部的 node_modules 文件夹中，但是这样做存在两个问题，第一个问题是很多软件包都会有相同的依 赖，导致开发者在一个项目中会下载很多重复的软件包，比如 A 依赖 X，B 依赖 X，C 依赖 X，在 这种情况下 X 就会被重复下载三次。第二个问题是文件夹嵌套层次太深，导致文件夹在 windows 系统中不能被直接删除。比如 A 依赖 B, B 依赖 C, C 依赖 D ... , 就会发生文件夹依次嵌套的情况。

3. 所有的软件包都放置在 node_modules 文件夹中不会导致软件包的版本冲突吗？

> 在目前的 npm 版本中，所有的软件包都会被直接放置在应用根目录的 node_modules 文件夹中， 这样虽然解决了文件夹嵌套层次过深和重复下载软件包的问题，但如果只这样做肯定会导致软件包版本冲突的问题，如何解决呢？ 比如 A 依赖 X 的 1 版本，B 依赖 X 的 2 版本，如果你先下载的是 A，那么 A 依赖的 X 会被放置在 根目录的 node_modules 文件夹中, 当下载 B 时，由于在根目录中已经存在 X 并且版本不一致，那 么 B 依赖的 X 就会被放置在 B 软件包中的 node_module 文件夹中，通过此方式解决软件包版本冲突的问题。

4. node_modules 文件夹中的软件包都需要提交到 git 仓库中吗？

> 在 node_modules 文件夹中有很多软件包，随着应用程序的增长，软件包也会越来越多，甚至会 达到几百兆。
>
>  当我们将应用提交到版本库时，我们不想提交它，因为它们不是我们应用中的源代码，而且由于碎文件比较多，其他人在检出代码时需要等待的时间会很久。当其他人拿到应用程序时没有依赖软件包应用程序是运行不起来的，如何解决呢?
>
> 实际上应用程序依赖了哪些软件包在 package.json 文件中都会有记录，其他人可以通过 `npm install` 命令重新下载它们。为了保持下载版本一致，npm 还会根据 package-lock.json 文件中 的记录的地址进行下载。
>
>  将应用程序提交到版本库之前，将 node_modules 文件夹添加到 .gitignore 文件中。



### 7. 语义版本控制

1.版本号规范 

`Major Version 主要版本` ：添加新功能 (破坏现有 API) -> 6.0.0 

`Minor version 次要版本` ：添加新功能 (不会破坏现有 API, 在现有 API 的基础上进行添加) -> 5.13.0 

`Patch version 补丁版本` ：用于修复 bug -> 5.12.6 2. 



版本格式：主版本号.次版本号.修订号

* "^3.0.0" ：锁定主版本，以后安装包的时候，保证包是3.x.x版本，x默认取最新的。
* "~3.2.x" ：锁定小版本，以后安装包的时候，保证包是3.1.x版本，x默认取最新的。
* "3.1.1" ： 锁定完整版本，以后安装包的时候，保证包必须是3.1.1版本。





2.版本号更新规范

^5.12.5: 主要版本不变，更新次要版本和补丁版本 

~5.12.5: 主要版本和次要版本不变，更新补丁版本

 5.12.5: 使用确切版本，即主要版本，次要版本，补丁版本固定



### 8. 查看软件包实际版本

> 当过了一段时间以后，其他人从版本库中下载了你的应用程序，并通过 npm install 命令恢复了应用 程序的依赖软件包，但是此时应用程序的依赖软件包版本可能会发生变化，而应用程序的 package.json 文件中记录的只是大致版本，如何查看依赖软件包的具体版本呢？
>
> 方式一：在 node_modules 文件夹中找到对应的依赖软件包，找到它的 package.json 文件，可以在这 个文件中的 version 字段中找到它的具体版本。
>
> 方式二：通过 npm list 命令查看所有依赖软件包的具体版本， --depth 选项指定查看依赖包的层级。





### 9.  查看软件包元数据

```nginx
npm view mongoose
npm view mongoose versions
npm view mongoose dist-tags dependencies
```



### 10. 下载特定版本的软件包

```js
npm i <pkg>@<version>
npm i mongoose@2.4.2 lodash@4.7.0
```

```nginx
cat package.json
npm list --depth 0
```



### 11.  删除软件包

```nginx
npm uninstall <pkg>
npm uninstall mongoose
npm un mongoose
```



### 12. 更新软件包

> 通过 `npm outdated` 命令可以查看哪些软件包已经过期，对应的新版本是什么。 
>
> 通过 `npm update` 更新过期的软件包，更新操作遵循语义版本控制规则。





### 13. 项目依赖 VS 开发依赖

> 项目依赖：无论在开发环境还是线上环境只要程序在运行的过程中需要使用的软件包就是项目依赖。比如 lodash，mongoose。 
>
> 开发依赖：在应用开发阶段使用，在生产环境中不需要使用的软件包，比如 TypeScript 中的类型声明文件。 
>
> 在 package.json 文件中, 项目依赖和开发依赖要分别记录，项目依赖被记录在 dependencies 对象 中，开发依赖被记录在 devDependencies 中，使开发者可以在不同的环境中下载不同的依赖软件包。 
>
> 根据 package.json 中的依赖声明， 安装工具包
>
> 在下载开发依赖时，要在命令的后面加上 --save-dev 选项或者 -D 选项。 `npm i eslint -D `
>
> 在开发坏境中下载所有依赖软件包:  ` npm install` 或 `npm i`
>
>  在生产环境中只下载项目依赖软件包: `npm install --prod`



### 14. 使用流程

团队开发时使用流程

1. 从仓库中拉取仓库代码
2. 运行` npm install `安装相关依赖
3. 运行项目，继续开发

> 注意：在.gitignore文件保证配置了忽略 /node_modules 

### 15. 发布npm包



创建自己的 NPM 包可以帮助代码进行迭代进化，使用步骤也比较简单

0. 修改为官方的地址 (  npm config set registry https://registry.npmjs.org/ )

1. 创建文件夹，并创建文件 index.js， 在文件中声明函数，使用 module.exports 暴露
2. npm 初始化工具包，package.json 填写包的信息
3. 账号注册（激活账号）,完成邮箱验证
4. 命令行下 `npm login` 填写相关用户信息 (一定要在包的文件夹下运行)
5. 命令行下`npm publish` 提交包 👌

> npm 有垃圾检测机制，如果名字简单或做测试提交，很可能会被拒绝提交
>
> 可以尝试改一下包的名称来解决这个问题

升级 NPM 包，需要修改 package.json 中的版本号修改，只需要执行『npm publish』就可以能提交

1. 修改包代码
2. 修改 package.json 中版本号
3. npm publish 提交



### 16. 撤销已发布的软件包

1. 只有在发布软件包的24小时内才允许撤销
2.  软件包撤销后 24 小时以后才能重新发布
3.  重新发布时需要修改包名称和版本号 

```nginx
npm unpublish 包名 --force
```



###  17. 更改 npm 镜像地址

由于 npmjs.com 是国外的网站，大多数时候下载软件包的速度会比较慢，如何解决呢？

> 可以通过配置的方式更改 npm 工具的下载地址。 
>
> 1.获取 npm 配置  `npm config list -l --json  `
>
> ​                            -l 列表所有默认配置选项   --json 以 json 格式显示配置选项 
>
> 2.设置 npm 配置 
>
> 获取 npm 下载地址： npm config get registry 
>
> 获取 npm 用户配置文件: npm config get userconfig 
>
> 3.更改 npm 镜像地址
>
> 淘宝镜像 : `npm config set registry https://registry.npm.taobao.org`
>
> 官方镜像 : `npm config set registry https://registry.npmjs.org/`
>
> 在发布工具的时候, 一定要将仓库地址, 修改为官方的地址





### 18. npx 命令

npx 是 npm 软件包提供的命令，它是 Node.js 平台下软件包执行器。主要用途有两个，第一个是临时 安装软件包执行后删除它，第二个是执行本地安装的提供命令的软件包。

1.临时安装软件包执行后删除软件包

有些提供命令的软件包使用的频率并不高，比如 create-react-app 脚手架工具，我能不能临时下载 使用，然后再删掉它。

```
npx create-react-app react-test
```

2.执行本地安装的软件包

现在有两个项目都依赖了某个命令工具软件包，但是项目 A 依赖的是它的 1 版本，项目 B 依赖的 是它的 2 版本，我在全局到底应该安装什么版本呢 ?

 该软件包可以在本地进行安装，在 A 项目中安装它的 1 版本, 在 B 项目中安装它的 2 版本，在应用中可以通过 npx 调用 node_modules 文件夹中安装的命令工具。

将所有软件包安装到应用本地是现在最推荐的做法，一是可以防止软件包的版本冲突问题，二是其他开 发者在恢复应用依赖时可以恢复全部依赖，因为软件包安装到本地后会被 package.json 文件记录，其他 开发者在运行项目时不会因为缺少依赖而报错。



### 19.配置入口文件的作用

应用程序入口文件就是应用程序执行的起点，就是启动应用程序时执行的文件。

场景一：其他开发者拿到你的软件包以后，通过该文件可以知道应用的入口文件是谁，通过入口文件启动应用。 

场景二：通过 node 应用文件夹 命令启动应用。node 命令会执行 package.json 文件中 main 选项指定 的入口文件，如果没有指定入口文件，则执行 index.js。





### 20.模块查找规则



##### 在指定了查找路径的情况下

```js
require("./server")
```

1.查找 server.js 

2.查找 server.json

3.查找 server 文件夹, 查看入口文件 (package.json -> main) 

4.查找 server 文件夹 中的 index.js 文件



##### 在没有指令查找路径的情况下

```js
require("./server")
```

```js
paths: [
    '/Users/administrators/Desktop/Node/code/node_modules',
    '/Users/administrators/Desktop/Node/node_modules',
    '/Users/administrators/Desktop/node_modules',
    '/Users/administrators/node_modules',
    '/Users/node_modules',
    '/node_modules'
]
```



## CNPM

#### 介绍

cnpm 是淘宝对国外 npm 服务器的一个完整镜像版本，也就是淘宝 npm 镜像，网站地址<http://npm.taobao.org/>

#### 安装

安装配置方式有两种

* npm install -g cnpm --registry=https://registry.npm.taobao.org
* alias cnpm="npm --registry=https://registry.npm.taobao.org \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npm.taobao.org/dist \
  --userconfig=$HOME/.cnpmrc"       (只能在Linux下使用)

#### 使用

配置完成后，就可以使用 cnpm 命令来管理包，使用方法跟 npm 一样

```sh
cnpm install lodash
```



## Yarn

#### 介绍

yarn 是 Facebook 开源的新的包管理器，可以用来代替 npm。

#### 特点

yarn 相比于 npm 有几个特点

* 本地缓存。安装过的包下次不会进行远程安装
* 并行下载。一次下载多个包，而 npm 是串行下载
* 精准的版本控制。保证每次安装跟上次都是一样的

#### 安装

##### yarn 安装

只需要一行命令即可安装 yarn

```sh
 npm install yarn -g
```

##### msi 安装包安装

<https://classic.yarnpkg.com/en/docs/install#windows-stable>

#### 相关命令

yarn 的相关命令

1)  yarn --version

2)  yarn init  //生成package.json   

3)  yarn global add  package (全局安装)

​	全局安装路径 `C:\Users\你的用户名\AppData\Local\Yarn\bin`

4)  yarn global remove less (全局删除)

5)  yarn add package (局部安装)

6)  yarn add package --dev (相当于npm中的--save-dev)

7)  yarn remove package

8)  yarn list //列出已经安装的包名 用的很少

9)  yarn info packageName //获取包的有关信息  几乎不用

10)  yarn //安装package.json中的所有依赖 

> npm 5 引入离线缓存，提高了安装速度，也引入了 package-lock.json 文件增强了版本控制

yarn 修改仓库地址

```sh
yarn config set registry https://registry.npm.taobao.org
```



## CYarn

跟 npm 与 cnpm 的关系一样，可以为 yarn 设置国内的淘宝镜像，提升安装的速度

```sh
npm install cyarn -g --registry "https://registry.npm.taobao.org"
```

配置后，只需将yarn改为cyarn使用即可



### 附录

安装指定版本的工具包

```shell
yarn add jquery@1.11.2
```

#### npm 清除缓存

> npm i 安装错误的时候 可以尝试运行 `npm cache clean`

