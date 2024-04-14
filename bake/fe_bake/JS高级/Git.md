## Git 介绍

Git 是一款开源免费的分布式的版本控制系统，是一个应用程序

## 作用

版本控制系统在项目开发中

作用重大，主要的功能有以下几点

- 代码备份
- 版本回退
- 协作开发
- 权限控制

## 下载安装

下载地址 <https://git-scm.com/>

安装方式与 QQ 安装相同，一路下一步，中间可以设置软件的安装路径

![Git安装注意点](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115651.png)

## Linux 常用命令

Linux 是一套开源免费的操作系统。与系统的交互通常用命令来实现，常用的命令有：

- <span style="color:red">ls</span> 查看文件夹下的文件 （list 单词的缩写）
- <span style="color:red">cd</span> 进入某一个文件夹内 （change directory 缩写） cd .. 回到上一级 <span style="color:red">Tab 键自动补全路径</span>
- clear 清屏（也可以使用 <span style="color:red">ctrl + l </span> 快捷键）
- mkdir 创建文件夹（make directory）
- touch test.html 创建一个文件
- rm test.html 删除文件 remove
- rm dir -r 删除文件夹 (-r 删除文件夹选项 -f 强制) force
- mv test.html t.html 移动文件，重命名 move 缩写
- cat test.html 查看文件内容
- ctrl + c 取消命令 (cancel)
- Tab 自动补齐路径
- <span style="color:red">上下方向键</span>，可以查看命令历史 (history 查看所有的历史命令)
- rm ./\* -rf 删除当前文件夹内容

Vim 是一款命令行下的文本编辑器，编辑方式跟图形化编辑器不同

- `vim test.html` 编辑文件（文件不存在则创建）
- i 进入编辑模式(i insert)
- `ESC` + `:wq` 保存并退出
- `ESC` + `:q!` 不保存并退出

![img](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115657.png)

## Git 使用

### 起始配置

第一次使用 Git 的时候，会要求我们配置用户名和邮箱，用于表示开发者的信息

```
git config --global user.name "Your Name"

git config --global user.email "email@example.com"
```

> 注意命令之间的空格

可以使用 `git config -l `命令来查看配置信息

全局配置文件存放在 C:\Users\用户名\.gitconfig 中

### 基本操作

Git 的起始操作包括以下几个步骤

1. 创建并进入空文件夹
2. 右键 -> 点击 Git Bash Here 启动命令行
3. `git init` 仓库初始化
4. 创建一个初始化文件 index.html
5. `git add index.html` 将文件加入到暂存区
6. `git commit -m '注释'` 提交到仓库 m 是 message 单词的缩写

![Git 步骤情况介绍](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115703.jpg)

### .git 目录

![1576587724690](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115707.png)

- hooks 目录包含客户端或服务端的钩子脚本，在特定操作下自动执行
- info 信息文件夹. 包含一个全局性排除文件，可以配置文件忽略
- logs 保存日志信息
- objects <span style='color:red'>目录存储所有数据内容</span>,本地的版本库存放位置
- refs 目录存储指向数据的提交对象的指针（分支）
- config 文件包含项目特有的配置选项
- description 用来显示对仓库的描述信息
- HEAD 文件指示目前被检出的分支
- index 暂存区文件，是一个二进制文件 (git ls-files)

> 切记： <span style="color:red">不要手动去修改 .git 文件夹中的内容</span>

### <span style="color:red">版本库的三个区域</span>

- 工作区（代码编辑区）
- 暂存区（编辑完成待提交区）
- 仓库区（代码保存区 本地仓库 + 远程仓库）

![image-20211229111742207](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115711.png)

### 常用命令

- <span style="color:red">git status</span> 版本状态查看
- <span style="color:red">git add -A</span> 添加所有新文件到暂存区
- <span style="color:red">git commit -m '注释 '</span> 提交修改并注释
- `git diff` 查看工作区与暂存区的差异（不显示新增文件） 显示做了哪些修改
- `git diff --cached` 查看暂存区与仓库的差异

### 历史版本回滚

#### 回滚

查看历史记录

```shell
git log    查看提交记录
git log --oneline  以一行的方式查看提交记录
git log --oneline --graph  以一行、图形化的方式查看提交记录
```

> 如果内容偏多， 需要使用方向键上下滚动， 按 `q` 退出

根据版本号进行回滚

