import compiler from '@ampproject/rollup-plugin-closure-compiler';

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
			file: './build/taro.min.js',
			format: 'umd',
			name: 'TARO',
			indent: '\t'
		},
		plugins: [ compiler() ]
	},
	{
		input: './src/Taro.js',
		output: {
			file: './build/taro.module.js',
			format: 'esm'
		}
	} ];
