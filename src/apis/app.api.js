import http from '../utils/http';

export default {
  searchApplication(params) {
    return http.get('/apps/', { params });
  },
};
