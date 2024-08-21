async function forgotPassword(email) {
  // backend will send email for password reset
  try {
    await axios.post("http://localhost:4000/password/forgot-password", {
      email,
    });
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        "Failed to send password reset link. Please try again later."
    );
  }
}
