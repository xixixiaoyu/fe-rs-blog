- **抽象**：OOP 数据和行为抽象为一个个对象，对象是一等公民；而 FP 将行为抽象为函数，数据与行为是分离的，函数是一等公民。
- **代码重用**：OOP 的核心在于继承，而 FP 的核心在于组合。

## 用 FP 解决业务问题
有这样一个需求：
```javascript
用户 -> 喜欢课程 -> 注册课程 -> 检查是否 VIP -> 结束
```
代码如下：
```javascript
// mock一个测试用户：李雷
const user = {
  // 姓名
  name: 'Li Lei',
  // 喜欢列表
  likedLessons: [],
  // 注册列表
  registeredLessons: [],
  // VIP 标识
  isVIP: false
}

// mock一套测试课程
const myLessons = [
  {
    teacher: 'John',
    title: 'advanced English'
  },
  {
    teacher: 'John',
    title: 'advanced Spanish'
  }
]

// ”喜欢课程“功能函数
function likeLessons(user, lessons) {
  const updatedLikedLessons = user.likedLessons.concat(lessons)
  return Object.assign({}, user, { likedLessons: updatedLikedLessons })
}

// “注册课程”功能函数
function registerLessons(user) {
  return {
    ...user,
    registeredLessons: user.likedLessons
  }
}

// “检查是否 VIP”功能函数
function isVIP(user) {
  let isVIP = false
  if (user.registeredLessons.length > 10) {
    isVIP = true
  }
  return {
    ...user,
    isVIP
  }
}

const pipe = (...funcs) =>
  funcs.reduce(
    (f, g) =>
      (...args) =>
        g(f(...args))
  )

const newUser = pipe(likeLessons, registerLessons, isVIP)(user, myLessons)

console.log(newUser)
```
打印结果如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693895428116-7094efa0-aea6-43f2-88df-2446356e9a37.png#averageHue=%233e4346&clientId=u697ef9eb-57cf-4&from=paste&height=225&id=ud8cd5c94&originHeight=225&originWidth=401&originalType=binary&ratio=1&rotation=0&showTitle=false&size=12007&status=done&style=none&taskId=u6d6808d0-aa45-4312-b954-30726a18556&title=&width=401)<br />在这个链条上我们可以随意组合，比如我们这里想在最后清空 likeLessons，只需要：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1693895593688-c9711019-947a-424a-b85d-7dcd8a9cebc5.png#averageHue=%232e2d2c&clientId=u697ef9eb-57cf-4&from=paste&height=245&id=u8fa4f10c&originHeight=369&originWidth=914&originalType=binary&ratio=1&rotation=0&showTitle=false&size=33169&status=done&style=none&taskId=u9133ddb5-c88c-4744-a847-6fb7cb51c53&title=&width=607)


## 用 OOP 解决业务问题
有一款运动游戏。在这款游戏里，玩家可以选择成为任何一种类型的运动选手，并且有各种能力：<br />我们创造三个类：

