import axios from 'axios';

// The base URL defaults to `/api` which Nginx will correctly reverse proxy to backend!
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth Services
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const login = async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('user');
};

// Complaint Services
export const getComplaints = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/complaints${params ? `?${params}` : ''}`);
    return response.data;
};

export const createComplaint = async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
};

export const updateComplaintStatus = async (id, status) => {
    const response = await api.put(`/complaints/${id}`, { status });
    return response.data;
};

export default api;
