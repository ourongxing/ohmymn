module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新功能
        "fix", // 修补 bug
        "docs", // 文档
        "note", // 注释或其他文字
        "style", // 格式（不影响代码运行的变动）
        "refactor", // 重构（即不是新增功能，也不是修改 bug 的代码变动）
        "test", // 增加测试
        "perf", // 提高性能
        "chore", // 构建过程或辅助工具的变动
        "release" // 发布新版本
      ]
    ]
  }
}
