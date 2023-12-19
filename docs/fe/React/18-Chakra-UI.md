## 1.Chakra-UI 介绍

> 现代化 React UI 框架 Chakra-UI
>
> Chakra UI 是一个简单的，模块化的易于理解的 UI 组件库，提供了丰富的构建 React 应用所需的 UI 组件
>
> 官网：[Chakra UI ](https://chakra-ui.com/)
>
> 特点：
>
> 1. Chakra UI 内置 Emotion,是 CSS-IN-JS 解决方案的集大成者
> 2. 基于 Styled-Systems https://styled-system.com/
> 3. 支持开箱即用的主题功能
> 4. 默认支持白天和黑夜两种模式
> 5. 拥有大量功能丰富且非常有用的组件
> 6. 使响应式设计变得轻而易举
> 7. 文档清晰而全面.查找 API 更加容易
> 8. 适用于构建用于展示的给用户的界面
> 9. 框架正在变得越来越完善

## 2.Chakra-UI 速识

### 2.1 下载 Chakra-UI

```shell
npm i @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6
```

### 2.2 克隆默认主题

Chakra-UI 提供的组件是建⽴在主题基础之上的, 只有先引⼊了主题组件才能够使⽤其他组件

```shell
npm i @chakra-ui/theme
```

### 2.3 引入主题和 CSS 重置组件

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@chakra-ui/theme";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
```

### 2.4 引用组件

```jsx
import { Button } from "@chakra-ui/react";

function App() {
  return (
    <div>
      <Button>submit</Button>
    </div>
  );
}

export default App;
```

## 3.Style Props 样式属性

> Style Props 是⽤来更改组件样式
>
> 通过为组件传递属性的⽅式实现， 通过传递简化的样式属性以达到提升开发效率的⽬的

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220214211252529.png" alt="image-20220214211252529" style="zoom: 50%;" />

示例：

```jsx
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <div>
      <Box w="200px" h="200px" bgColor="tomato"></Box>
    </div>
  );
}

export default App;
```

## 4. 主题

### 4.1 颜色模式（color mode）

chakra-ui 提供的组件都支持两种颜色模式，浅色模式(light)和暗色模式(dark)

可以通过 useColorMode 进行颜色模式的更改

Chakra 将颜⾊模式存储在 localStorage 中, 并使⽤类名策略来确保颜⾊模式是持久的

```jsx
import { Box, Text, Button, useColorMode } from "@chakra-ui/react";
// Box默认渲染div Text渲染p
function App() {
  const { colorMode, toggleColorMode } = useColorMode(); // 注意这里是对象解构，不是数组解构
  return (
    <Box w={256} h={200} bg="tomato">
      <Text>当前的颜色模式为 {colorMode}</Text>
      <Button onClick={toggleColorMode}>切换颜色模式</Button>
    </Box>
  );
}

export default App;
```

### 4.2 根据颜色模式设置样式

chakra 允许在为元素设置样式时根据颜色模式产生不同值

通过 useColorModeValue 钩子函数实现

```jsx
import { Box, Button, useColorModeValue, useColorMode } from "@chakra-ui/react";

function App() {
  const bg = useColorModeValue("tomato", "skyblue");
  // useColorModeValue接受的第一个值会浅色模式的颜色值 第二个为暗色模式
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box w={256} h={200} bg={bg}>
      <Button onClick={toggleColorMode}>切换颜色模式{colorMode}</Button>
    </Box>
  );
}

export default App;
```

### 4.3 强制组件颜色模式

使组件不受颜色模式的影响，始终保持在某个颜色模式下的样式

使用 LightMode 组件包裹需要作用的组件只显示浅色模式，使用 DarkMode 组件包裹需要作用的组件只显示暗色模式

```jsx
import { Box, Button, useColorModeValue, useColorMode, LightMode } from "@chakra-ui/react";

function App() {
  const bg = useColorModeValue("tomato", "skyblue");
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box w={256} h={200} bg={bg}>
      <LightMode>
        <Button onClick={toggleColorMode}>切换颜色模式{colorMode}</Button>
      </LightMode>
    </Box>
  );
}

export default App;
```

### 4.4 颜色模式通用设置

> 1. 设置默认颜色模式，通过 theme.config.initialColorMode 可以设置应用使用的默认主题.
> 2. 使用操作系统所使用的颜色模式，通过 theme.config.useSystemColorMode 可以设置将应用的颜色模式设置为操作系统所使用的颜色模式

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@chakra-ui/theme";

// 1. 设置默认颜色模式
// theme.config.initialColorMode = "dark";

// 2. 使用操作系统所使用的颜色模式
theme.config.useSystemColorMode = true;

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
```

### 4.5 主题对象

#### 1.Colors

在设置颜色时，可以但不限于取主题对象中的颜色值

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220214231905788.png" alt="image-20220214231905788" style="zoom:50%;" />

