import  api  from "./axios";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
}

export const loginUser = async (
  credentials: AuthCredentials
): Promise<LoginResponse> => {
  const response = await api.post<unknown>(
    "/auth/login",
    credentials
  );

  const data = response.data;

  if (
    !data ||
    typeof data !== "object" ||
    !("access_token" in data) ||
    typeof data.access_token !== "string" ||
    !data.access_token
  ) {
    throw new Error(
      "Unexpected login response. Check the FastAPI token format."
    );
  }

  return {
    access_token: data.access_token,
    token_type:
      "token_type" in data &&
      typeof data.token_type === "string"
        ? data.token_type
        : "bearer",
  };
};

export const registerUser = async (
  credentials: AuthCredentials
) => {
  const response = await api.post(
    "/auth/register",
    credentials
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};