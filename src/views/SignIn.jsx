import React, { useState } from 'react';
import { Form, Input, Button, Spin, message } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import withAuthWrapper from '../hocs/withAuthWrapper';
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
      <Form onFinish={onSignIn} style={{ padding: '100px' }}>
        <Form.Item label="账号" required>
          <Form.Item name="username" noStyle>
            <Input />
          </Form.Item>
          没有账号?
          <Button type="link" onClick={() => history.push('/sign-up')}>
            注册一个
          </Button>
        </Form.Item>
        <Form.Item label="密码" required>
          <Form.Item name="password" noStyle>
            <Input type="password" />
          </Form.Item>
          忘记密码?
          <Button type="link" onClick={() => history.push('/forgot-password')}>
            找回密码
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default withAuthWrapper(SignIn);
