import axios from "axios";

// Create an Axios instance with default configuration
const instance = axios.create({
  baseURL: "http://localhost:8082",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;