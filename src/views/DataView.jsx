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
import {
  PlaySquareOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dataAPI from '../apis/data.api';
import { dateTimeFormatter, dateToTime } from '../utils';
import withMainLayout from '../hocs/withMainLayout';
import DataModal from '../components/DataModal';
import DataAnalysisModal from '../components/DataAnalysisModal';
import { DATA_TYPE } from '../utils/const';
import SearchBar from '../components/SearchBar';

const DataView = () => {
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
        const { results, count } = await dataAPI.searchData(queryParams);
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

  async function onDeleteData(id) {
    try {
      setLoading(true);
      await dataAPI.deleteData(id);
      await getData();
      message.success('删除成功');
    } catch (error) {
      console.error(error);
      message.error(error.detail || '删除失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="table-header" style={{ marginBottom: '20px' }}>
        <SearchBar
          initialValues={{ dataType: '' }}
          onSearch={onSearch}
          addButton={
            <Button
              type="primary"
              onClick={() => {
                setModalConfig({ type: 'create', visible: true });
              }}
            >
              添加数据
            </Button>
          }
        >
          <Form.Item name="dataType">
            <Select style={{ width: '150px' }}>
              <Select.Option value="">全部</Select.Option>
              {Object.keys(DATA_TYPE).map((item) => (
                <Select.Option key={item} value={item}>
                  {DATA_TYPE[item].label}
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
            title="数据名称"
            dataIndex="data_name"
            align="center"
            fixed="left"
          />
          <Table.Column title="创建人" dataIndex="uploader" align="center" />
          <Table.Column title="权限管理" align="center" render={() => '私有'} />

          <Table.Column
            title="创建日期"
            align="center"
            render={(val) => dateTimeFormatter(val.uploaded_at)}
          />
          <Table.Column
            title="开始时间"
            align="center"
            render={(val) => dateTimeFormatter(val.config_info.begin_time)}
          />
          <Table.Column
            title="结束时间"
            align="center"
            render={(val) => dateTimeFormatter(val.config_info.end_time)}
          />
          <Table.Column
            title="数据类型"
            align="center"
            render={(val) => DATA_TYPE[val.data_type].label}
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
                          onDeleteData(text.id);
                        },
                      });
                    }}
                  />
                </Tooltip>
                <Tooltip title="分析">
                  <Button
                    type="text"
                    disabled={text.isUse || text.data_type !== 2}
                    icon={<PlaySquareOutlined />}
                    onClick={async () => {
                      try {
                        await dataAPI.clearResult(text.id);
                        setDataAnalysisModalConfig({
                          visible: true,
                          defaultValues: text,
                        });
                      } catch (error) {
                        console.error(error);
                        message.error(error.info || '操作失败');
                      }
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
          <DataModal
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

export default withMainLayout(DataView);
