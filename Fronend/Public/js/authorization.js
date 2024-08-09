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
    const status = err?.response?.status;
    handleError(status);
  }
}

function messenger(message) {
  const alertMessageDiv = document.getElementById("alert-box");

  alertMessageDiv.innerHTML = `<div>${message}<button onclick="closeAlert()">×</sub></div>`;

  setTimeout(() => {
    alertMessageDiv.innerHTML = "";
  }, 3000);
}

function closeAlert() {
  const alertBoxDiv = document.getElementById("alert-box");
  alertBoxDiv.style.display = "none";
}

function handleError(status) {
  switch (status) {
    case 401:
      messenger("User not authorized"); // password incorrect
      break;
    case 404:
      messenger("User not found"); 
      break;
    case 409:
      messenger("User already exists");
      break;
    case 500:
      messenger("Internal Server Error");
      break;
    default:
      messenger("Failed to register. Please try again.");
  }
}

function success(token) {
  localStorage.setItem("token", JSON.stringify(token));
  window.location.href = "../../views/home.html";
}
