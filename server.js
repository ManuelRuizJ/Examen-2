import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

app.use(cors());
app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).send({ error: "Amount and currency are required" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error al crear el Intento de Pago' });
  }
});

app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
