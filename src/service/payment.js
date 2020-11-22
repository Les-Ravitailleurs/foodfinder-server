const Config = require("../config");
const stripe = require("stripe")(Config.STRIPE_SECRET_KEY);
const uuid = require("uuid");

const createCheckoutSession = async ({
  mealCount,
  name,
  email,
  poolId,
  donatorName,
  donatorAddress,
  hideDonatorName,
  volunteerId,
}) => {
  const taxReceiptId = uuid.v4();
  const metadata = {
    name,
    email,
    poolId,
    donatorName,
    mealCount,
    donatorAddress,
    hideDonatorName,
    taxReceiptId,
    volunteerId,
  };
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: `${mealCount} repas offerts - Les Ravitailleurs`,
        amount: Config.MEAL_PRICE * 100 * mealCount,
        currency: "EUR",
        quantity: 1,
      },
    ],
    customer_email: email,
    client_reference_id: email,
    metadata,
    payment_intent_data: {
      metadata,
    },
    success_url: `${Config.BASE_URL}/collecte/merci/${mealCount}?taxReceipt=${taxReceiptId}`,
    cancel_url: `${Config.BASE_URL}/collecte/`,
    submit_type: "donate",
  });
  return { checkoutSessionId: checkoutSession.id };
};

const getStripeEvent = (request) => {
  const sig = request.headers["stripe-signature"];
  return stripe.webhooks.constructEvent(
    request.body,
    sig,
    Config.STRIPE_WEBHOOK_KEY
  );
};

module.exports = { createCheckoutSession, getStripeEvent };
