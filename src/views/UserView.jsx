import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Button,
  Table,
  Tooltip,
  Modal,
  Pagination,
  message,
  Select,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import API from '../apis/user.api';
import { dateTimeFormatter, getRole } from '../utils';
import withMainLayout from '../hocs/withMainLayout';
import UserModal from '../components/UserModal';
import DataAnalysisModal from '../components/DataAnalysisModal';
import { ROLES } from '../utils/const';
import SearchBar from '../components/SearchBar';

const UserView = () => {
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: '',
    defaultValues: {},
  });

  const [dataAnalysisModalConfig, setDataAnalysisModalConfig] = useState({
    visible: false,
  });

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
  });

  const getData = useCallback(
    async (params) => {
      try {
        setLoading(true);
        const queryParams = { ...searchParams, ...params };
        const { results, count } = await API.search(queryParams);
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

  const onSearch = ({ role }) => {
    const param = {};
    switch (role) {
      case 'superuser':
        param.is_superuser = true;
        param.is_staff = true;
        break;
      case 'staff':
        param.is_superuser = false;
        param.is_staff = true;
        break;
      case 'normal':
        param.is_superuser = false;
        param.is_staff = false;
        break;
      default:
        param.is_superuser = undefined;
        param.is_staff = undefined;
        break;
    }
    getData({
      page: 1,
      ...param,
    });
  };

  const onTableChange = (current, pageSize) => {
    getData({ page: current, limit: pageSize });
  };

  async function onDelete(id) {
    try {
      setLoading(true);
      await API.delete(id);
      await getData();
      message.success('删除成功');
    } catch (error) {
      console.error(error);
      message.error(error.detail || '服务器出错');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="table-header" style={{ marginBottom: '20px' }}>
        <SearchBar initialValues={{ role: '' }} onSearch={onSearch}>
          <Form.Item name="role">
            <Select style={{ width: '150px' }}>
              <Select.Option value="">全部角色</Select.Option>
              {ROLES.map((item) => (
                <Select.Option key={item.key} value={item.key}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </SearchBar>
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
            title="用户名"
            dataIndex="username"
            align="center"
            fixed="left"
          />
          <Table.Column
            title="姓名"
            align="center"
            render={(val) => `${val.first_name} ${val.last_name}`}
          />
          <Table.Column
            title="注册时间"
            align="center"
            render={(val) => dateTimeFormatter(val.date_joined)}
          />
          <Table.Column
            title="上次登录"
            align="center"
            render={(val) => dateTimeFormatter(val.last_login)}
          />
          <Table.Column
            title="邮箱"
            align="left"
            dataIndex="email"
            onHeaderCell={(column) => {
              column.align = 'center';
            }}
          />
          <Table.Column
            title="角色"
            align="center"
            render={(val) => getRole(val).label}
          />

          <Table.Column
            title="操作"
            fixed="right"
            align="center"
            render={(text) => (
              <>
                <Tooltip title="编辑">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    disabled={text.isUse}
                    onClick={() => {
                      setModalConfig({
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
                    disabled={text.isUse}
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      Modal.confirm({
                        title: '确定删除吗？',
                        okText: '确认',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                          onDelete(text.id);
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

        {modalConfig.visible && (
          <UserModal
            onClose={(e, refresh = false) => {
              setModalConfig({ visible: false, defaultValues: {} });
              if (refresh) {
                getData();
              }
            }}
            getData={getData}
            {...modalConfig}
          />
        )}

        {dataAnalysisModalConfig.visible && (
          <DataAnalysisModal
            defaultValues={dataAnalysisModalConfig.defaultValues}
            onClose={() => {
              setDataAnalysisModalConfig({ visible: false });
            }}
            callback={(a) => {
              console.log('callback', a);
            }}
          />
        )}
      </div>
    </>
  );
};

export default withMainLayout(UserView);
