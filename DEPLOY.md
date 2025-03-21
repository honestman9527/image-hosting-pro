# 部署到Netlify指南

本文档提供了将GitHub图床工具部署到Netlify的详细步骤。

## 前提条件

- 已有GitHub账号
- 已有Netlify账号
- 项目代码已上传到GitHub仓库

## 部署步骤

### 1. 准备工作

项目中已包含`netlify.toml`配置文件，其中定义了构建命令和发布目录：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. 在Netlify上部署

1. 登录[Netlify官网](https://www.netlify.com/)
2. 点击"New site from Git"按钮
3. 选择"GitHub"作为Git提供商
4. 授权Netlify访问您的GitHub账户
5. 选择包含GitHub图床工具的仓库
6. 配置部署设置：
   - 构建命令：`npm run build`（已在netlify.toml中配置）
   - 发布目录：`dist`（已在netlify.toml中配置）
7. 点击"Deploy site"按钮开始部署

### 3. 等待部署完成

部署过程通常需要几分钟时间。Netlify会自动执行以下步骤：
- 克隆您的GitHub仓库
- 安装依赖（`npm install`）
- 运行构建命令（`npm run build`）
- 部署生成的静态文件

### 4. 配置自定义域名（可选）

1. 在Netlify站点控制面板中，点击"Domain settings"
2. 点击"Add custom domain"
3. 输入您的域名并按照指示完成DNS配置

### 5. 环境变量配置（可选）

如果您的应用需要环境变量，可以在Netlify控制面板中设置：

1. 进入站点控制面板
2. 点击"Site settings" > "Build & deploy" > "Environment"
3. 点击"Edit variables"添加所需的环境变量

## 持续部署

Netlify会自动监听您GitHub仓库的变更。当您推送新的提交到仓库时，Netlify将自动重新构建和部署您的站点。

## 注意事项

- 本应用使用localStorage存储数据，这意味着数据仅保存在用户的浏览器中
- 确保您的GitHub令牌具有足够的权限来访问和修改指定的仓库
- 如果遇到构建错误，可以在Netlify控制面板中查看构建日志进行排查

## 常见问题

### Q: 部署后页面刷新出现404错误？
A: 已通过netlify.toml中的重定向规则解决此问题，确保SPA路由正常工作。

### Q: 如何查看部署日志？
A: 在Netlify控制面板中，点击"Deploys"标签，然后选择具体的部署记录查看日志。