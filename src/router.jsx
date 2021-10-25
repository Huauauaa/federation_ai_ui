import React from 'react';
import loadable from '@loadable/component';
import { Redirect, Route } from 'react-router-dom';
import HomeView from './views/Home';
import { useUserInfo } from './hooks/useUserInfo';

const routers = [
  {
    path: '/',
    exact: true,
    isPublic: false,
    component: HomeView,
  },
  {
    path: '/sign-in',
    exact: true,
    isPublic: true,
    component: loadable(() => import('./views/SignIn')),
  },
  {
    path: '/sign-up',
    exact: true,
    isPublic: true,
    component: loadable(() => import('./views/SignUp')),
  },
  {
    path: '/forgot-password',
    exact: true,
    isPublic: true,
    component: loadable(() => import('./views/ForgotPassword')),
  },
  {
    path: '/agent',
    exact: true,
    component: loadable(() => import('./views/AgentView')),
    label: '节点管理',
    menu: true,
  },
  {
    path: '/data',
    exact: true,
    component: loadable(() => import('./views/DataView')),
    label: '数据管理',
    menu: true,
  },
  {
    path: '/federation',
    exact: true,
    component: loadable(() => import('./views/FederationView')),
    label: '联邦任务',
    menu: true,
  },
  {
    path: '/user',
    exact: true,
    component: loadable(() => import('./views/UserView')),
    label: '用户管理',
    menu: true,
  },
  {
    path: '/profile',
    exact: true,
    component: loadable(() => import('./views/ProfileView')),
    label: '个人信息',
    menu: true,
  },
];

const RenderRoutes = (route) => {
  const { isLogin } = useUserInfo();
  const {
    isPublic,
    path,
    location: { pathname },
  } = route;
  if (isLogin || isPublic) {
    return (
      <Route
        path={path}
        render={(props) => {
          return <route.component {...props} />;
        }}
      />
    );
  }

  const search =
    pathname === '/sign-in' ? null : `redirect=${encodeURIComponent(pathname)}`;
  return (
    <Redirect
      to={{
        pathname: '/sign-in',
        search,
      }}
    />
  );
};
export { routers, RenderRoutes };
