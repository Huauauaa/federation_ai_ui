import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Alert, Spin, message } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  checkPassword,
  checkConfirmPassword,
  checkNewPassword,
} from '../utils/rule';
import { useUserInfo } from '../hooks/useUserInfo';
import UserAPI from '../apis/user.api';

const alertMessage =
  '修改密码后需要重新下载zip包并重新安装设备，不建议修改，若修改请输入用户名';

function checkUsername(username, _rule, value) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (username !== value) {
    return Promise.reject(new Error('确认密码和新密码必须一致'));
  }
  return Promise.resolve();
}

function PasswordModal({ onClose }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { userInfo, setUserInfo } = useUserInfo();
  const onOK = async () => {
    const values = await form.validateFields().catch(() => {});

    if (!values) {
      return;
    }
    const { password, newPassword } = values;
    try {
      setLoading(true);
      await Promise.all([
        UserAPI.changePassword(userInfo.id, password, newPassword),
        // TODO
        // HarborUserService.changePassword(
        //   this.harborUserInfo.user_id,
        //   password,
        //   newPassword,
        // ),
      ]);
      message.success('更新成功');
      setUserInfo(null);
      history.push('/sign-in');
    } catch ({ error }) {
      console.error(error);
      message.error(error || '服务器出错');
    }
  };

  return (
    <Modal
      title="修改密码"
      visible
      destroyOnClose
      onCancel={onClose}
      onOk={onOK}
      width={500}
      closable={false}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                validator: (...args) =>
                  checkUsername(userInfo.username, ...args),
              },
            ]}
            extra={<Alert message={alertMessage} type="error" />}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="旧密码"
            name="password"
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input type="password" allowClear />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              {
                validator: checkPassword,
              },
              {
                validator: (...args) =>
                  checkNewPassword(form.getFieldValue('password'), ...args),
              },
            ]}
          >
            <Input
              type="password"
              onInput={() => {
                if (form.getFieldValue('passwordConfirm')) {
                  form.validateFields(['passwordConfirm']);
                }
              }}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="再次输入新密码"
            name="passwordConfirm"
            rules={[
              {
                validator: checkPassword,
              },
              {
                validator: (...args) =>
                  checkConfirmPassword(
                    form.getFieldValue('newPassword'),
                    ...args,
                  ),
              },
            ]}
          >
            <Input type="password" allowClear />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

PasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

PasswordModal.defaultProps = {};

export default PasswordModal;
