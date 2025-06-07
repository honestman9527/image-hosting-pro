import React, { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import { initGistSync, loadSettingsFromGist, loadHistoryFromGist, saveSettingsToGist, saveHistoryToGist } from '../utils/gistSync';

// 创建Context
export const SyncContext = createContext();

// 自定义Hook，用于在组件中使用SyncContext
export const useSync = () => useContext(SyncContext);

// SyncProvider组件
export const SyncProvider = ({ children }) => {
  const [syncState, setSyncState] = useState({
    isInitialized: false,
    isSyncing: false,
    lastSynced: null,
    gistId: null,
    octokit: null,
    error: null,
  });

  // 初始化同步
  const initializeSync = async (token) => {
    if (!token) return;
    
    setSyncState(prev => ({ ...prev, isSyncing: true, error: null }));
    
    try {
      // 初始化Gist同步
      const { octokit, gistId } = await initGistSync(token);
      
      // 从Gist加载设置
      const gistSettings = await loadSettingsFromGist(octokit, gistId);
      if (gistSettings) {
        localStorage.setItem('github-settings', JSON.stringify(gistSettings));
      }
      
      // 从Gist加载历史
      const gistHistory = await loadHistoryFromGist(octokit, gistId);
      if (gistHistory && gistHistory.length > 0) {
        localStorage.setItem('upload-history', JSON.stringify(gistHistory));
      }
      
      // 更新同步状态
      setSyncState({
        isInitialized: true,
        isSyncing: false,
        lastSynced: new Date(),
        gistId,
        octokit,
        error: null,
      });
      
      message.success('云端数据同步成功');
      return true;
    } catch (error) {
      console.error('初始化同步失败:', error);
      
      // 提供更友好的错误提示
      let errorMessage = error.message || '同步失败';
      
      // 检查是否是权限相关错误
      if (errorMessage.includes('gist权限') || errorMessage.includes('权限被拒绝')) {
        errorMessage = '同步失败: GitHub令牌缺少gist权限。请在GitHub上创建新令牌，并确保勾选gist权限。';
      } else if (errorMessage.includes('认证失败') || errorMessage.includes('无效')) {
        errorMessage = '同步失败: GitHub认证失败。请检查您的令牌是否正确或已过期。';
      }
      
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        error: errorMessage,
      }));
      
      message.error(errorMessage);
      return false;
    }
  };

  // 同步设置到Gist
  const syncSettings = async (settings) => {
    const { octokit, gistId, isInitialized } = syncState;
    
    if (!isInitialized || !octokit || !gistId) {
      return false;
    }
    
    setSyncState(prev => ({ ...prev, isSyncing: true }));
    
    try {
      await saveSettingsToGist(octokit, gistId, settings);
      
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSynced: new Date(),
      }));
      
      return true;
    } catch (error) {
      console.error('同步设置失败:', error);
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        error: error.message || '同步设置失败',
      }));
      message.error(`同步设置失败: ${error.message}`);
      return false;
    }
  };

  // 同步历史到Gist
  const syncHistory = async (history) => {
    const { octokit, gistId, isInitialized } = syncState;
    
    if (!isInitialized || !octokit || !gistId) {
      return false;
    }
    
    setSyncState(prev => ({ ...prev, isSyncing: true }));
    
    try {
      await saveHistoryToGist(octokit, gistId, history);
      
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSynced: new Date(),
      }));
      
      return true;
    } catch (error) {
      console.error('同步历史失败:', error);
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        error: error.message || '同步历史失败',
      }));
      message.error(`同步历史失败: ${error.message}`);
      return false;
    }
  };

  // 重新同步所有数据
  const resyncAll = async () => {
    const { octokit, gistId, isInitialized } = syncState;
    
    if (!isInitialized || !octokit || !gistId) {
      return false;
    }
    
    setSyncState(prev => ({ ...prev, isSyncing: true }));
    
    try {
      // 获取本地数据
      const localSettings = JSON.parse(localStorage.getItem('github-settings') || '{}');
      const localHistory = JSON.parse(localStorage.getItem('upload-history') || '[]');
      
      // 保存到Gist
      await saveSettingsToGist(octokit, gistId, localSettings);
      await saveHistoryToGist(octokit, gistId, localHistory);
      
      // 更新同步状态
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSynced: new Date(),
      }));
      
      message.success('所有数据已同步到云端');
      return true;
    } catch (error) {
      console.error('重新同步失败:', error);
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        error: error.message || '重新同步失败',
      }));
      message.error(`重新同步失败: ${error.message}`);
      return false;
    }
  };

  // 提供Context值
  const value = {
    ...syncState,
    initializeSync,
    syncSettings,
    syncHistory,
    resyncAll,
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}; 