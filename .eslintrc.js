module.exports = {
  extends: 'standard', // Airbnb 风格
  rules: {
    'no-console': 'off', // 允许在代码中保留 console 命令
  },
  globals: {
    wx: null,
    App: null,
    Page: null,
    getApp: null,
    Component: null,
  },
};
