import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export const fruitApi = {
  list: (params) => api.get("/fruits", { params }),
  stats: () => api.get("/fruits/stats"),
  create: (payload) => api.post("/fruits", payload),
  update: (id, payload) => api.put(`/fruits/${id}`, payload),
  remove: (id) => api.delete(`/fruits/${id}`)
};