async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = { username, email, password };
    try{
        console.log(data)
        const response = await axios.post("http://localhost:4000/api/user", data);
        console.log(response?.data)
    } catch (err) {
        console.error(err?.message);
        alert("Failed to register. Please try again.");
    }
}
