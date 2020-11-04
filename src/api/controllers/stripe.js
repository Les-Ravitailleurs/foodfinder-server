const logger = require("../../logger");
const ServicePayment = require("../../service/payment");
const ServiceDonation = require("../../service/donation");

const webhook = async (req, res) => {
  try {
    const event = ServicePayment.getStripeEvent(req);
    const { type, data } = event;
    if (type !== "payment_intent.succeeded") return res.send({});
    const { object: checkoutObject } = data;
    await ServiceDonation.createDonation(checkoutObject);
    res.send({});
  } catch (e) {
    console.log(e);
    logger.error("[STRIPE WEBHOOK] Wrong signature");
    res.status(500).send({ message: "Invalid signature" });
  }
};

module.exports = { webhook };
