import api from "../api/api";

export const registerUser = async (name, email, password) => {
    const response = await api.post("/auth/register", {
        name,
        email,
        password,
    });
    return response.data;
};

export const loginUser = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });
    if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
};

export const googleLogin = async (credential, accessToken) => {
    const response = await api.post("/auth/google", {
        credential,
        accessToken,
    });
    if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};
