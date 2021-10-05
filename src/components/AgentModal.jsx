import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { checkIP, checkPort } from '../utils/rule';

function AgentModal({ onClose, type }) {
  const [form] = Form.useForm();
  const onOK = async () => {
    const values = await form.validateFields().catch(() => {});
    console.log(values);
    if (!values) {
      return;
    }
    // onSubmit()
    console.log(1);
  };
  const labelCol = { span: 8 };
  return (
    <Modal
      title="添加节点"
      visible
      destroyOnClose
      onCancel={onClose}
      onOk={onOK}
      width={680}
      closable={false}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={labelCol}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
        initialValues={{
          memory: '',
          cpu_model_name: '',
          cpu_MHz: '',
          cpu_cores: '',
        }}
      >
        <Form.Item
          label="节点名称"
          name="name"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="IP" name="ip" rules={[{ validator: checkIP }]}>
          <Input disabled={type === 'edit'} />
        </Form.Item>
        <Form.Item label="端口" name="port" rules={[{ validator: checkPort }]}>
          <Input disabled={type === 'edit'} />
        </Form.Item>
        <Form.Item
          label="节点类型"
          name="is_cloud"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Select disabled={type === 'edit'}>
            <Select.Option value={1}>1</Select.Option>
            <Select.Option value={2}>2</Select.Option>
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
    </Modal>
  );
}

AgentModal.propTypes = {
  type: PropTypes.oneOf(['create', 'edit']).isRequired,
  onClose: PropTypes.func.isRequired,
  // onSubmit: PropTypes.func.isRequired,
};

export default AgentModal;
