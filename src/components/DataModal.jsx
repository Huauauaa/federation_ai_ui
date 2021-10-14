import React, { useState, useMemo } from 'react';
import {
  message,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  DatePicker,
  Button,
  Upload,
  Tooltip,
} from 'antd';
import { nanoid } from 'nanoid';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  checkIP,
  checkPort,
  checkTableName,
  checkName,
  checkAccessId,
  checkAccessSecret,
  checkProjectName,
} from '../utils/rule';
import { DATA_TYPE } from '../utils/const';
import dataAPI from '../apis/data.api';

const optionalFields = [
  {
    name: 'document_path',
    label: '文件路径',
    rules: [{ required: true, message: '不能为空' }],
  },
  {
    name: 'db_name',
    label: '数据库名称',
    rules: [{ required: true, message: '不能为空' }],
  },
  { name: 'db_url', label: '数据库URL', rules: [{ validator: checkIP }] },
  { name: 'db_port', label: '数据库端口', rules: [{ validator: checkPort }] },
  {
    name: 'db_username',
    label: '数据库用户名',
    rules: [{ required: true, message: '不能为空' }],
  },
  {
    name: 'db_password',
    label: '数据库密码',
    rules: [{ required: true, message: '不能为空' }],
    inputType: 'password',
  },
  {
    name: 'table_name',
    label: '数据表名称',
    rules: [{ validator: checkTableName }],
  },
  {
    name: 'kafka_server_ip',
    label: 'Kafka服务器IP',
    rules: [{ validator: checkIP }],
  },
  {
    name: 'kafka_server_port',
    label: 'Kafka服务端口',
    rules: [{ validator: checkPort }],
  },
  {
    name: 'topic_name',
    label: '订阅主题(Topic)名称',
    rules: [{ validator: checkName }],
  },
  {
    name: 'access_id',
    label: 'AccessKey ID',
    rules: [{ validator: checkAccessId }],
  },
  {
    name: 'access_key',
    label: 'AccessKey Secret',
    rules: [{ validator: checkAccessSecret }],
  },
  {
    name: 'project_name',
    label: '项目名称',
    rules: [{ validator: checkProjectName }],
  },
  {
    name: 'blob_topic_name',
    label: '主题名称',
    rules: [{ validator: checkName }],
  },
  {
    name: 'odps_table_name',
    label: '表名称',
    rules: [{ validator: checkTableName }],
  },
];

function formatFeatureFields(featureSelect) {
  if (!featureSelect) {
    return [];
  }
  return featureSelect.map((item) => ({
    id: nanoid(),
    name: Object.keys(item)[0],
    type: Object.values(item)[0],
  }));
}

function formatFeatureSelect(values) {
  return Object.values(
    Object.keys(values)
      .filter((key) => /^(featureName_\S{21})|(featureType_\S{21})$/.test(key))
      .reduce((result, current) => {
        const [key, id] = current.split('_');
        result[id] = result[id] || {};
        result[id][key] = values[current];
        return result;
      }, {}),
  ).reduce(
    (result, current) => [
      ...result,
      { [current.featureName]: current.featureType },
    ],
    [],
  );
}

function formatConfigInfo(values, featureSelect) {
  return {
    ..._.omitBy(values, (value, key) =>
      /^(id)|(dataName)|(dataType)|(featureName_\S{21})|(featureType_\S{21})$/.test(
        key,
      ),
    ),
    feature_select: featureSelect,
  };
}

