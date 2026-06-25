import axios, { type InternalAxiosRequestConfig } from 'axios';

// 1. Ensure withCredentials is true so the browser sends your cookies automatically
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (reason?: any) => void }> = [];

// Notice we don't pass a 'token' around anymore, because the browser holds it!
const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(); 
    }
  });
  failedQueue = [];
};

// 2. Request Interceptor
// If you are using HttpOnly cookies, you don't need to manually set the Authorization header!
// The browser will automatically attach the cookie to the request.
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 3. Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Once resolved, just retry the request. The new cookie is already stored by the browser.
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        //  IMPORTANT: Use standard axios, but MUST include withCredentials!
        // The browser will automatically send your expired HttpOnly refresh cookie in this request.
        await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
          withCredentials: true 
        });

        // The backend responds to the above request with a new `Set-Cookie` header.
        // The browser intercepts that header and updates your cookies automatically!
        // We don't have to extract or save anything manually.

        processQueue(null);

        // Retry the original request (it will now carry the fresh cookie)
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);
        
        // If the refresh route fails, the user is truly logged out.
        // Note: Your backend should ideally clear the cookies via Set-Cookie headers here.
        window.location.href = '/login'; 
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);