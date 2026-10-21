## 命令：initialize

只在选定项目根目录初始化 `.hagicode/monospecs.yaml`。

1. 先读取现有文件。
2. 文件不存在时创建 `.hagicode/`，写入 `version: "1.0"`、`commit_when_archive: false` 和 `repositories: []`。
3. 文件有效时保留原文并报告仓库数量。
4. YAML 或必填字段无效时停止且不得写入，并报告字段级诊断。
5. 任何写入前后都要校验完整配置。
6. 报告路径、动作、校验结果和最终状态。
