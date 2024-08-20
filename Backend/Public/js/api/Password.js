async function forgotPassword(email) {
  // backend will send email for password reset
  try {
    await axios.post("http://13.233.70.44/password/forgot-password", {
      email,
    });
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        "Failed to send password reset link. Please try again later."
    );
  }
}

async function resetPassword(newPassword) {
  try {
    await axios.put("http://13.233.70.44/password/reset-password", {
      password,
    });
  } catch (err) {
    throw new Error(
      err?.data?.message || "Failed to reset password. Please try again later."
    );
  }
}
