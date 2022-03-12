module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新功能（feature）
        "fix", // 修补 bug
        "docs", // 文档（documentation）
        "style", // 格式（不影响代码运行的变动）
        "refactor", // 重构（即不是新增功能，也不是修改bug的代码变动）
        "test", // 增加测试
        "pref", // 提高性能
        "chore", // 构建过程或辅助工具的变动
        "release" // 发布新版本
      ]
    ]
  }
}
