const Config = require("../config");
const stripe = require("stripe")(Config.STRIPE_SECRET_KEY);

const createCheckoutSession = async ({ mealCount, name, email, poolId }) => {
  const metadata = {
    name,
    email,
    poolId,
  };
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: "Repas",
        description: "Repas",
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
    success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://example.com/cancel",
  });
  return { checkoutSessionId: checkoutSession.id };
};

module.exports = { createCheckoutSession };
