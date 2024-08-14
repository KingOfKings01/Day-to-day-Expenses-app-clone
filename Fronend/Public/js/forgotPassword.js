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
    const message = error?.response?.message || "Please try again later.";
    messenger(message)
  }
}
