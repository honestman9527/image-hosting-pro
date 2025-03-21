import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, Button, Card, message, Alert, Switch, Radio } from 'antd';
import { GithubOutlined, LinkOutlined, SaveOutlined, QuestionCircleOutlined, GlobalOutlined } from '@ant-design/icons';
import { Octokit } from '@octokit/rest';
import './Settings.css';

const { Title, Paragraph, Text } = Typography;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('github-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      token: '',
      owner: '',
      repo: '',
      branch: 'main',
      path: 'images',
      customDomain: '',
      language: 'zh' // 默认语言为中文
    };
  });
  
  // 语言文本
  const texts = {
    zh: {
      title: '设置',
      subtitle: '配置您的GitHub仓库信息和自定义CDN链接',
      githubSettings: 'GitHub设置',
      token: 'GitHub访问令牌',
      tokenRequired: '请输入GitHub访问令牌',
      tokenExtra: '需要具有repo权限的个人访问令牌',
      tokenPlaceholder: '输入GitHub访问令牌',
      owner: '仓库所有者',
      ownerRequired: '请输入仓库所有者',
      ownerExtra: '您的GitHub用户名或组织名称',
      ownerPlaceholder: '输入仓库所有者',
      repo: '仓库名称',
      repoRequired: '请输入仓库名称',
      repoExtra: '用于存储图片的GitHub仓库名称',
      repoPlaceholder: '输入仓库名称',
      branch: '分支名称',
      branchRequired: '请输入分支名称',
      branchExtra: '存储图片的分支，通常为main或master',
      branchPlaceholder: '输入分支名称',
      path: '存储路径',
      pathRequired: '请输入存储路径',
      pathExtra: '仓库中存储图片的目录路径，不需要前导斜杠',
      pathPlaceholder: '输入存储路径',
      testConnection: '测试连接',
      cdnSettings: 'CDN设置',
      customDomain: '自定义CDN域名',
      customDomainExtra: '可选，用于替代GitHub原始链接的自定义CDN域名，例如：https://cdn.example.com',
      customDomainPlaceholder: '输入自定义CDN域名（可选）',
      saveSettings: '保存设置',
      about: '关于GitHub图床',
      aboutContent: '本工具使用GitHub仓库作为图片存储空间，通过GitHub API上传图片并生成可用于博客的链接。',
      howToGetToken: '如何获取GitHub访问令牌：',
      tokenStep1: '访问',
      tokenStep1Link: 'GitHub令牌设置页面',
      tokenStep2: '点击 "Generate new token" (生成新令牌)',
      tokenStep3: '选择 "repo" 权限范围',
      tokenStep4: '生成并复制令牌',
      tokenStep5: '将令牌粘贴到上方的GitHub访问令牌输入框中',
      languageSettings: '语言设置',
      languageLabel: '界面语言',
      errorMessage: '请先填写GitHub令牌、所有者和仓库名',
      connectionSuccess: '连接成功！您的GitHub设置正常工作',
      branchNotExist: '分支 "{branch}" 不存在，请创建此分支或使用现有分支',
      connectionFailed: '连接失败: {error}',
      saveSuccess: '设置已保存',
      saveFailed: '保存设置失败'
    },
    en: {
      title: 'Settings',
      subtitle: 'Configure your GitHub repository information and custom CDN links',
      githubSettings: 'GitHub Settings',
      token: 'GitHub Access Token',
      tokenRequired: 'Please enter GitHub access token',
      tokenExtra: 'Personal access token with repo permission',
      tokenPlaceholder: 'Enter GitHub access token',
      owner: 'Repository Owner',
      ownerRequired: 'Please enter repository owner',
      ownerExtra: 'Your GitHub username or organization name',
      ownerPlaceholder: 'Enter repository owner',
      repo: 'Repository Name',
      repoRequired: 'Please enter repository name',
      repoExtra: 'GitHub repository name for storing images',
      repoPlaceholder: 'Enter repository name',
      branch: 'Branch Name',
      branchRequired: 'Please enter branch name',
      branchExtra: 'Branch for storing images, usually main or master',
      branchPlaceholder: 'Enter branch name',
      path: 'Storage Path',
      pathRequired: 'Please enter storage path',
      pathExtra: 'Directory path in the repository for storing images, no leading slash needed',
      pathPlaceholder: 'Enter storage path',
      testConnection: 'Test Connection',
      cdnSettings: 'CDN Settings',
      customDomain: 'Custom CDN Domain',
      customDomainExtra: 'Optional, custom CDN domain to replace GitHub raw links, e.g.: https://cdn.example.com',
      customDomainPlaceholder: 'Enter custom CDN domain (optional)',
      saveSettings: 'Save Settings',
      about: 'About GitHub Image Hosting',
      aboutContent: 'This tool uses GitHub repository as image storage space, uploads images via GitHub API and generates links for blog use.',
      howToGetToken: 'How to get GitHub access token:',
      tokenStep1: 'Visit',
      tokenStep1Link: 'GitHub token settings page',
      tokenStep2: 'Click "Generate new token"',
      tokenStep3: 'Select "repo" permission scope',
      tokenStep4: 'Generate and copy the token',
      tokenStep5: 'Paste the token into the GitHub access token input box above',
      languageSettings: 'Language Settings',
      languageLabel: 'Interface Language',
      errorMessage: 'Please fill in GitHub token, owner and repository name first',
      connectionSuccess: 'Connection successful! Your GitHub settings are working properly',
      branchNotExist: 'Branch "{branch}" does not exist, please create this branch or use an existing branch',
      connectionFailed: 'Connection failed: {error}',
      saveSuccess: 'Settings saved',
      saveFailed: 'Failed to save settings'
    }
  };
  
  // 获取当前语言的文本
  const t = texts[settings.language || 'zh'];

  // 初始化表单值
  useEffect(() => {
    form.setFieldsValue(settings);
  }, [form, settings]);

  // 保存设置
  const handleSave = async (values) => {
    setLoading(true);
    try {
      // 保存到本地存储
      localStorage.setItem('github-settings', JSON.stringify(values));
      setSettings(values);
      message.success(t.saveSuccess);
    } catch (error) {
      console.error('保存设置失败:', error);
      message.error(t.saveFailed);
    } finally {
      setLoading(false);
    }
  };
  
  // 切换语言
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    const newSettings = { ...settings, language: newLanguage };
    localStorage.setItem('github-settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  // 测试GitHub连接
  const testConnection = async () => {
    const values = form.getFieldsValue();
    if (!values.token || !values.owner || !values.repo) {
      message.error(t.errorMessage);
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      const octokit = new Octokit({ auth: values.token });
      
      // 测试仓库访问
      const { data: repo } = await octokit.repos.get({
        owner: values.owner,
        repo: values.repo
      });
      
      // 检查分支是否存在
      const { data: branches } = await octokit.repos.listBranches({
        owner: values.owner,
        repo: values.repo
      });
      
      const branchExists = branches.some(branch => branch.name === values.branch);
      
      if (!branchExists) {
        setTestResult({
          success: false,
          message: t.branchNotExist.replace('{branch}', values.branch)
        });
        return;
      }
      
      // 尝试创建测试文件
      const testPath = `${values.path}/test-connection.txt`;
      const testContent = `测试连接 - ${new Date().toISOString()}`;
      
      await octokit.repos.createOrUpdateFileContents({
        owner: values.owner,
        repo: values.repo,
        path: testPath,
        message: '测试连接',
        content: Buffer.from(testContent).toString('base64'),
        branch: values.branch
      });
      
      // 删除测试文件
      const { data: fileData } = await octokit.repos.getContent({
        owner: values.owner,
        repo: values.repo,
        path: testPath,
        ref: values.branch
      });
      
      await octokit.repos.deleteFile({
        owner: values.owner,
        repo: values.repo,
        path: testPath,
        message: '删除测试文件',
        sha: fileData.sha,
        branch: values.branch
      });
      
      setTestResult({
        success: true,
        message: t.connectionSuccess
      });
      
    } catch (error) {
      console.error('测试连接失败:', error);
      setTestResult({
        success: false,
        message: t.connectionFailed.replace('{error}', error.message || '未知错误')
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <Typography className="settings-header">
        <Title level={2}>{t.title}</Title>
        <Paragraph>
          {t.subtitle}
        </Paragraph>
      </Typography>
      
      <Card title={t.languageSettings} className="settings-card" extra={<GlobalOutlined />}>
        <div className="language-selector">
          <Radio.Group value={settings.language || 'zh'} onChange={handleLanguageChange}>
            <Radio.Button value="zh">中文</Radio.Button>
            <Radio.Button value="en">English</Radio.Button>
          </Radio.Group>
        </div>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={settings}
      >
        <Card title={t.githubSettings} className="settings-card" extra={<GithubOutlined />}>
          <Form.Item
            name="token"
            label={t.token}
            rules={[{ required: true, message: t.tokenRequired }]}
            extra={t.tokenExtra}
          >
            <Input.Password placeholder={t.tokenPlaceholder} />
          </Form.Item>

          <Form.Item
            name="owner"
            label={t.owner}
            rules={[{ required: true, message: t.ownerRequired }]}
            extra={t.ownerExtra}
          >
            <Input placeholder={t.ownerPlaceholder} />
          </Form.Item>

          <Form.Item
            name="repo"
            label={t.repo}
            rules={[{ required: true, message: t.repoRequired }]}
            extra={t.repoExtra}
          >
            <Input placeholder={t.repoPlaceholder} />
          </Form.Item>

          <Form.Item
            name="branch"
            label={t.branch}
            rules={[{ required: true, message: t.branchRequired }]}
            extra={t.branchExtra}
          >
            <Input placeholder={t.branchPlaceholder} />
          </Form.Item>

          <Form.Item
            name="path"
            label={t.path}
            rules={[{ required: true, message: t.pathRequired }]}
            extra={t.pathExtra}
          >
            <Input placeholder={t.pathPlaceholder} />
          </Form.Item>

          <div className="test-connection">
            <Button 
              type="default" 
              onClick={testConnection} 
              loading={testLoading}
              icon={<QuestionCircleOutlined />}
            >
              {t.testConnection}
            </Button>
            
            {testResult && (
              <Alert
                className="test-result"
                message={testResult.message}
                type={testResult.success ? 'success' : 'error'}
                showIcon
              />
            )}
          </div>
        </Card>

        <Card title={t.cdnSettings} className="settings-card" extra={<LinkOutlined />}>
          <Form.Item
            name="customDomain"
            label={t.customDomain}
            extra={t.customDomainExtra}
          >
            <Input placeholder={t.customDomainPlaceholder} />
          </Form.Item>

          <Form.Item className="settings-actions">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              {t.saveSettings}
            </Button>
          </Form.Item>
        </Card>
      </Form>

      <Card title={t.about} className="settings-card about-card">
        <Paragraph>
          {t.aboutContent}
        </Paragraph>
        <Paragraph>
          <Text strong>{t.howToGetToken}</Text>
        </Paragraph>
        <ol className="token-steps">
          <li>{t.tokenStep1} <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">{t.tokenStep1Link}</a></li>
          <li>{t.tokenStep2}</li>
          <li>{t.tokenStep3}</li>
          <li>{t.tokenStep4}</li>
          <li>{t.tokenStep5}</li>
        </ol>
      </Card>
    </div>
  );
};

export default Settings;