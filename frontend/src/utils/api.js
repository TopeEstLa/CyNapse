export const BASE_URL = import.meta.env.VITE_API_URL || '';

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
        let errorMessage = response.statusText;
        
        try {
            if (isJson) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorData.detail || response.statusText;
            } else {
                const textError = await response.text();
                if (textError) errorMessage = textError;
            }
        } catch (e) {
        }
        throw new Error(errorMessage);
    }
    
    if (isJson) {
        return response.json().catch(() => ({}));
    }
    
    const text = await response.text();
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.warn('API returned HTML instead of JSON. Check backend URL or proxy.');
        return {};
    }
    return text;
};

export const api = {
    get: async (url) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            credentials: 'include',
        });
        return handleResponse(response);
    },
    post: async (url, body) => {
        const response = await fetch(`${BASE_URL}${url}`, {
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
        const response = await fetch(`${BASE_URL}${url}`, {
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
        const response = await fetch(`${BASE_URL}${url}`, {
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
    updateActuatorState: (id, state) => api.post(`/api/actuator/update-state?id=${id}&state=${state}`),
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
