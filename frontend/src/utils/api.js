const BASE_URL = ''; // Proxy handles this in vite.config.js

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = response.statusText;
        const contentType = response.headers.get('content-type');
        
        try {
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorData.detail || response.statusText;
            } else {
                const textError = await response.text();
                if (textError) errorMessage = textError;
            }
        } catch (e) {
            // Fallback
        }
        throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json().catch(() => ({}));
    }
    return response.text();
};

export const api = {
    get: async (url) => {
        const response = await fetch(url, {
            credentials: 'include',
        });
        return handleResponse(response);
    },
    post: async (url, body) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },
    put: async (url, body) => {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },
    delete: async (url) => {
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
        });
        return handleResponse(response);
    },
};

// Auth
export const authApi = {
    signIn: (credentials) => api.post('/api/auth/sign-in', credentials),
    signUp: (data) => api.post('/api/auth/sign-up', data),
    updatePassword: (data) => api.post('/api/auth/updatePassword', data),
    me: () => api.get('/api/user/me'),
};

// Users
export const userApi = {
    list: () => api.get('/api/user/list'),
    get: (id) => api.get(`/api/user/get?id=${id}`),
    updateProfile: (data) => api.post('/api/user/updateProfile', data),
    getNextRole: () => api.get('/api/user/nextRole'),
    getExpToNextRole: () => api.get('/api/user/expToNextRole'),
    getExpMapping: () => api.get('/api/user/expToRoleMapping'),
};

// Rooms
export const roomApi = {
    list: () => api.get('/api/room/list'),
    get: (id) => api.get(`/api/room/get?id=${id}`),
};

// Devices
export const deviceApi = {
    sensors: (roomId) => api.get(`/api/sensor/list${roomId ? `?roomId=${roomId}` : ''}`),
    actuators: (roomId) => api.get(`/api/actuator/list${roomId ? `?roomId=${roomId}` : ''}`),
    sensorDetails: (id) => api.get(`/api/sensor/get?id=${id}`),
    actuatorDetails: (id) => api.get(`/api/actuator/get?id=${id}`),
    sensorReadings: (id) => api.get(`/api/sensor/readings?id=${id}`),
    actuatorHistory: (id) => api.get(`/api/actuator/history?id=${id}`),
};

// News
export const newsApi = {
    list: () => api.get('/api/news/list'),
    get: (slug) => api.get(`/api/news/get?slug=${slug}`),
};

// Admin
export const adminApi = {
    users: () => api.get('/api/admin/user/list'),
    updateUser: (data) => api.post('/api/admin/user/update', data),
    createRoom: (data) => api.post('/api/admin/room/create', data),
    updateRoom: (data) => api.post('/api/admin/room/update', data),
    deleteRoom: (id) => api.delete(`/api/admin/room/delete?id=${id}`),
};

// Transport
export const transportApi = {
    getNextRerA: () => api.get('/api/transport/rer-a/next'),
};
