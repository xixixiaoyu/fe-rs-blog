- 支持请求和响应拦截器
- 支持取消请求和取消全部请求的功能
- 提供了 GET、POST、PUT、DELETE 四种请求方法
```typescript
import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'

class Request {
	// Axios 实例
	instance: AxiosInstance
	// 存放取消请求控制器
	abortControllerMap: Map<string, AbortController>

	constructor(config: AxiosRequestConfig) {
		// 创建 Axios 实例
		this.instance = axios.create(config)
		// 存储取消请求的控制器
		this.abortControllerMap = new Map()
		// 添加请求拦截器
		this.instance.interceptors.request.use(
			(res: InternalAxiosRequestConfig) => {
				// 创建取消请求的控制器
				const controller = new AbortController()
				// 获取请求的 url
				const url = res.url || ''
				// 将控制器存储到 Map 中
				res.signal = controller.signal
				this.abortControllerMap.set(url, controller)
				return res
			},
			(err: any) => err
		)

		// 添加响应拦截器
		this.instance.interceptors.response.use(
			(res: AxiosResponse) => {
				// 获取响应的 url
				const url = res.config.url || ''
				// 从 Map 中删除对应的控制器
				this.abortControllerMap.delete(url)
				return res.data
			},
			(err: any) => err // 响应拦截器错误处理函数
		)
	}

	// 发送请求的方法，返回 Promise 对象
	request<T>(config: AxiosRequestConfig<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			this.instance
				.request(config)
				.then(res => {
					resolve(res as T)
				})
				.catch((err: any) => {
					reject(err)
				})
		})
	}

	// 取消全部请求
	cancelAllRequest() {
		for (const controller of this.abortControllerMap.values()) {
			controller.abort()
		}
		// 清空 Map
		this.abortControllerMap.clear()
	}

	// 取消指定的请求
	cancelRequest(url: string | string[]) {
		// 将参数转换为数组
		const urlList = Array.isArray(url) ? url : [url]
		urlList.forEach(_url => {
			// 根据 url 获取对应的控制器并取消请求
			this.abortControllerMap.get(_url)?.abort()
			// 从 Map 中删除对应的控制器
			this.abortControllerMap.delete(_url)
		})
	}

	// 发送 GET 请求的方法，返回 Promise 对象
	async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: 'get', url })
	}

	// 发送 POST 请求的方法，返回 Promise 对象
	async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: 'post', url, data })
	}

	// 发送 PUT 请求的方法，返回 Promise 对象
	async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: 'put', url, data })
	}
	// 发送 DELETE 请求的方法，返回 Promise 对象
	async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: 'delete', url })
	}
}

const myRequest = new Request({
	baseURL: 'https://www.fastmock.site/mock/13089f924ad68903046c5a61371475c4',
	timeout: 10000,
})

export default myRequest
```
使用：
```vue
<script setup lang="ts">
import myRequest from "./axios"
import { onMounted } from "vue"

interface Req {
  name: string
}
interface Res {
  code: string
  data: {
    userName: string
  }
}

const getData = (data: Req) => {
  return myRequest.request<Res>({
    url: "/api/user/login",
    method: "POST",
    data
  })
}

onMounted(async () => {
  const res = await getData({
    name: "云牧"
  })
  console.log(res)
})
</script>
```
