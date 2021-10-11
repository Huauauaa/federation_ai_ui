import React, { useState } from 'react';
import { Form, Input, Modal, Select, Spin, message } from 'antd';
import PropTypes from 'prop-types';
import { checkIP, checkPort } from '../utils/rule';
import agentAPI from '../apis/agent.api';

const labelCol = { span: 8 };

function AgentModal({ onClose, type, defaultValues }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onOK = async () => {
    const values = await form.validateFields().catch(() => {});

    if (!values) {
      return;
    }
    try {
      setLoading(true);
      if (type === 'create') {
        await agentAPI.createAgent(values);
      } else {
        await agentAPI.updateAgent({
          ...values,
          id: defaultValues.id,
          broker: defaultValues.broker,
        });
      }
      message.success('操作成功');
      onClose(null, true);
    } catch (error) {
      console.error(error);
      message.error(error.info || '操作失败');
    }
  };

  return (
    <Modal
      title={type === 'create' ? '添加节点' : '编辑节点'}
      visible
      destroyOnClose
      onCancel={onClose}
      onOk={onOK}
      width={680}
      closable={false}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="horizontal"
          labelCol={labelCol}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
          initialValues={{
            ...defaultValues,
            is_cloud:
              defaultValues.is_cloud === undefined
                ? null
                : Number(defaultValues.is_cloud),
          }}
        >
          <Form.Item
            label="节点名称"
            name="name"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="IP"
            name="ip"
            rules={[{ validator: checkIP }]}
            required
          >
            <Input disabled={type === 'edit'} />
          </Form.Item>
          <Form.Item
            label="端口"
            name="port"
            rules={[{ validator: checkPort }]}
            required
          >
            <Input disabled={type === 'edit'} />
          </Form.Item>
          <Form.Item
            label="节点类型"
            name="is_cloud"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Select disabled={type === 'edit'}>
              <Select.Option value={1}>发起方</Select.Option>
              <Select.Option value={0}>参与方</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="操作系统"
            name="os"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Select>
              <Select.Option value="Linux">Linux</Select.Option>
              <Select.Option value="Windows">Windows</Select.Option>
              <Select.Option value="macOS">macOS</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Docker版本"
            name="docker_version"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="内存(MB)" name="memory">
            <Input />
          </Form.Item>
          <Form.Item label="CPU型号" name="cpu_model_name">
            <Input />
          </Form.Item>
          <Form.Item label="CPU主频(Mhz)" name="cpu_MHz">
            <Input />
          </Form.Item>
          <Form.Item label="CPU核数" name="cpu_cores">
            <Input />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

AgentModal.propTypes = {
  type: PropTypes.oneOf(['create', 'edit']).isRequired,
  onClose: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

AgentModal.defaultProps = {
  defaultValues: {},
};

export default AgentModal;
