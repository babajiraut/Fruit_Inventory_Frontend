import axios from 'axios';

const api = axios.create({ 
  // If VITE_API_URL exists in .env, it uses it. 
  // Otherwise, it automatically connects directly to your live Render backend!
  baseURL: import.meta.env.VITE_API_URL || "https://onrender.com" 
}); 

export const fruitApi = { 
  list: (params) => api.get('/fruits', { params }), 
  stats: () => api.get('/fruits/stats'), 
  create: (payload) => api.post('/fruits', payload), 
  update: (id, payload) => api.put(`/fruits/${id}`, payload), 
  remove: (id) => api.delete(`/fruits/${id}`) 
};
