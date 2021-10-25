import http from '../utils/http';

export default {
  async changePassword(userId, password, newPassword) {
    const res = await http.post(`/users/${userId}/change_password/`, {
      password,
      new_password: newPassword,
    });

    return res;
  },
  search(params) {
    return http.get('/users/', { params });
  },
  update(user) {
    return http.patch(`/users/${user.id}/`, user);
  },
  delete(id) {
    return http.post(`/users/${id}/deactivate/`);
  },
  // sendEmail(params) {
  //   return http.post('/users/send_email/', params);
  // },
  // getAuthCode(payload) {
  //   return http.post('/users/send_auth_code/', payload);
  // },
  // resetPassword(payload) {
  //   return http.post('/users/reset_password/', payload);
  // },
};