```shell
git reset --soft  版本号 仅重置本地仓库

git reset --mixed 版本号 重置本地仓库和暂存区,默认行为

git reset --hard  版本号 重置本地仓库、暂存区和工作目录
```

注意：--hard 危险,会覆盖正在开发的代码

> 进行版本回退时，不需要使用完整的哈希字符串，前七位即可
>
> <span style="color:red">版本切换之前，要提交当前的代码状态到仓库</span>

#### 找不到版本号的情况

查看所有的操作记录

```sh
git reflog
```

### <span style="color:red">配置忽略文件</span>

##### 仓库中没有提交该文件

项目中有些文件不应该存储到版本库中，Git 中需要创建一个文件 『.gitignore』 配置忽略，一般与 .git 目录同级。

常见情况有：

1. 临时文件.
2. 多媒体文件，如音频，视频
3. 编辑器生成的配置文件 (.idea)
4. npm 安装的第三方模块

```sh
# 注释

# 忽略指定文件，不让 Git 管理
test.html
# 忽略所有的 .idea 文件夹
.idea
# 忽略所有以 .test 结尾的文件
*.test
# 取反，不忽略 test.tmp 文件，让 Git 管理起来
!test.tmp
# 忽略 node_modules 目录下的所有文件
node_modules/

# Git管理的是文件,空目录会自动被Git忽略掉
```

> .gitignore 可以在子文件夹下创建

##### 仓库中已经提交该文件

1. 对于已经加入到版本库的文件，可以在版本库中删除该文件

   ```sh
   git rm --cached .idea
   ```

2. 然后在 .gitignore 中配置忽略

   ```sh
   .idea
   ```

3. add 和 commit 提交即可

### <span style="color:red">分支</span>

分支是 Git 重要的功能特性之一，开发人员可以在主开发线的基础上分离出新的开发线。branch

#### 基本操作

##### 创建分支

> name 为分支的名称

```sh
git branch name
```

查看分支

```sh
git branch
git branch-V 查看分支(展示的信息多一些)
```

##### 切换分支

```sh
git checkout name
git switch   name   v2.23.0版及以后可用
```

##### 合并分支

```sh
git merge name 将指定分支合并当前分支
```

##### 删除分支

```sh
git branch -d name
```

##### 创建并切换分支

```sh
git checkout -b name
```

> 注意: <span style="color:red;font-weight:bold">每次在切换分支前 提交一下当前分支</span>

#### <span style="color:red">冲突</span>

当多个分支修改同一个文件后，合并分支的时候就会产生冲突。冲突的解决非常简单，『将内容修改为最终想要的结果』，然后继续执行 git add 与 git commit 就可以了。

## GitHub

### 介绍

GitHub 是一个 Git 仓库管理网站。可以创建远程中心仓库，为多人合作开发提供便利。

常用的远程仓库

- GitHub 远程仓库服务器、代码托管平台、全球最大的同性交友网站
- Gitee 国内版的 GitHub ,访问速度比 GitHub 快
- GitLab 一个开源项目，可用于搭建自己的远程仓库

### 使用流程

GitHub 远程仓库使用流程较为简单，主要有以下几种场景：

#### <span style="color:red">本地有仓库</span>

1. 注册并激活账号

2. 创建仓库

3. 获取仓库的地址

4. 本地配置远程仓库的地址

   ```shell
   git remote add origin https://github.com/xiaohigh/test2.git
   //远端仓库管理   弗拉基米尔·伊里奇·乌里扬诺夫
   add  添加
   origin 远端仓库的别名
   https://github.com/xiaohigh/test2.git    仓库地址
   ```

5. 本地提交（确认代码已经提交到本地仓库）

6. 将本地仓库内容推送到远程仓库

   ```shell
   git push -u origin master

   push 推送
   -u   关联, 加上以后,后续提交时可以直接使用 git push
   origin 远端仓库的别名
   master 本地仓库的分支
   ```

注意：git remote -V :查看配置的别名，将本地仓库推送到远程仓库需要权限

#### <span style="color:red">本地没有仓库</span>

1. 注册并激活账号

2. 克隆仓库

   ```shell
   git clone https://github.com/xiaohigh/test2.git
   ```

3. 增加和修改代码

4. 本地提交

   ```shell
   git add -A
   git commit -m 'message'
   ```

5. 推送到远程

   ```shell
   git push origin master
   ```

> 克隆代码之后， 本地仓库会默认有一个远程地址的配置， 名字为 origin

#### <span style="color:red">多人合作</span>

##### 账号仓库配置

