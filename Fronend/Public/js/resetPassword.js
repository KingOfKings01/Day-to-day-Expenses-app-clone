async function handleResetPassword(event) {
  event.preventDefault();
  const password = event.target.password.value;

  try {
    await axios.put("http://localhost:4000/password/reset-password", {
      password,
    });
  } catch (err) {
    handleError(err.response.status);
  }
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