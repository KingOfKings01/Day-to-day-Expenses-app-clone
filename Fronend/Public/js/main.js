document.addEventListener("DOMContentLoaded", async () => {
  const storedValue = localStorage.getItem("numberOfPages");
  if (storedValue) {
    document.getElementById("number-of-page").value = storedValue;
  }

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

    loadExpenses(currentPage);
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
    messenger(err.message, false);
  }
}

let currentPage = 1;
let totalPages = 1; // Total number of pages, initially set to 1
// Number of items per page
const limit = (localStorage.getItem("numberOfPages") || 5);

function numberOfPages() {
  const selectElement = document.getElementById("number-of-page");
  const selectedValue = selectElement.value;

  localStorage.setItem("numberOfPages", selectedValue);

  loadExpenses();
}

async function loadExpenses(page = 1) {
  if (page < 1 || page > totalPages) return;
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const { expenses, pagination } = await fetchUserExpenses(
      token,
      page,
      limit
    );
    displayExpenses(expenses);

    currentPage = pagination.currentPage;
    totalPages = pagination.totalPages;

    // Update pagination controls
    updatePaginationControls();
  } catch (error) {
    messenger(error.message, false);
  }
}

function displayExpenses(expenses) {
  const table = document.getElementById("expensesTableBody");
  let rows = "";
  if (expenses?.length == 0) {
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
    <td><button class="btn btn-delete" onclick="deleteExpense(${
      expense.id
    })">Delete</button></td>
    </tr>
    `;
  });
  table.innerHTML = rows;
}

function updatePaginationControls() {
  const pageNumbersContainer = document.getElementById("page-numbers");
  pageNumbersContainer.innerHTML = "";

  const range = 2; // Number of page links to show before and after the current page
  const startPage = Math.max(1, currentPage - range);
  const endPage = Math.min(totalPages, currentPage + range);

  if (currentPage > 1) {
    pageNumbersContainer.innerHTML += `<button onclick="loadExpenses(${
      currentPage - 1
    })">Previous</button>`;
  }

  if (startPage > 1) {
    pageNumbersContainer.innerHTML += `<button onclick="loadExpenses(1)">1</button>`;
    if (startPage > 2) {
      pageNumbersContainer.innerHTML += `<span>...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbersContainer.innerHTML += `<button onclick="loadExpenses(${i})" ${
      i === currentPage ? 'class="active"' : ""
    }>${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbersContainer.innerHTML += `<span>...</span>`;
    }
    pageNumbersContainer.innerHTML += `<button onclick="loadExpenses(${totalPages})">${totalPages}</button>`;
  }

  if (currentPage < totalPages) {
    pageNumbersContainer.innerHTML += `<button onclick="loadExpenses(${
      currentPage + 1
    })">Next</button>`;
  }
}

async function deleteExpense(id) {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    await deletingExpense(token, id);

    loadExpenses(); // TODO: Reload expenses
  } catch (err) {
    messenger(err.message, false);
  }
}

async function premiumButton(isPremium) {
  if (isPremium) {
    document.getElementById("premiumButton").style.display = "none";
    document.body.style.backgroundImage =
      "linear-gradient(111.4deg, rgba(238,113,113,1) 1%, rgba(246,215,148,1) 58%)";
  } else {
    document.getElementById("premiumButton").style.display = "block";
  }
}
