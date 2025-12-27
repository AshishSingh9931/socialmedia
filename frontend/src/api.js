import axios from "axios";

export const api = axios.create({
  baseURL: "https://socialmedia-backend-f2rn.onrender.com/api"
});
