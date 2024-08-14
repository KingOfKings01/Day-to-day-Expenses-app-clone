async function handleAuthorization(event) {
  event.preventDefault();
  const username = document.getElementById("username")?.value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = { username, email, password };

  const endpoint = username ? "sing-in" : "login";
  try {
    const response = await axios.post(
      "http://localhost:4000/user/" + endpoint,
      data
    );
    success(response.data.token);
  } catch (err) {
    const message = (err?.response?.data?.message) || "Failed to register. Please try again later."
    messenger(message, false);
  }
}

function success(token) {
  localStorage.setItem("token", JSON.stringify(token));
  window.location.href = "../../views/home.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "../../../Fronend/views/auth/login.html";
}
