import React, { useState, useEffect } from 'react';
import { Spin, Form, Button } from 'antd';
import withAuthWrapper from '../hocs/withAuthWrapper';
import '../assets/styles/forget-password.less';
import { emailPattern } from '../utils/regExpPattern';
import authApi from '../apis/auth.api';

function PasswordReset() {
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   (async () => {
  //     authApi.searchUser();
  //   })();
  // }, []);
  const onSendEmail = async ({ email }) => {
    try {
      setLoading(true);
      const target = {};
      const msg = `您好，您的账号为：${target.user_name}，密码为：${target.password}。请妥善保管账户信息防止泄露！`;
      await authApi.sendEmail({
        msg,
        to_email: email,
        subject: 'EdgeAI找回密码',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="forget-password__wrapper">
        <div className="title en">FORGET PASSWORD</div>
        <div className="title zh">找回密码</div>

        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onSendEmail}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
            label="邮箱"
            name="email"
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
            <Input placeholder="请填写您的邮箱" />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 12,
            }}
            className="buttons"
          >
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button type="primary">返回</Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
}

export default withAuthWrapper(PasswordReset);
