export default [
	{
		input: './src/Taro.js',
		output: {
			file: './build/taro.min.js',
			format: 'iife',
			name: 'TARO'
		}
	},
	{
		input: './src/Taro.js',
		output: {
			file: './build/taro.module.js',
			format: 'es'
		}
	} ];
