import React, { useCallback } from 'react';
import { Layout, Menu } from 'antd';
import { BoxPlotOutlined } from '@ant-design/icons';
import { routers } from '../router';
import '../assets/styles/main-layout.less';

export default function withMainLayout(WrappedComponent) {
  const WithWrapper = (props) => {
    const { history } = props;
    const onMenuClick = useCallback(({ item, key, keyPath, domEvent }) => {
      history.push(key);
    }, []);

    return (
      <Layout className="main-layout">
        <Layout.Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={[history.location.pathname]}
            onClick={onMenuClick}
          >
            {routers
              .filter((item) => item.menu)
              .map((router) => (
                <Menu.Item key={router.path} icon={<BoxPlotOutlined />}>
                  {router.label}
                </Menu.Item>
              ))}
          </Menu>
        </Layout.Sider>
        <Layout>
          <Layout.Header style={{ background: 'transparent' }}>
            Header
          </Layout.Header>
          <Layout.Content className="main-content">
            <WrappedComponent {...props} />
          </Layout.Content>
        </Layout>
      </Layout>
    );
  };
  const wrappedComponentName = WrappedComponent.name || 'Component';

  WithWrapper.displayName = `withMainLayout(${wrappedComponentName})`;
  return WithWrapper;
}
