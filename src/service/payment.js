const { nanoid } = require("nanoid");
const Config = require("../config");
const stripe = require("stripe")(Config.STRIPE_SECRET_KEY);

const createCheckoutSession = async ({ mealCount, name, email, poolId }) => {
  const metadata = {
    name,
    email,
    poolId,
    donationId: nanoid(),
    mealCount,
  };
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: "Donation Repas - Les Ravitailleurs",
        amount: Config.MEAL_PRICE * 100,
        currency: "EUR",
        quantity: mealCount,
      },
    ],
    customer_email: email,
    client_reference_id: email,
    metadata,
    payment_intent_data: {
      metadata,
    },
    success_url: `${Config.BASE_URL}/collecte/${poolId}/merci/${metadata.donationId}`,
    cancel_url: `${Config.BASE_URL}/collecte/${poolId}`,
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
