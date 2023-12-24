```typescript
interface LocalStorageItem<T> {
  value: T // 存储的值
  expire: number | null // 过期时间，如果为 null 则表示永不过期
}

class LocalStorage {
  private static instance: LocalStorage // 单例模式，保证只有一个实例
  private storage: Storage // localStorage 对象

  private constructor() {
    this.storage = window.localStorage // 获取 localStorage 对象
  }

  public static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      // 如果实例不存在，则创建一个新实例
      LocalStorage.instance = new LocalStorage()
    }
    return LocalStorage.instance // 返回实例
  }

  public setItem<T>(key: string, value: T, expire?: number): void {
    const item: LocalStorageItem<T> = {
      value: value, // 存储的值
      expire: expire ? new Date().getTime() + expire : null, // 过期时间
    }
    this.storage.setItem(key, JSON.stringify(item)) // 将对象序列化为字符串并存储到 localStorage 中
  }

  public getItem<T>(key: string): T | null {
    const itemStr = this.storage.getItem(key) // 获取存储的字符串
    if (itemStr) {
      // 如果字符串存在
      const item: LocalStorageItem<T> = JSON.parse(itemStr) // 将字符串反序列化为对象
      if (!item.expire || new Date().getTime() < item.expire) {
        // 如果没有过期或者还没有过期
        return item.value // 返回存储的值
      } else {
        this.storage.removeItem(key) // 如果已经过期，则删除该项
      }
    }
    return null // 如果不存在或者已经过期，则返回 null
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key) // 删除指定的项
  }

  public clear(): void {
    this.storage.clear() // 清空 localStorage
  }
}

export default LocalStorage.getInstance() // 导出 LocalStorage 实例
```

使用：
```typescript
<script lang="ts" setup>
import storage from "./storage"

// 存储数据
storage.setItem("name", "黛玉", 60 * 60 * 1000) // 存储一个过期时间为 1 小时的数据
storage.setItem("person", { name: "云牧" }, 60 * 60 * 1000) // 存储一个过期时间为 1 小时的数据

interface Person {
  name: string
}

// 获取数据
const name = storage.getItem<string>("name")
const person = storage.getItem<Person>("person")
console.log(name) // 黛玉
console.log(person.name) // 云牧

// 删除数据
storage.removeItem("name")

// 清空所有数据
storage.clear()
</script>
```
