import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://api.marketstack.com/v1";
const MARKETSTACK_ACCESS_KEY = process.env.NEXT_PUBLIC_MARKETSTACK_ACCESS_KEY;

const axiosInterceptorInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      access_key: MARKETSTACK_ACCESS_KEY,
    };
    return config;
  },
  (error) => {
    // Handle request errors here
    toast.error("Error fetching data");
    return Promise.reject(error);
  }
);

axiosInterceptorInstance.interceptors.response.use(
  ({ data }) => {
    // Modify the response data here

    return data;
  },
  (error) => {
    // Handle response errors here

    return Promise.reject(error);
  }
);
// End of Response interceptor

export default axiosInterceptorInstance;
