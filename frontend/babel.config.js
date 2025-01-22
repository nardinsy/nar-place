// {
//   "presets": ["react-app"],
//   "plugins": ["@babel/plugin-proposal-class-properties"],
//   "target": "18.2.0"
// }

const ReactCompilerConfig = {
  /* ... */
};

module.exports = function () {
  return {
    plugins: [
      ["babel-plugin-react-compiler", ReactCompilerConfig], // must run first!
      // ...
    ],
  };
};
