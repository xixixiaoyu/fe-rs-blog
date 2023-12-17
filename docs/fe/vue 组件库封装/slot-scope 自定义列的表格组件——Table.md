## 方案一
为了兼容旧的 Render 函数用法，在 columns 的列配置 column 中，新增一个字段 slot 来指定 slot-scope 的名称：
```html
<!-- src/components/table-slot/table.vue -->
<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns">{{ col.title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in data">
        <td v-for="col in columns">
          <template v-if="'render' in col">
            <Render :row="row" :column="col" :index="rowIndex" :render="col.render"></Render>
          </template>
          <template v-else-if="'slot' in col">
            <slot :row="row" :column="col" :index="rowIndex" :name="col.slot"></slot>
          </template>
          <template v-else>{{ row[col.key] }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
```
在定义的作用域 slot 中，将行数据 row、列数据 column 和第几行 index 作为 slot 的参数，并根据 column 中指定的 slot 字段值，动态设置了具名 name。<br />使用者在配置 columns 时，只要指定了某一列的 slot，那就可以在 Table 组件中使用 slot-scope。<br />我们以上一节的可编辑整行数据为例，用 slot-scope 的写法实现完全一样的效果：
```vue
<!-- src/views/table-slot.vue -->
<template>
  <div>
    <table-slot :columns="columns" :data="data">
      <template slot-scope="{ row, index }" slot="name">
        <input type="text" v-model="editName" v-if="editIndex === index" />
        <span v-else>{{ row.name }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="age">
        <input type="text" v-model="editAge" v-if="editIndex === index" />
        <span v-else>{{ row.age }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="birthday">
        <input type="text" v-model="editBirthday" v-if="editIndex === index" />
        <span v-else>{{ getBirthday(row.birthday) }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="address">
        <input type="text" v-model="editAddress" v-if="editIndex === index" />
        <span v-else>{{ row.address }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <button @click="handleSave(index)">保存</button>
          <button @click="editIndex = -1">取消</button>
        </div>
        <div v-else>
          <button @click="handleEdit(row, index)">操作</button>
        </div>
      </template>
    </table-slot>
  </div>
</template>

<script>
  import TableSlot from '../components/table-slot/table.vue';

  export default {
    components: { TableSlot },
    data () {
      return {
        columns: [
          {
            title: '姓名',
            slot: 'name'
          },
          {
            title: '年龄',
            slot: 'age'
          },
          {
            title: '出生日期',
            slot: 'birthday'
          },
          {
            title: '地址',
            slot: 'address'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        data: [
          {
            name: '王小明',
            age: 18,
            birthday: '919526400000',
            address: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            age: 25,
            birthday: '696096000000',
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            birthday: '563472000000',
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            birthday: '687024000000',
            address: '深圳市南山区深南大道'
          }
        ],
        editIndex: -1,  // 当前聚焦的输入框的行数
        editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
        editAge: '',  // 第二列输入框
        editBirthday: '',  // 第三列输入框
        editAddress: '',  // 第四列输入框
      }
    },
    methods: {
      handleEdit (row, index) {
        this.editName = row.name;
        this.editAge = row.age;
        this.editAddress = row.address;
        this.editBirthday = row.birthday;
        this.editIndex = index;
      },
      handleSave (index) {
        this.data[index].name = this.editName;
        this.data[index].age = this.editAge;
        this.data[index].birthday = this.editBirthday;
        this.data[index].address = this.editAddress;
        this.editIndex = -1;
      },
      getBirthday (birthday) {
        const date = new Date(parseInt(birthday));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}-${month}-${day}`;
      }
    }
  }
