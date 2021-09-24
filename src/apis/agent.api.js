import http, { baseURL } from '../utils/http';
import { exportData } from '../utils';

export default {
  searchAgents(params) {
    return http.get('/agents/', { params });
  },
  downloadAgent({ id, username }) {
    exportData(`${baseURL}/agents/${id}/get_zip/${username}`);
  },
};
