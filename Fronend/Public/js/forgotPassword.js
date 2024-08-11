async function handleForgotPassword(event) {
  event.preventDefault();
  const email = event.target.email.value;
  try {
    // backend will send email for password reset
    await axios.post("http://localhost:4000/password/forgot-password", {
      email,
    });

    document.querySelector("#submit").disabled = true;
    
    alert("Password reset link has been sent to your email");
  } catch (error) {
    handleError(error.response.status);
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
