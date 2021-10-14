import http from '../utils/http';

export default {
  searchData(params) {
    return http.get('/data/', { params });
  },
  createData(payload) {
    return http.post('/data/', payload);
  },
  deleteData(id) {
    return http.delete(`/data/${id}/`);
  },
  updateData(payload) {
    return http.patch(`/data/${payload.id}/`, payload);
  },
  dataAnalysis(payload) {
    return http.post(`/data/${payload.id}/data_analysis/`, payload);
  },
  clearResult(id) {
    return http.get(`/data/${id}/clear_result/`);
  },
};
