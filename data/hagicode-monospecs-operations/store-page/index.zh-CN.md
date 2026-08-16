---
locale: zh-CN
slug: hagicode-monospecs-operations
title: HagiCode MonoSpecs 操作
summary: 通过结构化任务初始化 MonoSpecs 配置、批量添加仓库并按活跃状态调整仓库顺序。
eyebrow: Task Preset Store
status: experimental
primaryCtaLabel: 安装任务预设
secondaryCtaLabel: 查看操作契约
catalog:
  - configuration
  - repositories
tags:
  - monospecs
  - bilingual
  - validation
badges:
  - 只写入选定项目
  - 参考仓库只读
  - 写入前校验
---

HagiCode MonoSpecs 操作提供三个结构化命令：`initialize` 创建缺失的 `.hagicode/monospecs.yaml`，`add-repository` 接收一个或多个绝对 URL 并自动推断仓库元数据，`reorder-repositories` 根据可观察的活跃信号生成排序预览。

## 它做什么

### 初始化可用配置

`initialize` 会创建缺失的 MonoSpecs 配置，但不会覆盖已有文件，确保后续操作可以在预期结构上持续校验。

### 根据规范 URL 添加仓库

`add-repository` 接收绝对 GitHub URL，推断仓库名称和本地路径，并在提出变更前拒绝格式错误的 URL、重复项和不安全的路径冲突。

### 只调整顺序不改仓库数据

`reorder-repositories` 根据可观察的活跃信号生成排序建议，展示预览并要求明确确认，最终只改变 `repositories` 数组顺序。

## 使用前注意

- 将 MonoSpecs 项目选择为 `write` 目标。
- 将附加仓库保持为 `read` 只读参考；它们用于提供上下文，不是写入目标。
- 提供规范的绝对仓库 URL，并在确认添加前检查推断出的本地路径。

## 安全边界

每个候选配置都会在写入前完整复核。校验失败、发现重复项或未获得确认时，配置不会改变。

## 适用场景

- 最适合：初始化 MonoSpecs、纳入仓库，以及经过审阅的基于活跃度排序调整。
- 不适合：编辑应用源码、修改仓库元数据，或静默重写无关配置。
