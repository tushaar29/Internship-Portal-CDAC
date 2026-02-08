import api from "./axios";
import { publicApi } from "./axios";

export const loginApi = (data) => {
  return api.post("/auth/signin", data);
};

export const registerApi = (data) => {
  return api.post("/auth/signup", data);
};

export const sendOTPApi = (data) => {
  return publicApi.post("/auth/otp/send", data);
};

export const verifyOTPApi = (data) => {
  return publicApi.post("/auth/otp/verify", data);
};
