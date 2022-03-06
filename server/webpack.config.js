const path = require('path');
const isDevMode = process.env.NODE_ENV !== 'production';
const nodeExternals = require('webpack-node-externals');

const config = {
  entry: {
    server_bundle: [path.resolve(__dirname, "src/server.tsx")]
  },
  devtool: (isDevMode) ? 'source-map' : false,
  mode: (isDevMode) ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: isDevMode ? '[name]_dev.min.js' : '[name].min.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    modules: ['node_modules'],
    fallback: {
      "fs": false,
      "buffer": require.resolve("buffer"),
      "crypto": require.resolve("crypto-browserify"),
      "http": require.resolve("stream-http"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util"),
      "zlib": require.resolve("browserify-zlib"),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.gpx$/i,
        use: ['xml-loader'],
      },
    ],
  },
};

module.exports = config;
