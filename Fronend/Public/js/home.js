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
    const { username, isPremium } = response.data;

    premiumButton(isPremium);

    // Set the welcome message
    const message = isPremium ? "Thank you for being a Premium Member!" : "";
    document.getElementById(
      "welcome"
    ).innerText = `Welcome, ${username}! ${message}`;
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
    const response = await axios.delete(`http://localhost:4000/expense/${id}`);
    loadExpenses();
  } catch (err) {
    alert("Failed to delete expense. Please try again.");
    console.error(err.message);
  }
}

const buyPremium = async () => {
  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const response = await axios.post(
      "http://localhost:4000/user/buy-premium",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { user, order } = response.data;

    const options = {
      key: user.key_id, // Replace with your Razorpay key ID
      amount: order.amount,
      currency: order.currency,
      name: "Day-To-Day",
      description: "Premium Plan",
      image: "",
      order_id: order.id, // This is the order ID created in the backend
      handler: async function (response) {
        messenger("Payment Successful", true);
        const data = {
          order_id: order.id,
          status: "successful",
        };
        const resp = await axios.post(
          "http://localhost:4000/user/update-order",
          data
        );

        // User is premium user now
        premiumButton(true);
      },
      prefill: {
        name: user.username,
        email: user.email,
        contact: "9999999999", // Omit the contact field if not available
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: async function () {
          const data = {
            order_id: order.id,
            status: "failed",
          };
          const resp = await axios.post(
            "http://localhost:4000/user/update-order",
            data
          );
          messenger("Transaction failed", false);
        },
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

function messenger(message, state) {
  const alertMessageDiv = document.getElementById("alert-box");

  const color = state ? "#4CAF50" : "#f44336";

  alertMessageDiv.innerHTML = `<div style="background:${color}">${message}<button onclick="closeAlert()">×</sub></div>`;

  setTimeout(() => {
    alertMessageDiv.innerHTML = "";
  }, 3000);
}

function closeAlert() {
  const alertBoxDiv = document.getElementById("alert-box");
  alertBoxDiv.style.display = "none";
}

async function premiumButton(isPremium) {
  // Handle premium button visibility
  if (isPremium) {
    document.getElementById("premiumButton").style.display = "none";
    document.body.style.backgroundImage =
      "linear-gradient(111.4deg, rgba(238,113,113,1) 1%, rgba(246,215,148,1) 58%)";

    // Fetch and display leaderboard data
    try {
      const r = await axios.get("http://localhost:4000/user/leader-board");
      const leaderBoard = r.data.map((user) => ({
        username: user.username,
        totalAmount: user.totalExpense,
      }));

      // Generate HTML for leaderboard
      let leaderBoardHTML = "";
      leaderBoardHTML = leaderBoard
        .map(
          (user) => `
        <tr>
          <td>${user.username}</td>
          <td>${user.totalAmount || "No expenses"}</td>
        </tr>
      `
        )
        .join("");

      // Update the leaderboard section in the DOM
      document.getElementById("leader-board").innerHTML = `
        <dialog id="modal">
        <button onclick="closeModal()">×</button>
        <h4>Leader Board</h4>
          <table>
            <thead>
              <tr>
                <th>Users</th>
                <th>Expenses</th>
              </tr>
            </thead>
            <tbody id="leader-board-table">
              ${leaderBoardHTML}
            </tbody>
          </table>
        </dialog>
        <button onclick="showLeaderBoard()">Show Leaderboard</button>
      `;
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      // Optionally handle the error, e.g., show an error message to the user
    }
  } else {
    document.getElementById("premiumButton").style.display = "block";
    document.getElementById("leader-board").innerHTML = ""; // Clear leaderboard if not premium
  }
}

function showLeaderBoard() {
  const dialog = document.querySelector("#modal");
  dialog.showModal();
}

function closeModal() {
  const dialog = document.querySelector("#modal");
  dialog.close();
}
