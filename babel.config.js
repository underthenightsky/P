// module.exports = {
//   presets: ['babel-preset-expo'],
//   env: {
//     production: {
//       plugins: ['react-native-paper/babel',
//         `@babel/plugin-transform-private-methods`],
//     },
//   },
// };
module.exports = {
  presets: ['babel-preset-expo'],
  overrides: [{
    "plugins": [
      ["@babel/plugin-transform-private-methods", {
      "loose": true
    }]
    ]
  }]
};