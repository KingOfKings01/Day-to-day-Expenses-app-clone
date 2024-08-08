document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user.id;
  const username = user.username;
  if (!username && !id) {
    window.location.href = "../views/auth/login.html";
  } else {
    document.getElementById("welcome").innerText = `Welcome, ${username}!`;
    loadExpenses(id);
  }
});

async function handleFormSubmit(event) {
  event.preventDefault();

  const { amount, category, description } = event.target;

  const data = {
    amount: amount.value,
    category: category.value,
    description: description.value,
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user.id;

  try {
    const response = await axios.post(
      `http://localhost:4000/expense/${id}`,
      data
    );
    loadExpenses(response.data.userId);
  } catch (err) {
    alert("Failed to add expense. Please try again.");
    console.error(err.message);
  }
}

async function loadExpenses(id) {
  const table = document.getElementById("expensesTableBody");
  try {
    const response = await axios.get(`http://localhost:4000/expense/${id}`);
    const expenses = response.data;

    let rows = "";
    expenses.forEach((expense) => {
      rows += `
      <tr>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        <td>${new Date(expense.createdAt).toLocaleString()}</td>
        <td><button onclick="deleteExpense(${expense.id})">Delete</button></td>
        </tr>
      `;
    });
    table.innerHTML = rows;
  } catch (err) {
    alert("Failed to load expenses. Please try again.");
    console.error(err.message);
  }
}

async function deleteExpense(id) {
  try {
    const response = await axios.delete(`http://localhost:4000/expense/${id}`);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    loadExpenses(userId);
  } catch (err) {
    alert("Failed to delete expense. Please try again.");
    console.error(err.message);
  }
}
