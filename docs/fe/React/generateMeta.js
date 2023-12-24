const fs = require('fs');
const path = require('path');

const whitelist = ['_meta.json', 'generateMeta.js', '.DS_Store'];

// 扫描当前目录
fs.readdir('.', (err, files) => {
	if (err) {
		console.error('Error reading the directory', err);
		return;
	}

	files = files.filter(item => !whitelist.includes(item));

	// 过滤并映射文件到所需的对象结构
	const result = files
		.filter(file => fs.statSync(file).isFile())
		.map(file => ({
			type: 'file',
			name: file,
			label: file,
		}));

	// 写入 _meta.json 文件
	fs.writeFile('_meta.json', JSON.stringify(result, null, '\t'), err => {
		if (err) {
			console.error('Error writing _meta.json', err);
		} else {
			console.log('_meta.json has been saved.');
		}
	});
});
