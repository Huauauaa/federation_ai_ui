import React, { useState, useEffect } from 'react';
import { Spin, Form, Button, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import withAuthWrapper from '../hocs/withAuthWrapper';
import '../assets/styles/forget-password.less';
import { emailPattern } from '../utils/regExpPattern';
import authApi from '../apis/auth.api';
import { checkPassword } from '../utils/rule';

let timeoutId = null;

function ForgotPassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  });

  const onResetPassword = async ({ email, authCode, newPassword }) => {
    try {
      setLoading(true);
      await authApi.resetPassword({
        email,
        code: authCode,
        password: newPassword,
      });
      message.success('修改成功, 正在跳转至登录页面...');
      timeoutId = setTimeout(() => {
        history.push('/sign-in');
      }, 1e3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function sendAuthCode() {
    await form.validateFields(['email']);
    try {
      setLoading(true);
      await authApi.getAuthCode({ email: form.getFieldValue('email') });
      message.success('验证码已经发送至您的邮箱,请注意查收!');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function checkConfirmPassword(pwd, _rule, value) {
    if (!value) {
      return Promise.reject(new Error('不能为空'));
    }
    if (pwd !== value) {
      return Promise.reject(new Error('新密码和确认密码必须一致'));
    }
    return Promise.resolve();
  }

  return (
    <Spin spinning={loading}>
      <div className="forget-password__wrapper">
        <Form
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={onResetPassword}
          autoComplete="off"
          labelCol={{
            span: 6,
          }}
          style={{ padding: '40px 80px' }}
        >
          <Form.Item label="邮箱">
            <Form.Item
              name="email"
              noStyle
              rules={[
                {
                  required: true,
                  message: '请填写您的邮箱',
                },
                {
                  pattern: emailPattern,
                  message: '请填写正确的格式',
                },
              ]}
            >
              <Input.Search
                placeholder="请填写您的邮箱"
                allowClear
                enterButton="发送验证码"
                onSearch={() => sendAuthCode()}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="验证码">
            <Form.Item
              name="authCode"
              noStyle
              rules={[
                {
                  required: true,
                  message: '请填写验证码',
                },
              ]}
            >
              <Input placeholder="请填写验证码" />
            </Form.Item>
            没有收到?
            <Button type="link" onClick={() => sendAuthCode()}>
              重新发送
            </Button>
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            label="再次输入密码"
            name="password1"
            rules={[
              {
                validator: (...args) =>
                  checkConfirmPassword(
                    form.getFieldValue('newPassword'),
                    ...args,
                  ),
                trigger: 'change',
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
}

export default withAuthWrapper(ForgotPassword);
