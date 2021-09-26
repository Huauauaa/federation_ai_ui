import React, { useState, useEffect } from 'react';
import {
  Form,
  DatePicker,
  Spin,
  Input,
  Button,
  Table,
  Badge,
  Tooltip,
  Modal,
} from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import agentAPI from '../apis/agent.api';
import { dateTimeFormatter, dateToTime } from '../utils';
import { useUserInfo } from '../hooks/useUserInfo';
import withMainLayout from '../hocs/withMainLayout';
import TablePagination from '../components/TablePagination';

const rangeConfig = {
  rules: [
    {
      type: 'array',
      required: true,
    },
  ],
};

const AgentView = () => {
  const { userInfo } = useUserInfo();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    search: '',
    registered_at_after: '',
    registered_at_before: '',
  });

  const getData = async (params) => {
    try {
      setLoading(true);
      const mergedParams = { ...searchParams, ...params };
      setSearchParams(mergedParams);

      const { results, count } = await agentAPI.searchAgents(mergedParams);
      setData(results);
      setTotalCount(count);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = ({ searchInput, timeRange }) => {
    getData({
      page: 1,
      search: searchInput,
      registered_at_after: timeRange ? dateToTime(timeRange[0]) : '',
      registered_at_before: timeRange
        ? dateToTime(timeRange[1], { hour: 23, minute: 59, second: 59 })
        : '',
    });
  };

  const changePage = (current, pageSize) => {
    getData({ page: current, limit: pageSize });
  };

  return (
    <Spin spinning={loading}>
      <div className="table-header">
        <Form layout="inline" onFinish={onFinish}>
          <Form.Item label="节点名称" name="searchInput">
            <Input type="text" placeholder="搜索" allowClear />
          </Form.Item>
          <Form.Item label="注册时间" name="timeRange">
            <DatePicker.RangePicker
              separator={<MinusOutlined />}
              format="YYYY-MM-DD"
              {...rangeConfig}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="table-main">
        <Table dataSource={data} rowKey="id" pagination={false}>
          <Table.Column title="节点名称" dataIndex="name" />
          <Table.Column title="注册人" dataIndex="registrant" />
          <Table.Column title="IP" dataIndex="ip" />
          <Table.Column
            title="访问级别"
            dataIndex="is_public"
            render={(isPublic) => <>{isPublic ? '公开' : '私有'}</>}
          />
          <Table.Column title="操作系统" dataIndex="os" />
          <Table.Column title="Docker 版本" dataIndex="docker_version" />
          <Table.Column
            title="注册时间"
            dataIndex="registered_at"
            render={(val) => <>{dateTimeFormatter(val)}</>}
          />
          <Table.Column
            title="节点类型"
            dataIndex="is_cloud"
            render={(val) => <>{val ? '发起方' : '参与方'}</>}
          />
          <Table.Column
            title="状态"
            dataIndex="status"
            render={(val) => (
              <>
                {val === 0 ? (
                  <Badge color="red" text="未使用" />
                ) : (
                  <Badge color="green" text="使用中" />
                )}
              </>
            )}
          />
          <Table.Column
            title="操作"
            render={(text) => (
              <>
                <Tooltip title="下载">
                  <Button
                    type="text"
                    disabled={
                      text.is_public && text.registrant !== userInfo.username
                    }
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      agentAPI.downloadAgent({
                        id: text.id,
                        username: userInfo.username,
                      });
                    }}
                  />
                </Tooltip>
                <Tooltip title="编辑">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {}}
                  />
                </Tooltip>
                <Tooltip title="删除">
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      Modal.confirm({
                        title: '确定删除吗？',
                        okText: '确认',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                          console.log('删除');
                        },
                      });
                    }}
                  />
                </Tooltip>
              </>
            )}
          />
        </Table>

        <TablePagination
          {...searchParams}
          totalCount={totalCount}
          changePage={changePage}
        />
      </div>
    </Spin>
  );
};

export default withMainLayout(AgentView);
