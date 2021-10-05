import React, { useCallback, useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import Icon, {
  HomeOutlined,
  ClusterOutlined,
  AppstoreAddOutlined,
  AlertOutlined,
  DashboardOutlined,
  HddOutlined,
  TeamOutlined,
  CalculatorOutlined,
  BookOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import '../assets/styles/main-layout.less';

export default function withMainLayout(WrappedComponent) {
  const WithWrapper = (props) => {
    const { history, location } = props;
    const [collapsed, setCollapsed] = useState(
      location.state?.collapsed || false,
    );
    const onMenuClick = useCallback(
      ({ key }) => {
        console.log(key);
        history.push({
          pathname: key,
          state: {
            collapsed,
          },
        });
      },
      [collapsed, history],
    );

    const profileMenu = (
      <Menu onClick={onMenuClick}>
        <Menu.Item key="/profile">个人中心</Menu.Item>
        <Menu.Item key="/sign-out">退出登录</Menu.Item>
      </Menu>
    );

    return (
      <Layout className="main-layout">
        <Layout.Sider collapsed={collapsed}>
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
          <Layout.Header
            style={{
              background: '#eee',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Tooltip title={collapsed ? '展开' : '折叠'}>
              <Icon
                component={collapsed ? MenuUnfoldOutlined : MenuFoldOutlined}
                onClick={() => setCollapsed((val) => !val)}
              />
            </Tooltip>
            <div style={{ marginLeft: 'auto' }}>
              <Avatar icon={<UserOutlined />} size={48} />
              <Dropdown overlay={profileMenu}>
                <Button type="link">Admin</Button>
              </Dropdown>
            </div>
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
  WithWrapper.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  WithWrapper.defaultProps = {};
  return WithWrapper;
}
