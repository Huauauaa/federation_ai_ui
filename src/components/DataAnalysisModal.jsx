import React, { useState, useEffect } from 'react';
import { message, Form, Input, Modal, Select, Spin } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { checkIntegerNumber } from '../utils/rule';
import dataAPI from '../apis/data.api';
import { useAgent } from '../hooks/useAgent';

let intervalId = null;

function DataAnalysisModal({ onClose, defaultValues, callback }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { agents } = useAgent();

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  });

  const onOK = async () => {
    const values = await form.validateFields().catch(() => {});

    if (!values) {
      return;
    }
    try {
      setLoading(true);
      await dataAPI.dataAnalysis({
        id: defaultValues.id,
        col: Number(values.col),
        agentid: values.agent,
      });
      intervalId = setInterval(async () => {
        const res = await dataAPI.searchData({ id: defaultValues.id });
        const analysisResult = res.results[0].analysis_result;
        if (Object.keys(analysisResult).length === 0) {
          return;
        }

        clearInterval(intervalId);
        if (analysisResult.error) {
          setLoading(false);
          message.error(`列数不应该大于${analysisResult.error}`);
          return;
        }
        callback(
          Object.keys(analysisResult).map((key, index) => ({
            key: index,
            performance: key,
            value: analysisResult[key],
          })),
        );
        setLoading(false);
        onClose();
      }, 3e3);
    } catch (error) {
      console.error(error);
      message.error(error.info || '操作失败');
    }
  };

  return (
    <Modal
      title="数据分析"
      visible
      destroyOnClose
      onCancel={onClose}
      width={400}
      closable={false}
      onOk={onOK}
    >
      <Spin spinning={loading}>
        <Form form={form} initialValues={defaultValues}>
          <Form.Item
            label="节点"
            name="agent"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Select placeholder="请选择节点">
              {agents.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="列数"
            name="col"
            rules={[{ validator: checkIntegerNumber }]}
            required
          >
            <Input placeholder="请输入列数" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

DataAnalysisModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  callback: PropTypes.func,
  defaultValues: PropTypes.object,
};

DataAnalysisModal.defaultProps = {
  defaultValues: {},
  callback: () => {},
};
export default DataAnalysisModal;
