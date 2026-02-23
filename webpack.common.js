const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Production',
      template: './public/index.html',
      favicon: './public/favicon.ico'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: { ignore: ['**/index.html'] },
        },
      ],
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    },{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
        }
    },{
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
    },{
      test: /\.(png|jpe?g|gif|jp2|webp)$/,
      loader: 'file-loader',
      options: {
        name: 'images/[name].[ext]'
      }
    }
  ],
},
resolve: {
  extensions: ['.tsx', '.ts', '.js'],
},
devServer: {
  historyApiFallback: true,
},
};