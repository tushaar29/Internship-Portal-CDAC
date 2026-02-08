import api from "./axios";

export const uploadCompanyLogo = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/companies/profile/logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCompanyProfile = () => {
  return api.get("/companies/profile");
};

export const updateCompanyProfile = (data) => {
  return api.put("/companies/profile", data);
};