GitHub 团队协作开发也比较容易管理，可以创建一个组织

- 首页 -> 右上角 `+` 号-> new Organization
- 免费计划
- 填写组织名称和联系方式（不用使用中文名称）
- 邀请其他开发者进入组织（会有邮件邀请）

* 点击组织右侧的 settings 设置
* 左侧 Member privileges
* 右侧 Base permissions 设置 write 👌

##### 协作流程

第一次

- 得到 Git 远程仓库的地址和账号密码

- 将代码克隆到本地（地址换成自己的）

  ```shell
  git clone https://github.com/xiaohigh/test.git
  ```

- 切换分支

  ```
  git checkout -b xiaohigh
  ```

- 开发代码

- 本地提交

  ```shell
  git add -A
  git commit -m '注释内容'
  ```

- 合并分支

  ```shell
  git checkout master
  git merge xiaohigh
  ```

- 更新本地代码

  ```shell
  git pull
  ```

- 提交代码

  ```shell
  git push
  ```

##### 工作流程

第二次流程

1. 更新代码

   ```
   git checkout master
   git pull
   ```

2. 切换并合并分支

   ```
   git checkout xiaohigh
   git merge master
   ```

3. 开发功能

4. 提交

   ```
   git add -A
   git commit -m '注释'
   ```

5. 合并分支

   ```
   git checkout master
   git merge xiaohigh
   ```

6. 更新代码

   ```
   git pull
   ```

7. 推送代码

   ```
   git push
   ```

##### 冲突解决

同分支冲突一样的处理，将代码调整成最终的样式，提交代码即可。

##### 好习惯

- 每天开始工作的时候,都应该从远程仓库拉取最新的代码
- 每天工作完都应该把代码推送到远程仓库
- 每次推送前需要先拉取

### GitFlow

GitFlow 是团队开发的一种最佳实践，将代码划分为以下几个分支

![img](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115723.png)

- Master 主分支。上面只保存正式发布的版本
- Hotfix 线上代码 Bug 修复分支。开发完后需要合并回 Master 和 Develop 分支，同时在 Master 上打一个 tag
- Feather 功能分支。当开发某个功能时，创建一个单独的分支，开发完毕后再合并到 dev 分支
- Release 分支。待发布分支，Release 分支基于 Develop 分支创建，在这个 Release 分支上测试，修改 Bug
- Develop 开发分支。开发者都在这个分支上提交代码

首次克隆完代码后，需要切换到开发分支

```sh
//查看所有分支
git branch -a
//切换分支
git checkout dev
```

## 附录

### Git 官方书籍

[https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%85%B3%E4%BA%8E%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6](https://git-scm.com/book/zh/v2/起步-关于版本控制)

### CRLF

CRLF 是 Carriage-Return Line-Feed 的缩写。

CR 表示的是 ASCII 码的第 13 个符号 \r 回车，LF 表示的是 ASCII 码表的第 10 个符号 \n 换行。

每个操作系统对回车换行的存储方式不同

- windows 下用 CRLF（\r\n）表示
- linux 和 unix 下用 LF（\n）表示
- mac 系统下用 CR（\r）表示

![打字机](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115730.jpg)

###

### 常见错误

#### 回车换行转换问题

```sh
warning: LF will be replaced by CRLF in 5.html.
The file will have its original line endings in your working directory
```

这个问题主要是 Git 在你提交时自动地把回车（CR）和换行（LF）转换成换行（LF），没有影响，<span style="color:red">这里建议大家保留这个状态</span>。可以通过下面的命令设置不转换，但是不推荐

```sh
git config --global core.autocrlf false // 不推荐
```

#### 提交报错

![img](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115735.bmp)

其他人已经提交过，本地代码需要更新，首先运行 git pull 命令

#### 冲突提醒

![1574235172869](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115738.png)

编辑冲突

#### 提交错误

```sh
xiaohigh@DESKTOP-252ML8M MINGW64 /d/www/BJ0819/day13/代码/1-GitHub/7-test-ssh/8-https-to-ssh (master)
$ git push
fatal: The current branch master has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin master
```

如果第一次将本地仓库分支提交到远程时，直接使用 `git push` 可能会报这个错误，解决方法

```sh
git push -u origin master
```

### 提交错误

![1576840150520](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115741.png)

当前所在文件夹不是一个 git 仓库目录，切换目录工作

### 找不到 .git 的方法

![1582943996890](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20211229115745.png)
