# GitHub图床工具

基于React的GitHub图床工具，用于轻松上传和管理图片到GitHub仓库，并生成可用于博客等场景的图片链接。

## 主要功能

- **图片上传**：支持拖拽上传、批量上传、图片压缩和格式转换
- **图片管理**：查看所有已上传图片，支持网格视图和时间线视图
- **多种链接格式**：支持原始链接、Markdown、HTML和BBCode格式
- **云同步**：通过GitHub Gist同步配置和上传历史，实现多设备数据同步
- **多语言支持**：支持中文和英文界面

## 技术栈

- React 18
- Ant Design 5
- React Router DOM 7
- Octokit/rest (GitHub API)
- Compressorjs (图片压缩)
- React-Dropzone (拖拽上传)
- Vite 6 (构建工具)

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build
```

## 云同步功能

本工具支持通过GitHub Gist实现配置和上传历史的云同步，使您可以在多台设备上使用相同的配置和查看相同的上传历史。

### 使用方法

1. 确保您的GitHub令牌具有`repo`和`gist`权限
2. 在设置页面启用"云同步"选项
3. 点击"立即同步"按钮进行手动同步
4. 在图片管理页面可以通过"从云端同步"按钮更新历史记录

### 注意事项

- 云同步功能需要GitHub令牌具有`gist`权限
- 同步数据存储在私有Gist中，确保您的令牌安全
- 首次启用同步时，会自动创建配置Gist

## 部署

本项目可以部署到Netlify等静态网站托管服务，详细部署步骤请参考[部署指南](./DEPLOY.md)。

## 许可证

MIT
