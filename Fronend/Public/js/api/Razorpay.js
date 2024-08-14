async function pay(token) {
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
  } catch (err) {
    throw new Error("Failed to buy premium. Please try again later.");
  }
}

async function order(data) {
  try {
    await axios.post("http://localhost:4000/user/update-order", data);
  } catch (err) {
    throw new Error("Failed to update order. Please try again later.");
  }
}
