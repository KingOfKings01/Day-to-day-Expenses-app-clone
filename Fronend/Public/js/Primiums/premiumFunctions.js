function PremiumHandler(isPremium) {
  if (!isPremium) return;
  document.querySelector(
    "#modal-board"
  ).innerHTML = ` <button class="btn btn-first" onclick="showLeaderBoard()">Show Leader board</button>
    <button class="btn btn-second" onclick="downloadReportBoard()">Download Report</button>`;
}

const modalHtml = (title, heads, rows, btn = "") => {
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
  <div class="modal">
    <dialog id="modal">
      <button class="close-btn" onclick="closeModal()">×</button>
      ${btn}
      <h4>${title}</h4>
      <div class="modal-table">
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
      </div>
    </dialog>
  </div>
  `;
};

async function fetchModalTable() {
  // Fetch and display leaderboard data
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const res = await fetchLeaderBoard(token);

    const leaderBoard = res.map((user) => ({
      username: user.username,
      totalExpense: user.totalExpense,
    }));

    // Update the leader board section in the DOM

    const heads = ["User", "Total Expense"];
    const leaderBoardModal = modalHtml("Leader Board", heads, leaderBoard);

    document.querySelector("#modal-table").innerHTML = leaderBoardModal;
  } catch (err) {
    messenger(err.message, false);
  }
}

async function showLeaderBoard() {
  await fetchModalTable();
  const dialog = document.querySelector("#modal");
  dialog.showModal();
}

function closeModal() {
  const dialog = document.querySelector("#modal");
  dialog.close();
}

async function downloadReportBoard() {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const files = await fetchDownloadHistory(token);
    files.forEach((file) => {
      file.url = `<a class="btn btn-download" href="${file.url}" download>Download</a>`;
    });
    const heads = ["Filename", "Date", "Download"];

    const btn = `<button class="btn btn-download" onclick="downloadReport()">New Report</button>`;

    let modal = modalHtml("Download history", heads, files, btn);

    document.querySelector("#modal-table").innerHTML = modal;

    const dialog = document.querySelector("#modal");
    dialog.showModal();
  } catch (err) {
    messenger(err.message, false);
  }
}

async function downloadReport() {
  try{
    const token = JSON.parse(localStorage.getItem("token"));
    const fileUrl = await fetchReport(token);
    const a = document.createElement("a");
    a.href = fileUrl;
    a.click(); // download report
    
    closeModal() // close modal
  } catch (err) {
    console.log(err);
    messenger(err.message, false);
  }
}
