module.exports = {
    entry: [
      './src/index.js',
    ],
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: "babel-loader"
          }, {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: "babel-loader"
          },
          {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
          }
        ]
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      inline: false,
      contentBase: './dist'
    }
  };