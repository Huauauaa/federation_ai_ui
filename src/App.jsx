import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { HashRouter as Router, Switch } from 'react-router-dom';
import UserInfoContext from './contexts/UserInfoContext';
import { routers, RenderRoutes } from './router';
import './assets/styles/app.less';

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

function App({ isLogin: defaultIsLogin, userInfo: defaultUserInfo }) {
  const [state, dispatch] = useReducer(appReducer, {
    isLogin: defaultIsLogin,
    userInfo: defaultUserInfo,
  });
  const { isLogin, userInfo } = state;

  const setUserInfo = useCallback((data) => {
    dispatch({ type: 'SET_USER_INFO', payload: data });
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
              <RenderRoutes key={route.path} {...route} />
            ))}
          </Switch>
        </UserInfoContext.Provider>
      </Router>
    </ConfigProvider>
  );
}

App.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  userInfo: PropTypes.object,
};

App.defaultProps = {
  userInfo: null,
};

export default App;
