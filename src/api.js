import axios from 'axios';

const api = axios.create({ 
  // Vite will automatically intercept this relative path 
  // and redirect it to your Render or localhost backend URL!
  baseURL: '/api' 
}); 

export const fruitApi = { 
  list: (params) => api.get('/fruits', { params }), 
  stats: () => api.get('/fruits/stats'), 
  create: (payload) => api.post('/fruits', payload), 
  update: (id, payload) => api.put(`/fruits/${id}`, payload), 
  remove: (id) => api.delete(`/fruits/${id}`) 
};
