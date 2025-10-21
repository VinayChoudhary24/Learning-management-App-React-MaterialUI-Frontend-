import type { User } from "../types/auth.types";

export interface StoredAuth {
  user: User;
  token?: string | null;
}

export const saveAuth = (auth: StoredAuth) => {
  try {
    localStorage.setItem("user", JSON.stringify(auth.user));
    if (auth.token) {
      localStorage.setItem("token", JSON.stringify(auth.token));
    }
  } catch (err) {
    console.error("Error saving auth in localStorage:", err);
  }
};

export const loadAuth = (): StoredAuth | null => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return user
      ? { user: JSON.parse(user), token: token ? JSON.parse(token) : null }
      : null;
  } catch (err) {
    console.error("Error loading auth from localStorage:", err);
    return null;
  }
};

// save Auth token only
export const saveAuthToken = (token: string) => {
  try {
    localStorage.setItem("token", JSON.stringify(token));
  } catch (err) {
    console.error("Error saving Auth token to localStorage:", err);
  }
};

// save OAuth token only
export const saveOAuthToken = (token: string) => {
  try {
    localStorage.setItem("token", JSON.stringify(token));
  } catch (err) {
    console.error("Error saving OAuth token to localStorage:", err);
  }
};

export const clearAuth = () => {
  try {
    localStorage.removeItem("user");
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    if (localStorage.getItem("lastPurchase")) {
      localStorage.removeItem("lastPurchase");
    }
  } catch (err) {
    console.error("Error clearing auth from localStorage:", err);
  }
};
