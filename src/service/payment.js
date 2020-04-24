const Config = require("../config");
const stripe = require("stripe")(Config.STRIPE_SECRET_KEY);

const createCheckoutSession = async ({
  mealCount,
  name,
  email,
  poolId,
  donatorName,
}) => {
  const metadata = {
    name,
    email,
    poolId,
    donatorName,
    mealCount,
  };
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: `${mealCount} repas offerts - Les Ravitailleurs`,
        amount: Config.MEAL_PRICE * 100 * mealCount,
        currency: "EUR",
        quantity: 1,
        description:
          "Votre paiement va directement à notre partenaire Frichti, qui nous met à disposition les produits, sans marge évidemment.",
        images: [
          "https://lesravitailleurs.s3.eu-west-3.amazonaws.com/stripeRavitailleursXFrichti.jpg",
        ],
      },
    ],
    customer_email: email,
    client_reference_id: email,
    metadata,
    payment_intent_data: {
      metadata,
    },
    success_url: `${Config.BASE_URL}/collecte/${poolId}/merci/${mealCount}`,
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
