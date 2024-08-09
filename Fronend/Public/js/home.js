document.addEventListener("DOMContentLoaded", async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) {
    window.location.href = "../views/auth/login.html";
  } else {
    const response = await axios.post(
      "http://localhost:4000/user/protected-route",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const username = response.data.username;
    document.getElementById("welcome").innerText = `Welcome, ${username}!`;
    loadExpenses();
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

  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const response = await axios.post(
      `http://localhost:4000/expense/createExpense`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    loadExpenses();
  } catch (err) {
    alert("Failed to add expense. Please try again.");
    console.error(err.message);
  }
}

async function loadExpenses() {
  const token = JSON.parse(localStorage.getItem("token"));

  const table = document.getElementById("expensesTableBody");
  try {
    const response = await axios.get(
      `http://localhost:4000/expense/getExpenses`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const expenses = response.data;

    let rows = "";
    if (expenses.length == 0) {
      rows = "<tr><td colspan='5'>No Expenses</td></tr>";
      table.innerHTML = rows;
      return; // exit the function early if no expenses found to avoid potential error
    }
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
    // alert("Failed to load expenses. Please try again.");
    console.error(err.message);
  }
}

async function deleteExpense(id) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    const response = await axios.delete(`http://localhost:4000/expense/${id}`);
    loadExpenses();
  } catch (err) {
    alert("Failed to delete expense. Please try again.");
    console.error(err.message);
  }
}
