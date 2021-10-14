import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, DatePicker, Button } from 'antd';
import { MinusOutlined } from '@ant-design/icons';

function SearchBar({ children, onSearch, addButton, initialValues }) {
  return (
    <Form layout="inline" onFinish={onSearch} initialValues={initialValues}>
      <Form.Item name="searchInput">
        <Input type="text" allowClear placeholder="搜索" />
      </Form.Item>
      <Form.Item name="timeRange">
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
      {children}
      <Form.Item>
        <Button htmlType="submit">搜索</Button>
      </Form.Item>

      <Form.Item style={{ display: 'flex', margin: '0 0 0 auto' }}>
        {addButton}
      </Form.Item>
    </Form>
  );
}

SearchBar.propTypes = {
  addButton: PropTypes.node,
  children: PropTypes.node,
  onSearch: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

SearchBar.defaultProps = {
  children: null,
  addButton: null,
  initialValues: {},
};

export default SearchBar;
