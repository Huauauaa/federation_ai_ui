import React, { memo } from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

const TablePagination = ({ totalCount, changePage, page, limit }) => {
  return (
    <Pagination
      current={page}
      total={totalCount}
      pageSize={limit}
      defaultPageSize={limit}
      showSizeChanger
      showQuickJumper
      showTotal={(total) =>
        `第
            ${(page - 1) * limit + 1} - 
            ${Math.min(page * limit, total)} 条 / 共 ${total} 条`
      }
      onChange={changePage}
    />
  );
};

TablePagination.propTypes = {
  totalCount: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number,
};
TablePagination.defaultProps = {
  limit: 10,
};

export default memo(TablePagination);
