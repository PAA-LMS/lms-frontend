import axios from 'axios';

// Create an axios instance
const API_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await axios.post(`${API_URL}/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  getAllUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },
  
  getUserById: async (userId: number) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  updateUser: async (userId: number, userData: any) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
  
  deleteUser: async (userId: number) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

// Courses API
export const coursesAPI = {
  getAllCourses: async () => {
    const response = await api.get('/courses/');
    return response.data;
  },
  
  getLecturerCourses: async () => {
    const response = await api.get('/courses/my-courses');
    return response.data;
  },

  getCourseById: async (courseId: number) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },
  
  createCourse: async (courseData: any) => {
    const response = await api.post('/courses/', courseData);
    return response.data;
  },
  
  updateCourse: async (courseId: number, courseData: any) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  },
  
  deleteCourse: async (courseId: number) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },
};

export default api; 