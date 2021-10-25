import React, { useRef } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import UserForm from './UserForm';

function UserModal({ onClose, type, defaultValues }) {
  const formRef = useRef();

  const onOK = () => {
    formRef.current.save();
  };

  return (
    <Modal
      title={type === 'create' ? '添加用户' : '编辑用户'}
      visible
      destroyOnClose
      onCancel={onClose}
      onOk={onOK}
      width={400}
      closable={false}
    >
      <UserForm
        ref={formRef}
        type={type}
        defaultValues={defaultValues}
        onClose={onClose}
        disabledFields={['email', 'firstName', 'lastName']}
        hiddenFields={['lastLogin', 'joinedDate']}
      />
    </Modal>
  );
}

UserModal.propTypes = {
  type: PropTypes.oneOf(['create', 'edit']).isRequired,
  onClose: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

UserModal.defaultProps = {
  defaultValues: {},
};

export default UserModal;
