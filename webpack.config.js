const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: process.env.NODE_ENV === 'production' ? './src/main.ts' : "./dev/index.ts",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "vuetify-message-snackbar.js",
    library: 'vuetifyMessageSnackbar',
    libraryTarget: 'umd',
    globalObject: 'this'
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        include: [path.join(__dirname, "./src"), path.join(__dirname, "./dev")],
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.js$/,
        include: [path.join(__dirname, "./src"), path.join(__dirname, "./dev")],
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            // Requires sass-loader@^7.0.0
            options: {
              implementation: require("sass"),
              fiber: require("fibers"),
              indentedSyntax: true, // optional
            },
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: require("fibers"),
                indentedSyntax: true, // optional
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],

  mode: process.env.NODE_ENV || "development",
};

if (process.env.NODE_ENV === "production") {
  module.exports.externals = {
    vuetify: 'vuetify',
    vue: 'vue'
  }
} else {
  module.exports.plugins.push(
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "dev/index.html"),
    })
  );
}
