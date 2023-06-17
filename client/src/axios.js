import axios from "axios";

export const makeRequest = axios.create({
    baseURL: "http://localhost:8800/api/",
    withCredentials: true, // to be able to send the access token to the backend server
});