function DataModal({ onClose, type, defaultValues }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataType, setDataType] = useState(defaultValues.data_type ?? null);
  const [dataFeatureVisible, setDataFeatureVisible] = useState(false);
  const [featureFields, setFeatureFields] = useState(
    formatFeatureFields(defaultValues?.config_info?.feature_select),
  );

  const onSave = async () => {
    const values = await form.validateFields().catch(() => {});
    if (!values) {
      return;
    }

    const params = {
      data_name: values.dataName,
      data_type: values.dataType,
      config_info: formatConfigInfo(values, formatFeatureSelect(values)),
    };

    try {
      setLoading(true);
      if (type === 'create') {
        await dataAPI.createData(params);
      } else {
        await dataAPI.updateData({ ...params, id: defaultValues.id });
      }
      message.success('操作成功');
      onClose(null, true);
    } catch (error) {
      console.error(error);
      message.error(error.info || '操作失败');
    }
  };

  const switchForm = async () => {
    const values = await form
      .validateFields(['dataName', 'dataType', ...DATA_TYPE[dataType].attrs])
      .catch(() => {});
    if (!values) {
      return;
    }

    setDataFeatureVisible((value) => !value);
  };

  const onBeforeUpload = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      let data = [];
      try {
        data = reader.result
          .split('\n')
          .slice(1)
          .filter(Boolean)
          .map((item) => item.split(','));
      } catch (error) {
        message.error('文件内容格式不正确，请参照模板。');
      } finally {
        setLoading(false);
      }
      setFeatureFields(
        data.map((item) => ({
          id: nanoid(),
          name: item[0],
          type: item[1],
        })),
      );
    };
    return false;
  };

  const onDeleteFeatureField = (id) => {
    setFeatureFields((value) => value.filter((item) => item.id !== id));
  };

  const onAddFeatureField = () => {
    setFeatureFields((value) => [
      ...value,
      { id: nanoid(), name: '', type: 'number' },
    ]);
  };

  const labelCol = useMemo(() => {
    return DATA_TYPE[dataType]?.formLabelCol || 4;
  }, [dataType]);

  return (
    <Modal
      title={type === 'create' ? '添加数据' : '编辑数据'}
      visible
      destroyOnClose
      onCancel={onClose}
      width={680}
      closable={false}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          labelCol={{ span: labelCol }}
          initialValues={{
            dataName: defaultValues.data_name,
            dataType: defaultValues.data_type,
            ..._.omit(defaultValues.config_info, ['feature_select']),
          }}
        >
          <div style={{ display: !dataFeatureVisible ? 'block' : 'none' }}>
            <Form.Item
              label="数据名称"
              name="dataName"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="数据类型"
              name="dataType"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Select onChange={(val) => setDataType(val)}>
                {Object.keys(DATA_TYPE).map((item) => (
                  <Select.Option key={item} value={Number(item)}>
                    {DATA_TYPE[item].label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {optionalFields
              .filter((item) => DATA_TYPE[dataType]?.attrs.includes(item.name))
              .map(({ label, name, rules, component, inputType, required }) => (
                <Form.Item
                  label={label}
                  name={name}
                  rules={rules}
                  key={name}
                  required={required || true}
                >
                  {component || <Input type={inputType || 'text'} />}
                </Form.Item>
              ))}

            {DATA_TYPE[dataType]?.attrs.includes('begin_time') && (
              <Form.Item label="数据起止时间" name="begin_time">
                <DatePicker.RangePicker
                  separator={<MinusOutlined />}
                  format="YYYY-MM-DD"
                  rules={[
                    {
                      type: 'array',
                      required: true,
                    },
                  ]}
                />
              </Form.Item>
            )}

            {DATA_TYPE[dataType]?.attrs.includes('endpoint') && (
              <Form.Item label="节点" name="endpoint">
                <Select>
                  {DATA_TYPE[dataType].endpoints.map(({ value, label }) => (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item label="数据描述" name="description">
              <Input.TextArea />
            </Form.Item>
          </div>

          <div style={{ display: dataFeatureVisible ? 'block' : 'none' }}>
            {featureFields.map((item, index) => (
              <Form.Item label={`数据特征${index + 1}`} key={item.id}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '7fr 2fr 1fr',
                    gap: '10px',
                    alignItems: 'center',
                  }}
                >
                  <Form.Item
                    noStyle
                    name={`featureName_${item.id}`}
                    initialValue={item.name}
                    rules={[{ required: true, message: '不能为空' }]}
                  >
                    <Input placeholder="请输入名称" />
                  </Form.Item>

                  <Form.Item
                    noStyle
                    name={`featureType_${item.id}`}
                    initialValue={item.type}
                  >
                    <Select placeholder="请选择类型">
                      <Select.Option value="number">数值</Select.Option>
                      <Select.Option value="string">字符串</Select.Option>
                    </Select>
                  </Form.Item>

                  <Tooltip title="删除">
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => onDeleteFeatureField(item.id)}
                    />
                  </Tooltip>
                </div>
              </Form.Item>
            ))}
          </div>
        </Form>

        {dataFeatureVisible && (
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
          >
            <Button
              onClick={() =>
                window.open(
                  `${window.location.origin +
                    window.location.pathname}static/templates/数据特征.csv`,
                )
              }
            >
              下载特征模板
            </Button>
            <Upload
              name="file"
              beforeUpload={onBeforeUpload}
              accept=".csv"
              showUploadList={false}
            >
              <Button>导入数据特征</Button>
            </Upload>
            <Button onClick={() => onAddFeatureField()}>添加一行</Button>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            margin: '10px 0',
            gap: '10px',
            direction: 'rtl',
          }}
        >
          <Button onClick={onClose}>取消</Button>
          <Button onClick={switchForm}>
            {dataFeatureVisible ? '上一步' : '下一步'}
          </Button>
          {dataFeatureVisible && (
            <Button type="primary" onClick={onSave}>
              提交
            </Button>
          )}
        </div>
      </Spin>
    </Modal>
  );
}

DataModal.propTypes = {
  type: PropTypes.oneOf(['create', 'edit']).isRequired,
  onClose: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

DataModal.defaultProps = {
  defaultValues: {},
};

export default DataModal;
