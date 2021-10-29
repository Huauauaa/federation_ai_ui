import React, { useEffect, useState } from 'react';
import { Statistic } from 'antd';
import withMainLayout from '../hocs/withMainLayout';
import '../assets/styles/home.less';
import video from '../assets/videos/video.mp4';
import userApi from '../apis/user.api';

const HomeView = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await userApi.search({ all: true });
      setUsers(response);
    })();
  }, []);
  return (
    <div className="home">
      <video src={video} autoPlay loop muted type="video/mp4" width="100%" />
      <div className="main">
        <Statistic title="活跃用户" value={users.length} />
      </div>
    </div>
  );
};

export default withMainLayout(HomeView);