```jsx
import { Box } from "@chakra-ui/react";

function App() {
  return <Box w={256} h={200} bg="red.200"></Box>;
}

export default App;
```

#### 2.Space

使用 space 可以自定义项目间距。这些间距值可以由 width, height 和 maxWidth、minWidth 等样式引用

```jsx
import { Box } from "@chakra-ui/react";

function App() {
  // lg = 32rem
  return <Box mt={6} w="lg" h="2xl" bg="red.200"></Box>;
}

export default App;
```

#### 3.Breakpoints

配置响应数组值中使用的默认断点。这些值将用于生成移动优先（即最小宽度）的媒体查询

```js
// theme.js
export default {
  breakpoints: ["30em", "48em", "62em", "8Øem"],
};
```

```jsx
// 数组第一个值为默认值 从第二个开始与上面一一对应 例当屏幕宽度为30em应用14px
<Box fontSize={["12px", "14px", "16px", "18px", "20px"]}></Box>
```

### 4.6 创建标准的 Chakra-Ul 组件

#### 1.创建 Chakra-Ul 组件

```jsx
import { chakra } from "@chakra-ui/react";
const YunButton = chakra("button", {
  baseStyle: {
    borderRadius: "lg",
  },
  sizes: {
    sm: {
      px: "3", // padding-left/padding-right
      py: "1", // padding-right/padding-bottom
      fontSize: "12px",
    },
    md: {
      px: "4",
      py: "2",
      fontSize: "14px",
    },
  },
  variants: {
    // 风格化样式
    primary: {
      bgColor: "blue.300",
      color: "white",
    },
    danger: {
      bgColor: "red.300",
      color: "white",
    },
  },
});

YunButton.defaultProps = {
  size: "sm",
  variant: "primary",
};

function App() {
  return (
    <div>
      <YunButton size="md" variant="danger">
        按钮
      </YunButton>
    </div>
  );
}

export default App;
```

#### 2.全局化 Chakra-UI 组件样式

- 在 src 文件夹中创建 LaGou 文件夹用于放置自定义 Chakra-UI 组件
- 在 YunCpn 文件夹中创建 Button.js 文件并将组件样式放置于当前文件中并进行默认导出

```jsx
const YunButton = {
  baseStyle: {
    borderRadius: "lg",
  },
  sizes: {
    sm: {
      px: "3", // padding-left/padding-right
      py: "1", // padding-right/padding-bottom
      fontSize: "12px",
    },
    md: {
      px: "4",
      py: "2",
      fontSize: "14px",
    },
  },
  variants: {
    // 风格化样式
    primary: {
      bgColor: "blue.500",
      color: "white",
    },
    danger: {
      bgColor: "red.500",
      color: "white",
    },
  },
  defaultProps: {
    size: "sm",
    variant: "primary",
  },
};

export default YunButton;
```

在 YunCpn 文件夹中创建 index.js 文件用于导入导出所有的自定义组件：

```jsx
import YunButton from "./Button";

export default {
  YunButton,
};
```

在 src 文件夹中的 index.js 文件中导入自定义 Chakra-UI 组件并和 components 属性进行合并：

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "@chakra-ui/theme";
import { ChakraProvider } from "@chakra-ui/react";
import YunComponents from "./YunCpn";

const myTheme = {
  ...theme,
  components: {
    ...theme.components,
    ...YunComponents,
  },
};

console.log(myTheme);

ReactDOM.render(
  <ChakraProvider theme={myTheme}>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
```

在组件中使用样式化组件：

```jsx
import { chakra } from "@chakra-ui/react";
const LaGouButton = chakra("button", {
  themeKey: "YunButton",
});

function App() {
  return (
    <div>
      <LaGouButton>按钮</LaGouButton>
    </div>
  );
}

export default App;
```

## 5.构建表单

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220215003037735.png" alt="image-20220215003037735" style="zoom:50%;" />

```jsx
// Form.js
import React from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Box,
  Image,
  useColorModeValue,
} from "@chakra-ui/core";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

import chakraUILight from "../assets/images/chakra-ui-light.png";
import chakraUIDark from "../assets/images/chakra-ui-dark.png";

