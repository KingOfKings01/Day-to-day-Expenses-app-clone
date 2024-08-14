document.addEventListener("DOMContentLoaded", async () => {
  
  const { username, isPremium } = await protected()

  premiumButton(isPremium)
  PremiumHandler(isPremium)

  // Set the welcome message
  const message = isPremium ? "Thank you for being a Premium Member!" : "";
  document.getElementById(
    "welcome"
  ).innerText = `Welcome, ${username}! \n${message}`;

  loadExpenses();
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
    document.querySelector("#expenseForm").reset();
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      "Something want wrong! Please try again later.";
    messenger(message, false);
  }
}

async function loadExpenses() {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const response = await axios.get(
      `http://localhost:4000/expense/getExpenses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const expenses = response.data.expenses;
    displayExpenses(expenses);
  } catch (err) {
    // alert("Failed to load expenses. Please try again.");
    messenger("Failed to load expenses. Please try again", false);
    console.error(err.message);
  }
}

function displayExpenses(expenses) {
  const table = document.getElementById("expensesTableBody");
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
}

async function deleteExpense(id) {
  try {
    const response = await axios.delete(`http://localhost:4000/expense/${id}`);
    loadExpenses();
  } catch (err) {
    alert("Failed to delete expense. Please try again.");
    console.error(err.message);
  }
}

async function premiumButton(isPremium) {
  // Handle premium button visibility
  if (isPremium) {
    document.getElementById("premiumButton").style.display = "none";
    document.body.style.backgroundImage =
      "linear-gradient(111.4deg, rgba(238,113,113,1) 1%, rgba(246,215,148,1) 58%)";
    fetchModalTable();
  } else {
    document.getElementById("premiumButton").style.display = "block";
    document.getElementById("leader-board").innerHTML = ""; // Clear leaderboard if not premium
  }
}
