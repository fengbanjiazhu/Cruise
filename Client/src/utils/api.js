export const API_URL = "http://localhost:8000/api/";
const successCodes = [200, 201, 204];

export const API_ROUTES = {
  user: {
    login: "user/login",
    register: "user/register",
    checkEmail: "user/checkEmail",
    getUser: "user/getUser",
    updateUser: "user/updateUser",
    getAllUsers: "user/admin",
  },
  product: {
    getProducts: "product/getProducts",
    getProductById: "product/getProductById",
  },
  // new supplier route
  supplier: {
    create: "supplier/",
    getAll: "supplier/",
    getById: (id) => `supplier/${id}`, // Look up item id when delte from data base | Id = dynamic handelling (id) => `supplier/${id}`
    update: (id) => `supplier/${id}`, //
    delete: (id) => `supplier/${id}`,
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
  payment: {
    getPaymentCards: "payment/card/",
    updatePaymentCard: "payment/card/",
    removePaymentCard: "payment/card/",

    getPaymentHistory: "payment/history/",
    addPayment: "payment/addPayment",
  },
  order: {
    getOrderHistory: "order/history",
    getOrderbyId: (id) => `order/${id}`,
  },
  checkout: {
    checkout: "checkout",
    guest: "checkout/guest",
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

export const fetchDelete = async (endpoint, options = {}) => {
  const response = await fetch(urlMaker(endpoint), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(options.body),
  });
  const resData = await response.json();

  if (response.status != 200 || !response.ok) {
    throw new Error(response.message);
  }
  return resData;
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

//new! ---> used for display
export const fetchPatch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      method: "PATCH",
      ...options,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to perform PATCH request");
    }
    return data;
  } catch (error) {
    console.error("Error in fetchPatch:", error);
    throw error;
  }
};

export const fetchGet = async (endpoint, options = {}) => {
  try {
    console.log(`Fetching from: ${API_URL}${endpoint}`);
    const url = urlMaker(endpoint);

    // Log the complete request details for debugging
    console.log("Request details:", {
      url,
      method: options.method || "GET",
      headers: options.headers,
    });

    const response = await fetch(url, options);

    // Log the response status and headers
    console.log(`Response status: ${response.status}`);
    console.log(
      "Response headers:",
      Object.fromEntries([...response.headers.entries()])
    );

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

    console.log("Response data:", resData);

    if (!successCodes.includes(response.status) || !response.ok) {
      console.error(
        `API Error: ${response.status} - ${resData.message || "Unknown error"}`
      );
      throw new Error(resData.message || `Error ${response.status}`);
    }

    return resData;
  } catch (err) {
    console.error(`Error in fetchGet for ${endpoint}:`, err);
    throw err;
  }
};

export const checkEmail = async (email) => {
  const response = await fetchGet(
    `${API_ROUTES.user.checkEmail}?email=${email}`
  );
  return response;
};

export const getAllUsers = async (token) => {
  try {
    console.log(
      "getAllUsers called with token:",
      token ? "Token exists" : "No token"
    );

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
