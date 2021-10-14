import React, { useReducer, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { HashRouter as Router, Switch } from 'react-router-dom';
import UserInfoContext from './contexts/UserInfoContext';
import AgentContext from './contexts/AgentContext';
import { routers, RenderRoutes } from './router';
import './assets/styles/app.less';
import agentAPI from './apis/agent.api';

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
  const [agents, setAgents] = useState([]);

  const setUserInfo = useCallback((data) => {
    dispatch({ type: 'SET_USER_INFO', payload: data });
  }, []);

  useEffect(() => {
    if (!isLogin) {
      return;
    }
    (async () => {
      const response = await agentAPI.searchAgents({ all: true });
      setAgents(response.results);
      // setAgents(response);
    })();
  }, [isLogin]);

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <AgentContext.Provider
          value={{ agents, setAgents: (data) => setAgents(data) }}
        >
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
        </AgentContext.Provider>
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
