## 执行规则

### MonoSpecs 基础说明

MonoSpecs 是项目级的仓库配置规范，通过项目根目录下的 `.hagicode/monospecs.yaml` 描述受管理的子仓库及其展示元数据。该文件是仓库清单、顺序、显示名称和标签等信息的来源。

基本结构如下：

```yaml
version: "1.0"
commit_when_archive: false
repositories:
  - name: repository-name
    url: https://github.com/owner/repository
    path: repos/repository
    displayName: Repository
    tags: []
    ui:
      collapseToMore: false
```

### 写入边界

- 所有操作都必须遵循执行上下文中给出的选定项目根目录的写入边界。
- 执行上下文中只读参考范围里的仓库和其他参考资料均为只读，不得创建、修改或删除其中的文件。
- 不得执行提交、推送或发布。
