import axios from "axios";
import { stompService } from "../services/StompService";
// ✅ API instance chính - Có interceptor để add accessToken
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ✅ RefreshApi RIÊNG - KHÔNG có interceptor
const refreshApi = axios.create({
  baseURL: import.meta. env.VITE_API_BASE_URL,
  withCredentials: true,
});

console.log("API Base URL:", import.meta.env. VITE_API_BASE_URL);

// ========================================
// ✅ REQUEST INTERCEPTOR - CHỈ cho 'api'
// ========================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  
  // ✅ Thêm accessToken vào header
  if (token && ! config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Handle FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// ========================================
// ✅ RESPONSE INTERCEPTOR - CHỈ cho 'api'
// ========================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Nếu 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Attempting to refresh token...");
        
        // ✅ QUAN TRỌNG: Dùng refreshApi (không có Authorization header)
        const res = await refreshApi.post("/auth/refresh-token");
        
        console.log("✅ Refresh response:", res.data);
        
        // ✅ Lấy accessToken mới từ response
        const newAccessToken = res.data.data.accessToken;
        console.log("✅ New access token:", newAccessToken);

        if (! newAccessToken) {
          throw new Error("No access token in response");
        }

        console.log("✅ Token refreshed successfully");
        
        // ✅ Lưu vào localStorage
        localStorage.setItem("accessToken", newAccessToken);
        stompService.disconnect();
        stompService.connect();
        // ✅ Update Authorization header và retry request ban đầu
        originalRequest. headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (err) {
        console.error("❌ Refresh token error:", err. response?.data || err.message);
        
        // ✅ Xóa token và redirect về login
        localStorage.removeItem("accessToken");
        //window.location. href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ========================================
// ✅ EXPORT
// ========================================
export default api;

// ✅ Export refreshApi nếu cần dùng ở component khác
export { refreshApi };