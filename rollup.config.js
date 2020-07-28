import babel from 'rollup-plugin-babel';

import babelConfig from './babel.config.json';

export default {
  input: 'index.js',

  output: [{ file: 'index.cjs.js', format: 'cjs', sourcemap: true }],

  plugins: [babel(babelConfig)],
};
