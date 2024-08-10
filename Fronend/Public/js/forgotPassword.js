async function handleForgotPassword(event){
    event.preventDefault();
    const email = event.target.email.value
    // backend will send email for password reset
    await axios.post("http://localhost:4000/password/forgotpassword", { email })
    alert("Password reset link has been sent to your email")
}