</script>
```
可以看到，基本是把 Render 函数还原成了模板语法。

## 方案二
仍然使用 render 函数：
```vue
<!-- src/views/table-render.vue 的改写 -->
<template>
  <div>
    <table-render ref="table" :columns="columns" :data="data">
      <template slot-scope="{ row, index }" slot="name">
        <input type="text" v-model="editName" v-if="editIndex === index" />
        <span v-else>{{ row.name }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="age">
        <input type="text" v-model="editAge" v-if="editIndex === index" />
        <span v-else>{{ row.age }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="birthday">
        <input type="text" v-model="editBirthday" v-if="editIndex === index" />
        <span v-else>{{ getBirthday(row.birthday) }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="address">
        <input type="text" v-model="editAddress" v-if="editIndex === index" />
        <span v-else>{{ row.address }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <button @click="handleSave(index)">保存</button>
          <button @click="editIndex = -1">取消</button>
        </div>
        <div v-else>
          <button @click="handleEdit(row, index)">操作</button>
        </div>
      </template>
    </table-render>
  </div>
</template>
      
<script>
  import TableRender from '../components/table-render/table.vue';

  export default {
    components: { TableRender },
    data () {
      return {
        columns: [
          {
            title: '姓名',
            render: (h, { row, column, index }) => {
              return h(
                'div',
                this.$refs.table.$scopedSlots.name({
                  row: row,
                  column: column,
                  index: index
                })
              )
            }
          },
          {
            title: '年龄',
            render: (h, { row, column, index }) => {
              return h(
                'div',
                this.$refs.table.$scopedSlots.age({
                  row: row,
                  column: column,
                  index: index
                })
              )
            }
          },
          {
            title: '出生日期',
            render: (h, { row, column, index }) => {
              return h(
                'div',
                this.$refs.table.$scopedSlots.birthday({
                  row: row,
                  column: column,
                  index: index
                })
              )
            }
          },
          {
            title: '地址',
            render: (h, { row, column, index }) => {
              return h(
                'div',
                this.$refs.table.$scopedSlots.address({
                  row: row,
                  column: column,
                  index: index
                })
              )
            }
          },
          {
            title: '操作',
            render: (h, { row, column, index }) => {
              return h(
                'div',
                this.$refs.table.$scopedSlots.action({
                  row: row,
                  column: column,
                  index: index
                })
              )
            }
          }
        ],
        data: [],
        editIndex: -1,  // 当前聚焦的输入框的行数
        editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
        editAge: '',  // 第二列输入框
        editBirthday: '',  // 第三列输入框
        editAddress: '',  // 第四列输入框
      }
    },
    methods: {
      handleEdit (row, index) {
        this.editName = row.name;
        this.editAge = row.age;
        this.editAddress = row.address;
        this.editBirthday = row.birthday;
        this.editIndex = index;
      },
      handleSave (index) {
        this.data[index].name = this.editName;
        this.data[index].age = this.editAge;
        this.data[index].birthday = this.editBirthday;
        this.data[index].address = this.editAddress;
        this.editIndex = -1;
      },
      getBirthday (birthday) {
        const date = new Date(parseInt(birthday));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}-${month}-${day}`;
      }
    },
    mounted () {
      this.data = [
        {
          name: '王小明',
          age: 18,
          birthday: '919526400000',
          address: '北京市朝阳区芍药居'
        },
        {
          name: '张小刚',
          age: 25,
          birthday: '696096000000',
          address: '北京市海淀区西二旗'
        },
        {
          name: '李小红',
          age: 30,
          birthday: '563472000000',
          address: '上海市浦东新区世纪大道'
        },
        {
          name: '周小伟',
          age: 26,
          birthday: '687024000000',
          address: '深圳市南山区深南大道'
        }
      ];
    }
  }
</script>
```
template 内容与方案一一样，但在 column 的定义上，仍然使用了 render 字段，只不过每个 render 都渲染了一个 div 节点，而这个 div 的内容，是指定来在 `<table-render>` 中定义的 slot-scope。<br />这正是 Render 函数灵活的一个体现，使用 $scopedSlots 可以访问 slot-scope。<br />所以上面这段代码的意思是，name 这一列仍然是使用 Functional Render，只不过 Render 的是一个预先定义好的 slot-scope 模板。<br />有一点需要注意的是，示例中的 data 默认是空数组，而在 mounted 里才赋值的，是因为这样定义的 slot-scope，初始时读取 this.$refs.table.$scopedSlots 是读不到的，会报错，当没有数据时，也就不会去渲染，也就避免了报错。<br />这种方案虽然可行，但归根到底是一种 hack，不是非常推荐，之所以列出来，是为了对 Render 和 slot-scope 有进一步的认识。

## 方案三
这种方案要修改 Table 组件代码，但是用例与方案 1 完全一致。<br />新建一个 slot.js 的文件：
```javascript
// src/components/table-render/slot.js
export default {
  functional: true,
  inject: ['tableRoot'],
  props: {
    row: Object,
    column: Object,
    index: Number
  },
  render: (h, ctx) => {
    return h('div', ctx.injections.tableRoot.$scopedSlots[ctx.props.column.slot]({
      row: ctx.props.row,
      column: ctx.props.column,
      index: ctx.props.index
    }));
  }
};
```
它仍然是一个 Functional Render，使用 inject 注入了父级组件 table.vue 中提供的实例 tableRoot。<br />在 render 里，也是通过方案 2 中使用 $scopedSlots 定义的 slot，不过这是在组件级别定义，对用户来说是透明的，只要按方案 1 的用例来写就可以了。<br />table.vue 也要修改：
```vue
<!-- src/components/table-slot/table.vue 的改写，部分代码省略 -->
<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns">{{ col.title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in data">
        <td v-for="col in columns">
          <template v-if="'render' in col">
            <Render :row="row" :column="col" :index="rowIndex" :render="col.render"></Render>
          </template>
          <template v-else-if="'slot' in col">
            <slot-scope :row="row" :column="col" :index="rowIndex"></slot-scope>
          </template>
          <template v-else>{{ row[col.key] }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import Render from './render.js';
  import SlotScope from './slot.js';

  export default {
    components: { Render, SlotScope },
    provide () {
      return {
        tableRoot: this
      };
    },
    props: {
      columns: {
        type: Array,
        default () {
          return [];
        }
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      }
    }
  }
</script>
```
因为 slot-scope 模板是写在 table.vue 中的（对使用者来说，相当于写在组件 `<table-slot></table-slot>` 之间），所以在 table.vue 中使用 provide 向下提供了 Table 的实例，这样在 slot.js 中就可以通过 inject 访问到它，继而通过 $scopedSlots 获取到 slot。<br />需要注意的是，在 Functional Render 是没有 this 上下文的，都是通过 h 的第二个参数临时上下文 ctx 来访问 prop、inject 等的。<br />方案 3 也是推荐使用的，当 Table 的功能足够复杂，层级会嵌套的比较深，那时方案 1 的 slot 就不会定义在第一级组件中，中间可能会隔许多组件，slot 就要一层层中转，相比在任何地方都能直接使用的 Render 就要麻烦了。<br />所以，如果你的组件层级简单，推荐用第一种方案；<br />如果你的组件已经成型（某 API 基于 Render 函数），但一时间不方便支持 slot-scope，而使用者又想用，那就选方案 2；<br />如果你的组件已经成型（某 API 基于 Render 函数），但组件层级复杂，要按方案 1 那样支持 slot-scope 可能改动较大，还有可能带来新的 bug，那就用方案 3，它不会破坏原有的任何内容，但会额外支持 slot-scope 用法，关键是改动简单。
