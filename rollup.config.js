import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const getPlugins = () => [
  external(),
  resolve(),
  babel({
    comments: true,
    exclude: 'node_modules/**',
  }),
  commonjs(),
];

export default [
  {
    input: 'src/index.js',
    output: {
      globals: {
        react: 'React',
      },
      name: 'DynamicModuleLoader',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
    },
    plugins: getPlugins().concat([uglify()]),
  },
  {
    input: 'src/index.js',
    external: ['react'],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: getPlugins(),
  },
];
