export const API_URL = "http://localhost:8000/api/";

//export const API_URL = "https://cruise-7m1b.onrender.com/api/";

const successCodes = [200, 201, 204];

export const API_ROUTES = {
  user: {
    getAllUsers: "user/admin",
  },
  incident: {
    getAll: "incidents/",
    getById: (id) => `incidents/${id}`,
    create: "incidents/",
    update: (id) => `incidents/${id}`,
    delete: (id) => `incidents/${id}`,
  },
  path: {
    getAll: "path/",
    getById: (id) => `path/${id}`,
    create: "path/",
  },
};

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

export const fetchDelete = async (endpoint, options = {}) => {
  try {
    const response = await fetch(urlMaker(endpoint), {
      method: "DELETE",
      ...options,
    });

    // Handle responses that might not have JSON content (like 204 No Content)
    let resData = null;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      resData = await response.json();
    }

    if (!successCodes.includes(response.status) || !response.ok) {
      throw new Error(resData?.message || `Error ${response.status}`);
    }

    return resData;
  } catch (err) {
    err;
    console.error(`Error in fetchDelete for ${endpoint}:`, err);
    throw err;
  }
};

export const fetchGet = async (endpoint, options = {}) => {
  try {
    //console.log(`Fetching from: ${API_URL}${endpoint}`);
    const url = urlMaker(endpoint);

    // Log the complete request details for debugging
    /*console.log("Request details:", {
      url,
      method: options.method || "GET",
      headers: options.headers,
    });*/

    const response = await fetch(url, options);

    // Log the response status and headers
    //console.log(`Response status: ${response.status}`);
    //console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Received non-JSON response: ${contentType}`);
      const text = await response.text();
      console.log("Response text:", text);

      // If it's an HTML error page, try to extract the error message
      if (contentType && contentType.includes("text/html")) {
        const errorMessage =
          text.match(/<title>(.*?)<\/title>/)?.[1] ||
          text.match(/<h1>(.*?)<\/h1>/)?.[1] ||
          "Server returned HTML instead of JSON";
        throw new Error(`API Error: ${errorMessage}`);
      }

      // For non-HTML responses, throw a generic error
      throw new Error(`Received non-JSON response: ${contentType}`);
    }

    // Try to parse JSON response
    let resData;
    try {
      resData = await response.json();
    } catch (err) {
      console.error("Failed to parse JSON response:", err);
      throw new Error("Failed to parse server response");
    }

    //console.log("Response data:", resData);

    if (!successCodes.includes(response.status) || !response.ok) {
      console.error(`API Error: ${response.status} - ${resData.message || "Unknown error"}`);
      throw new Error(resData.message || `Error ${response.status}`);
    }

    return resData;
  } catch (err) {
    console.error(`Error in fetchGet for ${endpoint}:`, err);
    throw err;
  }
};

export const checkEmail = async (email) => {
  const response = await fetchGet(`user/checkEmail?email=${email}`);
  return response;
};

export const getAllUsers = async (token) => {
  try {
    console.log("getAllUsers called with token:", token ? "Token exists" : "No token");

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Fetching from:", urlMaker(API_ROUTES.user.getAllUsers));
    const response = await fetchGet(API_ROUTES.user.getAllUsers, options);

    console.log("API response:", response);

    // Handle different response formats
    if (response.data) {
      return response.data;
    } else if (Array.isArray(response)) {
      return response;
    } else if (response.users) {
      return response.users;
    } else {
      console.warn("Unexpected response format:", response);
      return [];
    }
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    throw err;
  }
};
