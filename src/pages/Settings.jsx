import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, Button, Card, message, Alert, Switch, Radio, Spin, Divider, Badge } from 'antd';
import { GithubOutlined, LinkOutlined, SaveOutlined, QuestionCircleOutlined, GlobalOutlined, CloudSyncOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { Octokit } from '@octokit/rest';
import { useSync } from '../contexts/SyncContext';
import './Settings.css';

const { Title, Paragraph, Text } = Typography;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  // 单独保存token，不存储在localStorage
  const [token, setToken] = useState('');
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('github-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      owner: '',
      repo: '',
      branch: 'main',
      path: 'images',
      customDomain: '',
      language: 'zh', // 默认语言为中文
      enableSync: false // 是否启用云同步
    };
  });
  
  // 获取同步上下文
  const { 
    isInitialized, 
    isSyncing, 
    lastSynced, 
    error: syncError, 
    initializeSync, 
    syncSettings, 
    resyncAll 
  } = useSync();
  
  // 语言文本
  const texts = {
    zh: {
      title: '设置',
      subtitle: '配置您的GitHub仓库信息和自定义CDN链接',
      githubSettings: 'GitHub设置',
      token: 'GitHub访问令牌',
      tokenRequired: '请输入GitHub访问令牌',
      tokenExtra: '需要具有repo和gist权限的个人访问令牌（Personal Access Token）',
      tokenPlaceholder: '输入GitHub访问令牌',
      owner: '仓库所有者 (可选)',
      ownerRequired: '请输入仓库所有者',
      ownerExtra: '您的GitHub用户名或组织名称，如果仅用于同步设置，可以留空',
      ownerPlaceholder: '输入仓库所有者 (可选)',
      repo: '仓库名称 (可选)',
      repoRequired: '请输入仓库名称',
      repoExtra: '用于存储图片的GitHub仓库名称，如果仅用于同步设置，可以留空',
      repoPlaceholder: '输入仓库名称 (可选)',
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
      tokenStep3: '选择 "repo" 和 "gist" 权限范围（必须同时选择这两项权限）',
      tokenStep4: '生成并复制令牌',
      tokenStep5: '将令牌粘贴到上方的GitHub访问令牌输入框中',
      languageSettings: '语言设置',
      languageLabel: '界面语言',
      errorMessage: '请先填写GitHub令牌、所有者和仓库名',
      connectionSuccess: '连接成功！您的GitHub设置正常工作',
      branchNotExist: '分支 "{branch}" 不存在，请创建此分支或使用现有分支',
      connectionFailed: '连接失败: {error}',
      saveSuccess: '设置已保存',
      saveFailed: '保存设置失败',
      syncSettings: '云同步设置',
      enableSync: '启用云同步',
      enableSyncExtra: '启用后，您的设置和上传历史将保存在GitHub Gist中，可在多设备间同步',
      syncNow: '立即同步',
      syncStatus: '同步状态',
      syncInitialized: '已初始化',
      syncNotInitialized: '未初始化',
      lastSynced: '上次同步时间',
      syncError: '同步错误',
      syncInProgress: '正在同步...',
      syncSuccess: '同步成功',
      syncRequired: '需要同步',
      syncPermissions: '需要gist权限',
      syncPermissionsExtra: '确保您的GitHub令牌具有gist权限，以便使用云同步功能。如果遇到"Not Found"错误，请检查您的令牌是否有gist权限。'
    },
    en: {
      title: 'Settings',
      subtitle: 'Configure your GitHub repository information and custom CDN links',
      githubSettings: 'GitHub Settings',
      token: 'GitHub Access Token',
      tokenRequired: 'Please enter GitHub access token',
      tokenExtra: 'Personal access token with repo and gist permissions (both are required)',
      tokenPlaceholder: 'Enter GitHub access token',
      owner: 'Repository Owner (Optional)',
      ownerRequired: 'Please enter repository owner',
      ownerExtra: 'Your GitHub username or organization name, can be empty if only used for sync',
      ownerPlaceholder: 'Enter repository owner (optional)',
      repo: 'Repository Name (Optional)',
      repoRequired: 'Please enter repository name',
      repoExtra: 'GitHub repository name for storing images, can be empty if only used for sync',
      repoPlaceholder: 'Enter repository name (optional)',
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
      tokenStep3: 'Select "repo" AND "gist" permission scopes (both are required)',
      tokenStep4: 'Generate and copy the token',
      tokenStep5: 'Paste the token into the GitHub access token input box above',
      languageSettings: 'Language Settings',
      languageLabel: 'Interface Language',
      errorMessage: 'Please fill in GitHub token, owner and repository name first',
      connectionSuccess: 'Connection successful! Your GitHub settings are working properly',
      branchNotExist: 'Branch "{branch}" does not exist, please create this branch or use an existing branch',
      connectionFailed: 'Connection failed: {error}',
      saveSuccess: 'Settings saved',
      saveFailed: 'Failed to save settings',
      syncSettings: 'Cloud Sync Settings',
      enableSync: 'Enable Cloud Sync',
      enableSyncExtra: 'When enabled, your settings and upload history will be saved in GitHub Gist for multi-device sync',
      syncNow: 'Sync Now',
      syncStatus: 'Sync Status',
      syncInitialized: 'Initialized',
      syncNotInitialized: 'Not Initialized',
      lastSynced: 'Last Synced',
      syncError: 'Sync Error',
      syncInProgress: 'Syncing...',
      syncSuccess: 'Sync Successful',
      syncRequired: 'Sync Required',
      syncPermissions: 'Gist Permission Required',
      syncPermissionsExtra: 'Ensure your GitHub token has gist permission to use cloud sync feature. If you encounter a "Not Found" error, check if your token has gist permission.'
    }
  };
  
  // 获取当前语言的文本
  const t = texts[settings.language || 'zh'];

  // 初始化表单值
  useEffect(() => {
    form.setFieldsValue(settings);
  }, [form, settings]);

  // 从Cloudflare Pages环境变量获取token
  useEffect(() => {
    async function getCloudflareEnvToken() {
      try {
        // 尝试从环境变量中获取token
        // Cloudflare Pages会将环境变量暴露给客户端，格式为：VITE_GITHUB_TOKEN
        const cfToken = import.meta.env.VITE_GITHUB_TOKEN;
        
        if (cfToken) {
          console.log('从Cloudflare Pages环境变量获取到token');
          // 仅在内存中保存token，不存储到localStorage
          setToken(cfToken);
          
          // 如果启用了同步，尝试初始化
          if (settings.enableSync && !isInitialized) {
            console.log('检测到同步已启用但未初始化，自动初始化同步');
            initializeSync(cfToken).then(success => {
              if (success) {
                console.log('自动初始化同步成功');
                message.success('云同步已自动连接');
              } else {
                console.error('自动初始化同步失败');
              }
            });
          }
        }
      } catch (error) {
        console.error('从环境变量获取token失败:', error);
      }
    }
    
    getCloudflareEnvToken();
  }, [settings.enableSync, isInitialized]); // 依赖项添加enableSync和isInitialized，以便状态变更时重新执行

  // 监听同步状态变化
  useEffect(() => {
    // 检查设置中的同步状态和当前实际同步状态是否一致
    if (settings.enableSync && !isInitialized && token) {
      console.log('同步状态不一致，尝试重新初始化');
      initializeSync(token).catch(err => {
        console.error('初始化同步失败:', err);
      });
    }
  }, [settings.enableSync, isInitialized, token]);

  // 保存设置
  const handleSave = async (values) => {
    setLoading(true);
    try {
      // 获取当前内存中的token或环境变量
      const currentToken = token || import.meta.env.VITE_GITHUB_TOKEN || '';
      
      // 只保存非敏感信息到localStorage
      const settingsToSave = { ...values };
      delete settingsToSave.token; // 确保不保存token到localStorage
      
      localStorage.setItem('github-settings', JSON.stringify(settingsToSave));
      setSettings(settingsToSave);
      message.success(t.saveSuccess);
      
      // 如果启用了云同步，同步设置到Gist
      if (values.enableSync && currentToken) {
        if (!isInitialized) {
          // 初始化同步
          await initializeSync(currentToken);
        } else {
          // 同步设置，传递currentToken而非form中的token
          await syncSettings({ ...settingsToSave, token: currentToken });
        }
      }
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
  
  // 切换云同步
  const handleSyncChange = (checked) => {
    const newSettings = { ...settings, enableSync: checked };
    form.setFieldsValue(newSettings);
    
    // 保存到localStorage
    localStorage.setItem('github-settings', JSON.stringify(newSettings));
    setSettings(newSettings);
    
    // 获取当前token
    const currentToken = token || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (checked && currentToken && !isInitialized) {
      // 如果启用同步且有token，但未初始化，则初始化同步
      console.log('启用同步并立即初始化');
      initializeSync(currentToken).then(success => {
        if (!success) {
          message.error('同步初始化失败，请检查令牌权限');
        }
      });
    }
  };
  
  // 手动触发同步
  const handleManualSync = async () => {
    // 使用内存中的token或环境变量
    const currentToken = token || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!currentToken) {
      message.error(t.tokenRequired);
      return;
    }
    
    // 禁用同步按钮
    setLoading(true);
    
    try {
      console.log('手动触发同步...');
      
      let success;
      if (!isInitialized) {
        console.log('未初始化，调用initializeSync...');
        success = await initializeSync(currentToken);
      } else {
        console.log('已初始化，调用resyncAll...');
        success = await resyncAll();
      }
      
      if (success) {
        message.success(t.syncSuccess);
      }
    } catch (error) {
      console.error('手动同步过程中发生错误:', error);
      message.error(`${t.syncFailed}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 测试GitHub连接
  const testConnection = async () => {
    const values = form.getFieldsValue();
    
    // 使用内存中的token或环境变量
    const currentToken = token || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!currentToken) {
      message.error(t.tokenRequired);
      return;
    }

    // 如果没有提供仓库和用户名，则只测试令牌是否有效
    const isTokenOnlyTest = !values.owner || !values.repo;

    setTestLoading(true);
    setTestResult(null);

    try {
      const octokit = new Octokit({ auth: currentToken });
      
      // 测试令牌是否有效
      const { data: user } = await octokit.users.getAuthenticated();
      
      if (isTokenOnlyTest) {
        // 只测试令牌，如果能获取用户信息，则成功
        setTestResult({
          success: true,
          message: `令牌有效，已验证为用户: ${user.login}`
        });
        setTestLoading(false);
        return;
      }
      
      // 如果提供了仓库信息，则继续测试仓库访问
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
      
      // 使用TextEncoder替代Buffer进行编码
      const encoder = new TextEncoder();
      const testContent = `测试连接 - ${new Date().toISOString()}`;
      const contentBytes = encoder.encode(testContent);
      const contentBase64 = btoa(String.fromCharCode(...contentBytes));
      
      await octokit.repos.createOrUpdateFileContents({
        owner: values.owner,
        repo: values.repo,
        path: testPath,
        message: 'Test connection',
        content: contentBase64,
        branch: values.branch
      });
      
      // 连接成功
      setTestResult({
        success: true,
        message: t.connectionSuccess
      });
    } catch (error) {
      console.error('测试连接失败:', error);
      setTestResult({
        success: false,
        message: t.connectionFailed.replace('{error}', error.message)
      });
    } finally {
      setTestLoading(false);
    }
  };

  // 格式化日期时间
  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <Title level={2}>{t.title}</Title>
        <Paragraph>{t.subtitle}</Paragraph>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={settings}
      >
        <Card title={<><GithubOutlined /> {t.githubSettings}</>} className="settings-card">
          {/* 移除token输入框，使用环境变量中的token */}
          {!import.meta.env.VITE_GITHUB_TOKEN && (
            <Alert
              message="GitHub令牌未配置"
              description="请联系管理员在Cloudflare Pages中配置VITE_GITHUB_TOKEN环境变量。"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          
          {import.meta.env.VITE_GITHUB_TOKEN && (
            <Alert
              message="GitHub令牌已配置"
              description="令牌已从环境变量中加载，无需手动输入。"
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          
          <Form.Item
            name="owner"
            label={t.owner}
            rules={[{ required: false, message: t.ownerRequired }]}
            extra={t.ownerExtra}
          >
            <Input placeholder={t.ownerPlaceholder} />
          </Form.Item>
          
          <Form.Item
            name="repo"
            label={t.repo}
            rules={[{ required: false, message: t.repoRequired }]}
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
          
          <Button 
            type="default" 
            onClick={testConnection} 
            loading={testLoading}
          >
            {t.testConnection}
          </Button>
          
          {testResult && (
            <Alert
              className="settings-alert"
              message={testResult.message}
              type={testResult.success ? 'success' : 'error'}
              showIcon
            />
          )}
        </Card>
        
        <Card title={<><CloudSyncOutlined /> {t.syncSettings}</>} className="settings-card">
          <Form.Item
            name="enableSync"
            valuePropName="checked"
            extra={t.enableSyncExtra}
          >
            <Switch 
              checkedChildren={t.enableSync} 
              unCheckedChildren={t.enableSync}
              onChange={handleSyncChange}
            />
          </Form.Item>
          
          <Alert
            className="settings-alert"
            message={t.syncPermissions}
            description={t.syncPermissionsExtra}
            type="info"
            showIcon
          />
          
          <Divider />
          
          <div className="sync-status">
            <div className="sync-status-item">
              <Text strong>{t.syncStatus}:</Text>
              <Badge 
                status={isInitialized ? 'success' : 'default'} 
                text={isInitialized ? t.syncInitialized : t.syncNotInitialized} 
              />
            </div>
            
            <div className="sync-status-item">
              <Text strong>{t.lastSynced}:</Text>
              <Text>{lastSynced ? formatDateTime(lastSynced) : '-'}</Text>
            </div>
            
            {syncError && (
              <div className="sync-status-item">
                <Text strong>{t.syncError}:</Text>
                <Text type="danger">{syncError}</Text>
              </div>
            )}
          </div>
          
          <Button 
            type="primary" 
            icon={<CloudUploadOutlined />}
            onClick={handleManualSync}
            loading={isSyncing}
            disabled={!settings.token || !settings.enableSync}
            className="sync-button"
          >
            {isSyncing ? t.syncInProgress : t.syncNow}
          </Button>
        </Card>
        
        <Card title={<><LinkOutlined /> {t.cdnSettings}</>} className="settings-card">
          <Form.Item
            name="customDomain"
            label={t.customDomain}
            extra={t.customDomainExtra}
          >
            <Input placeholder={t.customDomainPlaceholder} />
          </Form.Item>
        </Card>
        
        <Card title={<><GlobalOutlined /> {t.languageSettings}</>} className="settings-card">
          <Form.Item
            name="language"
            label={t.languageLabel}
          >
            <Radio.Group onChange={handleLanguageChange}>
              <Radio value="zh">中文</Radio>
              <Radio value="en">English</Radio>
            </Radio.Group>
          </Form.Item>
        </Card>
        
        <Card title={<><QuestionCircleOutlined /> {t.about}</>} className="settings-card">
          <Paragraph>{t.aboutContent}</Paragraph>
          
          <Paragraph>
            <strong>{t.howToGetToken}</strong>
            <ol>
              <li>{t.tokenStep1} <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">{t.tokenStep1Link}</a></li>
              <li>{t.tokenStep2}</li>
              <li>{t.tokenStep3}</li>
              <li>{t.tokenStep4}</li>
              <li>{t.tokenStep5}</li>
            </ol>
          </Paragraph>
        </Card>
        
        <div className="settings-actions">
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />} 
            loading={loading}
          >
            {t.saveSettings}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Settings;