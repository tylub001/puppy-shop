const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.delete("/user-orders/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log("Attempting to delete order:", id, "for user:", req.user.id);
  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Order not found or not authorized" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  const { email, userId, puppyName, amount } = req.body;

  try {
    // Create Stripe customer
    const customer = await stripe.customers.create({ email });

    // Create Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: puppyName },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000/cancel",
    });

    // Save customer ID to user
    await pool.query("UPDATE users SET stripe_customer_id = $1 WHERE id = $2", [
      customer.id,
      userId,
    ]);

    res.json({ id: session.id });
  } catch (err) {
    console.error("❌ Error creating checkout session:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

app.post("/save-card", authenticateToken, async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );
    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntent.payment_method
    );

    const { brand, last4, exp_month, exp_year } = paymentMethod.card;

    await pool.query(
      `UPDATE users SET payment_method_id = $1, card_last4 = $2, card_brand = $3, card_exp_month = $4, card_exp_year = $5 WHERE stripe_customer_id = $6`,
      [paymentMethod.id, last4, brand, exp_month, exp_year, session.customer]
    );

    res.json({ message: "Card info saved successfully" });
  } catch (err) {
    console.error("❌ Error saving card info:", err);
    res.status(500).json({ error: "Failed to save card info" });
  }
});

app.get("/users", async (req, res) => {
  console.log("GET /users hit");
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post("/login", async (req, res) => {
  console.log("Login route hit");
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.get("/profile", authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.user.id,
  ]);
  res.json({ profile: result.rows[0] });
});

app.post("/purchase", authenticateToken, async (req, res) => {
  const { userId, puppyId, quantity } = req.body;

  try {
    // Get puppy price
    const puppyResult = await pool.query(
      "SELECT price FROM puppies WHERE id = $1",
      [puppyId]
    );
    const price = puppyResult.rows[0]?.price;
    if (!price) throw new Error("Puppy not found");

    const totalPrice = price * quantity;

    // Insert order with total_price
    const result = await pool.query(
      "INSERT INTO orders (user_id, puppy_id, quantity, total_price) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, puppyId, quantity, totalPrice]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Failed to record purchase:", err);
    res.status(500).json({ error: "Failed to record purchase" });
  }
});

app.get("/user-orders", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching orders for user:", req.user.id);

    const result = await pool.query(
      `
      SELECT o.id AS order_id, o.quantity, o.total_price, o.order_date,
             p.id AS puppy_id, p.name AS puppy_name, p.price
      FROM orders o
      JOIN puppies p ON o.puppy_id = p.id
      WHERE o.user_id = $1
      ORDER BY o.order_date DESC
    `,
      [req.user.id]
    );

    console.log("Orders fetched:", result.rows);
    res.json({ orders: result.rows });
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
