// src/lib/api.js
export const API = import.meta.env.VITE_API_URL;

export const get = async (endpoint) => {
  const res = await fetch(`${API}${endpoint}`);
  return res.json();
};

export const post = async (endpoint, data) => {
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const authPost = async (endpoint, data) => {
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getWithAuth = async (endpoint) => {
  const res = await fetch(`${API}${endpoint}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.json();
};
