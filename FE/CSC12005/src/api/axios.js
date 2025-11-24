import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // để gửi cookie refreshToken
});

// request interceptor: gắn accessToken
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor: tự động refresh khi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        console.log("Refresh token response:", res.data); // debug
        const newAccessToken = res.data.result;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh");
        }

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // console.log("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        // window.location.href = "/login"; // logout
      }
    }

    return Promise.reject(error);
  }
);

export default api;
