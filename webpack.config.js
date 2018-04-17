
module.exports = {

  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  //Server
  devServer: {
     inline: true,
     port: 3003               //Cổng: 3003
  },
  // resolve: {
  //   root: __dirname,
  //   alias: {
  //     HomePage: '/components/HomePage.js',
  //     Account: '/components/Account.js',
  //     Main: '/components/Main.js',
  //     Nav: '/components/Nav.js',
  //     Transaction: '/components/Transaction.js'
  //   },
  //    extensions: ['', '.js', '.jsx']
  // },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }

      },
      {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader'],
      }
    ]
  }
};
