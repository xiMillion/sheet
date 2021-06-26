module.exports = {
    // 环境 一个环境定义了一组预定义的全局变量。 参考链接：http://eslint.cn/docs/user-guide/configuring
    env: {
      browser: true,
      es2020: true,
    },
    // 配置原文建中未定义的全局变量 exp： jquery undersocre ；
    globals: {
      underscore: 'writable', // 允许重写变量
      //jQuery: 'readonly', // 只读变量
      Promise: 'off', // 禁用全局变量
    },
    // 编码规范
    extends: ["plugin:@typescript-eslint/recommended"],
    // 解析器
    parser: '@typescript-eslint/parser', //default:espree. paramete: esprima | Babel-ESLint | @typescript-eslint/parser;
    plugins: ["@typescript-eslint"],
    // 解析器选项
    parserOptions: {
      // 指定使用额外的语言特性
      ecmaFeatures: {
        globalReturn: false, // 允许在全局作用使用return语句
        impliedStrict: false, // 启用严格模式（strict mode） >= ECMAScript 5版本；
        jsx: true, // 启用JSX
        experimentalObjectRestSpread: false, // 启用实验性的 object rest/spread properties 支持. 不推荐开启；
      },
      ecmaVersion: 11, // 制定当前使用ECMAScript语法的版本 parameter:2020年份 or 11版本号;
      sourceType: 'module', // parameter: 'script' or 'module';
    },
    // 配置检查规则
    rules: {
        "linebreak-style": [0, "windows"],//换行风格
        "no-multi-spaces": 1,//不能用多余的空格
        "no-multi-str": 2,//字符串不能用换行
        "no-multiple-empty-lines": [1, {"max": 2}],//空行最多不能超过2行
        "indent": [1, 4],//缩进风格,
        "@typescript-eslint/no-explicit-any": ["off"], //关闭any类型的警告
        "@typescript-eslint/no-empty-function": ["off"], //函数未使用
        " @typescript-eslint/explicit-module-boundary-types": ["off"]  //any
    },
  };
  