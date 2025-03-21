import React, { useState, useEffect } from 'react';
import { Typography, List, Button, Empty, Card, Image, Popconfirm, message, DatePicker } from 'antd';
import { CopyOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import './History.css';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [dateRange, setDateRange] = useState(null);

  // 从本地存储加载历史记录
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('upload-history') || '[]');
    setHistory(savedHistory);
    setFilteredHistory(savedHistory);
  }, []);

  // 复制链接
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => message.success('链接已复制到剪贴板'))
      .catch(err => message.error('复制失败: ' + err));
  };

  // 删除记录
  const deleteRecord = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    localStorage.setItem('upload-history', JSON.stringify(newHistory));
    
    // 更新筛选后的历史记录
    if (dateRange) {
      filterByDateRange(dateRange, newHistory);
    } else {
      setFilteredHistory(newHistory);
    }
    
    message.success('记录已删除');
  };

  // 日期范围筛选
  const filterByDateRange = (dates, historyData = history) => {
    if (!dates || dates.length !== 2) {
      setFilteredHistory(historyData);
      return;
    }

    const [startDate, endDate] = dates;
    const start = startDate.startOf('day').valueOf();
    const end = endDate.endOf('day').valueOf();

    const filtered = historyData.filter(item => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= start && itemDate <= end;
    });

    setFilteredHistory(filtered);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    filterByDateRange(dates);
  };

  // 清除所有筛选
  const clearFilters = () => {
    setDateRange(null);
    setFilteredHistory(history);
  };

  // 按日期分组
  const groupByDate = (items) => {
    const groups = {};
    
    items.forEach(item => {
      const date = new Date(item.date).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    
    return Object.entries(groups).map(([date, items]) => ({
      date,
      items
    }));
  };

  const groupedHistory = groupByDate(filteredHistory);

  return (
    <div className="history-container">
      <Typography className="history-header">
        <Title level={2}>上传历史</Title>
        <Paragraph>
          查看您的图片上传历史记录，管理已上传的图片
        </Paragraph>
      </Typography>

      <div className="history-filters">
        <div className="date-filter">
          <RangePicker 
            onChange={handleDateRangeChange} 
            value={dateRange}
            placeholder={['开始日期', '结束日期']}
            allowClear
          />
        </div>
        {(dateRange) && (
          <Button onClick={clearFilters}>清除筛选</Button>
        )}
      </div>

      {filteredHistory.length === 0 ? (
        <Empty 
          description="暂无上传历史记录" 
          className="empty-container"
        />
      ) : (
        <div className="history-timeline">
          {groupedHistory.map((group, groupIndex) => (
            <div key={groupIndex} className="history-group">
              <div className="history-date">
                <CalendarOutlined /> {group.date}
              </div>
              <List
                className="history-list"
                itemLayout="horizontal"
                dataSource={group.items}
                renderItem={(item, index) => (
                  <List.Item>
                    <Card className="history-card">
                      <div className="history-card-content">
                        <div className="history-image-container">
                          <Image
                            src={item.url}
                            alt={item.name}
                            className="history-image"
                          />
                        </div>
                        <div className="history-item-info">
                          <h4>{item.name}</h4>
                          <p>大小: {(item.size / 1024).toFixed(1)} KB</p>
                          <p>上传时间: {new Date(item.date).toLocaleString()}</p>
                          <p className="history-item-url">{item.url}</p>
                        </div>
                      </div>
                      <div className="history-item-actions">
                        <Button 
                          type="text" 
                          icon={<CopyOutlined />} 
                          onClick={() => copyToClipboard(item.url)}
                        >
                          复制链接
                        </Button>
                        <Popconfirm
                          title="确定要删除这条记录吗？"
                          description="删除后将无法恢复，但不会从GitHub仓库中删除图片。"
                          onConfirm={() => deleteRecord(history.findIndex(h => h.date === item.date && h.name === item.name))}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />}
                          >
                            删除记录
                          </Button>
                        </Popconfirm>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;