import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { HashRouter as Router, Switch } from 'react-router-dom';
import UserInfoContext from './contexts/UserInfoContext';
import { routers, RouteWithSubRoutes } from './router';
import './assets/styles/app.less';
import authAPI from './apis/auth.api';

const appReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_USER_INFO': {
      let isLogin = false;
      if (payload) {
        isLogin = true;
      }
      return {
        ...state,
        isLogin,
        userInfo: payload,
      };
    }
    default: {
      return state;
    }
  }
};

function App() {
  const [state, dispatch] = useReducer(appReducer, {
    isLogin: false,
    userInfo: null,
  });
  const { isLogin, userInfo } = state;

  const setUserInfo = useCallback((data) => {
    dispatch({ type: 'SET_USER_INFO', payload: data });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await authAPI.fetchUserInfo();
        setUserInfo(response);
      } catch (error) {
        console.error(error);
      } finally {
      }
    })();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <UserInfoContext.Provider
          value={{
            userInfo,
            isLogin,
            setUserInfo: (data) => setUserInfo(data),
          }}
        >
          <Switch>
            {routers.map((route) => (
              <RouteWithSubRoutes key={route.path} {...route} />
            ))}
          </Switch>
        </UserInfoContext.Provider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
