const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
require("dotenv").config(); 

const app = express();
app.use(cors());
app.use(express.json());

const stripe = Stripe("sk_test_51R64TNP6W0yfsGrVZvDqMIiUpBCyfRJ1uE35EA8NAxxltV2ZuEx59VN8T87tlii4GGd3e5YJwNu26ZrXXmostj7Y00jmHsiwRq"); // Use ENV variable

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
