import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import App from './App';
import './assets/styles/index.css';
import authAPI from './apis/auth.api';

let isLogin = false;
let userInfo = null;
try {
  userInfo = await authAPI.fetchUserInfo();
  isLogin = true;
} finally {
  ReactDOM.render(
    <App isLogin={isLogin} userInfo={userInfo} />,
    document.getElementById('root'),
  );
}
