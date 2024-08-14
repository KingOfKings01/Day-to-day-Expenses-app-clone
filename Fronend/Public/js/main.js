document.addEventListener("DOMContentLoaded", async () => {
  const token = JSON.parse(localStorage.getItem("token"));

  if (!token) {
    window.location.href = "../views/login.html";
    return;
  }

  try {
    const { username, isPremium } = await protected();

    premiumButton(isPremium);
    PremiumHandler(isPremium);

    // Set the welcome message
    const message = isPremium ? "Thank you for being a Premium Member!" : "";
    document.getElementById(
      "welcome"
    ).innerText = `Welcome, ${username}! \n${message}`;

    loadExpenses();
  } catch (err) {
    messenger(err.message, false);
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
    await createExpense(token, data);

    loadExpenses();
    document.querySelector("#expenseForm").reset();
  } catch (err) {
    console.log(err);
    const message =
      err?.response?.data?.message ||
      "Something want wrong! Please try again later.";
    messenger(message, false);
  }
}

async function loadExpenses() {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const expenses = await fetchUserExpenses(token);
    
    displayExpenses(expenses);
  } catch (err) {
    messenger(err.message, false);
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
    <td><button class="btn btn-delete" onclick="deleteExpense(${expense.id})">Delete</button></td>
    </tr>
    `;
  });
  table.innerHTML = rows;
}

async function deleteExpense(id) {
  
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    await deletingExpense(token, id)
    
    loadExpenses(); // TODO: Reload expenses
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

    //***************************** PREMIUM ********************************\\
    // fetchModalTable();
  } else {
    document.getElementById("premiumButton").style.display = "block";
    
    //!  ????????????????????????????????????
    // document.getElementById("leader-board").innerHTML = ""; // Clear leaderboard if not premium
  }
}
