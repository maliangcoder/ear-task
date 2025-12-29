import axios from "axios";
import { Toast } from "antd-mobile";
import CryptoJS from "crypto-js";
import { storage } from "@/utils/storage";

const request = axios.create({
  baseURL: "https://api.metaart.store",
  // baseURL: "https://tapi.metaart.store",
  timeout: 10000,
});

const SIGN_KEY = "ERFGCuiqweh&^%%yu9878123fg#$VB!9E&KfeA6%";

request.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    const timestamps = Date.now().toString();

    config.headers["businessType"] = "customer";
    config.headers["os"] = "h5";
    config.headers["timestamps"] = timestamps;

    if (token) {
      config.headers["token"] = token;
    }

    let str: string;
    if (config.method?.toUpperCase() === "POST") {
      const strIndex = config.url?.indexOf("?") ?? -1;
      if (strIndex > 0) {
        str = config.url!.slice(strIndex + 1);
      } else {
        str = config.data ? JSON.stringify(config.data) : "";
      }
    } else {
      const params = config.params || {};
      str = Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value as any)}`
        )
        .join("&");
    }

    const sign = CryptoJS.MD5(str + timestamps + SIGN_KEY)
      .toString()
      .toLowerCase();

    config.headers["sign"] = sign;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** 处理 401 未授权，跳转登录页 */
const handleUnauthorized = () => {
  storage.clear();
  Toast.show({
    icon: "fail",
    content: "登录已过期，请重新登录",
  });
  // 使用 setTimeout 确保 Toast 显示后再跳转
  setTimeout(() => {
    window.location.href = "/ear-task/login";
  }, 1000);
};

request.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data;

    // 处理 401 未授权
    if (code === 401) {
      handleUnauthorized();
      return Promise.reject(new Error(message || "请重新登录"));
    }

    if (code < 0) {
      Toast.show({
        icon: "fail",
        content: message || "请求失败",
      });
      return Promise.reject(new Error(message || "请求失败"));
    }

    // 当 data 为 false 时，直接返回响应，让调用方自行处理
    // 不在这里弹 Toast，避免批量操作时弹出多个错误提示
    if (code === 0 && typeof data === "boolean" && data === false) {
      return response.data;
    }

    return response.data;
  },
  (error) => {
    // 处理 HTTP 401 状态码
    if (error.response?.status === 401) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    Toast.show({
      icon: "fail",
      content: error.message || "网络错误",
    });
    return Promise.reject(error);
  }
);

export default request;
