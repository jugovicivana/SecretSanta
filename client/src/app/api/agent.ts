/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import type { LoginDto, RegisterDto } from "../models/user";

axios.defaults.baseURL = "http://localhost:5209/api";
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const user = JSON.parse(userData);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
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
  (error: AxiosError) => {
    if (error.response?.status === 500) {
      toast.error("Došlo je do greške na serveru.");
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
  approveAdmin: (id: number) => requests.put(`user/approveAdmin/${id}`, {}),
  getAllPendingAdmins: () => requests.get("user/pendingAdmins"),
  rejectAdmin: (id: number) => requests.delete(`user/rejectAdmin/${id}`),
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
