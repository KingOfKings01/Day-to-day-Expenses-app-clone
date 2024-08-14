async function protected(){
    const token = JSON.parse(localStorage.getItem("token"));
  if (!token) {
    window.location.href = "../views/auth/login.html";
  } else {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/protected-route",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Something want wrong! Please try again later.";
      messenger(message, false);
    }
  }
}