- BasketballPlayer：篮球选手，会灌篮（ slamdunk() ) ，会跳跃（ jump() )
- FootballPlayer：足球选手，会射门( shot() ），会狂奔（ runFast() ）
- CrazyPlayer：疯狂号选手，会飞（ fly() ）
```javascript
// Player 是一个最通用的基类
class Player {
  // 每位玩家入场前，都需要给自己起个名字，并且选择游戏的类型
  constructor(name, sport) {
    this.name = name
    this.sport = sport
  }
  // 每位玩家都有运动的能力
  doSport() {
    return 'play' + this.sport
  }
}

// 篮球运动员类，是基于 Player 基类拓展出来的
class BasketballPlayer extends Player {
  constructor(name) {
    super(name, 'basketball')
  }
  slamDunk() {
    return `${this.name} just dunked a basketball`
  }
  jump() {
    return `${this.name} is jumping!`
  }
}

// 足球运动员类，也基于 Player 基类拓展出来的
class FootballPlayer extends Player {
  constructor(name) {
    super(name, 'football')
  }
  shot() {
    return `${this.name} just shot the goal`
  }
  runFast() {
    return `${this.name} is running fast!`
  }
}

// 疯狂号运动员，也是基于 Player 基类拓展出来的
class CrazyPlayer extends Player {
  // 疯狂号运动员可定制的属性多出了 color 和 money
  constructor(name, sport, color, money) {
    super(name, sport)
    this.color = color
    this.money = money
  }
  fly() {
    if (this.money > 0) {
      // 飞之前，先扣钱
      this.money--
      return `${this.name} is flying!So handsome!`
    }
    return 'you need to give me money'
  }
}

// 创建一个篮球运动员 Bob
const Bob = new BasketballPlayer('Bob')
Bob.slamDunk()
const John = new FootballPlayer('John')
John.shot()

// 创建一个红色皮肤的疯狂号选手xiuyan，并充了1块钱
const xiuyan = new CrazyPlayer('xiuyan', 'basketball', 'red', 1)
xiuyan.fly()
xiuyan.money
xiuyan.fly()
```
在网课的案例中，我之所以倾向于使用 FP 求解，是因为这是一个**重行为、轻数据结构**的场景；<br />在游戏的案例中，我之所以倾向使用 OOP 求解，是因为这是一个**重数据结构、轻行为**的场景。<br />现在我们想让一个选手只需要篮球选手的“灌篮”能力，不需要“跳跃”能力；它只需要足球选手的“射门”能力，不需要“狂奔”能力。<br />如果借助继承：
```javascript
SuperPlayer
  extends BasketballPlayer 
    extends FootballPlayer
      extends CrazyPlayer
```
SuperPlayer 需要同时继承 3 个 Class，被迫拥有了它并不需要也并不想要的的“射门”和“狂奔”能力。<br />今后篮球/足球/疯狂号选手新增的任何属性和方法，都很可能是和我 SuperPlayer 是没有关系的。<br />而且任何一种选手的 Class 发生变更，都可能影响到我们这位 SuperPlayer 明星选手，谁还敢再动那些父类。<br />我们不妨引入组合来解决下：
```javascript
const getSlamDunk = player => ({
  slamDunk: () => {
    return `${player.name} just dunked a basketball`
  }
})

const getShot = player => ({
  shot: () => {
    return `${player.name} just shot the goal`
  }
})

const getFly = player => ({
  fly: () => {
    if (player.money > 0) {
      // 飞之前，先扣钱
      player.money--
      return `${player.name} is flying!So handsome!`
    }
    return 'you need to give me money'
  }
})

const SuperPlayer = (name, money) => {
  // 创建 SuperPlayer 对象
  const player = {
    name,
    sport: 'super',
    money
  }

  // 组合多个函数到 player 中
  return Object.assign({}, getSlamDunk(player), getShot(player), getFly(player))
}

const superPlayer = SuperPlayer('yunmu', 20)
superPlayer.slamDunk()
superPlayer.shot()
superPlayer.fly()
```
这样一来，我们就用组合的方法，改造了原有的继承链，一举端掉了继承所带来的各种问题。

### FP：函数是一等公民
FP 构造出的程序，就像一条长长的管道。管道的这头是源数据，管道的那头是目标数据。<br />我们只需要关注如何把一节一节简单的小管道（函数）组合起来即可。

### OOP：对象是一等公民
OOP 思想起源于对自然界的观察和抽象，旨在**寻找事物之间的共性，来抽象出对一类事物的描述**。<br />在 OOP 关注的更多是一系列有联系的属性和方法。**我们把相互联系的属性和方法打包，抽象为一个“类”数据结构**<br />**我们关注的不是行为本身，而是谁做了这个行为，谁和谁之间有着怎样的联系**。<br />此时，摆在我们面前的不再是一个个平行的数据管道，而是一张复杂交错的实体关系网。

## 代码重用：组合 vs 继承
面向对象（OOP）的核心在于继承，而函数式编程（FP）的核心在于组合。<br />FP 案例借助 pipe 函数实现了函数组合，OOP 案例借助 extends 关键字实现了类的继承。<br />组合的过程是一个两两结合、聚沙成塔的过程；<br />而继承则意味着子类在父类的基础上重写/增加一些内容，通过创造一个新的数据结构来满足的新的需求。<br />继承当然可以帮我们达到重用的目的，但它称不上“好”。<br />子类和父类之间的关系，是一种紧耦合的关系。父类的任何变化，都将直接地影响到子类。<br />但我们定义父类的时候，无法预测这个父类未来会变成什么样子。我们修改任何一个类的时候，都要考虑它是否会对其它的类带来意料之外的影响<br />在 OOP 的语境下，我们解决“继承滥用”问题的一个重要方法，就是引入“组合”思想。

## 小结
**能用组合就不要用继承**。<br />即便我们用 OOP 去抽象整体的程序框架，也应该在局部使用“组合”来解决代码重用的问题。<br />所以 OOP 和 FP 之间并不是互斥/对立的关系，而是正交/协作的关系。
