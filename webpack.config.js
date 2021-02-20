const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry:
    process.env.NODE_ENV === "production" ? "./src/main.ts" : "./dev/index.ts",

  output: {
    path:
      process.env.NODE_ENV === "production"
        ? path.resolve(__dirname, "dist")
        : path.resolve(__dirname, "demo"),
    filename: "vuetify-message-snackbar.js",
    library: "vuetifyMessageSnackbar",
    libraryTarget: "umd",
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

  externals: {
    vue: {
      root: "Vue",
      commonjs: "vue",
      commonjs2: "vue",
      amd: "vue"
    },
    vuetify: {
      root: "Vuetify",
      commonjs: "vuetify",
      commonjs2: "vuetify",
      amd: "vue"
    }
  }
};

if (process.env.NODE_ENV !== "production") {
  module.exports.plugins.push(
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "dev/index.html"),
    })
  );
}
