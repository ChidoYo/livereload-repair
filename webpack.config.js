const fs = require('fs');
const path = require('path');
const SRC_DIR = path.resolve(__dirname, "./src");
const DIST_DIR = path.resolve(__dirname, "dist", "problem");

// compile sass into css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// create a manifest.js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


let mode = "development";

var target = "web";

if (process.env.NODE_ENV === "production") {
  mode = "production";
}

module.exports = {
  mode: mode,
  entry: {
    index: SRC_DIR + '/javascripts/index.js',
    password_field_functions:  SRC_DIR + '/javascripts/field_functions.js',
    application: SRC_DIR + '/stylesheets/application.scss',
    bootstrap_problem: SRC_DIR + '/stylesheets/bootstrap_problem.scss',
  },
  output: {
    filename: 'javascripts/[name].[chunkhash].js',
    path: path.resolve(__dirname, DIST_DIR),
    publicPath: '/problem/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // Extracts CSS into separate files
          'css-loader',               // Translates CSS into CommonJS
          {
            loader: 'sass-loader',   // Compiles Sass to CSS
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, 'src'),
                  path.resolve(__dirname, 'src/stylesheets')
                ],
              }
            }
          }
        ]
      },
      {
        test: /\.js$/, // regex to match .js files
        exclude: /node_modules/,
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    static: path.join(__dirname, 'src'), // Specify the root directory for your static files (e.g., images, styles)
    port: 3050, // Port for the development server
    open: true,
    hot: false, // Enable hot module replacement
    onBeforeSetupMiddleware: function(devServer) {
      devServer.app.use(function(req, res, next) {
        const allowedOrigins = [
          "http://localhost:3000",
          "http://localhost:3002",
          // ... add other origins as needed
        ];
        const origin = req.headers.origin;

        if (allowedOrigins.includes(origin)) {
          res.setHeader("Access-Control-Allow-Origin", origin);
        }

        next();
      });
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].[contenthash].css'
    }),
    new WebpackManifestPlugin({}),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin(),
  ],
};

