import React, { useState } from 'react';
import { DatePicker, message, Alert, Button } from 'antd';
import './assets/styles/app.less';

function App() {
  const [date, setDate] = useState(null);
  const handleChange = (value) => {
    message.info(
      `您选择的日期是: ${value ? value.format('YYYY年MM月DD日') : '未选择'}`,
    );
    setDate(value);
  };
  return (
    <div style={{ width: 400, margin: '100px auto' }}>
      <DatePicker onChange={handleChange} />
      <Alert
        message="当前日期"
        description={date ? date.format('YYYY年MM月DD日') : '未选择'}
      />
      <p>Lorem ipsum dolor sit amet.</p>
      <Button type="primary">primary</Button>
    </div>
  );
}

export default App;
