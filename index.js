const fs = require('fs');

// 读取当前文件夹的文件
fs.readdir(__dirname, (err, files) => {
	if (err) {
		console.log('读取文件夹失败：', err);
		return;
	}

	// 输出文件列表
	console.log('当前文件夹的文件：');
	files.forEach(file => {
		console.log(file);
	});
});
