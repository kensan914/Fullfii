module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "~": "./",
          },
          extensions: [".js", ".jsx", ".es", ".es6", ".mjs", ".ts", ".tsx"],
        },
      ],
    ],
    // plugins: [
    //   [
    //     "module-resolver",
    //     {
    //       root: ["./src"],
    //       alias: {
    //         assets: "./assets",
    //         components: "./components",
    //         crud: "./crud",
    //         helpers: "./helpers",
    //       },
    //     },
    //   ],
    // ],
  };
};
