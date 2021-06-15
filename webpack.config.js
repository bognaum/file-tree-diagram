const path = require('path');

module.exports = {
	context: __dirname,
	entry: './wp-enter-point.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'ftd-bundle.js',
		library: "FileTreeDiagram",
	},
	mode: 'none', 
	devtool: "source-map",
};