import React, { useState } from 'react';
import withAuthWrapper from '../hocs/withAuthWrapper';
import { Form, Input, Button, Spin, message } from 'antd';
import { useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import authAPI from '../apis/auth.api';
import { useUserInfo } from '../hooks/useUserInfo';

function SignIn() {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useUserInfo();
  const searchParams = new URLSearchParams(location.search);

  const onSignIn = async (values) => {
    try {
      setLoading(true);
      await authAPI.signIn(values);
      const response = await authAPI.fetchUserInfo();
      setUserInfo(response);
      message.success('登录成功');
      if (searchParams.get('redirect')) {
        try {
          const path = decodeURIComponent(searchParams.get('redirect'));
          history.push(path);
        } catch (e) {
          console.error(e);
          history.push('/');
        }
        return;
      }
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Spin spinning={loading}>
      <Form onFinish={onSignIn}>
        <Form.Item label="账户" name="username" required>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" required>
          <Input type="password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default withAuthWrapper(SignIn);
