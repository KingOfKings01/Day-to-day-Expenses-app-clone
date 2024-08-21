async function buyPremium() {
  const premiumPurchase = new PremiumPurchase();
  await premiumPurchase.buyPremium();
}
class PremiumPurchase {
  constructor() {
    this.token = JSON.parse(localStorage.getItem("token"));
  }

  async buyPremium() {
    try {
      const { user, order,orderInfo } = await this.initiatePayment();
      this.createRazorpayOrder(user, order, orderInfo);
    } catch (err) {
      this.showMessage("Something want wrong! Please try again later.", false);
    }
  }

  async initiatePayment() {
    return await Buy(this.token); //* API call
  }

  createRazorpayOrder(user, order, orderInfo) {
    const options = this.getRazorpayOptions(user, order, orderInfo);
    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  getRazorpayOptions(user, order, orderInfo) {
    return {
      key: user.key_id,
      amount: order.amount,
      currency: order.currency,
      name: orderInfo.name,
      description: orderInfo.description,
      image: orderInfo.image,
      order_id: order.id,
      handler: this.paymentSuccessHandler.bind(this, order.id),
      prefill: {
        name: user.username,
        email: user.email,
        contact: user.contact,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: this.paymentFailureHandler.bind(this, order.id),
      },
    };
  }

  async paymentSuccessHandler(orderId, response) {
    this.showMessage("Payment Successful", true);
    const data = { order_id: orderId, status: "successful" };
    await this.handleOrder(data);
    this.setPremiumUser(true);
  }

  async paymentFailureHandler(orderId) {
    const data = { order_id: orderId, status: "failed" };
    await this.handleOrder(data);
    this.showMessage("Transaction failed", false);
  }

  async handleOrder(data) {
    await orderHandler(data, this.token); //* API call
  }

  setPremiumUser(isPremium) {
    premiumButton(isPremium);
  }

  showMessage(message, success) {
    messenger(message, success);
  }
}
