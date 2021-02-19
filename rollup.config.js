export default [
	{
		input: './src/Taro.js',
		output: {
			file: './build/taro.js',
			format: 'umd',
			name: 'TARO',
			indent: '\t'
		}
	},
	{
		input: './src/Taro.js',
		output: {
			file: './build/taro.module.js',
			format: 'esm'
		}
	} ];
