function PremiumHandler(isPremium){
    if(isPremium){
        fetchModalTable()
    }
}

const modalHtml = (title, heads, rows) => {
  // Generate HTML for table headers
  const headsHtml = heads.map((head) => `<th>${head}</th>`).join("");

  // Generate HTML for table rows
  const rowsHtml = rows
    .map(
      (row) => `
    <tr>
      ${Object.values(row)
        .map((cell) => `<td>${cell || "No data"}</td>`)
        .join("")}
    </tr>
  `
    )
    .join("");

  return `
    <dialog id="modal">
      <button onclick="closeModal()">×</button>
      <h4>${title}</h4>
      <table>
        <thead>
          <tr>
            ${headsHtml}
          </tr>
        </thead>
        <tbody id="leader-board-table">
          ${rowsHtml}
        </tbody>
      </table>
    </dialog>
  `;
};

async function fetchModalTable() {
  // Fetch and display leaderboard data
  try {
    const res = await axios.get("http://localhost:4000/user/leader-board");
    const leaderBoard = res.data.map((user) => ({
      username: user.username,
      totalExpense: user.totalExpense,
    }));

    // Update the leaderboard section in the DOM

    const heads = ["User", "Total Expense"];
    const btn1Parameters = `Leader Board, ${heads}, ${leaderBoard}`;
    const leaderBoardHtml = modalHtml(btn1Parameters)

    document.getElementById("leaderboard").innerHTML = leaderBoardHtml

  } catch (error) {
    console.error("Error fetching leader board data:", error);
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
