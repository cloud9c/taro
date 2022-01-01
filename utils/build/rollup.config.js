import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

function glsl() {

	return {

		transform( code, id ) {

			if ( /\.glsl.js$/.test( id ) === false ) return;

			code = code.replace( /\/\* glsl \*\/\`((.|\r|\n)*)\`/, function ( match, p1 ) {

				return JSON.stringify(
					p1
						.trim()
						.replace( /\r/g, '' )
						.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
						.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
						.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
				);

			} );

			return {
				code: code,
				map: null
			};

		}

	};

}

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

function header() {

	return {

		renderChunk( code ) {

			return `/**
 * @license
 * Copyright 2020-2021 Taro.js Authors
 * SPDX-License-Identifier: MIT
 */
${ code }`;

		}

	};

}

const babelrc = {
  presets: [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": ">1%",
        "loose": true,
        "bugfixes": true
      }
    ]
  ],
  plugins: [
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose": true
      }
    ]
  ]
};


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
			nodeResolve(),
			glsl(),
			babel( {
				babelHelpers: 'bundled',
				compact: false,
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
			header()
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
			nodeResolve(),
			glsl(),
			babel( {
				babelHelpers: 'bundled',
				compact: false,
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
			terser(),
			header()
		]
	},
	{
		input: './src/Taro.js',
		output: {
			file: './build/taro.module.js',
			format: 'esm',
			plugins: [
				glsl(),
				header()
			]
		}
	} ];
