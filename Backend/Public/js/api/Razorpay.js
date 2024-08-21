async function Buy(token) {
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
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(
      err?.data?.message || "Failed to buy premium. Please try again later."
    );
  }
}

async function orderHandler(data, token) {
  try {
    await axios.post("http://localhost:4000/user/update-order", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new Error(
       "Failed to update order. Please try again later."
    );
  }
}
