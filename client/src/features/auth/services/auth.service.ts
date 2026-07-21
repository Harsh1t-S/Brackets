import api from "../../../lib/axios";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// The API wraps every payload in { success, data }. Unwrap `data` here so
// callers work with the payload directly.
export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data.data;
};

export const updateMe = async (data: {
  name?: string;
  avatar?: string | null;
}) => {
  const response = await api.patch("/auth/me", data);
  return response.data.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};
