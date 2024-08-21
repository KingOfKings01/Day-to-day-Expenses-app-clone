async function fetchLeaderBoard(token) {
  try {
    const response = await axios.get(
      "http://13.233.70.44/user/leader-board",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        "Failed to fetch leader board. Please try again later."
    );
  }
}

async function fetchDownloadHistory(token) {
  try {
    const response = await axios.get(
      "http://13.233.70.44/user/download-history",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        "Failed to fetch download history. Please try again later."
    );
  }
}

async function fetchReport(token){
  try{
    const response = await axios.get("http://13.233.70.44/expense/download", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.fileUrl;
  } catch(err){
    throw new Error(
      err?.response?.data?.message ||
        "Failed to fetch report. Please try again later."
    );
  }
}