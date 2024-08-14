
async function buyPremium(){
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
      messenger("Error creating order", false);
    }
  };