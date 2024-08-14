async function downloadReport() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      window.location.href = "../views/auth/login.html";
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:4000/expense/download", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "my_expense.csv";
      a.click();
      
    } catch (err) {
      console.error(err);
      messenger("Failed to download report. Please try again.", false);
    }
  }
  
  async function downloadHistory() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      window.location.href = "../views/auth/login.html";
      return;
    }
    
    try {
      const response = await axios.get("http://localhost:4000/user/download-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.table(response.data);
      
    } catch (err){
      console.log(err);
      messenger("Failed to load download history. Please try again.", false);
    }
  }