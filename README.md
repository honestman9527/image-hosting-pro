# HM 图床

一个基于 React 和 Ant Design 的现代化 GitHub 图床工具，支持通过 Gist 进行多设备同步。

![应用截图](https://user-images.githubusercontent.com/11287090/211221193-4e4431e4-396a-49a5-a7b2-c063b4f6e3c5.png)

---

## ✨ 功能特性

*   **GitHub 仓库存储**: 使用您自己的 GitHub 仓库作为稳定、免费的图片存储后端。
*   **现代化 UI**: 基于 Ant Design 的清爽、响应式用户界面。
*   **图片上传**: 支持拖拽或点击选择图片，自动上传到指定的 GitHub 仓库。
*   **图片管理**: 浏览、搜索、复制链接和删除已上传的图片。
*   **多设备同步**: 通过 GitHub Gist 自动同步您的配置和上传历史，在任何设备上保持一致体验。
*   **自定义域名**: 支持配置 CDN 加速域名，优化图片访问速度。
*   **多语言支持**: 内置中文和英文语言包。
*   **一键部署**: 可轻松部署到 Cloudflare Pages 或其他静态网站托管平台。
*   **安全可靠**: GitHub 令牌通过环境变量配置，不会泄露到客户端代码中。

---

## 🚀 工作原理

本工具巧妙地利用了 GitHub 提供的两种服务：

1.  **GitHub Repository**: 作为图片文件的存储空间。当您上传一张图片时，应用会通过 GitHub API 将图片推送到您指定的仓库和目录中。
2.  **GitHub Gist**: 作为配置文件 (`settings.json`) 和上传历史 (`history.json`) 的数据库。当您启用云同步后，所有配置和记录都会被安全地存储在一个私密的 Gist 中，从而实现多设备数据同步。

---

## 部署

推荐使用 [Cloudflare Pages](https://pages.cloudflare.com/) 进行部署，以获得最佳体验。

### 1. Fork 本项目

首先，将本项目 Fork 到您自己的 GitHub 账户下。

### 2. 创建 GitHub 个人访问令牌 (PAT)

为了让应用能够访问您的 GitHub 仓库和 Gist，您需要创建一个具有相应权限的个人访问令牌。

1.  访问 [GitHub 令牌设置页面](https://github.com/settings/tokens/new)。
2.  **Note**: 填写一个容易辨识的令牌名称，例如 `image-hosting-pro-token`。
3.  **Expiration**: 选择一个合适的过期时间。
4.  **Scopes**: **必须** 同时勾选 `repo` 和 `gist` 两个权限。这是应用正常工作（上传图片和同步设置）所必需的。
5.  点击 "Generate token" 并 **立即复制生成的新令牌**，这个令牌只会显示一次。

### 3. 在 Cloudflare Pages 中部署

1.  登录到您的 Cloudflare 仪表板，然后转到 **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**。
2.  选择您刚刚 Fork 的项目仓库。
3.  在 **Build settings** 步骤中，配置如下：
    *   **Framework preset**: `Vite`
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
4.  展开 **Environment variables** 部分，添加一个环境变量：
    *   **Variable name**: `VITE_GITHUB_TOKEN`
    *   **Value**: 粘贴您在第二步中创建的 GitHub 个人访问令牌。
    *   强烈建议点击旁边的锁形图标加密此变量。
5.  点击 **Save and Deploy**，等待部署完成。

部署成功后，您就可以通过 Cloudflare 提供的域名访问您的图床了。

---

## ⚙️ 应用配置

访问您部署好的图床网站，并进入 **设置** 页面。

*   **仓库所有者**: 您的 GitHub 用户名或组织名。
*   **仓库名称**: 您希望用来存储图片的仓库名称（需要预先创建好）。
*   **分支名称**: 存储图片的分支，通常是 `main` 或 `master`。
*   **存储路径**: 图片在仓库中存放的目录，例如 `images`。
*   **启用云同步**: 强烈建议开启此选项，它会自动将您的设置和上传历史同步到云端 Gist。

配置完成后，点击 **保存设置**。

---

## 💻 本地开发

如果您希望在本地运行或进行二次开发，请按照以下步骤操作：

1.  **克隆代码**:
    ```bash
    git clone https://github.com/your-username/image-hosting-pro.git
    cd image-hosting-pro
    ```

2.  **安装依赖**:
    ```bash
    npm install
    ```

3.  **配置环境变量**:
    在项目根目录下创建一个 `.env.local` 文件，并添加您的 GitHub 令牌：
    ```
    VITE_GITHUB_TOKEN=your_github_personal_access_token
    ```

4.  **启动项目**:
    ```bash
    npm run dev
    ```

    现在，应用将在本地启动，通常地址为 `http://localhost:5173`。

---

## 🛠️ 技术栈

*   **前端框架**: [React](https://reactjs.org/)
*   **UI 组件库**: [Ant Design](https://ant.design/)
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **路由**: [React Router](https://reactrouter.com/)
*   **GitHub API**: [Octokit.js](https://github.com/octokit/octokit.js)

---

## 📄 许可证

[MIT](LICENSE) © 2024
