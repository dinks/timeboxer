var dest = "./dist"
var src = './src'

module.exports = {
  server: {
    settings: {
      root: dest,
      host: 'localhost',
      port: 3000,
      livereload: {
        port: 35929
      }
    }
  },
  less: {
    src: src + "/styles/**/*.less",
    dest: dest + "/styles"
  },
  copy_styles: {
    src: src + "/styles/*.css",
    dest: dest + "/styles"
  },
  copy_fonts: {
    src: src + "/fonts/glyphicons-halflings-regular.*",
    dest: dest + "/fonts"
  },
  browserify: {
    opts: {
      fullPaths: true,
      debug: true,
      extensions: ['.coffee', '.js']
    },
    settings: {
      transform: [
        [ "riotify" ],
        [ "coffeeify", {"extension": "coffee"} ]
      ]
    },
    src: src + '/js/index.coffee',
    dest: dest + '/js',
    outputName: 'index.js'
  },
  minify: {
    src: dest + "/js/index.js",
    minName: 'index.min.js',
    dest: dest + '/js'
  },
  html: {
    src: 'src/index.html',
    dest: dest
  },
  jest: {
    rootDir: './',
    testFileExtensions: [ 'js', 'json', 'coffee' ],
    testPathIgnorePatterns: [ 'node_modules', '__tests__/support' ],
    unmockedModulePathPatterns: [ 'node_modules/riot', 'node_modules/flux-riot',
      'support/helper.coffee', 'object-assign', 'keymirror' ],
    scriptPreprocessor: './build/support/preprocessor.js'
  },
  watch: {
    src: 'src/**/*.*',
    tasks: ['build']
  }
}
