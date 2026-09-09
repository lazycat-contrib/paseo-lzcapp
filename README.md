# Paseo for LazyCat

Orchestrate multiple coding agents from desktop and mobile.

上游：https://github.com/getpaseo/paseo

- 包名：`community.lazycat.app.paseo`
- LPK v2，最低系统版本 1.5.0，目标架构 amd64
- 上游 GHCR 镜像通过 `ghcr.1ms.run` 加速，更新时校验目标平台摘要
- 仅发布喵喵商店，不发布懒猫官方商店

## 使用

安装时 `PASEO_PASSWORD` 必填，默认生成 32 位随机密码。`PASEO_HOSTNAMES` 可选，留空使用懒猫应用域名；自定义时使用英文逗号分隔，不带协议和端口，并包含当前应用域名。

打开应用，选择 Direct connection。连接窗口会预填当前域名、端口、TLS 状态和部署密码，请确认后点击连接。自动填充仅针对当前应用地址，切换其他目标会清除自动填入的密码；不会自动提交。浏览器注入的完整运行效果需要安装后验证。

- `/home/paseo` → `/lzcapp/var/paseo-home`：守护进程状态、配置及智能体凭据。
- `/workspace` → `/lzcapp/var/workspace`：代码目录。

两个目录均按应用生命周期管理，卸载前请备份。上游基础镜像不预装智能体 CLI，请按上游说明安装所需 CLI 并认证；写入容器系统目录的额外工具不保证升级后保留。

## 构建与发布

```sh
lzc-cli project release -o dist/community.lazycat.app.paseo-v0.7.2.lpk
```

GitHub Actions 每日检查稳定版镜像，也可手动运行 LazyCat LPK 工作流。构建产物使用 `<package-id>-v<version>.lpk` 命名，创建 GitHub Release 后以该资产 URL 和 SHA256 发布到喵喵商店。已上线版本跳过重复发布。

仓库或授权本仓库的组织 Secrets 需要提供：

- `APPSTORE_URL`：喵喵商店地址
- `APPSTORE_TOKEN`：发布凭据

不需要官方商店凭据。组织 Secrets 是否授权本仓库由实际工作流验证，同名仓库 Secret 优先于组织 Secret。

图标由用户提供，已转换为 512×512 PNG。文件选择器脚本来自懒猫开发者站点。
