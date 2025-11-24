import api from '../api/axios';


export const AuthService = {
  login: async (username, password) => {
    try {
      const payload = { username, password };

      const response = await api.post(
        `/auth/login`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      return response.data; 

    } catch (error) {
        console.log(error);
    }
  },
  logout: async()  => {
    try {

      const response = await api.post(
        `/auth/logout`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

    } catch (error) {
        console.log(error);
    }
  },
};
