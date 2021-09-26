import React, { useCallback } from 'react';
import { Layout, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  HomeOutlined,
  ClusterOutlined,
  AppstoreAddOutlined,
  AlertOutlined,
  DashboardOutlined,
  HddOutlined,
  TeamOutlined,
  CalculatorOutlined,
  BookOutlined,
} from '@ant-design/icons';
import '../assets/styles/main-layout.less';

export default function withMainLayout(WrappedComponent) {
  const WithWrapper = (props) => {
    const history = useHistory();
    const onMenuClick = useCallback(
      ({ key }) => {
        history.push(key);
      },
      [history],
    );

    return (
      <Layout className="main-layout">
        <Layout.Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={[history.location.pathname]}
            onClick={onMenuClick}
          >
            <Menu.Item key="/" icon={<HomeOutlined />}>
              系统概览
            </Menu.Item>
            <Menu.Item key="/agent" icon={<ClusterOutlined />}>
              节点管理
            </Menu.Item>
            <Menu.Item key="/data" icon={<HddOutlined />}>
              数据管理
            </Menu.Item>
            <Menu.Item key="/project" icon={<CalculatorOutlined />}>
              算法库
            </Menu.Item>
            <Menu.Item key="/federation" icon={<AppstoreAddOutlined />}>
              联邦任务
            </Menu.Item>
            <Menu.Item key="/model" icon={<BookOutlined />}>
              模型库
            </Menu.Item>
            <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
              统计概览
            </Menu.Item>
            <Menu.Item key="/alert" icon={<AlertOutlined />}>
              监控告警
            </Menu.Item>
            <Menu.Item key="/user" icon={<TeamOutlined />}>
              用户管理
            </Menu.Item>
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
