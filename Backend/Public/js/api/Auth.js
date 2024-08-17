async function singIn(data) {
  try {
    const response = await axios.post(
      "http://43.204.35.243:4000/user/sing-in",
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
      "http://43.204.35.243:4000/user/login",
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
