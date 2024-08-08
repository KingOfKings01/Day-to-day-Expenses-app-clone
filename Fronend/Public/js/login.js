async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const alertMessageDiv = document.getElementById("alert-box");
  
    let message = "";
    const data = { email, password };
    try {
      const response = await axios.post("http://localhost:4000/api/login", data);

      localStorage.setItem('username', response.data.username);

      window.location.href = '../success.html';
      
    } catch (err) {
      const status = err?.response?.status;
      switch (status) {
        case 400:
          message = "User not exists";
          break;
        case 401:
          message = "Invalid password";
          break;
        case 500:
          message = "Internal Server Error";
          break;
        default:
          message = "Failed to register. Please try again.";
      }
    }
    if (message){
        alertMessageDiv.innerHTML = `<div>${message}<button onclick="closeAlert()">×</sub></div>`;
        setTimeout(()=>{
            alertMessageDiv.innerHTML = '';
        },3000)
    }
  }
  
  function closeAlert() {
    const alertBoxDiv = document.getElementById("alert-box");
    alertBoxDiv.style.display = "none";
  }
  