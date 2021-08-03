/* eslint-disable no-dupe-keys */
/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = (ctx) => ({
  syntax: 'postcss-scss',
  plugins: {
    'postcss-easy-import'        : null,
    'postcss-nested'             : null,
    'postcss-extend-rule'        : null,
    'postcss-css-variables'      : null,
    'autoprefixer'               : null,
    'postcss-custom-media'       : null,
    'postcss-sort-media-queries' : { sort: 'desktop-first'},

    'cssnano' :
      ctx.env == 'production'
        ? { preset: 'advanced' }
        : { preset: 'default' },
  }
});