export default function Form() {
  const bgColor = useColorModeValue("gray.200", "gray.700");
  const chakraUI = useColorModeValue(chakraUILight, chakraUIDark);
  return (
    <Box bgColor={bgColor} p={3} w="100%" boxShadow="lg" borderRadius="lg">
      <Image w="250px" mx="auto" mt="2" mb="6" src={chakraUI} />
      <Tabs isFitted>
        <TabList>
          <Tab _focus={{ boxShadow: "none" }}>注册</Tab>
          <Tab _focus={{ boxShadow: "none" }}>登录</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SignUp />
          </TabPanel>
          <TabPanel>
            <SignIn />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
```

```jsx
// SignUp.js
import React from "react";
import {
  Input,
  InputGroup,
  Stack,
  InputLeftAddon,
  InputRightAddon,
  FormHelperText,
  RadioGroup,
  Radio,
  Select,
  Switch,
  FormLabel,
  Flex,
  Button,
  FormControl,
} from "@chakra-ui/core";
import { FaUserAlt, FaLock, FaCheck } from "react-icons/fa";

export default function SignUp() {
  return (
    <form>
      <Stack spacing="2">
        <FormControl isDisabled isInvalid>
          <InputGroup>
            <InputLeftAddon children={<FaUserAlt />} />
            <Input placeholder="请输入用户名" />
          </InputGroup>
          <FormHelperText>用户名是填项</FormHelperText>
        </FormControl>
        <InputGroup>
          <InputLeftAddon children={<FaLock />} />
          <Input type="password" placeholder="请输入密码" />
          <InputRightAddon children={<FaCheck />} />
        </InputGroup>
        <RadioGroup defaultValue="0">
          <Stack spacing={4} direction="horizontal">
            <Radio value="0">男</Radio>
            <Radio value="1">女</Radio>
          </Stack>
        </RadioGroup>
        <Select appearance="none" placeholder="请选择学科">
          <option value="Java">Java</option>
          <option value="大前端">大前端</option>
        </Select>
        <Flex>
          <Switch id="deal" mr="3" />
          <FormLabel htmlFor="deal">是否同意协议</FormLabel>
        </Flex>
        <Button _hover={{ bgColor: "tomato" }} w="100%" colorScheme="teal">
          注册
        </Button>
      </Stack>
    </form>
  );
}
```

```jsx
// SignIn.js
import React from "react";
import {
  Input,
  InputGroup,
  Stack,
  InputLeftAddon,
  InputRightAddon,
  FormHelperText,
  Button,
  FormControl,
} from "@chakra-ui/core";
import { FaUserAlt, FaLock, FaCheck } from "react-icons/fa";

export default function SignIn() {
  return (
    <form>
      <Stack spacing="2">
        <FormControl isDisabled isInvalid>
          <InputGroup>
            <InputLeftAddon children={<FaUserAlt />} />
            <Input placeholder="请输入用户名" />
          </InputGroup>
          <FormHelperText>用户名是填项</FormHelperText>
        </FormControl>
        <InputGroup>
          <InputLeftAddon children={<FaLock />} />
          <Input type="password" placeholder="请输入密码" />
          <InputRightAddon children={<FaCheck />} />
        </InputGroup>
        <Button _hover={{ bgColor: "tomato" }} w="100%" colorScheme="teal">
          登录
        </Button>
      </Stack>
    </form>
  );
}
```

## 6.布局板式组件的使用

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220215003543890.png" alt="image-20220215003543890" style="zoom:50%;" />

```jsx
// Card.js
import React from "react";
import {
  Box,
  Image,
  Badge,
  Text,
  Stack,
  Flex,
  Button,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/core";
import chakraUI from "../assets/images/chakra-ui.png";
import { AiFillStar } from "react-icons/ai";

export default function Card() {
  const bgColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.100");
  return (
    <Box bgColor={bgColor} w={1 / 2} borderRadius="lg" boxShadow="lg" overflow="hidden">
      <Image src={chakraUI} />
      <Box p={3}>
        <Stack direction="horizontal" align="center">
          <Badge variant="solid" colorScheme="teal" borderRadius="full" px="2">
            New
          </Badge>
          <Badge variant="solid" colorScheme="teal" borderRadius="full" px="2">
            React
          </Badge>
          <Badge variant="solid" colorScheme="teal" borderRadius="full" px="2">
            Chakra-UI
          </Badge>
          <Text color={textColor}>必属精品</Text>
        </Stack>
        <Text fontSize="xl" pt={3} pb={2} color={textColor} as="h3" fontWeight="semibold">
          Chakra-UI 框架专题课程
        </Text>
        <Text fontWeight="light" fontSize="sm" lineHeight="tall">
          Chakra UI 是一个简单的, 模块化的易于理解的 UI 组件库. 提供了丰富的构建 React
          应用所需的UI组件.
          在整个应用程序中，在任何组件上快速、轻松地引用主题中的值。组件的构建考虑到了组合。你可以利用任何组件来创造新事物。Chakra-UI
          严格遵循WAI-ARIA标准。所有组件都有适当的属性和现成的键盘交互。Chakra UI 是一个简单的,
          模块化的易于理解的 UI 组件库. 提供了丰富的构建 React 应用所需的UI组件.
        </Text>
        <Flex align="center" mt={2}>
          <Flex color="teal.500">
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
          </Flex>
          <AiFillStar />
          <Text ml={1}>100 评论</Text>
        </Flex>
      </Box>
      <Button w="100%" colorScheme="teal">
        登录
      </Button>
    </Box>
  );
}
```
