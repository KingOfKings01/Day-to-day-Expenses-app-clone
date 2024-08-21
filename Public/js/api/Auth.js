async function singIn(data) {
  try {
    const response = await axios.post(
      "http://13.233.70.44/user/sing-in",
      data
    );
    return response.data.token;
  } catch (err) {   
    throw new Error(
        err?.response?.data?.message ||
        "Something went wrong! Please try again later."
      );
  }
}

async function login(data) {
  try {
    const response = await axios.post(
      "http://13.233.70.44/user/login",
      data
    );
    return response.data.token;
  } catch (err) {
    throw new Error(
        err?.response?.data?.message ||
        "Something went wrong! Please try again later."
      );
  }
}
