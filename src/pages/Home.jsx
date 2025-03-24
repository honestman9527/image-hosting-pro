import React from 'react';
import { Typography, Card, Space, Button } from 'antd';
import { UploadOutlined, PictureOutlined, HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Home.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div className="home-container">
      <Typography className="home-header">
        <Title>GitHub图床工具</Title>
        <Paragraph>
          轻松上传图片到GitHub，获取CDN链接，管理您的图片资源
        </Paragraph>
      </Typography>

      <div className="feature-cards">
        <Card className="feature-card" title="上传图片" extra={<Link to="/upload"><Button type="primary" icon={<UploadOutlined />}>立即上传</Button></Link>}>
          <p>支持批量上传图片到GitHub仓库</p>
          <p>支持图片压缩，节省存储空间</p>
        </Card>

        <Card className="feature-card" title="图片管理" extra={<Link to="/images"><Button type="primary" icon={<PictureOutlined />}>浏览图片</Button></Link>}>
          <p>查看已上传的所有图片</p>
          <p>复制图片链接，方便插入到博客中</p>
        </Card>


        <Card className="feature-card" title="设置" extra={<Link to="/settings"><Button type="primary" icon={<SettingOutlined />}>前往设置</Button></Link>}>
          <p>配置GitHub仓库信息</p>
          <p>自定义CDN链接前缀</p>
        </Card>
      </div>
    </div>
  );
};

export default Home;