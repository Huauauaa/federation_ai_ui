import { useContext } from 'react';
import UserInfoContext from '../contexts/UserInfoContext';

export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error(
      `The \`useUserInfo\` hook must be used inside the <UserInfoContext> component's context.`,
    );
  }
  return context;
};
