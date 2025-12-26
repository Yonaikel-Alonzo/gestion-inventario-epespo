import axios from "axios";
import { toast } from "react-toastify";


const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://gestion-inventario-epespo-laravel.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// Si tu app usa token:
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let cerrandoSesion = false;

const logoutAutomatico = () => {
  if (cerrandoSesion) return;
  cerrandoSesion = true;

  toast.error("Tu sesión ha expirado. Vuelve a iniciar sesión.", {
    position: "top-right",
  });

  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("user");

  setTimeout(() => {
    window.location.href = "/";
  }, 1500);
};

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const mensaje = error.response?.data?.message;
    const url = error.config?.url || "";
    const tieneToken = !!localStorage.getItem("token");
    const esLogin = url.includes("/login");
    if (
      tieneToken &&
      !esLogin &&
      (
        status === 401 ||
        status === 419 ||
        mensaje === "Token has expired" ||
        mensaje === "Unauthenticated."
      )
    ) {
      logoutAutomatico();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
