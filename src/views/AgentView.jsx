import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  DatePicker,
  Input,
  Button,
  Table,
  Badge,
  Tooltip,
  Modal,
  Pagination,
} from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import agentAPI from '../apis/agent.api';
import { dateTimeFormatter, dateToTime } from '../utils';
import { useUserInfo } from '../hooks/useUserInfo';
import withMainLayout from '../hocs/withMainLayout';
import AgentModal from '../components/AgentModal';

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
  const [agentModalConfig, setAgentModalConfig] = useState({
    visible: false,
    type: '',
    defaultValues: {},
  });

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    search: '',
    registered_at_after: '',
    registered_at_before: '',
    limit: 10,
  });

  const getData = useCallback(
    async (params) => {
      try {
        setLoading(true);
        const queryParams = { ...searchParams, ...params };
        const { results, count } = await agentAPI.searchAgents(queryParams);
        setSearchParams(queryParams);
        setData(results);
        setTotal(count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [searchParams],
  );

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = ({ searchInput, timeRange }) => {
    getData({
      page: 1,
      search: searchInput,
      registered_at_after: timeRange ? dateToTime(timeRange[0]) : '',
      registered_at_before: timeRange
        ? dateToTime(timeRange[1], { hour: 23, minute: 59, second: 59 })
        : '',
    });
  };

  const onTableChange = (current, pageSize) => {
    getData({ page: current, limit: pageSize });
  };

  return (
    <>
      <div className="table-header" style={{ marginBottom: '20px' }}>
        <Form layout="inline" onFinish={onSearch}>
          <Form.Item label="节点名称" name="searchInput">
            <Input type="text" allowClear placeholder="请输入内容" />
          </Form.Item>
          <Form.Item label="注册时间" name="timeRange">
            <DatePicker.RangePicker
              separator={<MinusOutlined />}
              format="YYYY-MM-DD"
              {...rangeConfig}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">搜索</Button>
          </Form.Item>
          <Form.Item style={{ display: 'flex', margin: '0 0 0 auto' }}>
            <Button
              type="primary"
              onClick={() => {
                setAgentModalConfig({ type: 'create', visible: true });
              }}
            >
              添加节点
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="table-main">
        <Table
          dataSource={data}
          rowKey="id"
          scroll={{ x: 1300 }}
          loading={loading}
          onChange={onTableChange}
          pagination={false}
        >
          <Table.Column
            title="节点名称"
            dataIndex="name"
            align="center"
            fixed="left"
          />
          <Table.Column title="注册人" dataIndex="registrant" align="center" />
          <Table.Column title="IP" dataIndex="ip" align="center" />
          <Table.Column
            title="访问级别"
            dataIndex="is_public"
            align="center"
            render={(isPublic) => <>{isPublic ? '公开' : '私有'}</>}
          />
          <Table.Column title="操作系统" dataIndex="os" align="center" />
          <Table.Column
            title="Docker 版本"
            dataIndex="docker_version"
            align="center"
          />
          <Table.Column
            title="注册时间"
            dataIndex="registered_at"
            align="center"
            width={180}
            render={(val) => <>{dateTimeFormatter(val)}</>}
          />
          <Table.Column
            title="节点类型"
            dataIndex="is_cloud"
            align="center"
            render={(val) => <>{val ? '发起方' : '参与方'}</>}
          />
          <Table.Column
            title="状态"
            align="center"
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
            fixed="right"
            align="center"
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
                    onClick={() => {
                      setAgentModalConfig({
                        type: 'edit',
                        visible: true,
                        defaultValues: text,
                      });
                    }}
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

        <Pagination
          position={['bottomCenter']}
          total={total}
          current={searchParams.page}
          pageSize={searchParams.limit}
          showTotal={(_total, range) =>
            `第 ${range.join(' - ')} 条 / 总共 ${total} 条`
          }
          showQuickJumper
          hideOnSinglePage
          onChange={onTableChange}
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0 0',
          }}
        />

        {agentModalConfig.visible && (
          <AgentModal
            onClose={(e, refresh = false) => {
              setAgentModalConfig({ visible: false, defaultValues: {} });
              if (refresh) {
                getData();
              }
            }}
            getData={getData}
            {...agentModalConfig}
          />
        )}
      </div>
    </>
  );
};

export default withMainLayout(AgentView);
