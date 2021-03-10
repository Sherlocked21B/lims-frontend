import axios from "axios";

let token = null;

export const setToken = (getToken) => {
  token = getToken;
};

export default axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
