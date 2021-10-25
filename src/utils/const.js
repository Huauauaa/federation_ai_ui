export const DATA_TYPE = Object.freeze({
  0: {
    label: '本地图片文件',
    attrs: ['document_path', 'feature_select'],
  },
  1: {
    label: 'MySQL 数据库',
    attrs: [
      'db_name',
      'db_url',
      'db_port',
      'db_username',
      'db_password',
      'table_name',
      'feature_select',
    ],
  },
  2: { label: '本地 CSV 文件', attrs: ['document_path', 'feature_select'] },
  3: { label: '本地 JSON 文件', attrs: ['document_path', 'feature_select'] },
  4: {
    label: 'Kafka 消息队列',
    attrs: [
      'kafka_server_ip',
      'kafka_server_port',
      'topic_name',
      'begin_time',
      'end_time',
      'feature_select',
    ],
    formLabelCol: 6,
  },
  5: {
    label: '阿里云 DataHub',
    attrs: [
      'access_id',
      'access_key',
      'endpoint',
      'project_name',
      'blob_topic_name',
      'feature_select',
    ],
    formLabelCol: 6,
    endpoints: [
      {
        value: 'https://dh-cn-hangzhou.aliyuncs.com',
        label: '华东1（杭州）',
      },
      {
        value: 'https://dh-cn-shanghai.aliyuncs.com',
        label: '华东2（上海）',
      },
    ],
  },
  6: {
    label: 'Oracle 数据库',
    attrs: [
      'db_name',
      'db_url',
      'db_port',
      'db_username',
      'db_password',
      'table_name',
      'feature_select',
    ],
  },
  7: {
    label: 'GaussDB 数据库',
    attrs: [
      'db_name',
      'db_url',
      'db_port',
      'db_username',
      'db_password',
      'table_name',
      'feature_select',
    ],
  },
  8: {
    label: 'Hive 数据仓库',
    attrs: [
      'db_name',
      'db_url',
      'db_port',
      'db_username',
      'db_password',
      'table_name',
      'feature_select',
    ],
  },
  9: {
    label: 'ODPS 数据仓库',
    attrs: [
      'access_id',
      'access_key',
      'endpoint',
      'project_name',
      'odps_table_name',
      'feature_select',
    ],
    endpoints: [
      {
        value: 'http://service.cn-hangzhou.maxcompute.aliyun.com/api',
        label: '华东1（杭州）',
      },
      {
        value: 'http://service.cn-shanghai.maxcompute.aliyun.com/api',
        label: '华东2（上海）',
      },
    ],
  },
});

export const INVITE_STATUS = Object.freeze({
  0: {
    label: '邀请中',
    color: 'orange',
  },
  1: {
    label: '已接受',
    color: 'green',
  },
  2: {
    label: '已拒绝',
    color: 'volcano',
  },
});

export const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.~!@#$%^&*()_:<>?'.split(
  '',
);

export const APP_STATUS = {
  0: '仅有逻辑拓扑',
  1: '完成编排',
  2: '应用运行中',
  3: '应用已停止',
  4: '编排中',
  5: '控制器部署中',
  6: '控制器启动中',
  7: '停止中',
  8: '卸载中',
  9: '彻底清除中',
  10: '应用组件部署中',
  11: '应用组件启动中',
};

export const CONTAINER_STATUS = {
  0: '未启动',
  1: '运行中',
  2: '重启中',
  3: '已暂停',
  4: '已退出',
  5: '已创建',
  6: '准备就绪',
};

export const REASON = {
  0: '内存或CPU占用已达75%(请重新配置容器内存或CPU)',
  1: '连接丢失，无法获取容器信息（请重新启动设备）',
  2: '应用容器一直处于重启状态（请查看应用容器故障原因）',
  3: '应用容器异常退出（请重新启动容器）',
  4: '系统Broker断开连接（请重新启动EdgeAI系统组件）',
  5: '内存或CPU占用已达85%(请重新配置容器内存或CPU)',
  undefined: '内存或CPU占用已达95%(请重新配置容器内存或CPU)',
};

export const MODEL_TYPE = {
  0: 'horizontal_cnn',
  1: 'horizontal_kmeans',
  2: 'horizontal_lr',
  3: 'vertical_cnn',
  4: 'vertical_lr',
};

export const ROLES = [
  { key: 'superuser', label: '平台管理员' },
  { key: 'staff', label: '项目管理员' },
  { key: 'normal', label: '项目成员' },
];
