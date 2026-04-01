import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Products ────────────────────────────────────

export const getProducts = (params = {}) =>
  client.get('/products', { params }).then((r) => r.data);

export const getProduct = (id) =>
  client.get(`/products/${id}`).then((r) => r.data);

export const updateProduct = (id, data) =>
  client.put(`/products/${id}`, data).then((r) => r.data);

export const getProductsOnSale = (params = {}) =>
  client.get('/products/ofertas', { params }).then((r) => r.data);

export const getMarcas = () =>
  client.get('/products/marcas').then((r) => r.data);

export const getCategorias = () =>
  client.get('/products/categorias').then((r) => r.data);

export const getVariants = (productId) =>
  client.get(`/products/${productId}/variants`).then((r) => r.data);

// ─── Checkout ────────────────────────────────────

export const processCheckout = (data) =>
  client.post('/checkout', data).then((r) => r.data);

// ─── Auth ────────────────────────────────────────

export const login = (credentials) =>
  client.post('/auth/login', credentials).then((r) => r.data);

// ─── Admin Orders ────────────────────────────────

export const getAdminOrders = () =>
  client.get('/admin/orders').then((r) => r.data);

export const updateOrderStatus = (id, status) =>
  client.put(`/admin/orders/${id}/status?status=${status}`).then((r) => r.data);

// ─── Promotions ──────────────────────────────────

export const getActivePromotions = () =>
  client.get('/promotions/active').then((r) => r.data);

export const registerPromotionClick = (id) =>
  client.post(`/promotions/${id}/click`).then((r) => r.data);

export const getAllPromotions = () =>
  client.get('/promotions').then((r) => r.data);

export const createPromotion = (data) =>
  client.post('/promotions', data).then((r) => r.data);

export const updatePromotion = (id, data) =>
  client.put(`/promotions/${id}`, data).then((r) => r.data);

export const deletePromotion = (id) =>
  client.delete(`/promotions/${id}`).then((r) => r.data);

// ─── Legal Content ───────────────────────────────

export const getLegalContent = (type) =>
  client.get(`/legal/${type}`).then((r) => r.data);

export const saveLegalContent = (type, data) =>
  client.post(`/legal/${type}`, data).then((r) => r.data);

export default client;
