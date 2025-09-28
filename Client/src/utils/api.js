export const API_URL = "http://localhost:8000/api/";
const successCodes = [200, 201, 204];

export const urlMaker = (endpoint) => {
  return `${API_URL}${endpoint}`;
};

export const optionMaker = (data, method = "POST", token = null) => {
  return {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };
};

export const fetchPost = async (endpoint, options) => {
  const response = await fetch(urlMaker(endpoint), options);
  const resData = await response.json();

  if (!successCodes.includes(response.status) || !response.ok) {
    // Throw an error with the backend error message (if available)
    const errorMsg = resData.errors
      ? resData.errors.join(", ")
      : resData.message || "Unknown error";
    throw new Error(errorMsg);
  }
  return resData;
};

export const fetchGet = async (endpoint, options) => {
  const response = await fetch(urlMaker(endpoint), options);
  const resData = await response.json();

  if (!successCodes.includes(response.status) || !response.ok) {
    throw new Error(resData.message);
  }

  return resData;
};

export const checkEmail = async (email) => {
  const response = await fetchGet(`user/checkEmail?email=${email}`);
  return response;
};
