import axios from "axios";

const HOST_URL = `http://localhost:4000/api`;

// guest API calls

export const getAllBands = async () => {
  return await axios.get(`${HOST_URL}/band/all`);
};

export const getBandByParams = async (id) => {
  return await axios.get(`${HOST_URL}/band/${id}`);
};

// user API calls
export const registerCall = async (body) => {
  return await axios.post(`${HOST_URL}/user/register`, body);
};

export const loginCall = async (body) => {
  return await axios.post(`${HOST_URL}/user/login`, body);
};

export const profileCall = async (token) => {
  return await axios.get(`${HOST_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// messages
export const getAllBandMessages = async (id) => {
  return await axios.get(`${HOST_URL}/messages/band/${id}`);
};

export const postMessage = async (id, body, token) => {
  return await axios.post(`${HOST_URL}/messages/band/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
