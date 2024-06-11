const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51PNSeXP24BpMsZsrtRnAovm8Lw1epPUnLOl42RWuArST9lJymHbwDfHYB1p6HcYfdrxMvHlvifu4Zu9V9LAfFOuE00KzCO5CEg"
);
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors({origin: "http://localhost:3001"}));

app.get("/", (req, res) => {
  res.send("It is getting connected.");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("product", product);
  console.log("price", product.price);

  const idempotencyKey = uuidv4();

  const shippingAddress = token.card && token.card.address_line1 && {
    name: token.card.name,
    address: {
      line1: token.card.address_line1,
      line2: token.card.address_line2 || '',
      city: token.card.address_city || '',
      state: token.card.address_state || '',
      postal_code: token.card.address_zip || '',
      country: token.card.address_country || '',
    },
  };

  if (!shippingAddress) {
    return res.status(400).send("Missing shipping address information.");
  }

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create({
        amount: product.price * 100,
        currency: 'usd',
        customer : customer.id,
        receipt_email: token.email,
        description: `Your purchase of ${product.name}`,
        shipping: shippingAddress,
      }, { idempotencyKey })
    })
    .then((result) => res.status(200).json(result))
    .catch(err => console.log("error", err))
});

app.listen(8282, () => console.log("LISTENING TO PORT"));
