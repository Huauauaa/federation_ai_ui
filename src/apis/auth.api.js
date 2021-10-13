import http from '../utils/http';

export default {
  searchUser(params) {
    return http.get('/users/', { params });
  },
  fetchUserInfo() {
    return http.get('/users/get_current_user/');
  },
  sendEmail(payload) {
    return http.post('/users/send_email/', payload);
  },
  signIn({ username, password }) {
    return http.post('/auth/login/', {
      username,
      password,
    });
  },
  signOut() {
    return http.post('/auth/logout/');
  },
  // logoutHarbor() {
  //   return harborHttp.get('/c/log_out', { baseURL: '/harbor' });
  // },
  getAuthCode(payload) {
    return http.post('/users/send_auth_code/', payload);
  },
  resetPassword(payload) {
    return http.post('/users/reset_password/', payload);
  },
};
