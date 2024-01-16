module.exports = {
  plugins: ['@babel/plugin-proposal-explicit-resource-management'],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: { node: 18 },
      },
    ],
    ['@babel/preset-typescript'],
  ],
};
