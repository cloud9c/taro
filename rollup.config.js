import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { babel } from '@rollup/plugin-babel';

const babelrc = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				targets: '>1%',
				loose: true,
				bugfixes: true,
			}
		]
	]
};

function babelCleanup() {

	const doubleSpaces = / {2}/g;

	return {

		transform( code ) {

			code = code.replace( doubleSpaces, '\t' );

			return {
				code: code,
				map: null
			};

		}

	};

}

export default [
	{
		input: './src/Taro.js',
		output: {
			file: './build/taro.js',
			format: 'umd',
			name: 'TARO',
			indent: '\t'
		},
		plugins: [
			babel( {
				babelHelpers: 'bundled',
				compact: false,
				babelrc: false,
				...babelrc
			} ),
			babelCleanup()
		]
	},
	{
		input: './src/Taro.js',
		output: {
			file: './build/taro.min.js',
			format: 'umd',
			name: 'TARO',
			indent: '\t'
		},
		plugins: [
			babel( {
				babelHelpers: 'bundled',
				compact: false,
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
			compiler()
		]
	},
	{
		input: './src/Taro.js',
		output: {
			file: './build/taro.module.js',
			format: 'esm'
		}
	} ];
