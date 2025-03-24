const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const stripe = Stripe("sk_test_51R5skGGYABQw6E1f9QbbUNrAJJOn9cXt4cjjJ3pUaKNLHwDKXl4ziuyL1yrBRUCkiiKpYDX1Knt3v5d1sx68Ljuz001eSEZ7gM"); // Use ENV variable

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/fk", (req, res) => {
  res.status(200).json({ message: "Backend is working fine!" });
});

// ✅ Export for Vercel
module.exports = app;

// ✅ Start server locally when running `node server.js`
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
