## 命令：add-repository

根据操作说明中的 URL，向 `.hagicode/monospecs.yaml` 添加一个或多个仓库。

1. 读取并校验 `.hagicode/monospecs.yaml` 及其 `repositories` 数组。
2. 从操作说明提取一个或多个合法绝对 URL。
3. 推断仓库名、相对 `path` 和 `displayName`，并使用默认 `tags`；无法可靠推断时停止。
4. 规范化路径，发现重复、缺失字段或非法 URL 时不得写入。
5. 按 URL 输入顺序追加条目，写入前重新校验完整配置。
6. 报告推断值、写入路径、校验结果和最终仓库数量。
