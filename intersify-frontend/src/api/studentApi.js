import api from "./axios";

export const uploadProfilePic = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  return api.post("/students/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStudentProfile = () => {
  return api.get("/students/profile");
};

export const updateStudentProfile = (data) => {
  return api.put("/students/profile", data);
};

export const applyToInternship = (internshipId, resumeUrl) => {
  return api.post(`/applications/${internshipId}/apply`, null, {
    params: { resumeUrl }
  });
};
