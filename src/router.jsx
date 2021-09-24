import React from 'react';
import loadable from '@loadable/component';
import { Redirect, Route } from 'react-router-dom';
import HomeView from './views/Home';
import { useUserInfo } from './hooks/useUserInfo';

const routers = [
  {
    path: '/',
    exact: true,
    component: HomeView,
  },
  {
    path: '/sign-in',
    exact: true,
    public: true,
    component: loadable(() => import('./views/SignIn')),
  },
  {
    path: '/sign-up',
    exact: true,
    public: true,
    component: loadable(() => import('./views/SignUp')),
  },
  {
    path: '/forgot-password',
    exact: true,
    public: true,
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
];

function renderRoute(route) {
  return (
    <Route
      path={route.path}
      render={(props) => {
        return <route.component {...props} routes={route.routes} />;
      }}
    />
  );
}
const RouteWithSubRoutes = (route) => {
  const { isLogin, userInfo } = useUserInfo();
  if (isLogin || route.public) {
    if (route.path === '/') {
      return renderRoute(route);
    }

    if (userInfo && route.params) {
      return <Redirect to="/" />;
    }

    return renderRoute(route);
  }
  const search =
    route.location.pathname === '/'
      ? null
      : `redirect=${encodeURIComponent(route.location.pathname)}`;

  return (
    <Redirect
      to={{
        pathname: '/sign-in',
        search,
      }}
    />
  );
};
export { routers, RouteWithSubRoutes };
