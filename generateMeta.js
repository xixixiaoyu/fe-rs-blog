const fs = require('fs')
const path = require('path')

const whitelist = ['_meta.json', 'generateMeta.js', '.DS_Store']

// 获取当前工作目录
const currentDir = process.cwd()

try {
	// 同步读取目录
	const files = fs.readdirSync(currentDir).filter(item => !whitelist.includes(item))

	// 过滤并映射文件到所需的对象结构
	const result = files
		.filter(file => fs.statSync(path.join(currentDir, file)).isFile())
		.map(file => ({
			type: 'file',
			name: path.parse(file).name,
			label: path.parse(file).name,
		}))

	// 同步写入或覆盖 _meta.json 文件
	fs.writeFileSync(
		path.join(currentDir, '_meta.json'),
		JSON.stringify(result, null, '\t')
	)

	console.log('_meta.json 已成功写入或覆盖到当前工作目录。')
} catch (err) {
	console.error('发生错误:', err)
}
