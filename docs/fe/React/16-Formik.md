## 1.Formik介绍

> 增强表单处理能力，简化表单处理流程
>
> 下载：`npm install formik`



## 2.Formik 使用



### 2.1 基本使用

> 使用 formik 进行表单数据绑定以及表单提交处理

```jsx
import { useFormik } from "formik";

function App() {
   // initialValues默认表单内容  onSubmit表单提交触发的事件处理函数 values存储表单最新的数据
  const formik = useFormik({ initialValues: { username: "yunmu" }, onSubmit: (values) => {} });
  return (
    <form onSubmit={formik.handleSubmit}>
      <input type="text" name="username" value={formik.values.username} onChange={formik.handleChange} />
      <input type="submit" />
    </form>
  );
}
```





### 2.2 表单验证



初始验证方式：

```jsx
const formik = useFormik({
  validate: values => {
    const errors = {}
    if (!values.username) errors.username = '请输入用户名'
    return errors
  }
})

return <form>{formik.errors.username ? <div>{formik.errors.username}</div> : null}</form>
```



增加 onBlur 事件，显示时先判断 formik.touched.username 是否存在：

```jsx
<input
  type="text"
  name="username"
  value={formik.values.username}
  onChange={formik.handleChange}
  onBlur={formik.handlerBlur}
/>
<p>{formik.touched.username && formik.errors.username ? formik.errors.username : null}</p>
```



 使用 yup 验证：

1. 下载引入yup 

```shell
npm install yup
import * as Yup from 'yup'
```

2. 定义验证规则

```jsx
validationSchema: Yup.object({
  username: Yup.string()
    .max(15, '用户名的长度不能大于15')
    .required('请输入用户名'),
  password: Yup.string()
    .max(20, '密码的长度不能大于20')
    .required('请输入密码')
})
```



### 2.3 减少样板代码

```jsx
 <input type="text" name="username" {...formik.getFieldProps("username")} />
```





### 2.4 使用组件的方式构建表单

```jsx
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

export default function App () {

  const initialValues = {
    username: 'yunmu',
    content: '我是内容',
    subject: 'React',
  }
  const handleSubmit = values => {
    console.log(values)
  }
  const schema = Yup.object({
    username: Yup.string().max(15, '用户名的长度不能大于15').required('请输入用户名')
  })
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      <Form>
        <Field name="username" />
        <ErrorMessage name="username" />
        <input type="submit" />
      </Form>
    </Formik>
  )
}
```



### 2.5 构建其他表单项

默认情况下，Field 组件渲染的是文本框，如要生成其他表单元素可以使用以下语法

```html
<Field as="textarea" name="content" />
<Field as="select" name="subject" >
  <option value="Vue">Vue</option>
  <option value="React">React</option>
</Field>
```



### 2.6 使用useField 构建自定义表单控件

```jsx
function MyInputField ({ label, ...props }) {
  // field对象储存表单控件所需属性 meta储存的是表单验证有关信息
  const [field, meta] = useField(props)
  return <div>
    <label htmlFor={props.id}>{label}</label>
    <input {...field} {...props} />
    <span>{ meta.touched && meta.error ? meta.error: null }</span>
  </div>
}
```



### 2.7 自定义复选框组件

```jsx
function Checkbox ({ label, ...props }) {
  const [field, meta, helper] = useField(props)
  // 获取定义的hobbies的数组和更改数组的方法
  const { value } = meta
  const { setValue } = helper
  const handleChange = () => {
    const set = new Set(value)
    if (set.has(props.value)) {
      set.delete(props.value)
    } else {
      set.add(props.value)
    }
    setValue([...set])
  }
  return <div>
    <label htmlFor="" >
      <input checked={value.includes(props.value)} type="checkbox" {...props} onChange={handleChange} />{label}
    </label>
  </div>
}

const initialValues = {
  hobbies: ['足球', '篮球']
}

<Checkbox value="足球" label="足球" name="hobbies" />
<Checkbox value="篮球" label="篮球" name="hobbies" />
<Checkbox value="橄榄球" label="橄榄球" name="hobbies" />
```

