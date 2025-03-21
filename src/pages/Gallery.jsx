import React, { useState, useEffect } from 'react';
import { Typography, Card, Image, Button, Input, Empty, message, Pagination } from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import './Gallery.css';

const { Title, Paragraph } = Typography;
const { Search } = Input;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('github-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      customDomain: ''
    };
  });
  
  const pageSize = 12;

  // 从本地存储加载图片
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('upload-history') || '[]');
    setImages(history);
    setFilteredImages(history);
  }, []);

  // 搜索图片
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredImages(images);
      setCurrentPage(1);
      return;
    }
    
    const filtered = images.filter(img => 
      img.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredImages(filtered);
    setCurrentPage(1);
  };

  // 复制链接
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => message.success('链接已复制到剪贴板'))
      .catch(err => message.error('复制失败: ' + err));
  };

  // 分页处理
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 计算当前页的图片
  const currentImages = filteredImages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="gallery-container">
      <Typography className="gallery-header">
        <Title level={2}>图片管理</Title>
        <Paragraph>
          查看和管理您上传的所有图片，复制链接以便在博客中使用
        </Paragraph>
      </Typography>

      <div className="gallery-actions">
        <Search
          placeholder="搜索图片名称"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          className="search-input"
        />
      </div>

      {filteredImages.length === 0 ? (
        <Empty
          description={
            <span>
              {images.length === 0 ? '暂无上传的图片' : '没有找到匹配的图片'}
            </span>
          }
          className="empty-container"
        />
      ) : (
        <>
          <div className="image-grid">
            {currentImages.map((image, index) => (
              <Card
                key={index}
                hoverable
                className="image-card"
                cover={
                  <div className="image-container">
                    <Image
                      src={image.url}
                      alt={image.name}
                      className="gallery-image"
                    />
                  </div>
                }
                actions={[
                  <Button 
                    type="text" 
                    icon={<CopyOutlined />} 
                    onClick={() => copyToClipboard(image.url)}
                  >
                    复制链接
                  </Button>
                ]}
              >
                <Card.Meta
                  title={image.name}
                  description={
                    <div className="image-info">
                      <p>大小: {(image.size / 1024).toFixed(1)} KB</p>
                      <p>上传时间: {new Date(image.date).toLocaleString()}</p>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>

          <div className="pagination-container">
            <Pagination
              current={currentPage}
              total={filteredImages.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Gallery;