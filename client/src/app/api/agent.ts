/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import type { LoginDto, RegisterDto, UserTokenDto } from "../models/user";
import { router } from "../router/Routes";

axios.defaults.baseURL = "http://localhost:5209/api";
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const user = JSON.parse(userData);
    if (user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
  }
  return config;
});

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    const errorMessage =
      (error.response?.data as any)?.message ||
      error.message ||
      "Došlo je do greške.";

    if (error.response?.status === 500) {
      toast.error("Došlo je do greške na serveru.");
    }

    if (error.response?.status === 400) {
      router.navigate("/bad-request", { state: { error: errorMessage } });
    }

    if (error.response?.status === 403) {
      router.navigate("/forbidden");
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res: UserTokenDto = await Account.refreshToken();
        const userWithToken = {
          ...res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        };
        localStorage.setItem("user", JSON.stringify(userWithToken));
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${userWithToken.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        localStorage.removeItem("user");
        router.navigate("/login");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Account = {
  login: (values: LoginDto) => requests.post("user/login", values),
  register: (values: RegisterDto) => requests.post("user/register", values),
  currentUser: () => requests.get("user/currentUser"),
  approveUser: (id: number) => requests.put(`user/approveUser/${id}`, {}),
  getAllPendingUsers: () => requests.get("user/pendingUsers"),
  rejectUser: (id: number) => requests.delete(`user/rejectUser/${id}`),
  refreshToken: () => requests.post("user/refresh", {}),
};

const Gift = {
  getPairs: () => requests.get("gift/getAllPairs"),
  getCurrentYearPairs: () => requests.get("gift/getPairsForCurrentYear"),
  getPairsForYear: (year: number) =>
    requests.get(`gift/getPairsForYear/${year}`),
  getMyPair: () => requests.get("gift/getMyPair"),
  getMyPairs: () => requests.get("gift/getMyPairs"),
  generatePairs: () => requests.post("gift/generatePairs", {}),
  resetCurrentYearPairs: () => requests.delete("gift/resetCurrentYearPairs"),
  getAvailableYears: () => requests.get("gift/years"),
};

const agent = {
  Account,
  Gift,
};

export default agent;
