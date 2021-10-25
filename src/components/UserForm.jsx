import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select, Spin, message } from 'antd';
import PropTypes from 'prop-types';
import API from '../apis/user.api';
import { ROLES } from '../utils/const';
import { getRole, dateTimeFormatter } from '../utils';

const UserForm = forwardRef(
  ({ type, defaultValues, onClose, disabledFields, hiddenFields }, ref) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
      save: () => {
        form.submit();
      },
    }));

    const onFinish = async (values) => {
      try {
        setLoading(true);
        if (type === 'create') {
          // do nothing
        } else {
          await API.update({
            ...values,
            id: defaultValues.id,
            is_superuser: values.role === 'superuser',
            is_staff: ['superuser', 'staff'].includes(values.role),
          });
        }
        message.success('操作成功');
        onClose(null, true);
      } catch ({ error }) {
        console.error(error);
        message.error(error || '操作失败');
      }
    };

    return (
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          initialValues={{
            ...defaultValues,
            role: getRole(defaultValues).key,
            lastLogin: dateTimeFormatter(defaultValues.last_login),
            joinedDate: dateTimeFormatter(defaultValues.date_joined),
          }}
          onFinish={onFinish}
        >
          <Form.Item label="用户名" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input disabled={disabledFields.includes('email')} />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Select disabled={disabledFields.includes('role')}>
              {ROLES.map((item) => (
                <Select.Option key={item.key} value={item.key}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="名" name="first_name">
            <Input disabled={disabledFields.includes('firstName')} />
          </Form.Item>
          <Form.Item label="姓" name="last_name">
            <Input disabled={disabledFields.includes('lastName')} />
          </Form.Item>
          {!hiddenFields.includes('joinedDate') && (
            <Form.Item label="注册时间" name="joinedDate">
              <Input disabled />
            </Form.Item>
          )}
          {!hiddenFields.includes('lastLogin') && (
            <Form.Item label="上次登录" name="lastLogin">
              <Input disabled />
            </Form.Item>
          )}
        </Form>
      </Spin>
    );
  },
);

UserForm.propTypes = {
  type: PropTypes.oneOf(['create', 'edit']),
  onClose: PropTypes.func,
  defaultValues: PropTypes.object,
  disabledFields: PropTypes.array,
  hiddenFields: PropTypes.array,
};

UserForm.defaultProps = {
  type: 'edit',
  defaultValues: {},
  onClose: () => {},
  disabledFields: [],
  hiddenFields: [],
};

export default UserForm;
