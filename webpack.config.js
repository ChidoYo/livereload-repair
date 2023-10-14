const fs = require('fs');
const path = require('path');
const SRC_DIR = path.resolve(__dirname, "./src");
const DIST_DIR = path.resolve(__dirname, "dist", "orbit");

// compile sass into css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// create a manifest.js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// let allTemplateNames = ['index', 'web_components']; // add more template names in array if needed
// let allHtmlTemplatePlugins = allTemplateNames.map(name => {
//   return new HtmlWebpackPlugin({
//     title: 'Orbit',
//     template: `src/${name}.html`,
//     // filename: `${name}.html`, // output HTML files
//     // chunks: [`${name}`] // respective JS files
//   })
// });


let mode = "development";

var target = "web";

if (process.env.NODE_ENV === "production") {
  mode = "production";
}

module.exports = {
  mode: mode,
  entry: {
    // index: path.resolve(__dirname, 'src/javascripts/index.js')
    index: SRC_DIR + '/javascripts/index.js',
    password_field_functions:  SRC_DIR + '/javascripts/password_field_functions.js',
    // application: SRC_DIR + '/stylesheets/application.scss',
    // bootstrap_orbit: SRC_DIR + '/stylesheets/bootstrap_orbit.scss',
    web_components: SRC_DIR + '/javascripts/web_components.js'
  },
  output: {
    // filename: 'javascripts/[name].[chunkhash].js',
    // path: path.resolve(__dirname, DIST_DIR),
    // publicPath: '/orbit/'
    path: path.resolve(__dirname, 'dist'),
    filename: 'javascripts/[name].[chunkhash].js',
    clean: true,
    assetModuleFilename: '[name][ext]'
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
  devtool: 'inline-source-map',
  devServer: {
    // static: path.join(__dirname, 'src'), // Specify the root directory for your static files (e.g., images, styles)
    static: {
      directory: path.resolve(__dirname, 'src')
    },
    port: 3050, // Port for the development server
    open: true,
    hot: true, // Enable hot module replacement
    compress: true,
    historyApiFallback: true,
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
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].[contenthash].css'
    }),
    new WebpackManifestPlugin({}),
    new HtmlWebpackPlugin({
      title: 'Orbit',
      template: 'src/index.html',
      // inject: true,
      chunks: ['index', 'password_field_functions', 'web_components'],
      filename: 'index.html'
      // filename: 'index.html' // this is for build to prod
    }),
    new HtmlWebpackPlugin({
      title: 'Orbit',
      template: 'src/web_components.html',
      // inject: true,
      chunks: ['index', 'password_field_functions', 'web_components'],
      filename: 'web_components.html'
      // filename: 'index.html' // this is for build to prod
    }),
    new CleanWebpackPlugin(),
  ]
};

