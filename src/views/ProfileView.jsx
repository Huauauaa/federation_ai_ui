import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import withMainLayout from '../hocs/withMainLayout';
import UserForm from '../components/UserForm';
import PasswordModal from '../components/PasswordModal';
import { useUserInfo } from '../hooks/useUserInfo';

const ProfileView = () => {
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const { userInfo } = useUserInfo();
  const formRef = useRef();

  const onUpdatePassword = () => {
    setPasswordModalVisible(true);
  };

  return (
    <>
      <Button onClick={() => onUpdatePassword()}>修改密码</Button>
      <div className="table-main">
        <UserForm
          ref={formRef}
          defaultValues={userInfo}
          disabledFields={['role']}
        />
      </div>
      <Button type="primary" onClick={() => formRef.current.save()}>
        保存信息
      </Button>

      {passwordModalVisible && (
        <PasswordModal
          onClose={() => {
            setPasswordModalVisible(false);
          }}
        />
      )}
    </>
  );
};

export default withMainLayout(ProfileView);
