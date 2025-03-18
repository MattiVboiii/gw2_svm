import axios from "axios";

const api = axios.create({
  baseURL: "https://webshop-api-wc6u.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
    
